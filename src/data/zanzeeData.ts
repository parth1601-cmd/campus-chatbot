import {
  Course,
  AssignmentItem,
  CalendarEventItem,
  CampusServiceItem,
  LibraryResource,
  NotificationItem,
  MessageThread,
  ChatMessage,
  CourseCatalogItem,
  PersonalizedCourseRecommendation,
  AssistantConversation,
} from '../types';
import campusQuadImg from '../assets/images/zanzee_campus_quad_1790837231247.jpg';
import avatarParthImg from '../assets/images/avatar_alex_morgan_1790837247015.jpg';
import courseCsImg from '../assets/images/course_cs_architecture_1790837259552.jpg';
import libraryRoomImg from '../assets/images/zanzee_library_reading_room_1790837270358.jpg';

export const ASSETS = {
  campusQuad: campusQuadImg,
  avatarParth: avatarParthImg,
  avatarAlex: avatarParthImg,
  courseCs: courseCsImg,
  libraryRoom: libraryRoomImg,
  kjuCampusMain: 'https://d2di5o2d0ilx7p.cloudfront.net/event-images/2025/kju-new-campus-2.jpg',
  kjuGreenCampus: 'https://www.kristujayanti.edu.in/images/new-banners/green-campus.jpg',
  kjuAuditorium: 'https://d2di5o2d0ilx7p.cloudfront.net/Happening-Today/03-10/01.jpg',
  kjuGreenAward: 'https://d2di5o2d0ilx7p.cloudfront.net/event-images/2026/green-ranking-2025.jpg',
};

export interface CampusPhotoDispatch {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  caption: string;
  location: string;
  highlight?: string;
}

export const KRISTU_JAYANTI_CAMPUS_PHOTOS: CampusPhotoDispatch[] = [
  {
    id: 'kju-main',
    title: 'Kristu Jayanti University New Campus & Technology Complex',
    category: 'Campus Architecture',
    imageUrl: 'https://d2di5o2d0ilx7p.cloudfront.net/event-images/2025/kju-new-campus-2.jpg',
    caption: 'State-of-the-art academic complexes, research wings, and technology suites at Kristu Jayanti University, Bengaluru.',
    location: 'K. Narayanapura, Kothanur P.O., Bengaluru',
    highlight: 'Official New Campus',
  },
  {
    id: 'kju-green',
    title: 'Lush Botanical Lawns & Eco-Centric Green Campus',
    category: 'Sustainability',
    imageUrl: 'https://www.kristujayanti.edu.in/images/new-banners/green-campus.jpg',
    caption: 'Consistently ranked among the cleanest and greenest university campuses with solar power arrays and medicinal plant conservatories.',
    location: 'Eco-Park & Main Quadrangle',
    highlight: 'Clean & Green Campus Benchmark',
  },
  {
    id: 'kju-auditorium',
    title: 'Grand Academic Auditorium & Annual Jayantian Conclave',
    category: 'Academic Life',
    imageUrl: 'https://d2di5o2d0ilx7p.cloudfront.net/Happening-Today/03-10/01.jpg',
    caption: 'High-capacity acoustically engineered auditoriums hosting international symposiums, hackathons, and postgraduate assemblies.',
    location: 'Main Auditorium Complex',
    highlight: 'International Research Conclave',
  },
  {
    id: 'kju-ranking',
    title: 'Green University Ranking & Institutional Accreditations',
    category: 'Accreditation',
    imageUrl: 'https://d2di5o2d0ilx7p.cloudfront.net/event-images/2026/green-ranking-2025.jpg',
    caption: 'Honouring Kristu Jayanti’s highest grade institutional accreditations and environmental performance recognitions.',
    location: 'Deemed to be University Campus',
    highlight: 'NAAC A++ / NIRF Top Rank',
  },
];

export interface ChronicleHeroStory {
  badge: string;
  locationTag: string;
  headline: string;
  deck: string;
  byline: string;
  readTime: string;
  imageUrl: string;
  imageCaption: string;
  imageBadge: string;
  bodyParagraph1: string;
  bodyParagraph2: string;
  datelineText: string;
  action1Text: string;
  action2Text: string;
  action3Text: string;
}

export interface ChronicleUrgentAlert {
  tag: string;
  date: string;
  title: string;
  dateline: string;
  text: string;
  buttonText: string;
}

export interface ChronicleAnnouncementItem {
  id: string;
  category: string;
  title: string;
  dateline: string;
  summary: string;
  actionLabel: string;
  actionView: string;
}

export interface ChronicleInfraWire {
  title: string;
  tag: string;
  dateline: string;
  text: string;
  buttonText: string;
}

export interface ChronicleConfig {
  mastheadTitle: string;
  tagline: string;
  institutionName: string;
  accreditation: string;
  dateline: string;
  telegraphGreeting: string;
  urgentAlert: ChronicleUrgentAlert;
  infraWire: ChronicleInfraWire;
  heroStory: ChronicleHeroStory;
  campusPhotos: CampusPhotoDispatch[];
  announcements: ChronicleAnnouncementItem[];
}

export const DEFAULT_CHRONICLE_CONFIG: ChronicleConfig = {
  mastheadTitle: 'The Kristu Chronicle',
  tagline: '“Fests, Photos & General Campus News — Official Student Newspaper”',
  institutionName: 'KRISTU JAYANTI COLLEGE · AUTONOMOUS BENGALURU',
  accreditation: 'Accredited ‘A++’ Grade by NAAC · Managed by CMI Fathers',
  dateline: 'VOL. CXIV · NO. 42 · THURSDAY, OCTOBER 1, 2026 · MORNING EDITION',
  telegraphGreeting: 'Fest updates, photos & general campus news.',
  urgentAlert: {
    tag: 'FEST BULLETIN',
    date: 'THIS WEEK',
    title: 'Annual College Fest — Dates Announced',
    dateline: 'FEST DESK —',
    text: 'The annual college fest schedule, venues and event list have been announced. Check the fest calendar for dates and the photo gallery for highlights.',
    buttonText: 'View Fest Schedule',
  },
  infraWire: {
    title: 'General Notice',
    tag: 'CAMPUS',
    dateline: 'CAMPUS DESK —',
    text: 'General campus announcements, event timings and venue updates will appear here.',
    buttonText: 'View Events Calendar →',
  },
  heroStory: {
    badge: 'LEAD FEST STORY · THIS WEEK',
    locationTag: 'MAIN CAMPUS · FEST GROUND',
    headline: 'Annual College Fest Brings Music, Food Stalls & Inter-College Events to Campus',
    deck: 'Three days of cultural performances, competitions and exhibitions — see full fest schedule, venues and photo highlights.',
    byline: 'By The Kristu Chronicle · Fest Desk',
    readTime: '3 Min Read · Campus News',
    imageUrl: 'https://d2di5o2d0ilx7p.cloudfront.net/event-images/2025/kju-new-campus-2.jpg',
    imageCaption: 'Fig. 1 — Fest crowd at the main campus ground during the annual college fest.',
    imageBadge: 'Fest Photo',
    bodyParagraph1: 'The campus came alive this week as students gathered for the annual fest — music performances, food stalls, art exhibitions and inter-college competitions across three days.',
    bodyParagraph2: 'Organisers have released the full event list with venues and timings. Browse the fest photo gallery below and check the events calendar for upcoming programmes.',
    datelineText: 'CAMPUS, THIS WEEK —',
    action1Text: 'View Fest Photos',
    action2Text: 'Fest Schedule',
    action3Text: 'General News',
  },
  campusPhotos: KRISTU_JAYANTI_CAMPUS_PHOTOS,
  announcements: [
    {
      id: 'ann-1',
      category: 'FESTS & CULTURAL EVENTS',
      title: 'Inter-College Fest Competitions: Music, Dance & Drama — Registrations Open',
      dateline: 'FEST DESK —',
      summary: 'Registrations are open for inter-college music, dance, drama and art competitions. Check venues and timings in the events calendar.',
      actionLabel: 'View Fest Calendar →',
      actionView: 'calendar',
    },
    {
      id: 'ann-2',
      category: 'GENERAL CAMPUS NEWS',
      title: 'Campus Photo Exhibition & General Assembly This Week',
      dateline: 'CAMPUS DESK —',
      summary: 'A general photo exhibition of recent fests and campus programmes is on display. All students are invited to visit and view highlights.',
      actionLabel: 'View Photo Gallery →',
      actionView: 'dashboard',
    },
  ],
};

export function getStoredChronicle(): ChronicleConfig {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = localStorage.getItem('kjit_chronicle_config');
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && (parsed.mastheadTitle || parsed.heroStory)) {
          return {
            ...DEFAULT_CHRONICLE_CONFIG,
            ...parsed,
            urgentAlert: { ...DEFAULT_CHRONICLE_CONFIG.urgentAlert, ...(parsed.urgentAlert || {}) },
            infraWire: { ...DEFAULT_CHRONICLE_CONFIG.infraWire, ...(parsed.infraWire || {}) },
            heroStory: { ...DEFAULT_CHRONICLE_CONFIG.heroStory, ...(parsed.heroStory || {}) },
            campusPhotos: Array.isArray(parsed.campusPhotos) && parsed.campusPhotos.length > 0
              ? parsed.campusPhotos
              : DEFAULT_CHRONICLE_CONFIG.campusPhotos,
            announcements: Array.isArray(parsed.announcements) && parsed.announcements.length > 0
              ? parsed.announcements
              : DEFAULT_CHRONICLE_CONFIG.announcements,
          };
        }
      }
    }
  } catch (e) {
    console.error('Failed to read stored chronicle:', e);
  }
  return DEFAULT_CHRONICLE_CONFIG;
}

export function saveStoredChronicle(config: ChronicleConfig): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('kjit_chronicle_config', JSON.stringify(config));
      window.dispatchEvent(new CustomEvent('kjit_chronicle_updated', { detail: config }));
    }
  } catch (e) {
    console.error('Failed to save stored chronicle config:', e);
  }
}

export const STUDENT_PERSONA = {
  name: 'Parth Pimplapure',
  id: '26MCAD30',
  email: 'ppimplapure@kjit.edu.in',
  program: 'MCA · Division D',
  major: 'Computer Applications',
  minor: 'Artificial Intelligence & Systems',
  college: 'Kristu Jayanti Institute of Technology',
  semester: 'Fall 2026',
  year: 'MCA Year 1 · Division D',
  advisor: 'Dr. Miriam Hawthorne',
  gpa: '3.82',
  creditsCompleted: 72,
  creditsTotal: 120,
  creditsRequired: 120,
  expectedGraduation: 'May 2028',
  statedInterests: [
    'Data Structures',
    'Algorithms & Optimization',
    'Artificial Intelligence',
    'Ethics & Algorithmic Justice',
    'Systems & Architecture',
    'Visual Journalism & Broadsheet Typography',
  ],
  degreeAudit: {
    majorCoreCompleted: 34,
    majorCoreTotal: 54,
    generalEducationCompleted: 26,
    generalEducationTotal: 36,
    electivesCompleted: 12,
    electivesTotal: 30,
  },
  completedCourseCodes: ['CS 101', 'CS 102', 'MATH 110', 'MATH 115', 'ENG 101', 'HIST 101', 'PHYS 101', 'PHIL 101'],
  currentCourseCodes: ['CS 201', 'MATH 210', 'BIO 101', 'ENG 105'],
};

export const COURSES: Course[] = [
  {
    id: 'cs-201',
    code: 'CS 201',
    title: 'Data Structures & Algorithmic Systems',
    professor: 'Professor Sarah Johnson',
    professorRole: 'Chair of Computer Science • Turing Fellow',
    department: 'Computer Science',
    credits: 4,
    progress: 72,
    currentGrade: 'A-',
    numericScore: 91.8,
    nextClass: 'Today · 1:00 PM',
    room: 'Turing Hall 302',
    nextAssignmentTitle: 'Binary Trees',
    nextAssignmentDue: 'Due Friday · Oct 9 at 11:59 PM',
    description:
      'Rigorous investigation of hierarchical data structures, balanced search trees, hash tables, graph traversals, and amortized algorithmic complexity with archival C++ and TypeScript implementations.',
    modules: [
      {
        id: 'mod-1',
        week: 'Week 1',
        title: 'Asymptotic Analysis & Memory Layout',
        summary: 'Big-O, Omega, and Theta bounds; contiguous vs. linked pointer allocation.',
        items: [
          { id: 'm1-1', type: 'video', title: 'Lecture 1: Amortized Complexity in Dynamic Arrays', durationOrDue: '48 min', completed: true },
          { id: 'm1-2', type: 'reading', title: 'KJIT CS Monograph Ch. 1–2: Pointer Arithmetic', durationOrDue: '25 min read', completed: true },
          { id: 'm1-3', type: 'quiz', title: 'Asymptotic Recurrence Verification Quiz', durationOrDue: 'Score: 10/10', completed: true },
        ],
      },
      {
        id: 'mod-2',
        week: 'Week 2',
        title: 'Stacks, Queues & Deques in Operating Kernels',
        summary: 'Ring buffers, call stacks, and lock-free queue invariants.',
        items: [
          { id: 'm2-1', type: 'video', title: 'Lecture 2: Call Frames & Recursion Traces', durationOrDue: '52 min', completed: true },
          { id: 'm2-2', type: 'assignment', title: 'Lab 2: Circular Buffer Packet Scheduler', durationOrDue: 'Graded: 96%', completed: true },
        ],
      },
      {
        id: 'mod-3',
        week: 'Week 3',
        title: 'Binary Search Trees & Structural Induction',
        summary: 'BST ordering invariant, recursive insertion, deletion with in-order successors.',
        items: [
          { id: 'm3-1', type: 'video', title: 'Lecture 3: Binary Search Trees & AVL Rotations', durationOrDue: '55 min', completed: true },
          { id: 'm3-2', type: 'reading', title: 'Archival Note: Adelson-Velsky & Landis (1962)', durationOrDue: '18 min read', completed: true },
          { id: 'm3-3', type: 'assignment', title: 'Lab 4: Binary Trees Implementation', durationOrDue: 'Due Friday · 11:59 PM', completed: false },
        ],
      },
      {
        id: 'mod-4',
        week: 'Week 4',
        title: 'Red-Black Trees, B-Trees & Database Indices',
        summary: 'External memory B+ trees powering university archival catalogs and SQL engines.',
        items: [
          { id: 'm4-1', type: 'video', title: 'Lecture 4: 2-3-4 Trees & Red-Black Isomorphism', durationOrDue: '50 min', completed: false },
          { id: 'm4-2', type: 'quiz', title: 'Tree Rotation Diagnostic Check', durationOrDue: 'Opens Oct 12', completed: false },
        ],
      },
    ],
  },
  {
    id: 'math-210',
    code: 'MATH 210',
    title: 'Discrete Mathematics & Combinatorial Proof',
    professor: 'Professor David Chen',
    professorRole: 'Associate Professor of Pure Mathematics',
    department: 'Mathematics',
    credits: 4,
    progress: 68,
    currentGrade: 'B+',
    numericScore: 88.4,
    nextClass: 'Tomorrow · 10:00 AM',
    room: 'Euler Pavilion 104',
    nextAssignmentTitle: 'Graph Coloring Proofs',
    nextAssignmentDue: 'Due Monday · Oct 12',
    description:
      'Formal logic, mathematical induction, modular number theory, recurrence relations, and planar graph theory with applications to computer science.',
    modules: [
      {
        id: 'math-m1',
        week: 'Week 1',
        title: 'Propositional Logic & Quantifiers',
        summary: 'De Morgan laws, contrapositive proofs, and formal deduction.',
        items: [
          { id: 'mm1', type: 'video', title: 'Lecture: Constructive vs. Non-Constructive Proofs', durationOrDue: '45 min', completed: true },
          { id: 'mm2', type: 'assignment', title: 'Problem Set 3: Strong Induction', durationOrDue: 'Graded: 90%', completed: true },
        ],
      },
      {
        id: 'math-m2',
        week: 'Week 2',
        title: 'Graph Isomorphism & Chromatic Polynomials',
        summary: 'Eulerian circuits, Hamiltonian paths, and K-coloring bounds.',
        items: [
          { id: 'mm3', type: 'reading', title: 'KJIT Mathematical Gazette: Four-Color Theorem', durationOrDue: '30 min read', completed: true },
          { id: 'mm4', type: 'assignment', title: 'Problem Set 4: Graph Coloring Proofs', durationOrDue: 'Due Oct 12', completed: false },
        ],
      },
    ],
  },
  {
    id: 'bio-101',
    code: 'BIO 101',
    title: 'General Biology: Cellular & Genomic Foundations',
    professor: 'Professor Elena Rostova',
    professorRole: 'Director of Kristu Jayanti Life Sciences Institute',
    department: 'Biological Sciences',
    credits: 4,
    progress: 84,
    currentGrade: 'A',
    numericScore: 95.2,
    nextClass: 'Thursday · 2:30 PM',
    room: 'Darwin Lab 210',
    nextAssignmentTitle: 'Cellular Respiration Lab Report',
    nextAssignmentDue: 'Due Today · 6:00 PM',
    description:
      'Molecular architecture of life, enzyme kinetics, metabolic pathways, Mendelian and epigenetic inheritance, and CRISPR gene regulation.',
    modules: [
      {
        id: 'bio-m1',
        week: 'Week 1',
        title: 'Bioenergetics & Mitochondrial ATP Synthesis',
        summary: 'Chemiosmotic coupling and oxidative phosphorylation.',
        items: [
          { id: 'bm1', type: 'video', title: 'Lab Briefing: Spectrophotometry & NADH Assay', durationOrDue: '38 min', completed: true },
          { id: 'bm2', type: 'assignment', title: 'Cellular Respiration Lab Report', durationOrDue: 'Due Today · 6:00 PM', completed: false },
        ],
      },
    ],
  },
  {
    id: 'eng-105',
    code: 'ENG 105',
    title: 'Academic Writing & The Archival Broadsheet',
    professor: 'Professor Marcus Vance',
    professorRole: 'Faculty Advisor, The Kristu Jayanti Chronicle',
    department: 'Rhetoric & Humanities',
    credits: 4,
    progress: 79,
    currentGrade: 'A-',
    numericScore: 92.1,
    nextClass: 'Wednesday · 11:00 AM',
    room: 'Chronicle House 108',
    nextAssignmentTitle: 'Archival Monograph Essay',
    nextAssignmentDue: 'Due Wednesday · Oct 14',
    description:
      'Seminar in critical argumentation, primary-source archival research at Kristu Jayanti Special Collections, and long-form public scholarship.',
    modules: [
      {
        id: 'eng-m1',
        week: 'Week 1',
        title: 'The Rhetoric of Institutional Memory',
        summary: 'Synthesizing primary manuscripts and structured citation frameworks.',
        items: [
          { id: 'em1', type: 'reading', title: 'Kristu Jayanti Press Stylebook & Archival Citation Guide', durationOrDue: '22 min read', completed: true },
          { id: 'em2', type: 'assignment', title: 'Archival Monograph Draft (2,500 words)', durationOrDue: 'Due Oct 14', completed: false },
        ],
      },
    ],
  },
];

export function getStoredCourses(): Course[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = localStorage.getItem('kjit_courses_data');
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.error('Failed to read stored courses:', e);
  }
  return COURSES;
}

export function saveStoredCourses(courses: Course[]): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('kjit_courses_data', JSON.stringify(courses));
      window.dispatchEvent(new CustomEvent('kjit_courses_updated', { detail: courses }));
    }
  } catch (e) {
    console.error('Failed to save stored courses:', e);
  }
}

export const ASSIGNMENTS: AssignmentItem[] = [
  {
    id: 'asg-bio-lab',
    courseId: 'bio-101',
    courseCode: 'BIO 101',
    title: 'Cellular Respiration Spectrophotometry Report',
    dueDate: 'Today · 6:00 PM',
    dueBucket: 'today',
    progress: 85,
    priority: 'High',
    points: '50 pts',
    statusText: 'Final Discussion Section Remaining',
  },
  {
    id: 'asg-cs-bst',
    courseId: 'cs-201',
    courseCode: 'CS 201',
    title: 'Binary Trees — Recursive Search, Insertion & AVL Balance',
    dueDate: 'Friday, Oct 9 · 11:59 PM',
    dueBucket: 'week',
    progress: 65,
    priority: 'High',
    points: '100 pts',
    statusText: '4 of 6 Unit Tests Passing',
  },
  {
    id: 'asg-math-graph',
    courseId: 'math-210',
    courseCode: 'MATH 210',
    title: 'Problem Set 4: Planar Graph Coloring Proofs',
    dueDate: 'Monday, Oct 12 · 5:00 PM',
    dueBucket: 'week',
    progress: 30,
    priority: 'Medium',
    points: '40 pts',
    statusText: '2 of 5 Proofs Drafted in LaTeX',
  },
  {
    id: 'asg-eng-essay',
    courseId: 'eng-105',
    courseCode: 'ENG 105',
    title: 'Archival Monograph: History of Computing at Kristu Jayanti Institute of Technology',
    dueDate: 'Wednesday, Oct 14 · 11:59 PM',
    dueBucket: 'upcoming',
    progress: 45,
    priority: 'Medium',
    points: '150 pts',
    statusText: 'Annotated Bibliography Approved',
  },
  {
    id: 'asg-cs-midterm-prep',
    courseId: 'cs-201',
    courseCode: 'CS 201',
    title: 'Practice Benchmark: Hash Table Collision Resolution',
    dueDate: 'Monday, Oct 19 · 11:59 PM',
    dueBucket: 'upcoming',
    progress: 10,
    priority: 'Standard',
    points: '60 pts',
    statusText: 'Starter Repository Cloned',
  },
  {
    id: 'asg-cs-ring',
    courseId: 'cs-201',
    courseCode: 'CS 201',
    title: 'Lab 2: Lock-Free Ring Buffer Queue',
    dueDate: 'Submitted Sep 28',
    dueBucket: 'completed',
    progress: 100,
    priority: 'Standard',
    points: '96 / 100 pts',
    statusText: 'Graded · A',
  },
  {
    id: 'asg-math-ind',
    courseId: 'math-210',
    courseCode: 'MATH 210',
    title: 'Problem Set 3: Structural & Strong Induction',
    dueDate: 'Submitted Sep 25',
    dueBucket: 'completed',
    progress: 100,
    priority: 'Standard',
    points: '36 / 40 pts',
    statusText: 'Graded · A-',
  },
];

export const CALENDAR_EVENTS: CalendarEventItem[] = [
  {
    id: 'ev-1',
    title: 'CS 201 Lecture: Binary Search Trees',
    courseOrDept: 'CS 201',
    date: 'Oct 5, 2026',
    dayOfMonth: 5,
    time: '1:00 PM – 2:15 PM',
    location: 'Turing Hall 302',
    type: 'Class',
  },
  {
    id: 'ev-2',
    title: 'BIO 101 Lab Report Due',
    courseOrDept: 'BIO 101',
    date: 'Oct 5, 2026',
    dayOfMonth: 5,
    time: '6:00 PM',
    location: 'KJIT LMS Portal',
    type: 'Assignment',
  },
  {
    id: 'ev-3',
    title: 'MATH 210 Lecture: Chromatic Polynomials',
    courseOrDept: 'MATH 210',
    date: 'Oct 6, 2026',
    dayOfMonth: 6,
    time: '10:00 AM – 11:15 AM',
    location: 'Euler Pavilion 104',
    type: 'Class',
  },
  {
    id: 'ev-4',
    title: 'Academic Advising Check-In with Dr. Hawthorne',
    courseOrDept: 'Academic Advising',
    date: 'Oct 7, 2026',
    dayOfMonth: 7,
    time: '2:00 PM – 2:30 PM',
    location: 'Founders Hall 204',
    type: 'Advising',
  },
  {
    id: 'ev-5',
    title: 'CS 201 Assignment: Binary Trees Due',
    courseOrDept: 'CS 201',
    date: 'Oct 9, 2026',
    dayOfMonth: 9,
    time: '11:59 PM',
    location: 'GitAutograder',
    type: 'Assignment',
  },
  {
    id: 'ev-6',
    title: 'Kristu Jayanti Fall Convocation & Broadsheet Symposium',
    courseOrDept: 'Kristu Jayanti College Events',
    date: 'Oct 11, 2026',
    dayOfMonth: 11,
    time: '4:00 PM – 6:30 PM',
    location: 'Great Quadrangle & Chapel',
    type: 'Campus Event',
  },
  {
    id: 'ev-7',
    title: 'Financial Aid Proof of Enrollment Deadline',
    courseOrDept: 'Financial Aid Office',
    date: 'Oct 15, 2026',
    dayOfMonth: 15,
    time: '5:00 PM',
    location: 'Bursar Hall 101 / Online',
    type: 'Advising',
  },
  {
    id: 'ev-8',
    title: 'BIO 101 Midterm Examination',
    courseOrDept: 'BIO 101',
    date: 'Oct 16, 2026',
    dayOfMonth: 16,
    time: '2:30 PM – 4:00 PM',
    location: 'Darwin Auditorium',
    type: 'Exam',
  },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'student',
    text: 'What classes do I have tomorrow?',
    timestamp: '9:41 AM',
    channel: 'Web Chat',
  },
  {
    id: 'msg-2',
    sender: 'ai',
    text: '## Answer\nYou have **3 classes tomorrow**:\n\n- **10:00 AM** — CS 201: Data Structures (Room 204)\n- **1:00 PM** — MATH 210: Discrete Mathematics (Room 108)\n- **3:00 PM** — BIO 101: General Biology (Science Building)\n\n### Next Steps\n1. Review the Week 6 Binary Tree notes before CS 201.\n2. Complete problem set draft for MATH 210.\n3. Bring laboratory safety goggles to BIO 101 in the Science Building.\n\n### Source\nAuthorized Student Schedule (Parth Pimplapure, #26MCAD30) & Academic Calendar 2026–27.',
    timestamp: '9:41 AM',
    channel: 'Web Chat',
    confidence: 'high',
    confidenceLabel: 'HIGH CONFIDENCE',
    intent: 'CALENDAR',
    responseMode: 'GENERAL ASSISTANT',
    knowledgeLevel: 'LEVEL 1 — Student-Specific Authorized Information',
    providerUsed: 'Campus Assistant Intent Engine · Verified SIS RAG',
    cardType: 'schedule',
    cardData: {
      summary: 'You have 3 classes tomorrow.',
      classes: [
        { time: '10:00 AM', code: 'CS 201', title: 'Data Structures', room: 'Room 204 (Turing Hall)', professor: 'Prof. Sarah Johnson' },
        { time: '1:00 PM', code: 'MATH 210', title: 'Discrete Mathematics', room: 'Room 108 (Euler Pavilion)', professor: 'Prof. Marcus Vance' },
        { time: '3:00 PM', code: 'BIO 101', title: 'General Biology', room: 'Science Building (Room 214)', professor: 'Dr. Elena Rostova' },
      ],
    },
    sources: [
      {
        id: 'src-cal-1',
        title: 'Authorized Student Schedule — Fall 2026',
        department: 'Office of the University Registrar',
        updatedAt: 'Updated September 20, 2026',
        version: 'SIS-Live-2026',
        section: 'Enrolled Section Timetable (Parth Pimplapure)',
        excerpt: 'CS 201: Data Structures (10:00 AM, Room 204); MATH 210: Discrete Math (1:00 PM, Room 108); BIO 101: Biology (3:00 PM, Science Bldg).',
      },
    ],
    suggestedActions: [
      { label: 'View Full Schedule', targetView: 'calendar' },
      { label: 'Open CS 201 Course', targetView: 'course-detail', payload: 'cs-201' },
    ],
  },
];

export const DEFAULT_ASSISTANT_CONVERSATIONS: AssistantConversation[] = [
  {
    id: 'conv-reg',
    title: 'Course Registration',
    category: 'Academics',
    timestamp: 'Just now',
    preview: 'Spring 2027 Registration & Degree Requirements...',
    messages: [
      {
        id: 'reg-msg-1',
        sender: 'student',
        text: 'Help me register for next semester.',
        timestamp: '10:15 AM',
        channel: 'Web Chat',
      },
      {
        id: 'reg-msg-2',
        sender: 'ai',
        text: '## Answer\nSwitching into your **Spring 2027 Course Registration Workflow**:\n\n- **Current Program:** MCA · Division D (Fall 2026)\n- **Completed Credits:** **72 of 120 credits (60%)**\n- **Required Credits Remaining:** **48 credits** (20 Major Core, 10 GenEd, 18 Electives)\n- **Registration Status:** Opens **October 12 at 8:00 AM**\n\n### Available Courses & Prerequisites\nI analyzed your transcript and identified 4 recommended courses where all prerequisites are satisfied with zero schedule conflicts.\n\n### Next Steps\nPre-bookmark your selections below before your enrollment window opens.',
        timestamp: '10:15 AM',
        channel: 'Web Chat',
        confidence: 'high',
        confidenceLabel: 'HIGH CONFIDENCE',
        intent: 'REGISTRATION',
        responseMode: 'ACADEMIC ADVISOR',
        knowledgeLevel: 'LEVEL 1 & LEVEL 2 — Degree Audit & Course Catalog',
        cardType: 'registration',
        cardData: {
          currentProgram: 'MCA · Division D',
          completedCredits: 72,
          requiredCredits: 120,
          remainingCredits: 48,
          registrationStatus: 'Opens October 12 at 8:00 AM',
          scheduleConflicts: 'No timetable conflicts detected for recommended schedule.',
          availableCourses: [
            { code: 'CS 310', title: 'Algorithms & Complexity', credits: 4, prereqs: 'CS 201, MATH 210', prereqsMet: true, schedule: 'Mon & Wed · 10:00 AM – 11:30 AM', room: 'Turing Hall 304' },
            { code: 'CS 340', title: 'Operating Systems', credits: 4, prereqs: 'CS 201', prereqsMet: true, schedule: 'Tue & Thu · 1:00 PM – 2:30 PM', room: 'Turing Hall 208' },
            { code: 'MATH 305', title: 'Linear Algebra', credits: 3, prereqs: 'MATH 210', prereqsMet: true, schedule: 'Tue & Thu · 9:00 AM – 10:30 AM', room: 'Euler Pavilion 102' },
            { code: 'PHIL 220', title: 'Ethics in Technology', credits: 4, prereqs: 'None', prereqsMet: true, schedule: 'Tue & Thu · 10:00 AM – 11:30 AM', room: 'Founders Hall 106' },
          ],
        },
        sources: [
          {
            id: 'src-reg-1',
            title: 'Academic Calendar 2026–27',
            department: 'Office of the Registrar',
            updatedAt: 'Updated September 20, 2026',
            version: 'v2026.4',
            section: 'Registration Windows & Priority Dates',
            excerpt: 'According to the 2026–27 Academic Calendar, registration opens October 12 at 8:00 AM.',
          },
          {
            id: 'src-reg-2',
            title: 'Computer Applications (MCA Division D) Degree Audit',
            department: 'Department of Computer Applications (MCA)',
            updatedAt: 'Updated September 15, 2026',
            version: 'Degree Audit v2026',
            section: 'Degree Requirements: 72/120 Credits Completed',
            excerpt: 'Student Parth Pimplapure has completed 72 credits; 48 credits remain for graduation (expected May 2028).',
          },
        ],
        suggestedActions: [
          { label: 'View Academic Progress', targetView: 'academic-progress' },
          { label: 'Connect with Advisor', targetView: 'messages' },
        ],
      },
    ],
  },
  {
    id: 'conv-cs201',
    title: 'CS 201 Assignment',
    category: 'Courses',
    timestamp: '25m ago',
    preview: 'What assignments are due this week?...',
    messages: [
      {
        id: 'cs201-msg-1',
        sender: 'student',
        text: 'What assignments are due this week?',
        timestamp: '9:41 AM',
        channel: 'Web Chat',
      },
      {
        id: 'cs201-msg-2',
        sender: 'ai',
        text: '## Answer\nHere are your upcoming assignments across your enrolled courses this week:\n\n- **Due Tomorrow:** CS 201 — Binary Trees (11:59 PM)\n- **Due Thursday:** MATH 210 — Problem Set 4 (5:00 PM)\n- **Due Friday:** ENG 105 — Research Essay (11:59 PM)\n\n### Next Steps\nUse the buttons below to open your assignment in the code runner or set calendar reminders.',
        timestamp: '9:41 AM',
        channel: 'Web Chat',
        confidence: 'high',
        confidenceLabel: 'HIGH CONFIDENCE',
        intent: 'ASSIGNMENTS',
        responseMode: 'GENERAL ASSISTANT',
        knowledgeLevel: 'LEVEL 1 & LEVEL 3 — Student LMS Record & Course Syllabus',
        cardType: 'assignments',
        cardData: {
          items: [
            { dueLabel: 'Due Tomorrow', code: 'CS 201', title: 'Binary Trees', dueTime: '11:59 PM', progress: 65, courseId: 'cs-201', priority: 'High' },
            { dueLabel: 'Due Thursday', code: 'MATH 210', title: 'Problem Set 4', dueTime: '5:00 PM', progress: 40, courseId: 'math-210', priority: 'Medium' },
            { dueLabel: 'Due Friday', code: 'ENG 105', title: 'Research Essay', dueTime: '11:59 PM', progress: 20, courseId: 'eng-105', priority: 'Standard' },
          ],
        },
        sources: [
          {
            id: 'src-asg-201',
            title: 'CS 201 Course Schedule & LMS Gradebook',
            department: 'Department of Computer Science',
            updatedAt: 'Updated 2 hours ago',
            version: 'Fall 2026 v3.1',
            section: 'Module 3 Deliverable: Binary Trees',
            excerpt: 'Due Friday, October 9 at 11:59 PM. Autograder evaluates insert, find, min, inorder, deleteNode, and heightBalance.',
          },
        ],
        suggestedActions: [
          { label: 'Open Assignment', targetView: 'assignments' },
          { label: 'View Course', targetView: 'courses' },
          { label: 'Add Reminder', targetView: 'calendar' },
        ],
      },
    ],
  },
  {
    id: 'conv-finaid',
    title: 'Financial Aid',
    category: 'Finance',
    timestamp: '2h ago',
    preview: 'Proof of Enrollment due October 15...',
    messages: [
      {
        id: 'fa-msg-1',
        sender: 'student',
        text: 'I need financial aid help. What documents are missing and when is tuition due?',
        timestamp: '8:30 AM',
        channel: 'Web Chat',
      },
      {
        id: 'fa-msg-2',
        sender: 'ai',
        text: '## Answer\nHere is your financial aid and billing breakdown:\n\n- **2026–27 Aid Package:** **$22,400** ($11,200 Fall Term)\n- **Fall Net Balance Due:** **$2,400** (Due **October 15, 2026**)\n- **Action Required:** Signed **Proof of Enrollment (Form FA-104)** is missing and must be uploaded by **October 15** to prevent an administrative hold.\n\n### Next Steps\nUpload your completed document below or contact financial aid directly.',
        timestamp: '8:30 AM',
        channel: 'Web Chat',
        confidence: 'high',
        confidenceLabel: 'HIGH CONFIDENCE',
        intent: 'FINANCIAL_AID',
        responseMode: 'FINANCIAL-AID ASSISTANT',
        knowledgeLevel: 'LEVEL 1 & LEVEL 2 — Student Financial Record & University Policy',
        cardType: 'financial_aid',
        cardData: {
          packageTotal: '$22,400 / Year',
          fallDisbursement: '$11,200',
          balanceDue: '$2,400',
          dueDate: 'October 15, 2026',
          missingDocument: 'Proof of Enrollment (Form FA-104) Required',
          actionUrgent: true,
        },
        sources: [
          {
            id: 'src-fa-1',
            title: 'Financial-Aid Documentation & Policies 2026–27',
            department: 'Office of Financial Aid & Scholarships',
            updatedAt: 'Updated September 25, 2026',
            version: 'FA-2026.2',
            section: 'Section 5.3: Verification of Enrollment & Disbursement Holds',
            excerpt: 'Proof of enrollment must be submitted by October 15 for Fall term merit and grant disbursements.',
          },
        ],
        suggestedActions: [
          { label: 'Upload Proof of Enrollment', targetView: 'financial-aid' },
          { label: 'Contact Financial Aid', targetView: 'financial-aid' },
        ],
      },
    ],
  },
  {
    id: 'conv-grad',
    title: 'Graduation Planning',
    category: 'Academics',
    timestamp: 'Yesterday',
    preview: '72/120 credits completed (60%)...',
    messages: [
      {
        id: 'grad-msg-1',
        sender: 'student',
        text: 'How many credits do I need and when can I graduate?',
        timestamp: '3:20 PM',
        channel: 'Web Chat',
      },
      {
        id: 'grad-msg-2',
        sender: 'ai',
        text: '## Answer\nAccording to your authorized degree audit:\n\n- You have completed **72 of 120 credits (60%)** toward your MCA (Division D).\n- **Remaining Credits:** **48 credits** (20 Major Core, 10 GenEd, 18 Electives).\n- **Estimated Graduation:** **Spring 2028 (On Track)** with regular 15-credit term loads.\n\n### Upcoming Milestones\nComplete CS 310 and CS 340 in Spring 2027 to unlock senior capstone project eligibility.',
        timestamp: '3:20 PM',
        channel: 'Web Chat',
        confidence: 'high',
        confidenceLabel: 'HIGH CONFIDENCE',
        intent: 'DEGREE_PROGRESS',
        responseMode: 'ACADEMIC ADVISOR',
        knowledgeLevel: 'LEVEL 1 — Student Authorized Degree Audit',
        cardType: 'degree_progress',
        cardData: {
          completedCredits: 72,
          totalCredits: 120,
          percentage: 60,
          breakdown: [
            { category: 'Major Core', completed: 42, required: 60 },
            { category: 'General Education', completed: 24, required: 36 },
            { category: 'Electives', completed: 6, required: 24 },
          ],
          estimatedGraduation: 'Spring 2028 (On Track)',
          nextMilestones: ['Complete CS 310 Algorithms & CS 340 OS in Spring 2027', 'Declare Senior Capstone project by Fall 2027'],
        },
        sources: [
          {
            id: 'src-deg-1',
            title: 'Degree Audit & Graduation Verification',
            department: 'Office of the Registrar',
            updatedAt: 'Updated September 20, 2026',
            version: 'DegreeAudit-v26',
            section: 'Master of Computer Applications (MCA · Division D) Requirements',
            excerpt: '120 minimum total credits required with 2.0+ GPA in major. Parth Pimplapure has 72 credits and a 3.82 GPA.',
          },
        ],
        suggestedActions: [
          { label: 'View Degree Audit', targetView: 'academic-progress' },
          { label: 'Run Course Recommendation Engine', targetView: 'academic-progress' },
        ],
      },
    ],
  },
  {
    id: 'conv-it',
    title: 'IT Support',
    category: 'Technology',
    timestamp: '2 days ago',
    preview: 'RADIUS certificate rotation & Wi-Fi fix...',
    messages: [
      {
        id: 'it-msg-1',
        sender: 'student',
        text: 'My Wi-Fi isn’t working on campus.',
        timestamp: '11:05 AM',
        channel: 'Web Chat',
      },
      {
        id: 'it-msg-2',
        sender: 'ai',
        text: '## Problem\nYour device is rejecting the campus connection due to this morning’s **KJIT-Secure 802.1X RADIUS certificate renewal**.\n\n### Troubleshooting Steps\n1. Select **Forget Network** on \`KJIT-Secure\` in your device settings.\n2. Reconnect using \`ppimplapure@kjit.edu.in\`.\n3. Accept the new certificate for \`auth.kjit.edu.in\`.\n\nFollow the interactive diagnostic card below.',
        timestamp: '11:05 AM',
        channel: 'Web Chat',
        confidence: 'high',
        confidenceLabel: 'HIGH CONFIDENCE',
        intent: 'IT_SUPPORT',
        responseMode: 'IT SUPPORT',
        knowledgeLevel: 'LEVEL 2 — Official IT Documentation',
        cardType: 'it_support',
        cardData: {
          issue: 'RADIUS 802.1X Certificate Rotation',
          steps: [
            'Forget "KJIT-Secure" network on device',
            'Reconnect using "ppimplapure@kjit.edu.in" and student password',
            'Accept new server certificate "auth.kjit.edu.in"',
            'If using Okta Verify MFA, refresh one-time push token',
          ],
          networkHealth: { gateway: 'Operational', radius: 'Operational', vpn: 'Operational' },
        },
        sources: [
          {
            id: 'src-it-doc',
            title: 'IT Documentation — Campus Wi-Fi & SSO MFA Guide',
            department: 'Enterprise IT Help Desk',
            updatedAt: 'Updated October 1, 2026',
            version: 'KB-4092',
            section: 'Section 3: 802.1X Certificate Renewal & MFA Reset',
            excerpt: 'Following the October 2026 RADIUS update, clients must re-trust auth.kjit.edu.in.',
          },
        ],
        suggestedActions: [
          { label: 'Open IT Ticket', targetView: 'it-support' },
          { label: 'Launch IT Diagnostic Hub', targetView: 'it-support' },
        ],
      },
    ],
  },
  {
    id: 'conv-lib',
    title: 'Library Research',
    category: 'Research',
    timestamp: '3 days ago',
    preview: 'Pattern Recognition and Machine Learning...',
    messages: [
      {
        id: 'lib-msg-1',
        sender: 'student',
        text: 'Find a book about machine learning. Where is the library and is it open?',
        timestamp: '4:15 PM',
        channel: 'Web Chat',
      },
      {
        id: 'lib-msg-2',
        sender: 'ai',
        text: '## Answer\n**Grand Library Status:** **Open 24/7** (Reference & Circulation Desk staffed until 12:00 AM Midnight).\n\nHere are 3 available machine learning reference books located in Grand Library:\n\n1. ***Pattern Recognition and Machine Learning*** by Christopher M. Bishop (3rd Floor Stacks, Call #QA76.87 .B57)\n2. ***Hands-On Machine Learning with Scikit-Learn & TensorFlow*** by Aurélien Géron (eBook & Print Reserves)\n3. ***Deep Learning*** by Goodfellow, Bengio, Courville (Course Reserves 2-hr loan)\n\nYou can reserve a copy or book a study carrel below.',
        timestamp: '4:15 PM',
        channel: 'Web Chat',
        confidence: 'high',
        confidenceLabel: 'HIGH CONFIDENCE',
        intent: 'LIBRARY',
        responseMode: 'CAMPUS GUIDE',
        knowledgeLevel: 'LEVEL 2 — Official University Knowledge',
        cardType: 'library',
        cardData: {
          hoursToday: 'Open 24/7 (Desk Staffed until 12:00 AM)',
          query: 'Machine Learning & Neural Networks',
          books: [
            { title: 'Pattern Recognition and Machine Learning', author: 'Christopher M. Bishop', location: 'Grand Library 3rd Floor', callNumber: 'QA76.87 .B57', available: true },
            { title: 'Hands-On Machine Learning with Scikit-Learn & TensorFlow', author: 'Aurélien Géron', location: 'eBook & Print Reserves', callNumber: 'QA76.73 .P98', available: true },
            { title: 'Deep Learning', author: 'Ian Goodfellow et al.', location: 'Course Reserves (2-hr Loan)', callNumber: 'QA76.88 .G66', available: true },
          ],
        },
        sources: [
          {
            id: 'src-lib-1',
            title: 'Grand Library Catalog & Operational Schedule',
            department: 'University Library System',
            updatedAt: 'Updated today at 6:00 AM',
            version: 'LibCat-2026',
            section: 'Main Stacks & Digital Resource Holdings',
            excerpt: 'Grand Library main reading rooms are open 24/7 with active student badge access.',
          },
        ],
        suggestedActions: [
          { label: 'Explore Library Catalog', targetView: 'library' },
          { label: 'Book Study Carrel', targetView: 'library' },
        ],
      },
    ],
  },
];

export const CAMPUS_SERVICES: CampusServiceItem[] = [
  {
    id: 'srv-advising',
    title: 'Academic Advising & Degree Audit Office',
    category: 'Academic',
    description: 'Four-year degree planning, major declarations, prerequisite waivers, and faculty mentorship matching.',
    hours: 'Mon–Fri · 8:30 AM – 5:30 PM',
    contact: 'advising@kjit.edu.in · (555) 234-8810',
    location: 'Founders Hall, Suite 204',
    aiPrompt: 'Can I register for CS 310 next semester and how many credits do I need to graduate?',
  },
  {
    id: 'srv-tutoring',
    title: 'Kristu Jayanti Peer & AI Learning Commons',
    category: 'Academic',
    description: '24/7 Socratic AI tutoring paired with drop-in undergraduate teaching fellows for STEM and humanities writing.',
    hours: 'Daily · 9:00 AM – 11:00 PM (AI 24/7)',
    contact: 'commons@kjit.edu.in · (555) 234-8822',
    location: 'Central Library, Mezzanine East',
    aiPrompt: 'Help me understand recursion and binary search trees.',
  },
  {
    id: 'srv-it',
    title: 'Enterprise IT Help Desk & Foundry Lab',
    category: 'Technology',
    description: 'KJIT-Secure Wi-Fi configuration, Okta MFA hardware keys, campus VPN, and Azure/GPU research cluster access.',
    hours: 'Mon–Sun · 7:00 AM – 10:00 PM',
    contact: 'itdesk@kjit.edu.in · Ext. 4357',
    location: 'Turing Hall, Lower Concourse',
    aiPrompt: 'I can’t access my university account or connect to campus Wi-Fi.',
  },
  {
    id: 'srv-finaid',
    title: 'Office of Financial Aid, Scholarships & Bursar',
    category: 'Financial',
    description: 'FAFSA & institutional grant advising, merit scholarship renewals, work-study placement, and tuition payment plans.',
    hours: 'Mon–Fri · 9:00 AM – 4:30 PM',
    contact: 'finaid@kjit.edu.in · (555) 234-8900',
    location: 'Bursar Hall, Room 101',
    aiPrompt: 'How do I apply for financial aid and submit my Proof of Enrollment?',
  },
  {
    id: 'srv-library',
    title: 'Kristu Jayanti Archival Library & Special Collections',
    category: 'Library',
    description: 'Over 1.8 million volumes, IEEE/ACM digital databases, rare broadsheet archives, and private study carrels.',
    hours: 'Open 24 Hours (Reading Room 7 AM – Midnight)',
    contact: 'library@kjit.edu.in · (555) 234-8750',
    location: 'Central Quadrangle North',
    aiPrompt: 'Find peer-reviewed papers on self-balancing binary search trees in the Kristu Jayanti Library.',
  },
  {
    id: 'srv-career',
    title: 'Center for Career Design & Research Fellowships',
    category: 'Career',
    description: 'Technical interview prep, alumni mentorship across software & biotech, and summer research stipends.',
    hours: 'Mon–Fri · 9:00 AM – 5:00 PM',
    contact: 'careers@kjit.edu.in · (555) 234-8940',
    location: 'Chronicle House, 2nd Floor',
    aiPrompt: 'Review my Computer Science internship timeline for Summer 2027.',
  },
  {
    id: 'srv-wellness',
    title: 'University Health, Counseling & Wellness Center',
    category: 'Health & Wellness',
    description: 'Confidential counseling, primary medical care, mindfulness workshops, and academic stress support.',
    hours: '24/7 On-Call Clinical Support',
    contact: 'wellness@kjit.edu.in · (555) 234-8111',
    location: 'West Meadow Pavilion',
    aiPrompt: 'What wellness and mindfulness resources are available during midterm exams?',
  },
  {
    id: 'srv-accessibility',
    title: 'Office of Disability & Accessible Learning (WCAG/ADA)',
    category: 'Accessibility',
    description: 'Extended exam accommodations, real-time lecture captioning, screen-reader textbooks, and ergonomic labs.',
    hours: 'Mon–Fri · 8:30 AM – 5:00 PM',
    contact: 'access@kjit.edu.in · (555) 234-8899',
    location: 'Founders Hall, Suite 110',
    aiPrompt: 'How do I enable lecture live transcripts and extended exam accommodations?',
  },
];

export const LIBRARY_RESOURCES: LibraryResource[] = [
  {
    id: 'lib-1',
    title: 'Introduction to Algorithms & Self-Balancing Trees (Kristu Jayanti Archival Edition)',
    authors: 'T. H. Cormen, C. E. Leiserson, R. L. Rivest, S. Johnson (Ed.)',
    year: 2025,
    type: 'Books',
    callNumber: 'QA76.6 .C662 2025',
    citation: 'Cormen, T. H., et al. (2025). Introduction to Algorithms (Kristu Jayanti Institute of Technology Annotated 4th Ed.). Kristu Jayanti University Press.',
    available: true,
    abstract: 'Comprehensive mathematical treatment of binary search trees, red-black trees, B-trees, and dynamic programming with CS 201 lab annotations.',
  },
  {
    id: 'lib-2',
    title: 'A Note on the Organization of Information in Archival Tree Catalogs',
    authors: 'G. M. Adelson-Velsky & E. M. Landis',
    year: 1962,
    type: 'Articles',
    callNumber: 'DOKL-MATH-146-263',
    citation: 'Adelson-Velsky, G. M., & Landis, E. M. (1962). An algorithm for the organization of information. Soviet Mathematics Doklady, 3, 1259–1263.',
    available: true,
    abstract: 'Seminal paper introducing height-balanced AVL trees guaranteeing O(log n) search, insertion, and deletion operations.',
  },
  {
    id: 'lib-3',
    title: 'The Kristu Jayanti Journal of Symbolic Logic & Discrete Structures',
    authors: 'Department of Mathematics, Kristu Jayanti Institute of Technology',
    year: 2026,
    type: 'Journals',
    callNumber: 'PER QA1 .Z36 V.42',
    citation: 'Chen, D. (Ed.). (2026). Chromatic Polynomials on Planar Graphs. Kristu Jayanti Journal of Symbolic Logic, 42(3), 14–49.',
    available: true,
    abstract: 'Quarterly peer-reviewed monograph series covering combinatorial proof techniques, graph coloring bounds, and algorithmic complexity.',
  },
  {
    id: 'lib-4',
    title: 'ACM Digital Library & IEEE Xplore Full-Text Consortium Index',
    authors: 'Association for Computing Machinery / Kristu Jayanti Library',
    year: 2026,
    type: 'Databases',
    callNumber: 'DB-ACM-IEEE-KJIT',
    citation: 'Kristu Jayanti Institute of Technology Digital Repository (2026). Full-Text Institutional Subscription via Shibboleth SSO.',
    available: true,
    abstract: 'Direct institutional access to 3.4 million full-text computing proceedings, transactions, and archival technical standards.',
  },
];

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    category: 'Academic',
    title: 'Your CS 201 assignment (Binary Trees) is due Friday at 11:59 PM',
    detail: '4 of 6 unit tests are currently passing in your GitAutograder workspace.',
    timestamp: '22 minutes ago',
    unread: true,
    targetView: 'assignments',
  },
  {
    id: 'notif-2',
    category: 'Financial',
    title: 'Financial Aid Document Required: Proof of Enrollment',
    detail: 'Submit Form FA-104 by October 15 to release your Fall 2026 scholarship disbursement.',
    timestamp: '2 hours ago',
    unread: true,
    targetView: 'financial-aid',
  },
  {
    id: 'notif-3',
    category: 'Academic',
    title: 'Professor Sarah Johnson posted a new CS 201 announcement',
    detail: 'Week 6 AVL Tree visualization notes and live review session link are now posted.',
    timestamp: '4 hours ago',
    unread: false,
    targetView: 'course-detail',
  },
  {
    id: 'notif-4',
    category: 'Campus',
    title: 'Spring 2027 Priority Course Registration opens Monday, Oct 19',
    detail: 'AI Degree Audit recommends pre-bookmarking CS 310 (Algorithms) and CS 340.',
    timestamp: 'Yesterday',
    unread: false,
    targetView: 'academic-progress',
  },
  {
    id: 'notif-5',
    category: 'System',
    title: 'KJIT-Secure Wi-Fi RADIUS Certificate Updated',
    detail: 'Campus IT rotated the 802.1X certificate; see IT Support if your laptop prompts for trust.',
    timestamp: '2 days ago',
    unread: false,
    targetView: 'it-support',
  },
];

export const MESSAGE_THREADS: MessageThread[] = [
  {
    id: 'thr-advisor',
    correspondent: 'Dr. Miriam Hawthorne',
    role: 'Senior Academic Advisor',
    department: 'Computer Science Advising',
    unread: true,
    lastUpdated: '10:15 AM',
    channelSync: 'Synced via Web Chat & University Email',
    messages: [
      {
        id: 'm-1',
        sender: 'Dr. Miriam Hawthorne',
        time: 'Yesterday · 4:10 PM',
        body: 'Hello Parth, I reviewed your Fall mid-semester audit. With 72 credits complete and a 3.82 GPA, you are right on track for honours standing. (MCA · Division D · 26MCAD30)',
      },
      {
        id: 'm-2',
        sender: 'Dr. Miriam Hawthorne',
        time: 'Today · 10:15 AM',
        body: 'Quick reminder: let’s confirm your Spring 2027 registration pin for CS 310 (Algorithms & Complexity) during our Wednesday advising slot.',
      },
    ],
  },
  {
    id: 'thr-prof',
    correspondent: 'Professor Sarah Johnson',
    role: 'Chair of Computer Science',
    department: 'CS 201 — Data Structures',
    unread: false,
    lastUpdated: 'Yesterday',
    channelSync: 'Synced via LMS & Mobile App',
    messages: [
      {
        id: 'm-3',
        sender: 'Parth Pimplapure',
        time: 'Yesterday · 1:45 PM',
        body: 'Professor Johnson, for Lab 4 deleteNode(), should we replace a two-child node with its in-order successor or in-order predecessor?',
      },
      {
        id: 'm-4',
        sender: 'Professor Sarah Johnson',
        time: 'Yesterday · 2:12 PM',
        body: 'Great question, Parth! Please use the in-order successor (the minimum key in the right subtree) so your tree structure matches our deterministic unit tests.',
      },
    ],
  },
  {
    id: 'thr-finaid',
    correspondent: 'Kristu Jayanti Financial Aid Office',
    role: 'Financial Aid Officer',
    department: 'Bursar & Scholarships',
    unread: true,
    lastUpdated: 'Oct 3',
    channelSync: 'Synced via SMS & Web Portal',
    messages: [
      {
        id: 'm-5',
        sender: 'Kristu Jayanti Financial Aid Office',
        time: 'Oct 3 · 11:00 AM',
        body: 'Your ₹1,20,000 Kristu Jayanti Merit Scholarship is approved for 2026–27. Please upload your signed Proof of Enrollment form by October 15.',
      },
    ],
  },
  {
    id: 'thr-it',
    correspondent: 'Kristu Jayanti IT Help Desk',
    role: 'Systems Engineer',
    department: 'Enterprise Technology',
    unread: false,
    lastUpdated: 'Sep 29',
    channelSync: 'Synced via Web Chat & SMS (#IT-8921)',
    messages: [
      {
        id: 'm-6',
        sender: 'Kristu Jayanti IT Help Desk',
        time: 'Sep 29 · 9:20 AM',
        body: 'Your AI GPU student sandbox allocation for CS 201 has been provisioned under your KJIT SSO account.',
      },
    ],
  },
];

export const AI_RECOMMENDATIONS = [
  {
    id: 'rec-1',
    title: 'Complete CS 201 Binary Trees Lab (Unit Tests 5 & 6)',
    reason: 'Recommended because your CS 201 assignment is due Friday at 11:59 PM and is currently 65% complete.',
    actionLabel: 'Open Assignment',
    targetView: 'assignments' as const,
  },
  {
    id: 'rec-2',
    title: 'Upload 2026–27 Proof of Enrollment Form',
    reason: 'Recommended because your Financial Aid disbursement requires verification before the October 15 deadline.',
    actionLabel: 'Resolve Financial Aid Hold',
    targetView: 'financial-aid' as const,
  },
  {
    id: 'rec-3',
    title: 'Pre-Register for CS 310 — Algorithms & Complexity',
    reason: 'Recommended based on your 72/120 credit degree audit and A- standing in CS 201.',
    actionLabel: 'View Degree Progress',
    targetView: 'academic-progress' as const,
  },
  {
    id: 'rec-4',
    title: 'Attend 20-Minute Socratic AI Tutor Session on AVL Rotations',
    reason: 'Recommended because tree balancing appears on Friday’s Lab 4 autograder suite.',
    actionLabel: 'Launch AI Tutor',
    targetView: 'ai-tutor' as const,
  },
];

export const COURSE_CATALOG: CourseCatalogItem[] = [
  {
    id: 'cs-310',
    code: 'CS 310',
    title: 'Algorithms & Computational Complexity',
    credits: 4,
    department: 'Computer Science',
    category: 'Major Core',
    level: '300',
    prerequisites: ['CS 201', 'MATH 210'],
    tags: ['Data Structures', 'Algorithms & Optimization', 'Graph Theory', 'Major Core'],
    description:
      'Advanced algorithm design paradigms: divide-and-conquer recurrences, greedy strategies, dynamic programming, network flow, NP-completeness, and approximation algorithms.',
    professor: 'Dr. Raymond Sterling',
    schedule: 'Mon & Wed · 10:00 AM – 11:30 AM',
    room: 'Turing Hall 304',
  },
  {
    id: 'cs-340',
    code: 'CS 340',
    title: 'Operating Systems & Concurrent Architecture',
    credits: 4,
    department: 'Computer Science',
    category: 'Major Core',
    level: '300',
    prerequisites: ['CS 201'],
    tags: ['Systems & Architecture', 'Concurrency', 'Memory Management', 'Major Core'],
    description:
      'Processes, threads, lock-free synchronization, virtual memory paging, file system caching, and real-time UNIX kernel implementation in C/Rust.',
    professor: 'Prof. David K. Thorne',
    schedule: 'Tue & Thu · 1:00 PM – 2:30 PM',
    room: 'Turing Hall 208',
  },
  {
    id: 'cs-370',
    code: 'CS 370',
    title: 'Artificial Intelligence & Neural Architectures',
    credits: 4,
    department: 'Computer Science',
    category: 'Technical Elective',
    level: '300',
    prerequisites: ['CS 201', 'MATH 210'],
    tags: ['Artificial Intelligence', 'Data Structures', 'Neural Networks', 'Python'],
    description:
      'State-space search, heuristic evaluation, transformer attention mechanisms, reinforcement learning, and ethical guardrail evaluation for generative models.',
    professor: 'Dr. Elena Vance',
    schedule: 'Mon & Wed · 2:00 PM – 3:30 PM',
    room: 'Euler Pavilion 210',
  },
  {
    id: 'phil-220',
    code: 'PHIL 220',
    title: 'Ethics in the Information Age & Algorithmic Justice',
    credits: 4,
    department: 'Philosophy & Humanities',
    category: 'General Education',
    level: '200',
    prerequisites: [],
    tags: ['Ethics & Algorithmic Justice', 'General Education', 'Philosophy', 'Tech Policy'],
    description:
      'Philosophical examination of autonomous systems, algorithmic bias, epistemic privacy, intellectual property, and democratic governance in computing.',
    professor: 'Dr. Julian Morales',
    schedule: 'Tue & Thu · 10:00 AM – 11:30 AM',
    room: 'Founders Hall 106',
  },
  {
    id: 'art-140',
    code: 'ART 140',
    title: 'Visual Journalism, Type Design & Archival Layout',
    credits: 4,
    department: 'Visual Arts & Media',
    category: 'General Education',
    level: '100',
    prerequisites: [],
    tags: ['Visual Journalism & Broadsheet Typography', 'General Education', 'Design', 'Typography'],
    description:
      'Editorial publication design, broadsheet typography, photojournalism framing, layout hierarchy, and digital print production for historical college journals.',
    professor: 'Prof. Beatrice Lin',
    schedule: 'Wed · 1:00 PM – 4:00 PM (Studio)',
    room: 'Chronicle House Atrium',
  },
  {
    id: 'stat-205',
    code: 'STAT 205',
    title: 'Applied Probability & Statistical Inference',
    credits: 4,
    department: 'Mathematics & Statistics',
    category: 'Major Core',
    level: '200',
    prerequisites: ['MATH 210'],
    tags: ['Algorithms & Optimization', 'Mathematics', 'Data Analysis', 'Major Core'],
    description:
      'Discrete and continuous probability distributions, Markov chains, maximum likelihood estimation, hypothesis testing, and Bayesian computational inference.',
    professor: 'Dr. Katherine Bell',
    schedule: 'Tue & Thu · 8:30 AM – 10:00 AM',
    room: 'Euler Pavilion 102',
  },
  {
    id: 'env-215',
    code: 'ENV 215',
    title: 'Computational Ecology & Environmental Modeling',
    credits: 4,
    department: 'Environmental Science',
    category: 'General Education',
    level: '200',
    prerequisites: ['BIO 101'],
    tags: ['General Education', 'Natural Sciences', 'Simulation', 'Algorithms & Optimization'],
    description:
      'Ecosystem dynamics, climate telemetry sensor networks, population modeling, and spatial GIS analytics fulfilling Kristu Jayanti Institute of Technology natural science requirements.',
    professor: 'Prof. Alistair Finch',
    schedule: 'Mon & Wed · 11:30 AM – 1:00 PM',
    room: 'Darwin Science Center 115',
  },
  {
    id: 'cs-420',
    code: 'CS 420',
    title: 'Distributed Cloud Systems & Microservices',
    credits: 4,
    department: 'Computer Science',
    category: 'Technical Elective',
    level: '400',
    prerequisites: ['CS 201', 'CS 340'],
    tags: ['Systems & Architecture', 'Cloud', 'Distributed Systems', 'Technical Elective'],
    description:
      'Consensus protocols (Raft, Paxos), vector clocks, distributed transactions, fault tolerance, containerized Kubernetes architecture, and gRPC RPC design.',
    professor: 'Dr. Sanjay Patel',
    schedule: 'Tue & Thu · 3:00 PM – 4:30 PM',
    room: 'Turing Hall 401',
  },
];

export const INITIAL_COURSE_RECOMMENDATIONS: PersonalizedCourseRecommendation[] = [
  {
    id: 'rec-cs310',
    courseId: 'cs-310',
    code: 'CS 310',
    title: 'Algorithms & Computational Complexity',
    credits: 4,
    department: 'Computer Science',
    category: 'Major Core',
    explanation:
      'Based on your interest in Data Structures and your current strong 91.8% (A-) standing in CS 201. Unlocks essential 400-level core requirements.',
    rationaleType: 'interest_match',
    matchScore: 98,
    prerequisitesMet: true,
    targetSemester: 'Spring 2027',
    schedule: 'Mon & Wed · 10:00 AM – 11:30 AM',
    room: 'Turing Hall 304',
    professor: 'Dr. Raymond Sterling',
    tags: ['Data Structures', 'Major Core', 'Prereq: CS 201'],
  },
  {
    id: 'rec-phil220',
    courseId: 'phil-220',
    code: 'PHIL 220',
    title: 'Ethics in the Information Age & Algorithmic Justice',
    credits: 4,
    department: 'Philosophy & Humanities',
    category: 'General Education',
    explanation:
      'To fulfill a general education requirement (Humanities & Ethics core — 10 credits remaining to graduate) while matching your stated interest in Algorithmic Justice.',
    rationaleType: 'general_education',
    matchScore: 95,
    prerequisitesMet: true,
    targetSemester: 'Spring 2027',
    schedule: 'Tue & Thu · 10:00 AM – 11:30 AM',
    room: 'Founders Hall 106',
    professor: 'Dr. Julian Morales',
    tags: ['General Education', 'Ethics & Algorithmic Justice', 'No Prereqs'],
  },
  {
    id: 'rec-cs370',
    courseId: 'cs-370',
    code: 'CS 370',
    title: 'Artificial Intelligence & Neural Architectures',
    credits: 4,
    department: 'Computer Science',
    category: 'Technical Elective',
    explanation:
      'Based on your interest in Artificial Intelligence and 3.82 GPA; eligible for early registration with concurrent completion of MATH 210.',
    rationaleType: 'interest_match',
    matchScore: 92,
    prerequisitesMet: true,
    targetSemester: 'Spring 2027',
    schedule: 'Mon & Wed · 2:00 PM – 3:30 PM',
    room: 'Euler Pavilion 210',
    professor: 'Dr. Elena Vance',
    tags: ['Artificial Intelligence', 'Technical Elective', 'High Demand'],
  },
  {
    id: 'rec-art140',
    courseId: 'art-140',
    code: 'ART 140',
    title: 'Visual Journalism, Type Design & Archival Layout',
    credits: 4,
    department: 'Visual Arts & Media',
    category: 'General Education',
    explanation:
      'To fulfill a general education requirement (Arts & Creative Expression core — 6 credits needed) aligned with your interest in Broadsheet Typography.',
    rationaleType: 'general_education',
    matchScore: 89,
    prerequisitesMet: true,
    targetSemester: 'Spring 2027',
    schedule: 'Wed · 1:00 PM – 4:00 PM (Studio)',
    room: 'Chronicle House Atrium',
    professor: 'Prof. Beatrice Lin',
    tags: ['General Education', 'Visual Journalism & Broadsheet Typography'],
  },
  {
    id: 'rec-cs340',
    courseId: 'cs-340',
    code: 'CS 340',
    title: 'Operating Systems & Concurrent Architecture',
    credits: 4,
    department: 'Computer Science',
    category: 'Major Core',
    explanation:
      'Fulfills a core Computer Science degree requirement for upper-division systems. Prerequisites met via CS 201.',
    rationaleType: 'major_core',
    matchScore: 88,
    prerequisitesMet: true,
    targetSemester: 'Spring 2027',
    schedule: 'Tue & Thu · 1:00 PM – 2:30 PM',
    room: 'Turing Hall 208',
    professor: 'Prof. David K. Thorne',
    tags: ['Major Core', 'Systems & Architecture'],
  },
  {
    id: 'rec-env215',
    courseId: 'env-215',
    code: 'ENV 215',
    title: 'Computational Ecology & Environmental Modeling',
    credits: 4,
    department: 'Environmental Science',
    category: 'General Education',
    explanation:
      'To fulfill a general education natural sciences requirement (Natural Science Breadth). Prerequisite BIO 101 currently passing with an A.',
    rationaleType: 'general_education',
    matchScore: 84,
    prerequisitesMet: true,
    targetSemester: 'Spring 2027',
    schedule: 'Mon & Wed · 11:30 AM – 1:00 PM',
    room: 'Darwin Science Center 115',
    professor: 'Prof. Alistair Finch',
    tags: ['General Education', 'Natural Science', 'BIO 101 Prereq Met'],
  },
];

export function getPersonalizedRecommendations(
  selectedInterests: string[] = STUDENT_PERSONA.statedInterests,
  categoryFilter?: string
): PersonalizedCourseRecommendation[] {
  return INITIAL_COURSE_RECOMMENDATIONS.filter((rec) => {
    if (categoryFilter && categoryFilter !== 'All') {
      if (categoryFilter === 'General Education' && rec.category !== 'General Education') return false;
      if (categoryFilter === 'Major Core' && rec.category !== 'Major Core') return false;
      if (categoryFilter === 'Technical Elective' && rec.category !== 'Technical Elective') return false;
      if (categoryFilter === 'By Interest') {
        const matchesAny = rec.tags.some((t) =>
          selectedInterests.some((si) => si.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(si.toLowerCase()))
        );
        if (!matchesAny) return false;
      }
    }
    return true;
  });
}

export const KJIT_ADMISSION_DATA = {
  institution: 'Kristu Jayanti Institute of Technology',
  university: 'Kristu Jayanti (Deemed to be University)',
  location: 'K. Narayanapura, Kothanur P.O., Bengaluru - 560077, Karnataka, India',
  founder: 'Bodhi Niketan Trust, Carmelites of Mary Immaculate (CMI)',
  headOfDepartment: {
    name: 'Dr. Muruganantham A',
    title: 'Head, Institute of Technology',
    department: 'Postgraduate Department of Computer Science',
  },
  contact: {
    phone: '080-68737777',
    fax: '080-68737799',
    email: 'info@kristujayanti.com',
    admissionEmail: 'admission@kristujayanti.com',
    url: 'https://www.kristujayanti.edu.in/academics/institute-of-technology/admission.php',
  },
  antiCapitationPolicy:
    'The Management / University does not collect any type of Capitation fees / Donation other than the official fees prescribed.',
  paymentModes: [
    'Demand Draft in favour of "Kristu Jayanti (Deemed to be University)", payable at Bengaluru',
    'Online Mode (Net banking & debit / credit card via admission portal)',
  ],
  categoryOtherFees: [
    { category: 'Students from Kristu Jayanti (Deemed to be University)', amount: 'NIL' },
    { category: 'Students from Public Universities in Karnataka', amount: 'NIL' },
    { category: 'Students from Institutions other than Public Universities in Karnataka', amount: '₹10,000' },
    { category: 'Students from states other than Karnataka', amount: '₹20,000' },
    { category: 'Students qualified from International Board in India', amount: '₹20,000' },
    { category: 'NRI students', amount: '₹40,000' },
    { category: 'Students from SAARC Countries', amount: '₹50,000' },
    { category: 'Foreign Students (Foreign Nationals / PIO / OCI)', amount: '₹1,00,000' },
  ],
  programmes: [
    {
      id: 'mca',
      code: 'MCA',
      title: 'Master of Computer Applications',
      duration: '2 Years (Full-Time)',
      academicFeeYear1: '₹1,90,000',
      academicFeeYear2: '₹1,90,000',
      registrationFee: '₹5,000 (Non-Refundable)',
      applicationProcessingFee: '₹1,500 (Non-Refundable)',
      eligibility:
        'Candidates with a Bachelor’s degree in Arts, Science, Commerce and Engineering with not less than 50% marks (45% for SC/ST candidates) as aggregate from a recognized University are eligible to apply. Candidates should have studied Mathematics either at the Higher Secondary (10+2) or Undergraduate level.',
      bridgeCourseNote:
        'Candidates who do not have a background in Mathematics will be required to undergo a mandatory Bridge Course in Mathematics conducted by the Department.',
      highlights: [
        'Advanced Software Engineering, Cloud Architecture & DevOps',
        'State-of-the-Art Labs & High-Performance Computing',
        'In-house Software Development and Research Cell',
        'Industry Mentorship Programme and Global Placements',
      ],
      status: 'Admissions Open 2026–27',
    },
    {
      id: 'msc-ds',
      code: 'M.Sc. DS',
      title: 'Master of Science in Data Science',
      duration: '2 Years (Full-Time)',
      academicFeeYear1: '₹1,40,000',
      academicFeeYear2: '₹1,40,000',
      registrationFee: '₹5,000 (Non-Refundable)',
      applicationProcessingFee: '₹1,200 (Non-Refundable)',
      eligibility:
        'Candidates with B.Sc. Data Science / B.Sc. Data Analytics / B.Sc. Computer Science / BCA / B.E. / B.Tech. or B.Sc. Mathematics / Statistics / Physics / Electronics with not less than 50% (45% for SC/ST candidates) marks as aggregate are eligible to apply.',
      bridgeCourseNote:
        'Candidates who do not have a background in Computer Science will be required to undergo a mandatory Bridge Course in Computer Science conducted by the Institute.',
      highlights: [
        'Machine Learning, Deep Learning, Big Data Analytics & NLP',
        'Specialised AI & GPU Computing Labs',
        'Data Science Society & IEEE Student Chapter collaboration',
        'Funded research initiatives & real-time analytics projects',
      ],
      status: 'Admissions Open 2026–27',
    },
    {
      id: 'msc-cs',
      code: 'M.Sc. CS',
      title: 'Master of Science in Cyber Security',
      duration: '2 Years (Full-Time)',
      academicFeeYear1: '₹1,50,000',
      academicFeeYear2: '₹1,50,000',
      registrationFee: '₹5,000 (Non-Refundable)',
      applicationProcessingFee: '₹1,200 (Non-Refundable)',
      eligibility:
        'Candidates who have passed a Bachelor’s degree in Computer Science or Computer Applications or Information Technology or an equivalent degree in a related discipline from a recognized university with a minimum of 50% aggregate marks (45% for SC/ST candidates) are eligible to apply. Candidates who have completed B.E. or B.Tech in any relevant discipline with a strong background in Mathematics and Computer Science are also eligible.',
      bridgeCourseNote:
        'Foundation bridge modules in network protocols and security mathematics provided for interdisciplinary entrants.',
      highlights: [
        'Penetration Testing, Cryptography, Cloud Security & Forensics',
        'Dedicated Cyber Security Lab & Threat Simulation Range',
        'Hands-on vulnerability assessments & industry internships',
        'Partnerships with top tier IT security organizations',
      ],
      status: 'Admissions Open 2026–27',
    },
  ],
  whyInstituteOfTechnology: [
    'Dynamic curriculum with foundation, discipline, and application course titles',
    'Student-Centric Pedagogy fostering critical thinking and innovation',
    'Myriad skill enrichment programs & professional certifications',
    'Expert academicians to cater to students’ diverse interests',
    'Career counseling, training, and 100% placement assistance',
    'Effective Continuous Internal Evaluation methods',
    'In-house R&D wing and Software Development Cell',
    'Social Outreach programs for holistic learning',
    'Participatory learning through fests, exhibitions, and hackathons',
    'Industry-institution based value-added programs',
    '24/7 library with extensive print titles, IEEE Xplore, and ACM digital repository',
  ],
  studentTestimonials: [
    {
      name: 'Stella Mary S',
      regNo: '24MCAA61',
      programme: 'MCA',
      quote:
        'The Institute of Technology has played a significant role in shaping my academic and professional development through a well-structured curriculum. Regular workshops, seminars, and serving as Secretary helped me develop strong leadership and research skills.',
    },
    {
      name: 'Karthick S',
      regNo: '24MCAA36',
      programme: 'MCA',
      quote:
        'The department actively promotes experiential learning with exposure to prestigious institutions like ISRO. Presenting research papers and serving as Event Head for the departmental fest gave me immense confidence and industry readiness.',
    },
    {
      name: 'Deeksha S',
      regNo: '24MCAA12',
      programme: 'MCA',
      quote:
        'Pursuing my MCA at Kristu Jayanti has been a truly enriching journey. With continuous faculty mentorship, I successfully presented research papers and secured placement in a reputed tech company.',
    },
  ],
};
