import { AttendanceCalculation, SimulationStep, Subject } from '../types';

/**
 * Calculates attendance metrics following the student's Python algorithm.
 * 
 * Python algorithm:
 *   attendence = int((present / total) * 100)
 *   if attendence >= target:
 *       while (present / (total + can_miss + 1)) * 100 >= target:
 *           can_miss += 1
 *   else:
 *       while (present + needed) / (total + needed) * 100 < target:
 *           needed += 1
 */
export function calculateAttendance(
  present: number,
  total: number,
  targetPercentage: number = 75
): AttendanceCalculation {
  if (total <= 0) {
    return {
      present,
      total,
      targetPercentage,
      currentPercentage: 0,
      isValid: false,
      errorMessage: 'Total classes must be greater than 0',
      isSafe: false,
      canMiss: 0,
      needed: 0,
    };
  }

  if (present < 0 || total < 0) {
    return {
      present,
      total,
      targetPercentage,
      currentPercentage: 0,
      isValid: false,
      errorMessage: 'Values cannot be negative',
      isSafe: false,
      canMiss: 0,
      needed: 0,
    };
  }

  if (present > total) {
    return {
      present,
      total,
      targetPercentage,
      currentPercentage: Math.round((present / total) * 100 * 10) / 10,
      isValid: false,
      errorMessage: 'Classes attended cannot exceed total classes conducted',
      isSafe: true,
      canMiss: 0,
      needed: 0,
    };
  }

  const rawPercentage = (present / total) * 100;
  const currentPercentage = Math.round(rawPercentage * 100) / 100; // 2 decimal precision
  const isSafe = rawPercentage >= targetPercentage;

  let canMiss = 0;
  let needed = 0;

  if (isSafe) {
    // Exact loop from the user's Python code
    while (((present) / (total + canMiss + 1)) * 100 >= targetPercentage) {
      canMiss += 1;
      // Guard against potential infinite loops
      if (canMiss > 5000) break;
    }
  } else {
    // If target is 100% and student already missed a class, they can never reach 100%
    if (targetPercentage >= 100) {
      needed = Infinity;
    } else {
      // Exact loop from user's Python code
      while (((present + needed) / (total + needed)) * 100 < targetPercentage) {
        needed += 1;
        // Guard against potential runaway
        if (needed > 5000) break;
      }
    }
  }

  const projectedPercentageAfterBunk = canMiss > 0
    ? Math.round((present / (total + canMiss)) * 100 * 10) / 10
    : currentPercentage;

  const projectedPercentageAfterNeeded = needed > 0 && needed !== Infinity
    ? Math.round(((present + needed) / (total + needed)) * 100 * 10) / 10
    : currentPercentage;

  return {
    present,
    total,
    targetPercentage,
    currentPercentage,
    isValid: true,
    isSafe,
    canMiss,
    needed,
    projectedPercentageAfterBunk,
    projectedPercentageAfterNeeded,
  };
}

export function simulateScenario(
  present: number,
  total: number,
  action: 'attend' | 'miss',
  count: number
): SimulationStep {
  const newPresent = action === 'attend' ? present + count : present;
  const newTotal = total + count;
  const newPercentage = newTotal > 0 ? Math.round((newPresent / newTotal) * 100 * 10) / 10 : 0;
  const oldPercentage = total > 0 ? Math.round((present / total) * 100 * 10) / 10 : 0;
  const difference = Math.round((newPercentage - oldPercentage) * 10) / 10;

  return {
    label: action === 'attend' ? `Attend next ${count} ${count === 1 ? 'class' : 'classes'}` : `Miss next ${count} ${count === 1 ? 'class' : 'classes'}`,
    action,
    count,
    newPresent,
    newTotal,
    newPercentage,
    difference,
  };
}

export function calculateAggregate(subjects: Subject[], defaultTarget: number = 75) {
  const totalPresent = subjects.reduce((sum, s) => sum + s.present, 0);
  const totalClasses = subjects.reduce((sum, s) => sum + s.total, 0);
  return calculateAttendance(totalPresent, totalClasses, defaultTarget);
}
