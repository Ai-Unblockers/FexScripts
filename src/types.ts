export interface Attachment {
  kind: 'image' | 'video';
  name: string;
  mediaType: string;
  dataUrl: string;
  durationSec?: number;
}

export interface Message {
  role: 'user' | 'assistant';
  text: string;
  attachments?: Attachment[];
}

export interface ChatConfig {
  url: string;
  key: string;
  model: string;
  system: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}
