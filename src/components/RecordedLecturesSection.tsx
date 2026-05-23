/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Play, Search, Info, HelpCircle, Laptop, RefreshCw } from 'lucide-react';

interface AnimatedVideo {
  id: string; // youtube embed video code
  title: string;
  classLevel: number; // 1 to 10
  subject: string; // Mathematics, Science & EVS, Languages & Grammar, Social Science
  chapter: string; // E.g. Fractions, Plant Life Cylce
  duration: string;
  channel: string;
  description: string;
}

// Highly curated youtube animated educational videos database for Class 1-10 students
const ANIMATED_VIDEOS_DATABASE: AnimatedVideo[] = [
  {
    id: "zPqnQid_Xms",
    title: "The Plant Life Cycle & Germination 🌿",
    classLevel: 3,
    subject: "Science & EVS",
    chapter: "Plant Cycles",
    duration: "4:32",
    channel: "Dr. Binocs - Peekaboo Kidz",
    description: "Learn how a tiny seed grows into a magnificent tree through this fun cartoon animation journey about plant lifecycles."
  },
  {
    id: "ncORpqp181Y",
    title: "Understanding the Water Cycle & Clouds 💦",
    classLevel: 4,
    subject: "Science & EVS",
    chapter: "Water Cycle",
    duration: "5:12",
    channel: "Peekaboo Kidz",
    description: "Follow the magical droplets as they evaporate, condense in sky storage clouds, and rain down in our ecosystem cycle."
  },
  {
    id: "ITce7f6KGE0",
    title: "Interactive Fractions Puzzles 🧮",
    classLevel: 2,
    subject: "Mathematics",
    chapter: "Primary Fractions",
    duration: "3:40",
    channel: "Scratch Garden",
    description: "A colorful cartoon song breakdown describing parts of a whole, halves, thirds, and quarters for early brainiac solvers."
  },
  {
    id: "Qd6nLM2QLWw",
    title: "Touring our Beautiful Solar System 🪐",
    classLevel: 5,
    subject: "Science & EVS",
    chapter: "Our Universe",
    duration: "6:15",
    channel: "Peekaboo Kidz",
    description: "Fly past Mars, Jupiter, and Saturn to understand orbital gravity, planet names, and solar systems in visual cartoon cards."
  },
  {
    id: "8K8p02T76P8",
    title: "Workbook Nouns & Grammar Rules ✍️",
    classLevel: 1,
    subject: "Languages & Grammar",
    chapter: "English Nouns",
    duration: "3:25",
    channel: "Scratch Garden",
    description: "Sing along and spot common people, distinct places, and playful animals to master basic English workbook nouns."
  },
  {
    id: "ineCCpqpMrY",
    title: "Active Movement Verbs in Stories 🦁",
    classLevel: 2,
    subject: "Languages & Grammar",
    chapter: "Action Verbs",
    duration: "4:02",
    channel: "Scratch Garden",
    description: "Identify doing words, jumping frogs, running tigers, and sleeping owls inside cartoon worksheets."
  },
  {
    id: "EwY6p-r_hyU",
    title: "What is Gravity? Newton's Discovery 💡",
    classLevel: 6,
    subject: "Science & EVS",
    chapter: "Force and Gravity",
    duration: "5:30",
    channel: "Dr. Binocs Show",
    description: "Understand the invisible pull of gravity that holds us to the Earth and controls ocean tides and stellar orbits."
  },
  {
    id: "kKKM8Y-g7lk",
    title: "Sir Isaac Newton's Three Laws of Motion 🧠",
    classLevel: 9,
    subject: "Science & EVS",
    chapter: "Laws of Motion",
    duration: "4:18",
    channel: "Ted-Ed",
    description: "High-standard physics animations exploring inertia, acceleration equations, and equal opposite action-reactions."
  },
  {
    id: "UPBMG5EYydo",
    title: "Photosynthesis: How Plants Make Food ☀",
    classLevel: 7,
    subject: "Science & EVS",
    chapter: "Plant Nutrition",
    duration: "5:05",
    channel: "Peekaboo Kidz",
    description: "Discover how leaves absorb carbon dioxide and solar warmth to synthesize starch sugar, releasing pristine oxygen."
  },
  {
    id: "3A7f6E_4X3w",
    title: "Introduction to Fractions & Decimals 🧮",
    classLevel: 6,
    subject: "Mathematics",
    chapter: "Fractions Mastery",
    duration: "7:22",
    channel: "Math Antics",
    description: "A perfect primer explaining numerator divisions, denominator concepts, and equivalent values in middle school algebra prep."
  },
  {
    id: "KGMf314LuF0",
    title: "Mastering Basic Division Lessons ⚙",
    classLevel: 5,
    subject: "Mathematics",
    chapter: "Division Basics",
    duration: "8:10",
    channel: "Math Antics",
    description: "Learn long quotients calculation, remainders tracking, and fast division check tricks using multiplication formulas."
  },
  {
    id: "NybHckSEQBI",
    title: "Algebra Basics: What is Algebra? 🎯",
    classLevel: 8,
    subject: "Mathematics",
    chapter: "Algebraic Variables",
    duration: "8:35",
    channel: "Math Antics",
    description: "Unlock the mysteries of letters like 'X' and 'y' in equations, balance scale values, and solve linear structures."
  },
  {
    id: "Vtb3I8Vzlps",
    title: "Ecosystems, Green Food Webs, and Energy 🌾",
    classLevel: 8,
    subject: "Science & EVS",
    chapter: "Green Food Webs",
    duration: "5:20",
    channel: "Crash Course Kids",
    description: "Examine how chemical solar energy cascades from primary producers to herbivores, predators, and decomposes in food webs."
  },
  {
    id: "H6D37K2C6W5", // Mock or similar educational clip reference
    title: "The Glorious Indian Freedom Struggle 🦅",
    classLevel: 10,
    subject: "Social Science",
    chapter: "Indian History",
    duration: "9:15",
    channel: "Aarambh History Lounge",
    description: "High-standard historical review outlining landmarks of our great independence, satyagraha movements, and courageous leaders."
  }
];

export default function RecordedLecturesSection() {
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [chapterSearch, setChapterSearch] = useState<string>('');
  const [activeVideo, setActiveVideo] = useState<AnimatedVideo | null>(null);

  // Class filter options (works for Class 1 to 10!)
  const classOptions = ['All', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const subjectOptions = ['All', 'Mathematics', 'Science & EVS', 'Languages & Grammar', 'Social Science'];

  const filteredVideos = ANIMATED_VIDEOS_DATABASE.filter((video) => {
    const matchClass = selectedClass === 'All' || video.classLevel.toString() === selectedClass;
    const matchSubject = selectedSubject === 'All' || video.subject === selectedSubject;
    const matchChapter = chapterSearch.trim() === '' || 
      video.chapter.toLowerCase().includes(chapterSearch.toLowerCase()) ||
      video.title.toLowerCase().includes(chapterSearch.toLowerCase()) ||
      video.description.toLowerCase().includes(chapterSearch.toLowerCase());

    return matchClass && matchSubject && matchChapter;
  });

  const handleResetFilters = () => {
    setSelectedClass('All');
    setSelectedSubject('All');
    setChapterSearch('');
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Search Header Banner */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-505">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              🎥 STUDY PLAYROOM (CLASS 1 - 10)
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">Kids Animated Lecture Hall</h2>
            <p className="text-xs text-indigo-200/90 max-w-xl">
              Learn dynamically with our state-of-the-art interactive Class Player Room! Fully customizable search allows filtration by physical class, school subject, and active curriculum chapters.
            </p>
          </div>
          <Laptop className="h-10 w-10 text-indigo-400 hidden sm:block shrink-0 animate-pulse" />
        </div>
      </div>

      {/* Advanced Filter Control Grid */}
      <div className="bg-white rounded-3xl p-5 border border-gray-150 shadow-xs space-y-4">
        <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest block">
          🔍 Search & Filter Lessons
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
          
          {/* Class Select */}
          <div className="lg:col-span-3">
            <label className="block text-[10px] font-bold text-gray-650 uppercase tracking-wider mb-1.5">Select Class (1-10)</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              {classOptions.map(cls => (
                <option key={cls} value={cls}>{cls === 'All' ? '🎒 All Classes (1-10)' : `Class ${cls}`}</option>
              ))}
            </select>
          </div>

          {/* Subject Select */}
          <div className="lg:col-span-3">
            <label className="block text-[10px] font-bold text-gray-650 uppercase tracking-wider mb-1.5">Select Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              {subjectOptions.map(sub => (
                <option key={sub} value={sub}>{sub === 'All' ? '📑 All Subjects' : sub}</option>
              ))}
            </select>
          </div>

          {/* Chapter / Keyword Search */}
          <div className="lg:col-span-4">
            <label className="block text-[10px] font-bold text-gray-650 uppercase tracking-wider mb-1.5">Search Chapter / Keyword</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                <Search className="h-3.5 w-3.5" />
              </span>
              <input
                type="text"
                value={chapterSearch}
                onChange={(e) => setChapterSearch(e.target.value)}
                placeholder="E.g., Fractions, Plants, Motion..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Reset button */}
          <div className="lg:col-span-2 flex items-end">
            <button
              onClick={handleResetFilters}
              className="w-full bg-slate-150 hover:bg-slate-200 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 h-[34px] cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>

        </div>
      </div>

      {/* Embedded active video player (integrates Youtube Embed Player APIs!) */}
      {activeVideo ? (
        <div className="bg-slate-950 border border-indigo-950 rounded-3xl p-5 shadow-2xl text-white space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <div>
              <span className="text-[9px] bg-indigo-600 text-indigo-50 font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest inline-block mb-1">
                Class {activeVideo.classLevel} • {activeVideo.subject} • Chapter: {activeVideo.chapter}
              </span>
              <h3 className="font-extrabold text-sm sm:text-md text-white block">{activeVideo.title}</h3>
            </div>
            <button
              onClick={() => setActiveVideo(null)}
              className="text-gray-400 hover:text-white font-black text-xs cursor-pointer bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/5 transition duration-150"
            >
              ✕ Close Video
            </button>
          </div>

          {/* Core Embedded YouTube API Iframe Player */}
          <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-lg relative">
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0&modestbranding=1`}
              title={activeVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="p-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 font-black text-xs">🎓 Animation Channel:</span>
              <span className="text-xs text-white underline font-bold">{activeVideo.channel}</span>
              <span className="text-gray-500 text-xs font-bold font-mono">| Duration: {activeVideo.duration} mins</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">{activeVideo.description}</p>
          </div>
        </div>
      ) : (
        <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex gap-2.5 items-start text-xs text-indigo-800 font-medium">
          <Info className="h-4.5 w-4.5 text-indigo-600 shrink-0 mt-0.5 animate-bounce" />
          <div>
            Click any educational cartoon lecture card below to immediately activate your high-speed inline video player stream! Works smoothly on iPad and computer modules.
          </div>
        </div>
      )}

      {/* Videos Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-3xl border border-gray-100 hover:border-indigo-400 transition duration-300 shadow-xs hover:shadow-lg overflow-hidden flex flex-col justify-between group"
          >
            {/* Visual Thumbnail */}
            <div className="relative aspect-video bg-slate-900 overflow-hidden">
              <img
                src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90 group-hover:opacity-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition duration-300" />
              
              {/* Floating Badge */}
              <span className="absolute top-2.5 left-2.5 bg-indigo-900 border border-indigo-750 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                Class {video.classLevel}
              </span>

              {/* Play symbol button */}
              <button
                onClick={() => setActiveVideo(video)}
                className="absolute inset-0 m-auto h-11 w-11 bg-indigo-600 group-hover:bg-amber-400 hover:scale-115 text-white group-hover:text-slate-950 rounded-full flex items-center justify-center shadow-md transition duration-200 cursor-pointer"
                title="Play Video Stream"
              >
                <Play className="h-5 w-5 fill-current ml-0.5" />
              </button>

              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                ⏱ {video.duration}
              </span>
            </div>

            {/* Video Meta info description */}
            <div className="p-5 flex-grow space-y-2">
              <span className="bg-amber-50 text-amber-800 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider block w-fit">
                {video.subject}
              </span>
              <h4 className="font-extrabold text-sm text-gray-950 leading-tight block hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => setActiveVideo(video)}>
                {video.title}
              </h4>
              <p className="text-[11px] text-gray-500 font-sans leading-relaxed line-clamp-2">
                {video.description}
              </p>
              <div className="text-[10px] text-indigo-600 font-bold pt-1">
                Chapter: <span className="underline">{video.chapter}</span>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={() => setActiveVideo(video)}
                className="w-full bg-slate-50 border border-gray-200 group-hover:border-indigo-600 group-hover:bg-indigo-50 text-gray-700 group-hover:text-indigo-700 font-bold py-2 rounded-xl text-xs transition active:scale-95 cursor-pointer text-center"
              >
                Play Video Lesson
              </button>
            </div>
          </div>
        ))}

        {filteredVideos.length === 0 && (
          <div className="text-center py-10 col-span-1 sm:col-span-2 lg:col-span-3 space-y-2 bg-gray-50 rounded-3xl border border-gray-150 border-dashed">
            <HelpCircle className="h-8 w-8 text-gray-400 mx-auto animate-bounce" />
            <p className="text-xs text-gray-500 font-bold italic">No matching cartoon lectures or subjects found for these search conditions.</p>
            <button onClick={handleResetFilters} className="text-xs text-indigo-600 underline font-extrabold hover:text-indigo-850">Clear all filter states</button>
          </div>
        )}
      </div>

    </div>
  );
}
