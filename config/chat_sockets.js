const env = require("./environment");
//server side
module.exports.chatSockets = function (socketServer) {
  let io = require("socket.io")(socketServer, {
    cors: {
      origin: `https://lazybug.ykdromar.com`,
      methods: ["GET", "POST"],
    },
  });
  io.sockets.on("connection", function (socket) {
    console.log("New connection recieved", socket.id);
    socket.on("disconnect", function () {
      console.log("Socket Disconnected");
    });
    socket.on("Join_room", function (data) {
      console.log("Joining req recieved", data);
      socket.join(data.chatroom);
      io.in(data.chatroom).emit("user_joined", data);
    });
    socket.on("send_message", function (data) {
      console.log("data recieved", data);
      io.in(data.chatroom).emit("recieved_message", data);
    });
  });
};
