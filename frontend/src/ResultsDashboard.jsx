import React from 'react';
import { Check, X, AlertTriangle, Lightbulb, Sparkles, User, Mail, Award, BookOpen, ExternalLink } from 'lucide-react';

export default function ResultsDashboard({ results, filename, isDark, onClear }) {
  const { matchScore, candidateName, candidateEmail, topSkills, matchedKeywords, missingKeywords, improvementSuggestions, atsTips } = results;

  // Circle properties for animated progress ring
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (matchScore / 100) * circumference;
  
  const getScoreColor = (score) => {
    if (score >= 80) return isDark ? '#34d399' : '#10b981'; // Emerald
    if (score >= 60) return isDark ? '#fbbf24' : '#f59e0b'; // Amber
    return isDark ? '#f87171' : '#ef4444'; // Red
  };

  const scoreColor = getScoreColor(matchScore);

  // Glassmorphism classes based on theme
  const glassCard = isDark
    ? 'bg-slate-900/40 border border-slate-700/50 backdrop-blur-xl shadow-xl'
    : 'bg-white/70 border border-slate-200/60 backdrop-blur-xl shadow-lg';
    
  const subtleBg = isDark ? 'bg-slate-800/50' : 'bg-slate-100/80';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-300' : 'text-slate-700';
  const textMuted = isDark ? 'text-slate-500' : 'text-slate-500';

  return (
    <div className="space-y-8 pb-8 relative">
      {/* Decorative gradient blob for the results area */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-blue-500/10 blur-[100px] pointer-events-none rounded-full"></div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 relative z-10">
         <div>
           <h2 className={`text-3xl font-bold tracking-tight flex items-center gap-3 ${textPrimary}`}>
             <Sparkles className="w-8 h-8 text-blue-500" /> Analysis Results
           </h2>
           <p className={`mt-2 ${textSecondary}`}>Comprehensive review for document <span className="font-semibold text-blue-500">{filename}</span></p>
         </div>
         <div className={`px-4 py-2 rounded-full text-sm font-medium border backdrop-blur-md ${isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
           AI Powered Screening
         </div>
      </div>

      {/* Main Profile & Score Card */}
      <div className={`${glassCard} rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10 overflow-hidden`}>
        {/* Score Ring */}
        <div className="relative w-40 h-40 flex-shrink-0 flex items-center justify-center">
          {/* Subtle glow behind the ring */}
          <div className="absolute inset-0 rounded-full blur-2xl opacity-20" style={{ backgroundColor: scoreColor }}></div>
          
          <svg className="transform -rotate-90 w-40 h-40 relative z-10">
            <circle cx="80" cy="80" r={radius} stroke={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth="10" fill="none" />
            <circle 
              cx="80" cy="80" r={radius} 
              stroke={scoreColor} 
              strokeWidth="10" fill="none" 
              strokeDasharray={circumference} 
              strokeDashoffset={strokeDashoffset} 
              strokeLinecap="round" 
              className="transition-all duration-1500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <span className="text-4xl font-extrabold tracking-tighter" style={{ color: scoreColor }}>{matchScore}<span className="text-2xl">%</span></span>
            <span className={`text-xs font-bold uppercase tracking-widest mt-1 ${textMuted}`}>Match</span>
          </div>
        </div>

        {/* Applicant Details */}
        <div className="flex-1 w-full text-center md:text-left">
          <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 ${textMuted}`}>Applicant Profile</h3>
          
          <div className="flex flex-col gap-3 mb-8">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className={`p-2 rounded-lg ${subtleBg}`}><User className="w-5 h-5 text-blue-500"/></div>
              <p className={`text-lg font-medium ${textPrimary}`}>{candidateName || 'Name not detected'}</p>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className={`p-2 rounded-lg ${subtleBg}`}><Mail className="w-5 h-5 text-blue-500"/></div>
              <p className={textSecondary}>{candidateEmail || 'Email not detected'}</p>
            </div>
          </div>
          
          <div>
            <h4 className={`text-sm font-bold flex items-center justify-center md:justify-start gap-2 mb-3 ${textPrimary}`}>
              <Award className="w-4 h-4 text-blue-500"/> Top Skills Detected
            </h4>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {topSkills && topSkills.length > 0 ? (
                topSkills.map((skill, i) => (
                  <span key={i} className={`px-4 py-1.5 rounded-full text-sm font-medium border backdrop-blur-sm transition-all hover:scale-105 ${isDark ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-sm'}`}>
                    {skill}
                  </span>
                ))
              ) : (
                <span className={`text-sm ${textMuted} italic`}>No core skills extracted.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Keywords Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className={`${glassCard} rounded-2xl p-6 sm:p-8 flex flex-col h-full border-t-4 border-t-emerald-500`}>
          <h3 className="text-emerald-500 font-semibold mb-6 flex items-center gap-3 text-lg">
            <div className={`p-2 rounded-full ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}><Check className="w-5 h-5"/></div>
            Matched Keywords
          </h3>
          <ul className="space-y-3 flex-1">
            {matchedKeywords && matchedKeywords.length > 0 ? (
              matchedKeywords.map((kw, i) => (
                <li key={i} className={`flex items-start gap-3 text-sm ${textSecondary} bg-emerald-500/5 p-3 rounded-xl`}>
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">{kw}</span>
                </li>
              ))
            ) : (
              <li className={`text-sm ${textMuted} italic p-3`}>No significant keywords matched.</li>
            )}
          </ul>
        </div>

        <div className={`${glassCard} rounded-2xl p-6 sm:p-8 flex flex-col h-full border-t-4 border-t-rose-500`}>
          <h3 className="text-rose-500 font-semibold mb-6 flex items-center gap-3 text-lg">
            <div className={`p-2 rounded-full ${isDark ? 'bg-rose-500/10' : 'bg-rose-50'}`}><X className="w-5 h-5"/></div>
            Missing Keywords
          </h3>
          <ul className="space-y-3 flex-1">
            {missingKeywords && missingKeywords.length > 0 ? (
              missingKeywords.map((kw, i) => (
                <li key={i} className={`flex items-start gap-3 text-sm ${textSecondary} bg-rose-500/5 p-3 rounded-xl`}>
                  <X className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">{kw}</span>
                </li>
              ))
            ) : (
              <li className={`text-sm ${textMuted} italic p-3`}>All required keywords are present!</li>
            )}
          </ul>
        </div>
      </div>

      {/* Improvement Suggestions */}
      {improvementSuggestions && improvementSuggestions.length > 0 && (
        <div className={`${glassCard} bg-gradient-to-br ${isDark ? 'from-amber-500/5 to-orange-600/5' : 'from-amber-50 to-orange-50'} rounded-3xl p-6 sm:p-8 relative z-10`}>
           <h3 className="text-amber-500 font-bold tracking-wide mb-6 flex items-center gap-3 text-lg">
             <div className="p-2 bg-amber-500/10 rounded-xl"><AlertTriangle className="w-6 h-6"/></div>
             Areas for Improvement
           </h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {improvementSuggestions.map((sugg, i) => (
               <div key={i} className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} border p-5 rounded-2xl flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow`}>
                 <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center text-sm font-bold shadow-inner">
                   {i + 1}
                 </div>
                 <p className={`text-sm ${textSecondary} leading-relaxed`}>{sugg}</p>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* ATS Tips */}
      {atsTips && atsTips.length > 0 && (
        <div className={`${glassCard} bg-gradient-to-br ${isDark ? 'from-blue-600/10 to-indigo-600/5 border-blue-500/20' : 'from-blue-50 to-indigo-50 border-blue-200'} rounded-3xl p-6 sm:p-8 relative z-10`}>
           <h3 className="text-blue-500 font-bold tracking-wide mb-6 flex items-center gap-3 text-lg">
             <div className="p-2 bg-blue-500/10 rounded-xl"><Lightbulb className="w-6 h-6"/></div>
             ATS Optimization Tips
           </h3>
           <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {atsTips.map((tip, i) => (
                <li key={i} className={`flex items-start gap-4 text-sm ${textSecondary} ${isDark ? 'bg-slate-900/40' : 'bg-white/60'} p-4 rounded-2xl border ${isDark ? 'border-slate-800/50' : 'border-white'} shadow-sm`}>
                  <div className="bg-blue-500/20 p-1.5 rounded-lg flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
           </ul>
        </div>
      )}

      {/* Resources Section */}
      <div className={`${glassCard} rounded-3xl p-6 sm:p-8 relative z-10`}>
         <h3 className={`font-bold tracking-wide mb-6 flex items-center gap-3 text-lg ${textPrimary}`}>
           <div className={`p-2 rounded-xl ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'}`}><BookOpen className="w-6 h-6 text-indigo-500"/></div>
           Helpful Resources
         </h3>
         <div className="flex flex-wrap gap-4">
           <a href="https://novoresume.com/career-blog/resume-formats" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${isDark ? 'bg-slate-800/60 border-slate-700 hover:border-indigo-500 hover:bg-slate-800 text-slate-300' : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-md text-slate-700'} text-sm font-medium`}>
             Resume Formatting Guide <ExternalLink className="w-4 h-4 text-indigo-500" />
           </a>
           <a href="https://www.themuse.com/advice/185-powerful-verbs-that-will-make-your-resume-awesome" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${isDark ? 'bg-slate-800/60 border-slate-700 hover:border-indigo-500 hover:bg-slate-800 text-slate-300' : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-md text-slate-700'} text-sm font-medium`}>
             Action Verbs List <ExternalLink className="w-4 h-4 text-indigo-500" />
           </a>
           <a href="https://resumeworded.com/resume-scanner" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${isDark ? 'bg-slate-800/60 border-slate-700 hover:border-indigo-500 hover:bg-slate-800 text-slate-300' : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-md text-slate-700'} text-sm font-medium`}>
             ATS Compatibility Checker <ExternalLink className="w-4 h-4 text-indigo-500" />
           </a>
         </div>
      </div>

      {/* Clear Button */}
      <div className="flex justify-center mt-12 mb-4 relative z-10">
        <button 
          onClick={onClear}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700' : 'bg-slate-800 text-white hover:bg-slate-700 shadow-lg'} hover:scale-105 active:scale-95`}
        >
          Clear Results & Start New
        </button>
      </div>
    </div>
  );
}