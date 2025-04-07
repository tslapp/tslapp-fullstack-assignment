import { CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from './message';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Message, message => message.chat)
  messages?: Message[];

  @CreateDateColumn()
  createTime: Date;
}
