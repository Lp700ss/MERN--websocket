const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000');

ws.on('open', () => {
    console.log('WebSocket connection established');

    // Send a message to request quotes
    const message = {
        endpoint: '/quotes'
    };
    ws.send(JSON.stringify(message));
});

ws.on('message', async (data) => {
    const parsedData = JSON.parse(data);
    console.log('Received message:', parsedData);

    if (parsedData.endpoint === '/quotes') {
        // Request average
        const averageMessage = {
            endpoint: '/average'
        };
        ws.send(JSON.stringify(averageMessage));
    } else if (parsedData.endpoint === '/average') {
        // Request slippage
        const slippageMessage = {
            endpoint: '/slippage'
        };
        ws.send(JSON.stringify(slippageMessage));
    } else if (parsedData.endpoint === '/slippage') {
        // Close the WebSocket connection after receiving the final response
        ws.close();
    }
});

ws.on('close', () => {
    console.log('WebSocket connection closed');
});
