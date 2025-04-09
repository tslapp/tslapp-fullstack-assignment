// 定义消息类型
export interface IMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}
