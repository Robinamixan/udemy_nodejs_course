const socketIoCreator = require('socket.io');

module.exports = {
  webSocket: null,

  init: (httpServer) => {
    this.webSocket = socketIoCreator(httpServer, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    return this.webSocket;
  },

  getConnection: () => {
    if (!this.webSocket) {
      throw new Error('Web Socket not initialized');
    }

    return this.webSocket;
  }
}