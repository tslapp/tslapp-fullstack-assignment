import marked from "marked";

// 解析 Markdown 格式的工具函数
export function parseMarkdown(content: string) {
  try {
    return marked(content);
  } catch (e) {
    console.error('Failed to parse Markdown:', e);
    return content;
  }
}
