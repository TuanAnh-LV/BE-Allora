require('dotenv').config();
const app = require('./app');
const http = require('http');
const setupChatSocket = require('./sockets/chat.sockets');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

setupChatSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
