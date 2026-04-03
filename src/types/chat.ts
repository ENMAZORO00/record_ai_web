export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
};

export type ChatThread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: ChatMessage[];
};
