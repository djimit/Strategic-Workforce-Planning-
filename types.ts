
export interface WorkforceMetric {
  category: string;
  current: number;
  target: number;
  unit: string;
}

export interface SkillGap {
  skill: string;
  currentProficiency: number;
  requiredProficiency: number;
  priority: 'High' | 'Medium' | 'Low';
}

export interface TrainingModule {
  name: string;
  detail: string;
}

export interface Prerequisite {
  name: string;
  detail: string;
}

export interface EnrollmentData {
  id: string;
  status: 'Processing' | 'Confirmed';
  timestamp: string;
}

export interface TrainingProgram {
  title: string;
  objective: string;
  duration: string;
  audience: string;
  expectedOutcome: string;
  modules: TrainingModule[];
  prerequisites: Prerequisite[];
  teamSize: string;
  managerApprovalStatus: 'Pending' | 'Approved' | 'Rejected';
  skillsCovered: string[];
  deliveryMethod: string;
  enrollment?: EnrollmentData;
}

export interface StrategicInsight {
  title: string;
  description: string;
  impact: 'Critical' | 'Moderate' | 'Low';
}

export interface HRAnalysisResult {
  metrics: WorkforceMetric[];
  skillGaps: SkillGap[];
  trainingRoadmap: TrainingProgram[];
  strategicInsights: StrategicInsight[];
}
