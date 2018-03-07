const WebSocket = require('ws');
const http = require('http');

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


http.createServer((req, res) => {
    console.log('req coming');
    res.write('ok');
    res.end();

    if (webSocket) {
        webSocket.send('hack');
    }
}).listen(9000);
