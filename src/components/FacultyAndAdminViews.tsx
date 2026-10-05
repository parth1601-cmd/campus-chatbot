import React, { useState } from 'react';
import {
  CheckCircle2,
  RefreshCw,
  Send,
  Users,
  BookOpen,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  Save,
  Check,
  RotateCcw,
  Sparkles,
  ExternalLink,
  GraduationCap,
  Layers,
  FileText,
  Video,
  HelpCircle,
  Code,
  Search,
  Camera,
  FolderPlus,
  Briefcase,
  Award,
  Newspaper,
  Eye,
  Sliders,
  Layout,
  Bell,
  AlertCircle,
  ArrowRight,
  MapPin,
  Rocket,
} from 'lucide-react';
import { ViewId, Course, CourseModule, CourseModuleItem } from '../types';
import { FacultyMember, getStoredFaculty, saveStoredFaculty, KJIT_FACULTY } from '../data/kjitFacultyData';
import {
  getStoredCourses,
  saveStoredCourses,
  COURSES,
  ChronicleConfig,
  getStoredChronicle,
  saveStoredChronicle,
  DEFAULT_CHRONICLE_CONFIG,
  CampusPhotoDispatch,
  ChronicleHeroStory,
  ChronicleAnnouncementItem,
  KRISTU_JAYANTI_CAMPUS_PHOTOS,
} from '../data/zanzeeData';
import { KJCLogo } from './KJCLogo';

interface PortalProps {
  currentView: ViewId;
  onNavigate: (view: ViewId) => void;
  onShowToast: (msg: string) => void;
}

// Preset official Kristu Jayanti teacher photos for quick selection
const OFFICIAL_PHOTO_PRESETS = [
  { name: 'Dr. R. Kumar', url: 'https://d2di5o2d0ilx7p.cloudfront.net/institute-of-technology/faculty-profile/R%20Kumar.jpg' },
  { name: 'Dr. Muruganantham A', url: 'https://d2di5o2d0ilx7p.cloudfront.net/institute-of-technology/faculty-profile/Muruganantham.jpg' },
  { name: 'Dr. Velmurugan R', url: 'https://d2di5o2d0ilx7p.cloudfront.net/institute-of-technology/faculty-profile/Velmurugan.jpg' },
  { name: 'Dr. Vinothina V', url: 'https://d2di5o2d0ilx7p.cloudfront.net/institute-of-technology/faculty-profile/Vinothina.jpg' },
  { name: 'Dr. Sheeja S', url: 'https://d2di5o2d0ilx7p.cloudfront.net/institute-of-technology/faculty-profile/Sheeja.jpg' },
  { name: 'Dr. S. Karthik', url: 'https://d2di5o2d0ilx7p.cloudfront.net/institute-of-technology/faculty-profile/Karthik.jpg' },
  { name: 'Dr. Subramaniakumar', url: 'https://d2di5o2d0ilx7p.cloudfront.net/institute-of-technology/faculty-profile/Subramaniakumar.jpg' },
  { name: 'Mr. Srinivasan S.', url: 'https://d2di5o2d0ilx7p.cloudfront.net/institute-of-technology/faculty-profile/Sairamachandran.jpg' },
];

// Preset official Kristu Jayanti campus photos for Chronicle quick selection
const OFFICIAL_CAMPUS_PHOTO_PRESETS = [
  {
    title: 'Kristu Jayanti University New Campus & Technology Complex',
    category: 'Campus Architecture',
    url: 'https://d2di5o2d0ilx7p.cloudfront.net/event-images/2025/kju-new-campus-2.jpg',
    location: 'K. Narayanapura, Kothanur P.O., Bengaluru',
    highlight: 'Official New Campus',
    caption: 'State-of-the-art academic complexes, research wings, and technology suites at Kristu Jayanti University, Bengaluru.',
  },
  {
    title: 'Lush Botanical Lawns & Eco-Centric Green Campus',
    category: 'Sustainability',
    url: 'https://www.kristujayanti.edu.in/images/new-banners/green-campus.jpg',
    location: 'Eco-Park & Main Quadrangle',
    highlight: 'Clean & Green Campus Benchmark',
    caption: 'Consistently ranked among the cleanest and greenest university campuses with solar power arrays and medicinal plant conservatories.',
  },
  {
    title: 'Grand Academic Auditorium & Annual Jayantian Conclave',
    category: 'Academic Life',
    url: 'https://d2di5o2d0ilx7p.cloudfront.net/Happening-Today/03-10/01.jpg',
    location: 'Main Auditorium Complex',
    highlight: 'International Research Conclave',
    caption: 'High-capacity acoustically engineered auditoriums hosting international symposiums, hackathons, and postgraduate assemblies.',
  },
  {
    title: 'Green University Ranking & Institutional Accreditations',
    category: 'Accreditation',
    url: 'https://d2di5o2d0ilx7p.cloudfront.net/event-images/2026/green-ranking-2025.jpg',
    location: 'Deemed to be University Campus',
    highlight: 'NAAC A++ / NIRF Top Rank',
    caption: 'Honouring Kristu Jayanti’s highest grade institutional accreditations and environmental performance recognitions.',
  },
  {
    title: 'Kristu Jayanti Main Academic Quad & Fountain Square',
    category: 'Campus Grounds',
    url: 'https://d2di5o2d0ilx7p.cloudfront.net/event-images/2025/kju-new-campus-1.jpg',
    location: 'Central Campus Quad',
    highlight: 'Historic Campus Quad',
    caption: 'The vibrant campus center connecting academic blocks, auditoriums, and open-air discussion plazas.',
  },
  {
    title: 'Kristu Jayanti Central Research Library & Archives',
    category: 'Academic Life',
    url: 'https://d2di5o2d0ilx7p.cloudfront.net/event-images/2025/kju-new-campus-3.jpg',
    location: 'Central Library Building',
    highlight: 'Research & Innovation Wing',
    caption: 'Over 100,000 volumes, international journals, digital discovery terminals, and silent study chambers.',
  },
];

// ============================================================================
// FACULTY PORTAL (Teachers & Photos Studio, Contents of Study Studio, Telemetry)
// ============================================================================
export const FacultyPortalView: React.FC<PortalProps> = ({ onShowToast, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'teachers' | 'study-contents' | 'telemetry'>('teachers');

  // Faculty State
  const [facultyList, setFacultyList] = useState<FacultyMember[]>(getStoredFaculty);
  const [facultySearch, setFacultySearch] = useState('');
  const [facultyFilter, setFacultyFilter] = useState<'all' | 'core' | 'practice'>('all');
  const [editingFaculty, setEditingFaculty] = useState<FacultyMember | null>(null);
  const [isAddingFaculty, setIsAddingFaculty] = useState(false);
  const [newFaculty, setNewFaculty] = useState<Partial<FacultyMember>>({
    name: '',
    designation: 'Faculty, Department of Computer Science (PG)',
    qualification: 'M.Sc., Ph.D.',
    department: 'Institute of Technology / PG Dept. of Computer Science',
    photo: 'https://d2di5o2d0ilx7p.cloudfront.net/institute-of-technology/faculty-profile/R%20Kumar.jpg',
    specialization: '',
    teachingExperience: '',
    publications: '',
    vidwanUrl: '',
    orcidUrl: '',
    profileType: 'core_faculty',
    company: '',
    topic: '',
  });

  // Course & Contents of Study State
  const [coursesList, setCoursesList] = useState<Course[]>(getStoredCourses);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(coursesList[0]?.id || 'cs-201');
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleWeek, setNewModuleWeek] = useState('');
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleSummary, setNewModuleSummary] = useState('');
  const [addingItemModuleId, setAddingItemModuleId] = useState<string | null>(null);
  const [newItemType, setNewItemType] = useState<'video' | 'reading' | 'quiz' | 'assignment'>('video');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDuration, setNewItemDuration] = useState('');

  // Announcements and Socratic policy
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

  // Selected Course helper
  const selectedCourse = coursesList.find((c) => c.id === selectedCourseId) || coursesList[0];

  // --------------------------------------------------------------------------
  // TEACHER PROFILE ACTIONS
  // --------------------------------------------------------------------------
  const handleSaveFacultyList = () => {
    saveStoredFaculty(facultyList);
    onShowToast('✓ Teacher profiles & photos successfully applied across Kristu Jayanti portal!');
  };

  const handleUpdateFacultyMember = (updated: FacultyMember) => {
    const nextList = facultyList.map((f) => (f.id === updated.id ? updated : f));
    setFacultyList(nextList);
    saveStoredFaculty(nextList);
    setEditingFaculty(null);
    onShowToast(`✓ Updated profile & photo for ${updated.name}`);
  };

  const handleCreateFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaculty.name?.trim()) return;

    const created: FacultyMember = {
      id: `fac-${Date.now()}`,
      name: newFaculty.name.trim(),
      designation: newFaculty.designation || 'Faculty, Department of Computer Science (PG)',
      qualification: newFaculty.qualification || 'M.Sc., Ph.D.',
      department: newFaculty.department || 'Institute of Technology / PG Dept. of Computer Science',
      photo: newFaculty.photo || 'https://d2di5o2d0ilx7p.cloudfront.net/institute-of-technology/faculty-profile/R%20Kumar.jpg',
      specialization: newFaculty.specialization || '',
      teachingExperience: newFaculty.teachingExperience || '',
      publications: newFaculty.publications || '',
      vidwanUrl: newFaculty.vidwanUrl || '',
      orcidUrl: newFaculty.orcidUrl || '',
      profileType: newFaculty.profileType || 'core_faculty',
      company: newFaculty.company || '',
      topic: newFaculty.topic || '',
      class: '',
    };

    const nextList = [created, ...facultyList];
    setFacultyList(nextList);
    saveStoredFaculty(nextList);
    setIsAddingFaculty(false);
    setNewFaculty({
      name: '',
      designation: 'Faculty, Department of Computer Science (PG)',
      qualification: 'M.Sc., Ph.D.',
      department: 'Institute of Technology / PG Dept. of Computer Science',
      photo: 'https://d2di5o2d0ilx7p.cloudfront.net/institute-of-technology/faculty-profile/R%20Kumar.jpg',
      specialization: '',
      teachingExperience: '',
      publications: '',
      vidwanUrl: '',
      orcidUrl: '',
      profileType: 'core_faculty',
      company: '',
      topic: '',
    });
    onShowToast(`✓ Added new teacher profile for ${created.name}`);
  };

  const handleDeleteFaculty = (id: string, name: string) => {
    const nextList = facultyList.filter((f) => f.id !== id);
    setFacultyList(nextList);
    saveStoredFaculty(nextList);
    onShowToast(`Removed teacher ${name}`);
  };

  const handleResetFaculty = () => {
    setFacultyList(KJIT_FACULTY);
    saveStoredFaculty(KJIT_FACULTY);
    onShowToast('Restored default Kristu Jayanti faculty roster');
  };

  // --------------------------------------------------------------------------
  // CONTENTS OF STUDY ACTIONS
  // --------------------------------------------------------------------------
  const handleSaveCoursesList = () => {
    saveStoredCourses(coursesList);
    onShowToast('✓ Contents of study successfully applied and published to students!');
  };

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim() || !newModuleWeek.trim()) return;

    const newMod: CourseModule = {
      id: `mod-${Date.now()}`,
      week: newModuleWeek.trim(),
      title: newModuleTitle.trim(),
      summary: newModuleSummary.trim() || 'Core module syllabus, video lectures, and study readings.',
      items: [
        {
          id: `item-${Date.now()}-1`,
          type: 'video',
          title: `Introductory Lecture: ${newModuleTitle.trim()}`,
          durationOrDue: '45 min',
          completed: false,
        },
      ],
    };

    const nextCourses = coursesList.map((c) => {
      if (c.id === selectedCourseId) {
        return {
          ...c,
          modules: [...c.modules, newMod],
        };
      }
      return c;
    });

    setCoursesList(nextCourses);
    saveStoredCourses(nextCourses);
    setIsAddingModule(false);
    setNewModuleWeek('');
    setNewModuleTitle('');
    setNewModuleSummary('');
    onShowToast(`✓ Added new study module "${newMod.title}" to ${selectedCourse.code}`);
  };

  const handleDeleteModule = (moduleId: string) => {
    const nextCourses = coursesList.map((c) => {
      if (c.id === selectedCourseId) {
        return {
          ...c,
          modules: c.modules.filter((m) => m.id !== moduleId),
        };
      }
      return c;
    });
    setCoursesList(nextCourses);
    saveStoredCourses(nextCourses);
    onShowToast('Deleted module from contents of study');
  };

  const handleAddStudyItem = (moduleId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    const newItem: CourseModuleItem = {
      id: `item-${Date.now()}`,
      type: newItemType,
      title: newItemTitle.trim(),
      durationOrDue: newItemDuration.trim() || (newItemType === 'video' ? '45 min' : 'Due Friday 11:59 PM'),
      completed: false,
    };

    const nextCourses = coursesList.map((c) => {
      if (c.id === selectedCourseId) {
        return {
          ...c,
          modules: c.modules.map((m) => {
            if (m.id === moduleId) {
              return {
                ...m,
                items: [...m.items, newItem],
              };
            }
            return m;
          }),
        };
      }
      return c;
    });

    setCoursesList(nextCourses);
    saveStoredCourses(nextCourses);
    setAddingItemModuleId(null);
    setNewItemTitle('');
    setNewItemDuration('');
    onShowToast(`✓ Added study material: ${newItem.title}`);
  };

  const handleDeleteStudyItem = (moduleId: string, itemId: string) => {
    const nextCourses = coursesList.map((c) => {
      if (c.id === selectedCourseId) {
        return {
          ...c,
          modules: c.modules.map((m) => {
            if (m.id === moduleId) {
              return {
                ...m,
                items: m.items.filter((i) => i.id !== itemId),
              };
            }
            return m;
          }),
        };
      }
      return c;
    });
    setCoursesList(nextCourses);
    saveStoredCourses(nextCourses);
    onShowToast('Deleted item from study content');
  };

  // Filtered faculty for view
  const filteredFaculty = facultyList.filter((f) => {
    if (facultyFilter === 'core' && f.profileType !== 'core_faculty') return false;
    if (facultyFilter === 'practice' && f.profileType !== 'professor_of_practice') return false;
    if (facultySearch.trim()) {
      const q = facultySearch.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        f.designation.toLowerCase().includes(q) ||
        f.qualification.toLowerCase().includes(q) ||
        f.specialization.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Editorial Header Banner */}
      <header className="border-b-4 border-[#141210] pb-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <KJCLogo variant="emblem" size="md" />
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-[#1E3A8A] font-bold">
                KRISTU JAYANTI INSTITUTE OF TECHNOLOGY · FACULTY LOGIN
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-950">
                Teacher & Study Management Console
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('faculty-directory')}
              className="px-3.5 py-2 bg-white hover:bg-stone-100 text-stone-900 text-xs font-mono font-bold uppercase border border-[#141210] shadow-[2px_2px_0px_#141210] transition-colors cursor-pointer"
            >
              Public Faculty Directory →
            </button>
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-3.5 py-2 bg-[#141210] hover:bg-[#1E3A8A] text-white text-xs font-mono font-bold uppercase border border-[#141210] shadow-[2px_2px_0px_#141210] transition-colors cursor-pointer"
            >
              The Kristu Chronicle →
            </button>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-300">
          <button
            type="button"
            onClick={() => setActiveTab('teachers')}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all border ${
              activeTab === 'teachers'
                ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-[2px_2px_0px_#141210]'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Teachers & Photos Studio ({facultyList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('study-contents')}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all border ${
              activeTab === 'study-contents'
                ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-[2px_2px_0px_#141210]'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Contents of Study & Syllabus ({coursesList.length} Courses)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('telemetry')}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all border ${
              activeTab === 'telemetry'
                ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-[2px_2px_0px_#141210]'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Telemetry & Announcements</span>
          </button>
        </div>
      </header>

      {/* ====================================================================
          TAB 1: TEACHERS & PHOTOS STUDIO
         ==================================================================== */}
      {activeTab === 'teachers' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Action Toolbar */}
          <div className="p-4 bg-white border-2 border-stone-900 shadow-[3px_3px_0px_#141210] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={facultySearch}
                  onChange={(e) => setFacultySearch(e.target.value)}
                  placeholder="Filter teachers by name or field..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-stone-300 focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div className="flex items-center gap-1 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setFacultyFilter('all')}
                  className={`px-2.5 py-1.5 border cursor-pointer ${
                    facultyFilter === 'all' ? 'bg-[#141210] text-white' : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  All ({facultyList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFacultyFilter('core')}
                  className={`px-2.5 py-1.5 border cursor-pointer ${
                    facultyFilter === 'core' ? 'bg-[#1E3A8A] text-white' : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  Core ({facultyList.filter((f) => f.profileType === 'core_faculty').length})
                </button>
                <button
                  type="button"
                  onClick={() => setFacultyFilter('practice')}
                  className={`px-2.5 py-1.5 border cursor-pointer ${
                    facultyFilter === 'practice' ? 'bg-amber-800 text-white' : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  Industry ({facultyList.filter((f) => f.profileType === 'professor_of_practice').length})
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddingFaculty(true)}
                className="px-3.5 py-2 bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#141210]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Teacher Profile</span>
              </button>

              <button
                type="button"
                onClick={handleSaveFacultyList}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#141210]"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Apply All Changes</span>
              </button>

              <button
                type="button"
                onClick={handleResetFaculty}
                className="p-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-600 text-xs cursor-pointer"
                title="Reset to default faculty list"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Add Teacher Modal Form */}
          {isAddingFaculty && (
            <div className="p-4 sm:p-6 bg-[#FAF8F5] border-2 border-[#1E3A8A] shadow-[4px_4px_0px_#1E3A8A] space-y-4">
              <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                <h3 className="font-serif text-xl font-bold text-stone-950 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#1E3A8A]" />
                  <span>Add New Teacher / Faculty Profile</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddingFaculty(false)}
                  className="text-stone-500 hover:text-stone-900 text-xs font-mono uppercase cursor-pointer"
                >
                  ✕ Cancel
                </button>
              </div>

              <form onSubmit={handleCreateFaculty} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Photo Preview & URL */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold text-stone-800 uppercase">
                      Teacher Photo:
                    </label>
                    <div className="w-32 h-36 border-2 border-stone-900 bg-stone-100 overflow-hidden relative">
                      <img
                        src={newFaculty.photo || 'https://d2di5o2d0ilx7p.cloudfront.net/institute-of-technology/faculty-profile/R%20Kumar.jpg'}
                        alt="Preview"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://d2di5o2d0ilx7p.cloudfront.net/institute-of-technology/faculty-profile/R%20Kumar.jpg';
                        }}
                      />
                    </div>
                    <input
                      type="url"
                      value={newFaculty.photo}
                      onChange={(e) => setNewFaculty({ ...newFaculty, photo: e.target.value })}
                      placeholder="Photo image URL..."
                      className="w-full p-2 text-xs bg-white border border-stone-300 font-mono"
                    />

                    {/* Quick Photo Presets */}
                    <div className="pt-1 space-y-1">
                      <span className="text-[10px] font-mono text-stone-500 uppercase block">Quick Pick Photo:</span>
                      <div className="flex flex-wrap gap-1">
                        {OFFICIAL_PHOTO_PRESETS.slice(0, 4).map((p) => (
                          <button
                            key={p.name}
                            type="button"
                            onClick={() => setNewFaculty({ ...newFaculty, photo: p.url })}
                            className="px-2 py-0.5 bg-stone-200 hover:bg-stone-300 text-[10px] font-mono cursor-pointer"
                          >
                            {p.name.split(' ')[1] || p.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="md:col-span-2 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono font-bold text-stone-800">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={newFaculty.name}
                          onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                          placeholder="e.g. Dr. Rajesh Sharma"
                          className="w-full p-2 text-xs bg-white border border-stone-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold text-stone-800">Designation *</label>
                        <input
                          type="text"
                          required
                          value={newFaculty.designation}
                          onChange={(e) => setNewFaculty({ ...newFaculty, designation: e.target.value })}
                          placeholder="e.g. Professor & Research Lead"
                          className="w-full p-2 text-xs bg-white border border-stone-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono font-bold text-stone-800">Qualification</label>
                        <input
                          type="text"
                          value={newFaculty.qualification}
                          onChange={(e) => setNewFaculty({ ...newFaculty, qualification: e.target.value })}
                          placeholder="e.g. M.Sc. CS, Ph.D., Post-Doc"
                          className="w-full p-2 text-xs bg-white border border-stone-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold text-stone-800">Category</label>
                        <select
                          value={newFaculty.profileType}
                          onChange={(e) => setNewFaculty({ ...newFaculty, profileType: e.target.value as any })}
                          className="w-full p-2 text-xs bg-white border border-stone-300"
                        >
                          <option value="core_faculty">Core Postgraduate Faculty</option>
                          <option value="professor_of_practice">Professor of Practice (Industry)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-800">
                        Area of Specialization & Research
                      </label>
                      <textarea
                        rows={2}
                        value={newFaculty.specialization}
                        onChange={(e) => setNewFaculty({ ...newFaculty, specialization: e.target.value })}
                        placeholder="e.g. Distributed Computing, Cloud Security, LLM Agentic Architectures"
                        className="w-full p-2 text-xs bg-white border border-stone-300"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono font-bold text-stone-800">Teaching Experience</label>
                        <input
                          type="text"
                          value={newFaculty.teachingExperience}
                          onChange={(e) => setNewFaculty({ ...newFaculty, teachingExperience: e.target.value })}
                          placeholder="e.g. 18 years"
                          className="w-full p-2 text-xs bg-white border border-stone-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold text-stone-800">Publications</label>
                        <input
                          type="text"
                          value={newFaculty.publications}
                          onChange={(e) => setNewFaculty({ ...newFaculty, publications: e.target.value })}
                          placeholder="e.g. 24 papers"
                          className="w-full p-2 text-xs bg-white border border-stone-300"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#1E3A8A] text-white text-xs font-mono font-bold uppercase cursor-pointer shadow-[2px_2px_0px_#141210]"
                      >
                        ✓ Add Teacher Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingFaculty(false)}
                        className="px-4 py-2 bg-white border border-stone-400 text-xs font-mono cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Edit Teacher Modal / Drawer */}
          {editingFaculty && (
            <div className="p-4 sm:p-6 bg-[#FAF8F5] border-2 border-[#9A3412] shadow-[4px_4px_0px_#9A3412] space-y-4">
              <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                <h3 className="font-serif text-xl font-bold text-stone-950 flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-[#9A3412]" />
                  <span>Edit Profile & Photo: {editingFaculty.name}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingFaculty(null)}
                  className="text-stone-500 hover:text-stone-900 text-xs font-mono uppercase cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Photo Editor */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold text-stone-800 uppercase">
                    Teacher Photo & Preview:
                  </label>
                  <div className="w-36 h-40 border-2 border-stone-900 bg-stone-100 overflow-hidden relative shadow-sm">
                    <img
                      src={editingFaculty.photo}
                      alt={editingFaculty.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://d2di5o2d0ilx7p.cloudfront.net/institute-of-technology/faculty-profile/R%20Kumar.jpg';
                      }}
                    />
                  </div>
                  <input
                    type="url"
                    value={editingFaculty.photo}
                    onChange={(e) => setEditingFaculty({ ...editingFaculty, photo: e.target.value })}
                    className="w-full p-2 text-xs bg-white border border-stone-300 font-mono"
                    placeholder="Enter photo URL..."
                  />

                  {/* Preset Official Photos */}
                  <div className="pt-2 space-y-1">
                    <span className="text-[10px] font-mono text-stone-600 uppercase font-bold block">
                      Kristu Jayanti Photo Presets:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10px] font-mono">
                      {OFFICIAL_PHOTO_PRESETS.map((p) => (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => setEditingFaculty({ ...editingFaculty, photo: p.url })}
                          className="p-1 text-left bg-stone-200 hover:bg-stone-300 truncate cursor-pointer"
                          title={p.name}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Information Fields */}
                <div className="md:col-span-2 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-800">Teacher Name</label>
                      <input
                        type="text"
                        value={editingFaculty.name}
                        onChange={(e) => setEditingFaculty({ ...editingFaculty, name: e.target.value })}
                        className="w-full p-2 text-xs bg-white border border-stone-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-800">Designation</label>
                      <input
                        type="text"
                        value={editingFaculty.designation}
                        onChange={(e) => setEditingFaculty({ ...editingFaculty, designation: e.target.value })}
                        className="w-full p-2 text-xs bg-white border border-stone-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-800">Qualification</label>
                      <input
                        type="text"
                        value={editingFaculty.qualification}
                        onChange={(e) => setEditingFaculty({ ...editingFaculty, qualification: e.target.value })}
                        className="w-full p-2 text-xs bg-white border border-stone-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-800">Category</label>
                      <select
                        value={editingFaculty.profileType}
                        onChange={(e) => setEditingFaculty({ ...editingFaculty, profileType: e.target.value as any })}
                        className="w-full p-2 text-xs bg-white border border-stone-300"
                      >
                        <option value="core_faculty">Core Postgraduate Faculty</option>
                        <option value="professor_of_practice">Professor of Practice (Industry)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-800">
                      Area of Specialization
                    </label>
                    <textarea
                      rows={2}
                      value={editingFaculty.specialization}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, specialization: e.target.value })}
                      className="w-full p-2 text-xs bg-white border border-stone-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-800">Experience</label>
                      <input
                        type="text"
                        value={editingFaculty.teachingExperience}
                        onChange={(e) => setEditingFaculty({ ...editingFaculty, teachingExperience: e.target.value })}
                        className="w-full p-2 text-xs bg-white border border-stone-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-800">Publications</label>
                      <input
                        type="text"
                        value={editingFaculty.publications}
                        onChange={(e) => setEditingFaculty({ ...editingFaculty, publications: e.target.value })}
                        className="w-full p-2 text-xs bg-white border border-stone-300"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => handleUpdateFacultyMember(editingFaculty)}
                      className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-mono font-bold uppercase cursor-pointer shadow-[2px_2px_0px_#141210]"
                    >
                      ✓ Apply Changes to {editingFaculty.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingFaculty(null)}
                      className="px-4 py-2 bg-white border border-stone-400 text-xs font-mono cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Teacher Profiles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFaculty.map((member) => (
              <div
                key={member.id}
                className="bg-white border-2 border-stone-900 shadow-[3px_3px_0px_#141210] flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden border-b-2 border-stone-900">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://d2di5o2d0ilx7p.cloudfront.net/institute-of-technology/faculty-profile/R%20Kumar.jpg';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-0.5 text-[9px] font-mono font-bold text-white shadow-sm uppercase ${
                          member.profileType === 'professor_of_practice' ? 'bg-amber-800' : 'bg-[#1E3A8A]'
                        }`}
                      >
                        {member.profileType === 'professor_of_practice' ? 'Industry' : 'Faculty'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 space-y-1.5">
                    <h4 className="font-serif text-sm font-bold text-stone-950 truncate">{member.name}</h4>
                    <p className="text-[11px] text-[#1E3A8A] font-semibold leading-tight line-clamp-1">
                      {member.designation}
                    </p>
                    <p className="text-[10px] text-stone-600 line-clamp-1 font-mono">{member.qualification}</p>
                    {member.specialization && (
                      <p className="text-[10px] text-stone-700 bg-stone-50 p-1.5 border border-stone-200 line-clamp-2">
                        {member.specialization}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-2.5 bg-[#FAF8F5] border-t border-stone-300 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingFaculty(member)}
                    className="text-[11px] font-mono font-bold text-[#1E3A8A] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Profile / Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteFaculty(member.id, member.name)}
                    className="text-[11px] font-mono text-stone-400 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                    title="Remove Profile"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 2: CONTENTS OF STUDY & SYLLABUS STUDIO ("contains of study")
         ==================================================================== */}
      {activeTab === 'study-contents' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Course Selector & Actions Bar */}
          <div className="p-4 bg-white border-2 border-stone-900 shadow-[3px_3px_0px_#141210] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono font-bold text-stone-800 uppercase">Select Course of Study:</span>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="px-3 py-2 text-xs font-mono font-bold bg-[#FAF8F5] border border-stone-400 focus:outline-none focus:border-[#1E3A8A]"
              >
                {coursesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddingModule(true)}
                className="px-3.5 py-2 bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#141210]"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>+ Add Study Module / Unit</span>
              </button>

              <button
                type="button"
                onClick={handleSaveCoursesList}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#141210]"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Apply & Publish Contents of Study</span>
              </button>
            </div>
          </div>

          {/* Selected Course Overview Banner */}
          <div className="p-5 bg-[#FAF8F5] border-2 border-stone-900 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-[#1E3A8A] uppercase">
                {selectedCourse.code} · {selectedCourse.department} · {selectedCourse.credits} CREDITS
              </span>
              <span className="text-xs font-mono text-stone-600">
                Instructor: <strong>{selectedCourse.professor}</strong> ({selectedCourse.room})
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-950">{selectedCourse.title}</h2>
            <p className="text-xs text-stone-700 leading-relaxed font-serif max-w-4xl">
              {selectedCourse.description}
            </p>
          </div>

          {/* Add Study Module Form */}
          {isAddingModule && (
            <div className="p-5 bg-white border-2 border-[#1E3A8A] shadow-[3px_3px_0px_#1E3A8A] space-y-3">
              <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                <h4 className="font-serif text-lg font-bold text-stone-950 flex items-center gap-2">
                  <FolderPlus className="w-4 h-4 text-[#1E3A8A]" />
                  <span>Add New Study Module / Syllabus Unit</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddingModule(false)}
                  className="text-stone-500 hover:text-stone-900 text-xs font-mono cursor-pointer"
                >
                  ✕ Cancel
                </button>
              </div>

              <form onSubmit={handleAddModule} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-800">Week / Unit *</label>
                    <input
                      type="text"
                      required
                      value={newModuleWeek}
                      onChange={(e) => setNewModuleWeek(e.target.value)}
                      placeholder="e.g. Week 5 or Unit 3"
                      className="w-full p-2 text-xs bg-[#FAF8F5] border border-stone-300"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono font-bold text-stone-800">Module Title *</label>
                    <input
                      type="text"
                      required
                      value={newModuleTitle}
                      onChange={(e) => setNewModuleTitle(e.target.value)}
                      placeholder="e.g. Red-Black Trees, B-Trees & Distributed Storage"
                      className="w-full p-2 text-xs bg-[#FAF8F5] border border-stone-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-stone-800">Module Learning Summary</label>
                  <textarea
                    rows={2}
                    value={newModuleSummary}
                    onChange={(e) => setNewModuleSummary(e.target.value)}
                    placeholder="Short description of concepts, proofs, or labs covered..."
                    className="w-full p-2 text-xs bg-[#FAF8F5] border border-stone-300"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1E3A8A] text-white text-xs font-mono font-bold uppercase cursor-pointer shadow-[2px_2px_0px_#141210]"
                  >
                    ✓ Create Module
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingModule(false)}
                    className="px-3 py-2 bg-stone-100 text-stone-800 text-xs font-mono cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Modules List ("Contents of Study" Units) */}
          <div className="space-y-4">
            {selectedCourse.modules.map((module) => (
              <div
                key={module.id}
                className="bg-white border-2 border-stone-900 shadow-[3px_3px_0px_#141210] p-4 sm:p-5 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-stone-900 text-white text-[11px] font-mono font-bold uppercase">
                      {module.week}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-stone-950">{module.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAddingItemModuleId(module.id)}
                      className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-400 text-stone-800 text-xs font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Study Item</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteModule(module.id)}
                      className="p-1 text-stone-400 hover:text-red-700 cursor-pointer"
                      title="Delete Module"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-stone-600 font-mono">{module.summary}</p>

                {/* Add Study Item Form (Inline for this module) */}
                {addingItemModuleId === module.id && (
                  <form
                    onSubmit={(e) => handleAddStudyItem(module.id, e)}
                    className="p-3 bg-[#FAF8F5] border border-[#1E3A8A] space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#1E3A8A] uppercase">
                        + Add Content of Study to {module.week}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAddingItemModuleId(null)}
                        className="text-stone-500 text-xs font-mono cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] font-mono font-bold text-stone-700">Type</label>
                        <select
                          value={newItemType}
                          onChange={(e) => setNewItemType(e.target.value as any)}
                          className="w-full p-1.5 text-xs bg-white border border-stone-300"
                        >
                          <option value="video">🎥 Video Lecture</option>
                          <option value="reading">📖 Reading / Notes</option>
                          <option value="assignment">💻 Lab Assignment</option>
                          <option value="quiz">📝 Quiz / Assessment</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono font-bold text-stone-700">Title *</label>
                        <input
                          type="text"
                          required
                          value={newItemTitle}
                          onChange={(e) => setNewItemTitle(e.target.value)}
                          placeholder="e.g. Lecture 4: B-Tree Balancing"
                          className="w-full p-1.5 text-xs bg-white border border-stone-300"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono font-bold text-stone-700">Duration / Due</label>
                        <input
                          type="text"
                          value={newItemDuration}
                          onChange={(e) => setNewItemDuration(e.target.value)}
                          placeholder="e.g. 50 min or Due Friday"
                          className="w-full p-1.5 text-xs bg-white border border-stone-300"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-[#1E3A8A] text-white text-xs font-mono font-bold uppercase cursor-pointer"
                      >
                        ✓ Add Item
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddingItemModuleId(null)}
                        className="px-2.5 py-1.5 bg-white border border-stone-300 text-stone-700 text-xs font-mono cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Items in Module */}
                <div className="divide-y divide-stone-200 border border-stone-200">
                  {module.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 flex items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {item.type === 'video' && <Video className="w-4 h-4 text-blue-700 shrink-0" />}
                        {item.type === 'reading' && <FileText className="w-4 h-4 text-emerald-700 shrink-0" />}
                        {item.type === 'assignment' && <Code className="w-4 h-4 text-amber-700 shrink-0" />}
                        {item.type === 'quiz' && <HelpCircle className="w-4 h-4 text-purple-700 shrink-0" />}

                        <div className="min-w-0">
                          <span className="text-xs font-medium text-stone-900 block truncate">{item.title}</span>
                          <span className="text-[10px] font-mono text-stone-500 uppercase">
                            {item.type} · {item.durationOrDue}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleDeleteStudyItem(module.id, item.id)}
                          className="p-1 text-stone-400 hover:text-red-700 cursor-pointer"
                          title="Delete study item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 3: TELEMETRY & ANNOUNCEMENTS
         ==================================================================== */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Faculty Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'Active Courses', value: `${coursesList.length} Courses`, sub: 'CS 201 · CS 310 · MCA' },
              { label: 'Total Students', value: '218', sub: '124 in CS 201' },
              { label: 'Active Assignments', value: '4 Open', sub: 'Lab 4 Due Friday' },
              { label: 'Student Engagement', value: '82%', sub: '+9% vs Fall 2025' },
              { label: 'AI Tutor Sessions', value: '1,420', sub: 'This week across courses' },
            ].map((m) => (
              <div key={m.label} className="bg-white border-2 border-stone-900 shadow-[2px_2px_0px_#141210] p-4 space-y-1">
                <div className="text-xs font-mono text-stone-500">{m.label}</div>
                <div className="font-mono text-2xl font-bold text-stone-900 tabular-nums">{m.value}</div>
                <div className="text-xs text-stone-600">{m.sub}</div>
              </div>
            ))}
          </div>

          {/* Actionable Faculty AI Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white border border-stone-300 p-4 sm:p-6 space-y-4">
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
            </div>

            {/* Right 5 Cols: AI Tutor Management & Course Announcements */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-stone-300 p-4 sm:p-6 space-y-4">
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

              <div className="bg-white border border-stone-300 p-4 sm:p-6 space-y-4">
                <div className="text-xs font-mono text-stone-500">BROADCAST TO STUDENTS</div>
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
                        course: selectedCourse.code,
                        title: announcementText.trim(),
                        sentAt: 'Just now',
                      },
                      ...prev,
                    ]);
                    setAnnouncementText('');
                    onShowToast(`Announcement published to all ${selectedCourse.code} students`);
                  }}
                  className="space-y-2"
                >
                  <textarea
                    rows={3}
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder={`Write an announcement for ${selectedCourse.code} students...`}
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
      )}
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

  // ==========================================================================
  // THE KRISTU CHRONICLE ADMINISTRATION STATE & CONTROLS
  // ==========================================================================
  const [chronicle, setChronicle] = useState<ChronicleConfig>(getStoredChronicle);
  const [chronicleTab, setChronicleTab] = useState<
    'masthead' | 'hero' | 'photos' | 'bulletins' | 'faculty' | 'study-contents'
  >('masthead');
  const [editingPhotoIndex, setEditingPhotoIndex] = useState<number | null>(null);
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [newPhoto, setNewPhoto] = useState<CampusPhotoDispatch>({
    id: '',
    title: '',
    category: 'Campus Architecture',
    imageUrl: 'https://d2di5o2d0ilx7p.cloudfront.net/event-images/2025/kju-new-campus-2.jpg',
    caption: '',
    location: 'Bengaluru Campus',
    highlight: '',
  });

  const [editingAnnIndex, setEditingAnnIndex] = useState<number | null>(null);
  const [isAddingAnn, setIsAddingAnn] = useState(false);
  const [newAnn, setNewAnn] = useState<ChronicleAnnouncementItem>({
    id: '',
    category: 'ACADEMIC SENATE & REGISTRAR',
    title: '',
    dateline: 'REGISTRAR’S DESK —',
    summary: '',
    actionLabel: 'Inspect Details →',
    actionView: 'academic-progress',
  });

  // Integrated Faculty Administration
  const [adminFacultyList, setAdminFacultyList] = useState<FacultyMember[]>(getStoredFaculty);
  const [adminFacultySearch, setAdminFacultySearch] = useState('');
  const [adminEditingFaculty, setAdminEditingFaculty] = useState<FacultyMember | null>(null);
  const [adminIsAddingFaculty, setAdminIsAddingFaculty] = useState(false);
  const [adminNewFaculty, setAdminNewFaculty] = useState<Partial<FacultyMember>>({
    name: '',
    designation: 'Faculty, Department of Computer Science (PG)',
    qualification: 'M.Sc., Ph.D.',
    department: 'Institute of Technology / PG Dept. of Computer Science',
    photo: 'https://d2di5o2d0ilx7p.cloudfront.net/institute-of-technology/faculty-profile/R%20Kumar.jpg',
    specialization: '',
    teachingExperience: '',
    publications: '',
    vidwanUrl: '',
    orcidUrl: '',
    profileType: 'core_faculty',
    company: '',
    topic: '',
  });

  // Integrated Courses & Study Contents Administration
  const [adminCoursesList, setAdminCoursesList] = useState<Course[]>(getStoredCourses);
  const [adminSelectedCourseId, setAdminSelectedCourseId] = useState<string>(
    adminCoursesList[0]?.id || 'cs-201'
  );
  const [adminIsAddingModule, setAdminIsAddingModule] = useState(false);
  const [adminNewModuleWeek, setAdminNewModuleWeek] = useState('');
  const [adminNewModuleTitle, setAdminNewModuleTitle] = useState('');
  const [adminNewModuleSummary, setAdminNewModuleSummary] = useState('');
  const [adminAddingItemModuleId, setAdminAddingItemModuleId] = useState<string | null>(null);
  const [adminNewItemType, setAdminNewItemType] = useState<'video' | 'reading' | 'quiz' | 'assignment'>('video');
  const [adminNewItemTitle, setAdminNewItemTitle] = useState('');
  const [adminNewItemDuration, setAdminNewItemDuration] = useState('');

  const adminSelectedCourse =
    adminCoursesList.find((c) => c.id === adminSelectedCourseId) || adminCoursesList[0];

  // --------------------------------------------------------------------------
  // CHRONICLE ACTIONS
  // --------------------------------------------------------------------------
  const handleSaveChronicle = () => {
    saveStoredChronicle(chronicle);
    onShowToast('✓ Saved & Applied All Changes to "The Kristu Chronicle" across the University!');
  };

  const handleResetChronicle = () => {
    if (window.confirm('Reset "The Kristu Chronicle" to official university defaults?')) {
      setChronicle(DEFAULT_CHRONICLE_CONFIG);
      saveStoredChronicle(DEFAULT_CHRONICLE_CONFIG);
      onShowToast('✓ Reset "The Kristu Chronicle" to official university defaults');
    }
  };

  const handleCreatePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoto.title.trim() || !newPhoto.imageUrl.trim()) return;

    const created: CampusPhotoDispatch = {
      ...newPhoto,
      id: `photo-${Date.now()}`,
    };
    const nextPhotos = [created, ...(chronicle.campusPhotos || [])];
    const nextChronicle = { ...chronicle, campusPhotos: nextPhotos };
    setChronicle(nextChronicle);
    saveStoredChronicle(nextChronicle);
    setIsAddingPhoto(false);
    setNewPhoto({
      id: '',
      title: '',
      category: 'Campus Architecture',
      imageUrl: 'https://d2di5o2d0ilx7p.cloudfront.net/event-images/2025/kju-new-campus-2.jpg',
      caption: '',
      location: 'Bengaluru Campus',
      highlight: '',
    });
    onShowToast(`✓ Added "${created.title}" to The Kristu Chronicle photo gallery!`);
  };

  const handleUpdatePhoto = (idx: number, updated: CampusPhotoDispatch) => {
    const nextPhotos = [...(chronicle.campusPhotos || [])];
    nextPhotos[idx] = updated;
    const nextChronicle = { ...chronicle, campusPhotos: nextPhotos };
    setChronicle(nextChronicle);
    saveStoredChronicle(nextChronicle);
    setEditingPhotoIndex(null);
    onShowToast(`✓ Updated photograph "${updated.title}"`);
  };

  const handleRemovePhoto = (idx: number) => {
    const photoToRemove = chronicle.campusPhotos[idx];
    if (window.confirm(`Remove "${photoToRemove?.title}" from The Kristu Chronicle?`)) {
      const nextPhotos = chronicle.campusPhotos.filter((_, i) => i !== idx);
      const nextChronicle = { ...chronicle, campusPhotos: nextPhotos };
      setChronicle(nextChronicle);
      saveStoredChronicle(nextChronicle);
      onShowToast(`✓ Removed photo from The Kristu Chronicle`);
    }
  };

  const handleCreateAnn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnn.title.trim() || !newAnn.summary.trim()) return;

    const created: ChronicleAnnouncementItem = {
      ...newAnn,
      id: `ann-${Date.now()}`,
    };
    const nextAnns = [created, ...(chronicle.announcements || [])];
    const nextChronicle = { ...chronicle, announcements: nextAnns };
    setChronicle(nextChronicle);
    saveStoredChronicle(nextChronicle);
    setIsAddingAnn(false);
    setNewAnn({
      id: '',
      category: 'ACADEMIC SENATE & REGISTRAR',
      title: '',
      dateline: 'REGISTRAR’S DESK —',
      summary: '',
      actionLabel: 'Inspect Details →',
      actionView: 'academic-progress',
    });
    onShowToast(`✓ Published announcement to The Kristu Chronicle!`);
  };

  const handleUpdateAnn = (idx: number, updated: ChronicleAnnouncementItem) => {
    const nextAnns = [...(chronicle.announcements || [])];
    nextAnns[idx] = updated;
    const nextChronicle = { ...chronicle, announcements: nextAnns };
    setChronicle(nextChronicle);
    saveStoredChronicle(nextChronicle);
    setEditingAnnIndex(null);
    onShowToast(`✓ Updated announcement "${updated.title}"`);
  };

  const handleRemoveAnn = (idx: number) => {
    const annToRemove = chronicle.announcements[idx];
    if (window.confirm(`Remove announcement "${annToRemove?.title}" from The Kristu Chronicle?`)) {
      const nextAnns = chronicle.announcements.filter((_, i) => i !== idx);
      const nextChronicle = { ...chronicle, announcements: nextAnns };
      setChronicle(nextChronicle);
      saveStoredChronicle(nextChronicle);
      onShowToast(`✓ Removed announcement from The Kristu Chronicle`);
    }
  };

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
    onShowToast(`Re-indexed ${sourceName} into Kristu Jayanti Vector Store`);
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
            KRISTU JAYANTI INSTITUTE OF TECHNOLOGY EXECUTIVE & CIO GOVERNANCE CONSOLE
          </div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            University Administration & AI Foundry
          </h1>
        </div>

        <div className="flex flex-wrap gap-1 p-1 bg-stone-200/70 border border-stone-300">
          {[
            { id: 'admin-dashboard', label: 'Executive Overview' },
            { id: 'admin-chronicle', label: '📰 The Kristu Chronicle' },
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
          {/* Spotlight Quick Action Card for The Kristu Chronicle */}
          <div className="bg-[#FAF8F5] border-2 border-[#141210] p-4 shadow-[3px_3px_0px_#141210] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-[#141210] text-[#F5F0E6] shrink-0">
                <Newspaper className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#1E3A8A] font-bold">
                  FLAGSHIP UNIVERSITY EDITORIAL ENGINE · THE KRISTU CHRONICLE
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-950">
                  Full Administrative Control over The Kristu Chronicle
                </h3>
                <p className="text-xs text-stone-600 max-w-2xl mt-0.5">
                  Customize and publish broadsheet mastheads, headline stories, campus photographs, urgent bursar alerts, infrastructure wires, secondary bulletins, and study contents with instant live university broadcast.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('admin-chronicle')}
                className="px-4 py-2 bg-[#1E3A8A] hover:bg-[#141210] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border border-[#141210] shadow-[2px_2px_0px_#141210] transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit The Kristu Chronicle →</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="px-3 py-2 bg-white hover:bg-stone-100 text-stone-900 text-xs font-mono font-bold uppercase tracking-wider border border-[#141210] transition-colors cursor-pointer"
              >
                <span>View Live Broadsheet</span>
              </button>
            </div>
          </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
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
            <div className="bg-white border border-stone-300 p-4 sm:p-6 space-y-4">
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

            <div className="bg-white border border-stone-300 p-4 sm:p-6 space-y-4">
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
          <div className="bg-white border border-stone-300 p-4 sm:p-6 space-y-4">
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
              <table className="w-full min-w-[640px] text-left border-collapse text-xs tabular-nums">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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

          <div className="bg-white border border-stone-300 p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 tabular-nums">
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

      {/* ================================================================
          THE KRISTU CHRONICLE ADMINISTRATION CONSOLE
         ================================================================ */}
      {currentView === 'admin-chronicle' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Editorial Header & Primary Control Bar */}
          <div className="bg-[#FAF8F5] border-2 border-[#141210] p-5 shadow-[4px_4px_0px_#141210] space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-[#141210] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#141210] text-[#F5F0E6]">
                  <Newspaper className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#1E3A8A] font-bold">
                      EXECUTIVE EDITORIAL GOVERNANCE
                    </span>
                    <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-emerald-800 text-white uppercase tracking-wider">
                      ● Published & Live
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-950">
                    The Kristu Chronicle — Editorial & Publishing Studio
                  </h2>
                  <p className="text-xs text-stone-600 font-sans mt-0.5">
                    Configure and publish every section of the university broadsheet: Masthead branding, Hero lead articles, Campus photographs, Urgent bulletins, Faculty, and Study syllabi.
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveChronicle}
                  className="px-4 py-2.5 bg-[#141210] hover:bg-[#1E3A8A] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 border border-[#141210] shadow-[3px_3px_0px_#1E3A8A] transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Save & Apply All Changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    saveStoredChronicle(chronicle);
                    setChronicleTab('hero');
                    onShowToast('● Published & Live — Hero Story posted directly to front page!');
                    onNavigate('dashboard');
                  }}
                  className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 border border-[#141210] shadow-[3px_3px_0px_#141210] transition-all cursor-pointer"
                  title="Publish current edits directly as the front-page Hero Story and open it live"
                >
                  <Rocket className="w-4 h-4 text-white" />
                  <span>Post Direct to Hero Story</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="px-3.5 py-2.5 bg-white hover:bg-stone-100 text-stone-900 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border border-[#141210] shadow-[2px_2px_0px_#141210] transition-colors cursor-pointer"
                  title="View published newspaper on the student dashboard"
                >
                  <Eye className="w-4 h-4 text-[#1E3A8A]" />
                  <span>Preview Broadsheet</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetChronicle}
                  className="px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1 border border-stone-300 transition-colors cursor-pointer"
                  title="Reset to default official texts"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                  <span>Reset Defaults</span>
                </button>
              </div>
            </div>

            {/* Studio Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {[
                { id: 'masthead', label: '📰 Masthead & Identity', icon: Layout },
                { id: 'hero', label: '🌟 Lead Headline & Hero Story', icon: FileText },
                { id: 'photos', label: `📸 Campus Photos (${chronicle.campusPhotos?.length || 0})`, icon: Camera },
                { id: 'bulletins', label: '📢 Urgent Bulletins & Wires', icon: Bell },
                { id: 'faculty', label: `👨‍🏫 Faculty & Mentors (${adminFacultyList.length})`, icon: Users },
                { id: 'study-contents', label: `📚 Contents of Study (${adminCoursesList.length})`, icon: BookOpen },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = chronicleTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setChronicleTab(tab.id as any)}
                    className={`px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#141210] text-white border-[#141210] shadow-[2px_2px_0px_#1E3A8A]'
                        : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-stone-500'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: MASTHEAD & IDENTITY */}
          {chronicleTab === 'masthead' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Controls */}
              <div className="lg:col-span-7 bg-white p-5 border-2 border-[#141210] shadow-[3px_3px_0px_#141210] space-y-4">
                <div className="border-b border-stone-200 pb-2">
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Broadsheet Masthead & Typography Settings
                  </h3>
                  <p className="text-xs text-stone-500 font-mono">
                    Changes here immediately affect the top masthead and dateline of "The Kristu Chronicle".
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                      Newspaper Masthead Title
                    </label>
                    <input
                      type="text"
                      value={chronicle.mastheadTitle || ''}
                      onChange={(e) => setChronicle({ ...chronicle, mastheadTitle: e.target.value })}
                      placeholder="e.g. The Kristu Chronicle"
                      className="w-full px-3 py-2 text-sm font-serif font-bold bg-[#FAF8F5] border border-stone-400 focus:outline-none focus:border-[#1E3A8A] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                      Subtitle / Motto Tagline
                    </label>
                    <input
                      type="text"
                      value={chronicle.tagline || ''}
                      onChange={(e) => setChronicle({ ...chronicle, tagline: e.target.value })}
                      placeholder="e.g. “Your Entire University, Powered by Verified Intelligence”"
                      className="w-full px-3 py-2 text-xs font-mono bg-[#FAF8F5] border border-stone-400 focus:outline-none focus:border-[#1E3A8A] focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                        Institution Header Line
                      </label>
                      <input
                        type="text"
                        value={chronicle.institutionName || ''}
                        onChange={(e) => setChronicle({ ...chronicle, institutionName: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-mono bg-[#FAF8F5] border border-stone-400 focus:outline-none focus:border-[#1E3A8A] focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                        NAAC / Heritage Accreditation
                      </label>
                      <input
                        type="text"
                        value={chronicle.accreditation || ''}
                        onChange={(e) => setChronicle({ ...chronicle, accreditation: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-mono bg-[#FAF8F5] border border-stone-400 focus:outline-none focus:border-[#1E3A8A] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                      Volume / Dateline Ribbon Text
                    </label>
                    <input
                      type="text"
                      value={chronicle.dateline || ''}
                      onChange={(e) => setChronicle({ ...chronicle, dateline: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono bg-[#FAF8F5] border border-stone-400 focus:outline-none focus:border-[#1E3A8A] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                      Central AI Telegraph Greeting
                    </label>
                    <input
                      type="text"
                      value={chronicle.telegraphGreeting || ''}
                      onChange={(e) => setChronicle({ ...chronicle, telegraphGreeting: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-serif font-bold bg-[#FAF8F5] border border-stone-400 focus:outline-none focus:border-[#1E3A8A] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveChronicle}
                    className="px-4 py-2 bg-[#1E3A8A] hover:bg-[#141210] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#141210]"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Apply Masthead Changes</span>
                  </button>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="lg:col-span-5 bg-[#F5F0E6] p-5 border-2 border-[#141210] shadow-[3px_3px_0px_#141210] space-y-4">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#1E3A8A] font-bold">
                  LIVE BROADSHEET PREVIEW
                </div>
                <div className="border-2 border-[#141210] bg-[#FAF8F5] p-4 text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <KJCLogo variant="emblem" size="sm" />
                    <div className="text-left">
                      <div className="text-[10px] font-mono uppercase font-bold text-[#1E3A8A]">
                        {chronicle.institutionName || 'KRISTU JAYANTI COLLEGE · AUTONOMOUS BENGALURU'}
                      </div>
                      <div className="text-[8px] font-mono text-stone-600">
                        {chronicle.accreditation || 'Accredited ‘A++’ Grade by NAAC · Managed by CMI Fathers'}
                      </div>
                    </div>
                  </div>
                  <h1 className="font-serif text-2xl font-extrabold text-stone-950 tracking-tight">
                    {chronicle.mastheadTitle || 'The Kristu Chronicle'}
                  </h1>
                  <div className="text-xs italic text-stone-700 font-serif">
                    {chronicle.tagline || '“Your Entire University, Powered by Verified Intelligence”'}
                  </div>
                  <div className="border-t border-b border-stone-400 py-1 text-[9px] font-mono text-stone-700 uppercase">
                    {chronicle.dateline || 'VOL. CXIV · NO. 42 · THURSDAY, OCTOBER 1, 2026'}
                  </div>
                  <div className="p-2 bg-[#EAE2D3] border border-stone-300 text-left text-xs font-serif">
                    <span className="font-mono text-[9px] text-[#1E3A8A] block font-bold">TELEGRAPH DESK GREETING:</span>
                    “{chronicle.telegraphGreeting}”
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LEAD HERO HEADLINE & ARTICLE */}
          {chronicleTab === 'hero' && (
            <div className="bg-white p-5 border-2 border-[#141210] shadow-[3px_3px_0px_#141210] space-y-5">
              <div className="border-b border-stone-200 pb-2 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Lead Headline Article & Visual Dispatch
                  </h3>
                  <p className="text-xs text-stone-500 font-mono">
                    The primary above-the-fold story on the front page of The Kristu Chronicle.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveChronicle}
                    className="px-4 py-2 bg-[#1E3A8A] hover:bg-[#141210] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#141210]"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Hero Story</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      saveStoredChronicle(chronicle);
                      onShowToast('● Published & Live — Hero Story posted directly to front page!');
                      onNavigate('dashboard');
                    }}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#141210]"
                    title="Publish this Hero Story live to the front page immediately"
                  >
                    <Rocket className="w-3.5 h-3.5" />
                    <span>Post Direct to Hero</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                      Lead Headline
                    </label>
                    <textarea
                      rows={2}
                      value={chronicle.heroStory?.headline || ''}
                      onChange={(e) =>
                        setChronicle({
                          ...chronicle,
                          heroStory: { ...(chronicle.heroStory || ({} as any)), headline: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-sm font-serif font-bold bg-[#FAF8F5] border border-stone-400 focus:outline-none focus:border-[#1E3A8A] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                      Sub-Headline / Deck Summary
                    </label>
                    <textarea
                      rows={2}
                      value={chronicle.heroStory?.deck || ''}
                      onChange={(e) =>
                        setChronicle({
                          ...chronicle,
                          heroStory: { ...(chronicle.heroStory || ({} as any)), deck: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs font-serif bg-[#FAF8F5] border border-stone-400 focus:outline-none focus:border-[#1E3A8A] focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                        Dispatch Category / Badge
                      </label>
                      <input
                        type="text"
                        value={chronicle.heroStory?.badge || ''}
                        onChange={(e) =>
                          setChronicle({
                            ...chronicle,
                            heroStory: { ...(chronicle.heroStory || ({} as any)), badge: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 text-xs font-mono bg-[#FAF8F5] border border-stone-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                        Location Tag
                      </label>
                      <input
                        type="text"
                        value={chronicle.heroStory?.locationTag || ''}
                        onChange={(e) =>
                          setChronicle({
                            ...chronicle,
                            heroStory: { ...(chronicle.heroStory || ({} as any)), locationTag: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 text-xs font-mono bg-[#FAF8F5] border border-stone-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                        Byline
                      </label>
                      <input
                        type="text"
                        value={chronicle.heroStory?.byline || ''}
                        onChange={(e) =>
                          setChronicle({
                            ...chronicle,
                            heroStory: { ...(chronicle.heroStory || ({} as any)), byline: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 text-xs font-mono bg-[#FAF8F5] border border-stone-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                        Read Time & Source
                      </label>
                      <input
                        type="text"
                        value={chronicle.heroStory?.readTime || ''}
                        onChange={(e) =>
                          setChronicle({
                            ...chronicle,
                            heroStory: { ...(chronicle.heroStory || ({} as any)), readTime: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 text-xs font-mono bg-[#FAF8F5] border border-stone-400"
                      />
                    </div>
                  </div>

                  {/* Body Prose */}
                  <div className="space-y-3 pt-2 border-t border-stone-200">
                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                        Article Lead Paragraph (Drop-Cap Section)
                      </label>
                      <textarea
                        rows={3}
                        value={chronicle.heroStory?.bodyParagraph1 || ''}
                        onChange={(e) =>
                          setChronicle({
                            ...chronicle,
                            heroStory: { ...(chronicle.heroStory || ({} as any)), bodyParagraph1: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-xs font-serif bg-[#FAF8F5] border border-stone-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                        Article Paragraph 2 (With Dateline Prefix)
                      </label>
                      <textarea
                        rows={3}
                        value={chronicle.heroStory?.bodyParagraph2 || ''}
                        onChange={(e) =>
                          setChronicle({
                            ...chronicle,
                            heroStory: { ...(chronicle.heroStory || ({} as any)), bodyParagraph2: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-xs font-serif bg-[#FAF8F5] border border-stone-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                        Dateline Prefix (e.g. TURING HALL, OCT. 1 —)
                      </label>
                      <input
                        type="text"
                        value={chronicle.heroStory?.datelineText || ''}
                        onChange={(e) =>
                          setChronicle({
                            ...chronicle,
                            heroStory: { ...(chronicle.heroStory || ({} as any)), datelineText: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 text-xs font-mono bg-[#FAF8F5] border border-stone-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Hero Photo & Preset Selectors */}
                <div className="lg:col-span-5 bg-[#FAF8F5] p-4 border border-stone-300 space-y-4">
                  <div className="border-b border-stone-300 pb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#1E3A8A] font-bold">
                      HERO PHOTOGRAPH CONFIGURATION
                    </span>
                    <h4 className="font-serif text-sm font-bold text-stone-900 mt-0.5">
                      Front Page Photojournalism Image
                    </h4>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                      Hero Photo URL
                    </label>
                    <input
                      type="text"
                      value={chronicle.heroStory?.imageUrl || ''}
                      onChange={(e) =>
                        setChronicle({
                          ...chronicle,
                          heroStory: { ...(chronicle.heroStory || ({} as any)), imageUrl: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-stone-400"
                    />
                  </div>

                  {/* One-Click Presets for Official Kristu Jayanti Campus Photos */}
                  <div>
                    <span className="text-[10px] font-mono text-stone-500 font-bold uppercase block mb-1.5">
                      Select Official University Campus Photo Preset:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {OFFICIAL_CAMPUS_PHOTO_PRESETS.map((preset) => (
                        <button
                          key={preset.title}
                          type="button"
                          onClick={() => {
                            setChronicle({
                              ...chronicle,
                              heroStory: {
                                ...(chronicle.heroStory || ({} as any)),
                                imageUrl: preset.url,
                                imageCaption: `Fig. 1 — ${preset.title}. ${preset.caption}`,
                                imageBadge: preset.highlight,
                              },
                            });
                            onShowToast(`Selected "${preset.title}" for Hero Photo`);
                          }}
                          className="text-left p-1.5 border border-stone-300 bg-white hover:bg-stone-100 transition-colors text-[10px] font-mono flex items-center gap-1.5 cursor-pointer"
                        >
                          <img src={preset.url} alt="" className="w-8 h-8 object-cover shrink-0 border" />
                          <span className="truncate">{preset.title.split(' ')[0]} {preset.title.split(' ')[1]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Preview */}
                  <div className="border-2 border-[#141210] bg-black overflow-hidden relative">
                    <img
                      src={chronicle.heroStory?.imageUrl || ASSETS.kjuCampusMain}
                      alt="Hero Preview"
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-[#141210]/85 text-white text-[9px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider">
                      {chronicle.heroStory?.imageBadge || 'Official Campus Landmark'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                      Photo Fig. 1 Caption
                    </label>
                    <textarea
                      rows={2}
                      value={chronicle.heroStory?.imageCaption || ''}
                      onChange={(e) =>
                        setChronicle({
                          ...chronicle,
                          heroStory: { ...(chronicle.heroStory || ({} as any)), imageCaption: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs font-serif italic bg-white border border-stone-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                      Photo Landmark Badge
                    </label>
                    <input
                      type="text"
                      value={chronicle.heroStory?.imageBadge || ''}
                      onChange={(e) =>
                        setChronicle({
                          ...chronicle,
                          heroStory: { ...(chronicle.heroStory || ({} as any)), imageBadge: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-stone-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CAMPUS PHOTOS & REPERTORY */}
          {chronicleTab === 'photos' && (
            <div className="bg-white p-5 border-2 border-[#141210] shadow-[3px_3px_0px_#141210] space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Kristu Jayanti Photographic Repertory ({chronicle.campusPhotos?.length || 0} Photographs)
                  </h3>
                  <p className="text-xs text-stone-500 font-mono">
                    Add, edit, or remove photographs featured in the Campus Visual Repertory gallery on The Kristu Chronicle.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingPhoto(true)}
                    className="px-3.5 py-2 bg-[#1E3A8A] hover:bg-[#141210] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#141210]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Campus Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveChronicle}
                    className="px-3.5 py-2 bg-[#141210] hover:bg-stone-800 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Save Photo List</span>
                  </button>
                </div>
              </div>

              {/* Add Photo Modal / Section */}
              {isAddingPhoto && (
                <form
                  onSubmit={handleCreatePhoto}
                  className="bg-[#FAF8F5] p-4 border-2 border-[#1E3A8A] shadow-[3px_3px_0px_#1E3A8A] space-y-4 animate-fadeIn"
                >
                  <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                    <span className="font-serif font-bold text-stone-950">Add New Campus Photograph</span>
                    <button
                      type="button"
                      onClick={() => setIsAddingPhoto(false)}
                      className="text-stone-500 hover:text-stone-900 text-xs font-mono cursor-pointer"
                    >
                      ✕ Close
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                        Photograph Title
                      </label>
                      <input
                        type="text"
                        required
                        value={newPhoto.title}
                        onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                        placeholder="e.g. New Campus & Research Complex"
                        className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-stone-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                        Category
                      </label>
                      <select
                        value={newPhoto.category}
                        onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-stone-400"
                      >
                        <option value="Campus Architecture">Campus Architecture</option>
                        <option value="Sustainability">Sustainability</option>
                        <option value="Academic Life">Academic Life</option>
                        <option value="Accreditation">Accreditation</option>
                        <option value="Campus Grounds">Campus Grounds</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      required
                      value={newPhoto.imageUrl}
                      onChange={(e) => setNewPhoto({ ...newPhoto, imageUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-stone-400"
                    />
                  </div>

                  {/* Preset Quick Chooser */}
                  <div>
                    <span className="text-[10px] font-mono text-stone-500 font-bold uppercase block mb-1">
                      Or Choose from Official Preset Photos:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {OFFICIAL_CAMPUS_PHOTO_PRESETS.map((p) => (
                        <button
                          key={p.title}
                          type="button"
                          onClick={() =>
                            setNewPhoto({
                              ...newPhoto,
                              title: p.title,
                              category: p.category,
                              imageUrl: p.url,
                              location: p.location,
                              highlight: p.highlight,
                              caption: p.caption,
                            })
                          }
                          className="px-2 py-1 bg-white hover:bg-stone-200 border text-[10px] font-mono cursor-pointer"
                        >
                          {p.title.split(' ')[0]} {p.title.split(' ')[1]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                        Campus Location
                      </label>
                      <input
                        type="text"
                        value={newPhoto.location}
                        onChange={(e) => setNewPhoto({ ...newPhoto, location: e.target.value })}
                        placeholder="e.g. K. Narayanapura Campus"
                        className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-stone-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                        Highlight Badge
                      </label>
                      <input
                        type="text"
                        value={newPhoto.highlight}
                        onChange={(e) => setNewPhoto({ ...newPhoto, highlight: e.target.value })}
                        placeholder="e.g. Official New Campus"
                        className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-stone-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                      Caption / Description
                    </label>
                    <textarea
                      rows={2}
                      value={newPhoto.caption}
                      onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                      placeholder="Descriptive architectural caption..."
                      className="w-full px-3 py-1.5 text-xs font-serif bg-white border border-stone-400"
                    />
                  </div>

                  <div className="flex items-center gap-2 justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingPhoto(false)}
                      className="px-3 py-1.5 border border-stone-300 text-xs font-mono text-stone-700 hover:bg-stone-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#1E3A8A] text-white text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Add Photo to Gallery
                    </button>
                  </div>
                </form>
              )}

              {/* Photos Gallery Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(chronicle.campusPhotos || []).map((photo, pIdx) => {
                  const isEditing = editingPhotoIndex === pIdx;
                  return (
                    <div
                      key={photo.id || `photo-${pIdx}`}
                      className="border-2 border-stone-900 bg-[#FAF8F5] overflow-hidden flex flex-col justify-between"
                    >
                      {isEditing ? (
                        <div className="p-3 space-y-2 text-xs font-mono">
                          <div className="font-bold text-stone-900 text-sm">Edit Photo #{pIdx + 1}</div>
                          <div>
                            <span className="block text-[10px] text-stone-500 uppercase">Title:</span>
                            <input
                              type="text"
                              value={photo.title}
                              onChange={(e) => {
                                const next = { ...photo, title: e.target.value };
                                handleUpdatePhoto(pIdx, next);
                              }}
                              className="w-full px-2 py-1 text-xs border bg-white"
                            />
                          </div>
                          <div>
                            <span className="block text-[10px] text-stone-500 uppercase">Image URL:</span>
                            <input
                              type="text"
                              value={photo.imageUrl}
                              onChange={(e) => {
                                const next = { ...photo, imageUrl: e.target.value };
                                handleUpdatePhoto(pIdx, next);
                              }}
                              className="w-full px-2 py-1 text-xs border bg-white"
                            />
                          </div>
                          <div>
                            <span className="block text-[10px] text-stone-500 uppercase">Location:</span>
                            <input
                              type="text"
                              value={photo.location}
                              onChange={(e) => {
                                const next = { ...photo, location: e.target.value };
                                handleUpdatePhoto(pIdx, next);
                              }}
                              className="w-full px-2 py-1 text-xs border bg-white"
                            />
                          </div>
                          <div>
                            <span className="block text-[10px] text-stone-500 uppercase">Highlight:</span>
                            <input
                              type="text"
                              value={photo.highlight || ''}
                              onChange={(e) => {
                                const next = { ...photo, highlight: e.target.value };
                                handleUpdatePhoto(pIdx, next);
                              }}
                              className="w-full px-2 py-1 text-xs border bg-white"
                            />
                          </div>
                          <div>
                            <span className="block text-[10px] text-stone-500 uppercase">Caption:</span>
                            <textarea
                              rows={2}
                              value={photo.caption}
                              onChange={(e) => {
                                const next = { ...photo, caption: e.target.value };
                                handleUpdatePhoto(pIdx, next);
                              }}
                              className="w-full px-2 py-1 text-xs border bg-white font-serif italic"
                            />
                          </div>
                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => setEditingPhotoIndex(null)}
                              className="px-3 py-1 bg-[#141210] text-white text-xs font-mono font-bold uppercase cursor-pointer"
                            >
                              Done Editing
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <div className="relative h-40 bg-black overflow-hidden">
                              <img
                                src={photo.imageUrl}
                                alt={photo.title}
                                className="w-full h-full object-cover"
                              />
                              {photo.highlight && (
                                <div className="absolute top-2 left-2 bg-[#141210]/85 text-white text-[9px] font-mono font-bold px-2 py-0.5 uppercase tracking-wider">
                                  {photo.highlight}
                                </div>
                              )}
                              <div className="absolute bottom-2 right-2 bg-white/90 text-stone-900 text-[9px] font-mono font-bold px-2 py-0.5">
                                #{pIdx + 1}
                              </div>
                            </div>
                            <div className="p-3 space-y-1">
                              <div className="text-[10px] font-mono text-[#1E3A8A] font-bold uppercase">
                                {photo.category}
                              </div>
                              <h4 className="font-serif text-sm font-bold text-stone-950 leading-snug">
                                {photo.title}
                              </h4>
                              <div className="text-[10px] font-mono text-stone-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                                <span className="truncate">{photo.location}</span>
                              </div>
                              <p className="text-xs font-serif text-stone-700 italic line-clamp-2 pt-1">
                                “{photo.caption}”
                              </p>
                            </div>
                          </div>

                          <div className="p-2.5 bg-stone-100 border-t border-stone-300 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => setEditingPhotoIndex(pIdx)}
                              className="px-2.5 py-1 bg-white hover:bg-stone-200 text-stone-800 text-[11px] font-mono font-bold border border-stone-400 flex items-center gap-1 cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(pIdx)}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-mono font-bold border border-red-300 flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: URGENT BULLETINS & WIRES */}
          {chronicleTab === 'bulletins' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Urgent Bursar Bulletin Editor */}
                <div className="bg-white p-5 border-2 border-[#141210] shadow-[3px_3px_0px_#141210] space-y-4">
                  <div className="border-b border-stone-200 pb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A3412] font-bold">
                      LEFT COLUMN ALERT BOX
                    </span>
                    <h3 className="font-serif text-lg font-bold text-stone-900 mt-0.5">
                      Urgent Bursar Bulletin
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                          Bulletin Tag
                        </label>
                        <input
                          type="text"
                          value={chronicle.urgentAlert?.tag || ''}
                          onChange={(e) =>
                            setChronicle({
                              ...chronicle,
                              urgentAlert: { ...(chronicle.urgentAlert || ({} as any)), tag: e.target.value },
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#FAF8F5] border"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                          Deadline Date
                        </label>
                        <input
                          type="text"
                          value={chronicle.urgentAlert?.date || ''}
                          onChange={(e) =>
                            setChronicle({
                              ...chronicle,
                              urgentAlert: { ...(chronicle.urgentAlert || ({} as any)), date: e.target.value },
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#FAF8F5] border"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                        Headline Title
                      </label>
                      <input
                        type="text"
                        value={chronicle.urgentAlert?.title || ''}
                        onChange={(e) =>
                          setChronicle({
                            ...chronicle,
                            urgentAlert: { ...(chronicle.urgentAlert || ({} as any)), title: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-sm font-serif font-bold bg-[#FAF8F5] border"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                        Dateline (e.g. BURSAR’S OFFICE —)
                      </label>
                      <input
                        type="text"
                        value={chronicle.urgentAlert?.dateline || ''}
                        onChange={(e) =>
                          setChronicle({
                            ...chronicle,
                            urgentAlert: { ...(chronicle.urgentAlert || ({} as any)), dateline: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#FAF8F5] border"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                        Bulletin Text
                      </label>
                      <textarea
                        rows={3}
                        value={chronicle.urgentAlert?.text || ''}
                        onChange={(e) =>
                          setChronicle({
                            ...chronicle,
                            urgentAlert: { ...(chronicle.urgentAlert || ({} as any)), text: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs font-serif bg-[#FAF8F5] border"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                        Action Button Label
                      </label>
                      <input
                        type="text"
                        value={chronicle.urgentAlert?.buttonText || ''}
                        onChange={(e) =>
                          setChronicle({
                            ...chronicle,
                            urgentAlert: { ...(chronicle.urgentAlert || ({} as any)), buttonText: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#FAF8F5] border"
                      />
                    </div>
                  </div>
                </div>

                {/* Infrastructure Wire Editor */}
                <div className="bg-white p-5 border-2 border-[#141210] shadow-[3px_3px_0px_#141210] space-y-4">
                  <div className="border-b border-stone-200 pb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#1E3A8A] font-bold">
                      LEFT COLUMN SERVICE WIRE
                    </span>
                    <h3 className="font-serif text-lg font-bold text-stone-900 mt-0.5">
                      Campus Infrastructure Wire
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                          Wire Title
                        </label>
                        <input
                          type="text"
                          value={chronicle.infraWire?.title || ''}
                          onChange={(e) =>
                            setChronicle({
                              ...chronicle,
                              infraWire: { ...(chronicle.infraWire || ({} as any)), title: e.target.value },
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#FAF8F5] border"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                          Wire Tag
                        </label>
                        <input
                          type="text"
                          value={chronicle.infraWire?.tag || ''}
                          onChange={(e) =>
                            setChronicle({
                              ...chronicle,
                              infraWire: { ...(chronicle.infraWire || ({} as any)), tag: e.target.value },
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#FAF8F5] border"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                        Dateline (e.g. NETWORK DISPATCH —)
                      </label>
                      <input
                        type="text"
                        value={chronicle.infraWire?.dateline || ''}
                        onChange={(e) =>
                          setChronicle({
                            ...chronicle,
                            infraWire: { ...(chronicle.infraWire || ({} as any)), dateline: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#FAF8F5] border"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                        Wire Content Prose
                      </label>
                      <textarea
                        rows={3}
                        value={chronicle.infraWire?.text || ''}
                        onChange={(e) =>
                          setChronicle({
                            ...chronicle,
                            infraWire: { ...(chronicle.infraWire || ({} as any)), text: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs font-serif bg-[#FAF8F5] border"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-stone-700 uppercase mb-1">
                        Action Button Label
                      </label>
                      <input
                        type="text"
                        value={chronicle.infraWire?.buttonText || ''}
                        onChange={(e) =>
                          setChronicle({
                            ...chronicle,
                            infraWire: { ...(chronicle.infraWire || ({} as any)), buttonText: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#FAF8F5] border"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Feature Announcements (2-Column Below-the-Fold Broadsheet) */}
              <div className="bg-white p-5 border-2 border-[#141210] shadow-[3px_3px_0px_#141210] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#1E3A8A] font-bold">
                      BROADSHEET BELOW-THE-FOLD
                    </span>
                    <h3 className="font-serif text-lg font-bold text-stone-900 mt-0.5">
                      Secondary Announcements & Official Bulletins ({chronicle.announcements?.length || 0})
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingAnn(true)}
                    className="px-3 py-1.5 bg-[#1E3A8A] hover:bg-[#141210] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Announcement</span>
                  </button>
                </div>

                {/* Add Announcement Form */}
                {isAddingAnn && (
                  <form
                    onSubmit={handleCreateAnn}
                    className="p-4 bg-[#FAF8F5] border-2 border-[#1E3A8A] space-y-3 animate-fadeIn"
                  >
                    <div className="flex items-center justify-between border-b pb-1 font-serif font-bold text-sm">
                      <span>Add New Chronicle Announcement</span>
                      <button type="button" onClick={() => setIsAddingAnn(false)} className="text-stone-500 text-xs">✕</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-stone-600 font-bold mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          required
                          value={newAnn.category}
                          onChange={(e) => setNewAnn({ ...newAnn, category: e.target.value })}
                          className="w-full px-2.5 py-1 text-xs bg-white border"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-stone-600 font-bold mb-1">
                          Dateline
                        </label>
                        <input
                          type="text"
                          value={newAnn.dateline}
                          onChange={(e) => setNewAnn({ ...newAnn, dateline: e.target.value })}
                          className="w-full px-2.5 py-1 text-xs bg-white border"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-stone-600 font-bold mb-1">
                        Announcement Headline
                      </label>
                      <input
                        type="text"
                        required
                        value={newAnn.title}
                        onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                        className="w-full px-2.5 py-1 text-xs bg-white border font-serif font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-stone-600 font-bold mb-1">
                        Summary Prose
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={newAnn.summary}
                        onChange={(e) => setNewAnn({ ...newAnn, summary: e.target.value })}
                        className="w-full px-2.5 py-1 text-xs bg-white border font-serif"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-stone-600 font-bold mb-1">
                          Action Button Label
                        </label>
                        <input
                          type="text"
                          value={newAnn.actionLabel}
                          onChange={(e) => setNewAnn({ ...newAnn, actionLabel: e.target.value })}
                          className="w-full px-2.5 py-1 text-xs bg-white border"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-stone-600 font-bold mb-1">
                          Target View Link
                        </label>
                        <select
                          value={newAnn.actionView}
                          onChange={(e) => setNewAnn({ ...newAnn, actionView: e.target.value })}
                          className="w-full px-2.5 py-1 text-xs bg-white border"
                        >
                          <option value="academic-progress">Academic Progress</option>
                          <option value="library">Library Research</option>
                          <option value="admissions">Admissions</option>
                          <option value="courses">Courses LMS</option>
                          <option value="assignments">Assignments</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAddingAnn(false)}
                        className="px-3 py-1 text-xs font-mono border"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1 text-xs font-mono font-bold bg-[#1E3A8A] text-white"
                      >
                        Publish Announcement
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(chronicle.announcements || []).map((ann, aIdx) => (
                    <div key={ann.id || `ann-${aIdx}`} className="p-3.5 border-2 border-stone-800 bg-[#FAF8F5] space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#1E3A8A] font-bold">
                        <span>{ann.category}</span>
                        <span className="text-stone-500">#{aIdx + 1}</span>
                      </div>
                      <h4 className="font-serif text-sm font-bold text-stone-950">
                        {ann.title}
                      </h4>
                      <p className="text-xs font-serif text-stone-700">
                        {ann.dateline && <span className="font-mono font-bold">{ann.dateline} </span>}
                        {ann.summary}
                      </p>
                      <div className="pt-2 border-t border-stone-300 flex items-center justify-between text-xs font-mono">
                        <span className="text-[#1E3A8A]">{ann.actionLabel}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAnn(aIdx)}
                          className="text-red-700 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FACULTY & MENTORS STUDIO (INTEGRATED) */}
          {chronicleTab === 'faculty' && (
            <div className="bg-white p-5 border-2 border-[#141210] shadow-[3px_3px_0px_#141210] space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Faculty & Mentors Editorial Management ({adminFacultyList.length} Professors)
                  </h3>
                  <p className="text-xs text-stone-500 font-mono">
                    Direct administration of professor profiles, photos, and research areas featured across Kristu Jayanti.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdminIsAddingFaculty(true)}
                    className="px-3.5 py-2 bg-[#1E3A8A] hover:bg-[#141210] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#141210]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Faculty Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      saveStoredFaculty(adminFacultyList);
                      onShowToast('✓ Saved faculty directory changes!');
                    }}
                    className="px-3.5 py-2 bg-[#141210] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Save Faculty</span>
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={adminFacultySearch}
                  onChange={(e) => setAdminFacultySearch(e.target.value)}
                  placeholder="Search faculty by name or specialization..."
                  className="w-full pl-9 pr-4 py-2 text-xs font-mono bg-[#FAF8F5] border border-stone-400"
                />
              </div>

              {/* Faculty Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-1">
                {adminFacultyList
                  .filter((f) =>
                    adminFacultySearch.trim()
                      ? f.name.toLowerCase().includes(adminFacultySearch.toLowerCase()) ||
                        f.specialization.toLowerCase().includes(adminFacultySearch.toLowerCase())
                      : true
                  )
                  .map((fac) => (
                    <div key={fac.id} className="p-3 border border-stone-300 bg-[#FAF8F5] flex items-start gap-3">
                      <img src={fac.photo} alt={fac.name} className="w-14 h-16 object-cover border border-stone-400 shrink-0" />
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="font-serif text-sm font-bold text-stone-900 truncate">{fac.name}</div>
                        <div className="text-[11px] text-[#1E3A8A] font-mono truncate">{fac.designation}</div>
                        <div className="text-[10px] text-stone-600 truncate">{fac.qualification}</div>
                        <button
                          type="button"
                          onClick={() => setAdminEditingFaculty(fac)}
                          className="mt-1 text-[10px] font-mono text-[#1E3A8A] font-bold hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit Profile / Photo</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Edit Faculty Modal */}
              {adminEditingFaculty && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                  <div className="bg-white border-2 border-[#141210] p-4 sm:p-6 max-w-lg w-full space-y-4 max-h-[90dvh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h4 className="font-serif font-bold text-lg">Edit {adminEditingFaculty.name}</h4>
                      <button type="button" onClick={() => setAdminEditingFaculty(null)} className="text-xs font-mono">✕</button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-mono font-bold uppercase mb-1">Photo URL</label>
                        <input
                          type="text"
                          value={adminEditingFaculty.photo}
                          onChange={(e) => setAdminEditingFaculty({ ...adminEditingFaculty, photo: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs font-mono border"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-stone-500 uppercase block mb-1">Presets:</span>
                        <div className="flex flex-wrap gap-1">
                          {OFFICIAL_PHOTO_PRESETS.map((p) => (
                            <button
                              key={p.name}
                              type="button"
                              onClick={() => setAdminEditingFaculty({ ...adminEditingFaculty, photo: p.url })}
                              className="px-2 py-0.5 text-[9px] font-mono bg-stone-100 hover:bg-stone-200 border"
                            >
                              {p.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-mono font-bold uppercase mb-1">Designation</label>
                          <input
                            type="text"
                            value={adminEditingFaculty.designation}
                            onChange={(e) => setAdminEditingFaculty({ ...adminEditingFaculty, designation: e.target.value })}
                            className="w-full px-2.5 py-1.5 text-xs font-mono border"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono font-bold uppercase mb-1">Qualification</label>
                          <input
                            type="text"
                            value={adminEditingFaculty.qualification}
                            onChange={(e) => setAdminEditingFaculty({ ...adminEditingFaculty, qualification: e.target.value })}
                            className="w-full px-2.5 py-1.5 text-xs font-mono border"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold uppercase mb-1">Specialization</label>
                        <input
                          type="text"
                          value={adminEditingFaculty.specialization}
                          onChange={(e) => setAdminEditingFaculty({ ...adminEditingFaculty, specialization: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs font-mono border"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setAdminEditingFaculty(null)}
                        className="px-3 py-1.5 text-xs font-mono border"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = adminFacultyList.map((f) =>
                            f.id === adminEditingFaculty.id ? adminEditingFaculty : f
                          );
                          setAdminFacultyList(updated);
                          saveStoredFaculty(updated);
                          setAdminEditingFaculty(null);
                          onShowToast(`✓ Updated profile for ${adminEditingFaculty.name}`);
                        }}
                        className="px-4 py-1.5 bg-[#1E3A8A] text-white text-xs font-mono font-bold uppercase"
                      >
                        Save Profile
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: STUDY CONTENTS & SYLLABUS */}
          {chronicleTab === 'study-contents' && (
            <div className="bg-white p-5 border-2 border-[#141210] shadow-[3px_3px_0px_#141210] space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Contents of Study & Course Syllabus Management
                  </h3>
                  <p className="text-xs text-stone-500 font-mono">
                    Manage weekly modules, video lectures, reading assignments, and lab quizzes across courses.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    saveStoredCourses(adminCoursesList);
                    onShowToast('✓ Saved course syllabus changes across the University!');
                  }}
                  className="px-4 py-2 bg-[#1E3A8A] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#141210]"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Course Syllabi</span>
                </button>
              </div>

              {/* Course Selector Tabs */}
              <div className="flex flex-wrap gap-2">
                {adminCoursesList.map((course) => (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => setAdminSelectedCourseId(course.id)}
                    className={`px-3 py-1.5 text-xs font-mono font-bold border transition-colors cursor-pointer ${
                      adminSelectedCourseId === course.id
                        ? 'bg-[#141210] text-white border-[#141210]'
                        : 'bg-[#FAF8F5] text-stone-700 border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    {course.code} — {course.title}
                  </button>
                ))}
              </div>

              {/* Selected Course Modules Display */}
              <div className="space-y-4 pt-2">
                <div className="p-3 bg-[#FAF8F5] border border-stone-300 flex items-center justify-between">
                  <div>
                    <span className="font-serif font-bold text-base text-stone-900">
                      {adminSelectedCourse?.code}: {adminSelectedCourse?.title}
                    </span>
                    <span className="text-xs font-mono text-stone-500 block">
                      Instructor: {adminSelectedCourse?.professor} · {adminSelectedCourse?.schedule}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAdminIsAddingModule(true)}
                    className="px-3 py-1.5 bg-[#1E3A8A] text-white text-xs font-mono font-bold uppercase flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Week Module</span>
                  </button>
                </div>

                {/* Add Module Form */}
                {adminIsAddingModule && (
                  <div className="p-4 bg-[#FAF8F5] border-2 border-[#1E3A8A] space-y-3">
                    <div className="font-serif font-bold text-sm">Add New Syllabus Module</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-stone-600 mb-1">Week (e.g. Week 7)</label>
                        <input
                          type="text"
                          value={adminNewModuleWeek}
                          onChange={(e) => setAdminNewModuleWeek(e.target.value)}
                          className="w-full px-2.5 py-1 text-xs border bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-stone-600 mb-1">Module Title</label>
                        <input
                          type="text"
                          value={adminNewModuleTitle}
                          onChange={(e) => setAdminNewModuleTitle(e.target.value)}
                          className="w-full px-2.5 py-1 text-xs border bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-stone-600 mb-1">Module Summary</label>
                      <input
                        type="text"
                        value={adminNewModuleSummary}
                        onChange={(e) => setAdminNewModuleSummary(e.target.value)}
                        className="w-full px-2.5 py-1 text-xs border bg-white"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setAdminIsAddingModule(false)} className="px-3 py-1 text-xs font-mono border">Cancel</button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!adminNewModuleTitle.trim()) return;
                          const createdModule: CourseModule = {
                            id: `mod-${Date.now()}`,
                            week: adminNewModuleWeek || `Week ${(adminSelectedCourse?.modules?.length || 0) + 1}`,
                            title: adminNewModuleTitle,
                            summary: adminNewModuleSummary || '',
                            completed: false,
                            items: [],
                          };
                          const updatedCourses = adminCoursesList.map((c) =>
                            c.id === adminSelectedCourseId
                              ? { ...c, modules: [...(c.modules || []), createdModule] }
                              : c
                          );
                          setAdminCoursesList(updatedCourses);
                          saveStoredCourses(updatedCourses);
                          setAdminIsAddingModule(false);
                          setAdminNewModuleTitle('');
                          setAdminNewModuleSummary('');
                          setAdminNewModuleWeek('');
                          onShowToast(`✓ Added module to ${adminSelectedCourse?.code}`);
                        }}
                        className="px-4 py-1 text-xs font-mono font-bold bg-[#1E3A8A] text-white"
                      >
                        Save Module
                      </button>
                    </div>
                  </div>
                )}

                {/* Modules List */}
                <div className="space-y-3">
                  {(adminSelectedCourse?.modules || []).map((mod, mIdx) => (
                    <div key={mod.id} className="p-3 border border-stone-300 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-[10px] font-mono bg-stone-200 font-bold uppercase">{mod.week}</span>
                          <span className="font-serif font-bold text-sm text-stone-900">{mod.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-stone-500">{mod.items?.length || 0} study items</span>
                      </div>
                      {mod.summary && <p className="text-xs text-stone-600 font-serif italic">{mod.summary}</p>}
                      <div className="pl-4 border-l-2 border-stone-300 space-y-1 pt-1">
                        {(mod.items || []).map((item) => (
                          <div key={item.id} className="text-xs font-mono flex items-center justify-between py-0.5 text-stone-700">
                            <span className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-[#1E3A8A] uppercase">[{item.type}]</span>
                              <span>{item.title}</span>
                            </span>
                            <span className="text-[10px] text-stone-500">{item.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
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
            { name: 'Canvas / KJIT LMS', standards: 'LTI 1.3 · Common Cartridge · cmi5', sync: '2 mins ago', status: 'Connected' },
            { name: 'Okta & Shibboleth Identity Federation', standards: 'SAML 2.0 · OAuth 2.0 · SCIM 2.0', sync: 'Real-time', status: 'Connected' },
            { name: 'Learning Record Warehouse', standards: 'xAPI (Tin Can) · SCORM 2004', sync: '5 mins ago', status: 'Connected' },
            { name: 'Kristu Jayanti Bursar & Tuition Gateway', standards: 'PCI-DSS Level 1 · ISO 20022', sync: '14 mins ago', status: 'Connected' },
            { name: 'Slate Admissions & Advising CRM', standards: 'REST Webhook · OAuth 2.0', sync: '8 mins ago', status: 'Connected' },
            { name: 'Kristu Jayanti Library OCLC & IEEE/ACM', standards: 'MARC21 · Z39.50 · OpenURL', sync: '1 hour ago', status: 'Connected' },
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
