import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Paperclip,
  Mic,
  Volume2,
  Plus,
  Search,
  FileText,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  X,
  Loader2,
  ShieldAlert,
  GraduationCap,
  BookOpen,
  Calendar,
  DollarSign,
  Laptop,
  Compass,
  Check,
  Award,
  Sparkles,
  MessageSquare,
  RefreshCw,
  Bookmark,
  MapPin,
  Clock,
  ChevronRight,
  ShieldCheck,
  ChevronDown,
  Trash2,
  ArrowRight,
  Lightbulb,
  CheckSquare,
  Square,
} from 'lucide-react';
import {
  ChatMessage,
  RAGSource,
  ViewId,
  CampusResponseMode,
  AssistantConversation,
} from '../types';
import {
  STUDENT_PERSONA,
  DEFAULT_ASSISTANT_CONVERSATIONS,
  INITIAL_CHAT_MESSAGES,
  COURSES,
  CALENDAR_EVENTS,
  CAMPUS_SERVICES,
} from '../data/zanzeeData';

interface AICampusAssistantProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
  onNavigate: (view: ViewId, payload?: string) => void;
  onShowToast: (msg: string) => void;
}

const SHORTCUT_BUTTONS = [
  {
    id: 'sc-academics',
    icon: GraduationCap,
    label: 'Academics',
    prompt: "What's my GPA and degree progress?",
    color: 'border-blue-900 text-blue-900 bg-blue-50/50',
  },
  {
    id: 'sc-courses',
    icon: BookOpen,
    label: 'Courses',
    prompt: 'Show my enrolled courses and grades',
    color: 'border-emerald-900 text-emerald-900 bg-emerald-50/50',
  },
  {
    id: 'sc-assignments',
    icon: FileText,
    label: 'Assignments',
    prompt: 'What assignments are due this week?',
    color: 'border-amber-900 text-amber-900 bg-amber-50/50',
  },
  {
    id: 'sc-schedule',
    icon: Calendar,
    label: 'Schedule',
    prompt: 'What classes do I have tomorrow?',
    color: 'border-purple-900 text-purple-900 bg-purple-50/50',
  },
  {
    id: 'sc-finaid',
    icon: DollarSign,
    label: 'Financial Aid',
    prompt: 'I need financial aid help. What documents are missing and when is tuition due?',
    color: 'border-stone-900 text-stone-900 bg-stone-100',
  },
  {
    id: 'sc-it',
    icon: Laptop,
    label: 'IT Support',
    prompt: 'My Wi-Fi isn’t working on campus.',
    color: 'border-blue-800 text-blue-800 bg-sky-50/50',
  },
  {
    id: 'sc-library',
    icon: Compass,
    label: 'Library',
    prompt: 'Find a book about machine learning. Where is the library and is it open?',
    color: 'border-stone-800 text-stone-800 bg-stone-50',
  },
  {
    id: 'sc-services',
    icon: MapPin,
    label: 'Campus Services',
    prompt: 'Where is the advising center and health services?',
    color: 'border-amber-800 text-amber-800 bg-amber-50/30',
  },
];

function renderFormattedInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-stone-950 bg-amber-50/70 px-0.5 rounded">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="font-mono text-xs px-1.5 py-0.5 bg-stone-100 border border-stone-300 rounded text-stone-900 font-semibold">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function StudentFriendlyPointsContent({ text, isAi }: { text: string; isAi: boolean }) {
  if (!isAi) {
    return <div className="text-sm leading-relaxed whitespace-pre-line font-sans">{text}</div>;
  }

  const lines = text.split('\n');
  return (
    <div className="space-y-2 text-sm text-stone-900 font-sans">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Heading 2: ## ...
        if (trimmed.startsWith('## ')) {
          const title = trimmed.replace(/^##\s+/, '');
          return (
            <div key={idx} className="mt-3 mb-2 pt-2 border-t border-stone-200 first:border-t-0 first:pt-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#141210] text-white font-mono text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{title}</span>
              </div>
            </div>
          );
        }

        // Heading 3: ### ...
        if (trimmed.startsWith('### ')) {
          const title = trimmed.replace(/^###\s+/, '');
          return (
            <div key={idx} className="mt-2.5 mb-1.5">
              <h4 className="font-serif font-bold text-sm text-stone-950 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#6E261A] rounded-full inline-block" />
                {title}
              </h4>
            </div>
          );
        }

        // Numbered list item: 1. ... or 2. ...
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numberedMatch) {
          const num = numberedMatch[1];
          const content = numberedMatch[2];
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1 py-1 group bg-stone-50/70 hover:bg-stone-50 px-2 rounded border border-transparent hover:border-stone-200 transition-colors">
              <span className="w-5 h-5 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5 shadow-sm">
                {num}
              </span>
              <div className="flex-1 leading-snug">
                {renderFormattedInline(content)}
              </div>
            </div>
          );
        }

        // Bullet point: - ... or * ...
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const content = trimmed.slice(2);
          return (
            <div key={idx} className="flex items-start gap-2 pl-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6E261A] shrink-0 mt-2" />
              <div className="flex-1 leading-snug">
                {renderFormattedInline(content)}
              </div>
            </div>
          );
        }

        // Standard text paragraph
        return (
          <p key={idx} className="leading-relaxed">
            {renderFormattedInline(line)}
          </p>
        );
      })}
    </div>
  );
}

function getSimplifiedStudentBreakdown(msg: ChatMessage) {
  const t = (msg.text || '').toLowerCase();

  if (t.includes('recursion') || t.includes('tree') || t.includes('teach me')) {
    return {
      title: 'Recursion Explained in 3 Plain-English Points',
      inSimpleWords: 'Recursion is like breaking down a large chore into smaller identical chores until the job is small enough to do in 1 second.',
      points: [
        'Point 1 (The Stop Sign): Always tell the computer when to stop (the base case). If you forget, your program loops forever and crashes (Stack Overflow).',
        'Point 2 (The Step Forward): Make the problem slightly smaller each time you call the function again.',
        'Point 3 (The Payoff): Once the smallest piece is solved, the answers chain back together to solve the entire big problem.',
      ],
      analogy: 'Russian nesting dolls: open the big doll, find the smaller doll inside, and repeat until you hit the solid baby doll inside.',
      whatToDo: 'Practice on paper by tracing 1 simple case: a tree with just 3 numbers!',
    };
  }

  if (t.includes('class') || t.includes('tomorrow') || t.includes('schedule')) {
    return {
      title: 'Your Schedule in 3 Plain-English Points',
      inSimpleWords: 'You have 3 classes scheduled tomorrow starting at 10:00 AM, with zero room or time conflicts.',
      points: [
        'Point 1: 10:00 AM — CS 201 (Data Structures) in Room 204.',
        'Point 2: 1:00 PM — MATH 210 (Discrete Math) in Room 108.',
        'Point 3: 3:00 PM — BIO 101 (General Biology) in the Science Building.',
      ],
      analogy: 'Think of your day as 3 focused 90-minute blocks with time for lunch at 11:30 AM in the Campus Center.',
      whatToDo: 'Pack your lab safety goggles for Biology and review your Binary Trees code for CS 201.',
    };
  }

  if (t.includes('register') || t.includes('credit') || t.includes('graduate')) {
    return {
      title: 'Degree & Registration in 3 Plain-English Points',
      inSimpleWords: 'You are on track to graduate on time! You need 48 more credits, and registration opens on October 12.',
      points: [
        'Point 1: You have 72 of 120 credits completed (60% done with your degree).',
        'Point 2: Spring 2027 registration window opens October 12 at 8:00 AM sharp.',
        'Point 3: 4 recommended courses are pre-approved with all prerequisites already met.',
      ],
      analogy: 'A 120-credit degree is like running a 10K race: you have already run 6 kilometers and have 4 kilometers left!',
      whatToDo: 'Save your 4 preferred course CRNs in your planner so you can click register the moment the clock hits 8:00 AM.',
    };
  }

  if (t.includes('financial aid') || t.includes('fafsa') || t.includes('aid') || t.includes('bill')) {
    return {
      title: 'Financial Aid in 3 Plain-English Points',
      inSimpleWords: 'Your aid package is approved, but the college needs 1 signed form before releasing your funds.',
      points: [
        'Point 1: Total aid package is $22,400 for the year ($11,200 for this Fall).',
        'Point 2: Form FA-104 (Proof of Enrollment) is required by October 15.',
        'Point 3: Once uploaded, your aid applies automatically to clear your remaining balance.',
      ],
      analogy: 'Like picking up a package at the post office: the package is there waiting, you just need to show your ID form to pick it up.',
      whatToDo: 'Download Form FA-104 from the Financial Aid portal, sign it, and upload it before October 15.',
    };
  }

  if (t.includes('wi-fi') || t.includes('wifi') || t.includes('it ') || t.includes('login')) {
    return {
      title: 'Wi-Fi Fix in 3 Plain-English Points',
      inSimpleWords: 'The campus updated its security certificate. Your phone or laptop just needs to trust the new certificate.',
      points: [
        'Point 1: Tap "Forget Network" on Zanzee-Secure in your device settings.',
        'Point 2: Tap Zanzee-Secure again, type your student email and password.',
        'Point 3: When asked to accept the "auth.zanzee.edu" certificate, tap "Trust / Accept".',
      ],
      analogy: 'Like replacing an expired keycard with a new one at the campus security desk.',
      whatToDo: 'If it still fails, visit the IT desk at Turing Hall ground floor — they can fix it in 60 seconds.',
    };
  }

  return {
    title: 'Summary Points for Clear Student Understanding',
    inSimpleWords: 'Here is the key takeaway from this message broken down into plain points with zero confusion.',
    points: [
      'Point 1 (Main Action): Check your urgent deadlines and verify your official student status.',
      'Point 2 (Official Record): Information is pulled directly from your authorized student record and college handbook.',
      'Point 3 (Next Step): Use the action buttons below or ask another question to get things done.',
    ],
    analogy: 'Campus Assistant acts like your personal university guide, keeping all records organized in one spot.',
    whatToDo: 'Click any action button below to jump straight to that campus tool or ask for more details.',
  };
}

export const AICampusAssistant: React.FC<AICampusAssistantProps> = ({
  initialPrompt,
  onClearInitialPrompt,
  onNavigate,
  onShowToast,
}) => {
  // ChatGPT-Style Multi-Conversation Archive
  const [conversations, setConversations] = useState<AssistantConversation[]>(
    DEFAULT_ASSISTANT_CONVERSATIONS
  );
  const [activeConversationId, setActiveConversationId] = useState<string>('conv-reg');
  const [searchConv, setSearchConv] = useState('');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<RAGSource | null>(null);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  // Interactive UI states for rich cards
  const [registeredCourseCodes, setRegisteredCourseCodes] = useState<string[]>(['CS 310']);
  const [savedReminders, setSavedReminders] = useState<string[]>([]);
  const [finaidUploaded, setFinaidUploaded] = useState(false);
  const [itStepsCompleted, setItStepsCompleted] = useState<number[]>([0]);
  const [itPingResult, setItPingResult] = useState<string | null>(null);
  const [reservedBooks, setReservedBooks] = useState<string[]>([]);
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);
  const [bookedAdvisor, setBookedAdvisor] = useState(false);
  const [rsvpdEvents, setRsvpdEvents] = useState<string[]>([]);
  const [simplePointsMode, setSimplePointsMode] = useState<boolean>(true);
  const [expandedSimplePoints, setExpandedSimplePoints] = useState<Record<string, boolean>>({});
  const [checkedChecklistItems, setCheckedChecklistItems] = useState<string[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Find active conversation
  const currentConversation =
    conversations.find((c) => c.id === activeConversationId) ||
    conversations[0] || {
      id: 'default',
      title: 'New Conversation',
      timestamp: 'Now',
      preview: 'Empty chat',
      messages: [],
    };

  const messages = currentConversation.messages;

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendPrompt(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleStartNewConversation = () => {
    const newId = `conv-${Date.now()}`;
    const newConv: AssistantConversation = {
      id: newId,
      title: 'New Conversation',
      category: 'General',
      timestamp: 'Just now',
      preview: 'Ask Campus Assistant anything...',
      messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
    setErrorBanner(null);
    onShowToast('Started a new conversation');
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (conversations.length <= 1) {
      handleStartNewConversation();
      return;
    }
    const filtered = conversations.filter((c) => c.id !== id);
    setConversations(filtered);
    if (activeConversationId === id) {
      setActiveConversationId(filtered[0].id);
    }
    onShowToast('Conversation deleted');
  };

  const handleSendPrompt = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed) return;

    setErrorBanner(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'student',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel: 'Web Chat',
      attachment: attachedFileName || undefined,
    };

    // Update active conversation with user message immediately
    const updatedMessages = [...messages, userMsg];
    const derivedTitle =
      messages.length === 0
        ? trimmed.length > 28
          ? trimmed.slice(0, 26) + '...'
          : trimmed
        : currentConversation.title;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? {
              ...c,
              title: derivedTitle,
              preview: trimmed,
              timestamp: 'Just now',
              messages: updatedMessages,
            }
          : c
      )
    );

    setInput('');
    const currentAttachment = attachedFileName;
    setAttachedFileName(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmed,
          attachmentName: currentAttachment,
        }),
      });

      if (!res.ok) {
        throw new Error('Server returned an error');
      }

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel: 'Web Chat',
        confidence: data.confidence || 'high',
        confidenceLabel: data.confidenceLabel || 'HIGH CONFIDENCE',
        intent: data.intent || 'GENERAL_ASSISTANCE',
        responseMode: data.responseMode || 'GENERAL ASSISTANT',
        knowledgeLevel: data.knowledgeLevel || 'LEVEL 2 — Official University Knowledge',
        escalationDetails: data.escalationDetails,
        sources: data.sources || [],
        suggestedActions: data.suggestedActions || [],
        providerUsed: data.providerUsed || 'Campus Assistant Intent Engine',
        cardType: data.cardType,
        cardData: data.cardData,
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? {
                ...c,
                messages: [...updatedMessages, aiMsg],
                preview: data.reply.slice(0, 60) + '...',
              }
            : c
        )
      );
    } catch {
      setErrorBanner('Something went wrong connecting to university systems. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadAloud = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/#+/g, '').replace(/\*\*/g, '').replace(/`/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
      onShowToast('Reading response aloud...');
    } else {
      onShowToast('Speech synthesis not supported in this browser.');
    }
  };

  const handleVoiceDictation = () => {
    setIsListening(true);
    onShowToast('Listening via Voice Input...');
    setTimeout(() => {
      setIsListening(false);
      setInput('What classes do I have tomorrow?');
    }, 1200);
  };

  const filteredConversations = conversations.filter((c) => {
    const q = searchConv.toLowerCase();
    return c.title.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 border-2 border-[#141210] bg-[#F5F0E6] min-h-[820px] shadow-[4px_4px_0px_#141210]">
      {/* ================================================================
          LEFT SIDEBAR: CHATGPT-STYLE CONVERSATION HISTORY & SHORTCUTS
         ================================================================ */}
      <aside className="lg:col-span-3 border-b lg:border-b-0 lg:border-r-2 border-[#141210] bg-[#EAE2D3] p-4 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Header & New Conversation Button */}
          <div className="space-y-3 pb-3 border-b-2 border-[#141210]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono tracking-widest uppercase text-stone-600">
                  CAMPUS ASSISTANT OS
                </div>
                <h2 className="font-serif text-base font-bold text-stone-950">
                  Conversations
                </h2>
              </div>
              <span className="text-[10px] font-mono bg-[#141210] text-[#F5F0E6] px-1.5 py-0.5 font-bold">
                PRO v5
              </span>
            </div>

            <button
              type="button"
              onClick={handleStartNewConversation}
              className="w-full py-2.5 px-3 bg-[#141210] hover:bg-[#1E3A8A] text-white text-xs font-mono font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#141210] transition-colors cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,0.2)]"
            >
              <Plus className="w-4 h-4" />
              <span>New Conversation</span>
            </button>
          </div>

          {/* Search Conversations */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchConv}
              onChange={(e) => setSearchConv(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F5F0E6] border border-[#141210] placeholder:text-stone-500 focus:outline-none focus:bg-white"
            />
          </div>

          {/* Recent Conversations List */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-stone-600 font-semibold px-1">
              Recent Conversations
            </div>

            <div className="space-y-1 max-h-[460px] overflow-y-auto pr-1">
              {filteredConversations.map((conv) => {
                const isActive = conv.id === activeConversationId;
                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`group relative w-full text-left p-2.5 border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#F5F0E6] border-[#141210] shadow-[2px_2px_0px_#141210]'
                        : 'bg-[#F5F0E6]/60 border-stone-300 hover:border-[#141210] hover:bg-[#F5F0E6]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <MessageSquare
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isActive ? 'text-[#1E3A8A]' : 'text-stone-500'
                          }`}
                        />
                        <span className="text-xs font-semibold text-stone-900 truncate">
                          {conv.title}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteConversation(conv.id, e)}
                        className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-700 transition-opacity p-0.5"
                        title="Delete conversation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-stone-600 truncate mt-1 pl-5">
                      {conv.preview}
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 mt-1 pl-5">
                      <span>{conv.category || 'General'}</span>
                      <span className="tabular-nums">{conv.timestamp}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Student Context Footer */}
        <div className="pt-3 border-t-2 border-[#141210] space-y-1 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-stone-900">{STUDENT_PERSONA.name}</span>
            <span className="font-mono text-stone-600">{STUDENT_PERSONA.id}</span>
          </div>
          <div className="text-stone-600 text-[10px] leading-tight">
            {STUDENT_PERSONA.program} · GPA 3.82 · Fall 2026
          </div>
        </div>
      </aside>

      {/* ================================================================
          MAIN VIEWPORT: CHAT-FIRST OPERATING SYSTEM
         ================================================================ */}
      <section className="lg:col-span-9 flex flex-col justify-between bg-[#F5F0E6]">
        {/* Top Header Bar */}
        <div className="px-6 py-3.5 border-b-2 border-[#141210] bg-[#EAE2D3] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#141210] text-[#F5F0E6] font-serif font-bold text-lg flex items-center justify-center border border-[#141210] shrink-0">
              CA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg font-bold text-stone-950 tracking-tight">
                  Campus Assistant
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 border border-emerald-800 text-emerald-950 text-[10px] font-mono font-bold uppercase">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  University Verified AI
                </span>
              </div>
              <div className="text-[11px] text-stone-600 font-sans">
                "Your entire university, in one conversation." · Ask. Learn. Plan. Get things done.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const next = !simplePointsMode;
                setSimplePointsMode(next);
                onShowToast(
                  next
                    ? 'Simple Points Mode Enabled: All explanations formatted in clear points for all students!'
                    : 'Simple Points Mode Disabled.'
                );
              }}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                simplePointsMode
                  ? 'bg-amber-300 text-stone-950 border-[#141210] shadow-[2px_2px_0px_#141210]'
                  : 'bg-white text-stone-700 border-stone-400 hover:border-[#141210]'
              }`}
              title="Toggle Simple Points Mode so any student can easily understand"
            >
              <Sparkles className="w-3.5 h-3.5 text-stone-950" />
              <span>Simple Points Mode: {simplePointsMode ? 'ON' : 'OFF'}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-2.5 py-1.5 text-xs font-mono font-medium text-stone-700 bg-white border border-[#141210] hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Chronicle Dashboard →
            </button>
          </div>
        </div>

        {/* Student Clarity Bar when Simple Points Mode is Active */}
        {simplePointsMode && (
          <div className="px-6 py-2 bg-amber-50 border-b border-[#141210] flex flex-wrap items-center justify-between gap-2 text-xs text-amber-950 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
              <span className="font-bold">STUDENT CLARITY MODE:</span>
              <span className="font-sans text-stone-900 font-normal">
                Concepts, courses & tasks are explained in bite-sized, numbered points so all students can understand properly.
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleSendPrompt('Explain all my key points simply so I can understand properly.')}
                className="px-2 py-0.5 bg-white border border-stone-800 text-[11px] font-bold hover:bg-amber-100 transition-colors cursor-pointer"
              >
                📌 All Key Points
              </button>
              <button
                type="button"
                onClick={() => handleSendPrompt('Teach me recursion in simple points.')}
                className="px-2 py-0.5 bg-white border border-stone-800 text-[11px] font-bold hover:bg-amber-100 transition-colors cursor-pointer"
              >
                💡 Recursion Points
              </button>
              <button
                type="button"
                onClick={() => handleSendPrompt('Help me register for next semester in simple points.')}
                className="px-2 py-0.5 bg-white border border-stone-800 text-[11px] font-bold hover:bg-amber-100 transition-colors cursor-pointer"
              >
                🎓 Registration Points
              </button>
            </div>
          </div>
        )}

        {/* ================================================================
            CHAT MESSAGES OR HOME SCREEN (CHAT-FIRST UI CONTRACT)
           ================================================================ */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[600px]">
          {/* If there are NO messages in the current conversation, render the CHAT-FIRST HOME SCREEN */}
          {messages.length === 0 ? (
            <div className="py-6 px-2 sm:px-6 max-w-3xl mx-auto space-y-8 animate-fadeIn">
              {/* Home Screen Hero Greeting */}
              <div className="text-center space-y-2">
                <div className="inline-block font-mono text-[11px] uppercase tracking-widest text-stone-600 border border-stone-400 bg-white px-3 py-1">
                  OFFICIAL INSTITUTIONAL INTELLIGENCE
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
                  Good morning, Alex 👋
                </h2>
                <p className="font-serif text-lg text-stone-800">
                  How can I help you today?
                </p>
                <p className="text-xs text-stone-600 max-w-xl mx-auto">
                  Campus Assistant is your university operating system. Access academics, courses,
                  assignments, grades, schedules, financial aid, IT support, library, and campus
                  services directly through one conversation.
                </p>
              </div>

              {/* Home Screen Large Conversational Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendPrompt(input);
                }}
                className="space-y-2"
              >
                <div className="relative flex items-center border-2 border-[#141210] bg-white shadow-[4px_4px_0px_#141210]">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Campus Assistant anything... (e.g., 'What classes do I have tomorrow?')"
                    className="w-full py-4 pl-4 pr-24 text-sm bg-transparent placeholder:text-stone-400 focus:outline-none"
                    autoFocus
                  />
                  <div className="absolute right-2 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleVoiceDictation}
                      className={`p-2 border border-[#141210] transition-colors cursor-pointer ${
                        isListening
                          ? 'bg-[#9A3412] text-white'
                          : 'bg-[#F5F0E6] text-stone-800 hover:bg-stone-200'
                      }`}
                      title="Voice input"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className="px-4 py-2 bg-[#141210] hover:bg-[#1E3A8A] text-white text-xs font-mono font-bold uppercase tracking-wider disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      Ask
                    </button>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-stone-600 text-center">
                  Courses, assignments, grades, financial aid, campus services, IT, library,
                  registration and more.
                </div>
              </form>

              {/* 8 Actionable Shortcut Buttons */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-stone-300 pb-1">
                  <span className="text-xs font-mono font-bold uppercase text-stone-800 tracking-wider">
                    Quick Service Shortcuts
                  </span>
                  <span className="text-[11px] text-stone-500 font-mono">
                    Click to launch interactive inquiry
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {SHORTCUT_BUTTONS.map((sc) => {
                    const IconComponent = sc.icon;
                    return (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => handleSendPrompt(sc.prompt)}
                        className={`p-3 text-left border-2 border-[#141210] bg-white hover:bg-[#F5F0E6] hover:shadow-[3px_3px_0px_#141210] transition-all cursor-pointer group`}
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4 text-[#1E3A8A]" />
                          <span className="text-xs font-bold text-stone-900 group-hover:text-[#1E3A8A]">
                            {sc.label}
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-600 line-clamp-1 mt-1">
                          “{sc.prompt}”
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Suggested Conversation Prompts */}
              <div className="space-y-2 pt-2 border-t border-stone-300">
                <div className="text-[11px] font-mono text-stone-600 uppercase font-bold">
                  Recommended Inquiries for Fall 2026:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'What classes do I have tomorrow?',
                    'What assignments are due this week?',
                    'Help me register for next semester.',
                    'What’s my GPA and graduation progress?',
                    'Teach me recursion in binary search trees.',
                    'My Wi-Fi isn’t working on campus.',
                    'I need financial aid help and what documents are missing?',
                    'Find a book about machine learning.',
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendPrompt(p)}
                      className="px-2.5 py-1 text-xs bg-white hover:bg-stone-100 border border-stone-400 hover:border-[#141210] text-stone-800 transition-colors cursor-pointer text-left"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Message Thread */
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'student' ? 'items-end' : 'items-start'
                }`}
              >
                {/* Message Header */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 mb-1.5 font-mono">
                  <span className="font-bold text-stone-900">
                    {msg.sender === 'student' ? 'ALEX MORGAN' : 'CAMPUS ASSISTANT'}
                  </span>
                  <span>·</span>
                  <span className="tabular-nums">{msg.timestamp}</span>
                  {msg.sender === 'ai' && msg.intent && (
                    <>
                      <span>·</span>
                      <span className="px-1.5 py-0.5 bg-[#141210] text-white font-bold text-[10px]">
                        INTENT: {msg.intent}
                      </span>
                    </>
                  )}
                  {msg.sender === 'ai' && (
                    <>
                      <span>·</span>
                      <button
                        type="button"
                        onClick={() => handleReadAloud(msg.text)}
                        className="inline-flex items-center gap-1 text-[#1E3A8A] hover:underline cursor-pointer"
                        title="Listen to audio dispatch"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen</span>
                      </button>
                    </>
                  )}
                </div>

                {/* Message Bubble Container */}
                <div
                  className={`max-w-3xl p-5 border-2 border-[#141210] shadow-[3px_3px_0px_#141210] ${
                    msg.sender === 'student'
                      ? 'bg-[#141210] text-white'
                      : 'bg-white text-stone-900'
                  }`}
                >
                  {/* Knowledge Level Badge */}
                  {msg.sender === 'ai' && (
                    <div className="mb-3 pb-2 border-b border-stone-300 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                      <span className="text-stone-700">
                        {msg.knowledgeLevel || 'LEVEL 1 — Student Authorized RAG'}
                      </span>
                      <span
                        className={`font-bold ${
                          msg.confidence === 'low'
                            ? 'text-red-700'
                            : msg.confidence === 'medium'
                            ? 'text-amber-800'
                            : 'text-emerald-800'
                        }`}
                      >
                        {msg.confidenceLabel || 'HIGH CONFIDENCE · VERIFIED'}
                      </span>
                    </div>
                  )}

                  {msg.attachment && (
                    <div className="mb-3 pb-2 border-b border-current/20 text-xs flex items-center gap-1.5 font-mono">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Document Attached: {msg.attachment}</span>
                    </div>
                  )}

                  {/* Text Content parsed with student-friendly numbered points, clean headings and highlights */}
                  <StudentFriendlyPointsContent text={msg.text} isAi={msg.sender === 'ai'} />

                  {/* Explain in Simple Points Expander for this message */}
                  {msg.sender === 'ai' && (
                    <div className="mt-3 pt-2.5 border-t border-stone-200">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedSimplePoints((prev) => ({
                              ...prev,
                              [msg.id]: !prev[msg.id],
                            }))
                          }
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-800 text-amber-950 font-mono text-[11px] font-bold uppercase transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                          <span>
                            {expandedSimplePoints[msg.id]
                              ? 'Hide Simple Points Breakdown'
                              : '📌 Explain in Simple Points for Students'}
                          </span>
                        </button>
                        <span className="text-[10px] font-mono text-stone-500">
                          Clear takeaway for all students
                        </span>
                      </div>

                      {expandedSimplePoints[msg.id] && (() => {
                        const breakdown = getSimplifiedStudentBreakdown(msg);
                        return (
                          <div className="mt-2.5 p-3.5 bg-amber-50/80 border-2 border-[#141210] space-y-2.5 animate-fadeIn">
                            <div className="flex items-center gap-2 border-b border-amber-200 pb-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-700" />
                              <span className="font-serif font-bold text-xs text-stone-950">
                                {breakdown.title}
                              </span>
                            </div>

                            <div className="text-xs text-stone-800 font-sans">
                              <span className="font-bold font-mono text-[10px] uppercase text-stone-900 block mb-0.5">
                                🎯 In Simple Words:
                              </span>
                              {breakdown.inSimpleWords}
                            </div>

                            <div className="space-y-1.5 pt-1">
                              <span className="font-bold font-mono text-[10px] uppercase text-stone-900 block">
                                📌 Key Points You Need to Know:
                              </span>
                              {breakdown.points.map((pt, pIdx) => (
                                <div key={pIdx} className="flex items-start gap-2 text-xs text-stone-800">
                                  <span className="w-4 h-4 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-[9px] font-mono font-bold shrink-0 mt-0.5">
                                    {pIdx + 1}
                                  </span>
                                  <span className="leading-snug">{pt}</span>
                                </div>
                              ))}
                            </div>

                            {breakdown.analogy && (
                              <div className="p-2 bg-white border border-amber-300 text-xs text-amber-950 flex items-start gap-2">
                                <Lightbulb className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold font-mono text-[10px] uppercase text-amber-900 block">
                                    Relatable Analogy:
                                  </span>
                                  <span>{breakdown.analogy}</span>
                                </div>
                              </div>
                            )}

                            {breakdown.whatToDo && (
                              <div className="text-[11px] text-stone-700 font-mono pt-1">
                                <span className="font-bold uppercase text-stone-900">What to do next: </span>
                                {breakdown.whatToDo}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* ================================================================
                      RICH INTERACTIVE CARDS (THE ACTION OPERATING SYSTEM)
                     ================================================================ */}

                  {/* 0. SIMPLE POINTS CARD (Student Clarity & Understanding) */}
                  {msg.cardType === 'simple_points' && (
                    <div className="mt-4 p-4 bg-[#F5F0E6] border-2 border-[#141210] space-y-4">
                      <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
                          <span className="font-serif font-bold text-stone-950 text-sm">
                            {msg.cardData?.title || 'Key Points Explained Simply for Students'}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono bg-blue-100 text-blue-900 border border-blue-800 px-2 py-0.5 font-bold uppercase">
                          STUDENT CLARITY MODE
                        </span>
                      </div>

                      {msg.cardData?.coreSummary && (
                        <div className="p-3 bg-white border border-[#141210] text-xs font-serif text-stone-900 leading-relaxed shadow-sm">
                          <strong>The Big Picture:</strong> {msg.cardData.coreSummary}
                        </div>
                      )}

                      {/* Points Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {msg.cardData?.points?.map((pt: any, idx: number) => (
                          <div key={idx} className="p-3 bg-white border border-[#141210] space-y-1.5 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                                  <span className="w-5 h-5 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-[10px] font-mono font-bold">
                                    {idx + 1}
                                  </span>
                                  {pt.title}
                                </span>
                                {pt.status && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 bg-stone-100 border border-stone-300 font-bold uppercase text-stone-700">
                                    {pt.status}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-stone-700 leading-snug pl-6">
                                {pt.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Everyday Analogy */}
                      {msg.cardData?.analogy && (
                        <div className="p-3 bg-amber-50 border border-amber-800 text-xs text-amber-950 flex items-start gap-2.5">
                          <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                          <div>
                            <strong className="font-semibold block font-mono text-[11px] uppercase tracking-wider text-amber-900">
                              Everyday Student Analogy:
                            </strong>
                            <span className="leading-relaxed">{msg.cardData.analogy}</span>
                          </div>
                        </div>
                      )}

                      {/* Action Checklist */}
                      {msg.cardData?.actionChecklist && (
                        <div className="p-3 bg-white border border-[#141210] space-y-2">
                          <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-900">
                            <span className="flex items-center gap-1.5">
                              <CheckSquare className="w-3.5 h-3.5 text-emerald-700" />
                              Student Action Checklist
                            </span>
                            <span className="text-[10px] text-stone-500 font-normal">Click to mark complete</span>
                          </div>
                          <div className="space-y-1.5">
                            {msg.cardData.actionChecklist.map((item: string, idx: number) => {
                              const isChecked = checkedChecklistItems.includes(item);
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    setCheckedChecklistItems((prev) =>
                                      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
                                    );
                                    onShowToast(isChecked ? `Unchecked: ${item}` : `Completed: ${item} ✓`);
                                  }}
                                  className={`w-full text-left p-2 border text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                                    isChecked
                                      ? 'bg-emerald-50 border-emerald-800 text-emerald-900 line-through'
                                      : 'bg-[#F5F0E6] hover:bg-stone-100 border-stone-300 text-stone-800'
                                  }`}
                                >
                                  {isChecked ? (
                                    <CheckSquare className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                                  ) : (
                                    <Square className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                  )}
                                  <span>{item}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 1. SCHEDULE CARD */}
                  {msg.cardType === 'schedule' && (
                    <div className="mt-4 p-4 bg-[#F5F0E6] border-2 border-[#141210] space-y-3">
                      <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#1E3A8A]" />
                          <span className="font-serif font-bold text-stone-950 text-sm">
                            Tomorrow’s Verified Course Schedule
                          </span>
                        </div>
                        <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 border border-emerald-800 px-1.5 py-0.5 font-bold">
                          3 SECTIONS ENROLLED
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          {
                            time: '10:00 AM',
                            code: 'CS 201',
                            title: 'Data Structures',
                            room: 'Room 204',
                            bldg: 'Turing Hall',
                            prof: 'Prof. Sarah Johnson',
                          },
                          {
                            time: '1:00 PM',
                            code: 'MATH 210',
                            title: 'Discrete Mathematics',
                            room: 'Room 108',
                            bldg: 'Euler Pavilion',
                            prof: 'Prof. Marcus Vance',
                          },
                          {
                            time: '3:00 PM',
                            code: 'BIO 101',
                            title: 'General Biology',
                            room: 'Science Bldg',
                            bldg: 'Lab 214',
                            prof: 'Dr. Elena Rostova',
                          },
                        ].map((cls, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-white border border-[#141210] space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-bold bg-[#141210] text-white px-1.5 py-0.5">
                                {cls.time}
                              </span>
                              <span className="text-xs font-bold text-[#1E3A8A]">
                                {cls.code}
                              </span>
                            </div>
                            <div className="font-bold text-xs text-stone-950 truncate">
                              {cls.title}
                            </div>
                            <div className="text-[11px] text-stone-600 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-stone-500" />
                              <span>{cls.room} ({cls.bldg})</span>
                            </div>
                            <div className="text-[10px] text-stone-500 font-mono">
                              {cls.prof}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-300">
                        <button
                          type="button"
                          onClick={() => onNavigate('calendar')}
                          className="px-3 py-1.5 bg-[#141210] hover:bg-[#1E3A8A] text-white text-xs font-mono font-semibold uppercase cursor-pointer"
                        >
                          View Full Schedule
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onShowToast('Synced tomorrow’s 3 classes to device calendar');
                          }}
                          className="px-3 py-1.5 bg-white border border-[#141210] hover:bg-stone-100 text-stone-900 text-xs font-mono font-semibold uppercase cursor-pointer"
                        >
                          Sync to Calendar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 2. ASSIGNMENTS CARD */}
                  {msg.cardType === 'assignments' && (
                    <div className="mt-4 p-4 bg-[#F5F0E6] border-2 border-[#141210] space-y-3">
                      <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-amber-800" />
                          <span className="font-serif font-bold text-stone-950 text-sm">
                            Upcoming Assignments Due This Week
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-stone-600">
                          Auto-graded via Zanzee LMS
                        </span>
                      </div>

                      <div className="space-y-2">
                        {[
                          {
                            dueTag: 'Due Tomorrow',
                            code: 'CS 201',
                            title: 'Binary Trees & BST Balance',
                            dueTime: '11:59 PM',
                            progress: 65,
                            courseId: 'cs-201',
                          },
                          {
                            dueTag: 'Due Thursday',
                            code: 'MATH 210',
                            title: 'Problem Set 4 (Induction & Graphs)',
                            dueTime: '5:00 PM',
                            progress: 40,
                            courseId: 'math-210',
                          },
                          {
                            dueTag: 'Due Friday',
                            code: 'ENG 105',
                            title: 'Research Essay First Draft',
                            dueTime: '11:59 PM',
                            progress: 20,
                            courseId: 'eng-105',
                          },
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-white border border-[#141210] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="px-1.5 py-0.5 bg-amber-100 border border-amber-800 text-amber-900 font-mono text-[10px] font-bold">
                                  {item.dueTag}
                                </span>
                                <span className="font-mono text-xs font-bold text-[#1E3A8A]">
                                  {item.code}
                                </span>
                                <span className="text-stone-400">·</span>
                                <span className="text-xs font-semibold text-stone-900 truncate">
                                  {item.title}
                                </span>
                              </div>
                              <div className="text-[11px] text-stone-500 font-mono flex items-center gap-2">
                                <span>Deadline: {item.dueTime}</span>
                                <span>·</span>
                                <span>Autograder: {item.progress}% Passing</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => onNavigate('assignments')}
                                className="px-2.5 py-1 bg-[#141210] hover:bg-[#1E3A8A] text-white text-[11px] font-mono uppercase cursor-pointer"
                              >
                                Open Assignment
                              </button>
                              <button
                                type="button"
                                onClick={() => onNavigate('course-detail', item.courseId)}
                                className="px-2.5 py-1 bg-white border border-[#141210] hover:bg-stone-100 text-stone-900 text-[11px] font-mono uppercase cursor-pointer"
                              >
                                View Course
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSavedReminders((prev) => [...prev, item.code]);
                                  onShowToast(`Reminder set for ${item.code} (${item.dueTag})`);
                                }}
                                className={`px-2.5 py-1 border border-[#141210] text-[11px] font-mono uppercase cursor-pointer ${
                                  savedReminders.includes(item.code)
                                    ? 'bg-emerald-100 text-emerald-900'
                                    : 'bg-white hover:bg-stone-100 text-stone-900'
                                }`}
                              >
                                {savedReminders.includes(item.code) ? 'Saved ✓' : 'Add Reminder'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. REGISTRATION WORKFLOW CARD */}
                  {msg.cardType === 'registration' && (
                    <div className="mt-4 p-4 bg-[#F5F0E6] border-2 border-[#141210] space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-300 pb-2">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-600">
                            STEP-BY-STEP WORKFLOW
                          </span>
                          <h4 className="font-serif font-bold text-stone-950 text-base">
                            Spring 2027 Course Registration Planner
                          </h4>
                        </div>
                        <span className="px-2 py-0.5 bg-[#1E3A8A] text-white text-[11px] font-mono font-bold">
                          Registration Opens Oct 12 · 8:00 AM
                        </span>
                      </div>

                      {/* Degree Status Strip */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center p-2.5 bg-white border border-[#141210] text-xs font-mono">
                        <div>
                          <div className="text-[10px] text-stone-500">PROGRAM</div>
                          <div className="font-bold text-stone-900">B.Sc. CS</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-stone-500">COMPLETED</div>
                          <div className="font-bold text-emerald-800">72 / 120 (60%)</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-stone-500">REMAINING</div>
                          <div className="font-bold text-stone-900">48 Credits</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-stone-500">CONFLICTS</div>
                          <div className="font-bold text-emerald-800">0 Detected ✓</div>
                        </div>
                      </div>

                      {/* Course Recommendations for Registration */}
                      <div className="space-y-2">
                        <div className="text-xs font-mono font-bold uppercase text-stone-800">
                          Recommended Spring 2027 Schedule (Prerequisites Verified)
                        </div>

                        {[
                          {
                            code: 'CS 310',
                            title: 'Algorithms & Computational Complexity',
                            credits: 4,
                            prereq: 'CS 201 & MATH 210',
                            prereqStatus: 'Met (CS 201 In Progress A-, MATH 210 In Progress A)',
                            schedule: 'Mon & Wed · 10:00 AM – 11:30 AM (Turing 304)',
                          },
                          {
                            code: 'CS 340',
                            title: 'Operating Systems & Architecture',
                            credits: 4,
                            prereq: 'CS 201',
                            prereqStatus: 'Met (CS 201 In Progress A-)',
                            schedule: 'Tue & Thu · 1:00 PM – 2:30 PM (Turing 208)',
                          },
                          {
                            code: 'MATH 305',
                            title: 'Linear Algebra with Applications',
                            credits: 3,
                            prereq: 'MATH 210',
                            prereqStatus: 'Met (MATH 210 In Progress A)',
                            schedule: 'Tue & Thu · 9:00 AM – 10:30 AM (Euler 102)',
                          },
                          {
                            code: 'PHIL 220',
                            title: 'Ethics in Tech & Algorithmic Justice (GenEd)',
                            credits: 4,
                            prereq: 'None',
                            prereqStatus: 'Open Enrollment',
                            schedule: 'Tue & Thu · 10:00 AM – 11:30 AM (Founders 106)',
                          },
                        ].map((crs) => {
                          const isBookmarked = registeredCourseCodes.includes(crs.code);
                          return (
                            <div
                              key={crs.code}
                              className="p-3 bg-white border border-[#141210] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-[#1E3A8A]">
                                    {crs.code}
                                  </span>
                                  <span className="font-bold text-xs text-stone-950">
                                    {crs.title}
                                  </span>
                                  <span className="text-[10px] font-mono text-stone-500">
                                    ({crs.credits} cr)
                                  </span>
                                </div>
                                <div className="text-[11px] text-stone-600 font-mono">
                                  {crs.schedule}
                                </div>
                                <div className="text-[10px] text-emerald-800 font-mono font-semibold flex items-center gap-1">
                                  <Check className="w-3 h-3 text-emerald-700" />
                                  <span>Prerequisite: {crs.prereqStatus}</span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setRegisteredCourseCodes((prev) =>
                                    prev.includes(crs.code)
                                      ? prev.filter((c) => c !== crs.code)
                                      : [...prev, crs.code]
                                  );
                                  onShowToast(
                                    isBookmarked
                                      ? `Removed ${crs.code} from enrollment cart`
                                      : `Added ${crs.code} to registration cart`
                                  );
                                }}
                                className={`px-3 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                                  isBookmarked
                                    ? 'bg-emerald-800 text-white'
                                    : 'bg-[#141210] text-white hover:bg-[#1E3A8A]'
                                }`}
                              >
                                {isBookmarked ? 'In Cart ✓' : 'Add to Cart'}
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-3 bg-emerald-50 border border-emerald-800 text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono font-semibold">
                          Selected Cart: {registeredCourseCodes.length} Courses (
                          {registeredCourseCodes.length * 4} Credits) · Registration Ready
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            onShowToast(
                              `Pre-enrollment locked for ${registeredCourseCodes.join(
                                ', '
                              )}. Auto-submitting on Oct 12 at 8:00 AM.`
                            );
                          }}
                          className="px-3.5 py-1.5 bg-[#141210] hover:bg-[#1E3A8A] text-white font-mono text-xs font-bold uppercase cursor-pointer"
                        >
                          Lock & Pre-Enroll Cart
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 4. GRADES & GPA CARD */}
                  {msg.cardType === 'grades' && (
                    <div className="mt-4 p-4 bg-[#F5F0E6] border-2 border-[#141210] space-y-3">
                      <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-emerald-800" />
                          <span className="font-serif font-bold text-stone-950 text-sm">
                            Official Academic Standing & Gradebook
                          </span>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 border border-emerald-800 font-mono text-[10px] font-bold">
                          Dean's Honor List (Top 5%)
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center p-2.5 bg-white border border-[#141210] text-xs font-mono">
                        <div>
                          <div className="text-[10px] text-stone-500">CUMULATIVE GPA</div>
                          <div className="text-base font-bold text-stone-950">3.82 / 4.00</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-stone-500">PROJECTED TERM</div>
                          <div className="text-base font-bold text-emerald-800">3.88</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-stone-500">COMPLETED CR</div>
                          <div className="text-base font-bold text-stone-900">72 / 120</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-stone-500">STATUS</div>
                          <div className="text-xs font-bold text-emerald-800 mt-0.5">Good Standing</div>
                        </div>
                      </div>

                      <div className="divide-y divide-stone-200 border border-[#141210] bg-white text-xs">
                        {[
                          { code: 'CS 201', name: 'Data Structures', grade: 'A-', score: '91.4%', cr: 4.0 },
                          { code: 'MATH 210', name: 'Discrete Mathematics', grade: 'A', score: '94.0%', cr: 4.0 },
                          { code: 'BIO 101', name: 'General Biology', grade: 'B+', score: '88.5%', cr: 4.0 },
                          { code: 'ENG 105', name: 'Academic Writing & Rhetoric', grade: 'A', score: '95.0%', cr: 3.0 },
                        ].map((c) => (
                          <div key={c.code} className="p-2.5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-[#1E3A8A]">{c.code}</span>
                              <span className="text-stone-900 font-medium">{c.name}</span>
                            </div>
                            <div className="flex items-center gap-3 font-mono">
                              <span className="text-stone-500">{c.score}</span>
                              <span className="font-bold text-stone-950 bg-stone-100 px-1.5 py-0.5 border border-stone-300">
                                {c.grade}
                              </span>
                              <span className="text-stone-400">{c.cr} cr</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            onShowToast('Downloaded Unofficial Transcript (PDF)');
                            onNavigate('grades');
                          }}
                          className="px-3 py-1.5 bg-[#141210] hover:bg-[#1E3A8A] text-white text-xs font-mono uppercase cursor-pointer"
                        >
                          Download Transcript
                        </button>
                        <button
                          type="button"
                          onClick={() => onNavigate('academic-progress')}
                          className="px-3 py-1.5 bg-white border border-[#141210] hover:bg-stone-100 text-stone-900 text-xs font-mono uppercase cursor-pointer"
                        >
                          View Degree Progress
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 5. DEGREE PROGRESS AUDIT CARD */}
                  {msg.cardType === 'degree_progress' && (
                    <div className="mt-4 p-4 bg-[#F5F0E6] border-2 border-[#141210] space-y-3">
                      <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-[#1E3A8A]" />
                          <span className="font-serif font-bold text-stone-950 text-sm">
                            Undergraduate Degree Audit Summary
                          </span>
                        </div>
                        <span className="font-mono text-xs font-bold text-stone-900">
                          B.Sc. Computer Science
                        </span>
                      </div>

                      <div className="space-y-1.5 p-3 bg-white border border-[#141210]">
                        <div className="flex justify-between text-xs font-mono">
                          <span>Overall Progress</span>
                          <span className="font-bold text-emerald-800">72 / 120 Credits (60%)</span>
                        </div>
                        <div className="w-full bg-stone-200 h-3 border border-[#141210]">
                          <div className="bg-[#1E3A8A] h-full" style={{ width: '60%' }} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                        <div className="p-2.5 bg-white border border-stone-300">
                          <div className="text-[10px] text-stone-500">MAJOR CORE</div>
                          <div className="font-bold text-stone-900">42 / 60 Credits</div>
                          <div className="text-[10px] text-emerald-700 mt-1">70% completed</div>
                        </div>
                        <div className="p-2.5 bg-white border border-stone-300">
                          <div className="text-[10px] text-stone-500">GENERAL EDUCATION</div>
                          <div className="font-bold text-stone-900">24 / 36 Credits</div>
                          <div className="text-[10px] text-emerald-700 mt-1">66% completed</div>
                        </div>
                        <div className="p-2.5 bg-white border border-stone-300">
                          <div className="text-[10px] text-stone-500">ELECTIVES</div>
                          <div className="font-bold text-stone-900">6 / 24 Credits</div>
                          <div className="text-[10px] text-amber-700 mt-1">18 credits left</div>
                        </div>
                      </div>

                      <div className="p-2.5 bg-white border border-[#141210] text-xs font-mono flex items-center justify-between">
                        <span>Projected Graduation:</span>
                        <span className="font-bold text-[#1E3A8A]">Spring 2028 (On Track)</span>
                      </div>
                    </div>
                  )}

                  {/* 6. FINANCIAL AID & BILLING CARD */}
                  {msg.cardType === 'financial_aid' && (
                    <div className="mt-4 p-4 bg-[#F5F0E6] border-2 border-[#141210] space-y-3">
                      <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-emerald-800" />
                          <span className="font-serif font-bold text-stone-950 text-sm">
                            Financial Aid & Bursar Statement
                          </span>
                        </div>
                        <span className="px-2 py-0.5 bg-red-100 text-red-950 border border-red-800 font-mono text-[10px] font-bold">
                          ACTION REQUIRED · OCT 15
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center p-2.5 bg-white border border-[#141210] text-xs font-mono">
                        <div>
                          <div className="text-[10px] text-stone-500">ANNUAL AID AWARD</div>
                          <div className="text-sm font-bold text-emerald-800">$22,400</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-stone-500">FALL DISBURSEMENT</div>
                          <div className="text-sm font-bold text-stone-900">$11,200</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-stone-500">NET BALANCE DUE</div>
                          <div className="text-sm font-bold text-red-700">$2,400</div>
                        </div>
                      </div>

                      <div className="p-3 bg-amber-50 border-2 border-stone-900 space-y-2">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-bold text-xs text-stone-900">
                              Missing Required Form: Proof of Enrollment (Form FA-104)
                            </div>
                            <div className="text-[11px] text-stone-700">
                              Submit before October 15, 2026 to ensure Fall term disbursement.
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setFinaidUploaded(true);
                              onShowToast('Proof of Enrollment (Form FA-104) uploaded successfully!');
                            }}
                            className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-colors cursor-pointer ${
                              finaidUploaded
                                ? 'bg-emerald-800 text-white'
                                : 'bg-[#141210] text-white hover:bg-[#1E3A8A]'
                            }`}
                          >
                            {finaidUploaded ? 'Form Uploaded ✓' : 'Upload Proof of Enrollment'}
                          </button>
                          <button
                            type="button"
                            onClick={() => onNavigate('financial-aid')}
                            className="px-3 py-1.5 bg-white border border-[#141210] text-stone-900 hover:bg-stone-100 text-xs font-mono uppercase cursor-pointer"
                          >
                            View Bursar Portal
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 7. IT SUPPORT TROUBLESHOOTING CARD */}
                  {msg.cardType === 'it_support' && (
                    <div className="mt-4 p-4 bg-[#F5F0E6] border-2 border-[#141210] space-y-3">
                      <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                        <div className="flex items-center gap-2">
                          <Laptop className="w-4 h-4 text-blue-900" />
                          <span className="font-serif font-bold text-stone-950 text-sm">
                            Wi-Fi & Identity Diagnostic Hub
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-stone-600">
                          Radius 802.1X Rotation Guide
                        </span>
                      </div>

                      <div className="space-y-1.5 bg-white p-3 border border-[#141210] text-xs">
                        <div className="font-bold text-stone-900">Step-by-step resolution:</div>
                        {[
                          'Open Wi-Fi settings on your laptop or phone',
                          'Select "Forget This Network" for Zanzee-Secure',
                          'Reconnect using username: amorgan@zanzee.edu and your SSO password',
                          'When prompted, trust the new server certificate: auth.zanzee.edu',
                        ].map((st, i) => (
                          <label
                            key={i}
                            className="flex items-center gap-2 text-stone-800 cursor-pointer select-none"
                          >
                            <input
                              type="checkbox"
                              checked={itStepsCompleted.includes(i)}
                              onChange={() =>
                                setItStepsCompleted((prev) =>
                                  prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
                                )
                              }
                              className="rounded border-[#141210] text-[#1E3A8A]"
                            />
                            <span className={itStepsCompleted.includes(i) ? 'line-through text-stone-400' : ''}>
                              {i + 1}. {st}
                            </span>
                          </label>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setItPingResult('Gateway: 14ms · Radius Auth: OK · DNS: OK');
                            onShowToast('Network diagnostic test complete');
                          }}
                          className="px-3 py-1.5 bg-white border border-[#141210] hover:bg-stone-100 text-stone-900 text-xs font-mono uppercase cursor-pointer"
                        >
                          Test Network Ping
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onShowToast('Opened Priority IT Ticket #IT-9402');
                            onNavigate('it-support');
                          }}
                          className="px-3 py-1.5 bg-[#141210] hover:bg-[#1E3A8A] text-white text-xs font-mono uppercase cursor-pointer"
                        >
                          Open IT Ticket
                        </button>
                        {itPingResult && (
                          <span className="text-[11px] font-mono text-emerald-800 font-bold">
                            {itPingResult}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 8. LIBRARY RESEARCH CARD */}
                  {msg.cardType === 'library' && (
                    <div className="mt-4 p-4 bg-[#F5F0E6] border-2 border-[#141210] space-y-3">
                      <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                        <div className="flex items-center gap-2">
                          <Compass className="w-4 h-4 text-stone-800" />
                          <span className="font-serif font-bold text-stone-950 text-sm">
                            Grand Library Holdings & Reserve
                          </span>
                        </div>
                        <span className="text-[10px] font-mono bg-emerald-100 text-emerald-950 border border-emerald-800 px-1.5 py-0.5 font-bold">
                          OPEN 24/7
                        </span>
                      </div>

                      <div className="space-y-2">
                        {[
                          {
                            title: 'Pattern Recognition and Machine Learning',
                            author: 'Christopher M. Bishop',
                            callNum: 'QA76.87 .B57',
                            loc: '3rd Floor Stacks',
                          },
                          {
                            title: 'Hands-On Machine Learning with Scikit-Learn & TensorFlow',
                            author: 'Aurélien Géron',
                            callNum: 'QA76.73 .P98',
                            loc: 'eBook & Print Reserves',
                          },
                          {
                            title: 'Deep Learning',
                            author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
                            callNum: 'QA76.88 .G66',
                            loc: 'Course Reserves (2-hr Loan)',
                          },
                        ].map((b, idx) => {
                          const isReserved = reservedBooks.includes(b.title);
                          return (
                            <div
                              key={idx}
                              className="p-3 bg-white border border-[#141210] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                            >
                              <div className="space-y-0.5">
                                <div className="text-xs font-bold text-stone-900">{b.title}</div>
                                <div className="text-[11px] text-stone-600 font-serif italic">
                                  {b.author}
                                </div>
                                <div className="text-[10px] font-mono text-stone-500">
                                  Call #{b.callNum} · {b.loc}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setReservedBooks((prev) =>
                                    prev.includes(b.title)
                                      ? prev.filter((x) => x !== b.title)
                                      : [...prev, b.title]
                                  );
                                  onShowToast(
                                    isReserved
                                      ? `Cancelled hold on ${b.title}`
                                      : `Hold confirmed! Ready for pickup at Grand Library desk.`
                                  );
                                }}
                                className={`px-3 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider cursor-pointer whitespace-nowrap ${
                                  isReserved
                                    ? 'bg-emerald-800 text-white'
                                    : 'bg-[#141210] text-white hover:bg-[#1E3A8A]'
                                }`}
                              >
                                {isReserved ? 'Reserved ✓' : 'Reserve Copy'}
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => onNavigate('library')}
                          className="px-3 py-1.5 bg-white border border-[#141210] hover:bg-stone-100 text-stone-900 text-xs font-mono uppercase cursor-pointer"
                        >
                          Book Study Carrel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 9. ADVISING CARD */}
                  {msg.cardType === 'advising' && (
                    <div className="mt-4 p-4 bg-[#F5F0E6] border-2 border-[#141210] space-y-3">
                      <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-[#1E3A8A]" />
                          <span className="font-serif font-bold text-stone-950 text-sm">
                            Assigned Academic Advisor & Faculty
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-white border border-[#141210] space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-bold text-xs text-stone-900">
                              Dr. Miriam Hawthorne
                            </div>
                            <div className="text-[11px] text-stone-600">
                              Director of Undergraduate Studies & Academic Advisor
                            </div>
                            <div className="text-[10px] font-mono text-stone-500 mt-0.5">
                              Founders Hall, Suite 204 · advising@zanzee.edu
                            </div>
                          </div>
                          <span className="text-[10px] font-mono bg-blue-100 text-blue-900 px-1.5 py-0.5 border border-blue-800 font-bold">
                            Next: Wed, Oct 7
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-200">
                          <button
                            type="button"
                            onClick={() => {
                              setBookedAdvisor(true);
                              onShowToast('Booked advising appointment for Wednesday, Oct 7 at 2:00 PM');
                            }}
                            className={`px-3 py-1.5 text-xs font-mono font-bold uppercase cursor-pointer ${
                              bookedAdvisor
                                ? 'bg-emerald-800 text-white'
                                : 'bg-[#141210] text-white hover:bg-[#1E3A8A]'
                            }`}
                          >
                            {bookedAdvisor ? 'Slot Confirmed ✓' : 'Book Advising Slot'}
                          </button>
                          <button
                            type="button"
                            onClick={() => onNavigate('messages')}
                            className="px-3 py-1.5 bg-white border border-[#141210] text-stone-900 text-xs font-mono uppercase hover:bg-stone-100 cursor-pointer"
                          >
                            Send Direct Message
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 10. AI TUTOR & INTERACTIVE QUIZ CARD */}
                  {msg.cardType === 'ai_tutor_quiz' && (
                    <div className="mt-4 p-4 bg-[#F5F0E6] border-2 border-[#141210] space-y-3">
                      <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-900" />
                          <span className="font-serif font-bold text-stone-950 text-sm">
                            Socratic Practice Question
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-stone-600">
                          CS 201 Binary Trees & Recursion
                        </span>
                      </div>

                      <div className="p-3 bg-white border border-[#141210] space-y-2">
                        <div className="text-xs font-semibold text-stone-900">
                          What is the fundamental base case when performing a recursive search for key X in a Binary Search Tree?
                        </div>

                        <div className="space-y-1.5 pt-1">
                          {[
                            {
                              id: 'opt-a',
                              text: 'When current node is null (not found) or node.key === X (found)',
                              correct: true,
                              expl: 'Correct! 🎉 If node is null, we hit a leaf boundary without finding X; if node.key === X, search succeeds!',
                            },
                            {
                              id: 'opt-b',
                              text: 'When node.left.key is strictly larger than X',
                              correct: false,
                              expl: 'Incorrect: that is part of deciding which branch to traverse, not the base case termination condition.',
                            },
                            {
                              id: 'opt-c',
                              text: 'When recursion depth reaches a hard limit of 10 nodes',
                              correct: false,
                              expl: 'Incorrect: trees may be arbitrarily deep; stopping arbitrarily produces incorrect results.',
                            },
                          ].map((opt) => {
                            const isChosen = quizSelectedOption === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => setQuizSelectedOption(opt.id)}
                                className={`w-full text-left p-2.5 border text-xs transition-colors cursor-pointer ${
                                  isChosen
                                    ? opt.correct
                                      ? 'bg-emerald-50 border-emerald-800 text-emerald-950 font-medium'
                                      : 'bg-red-50 border-red-800 text-red-950'
                                    : 'bg-[#F5F0E6] hover:bg-stone-100 border-stone-400 text-stone-800'
                                }`}
                              >
                                <div>{opt.text}</div>
                                {isChosen && (
                                  <div className="text-[11px] mt-1 font-mono font-semibold">
                                    {opt.expl}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 11. STUDENT LIFE & EVENTS CARD */}
                  {msg.cardType === 'student_life' && (
                    <div className="mt-4 p-4 bg-[#F5F0E6] border-2 border-[#141210] space-y-3">
                      <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-stone-800" />
                          <span className="font-serif font-bold text-stone-950 text-sm">
                            Campus Events & Student Organizations
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {[
                          {
                            title: 'Annual Zanzee Fall Hackathon',
                            date: 'Oct 16–17',
                            time: '9:00 AM – 8:00 PM',
                            loc: 'Turing Innovation Hub',
                          },
                          {
                            title: 'ACM Chapter: Systems & Compilers Talk',
                            date: 'Thursday, Oct 8',
                            time: '6:00 PM',
                            loc: 'Euler Pavilion 104',
                          },
                          {
                            title: 'Fall Student Organization Fair',
                            date: 'Friday, Oct 9',
                            time: '2:00 PM – 5:00 PM',
                            loc: 'Campus Quad',
                          },
                        ].map((ev, idx) => {
                          const isRsvpd = rsvpdEvents.includes(ev.title);
                          return (
                            <div
                              key={idx}
                              className="p-3 bg-white border border-[#141210] flex items-center justify-between gap-3"
                            >
                              <div className="space-y-0.5">
                                <div className="text-xs font-bold text-stone-900">{ev.title}</div>
                                <div className="text-[11px] text-stone-600 font-mono">
                                  {ev.date} · {ev.time} · {ev.loc}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setRsvpdEvents((prev) =>
                                    prev.includes(ev.title)
                                      ? prev.filter((x) => x !== ev.title)
                                      : [...prev, ev.title]
                                  );
                                  onShowToast(
                                    isRsvpd ? `RSVP cancelled for ${ev.title}` : `RSVP confirmed for ${ev.title}!`
                                  );
                                }}
                                className={`px-3 py-1.5 text-xs font-mono uppercase font-bold cursor-pointer ${
                                  isRsvpd
                                    ? 'bg-emerald-800 text-white'
                                    : 'bg-[#141210] text-white hover:bg-[#1E3A8A]'
                                }`}
                              >
                                {isRsvpd ? 'RSVP’d ✓' : 'RSVP'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 12. HUMAN ESCALATION CARD */}
                  {(msg.cardType === 'human_escalation' || msg.confidence === 'low' || msg.escalationDetails) && (
                    <div className="mt-4 p-4 bg-amber-50 border-2 border-[#141210] space-y-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-[#9A3412] shrink-0 mt-0.5" />
                        <div>
                          <div className="font-serif font-bold text-sm text-stone-950">
                            Human University Staff Escalation Required
                          </div>
                          <div className="text-xs text-stone-700 mt-0.5">
                            “I can help explain the process, but this needs to be handled by a university staff member.”
                          </div>
                        </div>
                      </div>

                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs border-y border-stone-300 py-2.5">
                        <div>
                          <dt className="font-mono text-[10px] text-stone-500 uppercase">Department</dt>
                          <dd className="font-semibold text-stone-900">
                            {msg.escalationDetails?.department || 'Academic Advising & Registrar'}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-mono text-[10px] text-stone-500 uppercase">Reason</dt>
                          <dd className="text-stone-800">
                            {msg.escalationDetails?.reason || 'Requires formal institutional approval or override'}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-mono text-[10px] text-stone-500 uppercase">Contact Option</dt>
                          <dd className="font-mono text-stone-800">
                            {msg.escalationDetails?.contactOption || 'advising@zanzee.edu · Founders Hall 204'}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-mono text-[10px] text-stone-500 uppercase">Appointment Option</dt>
                          <dd className="text-stone-800">
                            {msg.escalationDetails?.appointmentOption || 'Next advising slot: Wed, Oct 7 at 2:00 PM'}
                          </dd>
                        </div>
                      </dl>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onShowToast('Connected with Academic Advisor Dr. Miriam Hawthorne');
                            onNavigate('messages');
                          }}
                          className="px-3 py-1.5 bg-[#9A3412] text-white text-xs font-mono uppercase font-bold hover:bg-red-950 transition-colors cursor-pointer"
                        >
                          Connect with Advisor
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onShowToast('Opening Financial Aid Office');
                            onNavigate('financial-aid');
                          }}
                          className="px-3 py-1.5 bg-white border border-[#141210] text-stone-900 text-xs font-mono uppercase font-bold hover:bg-stone-100 cursor-pointer"
                        >
                          Contact Financial Aid
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onShowToast('Opening IT Support Ticket Desk');
                            onNavigate('it-support');
                          }}
                          className="px-3 py-1.5 bg-white border border-[#141210] text-stone-900 text-xs font-mono uppercase font-bold hover:bg-stone-100 cursor-pointer"
                        >
                          Open IT Ticket
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onShowToast('Opening Office of the Registrar');
                            onNavigate('campus-services');
                          }}
                          className="px-3 py-1.5 bg-white border border-[#141210] text-stone-900 text-xs font-mono uppercase font-bold hover:bg-stone-100 cursor-pointer"
                        >
                          Contact Registrar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sources Section */}
                  {msg.sender === 'ai' && msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-stone-300 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-600 font-mono">
                        <span className="flex items-center gap-1.5 font-bold text-emerald-900">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          Verified from university sources
                        </span>
                        <span>Click card to inspect source version</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.sources.map((src) => (
                          <button
                            key={src.id}
                            type="button"
                            onClick={() => setSelectedSource(src)}
                            className="text-left p-2.5 bg-[#F5F0E6] hover:bg-white border border-stone-400 hover:border-[#141210] transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold text-stone-900 group-hover:text-[#1E3A8A] truncate">
                                {src.title}
                              </span>
                              <ExternalLink className="w-3 h-3 text-stone-500 shrink-0" />
                            </div>
                            <div className="text-[10px] text-stone-600 mt-0.5 truncate">
                              {src.department} · {src.updatedAt}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Action Shortcuts */}
                  {msg.sender === 'ai' && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {msg.suggestedActions.map((act, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => onNavigate(act.targetView, act.payload)}
                          className="px-3 py-1.5 bg-[#141210] hover:bg-[#1E3A8A] text-white text-xs font-mono uppercase font-semibold transition-colors cursor-pointer whitespace-nowrap"
                        >
                          {act.label} →
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex items-center gap-2.5 text-xs text-stone-800 p-4 border-2 border-[#141210] bg-white max-w-md font-mono shadow-[2px_2px_0px_#141210]">
              <Loader2 className="w-4 h-4 animate-spin text-[#1E3A8A]" />
              <span>Campus Assistant checking official university systems & SIS...</span>
            </div>
          )}

          {errorBanner && (
            <div className="p-3 bg-red-50 border-2 border-red-900 text-xs text-red-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-700" />
                <span>{errorBanner}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorBanner(null)}
                className="underline font-bold ml-4"
              >
                Dismiss
              </button>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* ================================================================
            BOTTOM INPUT COMPOSER (ATTACHMENT, VOICE, CHAT, SEND)
           ================================================================ */}
        <div className="p-4 border-t-2 border-[#141210] bg-[#EAE2D3] space-y-2">
          {attachedFileName && (
            <div className="flex items-center justify-between px-3 py-1.5 bg-white border border-[#141210] text-xs font-mono">
              <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#1E3A8A]" />
                Document Attached: {attachedFileName}
              </span>
              <button
                type="button"
                onClick={() => setAttachedFileName(null)}
                className="text-stone-500 hover:text-stone-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setAttachedFileName(file.name);
                  onShowToast(`Attached ${file.name}`);
                }
              }}
            />

            <button
              type="button"
              onClick={() => {
                setAttachedFileName('Form_FA104_Proof_of_Enrollment.pdf');
                onShowToast('Attached Form_FA104_Proof_of_Enrollment.pdf');
              }}
              className="p-2.5 bg-white border-2 border-[#141210] text-stone-800 hover:bg-stone-200 transition-colors cursor-pointer shadow-[2px_2px_0px_#141210]"
              title="Attach document or form"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleVoiceDictation}
              className={`p-2.5 border-2 border-[#141210] transition-colors cursor-pointer shadow-[2px_2px_0px_#141210] ${
                isListening
                  ? 'bg-[#9A3412] text-white'
                  : 'bg-white text-stone-800 hover:bg-stone-200'
              }`}
              title="Voice dictation input"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Campus Assistant anything... (e.g., 'What classes do I have tomorrow?')"
              className="flex-1 px-4 py-2.5 text-sm bg-white border-2 border-[#141210] placeholder:text-stone-400 focus:outline-none focus:bg-white shadow-[2px_2px_0px_#141210]"
            />

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-5 py-2.5 bg-[#141210] hover:bg-[#1E3A8A] text-white text-xs font-mono uppercase tracking-wider font-bold flex items-center gap-2 border-2 border-[#141210] transition-colors cursor-pointer disabled:opacity-50 shadow-[2px_2px_0px_#141210]"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-stone-600">
            <span>Campus Assistant uses official university information whenever available.</span>
            <span>FERPA Protected · Direct action & institutional escalation enabled</span>
          </div>
        </div>
      </section>

      {/* ================================================================
          SOURCE INSPECTION DRAWER MODAL
         ================================================================ */}
      {selectedSource && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex justify-end"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-[#F5F0E6] h-full border-l-2 border-[#141210] p-6 flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-start justify-between border-b-2 border-[#141210] pb-4">
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-900">
                    VERIFIED OFFICIAL SOURCE
                  </div>
                  <h3 className="font-serif text-xl font-bold text-stone-950 mt-1">
                    {selectedSource.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSource(null)}
                  className="p-1.5 text-stone-600 hover:text-stone-950 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <dl className="divide-y divide-stone-300 border-t border-b border-stone-300 text-xs">
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-stone-600 font-mono">DEPARTMENT</dt>
                  <dd className="font-semibold text-stone-900 text-right">{selectedSource.department}</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-stone-600 font-mono">LAST UPDATED</dt>
                  <dd className="font-mono text-stone-900 text-right">{selectedSource.updatedAt}</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-stone-600 font-mono">DOCUMENT VERSION</dt>
                  <dd className="font-mono text-stone-900 text-right">{selectedSource.version}</dd>
                </div>
                <div className="py-2.5 flex justify-between gap-4">
                  <dt className="text-stone-600 font-mono">SECTION</dt>
                  <dd className="font-medium text-[#1E3A8A] text-right">{selectedSource.section}</dd>
                </div>
              </dl>

              <div className="space-y-2">
                <div className="text-[10px] font-mono text-stone-600 uppercase font-bold">
                  VERIFIED DOCUMENT EXCERPT
                </div>
                <blockquote className="p-4 bg-white border-2 border-[#141210] font-serif italic text-sm text-stone-900 leading-relaxed shadow-[3px_3px_0px_#141210]">
                  “{selectedSource.excerpt}”
                </blockquote>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-[#141210] flex items-center justify-between">
              <span className="text-xs font-mono text-stone-600">HIGH CONFIDENCE · AUTHORITATIVE</span>
              <button
                type="button"
                onClick={() => setSelectedSource(null)}
                className="px-4 py-2 bg-[#141210] text-white text-xs font-mono uppercase cursor-pointer"
              >
                Close Source
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
