
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { SkillGap } from '../types';

interface MetricsChartProps {
  skillGaps: SkillGap[];
}

export const MetricsChart: React.FC<MetricsChartProps> = ({ skillGaps }) => {
  const data = skillGaps.map(gap => ({
    subject: gap.skill,
    A: gap.currentProficiency,
    B: gap.requiredProficiency,
    fullMark: 100,
  }));

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="Current Proficiency"
            dataKey="A"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.5}
          />
          <Radar
            name="Target Proficiency"
            dataKey="B"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.3}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
