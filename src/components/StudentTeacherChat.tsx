/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, User, BookOpen, Clock, Activity } from 'lucide-react';
import { User as UserType, ChatMessage } from '../types';

interface StudentTeacherChatProps {
  currentUser: UserType;
}

export default function StudentTeacherChat({ currentUser }: StudentTeacherChatProps) {
  // Chat thread states
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputContent, setInputContent] = useState('');
  const [activeStudentId, setActiveStudentId] = useState('user-student-1'); // Default student thread for teacher

  const chatEndRef = useRef<HTMLDivElement>(null);

  // List of active students to message for teacher view
  const sandboxStudents = [
    { id: 'user-student-1', name: 'Vaibhav Raj', subject: 'Science' },
    { id: 'user-student-2', name: 'Rohan Sharma', subject: 'Mathematics' },
    { id: 'user-student-3', name: 'Priya Verma', subject: 'English / Grammar' }
  ];

  useEffect(() => {
    fetchChatLogs();
    const interval = setInterval(fetchChatLogs, 5000); // Polling chat threads every 5s
    return () => clearInterval(interval);
  }, [currentUser, activeStudentId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChatLogs = async () => {
    // Determine target thread
    const targetStudentId = currentUser.role === 'student' ? currentUser.id : activeStudentId;
    try {
      const response = await fetch(`/api/chat?studentId=${targetStudentId}`);
      if (response.ok) {
        setMessages(await response.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim()) return;

    const bodyContent = {
      senderId: currentUser.id,
      senderName: currentUser.username,
      senderRole: currentUser.role,
      receiverId: currentUser.role === 'student' ? 'user-teacher' : activeStudentId,
      content: inputContent
    };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyContent)
      });
      if (response.ok) {
        setInputContent('');
        fetchChatLogs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getActiveThreadName = () => {
    if (currentUser.role === 'student') {
      return "Classroom Teacher";
    }
    const selected = sandboxStudents.find(s => s.id === activeStudentId);
    return selected ? `${selected.name} (${selected.subject} student)` : "Student thread";
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[480px] md:h-[520px]">
      
      {/* Left side column: Active Threads list (only visible to Teacher on desktop/tablet) */}
      {currentUser.role === 'teacher' && (
        <div className="hidden md:flex md:col-span-4 bg-gray-50 border-r border-gray-150 p-4 space-y-4 flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="font-extrabold text-sm text-gray-900 block uppercase tracking-wider">Tuition Threads</h3>
              <p className="text-[11px] text-gray-400 block -mt-0.5">Select a student thread to read chat replies</p>
            </div>

            <div className="space-y-2">
              {sandboxStudents.map((std) => (
                <button
                  key={std.id}
                  onClick={() => setActiveStudentId(std.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition duration-150 cursor-pointer flex items-center justify-between text-xs ${
                    activeStudentId === std.id
                      ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-sm'
                      : 'bg-white border-gray-100 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div>
                    <span className="block font-bold">{std.name}</span>
                    <span className={`text-[10px] block ${activeStudentId === std.id ? 'text-indigo-200' : 'text-gray-400'}`}>{std.subject} Track</span>
                  </div>
                  <span className={`h-2.5 w-2.5 rounded-full ${activeStudentId === std.id ? 'bg-white' : 'bg-green-500'} block`} />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-gray-200 text-[11px] text-gray-500 leading-snug">
            <Activity className="h-4 w-4 text-indigo-500 block mb-1.5" />
            <span>Student chat notifications poll dynamically every 5 seconds.</span>
          </div>
        </div>
      )}

      {/* Right side column: Main Chat Box thread (8 cols or full 12 cols if Student) */}
      <div className={`flex flex-col justify-between ${currentUser.role === 'teacher' ? 'md:col-span-8' : 'md:col-span-12'} h-[480px] md:h-full`}>
        
        {/* Chat Box Header strip */}
        <div className="bg-slate-900 text-white p-4 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <User className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-white uppercase tracking-wider block">{getActiveThreadName()}</h3>
              <span className="text-[10px] text-green-400 block tracking-wider font-semibold">● Active Session online</span>
            </div>
          </div>

          {/* Compact Thread Selector for Teacher on Mobile */}
          {currentUser.role === 'teacher' && (
            <div className="flex md:hidden items-center gap-2">
              <label className="text-[10px] uppercase text-gray-400 font-bold">Chat With:</label>
              <select
                value={activeStudentId}
                onChange={(e) => setActiveStudentId(e.target.value)}
                className="bg-slate-800 text-white text-xs py-1 px-2.5 rounded-lg border border-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {sandboxStudents.map((std) => (
                  <option key={std.id} value={std.id}>
                    {std.name} ({std.subject})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Messaging Logs layout */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gray-50" id="chat-messages-tracker-grid">
          {messages.map((m) => {
            const isSelf = m.senderId === currentUser.id;
            return (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 max-w-[80%] ${isSelf ? 'ml-auto flex-row-reverse space-x-reverse' : ''}`}
              >
                <div className={`p-3 text-xs rounded-2xl ${
                  isSelf 
                    ? 'bg-indigo-600 text-white rounded-tr-none font-medium' 
                    : 'bg-white text-gray-850 rounded-tl-none border border-gray-200'
                }`}>
                  <p>{m.content}</p>
                  <span className={`text-[9px] block text-right mt-1 font-mono ${isSelf ? 'text-indigo-200' : 'text-gray-400'}`}>
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}

          {messages.length === 0 && (
            <div className="text-center py-12 space-y-2">
              <MessageSquare className="h-8 w-8 text-gray-300 mx-auto" />
              <p className="text-xs text-gray-400 italic">No message entries starting this thread yet. Send a query!</p>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input sender form */}
        <form onSubmit={handlePostChatMessage} className="p-3.5 bg-white border-t border-gray-150 flex items-center space-x-2 shrink-0">
          <input
            type="text"
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            placeholder={`Leave message for ${currentUser.role === 'student' ? 'Teacher' : 'student'}...`}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500"
            required
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl transition duration-150 active:scale-95 cursor-pointer text-center flex items-center justify-center"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>

      </div>

    </div>
  );
}
