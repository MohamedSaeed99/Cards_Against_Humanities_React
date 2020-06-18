// Currently not used

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:' + (process.env.PORT || 3001));

function testing(gameId, username) {
    console.log("EMITTING");
    socket.on("User Joined", (str) => {console.log(str)});
    socket.emit("Game Joined", {gameId: gameId, username: username});
}

export {testing};