var Hapi = require('hapi');
var uuid = require('uuid');

var server = new Hapi.Server();

var cards = {};

server.connection({port: 3000});

server.ext('onRequest', function(request, reply) {
  console.log(request.method.toUpperCase(),
            'Request received: ' + request.path);
  reply.continue();
});

server.route({
  path: '/',
  method: 'GET',
  handler: {
    file: 'templates/index.html'
  }
})

server.route({
  path: '/assets/{path*}',
  method: 'GET',
  handler: {
    directory: {
      path: './public',
      listing: false
    }
  }
})

server.route({
  path: '/cards/new',
  method: ['GET', 'POST'],
  handler: newCardHandler
})

server.route({
  path: '/cards',
  method: 'GET',
  handler: cardsHandler
})

server.route({
  path: '/cards/{id}',
  method: 'DELETE',
  handler: deleCardHandler
})

function newCardHandler(request, reply) {
  if (request.method === 'get') {
    reply.file('templates/new.html')
  } else {
    var card = {
      name: request.payload.name,
      email: request.payload.recipient_email,
      sender_name: request.payload.sender_name,
      sender_email: request.payload.sender_email,
      card_image: request.payload.card_image
    }
    saveCard(card);

    console.log(card);

    reply.redirect('/cards');
  }
}

function cardsHandler(request, reply) {
  reply.file('templates/cards.html')
}

function deleCardHandler(request, reply) {
  delete cards[request.params.id];
}

function saveCard(card) {
  var id = uuid.v1();
  card.id = id;
  cards[id] = card;
}
server.start(function() {
  console.log('Server running at', server.info.uri);
})
