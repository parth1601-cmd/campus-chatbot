export type RoleMode = 'student' | 'faculty' | 'admin';

export type ViewId =
  // Student Views
  | 'dashboard'
  | 'ai-assistant'
  | 'admissions'
  | 'faculty-directory'
  | 'courses'
  | 'course-detail'
  | 'ai-tutor'
  | 'live-learning'
  | 'assignments'
  | 'calendar'
  | 'academic-progress'
  | 'grades'
  | 'financial-aid'
  | 'campus-services'
  | 'it-support'
  | 'library'
  | 'messages'
  | 'notifications'
  | 'profile'
  // Faculty Views
  | 'faculty-dashboard'
  | 'faculty-courses'
  | 'faculty-students'
  | 'faculty-analytics'
  | 'faculty-ai'
  // Admin Views
  | 'admin-dashboard'
  | 'admin-chronicle'
  | 'admin-ai'
  | 'admin-observability'
  | 'admin-compliance'
  | 'admin-integrations';

export type CampusIntent =
  | 'ACADEMICS'
  | 'COURSES'
  | 'ASSIGNMENTS'
  | 'EXAMS'
  | 'GRADES'
  | 'DEGREE_PROGRESS'
  | 'REGISTRATION'
  | 'ACADEMIC_ADVISING'
  | 'ADMISSIONS'
  | 'FINANCIAL_AID'
  | 'BILLING'
  | 'IT_SUPPORT'
  | 'LIBRARY'
  | 'CAMPUS_SERVICES'
  | 'CAMPUS_NAVIGATION'
  | 'EVENTS'
  | 'STUDENT_LIFE'
  | 'CAREER'
  | 'MESSAGING'
  | 'NOTIFICATIONS'
  | 'DOCUMENTS'
  | 'AI_TUTOR'
  | 'HUMAN_ESCALATION'
  | 'GENERAL_ASSISTANCE'
  | 'CALENDAR'
  | 'FACULTY_SUPPORT'
  | 'ADMINISTRATION'
  | 'GENERAL';

export type CampusCardType =
  | 'schedule'
  | 'assignments'
  | 'registration'
  | 'grades'
  | 'degree_progress'
  | 'financial_aid'
  | 'it_support'
  | 'library'
  | 'advising'
  | 'campus_services'
  | 'campus_navigation'
  | 'events'
  | 'student_life'
  | 'career'
  | 'documents'
  | 'ai_tutor_quiz'
  | 'human_escalation'
  | 'simple_points';

export type CampusResponseMode =
  | 'GENERAL ASSISTANT'
  | 'AI TUTOR'
  | 'ACADEMIC ADVISOR'
  | 'ADMISSIONS ASSISTANT'
  | 'FINANCIAL-AID ASSISTANT'
  | 'IT SUPPORT'
  | 'CAMPUS GUIDE';

export interface RAGSource {
  id: string;
  title: string;
  department: string;
  updatedAt: string;
  version: string;
  section: string;
  excerpt: string;
}

export interface EscalationDetails {
  department: string;
  reason: string;
  contactOption: string;
  appointmentOption: string;
  primaryActionLabel: 'Connect with Advisor' | 'Contact Financial Aid' | 'Open IT Ticket' | 'Contact Registrar';
  targetView: ViewId;
}

export interface ChatMessage {
  id: string;
  sender: 'student' | 'ai';
  text: string;
  timestamp: string;
  channel: 'Web Chat' | 'SMS' | 'Email' | 'Mobile App';
  confidence?: 'high' | 'medium' | 'low';
  confidenceLabel?: 'HIGH CONFIDENCE' | 'MEDIUM CONFIDENCE' | 'LOW CONFIDENCE';
  intent?: CampusIntent | string;
  responseMode?: CampusResponseMode;
  knowledgeLevel?: string;
  escalationDetails?: EscalationDetails;
  sources?: RAGSource[];
  suggestedActions?: Array<{
    label: string;
    targetView: ViewId;
    payload?: string;
  }>;
  providerUsed?: string;
  attachment?: string;
  cardType?: CampusCardType;
  cardData?: any;
}

export interface AssistantConversation {
  id: string;
  title: string;
  category?: string;
  timestamp: string;
  preview: string;
  messages: ChatMessage[];
}

export interface CourseModuleItem {
  id: string;
  type: 'video' | 'reading' | 'quiz' | 'assignment';
  title: string;
  durationOrDue: string;
  completed: boolean;
}

export interface CourseModule {
  id: string;
  week: string;
  title: string;
  summary: string;
  items: CourseModuleItem[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  professor: string;
  professorRole: string;
  department: string;
  credits: number;
  progress: number;
  currentGrade: string;
  numericScore: number;
  nextClass: string;
  room: string;
  nextAssignmentTitle: string;
  nextAssignmentDue: string;
  description: string;
  modules: CourseModule[];
}

export interface AssignmentItem {
  id: string;
  courseId: string;
  courseCode: string;
  title: string;
  dueDate: string;
  dueBucket: 'today' | 'week' | 'upcoming' | 'completed';
  progress: number;
  priority: 'High' | 'Medium' | 'Standard';
  points: string;
  statusText: string;
}

export interface CalendarEventItem {
  id: string;
  title: string;
  courseOrDept: string;
  date: string;
  dayOfMonth: number;
  time: string;
  location: string;
  type: 'Class' | 'Assignment' | 'Exam' | 'Advising' | 'Campus Event';
}

export interface CampusServiceItem {
  id: string;
  title: string;
  category: 'Academic' | 'Student Life' | 'Health & Wellness' | 'Technology' | 'Financial' | 'Career' | 'Library' | 'Accessibility';
  description: string;
  hours: string;
  contact: string;
  location: string;
  aiPrompt: string;
}

export interface LibraryResource {
  id: string;
  title: string;
  authors: string;
  year: number;
  type: 'Books' | 'Articles' | 'Journals' | 'Databases';
  callNumber: string;
  citation: string;
  available: boolean;
  abstract: string;
}

export interface NotificationItem {
  id: string;
  category: 'Academic' | 'Financial' | 'Campus' | 'System';
  title: string;
  detail: string;
  timestamp: string;
  unread: boolean;
  targetView: ViewId;
}

export interface MessageThread {
  id: string;
  correspondent: string;
  role: string;
  department: string;
  unread: boolean;
  lastUpdated: string;
  channelSync: string;
  messages: Array<{
    id: string;
    sender: string;
    time: string;
    body: string;
  }>;
}

export interface CourseCatalogItem {
  id: string;
  code: string;
  title: string;
  credits: number;
  department: string;
  category: 'Major Core' | 'General Education' | 'Technical Elective' | 'Interdisciplinary';
  level: '100' | '200' | '300' | '400';
  prerequisites: string[];
  tags: string[];
  description: string;
  professor: string;
  schedule: string;
  room: string;
}

export type CourseRecommendationRationale =
  | 'general_education'
  | 'major_core'
  | 'interest_match'
  | 'career_path'
  | 'prerequisite_unlocked';

export interface PersonalizedCourseRecommendation {
  id: string;
  courseId: string;
  code: string;
  title: string;
  credits: number;
  department: string;
  category: 'Major Core' | 'General Education' | 'Technical Elective' | 'Interdisciplinary';
  explanation: string;
  rationaleType: CourseRecommendationRationale;
  matchScore: number;
  prerequisitesMet: boolean;
  targetSemester: string;
  schedule: string;
  room: string;
  professor: string;
  tags: string[];
}
