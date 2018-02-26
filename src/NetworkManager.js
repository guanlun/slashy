const wsAddr = `ws://${Config.WS_SERVER_IP}:${Config.WS_SERVER_PORT}`;

const wsConn = new WebSocket(wsAddr);
wsConn.onopen = _ => {
    console.log('connected to ws server');
}

const indicator = document.querySelector('#main')

wsConn.onmessage = msg => {
    console.log(msg)
    if (msg.data === 'hack') {
        currAction = 'attack';
    }
}

wsConn.onerror = () => {
    console.log('error')
}