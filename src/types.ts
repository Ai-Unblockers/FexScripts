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

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  platform?: string;
}

export type Platform = 'roblox' | 'minecraft' | 'cs2';
