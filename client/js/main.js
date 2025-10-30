const socket = io('http://localhost:3002');

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit('joinRoom', { username, room });

// receiving incoming messages from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // scroll down after receiving message
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  // submitting form automatically submits a file.
  // Stop the file from submitting
  // prevents default behavior
  e.preventDefault();

  // Get message from the id of msg
  const msg = e.target.elements.msg.value;

  // sends msg to server from client
  socket.emit('chatMessage', msg);

  console.log(username, room);

  // clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
            <p class="text">
                ${message.text}
            </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}
