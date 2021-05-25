import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionsService";
import { UsersService } from "../services/UsersService";
import { MessagesService } from "../services/MessagesService";

// Qualquer coisa fora desses termos, gera um erro
interface IParams {
  text: string;
  email: string;
}

// criar evento cliente especifico
io.on("connect", (socket) => {
  const connectionsService = new ConnectionsService();
  const usersService = new UsersService();
  const messagesService = new MessagesService();

  // verificar se o usuário existe

  socket.on("client_first_access", async (params) => {
    const socket_id = socket.id;
    const { text, email } = params as IParams;

    let user_id = null;

    // console.log(params);

    const userExists = await usersService.findByEmail(email);

    // caso não exista, crie um novo
    if (!userExists) {
      const user = await usersService.create(email);

      // criar a conexão
      await connectionsService.create({
        socket_id,
        user_id: user.id,
      });

      user_id = user.id;
    } else {
      user_id = userExists.id;

      const connection = await connectionsService.findByUserId(userExists.id);

      if (!connection) {
        await connectionsService.create({
          socket_id,
          user_id: userExists.id,
        });
      } else {
        // sobreescreve o id existente
        connection.socket_id = socket_id;

        await connectionsService.create(connection);
      }
    }

    // Salvar as mensagens
    await messagesService.create({
      text,
      user_id,
    });

    // Salvar a conexão com o socket_id, user_id na tabela

    // recuperar todas as mensagens
    const allMessages = await messagesService.listByUser(user_id);

    socket.emit("client_list_all_messages", allMessages);

    // não precisa fazer reload na pagina
    const allUsers = await connectionsService.findAllWithoutAdmin();
    io.emit("admin_list_all_users", allUsers);
  });

  socket.on("client_send_to_admin", async (params) => {
    const { text, socket_admin_id } = params;

    const socket_id = socket.id;

    const { user_id } = await connectionsService.findBySocketID(socket_id);

    // salvar
    const message = await messagesService.create({
      text,
      user_id,
    });

    // enviar pro administrador
    io.to(socket_admin_id).emit("admin_receive_message", {
      message,
      socket_id,
    });
  });
});
