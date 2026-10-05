import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  Search,
  BookOpen,
  GraduationCap,
  Award,
  Briefcase,
  ExternalLink,
  MessageSquare,
  Building,
  Sparkles,
  User,
  Filter,
} from 'lucide-react';
import { ViewId } from '../types';
import { KJIT_FACULTY, FacultyMember, getStoredFaculty } from '../data/kjitFacultyData';
import { KJCLogo } from './KJCLogo';

interface FacultyDirectoryViewProps {
  onNavigate: (view: ViewId, payload?: string) => void;
  onAskAI: (prompt: string) => void;
  onShowToast: (msg: string) => void;
}

export const FacultyDirectoryView: React.FC<FacultyDirectoryViewProps> = ({
  onNavigate,
  onAskAI,
  onShowToast,
}) => {
  const [facultyList, setFacultyList] = useState<FacultyMember[]>(getStoredFaculty);

  useEffect(() => {
    const handleFacultyUpdate = () => {
      setFacultyList(getStoredFaculty());
    };
    window.addEventListener('kjit_faculty_updated', handleFacultyUpdate);
    return () => window.removeEventListener('kjit_faculty_updated', handleFacultyUpdate);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'core' | 'leadership' | 'practice'>('all');

  const filteredFaculty = useMemo(() => {
    return facultyList.filter((f) => {
      // Filter tab
      if (filterType === 'core' && f.profileType !== 'core_faculty') return false;
      if (filterType === 'practice' && f.profileType !== 'professor_of_practice') return false;
      if (filterType === 'leadership') {
        const isLeader =
          f.designation.toLowerCase().includes('dean') ||
          f.designation.toLowerCase().includes('head') ||
          f.designation.toLowerCase().includes('coordinator');
        if (!isLeader) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = f.name.toLowerCase().includes(q);
        const matchesDesig = f.designation.toLowerCase().includes(q);
        const matchesSpec = f.specialization.toLowerCase().includes(q);
        const matchesQual = f.qualification.toLowerCase().includes(q);
        const matchesCompany = (f.company || '').toLowerCase().includes(q);
        const matchesTopic = (f.topic || '').toLowerCase().includes(q);
        return matchesName || matchesDesig || matchesSpec || matchesQual || matchesCompany || matchesTopic;
      }

      return true;
    });
  }, [facultyList, searchQuery, filterType]);

  const coreCount = facultyList.filter((f) => f.profileType === 'core_faculty').length;
  const practiceCount = facultyList.filter((f) => f.profileType === 'professor_of_practice').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ================================================================
          EDITORIAL HEADER
         ================================================================ */}
      <header className="border-b-4 border-[#141210] pb-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <KJCLogo variant="emblem" size="md" />
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-[#1E3A8A] font-bold">
                KRISTU JAYANTI INSTITUTE OF TECHNOLOGY
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 tracking-tight">
                Faculty Directory & Mentors
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('admissions')}
              className="px-3.5 py-2 bg-white hover:bg-stone-100 text-stone-900 text-xs font-mono font-bold uppercase tracking-wider border border-[#141210] transition-colors cursor-pointer shadow-[2px_2px_0px_#141210]"
            >
              Admissions 2026 →
            </button>
            <button
              type="button"
              onClick={() => onAskAI('Who are the prominent computer science professors and researchers at Kristu Jayanti Institute of Technology?')}
              className="px-4 py-2 bg-[#141210] hover:bg-[#1E3A8A] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border border-[#141210] shadow-[2px_2px_0px_#141210] transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask AI About Faculty</span>
            </button>
          </div>
        </div>

        {/* Informational Banner */}
        <div className="p-3 bg-[#EAE2D3] border border-[#141210] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-stone-800">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#1E3A8A]" />
            <span className="font-bold">POSTGRADUATE DEPARTMENT OF COMPUTER SCIENCE:</span>
            <span>{facultyList.length} Distinguished Professors, Researchers, and Industry Leaders guiding MCA & M.Sc programmes.</span>
          </div>
          <span className="font-semibold text-stone-900">MCA · M.Sc Data Science · M.Sc Cyber Security</span>
        </div>
      </header>

      {/* ================================================================
          CONTROLS: SEARCH & TABS
         ================================================================ */}
      <div className="bg-white p-4 border-2 border-[#141210] shadow-[3px_3px_0px_#141210] space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search faculty by name, specialization, or company..."
              className="w-full pl-9 pr-4 py-2 text-xs font-mono bg-[#FAF8F5] border border-stone-400 focus:outline-none focus:border-[#1E3A8A] focus:bg-white"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer border ${
                filterType === 'all'
                  ? 'bg-[#141210] text-white border-[#141210]'
                  : 'bg-[#FAF8F5] text-stone-700 border-stone-300 hover:bg-stone-200'
              }`}
            >
              All ({facultyList.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('core')}
              className={`px-3 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer border ${
                filterType === 'core'
                  ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                  : 'bg-[#FAF8F5] text-stone-700 border-stone-300 hover:bg-stone-200'
              }`}
            >
              Core PG Faculty ({coreCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('leadership')}
              className={`px-3 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer border ${
                filterType === 'leadership'
                  ? 'bg-[#141210] text-white border-[#141210]'
                  : 'bg-[#FAF8F5] text-stone-700 border-stone-300 hover:bg-stone-200'
              }`}
            >
              Leadership & Deans
            </button>
            <button
              type="button"
              onClick={() => setFilterType('practice')}
              className={`px-3 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer border ${
                filterType === 'practice'
                  ? 'bg-amber-800 text-white border-amber-800'
                  : 'bg-[#FAF8F5] text-stone-700 border-stone-300 hover:bg-stone-200'
              }`}
            >
              Professors of Practice ({practiceCount})
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================
          FACULTY CARDS GRID
         ================================================================ */}
      {filteredFaculty.length === 0 ? (
        <div className="p-12 text-center bg-white border border-stone-300 space-y-2">
          <p className="text-sm font-mono text-stone-600">No faculty members found matching "{searchQuery}".</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setFilterType('all');
            }}
            className="text-xs text-[#1E3A8A] font-mono underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFaculty.map((member) => (
            <FacultyCard
              key={member.id}
              member={member}
              onAskAI={onAskAI}
              onShowToast={onShowToast}
            />
          ))}
        </div>
      )}
    </div>
  );
};

function FacultyCard({
  member,
  onAskAI,
  onShowToast,
}: {
  member: FacultyMember;
  onAskAI: (prompt: string) => void;
  onShowToast: (msg: string) => void;
}) {
  const [imageError, setImageError] = useState(false);

  // Encode spaces in CloudFront photo URL
  const photoUrl = encodeURI(member.photo);

  const isPractice = member.profileType === 'professor_of_practice';

  return (
    <div className="bg-white border-2 border-stone-900 shadow-[3px_3px_0px_#141210] flex flex-col justify-between overflow-hidden group hover:shadow-[5px_5px_0px_#141210] transition-all">
      <div>
        {/* Photo Container */}
        <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden border-b-2 border-stone-900">
          {!imageError && photoUrl ? (
            <img
              src={photoUrl}
              alt={member.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#EAE2D3] text-stone-600">
              <User className="w-12 h-12 text-stone-400 mb-1" />
              <span className="text-[10px] font-mono font-bold">{member.name}</span>
            </div>
          )}

          {/* Badge top-right */}
          <div className="absolute top-2 right-2">
            {isPractice ? (
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-amber-800 text-white shadow-sm uppercase">
                Industry Expert
              </span>
            ) : (
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-[#1E3A8A] text-white shadow-sm uppercase">
                Faculty
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-3.5 space-y-2">
          <div>
            <h3 className="font-serif text-base font-bold text-stone-950 leading-tight">
              {member.name}
            </h3>
            <p className="text-xs text-[#1E3A8A] font-semibold mt-0.5 leading-snug">
              {member.designation}
            </p>
          </div>

          {/* Qualification */}
          {member.qualification && (
            <div className="text-[11px] text-stone-700 flex items-start gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{member.qualification}</span>
            </div>
          )}

          {/* Specialization or Industry Topic */}
          {member.specialization && (
            <div className="text-[11px] text-stone-800 bg-[#FBF9F5] p-2 border border-stone-200">
              <span className="font-mono font-bold text-[10px] text-stone-500 block uppercase">
                Area of Specialization:
              </span>
              <span className="line-clamp-2 leading-relaxed">{member.specialization}</span>
            </div>
          )}

          {/* For Professor of Practice: Company and Topic */}
          {isPractice && (
            <div className="text-[11px] space-y-1 bg-amber-50/70 p-2 border border-amber-200">
              {member.company && (
                <div className="flex items-center gap-1.5 text-amber-950 font-medium">
                  <Briefcase className="w-3 h-3 text-amber-800 shrink-0" />
                  <span className="truncate">{member.company}</span>
                </div>
              )}
              {member.topic && (
                <div className="text-[10px] text-stone-700">
                  <span className="font-bold">Topic: </span>
                  <span>{member.topic}</span>
                </div>
              )}
            </div>
          )}

          {/* Experience & Publications stats */}
          {(member.teachingExperience || member.publications) && (
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[10px] text-stone-600">
              {member.teachingExperience && (
                <span className="px-1.5 py-0.5 bg-stone-100 border border-stone-300">
                  Exp: {member.teachingExperience}
                </span>
              )}
              {member.publications && (
                <span className="px-1.5 py-0.5 bg-stone-100 border border-stone-300">
                  Pubs: {member.publications}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3 bg-[#FAF8F5] border-t border-stone-300 flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5">
          {member.vidwanUrl && (
            <a
              href={member.vidwanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-0.5 bg-[#1E3A8A] text-white hover:bg-blue-900 text-[10px] font-mono font-bold uppercase transition-colors"
              title="View Vidwan Profile"
            >
              VIDWAN
            </a>
          )}
          {member.orcidUrl && (
            <a
              href={member.orcidUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-0.5 bg-emerald-800 text-white hover:bg-emerald-900 text-[10px] font-mono font-bold uppercase transition-colors"
              title="View ORCID Profile"
            >
              ORCID
            </a>
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            onAskAI(`Tell me about ${member.name} (${member.designation}) and their specialization at Kristu Jayanti Institute of Technology.`)
          }
          className="text-[11px] font-mono text-[#1E3A8A] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
          title="Ask AI about this professor"
        >
          <Sparkles className="w-3 h-3" />
          <span>Ask AI</span>
        </button>
      </div>
    </div>
  );
}





