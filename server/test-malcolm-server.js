const WebSocket = require('ws');
const fs = require('fs');
const dataLoader = require('./loadCannedData');
const subscriptionFeed = require('./subscriptionFeed');

let settings = JSON.parse(fs.readFileSync('./server/server-settings.json'));

let malcolmMessages = dataLoader.loadData('./server/canned_data/');
let subscriptions = [];

const io = new WebSocket.Server({port: 8000});

io.on('connection', function (socket) {
  socket.on('message', message => {
    message = JSON.parse(message);
    handleMessage(socket, message);
  });
  socket.on('disconnect', () => handleDisconnect());
});

const port = 8000;
console.log('listening on port ', port);

function handleMessage(socket, message) {
  let simplifiedMessage = message;
  const originalId = message.id;
  delete simplifiedMessage.id;
  console.log(message);
  if (simplifiedMessage.typeid.indexOf('Unsubscribe') > -1) {
    handleUnsubscribe(socket, originalId);

  } else if(malcolmMessages.hasOwnProperty(JSON.stringify(simplifiedMessage))){
    if (simplifiedMessage.typeid.indexOf('Subscribe') > -1) {
      subscriptions.push(originalId.toString());
    }

    let response = Object.assign({id: originalId}, malcolmMessages[JSON.stringify(simplifiedMessage)]);
    subscriptionFeed.checkForActiveSubscription(simplifiedMessage, response, r => sendResponse(socket, r))
    sendResponse(socket, response);

  } else {
    sendResponse(socket, buildErrorMessage(originalId, message));
  }
}

function sendResponse(socket, message) {
  setTimeout(() => {
    socket.send(JSON.stringify(message))
  }, Math.ceil(settings.delay*Math.random()));
}

function handleDisconnect() {
  console.log('client disconnected');
  subscriptionFeed.cancelAllSubscriptions();
}

function buildErrorMessage(id, message) {
  const errorResponse = {
    typeid: 'malcolm:core/Error:1.0',
    id,
    message: 'There was no canned response to the message: ' + JSON.stringify(message)
  };
  return errorResponse;
}

function buildReturnMessage(id, value) {
  const response = {
    typeid: 'malcolm:core/Return:1.0',
    id,
    value
  };
  return response;
}

function handleUnsubscribe(socket, id) {
  const index = subscriptions.indexOf(id.toString());
    if (index > -1) {
      subscriptions.splice(index, 1);
      sendResponse(socket, buildReturnMessage(id, null));
    } else {
      sendResponse(socket, {
        typeid: 'malcolm:core/Error:1.0',
        id,
        message: 'The id: ' + id + ' is not currently being subscribed' 
      });
    }
}