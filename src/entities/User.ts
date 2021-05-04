import { Entity, PrimaryColumn, Column, CreateDateColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("users")
class User {
  @PrimaryColumn()
  id: string;

  @Column()
  email: string;

  @CreateDateColumn()
  created_at: Date;

  // chamado sempre que instanciar um objeto user
  constructor() {
    // verifica se ja veio preenchido
    if (!this.id) {
      this.id = uuid();
    }
  }
}
export { User };
