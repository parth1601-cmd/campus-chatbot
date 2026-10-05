import React, { useState, useEffect } from 'react';
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
  Camera,
  Image as ImageIcon,
  MapPin,
  ChevronDown,
  ChevronRight,
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
  KRISTU_JAYANTI_CAMPUS_PHOTOS,
  getStoredCourses,
  getStoredChronicle,
  ChronicleConfig,
} from '../data/zanzeeData';
import {
  MCA_COURSE_CARDS,
  MCA_PROGRAM_META,
  getMcaCourseUnits,
  getMcaCourseTopicCount,
  type McaCourseCard,
} from '../data/mcaSyllabus';
import { KJCLogo } from './KJCLogo';
import { apiFetch } from '../lib/api';

/** Cover photo with graceful fallback to subject initials if the CDN image fails. */
const McaCoverPhoto: React.FC<{ card: McaCourseCard; className?: string; alt: string }> = ({
  card,
  className,
  alt,
}) => {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className={`flex items-center justify-center text-white font-serif font-bold ${className || ''}`}
        style={{ backgroundColor: card.accent }}
        aria-label={alt}
        role="img"
      >
        <span className="text-2xl">{card.code}</span>
      </div>
    );
  }
  return (
    <img
      src={card.photo}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className || ''}`}
    />
  );
};

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
    'All Stories' | 'Fests & Events' | 'Photo Gallery' | 'General'
  >('All Stories');
  const [reportOpen, setReportOpen] = useState(false);
  const [recCategoryFilter, setRecCategoryFilter] = useState<string>('All');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(STUDENT_PERSONA.statedInterests);
  const [plannedCourseIds, setPlannedCourseIds] = useState<string[]>(['cs-310']);
  const [interestsModalOpen, setInterestsModalOpen] = useState(false);
  const [newInterestInput, setNewInterestInput] = useState('');
  const [coursesList, setCoursesList] = useState<Course[]>(getStoredCourses);
  const [chronicle, setChronicle] = useState<ChronicleConfig>(getStoredChronicle);
  const [activeCampusPhotoIndex, setActiveCampusPhotoIndex] = useState(0);

  useEffect(() => {
    const handleCoursesUpdate = () => {
      setCoursesList(getStoredCourses());
    };
    const handleChronicleUpdate = () => {
      setChronicle(getStoredChronicle());
    };
    window.addEventListener('kjit_courses_updated', handleCoursesUpdate);
    window.addEventListener('kjit_chronicle_updated', handleChronicleUpdate);
    return () => {
      window.removeEventListener('kjit_courses_updated', handleCoursesUpdate);
      window.removeEventListener('kjit_chronicle_updated', handleChronicleUpdate);
    };
  }, []);

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
THE KRISTU CHRONICLE — OFFICIAL CAMPUSAI INTELLIGENCE & ACADEMIC REPORT
====================================================================
Institution: Kristu Jayanti Institute of Technology (Kristu Jayanti College)
Edition: Vol. CXIV, No. 42 — Fall 2026 Semester Report
Generated For: ${STUDENT_PERSONA.name} (ID #${STUDENT_PERSONA.id})
Program: ${STUDENT_PERSONA.program} (${STUDENT_PERSONA.year})
Cumulative GPA: ${STUDENT_PERSONA.gpa} | Credits Completed: ${STUDENT_PERSONA.creditsCompleted}/${STUDENT_PERSONA.creditsRequired} (60%)
Academic Advisor: ${STUDENT_PERSONA.advisor}

1. EXECUTIVE SUMMARY & PLATFORM ARCHITECTURE
--------------------------------------------------------------------
- Aesthetic & Design System: The Kristu Chronicle Broadsheet UI
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
- Kristu Jayanti Presidential Merit Scholarship: -$14,500
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
    a.download = `The_Kristu_Chronicle_Report_${STUDENT_PERSONA.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('Downloaded Official The Kristu Chronicle Dossier Report (.txt)');
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
              KRISTU JAYANTI CAMPUS · 24°C
            </div>
            <div className="text-[#2E2A25] leading-snug">
              Turing Labs Open 24h · Central Library Reading Room Cap: 64%
            </div>
          </div>

          {/* Center Masthead Title */}
          <div className="lg:col-span-6 text-center space-y-2 px-2 flex flex-col items-center">
            {/* Official KJC Logo Seal & Accreditation Badge */}
            <div className="flex items-center justify-center gap-3">
              <KJCLogo variant="emblem" size="md" />
              <div className="text-left">
                <div className="text-[11px] font-mono tracking-wider uppercase font-bold text-[#1E3A8A]">
                  {chronicle.institutionName || 'KRISTU JAYANTI COLLEGE · AUTONOMOUS BENGALURU'}
                </div>
                <div className="text-[9px] font-mono text-stone-600">
                  {chronicle.accreditation || 'Accredited ‘A++’ Grade by NAAC · Managed by CMI Fathers'}
                </div>
              </div>
            </div>

            <h1
              style={{ fontFamily: 'var(--font-serif)' }}
              className="newspaper-masthead text-stone-950"
            >
              {chronicle.mastheadTitle || 'The Kristu Chronicle'}
            </h1>
            <div
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-sm italic text-stone-700"
            >
              {chronicle.tagline || '“Fests, Photos & General Campus News — Official Student Newspaper”'}
            </div>
          </div>

          {/* Right Ear: General Edition Box (newspaper info only) */}
          <div className="lg:col-span-3 border border-stone-900 p-3 bg-[#FBF9F5] text-xs space-y-1 font-mono tabular-nums">
            <div className="font-semibold text-[#1E3A8A]">
              BENGALURU EDITION · FREE CAMPUS PRESS
            </div>
            <div className="text-stone-800">
              FESTS · PHOTOS · GENERAL NEWS
            </div>
            <div className="text-stone-600">Est. Campus Newspaper · Daily</div>
          </div>
        </div>

        {/* Double-Rule Dateline & Interactive Section Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-900 pb-3 text-xs font-mono text-stone-800">
          <div className="tabular-nums">
            {chronicle.dateline || 'VOL. CXIV · NO. 42 · THURSDAY, OCTOBER 1, 2026 · MORNING EDITION'}
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {(['All Stories', 'Fests & Events', 'Photo Gallery', 'General'] as const).map(
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
            {/* Admin Editor removed from student view — admin only */}
            {/* Academic report removed — pure newspaper only */}
          </div>
        </div>

        {/* Academic dossier report removed — newspaper only */}

        {/* Above-the-Fold Editorial Standfirst — newspaper only, no AI / LMS */}
        <div className="pt-1 space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#1E3A8A] font-semibold">
                FEST & CAMPUS NEWS DESK
              </span>
              <span className="mx-2 text-stone-400">·</span>
              <span className="font-serif text-lg font-bold text-stone-900">
                {chronicle.telegraphGreeting || 'Fest updates, photos & general campus news.'}
              </span>
            </div>
            <span className="text-xs font-mono text-stone-600">
              Fests · Photos · General News
            </span>
          </div>

          {/* Quick Newspaper Index — fest / photos / general only */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-mono text-stone-500 mr-1">INDEX:</span>
            <button
              type="button"
              onClick={() => setSelectedEditionSection('Fests & Events')}
              className="px-2.5 py-1 text-xs font-medium bg-[#FBF9F5] hover:bg-stone-900 hover:text-white border border-stone-400 text-stone-900 transition-colors cursor-pointer whitespace-nowrap"
            >
              Fest News
            </button>
            <button
              type="button"
              onClick={() => setSelectedEditionSection('Photo Gallery')}
              className="px-2.5 py-1 text-xs font-medium bg-[#FBF9F5] hover:bg-stone-900 hover:text-white border border-stone-400 text-stone-900 transition-colors cursor-pointer whitespace-nowrap"
            >
              Fest Photos
            </button>
            <button
              type="button"
              onClick={() => setSelectedEditionSection('General')}
              className="px-2.5 py-1 text-xs font-medium bg-[#FBF9F5] hover:bg-stone-900 hover:text-white border border-stone-400 text-stone-900 transition-colors cursor-pointer whitespace-nowrap"
            >
              General News
            </button>
            <button
              type="button"
              onClick={() => onNavigate('calendar')}
              className="px-2.5 py-1 text-xs font-medium bg-[#FBF9F5] hover:bg-stone-900 hover:text-white border border-stone-400 text-stone-900 transition-colors cursor-pointer whitespace-nowrap"
            >
              Events Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Column Newspaper Broadsheet Front Page Grid */}
      <div className="bg-[#F5F0E6] border-2 border-[#141210] p-5 lg:p-6 shadow-[4px_4px_0px_#141210]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:divide-x lg:divide-[#141210]">
          {/* ================================================================
              LEFT SIDEBAR COLUMN (3 COLS): FEST BULLETINS & GENERAL NOTICES
              Newspaper only — no LMS / assignments / AI
              ================================================================ */}
          <aside className="lg:col-span-3 space-y-6">
            {/* Fest Highlight Box (admin-editable via Chronicle Editor) */}
            <div className="border-2 border-stone-900 p-4 bg-[#FBF9F5] space-y-2.5">
              <div className="border-b border-stone-900 pb-1.5 flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-[#9A3412]">
                  {chronicle.urgentAlert?.tag || 'FEST BULLETIN'}
                </span>
                <span className="text-[11px] font-mono tabular-nums text-stone-700">{chronicle.urgentAlert?.date || 'THIS WEEK'}</span>
              </div>
              <h2
                style={{ fontFamily: 'var(--font-serif)' }}
                className="newspaper-section-header text-stone-950"
              >
                {chronicle.urgentAlert?.title || 'Annual College Fest — Dates Announced'}
              </h2>
              <p className="newspaper-lead-in">
                <span className="newspaper-dateline">{chronicle.urgentAlert?.dateline || 'FEST DESK —'} </span>
                {chronicle.urgentAlert?.text || 'The annual college fest schedule, venues and event list have been announced. See fest calendar for dates and photo gallery for highlights.'}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('calendar')}
                  className="px-3 py-1.5 bg-[#9A3412] text-white text-xs font-medium hover:bg-red-900 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {chronicle.urgentAlert?.buttonText || 'View Fest Schedule'}
                </button>
              </div>
            </div>

            {/* General Campus Notice */}
            <div className="border-t-2 border-stone-900 pt-3 space-y-2.5">
              <div className="border-b border-stone-900 pb-1.5 flex items-center justify-between">
                <h2
                  style={{ fontFamily: 'var(--font-serif)' }}
                  className="newspaper-section-header text-stone-950"
                >
                  {chronicle.infraWire?.title || 'General Notice'}
                </h2>
                <span className="text-[10px] font-mono uppercase text-stone-600">{chronicle.infraWire?.tag || 'CAMPUS'}</span>
              </div>
              <p className="newspaper-lead-in">
                <span className="newspaper-dateline">{chronicle.infraWire?.dateline || 'CAMPUS DESK —'} </span>
                {chronicle.infraWire?.text || 'General campus announcements, timings and venue updates will appear here.'}
              </p>
              <button
                type="button"
                onClick={() => onNavigate('calendar')}
                className="text-xs font-mono font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
              >
                {chronicle.infraWire?.buttonText || 'View Events Calendar →'}
              </button>
            </div>
          </aside>

          {/* ================================================================
              CENTER MAIN COLUMN (6 COLS): HERO ARTICLE SECTIONS & FEATURE STORIES
             ================================================================ */}
          <div className="lg:col-span-6 lg:px-6 space-y-8">
            {/* PRIMARY HERO ARTICLE — fest / general news only */}
            <article className="space-y-4 border-b-2 border-stone-900 pb-6">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-stone-600">
                <span className="font-bold text-[#1E3A8A]">
                  {chronicle.heroStory?.badge || 'LEAD FEST STORY · THIS WEEK'}
                </span>
                <span className="tabular-nums">{chronicle.heroStory?.locationTag || 'MAIN CAMPUS · FEST GROUND'}</span>
              </div>

              <h2
                style={{ fontFamily: 'var(--font-serif)' }}
                className="newspaper-hero-headline text-stone-950"
              >
                {chronicle.heroStory?.headline || 'Annual College Fest Brings Music, Food Stalls & Inter-College Events to Campus'}
              </h2>

              <p
                style={{ fontFamily: 'var(--font-serif)' }}
                className="newspaper-deck"
              >
                {chronicle.heroStory?.deck || 'Three days of cultural performances, competitions and exhibitions — see full fest schedule, venues and photo highlights.'}
              </p>

              <div className="text-xs font-mono text-stone-500 border-y border-stone-300 py-1.5 flex flex-wrap items-center justify-between gap-2">
                <span>{chronicle.heroStory?.byline || 'By The Kristu Chronicle · Fest Desk'}</span>
                <span>{chronicle.heroStory?.readTime || '3 Min Read · Campus News'}</span>
              </div>

              {/* Photojournalism Frame — fest photo */}
              <figure className="border border-[#141210] bg-[#E6DEC8]">
                <img
                  src={chronicle.heroStory?.imageUrl || ASSETS.kjuCampusMain}
                  alt={chronicle.heroStory?.headline || 'College fest on campus'}
                  referrerPolicy="no-referrer"
                  className="w-full h-48 sm:h-72 lg:h-80 object-cover newspaper-photo"
                />
                <figcaption
                  style={{ fontFamily: 'var(--font-serif)' }}
                  className="p-3 border-t border-[#141210] text-xs italic text-[#2E2A25] flex flex-wrap items-center justify-between gap-2"
                >
                  <span>
                    {chronicle.heroStory?.imageCaption || 'Fig. 1 — Fest crowd at the main campus ground during the annual college fest.'}
                  </span>
                  <span className="text-[10px] font-mono not-italic uppercase tracking-widest text-[#1E3A8A] font-bold">
                    {chronicle.heroStory?.imageBadge || 'Fest Photo'}
                  </span>
                </figcaption>
              </figure>

              {/* Editorial Drop-Cap & Lead-In Body Prose — general fest info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-stone-800 leading-relaxed pt-1">
                <p className="newspaper-dropcap newspaper-lead-in">
                  {chronicle.heroStory?.bodyParagraph1 || 'The campus came alive this week as students gathered for the annual fest — music performances, food stalls, art exhibitions and inter-college competitions across three days.'}
                </p>
                <p className="newspaper-lead-in">
                  <span className="newspaper-dateline">{chronicle.heroStory?.datelineText || 'CAMPUS, THIS WEEK —'} </span>
                  {chronicle.heroStory?.bodyParagraph2 || 'Organisers have released the full event list with venues and timings. Browse the fest photo gallery below and check the events calendar for upcoming programmes.'}
                </p>
              </div>

              {/* Hero Article Action Bar — newspaper only */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedEditionSection('Photo Gallery')}
                  className="px-4 py-2 bg-stone-900 hover:bg-[#1E3A8A] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors cursor-pointer whitespace-nowrap"
                >
                  {chronicle.heroStory?.action1Text || 'View Fest Photos'}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('calendar')}
                  className="px-4 py-2 bg-[#FBF9F5] border border-stone-900 text-stone-900 text-xs font-medium hover:bg-stone-100 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {chronicle.heroStory?.action2Text || 'Fest Schedule'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEditionSection('General')}
                  className="px-4 py-2 bg-[#FBF9F5] border border-stone-900 text-[#1E3A8A] text-xs font-medium hover:bg-stone-100 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {chronicle.heroStory?.action3Text || 'General News'}
                </button>
              </div>
            </article>

            {/* ================================================================
                KRISTU JAYANTI UNIVERSITY PHOTOGRAPHIC CHRONICLE & CAMPUS DISPATCHES
               ================================================================ */}
            {(() => {
              const photos = (chronicle.campusPhotos && chronicle.campusPhotos.length > 0)
                ? chronicle.campusPhotos
                : KRISTU_JAYANTI_CAMPUS_PHOTOS;
              const safeIndex = activeCampusPhotoIndex < photos.length ? activeCampusPhotoIndex : 0;
              const curPhoto = photos[safeIndex] || photos[0];

              return (
                <section className="p-4 bg-[#FAF8F5] border-2 border-stone-900 shadow-[3px_3px_0px_#141210] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-stone-900 pb-2">
                    <div className="flex items-center gap-2.5">
                      <Camera className="w-5 h-5 text-[#1E3A8A]" />
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-[#1E3A8A] font-bold">
                          FEST PHOTO ARCHIVES · KRISTU JAYANTI UNIVERSITY
                        </div>
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-950">
                          Fest Photo Gallery & General Highlights
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs font-mono text-stone-600 bg-white px-2.5 py-1 border border-stone-300">
                        {curPhoto?.location || 'Bengaluru · K. Narayanapura Campus'}
                      </div>
                      {/* Manage Photos removed from student view — admin only */}
                    </div>
                  </div>

                  {/* Featured Campus Photo */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-8 overflow-hidden border-2 border-stone-900 bg-black relative group">
                      <img
                        src={curPhoto?.imageUrl || ASSETS.kjuCampusMain}
                        alt={curPhoto?.title || 'Kristu Jayanti University Campus'}
                        className="w-full h-40 sm:h-64 lg:h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {curPhoto?.highlight && (
                        <div className="absolute top-2 left-2 bg-[#141210]/85 text-white text-[10px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider backdrop-blur-xs">
                          {curPhoto.highlight}
                        </div>
                      )}
                      <div className="p-2.5 bg-[#141210] text-white text-xs font-mono flex flex-wrap items-center justify-between gap-2 border-t border-stone-800">
                        <span className="font-bold flex items-center gap-1.5 truncate">
                          <ImageIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          {curPhoto?.title}
                        </span>
                        <span className="text-stone-300 text-[11px] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                          {curPhoto?.location}
                        </span>
                      </div>
                    </div>

                    {/* Photo Selector Thumbnails */}
                    <div className="md:col-span-4 space-y-2">
                      <div className="text-[11px] font-mono text-stone-600 font-bold uppercase tracking-wider">
                        Select Fest Photograph ({photos.length}):
                      </div>
                      <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                        {photos.map((photo, idx) => (
                          <button
                            key={photo.id || `photo-${idx}`}
                            type="button"
                            onClick={() => setActiveCampusPhotoIndex(idx)}
                            className={`w-full text-left p-2 border transition-all cursor-pointer flex items-center gap-2.5 ${
                              safeIndex === idx
                                ? 'bg-[#1E3A8A] text-white border-[#141210] shadow-[2px_2px_0px_#141210]'
                                : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-100'
                            }`}
                          >
                            <img
                              src={photo.imageUrl}
                              alt={photo.title}
                              className="w-12 h-10 object-cover border border-stone-400 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-serif text-xs font-bold truncate">
                                {photo.title}
                              </div>
                              <div
                                className={`text-[10px] font-mono truncate ${
                                  safeIndex === idx ? 'text-blue-100' : 'text-stone-500'
                                }`}
                              >
                                {photo.category}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white border border-stone-300 text-xs font-serif text-stone-800 italic">
                    “{curPhoto?.caption}”
                  </div>
                </section>
              );
            })()}

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
                {(chronicle.announcements && chronicle.announcements.length > 0
                  ? chronicle.announcements
                  : DEFAULT_CHRONICLE_CONFIG.announcements
                ).map((ann, aIdx) => (
                  <article key={ann.id || `ann-${aIdx}`} className={`space-y-2.5 ${aIdx > 0 ? 'sm:pl-6' : ''}`}>
                    <div className="text-[11px] font-mono text-[#1E3A8A] font-semibold uppercase">
                      {ann.category}
                    </div>
                    <h3
                      style={{ fontFamily: 'var(--font-serif)' }}
                      className="newspaper-subheadline text-stone-950"
                    >
                      {ann.title}
                    </h3>
                    <p className="newspaper-lead-in">
                      {ann.dateline && <span className="newspaper-dateline">{ann.dateline} </span>}
                      {ann.summary}
                    </p>
                    <div className="pt-1 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onNavigate((ann.actionView || 'academic-progress') as ViewId)}
                        className="text-xs font-mono font-semibold text-stone-900 hover:text-[#1E3A8A] underline cursor-pointer"
                      >
                        {ann.actionLabel || 'Inspect Details →'}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* KRISTU JAYANTI INSTITUTE OF TECHNOLOGY ADMISSIONS DISPATCH */}
            <section className="p-4 bg-[#FAF8F5] border-2 border-stone-900 shadow-[3px_3px_0px_#141210] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-300 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
                    OFFICIAL ADMISSION NOTICE · 2026–27 BATCH
                  </span>
                </div>
                <span className="text-[11px] font-mono text-stone-500">
                  Postgraduate Dept. of Computer Science
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3
                    style={{ fontFamily: 'var(--font-serif)' }}
                    className="font-bold text-lg text-stone-950"
                  >
                    Kristu Jayanti Institute of Technology — MCA & M.Sc Admissions Open
                  </h3>
                  <p className="text-xs text-stone-700 max-w-2xl leading-relaxed">
                    Admissions are open for 2-year full-time postgraduate programmes: <strong>MCA</strong> (₹1,90,000/yr), <strong>M.Sc. Data Science</strong> (₹1,40,000/yr), and <strong>M.Sc. Cyber Security</strong> (₹1,50,000/yr). Review eligibility guidelines and fee structures.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onNavigate('admissions')}
                    className="px-3.5 py-1.5 bg-[#141210] hover:bg-[#1E3A8A] text-white text-xs font-mono font-bold uppercase transition-colors cursor-pointer shadow-[1px_1px_0px_#141210]"
                  >
                    View Admissions →
                  </button>
                </div>
              </div>
            </section>

            {/* Courses table removed — newspaper shows fests / photos / general news only */}
          </div>

          {/* ================================================================
              RIGHT SIDEBAR COLUMN (3 COLS): FEST & EVENTS CALENDAR ONLY
              ================================================================ */}
          <aside className="lg:col-span-3 lg:pl-6 space-y-6">
            {/* Fest & Events Calendar — general fest info only */}
            <div className="space-y-3">
              <div className="border-t-2 border-b border-stone-900 py-2 flex items-baseline justify-between gap-2">
                <h2
                  style={{ fontFamily: 'var(--font-serif)' }}
                  className="newspaper-section-header text-stone-950"
                >
                  Fest & Events Calendar
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
                {CALENDAR_EVENTS.filter((ev) => ev.type === 'Campus Event').slice(0, 5).map((ev) => (
                  <div key={ev.id} className="py-2.5 first:pt-0 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 tabular-nums">
                      <span className="font-semibold text-stone-800">{ev.date}</span>
                      <span>FEST & EVENT</span>
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
                onClick={() => onNavigate('calendar')}
                className="w-full py-2 px-3 bg-[#FBF9F5] border border-stone-900 text-stone-900 text-xs font-mono font-semibold hover:bg-stone-900 hover:text-white transition-colors cursor-pointer"
              >
                View Full Fest Calendar
              </button>
            </div>

            {/* Course recommendations removed — newspaper shows fests / photos / general only */}
            <div className="space-y-3.5">
              <div className="border-t-2 border-b border-stone-900 py-2">
                <div className="text-[10px] font-mono font-bold text-[#1E3A8A] uppercase">
                  FEST & GENERAL NOTICEBOARD
                </div>
                <h2
                  style={{ fontFamily: 'var(--font-serif)' }}
                  className="newspaper-section-header text-stone-950 mt-0.5"
                >
                  More From Campus
                </h2>
                <div className="text-[11px] text-stone-600 mt-1 leading-snug">
                  Fest announcements, photo highlights and general campus news.
                </div>
              </div>

              {/* General fest info box */}
              <div className="space-y-2 bg-[#E6DEC8] p-2.5 border border-stone-900 text-xs">
                <div className="text-[11px] font-mono text-stone-800 font-bold">
                  FEST & GENERAL UPDATES
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Cultural fests, competitions, exhibitions and general campus programmes are listed in the Fest & Events Calendar. Photos appear in the Fest Photo Gallery.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('calendar')}
                  className="w-full py-2 px-3 bg-stone-900 text-[#F5F0E6] text-xs font-mono font-bold hover:bg-[#6E261A] transition-colors cursor-pointer"
                >
                  Open Fest Calendar →
                </button>
              </div>
            </div>

            {/* Interests modal disabled — newspaper only */}
            {false && interestsModalOpen && (
              <div
                className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
              >
                <div className="bg-[#F5F0E6] border-2 border-stone-900 shadow-[6px_6px_0px_#141210] max-w-md w-full p-4 sm:p-5 space-y-4 max-h-[90dvh] overflow-y-auto">
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

                  <form onSubmit={handleAddInterest} className="flex flex-col sm:flex-row gap-2 pt-2">
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
  // MCA Semester-I catalogue (official assessment syllabus). Legacy LMS ids
  // (e.g. cs-201 from global search) gracefully fall back to the grid.
  const [activeCourseId, setActiveCourseId] = useState<string | null>(
    MCA_COURSE_CARDS.some((c) => c.id === selectedCourseId) ? selectedCourseId || null : null
  );
  const [openUnit, setOpenUnit] = useState<string | null>('Unit 1');

  useEffect(() => {
    if (selectedCourseId && MCA_COURSE_CARDS.some((c) => c.id === selectedCourseId)) {
      setActiveCourseId(selectedCourseId);
    }
  }, [selectedCourseId]);

  const [activeTab, setActiveTab] = useState<
    'Overview' | 'Content' | 'Assignments' | 'Grades' | 'Discussions' | 'AI Tutor'
  >('Overview');
  const [tutorQuery, setTutorQuery] = useState('');
  const [tutorResponse, setTutorResponse] = useState<string>(
    'Welcome to your MCA Semester-I course tutor. Ask me to teach AVL rotations, trace Dijkstra on an example graph, quiz you on Python lists, or solve a matrix rank problem step by step.'
  );
  const [tutorLoading, setTutorLoading] = useState(false);

  const selectedCourse: McaCourseCard | undefined = MCA_COURSE_CARDS.find((c) => c.id === activeCourseId);
  const selectedUnits = selectedCourse ? getMcaCourseUnits(selectedCourse.subjectId) : [];

  const triggerCourseTutor = async (action: 'explain' | 'hint' | 'example' | 'quiz' | 'custom', customText?: string) => {
    setTutorLoading(true);
    try {
      const res = await apiFetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedCourse ? `${selectedCourse.code} — ${selectedCourse.title}` : 'MCA Semester-I',
          action,
          question: customText,
        }),
      });
      const data = await res.json();
      if (data.reply) setTutorResponse(data.reply);
    } catch {
      setTutorResponse('Let’s break this down step by step: tell me the exact topic (for example "AVL rotations" or "Bayes theorem") and I will teach it simply, then check your understanding.');
    } finally {
      setTutorLoading(false);
    }
  };

  if (!selectedCourse) {
    return (
      <div className="space-y-6">
        <div className="border-b border-stone-300 pb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-stone-500">
              KRISTU JAYANTI INSTITUTE OF TECHNOLOGY · {MCA_PROGRAM_META.program.toUpperCase()} · {MCA_PROGRAM_META.semester.toUpperCase()}
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">My Courses</h1>
            <div className="text-xs text-stone-600 mt-1">
              {MCA_PROGRAM_META.student} · {MCA_PROGRAM_META.subjectCount} subjects · {MCA_PROGRAM_META.totalCredits} credits · Official assessment syllabus
            </div>
          </div>
          <button
            type="button"
            onClick={() => onAskAI('Give me a one-shot revision plan for all 5 MCA Semester-I subjects')}
            className="px-4 py-2 bg-[#1E3A8A] text-white text-xs font-medium hover:bg-blue-950 transition-colors cursor-pointer"
          >
            AI Revision Plan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MCA_COURSE_CARDS.map((course) => {
            const units = getMcaCourseUnits(course.subjectId);
            const topics = getMcaCourseTopicCount(course.subjectId);
            return (
              <div key={course.id} className="bg-white border border-stone-300 flex flex-col overflow-hidden">
                <div className="relative">
                  <McaCoverPhoto card={course} alt={`${course.title} cover`} className="w-full h-36 sm:h-44" />
                  <span
                    className="absolute top-3 left-3 text-[11px] font-mono font-bold text-white px-2 py-1"
                    style={{ backgroundColor: course.accent }}
                  >
                    {course.code} · {course.credits} CR
                  </span>
                  <span className="absolute top-3 right-3 text-[11px] font-mono font-bold bg-white/95 text-stone-900 px-2 py-1 border border-stone-300">
                    {units.length} UNITS · {topics} TOPICS
                  </span>
                </div>
                <div className="p-4 sm:p-6 flex flex-col justify-between space-y-4 flex-1">
                  <div className="space-y-2">
                    <h2 className="font-serif text-2xl font-bold text-stone-900 leading-tight">{course.title}</h2>
                    <div className="text-xs text-stone-600">
                      {course.coordinator} · {course.department}
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed">{course.tagline}</p>
                    <div className="text-xs text-stone-600 border-t border-stone-200 pt-2 grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-stone-500 block">Schedule</span>
                        <span className="font-medium text-stone-900">{course.schedule}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block">Venue</span>
                        <span className="font-medium text-stone-900">{course.room}</span>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-stone-500">
                      {units.map((u) => u.unit).join(' · ')}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCourseId(course.id);
                        setOpenUnit('Unit 1');
                      }}
                      className="px-4 py-2 text-white text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
                      style={{ backgroundColor: course.accent }}
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
                      onClick={() => onAskAI(`Teach me ${course.title} starting from Unit 1`)}
                      className="px-4 py-2 bg-[#FBF9F5] border border-stone-300 text-stone-900 text-xs font-medium hover:bg-stone-100 transition-colors cursor-pointer"
                    >
                      Teach Me
                    </button>
                    <button
                      type="button"
                      onClick={() => onAskAI(`Generate an MCQ quiz on ${course.shortName} (MCA Semester-I)`)}
                      className="px-4 py-2 bg-[#FBF9F5] border border-stone-300 text-stone-900 text-xs font-medium hover:bg-stone-100 transition-colors cursor-pointer"
                    >
                      Quiz Me
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
          {selectedCourse.code} · {selectedCourse.room} · {selectedCourse.schedule}
        </div>
      </div>

      <div className="bg-white border border-stone-300 overflow-hidden">
        <div className="relative">
          <McaCoverPhoto card={selectedCourse} alt={`${selectedCourse.title} banner`} className="w-full h-40 sm:h-52" />
          <span
            className="absolute top-4 left-4 text-xs font-mono font-bold text-white px-2.5 py-1"
            style={{ backgroundColor: selectedCourse.accent }}
          >
            {selectedCourse.code} · {selectedCourse.credits} CREDITS
          </span>
        </div>
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-2">
            <div className="text-xs font-mono" style={{ color: selectedCourse.accent }}>
              {selectedCourse.code} · {selectedCourse.department.toUpperCase()} · {MCA_PROGRAM_META.semester.toUpperCase()}
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              {selectedCourse.title}
            </h1>
            <div className="text-xs text-stone-600">
              {selectedCourse.coordinator} · {selectedCourse.schedule} in {selectedCourse.room}
            </div>
            <p className="text-sm text-stone-700 leading-relaxed pt-1">
              {selectedCourse.tagline}
            </p>
          </div>

          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-stone-300 pt-4 lg:pt-0 lg:pl-6 space-y-3">
            <div className="flex justify-between text-xs font-mono tabular-nums">
              <span>SYLLABUS UNITS</span>
              <span className="font-bold text-stone-900">{selectedUnits.length} UNITS</span>
            </div>
            <div className="text-xs text-stone-600">
              Assessment topics: <span className="font-mono font-semibold text-stone-900">{getMcaCourseTopicCount(selectedCourse.subjectId)}</span>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('live-learning')}
                className="flex-1 py-2 px-3 text-white text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
                style={{ backgroundColor: selectedCourse.accent }}
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
            {selectedUnits.map((unit) => {
              const isOpen = openUnit === unit.unit;
              return (
                <div key={unit.unit} className="bg-white border border-stone-300 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenUnit(isOpen ? null : unit.unit)}
                    className="w-full p-5 flex items-center justify-between gap-4 text-left hover:bg-[#FBF9F5] transition-colors cursor-pointer"
                  >
                    <div>
                      <span className="text-xs font-mono" style={{ color: selectedCourse.accent }}>{unit.unit}</span>
                      <h3 className="font-serif text-lg font-bold text-stone-900">{unit.title}</h3>
                      <div className="text-[11px] font-mono text-stone-500 mt-0.5">
                        {unit.topics.length} ASSESSMENT TOPICS
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-stone-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 space-y-3">
                      <ul className="divide-y divide-stone-200 border-t border-stone-200">
                        {unit.topics.map((topic) => (
                          <li key={topic} className="py-2 flex items-center justify-between gap-4 text-xs">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <CheckCircle2 className="w-4 h-4 shrink-0 text-stone-300" />
                              <span className="font-medium text-stone-900">{topic}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => onAskAI(`Teach me ${topic} (${selectedCourse.title}, ${unit.unit})`)}
                              className="text-[#1E3A8A] hover:underline font-medium cursor-pointer shrink-0"
                            >
                              Learn
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => onAskAI(`Teach me ${unit.unit} ${unit.title} (${selectedCourse.title}) simply`)}
                          className="py-1.5 px-2.5 bg-[#FBF9F5] border border-stone-300 text-xs font-medium text-stone-800 hover:border-[#1E3A8A] cursor-pointer"
                        >
                          Teach this unit
                        </button>
                        <button
                          type="button"
                          onClick={() => onAskAI(`Generate an MCQ quiz on ${unit.title} (${selectedCourse.code})`)}
                          className="py-1.5 px-2.5 bg-[#FBF9F5] border border-stone-300 text-xs font-medium text-stone-800 hover:border-[#1E3A8A] cursor-pointer"
                        >
                          Quiz this unit
                        </button>
                        <button
                          type="button"
                          onClick={() => onAskAI(`Give a one-shot revision of ${unit.unit} ${unit.title} (${selectedCourse.title})`)}
                          className="py-1.5 px-2.5 bg-[#FBF9F5] border border-stone-300 text-xs font-medium text-stone-800 hover:border-[#1E3A8A] cursor-pointer"
                        >
                          One-shot revision
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
                <McaCoverPhoto card={selectedCourse} alt={`${selectedCourse.title} tutor cover`} className="w-full h-36" />
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
        <div className="bg-white border border-stone-300 p-4 sm:p-6 space-y-4">
          <h3 className="font-serif text-xl font-bold text-stone-900">
            Course Seminar Discussions · {selectedCourse.code}
          </h3>
          <div className="divide-y divide-stone-200 text-xs">
            <div className="py-3 space-y-1">
              <div className="font-semibold text-stone-900">
                Pinned by {selectedCourse.coordinator}: {selectedUnits[0] ? `${selectedUnits[0].unit} ${selectedUnits[0].title} — start here` : 'Semester plan'}
              </div>
              <p className="text-stone-600">
                Work through the units in order, attempt the per-topic Learn links, then take the unit quiz before moving on.
              </p>
              <div className="text-stone-500 font-mono">MCA Division D · Updated this week</div>
            </div>
            <div className="py-3 space-y-1">
              <div className="font-semibold text-stone-900">
                Study Group Thread: {selectedCourse.shortName} weekend revision circle
              </div>
              <p className="text-stone-600">
                Meeting Saturday at 10:00 AM in the Central Reading Room Mezzanine.
              </p>
              <div className="text-stone-500 font-mono">Division D batch · All welcome</div>
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
      const res = await apiFetch('/api/ai/tutor', {
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
      <div className="bg-white border border-stone-300 p-4 sm:p-6 flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-xs font-mono text-[#1E3A8A]">
            SOCRATIC AI TUTOR · CONTEXT-AWARE RAG LEARNING
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Topic: {topic}
          </h1>
          <div className="text-xs text-stone-600">
            Grounded in CS 201 Lecture Notes · Prof. Sarah Johnson · Step-by-Step Socratic Mode
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
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

      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-4 gap-3">
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

      <div className="bg-white border border-stone-300 p-4 sm:p-6 space-y-4">
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
                {entry.role === 'student' ? 'ALEX MORGAN' : 'KRISTU JAYANTI SOCRATIC AI TUTOR'}
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
          className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-stone-200"
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
            KRISTU JAYANTI SYNCHRONOUS & ARCHIVAL MEDIA STUDIO
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Live Learning & Lecture VOD
          </h1>
        </div>

        <div className="flex gap-1 p-1 bg-stone-200/70 border border-stone-300 max-w-full overflow-x-auto">
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

            <div className="relative bg-stone-900 text-white aspect-video min-h-[220px] sm:min-h-[320px] flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
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
          <div className="lg:col-span-8 bg-white border border-stone-300 p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-stone-500">
              <span>CS 201 ARCHIVAL LECTURE 3 · 55 MIN VOD</span>
              <span>1080P · MULTI-TRACK CAPTIONS</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Binary Search Trees, In-Order Traversal & Structural Induction
            </h2>

            <div className="bg-stone-900 text-white p-4 sm:p-8 flex flex-col justify-between gap-4 min-h-[220px] sm:h-64 relative overflow-hidden">
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

            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
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
    onShowToast('Saved assignment progress to KJIT LMS');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-300 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-stone-500">DELIVERABLES & AUTOGRADER QUEUE</div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Assignments</h1>
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
          <div className="text-xs font-mono text-stone-500">KRISTU JAYANTI REGISTRAR TIMETABLE · OCTOBER 2026</div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Academic Calendar</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 p-1 bg-stone-200/70 border border-stone-300 max-w-full overflow-x-auto">
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

      <div className="bg-white border border-stone-300 p-4 sm:p-6 space-y-4">
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
      const res = await apiFetch('/api/ai/course-recommendations', {
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
            KRISTU JAYANTI INSTITUTE OF TECHNOLOGY REGISTRAR · DEGREE AUDIT & GRADUATION INTELLIGENCE
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
        <div className="lg:col-span-5 bg-[#F5F0E6] border-2 border-stone-900 p-4 sm:p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-[4px_4px_0px_#141210]">
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
              72 Credits Completed · 48 Credits Remaining · Required for MCA (Division D · 26MCAD30): 120.0 Credits.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 bg-[#F5F0E6] border-2 border-stone-900 p-4 sm:p-6 space-y-5 shadow-[4px_4px_0px_#141210]">
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
              label: 'Kristu Jayanti Broadsheet General Education Core',
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
      <section className="bg-[#F5F0E6] border-2 border-stone-900 p-4 sm:p-6 space-y-6 shadow-[4px_4px_0px_#141210]">
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

          <form onSubmit={handleAddInterest} className="flex flex-col sm:flex-row gap-2 pt-1">
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
                        `Explain why ${rec.code} (${rec.title}) was recommended for Parth Pimplapure (26MCAD30, MCA Division D) based on 72 completed credits and current standing in CS 201.`
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
  const [coursesList, setCoursesList] = useState<Course[]>(getStoredCourses);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('cs-201');

  useEffect(() => {
    const handleCoursesUpdate = () => {
      setCoursesList(getStoredCourses());
    };
    window.addEventListener('kjit_courses_updated', handleCoursesUpdate);
    return () => window.removeEventListener('kjit_courses_updated', handleCoursesUpdate);
  }, []);

  const activeCourse = coursesList.find((c) => c.id === selectedCourseId) || coursesList[0];

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-300 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-stone-500">OFFICIAL TRANSCRIPT & ASSESSMENT RECORD</div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Grades & Standing</h1>
        </div>
        <div className="font-mono text-sm text-stone-800 tabular-nums">
          CUMULATIVE GPA: <span className="font-bold text-[#1E3A8A]">3.82 / 4.00</span> · DEAN’S HONOURS LIST
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {coursesList.map((c) => (
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

      <div className="bg-white border border-stone-300 p-4 sm:p-6 space-y-4">
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
          <table className="w-full min-w-[640px] text-left border-collapse text-xs">
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
