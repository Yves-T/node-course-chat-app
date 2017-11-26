const socket = io();
const form = document.querySelector('#message-form');
const inputMessage = document.querySelector('[name=message]');
const messages = document.querySelector('#messages');
const locationBtn = document.querySelector('#send-location');

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

socket.on('newLocationMessage', message => {
  const li = document.createElement('li');
  const aTag = document.createElement('a');
  aTag.setAttribute('href', message.url);
  aTag.setAttribute('target', '_blank');
  aTag.innerHTML = 'My current location';
  const newContent = document.createTextNode(`${message.from}: `);
  li.appendChild(newContent);
  li.appendChild(aTag);
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

const locationClicked$ = Rx.Observable.fromEvent(locationBtn, 'click');
locationClicked$.subscribe(e => {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }
  navigator.geolocation.getCurrentPosition(
    position => {
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    () => alert('Unable to fetch location'),
  );
});
