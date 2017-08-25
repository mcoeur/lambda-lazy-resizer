'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3({signatureVersion: 'v4',});
const Sharp = require('sharp');
const mime = require('mime-types');

const BUCKET = process.env.BUCKET;
const URL = process.env.URL;
const WHITELIST = {
    FORMATS : (process.env.WHITELISTED_FORMATS || "").split('|'),
    SIZES : (process.env.WHITELISTED_SIZES || "").split('|')
};

exports.handler = function(event, context, callback) {
    const key = event.pathParameters.fileName;

    if (!/^(\d+)?x?(\d+)\/[a-z0-9-]+\.[a-z]+$/.test(key))
        return callback(null, {statusCode: '400', body: 'Forbidden file'});

    const [sizes, originalKey] = key.split('/');
    const format = originalKey.split('.').pop();

    if (WHITELIST.FORMATS.indexOf(format) === -1)
        return callback(null, {statusCode: '400', body: 'Forbidden format'});
    if (WHITELIST.SIZES.indexOf(sizes) === -1)
        return callback(null, {statusCode: '400', body: 'Forbidden size'});

    var width = null;
    var height = null;
    const x = sizes.indexOf('x');
    if (x === -1) {
        width = parseInt(sizes);
    } else if (x === 0){
        height = parseInt(sizes.replace('x', ''));
    } else {
        [ width, height ] = sizes.split('x').map( n => parseInt(n) );
    }

    S3.getObject({Bucket: BUCKET, Key: originalKey}).promise()
        .then(data => Sharp(data.Body)
        .resize(width, height)
        .toFormat(format)
        .toBuffer()
    )
    .then(buffer => S3.putObject({
            Body: buffer,
            Bucket: BUCKET,
            ContentType: mime.lookup(format),
            ACL: 'public-read',
            Key: key,
        }).promise()
    )
    .then(() => callback(null, {
            statusCode: '301',
            headers: {'location': `${URL}/${key}`},
            body: '',
        })
    )
    .catch(err => {
	console.log('error :', JSON.stringify(err));
        return callback(null, {statusCode: '500', body: 'Internal error'});
    });
};
