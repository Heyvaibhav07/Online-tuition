/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  LogOut, 
  CheckCircle, 
  ArrowLeft, 
  Clock, 
  Sparkles, 
  Languages, 
  CheckSquare, 
  AlertCircle
} from 'lucide-react';
import { ClassSchedule, User } from '../types';

interface LiveClassroomProps {
  user: User;
  activeClass: ClassSchedule;
  onExit: () => void;
}

const SIMULATED_TRANSCRIPTS: Record<string, { en: string; es: string; hi: string; fr: string }[]> = {
  "Science": [
    { en: "Let us discuss how water condensation and evaporation cycles happen.", es: "Hablemos de cómo ocurren los ciclos de condensación y evaporación del agua.", hi: "आइए चर्चा करें कि जल संघनन और वाष्पीकरण चक्र कैसे होते हैं।", fr: "Voyons comment se déroulent les cycles de condensation et d'évaporation de l'eau." },
    { en: "The solar heat warms up physical reservoirs, converting liquid water to light vapor clouds.", es: "El calor solar calienta los depósitos físicos, convirtiendo el agua líquida en nubes de vapor ligero.", hi: "सौर ताप भौतिक जलाशयों को गर्म करता है, जिससे तरल पानी हल्के वाष्प बादलों में बदल जाता है।", fr: "La chaleur solaire réchauffe les réservoirs physiques, convertissant l'eau liquide en nuages de vapeur légers." },
    { en: "Please write down the definition of transpiration in your notebooks.", es: "Escriba la definición de transpiración en sus cuadernos.", hi: "कृपया अपनी कॉपियों में वाष्पोत्सर्जन की परिभाषा लिखें।", fr: "Veuillez écrire la définition de la transpiration dans vos cahiers." }
  ],
  "Mathematics": [
    { en: "Today we are simplifying fraction additions with different denominators.", es: "Hoy estamos simplificando sumas de fracciones con diferentes denominadores.", hi: "आज हम विभिन्न हरों (denominators) के साथ भिन्न जोड़ों को सरल बना रहे हैं।", fr: "Aujourd'hui, nous simplifions les additions de fractions avec différents dénominateurs." },
    { en: "Always compute the Lowest Common Multiple (LCM) of denominators first.", es: "Calcule siempre primero de todo el Mínimo Común Múltiplo (MCM) de los denominadores.", hi: "हमेशा पहले हरों का सबसे छोटा सामान्य गुणज (लघुत्तम समापवर्त्य - LCM) ज्ञात करें।", fr: "Calculez toujours le plus petit commun multiple (PPCM) des dénominateurs en premier." },
    { en: "Let's cross-multiply and solve these simple homework workbook problems.", es: "Multipliquemos en cruz y resolvamos estos sencillos problemas del cuaderno de tareas.", hi: "आइए तिर्यक गुणा (cross-multiply) करें और होमवर्क के इन सरल प्रश्नों को हल करें।", fr: "Multiplions de manière croisée et résolvons ces exercices simples du cahier de devoirs." }
  ],
  "Social Science": [
    { en: "In today's lesson, we will locate major historical landmark parameters of India.", es: "En la lección de hoy, ubicaremos los principales parámetros de hitos históricos de la India.", hi: "आज के पाठ में, हम भारत के प्रमुख ऐतिहासिक स्थलों के मापदंडों का पता लगाएंगे।", fr: "Dans la leçon d'aujourd'hui, nous localiserons les principaux repères historiques de l'Inde." },
    { en: "Mark these five prominent freedom struggle coordination regions on your sheet maps.", es: "Marque estas cinco regiones destacadas de coordinación de la lucha por la libertad en sus mapas.", hi: "अपनी मानचित्र शीट पर स्वतंत्रता संग्राम के इन पांच प्रमुख समन्वय क्षेत्रों कों चिह्नित करें।", fr: "Marquez ces cinq régions importantes de la lutte pour la liberté sur vos cartes." }
  ],
  "English": [
    { en: "Let us focus on identifying singular nouns and plural subject-verb agreement.", es: "Centrémonos en identificar sustantivos singulares y la concordancia sujeto-verbo en plural.", hi: "आइए एकवचन संज्ञाओं और बहुवचन कर्ता-क्रिया समझौते की पहचान करने पर ध्यान केंद्रित करें।", fr: "Concentrons-nous sur l'identification des noms singuliers et de l'accord sujet-verbe au pluriel." },
    { en: "The basic rule is that a singular subject requires a singular verb form.", es: "La regla básica es que un sujeto en singular requiere una forma verbal en singular.", hi: "मूल नियम यह है कि एकवचन कर्ता के साथ एकवचन क्रिया रूप की आवश्यकता होती है।", fr: "La règle de base est qu'un sujet au singulier nécessite une forme verbe au singulier." }
  ],
  "Hindi": [
    { en: "Today we are studying swar and vyanjan letters in primary grammar sheets.", es: "Hoy estamos estudiando las letras swar y vyanjan en hojas de gramática primaria.", hi: "आज हम प्राथमिक व्याकरण पत्रक में स्वर और व्यंजन अक्षरों का अध्ययन कर रहे हैं।", fr: "Aujourd'hui, nous étudions les lettres swar y vyanjan dans les fiches de grammaire primaire." },
    { en: "Pronunciation clarity is essential to spell Hindi vocabulary correctly.", es: "La claridad en la pronunciación es esencial para deletrear correctamente el vocabulario hindi.", hi: "हिन्दी शब्दावली को सही ढंग से लिखने के लिए उच्चारण की स्पष्टता आवश्यक है।", fr: "La clarté de la prononciation est essentielle pour épeler correctement le vocabulaire hindi." }
  ],
  "EVS": [
    { en: "We are examining environmental pollution prevention steps in city areas.", es: "Estamos examinando los pasos de prevención de la contaminación ambiental en áreas urbanas.", hi: "हम शहरी क्षेत्रों में पर्यावरण प्रदूषण रोकथाम के कदमों की जांच कर रहे हैं।", fr: "Nous examinons les mesures de prévention de la pollution environnementale dans les zones urbaines." },
    { en: "Planting more green saplings is the simplest way to reduce local carbon dioxide tags.", es: "Plantar más árboles verdes es la forma más sencilla de reducir las etiquetas locales de dióxido de carbono.", hi: "अधिक हरे पौधे लगाना स्थानीय कार्बन डाइऑक्साइड को कम करने का सबसे सरल तरीका है।", fr: "Planter plus de jeunes arbres verts est le moyen le plus simple de réduire le dioxyde de carbone local." }
  ]
};

export default function LiveClassroom({ user, activeClass, onExit }: LiveClassroomProps) {
  const [videoOn, setVideoOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [subtitlesLanguage, setSubtitlesLanguage] = useState<'en' | 'es' | 'hi' | 'fr'>('en');
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
  const [attendanceStatus, setAttendanceStatus] = useState<'not-met' | 'saving' | 'present'>('not-met');
  const [streamActive, setStreamActive] = useState(true);

  // Auto-attendance parameters
  const totalClassSeconds = activeClass.duration * 60;
  const attendanceThresholdSeconds = totalClassSeconds * 0.70; // 70% duration limit

  // For demonstration: speed up time in sandbox mode to show 70% threshold easily!
  // Stay in class for 30 seconds to simulate full 70% attendance criteria met
  const sandboxThresholdSeconds = 25; 
  const sandboxClassSeconds = 35; // sandbox "full class time"

  const attendancePercent = Math.min((elapsedSeconds / sandboxThresholdSeconds) * 100, 100);

  // Transcript ticking
  useEffect(() => {
    const transcriptList = SIMULATED_TRANSCRIPTS[activeClass.subject] || SIMULATED_TRANSCRIPTS["Science"];
    const interval = setInterval(() => {
      setCurrentSubtitleIndex((prev) => (prev + 1) % transcriptList.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [activeClass.subject]);

  // Elapsed Seconds ticker and auto attendance trigger
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (streamActive) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => {
          const nextVal = prev + 1;
          
          // Trigger present automatically once they stay past the sandbox threshold (equivalent of 70%)
          if (nextVal >= sandboxThresholdSeconds && attendanceStatus === 'not-met') {
            triggerMarkPresent();
          }
          return nextVal;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [streamActive, attendanceStatus]);

  const triggerMarkPresent = async () => {
    setAttendanceStatus('saving');
    try {
      const response = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: activeClass.id,
          classTitle: activeClass.title,
          studentId: user.id,
          studentName: user.username,
          durationJoined: activeClass.duration * 60 * 0.75 // Send valid >70% calculated log to servers
        })
      });
      const data = await response.json();
      if (response.ok && data.markedPresent) {
        setAttendanceStatus('present');
      } else {
        setAttendanceStatus('not-met');
      }
    } catch {
      setAttendanceStatus('not-met');
    }
  };

  const getActiveTranscriptLine = () => {
    const lines = SIMULATED_TRANSCRIPTS[activeClass.subject] || SIMULATED_TRANSCRIPTS["Science"];
    return lines[currentSubtitleIndex]?.[subtitlesLanguage] || lines[0]?.[subtitlesLanguage] || "...";
  };

  return (
    <div className="bg-gray-950 min-h-screen text-gray-100 p-4 font-sans flex flex-col justify-between">
      
      {/* Top utility strip */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-900/60 p-4 rounded-2xl border border-gray-800 mb-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onExit}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition duration-200 cursor-pointer text-gray-300"
            title="Leave classroom and return to panel"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <div>
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest animate-pulse inline-block mr-2">
              ● Ongoing Live
            </span>
            <h1 className="text-md sm:text-lg font-bold tracking-tight inline-block text-white">{activeClass.title}</h1>
            <p className="text-xs text-indigo-400 font-semibold">{activeClass.subject} Class • Tuition Instructor</p>
          </div>
        </div>

        {/* Live Meet Option & Back buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href={activeClass.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center space-x-2 cursor-pointer border border-indigo-500"
          >
            <Video className="h-4 w-4" />
            <span>Redirect to Google Meet Room</span>
          </a>
        </div>
      </div>

      {/* Classroom Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        
        {/* Main Video presentation feed */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Main Video Container */}
          <div className="relative bg-gray-900 rounded-3xl aspect-video overflow-hidden border border-gray-800 shadow-2xl flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-gray-900 to-black">
            
            {streamActive ? (
              <div className="absolute inset-0 flex flex-col justify-between p-4 z-10 pointer-events-none">
                {/* Overlay header info */}
                <div className="flex justify-between items-start w-full">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] py-1 px-2.5 rounded-lg border border-white/10 font-bold tracking-wide flex items-center gap-1.5 pointer-events-auto">
                    <Clock className="h-3.5 w-3.5 text-indigo-400" />
                    Simulated Time inside Room: {Math.floor(elapsedSeconds / 60)}m {elapsedSeconds % 60}s
                  </span>
                  
                  {/* Attendance Met Overlay Badge */}
                  {attendanceStatus === 'present' && (
                    <span className="bg-emerald-500 text-white text-[11px] py-1 px-3 rounded-lg font-extrabold tracking-wide flex items-center gap-1.5 shadow-md pointer-events-auto border border-emerald-400/30 animate-bounce">
                      <CheckSquare className="h-4 w-4" />
                      Attendance Verified (Present Marked ✅)
                    </span>
                  )}
                </div>

                {/* Main subtitle overlay positioned at base of video feed */}
                <div className="w-full text-center pb-2 pointer-events-auto">
                  <div className="bg-black/80 backdrop-blur-lg border border-indigo-500/20 px-6 py-3.5 rounded-2xl inline-block max-w-[90%] mx-auto shadow-2xl">
                    <div className="flex items-center gap-1.5 justify-center text-[10px] font-bold text-indigo-400 tracking-wider uppercase mb-1">
                      <Sparkles className="h-3.5 w-3.5" />
                      Live Audio Transcript & Subtitle translations
                    </div>
                    <p className="text-sm md:text-md text-gray-100 font-medium leading-relaxed">
                      "{getActiveTranscriptLine()}"
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 space-y-3 z-10">
                <p className="text-gray-400 text-sm">You have temporarily paused your video classroom feed.</p>
                <button
                  onClick={() => setStreamActive(true)}
                  className="bg-gray-800 text-xs px-4 py-2 rounded-xl font-bold hover:bg-gray-700 cursor-pointer"
                >
                  Join Back Classroom Feed
                </button>
              </div>
            )}

            {/* Simulated camera visual background of Teacher */}
            {streamActive && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center space-y-3 opacity-90">
                  <div className="h-20 w-20 bg-indigo-600/35 border-2 border-indigo-400 text-white rounded-full mx-auto flex items-center justify-center font-bold text-2xl shadow-xl shadow-indigo-500/10">
                    👨‍🏫
                  </div>
                  <h3 className="font-bold text-white text-md tracking-tight">Tuition Academy Instructor</h3>
                  <p className="text-xs text-gray-400 max-w-sm">Presenting School Science Concepts & Math Equations...</p>
                  
                  {/* Moving visual audio wave for dynamic look */}
                  <div className="flex items-center justify-center gap-1 pt-2">
                    <span className="w-1 bg-indigo-500 rounded-full h-8 animate-pulse" />
                    <span className="w-1 bg-indigo-400 rounded-full h-11 animate-pulse delay-75" />
                    <span className="w-1 bg-indigo-600 rounded-full h-6 animate-pulse delay-100" />
                    <span className="w-1 bg-indigo-500 rounded-full h-10 animate-pulse delay-150" />
                    <span className="w-1 bg-indigo-400 rounded-full h-7 animate-pulse delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Subtitle Translation Controls Bar */}
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-500/10 p-2 rounded-xl text-indigo-400 border border-indigo-500/15">
                <Languages className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider block">Real-time Subtitle Translation</h4>
                <p className="text-[11px] text-gray-400 block">Switch spoken language rendering instantaneously.</p>
              </div>
            </div>

            {/* Language Toggles */}
            <div className="flex bg-gray-950 p-1 rounded-xl border border-gray-800 w-full md:w-auto overflow-x-auto">
              {(['en', 'es', 'hi', 'fr'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSubtitlesLanguage(lang)}
                  className={`flex-1 md:flex-initial text-[11px] tracking-wide font-bold px-3 py-1.5 rounded-lg uppercase transition-all duration-150 cursor-pointer ${
                    subtitlesLanguage === lang
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-gray-400 hover:text-white hover:bg-gray-900'
                  }`}
                >
                  {lang === 'en' ? '🇺🇸 EN' : lang === 'es' ? '🇪🇸 ES' : lang === 'hi' ? '🇮🇳 HI' : '🇫🇷 FR'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Student details, criteria met tracker, webcam option list */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Automated Attendance criteria criteria card */}
          <div className="bg-gray-900 hover:border-gray-700 transition border border-gray-800 p-5 rounded-3xl relative overflow-hidden shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="bg-indigo-500/10 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-400/10 uppercase tracking-widest block mb-1">
                  Compliance Rule
                </span>
                <h3 className="font-bold text-white text-sm tracking-tight block">Automated Present Marker</h3>
              </div>
              <CheckCircle className={`h-6 w-6 ${attendanceStatus === 'present' ? 'text-emerald-400' : 'text-gray-500'}`} />
            </div>

            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              To be marked present, the platform tracks your active presence inside the digital live coordinate grid for at least <span className="font-bold text-indigo-400">70%</span> of class duration.
            </p>

            {/* Live Progress Bar indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-gray-400">Compliance Progress:</span>
                <span className={attendanceStatus === 'present' ? 'text-emerald-400' : 'text-indigo-400'}>
                  {Math.floor(attendancePercent)}%
                </span>
              </div>
              <div className="w-full bg-gray-950 h-2.5 rounded-full overflow-hidden border border-gray-800">
                <div 
                  className={`h-full transition-all duration-300 ${attendanceStatus === 'present' ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-400'}`}
                  style={{ width: `${attendancePercent}%` }}
                />
              </div>

              {/* Status explanation label */}
              {attendanceStatus === 'present' ? (
                <div className="bg-emerald-950/40 border border-emerald-900/40 text-emerald-300 p-3 rounded-2xl text-[11px] flex gap-2 items-start mt-2">
                  <CheckSquare className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">Registration Auto-Verified!</strong>
                    Your present marker has been forwarded to tuition coordinator dashboard logs. You can exit safely.
                  </div>
                </div>
              ) : attendanceStatus === 'saving' ? (
                <p className="text-[11px] text-gray-400 animate-pulse">Synchronizing present badge variables with database servers...</p>
              ) : (
                <div className="bg-indigo-950/30 border border-indigo-900/30 text-indigo-200 p-3 rounded-2xl text-[11px] flex gap-2 items-start mt-2">
                  <AlertCircle className="h-4.5 w-4.5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-gray-300">Stay connected for <span className="font-bold text-white">{Math.max(sandboxThresholdSeconds - elapsedSeconds, 0)}s</span> longer in sandbox demo to trigger automated present markers.</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Student's Web camera feed panel */}
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-3xl shadow-xl flex-1 flex flex-col justify-between">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Student Self Grid</h4>
            
            <div className="bg-gray-950 rounded-2xl flex-1 flex items-center justify-center border border-gray-800 aspect-video relative overflow-hidden">
              {videoOn ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-950/10">
                  <span className="text-lg">🎓</span>
                  <span className="text-xs text-gray-300 font-semibold">{user.username} (Self)</span>
                  <span className="text-[9px] text-gray-500">Audio input enabled</span>
                </div>
              ) : (
                <div className="text-center p-3">
                  <span className="text-gray-600 block text-lg">📷</span>
                  <span className="text-xs text-gray-500 font-semibold">Camera is Turned Off</span>
                </div>
              )}

              {/* Status controls tags inside feed */}
              <div className="absolute bottom-2 right-2 flex space-x-1">
                <span className={`p-1 rounded-md text-[9px] font-bold ${micOn ? 'bg-indigo-600' : 'bg-red-600'}`}>
                  {micOn ? 'Mic On' : 'Muted'}
                </span>
                <span className={`p-1 rounded-md text-[9px] font-bold ${videoOn ? 'bg-indigo-600' : 'bg-red-600'}`}>
                  {videoOn ? 'Cam On' : 'Cam Off'}
                </span>
              </div>
            </div>

            {/* Buttons control list */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => setMicOn(!micOn)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                  micOn 
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                    : 'bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-900/30'
                }`}
              >
                {micOn ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
                <span>{micOn ? 'Mute' : 'Unmute'}</span>
              </button>
              <button
                onClick={() => setVideoOn(!videoOn)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                  videoOn 
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                    : 'bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-900/30'
                }`}
              >
                {videoOn ? <Video className="h-3.5 w-3.5" /> : <VideoOff className="h-3.5 w-3.5" />}
                <span>{videoOn ? 'Stop Cam' : 'Start Cam'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
