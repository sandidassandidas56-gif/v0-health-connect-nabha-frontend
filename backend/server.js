
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
require('./db'); // Connect to MongoDB Atlas

app.use(express.json());
app.use('/api/auth/signup', require('./api/auth/signup'));
app.use('/api/auth/login', require('./api/auth/login'));
app.use('/api/doctors', require('./api/doctors'));

// Add your signaling server code here if needed
// Example:
// const http = require('http').createServer(app);
// const { Server } = require('socket.io');
// const io = new Server(http);
// io.on('connection', (socket) => { /* ... */ });
// http.listen(5000, () => console.log('Server running on port 5000'));

app.listen(5001, () => console.log('Server running on port 5001'));
