import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  Play,
  CheckCircle2,
  Video,
  Mic,
  MicOff,
  VideoOff,
  MonitorUp,
  Hand,
  Users,
  Bookmark,
  Loader2,
  Sparkles,
  Plus,
  Check,
  Tag,
  BookOpen,
  Filter,
} from 'lucide-react';
import { Course, AssignmentItem, ViewId, PersonalizedCourseRecommendation } from '../types';
import {
  STUDENT_PERSONA,
  COURSES,
  ASSIGNMENTS,
  CALENDAR_EVENTS,
  AI_RECOMMENDATIONS,
  COURSE_CATALOG,
  INITIAL_COURSE_RECOMMENDATIONS,
  getPersonalizedRecommendations,
  ASSETS,
} from '../data/zanzeeData';

export interface SharedNavProps {
  onNavigate: (view: ViewId, payload?: string) => void;
  onAskAI: (prompt: string) => void;
  onShowToast: (msg: string) => void;
}

export const StudentDashboard: React.FC<SharedNavProps> = ({
  onNavigate,
  onAskAI,
  onShowToast,
}) => {
  const [heroQuery, setHeroQuery] = useState('');
  const [selectedEditionSection, setSelectedEditionSection] = useState<
    'All Dispatches' | 'Academic & LMS' | 'Campus Gazette' | 'Bursar & Aid'
  >('All Dispatches');
  const [reportOpen, setReportOpen] = useState(false);
  const [recCategoryFilter, setRecCategoryFilter] = useState<string>('All');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(STUDENT_PERSONA.statedInterests);
  const [plannedCourseIds, setPlannedCourseIds] = useState<string[]>(['cs-310']);
  const [interestsModalOpen, setInterestsModalOpen] = useState(false);
  const [newInterestInput, setNewInterestInput] = useState('');

  const togglePlannedCourse = (courseId: string, courseCode: string) => {
    if (plannedCourseIds.includes(courseId)) {
      setPlannedCourseIds((prev) => prev.filter((id) => id !== courseId));
      onShowToast(`Removed ${courseCode} from Spring 2027 Plan`);
    } else {
      setPlannedCourseIds((prev) => [...prev, courseId]);
      onShowToast(`Added ${courseCode} to Spring 2027 Pre-Registration Plan ✓`);
    }
  };

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterestInput.trim()) return;
    const trimmed = newInterestInput.trim();
    if (!selectedInterests.includes(trimmed)) {
      setSelectedInterests((prev) => [...prev, trimmed]);
      onShowToast(`Added interest: "${trimmed}"`);
    }
    setNewInterestInput('');
  };

  const currentRecommendations = getPersonalizedRecommendations(selectedInterests, recCategoryFilter);

  const generateReportText = () => {
    return `====================================================================
THE ZANZEE CHRONICLE — OFFICIAL CAMPUSAI INTELLIGENCE & ACADEMIC REPORT
====================================================================
Institution: Zanzee College (Northstar University Consortium)
Edition: Vol. CXIV, No. 42 — Fall 2026 Semester Report
Generated For: ${STUDENT_PERSONA.name} (ID #${STUDENT_PERSONA.id})
Program: ${STUDENT_PERSONA.program} (${STUDENT_PERSONA.year})
Cumulative GPA: ${STUDENT_PERSONA.gpa} | Credits Completed: ${STUDENT_PERSONA.creditsCompleted}/${STUDENT_PERSONA.creditsRequired} (60%)
Academic Advisor: ${STUDENT_PERSONA.advisor}

1. EXECUTIVE SUMMARY & PLATFORM ARCHITECTURE
--------------------------------------------------------------------
- Aesthetic & Design System: Zanzee College Chronicle Broadsheet UI
  * Newsprint Paper Palette: Warm Newsprint Canvas (#EAE2D3), Broadsheet Sheet (#F5F0E6), Recessed Press Wells (#E6DEC8), Carbon Printer's Ink (#141210), Press Stamp Burgundy (#6E261A)
  * Typography: Playfair Display (--font-serif) for masthead, hero headlines, and section headers; Plus Jakarta Sans (--font-sans) for body copy; JetBrains Mono (--font-mono) for tabular ledgers; Small-Caps & Drop-Cap lead-in paragraph styling for announcements
- AI Engine & Master Prompt v5.0 Governance:
  * 5-Level Knowledge Priority Hierarchy (Level 1 Student Auth Data -> Level 5 Web)
  * 7 Response Modes (General Assistant, Academic Tutor, Advising, Financial Aid, IT Support, Policy & Handbook, Faculty/Staff)
  * RAG Grounding with Source Citations, Confidence Scoring, and Human Escalation Triggers
  * FERPA, GDPR, WCAG 2.2 AA, and Prompt-Injection Guardrails

2. ENROLLED COURSE STANDINGS (FALL 2026)
--------------------------------------------------------------------
${COURSES.map(
  (c) =>
    `- ${c.code}: ${c.title} | Instructor: ${c.professor} | Grade: ${c.currentGrade} (${c.numericScore}%) | Progress: ${c.progress}% | Next Session: ${c.nextClass} (${c.room})`
).join('\n')}

3. ACTIVE ASSIGNMENT DEADLINES & DELIVERABLES
--------------------------------------------------------------------
${ASSIGNMENTS.map(
  (a) =>
    `- [${a.courseCode}] ${a.title} | Due: ${a.dueDate} | Progress: ${a.progress}% | Priority: ${a.priority.toUpperCase()} | Status: ${a.statusText}`
).join('\n')}

4. FINANCIAL AID & BURSAR SUMMARY
--------------------------------------------------------------------
- Total Fall 2026 Tuition & Fees: $21,400
- Zanzee Presidential Merit Scholarship: -$14,500
- Federal Pell Grant: -$4,500
- Remaining Net Balance Due (Oct 15, 2026): $2,400
- Pending Action: Submit signed Form FA-104 (Proof of Enrollment) before October 15, 2026.

5. DEGREE AUDIT & SPRING 2027 REGISTRATION RECOMMENDATIONS
--------------------------------------------------------------------
- Major Core Requirements: 42 / 60 Credits Completed
- General Education Requirements: 24 / 36 Credits Completed
- University Electives: 6 / 24 Credits Completed
- Recommended Next Term Courses: CS 310 (Algorithms & Complexity), CS 340 (Operating Systems)
====================================================================`;
  };

  const handleDownloadReport = () => {
    const content = generateReportText();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Zanzee_Chronicle_CampusAI_Report_${STUDENT_PERSONA.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('Downloaded Official Zanzee Chronicle Dossier Report (.txt)');
  };

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroQuery.trim()) return;
    onAskAI(heroQuery);
  };

  const urgentAssignments = ASSIGNMENTS.filter((a) => a.dueBucket !== 'completed').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Classic Broadsheet Masthead & High-Contrast Edition Ear Boxes */}
      <div className="bg-[#F5F0E6] border-2 border-[#141210] p-5 lg:p-6 space-y-4 shadow-[4px_4px_0px_#141210]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center border-b-2 border-[#141210] pb-4">
          {/* Left Ear: Weather & Campus Bulletin */}
          <div className="lg:col-span-3 border border-[#141210] p-3 bg-[#E6DEC8] text-xs space-y-1">
            <div className="font-mono font-semibold text-[#141210]">
              ZANZEE QUAD · AUTUMN 58°F
            </div>
            <div className="text-[#2E2A25] leading-snug">
              Turing Hall Labs Open 24h · Grand Library Reading Room Cap: 64%
            </div>
          </div>

          {/* Center Masthead Title */}
          <div className="lg:col-span-6 text-center space-y-1.5 px-2">
            <div className="text-[11px] font-mono tracking-widest uppercase text-stone-600">
              EST. 1912 · NORTHSTAR UNIVERSITY CONSORTIUM · STUDENT INTELLIGENCE DAILY
            </div>
            <h1
              style={{ fontFamily: 'var(--font-serif)' }}
              className="newspaper-masthead text-stone-950"
            >
              The Zanzee Chronicle
            </h1>
            <div
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-sm italic text-stone-700"
            >
              “Your Entire University, Powered by Verified Intelligence” — Special Edition for {STUDENT_PERSONA.name}
            </div>
          </div>

          {/* Right Ear: Student Academic Standing Box */}
          <div className="lg:col-span-3 border border-stone-900 p-3 bg-[#FBF9F5] text-xs space-y-1 font-mono tabular-nums">
            <div className="font-semibold text-[#1E3A8A]">
              ID #{STUDENT_PERSONA.id} · {STUDENT_PERSONA.semester.toUpperCase()}
            </div>
            <div className="text-stone-800">
              CREDITS: 72 / 120 (60%) · GPA: {STUDENT_PERSONA.gpa}
            </div>
            <div className="text-stone-600">B.Sc. Computer Science · Honours</div>
          </div>
        </div>

        {/* Double-Rule Dateline & Interactive Section Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-900 pb-3 text-xs font-mono text-stone-800">
          <div className="tabular-nums">
            VOL. CXIV · NO. 42 · THURSDAY, OCTOBER 1, 2026 · MORNING EDITION
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {(['All Dispatches', 'Academic & LMS', 'Campus Gazette', 'Bursar & Aid'] as const).map(
              (sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => {
                    setSelectedEditionSection(sec);
                    onShowToast(`Filtered broadsheet to: ${sec}`);
                  }}
                  className={`px-2.5 py-1 text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
                    selectedEditionSection === sec
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-700 hover:bg-stone-200/70'
                  }`}
                >
                  {sec}
                </button>
              )
            )}
            <button
              type="button"
              onClick={() => setReportOpen(true)}
              className="ml-1 px-3 py-1 text-xs font-mono font-bold bg-[#6E261A] text-[#F5F0E6] hover:bg-[#141210] transition-colors cursor-pointer whitespace-nowrap"
            >
              Generate Chronicle Report
            </button>
          </div>
        </div>

        {/* Printable / Downloadable Official Chronicle Report Modal */}
        {reportOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-[#F5F0E6] border-2 border-[#141210] shadow-[6px_6px_0px_#141210] max-w-3xl w-full max-h-[85vh] flex flex-col">
              <div className="p-4 border-b-2 border-[#141210] flex items-center justify-between bg-[#E6DEC8]">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#6E261A] font-bold">
                    OFFICIAL UNIVERSITY DOSSIER · ZANZEE COLLEGE CHRONICLE
                  </div>
                  <h2
                    style={{ fontFamily: 'var(--font-serif)' }}
                    className="newspaper-section-header text-[#141210]"
                  >
                    CampusAI Comprehensive Academic & Platform Report
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadReport}
                    className="px-3 py-1.5 bg-[#141210] text-[#F5F0E6] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#6E261A] transition-colors cursor-pointer"
                  >
                    Download Report (.TXT)
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportOpen(false)}
                    className="px-2.5 py-1.5 border border-[#141210] text-xs font-mono font-bold text-[#141210] hover:bg-[#141210] hover:text-[#F5F0E6] cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="p-5 overflow-y-auto space-y-4 text-xs">
                <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed bg-[#E6DEC8] p-4 border border-[#141210] text-[#141210]">
                  {generateReportText()}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Above-the-Fold Central AI Dispatch Desk */}
        <div className="pt-1 space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#1E3A8A] font-semibold">
                CAMPUSAI TELEGRAPH DESK
              </span>
              <span className="mx-2 text-stone-400">·</span>
              <span className="font-serif text-lg font-bold text-stone-900">
                Good morning, Alex. What can I help you with today?
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-900">
              Verified Sources: Registrar · LMS · Financial Aid · Library
            </span>
          </div>

          <form onSubmit={handleHeroSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                placeholder="Ask CampusAI anything about your university… (e.g., 'When is my CS assignment due?' or 'What’s my next class?')"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FBF9F5] border border-stone-900 focus:border-[#1E3A8A] focus:bg-white focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-stone-900 hover:bg-[#1E3A8A] text-white text-xs font-mono uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Query CampusAI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Journalistic Dispatch Actions */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-mono text-stone-500 mr-1">INDEX:</span>
            <button
              type="button"
              onClick={() => onNavigate('courses')}
              className="px-2.5 py-1 text-xs font-medium bg-[#FBF9F5] hover:bg-stone-900 hover:text-white border border-stone-400 text-stone-900 transition-colors cursor-pointer whitespace-nowrap"
            >
              Find my courses
            </button>
            <button
              type="button"
              onClick={() => onNavigate('assignments')}
              className="px-2.5 py-1 text-xs font-medium bg-[#FBF9F5] hover:bg-stone-900 hover:text-white border border-stone-400 text-stone-900 transition-colors cursor-pointer whitespace-nowrap"
            >
              Check assignments
            </button>
            <button
              type="button"
              onClick={() => onNavigate('calendar')}
              className="px-2.5 py-1 text-xs font-medium bg-[#FBF9F5] hover:bg-stone-900 hover:text-white border border-stone-400 text-stone-900 transition-colors cursor-pointer whitespace-nowrap"
            >
              View my schedule
            </button>
            <button
              type="button"
              onClick={() => onNavigate('financial-aid')}
              className="px-2.5 py-1 text-xs font-medium bg-[#FBF9F5] hover:bg-stone-900 hover:text-white border border-stone-400 text-stone-900 transition-colors cursor-pointer whitespace-nowrap"
            >
              Financial aid
            </button>
            <button
              type="button"
              onClick={() =>
                onAskAI('How many credits do I need to graduate and can I register for CS 310?')
              }
              className="px-2.5 py-1 text-xs font-medium bg-[#FBF9F5] hover:bg-stone-900 hover:text-white border border-stone-400 text-stone-900 transition-colors cursor-pointer whitespace-nowrap"
            >
              Academic advising
            </button>
            <button
              type="button"
              onClick={() => onNavigate('it-support')}
              className="px-2.5 py-1 text-xs font-medium bg-[#FBF9F5] hover:bg-stone-900 hover:text-white border border-stone-400 text-stone-900 transition-colors cursor-pointer whitespace-nowrap"
            >
              IT support
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Column Newspaper Broadsheet Front Page Grid */}
      <div className="bg-[#F5F0E6] border-2 border-[#141210] p-5 lg:p-6 shadow-[4px_4px_0px_#141210]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:divide-x lg:divide-[#141210]">
          {/* ================================================================
              LEFT SIDEBAR COLUMN (3 COLS): DEADLINES, URGENT ALERTS & BULLETINS
             ================================================================ */}
          <aside className="lg:col-span-3 space-y-6">
            {/* Urgent Action Alert Box */}
            <div className="border-2 border-stone-900 p-4 bg-[#FBF9F5] space-y-2.5">
              <div className="border-b border-stone-900 pb-1.5 flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-[#9A3412]">
                  URGENT BURSAR BULLETIN
                </span>
                <span className="text-[11px] font-mono tabular-nums text-stone-700">OCT 15</span>
              </div>
              <h2
                style={{ fontFamily: 'var(--font-serif)' }}
                className="newspaper-section-header text-stone-950"
              >
                Financial Aid Proof of Enrollment Required
              </h2>
              <p className="newspaper-lead-in">
                <span className="newspaper-dateline">BURSAR’S OFFICE —</span>
                Your $14,500 Zanzee Presidential Merit Scholarship requires signed Form FA-104 prior to Fall disbursement on October 15.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('financial-aid')}
                  className="px-3 py-1.5 bg-[#9A3412] text-white text-xs font-medium hover:bg-red-900 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Upload Document
                </button>
                <button
                  type="button"
                  onClick={() => onAskAI('How do I submit my Proof of Enrollment for financial aid?')}
                  className="px-2.5 py-1.5 bg-white border border-stone-900 text-stone-900 text-xs font-medium hover:bg-stone-100 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Ask AI
                </button>
              </div>
            </div>

            {/* Quick-Glance Deadlines Ledger */}
            <div className="space-y-3">
              <div className="border-t-2 border-b border-stone-900 py-2 flex items-baseline justify-between gap-2">
                <h2
                  style={{ fontFamily: 'var(--font-serif)' }}
                  className="newspaper-section-header text-stone-950"
                >
                  Assignment Deadlines
                </h2>
                <button
                  type="button"
                  onClick={() => onNavigate('assignments')}
                  className="text-[11px] font-mono text-[#1E3A8A] hover:underline cursor-pointer shrink-0"
                >
                  All →
                </button>
              </div>

              <div className="divide-y divide-stone-300">
                {urgentAssignments.map((asg) => (
                  <div key={asg.id} className="py-3 first:pt-0 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
                      <span className="font-bold text-[#1E3A8A]">{asg.courseCode}</span>
                      <span className="text-stone-600">{asg.dueDate}</span>
                    </div>
                    <h3
                      style={{ fontFamily: 'var(--font-serif)' }}
                      className="newspaper-subheadline text-stone-900"
                    >
                      {asg.title}
                    </h3>
                    <div className="flex items-center justify-between text-[11px] font-mono text-stone-600 tabular-nums">
                      <span>Progress: {asg.progress}%</span>
                      <span>Priority: {asg.priority}</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-200 border border-stone-400">
                      <div
                        className="h-full bg-stone-900"
                        style={{ width: `${asg.progress}%` }}
                      />
                    </div>
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[11px] text-stone-600 italic font-serif truncate pr-2">
                        {asg.statusText}
                      </span>
                      <button
                        type="button"
                        onClick={() => onNavigate('assignments')}
                        className="text-xs font-mono font-semibold text-stone-900 hover:text-[#1E3A8A] underline cursor-pointer shrink-0"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campus Service Wire */}
            <div className="border-t-2 border-stone-900 pt-3 space-y-2.5">
              <div className="border-b border-stone-900 pb-1.5 flex items-center justify-between">
                <h2
                  style={{ fontFamily: 'var(--font-serif)' }}
                  className="newspaper-section-header text-stone-950"
                >
                  Infrastructure Wire
                </h2>
                <span className="text-[10px] font-mono uppercase text-stone-600">IT OPS</span>
              </div>
              <p className="newspaper-lead-in">
                <span className="newspaper-dateline">NETWORK DISPATCH —</span>
                Zanzee-Secure 802.1X wireless rotated its root certificate authority this morning. Run automated AI diagnostics if your laptop prompts for trust verification.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('it-support')}
                className="text-xs font-mono font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
              >
                Open IT Help Desk →
              </button>
            </div>
          </aside>

          {/* ================================================================
              CENTER MAIN COLUMN (6 COLS): HERO ARTICLE SECTIONS & FEATURE STORIES
             ================================================================ */}
          <div className="lg:col-span-6 lg:px-6 space-y-8">
            {/* PRIMARY HERO ARTICLE */}
            <article className="space-y-4 border-b-2 border-stone-900 pb-6">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-stone-600">
                <span className="font-bold text-[#1E3A8A]">
                  LEAD ACADEMIC DISPATCH · TODAY AT 1:00 PM
                </span>
                <span className="tabular-nums">TURING HALL · ROOM 302</span>
              </div>

              <h2
                style={{ fontFamily: 'var(--font-serif)' }}
                className="newspaper-hero-headline text-stone-950"
              >
                CS 201 Convening Today on Balanced Binary Search Trees Ahead of Friday’s Autograder Deadline
              </h2>

              <p
                style={{ fontFamily: 'var(--font-serif)' }}
                className="newspaper-deck"
              >
                Professor Sarah Johnson’s afternoon seminar examines AVL double rotations and in-order successor deletion; 65% of your Lab 4 unit tests are currently passing.
              </p>

              <div className="text-xs font-mono text-stone-500 border-y border-stone-300 py-1.5 flex flex-wrap items-center justify-between gap-2">
                <span>By Department of Computer Science & Zanzee LMS Wire</span>
                <span>4 Min Read · Verified Syllabus Source</span>
              </div>

              {/* Photojournalism Frame */}
              <figure className="border border-[#141210] bg-[#E6DEC8]">
                <img
                  src={ASSETS.campusQuad}
                  alt="Students walking across the Zanzee College quadrangle toward Turing Hall"
                  referrerPolicy="no-referrer"
                  className="w-full h-64 object-cover newspaper-photo"
                />
                <figcaption
                  style={{ fontFamily: 'var(--font-serif)' }}
                  className="p-3 border-t border-[#141210] text-xs italic text-[#2E2A25]"
                >
                  Fig. 1 — Morning traffic outside Turing Hall at Zanzee College. Live WebRTC streaming and Socratic AI Tutoring are active for today’s 1:00 PM CS 201 lecture.
                </figcaption>
              </figure>

              {/* Editorial Drop-Cap & Lead-In Body Prose */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-stone-800 leading-relaxed pt-1">
                <p className="newspaper-dropcap newspaper-lead-in">
                  As Zanzee College enters Week 6 of the Fall 2026 term, Computer Science undergraduates in CS 201 (Data Structures & Algorithmic Systems) are preparing for Friday’s milestone submission on Binary Search Trees. Your personal autograder snapshot shows 4 of 6 tests passing, with <code>deleteNode()</code> and <code>heightBalance()</code> remaining.
                </p>
                <p className="newspaper-lead-in">
                  <span className="newspaper-dateline">TURING HALL, OCT. 1 —</span>
                  Today’s 1:00 PM seminar in Room 302 will walk through structural induction proofs and right-left AVL rotations. Students unable to attend in person may join the synchronous WebRTC classroom or review the annotated lecture transcript with the Socratic AI Tutor.
                </p>
              </div>

              {/* Hero Article Action Bar */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('live-learning')}
                  className="px-4 py-2 bg-stone-900 hover:bg-[#1E3A8A] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors cursor-pointer whitespace-nowrap"
                >
                  Join Live Class (1:00 PM)
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('course-detail', 'cs-201')}
                  className="px-4 py-2 bg-[#FBF9F5] border border-stone-900 text-stone-900 text-xs font-medium hover:bg-stone-100 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Open CS 201 Course
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('ai-tutor')}
                  className="px-4 py-2 bg-[#FBF9F5] border border-stone-900 text-[#1E3A8A] text-xs font-medium hover:bg-stone-100 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Launch Socratic AI Tutor
                </button>
              </div>
            </article>

            {/* SECONDARY ANNOUNCEMENT DISPATCHES (2-COLUMN BROADSHEET SPLIT BELOW THE FOLD) */}
            <section className="space-y-4">
              <div className="border-b-2 border-stone-900 pb-2 flex items-baseline justify-between gap-2">
                <h2
                  style={{ fontFamily: 'var(--font-serif)' }}
                  className="newspaper-section-header text-stone-950"
                >
                  Chronicle Announcements & Official Bulletins
                </h2>
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-600">
                  VERIFIED UNIVERSITY DISPATCHES
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:divide-x sm:divide-stone-300">
                <article className="space-y-2.5">
                  <div className="text-[11px] font-mono text-[#1E3A8A] font-semibold">
                    ACADEMIC SENATE & REGISTRAR
                  </div>
                  <h3
                    style={{ fontFamily: 'var(--font-serif)' }}
                    className="newspaper-subheadline text-stone-950"
                  >
                    Spring 2027 Priority Course Registration Opens October 19; CS 310 Recommended
                  </h3>
                  <p className="newspaper-lead-in">
                    <span className="newspaper-dateline">REGISTRAR’S DESK —</span>
                    With 72 of 120 credits completed (60% degree progress) and an A- standing in CS 201, the AI Degree Audit engine recommends pre-bookmarking <strong>CS 310 — Algorithms & Complexity</strong> and <strong>CS 340 — Operating Systems</strong>.
                  </p>
                  <div className="pt-1 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onNavigate('academic-progress')}
                      className="text-xs font-mono font-semibold text-stone-900 hover:text-[#1E3A8A] underline cursor-pointer"
                    >
                      Inspect Degree Audit →
                    </button>
                  </div>
                </article>

                <article className="sm:pl-6 space-y-2.5">
                  <div className="text-[11px] font-mono text-stone-600 font-semibold">
                    CAMPUS SYMPOSIUM & ARCHIVES
                  </div>
                  <h3
                    style={{ fontFamily: 'var(--font-serif)' }}
                    className="newspaper-subheadline text-stone-950"
                  >
                    Zanzee Fall Convocation & Grand Library Monograph Exhibition This Week
                  </h3>
                  <p className="newspaper-lead-in">
                    <span className="newspaper-dateline">GRAND LIBRARY —</span>
                    The Zanzee Special Collections Reading Room has digitized early 1962 Adelson-Velsky & Landis tree manuscripts alongside IEEE/ACM full-text citations for ENG 105 and CS 201 research papers.
                  </p>
                  <div className="pt-1 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onNavigate('library')}
                      className="text-xs font-mono font-semibold text-stone-900 hover:text-[#1E3A8A] underline cursor-pointer"
                    >
                      Explore Digital Library →
                    </button>
                  </div>
                </article>
              </div>
            </section>

            {/* ENROLLED COURSES EDITORIAL LEDGER TABLE */}
            <section className="border-t-2 border-stone-900 pt-5 space-y-3">
              <div className="flex items-baseline justify-between gap-2">
                <h2
                  style={{ fontFamily: 'var(--font-serif)' }}
                  className="newspaper-section-header text-stone-950"
                >
                  01. Fall 2026 Enrolled Course Standings
                </h2>
                <button
                  type="button"
                  onClick={() => onNavigate('courses')}
                  className="text-xs font-mono text-[#1E3A8A] hover:underline cursor-pointer shrink-0"
                >
                  Full Course Catalog →
                </button>
              </div>

              <div className="overflow-x-auto border border-stone-900">
                <table className="w-full text-left border-collapse text-xs tabular-nums">
                  <thead>
                    <tr className="border-b border-stone-900 bg-[#FBF9F5] font-mono text-[11px] text-stone-700">
                      <th className="py-2.5 px-3">COURSE</th>
                      <th className="py-2.5 px-3">INSTRUCTOR & NEXT SESSION</th>
                      <th className="py-2.5 px-3 text-right">PROGRESS</th>
                      <th className="py-2.5 px-3 text-right">STANDING</th>
                      <th className="py-2.5 px-3 text-right">DISPATCH</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-300">
                    {COURSES.map((course) => (
                      <tr key={course.id} className="hover:bg-[#FBF9F5]">
                        <td className="py-3 px-3 align-top">
                          <div className="font-mono font-bold text-stone-900">{course.code}</div>
                          <div
                            style={{ fontFamily: 'var(--font-serif)' }}
                            className="font-bold text-sm text-stone-900"
                          >
                            {course.title}
                          </div>
                        </td>
                        <td className="py-3 px-3 align-top text-stone-600">
                          <div className="text-stone-900 font-medium">{course.professor}</div>
                          <div>{course.nextClass} · {course.room}</div>
                        </td>
                        <td className="py-3 px-3 align-top text-right font-mono">
                          {course.progress}%
                        </td>
                        <td className="py-3 px-3 align-top text-right font-mono font-bold text-stone-900">
                          {course.currentGrade} ({course.numericScore}%)
                        </td>
                        <td className="py-3 px-3 align-top text-right whitespace-nowrap space-x-2">
                          <button
                            type="button"
                            onClick={() => onNavigate('course-detail', course.id)}
                            className="font-mono font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
                          >
                            Open
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onAskAI(
                                `Tell me about my upcoming deliverables and current standing in ${course.code} (${course.title}).`
                              )
                            }
                            className="font-mono text-stone-700 hover:text-stone-950 underline cursor-pointer"
                          >
                            Ask AI
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* ================================================================
              RIGHT SIDEBAR COLUMN (3 COLS): SCHEDULED EVENTS & AI RECOMMENDATIONS
             ================================================================ */}
          <aside className="lg:col-span-3 lg:pl-6 space-y-6">
            {/* Today's & Upcoming Schedule Column */}
            <div className="space-y-3">
              <div className="border-t-2 border-b border-stone-900 py-2 flex items-baseline justify-between gap-2">
                <h2
                  style={{ fontFamily: 'var(--font-serif)' }}
                  className="newspaper-section-header text-stone-950"
                >
                  Campus Calendar
                </h2>
                <button
                  type="button"
                  onClick={() => onNavigate('calendar')}
                  className="text-[11px] font-mono text-[#1E3A8A] hover:underline cursor-pointer shrink-0"
                >
                  Full →
                </button>
              </div>

              <div className="divide-y divide-stone-300">
                {CALENDAR_EVENTS.slice(0, 5).map((ev) => (
                  <div key={ev.id} className="py-2.5 first:pt-0 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 tabular-nums">
                      <span className="font-semibold text-stone-800">{ev.date}</span>
                      <span>{ev.type.toUpperCase()}</span>
                    </div>
                    <h3
                      style={{ fontFamily: 'var(--font-serif)' }}
                      className="newspaper-subheadline text-stone-900"
                    >
                      {ev.title}
                    </h3>
                    <div className="text-xs text-stone-600 font-mono tabular-nums">
                      {ev.time} · {ev.location}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onAskAI('What is my schedule today and are there any upcoming exams?')}
                className="w-full py-2 px-3 bg-[#FBF9F5] border border-stone-900 text-stone-900 text-xs font-mono font-semibold hover:bg-stone-900 hover:text-white transition-colors cursor-pointer"
              >
                Ask AI About My Schedule
              </button>
            </div>

            {/* Personalized Course Recommendation Engine Section */}
            <div className="space-y-3.5">
              <div className="border-t-2 border-b border-stone-900 py-2">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-mono font-bold text-[#1E3A8A] uppercase">
                    DEGREE AUDIT & ADVISING ENGINE
                  </div>
                  <span className="text-[10px] font-mono tabular-nums text-stone-600">SPRING 2027</span>
                </div>
                <h2
                  style={{ fontFamily: 'var(--font-serif)' }}
                  className="newspaper-section-header text-stone-950 mt-0.5"
                >
                  02. Course Recommendations
                </h2>
                <div className="text-[11px] text-stone-600 mt-1 leading-snug">
                  Analyzed from <strong>{STUDENT_PERSONA.creditsCompleted}/120 credits</strong>, <strong>{STUDENT_PERSONA.gpa} GPA</strong>, and stated interests.
                </div>
              </div>

              {/* Stated Interests Bar & Quick Filter Ribbon */}
              <div className="space-y-2 bg-[#E6DEC8] p-2.5 border border-stone-900 text-xs">
                <div className="flex items-center justify-between text-[11px] font-mono text-stone-800">
                  <span className="font-bold flex items-center gap-1">
                    <Tag className="w-3 h-3 text-[#6E261A]" />
                    <span>YOUR STATED INTERESTS</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setInterestsModalOpen(true)}
                    className="text-[#1E3A8A] font-semibold underline hover:text-stone-950 cursor-pointer"
                  >
                    Edit ({selectedInterests.length})
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedInterests.slice(0, 3).map((item) => (
                    <span
                      key={item}
                      className="px-2 py-0.5 text-[10px] font-mono bg-[#F5F0E6] border border-stone-400 text-stone-800 truncate max-w-[170px]"
                    >
                      {item}
                    </span>
                  ))}
                  {selectedInterests.length > 3 && (
                    <button
                      type="button"
                      onClick={() => setInterestsModalOpen(true)}
                      className="px-1.5 py-0.5 text-[10px] font-mono bg-stone-300 border border-stone-400 text-stone-800 hover:bg-stone-400 cursor-pointer"
                    >
                      +{selectedInterests.length - 3} more
                    </button>
                  )}
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-1 pt-1 border-t border-stone-400/60">
                  {(['All', 'Major Core', 'General Education', 'By Interest'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setRecCategoryFilter(cat)}
                      className={`px-2 py-0.5 text-[10px] font-mono transition-colors cursor-pointer ${
                        recCategoryFilter === cat
                          ? 'bg-[#141210] text-[#F5F0E6] font-bold'
                          : 'bg-[#F5F0E6] text-stone-800 border border-stone-400 hover:bg-stone-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommendations Feed with Explanations */}
              <div className="divide-y divide-stone-300">
                {currentRecommendations.slice(0, 4).map((rec) => {
                  const isPlanned = plannedCourseIds.includes(rec.courseId);
                  return (
                    <div key={rec.id} className="py-3 first:pt-0 last:pb-0 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="font-bold text-[#1E3A8A]">{rec.code}</span>
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#141210] text-[#F5F0E6]">
                          {rec.matchScore}% FIT
                        </span>
                      </div>

                      <h3
                        style={{ fontFamily: 'var(--font-serif)' }}
                        className="newspaper-subheadline text-stone-950"
                      >
                        {rec.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-stone-600">
                        <span className="px-1.5 py-0.5 bg-stone-200 border border-stone-300 font-semibold">
                          {rec.category}
                        </span>
                        <span>·</span>
                        <span>{rec.credits} Credits</span>
                        <span>·</span>
                        <span>{rec.schedule}</span>
                      </div>

                      {/* Brief Explanation Banner Required by Spec */}
                      <div className="p-2 border-l-2 border-[#6E261A] bg-[#E6DEC8] text-xs leading-relaxed space-y-0.5">
                        <span className="font-mono text-[10px] uppercase font-bold text-[#6E261A] block">
                          WHY RECOMMENDED:
                        </span>
                        <p className="text-[11px] font-serif italic text-stone-900">
                          “{rec.explanation}”
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-0.5">
                        <button
                          type="button"
                          onClick={() => togglePlannedCourse(rec.courseId, rec.code)}
                          className={`px-2.5 py-1 text-xs font-mono font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                            isPlanned
                              ? 'bg-emerald-900 text-white'
                              : 'bg-stone-900 text-[#F5F0E6] hover:bg-[#6E261A]'
                          }`}
                        >
                          {isPlanned ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Planned ✓</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              <span>Add to Plan</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onAskAI(
                              `Why is ${rec.code} (${rec.title}) recommended for my Computer Science degree plan, and how does it fit with my 72 completed credits?`
                            )
                          }
                          className="text-xs font-mono text-stone-700 hover:text-stone-950 underline cursor-pointer"
                        >
                          Ask AI Why →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer Degree Audit Deep Link */}
              <div className="pt-2 border-t border-stone-300">
                <button
                  type="button"
                  onClick={() => onNavigate('academic-progress')}
                  className="w-full py-2 px-3 bg-[#E6DEC8] border border-stone-900 text-stone-900 text-xs font-mono font-bold hover:bg-stone-900 hover:text-[#F5F0E6] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#6E261A]" />
                  <span>Open Full Degree Audit Engine</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Manage Stated Interests Modal */}
            {interestsModalOpen && (
              <div
                className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
              >
                <div className="bg-[#F5F0E6] border-2 border-stone-900 shadow-[6px_6px_0px_#141210] max-w-md w-full p-5 space-y-4">
                  <div className="border-b-2 border-stone-900 pb-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#6E261A] font-bold uppercase">
                        CAMPUSAI PREFERENCE MATRIX
                      </span>
                      <h3
                        style={{ fontFamily: 'var(--font-serif)' }}
                        className="newspaper-section-header text-stone-950"
                      >
                        Customize Stated Interests
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setInterestsModalOpen(false)}
                      className="px-2 py-1 border border-stone-900 text-xs font-mono font-bold hover:bg-stone-900 hover:text-white cursor-pointer"
                    >
                      Close
                    </button>
                  </div>

                  <p className="text-xs text-stone-700">
                    The recommendation engine matches courses against your academic track and stated interests. Toggle interests below or enter a custom focus:
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Data Structures',
                      'Algorithms & Optimization',
                      'Artificial Intelligence',
                      'Ethics & Algorithmic Justice',
                      'Systems & Architecture',
                      'Visual Journalism & Broadsheet Typography',
                      'Cybersecurity & Network Defense',
                      'Cloud Microservices',
                      'Computational Biology',
                    ].map((interest) => {
                      const active = selectedInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => {
                            if (active) {
                              setSelectedInterests((prev) => prev.filter((i) => i !== interest));
                            } else {
                              setSelectedInterests((prev) => [...prev, interest]);
                            }
                          }}
                          className={`px-2.5 py-1 text-xs font-mono border transition-colors cursor-pointer ${
                            active
                              ? 'bg-stone-900 text-white border-stone-900 font-bold'
                              : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-100'
                          }`}
                        >
                          {active ? '✓ ' : '+ '}
                          {interest}
                        </button>
                      );
                    })}
                  </div>

                  <form onSubmit={handleAddInterest} className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newInterestInput}
                      onChange={(e) => setNewInterestInput(e.target.value)}
                      placeholder="Add custom interest (e.g. Distributed Databases)..."
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-900 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-stone-900 text-white text-xs font-mono font-bold hover:bg-[#6E261A] cursor-pointer"
                    >
                      Add
                    </button>
                  </form>

                  <div className="pt-2 border-t border-stone-300 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setInterestsModalOpen(false);
                        onShowToast('Updated course recommendations based on active interests');
                      }}
                      className="px-4 py-2 bg-[#6E261A] text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-stone-900 cursor-pointer"
                    >
                      Apply & Re-Score Recommendations
                    </button>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export const CoursesView: React.FC<SharedNavProps & { selectedCourseId?: string }> = ({
  selectedCourseId,
  onNavigate,
  onAskAI,
  onShowToast,
}) => {
  const [activeCourseId, setActiveCourseId] = useState<string | null>(selectedCourseId || null);
  const [activeTab, setActiveTab] = useState<
    'Overview' | 'Content' | 'Assignments' | 'Grades' | 'Discussions' | 'AI Tutor'
  >('Overview');
  const [tutorQuery, setTutorQuery] = useState('');
  const [tutorResponse, setTutorResponse] = useState<string>(
    'Welcome to the embedded CS 201 Course Tutor. Ask me to explain binary search trees, trace a recursion tree, or quiz you before Friday’s assignment deadline.'
  );
  const [tutorLoading, setTutorLoading] = useState(false);

  const selectedCourse: Course | undefined = COURSES.find((c) => c.id === activeCourseId);

  const triggerCourseTutor = async (action: 'explain' | 'hint' | 'example' | 'quiz' | 'custom', customText?: string) => {
    setTutorLoading(true);
    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: `${selectedCourse?.code || 'CS 201'} — Binary Search Trees`,
          action,
          question: customText,
        }),
      });
      const data = await res.json();
      if (data.reply) setTutorResponse(data.reply);
    } catch {
      setTutorResponse('Let’s break Binary Search Trees down step by step: every left descendant is smaller than the parent node, and every right descendant is larger.');
    } finally {
      setTutorLoading(false);
    }
  };

  if (!selectedCourse) {
    return (
      <div className="space-y-6">
        <div className="border-b border-stone-300 pb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-stone-500">ZANZEE COLLEGE LMS · FALL 2026</div>
            <h1 className="font-serif text-3xl font-bold text-stone-900">My Courses</h1>
          </div>
          <button
            type="button"
            onClick={() => onAskAI('Can I register for CS 310 next semester?')}
            className="px-4 py-2 bg-[#1E3A8A] text-white text-xs font-medium hover:bg-blue-950 transition-colors cursor-pointer"
          >
            Ask AI about Spring 2027 Registration
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COURSES.map((course) => (
            <div key={course.id} className="bg-white border border-stone-300 p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-stone-500 tabular-nums">
                  <span>{course.code} · {course.department}</span>
                  <span>{course.progress}% COMPLETE · GRADE {course.currentGrade}</span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-stone-900">{course.title}</h2>
                <div className="text-xs text-stone-600">
                  {course.professor} · {course.professorRole}
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">{course.description}</p>

                <div className="w-full h-2 bg-stone-200">
                  <div className="h-full bg-[#1E3A8A]" style={{ width: `${course.progress}%` }} />
                </div>

                <div className="pt-2 border-t border-stone-200 grid grid-cols-2 gap-2 text-xs text-stone-600">
                  <div>
                    <span className="text-stone-500 block">Next class</span>
                    <span className="font-medium text-stone-900">{course.nextClass}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Next assignment</span>
                    <span className="font-medium text-stone-900">{course.nextAssignmentTitle} ({course.nextAssignmentDue})</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveCourseId(course.id)}
                  className="px-4 py-2 bg-[#1E3A8A] text-white text-xs font-medium hover:bg-blue-950 transition-colors cursor-pointer"
                >
                  Open Course
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('live-learning')}
                  className="px-4 py-2 bg-[#FBF9F5] border border-stone-300 text-stone-900 text-xs font-medium hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Live Classroom & VOD
                </button>
                <button
                  type="button"
                  onClick={() => onAskAI(`Summarize my syllabus and next assignment for ${course.code}: ${course.title}`)}
                  className="px-4 py-2 bg-[#FBF9F5] border border-stone-300 text-stone-900 text-xs font-medium hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Ask AI
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setActiveCourseId(null)}
          className="text-xs font-medium text-[#1E3A8A] hover:underline cursor-pointer"
        >
          ← Back to all courses
        </button>
        <div className="text-xs font-mono text-stone-500 tabular-nums">
          {selectedCourse.code} · {selectedCourse.room} · {selectedCourse.nextClass}
        </div>
      </div>

      <div className="bg-white border border-stone-300 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 space-y-2">
          <div className="text-xs font-mono text-[#1E3A8A]">
            {selectedCourse.code} · {selectedCourse.department.toUpperCase()}
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            {selectedCourse.title}
          </h1>
          <div className="text-xs text-stone-600">
            {selectedCourse.professor} ({selectedCourse.professorRole}) · Schedule: {selectedCourse.nextClass} in {selectedCourse.room}
          </div>
          <p className="text-sm text-stone-700 leading-relaxed pt-1">
            {selectedCourse.description}
          </p>
        </div>

        <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-stone-300 pt-4 lg:pt-0 lg:pl-6 space-y-3">
          <div className="flex justify-between text-xs font-mono tabular-nums">
            <span>MODULE COMPLETION</span>
            <span className="font-bold text-stone-900">{selectedCourse.progress}%</span>
          </div>
          <div className="w-full h-2 bg-stone-200">
            <div className="h-full bg-[#1E3A8A]" style={{ width: `${selectedCourse.progress}%` }} />
          </div>
          <div className="text-xs text-stone-600">
            Current Standing: <span className="font-mono font-semibold text-stone-900">{selectedCourse.currentGrade} ({selectedCourse.numericScore}%)</span>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => onNavigate('live-learning')}
              className="flex-1 py-2 px-3 bg-[#1E3A8A] text-white text-xs font-medium hover:bg-blue-950 transition-colors cursor-pointer"
            >
              Join Live Lecture
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('AI Tutor')}
              className="py-2 px-3 bg-[#FBF9F5] border border-stone-300 text-stone-900 text-xs font-medium hover:bg-stone-100 transition-colors cursor-pointer"
            >
              AI Tutor
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-stone-300 bg-[#FBF9F5] p-1">
        {(['Overview', 'Content', 'Assignments', 'Grades', 'Discussions', 'AI Tutor'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab
                ? 'bg-white text-stone-900 border border-stone-300'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' || activeTab === 'Content' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            {selectedCourse.modules.map((mod) => (
              <div key={mod.id} className="bg-white border border-stone-300 p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <div>
                    <span className="text-xs font-mono text-[#1E3A8A]">{mod.week}</span>
                    <h3 className="font-serif text-lg font-bold text-stone-900">{mod.title}</h3>
                  </div>
                </div>
                <p className="text-xs text-stone-600">{mod.summary}</p>
                <div className="divide-y divide-stone-200 pt-1">
                  {mod.items.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 ${
                            item.completed ? 'text-emerald-700' : 'text-stone-300'
                          }`}
                        />
                        <span className="font-medium text-stone-900">{item.title}</span>
                        <span className="text-stone-400">·</span>
                        <span className="uppercase font-mono text-[11px] text-stone-500">{item.type}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-stone-600 tabular-nums">{item.durationOrDue}</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (item.type === 'video') onNavigate('live-learning');
                            else if (item.type === 'assignment') onNavigate('assignments');
                            else onShowToast(`Opened ${item.title}`);
                          }}
                          className="text-[#1E3A8A] hover:underline font-medium cursor-pointer"
                        >
                          Open
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-stone-300 p-5 space-y-4">
              <div className="border-b border-stone-200 pb-3">
                <div className="text-xs font-mono text-[#1E3A8A]">COURSE AI TUTOR</div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Ask your AI tutor about this course
                </h3>
              </div>

              <div className="overflow-hidden border border-stone-200">
                <img
                  src={ASSETS.courseCs}
                  alt="Binary Search Tree Archival Diagram"
                  referrerPolicy="no-referrer"
                  className="w-full h-36 object-cover"
                />
              </div>

              <div className="p-3.5 bg-[#FBF9F5] border border-stone-200 text-xs text-stone-800 leading-relaxed whitespace-pre-line">
                {tutorLoading ? 'Synthesizing Socratic guidance...' : tutorResponse}
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => triggerCourseTutor('hint')}
                  className="py-1.5 px-2.5 bg-[#FBF9F5] border border-stone-300 text-xs font-medium text-stone-800 hover:border-[#1E3A8A] cursor-pointer"
                >
                  Hint
                </button>
                <button
                  type="button"
                  onClick={() => triggerCourseTutor('explain')}
                  className="py-1.5 px-2.5 bg-[#FBF9F5] border border-stone-300 text-xs font-medium text-stone-800 hover:border-[#1E3A8A] cursor-pointer"
                >
                  Explain
                </button>
                <button
                  type="button"
                  onClick={() => triggerCourseTutor('example')}
                  className="py-1.5 px-2.5 bg-[#FBF9F5] border border-stone-300 text-xs font-medium text-stone-800 hover:border-[#1E3A8A] cursor-pointer"
                >
                  Give example
                </button>
                <button
                  type="button"
                  onClick={() => triggerCourseTutor('quiz')}
                  className="py-1.5 px-2.5 bg-[#FBF9F5] border border-stone-300 text-xs font-medium text-stone-800 hover:border-[#1E3A8A] cursor-pointer"
                >
                  Practice question
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!tutorQuery.trim()) return;
                  triggerCourseTutor('custom', tutorQuery);
                  setTutorQuery('');
                }}
                className="flex gap-1.5"
              >
                <input
                  type="text"
                  value={tutorQuery}
                  onChange={(e) => setTutorQuery(e.target.value)}
                  placeholder="e.g., Explain binary search trees..."
                  className="flex-1 px-3 py-2 text-xs bg-[#FBF9F5] border border-stone-300 focus:border-[#1E3A8A] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-[#1E3A8A] text-white text-xs font-medium cursor-pointer"
                >
                  Ask
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : activeTab === 'AI Tutor' ? (
        <AITutorView onNavigate={onNavigate} onAskAI={onAskAI} onShowToast={onShowToast} />
      ) : activeTab === 'Assignments' ? (
        <AssignmentsView onNavigate={onNavigate} onAskAI={onAskAI} onShowToast={onShowToast} />
      ) : activeTab === 'Grades' ? (
        <GradesView onNavigate={onNavigate} onAskAI={onAskAI} onShowToast={onShowToast} />
      ) : (
        <div className="bg-white border border-stone-300 p-6 space-y-4">
          <h3 className="font-serif text-xl font-bold text-stone-900">
            Course Seminar Discussions · {selectedCourse.code}
          </h3>
          <div className="divide-y divide-stone-200 text-xs">
            <div className="py-3 space-y-1">
              <div className="font-semibold text-stone-900">
                Pinned by {selectedCourse.professor}: Week 6 AVL Tree Rotation Invariants
              </div>
              <p className="text-stone-600">
                Remember to verify that left-right double rotations preserve in-order traversal keys on edge-case leaf insertions.
              </p>
              <div className="text-stone-500 font-mono">14 student replies · Updated 1 hour ago</div>
            </div>
            <div className="py-3 space-y-1">
              <div className="font-semibold text-stone-900">
                Study Group Thread: Recurrence Relations & Master Theorem
              </div>
              <p className="text-stone-600">
                Meeting tonight at 7:30 PM in the Zanzee Grand Reading Room Mezzanine.
              </p>
              <div className="text-stone-500 font-mono">8 student replies · Updated 3 hours ago</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AITutorView: React.FC<SharedNavProps> = ({ onShowToast }) => {
  const [topic] = useState('Binary Trees & Recursive Traversal');
  const [understanding, setUnderstanding] = useState(68);
  const [difficulty, setDifficulty] = useState<'Introductory' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [customQuestion, setCustomQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ role: 'tutor' | 'student'; content: string }>>([
    {
      role: 'tutor',
      content:
        'Welcome to your Socratic AI Tutoring session on **Binary Trees**. Your current mastery score is **68%** based on CS 201 Quiz 3 and Lab 4 unit tests.\n\nInstead of giving away code solutions directly, I will guide you with structured hints, examples, and Socratic check-ins. Choose an action below or ask a question!',
    },
  ]);

  const invokeTutorAction = async (
    action: 'explain' | 'hint' | 'example' | 'quiz' | 'custom',
    labelForUser: string
  ) => {
    setHistory((prev) => [...prev, { role: 'student', content: labelForUser }]);
    setLoading(true);
    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          action,
          difficulty,
          question: labelForUser,
        }),
      });
      const data = await res.json();
      setHistory((prev) => [
        ...prev,
        {
          role: 'tutor',
          content: data.reply || 'Let’s trace the recursive base case and inductive step together.',
        },
      ]);
      setUnderstanding((u) => Math.min(100, u + (data.understandingDelta || 4)));
    } catch {
      onShowToast('Tutor response generated from local course pack');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-stone-300 p-6 flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-xs font-mono text-[#1E3A8A]">
            SOCRATIC AI TUTOR · CONTEXT-AWARE RAG LEARNING
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Topic: {topic}
          </h1>
          <div className="text-xs text-stone-600">
            Grounded in CS 201 Lecture Notes · Prof. Sarah Johnson · Step-by-Step Socratic Mode
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div>
            <div className="text-xs font-mono text-stone-500">UNDERSTANDING</div>
            <div className="font-mono text-2xl font-bold text-[#1E3A8A] tabular-nums">
              {understanding}%
            </div>
            <div className="w-32 h-2 bg-stone-200 mt-1">
              <div className="h-full bg-[#1E3A8A] transition-all" style={{ width: `${understanding}%` }} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-stone-500 mb-1">DIFFICULTY</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'Introductory' | 'Intermediate' | 'Advanced')}
              className="px-3 py-1.5 text-xs bg-[#FBF9F5] border border-stone-300 text-stone-900"
            >
              <option value="Introductory">Introductory</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => invokeTutorAction('explain', 'Explain differently')}
          className="p-3.5 bg-white border border-stone-300 hover:border-[#1E3A8A] text-left transition-colors cursor-pointer"
        >
          <div className="text-xs font-semibold text-stone-900">Explain differently</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Use an intuitive archival analogy</div>
        </button>
        <button
          type="button"
          onClick={() => invokeTutorAction('hint', 'Give me a hint')}
          className="p-3.5 bg-white border border-stone-300 hover:border-[#1E3A8A] text-left transition-colors cursor-pointer"
        >
          <div className="text-xs font-semibold text-stone-900">Give me a hint</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Guided step without full spoiler</div>
        </button>
        <button
          type="button"
          onClick={() => invokeTutorAction('example', 'Give me an example')}
          className="p-3.5 bg-white border border-stone-300 hover:border-[#1E3A8A] text-left transition-colors cursor-pointer"
        >
          <div className="text-xs font-semibold text-stone-900">Give me an example</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Trace tree insertion step-by-step</div>
        </button>
        <button
          type="button"
          onClick={() => invokeTutorAction('quiz', 'Quiz me')}
          className="p-3.5 bg-white border border-stone-300 hover:border-[#1E3A8A] text-left transition-colors cursor-pointer"
        >
          <div className="text-xs font-semibold text-stone-900">Quiz me</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Socratic diagnostic question (+6%)</div>
        </button>
      </div>

      <div className="bg-white border border-stone-300 p-6 space-y-4">
        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
          {history.map((entry, idx) => (
            <div
              key={idx}
              className={`p-4 border ${
                entry.role === 'student'
                  ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] ml-auto max-w-xl'
                  : 'bg-[#FBF9F5] text-stone-900 border-stone-300 max-w-3xl'
              }`}
            >
              <div className="text-[11px] font-mono opacity-75 mb-1">
                {entry.role === 'student' ? 'ALEX MORGAN' : 'ZANZEE SOCRATIC AI TUTOR'}
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-line">{entry.content}</div>
            </div>
          ))}
          {loading && (
            <div className="p-3 bg-[#FBF9F5] border border-stone-200 text-xs text-stone-600 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#1E3A8A]" />
              <span>Generating Socratic step from CS 201 course index...</span>
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!customQuestion.trim()) return;
            invokeTutorAction('custom', customQuestion);
            setCustomQuestion('');
          }}
          className="flex gap-2 pt-3 border-t border-stone-200"
        >
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder="Ask your tutor a question or answer the Socratic prompt above..."
            className="flex-1 px-4 py-2.5 text-sm bg-[#FBF9F5] border border-stone-300 focus:border-[#1E3A8A] focus:outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#1E3A8A] text-white text-xs font-medium hover:bg-blue-950 transition-colors cursor-pointer"
          >
            Submit Response
          </button>
        </form>
      </div>
    </div>
  );
};

export const LiveLearningView: React.FC<SharedNavProps> = ({ onAskAI, onShowToast }) => {
  const [mode, setMode] = useState<'live' | 'vod'>('live');
  const [joinedLive, setJoinedLive] = useState(true);
  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [pollVoted, setPollVoted] = useState<string | null>(null);
  const [vodNote, setVodNote] = useState('');
  const [notesList, setNotesList] = useState<string[]>([
    '14:20 — AVL balance factor must remain in {-1, 0, +1} after every insertion.',
    '28:45 — In-order successor is the minimum node in the right subtree.',
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-300 pb-4">
        <div>
          <div className="text-xs font-mono text-[#1E3A8A]">
            ZANZEE SYNCHRONOUS & ARCHIVAL MEDIA STUDIO
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Live Learning & Lecture VOD
          </h1>
        </div>

        <div className="flex gap-1 p-1 bg-stone-200/70 border border-stone-300">
          <button
            type="button"
            onClick={() => setMode('live')}
            className={`px-4 py-1.5 text-xs font-medium cursor-pointer ${
              mode === 'live' ? 'bg-[#1E3A8A] text-white' : 'text-stone-700'
            }`}
          >
            Live Classroom (WebRTC)
          </button>
          <button
            type="button"
            onClick={() => setMode('vod')}
            className={`px-4 py-1.5 text-xs font-medium cursor-pointer ${
              mode === 'vod' ? 'bg-[#1E3A8A] text-white' : 'text-stone-700'
            }`}
          >
            Recorded Lecture (VOD + Transcript)
          </button>
        </div>
      </div>

      {mode === 'live' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white border border-stone-300 p-5 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <div className="font-semibold text-stone-900">
                CS 201 Live Seminar: Balanced Search Trees · Prof. Sarah Johnson
              </div>
              <div className="font-mono text-red-700 tabular-nums">
                REC · 00:34:18 · 118 PARTICIPANTS
              </div>
            </div>

            <div className="relative bg-stone-900 text-white h-80 flex flex-col justify-between p-6 overflow-hidden">
              <img
                src={ASSETS.courseCs}
                alt="Live Whiteboard Stream"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-35"
              />
              <div className="relative z-10 flex justify-between items-start text-xs">
                <span className="bg-black/70 px-2.5 py-1 font-mono">
                  {screenShare ? 'Sharing Screen: bst_avl_rotation.ts' : 'Stage: Prof. Sarah Johnson + Digital Chalkboard'}
                </span>
                {handRaised && (
                  <span className="bg-amber-600 text-white px-2.5 py-1 font-medium">
                    Hand Raised (Queue #1)
                  </span>
                )}
              </div>

              <div className="relative z-10 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-4 -mx-6 -mb-6">
                <p className="text-xs font-mono text-stone-200">
                  Live Caption (WCAG AA): “When we insert key 42 into the right-left grandchild, a double rotation restores O(log n) height...”
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMicOn(!micOn)}
                  className={`px-3 py-2 text-xs font-medium flex items-center gap-1.5 border cursor-pointer ${
                    micOn ? 'bg-stone-900 text-white border-stone-900' : 'bg-[#FBF9F5] text-stone-800 border-stone-300'
                  }`}
                >
                  {micOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                  <span>{micOn ? 'Mute Mic' : 'Unmute Mic'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCamOn(!camOn)}
                  className={`px-3 py-2 text-xs font-medium flex items-center gap-1.5 border cursor-pointer ${
                    camOn ? 'bg-stone-900 text-white border-stone-900' : 'bg-[#FBF9F5] text-stone-800 border-stone-300'
                  }`}
                >
                  {camOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                  <span>{camOn ? 'Camera On' : 'Camera Off'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setScreenShare(!screenShare);
                    onShowToast(screenShare ? 'Stopped screen sharing' : 'Sharing IDE workspace window');
                  }}
                  className="px-3 py-2 text-xs font-medium bg-[#FBF9F5] border border-stone-300 text-stone-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <MonitorUp className="w-3.5 h-3.5" />
                  <span>{screenShare ? 'Stop Share' : 'Share Screen'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHandRaised(!handRaised)}
                  className={`px-3 py-2 text-xs font-medium border flex items-center gap-1.5 cursor-pointer ${
                    handRaised ? 'bg-amber-100 border-amber-400 text-amber-950' : 'bg-[#FBF9F5] border-stone-300 text-stone-800'
                  }`}
                >
                  <Hand className="w-3.5 h-3.5" />
                  <span>{handRaised ? 'Lower Hand' : 'Raise Hand'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onShowToast('Joined Breakout Room 4: Tree Rotations Lab')}
                  className="px-3 py-2 text-xs font-medium bg-[#FBF9F5] border border-stone-300 text-stone-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Breakout Rooms (6)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setJoinedLive(!joinedLive);
                  onShowToast(joinedLive ? 'Left live classroom' : 'Rejoined live classroom');
                }}
                className="px-4 py-2 bg-[#9A3412] text-white text-xs font-medium cursor-pointer"
              >
                {joinedLive ? 'Leave Class' : 'Join Live Class'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-stone-300 p-5 space-y-3">
              <div className="text-xs font-mono text-[#1E3A8A]">LIVE IN-CLASS POLL</div>
              <h3 className="font-serif text-base font-bold text-stone-900">
                What is the worst-case search complexity of an unbalanced BST with N keys?
              </h3>
              <div className="space-y-1.5">
                {['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setPollVoted(opt);
                      onShowToast(`Recorded poll response: ${opt}`);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs border font-mono cursor-pointer ${
                      pollVoted === opt
                        ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                        : 'bg-[#FBF9F5] text-stone-800 border-stone-300'
                    }`}
                  >
                    {opt} {pollVoted === opt && '· Selected'}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-stone-300 p-5 space-y-3">
              <div className="text-xs font-mono text-stone-500">PARTICIPANTS & CO-PILOT</div>
              <p className="text-xs text-stone-600">
                118 students connected. Ask CampusAI to summarize the last 10 minutes of Professor Johnson’s whiteboard derivation.
              </p>
              <button
                type="button"
                onClick={() => onAskAI('Summarize the key points from today’s CS 201 lecture on AVL tree rotations.')}
                className="w-full py-2 px-3 bg-[#1E3A8A] text-white text-xs font-medium cursor-pointer"
              >
                Ask AI About Live Lecture
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white border border-stone-300 p-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-stone-500">
              <span>CS 201 ARCHIVAL LECTURE 3 · 55 MIN VOD</span>
              <span>1080P · MULTI-TRACK CAPTIONS</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Binary Search Trees, In-Order Traversal & Structural Induction
            </h2>

            <div className="bg-stone-900 text-white p-8 flex flex-col justify-between h-64 relative overflow-hidden">
              <img
                src={ASSETS.courseCs}
                alt="Lecture VOD Frame"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
              <div className="relative z-10 flex items-center justify-between text-xs font-mono">
                <span>CHAPTER 03 / 04 · IN-ORDER SUCCESSOR DELETION</span>
                <span>28:45 / 55:00</span>
              </div>
              <div className="relative z-10 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onShowToast('Playing CS 201 Lecture 3 at 28:45')}
                  className="px-4 py-2 bg-white text-stone-900 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Play / Resume</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNotesList((prev) => [...prev, 'Bookmark @ 28:45 — Case 3 deletion with two children']);
                    onShowToast('Bookmarked timestamp 28:45');
                  }}
                  className="px-3 py-2 bg-black/70 border border-white/30 text-white text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Bookmark Timestamp</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {[
                { time: '00:00', title: '01. BST Invariant' },
                { time: '14:20', title: '02. Recursive Insert' },
                { time: '28:45', title: '03. Node Deletion' },
                { time: '42:10', title: '04. AVL Rotations' },
              ].map((ch) => (
                <button
                  key={ch.time}
                  type="button"
                  onClick={() => onShowToast(`Jumped to ${ch.title} (${ch.time})`)}
                  className="p-2.5 bg-[#FBF9F5] border border-stone-300 text-left hover:border-[#1E3A8A] cursor-pointer"
                >
                  <div className="font-mono text-[11px] text-[#1E3A8A] tabular-nums">{ch.time}</div>
                  <div className="text-xs font-medium text-stone-900 truncate">{ch.title}</div>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-200 space-y-2">
              <div className="text-xs font-mono text-stone-500">SYNCHRONIZED TRANSCRIPT</div>
              <div className="p-3 bg-[#FBF9F5] border border-stone-200 text-xs text-stone-700 space-y-2 leading-relaxed">
                <p><span className="font-mono text-[#1E3A8A]">[28:12]</span> When deleting a node with zero or one child, we simply splice the child pointer up to the parent.</p>
                <p><span className="font-mono text-[#1E3A8A]">[28:45]</span> However, when a node has two children, we locate its in-order successor—the leftmost node in the right subtree—copy its key, and recursively delete that successor.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-stone-300 p-5 space-y-4">
              <div className="text-xs font-mono text-[#1E3A8A]">LECTURE NOTEBOOK & BOOKMARKS</div>
              <div className="space-y-2">
                {notesList.map((n, i) => (
                  <div key={i} className="p-2.5 bg-[#FBF9F5] border border-stone-200 text-xs text-stone-800">
                    {n}
                  </div>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!vodNote.trim()) return;
                  setNotesList((prev) => [...prev, `29:10 — ${vodNote}`]);
                  setVodNote('');
                }}
                className="flex gap-1.5"
              >
                <input
                  type="text"
                  value={vodNote}
                  onChange={(e) => setVodNote(e.target.value)}
                  placeholder="Add timestamped note..."
                  className="flex-1 px-3 py-2 text-xs bg-[#FBF9F5] border border-stone-300"
                />
                <button type="submit" className="px-3 py-2 bg-[#1E3A8A] text-white text-xs font-medium cursor-pointer">
                  Save
                </button>
              </form>

              <div className="pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => onAskAI('Based on CS 201 Lecture 3 at timestamp 28:45, explain why the in-order successor has at most one child.')}
                  className="w-full py-2.5 px-4 bg-[#1E3A8A] text-white text-xs font-medium hover:bg-blue-950 transition-colors cursor-pointer"
                >
                  Ask AI about this lecture
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AssignmentsView: React.FC<SharedNavProps> = ({ onNavigate, onShowToast }) => {
  const [bucketFilter, setBucketFilter] = useState<'all' | 'today' | 'week' | 'upcoming' | 'completed'>('all');
  const [items, setItems] = useState<AssignmentItem[]>(ASSIGNMENTS);

  const filtered = items.filter((a) => bucketFilter === 'all' || a.dueBucket === bucketFilter);

  const handleAdvanceProgress = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextProg = Math.min(100, item.progress + 20);
        return {
          ...item,
          progress: nextProg,
          dueBucket: nextProg === 100 ? 'completed' : item.dueBucket,
          statusText: nextProg === 100 ? 'Submitted · Ready for Grading' : `${nextProg}% Milestone Saved`,
        };
      })
    );
    onShowToast('Saved assignment progress to Zanzee LMS');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-300 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-stone-500">DELIVERABLES & AUTOGRADER QUEUE</div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Assignments</h1>
        </div>

        <div className="flex flex-wrap gap-1 p-1 bg-stone-200/70 border border-stone-300">
          {[
            { id: 'all', label: 'All Assignments' },
            { id: 'today', label: 'Due Today' },
            { id: 'week', label: 'Due This Week' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setBucketFilter(tab.id as typeof bucketFilter)}
              className={`px-3 py-1.5 text-xs font-medium cursor-pointer whitespace-nowrap ${
                bucketFilter === tab.id ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((asg) => (
          <div
            key={asg.id}
            className="bg-white border border-stone-300 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-stone-500 tabular-nums">
                <span className="font-semibold text-[#1E3A8A]">{asg.courseCode}</span>
                <span>·</span>
                <span>{asg.dueDate}</span>
                <span>·</span>
                <span>Priority: {asg.priority}</span>
                <span>·</span>
                <span>{asg.points}</span>
              </div>
              <h2 className="font-serif text-xl font-bold text-stone-900">{asg.title}</h2>
              <div className="text-xs text-stone-600">{asg.statusText}</div>
            </div>

            <div className="w-full lg:w-64 space-y-1.5">
              <div className="flex justify-between text-xs font-mono tabular-nums">
                <span className="text-stone-600">Completion</span>
                <span className="font-bold text-stone-900">{asg.progress}%</span>
              </div>
              <div className="w-full h-2 bg-stone-200">
                <div className="h-full bg-[#1E3A8A] transition-all" style={{ width: `${asg.progress}%` }} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {asg.progress < 100 && (
                <button
                  type="button"
                  onClick={() => handleAdvanceProgress(asg.id)}
                  className="px-4 py-2 bg-[#1E3A8A] text-white text-xs font-medium hover:bg-blue-950 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Continue
                </button>
              )}
              <button
                type="button"
                onClick={() => onNavigate('ai-tutor')}
                className="px-3.5 py-2 bg-[#FBF9F5] border border-stone-300 text-stone-800 text-xs font-medium hover:bg-stone-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                AI Tutor Hint
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CalendarView: React.FC<SharedNavProps> = ({ onAskAI, onShowToast }) => {
  const [viewMode, setViewMode] = useState<'Month' | 'Week' | 'Day'>('Month');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  const filteredEvents = CALENDAR_EVENTS.filter(
    (ev) => typeFilter === 'All' || ev.type === typeFilter
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-300 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-stone-500">ZANZEE REGISTRAR TIMETABLE · OCTOBER 2026</div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Academic Calendar</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 p-1 bg-stone-200/70 border border-stone-300">
            {(['Month', 'Week', 'Day'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setViewMode(m)}
                className={`px-3 py-1 text-xs font-medium cursor-pointer ${
                  viewMode === m ? 'bg-white text-stone-900' : 'text-stone-600'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onAskAI('Ask AI about my schedule this week and any exam conflicts.')}
            className="px-4 py-2 bg-[#1E3A8A] text-white text-xs font-medium hover:bg-blue-950 transition-colors cursor-pointer whitespace-nowrap"
          >
            Ask AI about my schedule
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {['All', 'Class', 'Assignment', 'Exam', 'Advising', 'Campus Event'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 text-xs border cursor-pointer ${
              typeFilter === t
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white border border-stone-300 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <h2 className="font-serif text-xl font-bold text-stone-900">
            October 2026 · {viewMode} View
          </h2>
          <span className="text-xs font-mono text-stone-500 tabular-nums">
            Showing {filteredEvents.length} scheduled academic items
          </span>
        </div>

        <div className="divide-y divide-stone-200">
          {filteredEvents.map((ev) => (
            <div key={ev.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 text-center border border-stone-300 bg-[#FBF9F5] py-2 shrink-0">
                  <div className="text-[10px] font-mono uppercase text-stone-500">OCT</div>
                  <div className="font-mono text-lg font-bold text-stone-900 tabular-nums">
                    {ev.dayOfMonth}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-mono text-stone-500">
                    {ev.type.toUpperCase()} · {ev.courseOrDept} · {ev.time}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">{ev.title}</h3>
                  <div className="text-xs text-stone-600">Location: {ev.location}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onShowToast(`Added reminder for ${ev.title}`)}
                className="px-3 py-1.5 border border-stone-300 text-xs font-medium text-stone-800 hover:bg-stone-100 self-start sm:self-center cursor-pointer whitespace-nowrap"
              >
                Set Reminder
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AcademicProgressView: React.FC<SharedNavProps> = ({ onAskAI, onShowToast }) => {
  const [plannedCourses, setPlannedCourses] = useState<string[]>(['cs-310', 'phil-220']);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(STUDENT_PERSONA.statedInterests);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [newInterestInput, setNewInterestInput] = useState('');
  const [isReanalyzing, setIsReanalyzing] = useState(false);

  const togglePlanned = (courseId: string, courseCode: string) => {
    if (plannedCourses.includes(courseId)) {
      setPlannedCourses((prev) => prev.filter((id) => id !== courseId));
      onShowToast(`Removed ${courseCode} from Spring 2027 Schedule Plan`);
    } else {
      setPlannedCourses((prev) => [...prev, courseId]);
      onShowToast(`Added ${courseCode} to Spring 2027 Pre-Registration Schedule Plan ✓`);
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests((prev) => prev.filter((i) => i !== interest));
      onShowToast(`Removed interest filter: "${interest}"`);
    } else {
      setSelectedInterests((prev) => [...prev, interest]);
      onShowToast(`Added interest filter: "${interest}"`);
    }
  };

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterestInput.trim()) return;
    const trimmed = newInterestInput.trim();
    if (!selectedInterests.includes(trimmed)) {
      setSelectedInterests((prev) => [...prev, trimmed]);
      onShowToast(`Added custom interest: "${trimmed}"`);
    }
    setNewInterestInput('');
  };

  const handleReanalyzeWithAI = async () => {
    setIsReanalyzing(true);
    try {
      const res = await fetch('/api/ai/course-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentProfile: {
            creditsCompleted: STUDENT_PERSONA.creditsCompleted,
            creditsTotal: STUDENT_PERSONA.creditsTotal,
            major: STUDENT_PERSONA.major,
            gpa: STUDENT_PERSONA.gpa,
            year: STUDENT_PERSONA.year,
            interests: selectedInterests,
          },
          customInterests: selectedInterests,
          categoryFilter: activeCategoryFilter,
        }),
      });
      await res.json();
      onShowToast('Personalized course recommendations refreshed via Degree Audit Engine');
    } catch {
      onShowToast('Recommendations updated based on selected interest matrix');
    } finally {
      setIsReanalyzing(false);
    }
  };

  const recommendations = getPersonalizedRecommendations(selectedInterests, activeCategoryFilter);

  return (
    <div className="space-y-8">
      {/* Header Broadside */}
      <div className="border-b-2 border-stone-900 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-[#1E3A8A] font-bold">
            ZANZEE COLLEGE REGISTRAR · DEGREE AUDIT & GRADUATION INTELLIGENCE
          </div>
          <h1
            style={{ fontFamily: 'var(--font-serif)' }}
            className="newspaper-hero-headline text-stone-950 mt-1"
          >
            Academic Progress & Degree Audit
          </h1>
        </div>
        <div className="text-xs font-mono text-stone-800 tabular-nums border border-stone-900 bg-[#E6DEC8] p-3 space-y-0.5">
          <div className="font-bold text-[#141210]">STUDENT: {STUDENT_PERSONA.name.toUpperCase()} (#{STUDENT_PERSONA.id})</div>
          <div>PROGRAM: {STUDENT_PERSONA.program.toUpperCase()} · CLASS OF 2028</div>
          <div>CUMULATIVE GPA: <strong className="text-[#6E261A]">{STUDENT_PERSONA.gpa}</strong> (DEAN’S HONOURS)</div>
        </div>
      </div>

      {/* Graduation Progress & Category Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-[#F5F0E6] border-2 border-stone-900 p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-[4px_4px_0px_#141210]">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#DFD5BE" strokeWidth="12" />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#141210"
                strokeWidth="12"
                strokeDasharray="314.16"
                strokeDashoffset={314.16 * (1 - 0.6)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-4xl font-bold text-stone-950 tabular-nums">60%</span>
              <span className="text-xs font-mono text-stone-700 tabular-nums font-semibold">
                72 / 120 Credits
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <h2
              style={{ fontFamily: 'var(--font-serif)' }}
              className="newspaper-section-header text-stone-950"
            >
              Overall Degree Standing
            </h2>
            <p className="text-xs text-stone-700 leading-relaxed max-w-xs">
              72 Credits Completed · 48 Credits Remaining · Required for B.Sc. Computer Science: 120.0 Credits.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 bg-[#F5F0E6] border-2 border-stone-900 p-6 space-y-5 shadow-[4px_4px_0px_#141210]">
          <div className="flex items-center justify-between border-b-2 border-stone-900 pb-2">
            <h2
              style={{ fontFamily: 'var(--font-serif)' }}
              className="newspaper-section-header text-stone-950"
            >
              Credit Distribution by Degree Requirement
            </h2>
            <span className="text-[11px] font-mono uppercase text-stone-600">OFFICIAL AUDIT</span>
          </div>

          {[
            {
              label: 'Major Core Requirements (Computer Science)',
              done: STUDENT_PERSONA.degreeAudit.majorCoreCompleted,
              total: STUDENT_PERSONA.degreeAudit.majorCoreTotal,
              note: '20 Credits remaining (CS 310, CS 340, Senior Capstone)',
            },
            {
              label: 'Zanzee Broadsheet General Education Core',
              done: STUDENT_PERSONA.degreeAudit.generalEducationCompleted,
              total: STUDENT_PERSONA.degreeAudit.generalEducationTotal,
              note: '10 Credits remaining (Ethics & Humanities, Arts/Typography, Natural Science)',
            },
            {
              label: 'Technical & Interdisciplinary Electives',
              done: STUDENT_PERSONA.degreeAudit.electivesCompleted,
              total: STUDENT_PERSONA.degreeAudit.electivesTotal,
              note: '18 Credits remaining (Upper-division CS, AI, Cloud)',
            },
          ].map((cat) => {
            const pct = Math.round((cat.done / cat.total) * 100);
            return (
              <div key={cat.label} className="space-y-1.5 bg-[#E6DEC8] p-3 border border-stone-400">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-stone-950">{cat.label}</span>
                  <span className="font-mono text-stone-900 tabular-nums font-bold">
                    {cat.done} / {cat.total} Credits ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-stone-300 border border-stone-500">
                  <div className="h-full bg-stone-900" style={{ width: `${pct}%` }} />
                </div>
                <div className="text-[11px] font-mono text-stone-700">{cat.note}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          PERSONALIZED COURSE RECOMMENDATION ENGINE SECTION (CORE SPEC IMPLEMENTATION)
         ========================================================================= */}
      <section className="bg-[#F5F0E6] border-2 border-stone-900 p-6 space-y-6 shadow-[4px_4px_0px_#141210]">
        <div className="border-b-2 border-stone-900 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#6E261A]">
              <Sparkles className="w-4 h-4" />
              <span>CAMPUSAI PERSONALIZED COURSE RECOMMENDATION ENGINE</span>
            </div>
            <h2
              style={{ fontFamily: 'var(--font-serif)' }}
              className="newspaper-hero-headline text-stone-950 mt-1"
            >
              Recommended Courses for Spring 2027
            </h2>
            <p className="text-xs text-stone-700 mt-1">
              Analyzing academic audit (<strong>{STUDENT_PERSONA.creditsCompleted} credits</strong>, <strong>{STUDENT_PERSONA.major}</strong>, <strong>{STUDENT_PERSONA.gpa} GPA</strong>), your stated academic interests, and the university course catalog.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReanalyzeWithAI}
              disabled={isReanalyzing}
              className="px-4 py-2 bg-stone-900 text-[#F5F0E6] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#6E261A] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isReanalyzing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing Catalog…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Re-Analyze with AI</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => onAskAI('What courses should I take next semester to stay on track for graduation?')}
              className="px-3.5 py-2 bg-[#E6DEC8] border border-stone-900 text-stone-900 text-xs font-mono font-semibold hover:bg-stone-900 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              Ask AI Advisor
            </button>
          </div>
        </div>

        {/* Stated Interests Interactive Control Center */}
        <div className="p-4 bg-[#E6DEC8] border-2 border-stone-900 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-stone-900">
              <Tag className="w-3.5 h-3.5 text-[#6E261A]" />
              <span>STATED ACADEMIC & CAREER INTERESTS (CLICK TO FILTER/TOGGLE):</span>
            </div>
            <span className="text-[11px] font-mono text-stone-600">
              {selectedInterests.length} Active Preferences
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              'Data Structures',
              'Algorithms & Optimization',
              'Artificial Intelligence',
              'Ethics & Algorithmic Justice',
              'Systems & Architecture',
              'Visual Journalism & Broadsheet Typography',
              'Distributed Cloud Systems',
              'Computational Biology',
            ].map((interest) => {
              const active = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 text-xs font-mono border transition-all cursor-pointer ${
                    active
                      ? 'bg-stone-900 text-[#F5F0E6] border-stone-900 font-bold shadow-xs'
                      : 'bg-[#F5F0E6] text-stone-800 border-stone-400 hover:bg-stone-200'
                  }`}
                >
                  {active ? '✓ ' : '+ '}
                  {interest}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleAddInterest} className="flex gap-2 pt-1">
            <input
              type="text"
              value={newInterestInput}
              onChange={(e) => setNewInterestInput(e.target.value)}
              placeholder="Add another academic interest (e.g. Cryptography, Environmental Science)..."
              className="flex-1 px-3 py-1.5 text-xs bg-[#F5F0E6] border border-stone-900 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-stone-900 text-[#F5F0E6] text-xs font-mono font-bold hover:bg-[#6E261A] cursor-pointer"
            >
              Add Interest
            </button>
          </form>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-300 pb-3">
          <div className="flex flex-wrap gap-1">
            {[
              { id: 'All', label: 'All Recommendations' },
              { id: 'Major Core', label: 'Major Core Requirements' },
              { id: 'General Education', label: 'General Education Requirements' },
              { id: 'Technical Elective', label: 'Technical Electives' },
              { id: 'By Interest', label: 'Based on Stated Interests' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategoryFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-mono transition-colors cursor-pointer ${
                  activeCategoryFilter === tab.id
                    ? 'bg-stone-900 text-[#F5F0E6] font-bold'
                    : 'bg-[#E6DEC8] text-stone-800 border border-stone-400 hover:bg-stone-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-stone-600">
            Showing {recommendations.length} tailored courses
          </span>
        </div>

        {/* Recommendations Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec) => {
            const isPlanned = plannedCourses.includes(rec.courseId);
            return (
              <div
                key={rec.id}
                className="bg-[#F5F0E6] border-2 border-stone-900 p-5 flex flex-col justify-between space-y-4 shadow-[3px_3px_0px_#141210]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-bold text-[#141210]">{rec.code}</span>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#E6DEC8] border border-stone-400 text-stone-900">
                        {rec.category}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-mono font-bold bg-[#141210] text-[#F5F0E6]">
                      {rec.matchScore}% MATCH
                    </span>
                  </div>

                  <div>
                    <h3
                      style={{ fontFamily: 'var(--font-serif)' }}
                      className="newspaper-section-header text-stone-950"
                    >
                      {rec.title}
                    </h3>
                    <div className="text-xs font-mono text-stone-600 mt-1">
                      {rec.department} · {rec.credits} Credits · {rec.schedule} · {rec.room}
                    </div>
                    <div className="text-xs text-stone-700 mt-0.5">
                      Instructor: <strong>{rec.professor}</strong>
                    </div>
                  </div>

                  {/* Explicit Explanation Banner (as mandated by user brief) */}
                  <div className="p-3 border-l-3 border-[#6E261A] bg-[#E6DEC8] text-xs leading-relaxed space-y-1">
                    <div className="flex items-center gap-1 text-[11px] font-mono uppercase font-bold text-[#6E261A]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>WHY THIS COURSE IS RECOMMENDED:</span>
                    </div>
                    <p className="font-serif italic text-sm text-stone-950">
                      “{rec.explanation}”
                    </p>
                  </div>

                  {/* Prerequisites & Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      <span>Prerequisites Met</span>
                    </span>
                    {rec.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[10px] font-mono bg-[#E6DEC8] border border-stone-300 text-stone-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-stone-300 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => togglePlanned(rec.courseId, rec.code)}
                    className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isPlanned
                        ? 'bg-emerald-900 text-white'
                        : 'bg-stone-900 text-[#F5F0E6] hover:bg-[#6E261A]'
                    }`}
                  >
                    {isPlanned ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Pre-Registered for Spring 2027 ✓</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Spring 2027 Schedule</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onAskAI(
                        `Explain why ${rec.code} (${rec.title}) was recommended for Alex Morgan based on 72 completed credits and current standing in CS 201.`
                      )
                    }
                    className="px-3 py-2 bg-[#E6DEC8] border border-stone-900 text-stone-900 text-xs font-mono font-semibold hover:bg-stone-900 hover:text-white transition-colors cursor-pointer"
                  >
                    Consult AI Advisor
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export const GradesView: React.FC<SharedNavProps> = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('cs-201');
  const activeCourse = COURSES.find((c) => c.id === selectedCourseId) || COURSES[0];

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-300 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-stone-500">OFFICIAL TRANSCRIPT & ASSESSMENT RECORD</div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Grades & Standing</h1>
        </div>
        <div className="font-mono text-sm text-stone-800 tabular-nums">
          CUMULATIVE GPA: <span className="font-bold text-[#1E3A8A]">3.82 / 4.00</span> · DEAN’S HONOURS LIST
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {COURSES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCourseId(c.id)}
            className={`p-5 text-left border transition-colors cursor-pointer ${
              selectedCourseId === c.id
                ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                : 'bg-white text-stone-900 border-stone-300 hover:border-[#1E3A8A]'
            }`}
          >
            <div className="text-xs font-mono opacity-80">{c.code}</div>
            <div className="font-serif text-lg font-bold mt-1 truncate">{c.title}</div>
            <div className="mt-4 pt-3 border-t border-current/15 flex items-baseline justify-between font-mono tabular-nums">
              <span className="text-2xl font-bold">{c.currentGrade}</span>
              <span className="text-xs opacity-85">{c.numericScore}%</span>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white border border-stone-300 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Assessment Breakdown · {activeCourse.code} ({activeCourse.title})
            </h2>
            <div className="text-xs text-stone-600">{activeCourse.professor}</div>
          </div>
          <div className="font-mono text-sm font-bold text-stone-900 tabular-nums">
            Weighted Average: {activeCourse.numericScore}% ({activeCourse.currentGrade})
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-300 text-stone-500 font-mono">
                <th className="py-2.5 pr-4">ASSESSMENT ITEM</th>
                <th className="py-2.5 px-4">CATEGORY</th>
                <th className="py-2.5 px-4 text-right">WEIGHT</th>
                <th className="py-2.5 px-4 text-right">SCORE</th>
                <th className="py-2.5 pl-4 text-right">LETTER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 tabular-nums">
              <tr>
                <td className="py-3 pr-4 font-medium text-stone-900">Lab 1: Dynamic Contiguous Arrays</td>
                <td className="py-3 px-4 text-stone-600">Programming Assignment</td>
                <td className="py-3 px-4 text-right font-mono">10%</td>
                <td className="py-3 px-4 text-right font-mono">98 / 100</td>
                <td className="py-3 pl-4 text-right font-mono font-semibold text-emerald-800">A</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-stone-900">Lab 2: Lock-Free Ring Buffer Queue</td>
                <td className="py-3 px-4 text-stone-600">Programming Assignment</td>
                <td className="py-3 px-4 text-right font-mono">10%</td>
                <td className="py-3 px-4 text-right font-mono">96 / 100</td>
                <td className="py-3 pl-4 text-right font-mono font-semibold text-emerald-800">A</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-stone-900">Quiz 1–3: Asymptotic & Recurrence Proofs</td>
                <td className="py-3 px-4 text-stone-600">In-Class Examination</td>
                <td className="py-3 px-4 text-right font-mono">20%</td>
                <td className="py-3 px-4 text-right font-mono">89 / 100</td>
                <td className="py-3 pl-4 text-right font-mono font-semibold text-stone-900">B+</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-stone-900">Lab 4: Binary Search Trees & Traversal</td>
                <td className="py-3 px-4 text-stone-600">Programming Assignment</td>
                <td className="py-3 px-4 text-right font-mono">15%</td>
                <td className="py-3 px-4 text-right font-mono text-amber-800">In Progress (65%)</td>
                <td className="py-3 pl-4 text-right font-mono text-stone-500">Due Oct 9</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
