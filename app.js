const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

// on client connection
io.on('connection', socket=> {
    console.log("New Connection made");

    // message to single client/ client making the connection
    socket.emit('message', 'welcome to Firefirst');

    // broadcast a user connection to everyone except the client making the connection
    socket.broadcast.emit('message', 'Someone hoped into the server');

    //message to everyone
    // io.emit('message', 'Someone entered the chat room');
    socket.on('disconnect', ()=>{
        io.emit('message', 'someone left the chat room');
    });

    // catching message in the server
    socket.on('chatMsg', message=>{
        // console.log(message);
        io.emit('message', message);
    })
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, ()=> console.log(`Server runing in port ${PORT}`));