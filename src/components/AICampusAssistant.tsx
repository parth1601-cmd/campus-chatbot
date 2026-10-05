import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Plus,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  GraduationCap,
  BookOpen,
  DollarSign,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { ViewId } from '../types';
import { STUDENT_PERSONA, KJIT_ADMISSION_DATA } from '../data/zanzeeData';
import { KJCLogo } from './KJCLogo';
import { apiFetch } from '../lib/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  sources?: Array<{
    title: string;
    department?: string;
    section?: string;
  }>;
}

interface Conversation {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  messages: ChatMessage[];
}

interface AICampusAssistantProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
  onNavigate: (view: ViewId, payload?: string) => void;
  onShowToast: (msg: string) => void;
}

const DEFAULT_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    title: 'KJIT PG Admissions & Fees',
    preview: 'Eligibility criteria and fee structure for MCA and M.Sc...',
    timestamp: 'Today',
    messages: [
      {
        id: 'msg-init-1',
        sender: 'user',
        text: 'What are the programs and fee structure for Institute of Technology at Kristu Jayanti?',
        timestamp: '10:00 AM',
      },
      {
        id: 'msg-init-2',
        sender: 'ai',
        text: `## Kristu Jayanti Institute of Technology — Official Admissions (2026 Batch)

Welcome to the Postgraduate Department of Computer Science under Kristu Jayanti (Deemed to be University), Bengaluru. Here are our premier two-year full-time postgraduate programmes:

### 1. Master of Computer Applications (MCA) — 2 Years
* **Academic Fee:** Year I: ₹1,90,000 | Year II: ₹1,90,000
* **Admission Registration Fee:** ₹5,000 (Non-Refundable)
* **Application Processing Fee:** ₹1,500
* **Eligibility:** Bachelor’s degree in Arts, Science, Commerce, or Engineering with at least 50% marks (45% for SC/ST). Must have studied Mathematics at 10+2 Higher Secondary or UG level. (Mandatory Bridge Course in Mathematics provided for entrants without a maths background).

### 2. M.Sc. Data Science — 2 Years
* **Academic Fee:** Year I: ₹1,40,000 | Year II: ₹1,40,000
* **Admission Registration Fee:** ₹5,000 (Non-Refundable)
* **Application Processing Fee:** ₹1,200
* **Eligibility:** B.Sc. Data Science / Analytics / Computer Science / BCA / B.E. / B.Tech or B.Sc. Maths / Statistics / Physics / Electronics with min. 50% (45% for SC/ST). Bridge course in CS provided for non-CS graduates.

### 3. M.Sc. Cyber Security — 2 Years
* **Academic Fee:** Year I: ₹1,50,000 | Year II: ₹1,50,000
* **Admission Registration Fee:** ₹5,000 (Non-Refundable)
* **Application Processing Fee:** ₹1,200
* **Eligibility:** Bachelor’s degree in Computer Science, Computer Applications, IT, or equivalent (50% aggregate, 45% for SC/ST).

*Note: The Management / University strictly does not collect any type of Capitation fees or Donation.*`,
        timestamp: '10:00 AM',
        sources: [
          {
            title: 'Institute of Technology Admission & Fee Structure 2026',
            department: 'Postgraduate Department of Computer Science',
            section: 'Official Bulletin (admission.php)',
          },
        ],
      },
    ],
  },
];

const PROMPT_SUGGESTIONS = [
  'Teach me AVL rotations (LL, RR, LR, RL) simply',
  'Explain Dijkstra’s algorithm step by step with an example',
  'Give me a 5-mark exam answer on 3NF vs BCNF',
  'Generate an MCQ quiz on Python lists vs tuples',
];

// Helper to render markdown-like text cleanly
function FormattedMessage({ text }: { text: string }) {
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeBlockLang = '';
  let codeBlockCounter = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block boundary
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        const codeContent = codeBuffer.join('\n');
        const currentIdx = codeBlockCounter++;
        elements.push(
          <div key={`code-${i}`} className="my-3 rounded-lg overflow-hidden border border-stone-800 bg-[#141210] text-stone-100 font-mono text-xs">
            <div className="flex items-center justify-between px-3 py-1.5 bg-stone-900 border-b border-stone-800 text-[11px] text-stone-400">
              <span>{codeBlockLang || 'code'}</span>
              <button
                type="button"
                onClick={() => handleCopyCode(codeContent, currentIdx)}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                {copiedCodeIdx === currentIdx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 overflow-x-auto">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeBlockLang = line.trim().replace(/^```/, '');
        codeBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    const trimmed = line.trim();

    if (!trimmed) {
      elements.push(<div key={`empty-${i}`} className="h-2" />);
      continue;
    }

    // Markdown table block: 2+ consecutive | ... | lines (header + rows).
    // Rendered in a horizontally scrollable container so wide comparison
    // tables never force page-level horizontal scrolling on phones.
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines: string[] = [];
      let j = i;
      while (j < lines.length) {
        const t = lines[j].trim();
        if (!t.startsWith('|') || !t.endsWith('|')) break;
        tableLines.push(t);
        j++;
      }
      if (tableLines.length >= 2) {
        const parseRow = (row: string) =>
          row
            .slice(1, -1)
            .split('|')
            .map((c) => c.trim());
        const isSeparator = (row: string) => /^[:\-|\s]+$/.test(row);
        const header = parseRow(tableLines[0]);
        const startIdx = tableLines.length > 1 && isSeparator(tableLines[1]) ? 2 : 1;
        const body = tableLines.slice(startIdx).map(parseRow);
        const colCount = Math.max(header.length, ...body.map((r) => r.length), 1);
        const norm = (r: string[]) => {
          const copy = [...r];
          while (copy.length < colCount) copy.push('');
          return copy.slice(0, colCount);
        };
        elements.push(
          <div key={`tbl-${i}`} className="my-3 -mx-1 overflow-x-auto rounded-lg border border-stone-300">
            <table className="w-full min-w-[420px] border-collapse text-xs sm:text-[13px] leading-relaxed">
              <thead>
                <tr className="bg-[#EAE2D3]">
                  {norm(header).map((cell, ci) => (
                    <th
                      key={ci}
                      className="p-2 text-left font-bold text-stone-900 border-b-2 border-stone-400 border-r border-stone-300 last:border-r-0 break-words"
                    >
                      {renderInlineMarkdown(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {body.map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 1 ? 'bg-stone-100/50' : undefined}>
                    {norm(row).map((cell, ci) => (
                      <td
                        key={ci}
                        className="p-2 text-stone-800 align-top border-r border-stone-200 last:border-r-0 break-words"
                      >
                        {renderInlineMarkdown(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        i = j - 1;
        continue;
      }
      // Single |...| line: fall through to paragraph rendering below.
    }

    // Blockquote: consecutive lines starting with '>'
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      let j = i;
      while (j < lines.length && lines[j].trim().startsWith('>')) {
        quoteLines.push(lines[j].trim().replace(/^>\s?/, ''));
        j++;
      }
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="my-2 border-l-4 border-[#1E3A8A] bg-stone-100/70 pl-3 pr-2 py-2 text-sm leading-relaxed text-stone-800 space-y-1"
        >
          {quoteLines.map((q, qi) => (
            <p key={qi}>{renderInlineMarkdown(q)}</p>
          ))}
        </blockquote>
      );
      i = j - 1;
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      elements.push(<hr key={`hr-${i}`} className="my-3 border-stone-300" />);
      continue;
    }

    // Heading 1 (# ...)
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h2 key={`h1-${i}`} className="font-serif text-lg font-bold text-stone-950 mt-3 mb-1.5 border-b border-stone-300 pb-1">
          {trimmed.replace(/^#\s+/, '')}
        </h2>
      );
      continue;
    }

    // Heading 2 (## ...)
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h3 key={`h2-${i}`} className="font-serif text-base font-bold text-stone-950 mt-2.5 mb-1 text-[#1E3A8A]">
          {trimmed.replace(/^##\s+/, '')}
        </h3>
      );
      continue;
    }

    // Heading 3 (### ...)
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={`h3-${i}`} className="font-serif text-sm font-bold text-stone-900 mt-2 mb-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A8A]" />
          {trimmed.replace(/^###\s+/, '')}
        </h4>
      );
      continue;
    }

    // Numbered list (1. ...)
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      elements.push(
        <div key={`num-${i}`} className="flex items-start gap-2.5 pl-1 py-0.5">
          <span className="w-5 h-5 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5 shadow-sm">
            {numMatch[1]}
          </span>
          <div className="flex-1 text-sm leading-relaxed text-stone-900">
            {renderInlineMarkdown(numMatch[2])}
          </div>
        </div>
      );
      continue;
    }

    // Bullet point (* ... or - ...)
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      const content = trimmed.replace(/^[-*]\s+/, '');
      elements.push(
        <div key={`bullet-${i}`} className="flex items-start gap-2 pl-2 py-0.5">
          <span className="text-stone-500 font-bold shrink-0 mt-0.5">•</span>
          <div className="flex-1 text-sm leading-relaxed text-stone-900">
            {renderInlineMarkdown(content)}
          </div>
        </div>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="text-sm leading-relaxed text-stone-900">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  }

  return <div className="space-y-1">{elements}</div>;
}

function renderInlineMarkdown(text: string) {
  // Bold **text** and `code`
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={i} className="font-bold text-stone-950">
          {renderLinkified(part.slice(2, -2), `b-${i}`)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code key={i} className="font-mono text-xs px-1.5 py-0.5 bg-stone-100 border border-stone-300 rounded text-stone-900 font-semibold break-all">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={i}>{renderLinkified(part, `t-${i}`)}</React.Fragment>;
  });
}

/**
 * Markdown links [text](url), images ![alt](src), and bare URLs inside a
 * plain-text segment. Long URLs wrap (break-all) so they never force
 * horizontal scrolling on narrow phones.
 */
function renderLinkified(text: string, keyPrefix: string): React.ReactNode[] {
  const pattern = /(!\[[^\]]*\]\([^)\s]+\))|(\[[^\]]+\]\([^)\s]+\))|(https?:\/\/[^\s)<\]]+)/g;
  const out: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let k = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith('!')) {
      const alt = token.slice(2, token.indexOf(']'));
      const src = token.slice(token.indexOf('(') + 1, token.lastIndexOf(')'));
      out.push(
        <img
          key={`${keyPrefix}-${k++}`}
          src={src}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="my-2 max-w-full h-auto rounded-lg border border-stone-300"
        />
      );
    } else if (token.startsWith('[')) {
      const label = token.slice(1, token.indexOf(']'));
      const href = token.slice(token.indexOf('(') + 1, token.lastIndexOf(')'));
      out.push(
        <a
          key={`${keyPrefix}-${k++}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1E3A8A] underline underline-offset-2 break-words font-medium"
        >
          {label}
        </a>
      );
    } else {
      out.push(
        <a
          key={`${keyPrefix}-${k++}`}
          href={token}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1E3A8A] underline underline-offset-2 break-all"
        >
          {token}
        </a>
      );
    }
    last = match.index + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export const AICampusAssistant: React.FC<AICampusAssistantProps> = ({
  initialPrompt,
  onClearInitialPrompt,
  onNavigate,
  onShowToast,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('kjit_ai_chat_conversations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_CONVERSATIONS;
      }
    }
    return DEFAULT_CONVERSATIONS;
  });

  const [activeConversationId, setActiveConversationId] = useState<string>(
    conversations[0]?.id || 'conv-1'
  );
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Save conversations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kjit_ai_chat_conversations', JSON.stringify(conversations));
    } catch {
      // Ignore quota error
    }
  }, [conversations]);

  // Scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, isLoading, activeConversationId]);

  // Handle external initialPrompt (from other parts of the app)
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt.trim());
      onClearInitialPrompt?.();
    }
  }, [initialPrompt]);

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) ||
    conversations[0] || {
      id: 'conv-new',
      title: 'New Chat',
      preview: '',
      timestamp: 'Just now',
      messages: [],
    };

  const handleStartNewChat = () => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: 'New Chat',
      preview: 'Empty conversation',
      timestamp: 'Just now',
      messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
    setInput('');
    setTimeout(() => inputRef.current?.focus(), 100);
    onShowToast('Started a new chat session');
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = conversations.filter((c) => c.id !== id);
    if (remaining.length === 0) {
      const freshId = `conv-${Date.now()}`;
      const freshConv: Conversation = {
        id: freshId,
        title: 'New Chat',
        preview: 'Empty conversation',
        timestamp: 'Just now',
        messages: [],
      };
      setConversations([freshConv]);
      setActiveConversationId(freshId);
    } else {
      setConversations(remaining);
      if (activeConversationId === id) {
        setActiveConversationId(remaining[0].id);
      }
    }
    onShowToast('Conversation deleted');
  };

  const handleCopyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    onShowToast('Copied to clipboard');
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isLoading) return;

    setInput('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Update conversation with user message
    const currentMessages = activeConversation.messages;
    const updatedMessages = [...currentMessages, userMessage];

    const updatedTitle =
      currentMessages.length === 0
        ? messageText.length > 28
          ? messageText.slice(0, 28) + '...'
          : messageText
        : activeConversation.title;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? {
              ...c,
              title: updatedTitle,
              preview: messageText,
              timestamp: 'Just now',
              messages: updatedMessages,
            }
          : c
      )
    );

    setIsLoading(true);

    try {
      // Build history of recent conversation turns for context
      const historyTurns = currentMessages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        text: m.text,
      }));

      const res = await apiFetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: messageText,
          history: historyTurns,
        }),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        console.warn(`[CampusAI] POST /api/ai/chat failed: HTTP ${res.status}`, body.slice(0, 300));
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'Here is the verified information for your request.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || [],
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? {
                ...c,
                messages: [...updatedMessages, aiMessage],
                preview: (data.reply || '').slice(0, 60) + '...',
              }
            : c
        )
      );
    } catch (err) {
      console.warn('[CampusAI] chat request failed. If deployed, set VITE_API_URL to the backend URL and add GROQ_API_KEY etc. in the host env dashboard:', err);
      const errorMessage: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: 'I encountered an issue connecting to the university server. Please check your network connection and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? {
                ...c,
                messages: [...updatedMessages, errorMessage],
              }
            : c
        )
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <div className="h-[calc(100vh-250px)] h-[calc(100dvh-250px)] min-h-[380px] sm:h-[calc(100vh-140px)] sm:min-h-[600px] flex flex-col md:flex-row border-2 border-[#141210] bg-[#FBF9F5] shadow-[4px_4px_0px_#141210] overflow-hidden relative min-h-0">
      {/* ================================================================
          CONVERSATION SIDEBAR (overlay drawer on mobile/tablet)
          ================================================================ */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close chat history"
          onClick={() => setIsSidebarOpen(false)}
          className="absolute inset-0 z-10 bg-black/40 cursor-default md:hidden"
        />
      )}
      {isSidebarOpen && (
        <aside
          id="chat-history-panel"
          aria-label="Chat history"
          className="absolute md:static z-20 h-full md:h-auto w-64 sm:w-72 max-w-[85vw] bg-[#EFE9DD] border-r-2 border-[#141210] flex flex-col justify-between shrink-0 shadow-[4px_0_0_rgba(0,0,0,0.15)] md:shadow-none min-h-0"
        >
          {/* Sidebar Top: New Chat Button & Conversation List */}
          <div className="p-3 flex-1 flex flex-col overflow-hidden min-h-0">
            <button
              type="button"
              onClick={handleStartNewChat}
              className="w-full py-2.5 px-3 bg-[#141210] hover:bg-[#1E3A8A] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#141210] shadow-[2px_2px_0px_#141210] transition-colors cursor-pointer mb-3"
            >
              <Plus className="w-4 h-4" />
              <span>New Chat</span>
            </button>

            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-600 px-1 mb-2">
              Chat History
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain space-y-1.5 pr-1">
              {conversations.map((conv) => {
                const isActive = conv.id === activeConversationId;
                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setActiveConversationId(conv.id);
                      if (window.matchMedia('(max-width: 767px)').matches) setIsSidebarOpen(false);
                    }}
                    className={`group relative p-2.5 rounded border text-left cursor-pointer transition-all ${
                      isActive
                        ? 'bg-white border-[#141210] shadow-[2px_2px_0px_#141210]'
                        : 'bg-transparent border-transparent hover:bg-stone-200/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#1E3A8A]' : 'text-stone-500'}`} />
                        <span className={`text-xs font-medium truncate ${isActive ? 'text-stone-950 font-bold' : 'text-stone-700'}`}>
                          {conv.title}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteConversation(conv.id, e)}
                        className="opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100 text-stone-400 hover:text-red-700 transition-opacity p-1.5 min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="Delete chat"
                        aria-label={`Delete ${conv.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[10px] text-stone-500 truncate mt-0.5 pl-5">
                      {conv.preview || 'No messages yet'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar Bottom: Student Persona Profile & Official Admissions Link */}
          <div className="p-3 border-t border-stone-300 bg-[#E8E1D3]/70 space-y-2">
            <div className="flex items-center gap-2">
              <KJCLogo variant="emblem" size="sm" />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-stone-950 truncate">
                  {STUDENT_PERSONA.name}
                </div>
                <div className="text-[10px] text-stone-600 truncate">
                  Kristu Jayanti Institute of Technology
                </div>
              </div>
            </div>
            <a
              href={KJIT_ADMISSION_DATA.contact.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-[#1E3A8A] hover:underline flex items-center gap-1 font-mono pt-1"
            >
              <span>Official Admissions Portal</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </aside>
      )}

      {/* ================================================================
          MAIN CHAT COMPONENT
         ================================================================ */}
      <section className="flex-1 flex flex-col justify-between bg-white min-w-0 min-h-0">
        {/* Top Chat Header */}
        <header className="px-3 sm:px-4 py-3 bg-[#EAE2D3] border-b-2 border-[#141210] flex items-center justify-between gap-2 sm:gap-3 flex-wrap shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-expanded={isSidebarOpen}
              aria-controls="chat-history-panel"
              aria-label={isSidebarOpen ? 'Hide chat history' : 'Show chat history'}
              className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-stone-200 border border-stone-400 bg-white transition-colors cursor-pointer"
              title={isSidebarOpen ? 'Hide Chat History' : 'Show Chat History'}
            >
              {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <KJCLogo variant="emblem" size="sm" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-sm sm:text-base font-bold text-stone-950 truncate">
                    Kristu Jayanti AI Chat
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-100 border border-emerald-800 text-emerald-950 text-[10px] font-mono font-bold uppercase">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" />
                    Verified AI
                  </span>
                </div>
                <div className="text-[10px] text-stone-600 truncate font-mono">
                  Postgraduate Dept. of Computer Science · Groq AI
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleStartNewChat}
              className="px-2.5 py-2 sm:py-1 min-h-[40px] sm:min-h-0 text-xs font-mono font-medium text-stone-800 bg-white border border-[#141210] hover:bg-stone-100 transition-colors cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('admissions')}
              className="px-2.5 py-2 sm:py-1 min-h-[40px] sm:min-h-0 text-xs font-mono font-bold text-white bg-[#1E3A8A] hover:bg-[#141210] border border-[#141210] transition-colors cursor-pointer flex items-center gap-1"
            >
              <GraduationCap className="w-3 h-3" />
              <span className="hidden min-[400px]:inline">Admissions</span>
            </button>
          </div>
        </header>

        {/* Message Viewport */}
        <div className="flex-1 min-h-0 min-w-0 p-3 sm:p-6 space-y-4 overflow-y-auto overscroll-contain touch-pan-y">
          {activeConversation.messages.length === 0 ? (
            /* ================================================================
               EMPTY STATE: WELCOME & PROMPT CHIPS
               ================================================================ */
            <div className="py-6 sm:py-8 px-1 max-w-2xl mx-auto text-center space-y-5 sm:space-y-6 animate-fadeIn">
              <div className="flex justify-center">
                <div className="p-3 bg-[#F5F0E6] rounded-full border-2 border-[#141210] shadow-[2px_2px_0px_#141210]">
                  <KJCLogo variant="emblem" size="lg" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="inline-block max-w-full font-mono text-[10px] uppercase tracking-widest text-stone-600 border border-stone-400 bg-[#F5F0E6] px-2.5 py-0.5 break-words">
                  KRISTU JAYANTI INSTITUTE OF TECHNOLOGY
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950">
                  How can I help you today?
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
                  Your MCA Semester-I assessment assistant — Data Structures, Python, Java/Web,
                  Mathematical Foundations & ADBMS. Ask to learn, solve, quiz or revise any unit.
                </p>
              </div>

              {/* Clean Quick Prompt Suggestions */}
              <div className="pt-2 space-y-2 text-left">
                <div className="text-[11px] font-mono font-bold uppercase text-stone-600 text-center">
                  Recommended Inquiries:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PROMPT_SUGGESTIONS.map((promptText, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(promptText)}
                      className="p-3 min-h-[44px] bg-[#FAF8F5] hover:bg-[#F0ECE1] border border-stone-300 hover:border-[#141210] transition-all text-left text-xs text-stone-800 font-medium cursor-pointer shadow-sm hover:shadow"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="min-w-0 break-words">{promptText}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ================================================================
               MESSAGE STREAM
               ================================================================ */
            <div className="space-y-4 max-w-3xl mx-auto">
              {activeConversation.messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 sm:gap-3 min-w-0 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div
                        aria-hidden="true"
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-stone-800 bg-[#1E3A8A] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 overflow-hidden [&_svg]:w-full [&_svg]:h-full"
                      >
                        <KJCLogo variant="emblem" size="sm" />
                      </div>
                    )}

                    <div
                      className={`max-w-[calc(100%-2.5rem)] sm:max-w-[75%] min-w-0 break-words rounded-lg p-3 sm:p-4 text-sm leading-relaxed ${
                        isUser
                          ? 'bg-[#141210] text-white border border-[#141210] shadow-[2px_2px_0px_#141210]'
                          : 'bg-[#FBF9F5] text-stone-900 border border-stone-300 shadow-[2px_2px_0px_rgba(0,0,0,0.05)]'
                      }`}
                    >
                      {isUser ? (
                        <div className="whitespace-pre-wrap font-sans [overflow-wrap:anywhere]">{msg.text}</div>
                      ) : (
                        <div className="ai-content-wrap">
                          <FormattedMessage text={msg.text} />

                          {/* Sources citation footer if present */}
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-3 pt-2.5 border-t border-stone-200 text-[11px] font-mono text-stone-500">
                              <span className="font-semibold text-stone-700">Official Source: </span>
                              {msg.sources.map((s, idx) => (
                                <span key={idx}>
                                  {s.title} ({s.department || 'Institute of Technology'})
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Action Toolbar on AI message (Clean copy button) */}
                          <div className="mt-2.5 pt-1.5 flex items-center justify-between text-[11px] text-stone-500">
                            <span className="font-mono text-[10px]">{msg.timestamp}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyMessage(msg.text, msg.id)}
                              className="flex items-center gap-1 hover:text-stone-900 transition-colors cursor-pointer px-1.5 py-0.5 rounded border border-transparent hover:border-stone-300"
                              title="Copy response"
                            >
                              {copiedMessageId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-700">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-start gap-2 sm:gap-3 justify-start min-w-0" role="status" aria-live="polite">
                  <div
                    aria-hidden="true"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-stone-800 bg-[#1E3A8A] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 overflow-hidden [&_svg]:w-full [&_svg]:h-full"
                  >
                    <KJCLogo variant="emblem" size="sm" />
                  </div>
                  <div className="min-w-0 max-w-full p-3 bg-[#FBF9F5] border border-stone-300 rounded-lg text-xs font-mono text-stone-600 flex items-center gap-2 flex-wrap">
                    <span className="w-2 h-2 rounded-full bg-[#1E3A8A] animate-pulse shrink-0" />
                    <span>Kristu Jayanti AI is thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ================================================================
            CLEAN INPUT BAR ("Remove all things from the button")
            - Pure input field
            - Clean single send button
            - No paperclip, no mic, no extra clutter
           ================================================================ */}
        <div className="p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-[#EAE2D3] border-t-2 border-[#141210] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 max-w-3xl mx-auto"
          >
            <label htmlFor="campus-ai-input" className="sr-only">
              Ask the Campus AI assistant
            </label>
            <input
              id="campus-ai-input"
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask to learn, solve, quiz or revise…"
              autoComplete="off"
              enterKeyHint="send"
              className="min-w-0 flex-1 px-3 sm:px-4 py-2.5 text-base sm:text-sm bg-white border-2 border-[#141210] placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] shadow-[2px_2px_0px_#141210]"
              disabled={isLoading}
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className="shrink-0 min-h-[44px] px-3 sm:px-5 py-2.5 bg-[#141210] hover:bg-[#1E3A8A] text-white text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 border-2 border-[#141210] transition-colors cursor-pointer disabled:opacity-50 shadow-[2px_2px_0px_#141210]"
              title="Send message"
            >
              <span className="hidden min-[380px]:inline">Send</span>
              <Send className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </form>

          <div className="mt-1.5 text-center text-[10px] font-mono text-stone-500">
            Kristu Jayanti Institute of Technology (Deemed to be University) · Official Academic AI
          </div>
        </div>
      </section>
    </div>
  );
};
