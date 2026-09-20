import { useState, useEffect, useRef, useCallback } from 'react';
import { Message, Attachment, ChatSession, Platform } from './types';
import {
  readImage,
  readVideo,
  STORAGE_KEY,
  PLATFORMS,
  SCRIPT_CATEGORIES,
  QUICK_PROMPTS,
  generateScript,
} from './utils';

// ============ SIDEBAR ============
function Sidebar({
  sessions,
  activeId,
  onSelect,
  onNew,
  activeCategory,
  onCategoryChange,
  platform,
  onPlatformChange,
}: {
  sessions: ChatSession[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  platform: Platform;
  onPlatformChange: (p: Platform) => void;
}) {
  const categories = SCRIPT_CATEGORIES[platform];
  
  return (
    <aside className="w-[280px] glass-subtle flex flex-col max-lg:hidden">
      {/* Logo */}
      <div className="p-4 pb-2">
        <div className="flex items-center gap-2.5 px-2 mb-4">
          <div className="w-9 h-9 rounded-xl overflow-hidden glass-button pulse-glow">
            <img 
              src="https://cdn.discordapp.com/icons/1541928149174984784/fa29c0d41945a2ad221ca0cf0c0b7409.png?size=128" 
              alt="Fex Scripts Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-[15px] font-bold gradient-text">Fex Scripts</div>
            <div className="text-[10px] text-[#52525b] tracking-wider font-medium">MULTI-PLATFORM</div>
          </div>
        </div>
        <button
          onClick={onNew}
          className="w-full px-4 py-2.5 glass-button flex items-center justify-center gap-2 text-[13px] font-semibold text-white transition-all duration-200"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Script
        </button>
      </div>

      {/* Platform Selector */}
      <div className="px-3 pt-2 pb-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#52525b] px-2 mb-2">
          Platform
        </div>
        <div className="flex gap-1">
          {Object.values(PLATFORMS).map((p) => (
            <button
              key={p.id}
              onClick={() => onPlatformChange(p.id)}
              className={`flex-1 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150 ${
                platform === p.id
                  ? `glass-button bg-gradient-to-r ${p.color} text-white shadow-md`
                  : 'glass-button text-[#a1a1aa] hover:text-white'
              }`}
            >
              {p.icon} {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="px-3 pt-3 pb-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#52525b] px-2 mb-2">
          Script Categories
        </div>
        <div className="space-y-0.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`w-full px-3 py-2 rounded-lg flex items-center gap-2.5 text-left transition-all duration-150 ${
                activeCategory === cat.id
                  ? 'glass-button text-purple-300 border border-purple-500/30'
                  : 'glass-button text-[#a1a1aa] hover:text-white'
              }`}
            >
              <span className="text-[14px]">{cat.icon}</span>
              <span className="text-[12px] font-medium">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent sessions */}
      <div className="px-3 pt-4 pb-1 flex-1 overflow-auto">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#52525b] px-2 mb-2">
          Recent Scripts
        </div>
        <div className="space-y-0.5">
          {sessions.slice(0, 10).map((s) => (
            <div
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`group px-3 py-2 rounded-lg cursor-pointer flex items-center gap-2 transition-all duration-150 ${
                s.id === activeId
                  ? 'bg-[rgba(255,255,255,0.05)] text-white'
                  : 'text-[#71717a] hover:bg-[rgba(255,255,255,0.03)] hover:text-[#a1a1aa]'
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-40 flex-shrink-0">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="text-[12px] truncate">{s.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[rgba(255,255,255,0.06)] px-4 py-3">
        <div className="flex items-center gap-2 text-[11px] text-[#52525b]">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <span>Fex Scripts</span>
          <span className="ml-auto text-[10px]">v3.0</span>
        </div>
      </div>
    </aside>
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
    <div className="relative group mb-4 rounded-xl overflow-hidden glass-card">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-[11px] font-mono font-medium text-[#71717a] ml-2">{lang}</span>
          <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
            Executor Script
          </span>
        </div>
        <button
          onClick={handleCopy}
          className={`text-[11px] font-medium flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
            copied
              ? 'text-emerald-400 bg-emerald-500/10'
              : 'text-[#71717a] hover:text-purple-400 hover:bg-purple-500/10'
          }`}
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              Copy Script
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-auto text-[13px] leading-relaxed m-0 max-h-[500px]">
        <code className="text-[#e5e5e5]">{code}</code>
      </pre>
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
          <div key={i} className="mb-3 text-[14px] leading-[1.75]">
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

// ============ MESSAGE BUBBLE ============
function MessageBubble({ message, isGenerating }: { message: Message; isGenerating?: boolean }) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="max-w-[85%]">
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-end mb-2">
              {message.attachments.map((a, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)]">
                  <img src={a.dataUrl} alt={a.name} className="max-h-[160px] object-cover" />
                </div>
              ))}
            </div>
          )}
          {message.text && (
            <div className="glass-button bg-gradient-to-br from-purple-600/80 to-fuchsia-700/80 text-white px-4 py-3 rounded-2xl rounded-tr-sm text-[14px] leading-relaxed whitespace-pre-wrap">
              {message.text}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="w-8 h-8 flex-shrink-0 rounded-xl overflow-hidden border border-purple-500/20">
        <img 
          src="https://cdn.discordapp.com/icons/1541928149174984784/fa29c0d41945a2ad221ca0cf0c0b7409.png?size=128" 
          alt="Fex Scripts" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0 text-[14px] leading-relaxed pt-0.5">
        {isGenerating && !message.text ? (
          <div className="flex gap-1.5 pt-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 thinking-dot" />
            <span className="w-2 h-2 rounded-full bg-purple-400 thinking-dot" />
            <span className="w-2 h-2 rounded-full bg-purple-400 thinking-dot" />
          </div>
        ) : (
          <AIMessage text={message.text || ''} />
        )}
      </div>
    </div>
  );
}

// ============ EMPTY STATE ============
function EmptyState({
  activeCategory,
  onSuggestion,
  platform,
}: {
  activeCategory: string;
  onSuggestion: (s: string) => void;
  platform: Platform;
}) {
  const categories = SCRIPT_CATEGORIES[platform];
  const category = categories.find((c) => c.id === activeCategory) || categories[0];
  const prompts = QUICK_PROMPTS[platform]?.[activeCategory] || QUICK_PROMPTS[platform]?.fex || [];

  return (
    <div className="flex flex-col items-center text-center py-12 animate-slide-up">
      {/* Hero */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl overflow-hidden glass pulse-glow">
          <img 
            src="https://cdn.discordapp.com/icons/1541928149174984784/fa29c0d41945a2ad221ca0cf0c0b7409.png?size=128" 
            alt="Fex Scripts Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#131316] border-2 border-purple-500 flex items-center justify-center text-[12px]">
          {category.icon}
        </div>
      </div>

      <h1 className="text-[26px] font-bold text-white mb-2">
        <span className="gradient-text">Fex Scripts</span> Hub
      </h1>
      <p className="text-[#a1a1aa] text-[15px] max-w-[460px] leading-relaxed mb-2">
        All-in-one executor scripts for Synapse X, Script-Ware, KRNL, Fluxus & more.
      </p>
      <div className="flex items-center gap-2 mb-8">
        <span className="text-[11px] text-[#52525b] glass-button px-2.5 py-1 rounded-full">
          {category.icon} {category.name}
        </span>
        <span className="text-[11px] text-[#52525b]">•</span>
        <span className="text-[11px] text-[#52525b]">{category.desc}</span>
      </div>

      {/* Quick prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-[560px]">
        {prompts.map((p) => (
          <button
            key={p}
            onClick={() => onSuggestion(p)}
            className="group glass-button hover:bg-purple-500/10 rounded-xl p-3.5 text-left transition-all duration-200"
          >
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="3" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
              <span className="text-[13px] text-[#a1a1aa] group-hover:text-white transition-colors leading-snug">
                {p}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Supported executors */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <span className="text-[10px] text-[#52525b] uppercase tracking-wider mr-1">Works with:</span>
        {['Synapse X', 'Script-Ware', 'KRNL', 'Fluxus', 'Hydrogen', 'Delta'].map((e) => (
          <span key={e} className="text-[10px] text-[#71717a] glass-button px-2 py-0.5 rounded-full">
            {e}
          </span>
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
  const [platform, setPlatform] = useState<Platform>('roblox');
  const [activeCategory, setActiveCategory] = useState('fex');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, generating]);

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
    const categories = SCRIPT_CATEGORIES[platform];
    const cat = categories.find((c) => c.id === activeCategory);
    const newSession: ChatSession = {
      id,
      title: `${cat?.icon || '📜'} New ${cat?.name || 'Script'}`,
      messages: [],
      createdAt: Date.now(),
      platform,
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveId(id);
    setAttachments([]);
    setError('');
    setMobileMenuOpen(false);
  }, [activeCategory, platform]);

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
    if (!text || generating) return;
    setError('');

    const categories = SCRIPT_CATEGORIES[platform];
    const category = categories.find((c) => c.id === activeCategory);
    const userMsg: Message = {
      role: 'user',
      text,
      attachments: [...attachments],
    };

    const newMessages = [...messages, userMsg];

    if (messages.length === 0) {
      const title = text.length > 35 ? text.slice(0, 35) + '...' : text;
      setSessions((prev) =>
        prev.map((s) => (s.id === activeId ? { ...s, title: `${category?.icon || '📜'} ${title}`, messages: newMessages } : s))
      );
    } else {
      updateMessages(newMessages);
    }

    setInputValue('');
    setAttachments([]);
    setGenerating(true);

    // Add empty AI message
    const aiMsg: Message = { role: 'assistant', text: '' };
    const msgsWithAi = [...newMessages, aiMsg];
    updateMessages(msgsWithAi);

    // Simulate generation delay for UX
    await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 800));

    // Generate script locally
    const result = generateScript(platform, activeCategory, text);
    const fullResponse = `${result.intro}\n\n\`\`\`lua\n${result.code}\n\`\`\`\n\n${result.usage}`;

    // Simulate streaming effect
    const chunks = fullResponse.split('');
    let current = '';
    for (let i = 0; i < chunks.length; i++) {
      current += chunks[i];
      // Update in batches for performance
      if (i % 3 === 0 || i === chunks.length - 1) {
        const updatedAiMsg: Message = { role: 'assistant', text: current };
        updateMessages([...newMessages, updatedAiMsg]);
        await new Promise((resolve) => setTimeout(resolve, 2));
      }
    }

    setGenerating(false);
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

  const currentCategory = SCRIPT_CATEGORIES[platform].find((c) => c.id === activeCategory);

  return (
    <div className="flex h-screen bg-[#09090b] text-[#fafafa]">
      <Sidebar
        sessions={sessions}
        activeId={activeId}
        onSelect={(id) => { setActiveId(id); setAttachments([]); setError(''); setMobileMenuOpen(false); }}
        onNew={createNewSession}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        platform={platform}
        onPlatformChange={(p) => { setPlatform(p); setActiveCategory(SCRIPT_CATEGORIES[p][0].id); }}
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
            <div className="glass border-2 border-dashed border-purple-500 p-8 text-center">
              <div className="text-4xl mb-3">📎</div>
              <p className="text-[16px] font-semibold text-white">Drop files to attach</p>
              <p className="mt-1 text-[13px] text-[#a1a1aa]">Up to 20 MB each · max 6 files</p>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="h-14 flex items-center gap-3 px-4 glass-subtle">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-[#71717a] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg overflow-hidden glass-button">
              <img 
                src="https://cdn.discordapp.com/icons/1541928149174984784/fa29c0d41945a2ad221ca0cf0c0b7409.png?size=128" 
                alt="Fex Scripts Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-[15px] gradient-text">Fex Scripts</span>
              <span className="text-[10px] text-[#52525b] font-medium hidden sm:inline tracking-wider">ALL-IN-ONE HUB</span>
            </div>
          </div>

          {/* Category selector (mobile) */}
          <div className="lg:hidden ml-auto">
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="glass-button px-2 py-1.5 text-[11px] text-[#a1a1aa] outline-none"
            >
              {SCRIPT_CATEGORIES[platform].map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          <div className="ml-auto lg:ml-0 flex items-center gap-2">
            <span className="hidden sm:inline text-[11px] text-[#52525b] glass-button px-2.5 py-1 rounded-full">
              {currentCategory?.icon} {currentCategory?.name}
            </span>
          </div>
        </header>

        {/* Mobile sidebar overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-[280px] h-full" onClick={(e) => e.stopPropagation()}>
              <Sidebar
                sessions={sessions}
                activeId={activeId}
                onSelect={(id) => { setActiveId(id); setAttachments([]); setError(''); setMobileMenuOpen(false); }}
                onNew={createNewSession}
                activeCategory={activeCategory}
                onCategoryChange={(c) => { setActiveCategory(c); }}
                platform={platform}
                onPlatformChange={(p) => { setPlatform(p); setActiveCategory(SCRIPT_CATEGORIES[p][0].id); }}
              />
            </div>
          </div>
        )}

        {/* Messages area */}
        <div className="flex-1 overflow-auto" ref={scrollRef}>
          <div className="max-w-[820px] mx-auto px-4 sm:px-6 py-6">
            {messages.length === 0 ? (
              <EmptyState
                activeCategory={activeCategory}
                onSuggestion={(s) => {
                  setInputValue(s);
                  textareaRef.current?.focus();
                }}
                platform={platform}
              />
            ) : (
              <div className="flex flex-col gap-6">
                {messages.map((m, i) => (
                  <MessageBubble
                    key={i}
                    message={m}
                    isGenerating={generating && i === messages.length - 1 && m.role === 'assistant'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-[rgba(255,255,255,0.06)] p-4 pb-5">
          <form
            className="max-w-[820px] mx-auto"
            onSubmit={(e) => { e.preventDefault(); send(); }}
          >
            {/* Category tag */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5 text-[11px] text-[#71717a] glass-button px-2.5 py-1 rounded-full">
                <span>{currentCategory?.icon}</span>
                <span className="font-medium">{currentCategory?.name}</span>
              </div>
              <span className="text-[10px] text-[#52525b]">•</span>
              <span className="text-[10px] text-[#52525b]">Executor-ready output</span>
            </div>

            {/* Attachments */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3 animate-fade-in">
                {attachments.map((a, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] group">
                    <img src={a.dataUrl} alt={a.name} className="w-24 h-16 object-cover block" />
                    {a.kind === 'video' && (
                      <div className="absolute bottom-1 left-1 text-[10px] text-white bg-black/60 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                        🎬 {a.durationSec}s
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
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
            <div className="glass-card overflow-hidden focus-within:border-purple-500/30 focus-within:shadow-purple-500/5 transition-all duration-200">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder={`Describe what you want in your Fex Script...`}
                rows={1}
                className="w-full bg-transparent border-0 outline-none resize-none px-4 pt-3.5 pb-2 text-[14px] text-white placeholder-[#52525b] min-h-[48px]"
              />
              <input ref={imgInputRef} type="file" accept="image/*" multiple hidden onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ''; }} />
              <input ref={vidInputRef} type="file" accept="video/*" multiple hidden onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ''; }} />
              <div className="flex items-center gap-1 px-2 pb-2">
                <button type="button" onClick={() => imgInputRef.current?.click()} title="Attach image" className="w-8 h-8 rounded-lg text-[#52525b] hover:text-purple-400 hover:bg-purple-500/10 inline-flex items-center justify-center transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                </button>
                <button type="button" onClick={() => vidInputRef.current?.click()} title="Attach video" className="w-8 h-8 rounded-lg text-[#52525b] hover:text-purple-400 hover:bg-purple-500/10 inline-flex items-center justify-center transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
                </button>
                <div className="flex-1" />
                {generating ? (
                  <div className="bg-gradient-to-r from-purple-600/50 to-fuchsia-600/50 text-white px-4 py-2 rounded-xl text-[13px] font-semibold inline-flex items-center gap-1.5">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white thinking-dot" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white thinking-dot" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white thinking-dot" />
                    </div>
                    Generating...
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="glass-button bg-gradient-to-r from-purple-600/90 to-fuchsia-600/90 text-white px-4 py-2 text-[13px] font-semibold inline-flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    Generate
                  </button>
                )}
              </div>
            </div>
            <p className="text-center text-[10px] text-[#3f3f46] mt-3">
              Fex Scripts — All-in-one executor hub. Use responsibly.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
