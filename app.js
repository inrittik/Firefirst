const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utilities/formatMessage');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

// on client connection
io.on('connection', socket=> {
    console.log("New Connection made");

    // message to single client/ client making the connection
    socket.emit('message', formatMessage('Fire Bot', 'Welcome to Firefirst'));

    // broadcast a user connection to everyone except the client making the connection
    socket.broadcast.emit('message', formatMessage('Fire Bot', 'Someone hoped into the server'));

    //message to everyone
    // io.emit('message', 'Someone entered the chat room');
    socket.on('disconnect', ()=>{
        io.emit('message', formatMessage('Fire Bot', 'Someone left  the server'));
    });

    // catching message in the server
    socket.on('chatMsg', message=>{
        // console.log(message);
        io.emit('message',formatMessage('User', message));
    })
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, ()=> console.log(`Server runing in port ${PORT}`));