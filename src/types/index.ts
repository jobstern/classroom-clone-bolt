export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'teacher' | 'student';
  phone?: string;
  location?: string;
  bio?: string;
  birth_date?: string;
  institution?: string;
  department?: string;
  subjects?: string[];
}

export interface Class {
  id: string;
  name: string;
  description: string;
  subject: string;
  teacherId: string;
  students: string[];
  color: string;
  code: string;
}

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  description: string;
  dueDate: Date;
  points: number;
  attachments: string[];
  submissions: Submission[];
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  attachments: string[];
  submittedAt: Date;
  grade?: number;
  feedback?: string;
}

export interface Interaction {
  id: string;
  studentId: string;
  type: 'view' | 'click' | 'submit' | 'download' | 'popup_viewed';
  target: string;
  timestamp: Date;
  duration?: number;
  metadata?: Record<string, any>;
}

export interface SelfRegulationTip {
  id: string;
  title: string;
  content: string;
  category: 'time_management' | 'focus' | 'stress' | 'motivation';
  trigger: 'time_spent' | 'inactivity' | 'deadline_approaching' | 'low_engagement';
  triggerValue: number;
}

export interface Analytics {
  studentId: string;
  totalTimeSpent: number;
  activitiesCompleted: number;
  averageGrade: number;
  engagementScore: number;
  lastActive: Date;
  tipsViewed: number;
  interactions: Interaction[];
}

export interface StudySession {
  id: string;
  subject: string;
  duration: number;
  date: string;
  focus: number;
  notes: string;
}

export interface Grade {
  id: string;
  assignmentTitle: string;
  className: string;
  grade: number;
  maxPoints: number;
  date: string;
  feedback: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'assignment' | 'grade' | 'reminder' | 'system';
  date: string;
  read: boolean;
}