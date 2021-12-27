const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const menuToggler = document.querySelector('.menu-toggle');
const chatSidebar = document.querySelector('.chat-sidebar');
const socket = io();

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

    menuToggler.classList.toggle('fa-chevron-circle-down');
    menuToggler.classList.toggle('fa-chevron-up')
})

// auto adding and removing of offcanvas sidebar based on window size
window.addEventListener('resize', ()=> {
    if(document.documentElement.clientWidth > 700){
        chatSidebar.classList.remove('offcanvas');
        if(!chatSidebar.classList.contains('chat-sidebar')){
            chatSidebar.classList.toggle('chat-sidebar');
        }
        menuToggler.classList.add('fa-chevron-circle-down');
        menuToggler.classList.remove('fa-chevron-up')
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
    <p class="meta">Brad <span>9:12pm</span></p>
    <p class="text">
        ${message}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
    chatForm.reset();
    chatForm.focus();
}