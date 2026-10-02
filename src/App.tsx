import React, { useState } from 'react';
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
} from 'lucide-react';
import { RoleMode, ViewId } from './types';
import {
  STUDENT_PERSONA,
  COURSES,
  CAMPUS_SERVICES,
  LIBRARY_RESOURCES,
  CALENDAR_EVENTS,
  ASSETS,
} from './data/zanzeeData';
import { AuthScreen } from './components/AuthScreen';
import { AICampusAssistant } from './components/AICampusAssistant';
import {
  StudentDashboard,
  CoursesView,
  AITutorView,
  LiveLearningView,
  AssignmentsView,
  CalendarView,
  AcademicProgressView,
  GradesView,
} from './components/StudentAcademicViews';
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

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const handleNavigate = (view: ViewId, payload?: string) => {
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
          triggerToast('Signed in via Zanzee College Identity');
        }}
      />
    );
  }

  const studentSidebarLinks: Array<{ id: ViewId; label: string; highlight?: boolean }> = [
    { id: 'ai-assistant', label: '⚡ Campus Assistant (OS)', highlight: true },
    { id: 'dashboard', label: '📰 Chronicle Dashboard' },
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

  return (
    <div className="min-h-screen bg-[#EAE2D3] text-[#141210] flex flex-col">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-[#F5F0E6] border-b-2 border-[#141210] px-6 py-3 flex items-center justify-between shadow-[0px_2px_0px_#141210]">
        {/* Zone 1: Wordmark & Tagline */}
        <div className="flex items-center gap-3">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              handleNavigate('ai-assistant');
            }}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 bg-[#141210] text-[#F5F0E6] font-serif font-bold text-base flex items-center justify-center border border-[#141210] shrink-0">
              CA
            </div>
            <div>
              <div className="font-serif text-lg font-bold tracking-tight text-stone-900 group-hover:text-[#1E3A8A] transition-colors leading-none">
                Campus Assistant
              </div>
              <div className="text-[10px] text-stone-600 font-mono tracking-tight hidden sm:block mt-0.5">
                "Your entire university, in one conversation."
              </div>
            </div>
          </a>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-mono font-medium text-stone-700">
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
            <span>💬 Campus Assistant</span>
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
            Chronicle Dashboard
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
          <button
            type="button"
            onClick={() => handleRoleSwitch('faculty')}
            className={`hover:text-stone-950 transition-colors cursor-pointer whitespace-nowrap ${
              role === 'faculty' ? 'text-stone-900 underline underline-offset-4 font-bold' : ''
            }`}
          >
            Faculty Edition
          </button>
          <button
            type="button"
            onClick={() => handleRoleSwitch('admin')}
            className={`hover:text-stone-950 transition-colors cursor-pointer whitespace-nowrap ${
              role === 'admin' ? 'text-stone-900 underline underline-offset-4 font-bold' : ''
            }`}
          >
            Administration
          </button>
        </nav>

        {/* Zone 3: 2 Primary Actions (Global Search + Ask AI / Sign Out) */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="px-3 py-1.5 text-xs font-mono font-medium text-stone-800 bg-[#F5F0E6] border border-[#141210] hover:bg-white flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-[1px_1px_0px_#141210]"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search SIS</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-1.5 text-xs font-mono font-bold text-white bg-[#141210] hover:bg-[#1E3A8A] border border-[#141210] transition-colors cursor-pointer whitespace-nowrap shadow-[1px_1px_0px_#141210]"
          >
            SSO Portal
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
                ZANZEE COLLEGE GAZETTE
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
                {[
                  { id: 'faculty-dashboard', label: 'Faculty Dashboard' },
                  { id: 'ai-assistant', label: 'Faculty AI Assistant' },
                ].map((item) => (
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
                {[
                  { id: 'admin-dashboard', label: 'Admin Dashboard' },
                  { id: 'admin-ai', label: 'AI & RAG Knowledge' },
                  { id: 'admin-observability', label: 'Observability' },
                  { id: 'admin-compliance', label: 'Compliance (FERPA)' },
                  { id: 'admin-integrations', label: 'Integrations (LTI/SSO)' },
                ].map((item) => (
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
              <img
                src={ASSETS.avatarAlex}
                alt={STUDENT_PERSONA.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 object-cover border border-[#141210] newspaper-photo shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-stone-900 truncate">
                  {STUDENT_PERSONA.name}
                </div>
                <div className="text-[11px] text-stone-600 truncate">
                  {STUDENT_PERSONA.program}
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
        <main className="flex-1 p-6 lg:p-8 pb-24 lg:pb-12 min-w-0">
          {role === 'faculty' && currentView !== 'ai-assistant' ? (
            <FacultyPortalView
              currentView={currentView}
              onNavigate={handleNavigate}
              onShowToast={triggerToast}
            />
          ) : role === 'admin' && currentView !== 'ai-assistant' ? (
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

      {/* Mobile Bottom Navigation (Home, AI, Courses, Calendar, Profile) */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-stone-300 grid grid-cols-5 py-2 px-2"
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
              className={`flex flex-col items-center justify-center py-1 text-[11px] font-medium ${
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
          <div className="bg-white border border-stone-300 w-full max-w-2xl p-6 space-y-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="text-xs font-mono text-[#1E3A8A]">
                GLOBAL ZANZEE UNIVERSITY SEARCH
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
                placeholder="Search across courses, people, policies, library, events, or ask AI..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FBF9F5] border border-stone-300 focus:border-[#1E3A8A] focus:outline-none"
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
                      className="w-full text-left p-2.5 hover:bg-[#FBF9F5] flex justify-between"
                    >
                      <span className="font-semibold text-stone-900">
                        {c.code} — {c.title}
                      </span>
                      <span className="text-stone-500">{c.professor}</span>
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
                      className="w-full text-left p-2.5 hover:bg-[#FBF9F5] flex justify-between"
                    >
                      <span className="font-semibold text-stone-900">{s.title}</span>
                      <span className="text-stone-500">{s.location}</span>
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
          className="fixed bottom-16 lg:bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 text-xs font-medium border border-stone-700 shadow-md flex items-center gap-3"
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
