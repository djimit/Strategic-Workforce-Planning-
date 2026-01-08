
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Target, 
  GraduationCap, 
  Lightbulb, 
  ArrowRight, 
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  BookOpen,
  ClipboardList,
  UsersRound,
  Info,
  Clock,
  XCircle,
  ShieldCheck,
  Sparkles,
  Presentation,
  Ticket,
  Loader2,
  Save,
  Trash2
} from 'lucide-react';
import { HRAnalysisResult, EnrollmentData, TrainingProgram } from './types';
import { analyzeHRDocument } from './services/geminiService';
import { AnalysisInput } from './components/AnalysisInput';
import { InfoCard } from './components/InfoCard';
import { MetricsChart } from './components/MetricsChart';
import { ConfirmationModal } from './components/ConfirmationModal';

const STORAGE_KEY = 'workforcestrat_saved_session';

const App: React.FC = () => {
  const [analysis, setAnalysis] = useState<HRAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enrollments, setEnrollments] = useState<Record<string, EnrollmentData>>({});
  const [programToEnroll, setProgramToEnroll] = useState<TrainingProgram | null>(null);
  const [hasRestoredSession, setHasRestoredSession] = useState(false);

  // Persistence: Load on Mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.analysis) setAnalysis(parsed.analysis);
        if (parsed.enrollments) setEnrollments(parsed.enrollments);
        setHasRestoredSession(true);
      } catch (e) {
        console.error("Failed to restore session:", e);
      }
    }
  }, []);

  // Persistence: Auto-save on State Change
  useEffect(() => {
    if (analysis) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ analysis, enrollments }));
    }
  }, [analysis, enrollments]);

  const handleAnalyze = async (text: string) => {
    setIsLoading(true);
    setError(null);
    setHasRestoredSession(false);
    try {
      const result = await analyzeHRDocument(text);
      setAnalysis(result);
      setEnrollments({}); // Clear old enrollments on fresh analysis
    } catch (err) {
      console.error(err);
      setError('Failed to analyze document. Please check your content and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearSession = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAnalysis(null);
    setEnrollments({});
    setHasRestoredSession(false);
  };

  const handleEnrollConfirm = () => {
    if (!programToEnroll) return;
    
    const enrollmentId = `ENR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setEnrollments(prev => ({
      ...prev,
      [programToEnroll.title]: {
        id: enrollmentId,
        status: 'Processing',
        timestamp: new Date().toLocaleString()
      }
    }));

    setTimeout(() => {
      setEnrollments(prev => ({
        ...prev,
        [programToEnroll.title]: {
          ...prev[programToEnroll.title],
          status: 'Confirmed'
        }
      }));
    }, 2000);
    
    setProgramToEnroll(null);
  };

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'critical': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'moderate': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-rose-600';
      case 'medium': return 'text-amber-600';
      default: return 'text-emerald-600';
    }
  };

  const getApprovalStatusStyles = (status: string) => {
    switch (status) {
      case 'Approved':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-700',
          border: 'border-rose-200',
          icon: <XCircle className="w-4 h-4 text-rose-600" />
        };
      default:
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          icon: <Clock className="w-4 h-4 text-amber-600" />
        };
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Layers className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">WorkforceStrat AI</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
            {analysis && (
              <div className="flex items-center gap-2 mr-4 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 animate-in fade-in">
                <Save className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-tight">Auto-Saved</span>
              </div>
            )}
            <span className="hidden sm:inline-block px-3 py-1 bg-slate-100 rounded-full">Enterprise Edition</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 mt-12">
        <header className="text-center mb-12 relative">
          {analysis && (
            <button 
              onClick={clearSession}
              className="absolute top-0 right-0 flex items-center gap-2 text-rose-500 hover:text-rose-700 text-sm font-semibold p-2 bg-white rounded-xl border border-rose-100 shadow-sm transition-all hover:shadow-md"
              title="Clear current session and start fresh"
            >
              <Trash2 className="w-4 h-4" />
              Clear Session
            </button>
          )}
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Strategic Workforce Planning</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Transform raw workforce data and strategy documents into actionable visual intelligence for executive decision-making.
          </p>
          {hasRestoredSession && (
            <div className="mt-4 inline-flex items-center gap-2 text-indigo-600 font-medium text-sm bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 animate-bounce">
              <Info className="w-4 h-4" />
              Restored your last active session
            </div>
          )}
        </header>

        <AnalysisInput onAnalyze={handleAnalyze} isLoading={isLoading} />

        {error && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}

        {analysis && (
          <div className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analysis.metrics.map((metric, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                  <div>
                    <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{metric.category}</span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-3xl font-bold text-slate-900">{metric.current}{metric.unit}</span>
                      <span className="text-sm text-slate-400">vs {metric.target}{metric.unit} Target</span>
                    </div>
                  </div>
                  <div className="mt-4 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full transition-all duration-1000" 
                      style={{ width: `${Math.min((metric.current / metric.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <InfoCard title="Skill Gap Radar" icon={<Target className="w-5 h-5" />}>
                <p className="text-sm text-slate-500 mb-6">Comparison of current team capabilities against required strategic benchmarks.</p>
                <MetricsChart skillGaps={analysis.skillGaps} />
              </InfoCard>

              <InfoCard title="Top Strategic Insights" icon={<Lightbulb className="w-5 h-5" />}>
                <div className="space-y-4">
                  {analysis.strategicInsights.map((insight, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all group">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-800">{insight.title}</h4>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getImpactColor(insight.impact)}`}>
                          {insight.impact}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{insight.description}</p>
                    </div>
                  ))}
                </div>
              </InfoCard>
            </div>

            {/* Skill Matrix Detail */}
            <InfoCard title="Competency Gap Matrix" icon={<TrendingUp className="w-5 h-5" />}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-4 font-semibold text-slate-600">Domain</th>
                      <th className="py-4 font-semibold text-slate-600">Gap Score</th>
                      <th className="py-4 font-semibold text-slate-600">Priority</th>
                      <th className="py-4 font-semibold text-slate-600 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.skillGaps.map((gap, idx) => (
                      <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-4">
                          <span className="font-medium text-slate-900">{gap.skill}</span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-indigo-600">-{gap.requiredProficiency - gap.currentProficiency}%</span>
                            <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="bg-indigo-400 h-full" 
                                style={{ width: `${gap.requiredProficiency - gap.currentProficiency}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`text-sm font-semibold ${getPriorityColor(gap.priority)}`}>
                            {gap.priority}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-1">
                            {[1, 2, 3].map(i => (
                              <div 
                                key={i} 
                                className={`w-2 h-2 rounded-full ${i <= (gap.priority === 'High' ? 3 : gap.priority === 'Medium' ? 2 : 1) ? 'bg-indigo-600' : 'bg-slate-200'}`}
                              />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>

            {/* Training Roadmap */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <GradientCapIcon className="text-emerald-600 w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Training & Development Roadmap</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {analysis.trainingRoadmap.map((program, idx) => {
                  const statusStyles = getApprovalStatusStyles(program.managerApprovalStatus);
                  const enrollment = enrollments[program.title];
                  
                  return (
                    <div 
                      key={idx} 
                      className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative group hover:shadow-xl hover:scale-[1.01] transition-all duration-300 flex flex-col gap-8"
                    >
                      {/* Enrollment Badge Overlay */}
                      {enrollment && (
                        <div className="absolute top-0 right-12 -translate-y-1/2 bg-slate-900 text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-500">
                          <div className="bg-indigo-500 p-1.5 rounded-lg">
                            <Ticket className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Enrollment ID</p>
                            <p className="text-xs font-mono font-bold tracking-widest">{enrollment.id}</p>
                          </div>
                          <div className="h-6 w-px bg-slate-700 mx-1" />
                          <div className="flex items-center gap-1.5">
                            {enrollment.status === 'Processing' ? (
                              <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            )}
                            <span className="text-[10px] font-bold uppercase">{enrollment.status}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-indigo-50 p-2 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <Calendar className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{program.duration} Program</span>
                            </div>
                            
                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${statusStyles.bg} ${statusStyles.text} ${statusStyles.border}`}>
                              {statusStyles.icon}
                              <span className="text-[10px] font-bold uppercase tracking-tight">{program.managerApprovalStatus}</span>
                            </div>
                          </div>

                          <h3 className="text-2xl font-bold text-slate-900 mb-2">{program.title}</h3>
                          <p className="text-sm text-slate-600 mb-6 leading-relaxed">{program.objective}</p>
                          
                          <div className="space-y-4">
                            {/* Delivery Method */}
                            <div className="flex items-start gap-3">
                              <div className="mt-1 bg-violet-50 p-1.5 rounded-md">
                                <Presentation className="w-4 h-4 text-violet-600" />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-violet-600 uppercase tracking-tighter">Delivery Method</span>
                                <p className="text-sm font-medium text-slate-800">{program.deliveryMethod}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="mt-1 bg-slate-100 p-1.5 rounded-md">
                                <Users className="w-4 h-4 text-slate-600" />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Target Audience</span>
                                <p className="text-sm font-medium text-slate-800">{program.audience}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <div className="mt-1 bg-blue-50 p-1.5 rounded-md">
                                <UsersRound className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-tighter">Enrolled Team Size</span>
                                <p className="text-sm font-medium text-slate-800">{program.teamSize}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="mt-1 bg-emerald-50 p-1.5 rounded-md">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-emerald-600 uppercase tracking-tighter">Expected Outcome</span>
                                <p className="text-sm font-medium text-slate-800">{program.expectedOutcome}</p>
                              </div>
                            </div>

                            {/* Skills Covered */}
                            <div className="flex items-start gap-3">
                              <div className="mt-1 bg-indigo-50 p-1.5 rounded-md">
                                <Sparkles className="w-4 h-4 text-indigo-600" />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-indigo-600 uppercase tracking-tighter">Skills Covered</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {program.skillsCovered.map((skill, sIdx) => (
                                    <span key={sIdx} className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                          <div className="space-y-6">
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <BookOpen className="w-4 h-4 text-indigo-600" />
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Key Learning Modules</h4>
                              </div>
                              <ul className="space-y-3">
                                {program.modules.map((module, mIdx) => (
                                  <li key={mIdx} className="relative group/tooltip flex items-start gap-2 cursor-help">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                                    <span className="text-sm text-slate-700 border-b border-dotted border-slate-300 group-hover/tooltip:border-indigo-400 transition-colors">
                                      {module.name}
                                    </span>
                                    <div className="absolute z-20 invisible group-hover/tooltip:visible opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-900 text-white text-[11px] rounded-xl shadow-xl pointer-events-none">
                                      <div className="flex items-center gap-1.5 mb-1 text-indigo-300 font-bold uppercase tracking-tighter">
                                        <Info className="w-3 h-3" />
                                        Module Detail
                                      </div>
                                      {module.detail}
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <ClipboardList className="w-4 h-4 text-amber-600" />
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Prerequisites</h4>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {program.prerequisites.length > 0 ? (
                                  program.prerequisites.map((req, pIdx) => (
                                    <div key={pIdx} className="relative group/tooltip cursor-help">
                                      <span className="text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-100 px-2 py-1 rounded-md hover:bg-amber-100 transition-colors">
                                        {req.name}
                                      </span>
                                      <div className="absolute z-20 invisible group-hover/tooltip:visible opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-900 text-white text-[11px] rounded-xl shadow-xl pointer-events-none">
                                        <div className="flex items-center gap-1.5 mb-1 text-amber-300 font-bold uppercase tracking-tighter">
                                          <Info className="w-3 h-3" />
                                          Context
                                        </div>
                                        {req.detail}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-[11px] text-slate-400 italic">No specific prerequisites</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => !enrollment && setProgramToEnroll(program)}
                        disabled={program.managerApprovalStatus === 'Rejected' || (enrollment && enrollment.status === 'Processing')}
                        className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg 
                          ${program.managerApprovalStatus === 'Rejected' 
                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
                            : enrollment 
                              ? enrollment.status === 'Confirmed' 
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100' 
                                : 'bg-slate-100 text-slate-500 cursor-wait'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                          }`}
                      >
                        {program.managerApprovalStatus === 'Rejected' 
                          ? `Enrollment Locked (Rejected)` 
                          : enrollment 
                            ? enrollment.status === 'Confirmed' 
                              ? `Enrolled - Manage Team` 
                              : `Processing Enrollment...` 
                            : `Enroll Team for ${program.title}`}
                        {enrollment?.status === 'Confirmed' ? <Users className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">© 2024 WorkforceStrat AI Intelligence Hub • Enterprise Decision Support System</p>
        </div>
      </footer>

      <ConfirmationModal 
        isOpen={!!programToEnroll}
        onClose={() => setProgramToEnroll(null)}
        onConfirm={handleEnrollConfirm}
        program={programToEnroll}
      />
    </div>
  );
};

const GradientCapIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
  </svg>
);

export default App;
