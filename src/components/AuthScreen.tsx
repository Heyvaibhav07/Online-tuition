/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User as UserIcon, 
  ArrowRight, 
  Sparkles,
  BookOpen,
  Info
} from 'lucide-react';
import { User as UserType } from '../types';

interface AuthScreenProps {
  onAuthSuccess: (user: UserType) => void;
  onViewDemoRequested: () => void;
}

export default function AuthScreen({ onAuthSuccess, onViewDemoRequested }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'student' | 'teacher' | 'parent'>('student');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [chosenSubject, setChosenSubject] = useState('Science');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Handle simple login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all email and password fields.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const contentType = response.headers.get('content-type');
      let data: any = {};
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        const cleanText = text.length > 80 ? text.substring(0, 80) + '...' : text;
        throw new Error(`The server is currently initializing or returned an invalid page: "${cleanText || 'Unknown Status'}". Please try again shortly or use the quick login buttons.`);
      }
      
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }
      onAuthSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Login details matching failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError('Please fill in all requested fields.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          role,
          chosenSubject: role === 'student' ? chosenSubject : undefined,
          wardId: role === 'parent' ? 'user-student-1' : undefined
        })
      });
      
      const contentType = response.headers.get('content-type');
      let data: any = {};
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        const cleanText = text.length > 80 ? text.substring(0, 80) + '...' : text;
        throw new Error(`Server returned non-JSON page: "${cleanText || 'Empty page'}".`);
      }
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed.');
      }
      setMsg('Account successfully created! Attempting login...');
      setTimeout(() => {
        onAuthSuccess(data.user);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Error occurred during registration signup.');
    } finally {
      setLoading(false);
    }
  };

  // Fast prefill credentials for the developer panel review
  const handleQuickPrefill = (type: 'student' | 'teacher' | 'parent') => {
    if (type === 'student') {
      setEmail('student@tuition.com');
      setPassword('student123');
      setIsLogin(true);
    } else if (type === 'parent') {
      setEmail('parent@tuition.com');
      setPassword('parent123');
      setIsLogin(true);
    } else {
      setEmail('teacher@tuition.com');
      setPassword('teacher123');
      setIsLogin(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 border border-gray-100">
        
        {/* Left column: Visual summary details of Aarambh Classes */}
        <div className="md:col-span-5 bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-800 p-8 text-white flex flex-col justify-between">
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <span className="bg-indigo-500/30 text-indigo-100 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase inline-block border border-indigo-400/20">
              My Cartoon Classroom
            </span>
            
            {/* Animated Teacher & Classroom Grid */}
            <div className="relative w-full aspect-square max-w-[180px] bg-slate-900/60 rounded-3xl border border-indigo-400/20 p-4 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
              
              {/* Board */}
              <div className="absolute top-4 w-4/5 h-16 bg-emerald-850 rounded-lg border-4 border-amber-800 shadow-inner flex flex-col items-center justify-center z-0">
                <span className="text-[10px] font-mono text-emerald-100/80">1 + 2 = 3</span>
                <span className="text-[9px] font-mono text-emerald-100/60">A B C...</span>
              </div>
              
              {/* Sparkles / Animations */}
              <div className="absolute top-2 left-6 animate-pulse text-yellow-300 text-sm">✨</div>
              <div className="absolute bottom-6 right-6 animate-bounce text-indigo-400 text-lg">💡</div>
              <div className="absolute bottom-8 left-4 animate-ping text-yellow-200 text-xs text-opacity-30">⭐️</div>

              {/* Animated Teacher Woman Graphic (Realistic SVG matching the requested image 4) */}
              <div className="relative z-10 select-none mt-14 scale-120 transform transition duration-500 hover:rotate-3 flex flex-col items-center">
                <svg viewBox="0 0 200 200" className="w-[105px] h-[105px] drop-shadow-lg" referrerPolicy="no-referrer">
                  {/* Hair (back) */}
                  <path d="M 60,110 C 40,110 25,130 25,160 Z" fill="#4a2c11" />
                  <path d="M 140,110 C 160,110 175,130 175,160 Z" fill="#4a2c11" />
                  
                  {/* Long Brown hair flowing down */}
                  <path d="M 50,75 C 30,90 20,120 28,170 C 40,170 55,150 50,110 Z" fill="#693c14" />
                  <path d="M 150,75 C 170,90 180,120 172,170 C 160,170 145,150 150,110 Z" fill="#693c14" />
                  
                  {/* Neck */}
                  <rect x="91" y="88" width="18" height="18" fill="#FFDBAC" rx="2" />
                  
                  {/* Face */}
                  <circle cx="100" cy="68" r="30" fill="#FFDBAC" />
                  
                  {/* Blouse Collar White */}
                  <path d="M 85,102 Q 100,115 115,102 L 100,120 Z" fill="#FFFFFF" />
                  
                  {/* Black Ribbon bowtie */}
                  <circle cx="100" cy="111" r="3.5" fill="#1e1b4b" />
                  <path d="M 100,111 L 91,120 L 93,126 L 100,116 Z" fill="#0f172a" />
                  <path d="M 100,111 L 109,120 L 107,126 L 100,116 Z" fill="#0f172a" />
                  <circle cx="94" cy="110" r="3.5" fill="#0f172a" />
                  <circle cx="106" cy="110" r="3.5" fill="#0f172a" />

                  {/* Sparkling cartoon dark brown eyes with long eyelashes */}
                  <ellipse cx="86" cy="67" rx="5" ry="6" fill="#4a3525" />
                  <ellipse cx="86" cy="67" rx="3.5" ry="4" fill="#1c0d02" />
                  <circle cx="84.5" cy="64.5" r="1.5" fill="#FFFFFF" />
                  <ellipse cx="114" cy="67" rx="5" ry="6" fill="#4a3525" />
                  <ellipse cx="114" cy="67" rx="3.5" ry="4" fill="#1c0d02" />
                  <circle cx="112.5" cy="64.5" r="1.5" fill="#FFFFFF" />
                  
                  {/* Eyebrows */}
                  <path d="M 78,59 C 83,55 89,57 91,60" stroke="#1c0d02" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                  <path d="M 122,59 C 117,55 111,57 109,60" stroke="#1c0d02" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                  
                  {/* Cheeks blush pink */}
                  <ellipse cx="78" cy="74" rx="4" ry="2" fill="#fda4af" />
                  <ellipse cx="122" cy="74" rx="4" ry="2" fill="#fda4af" />
                  
                  {/* Smile with beautiful pink lips */}
                  <path d="M 92,76 Q 100,83 108,76" stroke="#be123c" strokeWidth="2.2" fill="none" strokeLinecap="round" />

                  {/* Hair Bangs on top of face */}
                  <path d="M 70,48 C 85,38 100,38 130,48" stroke="#693c14" strokeWidth="7" fill="none" strokeLinecap="round" />
                  <path d="M 71,48 C 65,60 67,80 71,85" stroke="#693c14" strokeWidth="3" fill="none" />
                  <path d="M 129,48 C 135,60 133,80 129,85" stroke="#693c14" strokeWidth="3" fill="none" />

                  {/* White Shirt Body */}
                  <path d="M 74,106 C 85,114 115,114 126,106 L 132,156 L 68,156 Z" fill="#FFFFFF" />
                  
                  {/* Grey Plaid Skirt */}
                  <path d="M 68,150 L 132,150 L 136,190 L 64,190 Z" fill="#475569" />
                  
                  {/* Black high waist belt */}
                  <rect x="74" y="145" width="52" height="6" fill="#1e293b" rx="1.5" />
                  
                  {/* Golden belt buckle */}
                  <rect x="96" y="143" width="8" height="10" fill="#fbbf24" rx="1" />

                  {/* Brown pointer rod in hand pointing diagonally to blackboard */}
                  <line x1="124" y1="120" x2="165" y2="45" stroke="#b45309" strokeWidth="3.5" strokeLinecap="round" />
                  
                  {/* White sleeve sleeve and hand */}
                  <path d="M 118,112 Q 130,116 126,126" stroke="#FFFFFF" strokeWidth="10" fill="none" strokeLinecap="round" />
                  <circle cx="126" cy="126" r="4.5" fill="#FFDBAC" />
                </svg>
              </div>

              {/* Floor */}
              <div className="absolute bottom-0 w-full h-3 bg-amber-900/50" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white flex items-center justify-center gap-1">
                Meet My Teacher!
              </h3>
              <p className="text-xs text-indigo-200 leading-relaxed max-w-xs mx-auto">
                Hi! Welcome to our beautiful classroom. We make math puzzle runs, environmental studies, and grammar stories super colorful with playrooms and animated cartoon books!
              </p>
            </div>
          </div>

          <div className="pt-8 md:pt-0 mt-8">
            <div className="border-t border-indigo-500/30 pt-6">
              <span className="text-xs text-indigo-200 font-medium block mb-2">Not ready to enroll?</span>
              <button
                onClick={onViewDemoRequested}
                className="w-full text-center bg-white/13 border border-white/20 hover:bg-white/20 text-white rounded-xl py-2 px-4 text-xs font-semibold tracking-wide transition-all duration-200 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Browse Testimonials & Guest Menu</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Auth Fields */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {isLogin ? 'Welcome Back!' : 'Start Learning Today'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {isLogin ? 'Provide credentials to resume tuition studies.' : 'Complete details to generate a tuition profile.'}
              </p>
            </div>
            
            {/* Toggle Login/Sign-up */}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setMsg('');
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline transition-all cursor-pointer"
            >
              {isLogin ? 'Create Account' : 'Have account? Login'}
            </button>
          </div>

          <form onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit} className="space-y-4" id="auth-form-submit">
            {/* Error Message Panel */}
            {error && (
              <div className="bg-red-50 text-red-700 text-xs font-semibold p-3.5 rounded-xl border border-red-100 shadow-xs flex items-start gap-1.5">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Success Message Panel */}
            {msg && (
              <div className="bg-emerald-50 text-emerald-800 text-xs font-semibold p-3.5 rounded-xl border border-emerald-100 shadow-xs">
                {msg}
              </div>
            )}

            {/* Register Specific Name Fields */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <UserIcon className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="E.g., Vaibhav Raj"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-800"
                    required
                  />
                </div>
              </div>
            )}

            {/* Common Email Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-800"
                  required
                />
              </div>
            </div>

            {/* Common Password Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-800"
                  required
                />
              </div>
            </div>

            {/* Register Specific Role and Subject Options */}
            {!isLogin && (
              <div className="space-y-4 pt-2 font-sans">
                <div>
                  <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Select Your Role</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`py-2.5 px-2 text-xs font-bold rounded-xl border transition-all text-center flex items-center justify-center space-x-1 cursor-pointer ${
                        role === 'student'
                          ? 'border-indigo-500 bg-indigo-50/70 text-indigo-700 font-bold shadow-xs'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('parent')}
                      className={`py-2.5 px-2 text-xs font-bold rounded-xl border transition-all text-center flex items-center justify-center space-x-1 cursor-pointer ${
                        role === 'parent'
                          ? 'border-indigo-500 bg-indigo-50/70 text-indigo-700 font-bold shadow-xs'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      Parent
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('teacher')}
                      className={`py-2.5 px-2 text-xs font-bold rounded-xl border transition-all text-center flex items-center justify-center space-x-1 cursor-pointer ${
                        role === 'teacher'
                          ? 'border-indigo-500 bg-indigo-50/70 text-indigo-700 font-bold shadow-xs'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      Teacher
                    </button>
                  </div>
                </div>

                {/* Subject selection removed for class 1-5 simplification */}

                {role === 'parent' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Link to your ward (Child Name)</label>
                    <select
                      className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-800"
                    >
                      <option value="user-student-1">Vaibhav Raj (Class 10 Student)</option>
                      <option value="user-student-2">Rohan Sharma (Class 8 Student)</option>
                      <option value="user-student-3">Priya Verma (Class 9 Student)</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold text-sm hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-100 transition-all active:scale-98 flex items-center justify-center space-x-2 mt-6 cursor-pointer"
            >
              <span>{loading ? 'Processing...' : isLogin ? 'Access Dashboard' : 'Complete Registration'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Quick Prefill Buttons */}
            {isLogin && (
              <div className="bg-indigo-50/50 rounded-2xl p-3 border border-indigo-100/50 mt-4 text-center space-y-2">
                <span className="text-[10px] text-indigo-700 font-extrabold tracking-wider uppercase block">
                  👉 Quick Demo Accounts (Click to Prefill)
                </span>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  <button
                    type="button"
                    onClick={() => handleQuickPrefill('student')}
                    className="bg-white hover:bg-indigo-100/50 border border-indigo-200/50 text-indigo-700 text-[10px] font-bold py-1 px-2.5 rounded-lg transition-all active:scale-95 cursor-pointer"
                  >
                    Student (Vaibhav)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPrefill('teacher')}
                    className="bg-white hover:bg-indigo-100/50 border border-indigo-200/50 text-indigo-700 text-[10px] font-bold py-1 px-2.5 rounded-lg transition-all active:scale-95 cursor-pointer"
                  >
                    Teacher (Neha)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPrefill('parent')}
                    className="bg-white hover:bg-indigo-100/50 border border-indigo-200/50 text-indigo-700 text-[10px] font-bold py-1 px-2.5 rounded-lg transition-all active:scale-95 cursor-pointer"
                  >
                    Parent (Rajesh)
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Simple Testimonials in Login form footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center font-sans space-y-3">
            <span className="text-[10px] text-indigo-600 font-extrabold tracking-wider uppercase block">Little Learner Feedback 💬🧸</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100 text-left">
                <p className="text-[11px] text-gray-650 font-medium font-sans">“Aarambh is so fun! Math homework is like completing a colorful puzzle run!”</p>
                <span className="text-[9px] text-indigo-600 font-extrabold block mt-1">★ Ananya, Grade 3</span>
              </div>
              <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100 text-left">
                <p className="text-[11px] text-gray-655 font-medium font-sans">“We play math quiz games and EVS classes are super interactive!”</p>
                <span className="text-[9px] text-indigo-600 font-extrabold block mt-1">★ Kabir, Grade 2</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
