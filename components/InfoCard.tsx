
import React from 'react';

interface InfoCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, icon, children, className }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        {icon && <div className="text-indigo-600">{icon}</div>}
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      </div>
      {children}
    </div>
  );
};
