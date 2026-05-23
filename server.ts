/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { 
  User, 
  ClassSchedule, 
  Assignment, 
  Submission, 
  Quiz, 
  QuizSubmission, 
  Attendance, 
  Payment, 
  ChatMessage, 
  Announcement, 
  Todo,
  Testimonial,
  GameScore
} from "./src/types";

// Setup port and server
const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database State
const users: User[] = [
  {
    id: "user-teacher",
    username: "Neha Kumari",
    email: "teacher@tuition.com",
    role: "teacher",
    registeredAt: "2026-01-10T12:00:00Z",
    enrolledSubjects: ["Mathematics", "Science", "Social Science", "English", "Hindi", "EVS"]
  },
  {
    id: "user-student-1",
    username: "Vaibhav Raj",
    email: "student@tuition.com",
    role: "student",
    registeredAt: "2026-05-15T10:00:00Z",
    chosenSubject: "Science",
    enrolledSubjects: ["Science", "Mathematics", "EVS"],
    monthlyFee: 1500,
    feeStatus: "unpaid"
  },
  {
    id: "user-student-2",
    username: "Rohan Sharma",
    email: "rohan@tuition.com",
    role: "student",
    registeredAt: "2026-05-12T08:30:00Z",
    chosenSubject: "Mathematics",
    enrolledSubjects: ["Mathematics", "Social Science"],
    monthlyFee: 1800,
    feeStatus: "paid"
  },
  {
    id: "user-student-3",
    username: "Priya Verma",
    email: "priya@tuition.com",
    role: "student",
    registeredAt: "2026-05-14T09:15:00Z",
    chosenSubject: "English",
    enrolledSubjects: ["English", "Hindi"],
    monthlyFee: 1200,
    feeStatus: "unassigned"
  },
  {
    id: "user-parent-1",
    username: "Rajesh Raj",
    email: "parent@tuition.com",
    role: "parent",
    registeredAt: "2026-05-16T12:00:00Z",
    enrolledSubjects: [],
    wardId: "user-student-1"
  }
];

// Seeded passwords (simple plain-text comparison for this developer applet)
const userPasswords: Record<string, string> = {
  "teacher@tuition.com": "teacher123",
  "student@tuition.com": "student123",
  "rohan@tuition.com": "student123",
  "priya@tuition.com": "student123",
  "parent@tuition.com": "parent123"
};

const classSchedules: ClassSchedule[] = [
  {
    id: "class-1",
    title: "Linear Equations & Fractions Word Problems",
    subject: "Mathematics",
    dateTime: "2026-05-22T10:00:00Z", // Tomorrow
    duration: 60,
    meetLink: "https://meet.google.com/abc-defg-hij",
    description: "Developing algebraic models from elementary word problems for Class 6-10 students.",
    status: "upcoming",
    teacherName: "Neha Kumari"
  },
  {
    id: "class-2",
    title: "Air & Water Pollution Causes and EVS Projects",
    subject: "EVS",
    dateTime: "2026-05-23T14:00:00Z",
    duration: 45,
    meetLink: "https://meet.google.com/mnp-qrst-uvw",
    description: "Interactive session examining environmental pollutants and discussing home project notes.",
    status: "upcoming",
    teacherName: "Neha Kumari"
  },
  {
    id: "class-3",
    title: "Understanding Chemical Elements and Atoms",
    subject: "Science",
    dateTime: "2026-05-24T16:00:00Z",
    duration: 60,
    meetLink: "https://meet.google.com/xyz-lmn-opq",
    description: "Introduction to elements, molecules and chemical compounds balancing for beginner level groups.",
    status: "upcoming",
    teacherName: "Neha Kumari"
  },
  {
    id: "class-4",
    title: "Subject-Verb Agreement Rules",
    subject: "English",
    dateTime: "2026-05-20T10:00:00Z", // Yesterday
    duration: 60,
    meetLink: "https://meet.google.com/kin-emat-ics",
    description: "Reviewing fundamental workbook assignments on singular and plural verb agreement.",
    status: "completed",
    teacherName: "Neha Kumari"
  }
];

const assignments: Assignment[] = [
  {
    id: "assign-1",
    title: "Class 10 Fractions and Percentages Solverheet",
    description: "Examine the 5 workbook problems. Complete and upload a clear picture/photo of your handwritten answers or submit a typed document.",
    subject: "Mathematics",
    dueDate: "2026-05-25",
    totalPoints: 100
  },
  {
    id: "assign-2",
    title: "Social Science: Indian Freedom Struggle Map Plotting",
    description: "Mark and identify the 5 historic locations. Capture a photo from your workbook & submit below.",
    subject: "Social Science",
    dueDate: "2026-05-28",
    totalPoints: 50
  }
];

const submissions: Submission[] = [
  {
    id: "sub-1",
    assignmentId: "assign-1",
    assignmentTitle: "Class 10 Fractions and Percentages Solverheet",
    studentId: "user-student-2",
    studentName: "Rohan Sharma",
    content: "Solved handwritten solutions uploaded. 1. 2/5 = 40%, 2. 0.75 ratio = 75%. Calculations look clear and standard.",
    submittedAt: "2026-05-19T14:22:00Z",
    grade: "A+",
    pointsEarned: 95,
    feedback: "Incredibly neat handwriting, Rohan! Proper fraction diagrams drawn.",
    status: "graded"
  },
  {
    id: "sub-2",
    assignmentId: "assign-1",
    assignmentTitle: "Class 10 Fractions and Percentages Solverheet",
    studentId: "user-student-3",
    studentName: "Priya Verma",
    content: "Workbook answers: Worked through percentage conversions. Total calculated is 85%. Included step-by-step ratio analysis.",
    submittedAt: "2026-05-20T11:45:00Z",
    status: "pending"
  }
];

const quizzes: Quiz[] = [
  {
    id: "quiz-1",
    title: "Water Condensation & Rain Cycle Quiz",
    subject: "Science",
    questions: [
      {
        id: "q-1-1",
        questionText: "What do we call the process of water changing into gas/vapor form?",
        options: ["Condensation", "Evaporation", "Freezing", "Precipitation"],
        correctAnswerIndex: 1
      },
      {
        id: "q-1-2",
        questionText: "Which of the following is responsible for driving the Earth's water cycle?",
        options: ["The Sun", "Ocean currents", "Wind speed", "Gravity force"],
        correctAnswerIndex: 0
      },
      {
        id: "q-1-3",
        questionText: "Water vapor cooling down to form liquid droplets is called:",
        options: ["Sublimation", "Condensation", "Transpiration", "Melting"],
        correctAnswerIndex: 1
      }
    ]
  },
  {
    id: "quiz-2",
    title: "Fractions & Basic LCM Math Quiz",
    subject: "Mathematics",
    questions: [
      {
        id: "q-2-1",
        questionText: "What is the Lowest Common Multiple (LCM) of 4 and 6?",
        options: ["2", "12", "24", "10"],
        correctAnswerIndex: 1
      },
      {
        id: "q-2-2",
        questionText: "Simplify the fraction 6/18 to its lowest terms:",
        options: ["1/2", "1/3", "2/3", "3/6"],
        correctAnswerIndex: 1
      }
    ]
  }
];

const quizSubmissions: QuizSubmission[] = [
  {
    id: "qsub-1",
    quizId: "quiz-1",
    quizTitle: "Water Condensation & Rain Cycle Quiz",
    studentId: "user-student-2",
    studentName: "Rohan Sharma",
    score: 3,
    totalPoints: 3,
    submittedAt: "2026-05-18T10:00:00Z"
  }
];

const attendanceRecords: Attendance[] = [
  {
    id: "att-1",
    classId: "class-4",
    classTitle: "Subject-Verb Agreement Rules",
    studentId: "user-student-2",
    studentName: "Rohan Sharma",
    durationJoined: 2700, // 45 minutes out of 60 standard -> 75%
    markedPresent: true,
    autoMarked: true,
    timestamp: "2026-05-20T10:45:00Z"
  },
  {
    id: "att-2",
    classId: "class-4",
    classTitle: "Subject-Verb Agreement Rules",
    studentId: "user-student-3",
    studentName: "Priya Verma",
    durationJoined: 3200, // 53 minutes -> 88%
    markedPresent: true,
    autoMarked: true,
    timestamp: "2026-05-20T10:53:00Z"
  },
  {
    id: "att-3",
    classId: "class-4",
    classTitle: "Subject-Verb Agreement Rules",
    studentId: "user-student-1",
    studentName: "Vaibhav Raj",
    durationJoined: 1500, // 25 mins out of 60 -> 41%
    markedPresent: false,
    autoMarked: false,
    timestamp: "2026-05-20T10:25:00Z"
  }
];

const payments: Payment[] = [
  {
    id: "pay-1",
    studentId: "user-student-1",
    studentName: "Vaibhav Raj",
    amount: 2500,
    currency: "INR",
    status: "success",
    reason: "Science & Languages Semester Course Pass",
    paymentMethod: "Credit Card ending in 4242",
    date: "2026-05-15T11:00:00Z"
  },
  {
    id: "pay-2",
    studentId: "user-student-2",
    studentName: "Rohan Sharma",
    amount: 1500,
    currency: "INR",
    status: "success",
    reason: "Mathematics Fractions Course Pass",
    paymentMethod: "UPI Transaction ID: upi123984@okhdfc",
    date: "2026-05-12T09:00:00Z"
  }
];

const chatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    senderId: "user-teacher",
    senderName: "Teacher Neha Kumari",
    senderRole: "teacher",
    receiverId: "user-student-1",
    content: "Hi Vaibhav, welcome to our classes! Let me know if you have any questions on Science or Mathematics.",
    timestamp: "2026-05-16T09:00:00Z"
  },
  {
    id: "msg-2",
    senderId: "user-student-1",
    senderName: "Vaibhav Raj",
    senderRole: "student",
    receiverId: "user-teacher",
    content: "Thank you Neha Ma'am! I am checking the recorded syllabus lectures and the Mathematics worksheet now.",
    timestamp: "2026-05-16T12:30:00Z"
  }
];

const announcements: Announcement[] = [
  {
    id: "ann-1",
    title: "Mega Revision Test for Water Cycle next week",
    content: "Hello everyone, please prepare standard EVS textbook concepts on the Water Cycle and Pollutants. We will run an interactive mini-test during next Thursday's Live Class. Attendance is mandatory!",
    author: "Teacher Neha Kumari",
    date: "2026-05-20T08:00:00Z",
    priority: "high"
  },
  {
    id: "ann-2",
    title: "New Fractions & Geometry Practice Notes Uploaded",
    content: "Mathematics fractions notes detailing basic LCM and denominators properties have been loaded in the recorded library tab under files. Please read before our next live session.",
    author: "Teacher Neha Kumari",
    date: "2026-05-18T15:00:00Z",
    priority: "medium"
  }
];

const recordedLectures = [
  {
    id: "v-1",
    title: "Junior Evaporation Theory & Water Cycle",
    subject: "Science",
    duration: "45 mins",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=500&auto=format&fit=crop&q=60",
    description: "Detailed derivations and step-by-step processes of water condensation and rainfall forms."
  },
  {
    id: "v-2",
    title: "Fractions Multiplication & Division Properties",
    subject: "Mathematics",
    duration: "55 mins",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=60",
    description: "Multiplication parameters, calculating LCM and visual fractional pieces."
  }
];

const studentTodos: Todo[] = [
  {
    id: "todo-1",
    studentId: "user-student-1",
    text: "Review Fractions & Decimals concepts",
    completed: false,
    dueDate: "2026-05-22"
  },
  {
    id: "todo-2",
    studentId: "user-student-1",
    text: "Submit Geography worksheet before Friday",
    completed: false,
    dueDate: "2026-05-25"
  },
  {
    id: "todo-3",
    studentId: "user-student-1",
    text: "Practice english grammar worksheet on word agreement",
    completed: true,
    dueDate: "2026-05-20"
  }
];

const testimonials: Testimonial[] = [
  {
    id: "test-1",
    studentName: "Abhinav Kumar",
    subject: "Science & Maths",
    rating: 5,
    text: "Teacher Neha Kumari explains science concepts in a very intuitive way. I had major doubts in fractions, but her visual diagrams and interactive sessions cleared everything! Scored a 98/100 in my school exams.",
    date: "2026-04-18"
  },
  {
    id: "test-2",
    studentName: "Sophia Joseph",
    subject: "English & Hindi",
    rating: 5,
    text: "The grammar worksheets and noun templates provided by Neha ma'am are lifesavers! The integrated AI tutor chatbot answers questions even at 11 PM during my mock tests preparation!",
    date: "2026-05-02"
  },
  {
    id: "test-3",
    studentName: "Dinesh Patil",
    subject: "Mathematics",
    rating: 4.8,
    text: "Best tuition experience ever. The interactive dashboard, automatic attendance checks, and downloadable class transcripts help revision at my own pace.",
    date: "2026-05-10"
  }
];

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    }
  });
}

// ---------------- API ENDPOINTS ----------------

// 1. Authentication
app.post("/api/auth/register", (req, res) => {
  const { username, email, password, role, chosenSubject, wardId } = req.body;
  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: "Missing required registration parameters." });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "User with this email already exists." });
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    username,
    email: email.toLowerCase(),
    role: role as 'teacher' | 'student' | 'parent',
    registeredAt: new Date().toISOString(),
    chosenSubject: chosenSubject || "Mathematics",
    enrolledSubjects: role === 'student' ? [chosenSubject || "Mathematics"] : [],
    wardId: role === 'parent' ? (wardId || "user-student-1") : undefined,
    feeStatus: role === 'student' ? 'unassigned' : undefined,
    monthlyFee: role === 'student' ? 1500 : undefined
  };

  users.push(newUser);
  userPasswords[email.toLowerCase()] = password;

  res.status(201).json({ user: newUser });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Both email and password are required." });
  }

  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || userPasswords[email.toLowerCase()] !== password) {
    return res.status(401).json({ error: "Invalid email credentials or password." });
  }

  res.json({ user });
});

// Student Management and Tuition Fees Routing
app.get("/api/users", (req, res) => {
  res.json(users);
});

app.get("/api/students", (req, res) => {
  const students = users.filter(u => u.role === 'student');
  res.json(students);
});

app.patch("/api/users/:id/fee", (req, res) => {
  const { id } = req.params;
  const { monthlyFee, feeStatus } = req.body;
  const targetUser = users.find(u => u.id === id);
  if (!targetUser) {
    return res.status(404).json({ error: "User profile not found." });
  }

  if (monthlyFee !== undefined) targetUser.monthlyFee = Number(monthlyFee);
  if (feeStatus !== undefined) targetUser.feeStatus = feeStatus;

  res.json({ success: true, user: targetUser });
});

// 2. Class Scheduling & Management
app.get("/api/schedule", (req, res) => {
  res.json(classSchedules);
});

app.post("/api/schedule", (req, res) => {
  const { title, subject, dateTime, duration, meetLink, description } = req.body;
  if (!title || !subject || !dateTime || !duration || !meetLink) {
    return res.status(400).json({ error: "Required fields are missing." });
  }

  const newClass: ClassSchedule = {
    id: `class-${Date.now()}`,
    title,
    subject,
    dateTime,
    duration: Number(duration),
    meetLink,
    description: description || "",
    status: "upcoming",
    teacherName: "Neha Kumari"
  };

  classSchedules.push(newClass);
  res.status(201).json(newClass);
});

app.delete("/api/schedule/:id", (req, res) => {
  const id = req.params.id;
  const idx = classSchedules.findIndex(c => c.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Class not found." });
  }
  classSchedules.splice(idx, 1);
  res.json({ success: true, message: "Class deleted successfully." });
});

// Update class status (live, complete, upcoming)
app.patch("/api/schedule/:id/status", (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const classItem = classSchedules.find(c => c.id === id);
  if (!classItem) {
    return res.status(404).json({ error: "Class not found." });
  }
  classItem.status = status;
  res.json(classItem);
});

// 3. Assignments
app.get("/api/assignments", (req, res) => {
  res.json(assignments);
});

app.post("/api/assignments", (req, res) => {
  const { title, description, subject, dueDate, totalPoints } = req.body;
  if (!title || !subject || !dueDate || !totalPoints) {
    return res.status(400).json({ error: "Missing assignment details." });
  }

  const newAssignment: Assignment = {
    id: `assign-${Date.now()}`,
    title,
    description: description || "",
    subject,
    dueDate,
    totalPoints: Number(totalPoints)
  };

  assignments.push(newAssignment);
  res.status(201).json(newAssignment);
});

// 4. Submissions
app.get("/api/submissions", (req, res) => {
  const { studentId } = req.query;
  if (studentId) {
    const list = submissions.filter(s => s.studentId === studentId);
    return res.json(list);
  }
  res.json(submissions);
});

app.post("/api/submissions", (req, res) => {
  const { assignmentId, assignmentTitle, studentId, studentName, content } = req.body;
  if (!assignmentId || !studentId || !content) {
    return res.status(400).json({ error: "Missing submission entries." });
  }

  const newSub: Submission = {
    id: `sub-${Date.now()}`,
    assignmentId,
    assignmentTitle: assignmentTitle || "System Assignment",
    studentId,
    studentName: studentName || "Student Student",
    content,
    submittedAt: new Date().toISOString(),
    status: "pending"
  };

  submissions.push(newSub);
  res.status(201).json(newSub);
});

app.post("/api/submissions/grade", (req, res) => {
  const { submissionId, grade, pointsEarned, feedback } = req.body;
  if (!submissionId || !grade || pointsEarned === undefined) {
    return res.status(400).json({ error: "Missing grading entries." });
  }

  const sub = submissions.find(s => s.id === submissionId);
  if (!sub) {
    return res.status(404).json({ error: "Submission not found." });
  }

  sub.grade = grade;
  sub.pointsEarned = Number(pointsEarned);
  sub.feedback = feedback || "";
  sub.status = "graded";

  res.json(sub);
});

// 5. Quizzes
app.get("/api/quizzes", (req, res) => {
  res.json(quizzes);
});

app.post("/api/quizzes", (req, res) => {
  const { title, subject, questions } = req.body;
  if (!title || !subject || !questions || !Array.isArray(questions)) {
    return res.status(400).json({ error: "Missing quiz inputs." });
  }

  const newQuiz: Quiz = {
    id: `quiz-${Date.now()}`,
    title,
    subject,
    questions: questions.map((q: any, i: number) => ({
      id: `q-${Date.now()}-${i}`,
      questionText: q.questionText,
      options: q.options,
      correctAnswerIndex: Number(q.correctAnswerIndex)
    }))
  };

  quizzes.push(newQuiz);
  res.status(201).json(newQuiz);
});

app.get("/api/quizzes/submissions", (req, res) => {
  const { studentId } = req.query;
  if (studentId) {
    return res.json(quizSubmissions.filter(qs => qs.studentId === studentId));
  }
  res.json(quizSubmissions);
});

app.post("/api/quizzes/submit", (req, res) => {
  const { quizId, quizTitle, studentId, studentName, score, totalPoints } = req.body;
  if (!quizId || !studentId) {
    return res.status(400).json({ error: "Incomplete quiz submit parameters." });
  }

  const newQuizSub: QuizSubmission = {
    id: `qsub-${Date.now()}`,
    quizId,
    quizTitle: quizTitle || "Course Evaluation Quiz",
    studentId,
    studentName: studentName || "Regular Student",
    score: Number(score),
    totalPoints: Number(totalPoints),
    submittedAt: new Date().toISOString()
  };

  quizSubmissions.push(newQuizSub);
  res.status(201).json(newQuizSub);
});

// 6. Attendance
app.get("/api/attendance", (req, res) => {
  const { studentId } = req.query;
  if (studentId) {
    return res.json(attendanceRecords.filter(a => a.studentId === studentId));
  }
  res.json(attendanceRecords);
});

app.post("/api/attendance/mark", (req, res) => {
  const { classId, classTitle, studentId, studentName, durationJoined } = req.body;
  if (!classId || !studentId) {
    return res.status(400).json({ error: "Missing attendance data variables." });
  }

  const cls = classSchedules.find(c => c.id === classId);
  const totalDurationSeconds = (cls ? cls.duration : 60) * 60; // total duration seconds

  // Automatically mark present if presence is > 70%
  const presenceRatio = durationJoined / totalDurationSeconds;
  const isPresent = presenceRatio >= 0.70;

  // Check if student record for this class already exists
  const existingIndex = attendanceRecords.findIndex(
    r => r.classId === classId && r.studentId === studentId
  );

  const updatedRecord: Attendance = {
    id: existingIndex !== -1 ? attendanceRecords[existingIndex].id : `att-${Date.now()}`,
    classId,
    classTitle: classTitle || (cls ? cls.title : "Active Zoom Module Lecture"),
    studentId,
    studentName: studentName || "E-Learning Student",
    durationJoined: Number(durationJoined),
    markedPresent: isPresent,
    autoMarked: true,
    timestamp: new Date().toISOString()
  };

  if (existingIndex !== -1) {
    attendanceRecords[existingIndex] = updatedRecord;
  } else {
    attendanceRecords.push(updatedRecord);
  }

  res.json({
    success: true,
    presenceRatio: Number(presenceRatio.toFixed(2)),
    markedPresent: isPresent,
    record: updatedRecord
  });
});

// Teacher manually override or mark attendance
app.post("/api/attendance/override", (req, res) => {
  const { classId, classTitle, studentId, studentName, markedPresent } = req.body;
  if (!classId || !studentId) {
    return res.status(400).json({ error: "Required fields are missing." });
  }

  const existingIndex = attendanceRecords.findIndex(
    r => r.classId === classId && r.studentId === studentId
  );

  const newRecord: Attendance = {
    id: existingIndex !== -1 ? attendanceRecords[existingIndex].id : `att-${Date.now()}`,
    classId,
    classTitle: classTitle || "Standard Course Lecture Class",
    studentId,
    studentName,
    durationJoined: existingIndex !== -1 ? attendanceRecords[existingIndex].durationJoined : 3600,
    markedPresent: Boolean(markedPresent),
    autoMarked: false,
    timestamp: new Date().toISOString()
  };

  if (existingIndex !== -1) {
    attendanceRecords[existingIndex] = newRecord;
  } else {
    attendanceRecords.push(newRecord);
  }

  res.json(newRecord);
});

// 7. Download Attendance Report (creates clean JSON / printable raw logs structure)
app.get("/api/attendance/report", (req, res) => {
  // Return nicely grouped attendance logs for PDF generation
  const grouped: Record<string, typeof attendanceRecords> = {};
  attendanceRecords.forEach(att => {
    if (!grouped[att.classTitle]) {
      grouped[att.classTitle] = [];
    }
    grouped[att.classTitle].push(att);
  });
  res.json({
    generatedAt: new Date().toISOString(),
    institution: "Aarambh Classes",
    totalClassesTracked: Object.keys(grouped).length,
    reportData: grouped
  });
});

// 8. Secure Payments (Mock gateway logs)
app.get("/api/payments", (req, res) => {
  const { studentId } = req.query;
  if (studentId) {
    return res.json(payments.filter(p => p.studentId === studentId));
  }
  res.json(payments);
});

app.post("/api/payments/charge", (req, res) => {
  const { studentId, studentName, amount, reason, paymentMethod } = req.body;
  if (!studentId || !amount || !reason) {
    return res.status(400).json({ error: "Invalid payment configurations." });
  }

  // Simulate payment processing
  const success = Math.random() > 0.05; // 95% pass rate for mockup gateway
  const newReceipt: Payment = {
    id: `pay-${Date.now()}`,
    studentId,
    studentName: studentName || "Academic Learner",
    amount: Number(amount),
    currency: "USD",
    status: success ? "success" : "failed",
    reason,
    paymentMethod: paymentMethod || "Virtual Card Sandbox Mode",
    date: new Date().toISOString()
  };

  payments.push(newReceipt);

  if (success) {
    // Add chosen or enrolled subject automatically upon payment
    const student = users.find(u => u.id === studentId);
    if (student) {
      const parts = reason.split(":");
      const cleanedSubject = parts.length > 1 ? parts[1].trim() : "General Tuitions";
      if (!student.enrolledSubjects.includes(cleanedSubject)) {
        student.enrolledSubjects.push(cleanedSubject);
      }
    }
    res.json({ success: true, receipt: newReceipt });
  } else {
    res.status(422).json({ success: false, error: "Sandbox payment rejected by bank validation.", receipt: newReceipt });
  }
});

// 9. Tuition Chat (Student and Teacher)
app.get("/api/chat", (req, res) => {
  const { studentId } = req.query;
  if (studentId) {
    const thread = chatMessages.filter(
      m => (m.senderId === studentId && m.receiverId === "user-teacher") || 
           (m.senderId === "user-teacher" && m.receiverId === studentId)
    );
    return res.json(thread);
  }
  res.json(chatMessages);
});

app.post("/api/chat", (req, res) => {
  const { senderId, senderName, senderRole, receiverId, content } = req.body;
  if (!senderId || !content) {
    return res.status(400).json({ error: "Sender credentials or content is blank." });
  }

  const newMessage: ChatMessage = {
    id: `msg-${Date.now()}`,
    senderId,
    senderName: senderName || "Tuition Portal User",
    senderRole: senderRole || "student",
    receiverId: receiverId || "user-teacher",
    content,
    timestamp: new Date().toISOString()
  };

  chatMessages.push(newMessage);
  res.status(201).json(newMessage);
});

// 10. AI Chatbot Zweifel (Doubt Solver)
app.post("/api/chatbot", async (req, res) => {
  const { question, subject, conversationHistory } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Question cannot be blank." });
  }

  const subjectContext = subject ? `Subject: ${subject}.` : "";
  const systemPrompt = `You are "TuitionAI", an empathetic, highly skilled subject doubt-solver chatbot supporting Aarambh Classes, an online tuition center for classes 1st-10th run by teacher Neha Kumari. 
  ${subjectContext}
  Provide clear, simple, child-friendly explanations, numerical calculations, or english grammar assistance suitable for school children. 
  Keep explanation structured, friendly, student-appropriate and write clean equations. Encourage the student in learning. Reference Neha Kumari's classes if appropriate.`;

  // Check if API key is loaded
  if (!ai) {
    // Elegant local tutor response fallback
    console.log("No GEMINI_API_KEY detected. Returning automated tutor response.");
    const lowerQuestion = question.toLowerCase();
    let reply = "I am TuitionAI, your dedicated Aarambh Classes chatbot helper! Keep learning!";
    
    if (lowerQuestion.includes("fraction") || lowerQuestion.includes("math") || lowerQuestion.includes("decimal")) {
      reply = "💡 **Middle School Fractions**: A fraction represents a part of a whole. Modern representation looks like: $\\frac{\\text{Numerator}}{\\text{Denominator}}$.\n\nFor example, if you eat 2 slices of a 4-slice pizza, you consumed $\\frac{2}{4}$ or $50\\%$ of the pizza! Ask Neha Kumari Ma'am in tomorrow's live class if you'd like more interactive fractions revision!";
    } else if (lowerQuestion.includes("verb") || lowerQuestion.includes("grammar") || lowerQuestion.includes("english")) {
      reply = "✍️ **Subject-Verb Agreement Principles**:\n1. Singular subjects require singular verbs (e.g., *The student studies EVS*).\n2. Plural subjects require plural verbs (e.g., *The students study EVS*).\n\nNeed help completing your grammar homework sheet? Drop us a prompt or ask Neha Ma'am in our peer-to-peer message boards.";
    } else if (lowerQuestion.includes("water") || lowerQuestion.includes("evs") || lowerQuestion.includes("pollution")) {
      reply = "💧 **The Water Cycle & Environment**:\n1. **Evaporation**: Sun heats up water, vapor arises.\n2. **Condensation**: Vapor cools down, forming dense clouds.\n3. **Precipitation**: Water falls down as rain or snow.\nKeep our water sources pure. Let us avoid throwing garbage or pollutants into active streams!";
    } else if (lowerQuestion.includes("fee") || lowerQuestion.includes("remind") || lowerQuestion.includes("pay") || lowerQuestion.includes("rupee") || lowerQuestion.includes("price")) {
      reply = "💳 **Tuition Fees**: In Aarambh Classes, our tuition fee is set and decided individually by Neha Kumari Ma'am. Between the 27th and 30th of every month, students and parents receive automated fee reminders. Payments can be cleared in Rupees (₹) via our secure sandbox UPI/Card checkout!";
    } else if (lowerQuestion.includes("class") || lowerQuestion.includes("schedule") || lowerQuestion.includes("live") || lowerQuestion.includes("meet")) {
      reply = "📅 **Online Live Lectures**: Click the **Live Class** button or any of your active schedules to automatically direct to our official Google Meet links. Staying checked into live lectures for at least 70% of the class duration automatically marks your attendance!";
    } else {
      reply = `🎓 **TuitionAI Response Guide**: Thank you for asking. For the subject ${subject || 'Science'}, make sure you follow the standard principles:\n\n- Write down your given variables first.\n- Select the formulas linking the knowns to the unknowns.\n\nIf you want more personalized feedback, please leave a message to Neha Kumari Ma'am in our student-teacher chat tab! *(Note to Developer: Define GEMINI_API_KEY inside the secrets panel to activate full live AI processing).*`;
    }

    return res.json({ 
      text: reply,
      note: "Note: Running in offline fallback mode because process.env.GEMINI_API_KEY is not configured.",
      isFallback: true
    });
  }

  try {
    const contents: any[] = [];
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach((item: any) => {
        contents.push({
          role: item.role === "user" ? "user" : "model",
          parts: [{ text: item.content }]
        });
      });
    }
    contents.push({
      role: "user",
      parts: [{ text: question }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API calculation failure:", error);
    res.status(500).json({ error: "Gemini AI calculations failed. Fallback to server support in case of secret mismatches." });
  }
});

// 11. Announcements
app.get("/api/announcements", (req, res) => {
  res.json(announcements);
});

app.post("/api/announcements", (req, res) => {
  const { title, content, priority } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Missing announcement title or prompt contents." });
  }

  const newAnn: Announcement = {
    id: `ann-${Date.now()}`,
    title,
    content,
    author: "Neha Kumari",
    date: new Date().toISOString(),
    priority: priority || "medium"
  };

  announcements.push(newAnn);
  res.status(201).json(newAnn);
});

// 12. Recorded Lectures
app.get("/api/recorded-lectures", (req, res) => {
  res.json(recordedLectures);
});

app.post("/api/recorded-lectures", (req, res) => {
  const { title, subject, duration, videoUrl, thumbnail, description } = req.body;
  if (!title || !subject || !duration) {
    return res.status(400).json({ error: "Missing recorded lecture key characteristics." });
  }

  const newLect = {
    id: `v-${Date.now()}`,
    title,
    subject,
    duration,
    videoUrl: videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail: thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60",
    description: description || "Reference lecture series."
  };

  recordedLectures.push(newLect);
  res.status(201).json(newLect);
});

// 13. Student Todos
app.get("/api/todos", (req, res) => {
  const { studentId } = req.query;
  if (!studentId) {
    return res.status(400).json({ error: "Student ID required." });
  }
  res.json(studentTodos.filter(t => t.studentId === studentId));
});

app.post("/api/todos", (req, res) => {
  const { studentId, text, dueDate } = req.body;
  if (!studentId || !text) {
    return res.status(400).json({ error: "Missing todo properties." });
  }

  const newTodo: Todo = {
    id: `todo-${Date.now()}`,
    studentId,
    text,
    completed: false,
    dueDate: dueDate || new Date().toISOString().split('T')[0]
  };

  studentTodos.push(newTodo);
  res.status(201).json(newTodo);
});

app.patch("/api/todos/:id", (req, res) => {
  const id = req.params.id;
  const { completed } = req.body;
  const todo = studentTodos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: "Todo not found." });
  }
  if (completed !== undefined) todo.completed = completed;
  res.json(todo);
});

app.delete("/api/todos/:id", (req, res) => {
  const id = req.params.id;
  const idx = studentTodos.findIndex(t => t.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Todo not found." });
  }
  studentTodos.splice(idx, 1);
  res.json({ success: true });
});

// 14. Testimonials & Subject Query (Home page references)
app.get("/api/testimonials", (req, res) => {
  res.json(testimonials);
});

app.post("/api/testimonials", (req, res) => {
  const { studentName, subject, rating, text } = req.body;
  if (!studentName || !text) {
    return res.status(400).json({ error: "Incomplete testimonial entries." });
  }
  const newT: Testimonial = {
    id: `test-${Date.now()}`,
    studentName,
    subject: subject || "Science",
    rating: Number(rating) || 5,
    text,
    date: new Date().toISOString().split('T')[0]
  };
  testimonials.push(newT);
  res.status(201).json(newT);
});

// Demo Classes Request Handling
app.post("/api/demo-request", (req, res) => {
  const { email, studentName, chosenSubject } = req.body;
  
  // Register or mark as demo requested
  let existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!existingUser) {
    existingUser = {
      id: `user-${Date.now()}`,
      username: studentName || "Demo Visitor",
      email: email.toLowerCase(),
      role: "student",
      registeredAt: new Date().toISOString(),
      chosenSubject,
      demoClassRequested: true,
      enrolledSubjects: []
    };
    users.push(existingUser);
    userPasswords[email.toLowerCase()] = "demo123"; // default demo password
  } else {
    existingUser.demoClassRequested = true;
    if (chosenSubject) existingUser.chosenSubject = chosenSubject;
  }

  res.json({ 
    success: true, 
    message: "Demo slot successfully reserved! You can log in with your email or password 'demo123' if you registered new.",
    user: existingUser,
    details: `Subject: ${chosenSubject || "General Science"} Demo Scheduled.`
  });
});

// 14. Parent Teacher Tag Queries
interface ParentQuery {
  id: string;
  parentName: string;
  wardName: string;
  queryType: string;
  message: string;
  taggedTeacher: string;
  date: string;
  status: 'pending' | 'resolved';
  teacherReply?: string;
}

const parentQueries: ParentQuery[] = [
  {
    id: "q-1",
    parentName: "Rajesh Raj",
    wardName: "Vaibhav Raj",
    queryType: "Homework Check",
    message: "Does Vaibhav require extra math problem sessions? His home fractions results look improving.",
    taggedTeacher: "Neha Kumari",
    date: "2026-05-18",
    status: "resolved",
    teacherReply: "Yes Rajesh! Vaibhav has been putting superb efforts. His fractions worksheets are entirely cleared. No extra remedial session needed!"
  }
];

app.get("/api/parent-queries", (req, res) => {
  res.json(parentQueries);
});

app.post("/api/parent-queries", (req, res) => {
  const { parentName, wardName, queryType, message, taggedTeacher } = req.body;
  if (!parentName || !message) {
    return res.status(400).json({ error: "Incomplete details inside query prompt parameters." });
  }
  const newQ: ParentQuery = {
    id: `q-${Date.now()}`,
    parentName,
    wardName: wardName || "Vaibhav Raj",
    queryType: queryType || "General Question",
    message,
    taggedTeacher: taggedTeacher || "Neha Kumari",
    date: new Date().toISOString().split('T')[0],
    status: "pending"
  };
  parentQueries.push(newQ);
  res.status(201).json(newQ);
});

app.post("/api/parent-queries/:id/reply", (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;
  const q = parentQueries.find(item => item.id === id);
  if (!q) {
    return res.status(404).json({ error: "Query not found." });
  }
  q.teacherReply = reply;
  q.status = "resolved";
  res.json(q);
});

// --- GAMIFIED STUDY SCOREBOARD DATABASE ---
const gameScores: GameScore[] = [
  {
    id: "gs-1",
    studentId: "user-student-1",
    studentName: "Vaibhav Raj",
    score: 80,
    classLevel: "Class 4",
    puzzleType: "Math Quest",
    timestamp: "2026-05-23T10:30:00Z"
  },
  {
    id: "gs-2",
    studentId: "user-student-2",
    studentName: "Rohan Sharma",
    score: 95,
    classLevel: "Class 3",
    puzzleType: "Jumbled Words",
    timestamp: "2026-05-22T14:15:00Z"
  },
  {
    id: "gs-3",
    studentId: "user-student-3",
    studentName: "Priya Verma",
    score: 100,
    classLevel: "Class 2",
    puzzleType: "Object Match",
    timestamp: "2026-05-23T08:00:00Z"
  }
];

app.get("/api/game-scores", (req, res) => {
  res.json(gameScores);
});

app.post("/api/game-scores", (req, res) => {
  const { studentId, studentName, score, classLevel, puzzleType } = req.body;
  if (!studentId || !studentName || score === undefined || !classLevel || !puzzleType) {
    return res.status(400).json({ error: "Missing score fields during upload." });
  }
  const newScore: GameScore = {
    id: `gs-${Date.now()}`,
    studentId,
    studentName,
    score: Number(score),
    classLevel,
    puzzleType,
    timestamp: new Date().toISOString()
  };
  gameScores.push(newScore);
  res.status(201).json(newScore);
});

// --- VITE MIDDLEWARE SETUP ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Tuition Hub Server running on http://localhost:${PORT}`);
  });
}

startServer();
