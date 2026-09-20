import { useState, useEffect, useRef, useCallback } from 'react';
import { Message, Attachment, ChatConfig, ChatSession } from './types';
import {
  renderMarkdown,
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
    <aside className="w-[260px] bg-[#171717] border-r border-[rgba(255,255,255,0.08)] flex flex-col max-md:hidden">
      <button
        onClick={onNew}
        className="m-3 px-3 py-2 border border-[rgba(255,255,255,0.08)] rounded-lg flex items-center gap-2 text-[13px] hover:bg-[#242424] transition-colors"
      >
        ＋ New chat
      </button>
      <div className="px-4 py-1 text-[11px] uppercase tracking-wider text-[rgba(255,255,255,0.55)]">
        Recent
      </div>
      <div className="flex-1 overflow-auto px-2">
        {sessions.map((s) => (
          <div
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`px-3 py-2 rounded-md text-[13px] cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis mb-0.5 transition-colors ${
              s.id === activeId
                ? 'bg-[#2a2a2a] text-[#ececec]'
                : 'text-[rgba(255,255,255,0.55)] hover:bg-[#242424] hover:text-[#ececec]'
            }`}
          >
            {s.title}
          </div>
        ))}
      </div>
      <div className="border-t border-[rgba(255,255,255,0.08)] px-4 py-3 text-[11px] text-[rgba(255,255,255,0.55)]">
        LuaForge · standalone
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
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#2f2f2f] border border-[rgba(255,255,255,0.08)] rounded-2xl max-w-[480px] w-full p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[16px] font-semibold mb-1">Settings</h2>
        <p className="text-[12px] text-[rgba(255,255,255,0.55)] mb-4">
          Configure your API connection
        </p>

        <div className="mb-3">
          <label className="block text-[12px] text-[rgba(255,255,255,0.55)] mb-1">
            API URL
          </label>
          <input
            className="w-full bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-lg px-2.5 py-2 text-[13px] outline-none focus:border-[#34d399]"
            value={local.url}
            onChange={(e) => setLocal({ ...local, url: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="block text-[12px] text-[rgba(255,255,255,0.55)] mb-1">
            API Key
          </label>
          <input
            type="password"
            className="w-full bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-lg px-2.5 py-2 text-[13px] outline-none focus:border-[#34d399]"
            value={local.key}
            onChange={(e) => setLocal({ ...local, key: e.target.value })}
            placeholder="sk-or-..."
          />
        </div>

        <div className="mb-3">
          <label className="block text-[12px] text-[rgba(255,255,255,0.55)] mb-1">
            Model
          </label>
          <input
            className="w-full bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-lg px-2.5 py-2 text-[13px] outline-none focus:border-[#34d399]"
            value={local.model}
            onChange={(e) => setLocal({ ...local, model: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="block text-[12px] text-[rgba(255,255,255,0.55)] mb-1">
            System Prompt
          </label>
          <textarea
            className="w-full bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-lg px-2.5 py-2 text-[13px] outline-none focus:border-[#34d399] min-h-[70px] resize-y"
            value={local.system}
            onChange={(e) => setLocal({ ...local, system: e.target.value })}
          />
        </div>

        <div className="flex gap-2 justify-end mt-4">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg text-[13px] text-[rgba(255,255,255,0.55)] hover:text-[#ececec] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(local);
              onClose();
            }}
            className="bg-[#34d399] text-[#062018] px-3.5 py-2 rounded-lg text-[13px] font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ MESSAGE BUBBLE ============
function MessageBubble({ message, isStreaming }: { message: Message; isStreaming?: boolean }) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%]">
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-end mb-1.5">
              {message.attachments.map((a, i) => (
                <img
                  key={i}
                  src={a.dataUrl}
                  alt={a.name}
                  className="max-h-[160px] rounded-lg border border-[rgba(255,255,255,0.08)] object-cover"
                />
              ))}
            </div>
          )}
          {message.text && (
            <div className="bg-[#34d399] text-[#062018] px-3.5 py-2.5 rounded-2xl text-[14px] whitespace-pre-wrap">
              {message.text}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 flex-shrink-0 rounded-md bg-[rgba(52,211,153,0.15)] text-[#34d399] flex items-center justify-center text-sm">
        ◧
      </div>
      <div className="flex-1 min-w-0 text-[14px] leading-relaxed">
        {isStreaming && !message.text ? (
          <div className="flex gap-1.5 pt-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[rgba(255,255,255,0.55)] thinking-dot" />
            <span className="w-1.5 h-1.5 rounded-full bg-[rgba(255,255,255,0.55)] thinking-dot" />
            <span className="w-1.5 h-1.5 rounded-full bg-[rgba(255,255,255,0.55)] thinking-dot" />
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(message.text || '') }} />
        )}
      </div>
    </div>
  );
}

// ============ EMPTY STATE ============
function EmptyState({ onSuggestion }: { onSuggestion: (s: string) => void }) {
  const suggestions = [
    'Make a teleport script for a lobby',
    'Write a leaderstats module with saving',
    'Add a currency multiplier to a Roblox game',
    'Build a sword combat system',
  ];

  return (
    <div className="flex flex-col items-center text-center py-20">
      <div className="text-[44px] text-[#34d399]">◧</div>
      <h1 className="text-[22px] font-semibold mt-3 mb-1.5">
        What Luau script are we building?
      </h1>
      <p className="text-[rgba(255,255,255,0.55)] text-[14px] max-w-[420px]">
        Ask anything, paste a Roblox game link, or drop in a screenshot or short clip.
      </p>
      <div className="mt-7 grid grid-cols-2 gap-2 w-full max-w-[520px]">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestion(s)}
            className="border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] rounded-xl p-3 text-left text-[13px] hover:bg-[#2a2a2a] transition-colors"
          >
            {s}
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

  // Get current messages
  const messages = sessions.find((s) => s.id === activeId)?.messages || [];

  // Save sessions
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  // Save config
  useEffect(() => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  }, [config]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  // Update session messages
  const updateMessages = useCallback(
    (newMsgs: Message[]) => {
      setSessions((prev) =>
        prev.map((s) => (s.id === activeId ? { ...s, messages: newMsgs } : s))
      );
    },
    [activeId]
  );

  // Create new session
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

  // Init first session if none
  useEffect(() => {
    if (sessions.length === 0) {
      createNewSession();
    } else if (!activeId) {
      setActiveId(sessions[0].id);
    }
  }, []);

  // Handle files
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

  // Send message
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

    // Update title if first message
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

    // Build API messages
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

  // Drag and drop
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

  // Textarea auto-resize
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
    <div className="flex h-screen bg-[#212121] text-[#ececec]">
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
          <div className="absolute inset-0 bg-[rgba(33,33,33,0.85)] backdrop-blur-sm flex items-center justify-center z-50">
            <div className="border-2 border-dashed border-[#34d399] bg-[rgba(47,47,47,0.6)] rounded-2xl p-6 px-8 text-center">
              <div className="text-2xl">🖼️</div>
              <p className="mt-2 text-[14px] font-medium">Drop images or videos to attach</p>
              <p className="mt-0.5 text-[12px] text-[rgba(255,255,255,0.55)]">
                Up to 20 MB each · max 6 files
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="h-12 border-b border-[rgba(255,255,255,0.08)] flex items-center gap-2 px-4">
          <span className="text-[#34d399] text-lg">◧</span>
          <span className="font-semibold">LuaForge</span>
          <span className="text-[12px] text-[rgba(255,255,255,0.55)]">Roblox Luau AI</span>
          <button
            onClick={() => setSettingsOpen(true)}
            className="ml-auto px-2.5 py-1.5 border border-[rgba(255,255,255,0.08)] rounded-lg text-[12px] flex items-center gap-1.5 hover:bg-[#2a2a2a] transition-colors"
          >
            ⚙ Settings
          </button>
        </header>

        {/* Messages area */}
        <div className="flex-1 overflow-auto" ref={scrollRef}>
          <div className="max-w-[768px] mx-auto px-4 py-6">
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
        <div className="border-t border-[rgba(255,255,255,0.08)] p-4">
          <form
            className="max-w-[768px] mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            {/* Constraint bar */}
            <div className="flex items-center gap-2 text-[12px] text-[rgba(255,255,255,0.55)] border border-[rgba(255,255,255,0.08)] rounded-xl px-3 py-2 bg-[rgba(255,255,255,0.02)] mb-2">
              <span>⚙</span>
              <span>Gameplay constraints</span>
              <span className="ml-auto text-[10px] opacity-60">optional</span>
            </div>

            {/* Attachments */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {attachments.map((a, i) => (
                  <div
                    key={i}
                    className="relative border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden bg-[#2f2f2f]"
                  >
                    <img
                      src={a.dataUrl}
                      alt={a.name}
                      className="w-24 h-16 object-cover block"
                    />
                    {a.kind === 'video' && (
                      <div className="absolute bottom-1 left-1 text-[10px] text-white bg-black/60 px-1.5 py-0.5 rounded">
                        🎬 {a.durationSec}s
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setAttachments((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center text-[12px] hover:bg-black/90"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && <div className="text-[#f87171] text-[12px] mb-2">{error}</div>}

            {/* Input box */}
            <div className="bg-[#2f2f2f] border border-[rgba(255,255,255,0.08)] rounded-2xl p-2 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Message LuaForge… (Enter to send, Shift+Enter for newline)"
                rows={2}
                className="w-full bg-transparent border-0 outline-none resize-none p-2 text-[14px] min-h-[52px]"
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
              <div className="flex items-center gap-1 p-1">
                <button
                  type="button"
                  onClick={() => imgInputRef.current?.click()}
                  title="Attach image"
                  className="w-8 h-8 rounded-lg text-[rgba(255,255,255,0.55)] inline-flex items-center justify-center hover:bg-[#3a3a3a] hover:text-[#ececec] transition-colors"
                >
                  🖼
                </button>
                <button
                  type="button"
                  onClick={() => vidInputRef.current?.click()}
                  title="Attach video"
                  className="w-8 h-8 rounded-lg text-[rgba(255,255,255,0.55)] inline-flex items-center justify-center hover:bg-[#3a3a3a] hover:text-[#ececec] transition-colors"
                >
                  🎬
                </button>
                {streaming ? (
                  <button
                    type="button"
                    onClick={stopStreaming}
                    className="ml-auto bg-[#ececec] text-[#111] px-3 py-1.5 rounded-lg text-[13px] font-medium inline-flex items-center gap-1.5"
                  >
                    ■ Stop
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!inputValue.trim() && attachments.length === 0}
                    className="ml-auto bg-[#ececec] text-[#111] px-3 py-1.5 rounded-lg text-[13px] font-medium inline-flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ➤ Send
                  </button>
                )}
              </div>
            </div>
            <p className="text-center text-[11px] text-[rgba(255,255,255,0.4)] mt-2">
              LuaForge can make mistakes. Verify generated scripts before running.
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
