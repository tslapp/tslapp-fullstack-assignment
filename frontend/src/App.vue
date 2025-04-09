<template>
  <div id="app">
    <div class="chat-container">
      <div v-for="message in chatMessages" :key="message.id" class="message">
        <div :class="message.role === 'user' ? 'user-message' : 'assistant-message'">
          <div v-html="parseMarkdown(message.content)"></div>
        </div>
      </div>
    </div>
    <div class="input-container">
      <input v-model="userMessage" placeholder="输入你的消息" :disabled="isSending">
      <button @click="sendMessage" :disabled="isSending ||!userMessage">
        {{ isSending ? '发送中...' : '发送' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { BACKEND_BASE_URL } from './common/constants';
import { sendStreamRequest } from "@/js-sdk/util/stream-request";
import { parseMarkdown } from "@/js-sdk/util/text-format";
import { IMessage } from "@/js-sdk/types";

// 聊天消息列表
const chatMessages = ref<IMessage[]>([]);
// 用户输入的消息
const userMessage = ref('');
// 发送状态
const isSending = ref(false);
// 聊天ID
const chatId = ref('');

// 创建新会话
const createChat = async () => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/v1/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to create chat');
    }
    const data = await response.json();
    chatId.value = data.id;
  } catch (error) {
    console.error('Error creating chat:', error);
  }
};

// 发送消息
const sendMessage = async () => {
  if (!userMessage.value || isSending.value) return;
  isSending.value = true;

  // 检查是否已创建会话，如果没有则创建
  if (!chatId.value) {
    await createChat();
  }

  // 创建用户消息对象
  const newUserMessage: IMessage = {
    id: Date.now().toString(),
    role: 'user',
    content: userMessage.value
  };
  // 添加用户消息到聊天列表
  chatMessages.value.push(newUserMessage);
  userMessage.value = '';

  const url = `${BACKEND_BASE_URL}/v1/chats/${chatId.value}/completion`;
  const requestData = { userMessage: newUserMessage.content };

  // 初始化助手消息
  let assistantMessage: IMessage = {
    id: Date.now().toString(),
    role: 'assistant',
    content: ''
  };
  // 添加助手消息到聊天列表
  chatMessages.value.push(assistantMessage);

  await sendStreamRequest({
    url,
    method: 'POST',
    data: requestData,
    progress: (chunk: string) => {
      // 更新助手消息内容，实现打字机效果
      assistantMessage.content += chunk;
      // 更新聊天消息列表
      chatMessages.value = [
        ...chatMessages.value.slice(0, -1),
        assistantMessage
      ];
    },
    done: () => {
      isSending.value = false;
    }
  });
};
</script>

<style scoped>
.chat-container {
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
}

.message {
  margin-bottom: 10px;
}

.user-message {
  text-align: right;
  color: blue;
}

.assistant-message {
  text-align: left;
  color: green;
}

.input-container {
  margin-top: 10px;
}
</style>
