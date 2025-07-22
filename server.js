require('dotenv').config();
const app = require('./app');
const http = require('http');

const socketIO = require('./sockets'); 
const notify = require('./utils/notify'); 

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = socketIO.init(server);
notify.setSocketIO(io); 

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
