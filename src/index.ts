import { WebSocketServer, WebSocket } from 'ws';

const connections: Map<string, WebSocket> = new Map();
const messages: string[] = [];

const wss = new WebSocketServer({ port: 8080 });

function emitMessage(msg: string) {
    messages.push(msg);
    for (const [_, ws] of connections) {
        ws.send(JSON.stringify([msg]));
    }
}

wss.on('connection', (ws, req) => {
    connections.set(req.socket.remoteAddress as string, ws);
    ws.send(JSON.stringify(messages));

    ws.on('error', console.error);

    ws.on('message', (msg) => {
        emitMessage(msg.toString());
    });

    ws.send('Welcome to ts chat');

    ws.on('close', () => {
        ws.send('Bye');
        connections.delete(req.socket.remoteAddress as string);
    });
});
