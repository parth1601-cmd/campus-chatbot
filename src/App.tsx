import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  X,
  MessageSquare,
  Home,
  BookOpen,
  Calendar,
  User,
  LogOut,
  Menu,
} from 'lucide-react';
import { RoleMode, ViewId } from './types';
import {
  STUDENT_PERSONA,
  COURSES,
  CAMPUS_SERVICES,
  LIBRARY_RESOURCES,
  CALENDAR_EVENTS,
} from './data/zanzeeData';
import { searchMcaTopics } from './data/mcaSyllabus';
import { AuthScreen } from './components/AuthScreen';
import { AICampusAssistant } from './components/AICampusAssistant';
import { AdmissionsView } from './components/AdmissionsView';
import { FacultyDirectoryView } from './components/FacultyDirectoryView';
import { KJCLogo } from './components/KJCLogo';
import {
  StudentDashboard,
  AITutorView,
  LiveLearningView,
  AssignmentsView,
  CalendarView,
  AcademicProgressView,
  GradesView,
} from './components/StudentAcademicViews';
import { CoursesView } from './components/MyCoursesView';
import {
  FinancialAidView,
  CampusServicesView,
  ITSupportView,
  LibraryView,
  MessagesView,
  NotificationsAndSettingsView,
} from './components/StudentServiceViews';
import { FacultyPortalView, AdminPortalView } from './components/FacultyAndAdminViews';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [role, setRole] = useState<RoleMode>('student');
  const [currentView, setCurrentView] = useState<ViewId>('ai-assistant');
  const [selectedCoursePayload, setSelectedCoursePayload] = useState<string | undefined>(undefined);
  const [pendingAIPrompt, setPendingAIPrompt] = useState<string | undefined>(undefined);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // Mobile/tablet nav drawer: close on Escape + lock background scroll while open.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const handleNavigate = (view: ViewId, payload?: string) => {
    if (view === 'faculty-dashboard') {
      setRole('faculty');
      setCurrentView('faculty-dashboard');
      triggerToast('Opened Faculty Edition Console');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (view === 'admin-dashboard' && role === 'faculty') {
      setRole('admin');
      setCurrentView('admin-dashboard');
      triggerToast('Switched to Administration Console');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (view === 'course-detail') {
      setSelectedCoursePayload(payload || 'cs-201');
      setCurrentView('courses');
    } else {
      if (view === 'courses') setSelectedCoursePayload(undefined);
      setCurrentView(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskAI = (prompt: string) => {
    setPendingAIPrompt(prompt);
    setCurrentView('ai-assistant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleSwitch = (newRole: RoleMode) => {
    setRole(newRole);
    if (newRole === 'student') setCurrentView('ai-assistant');
    if (newRole === 'faculty') setCurrentView('faculty-dashboard');
    if (newRole === 'admin') setCurrentView('admin-dashboard');
    triggerToast(`Switched edition to ${newRole.toUpperCase()} Portal`);
  };

  if (!isAuthenticated) {
    return (
      <AuthScreen
        onAuthenticated={(selectedRole) => {
          setRole(selectedRole);
          setIsAuthenticated(true);
          if (selectedRole === 'student') setCurrentView('ai-assistant');
          if (selectedRole === 'faculty') setCurrentView('faculty-dashboard');
          if (selectedRole === 'admin') setCurrentView('admin-dashboard');
          triggerToast('Signed in via Kristu Jayanti Institute of Technology Identity');
        }}
      />
    );
  }

  const studentSidebarLinks: Array<{ id: ViewId; label: string; highlight?: boolean }> = [
    { id: 'ai-assistant', label: '💬 AI Chatbot' },
    { id: 'dashboard', label: '📰 The Kristu Chronicle' },
    { id: 'admissions', label: '🎓 Admissions & Fees' },
    { id: 'faculty-directory', label: '👨‍🏫 Faculty & Mentors' },
    { id: 'courses', label: '📚 My Courses' },
    { id: 'assignments', label: '📝 Assignments' },
    { id: 'calendar', label: '📅 Schedule & Timetable' },
    { id: 'grades', label: '🏆 Grades & GPA' },
    { id: 'academic-progress', label: '🎓 Academic Progress' },
    { id: 'financial-aid', label: '💰 Financial Aid & Bursar' },
    { id: 'it-support', label: '💻 IT Support Desk' },
    { id: 'library', label: '📖 Library Research' },
    { id: 'campus-services', label: '🏫 Campus Services' },
    { id: 'messages', label: '✉️ Advising Messages' },
    { id: 'ai-tutor', label: '💡 AI Tutor' },
    { id: 'live-learning', label: '🎥 Live Class & VOD' },
    { id: 'notifications', label: '🔔 Notifications' },
    { id: 'profile', label: '🔒 Privacy & Settings' },
  ];

  const facultySidebarLinks: Array<{ id: ViewId; label: string }> = [
    { id: 'faculty-dashboard', label: '👨‍🏫 Teacher & Study Console' },
    { id: 'admin-dashboard', label: '🛡️ Administration Console' },
    { id: 'admin-chronicle', label: '📰 Chronicle Editor' },
    { id: 'dashboard', label: '📰 The Kristu Chronicle' },
    { id: 'faculty-directory', label: '👥 Faculty Directory' },
    { id: 'courses', label: '📖 Course LMS' },
    { id: 'ai-assistant', label: '💬 AI Chatbot' },
  ];

  const adminSidebarLinks: Array<{ id: ViewId; label: string }> = [
    { id: 'admin-dashboard', label: 'Admin Dashboard' },
    { id: 'admin-chronicle', label: '📰 The Kristu Chronicle Editor' },
    { id: 'faculty-dashboard', label: '👨‍🏫 Faculty Edition' },
    { id: 'admin-ai', label: 'AI & RAG Knowledge' },
    { id: 'admin-observability', label: 'Observability' },
    { id: 'admin-compliance', label: 'Compliance (FERPA)' },
    { id: 'admin-integrations', label: 'Integrations (LTI/SSO)' },
  ];

  const drawerLinks =
    role === 'student' ? studentSidebarLinks : role === 'faculty' ? facultySidebarLinks : adminSidebarLinks;

  const closeMenuAndNavigate = (view: ViewId, payload?: string) => {
    setMenuOpen(false);
    handleNavigate(view, payload);
  };

  // Global Search Results
  const q = globalSearchQuery.trim().toLowerCase();
  const matchedCourses = q
    ? COURSES.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.professor.toLowerCase().includes(q)
      )
    : COURSES.slice(0, 2);
  const matchedServices = q
    ? CAMPUS_SERVICES.filter(
        (s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
      )
    : CAMPUS_SERVICES.slice(0, 2);
  const matchedLibrary = q
    ? LIBRARY_RESOURCES.filter((l) => l.title.toLowerCase().includes(q))
    : LIBRARY_RESOURCES.slice(0, 2);
  const matchedSyllabus = q ? searchMcaTopics(globalSearchQuery, 4) : [];

  return (
    <div className="min-h-screen bg-[#EAE2D3] text-[#141210] flex flex-col">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-[#F5F0E6] border-b-2 border-[#141210] px-4 sm:px-6 py-3 flex items-center justify-between gap-2 flex-wrap shadow-[0px_2px_0px_#141210]">
        {/* Zone 1: Menu + Wordmark & Tagline with Official KJC Emblem */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="site-nav-drawer"
            aria-label="Open site navigation menu"
            className="lg:hidden p-2 -ml-1 min-h-[40px] min-w-[40px] flex items-center justify-center text-stone-800 hover:bg-white border border-transparent hover:border-[#141210] transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              handleNavigate('dashboard');
            }}
            className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer min-w-0"
          >
            <KJCLogo variant="emblem" size="sm" />
            <div className="min-w-0">
              <div className="font-serif text-base sm:text-lg font-bold tracking-tight text-stone-900 group-hover:text-[#1E3A8A] transition-colors leading-none flex items-center gap-1.5">
                <span className="truncate">The Kristu Chronicle</span>
                <span className="hidden min-[380px]:inline text-[9px] bg-[#1E3A8A] text-white px-1.5 py-0.5 font-mono uppercase font-bold shrink-0">
                  AI OS
                </span>
              </div>
              <div className="text-[10px] text-stone-600 font-mono tracking-tight hidden sm:block mt-0.5 truncate">
                Kristu Jayanti College · Autonomous Bengaluru
              </div>
            </div>
          </a>
        </div>

        {/* Zone 2: Clean single-line text navigation links (desktop only; drawer serves tablet/mobile) */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-mono font-medium text-stone-700" aria-label="Primary">
          <button
            type="button"
            onClick={() => {
              setRole('student');
              handleNavigate('ai-assistant');
            }}
            className={`hover:text-stone-950 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              currentView === 'ai-assistant'
                ? 'text-[#1E3A8A] font-bold underline underline-offset-4'
                : ''
            }`}
          >
            <span>💬 AI Chatbot</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('student');
              handleNavigate('dashboard');
            }}
            className={`hover:text-stone-950 transition-colors cursor-pointer whitespace-nowrap ${
              role === 'student' && currentView === 'dashboard'
                ? 'text-stone-900 underline underline-offset-4 font-bold'
                : ''
            }`}
          >
            The Kristu Chronicle
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('student');
              handleNavigate('admissions');
            }}
            className={`hover:text-stone-950 transition-colors cursor-pointer whitespace-nowrap ${
              currentView === 'admissions' ? 'text-stone-900 underline underline-offset-4 font-bold' : ''
            }`}
          >
            Admissions & Fees
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('student');
              handleNavigate('faculty-directory');
            }}
            className={`hover:text-stone-950 transition-colors cursor-pointer whitespace-nowrap ${
              currentView === 'faculty-directory' ? 'text-stone-900 underline underline-offset-4 font-bold' : ''
            }`}
          >
            Faculty & Mentors
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('student');
              handleNavigate('courses');
            }}
            className={`hover:text-stone-950 transition-colors cursor-pointer whitespace-nowrap ${
              currentView === 'courses' ? 'text-stone-900 underline underline-offset-4 font-bold' : ''
            }`}
          >
            Courses
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('student');
              handleNavigate('calendar');
            }}
            className={`hover:text-stone-950 transition-colors cursor-pointer whitespace-nowrap ${
              currentView === 'calendar' ? 'text-stone-900 underline underline-offset-4 font-bold' : ''
            }`}
          >
            Schedule
          </button>
          {/* Faculty Edition is only accessible via Administration / Faculty login, NOT student login */}
          {(role === 'admin' || role === 'faculty') && (
            <button
              type="button"
              onClick={() => handleRoleSwitch('faculty')}
              className={`hover:text-stone-950 transition-colors cursor-pointer whitespace-nowrap ${
                role === 'faculty' ? 'text-[#1E3A8A] underline underline-offset-4 font-bold' : ''
              }`}
            >
              👨‍🏫 Faculty Edition
            </button>
          )}
        </nav>

        {/* Zone 3: 2 Primary Actions (Global Search + Ask AI / Sign Out) */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-mono font-medium text-stone-800 bg-[#F5F0E6] border border-[#141210] hover:bg-white flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-[1px_1px_0px_#141210]"
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden min-[400px]:inline">Search SIS</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAuthenticated(false)}
            className="px-2 sm:px-3 py-1.5 min-h-[36px] text-[11px] sm:text-xs font-mono font-bold text-white bg-[#141210] hover:bg-[#1E3A8A] border border-[#141210] transition-colors cursor-pointer whitespace-nowrap shadow-[1px_1px_0px_#141210]"
          >
            SSO<span className="hidden min-[380px]:inline"> Portal</span>
          </button>
        </div>
      </header>

      {/* Main Workspace: Left Sidebar + Editorial Content Viewport */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 shrink-0 border-r-2 border-[#141210] bg-[#F5F0E6] flex-col justify-between p-5">
          <div className="space-y-5">
            <div className="border-b border-stone-200 pb-3">
              <div className="text-[11px] font-mono text-stone-500">
                KRISTU JAYANTI INSTITUTE OF TECHNOLOGY GAZETTE
              </div>
              <div className="text-xs font-semibold text-stone-900 mt-0.5">
                {role === 'student'
                  ? 'Student Portal & LMS'
                  : role === 'faculty'
                  ? 'Faculty Senate Desk'
                  : 'Executive Governance'}
              </div>
            </div>

            {role === 'student' ? (
              <nav className="space-y-0.5" aria-label="Student Navigation">
                {studentSidebarLinks.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      currentView === item.id
                        ? 'bg-[#1E3A8A] text-white'
                        : 'text-stone-700 hover:bg-[#FBF9F5] hover:text-stone-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            ) : role === 'faculty' ? (
              <nav className="space-y-1" aria-label="Faculty Navigation">
                {facultySidebarLinks.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigate(item.id as ViewId)}
                    className={`w-full text-left px-3 py-2 text-xs font-medium cursor-pointer ${
                      currentView === item.id
                        ? 'bg-[#1E3A8A] text-white'
                        : 'text-stone-700 hover:bg-[#FBF9F5]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            ) : (
              <nav className="space-y-1" aria-label="Admin Navigation">
                {adminSidebarLinks.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigate(item.id as ViewId)}
                    className={`w-full text-left px-3 py-2 text-xs font-medium cursor-pointer ${
                      currentView === item.id
                        ? 'bg-[#1E3A8A] text-white'
                        : 'text-stone-700 hover:bg-[#FBF9F5]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            )}
          </div>

          {/* Bottom Student Persona Profile Card */}
          <div className="pt-4 border-t border-stone-200 space-y-3">
            <button
              type="button"
              onClick={() => {
                setRole('student');
                handleNavigate('profile');
              }}
              className="w-full flex items-center gap-3 text-left hover:bg-[#FBF9F5] p-1.5 transition-colors cursor-pointer"
            >
              <div
                aria-label={STUDENT_PERSONA.name}
                className="w-9 h-9 flex items-center justify-center bg-[#1E3A8A] text-white text-xs font-bold border border-[#141210] shrink-0"
              >
                PP
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-stone-900 truncate">
                  Parth Pimplapure
                </div>
                <div className="text-[11px] text-stone-600 truncate">
                  MCA · Division D · 26MCAD30
                </div>
              </div>
            </button>

            <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
              <button
                type="button"
                onClick={() => {
                  setRole('student');
                  handleNavigate('notifications');
                }}
                className="hover:text-stone-900 flex items-center gap-1 cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>2 Unread Alerts</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAuthenticated(false)}
                className="hover:text-stone-900 flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12 min-w-0 overflow-x-clip">
          {role === 'faculty' && currentView === 'faculty-dashboard' ? (
            <FacultyPortalView
              currentView={currentView}
              onNavigate={handleNavigate}
              onShowToast={triggerToast}
            />
          ) : role === 'admin' && currentView.startsWith('admin') ? (
            <AdminPortalView
              currentView={currentView}
              onNavigate={handleNavigate}
              onShowToast={triggerToast}
            />
          ) : (
            <>
              {currentView === 'dashboard' && (
                <StudentDashboard
                  onNavigate={handleNavigate}
                  onAskAI={handleAskAI}
                  onShowToast={triggerToast}
                />
              )}
              {currentView === 'ai-assistant' && (
                <AICampusAssistant
                  initialPrompt={pendingAIPrompt}
                  onClearInitialPrompt={() => setPendingAIPrompt(undefined)}
                  onNavigate={handleNavigate}
                  onShowToast={triggerToast}
                />
              )}
              {currentView === 'admissions' && (
                <AdmissionsView
                  onNavigate={handleNavigate}
                  onAskAI={handleAskAI}
                  onShowToast={triggerToast}
                />
              )}
              {currentView === 'faculty-directory' && (
                <FacultyDirectoryView
                  onNavigate={handleNavigate}
                  onAskAI={handleAskAI}
                  onShowToast={triggerToast}
                />
              )}
              {currentView === 'courses' && (
                <CoursesView
                  selectedCourseId={selectedCoursePayload}
                  onNavigate={handleNavigate}
                  onAskAI={handleAskAI}
                  onShowToast={triggerToast}
                />
              )}
              {currentView === 'ai-tutor' && (
                <AITutorView
                  onNavigate={handleNavigate}
                  onAskAI={handleAskAI}
                  onShowToast={triggerToast}
                />
              )}
              {currentView === 'live-learning' && (
                <LiveLearningView
                  onNavigate={handleNavigate}
                  onAskAI={handleAskAI}
                  onShowToast={triggerToast}
                />
              )}
              {currentView === 'assignments' && (
                <AssignmentsView
                  onNavigate={handleNavigate}
                  onAskAI={handleAskAI}
                  onShowToast={triggerToast}
                />
              )}
              {currentView === 'calendar' && (
                <CalendarView
                  onNavigate={handleNavigate}
                  onAskAI={handleAskAI}
                  onShowToast={triggerToast}
                />
              )}
              {currentView === 'academic-progress' && (
                <AcademicProgressView
                  onNavigate={handleNavigate}
                  onAskAI={handleAskAI}
                  onShowToast={triggerToast}
                />
              )}
              {currentView === 'grades' && (
                <GradesView
                  onNavigate={handleNavigate}
                  onAskAI={handleAskAI}
                  onShowToast={triggerToast}
                />
              )}
              {currentView === 'financial-aid' && (
                <FinancialAidView
                  onNavigate={handleNavigate}
                  onAskAI={handleAskAI}
                  onShowToast={triggerToast}
                />
              )}
              {currentView === 'campus-services' && (
                <CampusServicesView
                  onNavigate={handleNavigate}
                  onAskAI={handleAskAI}
                  onShowToast={triggerToast}
                />
              )}
              {currentView === 'it-support' && (
                <ITSupportView
                  onNavigate={handleNavigate}
                  onAskAI={handleAskAI}
                  onShowToast={triggerToast}
                />
              )}
              {currentView === 'library' && (
                <LibraryView
                  onNavigate={handleNavigate}
                  onAskAI={handleAskAI}
                  onShowToast={triggerToast}
                />
              )}
              {currentView === 'messages' && (
                <MessagesView
                  onNavigate={handleNavigate}
                  onAskAI={handleAskAI}
                  onShowToast={triggerToast}
                />
              )}
              {(currentView === 'notifications' || currentView === 'profile') && (
                <NotificationsAndSettingsView
                  mode={currentView}
                  onNavigate={handleNavigate}
                  onAskAI={handleAskAI}
                  onShowToast={triggerToast}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Site Navigation Drawer (tablet + mobile): every section reachable */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Site navigation">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/50 cursor-default"
          />
          <div
            id="site-nav-drawer"
            className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-[#F5F0E6] border-r-2 border-[#141210] flex flex-col min-h-0 pb-[env(safe-area-inset-bottom)]"
          >
            <div className="flex items-center justify-between gap-2 px-4 py-3 border-b-2 border-[#141210] shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <KJCLogo variant="emblem" size="sm" />
                <span className="font-serif text-sm font-bold text-stone-900 truncate">
                  {role === 'student' ? 'Student Portal & LMS' : role === 'faculty' ? 'Faculty Senate Desk' : 'Executive Governance'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation menu"
                className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center text-stone-600 hover:text-stone-950 hover:bg-white border border-transparent hover:border-[#141210] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <nav className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3" aria-label="Site sections">
              <div className="space-y-0.5">
                {drawerLinks.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => closeMenuAndNavigate(item.id)}
                    aria-current={currentView === item.id ? 'page' : undefined}
                    className={`w-full min-h-[44px] flex items-center text-left px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                      currentView === item.id
                        ? 'bg-[#1E3A8A] text-white'
                        : 'text-stone-700 hover:bg-[#FBF9F5] hover:text-stone-900'
                    }`}
                  >
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </nav>
            <div className="p-3 border-t border-stone-300 shrink-0">
              <div className="text-xs font-semibold text-stone-900 truncate">Parth Pimplapure</div>
              <div className="text-[11px] text-stone-600 truncate">MCA · Division D · 26MCAD30</div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation (Home, AI, Courses, Calendar, Profile) */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-stone-300 grid grid-cols-5 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] px-1 sm:px-2 gap-1 overflow-hidden"
        aria-label="Mobile Navigation"
      >
        {[
          { id: 'dashboard', label: 'Home', icon: Home },
          { id: 'ai-assistant', label: 'AI', icon: MessageSquare },
          { id: 'courses', label: 'Courses', icon: BookOpen },
          { id: 'calendar', label: 'Calendar', icon: Calendar },
          { id: 'profile', label: 'Profile', icon: User },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setRole('student');
                handleNavigate(item.id as ViewId);
              }}
              aria-current={currentView === item.id ? 'page' : undefined}
              className={`flex flex-col items-center justify-center py-1 px-0.5 min-h-[44px] text-[10px] sm:text-[11px] font-medium truncate ${
                currentView === item.id ? 'text-[#1E3A8A]' : 'text-stone-600'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Global University Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-16 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-stone-300 w-full max-w-2xl p-4 sm:p-6 space-y-5 shadow-lg max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="text-xs font-mono text-[#1E3A8A]">
                GLOBAL KRISTU JAYANTI SEARCH
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-stone-500 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder="Search courses, people, policies, library…"
                className="w-full pl-10 pr-4 py-2.5 text-base sm:text-sm bg-[#FBF9F5] border border-stone-300 focus:border-[#1E3A8A] focus:outline-none"
              />
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto text-xs">
              <div>
                <div className="font-mono text-stone-500 mb-1.5">COURSES & FACULTY</div>
                <div className="divide-y divide-stone-200 border border-stone-200">
                  {matchedCourses.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        setRole('student');
                        handleNavigate('course-detail', c.id);
                      }}
                      className="w-full text-left p-2.5 hover:bg-[#FBF9F5] flex justify-between gap-3 min-w-0"
                    >
                      <span className="font-semibold text-stone-900 truncate min-w-0">
                        {c.code} — {c.title}
                      </span>
                      <span className="text-stone-500 shrink-0 hidden sm:inline">{c.professor}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-mono text-stone-500 mb-1.5">CAMPUS SERVICES & POLICIES</div>
                <div className="divide-y divide-stone-200 border border-stone-200">
                  {matchedServices.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        setRole('student');
                        handleNavigate('campus-services');
                      }}
                      className="w-full text-left p-2.5 hover:bg-[#FBF9F5] flex justify-between gap-3 min-w-0"
                    >
                      <span className="font-semibold text-stone-900 truncate min-w-0">{s.title}</span>
                      <span className="text-stone-500 shrink-0 hidden sm:inline">{s.location}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-mono text-stone-500 mb-1.5">DIGITAL LIBRARY ARCHIVES</div>
                <div className="divide-y divide-stone-200 border border-stone-200">
                  {matchedLibrary.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        setRole('student');
                        handleNavigate('library');
                      }}
                      className="w-full text-left p-2.5 hover:bg-[#FBF9F5] flex justify-between"
                    >
                      <span className="font-semibold text-stone-900 truncate pr-4">{l.title}</span>
                      <span className="font-mono text-stone-500 shrink-0">{l.callNumber}</span>
                    </button>
                  ))}
                </div>
              </div>

              {matchedSyllabus.length > 0 && (
                <div>
                  <div className="font-mono text-stone-500 mb-1.5">MCA SEM-I SYLLABUS · ASSESSMENT TOPICS</div>
                  <div className="divide-y divide-stone-200 border border-stone-200">
                    {matchedSyllabus.map((t, idx) => (
                      <button
                        key={`${t.subjectId}-${t.unit}-${idx}`}
                        type="button"
                        onClick={() => {
                          const qText = `Teach me ${t.topic} (${t.subjectName}, ${t.unit})`;
                          setSearchOpen(false);
                          handleAskAI(qText);
                        }}
                        className="w-full text-left p-2.5 hover:bg-[#FBF9F5] flex justify-between gap-3"
                      >
                        <span className="font-semibold text-stone-900 truncate pr-4">{t.topic}</span>
                        <span className="font-mono text-stone-500 shrink-0">
                          {t.shortName} · {t.unit}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {globalSearchQuery.trim() && (
              <div className="pt-2 border-t border-stone-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const qText = globalSearchQuery;
                    setSearchOpen(false);
                    handleAskAI(qText);
                  }}
                  className="px-4 py-2 bg-[#1E3A8A] text-white text-xs font-medium cursor-pointer"
                >
                  Ask CampusAI about “{globalSearchQuery}” →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="fixed bottom-16 lg:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 bg-stone-900 text-white px-4 py-3 text-xs font-medium border border-stone-700 shadow-md flex items-center gap-3"
          role="status"
        >
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-stone-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
