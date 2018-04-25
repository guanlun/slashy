const WebSocket = require('ws');
const express = require('express');
const bodyParser = require("body-parser");

const ws = new WebSocket.Server({ port: 9001 });

let webSocket = undefined;

ws.on('connection', socket => {
    console.log('connected!!!');

    webSocket = socket;

    socket.on('close', () => {
        console.log('closed');
    });

    socket.on('error', () => {
        console.log('error');
    });
});

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('ok');

    if (webSocket) {
        webSocket.send(req.param('action'));
    }
});

app.listen(9000);

// http.createServer((req, res) => {
//     console.log('req coming', req.body);
//     res.write('ok');
//     res.end();

//     if (webSocket) {
//         webSocket.send('hack');
//     }
// }).listen(9000);
