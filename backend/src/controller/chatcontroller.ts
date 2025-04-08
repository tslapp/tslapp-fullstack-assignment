import { Response } from 'express';
import { Body, Get, HttpCode, JsonController, OnUndefined, Param, Post, Res } from 'routing-controllers';
import { StatusCodes } from 'http-status-codes';
import { Chat } from '../entity/chat';
import { getRepository } from '../component/db';
import { Message } from '../entity/message';
import { ChatResponse, CompletionRequest, MessageResponse } from '../component/types';

function getMessageResponse(message: Message): MessageResponse {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    createTime: message.createTime,
  };
}

function getChatResponse(chat: Chat): ChatResponse {
  return {
    id: chat.id,
    messages: chat.messages?.map(getMessageResponse),
    createTime: chat.createTime,
  };
}

@JsonController()
export class ChatController {
  private readonly chatRepository = getRepository(Chat);
  private readonly messageRepository = getRepository(Message);

  @Get('/v1/chats')
  public async index(): Promise<ChatResponse[]> {
    return (await this.chatRepository.find({
      order: {
        createTime: 'DESC',
      },
    })).map(getChatResponse);
  }

  @Get('/v1/chats/:chatId')
  public async get(@Param('chatId') chatId: string): Promise<ChatResponse> {
    const chat = await this.chatRepository.findOneOrFail({
      relations: ['messages'],
      where: { id: chatId },
    });
    return getChatResponse(chat);
  }

  @Post('/v1/chats')
  @HttpCode(StatusCodes.CREATED)
  public async create(): Promise<ChatResponse> {
    const chat = await this.chatRepository.save(this.chatRepository.create());
    return getChatResponse(chat);
  }

  @Post('/v1/chats/:chatId/completion')
  @OnUndefined(StatusCodes.OK)
  public async completion(@Param('chatId') chatId: string, @Body() request: CompletionRequest, @Res() res: Response): Promise<void> {
    // Implement this method
    // 1. Call `completion` method in ../component/openai.ts
    // 2. Respond by SSE stream
    // 3. Support chat context
  }
}
