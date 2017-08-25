'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const { handler } = require('./index');

app.get('/resize/:id', function (req, res) {
    const event = {
        queryStringParameters : {
            key: req.params.id.replace('_', '/')
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