
import React, { useState } from 'react';
import { FileText, Send, Loader2, RefreshCw } from 'lucide-react';

interface AnalysisInputProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

export const AnalysisInput: React.FC<AnalysisInputProps> = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState('');

  const handleSample = () => {
    setText(`STRATEGIC WORKFORCE PLAN 2025-2030
Executive Summary:
Our organization is pivoting towards a digital-first model. This requires a significant shift in our workforce composition.
Key Priorities:
1. Increase data literacy across middle management (Currently at 45% target 85%).
2. Accelerate AI adoption in customer service operations.
3. Reduce external hiring costs by upskilling internal talent.
4. Bridge the gap in cloud architecture skills which is currently our highest technical risk.
5. Succession planning for 30% of senior leadership retiring in the next 3 years.`);
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl max-w-4xl mx-auto mb-12">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">HR Intelligence Hub</h2>
              <p className="text-slate-500">Paste your strategic document text or workforce data below.</p>
            </div>
          </div>
          <button
            onClick={handleSample}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Load Sample Strategy
          </button>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g., 'Workforce strategy report for Q4...'"
          className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all outline-none"
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => onAnalyze(text)}
            disabled={isLoading || !text.trim()}
            className="flex-[2] flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-indigo-100"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Generate Strategic Infographic
              </>
            )}
          </button>

          <button
            onClick={() => onAnalyze(text)}
            disabled={isLoading || !text.trim()}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-600' : 'text-slate-400'}`} />
            Re-analyze Document
          </button>
        </div>
      </div>
    </div>
  );
};
