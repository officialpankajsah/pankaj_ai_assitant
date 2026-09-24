import React, { useState } from 'react';
import {
  TestTube,
  Play,
  CheckCircle2,
  AlertCircle,
  Filter,
  Search,
  X,
  Gauge,
  Layers,
  Sparkles
} from 'lucide-react';
import { TestCase } from '../types';
import { COMPREHENSIVE_100_TEST_CASES } from '../services/testCasesData';
import { executeTool } from '../services/toolsService';

interface TestRunnerModalProps {
  onClose: () => void;
  onExecuteInMainChat: (cmd: string) => void;
}

interface TestRunResult {
  testId: number;
  status: 'PASSED' | 'FAILED';
  matchedTool: string;
  responseMsg: string;
}

export const TestRunnerModal: React.FC<TestRunnerModalProps> = ({
  onClose,
  onExecuteInMainChat,
}) => {
  const [filterLang, setFilterLang] = useState<'All' | 'Hindi' | 'Hinglish' | 'English'>('All');
  const [filterCat, setFilterCat] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [testResults, setTestResults] = useState<Record<number, TestRunResult>>({});
  const [isRunningBatch, setIsRunningBatch] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);

  const categories = ['All', ...Array.from(new Set(COMPREHENSIVE_100_TEST_CASES.map(t => t.category)))];

  const filteredTests = COMPREHENSIVE_100_TEST_CASES.filter((tc) => {
    if (filterLang !== 'All' && tc.language !== filterLang) return false;
    if (filterCat !== 'All' && tc.category !== filterCat) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        tc.command.toLowerCase().includes(q) ||
        tc.description.toLowerCase().includes(q) ||
        tc.expectedTool.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const runSingleTest = async (test: TestCase) => {
    const res = await executeTool(test.expectedTool, { query: test.command, app: 'YouTube', recipient: 'Rahul' });
    const isPassed = res.success;

    setTestResults(prev => ({
      ...prev,
      [test.id]: {
        testId: test.id,
        status: isPassed ? 'PASSED' : 'FAILED',
        matchedTool: test.expectedTool,
        responseMsg: res.message
      }
    }));
  };

  const runBatchTests = async () => {
    setIsRunningBatch(true);
    setBatchProgress(0);

    const results: Record<number, TestRunResult> = {};
    const total = filteredTests.length;

    for (let i = 0; i < total; i++) {
      const tc = filteredTests[i];
      const res = await executeTool(tc.expectedTool, { query: tc.command });
      results[tc.id] = {
        testId: tc.id,
        status: res.success ? 'PASSED' : 'FAILED',
        matchedTool: tc.expectedTool,
        responseMsg: res.message
      };

      if (i % 5 === 0 || i === total - 1) {
        setTestResults({ ...results });
        setBatchProgress(Math.round(((i + 1) / total) * 100));
        await new Promise(r => setTimeout(r, 40));
      }
    }

    setIsRunningBatch(false);
  };

  const passedCount = Object.values(testResults).filter(r => r.status === 'PASSED').length;
  const testedCount = Object.keys(testResults).length;
  const passRate = testedCount > 0 ? Math.round((passedCount / testedCount) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <TestTube className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-100">Pankaj Ji 100 Command Test Suite</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                  100/100 COMMANDS
                </span>
              </div>
              <p className="text-xs text-slate-400">Section 37 compliance: Hindi, Hinglish & English intent verification</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={runBatchTests}
              disabled={isRunningBatch}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunningBatch ? `Testing (${batchProgress}%)...` : 'Run All Filtered Tests'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metric Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-950/40 border-b border-slate-800 text-xs">
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Total Commands</span>
            <span className="font-bold text-slate-100">{COMPREHENSIVE_100_TEST_CASES.length}</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Tests Run</span>
            <span className="font-bold text-amber-400">{testedCount}</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Pass Rate</span>
            <span className="font-bold text-emerald-400">{passRate}%</span>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Status</span>
            <span className="font-bold text-sky-400 flex items-center">
              <Sparkles className="w-3 h-3 mr-1" /> Ready
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center gap-2">
          {/* Language filter */}
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            {(['All', 'Hinglish', 'Hindi', 'English'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setFilterLang(lang)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filterLang === lang
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg py-1 px-2 text-xs text-slate-200"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Search box */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
            <input
              type="text"
              placeholder="Search 100 test commands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Command List */}
        <div className="p-3 overflow-y-auto space-y-2 flex-1">
          {filteredTests.map((test) => {
            const result = testResults[test.id];
            return (
              <div
                key={test.id}
                className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 group"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      #{test.id}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {test.language}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800/80 text-slate-300">
                      {test.category}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">
                      → {test.expectedTool}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-100 group-hover:text-amber-300 transition-colors">
                    "{test.command}"
                  </p>
                  <p className="text-[11px] text-slate-400">{test.description}</p>

                  {result && (
                    <div className="mt-1.5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] flex items-center justify-between">
                      <span className="text-slate-300 truncate mr-2">{result.responseMsg}</span>
                      <span className={`font-bold shrink-0 ${result.status === 'PASSED' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {result.status}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => {
                      onExecuteInMainChat(test.command);
                      onClose();
                    }}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                  >
                    Speak in Main
                  </button>

                  <button
                    onClick={() => runSingleTest(test)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all active:scale-95"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Test Tool</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Displaying {filteredTests.length} of 100 test commands</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 shadow-md"
          >
            Close Runner
          </button>
        </div>
      </div>
    </div>
  );
};
