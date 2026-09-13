import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, AlertCircle, BookOpen, Layers, BarChart3, PlusCircle, MinusCircle } from 'lucide-react';
import { Subject } from '../types';
import { calculateAttendance, calculateAggregate } from '../utils/calculator';

const DEFAULT_SUBJECTS: Subject[] = [
  { id: '1', name: 'Mathematics / Calculus', present: 28, total: 32 },
  { id: '2', name: 'Data Structures & Algorithms', present: 22, total: 30 },
  { id: '3', name: 'Computer Networks', present: 24, total: 30 },
  { id: '4', name: 'Database Management Systems', present: 19, total: 28 },
];

export const SubjectManager: React.FC<{ defaultTarget: number }> = ({ defaultTarget }) => {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem('student_attendance_subjects');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SUBJECTS;
  });

  const [newSubName, setNewSubName] = useState('');
  const [newSubPresent, setNewSubPresent] = useState<number | ''>('');
  const [newSubTotal, setNewSubTotal] = useState<number | ''>('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('student_attendance_subjects', JSON.stringify(subjects));
    } catch (e) {
      console.error(e);
    }
  }, [subjects]);

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    const p = typeof newSubPresent === 'number' ? newSubPresent : 0;
    const t = typeof newSubTotal === 'number' ? newSubTotal : 0;
    if (t <= 0 || p > t) return;

    const newSub: Subject = {
      id: Date.now().toString(),
      name: newSubName.trim(),
      present: p,
      total: t,
    };
    setSubjects([...subjects, newSub]);
    setNewSubName('');
    setNewSubPresent('');
    setNewSubTotal('');
    setIsAdding(false);
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const quickUpdate = (id: string, type: 'attend' | 'miss') => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        if (type === 'attend') {
          return { ...s, present: s.present + 1, total: s.total + 1 };
        } else {
          return { ...s, total: s.total + 1 };
        }
      })
    );
  };

  const aggregate = calculateAggregate(subjects, defaultTarget);

  return (
    <div id="subject-manager-section" className="space-y-6">
      {/* Aggregate Semester Summary */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Layers className="w-4 h-4" /> Semester Aggregate Status
            </div>
            <h3 className="text-xl font-bold text-white mt-1">Overall Semester Attendance</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Across all {subjects.length} registered subjects ({aggregate.present}/{aggregate.total} classes)
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-3xl font-black tracking-tight text-white">
                {aggregate.currentPercentage}%
              </div>
              <div className="text-xs font-semibold">
                {aggregate.isSafe ? (
                  <span className="text-emerald-400 font-medium">Safe (≥{defaultTarget}%)</span>
                ) : (
                  <span className="text-rose-400 font-medium">Shortage (&lt;{defaultTarget}%)</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {aggregate.isSafe ? (
            <div className="text-emerald-300 flex items-center gap-1.5 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Maintain aggregate! You can bunk {aggregate.canMiss} total classes across subjects and stay above {defaultTarget}%.
              </span>
            </div>
          ) : (
            <div className="text-rose-300 flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                You need to attend {aggregate.needed} more consecutive classes overall to bring total back to {defaultTarget}%.
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium cursor-pointer transition-colors text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Subject
          </button>
        </div>
      </div>

      {/* Add Subject Modal / Inline Form */}
      {isAdding && (
        <form onSubmit={handleAddSubject} className="bg-white p-4 rounded-xl border border-indigo-200 shadow-sm space-y-3">
          <h4 className="text-sm font-bold text-slate-800">Add New Course / Subject</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Subject Name (e.g. Physics)"
              value={newSubName}
              onChange={(e) => setNewSubName(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="number"
              placeholder="Present Classes"
              min="0"
              value={newSubPresent}
              onChange={(e) => setNewSubPresent(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="number"
              placeholder="Total Classes"
              min="1"
              value={newSubTotal}
              onChange={(e) => setNewSubTotal(e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value) || 1))}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg cursor-pointer"
            >
              Save Subject
            </button>
          </div>
        </form>
      )}

      {/* Individual Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((sub) => {
          const calc = calculateAttendance(sub.present, sub.total, defaultTarget);
          return (
            <div
              key={sub.id}
              className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">{sub.name}</h5>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Attended {sub.present} / {sub.total} classes
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-lg font-black ${
                        calc.isSafe ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {calc.currentPercentage}%
                    </span>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      {calc.isSafe ? 'Eligible' : 'Shortage'}
                    </span>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      calc.isSafe ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, calc.currentPercentage)}%` }}
                  />
                </div>

                {/* Calculation statement */}
                <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  {calc.isSafe ? (
                    <p className="text-emerald-800 font-medium">
                      ✓ Can bunk <strong className="font-bold text-emerald-950">{calc.canMiss}</strong> {calc.canMiss === 1 ? 'class' : 'classes'} and maintain {defaultTarget}%
                    </p>
                  ) : (
                    <p className="text-rose-800 font-medium">
                      ⚠️ Need to attend <strong className="font-bold text-rose-950">{calc.needed}</strong> more {calc.needed === 1 ? 'class' : 'classes'} to reach {defaultTarget}%
                    </p>
                  )}
                </div>
              </div>

              {/* Quick daily logger: Mark today's class */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">Today:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    title="Attended today (+1 present, +1 total)"
                    onClick={() => quickUpdate(sub.id, 'attend')}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 cursor-pointer text-[11px] font-semibold"
                  >
                    + Present
                  </button>
                  <button
                    type="button"
                    title="Missed today (+0 present, +1 total)"
                    onClick={() => quickUpdate(sub.id, 'miss')}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 cursor-pointer text-[11px] font-semibold"
                  >
                    + Missed
                  </button>
                  <button
                    type="button"
                    title="Delete subject"
                    onClick={() => removeSubject(sub.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer transition-colors ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
