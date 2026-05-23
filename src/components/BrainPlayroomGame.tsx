/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Trophy, 
  Award, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  Star, 
  Flame,
  HelpCircle,
  TrendingUp,
  GraduationCap
} from 'lucide-react';
import { User as UserType } from '../types';

interface BrainPlayroomGameProps {
  user: UserType;
  onScoreSubmitted?: () => void;
}

// 1. Jumbled words database grouped by Class Level
const JUMBLED_WORDS = {
  "Class 1": [
    { word: "CAT", clue: "A furry pet that meows! 🐱", scrambled: "ATC" },
    { word: "DOG", clue: "Friendly animal that barks! 🐶", scrambled: "GDO" },
    { word: "SUN", clue: "Bright star in the sky during daytime! ☀️", scrambled: "NSU" }
  ],
  "Class 2": [
    { word: "TREE", clue: "Has green leaves, roots and a trunk! 🌳", scrambled: "RETE" },
    { word: "BOOK", clue: "We read it inside the classroom! 📚", scrambled: "KOBO" },
    { word: "STAR", clue: "Shines high in the night sky! ⭐️", scrambled: "TARS" }
  ],
  "Class 3": [
    { word: "WATER", clue: "We drink this to stay active! 💧", scrambled: "RTAEW" },
    { word: "SOLAR", clue: "Clean power we get from the bright Sun! ☀️", scrambled: "RSALO" },
    { word: "CLOUD", clue: "Soft white form that brings rain! ☁️", scrambled: "DLOCU" }
  ],
  "Class 4": [
    { word: "FRACTION", clue: "A part of a whole number (for example 1/2)! 🍕", scrambled: "CITFARON" },
    { word: "WEATHER", clue: "Changes from sunny, rainy to snowy! ⛅", scrambled: "EWTHAER" },
    { word: "SCIENCE", clue: "Learning about nature, animals, and physics! 🧪", scrambled: "CINESEC" }
  ],
  "Class 5": [
    { word: "ECOSYSTEM", clue: "Nature of all living and non-living things! 🌿", scrambled: "TSEYSOEMC" },
    { word: "GEOMETRY", clue: "Study of shapes, triangles, and angles! 📐", scrambled: "MYROETEG" },
    { word: "POLLUTION", clue: "Dirty gases or plastic harming our nature! 🚯", scrambled: "NOLUTIPOL" }
  ]
};

// 2. Math Quest database grouped by Class Level
const MATH_PUZZLES = {
  "Class 1": [
    { question: "What is 3 + 4?", choices: ["5", "6", "7", "8"], correct: "7" },
    { question: "If you have 5 apples and eat 2, how many are left?", choices: ["1", "2", "3", "4"], correct: "3" }
  ],
  "Class 2": [
    { question: "What is 15 + 12?", choices: ["25", "27", "29", "31"], correct: "27" },
    { question: "Solve: 20 minus 6 is...", choices: ["12", "14", "15", "16"], correct: "14" }
  ],
  "Class 3": [
    { question: "What is 4 times 8 (4 x 8)?", choices: ["28", "32", "36", "40"], correct: "32" },
    { question: "Divide 15 sweets among 3 children, how many each gets?", choices: ["3", "4", "5", "6"], correct: "5" }
  ],
  "Class 4": [
    { question: "What is 1/2 of 50?", choices: ["15", "20", "25", "30"], correct: "25" },
    { question: "Find the missing sequence number: 3, 6, 9, 12, __", choices: ["13", "14", "15", "16"], correct: "15" }
  ],
  "Class 5": [
    { question: "If 3x + 4 = 19, what is the value of x?", choices: ["3", "4", "5", "6"], correct: "5" },
    { question: "The area of a square with side length 6 cm is:", choices: ["24 sq cm", "30 sq cm", "36 sq cm", "42 sq cm"], correct: "36 sq cm" }
  ]
};

// 3. Object matching database
const OBJECT_MATCHES = {
  "Class 1": [
    { emoji: "🍎", question: "Identify this delicious red fruit:", choices: ["Banana", "Apple", "Mango", "Grape"], correct: "Apple" },
    { emoji: "🐶", question: "Identify this friendly pet animal:", choices: ["Cat", "Rabbit", "Dog", "Lion"], correct: "Dog" }
  ],
  "Class 2": [
    { emoji: "🦁", question: "Who is this roaring king of the jungle?", choices: ["Tiger", "Cheetah", "Lion", "Leopard"], correct: "Lion" },
    { emoji: "🎒", question: "What is this tool used to carry books to class?", choices: ["School Bag", "Notebook", "Pencil Box", "Toybox"], correct: "School Bag" }
  ],
  "Class 3": [
    { emoji: "🌍", question: "Identify our beautiful blue planet:", choices: ["Mars", "Earth", "Venus", "Saturn"], correct: "Earth" },
    { emoji: "🏫", question: "Where do kids study, play and learn together?", choices: ["School", "Hospital", "Cinema", "Library"], correct: "School" }
  ],
  "Class 4": [
    { emoji: "📐", question: "Identify this set square drawing tool:", choices: ["Compass", "Set Square", "Ruler", "Protractor"], correct: "Set Square" },
    { emoji: "🧪", question: "Which container is a science chemistry test tube?", choices: ["Beaker", "Test Tube", "Measuring Box", "Funnel"], correct: "Test Tube" }
  ],
  "Class 5": [
    { emoji: "🧬", question: "What biological spiral model is this?", choices: ["Bacteria", "DNA / Genetics", "Atom", "Cell Nucleus"], correct: "DNA / Genetics" },
    { emoji: "🌋", question: "What active mountain landform spits red hot lava?", choices: ["Mountain", "Volcano", "Canyon", "Glacier"], correct: "Volcano" }
  ]
};

// NEW: Game 4 - Spelling Whiz Questions
const SPELLING_CHALLENGES = {
  "Class 1": [
    { question: "Which spelling is correct for the animal that barks? 🐶", choices: ["Dogg", "Dog", "Dogo", "Doggyy"], correct: "Dog" },
    { question: "Identify the correct letters for this red crunchy fruit: 🍎", choices: ["Apel", "Apple", "Aplle", "Appll"], correct: "Apple" }
  ],
  "Class 2": [
    { question: "Choose the correct spelling of your school helper: 🩺", choices: ["Doctar", "Doktor", "Doctor", "Doctre"], correct: "Doctor" },
    { question: "Pick the correct spelling of your study buddy: 🤝", choices: ["Frend", "Friend", "Freind", "Frind"], correct: "Friend" }
  ],
  "Class 3": [
    { question: "Find the correct spelling of this clear life liquid: 💧", choices: ["Watar", "Water", "Wattre", "Whater"], correct: "Water" },
    { question: "Choose the correct spelling representing our sky condensation helper: ☁️", choices: ["Cloud", "Clowd", "Clude", "Colud"], correct: "Cloud" }
  ],
  "Class 4": [
    { question: "Identify the correct mathematical spelling term: 🧮", choices: ["Multpication", "Multipication", "Multiplication", "Multiplicasion"], correct: "Multiplication" },
    { question: "Choose the correct spelling for high cloud water drops falling: 🌧️", choices: ["Presipitasion", "Precipitation", "Presepitation", "Presipitation"], correct: "Precipitation" }
  ],
  "Class 5": [
    { question: "Identify the correct vocabulary for all living & non-living surroundings: 🌿", choices: ["Ecosystem", "Ecosistem", "Ekosystem", "Ecosystim"], correct: "Ecosystem" },
    { question: "Pick the correct geometrical standard shape term: 📐", choices: ["Triangel", "Tryangle", "Triangle", "Treeangle"], correct: "Triangle" }
  ]
};

// NEW: Game 5 - Science Trivia Spark Questions
const SCIENCE_TRIVIA = {
  "Class 1": [
    { question: "Which chest organ thumps and pumps warm blood around us? 💓", choices: ["Hand", "Lungs", "Heart", "Stomach"], correct: "Heart" },
    { question: "Green leaves absorb this bright yellow helper to cook food: ☀️", choices: ["Ice", "Sunlight", "Oil", "Cloud Soil"], correct: "Sunlight" }
  ],
  "Class 2": [
    { question: "During which season do forest trees drop their dry golden leaves? 🍁", choices: ["Spring", "Summer", "Autumn", "Winter"], correct: "Autumn" },
    { question: "Which is a clean example of high-temperature gaseous water? ☁️", choices: ["Ice Cube", "Lake Salt", "Water Vapor", "Glacier"], correct: "Water Vapor" }
  ],
  "Class 3": [
    { question: "Which helpful breathing tool do active fish use underwater? 🐟", choices: ["Air tubes", "Gills", "Beaks", "Glands"], correct: "Gills" },
    { question: "What radiant energy form do we get from a glowing candle or bulb? 💡", choices: ["Sound Energy", "Light Energy", "Soil Energy", "Wind Energy"], correct: "Light Energy" }
  ],
  "Class 4": [
    { question: "Which clean gas is absolutely necessary for humans to breathe and live? 🌬️", choices: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Helium Spark"], correct: "Oxygen" },
    { question: "What is the science term for green plants manufacturing nutrition with rays? 🌿", choices: ["Evaporation", "Respiration", "Photosynthesis", "Digestion"], correct: "Photosynthesis" }
  ],
  "Class 5": [
    { question: "Which major gas holds warm temperature traps in our atmosphere? 🌍", choices: ["Oxygen Gas", "Carbon Dioxide", "Hydrogen Gas", "Argon Gas"], correct: "Carbon Dioxide" },
    { question: "What phase changes the state of solid ice into fluid water? 🧊", choices: ["Freezing", "Melting", "Boiling", "Drafting"], correct: "Melting" }
  ]
};

type PuzzleType = 'jumble' | 'math' | 'match' | 'spelling' | 'science';

export default function BrainPlayroomGame({ user, onScoreSubmitted }: BrainPlayroomGameProps) {
  // Game Configuration States
  const [selectedClass, setSelectedClass] = useState<keyof typeof JUMBLED_WORDS>("Class 1");
  const [activeTab, setActiveTab] = useState<PuzzleType>('jumble');
  
  // Quiz and Question Progress
  const [questionIndex, setQuestionIndex] = useState(0);
  const [jumbleInput, setJumbleInput] = useState('');
  const [selectedMathChoice, setSelectedMathChoice] = useState<string | null>(null);
  const [selectedMatchChoice, setSelectedMatchChoice] = useState<string | null>(null);
  const [selectedSpellingChoice, setSelectedSpellingChoice] = useState<string | null>(null);
  const [selectedScienceChoice, setSelectedScienceChoice] = useState<string | null>(null);
  
  // Game Scoring and Feedback
  const [gameScore, setGameScore] = useState(0);
  const [answersSubmitted, setAnswersSubmitted] = useState<Record<number, { correct: boolean; submitted: string }>>({});
  const [currentFeedback, setCurrentFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');

  // Daily Streak State
  const [streakCount, setStreakCount] = useState(0);
  const [streakMessage, setStreakMessage] = useState('');

  // Load and check streak on mount
  useEffect(() => {
    const storedStreak = localStorage.getItem('aarambh_streak_count');
    const storedLastPlayed = localStorage.getItem('aarambh_last_played');
    const todayStr = new Date().toISOString().split('T')[0];

    if (storedStreak && storedLastPlayed) {
      const streak = parseInt(storedStreak, 10);
      const lastPlayedDate = new Date(storedLastPlayed);
      const todayDate = new Date(todayStr);

      const diffTime = Math.abs(todayDate.getTime() - lastPlayedDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        setStreakCount(streak);
        setStreakMessage("Outstanding study streak maintained for today! ⚡🔥");
      } else if (diffDays === 1) {
        setStreakCount(streak);
        setStreakMessage("Study run is active! Tackle any playroom quiz to keep it burning. 🔥");
      } else {
        setStreakCount(0);
        setStreakMessage("No quiz played recently. Complete a challenge to restart your daily streak! 🐾");
      }
    } else {
      setStreakCount(0);
      setStreakMessage("Start your learning streak today! Conquer any puzzle to earn streak badge! 🔥");
    }
  }, []);

  // Update streak on successful completion
  const updateStreakOnSuccess = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const storedLastPlayed = localStorage.getItem('aarambh_last_played');
    const storedStreak = localStorage.getItem('aarambh_streak_count');

    let currentStreak = storedStreak ? parseInt(storedStreak, 10) : 0;

    if (storedLastPlayed !== todayStr) {
      const lastPlayedDate = storedLastPlayed ? new Date(storedLastPlayed) : null;
      const todayDate = new Date(todayStr);

      let maintain = false;
      if (lastPlayedDate) {
        const diffTime = Math.abs(todayDate.getTime() - lastPlayedDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          maintain = true;
        }
      }

      if (maintain || currentStreak === 0) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }

      localStorage.setItem('aarambh_streak_count', currentStreak.toString());
      localStorage.setItem('aarambh_last_played', todayStr);
      setStreakCount(currentStreak);
      setStreakMessage(`Streak Level Up! Your burning streak is now ${currentStreak} days! 🔥🎉`);
    } else {
      setStreakMessage(`Fantastic job! Today's streak is already verified! 🔥`);
    }
  };

  // Reset progress when configurations change
  useEffect(() => {
    resetGame();
  }, [selectedClass, activeTab]);

  const resetGame = () => {
    setQuestionIndex(0);
    setJumbleInput('');
    setSelectedMathChoice(null);
    setSelectedMatchChoice(null);
    setSelectedSpellingChoice(null);
    setSelectedScienceChoice(null);
    setGameScore(0);
    setAnswersSubmitted({});
    setCurrentFeedback(null);
    setIsGameFinished(false);
    setUploadSuccessMsg('');
  };

  const getActiveDatasetLength = () => {
    if (activeTab === 'jumble') return JUMBLED_WORDS[selectedClass].length;
    if (activeTab === 'math') return MATH_PUZZLES[selectedClass].length;
    if (activeTab === 'match') return OBJECT_MATCHES[selectedClass].length;
    if (activeTab === 'spelling') return SPELLING_CHALLENGES[selectedClass].length;
    return SCIENCE_TRIVIA[selectedClass].length;
  };

  const checkAnswerProgress = (isCorrect: boolean, submittedVal: string) => {
    setAnswersSubmitted(prev => ({
      ...prev,
      [questionIndex]: { correct: isCorrect, submitted: submittedVal }
    }));

    if (isCorrect) {
      setGameScore(s => s + 20);
      setCurrentFeedback('correct');
    } else {
      setCurrentFeedback('incorrect');
    }

    triggerNextStep();
  };

  const handleJumbleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jumbleInput.trim()) return;

    const currentItem = JUMBLED_WORDS[selectedClass][questionIndex];
    const isCorrect = jumbleInput.trim().toUpperCase() === currentItem.word.toUpperCase();
    
    checkAnswerProgress(isCorrect, jumbleInput.trim());
  };

  const handleMathSubmit = (choice: string) => {
    if (answersSubmitted[questionIndex]) return;
    setSelectedMathChoice(choice);
    
    const currentItem = MATH_PUZZLES[selectedClass][questionIndex];
    const isCorrect = choice === currentItem.correct;

    checkAnswerProgress(isCorrect, choice);
  };

  const handleMatchSubmit = (choice: string) => {
    if (answersSubmitted[questionIndex]) return;
    setSelectedMatchChoice(choice);

    const currentItem = OBJECT_MATCHES[selectedClass][questionIndex];
    const isCorrect = choice === currentItem.correct;

    checkAnswerProgress(isCorrect, choice);
  };

  const handleSpellingSubmit = (choice: string) => {
    if (answersSubmitted[questionIndex]) return;
    setSelectedSpellingChoice(choice);

    const currentItem = SPELLING_CHALLENGES[selectedClass][questionIndex];
    const isCorrect = choice === currentItem.correct;

    checkAnswerProgress(isCorrect, choice);
  };

  const handleScienceSubmit = (choice: string) => {
    if (answersSubmitted[questionIndex]) return;
    setSelectedScienceChoice(choice);

    const currentItem = SCIENCE_TRIVIA[selectedClass][questionIndex];
    const isCorrect = choice === currentItem.correct;

    checkAnswerProgress(isCorrect, choice);
  };

  const triggerNextStep = () => {
    setTimeout(() => {
      setCurrentFeedback(null);
      setSelectedMathChoice(null);
      setSelectedMatchChoice(null);
      setSelectedSpellingChoice(null);
      setSelectedScienceChoice(null);
      setJumbleInput('');

      const maxLen = getActiveDatasetLength();
      if (questionIndex + 1 < maxLen) {
        setQuestionIndex(qi => qi + 1);
      } else {
        setIsGameFinished(true);
        updateStreakOnSuccess();
      }
    }, 1800);
  };

  const submitScoreToServer = async () => {
    setIsSubmittingScore(true);
    setUploadSuccessMsg('');
    
    let puzzleTitle = 'Jumbled Letters';
    if (activeTab === 'math') puzzleTitle = 'Math Quest';
    if (activeTab === 'match') puzzleTitle = 'Object Matcher';
    if (activeTab === 'spelling') puzzleTitle = 'Spelling Whiz';
    if (activeTab === 'science') puzzleTitle = 'Science Trivia Spark';

    try {
      const res = await fetch('/api/game-scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId: user.id,
          studentName: user.username,
          score: gameScore,
          classLevel: selectedClass,
          puzzleType: puzzleTitle
        })
      });

      if (res.ok) {
        setUploadSuccessMsg("🏆 High score saved successfully to the Aarambh global leaderboard!");
        if (onScoreSubmitted) {
          onScoreSubmitted();
        }
      } else {
        setUploadSuccessMsg("Failed to upload scoreboard. Please try again! 🐼");
      }
    } catch (e) {
      console.error(e);
      setUploadSuccessMsg("Connection error uploading high scores.");
    } finally {
      setIsSubmittingScore(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Dynamic Header With Daily Streak Stats Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-indigo-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-yellow-400/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-300/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-yellow-400 text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider block">
                🧩 Cartoon Game Arena
              </span>
              <div className="flex items-center gap-1 bg-white/10 text-yellow-250 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-white/10">
                <Flame className="h-3 w-3 fill-current text-orange-400 animate-pulse" />
                <span>Streak: {streakCount} Days</span>
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-1.5">
              <span>Aarambh Brain Playroom Challenge</span>
              <span className="animate-spin text-xl text-yellow-300" style={{ animationDuration: '6s' }}>🎈</span>
            </h2>
            <p className="text-xs text-indigo-50 font-semibold mt-1 max-w-2xl block">
              💡 {streakMessage} Complete the questions below, claim higher stars, and top our leaderboard!
            </p>
          </div>

          <div className="flex gap-2">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl text-center border border-white/15">
              <span className="text-[9px] text-yellow-200 uppercase font-extrabold block">Your Stars</span>
              <span className="text-xl font-black block">{gameScore} Pts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Playroom Game Zone - Left Column (8 cols) */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl p-6 border-4 border-indigo-200/65 shadow-xl overflow-hidden relative">
            
            {/* Class Level Selector Bar */}
            <div className="mb-6">
              <label className="text-[10px] font-black uppercase text-indigo-905 tracking-wider mb-2.5 block flex items-center justify-between">
                <span>🎯 Select Your Primary Standard Class:</span>
                <span className="text-[10px] text-indigo-505 font-bold">Class standard dynamically changes quiz levels</span>
              </label>
              
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {(["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"] as const).map((cls) => {
                  const isActive = selectedClass === cls;
                  return (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setSelectedClass(cls)}
                      className={`py-2 px-1 text-[11px] sm:text-xs font-black rounded-xl border transition-all cursor-pointer text-center ${
                        isActive
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-md scale-102"
                          : "bg-slate-50 border-gray-200 text-gray-600 hover:bg-indigo-50/50 hover:border-indigo-200"
                      }`}
                    >
                      {cls}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Playroom Tabs Header - Wrap inside a beautiful responsive container */}
            <div className="mb-6">
              <label className="text-[10px] font-black uppercase text-amber-800 tracking-wider mb-2.5 block">
                🕹️ Select Gamified Puzzle Category to Play:
              </label>

              <div className="flex flex-wrap gap-2 pb-2">
                {[
                  { id: 'jumble', label: '✏️ Jumbles', bg: 'hover:bg-amber-50 hover:text-amber-800', activeBg: 'bg-amber-100 border-amber-400 text-amber-900' },
                  { id: 'math', label: '🧮 Math Quest', bg: 'hover:bg-emerald-50 hover:text-emerald-800', activeBg: 'bg-emerald-100 border-emerald-400 text-emerald-900' },
                  { id: 'match', label: '🖼️ Object Matcher', bg: 'hover:bg-pink-50 hover:text-pink-800', activeBg: 'bg-pink-100 border-pink-400 text-pink-900' },
                  { id: 'spelling', label: '✍️ Spelling Whiz', bg: 'hover:bg-sky-50 hover:text-sky-800', activeBg: 'bg-sky-100 border-sky-400 text-sky-900' },
                  { id: 'science', label: '🧪 Science Trivia', bg: 'hover:bg-purple-50 hover:text-purple-800', activeBg: 'bg-purple-100 border-purple-400 text-purple-900' }
                ].map((tab) => {
                  const isCurTab = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as PuzzleType)}
                      className={`py-2.5 px-3.5 text-xs font-black rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                        isCurTab ? tab.activeBg : `bg-white border-gray-150 text-gray-500 ${tab.bg}`
                      }`}
                    >
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Main Arena View */}
            <div className="bg-slate-50/60 rounded-2xl p-5 border border-slate-200/50 min-h-[260px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {!isGameFinished ? (
                  <motion.div
                    key={`${activeTab}-${selectedClass}-${questionIndex}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {/* Active puzzle indicator */}
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-extrabold uppercase">
                      <span>Task Progress ({questionIndex + 1}/{getActiveDatasetLength()})</span>
                      <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-2.5 py-0.5 rounded-full">
                        Grade Level: {selectedClass} difficulty status
                      </span>
                    </div>

                    {/* GAME: Jumbled Words */}
                    {activeTab === 'jumble' && JUMBLED_WORDS[selectedClass][questionIndex] && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <span className="text-[10px] text-gray-400 block uppercase font-bold">Unscramble the character pieces</span>
                          <div className="flex justify-center gap-1.5 mt-2">
                            {JUMBLED_WORDS[selectedClass][questionIndex].scrambled.split('').map((char, i) => (
                              <span 
                                key={i} 
                                className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-400 border-2 border-amber-500 text-amber-950 font-black text-lg flex items-center justify-center rounded-xl shadow-sm rotate-3 hover:-rotate-3 transition transform duration-150"
                              >
                                {char}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 font-medium">
                          💡 <span className="font-extrabold">Clue:</span> {JUMBLED_WORDS[selectedClass][questionIndex].clue}
                        </div>

                        <form onSubmit={handleJumbleSubmit} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Type correct word here..."
                            value={jumbleInput}
                            onChange={(e) => setJumbleInput(e.target.value)}
                            disabled={!!answersSubmitted[questionIndex]}
                            className="flex-grow bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-600 disabled:opacity-45 font-sans uppercase"
                            required
                          />
                          <button
                            type="submit"
                            disabled={!jumbleInput.trim() || !!answersSubmitted[questionIndex]}
                            className="bg-indigo-600 hover:bg-slate-900 text-white font-extrabold text-xs px-5 rounded-xl transition duration-150 disabled:opacity-40 cursor-pointer"
                          >
                            Unscramble
                          </button>
                        </form>
                      </div>
                    )}

                    {/* GAME: Math Quest */}
                    {activeTab === 'math' && MATH_PUZZLES[selectedClass][questionIndex] && (
                      <div className="space-y-4">
                        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 text-center">
                          <span className="font-extrabold text-gray-800 text-sm sm:text-md block">
                            {MATH_PUZZLES[selectedClass][questionIndex].question}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          {MATH_PUZZLES[selectedClass][questionIndex].choices.map((choice, i) => {
                            const isChosen = selectedMathChoice === choice;
                            const isCorrect = choice === MATH_PUZZLES[selectedClass][questionIndex].correct;
                            const isSubmitted = !!answersSubmitted[questionIndex];
                            
                            let choiceStyle = "bg-white border-gray-200 hover:bg-indigo-50/40 text-gray-700";
                            if (isSubmitted) {
                              if (isCorrect) {
                                choiceStyle = "bg-emerald-100 border-emerald-400 text-emerald-950 font-extrabold";
                              } else if (isChosen) {
                                choiceStyle = "bg-red-100 border-red-400 text-red-950 font-extrabold";
                              } else {
                                choiceStyle = "bg-slate-100 border-gray-100 text-gray-400 opacity-60";
                              }
                            }

                            return (
                              <button
                                key={i}
                                type="button"
                                disabled={isSubmitted}
                                onClick={() => handleMathSubmit(choice)}
                                className={`p-3 text-xs font-bold border rounded-xl transition-all ${choiceStyle} cursor-pointer text-center`}
                              >
                                {choice}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* GAME: Object Matcher */}
                    {activeTab === 'match' && OBJECT_MATCHES[selectedClass][questionIndex] && (
                      <div className="space-y-4">
                        <div className="flex flex-col items-center justify-center p-4 bg-pink-50/20 border border-pink-100 rounded-xl gap-2">
                          <span className="text-5xl animate-bounce" style={{ animationDuration: '3s' }}>
                            {OBJECT_MATCHES[selectedClass][questionIndex].emoji}
                          </span>
                          <span className="text-xs text-gray-600 font-extrabold block text-center">
                            {OBJECT_MATCHES[selectedClass][questionIndex].question}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          {OBJECT_MATCHES[selectedClass][questionIndex].choices.map((choice, i) => {
                            const isChosen = selectedMatchChoice === choice;
                            const isCorrect = choice === OBJECT_MATCHES[selectedClass][questionIndex].correct;
                            const isSubmitted = !!answersSubmitted[questionIndex];

                            let choiceStyle = "bg-white border-gray-200 hover:bg-pink-50/40 text-gray-700";
                            if (isSubmitted) {
                              if (isCorrect) {
                                choiceStyle = "bg-emerald-100 border-emerald-400 text-emerald-950 font-extrabold";
                              } else if (isChosen) {
                                choiceStyle = "bg-red-100 border-red-400 text-red-950 font-extrabold";
                              } else {
                                choiceStyle = "bg-slate-100 border-gray-100 text-gray-400 opacity-60";
                              }
                            }

                            return (
                              <button
                                key={i}
                                type="button"
                                disabled={isSubmitted}
                                onClick={() => handleMatchSubmit(choice)}
                                className={`p-3 text-xs font-bold border rounded-xl transition-all ${choiceStyle} cursor-pointer text-center`}
                              >
                                {choice}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* GAME: Spelling Whiz */}
                    {activeTab === 'spelling' && SPELLING_CHALLENGES[selectedClass][questionIndex] && (
                      <div className="space-y-4">
                        <div className="bg-sky-50/40 p-4 rounded-xl border border-sky-100 text-center">
                          <span className="font-extrabold text-slate-800 text-xs sm:text-sm block">
                            {SPELLING_CHALLENGES[selectedClass][questionIndex].question}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          {SPELLING_CHALLENGES[selectedClass][questionIndex].choices.map((choice, i) => {
                            const isChosen = selectedSpellingChoice === choice;
                            const isCorrect = choice === SPELLING_CHALLENGES[selectedClass][questionIndex].correct;
                            const isSubmitted = !!answersSubmitted[questionIndex];

                            let choiceStyle = "bg-white border-gray-200 hover:bg-sky-50/45 text-gray-700";
                            if (isSubmitted) {
                              if (isCorrect) {
                                choiceStyle = "bg-emerald-100 border-emerald-400 text-emerald-950 font-extrabold";
                              } else if (isChosen) {
                                choiceStyle = "bg-red-100 border-red-400 text-red-950 font-extrabold";
                              } else {
                                choiceStyle = "bg-slate-100 border-gray-100 text-gray-400 opacity-60";
                              }
                            }

                            return (
                              <button
                                key={i}
                                type="button"
                                disabled={isSubmitted}
                                onClick={() => handleSpellingSubmit(choice)}
                                className={`p-3 text-xs font-bold border rounded-xl transition-all ${choiceStyle} cursor-pointer text-center`}
                              >
                                {choice}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* GAME: Science Trivia Spark */}
                    {activeTab === 'science' && SCIENCE_TRIVIA[selectedClass][questionIndex] && (
                      <div className="space-y-4">
                        <div className="bg-purple-50/30 p-4 rounded-xl border border-purple-100 text-center">
                          <span className="font-extrabold text-slate-800 text-xs sm:text-sm block">
                            {SCIENCE_TRIVIA[selectedClass][questionIndex].question}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          {SCIENCE_TRIVIA[selectedClass][questionIndex].choices.map((choice, i) => {
                            const isChosen = selectedScienceChoice === choice;
                            const isCorrect = choice === SCIENCE_TRIVIA[selectedClass][questionIndex].correct;
                            const isSubmitted = !!answersSubmitted[questionIndex];

                            let choiceStyle = "bg-white border-gray-200 hover:bg-purple-50/40 text-gray-700";
                            if (isSubmitted) {
                              if (isCorrect) {
                                choiceStyle = "bg-emerald-100 border-emerald-400 text-emerald-950 font-extrabold";
                              } else if (isChosen) {
                                choiceStyle = "bg-red-100 border-red-400 text-red-950 font-extrabold";
                              } else {
                                choiceStyle = "bg-slate-100 border-gray-100 text-gray-400 opacity-60";
                              }
                            }

                            return (
                              <button
                                key={i}
                                type="button"
                                disabled={isSubmitted}
                                onClick={() => handleScienceSubmit(choice)}
                                className={`p-3 text-xs font-bold border rounded-xl transition-all ${choiceStyle} cursor-pointer text-center`}
                              >
                                {choice}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Live Instant Answer Visual Feedback */}
                    {currentFeedback && (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`p-3.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold ${
                          currentFeedback === 'correct' 
                            ? 'bg-emerald-100 border border-emerald-300 text-emerald-900' 
                            : 'bg-red-100 border border-red-300 text-red-900'
                        }`}
                      >
                        {currentFeedback === 'correct' ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 animate-bounce" />
                            <span>Outstanding Job! You earned +20 Playroom Stars! 🌟</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                            <span>Great try! Moving to the next question... 🐾</span>
                          </>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  /* SESSION CLEARANCE PANEL */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 space-y-4"
                  >
                    <div className="w-16 h-16 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto text-4xl animate-bounce">
                      🏆
                    </div>

                    <div>
                      <h4 className="font-black text-gray-950 text-md">Room Session Cleared!</h4>
                      <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                        Incredible effort answering the level {selectedClass} questions in our {activeTab === 'jumble' ? 'Jumbles' : activeTab === 'math' ? 'Math' : activeTab === 'match' ? 'Matching' : activeTab === 'spelling' ? 'Spelling' : 'Science'} puzzle!
                      </p>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 max-w-xs mx-auto p-4 rounded-2xl flex items-center justify-around">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold block uppercase leading-none">Your Score</span>
                        <span className="text-xl font-black text-indigo-900">{gameScore} Pts</span>
                      </div>
                      <div className="border-r border-indigo-200 h-8" />
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold block uppercase leading-none">Class standard</span>
                        <span className="text-xs font-black text-slate-800">{selectedClass}</span>
                      </div>
                    </div>

                    {uploadSuccessMsg && (
                      <div className="bg-emerald-50 border border-emerald-250 rounded-xl p-2.5 max-w-xs mx-auto text-[10px] text-emerald-800 font-bold">
                        {uploadSuccessMsg}
                      </div>
                    )}

                    <div className="flex justify-center gap-2 max-w-xs mx-auto">
                      <button
                        type="button"
                        onClick={resetGame}
                        className="flex-1 bg-white border border-gray-300 hover:bg-slate-50 text-gray-700 font-extrabold text-xs py-2.5 rounded-xl transition duration-150 cursor-pointer text-center flex items-center justify-center gap-1"
                        title="Replay Quiz"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Retry</span>
                      </button>
                      <button
                        type="button"
                        onClick={submitScoreToServer}
                        disabled={isSubmittingScore}
                        className="flex-grow bg-indigo-600 hover:bg-slate-900 border border-indigo-500 text-white font-extrabold text-xs py-2.5 rounded-xl transition duration-150 scale-100 active:scale-95 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Award className="h-4 w-4 shrink-0" />
                        <span>{isSubmittingScore ? 'Saving Score...' : 'Submit to Leaderboard'}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Playroom Companions & Guidelines - Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Daily Streak campfire Card */}
          <div className="bg-gradient-to-br from-amber-600 to-red-600 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full pointer-events-none filter blur-xl" />
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs bg-white/25 border border-white/20 text-yellow-100 font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  🔥 Daily Streak Status
                </span>
                <span className="text-2xl animate-pulse">🔥</span>
              </div>
              <div className="text-center py-2">
                <span className="text-4xl font-black block tracking-tight">{streakCount}</span>
                <span className="text-[10px] uppercase font-bold text-yellow-250 block tracking-widest mt-1">Active Streak Days🏏</span>
              </div>
              <p className="text-[11px] text-orange-100 font-bold leading-relaxed text-center">
                Study logs updated today: {streakCount > 0 ? "✅ Verified" : "❌ Play games to activate!"}
              </p>
            </div>
          </div>

          {/* Gamified companions guidance block */}
          <div className="bg-white rounded-3xl p-5 border border-gray-150 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest block">🦉 Playroom Helpers Study Tips</h4>
            
            <div className="space-y-3.5">
              <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-start gap-3">
                <span className="text-2xl pt-0.5 shrink-0">🐼</span>
                <div>
                  <span className="font-extrabold text-gray-900 text-[11px] block">Pandi the Panda says:</span>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    "Solving Math Quest loops daily will make you rapid at calculating fractions!"
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-start gap-3">
                <span className="text-2xl pt-0.5 shrink-0">🦉</span>
                <div>
                  <span className="font-extrabold text-gray-900 text-[11px] block">Ollie the Owl says:</span>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    "Play Science Trivia to explore EVS cycles. The water condensation details are fun!"
                  </p>
                </div>
              </div>

              <div className="p-3 bg-pink-50/50 border border-pink-100 rounded-2xl flex items-start gap-3">
                <span className="text-2xl pt-0.5 shrink-0">🐯</span>
                <div>
                  <span className="font-extrabold text-gray-900 text-[11px] block">Toby the Tiger says:</span>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    "Spelling Whiz builds your Swar, Vyanjan, and English grammar vocabulary sheets!"
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
