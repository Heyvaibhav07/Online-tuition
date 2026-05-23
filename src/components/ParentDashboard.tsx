/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Calendar, 
  ClipboardList, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  Send, 
  TrendingUp, 
  Bell, 
  CreditCard,
  Clock,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Activity
} from 'lucide-react';
import { User, Assignment, Submission, Attendance, Announcement } from '../types';

interface ParentDashboardProps {
  user: User;
  onOpenPaymentGateway?: () => void;
}

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

export default function ParentDashboard({ user, onOpenPaymentGateway }: ParentDashboardProps) {
  const [ward, setWard] = useState<User | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [queries, setQueries] = useState<ParentQuery[]>([]);
  
  // Tag teacher query form state
  const [queryType, setQueryType] = useState('Homework Check');
  const [queryMessage, setQueryMessage] = useState('');
  const [isSubmittingQuery, setIsSubmittingQuery] = useState(false);
  const [querySuccess, setQuerySuccess] = useState('');
  
  // Loading indicators
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Determine if today's date triggers a monthly tuition fee reminder (27th-30th)
  const today = new Date();
  const todayDay = today.getDate();
  const isFeeReminderPeriod = todayDay >= 27 && todayDay <= 30;

  // Load child (ward) profile details and study records
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Retrieve ward student ID from current user
      const wardId = user.wardId || "user-student-1";

      // 1. Fetch ward profile info
      const resUsers = await fetch('/api/users');
      const allUsers: User[] = await resUsers.json();
      const matchedWard = allUsers.find(u => u.id === wardId);
      if (matchedWard) {
        setWard(matchedWard);
      }

      // 2. Fetch assignments
      const resAssign = await fetch('/api/schedule'); // schedule endpoint houses assignments indirectly or let's pull assignments directly
      const allSchedules = await resAssign.json();
      
      const resRealAssign = await fetch('/api/users'); // fallback or direct assignments
      // Let's call /api/students or retrieve actual assignment lists
      const resAssignments = await fetch('/api/attendance'); // dummy call, we can pull assignments from active templates
      
      // Let's perform direct endpoints calls that exist in server.ts:
      // - GET /api/attendance?studentId=...
      // - GET /api/submissions?studentId=...
      // - GET /api/announcements
      // - GET /api/parent-queries
      
      const attRes = await fetch(`/api/attendance?studentId=${wardId}`);
      if (attRes.ok) {
        const attData = await attRes.json();
        setAttendance(attData);
      }

      const subRes = await fetch(`/api/submissions?studentId=${wardId}`);
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubmissions(subData);
      }

      const annRes = await fetch('/api/announcements');
      if (annRes.ok) {
        const annData = await annRes.json();
        setAnnouncements(annData);
      }

      const queryRes = await fetch('/api/parent-queries');
      if (queryRes.ok) {
        const qData = await queryRes.json();
        // filter queries relevant to this parent
        setQueries(qData.filter((q: ParentQuery) => q.parentName === user.username));
      }

      // Hardcoded assignment list standard class 1-10 matching our seeded server.ts
      setAssignments([
        {
          id: "assign-1",
          title: "Class 10 Fractions and Percentages Solverheet",
          description: "Examine the 5 workbook problems.",
          subject: "Mathematics",
          dueDate: "2026-05-25",
          totalPoints: 100
        },
        {
          id: "assign-2",
          title: "Social Science: Indian Freedom Struggle Map Plotting",
          description: "Mark and identify the 5 historic locations.",
          subject: "Social Science",
          dueDate: "2026-05-28",
          totalPoints: 50
        }
      ]);

    } catch (err) {
      console.error("Failed to load parent ward metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  // Handle Tag Teacher inquiry post submit
  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryMessage.trim()) return;

    setIsSubmittingQuery(true);
    setQuerySuccess('');

    try {
      const response = await fetch('/api/parent-queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName: user.username,
          wardName: ward?.username || "Vaibhav Raj",
          queryType,
          message: queryMessage,
          taggedTeacher: 'Neha Kumari'
        })
      });

      if (response.ok) {
        setQueryMessage('');
        setQuerySuccess('Your query has been successfully tagged for Teacher Neha Kumari! She will review and reply shortly.');
        // Reload list
        const queryRes = await fetch('/api/parent-queries');
        if (queryRes.ok) {
          const qData = await queryRes.json();
          setQueries(qData.filter((q: ParentQuery) => q.parentName === user.username));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingQuery(false);
    }
  };

  // Mock clearing tuition fee directly from sandbox gateway
  const handleMockPayFees = async () => {
    if (!ward) return;
    setPaymentLoading(true);
    try {
      // patch student's feeStatus to paid
      const response = await fetch(`/api/users/${ward.id}/fee`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feeStatus: 'paid' })
      });

      if (response.ok) {
        setPaymentSuccess(true);
        setTimeout(() => {
          setPaymentSuccess(false);
          loadDashboardData(); // Reload stats
        }, 2000);
      }
    } catch (err) {
      console.error("Fee checkout failed:", err);
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-sm font-semibold text-gray-500">Retrieving Child Academic Reports...</p>
      </div>
    );
  }

  // Calculate metrics
  const totalClasses = attendance.length;
  const presentClasses = attendance.filter(a => a.markedPresent).length;
  const attendancePercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 100;
  
  // Homework checks
  const checkedHomeworksCount = assignments.length;
  // Count how many are submitted by check assignment completion in submissions list
  const completedHomeworksCount = assignments.filter(as => 
    submissions.some(s => s.assignmentId === as.id)
  ).length;

  return (
    <div className="space-y-8 font-sans">
      
      {/* 1. Header welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-xs gap-4">
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full inline-block mb-2">
            👪 Parent Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
            Welcome, {user.username}!
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tracking academic reports, homework completion, and attendance for your ward: <span className="font-bold text-indigo-700">{ward?.username || "Vaibhav Raj"}</span>.
          </p>
        </div>

        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
          <div className="bg-emerald-500 text-white rounded-xl p-2 h-10 w-10 flex items-center justify-center">
            ✔
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-800 uppercase block">Linked Student Profile</span>
            <span className="text-sm font-bold text-gray-900">{ward?.username || "Vaibhav Raj"} (Class 1-10)</span>
          </div>
        </div>
      </div>

      {/* 2. Fee Reminder Section - Highlighted & Crucial */}
      {isFeeReminderPeriod || (ward?.feeStatus === 'unpaid') ? (
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 bg-red-400/10 h-32 w-32 rounded-full pointer-events-none" />
          
          <div className="flex items-start gap-4">
            <div className="bg-red-500 text-white p-3 rounded-2xl shadow-md flex items-center justify-center mt-1">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-1.5 max-w-xl">
              <span className="bg-red-200 text-red-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
                Tuition Fee Reminder (27th - 30th)
              </span>
              <h3 className="text-lg font-extrabold text-red-950 tracking-tight">Monthly Tuition Fee Outstanding</h3>
              <p className="text-sm text-red-800 leading-relaxed">
                Fees for the month are set and decided individually by Teacher **Neha Kumari**. Please review and clear the tuition charges below for {ward?.username}. 
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-red-200/50 shadow-sm w-full md:w-auto min-w-[240px] text-center space-y-3 z-10">
            <span className="text-xs text-gray-500 block font-semibold">Total Amount Due</span>
            <span className="text-3xl font-black text-gray-950 block">₹ {ward?.monthlyFee || 1500}</span>
            
            {paymentSuccess ? (
              <div className="bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 animate-pulse">
                <span>✔ Payment Successful!</span>
              </div>
            ) : (
              <button
                onClick={handleMockPayFees}
                disabled={paymentLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CreditCard className="h-4 w-4" />
                <span>{paymentLoading ? "Processing UPI..." : "Pay via Sandbox (₹)"}</span>
              </button>
            )}
            <span className="text-[10px] text-gray-400 block italic leading-none">Standard Sandbox Rupee Gateway</span>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-6 shadow-xs flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 text-white p-2.5 rounded-xl shadow-xs flex items-center justify-center">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-emerald-950 text-sm">Tuition Fees Cleared</h4>
              <p className="text-xs text-emerald-800 mt-0.5">Fees for {ward?.username} are fully paid. Next billing schedule will generate on the 27th of next month.</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-emerald-100 font-bold text-sm text-gray-700">
            ₹ Paid: ₹{ward?.monthlyFee || 1500}
          </div>
        </div>
      )}

      {/* 3. Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card A: Attendance Ratio */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Attendance Analytics</span>
            <Activity className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="space-y-1">
            <span className="text-4xl font-black text-gray-950 tracking-tight block">
              {attendancePercentage}%
            </span>
            <span className="text-xs text-gray-500 block font-semibold">
              Attended {presentClasses} out of {totalClasses} classes
            </span>
          </div>
          {/* Attendance progress bar */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${attendancePercentage >= 75 ? 'bg-indigo-600' : 'bg-amber-500'}`} 
              style={{ width: `${attendancePercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-500 leading-normal">
            *Students require at least 70% live class attendance to qualify for automated badges.
          </p>
        </div>

        {/* Card B: Homework Status */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Homework & Assignments</span>
            <ClipboardList className="h-5 w-5 text-teal-500" />
          </div>
          <div className="space-y-1">
            <span className="text-4xl font-black text-gray-950 tracking-tight block">
              {completedHomeworksCount} / {checkedHomeworksCount}
            </span>
            <span className="text-xs text-gray-500 block font-semibold">
              Worksheets completed and uploaded from home
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-teal-500 transition-all duration-300" 
              style={{ width: `${checkedHomeworksCount > 0 ? (completedHomeworksCount / checkedHomeworksCount) * 100 : 100}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-500 leading-normal">
            Checked status includes file uploads & handwritten workbook photos submitted by ward.
          </p>
        </div>

        {/* Card C: Subject Enrollment */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Academics Curriculum</span>
            <BookOpen className="h-5 w-5 text-amber-500" />
          </div>
          <div className="space-y-1">
            <span className="text-xl font-bold text-gray-950 tracking-tight block">
              {ward?.chosenSubject || "General Science"}
            </span>
            <span className="text-xs text-gray-500 block font-semibold">
              Primary Selected Classroom Focus
            </span>
          </div>
          <div className="pt-2 flex flex-wrap gap-1.5">
            {ward?.enrolledSubjects?.map((sub, i) => (
              <span key={i} className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-1 rounded-lg">
                📚 {sub}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-gray-500 leading-none">
            Covers standard lessons for Classes 1st - 10th standard.
          </p>
        </div>

      </div>

      {/* 4. Homework Status Grid & Query Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Homework Done checklist (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-950 tracking-tight block">Homework Done & Submissions Tracker</h2>
              <span className="text-xs text-gray-500">Easily check weather your ward completed their assignment papers.</span>
            </div>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-lg">
              Class 1-10 Scope
            </span>
          </div>

          <div className="space-y-4">
            {assignments.map((as) => {
              // check if ward submitted
              const sub = submissions.find(s => s.assignmentId === as.id);
              return (
                <div key={as.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold px-2 py-0.5 rounded uppercase">
                        {as.subject}
                      </span>
                      <h4 className="font-extrabold text-sm text-gray-950 mt-1 block leading-tight">{as.title}</h4>
                      <span className="text-xs text-gray-400 block mt-0.5">Due date: {new Date(as.dueDate).toLocaleDateString()}</span>
                    </div>

                    <div>
                      {sub ? (
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                          ✔ Submitted Done
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-800 border border-amber-100 text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                          ⏰ Uncompleted
                        </span>
                      )}
                    </div>
                  </div>

                  {sub && (
                    <div className="bg-white p-3 rounded-xl border border-gray-150 space-y-2 text-xs">
                      <p className="text-gray-700 italic">
                        <strong>Handwritten Upload Content:</strong> "{sub.content}"
                      </p>
                      {sub.status === 'graded' ? (
                        <div className="p-2 sm:p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] text-emerald-800 font-bold block uppercase">Checked Score:</span>
                            <span className="font-bold text-gray-900 text-sm">{sub.grade} ({sub.pointsEarned} / {as.totalPoints} pts)</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-emerald-800 font-bold block uppercase">Teacher Feedback:</span>
                            <span className="text-gray-700 italic block">{sub.feedback}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 italic">⏳ Submitted successfully. Awaiting grading from teacher Neha Kumari Ma'am.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Announcements made by Teacher Neha Kumari (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-950 tracking-tight block">Latest Tuition Announcements</h2>
            <span className="text-xs text-gray-500">Stay revised on instructions by Teacher Neha Kumari.</span>
          </div>

          <div className="space-y-4">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2 relative">
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase ${
                    ann.priority === 'high' 
                      ? 'bg-red-100 text-red-800 font-extrabold' 
                      : 'bg-indigo-50 text-indigo-700'
                  }`}>
                    {ann.priority === 'high' ? '🚨 CRITICAL' : 'NEWS BOARD'}
                  </span>
                  <span className="text-[10px] text-gray-400 font-semibold">
                    {new Date(ann.date).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-gray-900 leading-tight block">{ann.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed block">{ann.content}</p>
                <span className="text-[10px] font-bold text-indigo-600 block pt-1">— Published by Neha Kumari</span>
              </div>
            ))}

            {announcements.length === 0 && (
              <p className="text-xs text-gray-400 italic text-center py-6 block">No tuition announcements made yet.</p>
            )}
          </div>
        </div>

      </div>

      {/* 5. Parent Query Teacher Tagging Desk */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-8">
        
        <div className="border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-950 tracking-tight">Parent Teacher Query Desk</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Tag Teacher **Neha Kumari** for any type of query (e.g. leave notes, homework doubts, syllabus progression, fee reminders clarification). Select subject, specify concerns, and submit below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Query Form (5 cols) */}
          <div className="lg:col-span-5 bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
            <h3 className="font-extrabold text-sm text-gray-950 uppercase tracking-wider block">Tag Teacher for Query</h3>

            {querySuccess && (
              <div className="bg-emerald-50 text-emerald-800 text-xs font-semibold p-4 rounded-xl border border-emerald-100 shadow-xs">
                {querySuccess}
              </div>
            )}

            <form onSubmit={handleQuerySubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Query Tag Category</label>
                <select
                  value={queryType}
                  onChange={(e) => setQueryType(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Homework Check">Homework Done Verification Check</option>
                  <option value="Fees Clarification">Tuition Fee Clearance Clarification</option>
                  <option value="Leave Note">Student Medical / Leave Note</option>
                  <option value="Focus Request">Curriculum Extra Focus Request</option>
                  <option value="General Query">General Query / Doubt Question</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Selected Teacher to Tag</label>
                <input
                  type="text"
                  value="Neha Kumari (Academy Head)"
                  className="w-full bg-gray-200 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600 cursor-not-allowed"
                  disabled
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Query Message / Remarks</label>
                <textarea
                  value={queryMessage}
                  onChange={(e) => setQueryMessage(e.target.value)}
                  rows={4}
                  placeholder="Specify any remarks or concerns representing your child's study routine..."
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-sans"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingQuery}
                className="w-full bg-indigo-600 hover:bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer text-center"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSubmittingQuery ? "Tagging teacher..." : "Submit Inquiry to Neha Kumari"}</span>
              </button>
            </form>
          </div>

          {/* Query Live Logs Feed (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-extrabold text-sm text-gray-950 uppercase tracking-wider block">Inquiry Log & Replies</h3>
            
            <div className="space-y-4">
              {queries.map((q) => (
                <div key={q.id} className="p-4 bg-white rounded-2xl border border-gray-150 shadow-xs space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      🏷 {q.queryType}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">{q.date}</span>
                  </div>

                  <p className="text-xs text-gray-700 font-medium leading-relaxed block bg-gray-50/50 p-2.5 rounded-lg border border-gray-100">
                    <strong className="text-gray-950 font-bold block text-[10px] uppercase mb-0.5">Parent Question:</strong>
                    "{q.message}"
                  </p>

                  {q.status === 'resolved' && q.teacherReply ? (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                        <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">Teacher Neha Kumari Reply:</span>
                      </div>
                      <p className="text-xs text-emerald-900 italic font-sans leading-relaxed">
                        "{q.teacherReply}"
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2 border border-amber-100 w-fit">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Awaiting feedback reply from Ma'am. Registered as pending status.</span>
                    </div>
                  )}
                </div>
              ))}

              {queries.length === 0 && (
                <div className="bg-gray-50 rounded-2xl p-8 border border-dashed border-gray-200 text-center text-gray-400 italic text-xs py-10 block">
                  No active queries raised yet. You can query about leave logs or fractions homework.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
