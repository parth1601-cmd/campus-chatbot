import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Sparkles,
  BookOpen,
  ChevronDown,
  CheckCircle2,
  ArrowLeft,
  GraduationCap,
  Filter,
  X,
  Clock,
  MapPin,
  Info,
  Layers,
} from 'lucide-react';
import type { ViewId } from '../types';
import { STUDENT_PERSONA } from '../data/zanzeeData';
import {
  PG_PROGRAMS,
  PG_COURSE_CARDS,
  searchPgCourses,
  pgInterestScore,
  getPgTopicCount,
  type PgCourseCard,
  type PgProgramId,
} from '../data/pgPrograms';
import { AITutorView, AssignmentsView, GradesView } from './StudentAcademicViews';
import { apiFetch } from '../lib/api';

export interface MyCoursesNavProps {
  onNavigate: (view: ViewId, payload?: string) => void;
  onAskAI: (prompt: string) => void;
  onShowToast: (msg: string) => void;
}

type CategoryFilter = 'All' | 'Core' | 'Lab' | 'Foundation';
type SortMode = 'Recommended' | 'Code' | 'Title' | 'Most topics';
type DetailTab = 'Overview' | 'Content' | 'Assignments' | 'Grades' | 'Discussions' | 'AI Tutor';

const PgCoverPhoto: React.FC<{ card: PgCourseCard; className?: string; alt: string }> = ({
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

function resolveInitialCourseId(selectedCourseId?: string): string | null {
  if (!selectedCourseId) return null;
  const direct = PG_COURSE_CARDS.find((c) => c.id === selectedCourseId);
  if (direct) return direct.id;
  // Legacy mappings: old MCA card ids (mca-dsa) + old LMS ids (cs-201)
  const legacyMap: Record<string, string> = {
    'mca-dsa': 'pg-mca-dsa',
    'mca-python': 'pg-mca-python',
    'mca-java-web': 'pg-mca-java-web',
    'mca-maths': 'pg-mca-maths',
    'mca-adbms': 'pg-mca-adbms',
    'cs-201': 'pg-mca-dsa',
    'math-210': 'pg-mca-maths',
  };
  const mapped = legacyMap[selectedCourseId];
  if (mapped && PG_COURSE_CARDS.some((c) => c.id === mapped)) return mapped;
  return null;
}

function programmeBadge(programId: PgProgramId): string {
  if (programId === 'mca') return 'MCA';
  if (programId === 'msc-ds') return 'M.Sc DS';
  return 'M.Sc CS';
}

export const CoursesView: React.FC<MyCoursesNavProps & { selectedCourseId?: string }> = ({
  selectedCourseId,
  onNavigate,
  onAskAI,
  onShowToast,
}) => {
  const [programId, setProgramId] = useState<PgProgramId>(() => {
    try {
      const saved = localStorage.getItem('pg_program');
      if (saved === 'msc-ds' || saved === 'msc-cyber' || saved === 'mca') return saved;
    } catch {
      /* ignore */
    }
    return 'mca';
  });
  const [semester, setSemester] = useState<number>(() => {
    try {
      const saved = Number(localStorage.getItem('pg_semester'));
      if (saved >= 1 && saved <= 4) return saved;
    } catch {
      /* ignore */
    }
    return 1;
  });
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [sort, setSort] = useState<SortMode>('Recommended');
  const [activeCourseId, setActiveCourseId] = useState<string | null>(() =>
    resolveInitialCourseId(selectedCourseId),
  );
  const [openUnit, setOpenUnit] = useState<string | null>('Unit 1');
  const [activeTab, setActiveTab] = useState<DetailTab>('Overview');
  const [tutorQuery, setTutorQuery] = useState('');
  const [tutorLoading, setTutorLoading] = useState(false);
  const [tutorResponse, setTutorResponse] = useState(
    'Welcome to your PG course tutor. Ask me to teach a unit from the start, trace an algorithm on an example, quiz you on a topic, or solve a problem step by step.',
  );

  useEffect(() => {
    const resolved = resolveInitialCourseId(selectedCourseId);
    if (resolved) {
      setActiveCourseId(resolved);
      const found = PG_COURSE_CARDS.find((c) => c.id === resolved);
      if (found) {
        setProgramId(found.programId);
        setSemester(found.semester);
      }
    }
  }, [selectedCourseId]);

  useEffect(() => {
    try {
      localStorage.setItem('pg_program', programId);
      localStorage.setItem('pg_semester', String(semester));
    } catch {
      /* ignore */
    }
  }, [programId, semester]);

  const program = PG_PROGRAMS.find((p) => p.id === programId) || PG_PROGRAMS[0];
  const interests = STUDENT_PERSONA.statedInterests || [];

  const pool = useMemo(
    () => PG_COURSE_CARDS.filter((c) => c.programId === programId && c.semester === semester),
    [programId, semester],
  );

  const interestRanked = useMemo(() => {
    const scored = pool.map((course) => ({ course, s: pgInterestScore(course, interests) }));
    scored.sort((a, b) => b.s - a.s);
    return scored;
  }, [pool, interests]);

  const recommendedIds = useMemo(
    () => interestRanked.filter((r) => r.s > 0).slice(0, 2).map((r) => r.course.id),
    [interestRanked],
  );

  const interestById = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of interestRanked) m.set(r.course.id, r.s);
    return m;
  }, [interestRanked]);

  const filtered = useMemo(() => {
    const hits = searchPgCourses(query, pool);
    const byCat = hits.filter(
      (h) => category === 'All' || h.course.category === category,
    );
    const sorted = [...byCat];
    if (sort === 'Code') sorted.sort((a, b) => a.course.code.localeCompare(b.course.code));
    else if (sort === 'Title') sorted.sort((a, b) => a.course.title.localeCompare(b.course.title));
    else if (sort === 'Most topics')
      sorted.sort((a, b) => getPgTopicCount(b.course) - getPgTopicCount(a.course));
    else {
      // Recommended: interest match first, then search score, then topic depth
      sorted.sort((a, b) => {
        const ia = interestById.get(a.course.id) || 0;
        const ib = interestById.get(b.course.id) || 0;
        if (ib !== ia) return ib - ia;
        if (b.score !== a.score) return b.score - a.score;
        return getPgTopicCount(b.course) - getPgTopicCount(a.course);
      });
    }
    return sorted;
  }, [query, pool, category, sort, interestById]);

  const stats = useMemo(() => {
    const units = pool.reduce((n, c) => n + c.units.length, 0);
    const topics = pool.reduce((n, c) => n + getPgTopicCount(c), 0);
    const official = pool.filter((c) => !c.indicative).length;
    return { courses: pool.length, units, topics, official, indicative: pool.length - official };
  }, [pool]);

  const activeCourse: PgCourseCard | undefined = PG_COURSE_CARDS.find((c) => c.id === activeCourseId);

  const openCourse = (course: PgCourseCard) => {
    setActiveCourseId(course.id);
    setOpenUnit(course.units[0]?.unit || 'Unit 1');
    setActiveTab('Overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerCourseTutor = async (action: 'explain' | 'hint' | 'example' | 'quiz' | 'custom', customText?: string) => {
    setTutorLoading(true);
    try {
      const res = await apiFetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: activeCourse ? `${activeCourse.code} — ${activeCourse.title}` : `${program.code} Semester ${semester}`,
          action,
          question: customText,
        }),
      });
      const data = await res.json();
      if (data.reply) setTutorResponse(data.reply);
    } catch {
      setTutorResponse(
        'Let’s break this down step by step: tell me the exact topic (for example "AVL rotations", "Bayes theorem" or "AES modes") and I will teach it simply, then check your understanding.',
      );
    } finally {
      setTutorLoading(false);
    }
  };

  // ---------------- DETAIL VIEW ----------------
  if (activeCourse) {
    const units = activeCourse.units;
    const siblings = PG_COURSE_CARDS.filter(
      (c) => c.programId === activeCourse.programId && c.semester === activeCourse.semester && c.id !== activeCourse.id,
    ).slice(0, 3);
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setActiveCourseId(null)}
            className="text-xs font-medium text-[#1E3A8A] hover:underline cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {program.name} · Sem {semester}</span>
          </button>
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className="px-2 py-1 text-white font-bold" style={{ backgroundColor: program.accent }}>
              {programmeBadge(activeCourse.programId)} · SEM {activeCourse.semester}
            </span>
            {activeCourse.indicative ? (
              <span className="px-2 py-1 bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                INDICATIVE OUTLINE
              </span>
            ) : (
              <span className="px-2 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">
                OFFICIAL SYLLABUS
              </span>
            )}
          </div>
        </div>

        <div className="bg-white border border-stone-300 overflow-hidden">
          <div className="relative">
            <PgCoverPhoto card={activeCourse} alt={`${activeCourse.title} banner`} className="w-full h-52" />
            <span
              className="absolute top-4 left-4 text-xs font-mono font-bold text-white px-2.5 py-1"
              style={{ backgroundColor: activeCourse.accent }}
            >
              {activeCourse.code} · {activeCourse.credits} CREDITS · {activeCourse.category.toUpperCase()}
            </span>
          </div>
          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-2">
              <div className="text-xs font-mono" style={{ color: activeCourse.accent }}>
                {activeCourse.code} · {activeCourse.department.toUpperCase()} · {program.name.toUpperCase()} · SEM {activeCourse.semester}
              </div>
              <h1 className="font-serif text-3xl font-bold text-stone-900">{activeCourse.title}</h1>
              <div className="text-xs text-stone-600">
                {activeCourse.coordinator} · {activeCourse.schedule} in {activeCourse.room}
              </div>
              <p className="text-sm text-stone-700 leading-relaxed pt-1">{activeCourse.tagline}</p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {activeCourse.tags.map((t) => (
                  <span key={t} className="text-[11px] font-mono bg-[#FBF9F5] border border-stone-300 px-2 py-0.5 text-stone-700">
                    {t}
                  </span>
                ))}
              </div>
              {activeCourse.indicative && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-300 text-xs text-amber-900 leading-relaxed flex gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Indicative Semester-I outline for {program.name} (based on programme highlights + standard PG
                    curriculum). Confirm unit-wise syllabus with the PG Department before assessments. MCA outlines
                    are the official assessment syllabus.
                  </span>
                </div>
              )}
            </div>
            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-stone-300 pt-4 lg:pt-0 lg:pl-6 space-y-3">
              <div className="flex justify-between text-xs font-mono tabular-nums">
                <span>SYLLABUS UNITS</span>
                <span className="font-bold text-stone-900">{units.length} UNITS</span>
              </div>
              <div className="text-xs text-stone-600">
                Assessment topics:{' '}
                <span className="font-mono font-semibold text-stone-900">{getPgTopicCount(activeCourse)}</span>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('live-learning')}
                  className="flex-1 py-2 px-3 text-white text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: activeCourse.accent }}
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
              <div className="text-[11px] font-mono text-stone-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{activeCourse.schedule}</span>
              </div>
              <div className="text-[11px] font-mono text-stone-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{activeCourse.room}</span>
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
              {units.map((unit) => {
                const isOpen = openUnit === unit.unit;
                return (
                  <div key={unit.unit} className="bg-white border border-stone-300 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenUnit(isOpen ? null : unit.unit)}
                      className="w-full p-5 flex items-center justify-between gap-4 text-left hover:bg-[#FBF9F5] transition-colors cursor-pointer"
                    >
                      <div>
                        <span className="text-xs font-mono" style={{ color: activeCourse.accent }}>
                          {unit.unit}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-stone-900">{unit.title}</h3>
                        <div className="text-[11px] font-mono text-stone-500 mt-0.5">
                          {unit.topics.length} TOPICS
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
                                onClick={() =>
                                  onAskAI(`Teach me ${topic} (${activeCourse.title}, ${unit.unit})`)
                                }
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
                            onClick={() =>
                              onAskAI(`Teach me ${unit.unit} ${unit.title} (${activeCourse.title}) simply`)
                            }
                            className="py-1.5 px-2.5 bg-[#FBF9F5] border border-stone-300 text-xs font-medium text-stone-800 hover:border-[#1E3A8A] cursor-pointer"
                          >
                            Teach this unit
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onAskAI(`Generate an MCQ quiz on ${unit.title} (${activeCourse.code})`)
                            }
                            className="py-1.5 px-2.5 bg-[#FBF9F5] border border-stone-300 text-xs font-medium text-stone-800 hover:border-[#1E3A8A] cursor-pointer"
                          >
                            Quiz this unit
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onAskAI(`Give a one-shot revision of ${unit.unit} ${unit.title} (${activeCourse.title})`)
                            }
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
                  <PgCoverPhoto card={activeCourse} alt={`${activeCourse.title} tutor cover`} className="w-full h-36" />
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
                    placeholder="e.g., Explain AES modes simply..."
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

              {siblings.length > 0 && (
                <div className="bg-white border border-stone-300 p-5 space-y-3">
                  <div className="text-xs font-mono text-stone-500">MORE IN {program.code} · SEM {semester}</div>
                  {siblings.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => openCourse(s)}
                      className="w-full text-left p-2.5 border border-stone-200 hover:border-[#1E3A8A] transition-colors cursor-pointer"
                    >
                      <div className="text-[11px] font-mono text-stone-500">{s.code}</div>
                      <div className="text-xs font-semibold text-stone-900">{s.title}</div>
                    </button>
                  ))}
                </div>
              )}
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
              Course Seminar Discussions · {activeCourse.code}
            </h3>
            <div className="divide-y divide-stone-200 text-xs">
              <div className="py-3 space-y-1">
                <div className="font-semibold text-stone-900">
                  Pinned by {activeCourse.coordinator}: start with {units[0]?.unit} {units[0]?.title}
                </div>
                <p className="text-stone-600">
                  Work through the units in order, attempt the per-topic Learn links, then take the unit quiz before
                  moving on.
                </p>
                <div className="text-stone-500 font-mono">{program.name} · Updated this week</div>
              </div>
              <div className="py-3 space-y-1">
                <div className="font-semibold text-stone-900">
                  Study Group Thread: {activeCourse.shortName} weekend revision circle
                </div>
                <p className="text-stone-600">
                  Meeting Saturday at 10:00 AM in the Central Reading Room Mezzanine.
                </p>
                <div className="text-stone-500 font-mono">PG batch · All welcome</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------------- CATALOGUE VIEW ----------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-stone-300 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-stone-500">
            KRISTU JAYANTI INSTITUTE OF TECHNOLOGY · PG PROGRAMMES · {STUDENT_PERSONA.program.toUpperCase()}
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">My Courses</h1>
          <div className="text-xs text-stone-600 mt-1">
            {STUDENT_PERSONA.name} · {STUDENT_PERSONA.id} · MCA · M.Sc Data Science · M.Sc Cyber Security ·
            Semester {semester}
          </div>
        </div>
        <button
          type="button"
          onClick={() =>
            onAskAI(`Give me a one-shot revision plan for ${program.name} Semester ${semester}`)
          }
          className="px-4 py-2 bg-[#1E3A8A] text-white text-xs font-medium hover:bg-blue-950 transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Revision Plan</span>
        </button>
      </div>

      {/* Programme switcher */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PG_PROGRAMS.map((p) => {
          const count = PG_COURSE_CARDS.filter((c) => c.programId === p.id && c.semester === 1).length;
          const isActive = p.id === programId;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setProgramId(p.id);
                setActiveCourseId(null);
                onShowToast(`Switched to ${p.name} · Semester ${semester}`);
              }}
              className={`text-left p-4 border-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-white border-stone-900 shadow-[4px_4px_0px_#141210]'
                  : 'bg-[#F5F0E6] border-stone-300 hover:border-stone-900'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-[11px] font-mono font-bold text-white px-2 py-0.5"
                  style={{ backgroundColor: p.accent }}
                >
                  {p.code}
                </span>
                <span className="text-[11px] font-mono text-stone-500 tabular-nums">
                  {count} COURSES · SEM 1
                </span>
              </div>
              <div className="mt-2 font-serif text-lg font-bold text-stone-900 leading-tight">{p.name}</div>
              <div className="text-[11px] text-stone-600 mt-1 leading-snug">{p.tagline}</div>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-stone-600">
                <span>{p.duration}</span>
                <span className="font-bold text-stone-900">{p.feePerYear}</span>
              </div>
              {isActive && (
                <div className="mt-2 text-[11px] font-mono font-bold" style={{ color: p.accent }}>
                  ● ACTIVE PROGRAMME
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Intelligent control bar */}
      <div className="bg-[#F5F0E6] border-2 border-stone-900 p-4 space-y-3 shadow-[3px_3px_0px_#141210]">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Smart search ${program.code} Sem ${semester} — try “AES”, “regression”, “AVL”, “SQL”…`}
              className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-stone-900 focus:outline-none focus:border-[#1E3A8A]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-[11px] font-mono text-stone-500">
              <Filter className="w-3.5 h-3.5" />
              <span>CATEGORY</span>
            </div>
            {(['All', 'Core', 'Lab', 'Foundation'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`px-2.5 py-1.5 text-xs font-mono border cursor-pointer ${
                  category === c
                    ? 'bg-stone-900 text-white border-stone-900 font-bold'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-stone-500 mr-1">SEMESTER</span>
            {[1, 2, 3, 4].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSemester(s);
                  setActiveCourseId(null);
                }}
                className={`px-3 py-1.5 text-xs font-mono border cursor-pointer ${
                  semester === s
                    ? 'text-white font-bold border-stone-900'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
                style={semester === s ? { backgroundColor: program.accent } : undefined}
              >
                Sem {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-stone-500">SORT</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="px-2.5 py-1.5 text-xs bg-white border border-stone-900 text-stone-900 font-mono"
            >
              <option value="Recommended">✨ Recommended for me</option>
              <option value="Code">Code (A–Z)</option>
              <option value="Title">Title (A–Z)</option>
              <option value="Most topics">Most topics</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-stone-600 tabular-nums border-t border-stone-300 pt-2.5">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <strong className="text-stone-900">{stats.courses}</strong> COURSES
          </span>
          <span>
            <strong className="text-stone-900">{stats.units}</strong> UNITS
          </span>
          <span>
            <strong className="text-stone-900">{stats.topics}</strong> TOPICS
          </span>
          {stats.official > 0 && (
            <span className="text-emerald-800 font-bold">● {stats.official} OFFICIAL SYLLABUS</span>
          )}
          {stats.indicative > 0 && (
            <span className="text-amber-800 font-bold">● {stats.indicative} INDICATIVE OUTLINE</span>
          )}
          {query.trim() && (
            <span>
              MATCHING “<strong className="text-stone-900">{query.trim().toUpperCase()}</strong>”: {filtered.length}
            </span>
          )}
          {recommendedIds.length > 0 && sort === 'Recommended' && (
            <span className="flex items-center gap-1 text-[#1E3A8A] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              PERSONALISED FOR {STUDENT_PERSONA.name.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {semester !== 1 ? (
        <div className="bg-white border border-stone-300 p-8 text-center space-y-3">
          <GraduationCap className="w-8 h-8 mx-auto text-stone-400" />
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            {program.name} · Semester {semester} — curriculum to be notified
          </h2>
          <p className="text-xs text-stone-600 max-w-xl mx-auto leading-relaxed">
            Semester {semester} timetable and unit-wise syllabus will be published by the PG Department. Semester 1
            is fully live below-equivalent — switch back to Sem 1 to study, or ask CampusAI for a semester plan.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setSemester(1)}
              className="px-4 py-2 text-white text-xs font-medium cursor-pointer"
              style={{ backgroundColor: program.accent }}
            >
              Back to Semester 1
            </button>
            <button
              type="button"
              onClick={() => onAskAI(`What is the plan for ${program.name} Semester ${semester}?`)}
              className="px-4 py-2 bg-[#FBF9F5] border border-stone-300 text-xs font-medium cursor-pointer"
            >
              Ask AI for Sem {semester} plan
            </button>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-stone-300 p-8 text-center space-y-3">
          <BookOpen className="w-8 h-8 mx-auto text-stone-400" />
          <h2 className="font-serif text-2xl font-bold text-stone-900">No courses match your smart search</h2>
          <p className="text-xs text-stone-600">
            Try “python”, “crypto”, “statistics”, a course code like {pool[0]?.code || 'MCA101'}, or clear filters.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setCategory('All');
              }}
              className="px-4 py-2 bg-stone-900 text-white text-xs font-medium cursor-pointer"
            >
              Clear search & filters
            </button>
            <button
              type="button"
              onClick={() => onAskAI(query || `Help me choose a ${program.code} Semester 1 course`)}
              className="px-4 py-2 bg-[#FBF9F5] border border-stone-300 text-xs font-medium cursor-pointer"
            >
              Ask AI instead
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(({ course, matchedTopics }) => {
            const topics = getPgTopicCount(course);
            const isRecommended = recommendedIds.includes(course.id);
            return (
              <div key={course.id} className="bg-white border border-stone-300 flex flex-col overflow-hidden">
                <div className="relative">
                  <PgCoverPhoto card={course} alt={`${course.title} cover`} className="w-full h-44" />
                  <span
                    className="absolute top-3 left-3 text-[11px] font-mono font-bold text-white px-2 py-1"
                    style={{ backgroundColor: course.accent }}
                  >
                    {course.code} · {course.credits} CR
                  </span>
                  <span className="absolute top-3 right-3 text-[11px] font-mono font-bold bg-white/95 text-stone-900 px-2 py-1 border border-stone-300">
                    {course.units.length} UNITS · {topics} TOPICS
                  </span>
                  {isRecommended && (
                    <span className="absolute bottom-3 left-3 text-[11px] font-mono font-bold bg-[#1E3A8A] text-white px-2 py-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      RECOMMENDED FOR YOU
                    </span>
                  )}
                </div>
                <div className="p-6 flex flex-col justify-between space-y-4 flex-1">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                      <span className="font-bold" style={{ color: course.accent }}>
                        {programmeBadge(course.programId)} · SEM {course.semester} · {course.category.toUpperCase()}
                      </span>
                      {course.indicative ? (
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 font-bold">
                          INDICATIVE
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-1.5 py-0.5 font-bold">
                          OFFICIAL
                        </span>
                      )}
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-stone-900 leading-tight">{course.title}</h2>
                    <div className="text-xs text-stone-600">
                      {course.coordinator} · {course.department}
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed">{course.tagline}</p>
                    {matchedTopics.length > 0 && (
                      <div className="text-[11px] font-mono text-[#1E3A8A] bg-blue-50 border border-blue-200 p-2">
                        MATCH: {matchedTopics.slice(0, 2).join(' · ')}
                      </div>
                    )}
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
                      {course.units.map((u) => u.unit).join(' · ')}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => openCourse(course)}
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
                      Live Class
                    </button>
                    <button
                      type="button"
                      onClick={() => onAskAI(`Teach me ${course.title} (${course.code}) starting from Unit 1`)}
                      className="px-4 py-2 bg-[#FBF9F5] border border-stone-300 text-stone-900 text-xs font-medium hover:bg-stone-100 transition-colors cursor-pointer"
                    >
                      Teach Me
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onAskAI(`Generate an MCQ quiz on ${course.shortName} (${course.code} Semester ${course.semester})`)
                      }
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
      )}

      {/* Programme footer: fees + admissions */}
      <div className="bg-[#F5F0E6] border-2 border-stone-900 p-5 space-y-4 shadow-[3px_3px_0px_#141210]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#1E3A8A]" />
            <h3 className="font-serif text-lg font-bold text-stone-900">
              All PG Programmes · Institute of Technology
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('admissions')}
            className="px-4 py-2 bg-stone-900 text-white text-xs font-mono font-bold hover:bg-[#1E3A8A] transition-colors cursor-pointer"
          >
            View Admissions & Fees →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PG_PROGRAMS.map((p) => (
            <div key={p.id} className="bg-white border border-stone-300 p-4 space-y-1.5">
              <div className="text-[11px] font-mono font-bold" style={{ color: p.accent }}>
                {p.code} · {p.duration.toUpperCase()}
              </div>
              <div className="font-serif text-base font-bold text-stone-900">{p.name}</div>
              <div className="text-[11px] text-stone-600 leading-snug">{p.eligibilityShort}</div>
              <div className="text-xs font-mono font-bold text-stone-900">{p.feePerYear}</div>
              <div className="flex gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setProgramId(p.id);
                    setSemester(1);
                    setActiveCourseId(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex-1 py-1.5 bg-[#FBF9F5] border border-stone-300 text-xs font-medium hover:bg-stone-100 cursor-pointer"
                >
                  View courses
                </button>
                <button
                  type="button"
                  onClick={() => onAskAI(`Am I eligible for ${p.name}? My background is MCA Division D.`)}
                  className="flex-1 py-1.5 bg-[#FBF9F5] border border-stone-300 text-xs font-medium hover:bg-stone-100 cursor-pointer"
                >
                  Check eligibility
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-[11px] text-stone-500 leading-relaxed">
          MCA Semester-I shows the official campus-assessment syllabus. M.Sc Data Science & M.Sc Cyber Security show
          indicative Semester-I outlines — confirm the unit-wise syllabus with the PG Department. No capitation fees
          are collected beyond the official fee structure.
        </div>
      </div>
    </div>
  );
};
