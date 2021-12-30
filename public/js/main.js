const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const menuToggler = document.querySelector('.menu-toggle-down');
const chatSidebar = document.querySelector('.chat-sidebar');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const typingBox = document.querySelector('.typing');
const socket = io();

const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true} );
console.log(username, room);

// join room
socket.emit('joinRoom', { username, room });

// get user and room info
socket.on('roomUsers', ({ room, users })=> {
    console.log(room, users);
    roomName.innerText = room;

    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}`
})

// catching message on the frontend
socket.on('message', message =>{
    console.log(message);
    displayMessage(message);

    // scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// listens for click event on menuToggler button
menuToggler.addEventListener('click', ()=> {
    chatSidebar.classList.toggle('chat-sidebar');
    chatSidebar.classList.toggle('offcanvas');

    menuToggler.classList.toggle('menu-toggle-down');
    menuToggler.classList.toggle('menu-toggle-up')
})

// auto adding and removing of offcanvas sidebar based on window size
window.addEventListener('resize', ()=> {
    if(document.documentElement.clientWidth > 700){
        chatSidebar.classList.remove('offcanvas');
        if(!chatSidebar.classList.contains('chat-sidebar')){
            chatSidebar.classList.toggle('chat-sidebar');
        }
        menuToggler.classList.add('menu-toggle-down');
        menuToggler.classList.remove('menu-toggle-up')
    }
})

// emit message to everyone
chatForm.addEventListener('submit', (e)=> {
    e.preventDefault();

    const message = e.target.elements.msg.value;
    // console.log(msg);
    // emit message to server
    socket.emit('chatMsg', message);
})

function displayMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.message}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
    chatForm.reset();
    chatForm.focus();
}

let typing = false;
let timeout = undefined;

const typingTimeout = ()=> {
    typing = false;
    socket.emit('typeStatus', {username, message: ''});
};

chatForm.addEventListener('keypress', ()=>{
    if(typing==false){
        typing = true;
        socket.emit('typeStatus', {username, message: 'Typing...'});
        timeout = setTimeout(typingTimeout, 2000);
    }
    else {
        clearTimeout(timeout);
        timeout = setTimeout(typingTimeout, 2000);
    }
})

socket.on('typeStatus', message=>{
    if(message=='') typingBox.textContent = '';
    else typingBox.textContent = message;
})