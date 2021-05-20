import { getCustomRepository, Repository } from "typeorm";
import { ConnectionsRepository } from "../repositories/ConnectionsRepository";
import { Connection } from "../entities/Connection";

interface IConnection {
  socket_id: string;
  user_id: string;
  // opcional
  admin_id?: string;
  id?: string;
}

class ConnectionsService {
  // criar o repositório (vem das entidades)
  private connectionsRepository: Repository<Connection>;

  // acesso ao repositório
  constructor() {
    this.connectionsRepository = getCustomRepository(ConnectionsRepository);
  }

  async create({ socket_id, user_id, admin_id, id }: IConnection) {
    const connection = this.connectionsRepository.create({
      socket_id,
      user_id,
      admin_id,
      id,
    });

    await this.connectionsRepository.save(connection);

    return connection;
  }

  // se tiver uma conexão apenas sobreescreve
  async findByUserId(user_id: string) {
    const connection = await this.connectionsRepository.findOne({
      user_id,
    });

    return connection;
  }
}

export { ConnectionsService };
