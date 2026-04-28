import React, { useState, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, UploadCloud, Sun, Moon, CheckCircle2, ChevronRight } from 'lucide-react';
import axios from 'axios';
import ResultsDashboard from './ResultsDashboard';

export default function App() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [additionalCriteria, setAdditionalCriteria] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(new Date());
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Ping the backend and middleware to wake them up from "sleep mode"
    axios.get('https://resume-screener-middleware.onrender.com/').catch(() => {});
    axios.get('https://resume-screener-backend-3hta.onrender.com/').catch(() => {});
    
    return () => clearInterval(timer);
  }, []);

  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    if (selectedFile.type === 'application/pdf') {
      setFileUrl(URL.createObjectURL(selectedFile));
    } else {
      setFileUrl(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  const handleAnalyze = async () => {
    if (!file || !jobDescription) return alert('Please provide a file and job description.');
    setLoading(true);
    
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);
    formData.append('additionalCriteria', additionalCriteria);

    try {
      const response = await axios.post('https://resume-screener-middleware.onrender.com/api/analyze', formData);
      setResults(response.data);
    } catch (error) {
      console.error(error);
      alert('Error analyzing resume.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setFileUrl(null);
    setJobDescription('');
    setAdditionalCriteria('');
    setResults(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formattedDate = time.toLocaleString('en-US', {
    month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  const isDark = theme === 'dark';

  // Glassmorphism classes
  const glassPanel = isDark 
    ? 'bg-slate-900/40 border border-slate-700/50 backdrop-blur-xl shadow-2xl'
    : 'bg-white/60 border border-slate-200/50 backdrop-blur-xl shadow-xl';
    
  const inputClass = isDark
    ? 'bg-slate-900/50 border border-slate-700/50 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 text-slate-100 placeholder:text-slate-500'
    : 'bg-white/70 border border-slate-200/80 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400';

  const memoizedPreview = useMemo(() => {
    if (fileUrl) {
      return <iframe src={`${fileUrl}#view=FitH`} className="w-full h-full rounded-lg" title="Resume Preview"/>;
    }
    if (file) {
      return (
        <div className={`flex flex-col items-center justify-center h-full ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
           <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4 drop-shadow-md" />
           <p className={`font-semibold text-lg ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{file.name}</p>
           <p className="text-sm mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
           <button onClick={() => setFile(null)} className="mt-6 px-4 py-2 rounded-full border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 transition-colors text-sm font-medium">Remove File</button>
        </div>
      );
    }
    return (
      <div className={`flex flex-col items-center justify-center h-full ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        <div className={`p-4 rounded-full mb-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-100/80'}`}>
          <FileText className="w-10 h-10" />
        </div>
        <p className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>No file selected</p>
        <p className="text-sm mt-1">Upload a resume to preview it</p>
      </div>
    );
  }, [file, fileUrl, isDark]);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} relative pb-20`}>
      {/* Dynamic Gradient Backgrounds */}
      {isDark ? (
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))]"></div>
      ) : (
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.1),rgba(255,255,255,0))]"></div>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl ${isDark ? 'bg-slate-950/70 border-slate-800/50' : 'bg-white/70 border-slate-200/50'} border-b px-6 py-4 transition-colors`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-400 drop-shadow-sm">
              AI Resume Screener
            </h1>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <span className={`hidden sm:block text-sm font-mono tabular-nums ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{formattedDate}</span>
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className={`p-2.5 rounded-full transition-all duration-300 ${isDark ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'}`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-8 min-h-[650px]">
          {/* Left Column */}
          <div className="w-full lg:w-5/12 flex flex-col gap-6">
            
            {/* Upload Zone */}
            <div className={`${glassPanel} rounded-2xl p-6 transition-all`}>
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-blue-500"/> Resume Upload
              </h2>
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed ${isDragActive ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' : isDark ? 'border-slate-700/50 hover:border-slate-600' : 'border-slate-300 hover:border-slate-400'} rounded-xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col justify-center items-center h-48`}
              >
                <input {...getInputProps()} />
                <div className={`p-4 rounded-full mb-4 transition-colors ${isDragActive ? 'bg-blue-500/20' : isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <UploadCloud className={`w-8 h-8 ${isDragActive ? 'text-blue-500' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
                <p className={`font-medium mb-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  {isDragActive ? 'Drop resume here' : 'Drag & drop your resume'}
                </p>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'} mb-4`}>Supports PDF and DOCX</p>
                <button className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
                  Browse Files
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className={`flex-1 flex flex-col ${glassPanel} rounded-2xl p-6 transition-all`}>
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">Job Requirements</h2>
              
              <div className="flex-1 flex flex-col mb-5">
                <label className={`text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Job Description <span className="text-rose-500">*</span></label>
                <textarea 
                  className={`w-full flex-1 rounded-xl p-4 text-sm transition-all resize-none outline-none ${inputClass}`}
                  placeholder="Paste the target job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className={`text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Additional Criteria <span className="font-normal opacity-70">(Optional)</span></label>
                <textarea 
                  className={`w-full rounded-xl p-4 text-sm transition-all resize-none outline-none h-24 ${inputClass}`}
                  placeholder="e.g. Prioritize 5+ years experience, must know React..."
                  value={additionalCriteria}
                  onChange={(e) => setAdditionalCriteria(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              onClick={handleAnalyze} 
              disabled={loading || !file || !jobDescription}
              className="group w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-semibold py-4 rounded-2xl transition-all shadow-lg hover:shadow-blue-500/25 disabled:shadow-none flex items-center justify-center gap-2 transform active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Analyzing Document...
                </div>
              ) : (
                <>Run AI Analysis <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </div>

          {/* Right Column - Document Preview */}
          <div className={`w-full lg:w-7/12 h-[500px] lg:h-auto ${glassPanel} rounded-2xl p-2 lg:p-4 flex flex-col transition-all overflow-hidden`}>
             <div className="px-4 py-3 border-b border-transparent">
               <h2 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                 <FileText className="w-4 h-4 text-blue-500"/> Document Preview
               </h2>
             </div>
             <div className={`flex-1 rounded-xl overflow-hidden ${isDark ? 'bg-black/20' : 'bg-slate-100'} m-2 border ${isDark ? 'border-slate-800/50' : 'border-slate-200'}`}>
                {memoizedPreview}
             </div>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
             <ResultsDashboard results={results} filename={file?.name} isDark={isDark} onClear={handleClear} />
          </div>
        )}
      </main>

      {/* Sticky Footer */}
      <footer className={`fixed bottom-0 w-full backdrop-blur-md ${isDark ? 'bg-slate-950/60 border-slate-800/50' : 'bg-white/60 border-slate-200/50'} border-t py-4 text-center text-sm transition-colors z-40`}>
        <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Designed <span className="text-rose-500">❤️</span> & ☕ by - <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Vishal Yadav</span>
        </p>
      </footer>
    </div>
  );
}