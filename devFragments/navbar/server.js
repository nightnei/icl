'use strict';

const express = require('express');

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const {default: App} = require('./build/server');
const PORT = 9235;

const server = express();


server.use((req, res, next) => {
    if (req.headers['x-request-uri'] !== undefined) {
        req.url = req.headers['x-request-uri'];
    }

    next();
});

server.get('*', (req, res) => {
    res.setHeader("Content-Type", "text/html");

    const html = ReactDOMServer.renderToString(App(req.url));
    res.send(html);

});

const port = PORT || 3000;

server.listen(port, () => {
    console.log(`Navbar server started at port ${port}`);
});
