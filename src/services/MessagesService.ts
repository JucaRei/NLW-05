import { getCustomRepository, Repository } from "typeorm";
import { Message } from "../entities/Message";
import { MessagesRepository } from "../repositories/MessagesRepository";

interface IMessageCreate {
  // opcional
  admin_id?: string;
  text: string;
  user_id: string;
}

class MessagesService {
  // disponível somente para a classe indicada
  private messagesRepository: Repository<Message>;

  constructor() {
    this.messagesRepository = getCustomRepository(MessagesRepository);
  }

  async create({ admin_id, text, user_id }: IMessageCreate) {
    const message = this.messagesRepository.create({
      admin_id,
      text,
      user_id,
    });

    await this.messagesRepository.save(message);

    return message;
  }

  async listByUser(user_id: string) {
    const list = await this.messagesRepository.find({
      // trazer o email do usuário no request da conversa
      where: { user_id },
      relations: ["user"],
    });

    return list;
  }
}

export { MessagesService };
