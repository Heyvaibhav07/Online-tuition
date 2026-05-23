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
  HelpCircle, 
  FileText, 
  Play, 
  CornerDownRight, 
  ArrowRight,
  TrendingUp,
  Percent,
  MessageSquare,
  Volume2,
  Tv,
  CheckCircle,
  AlertCircle,
  Award,
  Sparkles,
  ListTodo
} from 'lucide-react';
import { 
  User as UserType, 
  ClassSchedule, 
  Assignment, 
  Submission, 
  Quiz, 
  QuizSubmission, 
  Attendance, 
  Announcement, 
  Todo,
  Testimonial
} from '../types';
import BrainPlayroomGame from './BrainPlayroomGame';

interface StudentDashboardProps {
  user: UserType;
  onLaunchLiveClass: (cls: ClassSchedule) => void;
  onOpenPaymentGateway: () => void;
  setActiveTab?: (tab: string) => void;
}

export default function StudentDashboard({ user, onLaunchLiveClass, onOpenPaymentGateway, setActiveTab }: StudentDashboardProps) {
  // Database States
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizSubs, setQuizSubs] = useState<QuizSubmission[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  
  // Local Student States
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  
  // Submit Work States
  const [activeSubmittingAssign, setActiveSubmittingAssign] = useState<Assignment | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');
  
  // Quiz taking active states
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizCompletedScore, setQuizCompletedScore] = useState<number | null>(null);

  // Subject selecting demo state
  const [selectedDemoSubject, setSelectedDemoSubject] = useState('Science');
  const [demoReqSuccess, setDemoReqSuccess] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);

  // Fetch Dashboard details
  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      // 1. Schedules
      const resSched = await fetch('/api/schedule');
      if (resSched.ok) setSchedules(await resSched.json());

      // 2. Assignments
      const resAssign = await fetch('/api/assignments');
      if (resAssign.ok) setAssignments(await resAssign.json());

      // 3. Submissions
      const resSub = await fetch(`/api/submissions?studentId=${user.id}`);
      if (resSub.ok) setSubmissions(await resSub.json());

      // 4. Quizzes
      const resQuiz = await fetch('/api/quizzes');
      if (resQuiz.ok) setQuizzes(await resQuiz.json());

      // 5. Quiz Submissions
      const resQuizSub = await fetch(`/api/quizzes/submissions?studentId=${user.id}`);
      if (resQuizSub.ok) setQuizSubs(await resQuizSub.json());

      // 6. Attendance records
      const resAttendance = await fetch(`/api/attendance?studentId=${user.id}`);
      if (resAttendance.ok) setAttendance(await resAttendance.json());

      // 7. Announcements
      const resAnn = await fetch('/api/announcements');
      if (resAnn.ok) setAnnouncements(await resAnn.json());

      // 8. Testimonials
      const resTest = await fetch('/api/testimonials');
      if (resTest.ok) setTestimonials(await resTest.json());

      // 9. Todos
      const resTodo = await fetch(`/api/todos?studentId=${user.id}`);
      if (resTodo.ok) setTodos(await resTodo.json());

    } catch (e) {
      console.error("Dashboard synchronization failure.", e);
    }
  };

  // Todo CRUD Actions
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user.id,
          text: newTodoText
        })
      });
      if (response.ok) {
        setNewTodoText('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
      });
      if (response.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Assignment Work submission
  const handleSubmitAssignmentForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmittingAssign || !submissionContent.trim()) return;

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: activeSubmittingAssign.id,
          assignmentTitle: activeSubmittingAssign.title,
          studentId: user.id,
          studentName: user.username,
          content: submissionContent
        })
      });

      if (response.ok) {
        setSubmissionContent('');
        setActiveSubmittingAssign(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Quiz evaluation action
  const handleAnswerQuizSelect = (questionId: string, answerIdx: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerIdx
    }));
  };

  const handleSubmitActiveQuiz = async () => {
    if (!activeQuiz) return;

    let score = 0;
    activeQuiz.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswerIndex) {
        score++;
      }
    });

    try {
      const response = await fetch('/api/quizzes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: activeQuiz.id,
          quizTitle: activeQuiz.title,
          studentId: user.id,
          studentName: user.username,
          score: score,
          totalPoints: activeQuiz.questions.length
        })
      });

      if (response.ok) {
        setQuizCompletedScore(score);
        setTimeout(() => {
          setQuizCompletedScore(null);
          setActiveQuiz(null);
          setQuizAnswers({});
          fetchData();
        }, 3200);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Demo class booking
  const handleRequestDemo = async () => {
    setDemoLoading(true);
    setDemoReqSuccess('');
    try {
      const response = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          studentName: user.username,
          chosenSubject: selectedDemoSubject
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setDemoReqSuccess(`Success! A free demo class slot for ${selectedDemoSubject} has been scheduled for you.`);
        fetchData();
      }
    } catch {
      setDemoReqSuccess('Failed to schedule slot at this moment.');
    } finally {
      setDemoLoading(false);
    }
  };

  // Helper properties
  const checkedSubject = user.chosenSubject || "General Science";
  const permissionsEnrolled = user.enrolledSubjects || [];
  const isEnrolledInSubject = (subj: string) => {
    return permissionsEnrolled.includes(subj);
  };

  // Aggregate Metrics calculations
  const totalSubmissions = submissions.length;
  const gradedSubmissions = submissions.filter(s => s.status === 'graded');
  const averageGradePoints = gradedSubmissions.length > 0 
    ? Math.round(gradedSubmissions.reduce((acc, current) => acc + (current.pointsEarned || 0), 0) / gradedSubmissions.length)
    : 0;

  const totalClassesLog = attendance.length;
  const presentClassesLog = attendance.filter(a => a.markedPresent).length;
  const overallAttendanceRatio = totalClassesLog > 0 
    ? Math.round((presentClassesLog / totalClassesLog) * 100) 
    : 100;

  return (
    <div className="space-y-8">
      
      {/* Top Banner Message */}
      <div className="bg-gradient-to-r from-pink-500 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-500/25">
        {/* Adorable animated sparkles background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent pointer-events-none animate-pulse" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="bg-amber-400 text-slate-900 text-[10px] font-extrabold px-3 py-1 rounded-full border border-amber-300 shadow-sm uppercase tracking-wider mb-2.5 inline-block animate-bounce">
              🧸 Hello Little Learner! 🌟
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-1.5">
              <span>Ready for fun study runs, {user.username}?</span>
              <span className="animate-spin text-xl text-yellow-300" style={{ animationDuration: '6s' }}>🎈</span>
            </h2>
            <p className="text-xs sm:text-sm text-indigo-50 font-bold mt-1 max-w-xl">
              Enter your live cartoon rooms and try active mini-quiz puzzles. Your primary learning lane is: <span className="font-extrabold text-yellow-300 underline uppercase tracking-wider">{checkedSubject}</span>!
            </p>
          </div>

          <button 
            onClick={onOpenPaymentGateway}
            className="bg-yellow-300 text-slate-900 border-2 border-yellow-400 font-black px-6 py-3 rounded-full text-xs hover:bg-yellow-400 hover:shadow-lg hover:shadow-amber-200 transition duration-150 scale-100 active:scale-95 flex items-center space-x-2 shrink-0 cursor-pointer animate-pulse"
          >
            <span className="text-sm">🏆</span>
            <span>Get My Super Study Badges!</span>
          </button>
        </div>
      </div>

      {/* Grid: 1. Left side controls & 2. Right side metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left main pane (8 cols) */}
        <div className="lg:col-span-8 space-y-8">

          {/* SECTION A: Announcement alert banner */}
          {announcements.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 shadow-sm transform transition duration-300 hover:scale-101">
              <span className="text-[10px] bg-amber-500 text-white font-extrabold px-3 py-1 rounded-full tracking-wider uppercase mb-2 inline-block shadow-sm">
                📢 Teacher's Story Alarm! 🐼
              </span>
              <h3 className="font-black text-sm text-amber-950 block">{announcements[0].title}</h3>
              <p className="text-xs text-amber-850 font-medium leading-relaxed mt-1">{announcements[0].content}</p>
              <div className="text-[10px] text-amber-600 font-bold mt-2">
                Published on {new Date(announcements[0].date).toLocaleDateString()}
              </div>
            </div>
          )}

          {/* SECTION GAME PROMO: Teaser for the separate playroom column view */}
          <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden border border-indigo-500/30">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full filter blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <span className="bg-amber-400/20 text-yellow-300 text-[10px] font-extrabold px-3 py-1 rounded-full border border-amber-300/10 uppercase tracking-wider inline-block">
                  🎮 New Game Arena! 🏆
                </span>
                <h3 className="text-lg font-black tracking-tight leading-tight">Aarambh Kids Brain Playroom</h3>
                <p className="text-xs text-indigo-200/90 max-w-lg">
                  We have moved all your favorite gamified puzzles, jumble solvers, mathematics quests, object matching challenges, and new quizzes to a dedicated tab! Participate to increase your **Daily Streak** & top the leaderboard!
                </p>
              </div>
              
              {setActiveTab && (
                <button
                  type="button"
                  onClick={() => setActiveTab('playroom')}
                  className="bg-yellow-300 text-slate-900 border-2 border-yellow-400 font-extrabold px-5 py-3 rounded-2xl text-xs hover:bg-yellow-400 hover:shadow-lg transition duration-150 shrink-0 cursor-pointer animate-pulse whitespace-nowrap"
                >
                  🧩 Go to Puzzle Room →
                </button>
              )}
            </div>
          </div>

          {/* SECTION B: Scheduled online classes */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight block">🎒 My Cartoon Playrooms!</h3>
                <p className="text-xs text-gray-400 block -mt-0.5">Jump in to study live with your learning buddies and emojis!</p>
              </div>
              <span className="text-2xl animate-bounce">🎈</span>
            </div>

            <div className="space-y-4">
              {schedules.filter(c => c.status !== 'completed').map((cls) => {
                const enrolled = isEnrolledInSubject(cls.subject);
                return (
                  <div 
                    key={cls.id} 
                    className="p-4 border border-gray-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition duration-200"
                  >
                    <div className="space-y-1">
                      <span className="bg-indigo-100 text-indigo-800 text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
                        {cls.subject} Lesson
                      </span>
                      <h4 className="font-bold text-sm text-gray-900 leading-tight">{cls.title}</h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                          <span>{new Date(cls.dateTime).toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}</span>
                        </span>
                        <span>•</span>
                        <span>Duration: {cls.duration} mins</span>
                      </div>
                      <p className="text-xs text-gray-400 italic max-w-sm">{cls.description}</p>
                    </div>

                    <div className="w-full sm:w-auto shrink-0">
                      {enrolled ? (
                        <button
                          onClick={() => {
                            // Update class status to live, then launch
                            fetch(`/api/schedule/${cls.id}/status`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: 'live' })
                            }).then(() => {
                              onLaunchLiveClass(cls);
                            });
                          }}
                          className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2 px-4 rounded-xl shadow-md transition duration-150 flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          <Play className="h-3.5 w-3.5 fill-current" />
                          <span>Enter Classroom</span>
                        </button>
                      ) : (
                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={onOpenPaymentGateway}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs py-2 px-3 rounded-xl transition duration-150 flex items-center justify-center space-x-1 cursor-pointer w-full"
                          >
                            <span>Locked • Enroll Subject</span>
                          </button>
                          <span className="text-[10px] text-gray-400 block text-center">Requires Enrollment Plans</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {schedules.filter(c => c.status !== 'completed').length === 0 && (
                <p className="text-xs text-gray-400 italic text-center py-4">No upcoming scheduled tuition lectures for your primary programs.</p>
              )}
            </div>
          </div>

          {/* SECTION C: Active Assignments with deadlines */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm" id="assignment-tracker-section">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight block">📝 My Homework Puzzles!</h3>
                <p className="text-xs text-gray-400 block -mt-0.5">Fill in your fun school worksheets and earn gold scores!</p>
              </div>
              <span className="text-2xl animate-pulse">🦖</span>
            </div>

            {activeSubmittingAssign ? (
              <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-indigo-700 block font-bold uppercase tracking-wide">Ready for Submission</span>
                    <h4 className="font-bold text-gray-900 text-sm">{activeSubmittingAssign.title}</h4>
                  </div>
                  <button 
                    onClick={() => setActiveSubmittingAssign(null)}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer font-semibold text-xs"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleSubmitAssignmentForm} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-indigo-800 uppercase block mb-1 tracking-wider">Written Summary or Core Working</label>
                    <textarea
                      value={submissionContent}
                      onChange={(e) => setSubmissionContent(e.target.value)}
                      rows={4}
                      placeholder="Type in your equations, answers, derivation values or direct explanation comments representing your home study..."
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  {/* Rich File / Photo Drag and Drop Upload Panel */}
                  <div className="bg-white border-2 border-dashed border-indigo-100 hover:border-indigo-500 p-5 rounded-2xl text-center space-y-2 transition-all shadow-xs relative">
                    <span className="text-2xl block">📸</span>
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">Attach homework photos or workbook files</span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">Capture camera shot representation or upload PDF/PNGs</span>
                    </div>
                    
                    <input 
                      type="file" 
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSubmissionContent(prev => 
                            prev + ` [ATTACHED SOLVED WORKSHEET: ${file.name}]`
                          );
                        }
                      }}
                      className="hidden" 
                      id="homework-workbook-file-picker"
                    />
                    <label 
                      htmlFor="homework-workbook-file-picker" 
                      className="inline-block bg-indigo-50 hover:bg-indigo-150 text-indigo-700 font-bold px-3 py-2 rounded-xl text-[10px] cursor-pointer transition-all border border-indigo-100 mt-1"
                    >
                      📱 Select Photo / File
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3 rounded-xl block transition duration-150 cursor-pointer text-center"
                  >
                    Submit Solved Assignment to Aarambh Classes
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                {assignments.map((as) => {
                  const subResult = submissions.find(s => s.assignmentId === as.id);
                  const isSubmitted = !!subResult;
                  return (
                    <div 
                      key={as.id} 
                      className="p-4 border border-gray-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div className="space-y-1">
                        <span className="bg-gray-100 text-gray-700 text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase">
                          {as.subject} Work
                        </span>
                        <h4 className="font-bold text-sm text-gray-900 leading-tight">{as.title}</h4>
                        <p className="text-xs text-gray-500 leading-snug">{as.description}</p>
                        <div className="text-[11px] text-gray-400 font-medium">
                          Points Worth: {as.totalPoints} • <span className="font-bold text-red-500">Due: {as.dueDate}</span>
                        </div>
                      </div>

                      <div className="shrink-0 w-full sm:w-auto">
                        {isSubmitted ? (
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-xl inline-block w-full text-center ${
                            subResult.status === 'graded' 
                              ? 'bg-green-50 text-green-700' 
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {subResult.status === 'graded' ? `Graded: ${subResult.grade || 'A'} (${subResult.pointsEarned}/${as.totalPoints})` : 'Submitted (Awaiting Grade)'}
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveSubmittingAssign(as);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2 px-4 rounded-xl shadow-xs transition duration-150 w-full text-center cursor-pointer"
                          >
                            Submit Solving
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SECTION D: Mini Quizzes section */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm" id="quizzes-student-panel">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-md sm:text-lg font-black text-gray-900 tracking-tight block">🏆 Playful Mini-Quiz Games!</h3>
                <p className="text-xs text-gray-400 block -mt-0.5">Answer rapid pop questions to unlock cute animal badges!</p>
              </div>
              <span className="text-2xl animate-spin" style={{ animationDuration: '6s' }}>🦄</span>
            </div>

            {activeQuiz ? (
              <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider block">Currently Solving: {activeQuiz.subject} MCQ</span>
                  <button 
                    onClick={() => setActiveQuiz(null)}
                    className="text-gray-400 hover:text-gray-700 font-semibold text-xs cursor-pointer"
                  >
                    Cancel Test
                  </button>
                </div>
                <h4 className="font-bold text-sm text-gray-900">{activeQuiz.title}</h4>

                {quizCompletedScore !== null ? (
                  <div className="text-center py-4 space-y-2">
                    <span className="text-2xl">🎉</span>
                    <h5 className="font-bold text-sm text-gray-900">Quiz Submitted Successfully!</h5>
                    <p className="text-xs text-gray-500">Your total calculated score is: <span className="font-extrabold text-indigo-600">{quizCompletedScore}</span> out of {activeQuiz.questions.length}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeQuiz.questions.map((q, idx) => (
                      <div key={q.id} className="space-y-2 border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                        <p className="text-xs font-bold text-gray-900">{idx + 1}. {q.questionText}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleAnswerQuizSelect(q.id, optIdx)}
                              className={`py-2 px-3 text-left rounded-xl text-xs font-medium transition cursor-pointer ${
                                quizAnswers[q.id] === optIdx
                                  ? 'bg-indigo-600 text-white font-bold'
                                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={handleSubmitActiveQuiz}
                      className="w-full bg-indigo-600 text-white text-xs font-semibold py-2.5 rounded-xl block hover:bg-indigo-700 transition cursor-pointer text-center"
                    >
                      Submit Exam Sheets
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {quizzes.map((qz) => {
                  const hasQuizSub = quizSubs.find(qs => qs.quizId === qz.id);
                  return (
                    <div 
                      key={qz.id} 
                      className="p-4 border border-gray-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div>
                        <span className="bg-indigo-100 text-indigo-800 text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase">
                          {qz.subject} Evaluation
                        </span>
                        <h4 className="font-bold text-sm text-gray-900 leading-tight block mt-1">{qz.title}</h4>
                        <span className="text-xs text-gray-400 block">{qz.questions.length} Multiple Choice Questions</span>
                      </div>

                      <div className="shrink-0 w-full sm:w-auto">
                        {hasQuizSub ? (
                          <span className="bg-green-50 text-green-700 text-xs font-bold px-4 py-2 rounded-xl inline-block w-full text-center">
                            Marks: {hasQuizSub.score} / {hasQuizSub.totalPoints} Checked
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveQuiz(qz);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-xs transition duration-150 block text-center cursor-pointer w-full"
                          >
                            Take Mini-Test
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SECTION E: Tuition Companions Cartoon Playroom */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-100 shadow-sm">
            <h3 className="text-lg font-black text-amber-900 tracking-tight block mb-1">🐼 My Tuition Study Buddies!</h3>
            <p className="text-xs text-amber-700 font-bold mb-6 block">Check out what your playful cartoon guide buddies have for you today:</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
              
              {/* Buddy 1 */}
              <div className="bg-white p-4.5 rounded-2xl border border-amber-200/60 shadow-xs relative overflow-hidden flex flex-col items-center text-center space-y-2 group hover:shadow-md transition duration-200">
                <span className="text-4xl animate-bounce" style={{ animationDuration: '3s' }}>🐼</span>
                <span className="font-extrabold text-xs text-slate-800 tracking-wide block">Pandi the Panda</span>
                <span className="text-[10px] text-amber-600 font-black bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wider block">Math Wizard</span>
                <p className="text-[11px] text-slate-650 leading-relaxed font-sans">
                  "Let's solve mental addition loops! Multiplication is just rapid adding! You can do it!"
                </p>
              </div>

              {/* Buddy 2 */}
              <div className="bg-white p-4.5 rounded-2xl border border-amber-200/60 shadow-xs relative overflow-hidden flex flex-col items-center text-center space-y-2 group hover:shadow-md transition duration-200">
                <span className="text-4xl animate-bounce" style={{ animationDuration: '4s' }}>🦉</span>
                <span className="font-extrabold text-xs text-slate-800 tracking-wide block">Ollie the Owl</span>
                <span className="text-[10px] text-indigo-600 font-black bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider block">Science Genius</span>
                <p className="text-[11px] text-slate-650 leading-relaxed font-sans">
                  "Water drops travel from clouds to soil and back! It's a wonderful circle of nature!"
                </p>
              </div>

              {/* Buddy 3 */}
              <div className="bg-white p-4.5 rounded-2xl border border-amber-200/60 shadow-xs relative overflow-hidden flex flex-col items-center text-center space-y-2 group hover:shadow-md transition duration-200">
                <span className="text-4xl animate-bounce" style={{ animationDuration: '3.5s' }}>🐯</span>
                <span className="font-extrabold text-xs text-slate-800 tracking-wide block">Toby the Tiger</span>
                <span className="text-[10px] text-pink-600 font-black bg-pink-50 px-2 py-0.5 rounded-full uppercase tracking-wider block">Grammar Hero</span>
                <p className="text-[11px] text-slate-650 leading-relaxed font-sans">
                  "English workbook nouns and Hindi singulars are so fun. Sing stories with me!"
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Right analytics / Todo panel (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* 1. Student Personal Performance Tracker */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm text-center">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-4">My Tuition Progress</h4>
            
            <div className="grid grid-cols-2 gap-3 mb-5">
              {/* Box A: Attendance score */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl w-fit mx-auto text-xs font-extrabold">
                  <Percent className="h-4 w-4" />
                </div>
                <div className="text-xl font-extrabold text-gray-900 mt-2">{overallAttendanceRatio}%</div>
                <span className="text-[10px] text-gray-500 font-bold block mt-1">Live Attendance</span>
              </div>

              {/* Box B: Homework Graded */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl w-fit mx-auto text-xs font-extrabold">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-xl font-extrabold text-gray-900 mt-2">{averageGradePoints}%</div>
                <span className="text-[10px] text-gray-500 font-bold block mt-1">Homework Score</span>
              </div>
            </div>

            {/* Individual logs check */}
            <div className="space-y-2 text-left bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-xs text-gray-600 leading-snug">
              <div className="flex justify-between">
                <span>Completed Quizzes Done:</span>
                <span className="font-extrabold text-gray-900">{quizSubs.length} sets</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Submitted Homework sets:</span>
                <span className="font-extrabold text-gray-900">{totalSubmissions} homeworks</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Attendance sessions catalog:</span>
                <span className="font-extrabold text-gray-900">{attendance.length} records</span>
              </div>
            </div>
          </div>

          {/* 2. Primary Student Trophy Cabinet */}
          <div className="bg-gradient-to-b from-indigo-900 to-indigo-950 rounded-3xl p-5 border border-indigo-805 shadow-xl text-white" id="todo-tracker-sidebar">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider block mb-4 flex items-center justify-between">
              <span>🏆 My Trophy Cabinet!</span>
              <span className="text-sm">🎁</span>
            </h4>

            {/* Badges Stack */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-3.5 bg-white/5 p-3 rounded-2xl border border-white/10 hover:bg-white/10 transition duration-150">
                <span className="text-3xl animate-bounce" style={{ animationDuration: '2.5s' }}>🥇</span>
                <div>
                  <span className="font-extrabold text-xs text-indigo-100 block">Class Present Hero</span>
                  <span className="text-[10px] text-indigo-300 block">Attended live classes daily!</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 bg-white/5 p-3 rounded-2xl border border-white/10 hover:bg-white/10 transition duration-150">
                <span className="text-3xl animate-pulse">🧠</span>
                <div>
                  <span className="font-extrabold text-xs text-indigo-100 block">Brainiac Puzzle Master</span>
                  <span className="text-[10px] text-indigo-300 block">Solved rapid pop quiz evaluations!</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 bg-white/5 p-3 rounded-2xl border border-white/10 hover:bg-white/10 transition duration-150">
                <span className="text-3xl animate-spin" style={{ animationDuration: '8s' }}>🌿</span>
                <div>
                  <span className="font-extrabold text-xs text-indigo-100 block">Green Nature Champion</span>
                  <span className="text-[10px] text-indigo-300 block">Active in EVS science lane!</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Demo Request Block */}
          <div className="bg-indigo-950 p-5 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <h4 className="text-[10px] text-indigo-300 font-extrabold uppercase tracking-widest block mb-1">Free Trial Slots</h4>
            <h3 className="font-bold text-md tracking-tight block">Request a Tuition Demo Class</h3>
            <p className="text-[11px] text-indigo-200 block mt-1 leading-relaxed">Book a live guest slot. New demo student accounts credentials are set automatically.</p>
            
            <div className="space-y-3 mt-4">
              <div>
                <label className="text-[10px] text-indigo-300 block font-bold mb-1 uppercase">Choose Demo Subject</label>
                <select
                  value={selectedDemoSubject}
                  onChange={(e) => setSelectedDemoSubject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Science">Science - Water Evaporation</option>
                  <option value="Mathematics">Mathematics - Fraction addition</option>
                  <option value="Social Science">Social Science - India Geography</option>
                  <option value="English">English - Grammar agreement</option>
                  <option value="Hindi">Hindi - Swar & Vyanjan</option>
                  <option value="EVS">EVS - Pollution prevention</option>
                </select>
              </div>

              {demoReqSuccess && (
                <div className="bg-emerald-900/60 p-2.5 rounded-xl text-[10px] text-emerald-100 font-semibold border border-emerald-700/30">
                  {demoReqSuccess}
                </div>
              )}

              <button
                type="button"
                onClick={handleRequestDemo}
                disabled={demoLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl transition duration-150 active:scale-95 disabled:opacity-40 cursor-pointer"
              >
                <span>{demoLoading ? 'Booking Trial Slot...' : 'Reserve Trial Lesson Slot'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
