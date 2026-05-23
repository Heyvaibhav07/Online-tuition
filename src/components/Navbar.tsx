/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  GraduationCap, 
  LogOut, 
  User, 
  Sparkles, 
  Calendar,
  MessageSquare,
  ClipboardList,
  BookOpen,
  Menu,
  X
} from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  user: UserType | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function Navbar({ user, activeTab, setActiveTab, onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Brand & Mobile Toggle */}
          <div className="flex items-center space-x-3">
            {user && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-gray-50 focus:outline-none cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            )}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleTabClick('dashboard')}>
              <div className="bg-indigo-600 text-white p-2 md:p-2.5 rounded-xl shadow-md shadow-indigo-100 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 md:h-6 md:w-6" id="nav-brand-icon" />
              </div>
              <div>
                <span className="font-bold text-sm md:text-xl text-gray-900 tracking-tight block">Aarambh Classes</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          {user && (
            <nav className="hidden md:flex space-x-1" aria-label="Global">
              {user.role === 'student' && (
                <>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center space-x-2 ${
                      activeTab === 'dashboard'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>My Dashboard</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('recorded')}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center space-x-2 ${
                      activeTab === 'recorded'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                  >
                    <ClipboardList className="h-4 w-4" />
                    <span>Recorded Lectures</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('playroom')}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center space-x-2 ${
                      activeTab === 'playroom'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                  >
                    <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                    <span>Playroom Games</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center space-x-2 ${
                      activeTab === 'chat'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Chat Room</span>
                  </button>
                </>
              )}
              {user.role === 'parent' && (
                <>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center space-x-2 ${
                      activeTab === 'dashboard'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Parent Dashboard</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center space-x-2 ${
                      activeTab === 'chat'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Tag Teacher / Query</span>
                  </button>
                </>
              )}
              {user.role === 'teacher' && (
                <>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center space-x-2 ${
                      activeTab === 'dashboard'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Schedules & Admin</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('assignments')}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center space-x-2 ${
                      activeTab === 'assignments'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                  >
                    <ClipboardList className="h-4 w-4" />
                    <span>Assessments & Work</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center space-x-2 ${
                      activeTab === 'chat'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Tuition Chats</span>
                  </button>
                </>
              )}
            </nav>
          )}

          {/* User Account Controls */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2 sm:space-x-3 bg-gray-50 p-1 pl-2 sm:pl-3 pr-2 rounded-xl border border-gray-100">
                <div className="text-right hidden sm:block">
                  <div className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
                    {user.username}
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none">
                    {user.role} badge
                  </div>
                </div>
                <div className="h-7 w-7 sm:h-8 sm:w-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-700 font-bold text-xs sm:text-sm">
                  <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1 sm:p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={() => handleTabClick('login')}
                  className="bg-indigo-600 text-white px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold hover:bg-indigo-700 hover:shadow-indigo-100 hover:shadow-lg transition-all scale-100 active:scale-95 cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Panel */}
      {user && mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-3 px-4 space-y-2 animate-in slide-in-from-top duration-150 shadow-inner">
          {user.role === 'student' && (
            <>
              <button
                onClick={() => handleTabClick('dashboard')}
                className={`w-full text-left px-4 py-2.5 text-xs font-semibold rounded-xl transition-all duration-150 flex items-center space-x-3 ${
                  activeTab === 'dashboard'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BookOpen className="h-4 w-4 text-indigo-500" />
                <span>My Dashboard</span>
              </button>
              <button
                onClick={() => handleTabClick('recorded')}
                className={`w-full text-left px-4 py-2.5 text-xs font-semibold rounded-xl transition-all duration-150 flex items-center space-x-3 ${
                  activeTab === 'recorded'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ClipboardList className="h-4 w-4 text-indigo-500" />
                <span>Recorded Lectures</span>
              </button>
              <button
                onClick={() => handleTabClick('playroom')}
                className={`w-full text-left px-4 py-2.5 text-xs font-semibold rounded-xl transition-all duration-150 flex items-center space-x-3 ${
                  activeTab === 'playroom'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                <span>Playroom Games</span>
              </button>
              <button
                onClick={() => handleTabClick('chat')}
                className={`w-full text-left px-4 py-2.5 text-xs font-semibold rounded-xl transition-all duration-150 flex items-center space-x-3 ${
                  activeTab === 'chat'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <MessageSquare className="h-4 w-4 text-indigo-500" />
                <span>Chat Room</span>
              </button>
            </>
          )}

          {user.role === 'parent' && (
            <>
              <button
                onClick={() => handleTabClick('dashboard')}
                className={`w-full text-left px-4 py-2.5 text-xs font-semibold rounded-xl transition-all duration-150 flex items-center space-x-3 ${
                  activeTab === 'dashboard'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BookOpen className="h-4 w-4 text-indigo-500" />
                <span>Parent Dashboard</span>
              </button>
              <button
                onClick={() => handleTabClick('chat')}
                className={`w-full text-left px-4 py-2.5 text-xs font-semibold rounded-xl transition-all duration-150 flex items-center space-x-3 ${
                  activeTab === 'chat'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <MessageSquare className="h-4 w-4 text-indigo-500" />
                <span>Tag Teacher / Query</span>
              </button>
            </>
          )}

          {user.role === 'teacher' && (
            <>
              <button
                onClick={() => handleTabClick('dashboard')}
                className={`w-full text-left px-4 py-2.5 text-xs font-semibold rounded-xl transition-all duration-150 flex items-center space-x-3 ${
                  activeTab === 'dashboard'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Calendar className="h-4 w-4 text-indigo-500" />
                <span>Schedules & Admin</span>
              </button>
              <button
                onClick={() => handleTabClick('assignments')}
                className={`w-full text-left px-4 py-2.5 text-xs font-semibold rounded-xl transition-all duration-150 flex items-center space-x-3 ${
                  activeTab === 'assignments'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ClipboardList className="h-4 w-4 text-indigo-500" />
                <span>Assessments & Work</span>
              </button>
              <button
                onClick={() => handleTabClick('chat')}
                className={`w-full text-left px-4 py-2.5 text-xs font-semibold rounded-xl transition-all duration-150 flex items-center space-x-3 ${
                  activeTab === 'chat'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <MessageSquare className="h-4 w-4 text-indigo-500" />
                <span>Tuition Chats</span>
              </button>
            </>
          )}

          {/* User Summary details inside Mobile navigation menu */}
          <div className="border-t border-gray-100 pt-3 px-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-gray-800">{user.username}</div>
              <div className="text-[9px] text-gray-400 font-semibold uppercase">{user.role} badge</div>
            </div>
            <button
              onClick={onLogout}
              className="text-red-500 hover:bg-red-50 text-xs font-bold px-3 py-1.5 rounded-xl border border-red-100 flex items-center space-x-1 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>M.Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
