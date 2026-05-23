/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  CheckSquare, 
  User, 
  PlusCircle, 
  ClipboardList, 
  FileSpreadsheet, 
  Video, 
  Megaphone,
  CheckCircle,
  TrendingUp,
  Award,
  BookMarked,
  ShieldAlert,
  Loader,
  X,
  Sparkles,
  Download,
  RefreshCw
} from 'lucide-react';
import { 
  User as UserType, 
  ClassSchedule, 
  Assignment, 
  Submission, 
  Quiz, 
  Attendance, 
  Announcement, 
  Payment,
  GameScore
} from '../types';

export default function TeacherDashboard() {
  // Sync States
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [gameScores, setGameScores] = useState<GameScore[]>([]);

  // Sub-forms active toggle state
  const [activeForm, setActiveForm] = useState<'schedule' | 'assignment' | 'video' | 'announcement' | 'quiz' | null>(null);

  // Form Fields
  // 1. Live Schedule
  const [schTitle, setSchTitle] = useState('');
  const [schSubject, setSchSubject] = useState('Science');
  const [schDate, setSchDate] = useState('');
  const [schDuration, setSchDuration] = useState('60');
  const [schLink, setSchLink] = useState('https://meet.google.com/abc-defg-hij');
  const [schDesc, setSchDesc] = useState('');

  // 2. Assignment Form
  const [asTitle, setAsTitle] = useState('');
  const [asSubject, setAsSubject] = useState('Science');
  const [asDesc, setAsDesc] = useState('');
  const [asDueDate, setAsDueDate] = useState('');
  const [asPoints, setAsPoints] = useState('100');

  // 3. Recorded Lecture
  const [vTitle, setVTitle] = useState('');
  const [vSubject, setVSubject] = useState('Science');
  const [vDuration, setVDuration] = useState('45 mins');
  const [vUrl, setVUrl] = useState('https://www.w3schools.com/html/mov_bbb.mp4');
  const [vThumbnail, setVThumbnail] = useState('https://images.unsplash.com/photo-1517842645767-c639042777db?w=500&auto=format&fit=crop&q=60');
  const [vDesc, setVDesc] = useState('');

  // 4. Announcement Form
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // 5. Quiz Form
  const [qzTitle, setQzTitle] = useState('');
  const [qzSubject, setQzSubject] = useState('Science');
  const [qzQuestions, setQzQuestions] = useState<Array<{ questionText: string; options: string[]; correctAnswerIndex: number }>>([
    { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }
  ]);

  // Grading tool active state
  const [activeGradingSub, setActiveGradingSub] = useState<Submission | null>(null);
  const [gPoints, setGPoints] = useState('');
  const [gGrade, setGGrade] = useState('A');
  const [gFeedback, setGFeedback] = useState('');

  // Manual attendance override fields
  const [manualClassId, setManualClassId] = useState('');
  const [manualStudentId, setManualStudentId] = useState('user-student-1');
  const [manualPresent, setManualPresent] = useState(true);
  const [manualClassTitle, setManualClassTitle] = useState('Standard Course Lecture Class');

  useEffect(() => {
    fetchTeacherStats();
  }, []);

  const fetchTeacherStats = async () => {
    try {
      const resSch = await fetch('/api/schedule');
      if (resSch.ok) setSchedules(await resSch.json());

      const resAs = await fetch('/api/assignments');
      if (resAs.ok) setAssignments(await resAs.json());

      const resSub = await fetch('/api/submissions');
      if (resSub.ok) setSubmissions(await resSub.json());

      const resQz = await fetch('/api/quizzes');
      if (resQz.ok) setQuizzes(await resQz.json());

      const resAtt = await fetch('/api/attendance');
      if (resAtt.ok) setAttendance(await resAtt.json());

      const resAnn = await fetch('/api/announcements');
      if (resAnn.ok) setAnnouncements(await resAnn.json());

      const resPay = await fetch('/api/payments');
      if (resPay.ok) setPayments(await resPay.json());

      const resGame = await fetch('/api/game-scores');
      if (resGame.ok) setGameScores(await resGame.json());
    } catch (e) {
      console.error(e);
    }
  };

  // Submit Operations
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: schTitle,
          subject: schSubject,
          dateTime: schDate,
          duration: schDuration,
          meetLink: schLink,
          description: schDesc
        })
      });
      if (res.ok) {
        setSchTitle('');
        setSchDesc('');
        setActiveForm(null);
        fetchTeacherStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: asTitle,
          description: asDesc,
          subject: asSubject,
          dueDate: asDueDate,
          totalPoints: asPoints
        })
      });
      if (res.ok) {
        setAsTitle('');
        setAsDesc('');
        setAsDueDate('');
        setActiveForm(null);
        fetchTeacherStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/recorded-lectures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: vTitle,
          subject: vSubject,
          duration: vDuration,
          videoUrl: vUrl,
          thumbnail: vThumbnail,
          description: vDesc
        })
      });
      if (res.ok) {
        setVTitle('');
        setVDesc('');
        setActiveForm(null);
        fetchTeacherStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: annTitle,
          content: annContent,
          priority: annPriority
        })
      });
      if (res.ok) {
        setAnnTitle('');
        setAnnContent('');
        setActiveForm(null);
        fetchTeacherStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuizQuestionChange = (qIndex: number, field: string, val: any, optIndex?: number) => {
    const updated = [...qzQuestions];
    if (field === 'questionText') {
      updated[qIndex].questionText = val;
    } else if (field === 'correctAnswerIndex') {
      updated[qIndex].correctAnswerIndex = Number(val);
    } else if (field === 'option' && optIndex !== undefined) {
      updated[qIndex].options[optIndex] = val;
    }
    setQzQuestions(updated);
  };

  const handleAddQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: qzTitle,
          subject: qzSubject,
          questions: qzQuestions
        })
      });
      if (res.ok) {
        setQzTitle('');
        setQzQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]);
        setActiveForm(null);
        fetchTeacherStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGradingSub) return;

    try {
      const res = await fetch('/api/submissions/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: activeGradingSub.id,
          grade: gGrade,
          pointsEarned: gPoints,
          feedback: gFeedback
        })
      });
      if (res.ok) {
        setGPoints('');
        setGFeedback('');
        setActiveGradingSub(null);
        fetchTeacherStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleManualAttendanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualClassId) return;

    const studentMap: Record<string, string> = {
      'user-student-1': 'Vaibhav Raj',
      'user-student-2': 'Rohan Sharma',
      'user-student-3': 'Priya Verma'
    };

    try {
      const res = await fetch('/api/attendance/override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: manualClassId,
          classTitle: manualClassTitle,
          studentId: manualStudentId,
          studentName: studentMap[manualStudentId],
          markedPresent: manualPresent
        })
      });
      if (res.ok) {
        setManualClassId('');
        fetchTeacherStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete live class
  const handleDeleteClass = async (id: string) => {
    try {
      const response = await fetch(`/api/schedule/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchTeacherStats();
      }
    } catch {
       // fallback
    }
  };

  // Helper function to download PDF formatted attendance logs
  const downloadAttendanceReport = async () => {
    try {
      const res = await fetch('/api/attendance/report');
      if (res.ok) {
        const fullReport = await res.json();
        
        let fileContent = `=== TUITION STUDY PORTAL REPORT ===\n`;
        fileContent += `Institution: ${fullReport.institution}\n`;
        fileContent += `Generated At: ${new Date(fullReport.generatedAt).toLocaleString()}\n`;
        fileContent += `Total Class Tracks Checked: ${fullReport.totalClassesTracked}\n\n`;
        
        Object.entries(fullReport.reportData).forEach(([classTitle, records]: any) => {
          fileContent += `==============================================\n`;
          fileContent += `CLASS: ${classTitle.toUpperCase()}\n`;
          fileContent += `----------------------------------------------\n`;
          fileContent += `STUDENT            | PRESENCE TIME (SECONDS)  | ATTENDANCE BADGE STATUS \n`;
          fileContent += `----------------------------------------------\n`;
          records.forEach((rec: any) => {
            const paddingName = rec.studentName.padEnd(18, ' ');
            const durationTxt = `${rec.durationJoined}s`.padEnd(25, ' ');
            const statusTxt = rec.markedPresent ? "PRESENT (Complied >=70%)" : "ABSENT (Compliance Failed)";
            fileContent += `${paddingName} | ${durationTxt} | ${statusTxt}\n`;
          });
          fileContent += `\n`;
        });

        // Trigger safe file download
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Tuition_Attendance_Report_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Aggregate metrics
  const totalFinancials = payments.reduce((acc, current) => acc + current.amount, 0);
  const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;

  return (
    <div className="space-y-8">
      
      {/* Top Banner admin workspace info */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-white shadow-xl relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-slate-950 to-black">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <span className="bg-indigo-500/10 text-indigo-300 text-[10px] font-bold px-3 py-1 rounded-full border border-indigo-400/10 uppercase tracking-widest block w-fit mb-2">
              Teacher & Admin Portal
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight">Tuition Class Coordinator</h2>
            <p className="text-xs text-gray-400 mt-1">Control scheduled modules, evaluate assignment submissions, coordinate live subtitle tracks, and audit student presence ratios.</p>
          </div>

          <button
            onClick={downloadAttendanceReport}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center space-x-2 transition duration-150 shadow-lg cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export Attendance Report (PDF/TXT)</span>
          </button>
        </div>
      </div>

      {/* Metric overview row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Card A: Active Enrolled subjects */}
        <div className="bg-white border border-gray-100 p-4.5 rounded-2xl shadow-xs">
          <BookMarked className="h-5 w-5 text-indigo-600 mb-2" />
          <span className="text-[11px] font-bold text-gray-500 block uppercase tracking-wide">Courses Coordinated</span>
          <span className="text-xl font-extrabold text-gray-900 mt-1 block">6 Courses</span>
          <span className="text-[10px] text-indigo-600 block">Class 1-10 Subjects</span>
        </div>

        {/* Card B: Uncorrected HW items */}
        <div className="bg-white border border-gray-100 p-4.5 rounded-2xl shadow-xs">
          <ClipboardList className="h-5 w-5 text-indigo-600 mb-2" />
          <span className="text-[11px] font-bold text-gray-500 block uppercase tracking-wide">Pending Submissions</span>
          <span className="text-xl font-extrabold text-gray-950 mt-1 block">{pendingSubmissions} Worksheets</span>
          <span className="text-[10px] text-amber-600 block">Requires grading logs</span>
        </div>

        {/* Card C: Total classes conducted */}
        <div className="bg-white border border-gray-100 p-4.5 rounded-2xl shadow-xs">
          <Calendar className="h-5 w-5 text-indigo-600 mb-2" />
          <span className="text-[11px] font-bold text-gray-500 block uppercase tracking-wide">Structured Lectures</span>
          <span className="text-xl font-extrabold text-gray-950 mt-1 block">{schedules.length} Scheduled</span>
          <span className="text-[10px] text-indigo-600 block">Upcoming and completed</span>
        </div>

        {/* Card D: Income audit gateway log */}
        <div className="bg-white border border-gray-100 p-4.5 rounded-2xl shadow-xs">
          <TrendingUp className="h-5 w-5 text-indigo-600 mb-2" />
          <span className="text-[11px] font-bold text-gray-500 block uppercase tracking-wide">Audited Financials</span>
          <span className="text-xl font-extrabold text-green-700 mt-1 block">${totalFinancials}.00 USD</span>
          <span className="text-[10px] text-gray-400 block">{payments.length} success transactions</span>
        </div>

      </div>

      {/* Split pane layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Action & Forms Control list (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Quick Creator Triggers */}
          <div className="flex flex-wrap gap-2.5 bg-gray-100/60 p-3 rounded-2xl border border-gray-200">
            <span className="text-xs text-gray-500 font-bold w-full mb-1">Create Admin Modules:</span>
            <button
              onClick={() => setActiveForm(activeForm === 'schedule' ? null : 'schedule')}
              className="bg-white border border-gray-200 text-gray-800 text-xs font-semibold py-2 px-3.5 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition cursor-pointer"
            >
              🗓️ New Class
            </button>
            <button
              onClick={() => setActiveForm(activeForm === 'assignment' ? null : 'assignment')}
              className="bg-white border border-gray-200 text-gray-800 text-xs font-semibold py-2 px-3.5 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition cursor-pointer"
            >
              📝 Work Assignment
            </button>
            <button
              onClick={() => setActiveForm(activeForm === 'video' ? null : 'video')}
              className="bg-white border border-gray-200 text-gray-800 text-xs font-semibold py-2 px-3.5 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition cursor-pointer"
            >
              🎥 Recorded Video
            </button>
            <button
              onClick={() => setActiveForm(activeForm === 'quiz' ? null : 'quiz')}
              className="bg-white border border-gray-200 text-gray-800 text-xs font-semibold py-2 px-3.5 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition cursor-pointer"
            >
              🏆 MCQ Quiz Exam
            </button>
            <button
              onClick={() => setActiveForm(activeForm === 'announcement' ? null : 'announcement')}
              className="bg-white border border-gray-200 text-gray-800 text-xs font-semibold py-2 px-3.5 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition cursor-pointer"
            >
              📣 Announcement Alert
            </button>
          </div>

          {/* ACTIVE DRAWER FORM SHEET */}
          {activeForm && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-lg relative">
              <button 
                onClick={() => setActiveForm(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-semibold text-xs cursor-pointer bg-gray-50 p-1.5 rounded-lg"
              >
                ✕ Close
              </button>

              {/* 1. Class Schedule */}
              {activeForm === 'schedule' && (
                <form onSubmit={handleScheduleSubmit} className="space-y-4">
                  <h3 className="font-bold text-gray-900 text-sm mb-2Block">Schedule a Live Online Class</h3>
                  <div>
                    <label className="text-xs text-gray-600 font-bold block mb-1">Class Topic / Lecture Title</label>
                    <input 
                      type="text" 
                      value={schTitle} 
                      onChange={(e) => setSchTitle(e.target.value)}
                      placeholder="E.g., Coulombs Law Integral problems" 
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 font-bold block mb-1">Curriculum Subject</label>
                      <select 
                        value={schSubject} 
                        onChange={(e) => setSchSubject(e.target.value)} 
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800"
                      >
                        <option value="Mathematics">Mathematics</option>
                        <option value="Science">Science & EVS</option>
                        <option value="Social Science">Social Science</option>
                        <option value="English">English / Grammar</option>
                        <option value="Hindi">Hindi</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-bold block mb-1">Duration (minutes)</label>
                      <input 
                        type="number" 
                        value={schDuration} 
                        onChange={(e) => setSchDuration(e.target.value)} 
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 font-bold block mb-1">Launch Date & Time</label>
                      <input 
                        type="datetime-local" 
                        value={schDate} 
                        onChange={(e) => setSchDate(e.target.value)} 
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-bold block mb-1">Google Meet URL link</label>
                      <input 
                        type="text" 
                        value={schLink} 
                        onChange={(e) => setSchLink(e.target.value)} 
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none" 
                        required 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 font-bold block mb-1">Syllabus Overview / description</label>
                    <textarea 
                      value={schDesc} 
                      onChange={(e) => setSchDesc(e.target.value)} 
                      rows={2} 
                      className="w-full border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800" 
                    />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 rounded-xl text-xs cursor-pointer">
                    Commit Class to schedule list
                  </button>
                </form>
              )}

              {/* 2. New Homework Assignment */}
              {activeForm === 'assignment' && (
                <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                  <h3 className="font-bold text-gray-900 text-sm mb-2 block">Publish Student Worksheet</h3>
                  <div>
                    <label className="text-xs text-gray-600 font-bold block mb-1">Assignment Heading</label>
                    <input 
                      type="text" 
                      value={asTitle} 
                      onChange={(e) => setAsTitle(e.target.value)} 
                      placeholder="E.g., Vectors calculus practice block" 
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs" 
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 font-bold block mb-1">Subject</label>
                      <select 
                        value={asSubject} 
                        onChange={(e) => setAsSubject(e.target.value)} 
                        className="w-full border border-gray-200 rounded-xl px-2 py-2 text-xs text-gray-800"
                      >
                        <option value="Mathematics">Mathematics</option>
                        <option value="Science">Science & EVS</option>
                        <option value="Social Science">Social Science</option>
                        <option value="English">English / Grammar</option>
                        <option value="Hindi">Hindi</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-bold block mb-1">Worth Point Score</label>
                      <input 
                        type="number" 
                        value={asPoints} 
                        onChange={(e) => setAsPoints(e.target.value)} 
                        className="w-full border border-gray-200 rounded-xl px-2 py-2 text-xs text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-bold block mb-1">Deadline Date</label>
                      <input 
                        type="date" 
                        value={asDueDate} 
                        onChange={(e) => setAsDueDate(e.target.value)} 
                        className="w-full border border-gray-200 rounded-xl px-2 py-2 text-xs text-gray-800" 
                        required 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 font-bold block mb-1">Instructions for Student</label>
                    <textarea 
                      value={asDesc} 
                      onChange={(e) => setAsDesc(e.target.value)} 
                      rows={3} 
                      placeholder="Explain numeric problems lists or provide references pages" 
                      className="w-full border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800" 
                      required 
                    />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 rounded-xl text-xs cursor-pointer">
                    Commit assignment publication
                  </button>
                </form>
              )}

              {/* 3. New Recorded Lecture item */}
              {activeForm === 'video' && (
                <form onSubmit={handleVideoSubmit} className="space-y-4">
                  <h3 className="font-bold text-gray-900 text-sm mb-2">Publish Lecture video to Student Board</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 font-bold block mb-1">Video Title</label>
                      <input 
                        type="text" 
                        value={vTitle} 
                        onChange={(e) => setVTitle(e.target.value)} 
                        placeholder="E.g., IUPAC naming structures" 
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-bold block mb-1">Program Subject</label>
                      <select 
                        value={vSubject} 
                        onChange={(e) => setVSubject(e.target.value)} 
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-805"
                      >
                        <option value="Mathematics">Mathematics</option>
                        <option value="Science">Science & EVS</option>
                        <option value="Social Science">Social Science</option>
                        <option value="English">English / Grammar</option>
                        <option value="Hindi">Hindi</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 font-bold block mb-1">Lecture Duration Label</label>
                      <input 
                        type="text" 
                        value={vDuration} 
                        onChange={(e) => setVDuration(e.target.value)} 
                        placeholder="E.g., 50 mins" 
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-bold block mb-1">Video Stream link (.mp4 / host)</label>
                      <input 
                        type="text" 
                        value={vUrl} 
                        onChange={(e) => setVUrl(e.target.value)} 
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono" 
                        required 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 font-bold block">Video description</label>
                    <textarea 
                      value={vDesc} 
                      onChange={(e) => setVDesc(e.target.value)} 
                      rows={2} 
                      className="w-full border border-gray-200 rounded-xl p-2.5 text-xs text-gray-805" 
                      required 
                    />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 rounded-xl text-xs cursor-pointer">
                    Commit recorded logs
                  </button>
                </form>
              )}

              {/* 4. New Announcement alert */}
              {activeForm === 'announcement' && (
                <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
                  <h3 className="font-bold text-gray-900 text-sm mb-2">Publish Announcement alert</h3>
                  <div>
                    <label className="text-xs text-gray-600 font-bold block mb-1">Announcement Heading</label>
                    <input 
                      type="text" 
                      value={annTitle} 
                      onChange={(e) => setAnnTitle(e.target.value)} 
                      placeholder="E.g., Mega Revision Class Post" 
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 font-bold block mb-1">Priority Badge</label>
                    <div className="flex space-x-3 text-xs font-medium text-gray-600">
                      {(['low', 'medium', 'high'] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setAnnPriority(p)}
                          className={`py-1 px-3.5 rounded-lg border cursor-pointer ${
                            annPriority === p 
                              ? 'bg-indigo-600 text-white font-bold border-indigo-600' 
                              : 'bg-white border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {p.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 font-bold block mb-1">Content Text Block</label>
                    <textarea 
                      value={annContent} 
                      onChange={(e) => setAnnContent(e.target.value)} 
                      rows={3} 
                      className="w-full border border-gray-200 rounded-xl p-2.5 text-xs text-gray-805" 
                      required 
                    />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 rounded-xl text-xs cursor-pointer">
                    Broadcast Announcement
                  </button>
                </form>
              )}

              {/* 5. Create new Evaluation Quiz */}
              {activeForm === 'quiz' && (
                <form onSubmit={handleAddQuizSubmit} className="space-y-4" id="quiz-admin-creators-form">
                  <h3 className="font-bold text-gray-900 text-sm mb-2 block">Compile Evaluation MCQ Quiz</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 font-bold block mb-1">Quiz Title Name</label>
                      <input 
                        type="text" 
                        value={qzTitle} 
                        onChange={(e) => setQzTitle(e.target.value)} 
                        placeholder="E.g., Hydrocarbons basics test" 
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-bold block mb-1">Program Subject</label>
                      <select 
                        value={qzSubject} 
                        onChange={(e) => setQzSubject(e.target.value)} 
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-805"
                      >
                        <option value="Mathematics">Mathematics</option>
                        <option value="Science">Science & EVS</option>
                        <option value="Social Science">Social Science</option>
                        <option value="English">English / Grammar</option>
                        <option value="Hindi">Hindi</option>
                      </select>
                    </div>
                  </div>

                  {/* Single Question configuration inside sandbox mode */}
                  <div className="bg-gray-50 p-4 border border-gray-100 rounded-2xl space-y-3">
                    <span className="text-[10px] font-bold text-indigo-700 block uppercase">Sandbox MCQ Question Block</span>
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1 font-semibold">Question statement text</label>
                      <input 
                        type="text" 
                        value={qzQuestions[0].questionText} 
                        onChange={(e) => handleQuizQuestionChange(0, 'questionText', e.target.value)} 
                        placeholder="E.g., What is the IUPAC prefix name for carbon-3?" 
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white text-gray-800" 
                        required 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {qzQuestions[0].options.map((opt, optId) => (
                        <div key={optId}>
                          <label className="text-[10px] text-gray-500 block mb-0.5">Option {optId + 1}</label>
                          <input 
                            type="text" 
                            value={opt} 
                            onChange={(e) => handleQuizQuestionChange(0, 'option', e.target.value, optId)} 
                            placeholder={`E.g., Option text ${optId}`} 
                            className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-xs bg-white text-gray-850" 
                            required 
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1 font-semibold">Correct option index selection (0-3)</label>
                      <input 
                        type="number" 
                        min={0} 
                        max={3} 
                        value={qzQuestions[0].correctAnswerIndex} 
                        onChange={(e) => handleQuizQuestionChange(0, 'correctAnswerIndex', e.target.value)} 
                        className="w-16 border border-gray-200 rounded-xl px-2 py-1.5 text-xs text-center bg-white" 
                        required 
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 rounded-xl text-xs cursor-pointer">
                    Commit Quiz evaluation block
                  </button>
                </form>
              )}
            </div>
          )}

          {/* SECTION I: Uncorrected assignment submissions pending grading */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm" id="grading-center-teacher">
            <h3 className="text-md sm:text-lg font-bold text-gray-900 tracking-tight block mb-1">Homework Correction Center</h3>
            <p className="text-xs text-gray-400 mb-6 block">Review, read, and write grades with personalized remarks</p>

            {activeGradingSub ? (
              <div className="bg-indigo-50/40 p-5 border border-indigo-100 rounded-2xl space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-indigo-700 font-bold block uppercase">Reviewing Student: {activeGradingSub.studentName}</span>
                    <h4 className="font-extrabold text-gray-900 text-sm block mt-0.5">{activeGradingSub.assignmentTitle}</h4>
                  </div>
                  <button 
                    onClick={() => setActiveGradingSub(null)} 
                    className="text-gray-400 hover:text-gray-700 font-bold text-xs cursor-pointer"
                  >
                    Close Sheet
                  </button>
                </div>

                {/* Submissions text body block */}
                <div className="bg-white border border-gray-150 p-4 rounded-xl text-xs text-gray-700 leading-relaxed font-mono whitespace-pre-wrap">
                  {activeGradingSub.content}
                </div>

                {/* Correction forms */}
                <form onSubmit={handleGradeSubmission} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-600 font-bold block mb-1 uppercase">Letter Grade / mark</label>
                    <input 
                      type="text" 
                      value={gGrade} 
                      onChange={(e) => setGGrade(e.target.value)} 
                      placeholder="E.g., A+, B-" 
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-600 font-bold block mb-1 uppercase">Points Earned</label>
                    <input 
                      type="number" 
                      value={gPoints} 
                      onChange={(e) => setGPoints(e.target.value)} 
                      placeholder="E.g., 45" 
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800" 
                      required 
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-[10px] text-gray-600 font-bold block mb-1 uppercase">Personal Tuition feedback remarks</label>
                    <input 
                      type="text" 
                      value={gFeedback} 
                      onChange={(e) => setGFeedback(e.target.value)} 
                      placeholder="Excellent formulas proofing, Rohan! Solid algebra derivation." 
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800" 
                    />
                  </div>

                  <button type="submit" className="md:col-span-3 bg-indigo-600 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer">
                    Commit Grade logs
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.filter(s => s.status === 'pending').map((sub) => (
                  <div key={sub.id} className="p-4 border border-gray-150 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase">Pending Correction</span>
                      <h4 className="font-bold text-sm text-gray-900 mt-1 block leading-tight">{sub.assignmentTitle}</h4>
                      <p className="text-xs text-gray-500 font-semibold block mt-0.5">Submitted By: <span className="text-indigo-600 font-bold">{sub.studentName}</span></p>
                      <span className="text-[11px] text-gray-400 block font-mono">Date: {new Date(sub.submittedAt).toLocaleDateString()}</span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveGradingSub(sub);
                      }}
                      className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2 px-4.5 rounded-xl cursor-pointer"
                    >
                      Grade Homework Solve
                    </button>
                  </div>
                ))}

                {submissions.filter(s => s.status === 'pending').length === 0 && (
                  <p className="text-xs text-gray-400 italic text-center py-4">No pending student assignment submissions awaiting correction.</p>
                )}
              </div>
            )}
          </div>

          {/* SECTION II: List of coordinated schedule class and action logs */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-md sm:text-lg font-bold text-gray-900 tracking-tight block mb-1">Active Schedulers Audit</h3>
            <p className="text-xs text-gray-400 mb-6 block">Check details of live schedules and remove expired streams</p>

            <div className="space-y-4">
              {schedules.map((cls) => (
                <div key={cls.id} className="p-4 border border-gray-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <span className="bg-gray-100 text-gray-700 text-[9px] font-semibold px-2 py-0.5 rounded uppercase">{cls.subject}</span>
                    <h4 className="font-bold text-sm text-gray-900 block mt-1">{cls.title}</h4>
                    <div className="text-[11px] text-gray-400">
                      Meet link: <span className="font-mono text-gray-500">{cls.meetLink}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteClass(cls.id)}
                    className="p-1 px-3 bg-red-50 hover:bg-red-100 text-red-650 rounded-xl text-xs font-bold tracking-wide transition cursor-pointer"
                  >
                    Delete Class
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Student lists & Manual attendance override module (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* PLAYROOM LEADERBOARD / POSITION AREA */}
          <div className="bg-white rounded-3xl p-6 border-4 border-amber-200/50 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="text-xs font-black text-amber-805 uppercase tracking-wider block">🕹️ Playroom Leaderboard</h4>
                <p className="text-[10px] text-gray-400 block -mt-0.5 font-bold">Kids challenge scores & real-time rankings</p>
              </div>
              <button 
                onClick={fetchTeacherStats}
                className="p-1.5 hover:bg-slate-150 border border-gray-200/30 text-slate-600 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                title="Refresh scores"
              >
                <RefreshCw className="h-3.5 w-3.5 shrink-0" />
                <span>Refresh</span>
              </button>
            </div>

            {/* List of highscores sorted descending */}
            <div className="space-y-3">
              {[...gameScores].sort((a,b) => b.score - a.score).map((item, idx) => {
                let medal = "🎖️";
                if (idx === 0) medal = "🥇";
                else if (idx === 1) medal = "🥈";
                else if (idx === 2) medal = "🥉";

                return (
                  <div key={item.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-xs hover:shadow-sm transition">
                    <div className="flex items-center gap-2">
                      <span className="text-lg shrink-0">{medal}</span>
                      <div>
                        <span className="font-extrabold text-gray-900 block leading-tight">{item.studentName}</span>
                        <div className="flex items-center gap-1 text-[9px] text-gray-400 font-semibold mt-0.5">
                          <span className="bg-indigo-150 text-indigo-700 px-1 py-0.2 rounded-sm uppercase text-[8px] font-extrabold">{item.classLevel}</span>
                          <span>•</span>
                          <span>{item.puzzleType}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-indigo-700 text-sm block leading-none">{item.score}</span>
                      <span className="text-[8px] text-gray-400 font-bold block mt-0.5">STARS</span>
                    </div>
                  </div>
                );
              })}

              {gameScores.length === 0 && (
                <p className="text-xs text-gray-400 italic text-center py-4">No student playroom score logs recorded yet. 🐼</p>
              )}
            </div>
          </div>

          {/* A. Automated Attendance Tracker log list values */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-4">Live Class Attendance Audit</h4>

            <div className="space-y-3">
              {attendance.map((att) => (
                <div key={att.id} className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-900 text-xs block">{att.studentName}</span>
                    <span className="text-[10px] text-gray-400 block max-w-[150px] truncate">{att.classTitle}</span>
                    <span className="text-[9px] text-indigo-600 block mt-1">Presence time: {Math.floor(att.durationJoined / 60)} mins</span>
                  </div>

                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${
                    att.markedPresent 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-600 border border-red-200'
                  }`}>
                    {att.markedPresent ? 'PRESENT ✅' : 'ABSENT ❌'}
                  </span>
                </div>
              ))}

              {attendance.length === 0 && (
                <p className="text-xs text-gray-400 italic text-center py-4">No active attendance logs received yet.</p>
              )}
            </div>
          </div>

          {/* B. Manual Attendance Override form sheet */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-lg">
            <h4 className="text-[10px] text-indigo-300 font-extrabold uppercase tracking-widest block mb-1">Administrative override</h4>
            <h3 className="font-bold text-md tracking-tight block">Manual Attendance Correction</h3>
            <p className="text-[11px] text-indigo-200 block mt-1 leading-normal">Manually mark student present or override automated compliance ratios database.</p>

            <form onSubmit={handleManualAttendanceSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-[10px] text-indigo-300 block font-bold mb-1 uppercase">Choose Active Class</label>
                <select
                  value={manualClassId}
                  onChange={(e) => {
                    setManualClassId(e.target.value);
                    const selected = schedules.find(s => s.id === e.target.value);
                    if (selected) setManualClassTitle(selected.title);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
                  required
                >
                  <option value="">-- Choose Class Topic --</option>
                  {schedules.map((s) => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-indigo-300 block font-bold mb-1 uppercase">Select Learner</label>
                <select
                  value={manualStudentId}
                  onChange={(e) => setManualStudentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="user-student-1">Vaibhav Raj</option>
                  <option value="user-student-2">Rohan Sharma</option>
                  <option value="user-student-3">Priya Verma</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setManualPresent(true)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    manualPresent 
                      ? 'bg-green-600 text-white border-green-500' 
                      : 'bg-slate-950 border-slate-850'
                  }`}
                >
                  Mark Present
                </button>
                <button
                  type="button"
                  onClick={() => setManualPresent(false)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    !manualPresent 
                      ? 'bg-red-650 text-white border-red-500' 
                      : 'bg-slate-950 border-slate-850'
                  }`}
                >
                  Mark Absent
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl block transition active:scale-95 cursor-pointer text-center"
              >
                Apply Correction override
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
