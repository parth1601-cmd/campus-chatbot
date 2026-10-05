import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Building,
  Phone,
  Mail,
  Award,
  Users,
  Compass,
} from 'lucide-react';
import { ViewId } from '../types';
import { KJIT_ADMISSION_DATA } from '../data/zanzeeData';
import { KJIT_FACULTY } from '../data/kjitFacultyData';
import { KJCLogo } from './KJCLogo';

interface AdmissionsViewProps {
  onNavigate: (view: ViewId, payload?: string) => void;
  onAskAI: (prompt: string) => void;
  onShowToast: (msg: string) => void;
}

export const AdmissionsView: React.FC<AdmissionsViewProps> = ({
  onNavigate,
  onAskAI,
  onShowToast,
}) => {
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<'mca' | 'msc-ds' | 'msc-cs'>('mca');

  const selectedProgramme =
    KJIT_ADMISSION_DATA.programmes.find((p) => p.id === selectedProgrammeId) ||
    KJIT_ADMISSION_DATA.programmes[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ================================================================
          EDITORIAL HEADER / MASTHEAD
         ================================================================ */}
      <header className="border-b-4 border-[#141210] pb-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <KJCLogo variant="emblem" size="md" />
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-[#1E3A8A] font-bold">
                POSTGRADUATE DEPARTMENT OF COMPUTER SCIENCE
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
                Institute of Technology Admission
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <a
              href={KJIT_ADMISSION_DATA.contact.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 min-h-[40px] inline-flex items-center bg-[#141210] hover:bg-[#1E3A8A] text-white text-xs font-mono font-bold uppercase tracking-wider gap-1.5 border border-[#141210] shadow-[2px_2px_0px_#141210] transition-colors cursor-pointer"
            >
              <span>Official Admission Portal</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>
        </div>

        <div className="p-3 bg-[#EAE2D3] border border-[#141210] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-stone-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-bold">ADMISSIONS 2026–27 BATCH:</span>
            <span>Enroll now for Postgraduate programmes in MCA, Data Science, and Cyber Security.</span>
          </div>
          <span className="font-semibold text-[#1E3A8A]">Deemed to be University · Bengaluru</span>
        </div>
      </header>

      {/* ================================================================
          PROGRAMME SELECTOR TABS
         ================================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {KJIT_ADMISSION_DATA.programmes.map((prog) => {
          const isSelected = prog.id === selectedProgrammeId;
          return (
            <button
              key={prog.id}
              type="button"
              onClick={() => setSelectedProgrammeId(prog.id as any)}
              className={`p-4 border-2 text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#141210] bg-white shadow-[4px_4px_0px_#141210]'
                  : 'border-stone-300 bg-[#FAF8F5] hover:bg-white hover:border-stone-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-[#1E3A8A] text-white">
                  {prog.code}
                </span>
                <span className="text-[11px] font-mono text-stone-600">{prog.duration}</span>
              </div>
              <h3 className="font-serif text-base font-bold text-stone-950 mb-1">
                {prog.title}
              </h3>
              <div className="text-xs text-stone-600 font-mono">
                Academic Fee: {prog.academicFeeYear1} / Year
              </div>
            </button>
          );
        })}
      </div>

      {/* ================================================================
          SELECTED PROGRAMME DETAILED CARD
         ================================================================ */}
      <div className="p-4 sm:p-6 bg-white border-2 border-[#141210] shadow-[4px_4px_0px_#141210] space-y-6 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-300 pb-4">
          <div>
            <div className="inline-block px-2 py-0.5 bg-amber-100 border border-amber-800 text-amber-950 text-xs font-mono font-bold uppercase mb-2">
              {selectedProgramme.status}
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-950">
              {selectedProgramme.title} ({selectedProgramme.code})
            </h2>
            <div className="text-xs font-mono text-stone-600 mt-1">
              Department: {KJIT_ADMISSION_DATA.headOfDepartment.department} · {KJIT_ADMISSION_DATA.headOfDepartment.name}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onAskAI(`What are the eligibility requirements and fees for ${selectedProgramme.title}?`)}
              className="px-3 py-2 bg-[#F5F0E6] hover:bg-white text-stone-900 border border-[#141210] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-[1px_1px_0px_#141210]"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>Ask AI About {selectedProgramme.code}</span>
            </button>
            <a
              href={KJIT_ADMISSION_DATA.contact.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#1E3A8A] hover:bg-[#141210] text-white border border-[#141210] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-[1px_1px_0px_#141210]"
            >
              <span>Apply Online</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-base">
            <GraduationCap className="w-5 h-5 text-[#1E3A8A]" />
            <span>Eligibility Criteria</span>
          </div>
          <p className="text-sm leading-relaxed text-stone-800 pl-7">
            {selectedProgramme.eligibility}
          </p>

          <div className="ml-7 p-3 bg-amber-50/70 border border-amber-300 text-xs text-amber-950 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Bridge Course Requirement: </span>
              <span>{selectedProgramme.bridgeCourseNote}</span>
            </div>
          </div>
        </div>

        {/* Academic Fee Breakdown Table */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-base">
            <DollarSign className="w-5 h-5 text-[#1E3A8A]" />
            <span>Fee Structure (2026 Batch)</span>
          </div>

          <div className="overflow-x-auto ml-0 sm:ml-7 -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[560px] text-left border-collapse border border-stone-300 text-xs">
              <thead>
                <tr className="bg-[#EAE2D3] border-b border-stone-400 font-mono font-bold">
                  <th className="p-3 border-r border-stone-300">Year</th>
                  <th className="p-3 border-r border-stone-300">Academic Fee</th>
                  <th className="p-3 border-r border-stone-300">Admission Registration Fee</th>
                  <th className="p-3">Application Processing Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-mono">
                <tr>
                  <td className="p-3 font-bold border-r border-stone-300">I Year</td>
                  <td className="p-3 font-bold text-[#1E3A8A] border-r border-stone-300">{selectedProgramme.academicFeeYear1}</td>
                  <td className="p-3 border-r border-stone-300" rowSpan={2}>
                    {selectedProgramme.registrationFee}
                  </td>
                  <td className="p-3" rowSpan={2}>
                    {selectedProgramme.applicationProcessingFee}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold border-r border-stone-300">II Year</td>
                  <td className="p-3 font-bold text-[#1E3A8A] border-r border-stone-300">{selectedProgramme.academicFeeYear2}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Programme Highlights */}
        <div className="space-y-2 ml-0 sm:ml-7">
          <div className="text-xs font-mono font-bold uppercase text-stone-700">Key Focus Areas:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selectedProgramme.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-stone-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================================
          ADDITIONAL INSTITUTIONAL FEES SCHEDULE
         ================================================================ */}
      <div className="p-4 sm:p-6 bg-[#FAF8F5] border-2 border-[#141210] space-y-4 min-w-0">
        <div className="flex items-center justify-between border-b border-stone-300 pb-2">
          <div className="flex items-center gap-2 font-serif font-bold text-lg text-stone-950">
            <Building className="w-5 h-5 text-[#1E3A8A]" />
            <span>Other Fees Involved for PG Programmes (First Year Only)</span>
          </div>
          <span className="text-xs font-mono text-stone-500">Official KJIT Schedule</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left border-collapse border border-stone-300 text-xs">
            <thead>
              <tr className="bg-[#EAE2D3] border-b border-stone-400 font-mono font-bold">
                <th className="p-2.5 border-r border-stone-300">Candidate Category</th>
                <th className="p-2.5">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 font-mono">
              {KJIT_ADMISSION_DATA.categoryOtherFees.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF8F5]'}>
                  <td className="p-2.5 border-r border-stone-300 font-sans">{row.category}</td>
                  <td className="p-2.5 font-bold text-stone-950">{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Strict Policy Statement */}
        <div className="p-3 bg-red-50 border border-red-300 text-xs text-red-950 font-sans flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">University Capitation Fee Policy: </span>
            <span>{KJIT_ADMISSION_DATA.antiCapitationPolicy}</span>
          </div>
        </div>

        {/* Payment Modes */}
        <div className="space-y-1.5 pt-2">
          <div className="text-xs font-mono font-bold uppercase text-stone-800">Mode of Fee Payment:</div>
          <ul className="text-xs text-stone-700 list-disc list-inside space-y-1 font-mono">
            {KJIT_ADMISSION_DATA.paymentModes.map((m, idx) => (
              <li key={idx}>{m}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* ================================================================
          WHY INSTITUTE OF TECHNOLOGY AT KRISTU JAYANTI
         ================================================================ */}
      <div className="p-4 sm:p-6 bg-white border-2 border-[#141210] shadow-[3px_3px_0px_#141210] space-y-4 min-w-0">
        <h3 className="font-serif text-xl font-bold text-stone-950 border-b border-stone-300 pb-2 flex items-center gap-2">
          <Award className="w-5 h-5 text-[#1E3A8A]" />
          <span>Why Institute of Technology at Kristu Jayanti University?</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {KJIT_ADMISSION_DATA.whyInstituteOfTechnology.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-2 bg-[#FAF8F5] border border-stone-200">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A8A] mt-2 shrink-0" />
              <span className="text-xs text-stone-800 leading-snug">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ================================================================
          STUDENT TESTIMONIALS
         ================================================================ */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 font-serif font-bold text-lg text-stone-950">
          <Users className="w-5 h-5 text-[#1E3A8A]" />
          <span>Student Testimonials (Present Students)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {KJIT_ADMISSION_DATA.studentTestimonials.map((t, idx) => (
            <div key={idx} className="p-4 bg-[#FAF8F5] border border-stone-300 space-y-3 flex flex-col justify-between">
              <p className="text-xs text-stone-700 italic leading-relaxed">
                "{t.quote}"
              </p>
              <div className="border-t border-stone-200 pt-2 font-mono text-[11px]">
                <div className="font-bold text-stone-950">{t.name}</div>
                <div className="text-stone-500">{t.regNo} · {t.programme}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================================================================
          DISTINGUISHED FACULTY & MENTORS SHOWCASE
         ================================================================ */}
      <div className="p-4 sm:p-6 bg-white border-2 border-[#141210] shadow-[3px_3px_0px_#141210] space-y-4 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-300 pb-2">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-950 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#1E3A8A]" />
              <span>Distinguished Faculty & Industry Mentors</span>
            </h3>
            <p className="text-xs text-stone-600 font-mono mt-0.5">
              {KJIT_FACULTY.length} Core Professors & Professors of Practice from Accenture, Akamai, Verticurl, and Kaushalya Tech
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('faculty-directory')}
            className="px-4 py-2 bg-[#1E3A8A] hover:bg-[#141210] text-white text-xs font-mono font-bold uppercase transition-colors cursor-pointer shadow-[2px_2px_0px_#141210]"
          >
            View All {KJIT_FACULTY.length} Faculty Profiles →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div className="p-3 bg-[#FAF8F5] border border-stone-300 flex items-center gap-3">
            <img
              src="https://d2di5o2d0ilx7p.cloudfront.net/institute-of-technology/faculty-profile/R%20Kumar.jpg"
              alt="Dr. R. Kumar"
              className="w-14 h-14 object-cover object-top rounded border border-stone-400 shrink-0"
            />
            <div className="min-w-0">
              <div className="font-serif font-bold text-sm text-stone-950 truncate">Dr. R. Kumar</div>
              <div className="text-[11px] text-[#1E3A8A] font-medium leading-tight">Dean, School of Computational Sciences</div>
              <div className="text-[10px] text-stone-500 font-mono">32 Years Exp · Data Mining</div>
            </div>
          </div>

          <div className="p-3 bg-[#FAF8F5] border border-stone-300 flex items-center gap-3">
            <img
              src="https://d2di5o2d0ilx7p.cloudfront.net/institute-of-technology/faculty-profile/Muruganantham.jpg"
              alt="Dr. Muruganantham A"
              className="w-14 h-14 object-cover object-top rounded border border-stone-400 shrink-0"
            />
            <div className="min-w-0">
              <div className="font-serif font-bold text-sm text-stone-950 truncate">Dr. Muruganantham A</div>
              <div className="text-[11px] text-[#1E3A8A] font-medium leading-tight">Head, Dept. of Computer Science (PG)</div>
              <div className="text-[10px] text-stone-500 font-mono">29 Years Exp · Web Mining & Java</div>
            </div>
          </div>

          <div className="p-3 bg-[#FAF8F5] border border-stone-300 flex items-center gap-3">
            <img
              src="https://d2di5o2d0ilx7p.cloudfront.net/institute-of-technology/faculty-profile/Velmurugan.jpg"
              alt="Dr. Velmurugan R"
              className="w-14 h-14 object-cover object-top rounded border border-stone-400 shrink-0"
            />
            <div className="min-w-0">
              <div className="font-serif font-bold text-sm text-stone-950 truncate">Dr. Velmurugan R</div>
              <div className="text-[11px] text-[#1E3A8A] font-medium leading-tight">Coordinator, PG Computer Science</div>
              <div className="text-[10px] text-stone-500 font-mono">26 Years Exp · M.Sc., Ph.D.</div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================
          CONTACT & ENQUIRIES FOOTER
         ================================================================ */}
      <footer className="p-4 sm:p-6 bg-[#141210] text-stone-200 border-2 border-[#141210] space-y-4 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="font-serif text-lg font-bold text-white">
              Kristu Jayanti Institute of Technology Admissions Desk
            </h4>
            <p className="text-xs text-stone-400 mt-0.5">
              {KJIT_ADMISSION_DATA.location}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onAskAI('How can I contact Kristu Jayanti admissions office?')}
              className="px-4 py-2 bg-[#1E3A8A] hover:bg-blue-800 text-white text-xs font-mono font-bold uppercase transition-colors cursor-pointer"
            >
              Ask AI Assistant
            </button>
            <a
              href={`tel:${KJIT_ADMISSION_DATA.contact.phone}`}
              className="px-4 py-2 bg-white text-stone-950 hover:bg-stone-200 text-xs font-mono font-bold uppercase transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{KJIT_ADMISSION_DATA.contact.phone}</span>
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-stone-400 border-t border-stone-800 pt-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <Mail className="w-3.5 h-3.5 text-stone-300 shrink-0" />
            <span className="break-all">{KJIT_ADMISSION_DATA.contact.admissionEmail}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-stone-300" />
            <span>Fax: {KJIT_ADMISSION_DATA.contact.fax}</span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-300">
            <span>Run by {KJIT_ADMISSION_DATA.founder}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
