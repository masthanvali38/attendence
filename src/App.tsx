import React, { useState } from 'react';
import { 
  GraduationCap, 
  Calculator, 
  Layers, 
  RotateCcw, 
  Plus, 
  Minus, 
  Percent, 
  Check, 
  Share2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { calculateAttendance } from './utils/calculator';
import { ResultDisplay } from './components/ResultDisplay';
import { Simulator } from './components/Simulator';
import { SubjectManager } from './components/SubjectManager';
import { PythonScriptModal } from './components/PythonScriptModal';

export default function App() {
  const [presentInput, setPresentInput] = useState<number | string>(32);
  const [totalInput, setTotalInput] = useState<number | string>(40);
  const [targetPercentage, setTargetPercentage] = useState<number>(75);
  const [customTarget, setCustomTarget] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'single' | 'subjects'>('single');
  const [copiedLink, setCopiedLink] = useState(false);

  const websiteUrl = typeof window !== 'undefined' && window.location.href && !window.location.href.startsWith('about:')
    ? window.location.href
    : 'https://ais-pre-o3zohapv2ic5bvevu5vlkc-579834107959.asia-southeast1.run.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(websiteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const presentNum = typeof presentInput === 'number' ? presentInput : parseInt(presentInput as string) || 0;
  const totalNum = typeof totalInput === 'number' ? totalInput : parseInt(totalInput as string) || 0;

  const calculation = calculateAttendance(presentNum, totalNum, targetPercentage);

  const handlePresentChange = (val: string) => {
    if (val === '') {
      setPresentInput('');
      return;
    }
    const n = parseInt(val, 10);
    if (!isNaN(n)) {
      setPresentInput(Math.max(0, n));
    }
  };

  const handleTotalChange = (val: string) => {
    if (val === '') {
      setTotalInput('');
      return;
    }
    const n = parseInt(val, 10);
    if (!isNaN(n)) {
      setTotalInput(Math.max(0, n));
    }
  };

  const incrementPresent = (amount: number = 1) => {
    const nextP = Math.max(0, presentNum + amount);
    setPresentInput(nextP);
    if (nextP > totalNum) {
      setTotalInput(nextP);
    }
  };

  const decrementPresent = (amount: number = 1) => {
    setPresentInput(Math.max(0, presentNum - amount));
  };

  const incrementTotal = (amount: number = 1) => {
    setTotalInput(Math.max(presentNum, totalNum + amount));
  };

  const decrementTotal = (amount: number = 1) => {
    const nextT = Math.max(1, totalNum - amount);
    setTotalInput(nextT);
    if (presentNum > nextT) {
      setPresentInput(nextT);
    }
  };

  const handleQuickPreset = (p: number, t: number) => {
    setPresentInput(p);
    setTotalInput(t);
  };

  const handleApplySimulated = (newP: number, newT: number) => {
    setPresentInput(newP);
    setTotalInput(newT);
  };

  const resetCalculator = () => {
    setPresentInput(30);
    setTotalInput(40);
    setTargetPercentage(75);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 pb-16">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white sticky top-0 z-20 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                Attendance Calculator
                <span className="hidden sm:inline-block text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/70 px-2 py-0.5 rounded-full">
                  75% Rule Engine
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">Bunk planner & attendance recovery simulator</p>
            </div>
          </div>

          {/* Tab Navigation & Share Action */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60">
              <button
                type="button"
                id="tab-single-calculator"
                onClick={() => setActiveTab('single')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'single'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-blue-600" />
                <span>Calculator</span>
              </button>
              <button
                type="button"
                id="tab-subjects-tracker"
                onClick={() => setActiveTab('subjects')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'subjects'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Semester Subjects</span>
              </button>
            </div>

            <button
              type="button"
              id="copy-website-link-header-btn"
              onClick={handleCopyLink}
              title="Copy website link"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100/80 border border-blue-200/70 transition-all cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Website</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {activeTab === 'single' ? (
          <div className="space-y-6">
            {/* Top Grid: Left = Inputs, Right = Results */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Input Card (Left Column) */}
              <div id="attendance-input-form" className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <h2 className="font-bold text-slate-900 text-base">Enter Class Figures</h2>
                  </div>
                  <button
                    type="button"
                    id="reset-inputs-btn"
                    onClick={resetCalculator}
                    title="Reset to default values"
                    className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                </div>

                {/* Input 1: Present Classes */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="present-classes-input" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Present Classes (Attended)
                    </label>
                    <span className="text-xs font-semibold text-emerald-600">
                      present = {presentNum}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      id="decrement-present-btn"
                      onClick={() => decrementPresent(1)}
                      className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    <input
                      id="present-classes-input"
                      type="number"
                      min="0"
                      max={totalNum || 9999}
                      value={presentInput}
                      onChange={(e) => handlePresentChange(e.target.value)}
                      placeholder="Enter attended classes"
                      className="w-full text-center text-xl font-bold bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />

                    <button
                      type="button"
                      id="increment-present-btn"
                      onClick={() => incrementPresent(1)}
                      className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Input 2: Total Classes */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="total-classes-input" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Total Classes (Conducted)
                    </label>
                    <span className="text-xs font-semibold text-blue-600">
                      total = {totalNum}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      id="decrement-total-btn"
                      onClick={() => decrementTotal(1)}
                      className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    <input
                      id="total-classes-input"
                      type="number"
                      min="1"
                      value={totalInput}
                      onChange={(e) => handleTotalChange(e.target.value)}
                      placeholder="Enter total classes"
                      className="w-full text-center text-xl font-bold bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />

                    <button
                      type="button"
                      id="increment-total-btn"
                      onClick={() => incrementTotal(1)}
                      className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {presentNum > totalNum && (
                    <p className="text-xs text-rose-600 font-medium mt-1">
                      ⚠️ Present classes ({presentNum}) cannot be greater than total classes ({totalNum}).
                    </p>
                  )}
                </div>

                {/* Target Attendance Requirement */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Required Attendance Target
                    </label>
                    <span className="text-xs font-bold text-indigo-600">
                      {targetPercentage}%
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[75, 80, 85].map((target) => (
                      <button
                        key={target}
                        type="button"
                        id={`target-preset-${target}`}
                        onClick={() => {
                          setTargetPercentage(target);
                          setCustomTarget('');
                        }}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          targetPercentage === target && !customTarget
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                        }`}
                      >
                        {target}%
                      </button>
                    ))}
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        placeholder="Custom"
                        value={customTarget}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomTarget(val);
                          const n = parseInt(val);
                          if (n > 0 && n <= 100) {
                            setTargetPercentage(n);
                          }
                        }}
                        className={`w-full py-1.5 px-2 text-center text-xs font-bold rounded-lg border ${
                          customTarget
                            ? 'border-blue-500 ring-1 ring-blue-500 bg-white'
                            : 'border-slate-200 bg-slate-100'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Scenarios Presets */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                    Quick Sample Inputs
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleQuickPreset(32, 40)}
                      className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium cursor-pointer"
                    >
                      32 / 40 (Safe, 80%)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickPreset(18, 28)}
                      className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium cursor-pointer"
                    >
                      18 / 28 (Low, 64%)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickPreset(45, 50)}
                      className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium cursor-pointer"
                    >
                      45 / 50 (High, 90%)
                    </button>
                  </div>
                </div>

                {/* Python script dropdown/snippet */}
                <div className="pt-2 border-t border-slate-100">
                  <PythonScriptModal />
                </div>
              </div>

              {/* Result Display (Right Column) */}
              <div className="lg:col-span-7 space-y-6">
                <ResultDisplay calculation={calculation} target={targetPercentage} />

                {/* Interactive Simulator Card */}
                {calculation.isValid && (
                  <Simulator
                    present={presentNum}
                    total={totalNum}
                    target={targetPercentage}
                    onApplyScenario={handleApplySimulated}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Multi-Subject Semester View */
          <div className="space-y-6">
            <SubjectManager defaultTarget={targetPercentage} />
          </div>
        )}
      </main>

      {/* Share & Website Link Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" /> Website Link
            </span>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-800 break-all select-all font-mono">
                {websiteUrl}
              </p>
            </div>
            <p className="text-xs text-slate-500">
              Bookmark or share this link to access your attendance calculator anytime on mobile or desktop.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              id="copy-website-link-card-btn"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <a
              href={websiteUrl}
              target="_blank"
              rel="noreferrer"
              id="open-website-link-btn"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <footer className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 text-center text-xs text-slate-400">
        <p>Built for university & college students calculating the mandatory 75% attendance threshold.</p>
      </footer>
    </div>
  );
}
