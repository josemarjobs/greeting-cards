var Handlers = require('./handlers');

var Routes = [{
  path: '/',
  method: 'GET',
  handler: {
    file: 'templates/index.html'
  }
},{
  path: '/assets/{path*}',
  method: 'GET',
  handler: {
    directory: {
      path: './public',
      listing: false
    }
  }
},{
  path: '/cards/new',
  method: ['GET', 'POST'],
  handler: Handlers.newCardHandler
},{
  path: '/cards',
  method: 'GET',
  handler: Handlers.cardsHandler
},{
  path: '/cards/{id}',
  method: 'DELETE',
  handler: Handlers.deleCardHandler
}];

module.exports = Routes;
