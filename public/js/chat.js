const socket = io();
const form = document.querySelector('#message-form');
const inputMessage = document.querySelector('[name=message]');
const messages = document.querySelector('#messages');
const locationBtn = document.querySelector('#send-location');
const template = document.querySelector('#message-template');
const locationTemplate = document.querySelector('#location-message-template');
const usersElement = document.querySelector('#users');

function deparam() {
  const urlParams = new URLSearchParams(window.location.search);
  const params = {};
  const entries = Array.from(urlParams.entries());
  entries.forEach(pair => {
    const [key, value] = pair;
    params[key] = value;
  });

  return params;
}

function getHeightOfElementNode(someNode) {
  const style = window.getComputedStyle(someNode, null);
  const heightAsString = style.getPropertyValue('height');
  const heightAsArrayOfNumbers = heightAsString.match(/\d+/g);
  return heightAsArrayOfNumbers ? parseInt(heightAsArrayOfNumbers[0], 10) : 0;
}

function getHeightOfTextNode(textNode) {
  let height = 0;
  if (document.createRange) {
    const range = document.createRange();
    range.selectNodeContents(textNode);
    if (range.getBoundingClientRect) {
      const rect = range.getBoundingClientRect();
      if (rect) {
        height = rect.bottom - rect.top;
      }
    }
  }
  return height;
}

function getHeight(someNode) {
  if (!someNode) {
    return 0;
  }

  if (someNode.nodeType === Node.TEXT_NODE) {
    return getHeightOfTextNode(someNode);
  }
  return getHeightOfElementNode(someNode);
}

function scrollToBottom() {
  // heights
  const { clientHeight, scrollTop, scrollHeight } = messages;
  const newMessage = document.querySelector('li:last-child');
  const newMessageHeight = getHeight(newMessage);
  const previousMessage = newMessage.previousSibling;
  const previousMessageHeight = getHeight(previousMessage);

  if (
    clientHeight + scrollTop + newMessageHeight + previousMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop = scrollHeight;
  }
}

function appendMessage(html) {
  const liElement = document.createElement('li');
  liElement.setAttribute('class', 'message');
  liElement.innerHTML = html;
  messages.appendChild(liElement);
  scrollToBottom();
}

socket.on('connect', () => {
  console.log('connected to server');
  const params = deparam();
  console.log('params', params);
  socket.emit('join', params, error => {
    if (error) {
      alert(error);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

socket.on('updateUserList', users => {
  console.log('users list', users);
});

socket.on('disconnect', () => {
  console.log('disconnected from the server');
});

socket.on('updateUserList', users => {
  const ol = document.createElement('ol');
  // usersElement.innerHTML = '';
  while (usersElement.firstChild) {
    usersElement.removeChild(usersElement.firstChild);
  }
  users.forEach(user => {
    const li = document.createElement('li');
    li.innerHTML = user;
    ol.appendChild(li);
  });
  usersElement.appendChild(ol);
});

socket.on('newMessage', message => {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const html = Mustache.render(template.innerHTML, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime,
  });

  appendMessage(html);
});

socket.on('newLocationMessage', message => {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const html = Mustache.render(locationTemplate.innerHTML, {
    from: message.from,
    createdAt: formattedTime,
    url: message.url,
  });
  appendMessage(html);
});

const formSubmit$ = Rx.Observable.fromEvent(form, 'submit');
formSubmit$.subscribe(e => {
  e.preventDefault();
  console.log('submitted', e);
  console.log('submitted', inputMessage.value);
  socket.emit(
    'createMessage',
    {
      text: inputMessage.value,
    },
    () => {
      inputMessage.value = '';
    },
  );
});

const locationClicked$ = Rx.Observable.fromEvent(locationBtn, 'click');
locationClicked$.subscribe(e => {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }
  locationBtn.setAttribute('disabled', 'disabled');
  locationBtn.innerHTML = 'Sending location...';

  navigator.geolocation.getCurrentPosition(
    position => {
      locationBtn.removeAttribute('disabled');
      locationBtn.innerHTML = 'Send location';
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    () => {
      locationBtn.removeAttribute('disabled');
      alert('Unable to fetch location');
    },
  );
});
