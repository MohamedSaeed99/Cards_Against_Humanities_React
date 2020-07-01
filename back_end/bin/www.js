#!/usr/bin/env node

/*
    This is the server inlcude socket.io in here
*/
const regRouter = require('../routes/register');
const loginRouter = require('../routes/login');
const lobbyRouter = require('../routes/lobby');
const logoutRouter = require('../routes/logout');


/**
 * Module dependencies.
 */
var app = require('../app');
const debug = require('debug')('cards_against_humanities');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
const io = require("socket.io")(server);

app.io = io;

app.use("/register", regRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/lobby", lobbyRouter);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


/*
  Socket.io
*/
io.on('connection', (socket) => {
  // adds the host to the socket room
  socket.on('Created Game', (data) => {
    socket.room = data.gameId;
    socket.username = data.username;
    socket.join(data.gameId);
  });

  // Emission that would kick every player within the hosted lobby out
  socket.on('Host Leaving', (data) => {
    // TODO: Destory the game room
    socket.to(data.gameId).emit("Host Left");
  });

  // Emission that would kick every player within the hosted lobby out
  socket.on('User Leaving', (data) => {
    // TODO: get rid of user from game room
    socket.to(data.gameId).emit("User Left", socket.username);
  });


  // adds users to the socket room
  socket.on('Game Joined', (data) => {
    socket.room = data.gameId;
    socket.username = data.username;
    socket.join(data.gameId);
    socket.to(data.gameId).emit("User Joined", data.username);
  });

  socket.on("Submitted Answers", (data) => {
    io.in(data.gameId).emit("Answer Cards", ({
      user: data.username,
      cards: data.submittedCards
    }));
  });
});