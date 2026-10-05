import React, { useState } from 'react';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  Search,
  Send,
  ShieldCheck,
  Loader2,
  Wrench,
  BookOpen,
} from 'lucide-react';
import { SharedNavProps } from './StudentAcademicViews';
import {
  CAMPUS_SERVICES,
  LIBRARY_RESOURCES,
  NOTIFICATIONS,
  MESSAGE_THREADS,
  STUDENT_PERSONA,
  ASSETS,
} from '../data/zanzeeData';
import { apiFetch } from '../lib/api';

// ============================================================================
// 9. FINANCIAL AID & STUDENT BILLING / PAYMENTS CENTER
// ============================================================================
export const FinancialAidView: React.FC<SharedNavProps> = ({ onAskAI, onShowToast }) => {
  const [docUploaded, setDocUploaded] = useState(false);
  const [analyzingDoc, setAnalyzingDoc] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState<Record<string, string> | null>(null);
  const [balancePaid, setBalancePaid] = useState(false);

  const handleUploadProof = async () => {
    setAnalyzingDoc(true);
    try {
      const res = await apiFetch('/api/ai/analyze-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: 'KJIT_Proof_of_Enrollment_Fall2026.pdf',
          documentType: 'Proof of Enrollment (Form FA-104)',
        }),
      });
      const data = await res.json();
      setExtractedInfo(data.extractedFields);
      setDocUploaded(true);
      onShowToast('Document verified via Azure Content Understanding');
    } catch {
      setDocUploaded(true);
      onShowToast('Proof of Enrollment uploaded');
    } finally {
      setAnalyzingDoc(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-300 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-stone-500">OFFICE OF FINANCIAL AID, SCHOLARSHIPS & BURSAR</div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Financial Aid & Billing</h1>
        </div>
        <button
          type="button"
          onClick={() => onAskAI('Ask about financial aid deadlines, scholarship renewal rules, and my Proof of Enrollment.')}
          className="px-4 py-2 bg-[#1E3A8A] text-white text-xs font-medium hover:bg-blue-950 transition-colors cursor-pointer"
        >
          Ask about financial aid
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: 2026-27 Financial Aid Status & Content Understanding Upload */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-stone-300 p-4 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
              <div>
                <div className="text-xs font-mono text-stone-500">ACADEMIC YEAR 2026–2027</div>
                <h2 className="font-serif text-2xl font-bold text-stone-900">2026–27 Financial Aid</h2>
              </div>
              <div className="text-xs font-mono">
                Status:{' '}
                {docUploaded ? (
                  <span className="text-emerald-800 font-semibold">Verified · Ready to Disburse</span>
                ) : (
                  <span className="text-[#9A3412] font-semibold">Action Required</span>
                )}
              </div>
            </div>

            <div className="p-4 bg-[#FBF9F5] border border-stone-300 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-mono text-[#9A3412]">
                    IMPORTANT DEADLINE: OCTOBER 15, 2026
                  </div>
                  <div className="text-sm font-semibold text-stone-900">
                    Required document: Proof of enrollment (Form FA-104)
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Upload your signed Fall 2026 Registrar Enrollment Verification to release your $11,200 Fall semester scholarship & grant disbursement.
                  </p>
                </div>
              </div>

              {extractedInfo && (
                <div className="p-3 bg-white border border-emerald-300 text-xs space-y-1">
                  <div className="font-mono font-semibold text-emerald-900">
                    AZURE CONTENT UNDERSTANDING EXTRACTION (99.4% CONFIDENCE)
                  </div>
                  <div className="text-stone-700">
                    Student: {extractedInfo.studentName} ({extractedInfo.studentId}) · {extractedInfo.enrollmentStatus} · {extractedInfo.registrarSeal}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={analyzingDoc || docUploaded}
                  onClick={handleUploadProof}
                  className="px-4 py-2 bg-[#1E3A8A] text-white text-xs font-medium flex items-center gap-1.5 hover:bg-blue-950 transition-colors cursor-pointer disabled:opacity-60"
                >
                  {analyzingDoc ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Analyzing Document...</span>
                    </>
                  ) : docUploaded ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Proof of Enrollment Verified</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload document</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Scholarships & Grants Breakdown */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-mono text-stone-500">AWARDED SCHOLARSHIPS & GRANTS</div>
              <div className="divide-y divide-stone-200 border-t border-b border-stone-200 text-xs tabular-nums">
                <div className="py-2.5 flex flex-wrap justify-between gap-2">
                  <span className="font-medium text-stone-900">Kristu Jayanti Presidential Merit Scholarship</span>
                  <span className="font-mono font-semibold text-stone-900">$14,500.00 / yr</span>
                </div>
                <div className="py-2.5 flex flex-wrap justify-between gap-2">
                  <span className="font-medium text-stone-900">Northstar STEM Innovation Grant</span>
                  <span className="font-mono font-semibold text-stone-900">$7,900.00 / yr</span>
                </div>
                <div className="py-2.5 flex flex-wrap justify-between gap-2 bg-[#FBF9F5] px-2">
                  <span className="font-semibold text-stone-900">Total 2026–27 Aid Package</span>
                  <span className="font-mono font-bold text-[#1E3A8A]">$22,400.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Student Billing & Payments */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-stone-300 p-4 sm:p-6 space-y-4">
            <div className="border-b border-stone-200 pb-3">
              <div className="text-xs font-mono text-stone-500">STUDENT BURSAR ACCOUNT</div>
              <h2 className="font-serif text-xl font-bold text-stone-900">Tuition Balance & Invoices</h2>
            </div>

            <div className="p-4 bg-[#FBF9F5] border border-stone-300 flex items-baseline justify-between">
              <div>
                <div className="text-xs text-stone-500">Current Balance</div>
                <div className="font-mono text-2xl font-bold text-stone-900 tabular-nums">
                  {balancePaid ? '$0.00' : '$1,850.00'}
                </div>
                <div className="text-xs text-stone-600 mt-0.5">
                  Payment due date: November 1, 2026
                </div>
              </div>
              <button
                type="button"
                disabled={balancePaid}
                onClick={() => {
                  setBalancePaid(true);
                  onShowToast('Tuition payment of $1,850.00 processed via Kristu Jayanti Bursar');
                }}
                className="px-4 py-2 bg-[#1E3A8A] text-white text-xs font-medium cursor-pointer disabled:opacity-60"
              >
                {balancePaid ? 'Paid in Full ✓' : 'Pay Balance'}
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono text-stone-500">RECENT INVOICES & PAYMENT HISTORY</div>
              <div className="divide-y divide-stone-200 text-xs tabular-nums">
                <div className="py-2.5 flex flex-wrap justify-between gap-2">
                  <div>
                    <div className="font-medium text-stone-900">INV-2026-FALL · Fall Tuition & Lab Fees</div>
                    <div className="text-stone-500">Sep 1, 2026 · Scholarship Applied (-$11,200)</div>
                  </div>
                  <span className="font-mono text-stone-900">$1,850.00</span>
                </div>
                <div className="py-2.5 flex flex-wrap justify-between gap-2">
                  <div>
                    <div className="font-medium text-stone-900">INV-2026-SPR · Spring 2026 Settlement</div>
                    <div className="text-stone-500">Jan 15, 2026 · ACH Transfer</div>
                  </div>
                  <span className="font-mono text-emerald-800">Paid ($1,620.00)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 10. CAMPUS SERVICES MARKETPLACE / DIRECTORY
// ============================================================================
export const CampusServicesView: React.FC<SharedNavProps> = ({ onAskAI, onShowToast }) => {
  const [category, setCategory] = useState<string>('All');
  const categories = [
    'All',
    'Academic',
    'Technology',
    'Financial',
    'Library',
    'Career',
    'Health & Wellness',
    'Accessibility',
  ];

  const filtered = CAMPUS_SERVICES.filter(
    (s) => category === 'All' || s.category === category
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-300 pb-4">
        <div className="text-xs font-mono text-stone-500">KRISTU JAYANTI INSTITUTE OF TECHNOLOGY DIRECTORY</div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Campus Services</h1>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium border cursor-pointer whitespace-nowrap ${
              category === cat
                ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((srv) => (
          <div
            key={srv.id}
            className="bg-white border border-stone-300 p-4 sm:p-6 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="text-xs font-mono text-[#1E3A8A]">{srv.category.toUpperCase()}</div>
              <h2 className="font-serif text-xl font-bold text-stone-900">{srv.title}</h2>
              <p className="text-xs text-stone-700 leading-relaxed">{srv.description}</p>
              <div className="pt-2 border-t border-stone-200 text-xs text-stone-600 space-y-1">
                <div>Hours: <span className="font-medium text-stone-900">{srv.hours}</span></div>
                <div>Location: <span className="font-medium text-stone-900">{srv.location}</span></div>
                <div>Contact: <span className="font-mono text-stone-800">{srv.contact}</span></div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => onAskAI(srv.aiPrompt)}
                className="px-4 py-2 bg-[#1E3A8A] text-white text-xs font-medium hover:bg-blue-950 transition-colors cursor-pointer"
              >
                AI Assistance
              </button>
              <button
                type="button"
                onClick={() => onShowToast(`Booked appointment with ${srv.title}`)}
                className="px-4 py-2 bg-[#FBF9F5] border border-stone-300 text-stone-800 text-xs font-medium hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Schedule Visit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 11. IT SUPPORT & AI TROUBLESHOOTING FLOW
// ============================================================================
export const ITSupportView: React.FC<SharedNavProps> = ({ onShowToast }) => {
  const [issueQuery, setIssueQuery] = useState('');
  const [activeIssue, setActiveIssue] = useState<string>('Wi-Fi isn’t working');
  const [step, setStep] = useState<'identify' | 'suggest' | 'resolved' | 'ticket_created'>('suggest');
  const [tickets, setTickets] = useState([
    {
      id: 'IT-9042',
      subject: 'KJIT-Secure 802.1X RADIUS Certificate Renewal',
      status: 'Open · Assigned to Tier 2 Network Ops',
      created: 'Today',
    },
  ]);

  const solutions: Record<string, { diagnosis: string; steps: string[] }> = {
    'Reset password': {
      diagnosis: 'Kristu Jayanti Active Directory & Okta SSO Password Synchronization',
      steps: [
        'Verify your identity via Okta Verify Push or hardware YubiKey.',
        'Set a 14+ character passphrase at id.kjit.edu.in/reset.',
        'Wait 90 seconds for Kerberos token propagation across LMS and eduroam.',
      ],
    },
    'Wi-Fi isn’t working': {
      diagnosis: 'October 2026 RADIUS Certificate Rotation on KJIT-Secure',
      steps: [
        'Open Wireless Network Preferences and select "Forget This Network" for KJIT-Secure.',
        'Reconnect using your full university email (ppimplapure@kjit.edu.in).',
        'Accept the new auth.kjit.edu.in Root CA certificate when prompted.',
      ],
    },
    VPN: {
      diagnosis: 'Kristu Jayanti Split-Tunnel WireGuard / Cisco AnyConnect Gateway',
      steps: [
        'Connect to vpn.kjit.edu.in using profile "2-Campus-Research-Split".',
        'Approve the MFA push notification on your registered mobile device.',
      ],
    },
    'Software access': {
      diagnosis: 'Kristu Jayanti Foundry GPU Cluster & JetBrains / MATLAB Academic License',
      steps: [
        'Sign in with University SSO at software.kjit.edu.in.',
        'Claim your automatic student seat token for Fall 2026.',
      ],
    },
    'Email problem': {
      diagnosis: 'Exchange / KJIT Mail IMAP & OAuth2 Token Refresh',
      steps: [
        'Remove legacy Basic Auth profile and re-authenticate using Modern OAuth2 SSO.',
      ],
    },
    'MFA problem': {
      diagnosis: 'Okta MFA Hardware Token / SMS Fallback Resync',
      steps: [
        'Generate a temporary 24-hour bypass code via Campus ID Card scan at Turing Hall.',
      ],
    },
  };

  const currentSol = solutions[activeIssue] || solutions['Wi-Fi isn’t working'];

  const handleCreateTicket = () => {
    const newId = `IT-${Math.floor(9100 + Math.random() * 800)}`;
    setTickets((prev) => [
      {
        id: newId,
        subject: issueQuery.trim() || `${activeIssue} — Escalated from AI Diagnostics`,
        status: 'Escalated · Live Technician Notified',
        created: 'Just now',
      },
      ...prev,
    ]);
    setStep('ticket_created');
    onShowToast(`Created IT Support Ticket #${newId}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-stone-300 p-4 sm:p-6 space-y-4">
        <div className="text-xs font-mono text-[#1E3A8A]">KRISTU JAYANTI ENTERPRISE IT HELP DESK</div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">How can we help?</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!issueQuery.trim()) return;
            setActiveIssue(issueQuery);
            setStep('suggest');
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <input
            type="text"
            value={issueQuery}
            onChange={(e) => setIssueQuery(e.target.value)}
            placeholder="Describe your technical problem…"
            className="min-w-0 flex-1 px-4 py-2.5 text-sm bg-[#FBF9F5] border border-stone-300 focus:border-[#1E3A8A] focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 px-5 py-2.5 bg-[#1E3A8A] text-white text-xs font-medium cursor-pointer"
          >
            Diagnose Issue
          </button>
        </form>

        <div className="space-y-1.5">
          <div className="text-xs font-mono text-stone-500">QUICK ISSUES</div>
          <div className="flex flex-wrap gap-2">
            {['Reset password', 'Wi-Fi isn’t working', 'VPN', 'Software access', 'Email problem', 'MFA problem'].map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setActiveIssue(item);
                    setStep('suggest');
                  }}
                  className={`px-3 py-1.5 text-xs font-medium border cursor-pointer ${
                    activeIssue === item
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                      : 'bg-[#FBF9F5] text-stone-800 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* AI Troubleshooting Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-stone-300 p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <div className="text-xs font-mono text-stone-500">AI TROUBLESHOOTING WORKFLOW</div>
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Issue: {activeIssue}
              </h2>
            </div>
            <span className="text-xs font-mono text-[#1E3A8A]">
              Step: {step === 'resolved' ? 'Resolved' : step === 'ticket_created' ? 'Escalated' : 'Solution Suggested'}
            </span>
          </div>

          <div className="p-4 bg-[#FBF9F5] border border-stone-300 space-y-3">
            <div className="text-xs font-semibold text-stone-900">
              Root Cause Identified: {currentSol.diagnosis}
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-stone-700">
              {currentSol.steps.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ol>
          </div>

          {step === 'resolved' ? (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-xs text-emerald-900">
              Glad we could resolve your issue! This diagnostic log has been saved to your profile.
            </div>
          ) : step === 'ticket_created' ? (
            <div className="p-3 bg-blue-50 border border-blue-300 text-xs text-[#1E3A8A]">
              Your issue has been escalated to Kristu Jayanti IT Support. A systems engineer will respond in Messages.
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setStep('resolved');
                onShowToast('Marked technical issue as resolved');
              }}
              className="px-4 py-2 bg-emerald-800 text-white text-xs font-medium cursor-pointer"
            >
              Confirm Resolution (Fixed)
            </button>
            <button
              type="button"
              onClick={handleCreateTicket}
              className="px-4 py-2 bg-[#9A3412] text-white text-xs font-medium cursor-pointer"
            >
              Connect with IT Support · Create Ticket
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-stone-300 p-4 sm:p-6 space-y-3">
          <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-200 pb-2">
            Active IT Tickets
          </h3>
          <div className="divide-y divide-stone-200 text-xs">
            {tickets.map((t) => (
              <div key={t.id} className="py-3 space-y-1">
                <div className="font-mono font-semibold text-[#1E3A8A]">{t.id} · {t.created}</div>
                <div className="font-medium text-stone-900">{t.subject}</div>
                <div className="text-stone-600">{t.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 12. DIGITAL LIBRARY & AI RESEARCH ASSISTANT
// ============================================================================
export const LibraryView: React.FC<SharedNavProps> = ({ onAskAI, onShowToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Books' | 'Articles' | 'Journals' | 'Databases'>('All');
  const [researchPrompt, setResearchPrompt] = useState('');

  const filtered = LIBRARY_RESOURCES.filter((item) => {
    const matchesType = filterType === 'All' || item.type === filterType;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authors.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white border border-stone-300 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 p-4 sm:p-6 space-y-4">
          <div className="text-xs font-mono text-[#1E3A8A]">
            KRISTU JAYANTI ARCHIVAL LIBRARY & SPECIAL COLLECTIONS
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Digital Library & Citations
          </h1>
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books, journals, research papers…"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FBF9F5] border border-stone-300 focus:border-[#1E3A8A] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(['All', 'Books', 'Articles', 'Journals', 'Databases'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 text-xs font-medium border cursor-pointer ${
                  filterType === t
                    ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                    : 'bg-[#FBF9F5] text-stone-800 border-stone-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-stone-300 relative min-h-[200px]">
          <img
            src={ASSETS.libraryRoom}
            alt="Kristu Jayanti Central Reading Room"
            referrerPolicy="no-referrer"
            className="w-full h-48 lg:h-full lg:absolute lg:inset-0 object-cover"
          />
        </div>
      </div>

      {/* AI Research Assistant Bar */}
      <div className="bg-white border border-stone-300 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="text-xs font-mono text-[#1E3A8A]">AI RESEARCH & CITATION ASSISTANT</div>
          <div className="text-sm font-semibold text-stone-900">
            Need peer-reviewed sources for CS 201 or ENG 105?
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!researchPrompt.trim()) return;
            onAskAI(`Help me research: ${researchPrompt} and provide APA/IEEE citations from Kristu Jayanti Library.`);
          }}
          className="flex flex-col min-[420px]:flex-row gap-2 w-full sm:w-auto"
        >
          <input
            type="text"
            value={researchPrompt}
            onChange={(e) => setResearchPrompt(e.target.value)}
            placeholder="Help me research…"
            className="min-w-0 flex-1 sm:w-72 px-3.5 py-2 text-xs bg-[#FBF9F5] border border-stone-300"
          />
          <button
            type="submit"
            className="shrink-0 px-4 py-2 bg-[#1E3A8A] text-white text-xs font-medium cursor-pointer whitespace-nowrap"
          >
            Research with AI
          </button>
        </form>
      </div>

      {/* Catalog Results */}
      <div className="space-y-4">
        {filtered.map((res) => (
          <div key={res.id} className="bg-white border border-stone-300 p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-stone-500">
              <span>{res.type.toUpperCase()} · CALL NO: {res.callNumber} · {res.year}</span>
              <span className="text-emerald-800">Full-Text Available</span>
            </div>
            <h2 className="font-serif text-xl font-bold text-stone-900">{res.title}</h2>
            <div className="text-xs text-stone-600">{res.authors}</div>
            <p className="text-xs text-stone-700 leading-relaxed">{res.abstract}</p>
            <div className="p-3 bg-[#FBF9F5] border border-stone-200 text-xs font-mono text-stone-700">
              Citation: {res.citation}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(res.citation);
                  onShowToast('Copied formatted citation to clipboard');
                }}
                className="px-3 py-1.5 bg-[#1E3A8A] text-white text-xs font-medium cursor-pointer"
              >
                Copy Citation
              </button>
              <button
                type="button"
                onClick={() => onAskAI(`Summarize "${res.title}" by ${res.authors} for my coursework.`)}
                className="px-3 py-1.5 border border-stone-300 text-stone-800 text-xs font-medium cursor-pointer"
              >
                Ask AI to Summarize
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 13. MESSAGES & MULTI-CHANNEL COMMUNICATION CENTER
// ============================================================================
export const MessagesView: React.FC<SharedNavProps> = ({ onShowToast }) => {
  const [threads, setThreads] = useState(MESSAGE_THREADS);
  const [selectedId, setSelectedId] = useState(MESSAGE_THREADS[0].id);
  const [draft, setDraft] = useState('');

  const activeThread = threads.find((t) => t.id === selectedId) || threads[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              lastUpdated: 'Just now',
              messages: [
                ...t.messages,
                {
                  id: `m-${Date.now()}`,
                  sender: 'Parth Pimplapure',
                  time: 'Just now',
                  body: draft.trim(),
                },
              ],
            }
          : t
      )
    );
    setDraft('');
    onShowToast(`Message sent to ${activeThread.correspondent}`);
  };

  return (
    <div className="bg-white border border-stone-300 grid grid-cols-1 lg:grid-cols-12 min-h-[500px] sm:min-h-[620px]">
      <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-stone-300 bg-[#FBF9F5] p-4 space-y-3">
        <div className="border-b border-stone-300 pb-3">
          <div className="text-xs font-mono text-stone-500">COMMUNICATION CENTER</div>
          <h1 className="font-serif text-xl font-bold text-stone-900">Messages</h1>
        </div>
        <div className="space-y-1">
          {threads.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedId(t.id)}
              className={`w-full text-left p-3 border transition-colors cursor-pointer ${
                selectedId === t.id
                  ? 'bg-white border-stone-400'
                  : 'border-transparent hover:bg-white'
              }`}
            >
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-stone-900">{t.correspondent}</span>
                <span className="font-mono text-stone-500">{t.lastUpdated}</span>
              </div>
              <div className="text-[11px] text-stone-600">{t.role} · {t.department}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-8 flex flex-col justify-between p-4 sm:p-6">
        <div className="space-y-4">
          <div className="border-b border-stone-200 pb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900">
                {activeThread.correspondent}
              </h2>
              <div className="text-xs text-stone-600">
                {activeThread.role} · {activeThread.channelSync}
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-800">
              Conversation synchronized across channels
            </span>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {activeThread.messages.map((m) => (
              <div
                key={m.id}
                className={`p-4 border text-xs leading-relaxed ${
                  m.sender === 'Parth Pimplapure'
                    ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] ml-auto max-w-lg'
                    : 'bg-[#FBF9F5] text-stone-900 border-stone-300 max-w-xl'
                }`}
              >
                <div className="font-mono text-[11px] opacity-75 mb-1">
                  {m.sender} · {m.time}
                </div>
                <div>{m.body}</div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSendMessage} className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Write a message to ${activeThread.correspondent}…`}
            className="min-w-0 flex-1 px-3.5 py-2.5 text-xs bg-[#FBF9F5] border border-stone-300"
          />
          <button
            type="submit"
            className="shrink-0 px-5 py-2.5 bg-[#1E3A8A] text-white text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// 14. NOTIFICATIONS CENTER & PROFILE / PRIVACY / ACCESSIBILITY SETTINGS
// ============================================================================
export const NotificationsAndSettingsView: React.FC<
  SharedNavProps & { mode: 'notifications' | 'profile' }
> = ({ mode, onNavigate, onShowToast }) => {
  const [notifCategory, setNotifCategory] = useState<'All' | 'Academic' | 'Financial' | 'Campus' | 'System'>('All');
  const [saveHistory, setSaveHistory] = useState(true);
  const [personalizeAI, setPersonalizeAI] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  if (mode === 'notifications') {
    const list = NOTIFICATIONS.filter(
      (n) => notifCategory === 'All' || n.category === notifCategory
    );
    return (
      <div className="space-y-6">
        <div className="border-b border-stone-300 pb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-stone-500">CAMPUS DISPATCH ALERTS</div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Notifications</h1>
          </div>
          <div className="flex gap-1 p-1 bg-stone-200/70 border border-stone-300 max-w-full overflow-x-auto">
            {(['All', 'Academic', 'Financial', 'Campus', 'System'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setNotifCategory(c)}
                className={`px-3 py-1 text-xs font-medium cursor-pointer ${
                  notifCategory === c ? 'bg-white text-stone-900' : 'text-stone-600'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {list.map((n) => (
            <div
              key={n.id}
              className="bg-white border border-stone-300 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="text-xs font-mono text-stone-500">
                  {n.category.toUpperCase()} · {n.timestamp}
                </div>
                <h2 className="font-serif text-lg font-bold text-stone-900">{n.title}</h2>
                <p className="text-xs text-stone-600">{n.detail}</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate(n.targetView)}
                className="px-3.5 py-2 bg-[#1E3A8A] text-white text-xs font-medium cursor-pointer whitespace-nowrap self-start sm:self-center"
              >
                Open Details
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-300 pb-4">
        <div className="text-xs font-mono text-stone-500">STUDENT IDENTITY, PRIVACY & ACCESSIBILITY</div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Profile, Security & Privacy Center
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white border border-stone-300 p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div
              aria-label="Parth Pimplapure — 26MCAD30 · MCA Division D"
              className="w-16 h-16 flex items-center justify-center bg-[#1E3A8A] text-white text-xl font-bold border border-stone-300 shrink-0"
            >
              PP
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900">{STUDENT_PERSONA.name}</h2>
              <div className="text-xs text-stone-600">{STUDENT_PERSONA.program}</div>
              <div className="text-xs font-mono text-stone-500">{STUDENT_PERSONA.email} · ID {STUDENT_PERSONA.id}</div>
            </div>
          </div>
          <div className="pt-3 border-t border-stone-200 text-xs space-y-1.5 text-stone-700">
            <div>Institution: <span className="font-medium text-stone-900">{STUDENT_PERSONA.college}</span></div>
            <div>Academic Advisor: <span className="font-medium text-stone-900">{STUDENT_PERSONA.advisor}</span></div>
            <div>Security Status: <span className="font-medium text-emerald-800">University Verified · SAML 2.0 Encrypted</span></div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white border border-stone-300 p-4 sm:p-6 space-y-4">
          <h3 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-200 pb-2">
            FERPA Data Controls & WCAG 2.2 AA Accessibility
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between gap-4 py-2 border-b border-stone-200 cursor-pointer">
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-stone-900">Synchronize Multi-Channel Conversation History</div>
                <div className="text-stone-600">Retain AI context across Web Chat, SMS, Email, and Mobile App</div>
              </div>
              <input
                type="checkbox"
                checked={saveHistory}
                onChange={(e) => {
                  setSaveHistory(e.target.checked);
                  onShowToast('Updated conversation history preference');
                }}
                className="accent-[#1E3A8A] w-5 h-5 shrink-0"
              />
            </label>

            <label className="flex items-center justify-between gap-4 py-2 border-b border-stone-200 cursor-pointer">
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-stone-900">Academic Degree Audit Personalization</div>
                <div className="text-stone-600">Allow CampusAI to use enrolled courses & grades for Socratic tutoring</div>
              </div>
              <input
                type="checkbox"
                checked={personalizeAI}
                onChange={(e) => {
                  setPersonalizeAI(e.target.checked);
                  onShowToast('Updated AI personalization setting');
                }}
                className="accent-[#1E3A8A] w-5 h-5 shrink-0"
              />
            </label>

            <label className="flex items-center justify-between gap-4 py-2 cursor-pointer">
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-stone-900">Enhanced Contrast & Screen Reader Annotations (WCAG 2.2 AA)</div>
                <div className="text-stone-600">Enforce high-contrast editorial borders and ARIA live announcements</div>
              </div>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => {
                  setHighContrast(e.target.checked);
                  onShowToast('Updated accessibility mode');
                }}
                className="accent-[#1E3A8A] w-5 h-5 shrink-0"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
