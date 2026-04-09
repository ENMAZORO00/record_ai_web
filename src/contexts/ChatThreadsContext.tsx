import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import type { ChatMessage, ChatThread } from '@/src/types/chat';
import { useEffect } from 'react';
import { apiService } from '@/src/services/api';

function newId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function truncateTitle(text: string, max = 42): string {
  const t = text.trim().replace(/\s+/g, ' ');
  if (t.length <= max) return t || 'New chat';
  return `${t.slice(0, max - 1)}…`;
}

function seedThreads(): ChatThread[] {
  const now = Date.now();
  return [
    {
      id: 'seed-meeting-notes',
      title: 'Meeting notes — Q1 planning',
      updatedAt: now - 3600_000,
      messages: [
        {
          id: newId(),
          role: 'user',
          content: 'Summarize key points from our Q1 planning call.',
          createdAt: now - 3600_000,
        },
        {
          id: newId(),
          role: 'assistant',
          content:
            'Here is a concise summary: budget was approved for three initiatives, hiring freeze lifts in February, and the mobile launch target is end of quarter.',
          createdAt: now - 3599_000,
        },
      ],
    },
    {
      id: 'seed-transcript',
      title: 'Interview transcript cleanup',
      updatedAt: now - 86_400_000,
      messages: [
        {
          id: newId(),
          role: 'user',
          content: 'Clean up filler words in this interview transcript.',
          createdAt: now - 86_400_000,
        },
        {
          id: newId(),
          role: 'assistant',
          content:
            'I can help remove filler words and improve readability. Paste the transcript or upload a file when your pipeline is ready.',
          createdAt: now - 86_399_000,
        },
      ],
    },
    {
      id: 'seed-product',
      title: 'Product naming brainstorm',
      updatedAt: now - 172_800_000,
      messages: [
        {
          id: newId(),
          role: 'user',
          content: 'Suggest 5 product names for an AI note-taking app.',
          createdAt: now - 172_800_000,
        },
        {
          id: newId(),
          role: 'assistant',
          content:
            '1. Scribewise\n2. Recall\n3. Noteflow\n4. Mindline\n5. EchoPad',
          createdAt: now - 172_799_000,
        },
      ],
    },
  ];
}

type ChatThreadsContextValue = {
  threads: ChatThread[];
  filteredThreads: ChatThread[];
  historySearch: string;
  setHistorySearch: (q: string) => void;
  getThread: (id: string) => ChatThread | undefined;
  fetchThreads: () => Promise<void>;
  fetchThreadById: (id: string) => Promise<void>;
  createThreadWithUserMessage: (content: string) => Promise<string | undefined>;
  sendMessageToThread: (threadId: string, content: string) => Promise<void>;
  deleteThread: (threadId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
};

const ChatThreadsContext = createContext<ChatThreadsContextValue | null>(null);

export function ChatThreadsProvider({ children }: { children: ReactNode }) {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [historySearch, setHistorySearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // TODO: Replace with real token from auth context
  useEffect(() => {
    // Avoid direct setState in effect body
    const tokenFromStorage = window.localStorage.getItem('authToken');
    if (tokenFromStorage !== token) {
      setToken(tokenFromStorage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchThreads = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    const res = await apiService.getChats(token);
    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }
    // Map backend chats to ChatThread[]
    const chatList = (res.data?.chats || []).map((c: {
      id: string;
      title: string;
      updatedAt: string;
      messages?: ChatMessage[];
    }) => ({
      id: c.id,
      title: c.title,
      updatedAt: new Date(c.updatedAt).getTime(),
      messages: [], // messages fetched on demand
    }));
    setThreads(chatList);
    setLoading(false);
  }, [token]);

  const fetchThreadById = useCallback(
    async (id: string) => {
      if (!token) return;
      setLoading(true);
      setError(null);
      const res = await apiService.getChatById(id, token);
      if (res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }
      const chat = res.data?.chat;
      if (!chat) {
        setError('Chat not found');
        setLoading(false);
        return;
      }
      setThreads((prev) => {
        const others = prev.filter((t) => t.id !== chat.id);
        return [
          {
            id: chat.id,
            title: chat.title,
            updatedAt: new Date(chat.updatedAt).getTime(),
            messages: (chat.messages || []).map((m: { id: string; role: string; content: string; createdAt: string }) => ({
              id: m.id,
              role: m.role === 'user' || m.role === 'assistant' ? m.role : 'user',
              content: m.content,
              createdAt: new Date(m.createdAt).getTime(),
            })),
          },
          ...others,
        ];
      });
      setLoading(false);
    },
    [token]
  );

  const getThread = useCallback(
    (id: string) => threads.find((t) => t.id === id),
    [threads]
  );

  const createThreadWithUserMessage = useCallback(
    async (content: string) => {
      if (!token) return;
      setLoading(true);
      setError(null);
      const res = await apiService.createChat({ content }, token);
      if (res.error) {
        setError(res.error);
        setLoading(false);
        return undefined;
      }
      const chat = res.data?.chat;
      if (!chat) {
        setError('Failed to create chat');
        setLoading(false);
        return undefined;
      }
      setThreads((prev) => [
        {
          id: chat.id,
          title: chat.title,
          updatedAt: new Date(chat.updatedAt).getTime(),
          messages: (chat.messages || []).map((m: { id: string; role: string; content: string; createdAt: string }) => ({
            id: m.id,
            role: m.role === 'user' || m.role === 'assistant' ? m.role : 'user',
            content: m.content,
            createdAt: new Date(m.createdAt).getTime(),
          })),
        },
        ...prev,
      ]);
      setLoading(false);
      return chat.id;
    },
    [token]
  );

  const sendMessageToThread = useCallback(
    async (threadId: string, content: string) => {
      if (!token) return;
      setLoading(true);
      setError(null);
      const res = await apiService.sendMessageToChat(threadId, content, token);
      if (res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }
      // Fetch updated thread
      await fetchThreadById(threadId);
      setLoading(false);
    },
    [token, fetchThreadById]
  );

  const deleteThread = useCallback(
    async (threadId: string) => {
      if (!token) return;
      setLoading(true);
      setError(null);
      const res = await apiService.deleteChat(threadId, token);
      if (res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }
      setThreads((prev) => prev.filter((t) => t.id !== threadId));
      setLoading(false);
    },
    [token]
  );

  useEffect(() => {
    // Avoid calling setState directly in effect
    if (token) {
      (async () => {
        await fetchThreads();
      })();
    }
  }, [token, fetchThreads]);

  const filteredThreads = useMemo(() => {
    const q = historySearch.trim().toLowerCase();
    const sorted = [...threads].sort((a, b) => b.updatedAt - a.updatedAt);
    if (!q) return sorted;
    return sorted.filter((t) => t.title.toLowerCase().includes(q));
  }, [threads, historySearch]);

  const value = useMemo(
    () => ({
      threads,
      filteredThreads,
      historySearch,
      setHistorySearch,
      getThread,
      fetchThreads,
      fetchThreadById,
      createThreadWithUserMessage,
      sendMessageToThread,
      deleteThread,
      loading,
      error,
    }),
    [
      threads,
      filteredThreads,
      historySearch,
      getThread,
      fetchThreads,
      fetchThreadById,
      createThreadWithUserMessage,
      sendMessageToThread,
      deleteThread,
      loading,
      error,
    ]
  );

  return (
    <ChatThreadsContext.Provider value={value}>
      {children}
    </ChatThreadsContext.Provider>
  );
}

export function useChatThreads() {
  const ctx = useContext(ChatThreadsContext);
  if (!ctx) {
    throw new Error('useChatThreads must be used within ChatThreadsProvider');
  }
  return ctx;
}
