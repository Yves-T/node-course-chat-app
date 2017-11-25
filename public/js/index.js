const socket = io();
const form = document.querySelector('#message-form');
const inputMessage = document.querySelector('[name=message]');
const messages = document.querySelector('#messages');

socket.on('connect', () => {
  console.log('connected to server');
});

socket.on('disconnect', () => {
  console.log('disconnected from the server');
});

socket.on('newMessage', message => {
  console.log('new message', message);
  const li = document.createElement('li');
  const newContent = document.createTextNode(
    `${message.from} : ${message.text}`,
  );
  li.appendChild(newContent);
  messages.appendChild(li);
});

// jQuery('#message-form').on('submit', e => {
//   e.preventDefault();
// });

const formSubmit$ = Rx.Observable.fromEvent(form, 'submit');
formSubmit$.subscribe(e => {
  e.preventDefault();
  console.log('submitted', e);
  console.log('submitted', inputMessage.value);
  socket.emit(
    'createMessage',
    {
      from: 'User',
      text: inputMessage.value,
    },
    () => {},
  );
});
