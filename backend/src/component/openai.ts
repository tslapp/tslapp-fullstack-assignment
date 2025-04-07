import OpenAI from 'openai';
import { config } from './config';
import { Role } from './types';

export async function* completion(messages: { role: Role; content: string }[]): AsyncIterable<string> {
  const openai = new OpenAI({
    baseURL: config.openrouter.baseUrl,
    apiKey: config.openrouter.apiKey,
  });
  const completion = await openai.chat.completions.create({
    model: config.openrouter.model,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
    stream: true,
  });
  for await (const chunk of completion) {
    const content = chunk.choices[0]?.delta?.content ?? '';
    if (content) {
      yield content;
    }
  }
}
