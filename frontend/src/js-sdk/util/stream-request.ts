// 处理响应数据的工具函数
function parseStreamData(buffer: string, callback: (data: any) => void) {
  const regex = /data: (.*?)\n\n/g;
  let match;
  while ((match = regex.exec(buffer)) !== null) {
    const jsonStr = match[1].trim();
    try {
      const data = JSON.parse(jsonStr);
      callback(data);
    } catch (error) {
      console.error('Failed to parse JSON:', error);
    }
  }
}

// 将对象转换为查询参数的工具函数
function queryToParams(data: Record<string, any>): string {
  return Object.entries(data)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

// 发送流式请求的核心函数
export async function sendStreamRequest(config: {
  url: string;
  method?: string;
  data?: any;
  header?: Record<string, string>;
  progress: (data: any) => void;
  done: () => void;
}) {
  const headers = { ...config.header, 'Content-Type': 'application/json;charset=utf-8' };
  const method = config.method || 'GET';
  const params = queryToParams(config.data || {});
  const url = method === 'GET' ? `${config.url}?${params}` : config.url;
  const init: RequestInit = {
    method,
    headers,
  };
  if (method === 'POST') {
    init.body = JSON.stringify(config.data);
  }

  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const reader = response.body!.getReader();
  const textDecoder = new TextDecoder();
  let isDone = false;

  while (!isDone) {
    const { done, value } = await reader.read();
    if (done) {
      isDone = true;
      config.done();
      break;
    }
    const buffer = textDecoder.decode(value, { stream: true });
    parseStreamData(buffer, config.progress);
  }
}
