/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'teacher' | 'student' | 'parent';
  registeredAt: string;
  chosenSubject?: string;
  demoClassRequested?: boolean;
  enrolledSubjects: string[];
  monthlyFee?: number; // set by teacher
  feeStatus?: 'paid' | 'unpaid' | 'unassigned';
  wardId?: string; // links parent to student ID
}

export interface ClassSchedule {
  id: string;
  title: string;
  subject: string;
  dateTime: string;
  duration: number; // in minutes
  meetLink: string;
  description: string;
  status: 'upcoming' | 'completed' | 'live';
  teacherName: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  totalPoints: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  content: string; // Text or simulated file URL
  submittedAt: string;
  grade?: string;
  pointsEarned?: number;
  feedback?: string;
  status: 'pending' | 'graded';
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  questions: QuizQuestion[];
}

export interface QuizSubmission {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  score: number;
  totalPoints: number;
  submittedAt: string;
}

export interface Attendance {
  id: string;
  classId: string;
  classTitle: string;
  studentId: string;
  studentName: string;
  durationJoined: number; // seconds spent in simulated classroom
  markedPresent: boolean;
  autoMarked: boolean;
  timestamp: string;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending';
  reason: string;
  paymentMethod: string;
  date: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'teacher' | 'student';
  receiverId: string; // 'teacher' (or student user ID)
  content: string;
  timestamp: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Todo {
  id: string;
  studentId: string;
  text: string;
  completed: boolean;
  dueDate: string;
}

export interface Testimonial {
  id: string;
  studentName: string;
  subject: string;
  rating: number;
  text: string;
  date: string;
}

export interface GameScore {
  id: string;
  studentId: string;
  studentName: string;
  score: number;
  classLevel: string; // e.g. "Class 1", "Class 2", "Class 3", "Class 4", "Class 5"
  puzzleType: string; // e.g. "Jumbled Words", "Math Quest", "Object Match"
  timestamp: string;
}

