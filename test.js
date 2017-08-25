'use strict';

// Run this file to test the lambda function locally
// Navigate to localhost:3000/:size/:fileName (eg. localhost:3000/800x600/cats.png)

require('dotenv').config();
const express = require('express');
const app = express();
const { handler } = require('./index');

app.get('/:size/:fileName', function (req, res) {
    const event = {
        pathParameters : {
            fileName: req.params.size+'/'+req.params.fileName
        }
    };
    handler(event, {}, (err, data) => {
        if (err) {
            console.error(err);
            res.set(err.headers || {}).status(err.statusCode).send(err.message);
        } else {
            res.set(data.headers || {}).status(data.statusCode).send(data.body);
        }
    });
});

app.listen(3000, function () {
    console.log('Local dev app listening on port 3000!');
});