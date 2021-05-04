import { io } from "../http";

// criar evento cliente especifico
io.on("connect", (socket) => {
  socket.on("cliente_first_access", (params) => {
    console.log(params);
  });
});
