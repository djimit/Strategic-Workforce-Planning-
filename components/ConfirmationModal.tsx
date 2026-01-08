
import React, { useState, useEffect } from 'react';
import { AlertCircle, X, Check, Loader2, Users, Clock, ShieldCheck } from 'lucide-react';
import { TrainingProgram } from '../types';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  program: TrainingProgram | null;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  program 
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsConfirming(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen || !program) return null;

  const handleConfirm = async () => {
    setIsConfirming(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsConfirming(false);
    setIsSuccess(true);
    // Give user a moment to see the success check before closing
    await new Promise(resolve => setTimeout(resolve, 600));
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={!isConfirming ? onClose : undefined}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg p-1 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        <div className="bg-slate-50/50 p-8">
          <div className="absolute top-6 right-6">
            {!isConfirming && !isSuccess && (
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex flex-col items-center text-center">
            <div className={`p-4 rounded-2xl mb-6 transition-colors duration-500 ${isSuccess ? 'bg-emerald-100' : 'bg-amber-100'}`}>
              {isSuccess ? (
                <Check className="w-8 h-8 text-emerald-600 animate-in zoom-in duration-300" />
              ) : (
                <AlertCircle className="w-8 h-8 text-amber-600" />
              )}
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {isSuccess ? 'Enrollment Initiated' : 'Confirm Team Enrollment'}
            </h3>
            <p className="text-slate-600 mb-8 max-w-sm">
              Review the strategic training details below before final confirmation.
            </p>

            {/* Program Briefing */}
            <div className="w-full bg-white rounded-2xl border border-slate-200 p-5 text-left mb-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Program Identity</span>
                <span className="text-[10px] font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded">Strategic Priority</span>
              </div>
              <h4 className="font-bold text-slate-800 text-lg leading-tight">{program.title}</h4>
              
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-600 font-medium">{program.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-600 font-medium">{program.teamSize} capacity</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/50">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[10px] text-emerald-700 font-bold uppercase">Pre-approved by Management</span>
              </div>
            </div>

            <div className="flex flex-col w-full gap-3">
              <button
                disabled={isConfirming || isSuccess}
                onClick={handleConfirm}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-lg transition-all transform active:scale-[0.98] shadow-lg
                  ${isSuccess 
                    ? 'bg-emerald-600 text-white shadow-emerald-100' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 hover:scale-[1.02]'
                  }
                  ${isConfirming ? 'bg-indigo-400 cursor-wait' : ''}
                `}
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Synchronizing...
                  </>
                ) : isSuccess ? (
                  <>
                    <Check className="w-5 h-5" />
                    Confirmed
                  </>
                ) : (
                  'Confirm Enrollment'
                )}
              </button>
              
              {!isConfirming && !isSuccess && (
                <button
                  onClick={onClose}
                  className="w-full bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-semibold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
