import React, { useState } from 'react';
import { CheckCircle2, RefreshCw, Send } from 'lucide-react';
import { ViewId } from '../types';

interface PortalProps {
  currentView: ViewId;
  onNavigate: (view: ViewId) => void;
  onShowToast: (msg: string) => void;
}

// ============================================================================
// FACULTY PORTAL (Dashboard, Courses, Students, Analytics, AI Tutor Mgmt)
// ============================================================================
export const FacultyPortalView: React.FC<PortalProps> = ({ onShowToast }) => {
  const [announcementText, setAnnouncementText] = useState('');
  const [announcements, setAnnouncements] = useState([
    {
      id: 'ann-1',
      course: 'CS 201',
      title: 'Week 6 Recitation: Recursion & AVL Tree Rotations Review',
      sentAt: 'Today · 8:30 AM',
    },
  ]);
  const [socraticStrictness, setSocraticStrictness] = useState('Socratic Hints Only (No Code Spoilers)');

  return (
    <div className="space-y-8">
      <div className="border-t-2 border-b border-stone-900 py-2 px-1 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-stone-700">
        <span>ZANZEE COLLEGE FACULTY SENATE EDITION · PROFESSOR SARAH JOHNSON</span>
        <span>CHAIR OF COMPUTER SCIENCE · FALL 2026</span>
      </div>

      {/* Top Faculty Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Active Courses', value: '3 Seminars', sub: 'CS 201 · CS 310 · CS 490' },
          { label: 'Total Students', value: '218', sub: '124 in CS 201' },
          { label: 'Active Assignments', value: '4 Open', sub: 'Lab 4 Due Friday' },
          { label: 'Student Engagement', value: '82%', sub: '+9% vs Fall 2025' },
          { label: 'AI Tutor Sessions', value: '1,420', sub: 'This week across courses' },
        ].map((m) => (
          <div key={m.label} className="bg-white border border-stone-300 p-4 space-y-1">
            <div className="text-xs font-mono text-stone-500">{m.label}</div>
            <div className="font-mono text-2xl font-bold text-stone-900 tabular-nums">{m.value}</div>
            <div className="text-xs text-stone-600">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Actionable Faculty AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-stone-300 p-6 space-y-4">
          <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-[#9A3412]">PEDAGOGICAL TELEMETRY & AI INSIGHTS</div>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                CS 201 — Data Structures (124 Students · 82% Engagement)
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-[#FBF9F5] border-l-2 border-[#9A3412] space-y-2">
              <div className="text-sm font-semibold text-stone-900">
                “23 students appear to be struggling with recursion.”
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Detected from Socratic AI Tutor queries on base-case termination and pointer return assignment in `deleteNode()`.
              </p>
              <button
                type="button"
                onClick={() => onShowToast('Published supplemental Socratic recursion walkthrough to CS 201')}
                className="px-3.5 py-1.5 bg-[#1E3A8A] text-white text-xs font-medium cursor-pointer"
              >
                Deploy Supplemental Recursion Walkthrough
              </button>
            </div>

            <div className="p-4 bg-[#FBF9F5] border-l-2 border-amber-700 space-y-2">
              <div className="text-sm font-semibold text-stone-900">
                “18 students have not submitted the latest assignment.”
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Lab 4 (Binary Trees) is due Friday at 11:59 PM. 106 students have active GitAutograder commits; 18 have not yet pushed their starter branch.
              </p>
              <button
                type="button"
                onClick={() => onShowToast('Sent gentle milestone reminder to 18 students')}
                className="px-3.5 py-1.5 bg-white border border-stone-300 text-stone-900 text-xs font-medium hover:bg-stone-100 cursor-pointer"
              >
                Send Automated Check-In Nudge
              </button>
            </div>
          </div>

          {/* Student Roster Analytics Table */}
          <div className="pt-3 border-t border-stone-200">
            <div className="text-xs font-mono text-stone-500 mb-2">STUDENT ROSTER SNAPSHOT</div>
            <table className="w-full text-left border-collapse text-xs tabular-nums">
              <thead>
                <tr className="border-b border-stone-300 text-stone-500 font-mono">
                  <th className="py-2">STUDENT</th>
                  <th className="py-2">LAB 4 PROGRESS</th>
                  <th className="py-2">AI TUTOR MASTERY</th>
                  <th className="py-2 text-right">STANDING</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                <tr>
                  <td className="py-2.5 font-medium text-stone-900">Alex Morgan (#ZC-88412)</td>
                  <td className="py-2.5 font-mono">65% (4/6 tests)</td>
                  <td className="py-2.5 font-mono">68% · Active</td>
                  <td className="py-2.5 text-right font-mono font-semibold text-emerald-800">A- (91.8%)</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-stone-900">Priya Patel (#ZC-88109)</td>
                  <td className="py-2.5 font-mono">100% (6/6 tests)</td>
                  <td className="py-2.5 font-mono">94% · Completed</td>
                  <td className="py-2.5 text-right font-mono font-semibold text-emerald-800">A (96.4%)</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-stone-900">Marcus Thorne (#ZC-88904)</td>
                  <td className="py-2.5 font-mono text-amber-800">15% (1/6 tests)</td>
                  <td className="py-2.5 font-mono">42% · Needs Recursion Review</td>
                  <td className="py-2.5 text-right font-mono font-semibold text-amber-800">B- (81.0%)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 5 Cols: AI Tutor Management & Course Announcements */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-stone-300 p-6 space-y-4">
            <div className="text-xs font-mono text-[#1E3A8A]">AI TUTOR GUARDRAILS</div>
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Course AI Tutor Configuration
            </h3>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Pedagogical Response Policy
              </label>
              <select
                value={socraticStrictness}
                onChange={(e) => {
                  setSocraticStrictness(e.target.value);
                  onShowToast('Updated CS 201 AI Tutor pedagogical policy');
                }}
                className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-stone-300"
              >
                <option>Socratic Hints Only (No Code Spoilers)</option>
                <option>Guided Pseudocode + Conceptual Analogies</option>
                <option>Exam Preparation Quiz Mode</option>
              </select>
            </div>
          </div>

          <div className="bg-white border border-stone-300 p-6 space-y-4">
            <div className="text-xs font-mono text-stone-500">BROADCAST TO CS 201</div>
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Post Course Announcement
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!announcementText.trim()) return;
                setAnnouncements((prev) => [
                  {
                    id: `ann-${Date.now()}`,
                    course: 'CS 201',
                    title: announcementText.trim(),
                    sentAt: 'Just now',
                  },
                  ...prev,
                ]);
                setAnnouncementText('');
                onShowToast('Announcement published to all 124 CS 201 students');
              }}
              className="space-y-2"
            >
              <textarea
                rows={3}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="Write an announcement for CS 201 students..."
                className="w-full p-3 text-xs bg-[#FBF9F5] border border-stone-300"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#1E3A8A] text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <span>Publish Dispatch</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="divide-y divide-stone-200 text-xs pt-2">
              {announcements.map((a) => (
                <div key={a.id} className="py-2">
                  <div className="font-mono text-stone-500">{a.course} · {a.sentAt}</div>
                  <div className="font-medium text-stone-900">{a.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// UNIVERSITY ADMINISTRATION PORTAL (Dashboard, AI Admin, Observability, Compliance, Integrations)
// ============================================================================
export const AdminPortalView: React.FC<PortalProps> = ({
  currentView,
  onNavigate,
  onShowToast,
}) => {
  const [timeRange, setTimeRange] = useState<'Today' | '7 days' | '30 days' | 'Semester'>('30 days');
  const [kbSources, setKbSources] = useState([
    {
      name: 'Student Handbook',
      status: 'Active',
      lastIndexed: '2 hours ago',
      version: 'v2026.4',
      docs: '412 sections',
      embedding: '100% Indexed (3,072-dim)',
    },
    {
      name: 'Academic Calendar',
      status: 'Active',
      lastIndexed: '1 hour ago',
      version: 'v2026-27',
      docs: '86 events',
      embedding: '100% Indexed (3,072-dim)',
    },
    {
      name: 'Course Catalog',
      status: 'Active',
      lastIndexed: '4 hours ago',
      version: 'v14.2',
      docs: '1,840 courses',
      embedding: '100% Indexed (3,072-dim)',
    },
    {
      name: 'Financial Aid Policies',
      status: 'Active',
      lastIndexed: '3 hours ago',
      version: 'FERPA-2026.2',
      docs: '295 policies',
      embedding: '100% Indexed (3,072-dim)',
    },
    {
      name: 'IT Documentation',
      status: 'Active',
      lastIndexed: '45 mins ago',
      version: 'KB-4092',
      docs: '640 articles',
      embedding: '100% Indexed (3,072-dim)',
    },
  ]);

  const handleReindex = (sourceName: string) => {
    setKbSources((prev) =>
      prev.map((s) =>
        s.name === sourceName ? { ...s, lastIndexed: 'Just now (Re-indexed)' } : s
      )
    );
    onShowToast(`Re-indexed ${sourceName} into Zanzee Vector Store`);
  };

  const handleToggleDisable = (sourceName: string) => {
    setKbSources((prev) =>
      prev.map((s) =>
        s.name === sourceName
          ? { ...s, status: s.status === 'Active' ? 'Paused' : 'Active' }
          : s
      )
    );
    onShowToast(`Updated status for ${sourceName}`);
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation for Admin Sections */}
      <div className="bg-white border border-stone-300 p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-[#1E3A8A]">
            ZANZEE COLLEGE EXECUTIVE & CIO GOVERNANCE CONSOLE
          </div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            University Administration & AI Foundry
          </h1>
        </div>

        <div className="flex flex-wrap gap-1 p-1 bg-stone-200/70 border border-stone-300">
          {[
            { id: 'admin-dashboard', label: 'Executive Overview' },
            { id: 'admin-ai', label: 'AI & RAG Knowledge' },
            { id: 'admin-observability', label: 'Observability' },
            { id: 'admin-compliance', label: 'Compliance' },
            { id: 'admin-integrations', label: 'Integrations' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onNavigate(tab.id as ViewId)}
              className={`px-3 py-1.5 text-xs font-medium cursor-pointer whitespace-nowrap ${
                currentView === tab.id ? 'bg-[#1E3A8A] text-white' : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time Filter + Executive Metrics */}
      {currentView === 'admin-dashboard' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Institutional Telemetry ({timeRange})
            </h2>
            <div className="flex gap-1 p-1 bg-stone-200/70 border border-stone-300">
              {(['Today', '7 days', '30 days', 'Semester'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1 text-xs font-medium cursor-pointer ${
                    timeRange === r ? 'bg-white text-stone-900' : 'text-stone-600'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { label: 'Total Students', val: '14,820', note: '98.4% Enrolled' },
              { label: 'Active AI Users', val: '13,490', note: '91.0% Adoption' },
              { label: 'AI Conversations', val: '284,190', note: `${timeRange} window` },
              { label: 'Resolution Rate', val: '94.2%', note: 'Support Deflection' },
              { label: 'Human Escalations', val: '5.8%', note: 'Advising & Tier-2 IT' },
              { label: 'System Health', val: '99.98%', note: 'All 5 Systems Nominal' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-stone-300 p-4 space-y-1">
                <div className="text-xs font-mono text-stone-500">{stat.label}</div>
                <div className="font-mono text-2xl font-bold text-stone-900 tabular-nums">{stat.val}</div>
                <div className="text-[11px] text-emerald-800">{stat.note}</div>
              </div>
            ))}
          </div>

          {/* Analytics Bar Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-stone-300 p-6 space-y-4">
              <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-200 pb-2">
                AI Usage & Support Deflection by Department
              </h3>
              {[
                { dept: 'Socratic Course Tutoring (LMS)', pct: 92, count: '118,400 queries' },
                { dept: 'IT Help Desk (Wi-Fi / SSO / MFA)', pct: 89, count: '64,200 deflected' },
                { dept: 'Financial Aid & Bursar Verification', pct: 86, count: '51,900 queries' },
                { dept: 'Registrar & Degree Audit Planning', pct: 95, count: '49,690 queries' },
              ].map((row) => (
                <div key={row.dept} className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="font-medium text-stone-900">{row.dept}</span>
                    <span className="font-mono text-stone-600 tabular-nums">
                      {row.count} · {row.pct}% Resolved
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-200">
                    <div className="h-full bg-[#1E3A8A]" style={{ width: `${row.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-stone-300 p-6 space-y-4">
              <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-200 pb-2">
                Azure AI Foundry & Gemini Hybrid Deployments
              </h3>
              <div className="divide-y divide-stone-200 text-xs tabular-nums">
                <div className="py-2.5 flex justify-between">
                  <span className="font-medium text-stone-900">Text & Vision Deployment</span>
                  <span className="font-mono text-[#1E3A8A]">gpt-4.1-mini + gemini-3.8-flash</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="font-medium text-stone-900">Editorial Diagram Generation</span>
                  <span className="font-mono text-stone-800">FLUX-1.1-pro</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="font-medium text-stone-900">Speech & Live Audio Region</span>
                  <span className="font-mono text-stone-800">eastus · Cognitive Services</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="font-medium text-stone-900">Content Understanding API</span>
                  <span className="font-mono text-stone-800">2025-11-01 (Verified)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Administration & RAG Knowledge Base */}
      {currentView === 'admin-ai' && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-300 p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
              <div>
                <div className="text-xs font-mono text-[#1E3A8A]">RAG VECTOR INDEX & PROMPT VERSIONS</div>
                <h2 className="font-serif text-xl font-bold text-stone-900">
                  University Knowledge Sources
                </h2>
              </div>
              <span className="text-xs font-mono text-stone-600">
                Active Prompt Version: v5.0-CampusAI-Master-Prompt
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs tabular-nums">
                <thead>
                  <tr className="border-b border-stone-300 text-stone-500 font-mono">
                    <th className="py-2.5">KNOWLEDGE SOURCE</th>
                    <th className="py-2.5">STATUS</th>
                    <th className="py-2.5">LAST INDEXED</th>
                    <th className="py-2.5">VERSION</th>
                    <th className="py-2.5">DOCUMENTS</th>
                    <th className="py-2.5">EMBEDDING STATUS</th>
                    <th className="py-2.5 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {kbSources.map((src) => (
                    <tr key={src.name}>
                      <td className="py-3 font-semibold text-stone-900">{src.name}</td>
                      <td className="py-3 font-mono text-emerald-800">{src.status}</td>
                      <td className="py-3 font-mono text-stone-600">{src.lastIndexed}</td>
                      <td className="py-3 font-mono text-stone-600">{src.version}</td>
                      <td className="py-3 font-mono text-stone-600">{src.docs}</td>
                      <td className="py-3 font-mono text-stone-600">{src.embedding}</td>
                      <td className="py-3 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleReindex(src.name)}
                          className="px-2.5 py-1 bg-[#1E3A8A] text-white text-[11px] font-medium cursor-pointer"
                        >
                          Re-index
                        </button>
                        <button
                          type="button"
                          onClick={() => onShowToast(`Viewing index schema for ${src.name}`)}
                          className="px-2.5 py-1 border border-stone-300 text-stone-800 text-[11px] cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleDisable(src.name)}
                          className="px-2.5 py-1 border border-stone-300 text-stone-800 text-[11px] cursor-pointer"
                        >
                          {src.status === 'Active' ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Master Prompt v5.0 Governance & Guardrail Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-stone-300 p-5 space-y-3">
              <div className="text-xs font-mono text-[#1E3A8A]">SECTION 2 · KNOWLEDGE HIERARCHY</div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                5-Tier Retrieval Priority
              </h3>
              <ol className="space-y-2 text-xs text-stone-700 list-decimal list-inside">
                <li><strong>LEVEL 1:</strong> Student-specific authorized info (schedule, grades, degree audit)</li>
                <li><strong>LEVEL 2:</strong> Official university knowledge (handbook, catalog, 2026–27 calendar)</li>
                <li><strong>LEVEL 3:</strong> Course-specific information (syllabi, lectures, assignments)</li>
                <li><strong>LEVEL 4:</strong> General educational knowledge (math, CS, writing)</li>
                <li><strong>LEVEL 5:</strong> General web knowledge (never presented as university policy)</li>
              </ol>
            </div>

            <div className="bg-white border border-stone-300 p-5 space-y-3">
              <div className="text-xs font-mono text-[#1E3A8A]">SECTION 20 & 21 · ROUTING</div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                7 Response Modes & 16 Intents
              </h3>
              <div className="text-xs text-stone-700 space-y-1.5 leading-relaxed">
                <div>
                  <strong>Active Modes:</strong> General Assistant · AI Tutor · Academic Advisor · Admissions Assistant · Financial-Aid Assistant · IT Support · Campus Guide
                </div>
                <div>
                  <strong>Intent Classifier:</strong> ADMISSIONS · FINANCIAL_AID · ACADEMICS · COURSES · ASSIGNMENTS · GRADES · CALENDAR · DEGREE_PROGRESS · IT_SUPPORT · LIBRARY · CAMPUS_SERVICES · STUDENT_LIFE · FACULTY_SUPPORT · ADMINISTRATION · GENERAL · HUMAN_ESCALATION
                </div>
              </div>
            </div>

            <div className="bg-white border border-stone-300 p-5 space-y-3">
              <div className="text-xs font-mono text-emerald-800">SECTIONS 4, 5, 7, 15 & 24 · SAFETY</div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Institutional Guardrails Active
              </h3>
              <ul className="space-y-1.5 text-xs text-stone-700">
                <li>· <strong>FERPA Privacy:</strong> Blocks cross-student grade/schedule requests</li>
                <li>· <strong>Prompt Security:</strong> Blocks system prompt & API key exfiltration</li>
                <li>· <strong>Conflict Resolution:</strong> Flags conflicting policy timestamps for Registrar confirmation</li>
                <li>· <strong>Human Escalation:</strong> Routes low-confidence or policy petitions to staff</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Observability */}
      {currentView === 'admin-observability' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {[
              { sys: 'AI Service', state: 'Operational', latency: '410ms P95' },
              { sys: 'RAG Index', state: 'Operational', latency: '68ms Query' },
              { sys: 'LMS Bridge', state: 'Operational', latency: '99.99% SLA' },
              { sys: 'Identity SSO', state: 'Operational', latency: 'SAML 2.0 OK' },
              { sys: 'Video Studio', state: 'Operational', latency: 'WebRTC Edge' },
            ].map((item) => (
              <div key={item.sys} className="bg-white border border-stone-300 p-4 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-900">{item.sys}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="text-xs font-mono text-emerald-800">{item.state}</div>
                <div className="text-[11px] font-mono text-stone-500 tabular-nums">{item.latency}</div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-stone-300 p-6 grid grid-cols-2 lg:grid-cols-4 gap-6 tabular-nums">
            <div>
              <div className="text-xs font-mono text-stone-500">AI RESPONSE LATENCY</div>
              <div className="font-mono text-2xl font-bold text-stone-900">0.41s</div>
              <div className="text-xs text-stone-600">Median First-Token Stream</div>
            </div>
            <div>
              <div className="text-xs font-mono text-stone-500">RAG RETRIEVAL ACCURACY</div>
              <div className="font-mono text-2xl font-bold text-stone-900">98.7%</div>
              <div className="text-xs text-stone-600">Verified Citation Grounding</div>
            </div>
            <div>
              <div className="text-xs font-mono text-stone-500">ERROR RATE (24H)</div>
              <div className="font-mono text-2xl font-bold text-emerald-800">0.02%</div>
              <div className="text-xs text-stone-600">Zero Unhandled Exceptions</div>
            </div>
            <div>
              <div className="text-xs font-mono text-stone-500">ESCALATION RATE</div>
              <div className="font-mono text-2xl font-bold text-stone-900">5.8%</div>
              <div className="text-xs text-stone-600">Human Advisor Handoffs</div>
            </div>
          </div>
        </div>
      )}

      {/* Compliance UI */}
      {currentView === 'admin-compliance' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { std: 'FERPA Student Record Privacy', status: 'Certified Compliant', audit: 'Sep 15, 2026', dept: 'Office of the University Registrar' },
            { std: 'WCAG 2.2 AA Accessibility', status: 'Verified AA', audit: 'Sep 28, 2026', dept: 'Office of Accessible Learning' },
            { std: 'GDPR & International Data Residency', status: 'Compliant (US-East Vault)', audit: 'Sep 01, 2026', dept: 'General Counsel & CISO' },
            { std: 'COPPA Early-College Safeguards', status: 'Active Enforcement', audit: 'Aug 20, 2026', dept: 'Admissions & Youth Programs' },
            { std: 'Immutable Audit Logging', status: '100% Signed Logs', audit: 'Continuous', dept: 'Security Operations Center' },
            { std: 'Role-Based Access Controls (RBAC)', status: 'Zero-Trust Enforced', audit: 'Sep 29, 2026', dept: 'Identity & Access Management' },
          ].map((c) => (
            <div key={c.std} className="bg-white border border-stone-300 p-5 space-y-2">
              <div className="text-xs font-mono text-emerald-800">{c.status}</div>
              <h3 className="font-serif text-lg font-bold text-stone-900">{c.std}</h3>
              <div className="text-xs text-stone-600">Last audit: <span className="font-mono">{c.audit}</span></div>
              <div className="text-xs text-stone-600">Responsible: {c.dept}</div>
            </div>
          ))}
        </div>
      )}

      {/* Enterprise Integrations */}
      {currentView === 'admin-integrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Canvas / Zanzee LMS', standards: 'LTI 1.3 · Common Cartridge · cmi5', sync: '2 mins ago', status: 'Connected' },
            { name: 'Okta & Shibboleth Identity Federation', standards: 'SAML 2.0 · OAuth 2.0 · SCIM 2.0', sync: 'Real-time', status: 'Connected' },
            { name: 'Learning Record Warehouse', standards: 'xAPI (Tin Can) · SCORM 2004', sync: '5 mins ago', status: 'Connected' },
            { name: 'Zanzee Bursar & Tuition Gateway', standards: 'PCI-DSS Level 1 · ISO 20022', sync: '14 mins ago', status: 'Connected' },
            { name: 'Slate Admissions & Advising CRM', standards: 'REST Webhook · OAuth 2.0', sync: '8 mins ago', status: 'Connected' },
            { name: 'Zanzee Library OCLC & IEEE/ACM', standards: 'MARC21 · Z39.50 · OpenURL', sync: '1 hour ago', status: 'Connected' },
          ].map((intg) => (
            <div key={intg.name} className="bg-white border border-stone-300 p-5 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-mono text-emerald-800">{intg.status} · Last sync: {intg.sync}</div>
                <h3 className="font-serif text-lg font-bold text-stone-900">{intg.name}</h3>
                <div className="text-xs font-mono text-stone-600">Standards: {intg.standards}</div>
              </div>
              <button
                type="button"
                onClick={() => onShowToast(`Triggered live sync for ${intg.name}`)}
                className="px-3 py-1.5 border border-stone-300 text-xs font-medium text-stone-800 hover:bg-stone-100 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Now</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
