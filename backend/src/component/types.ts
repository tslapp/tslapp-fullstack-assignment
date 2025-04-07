import { IsNotEmpty, IsString } from 'class-validator';

export enum Role {
  user = 'user',
  assistant = 'assistant'
}

export interface MessageResponse {
  id: string;
  role: Role;
  content: string;
  createTime: Date;
}

export interface ChatResponse {
  id: string;
  messages?: MessageResponse[];
  createTime: Date;
}

export class CompletionRequest {
  @IsString()
  @IsNotEmpty()
  userMessage: string;
}
