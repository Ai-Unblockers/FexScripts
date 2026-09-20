import { useState, useEffect, useRef, useCallback } from 'react';
import { Message, Attachment, ChatConfig, ChatSession } from './types';
import {
  readImage,
  readVideo,
  DEFAULT_SYSTEM,
  STORAGE_KEY,
  CONFIG_KEY,
} from './utils';

// ============ SIDEBAR ============
function Sidebar({
  sessions,
  activeId,
  onSelect,
  onNew,
}: {
  sessions: ChatSession[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
}) {
  return (
    <aside className="w-[280px] bg-[#111111] border-r border-[rgba(255,255,255,0.06)] flex flex-col max-md:hidden">
      {/* Logo area */}
      <div className="p-4 pb-2">
        <div className="flex items-center gap-2.5 px-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-emerald-500/20">
            ◧
          </div>
          <div>
            <div className="text-[14px] font-semibold text-white">LuaForge</div>
            <div className="text-[10px] text-[#666] tracking-wide">ROBLOX LUAU AI</div>
          </div>
        </div>
        <button
          onClick={onNew}
          className="w-full px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-xl flex items-center justify-center gap-2 text-[13px] font-medium text-white shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-200"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Chat
        </button>
      </div>

      {/* Sessions list */}
      <div className="px-3 pt-2 pb-1">
        <div className="text-[11px] font-medium uppercase tracking-wider text-[#666] px-2">
          Recent Chats
        </div>
      </div>
      <div className="flex-1 overflow-auto px-2">
        {sessions.map((s) => (
          <div
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`group px-3 py-2.5 rounded-xl cursor-pointer mb-0.5 flex items-center gap-2.5 transition-all duration-200 ${
              s.id === activeId
                ? 'bg-[rgba(255,255,255,0.06)] text-white'
                : 'text-[#a1a1a1] hover:bg-[rgba(255,255,255,0.04)] hover:text-white'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-50 flex-shrink-0">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="text-[13px] truncate">{s.title}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-[rgba(255,255,255,0.06)] px-4 py-3">
        <div className="flex items-center gap-2 text-[11px] text-[#666]">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Ready to code</span>
        </div>
      </div>
    </aside>
  );
}

// ============ SETTINGS MODAL ============
function SettingsModal({
  open,
  onClose,
  config,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  config: ChatConfig;
  onSave: (c: ChatConfig) => void;
}) {
  const [local, setLocal] = useState(config);

  useEffect(() => {
    setLocal(config);
  }, [config, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#151515] border border-[rgba(255,255,255,0.08)] rounded-2xl max-w-[500px] w-full p-6 shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/20 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
          <div>
            <h2 className="text-[16px] font-semibold text-white">API Settings</h2>
            <p className="text-[12px] text-[#666]">Configure your connection</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-[#a1a1a1] mb-1.5">
              API Endpoint
            </label>
            <input
              className="w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] rounded-xl px-3.5 py-2.5 text-[13px] text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
              value={local.url}
              onChange={(e) => setLocal({ ...local, url: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#a1a1a1] mb-1.5">
              API Key
            </label>
            <input
              type="password"
              className="w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] rounded-xl px-3.5 py-2.5 text-[13px] text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
              value={local.key}
              onChange={(e) => setLocal({ ...local, key: e.target.value })}
              placeholder="sk-or-..."
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#a1a1a1] mb-1.5">
              Model
            </label>
            <input
              className="w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] rounded-xl px-3.5 py-2.5 text-[13px] text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
              value={local.model}
              onChange={(e) => setLocal({ ...local, model: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#a1a1a1] mb-1.5">
              System Prompt
            </label>
            <textarea
              className="w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] rounded-xl px-3.5 py-2.5 text-[13px] text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all min-h-[80px] resize-y"
              value={local.system}
              onChange={(e) => setLocal({ ...local, system: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-[13px] font-medium text-[#a1a1a1] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(local);
              onClose();
            }}
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-5 py-2.5 rounded-xl text-[13px] font-medium shadow-lg shadow-emerald-500/10 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ CODE BLOCK WITH COPY ============
function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group mb-3 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.06)]">
      <div className="flex items-center justify-between px-4 py-2 bg-[rgba(255,255,255,0.03)] border-b border-[rgba(255,255,255,0.06)]">
        <span className="text-[11px] font-medium uppercase tracking-wider text-[#666]">{lang}</span>
        <button
          onClick={handleCopy}
          className="text-[11px] text-[#666] hover:text-emerald-400 flex items-center gap-1 transition-colors"
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
              Copied
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="bg-[#0d0d0d] p-4 overflow-auto text-[13px] leading-relaxed m-0">
        <code className="text-[#e5e5e5]">{code}</code>
      </pre>
    </div>
  );
}

// ============ MESSAGE BUBBLE ============
function MessageBubble({ message, isStreaming }: { message: Message; isStreaming?: boolean }) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="max-w-[85%]">
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-end mb-2">
              {message.attachments.map((a, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)]">
                  <img
                    src={a.dataUrl}
                    alt={a.name}
                    className="max-h-[180px] object-cover"
                  />
                  {a.kind === 'video' && (
                    <div className="absolute bottom-1.5 left-1.5 text-[10px] text-white bg-black/60 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                      🎬 {a.durationSec}s
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {message.text && (
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white px-4 py-3 rounded-2xl rounded-tr-md text-[14px] leading-relaxed whitespace-pre-wrap shadow-lg shadow-emerald-500/5">
              {message.text}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="w-8 h-8 flex-shrink-0 rounded-xl bg-gradient-to-br from-emerald-500/15 to-emerald-700/15 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm">
        ◧
      </div>
      <div className="flex-1 min-w-0 text-[14px] leading-relaxed pt-0.5">
        {isStreaming && !message.text ? (
          <div className="flex gap-1.5 pt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 thinking-dot" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 thinking-dot" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 thinking-dot" />
          </div>
        ) : (
          <div className="prose-custom">
            <AIMessage text={message.text || ''} />
          </div>
        )}
      </div>
    </div>
  );
}

// ============ AI MESSAGE RENDERER ============
function AIMessage({ text }: { text: string }) {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return (
    <div className="text-[#e5e5e5]">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const m = /^```(\w+)?\n?([\s\S]*?)```$/.exec(part);
          const lang = (m && m[1]) || 'lua';
          const code = m ? m[2] : part.replace(/```/g, '');
          return <CodeBlock key={i} code={code} lang={lang} />;
        }
        if (!part) return null;
        return (
          <div key={i} className="mb-3 text-[14px] leading-[1.7]">
            {part.split('\n').map((line, j) => (
              <span key={j}>
                {line}
                {j < part.split('\n').length - 1 && <br />}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ============ EMPTY STATE ============
function EmptyState({ onSuggestion }: { onSuggestion: (s: string) => void }) {
  const suggestions = [
    { icon: '🎮', text: 'Make a teleport script for a lobby' },
    { icon: '📊', text: 'Write a leaderstats module with saving' },
    { icon: '💰', text: 'Add a currency multiplier to a Roblox game' },
    { icon: '⚔️', text: 'Build a sword combat system' },
  ];

  return (
    <div className="flex flex-col items-center text-center py-16 animate-slide-up">
      {/* Hero icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-emerald-500/20">
          ◧
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#151515] border-2 border-emerald-500 flex items-center justify-center text-[10px]">
          ✨
        </div>
      </div>

      <h1 className="text-[24px] font-bold text-white mb-2">
        What Luau script are we building?
      </h1>
      <p className="text-[#a1a1a1] text-[15px] max-w-[440px] leading-relaxed">
        Ask anything about Roblox development, paste a game link, or drop in a screenshot or clip.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-[540px]">
        {suggestions.map((s) => (
          <button
            key={s.text}
            onClick={() => onSuggestion(s.text)}
            className="group border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.1)] rounded-xl p-4 text-left transition-all duration-200"
          >
            <span className="text-lg mb-1.5 block">{s.icon}</span>
            <span className="text-[13px] text-[#a1a1a1] group-hover:text-white transition-colors">{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ MAIN APP ============
export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [activeId, setActiveId] = useState<string>('');
  const [config, setConfig] = useState<ChatConfig>(() => {
    try {
      const stored = localStorage.getItem(CONFIG_KEY);
      return stored
        ? JSON.parse(stored)
        : {
            url: 'https://openrouter.ai/api/v1',
            key: '',
            model: 'openai/gpt-4o-mini',
            system: DEFAULT_SYSTEM,
          };
    } catch {
      return {
        url: 'https://openrouter.ai/api/v1',
        key: '',
        model: 'openai/gpt-4o-mini',
        system: DEFAULT_SYSTEM,
      };
    }
  });
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const vidInputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);

  const messages = sessions.find((s) => s.id === activeId)?.messages || [];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  const updateMessages = useCallback(
    (newMsgs: Message[]) => {
      setSessions((prev) =>
        prev.map((s) => (s.id === activeId ? { ...s, messages: newMsgs } : s))
      );
    },
    [activeId]
  );

  const createNewSession = useCallback(() => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const newSession: ChatSession = {
      id,
      title: 'New chat',
      messages: [],
      createdAt: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveId(id);
    setAttachments([]);
    setError('');
  }, []);

  useEffect(() => {
    if (sessions.length === 0) {
      createNewSession();
    } else if (!activeId) {
      setActiveId(sessions[0].id);
    }
  }, []);

  const addFiles = async (files: FileList | File[]) => {
    setError('');
    const arr = Array.from(files);
    const newAttachments: Attachment[] = [];

    for (const f of arr) {
      try {
        const item = f.type.startsWith('video/')
          ? await readVideo(f)
          : f.type.startsWith('image/')
          ? await readImage(f)
          : null;
        if (!item) throw new Error(f.name + ' is not an image or video');
        newAttachments.push(item);
      } catch (e: any) {
        setError(e.message);
      }
    }

    setAttachments((prev) => [...prev, ...newAttachments].slice(-6));
  };

  const send = async () => {
    const text = inputValue.trim();
    if ((!text && attachments.length === 0) || streaming) return;
    if (!config.key) {
      setError('No API key configured. Open settings to add your key.');
      return;
    }
    setError('');

    const userMsg: Message = {
      role: 'user',
      text,
      attachments: [...attachments],
    };

    const newMessages = [...messages, userMsg];

    if (messages.length === 0) {
      const title = text.slice(0, 40) || 'Image analysis';
      setSessions((prev) =>
        prev.map((s) => (s.id === activeId ? { ...s, title, messages: newMessages } : s))
      );
    } else {
      updateMessages(newMessages);
    }

    setInputValue('');
    setAttachments([]);
    setStreaming(true);

    const apiMessages: any[] = [{ role: 'system', content: config.system }];
    for (const m of newMessages) {
      if (m.role === 'user') {
        const content: any[] = [];
        for (const a of m.attachments || []) {
          content.push({ type: 'image_url', image_url: { url: a.dataUrl } });
          if (a.kind === 'video') {
            content.push({
              type: 'text',
              text: `[Video preview frame from ${a.name} (${a.durationSec}s)]`,
            });
          }
        }
        if (m.text) content.push({ type: 'text', text: m.text });
        apiMessages.push({
          role: 'user',
          content: content.length === 1 && content[0].type === 'text' ? content[0].text : content,
        });
      } else {
        apiMessages.push({ role: 'assistant', content: m.text || '' });
      }
    }

    const aiMsg: Message = { role: 'assistant', text: '' };
    const msgsWithAi = [...newMessages, aiMsg];
    updateMessages(msgsWithAi);

    abortRef.current = new AbortController();
    try {
      const res = await fetch(config.url + '/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + config.key,
        },
        body: JSON.stringify({
          model: config.model,
          messages: apiMessages,
          stream: true,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error('API ' + res.status + ': ' + t.slice(0, 300));
      }

      const reader = res.body!.getReader();
      const dec = new TextDecoder();
      let buf = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() || '';

        for (const line of lines) {
          const s = line.trim();
          if (!s.startsWith('data:')) continue;
          const data = s.slice(5).trim();
          if (data === '[DONE]') continue;
          try {
            const j = JSON.parse(data);
            const delta = j.choices?.[0]?.delta?.content || '';
            if (delta) {
              aiMsg.text += delta;
              updateMessages([...msgsWithAi.slice(0, -1), { ...aiMsg }]);
            }
          } catch {}
        }
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        aiMsg.text = (aiMsg.text || '') + '\n\n[Error: ' + e.message + ']';
        updateMessages([...msgsWithAi.slice(0, -1), { ...aiMsg }]);
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const stopStreaming = () => {
    abortRef.current?.abort();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    if (!Array.from(e.dataTransfer.types).includes('Files')) return;
    e.preventDefault();
    dragDepthRef.current++;
    setDragOver(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!Array.from(e.dataTransfer.types).includes('Files')) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragDepthRef.current = 0;
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-[#fafafa]">
      <Sidebar
        sessions={sessions}
        activeId={activeId}
        onSelect={(id) => {
          setActiveId(id);
          setAttachments([]);
          setError('');
        }}
        onNew={createNewSession}
      />

      <main
        className="flex-1 flex flex-col min-w-0 relative"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drop overlay */}
        {dragOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
            <div className="border-2 border-dashed border-emerald-500 bg-emerald-500/5 rounded-2xl p-8 text-center glow">
              <div className="text-4xl mb-3">🖼️</div>
              <p className="text-[16px] font-semibold text-white">Drop files to attach</p>
              <p className="mt-1 text-[13px] text-[#a1a1a1]">
                Up to 20 MB each · max 6 files
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="h-14 border-b border-[rgba(255,255,255,0.06)] flex items-center gap-3 px-5 glass">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-emerald-500/15">
              ◧
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-[15px]">LuaForge</span>
              <span className="text-[11px] text-[#666] font-medium hidden sm:inline">Roblox Luau AI</span>
            </div>
          </div>
          <button
            onClick={() => setSettingsOpen(true)}
            className="ml-auto px-3 py-2 rounded-xl text-[12px] font-medium text-[#a1a1a1] hover:text-white hover:bg-[rgba(255,255,255,0.05)] flex items-center gap-2 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Settings
          </button>
        </header>

        {/* Messages area */}
        <div className="flex-1 overflow-auto" ref={scrollRef}>
          <div className="max-w-[800px] mx-auto px-5 py-6">
            {messages.length === 0 ? (
              <EmptyState
                onSuggestion={(s) => {
                  setInputValue(s);
                  textareaRef.current?.focus();
                }}
              />
            ) : (
              <div className="flex flex-col gap-6">
                {messages.map((m, i) => (
                  <MessageBubble
                    key={i}
                    message={m}
                    isStreaming={streaming && i === messages.length - 1 && m.role === 'assistant'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-[rgba(255,255,255,0.06)] p-4 pb-5">
          <form
            className="max-w-[800px] mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            {/* Attachments */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3 animate-fade-in">
                {attachments.map((a, i) => (
                  <div
                    key={i}
                    className="relative rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] group"
                  >
                    <img
                      src={a.dataUrl}
                      alt={a.name}
                      className="w-24 h-16 object-cover block"
                    />
                    {a.kind === 'video' && (
                      <div className="absolute bottom-1 left-1 text-[10px] text-white bg-black/60 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                        🎬 {a.durationSec}s
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setAttachments((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center text-[10px] hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-[#f87171] text-[12px] mb-3 px-3 py-2 bg-red-500/5 border border-red-500/10 rounded-xl animate-fade-in">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                {error}
              </div>
            )}

            {/* Input box */}
            <div className="bg-[#151515] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden shadow-2xl shadow-black/30 focus-within:border-[rgba(16,185,129,0.3)] focus-within:shadow-emerald-500/5 transition-all duration-200">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Message LuaForge…"
                rows={1}
                className="w-full bg-transparent border-0 outline-none resize-none px-4 pt-3.5 pb-2 text-[14px] text-white placeholder-[#666] min-h-[48px]"
              />
              <input
                ref={imgInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => {
                  if (e.target.files) addFiles(e.target.files);
                  e.target.value = '';
                }}
              />
              <input
                ref={vidInputRef}
                type="file"
                accept="video/*"
                multiple
                hidden
                onChange={(e) => {
                  if (e.target.files) addFiles(e.target.files);
                  e.target.value = '';
                }}
              />
              <div className="flex items-center gap-1 px-2 pb-2">
                <button
                  type="button"
                  onClick={() => imgInputRef.current?.click()}
                  title="Attach image"
                  className="w-8 h-8 rounded-lg text-[#666] hover:text-emerald-400 hover:bg-[rgba(255,255,255,0.05)] inline-flex items-center justify-center transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                </button>
                <button
                  type="button"
                  onClick={() => vidInputRef.current?.click()}
                  title="Attach video"
                  className="w-8 h-8 rounded-lg text-[#666] hover:text-emerald-400 hover:bg-[rgba(255,255,255,0.05)] inline-flex items-center justify-center transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
                </button>
                <div className="flex-1" />
                {streaming ? (
                  <button
                    type="button"
                    onClick={stopStreaming}
                    className="bg-white text-black px-4 py-2 rounded-xl text-[13px] font-medium inline-flex items-center gap-1.5 hover:bg-gray-200 transition-all shadow-md"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
                    Stop
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!inputValue.trim() && attachments.length === 0}
                    className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-2 rounded-xl text-[13px] font-medium inline-flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-md shadow-emerald-500/10 disabled:shadow-none"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    Send
                  </button>
                )}
              </div>
            </div>
            <p className="text-center text-[11px] text-[#444] mt-3">
              LuaForge can make mistakes. Verify generated scripts before running in Studio.
            </p>
          </form>
        </div>
      </main>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        config={config}
        onSave={setConfig}
      />
    </div>
  );
}
