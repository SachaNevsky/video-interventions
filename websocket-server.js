const WebSocket = require('ws');
require('dotenv').config();

const server = new WebSocket.Server({ port: 8080 });
const websocketIP = process.env.NEXT_PUBLIC_WS_IP;

server.on('connection', (socket) => {
  socket.on('message', (message) => {
    // Broadcast message to all connected clients
    server.clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
        console.log(message.toString())
      }
    });
  });
});

// var os = require('os');
// let networkInterfaces = os.networkInterfaces();
// let ipv4 = networkInterfaces.Ethernet.find((i) => i.family === "IPv4").address;

console.log("IPv4 Ethernet address:", websocketIP)
console.log(`WebSocket server is running on ws://${websocketIP}:8080`);