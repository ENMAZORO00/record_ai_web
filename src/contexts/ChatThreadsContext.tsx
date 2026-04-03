import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import type { ChatMessage, ChatThread } from '@/src/types/chat';

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
  createEmptyThread: () => string;
  createThreadWithUserMessage: (content: string) => string;
  appendUserMessage: (threadId: string, content: string) => void;
  appendAssistantMessage: (threadId: string, content: string) => void;
};

const ChatThreadsContext = createContext<ChatThreadsContextValue | null>(null);

export function ChatThreadsProvider({ children }: { children: ReactNode }) {
  const [threads, setThreads] = useState<ChatThread[]>(seedThreads);
  const [historySearch, setHistorySearch] = useState('');

  const filteredThreads = useMemo(() => {
    const q = historySearch.trim().toLowerCase();
    const sorted = [...threads].sort((a, b) => b.updatedAt - a.updatedAt);
    if (!q) return sorted;
    return sorted.filter((t) => t.title.toLowerCase().includes(q));
  }, [threads, historySearch]);

  const getThread = useCallback(
    (id: string) => threads.find((t) => t.id === id),
    [threads],
  );

  const createEmptyThread = useCallback(() => {
    const id = newId();
    const thread: ChatThread = {
      id,
      title: 'New chat',
      updatedAt: Date.now(),
      messages: [],
    };
    setThreads((prev) => [thread, ...prev]);
    return id;
  }, []);

  const createThreadWithUserMessage = useCallback((content: string) => {
    const id = newId();
    const trimmed = content.trim();
    const userMsg: ChatMessage = {
      id: newId(),
      role: 'user',
      content: trimmed,
      createdAt: Date.now(),
    };
    const thread: ChatThread = {
      id,
      title: truncateTitle(trimmed),
      updatedAt: Date.now(),
      messages: [userMsg],
    };
    setThreads((prev) => [thread, ...prev]);
    return id;
  }, []);

  const appendUserMessage = useCallback((threadId: string, content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;
    const userMsg: ChatMessage = {
      id: newId(),
      role: 'user',
      content: trimmed,
      createdAt: Date.now(),
    };
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== threadId) return t;
        const nextMessages = [...t.messages, userMsg];
        const title =
          t.messages.length === 0 ? truncateTitle(trimmed) : t.title;
        return {
          ...t,
          title,
          messages: nextMessages,
          updatedAt: Date.now(),
        };
      }),
    );
  }, []);

  const appendAssistantMessage = useCallback(
    (threadId: string, content: string) => {
      const msg: ChatMessage = {
        id: newId(),
        role: 'assistant',
        content,
        createdAt: Date.now(),
      };
      setThreads((prev) =>
        prev.map((t) =>
          t.id === threadId
            ? {
                ...t,
                messages: [...t.messages, msg],
                updatedAt: Date.now(),
              }
            : t,
        ),
      );
    },
    [],
  );

  const value = useMemo(
    () => ({
      threads,
      filteredThreads,
      historySearch,
      setHistorySearch,
      getThread,
      createEmptyThread,
      createThreadWithUserMessage,
      appendUserMessage,
      appendAssistantMessage,
    }),
    [
      threads,
      filteredThreads,
      historySearch,
      getThread,
      createEmptyThread,
      createThreadWithUserMessage,
      appendUserMessage,
      appendAssistantMessage,
    ],
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
