/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Video, 
  Award, 
  MessageSquare, 
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet,
  Layers,
  PhoneCall,
  Mail,
  MapPin,
  ListTodo
} from 'lucide-react';
import { User, ClassSchedule, Payment } from './types';
import Navbar from './components/Navbar';
import AboutFooter from './components/AboutFooter';
import AuthScreen from './components/AuthScreen';
import AIChatbot from './components/AIChatbot';
import PaymentModal from './components/PaymentModal';
import LiveClassroom from './components/LiveClassroom';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import ParentDashboard from './components/ParentDashboard';
import StudentTeacherChat from './components/StudentTeacherChat';
import RecordedLecturesSection from './components/RecordedLecturesSection';
import BrainPlayroomGame from './components/BrainPlayroomGame';

// Beautiful school doodles watermark background component corresponding to Image 5 in rich colored cartoon style
function DashboardWatermark() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 min-h-full w-full">
      {/* Large beautiful fluid blobs from the corners in warm school classroom tones */}
      <div className="absolute -top-12 -left-12 w-72 h-72 bg-amber-500/8 rounded-full filter blur-3xl" />
      <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-orange-400/8 rounded-full filter blur-3xl" />
      <div className="absolute top-[40%] -right-10 w-60 h-60 bg-yellow-500/6 rounded-full filter blur-3xl" />

      {/* 1. Green Flask / Beaker top-left */}
      <div className="absolute top-[8%] left-[4%] transform -rotate-12 opacity-[0.25] hover:opacity-[0.4] transition-opacity duration-300">
        <svg width="115" height="115" viewBox="0 0 100 100" fill="none">
          {/* Flask Body */}
          <path d="M42 12h16v18L78 75c3 6-1 13-8 13H30c-7 0-11-7-8-13L42 30V12z" stroke="#0f766e" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="#f0fdfa" />
          <path d="M42 20h16" stroke="#0f766e" strokeWidth="4" />
          {/* Green fluid filling */}
          <path d="M25 76c8-4 16 4 25 0s14-4 22-1 L 70,85 L 30,85 Z" fill="#14b8a6" fillOpacity="0.85" />
          <circle cx="40" cy="65" r="3" fill="#ffffff" fillOpacity="0.6" />
          <circle cx="58" cy="72" r="4.5" fill="#ffffff" fillOpacity="0.6" />
        </svg>
      </div>

      {/* 2. Open Notebook top-left/center */}
      <div className="absolute top-[5%] left-[24%] transform rotate-6 opacity-[0.22]">
        <svg width="115" height="115" viewBox="0 0 100 100" fill="none">
          {/* Open pages */}
          <path d="M15 25c15-8 30-2 35 3c5-5 20-11 35-3v50c-15-8-30-2-35 3c-5-5-20-11-35-3V25z" fill="#def7ec" stroke="#03543f" strokeWidth="4" strokeLinejoin="round" />
          <path d="M50 28V78" stroke="#03543f" strokeWidth="4" />
          {/* Book text lines */}
          <path d="M22 38h18M22 48h18M22 58h18M58 38h20M58 48h20M58 58h20" stroke="#046c4e" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* 3. Blue Highlight Marker top center */}
      <div className="absolute top-[7%] left-[48%] transform rotate-[35deg] opacity-[0.22]">
        <svg width="105" height="105" viewBox="0 0 100 100" fill="none">
          <rect x="25" y="42" width="18" height="42" rx="4" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="3.5" transform="rotate(-30 25 42)" />
          <path d="M38 20l14-8l9 16l-14 8z" fill="#1d4ed8" />
          <path d="M43 25l5-3l4 7l-5 3z" fill="#fbbf24" fillOpacity="0.9" />
        </svg>
      </div>

      {/* 4. Graduation Cap top-right */}
      <div className="absolute top-[6%] right-[6%] transform -rotate-12 opacity-[0.25]">
        <svg width="125" height="125" viewBox="0 0 100 100" fill="none">
          <path d="M50 20L88 35L50 50L12 35Z" fill="#1e1b4b" stroke="#0f172a" strokeWidth="4.5" strokeLinejoin="round" />
          <path d="M32 46v16c0 8 8 12 18 12s18-4 18-12V46" fill="#1e1b4b" stroke="#0f172a" strokeWidth="4" />
          <path d="M88 35v25c0 5-4 5-4 0" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
          <path d="M84 60l3 8m-6-8l3 8" stroke="#eab308" strokeWidth="3.5" />
        </svg>
      </div>

      {/* 5. Crimson Paperclip top-left-middle */}
      <div className="absolute top-[20%] left-[16%] transform rotate-45 opacity-[0.25]">
        <svg width="65" height="65" viewBox="0 0 100 100" fill="none">
          <path d="M30 50 L30 35 A 15 15 0 0 1 60 35 L60 65 A 20 20 0 0 1 20 65 L20 40 A 10 10 0 0 1 40 40 L40 60" stroke="#ef4444" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* 6. Red Pushpin center-left */}
      <div className="absolute top-[32%] left-[2%] transform rotate-12 opacity-[0.22]">
        <svg width="70" height="70" viewBox="0 0 100 100" fill="none">
          <path d="M35 45V30h30v15c0 10-5 15-10 15H45c-5 0-10-5-10-15z" fill="#ef4444" stroke="#b91c1c" strokeWidth="4.5" />
          <path d="M50 60v22" stroke="#4b5563" strokeWidth="4.5" strokeLinecap="round" />
          <rect x="42" y="22" width="16" height="8" rx="2" fill="#ef4444" stroke="#b91c1c" strokeWidth="3.5" />
        </svg>
      </div>

      {/* 7. Horseshoe Magnet middle-right */}
      <div className="absolute top-[40%] right-[2%] transform rotate-12 opacity-[0.25]">
        <svg width="110" height="110" viewBox="0 0 100 100" fill="none">
          <path d="M30 35v20c0 11 9 20 20 20s20-9 20-20V35" stroke="#ef4444" strokeWidth="16" strokeLinecap="butt" />
          <path d="M30 35v12c0 11 9 20 20 20s20-9 20-20V35" stroke="#0284c7" strokeWidth="16" strokeLinecap="butt" />
          {/* Silver terminal tips */}
          <rect x="22" y="27" width="16" height="8" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
          <rect x="62" y="27" width="16" height="8" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
        </svg>
      </div>

      {/* 8. Yellow Workbook binder bottom-left */}
      <div className="absolute bottom-[8%] left-[4%] transform -rotate-12 opacity-[0.25]">
        <svg width="115" height="115" viewBox="0 0 100 100" fill="none">
          <rect x="25" y="20" width="55" height="65" rx="6" fill="#fef08a" stroke="#ca8a04" strokeWidth="4.5" />
          <rect x="36" y="32" width="34" height="42" rx="3" fill="#ffffff" />
          {/* Spiral binding rings */}
          <circle cx="25" cy="28" r="4.5" stroke="#ca8a04" strokeWidth="3" />
          <circle cx="25" cy="40" r="4.5" stroke="#ca8a04" strokeWidth="3" />
          <circle cx="25" cy="52" r="4.5" stroke="#ca8a04" strokeWidth="3" />
          <circle cx="25" cy="64" r="4.5" stroke="#ca8a04" strokeWidth="3" />
          <circle cx="25" cy="76" r="4.5" stroke="#ca8a04" strokeWidth="3" />
        </svg>
      </div>

      {/* 9. Red linear ruler bottom center/left */}
      <div className="absolute bottom-[2%] left-[22%] transform rotate-12 opacity-[0.25]">
        <svg width="140" height="50" viewBox="0 0 150 50" fill="none">
          <rect x="5" y="10" width="140" height="30" rx="4" fill="#fc8181" stroke="#c53030" strokeWidth="4" />
          {/* Tick marks */}
          <line x1="20" y1="10" x2="20" y2="22" stroke="#c53030" strokeWidth="3.5" />
          <line x1="40" y1="10" x2="40" y2="18" stroke="#c53030" strokeWidth="3" />
          <line x1="60" y1="10" x2="60" y2="22" stroke="#c53030" strokeWidth="3.5" />
          <line x1="80" y1="10" x2="80" y2="18" stroke="#c53030" strokeWidth="3" />
          <line x1="100" y1="10" x2="100" y2="22" stroke="#c53030" strokeWidth="3.5" />
          <line x1="120" y1="10" x2="120" y2="18" stroke="#c53030" strokeWidth="3" />
        </svg>
      </div>

      {/* 10. Blue Set Square triangle bottom center */}
      <div className="absolute bottom-[5%] left-[54%] transform -rotate-12 opacity-[0.22]">
        <svg width="110" height="110" viewBox="0 0 100 100" fill="none">
          <path d="M15 85L85 85L15 15Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="4.5" strokeLinejoin="round" />
          <path d="M28 73L63 73L28 38Z" fill="#ffffff" stroke="#0284c7" strokeWidth="3.5" strokeLinejoin="round" />
        </svg>
      </div>

      {/* 11. Chemistry Test Tube bottom-right */}
      <div className="absolute bottom-[6%] right-[5%] transform rotate-[25deg] opacity-[0.25]">
        <svg width="110" height="110" viewBox="0 0 100 100" fill="none">
          <path d="M45 15h10M48 15v55c0 5 4 9 9 9s9-4 9-9V15" stroke="#0891b2" strokeWidth="4.5" strokeLinecap="round" />
          {/* Bubbles in liquid */}
          <path d="M49 45v25c0 3 3 5 6 5s6-2 6-5V45z" fill="#eab308" fillOpacity="0.85" />
          <circle cx="53" cy="54" r="2.5" fill="#ffffff" fillOpacity="0.7" />
          <circle cx="57" cy="62" r="1.5" fill="#ffffff" fillOpacity="0.7" />
        </svg>
      </div>

      {/* 12. Soft light blue paperclip bottom center */}
      <div className="absolute bottom-[14%] right-[22%] transform -rotate-12 opacity-[0.25]">
        <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
          <path d="M30 50 L30 35 A 15 15 0 0 1 60 35 L60 65 A 20 20 0 0 1 20 65 L20 40 A 10 10 0 0 1 40 40 L40 60" stroke="#38bdf8" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        </svg>
      </div>
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('welcome'); // welcome -> landing prep
  const [activeLiveClass, setActiveLiveClass] = useState<ClassSchedule | null>(null);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [showAIChatbotDrawer, setShowAIChatbotDrawer] = useState(false);

  // Landing page form values
  const [demoName, setDemoName] = useState('');
  const [demoEmail, setDemoEmail] = useState('');
  const [demoSubject, setDemoSubject] = useState('Science');
  const [demoStatus, setDemoStatus] = useState('');

  // Handle guest demo requests
  const handleGuestDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoName || !demoEmail) return;

    try {
      const response = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: demoEmail,
          studentName: demoName,
          chosenSubject: demoSubject
        })
      });
      const data = await response.json();
      if (response.ok) {
        setDemoStatus(`Demo reserved successfully! Your account credentials has been configured with Password 'demo123'. Redirecting to portal in 2 seconds...`);
        setDemoName('');
        setDemoEmail('');
        setTimeout(() => {
          setDemoStatus('');
          setCurrentUser(data.user);
          setActiveTab('dashboard');
        }, 2200);
      }
    } catch {
      setDemoStatus('Failed to submit demo request.');
    }
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('welcome');
  };

  const handlePaymentSuccess = (receipt: Payment) => {
    if (currentUser) {
      // Unlocks chosen subject inside local state active representation
      const cleanedSubject = receipt.reason.split(': ')[1] || "Science";
      const updatedUser: User = {
        ...currentUser,
        enrolledSubjects: [...(currentUser.enrolledSubjects || []), cleanedSubject]
      };
      setCurrentUser(updatedUser);
    }
  };

  // Rendering individual tab widgets
  const renderTabContent = () => {
    if (!currentUser) {
      if (activeTab === 'login') {
        return (
          <AuthScreen 
            onAuthSuccess={handleAuthSuccess} 
            onViewDemoRequested={() => setActiveTab('welcome')} 
          />
        );
      }
      
      // Render Breathtaking Guest welcomes landing view
      return (
        <div className="space-y-16">
          {/* A. Hero Banner Section */}
          <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-8 sm:p-12 md:p-16 overflow-hidden shadow-2xl border border-slate-800">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl space-y-6">
              <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-500/20 uppercase tracking-widest inline-block">
                🚀 Welcome to Aarambh Classes
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-none text-white font-sans">
                Interactive Online School Coaching
              </h1>
              <p className="text-sm sm:text-md text-gray-300 leading-relaxed max-w-2xl">
                Experience conceptual, high-standard video classes for student Class 1st to 10th standard. Integrated with automated live lectures, printable homework uploads, student tracking metrics, and custom TuitionAI doubt-solvers.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => setActiveTab('login')}
                  className="bg-indigo-600 text-white font-bold text-xs px-6 py-3.5 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/10 transition active:scale-95 flex items-center space-x-2 cursor-pointer border border-indigo-500"
                >
                  <span>Access Tuition Student Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href="#request-trial-lessons"
                  className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-5 py-3.5 rounded-xl transition active:scale-95 inline-flex items-center space-x-2 cursor-pointer"
                >
                  <span>Book Free Trial slot</span>
                </a>
              </div>
            </div>
          </section>

                  {/* B. Core Subjects Grid Selection */}
          <section className="space-y-6">
            <div className="text-center">
              <span className="text-indigo-600 text-xs font-semibold uppercase tracking-widest block font-sans">Choose Curriculum</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1 block">Custom Curated School Coaching (Class 1st-10th)</h2>
              <p className="text-xs text-gray-500 max-w-md mx-auto block mt-1">Specialized tuition meticulously prepared for primary and middle school grades.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mathematics Suite */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-indigo-600 transition duration-300 shadow-xs hover:shadow-lg flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="bg-indigo-100 text-indigo-700 h-10 w-10 rounded-xl flex items-center justify-center font-bold">
                    🧮
                  </div>
                  <h3 className="font-bold text-gray-900 text-md tracking-tight block">Mathematics Suite</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Master fractions calculations, linear equations solutions, algebraic word problems, geometry rules, and division foundations with visual boards.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab('login')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Practice fraction questions</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Science & EVS */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-indigo-600 transition duration-300 shadow-xs hover:shadow-lg flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="bg-emerald-100 text-emerald-700 h-10 w-10 rounded-xl flex items-center justify-center font-bold">
                    🌿
                  </div>
                  <h3 className="font-bold text-gray-900 text-md tracking-tight block">Science & EVS Track</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Examine water condensation cycles, chemical molecules, pollutants prevention projects, and simple mechanics with real-life models.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab('login')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore EVS projects</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Languages & Grammar */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-indigo-600 transition duration-300 shadow-xs hover:shadow-lg flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="bg-amber-100 text-amber-700 h-10 w-10 rounded-xl flex items-center justify-center font-bold">
                    ✍️
                  </div>
                  <h3 className="font-bold text-gray-900 text-md tracking-tight block">Languages & Grammar</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Build clean English and Hindi nouns understanding, correct subject-verb agreements, vocabulary sheets, and structured comprehension.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab('login')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Attempt grammar sheets</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </section>

          {/* C. Interactive Free trial request scheduler block */}
          <section id="request-trial-lessons" className="bg-gray-50 rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded tracking-widest uppercase inline-block">
                Guest Entry Options
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 block tracking-tight">Reserve a Free On-Line Study Demo</h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                Choose your specific target subject. Completing this reservation dynamically creates a sandbox profile. Log into your dashboard to immediately try our live classrooms or ask your questions to our AI Doubt Solvent!
              </p>
              
              <div className="flex items-center space-x-2 text-xs text-indigo-600 font-bold">
                <CheckCircle className="h-4.5 w-4.5 text-indigo-600" />
                <span>Pre-assigned guest password for this sandbox is "demo123"</span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-150 shadow-md">
              <form onSubmit={handleGuestDemoSubmit} className="space-y-4">
                {demoStatus && (
                  <div className="bg-emerald-50 text-emerald-800 text-xs font-semibold p-3.5 rounded-xl border border-emerald-100">
                    {demoStatus}
                  </div>
                )}
                
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">My Full Name</label>
                  <input
                    type="text"
                    value={demoName}
                    onChange={(e) => setDemoName(e.target.value)}
                    placeholder="E.g., Rohan Sharma"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-850"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Primary Email Address</label>
                  <input
                    type="email"
                    value={demoEmail}
                    onChange={(e) => setDemoEmail(e.target.value)}
                    placeholder="rohan@tuition.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-850"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Target Trial Subject</label>
                  <select
                    value={demoSubject}
                    onChange={(e) => setDemoSubject(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science & EVS</option>
                    <option value="English">English / Grammar</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-indigo-700 shadow-sm transition active:scale-95 cursor-pointer"
                >
                  Join Trial Workspace
                </button>
              </form>
            </div>
          </section>

          {/* D. Beautiful Tuition Testimonials Section */}
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-white relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-slate-950 to-black shadow-2xl">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <span className="bg-indigo-500/10 text-indigo-300 text-[10px] font-bold px-3 py-1 rounded bg-indigo-500/10 border border-indigo-400/10 uppercase tracking-widest block w-fit mx-auto">
                  Heartfelt Stories 💬🧸
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight">What Our Students & Parents Say</h2>
                <p className="text-xs text-gray-400 max-w-lg mx-auto">Real success feedback from our active primary and secondary learners studying at Aarambh.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {/* Testimonial 1 */}
                <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-indigo-500/40 transition duration-200">
                  <div className="flex text-amber-400 text-sm">★★★★★</div>
                  <p className="text-xs text-gray-300 leading-relaxed italic">
                    "Aarambh Classes have totally transformed my son's study habits. The live tutoring rooms and active whiteboards are highly interactive!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-indigo-550 rounded-full flex items-center justify-center text-xs font-black text-white">
                      👨‍👦
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">Rajesh Raj</h4>
                      <span className="text-[10px] text-gray-500 block">Father of Vaibhav Raj (Grade 5)</span>
                    </div>
                  </div>
                </div>

                {/* Testimonial 2 */}
                <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-indigo-500/40 transition duration-200">
                  <div className="flex text-amber-400 text-sm">★★★★★</div>
                  <p className="text-xs text-gray-300 leading-relaxed italic">
                    "I love Pandi the Panda! Solving mental addition stories with cute cartoon companion buddies makes homework feel like playing a game puzzle!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-pink-550 rounded-full flex items-center justify-center text-xs font-black text-white">
                      👧
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">Ananya Kumari</h4>
                      <span className="text-[10px] text-gray-500 block">Active Student (Grade 3 Tracker)</span>
                    </div>
                  </div>
                </div>

                {/* Testimonial 3 */}
                <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-indigo-500/40 transition duration-200">
                  <div className="flex text-amber-400 text-sm">★★★★★</div>
                  <p className="text-xs text-gray-300 leading-relaxed italic">
                    "The automated metrics tracker, printable worksheet uploads, and 24/7 AI Doubt-Solving Assistant fit our family's schedule perfectly."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-emerald-550 rounded-full flex items-center justify-center text-xs font-black text-white">
                      👩
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">Shruti Sen</h4>
                      <span className="text-[10px] text-gray-500 block">Mother of Kabir (Grade 2)</span>
                    </div>
                  </div>
                </div>

                {/* Testimonial 4 */}
                <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-indigo-500/40 transition duration-200">
                  <div className="flex text-amber-400 text-sm">★★★★★</div>
                  <p className="text-xs text-gray-300 leading-relaxed italic">
                    "Science and EVS study is so colorful now. The Tree and Plant Life Cycle animations with rain drops helped me top my school evaluations!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-amber-550 rounded-full flex items-center justify-center text-xs font-black text-white">
                      🎒
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">Meera Chawla</h4>
                      <span className="text-[10px] text-gray-500 block">Active Student (Grade 5 Mathematics Tracker)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      );
    }

    // AUTHENTICATED TABS
    // Student Panels
    if (currentUser.role === 'student') {
      if (activeTab === 'dashboard') {
        return (
          <StudentDashboard 
            user={currentUser} 
            onLaunchLiveClass={(cls) => setActiveLiveClass(cls)}
            onOpenPaymentGateway={() => setShowPaymentGateway(true)}
            setActiveTab={setActiveTab}
          />
        );
      }
      if (activeTab === 'recorded') {
        return <RecordedLecturesSection />;
      }
      if (activeTab === 'playroom') {
        return (
          <BrainPlayroomGame 
            user={currentUser} 
            onScoreSubmitted={async () => {
              // Score submitted logic can trigger generic updates if necessary
            }} 
          />
        );
      }
      if (activeTab === 'chat') {
        return <StudentTeacherChat currentUser={currentUser} />;
      }
    }

    // Parent Panels
    if (currentUser.role === 'parent') {
      if (activeTab === 'dashboard') {
        return (
          <ParentDashboard 
            user={currentUser} 
            onOpenPaymentGateway={() => setShowPaymentGateway(true)}
          />
        );
      }
      if (activeTab === 'chat') {
        return <StudentTeacherChat currentUser={currentUser} />;
      }
    }

    // Teacher Panels
    if (currentUser.role === 'teacher') {
      if (activeTab === 'dashboard') {
        return <TeacherDashboard />;
      }
      if (activeTab === 'assignments') {
        return <TeacherDashboard />; // Handled inside Teacher Dashboard core components
      }
      if (activeTab === 'chat') {
        return <StudentTeacherChat currentUser={currentUser} />;
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#fffdf9] relative overflow-hidden flex flex-col justify-between font-sans antialiased text-gray-800">
      <DashboardWatermark />
      
      {/* Immersive overlay for live classroom video streams */}
      {currentUser && activeLiveClass ? (
        <LiveClassroom 
          user={currentUser} 
          activeClass={activeLiveClass} 
          onExit={() => setActiveLiveClass(null)} 
        />
      ) : (
        <>
          {/* Main Top Navigation */}
          <Navbar 
            user={currentUser} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onLogout={handleLogout} 
          />

          {/* Core Layout Main Section Container */}
          <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
            <div className="relative z-10">
              {renderTabContent()}
            </div>
          </main>

          {/* Floating Zweifel Chatbot Assistant (Student-only helpful floating bubble) */}
          {currentUser && currentUser.role === 'student' && (
            <div className="fixed bottom-6 right-6 z-40">
              {showAIChatbotDrawer ? (
                <div className="w-80 sm:w-96 mb-3 relative animate-in slide-in-from-bottom-5 duration-200">
                  <button
                    onClick={() => setShowAIChatbotDrawer(false)}
                    className="absolute top-2 right-2 p-1.5 bg-slate-900 border border-slate-800 hover:text-white rounded-lg text-xs font-bold text-gray-400 z-50 cursor-pointer"
                  >
                    ✕ Close
                  </button>
                  <AIChatbot studentSubject={currentUser.chosenSubject} />
                </div>
              ) : null}

              {/* Float Widget Trigger */}
              <button
                onClick={() => setShowAIChatbotDrawer(!showAIChatbotDrawer)}
                className="bg-indigo-600 hover:bg-slate-900 text-white rounded-full p-4.5 shadow-2xl flex items-center justify-center font-bold relative hover:scale-110 active:scale-95 transition-all outline-none animate-bounce cursor-pointer group"
                id="floating-doubt-bot-trigger"
                title="Doubts chatbot assistant"
              >
                <Sparkles className="h-6 w-6" />
                <span className="absolute right-14 bg-slate-900 text-white font-semibold text-[10px] tracking-wide px-3 py-1.5 rounded-lg border border-slate-800 opacity-0 group-hover:opacity-100 transition duration-150 pointer-events-none whitespace-nowrap">
                  Solve study doubts 24/7 ✨
                </span>
                {/* Visual indicator alert bubble */}
                <span className="absolute -top-1 -right-1 bg-red-500 h-3.5 w-3.5 rounded-full border border-white animate-pulse" />
              </button>
            </div>
          )}

          {/* Multi-modal Secure Payment Checkout Overlay */}
          {currentUser && showPaymentGateway && (
            <PaymentModal 
              user={currentUser} 
              onPaymentSuccess={handlePaymentSuccess} 
              onClose={() => setShowPaymentGateway(false)} 
            />
          )}

          {/* Footer details of teacher */}
          {!currentUser && activeTab !== 'login' && <AboutFooter />}
        </>
      )}

    </div>
  );
}
