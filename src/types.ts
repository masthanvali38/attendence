export interface AttendanceCalculation {
  present: number;
  total: number;
  targetPercentage: number;
  currentPercentage: number;
  isValid: boolean;
  errorMessage?: string;
  isSafe: boolean;
  canMiss: number;
  needed: number;
  projectedPercentageAfterBunk?: number;
  projectedPercentageAfterNeeded?: number;
}

export interface Subject {
  id: string;
  name: string;
  present: number;
  total: number;
  targetPercentage?: number;
}

export interface SimulationStep {
  label: string;
  action: 'attend' | 'miss';
  count: number;
  newPresent: number;
  newTotal: number;
  newPercentage: number;
  difference: number;
}
