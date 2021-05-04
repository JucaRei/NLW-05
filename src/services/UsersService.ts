import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";

class UsersService {
  async create(email: string) {
    const userRepository = getCustomRepository(UsersRepository);

    // Verificar se usuário existe
    const userExists = await userRepository.findOne({
      email,
    });

    // Se existir, retonar user
    if (userExists) {
      return userExists;
    }

    // Se não existir, salvar no DB
    const user = userRepository.create({
      email,
    });

    await userRepository.save(user);

    return user;
  }
}

export { UsersService };
