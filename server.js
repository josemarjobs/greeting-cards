var Hapi = require('hapi');
var CardStore = require('./lib/cardStore');

var server = new Hapi.Server();

CardStore.initialize();

server.connection({port: 3000});

server.views({
  engines: {
    html: require('handlebars')
  },
  path: './templates'
})

server.register({
  register: require('good'),
  options: {
    opsInterval: 5000,
    reporters: [{
      reporter: require('good-file'),
      events: {ops: '*'},
      config: {
        path: './logs',
        prefix: 'hapi-process',
        rotate: 'daily'
      }
    },{
      reporter: require('good-file'),
      events: {response: '*'},
      config: {
        path: './logs',
        prefix: 'hapi-requests',
        rotate: 'daily'
      }
    },{
      reporter: require('good-file'),
      events: {errors: '*'},
      config: {
        path: './logs',
        prefix: 'hapi-errors',
        rotate: 'daily'
      }
    }]
  }
}, (err) => {console.log(err)})

server.ext('onRequest', function(request, reply) {
  console.log(request.method.toUpperCase(),
            'Request received: ' + request.path);
  reply.continue();
});

server.ext('onPreResponse', function(request, reply) {
  if (request.response.isBoom) {
    return reply.view('error', request.response)
  }
  reply.continue();
});

server.route(require('./lib/routes'));

server.start(function() {
  console.log('Server running at', server.info.uri);
})
