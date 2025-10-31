const socket = io('http://localhost:3002');

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// join chatroom
socket.emit('joinRoom', { username, room });

// get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  console.log('Users' + JSON.stringify(users));
  outputUsers(users);
});
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

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = `
    ${users.map((user) => `<li>${user.username}<li>`).join('')}
  `;
  console.log(
    '!!' +
      `
    ${users.map((user) => `<li>${user.username}<li>`).join('')}
  `
  );
}
