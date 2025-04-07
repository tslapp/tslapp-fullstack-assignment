import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Chat } from './chat';
import { Role } from '../component/types';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  role: Role;

  @Column('text')
  content: string;

  @ManyToOne(() => Chat)
  chat: Chat;

  @CreateDateColumn()
  createTime: Date;
}
