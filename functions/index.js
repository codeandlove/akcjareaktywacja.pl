const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require("express");
const cors = require("cors");

cors({
    origin: true
});

//admin.initializeApp(functions.config().firebase);

/* Express */
const app = express();

app.enable('trust proxy');

app.use(cors());

app.get("*", (request, response) => {

    response.send(request.ip);
});

const get_ip = functions.https.onRequest((request, response) => {
    if (!request.path) {
        request.url = `/${request.url}` // prepend '/' to keep query params if any
    }
    return app(request, response)
});

module.exports = {
    get_ip
};
