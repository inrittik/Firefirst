const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utilities/formatMessage');
const { userJoin, currentUser, userLeave, getRoomUsers } = require('./utilities/users');

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));

const io = socketio(server);
// on client connection
io.on('connection', socket=> {
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // message to single client/ client making the connection
        socket.emit('message', formatMessage('Fire Bot', `Welcome to Firefirst #${user.room}, ${user.username}!`));

        // broadcast a user connection to everyone except the client making the connection
        socket.broadcast.to(user.room).emit('message', formatMessage('Fire Bot', `${user.username} hoped into the server`));

        // room and user info to frontend
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    })


    // catching message in the server
    socket.on('chatMsg', message=>{
        const user = currentUser(socket.id);
        // console.log(message);
        io.to(user.room).emit('message',formatMessage(user.username, message));
    })

    socket.on('typeStatus', ({username, message})=>{
        const user = currentUser(socket.id);
        if(!message==''){
            socket.broadcast.to(user.room).emit('typeStatus', `${username} is ${message}`);
        }
        else{
            socket.broadcast.to(user.room).emit('typeStatus', '');
        }
    })

    socket.on('disconnect', ()=>{
        const user = userLeave(socket.id);
        // const user = currentUser(socket.id);
        if(user){
            io.to(user.room).emit('message', formatMessage('Fire Bot', `${user.username} has left  the server`));
            // room and user info to frontend
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, ()=> console.log(`Server runing in port ${PORT}`));