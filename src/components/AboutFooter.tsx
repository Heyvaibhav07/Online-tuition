/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Milestone, 
  Mail, 
  MapPin, 
  PhoneCall, 
  Award, 
  CheckCircle,
  GraduationCap
} from 'lucide-react';

export default function AboutFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Column A: Teacher Details */}
          <div>
            <div className="flex items-center space-x-2 text-white mb-4">
              <GraduationCap className="h-6 w-6 text-indigo-500" />
              <span className="font-bold text-xl tracking-tight">Aarambh Classes</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Dedicated online academy specializing in fundamental school subjects for Class 1 to 5 students. Passionate about interactive learning, mental arithmetic, and grammar clarity.
            </p>
            <div className="flex items-center space-x-2 text-sm text-indigo-400 font-semibold mb-2">
              <Award className="h-4 w-4" />
              <span>10+ Years Primary Education Excellence</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <CheckCircle className="h-4.5 w-4.5 text-green-500" />
              <span>Certified Online Curriculum</span>
            </div>
          </div>

          {/* Column B: Classes & Program Offerings */}
          <div>
            <h3 className="font-semibold text-white tracking-wide text-md uppercase mb-4">Table of Contents</h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">🧮</span>
                <div>
                  <strong className="text-gray-200"> Mathematics</strong>
                  <p className="text-xs text-gray-400">Class 1 to 5 fractions, mental subtraction, and counting puzzles</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">🌿</span>
                <div>
                  <strong className="text-gray-200">Environmental Science (EVS)</strong>
                  <p className="text-xs text-gray-400">Plant life cycles, weather changes and eco protection</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">✍️</span>
                <div>
                  <strong className="text-gray-200">English & Hindi Grammar</strong>
                  <p className="text-xs text-gray-400">Workbook nouns, verbs, singular-plural and cartoon story lessons</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Column C: Contact Details & Office */}
          <div>
            <h3 className="font-semibold text-white tracking-wide text-md uppercase mb-4">Aarambh Classes Hub</h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Serving our students fully online with live integrated classrooms, automatic attendance lists, homework, and 24/7 TuitionAI doubt solvers.
            </p>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center space-x-3 text-gray-400">
                <PhoneCall className="h-4 w-4 text-indigo-500" />
                <span>+91 98450 12341 (Aarambh Support)</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-4 w-4 text-indigo-500" />
                <span>support@aarambhclasses.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="h-4 w-4 text-indigo-500" />
                <span>Online Class Portal Hub, India</span>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Footer Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
          <p>© 2026 Aarambh Classes. All rights reserved. Powered by Aarambh Classes.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <span className="hover:text-indigo-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-indigo-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-indigo-400 cursor-pointer text-indigo-400 font-semibold">• Sandbox Gateway Enforced</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
