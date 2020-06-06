// Currently not used

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:' + (process.env.PORT || 3001));

function testing(cb) {
    socket.on("message received", () => {return 2});
    socket.emit("helloworld");
}

export {testing};