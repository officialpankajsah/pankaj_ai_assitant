import React, { useState } from 'react';
import {
  FolderTree,
  FileCode,
  Copy,
  Check,
  Download,
  X,
  Smartphone,
  ChevronRight,
  Layers,
  Terminal
} from 'lucide-react';
import { ANDROID_CODEBASE, AndroidFile } from '../androidCodebaseData';

interface AndroidCodeExplorerModalProps {
  onClose: () => void;
}

export const AndroidCodeExplorerModal: React.FC<AndroidCodeExplorerModalProps> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<AndroidFile>(ANDROID_CODEBASE[3]); // MainActivity
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAllAsZipOrJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ANDROID_CODEBASE, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "PankajJi_Android_Project_Source.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const categories = ['All', 'Configuration', 'Core', 'Domain', 'Data', 'Feature', 'Widget'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredFiles = activeCategory === 'All'
    ? ANDROID_CODEBASE
    : ANDROID_CODEBASE.filter(f => f.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-5xl h-[92vh] bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-100">Pankaj Ji — Android Native Source Code Explorer</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono font-bold">
                  Kotlin + Jetpack Compose
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Production clean architecture: Clean MVVM, Hilt, Room, StateFlow, Gemini SDK, Foreground & Accessibility Services
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadAllAsZipOrJson}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold transition-all active:scale-95"
              title="Download full project files"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Codebase</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File sidebar */}
          <div className="w-full md:w-72 bg-slate-950/80 border-r border-slate-800 flex flex-col overflow-hidden">
            {/* Category tabs */}
            <div className="p-2 border-b border-slate-800/80 flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[10px] px-2 py-1 rounded font-medium transition-colors ${
                    activeCategory === cat
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* File List */}
            <div className="p-2 overflow-y-auto space-y-1 flex-1">
              {filteredFiles.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full flex items-center space-x-2 p-2 rounded-lg text-left text-xs transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30'
                        : 'text-slate-300 hover:bg-slate-900 border border-transparent'
                    }`}
                  >
                    <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                    <div className="truncate">
                      <div className="truncate">{file.name}</div>
                      <div className="text-[9px] text-slate-400 truncate">{file.path}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Architecture indicator */}
            <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 bg-slate-950 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Target: Android 10+ (API 29-35) with Material 3</span>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
            {/* File Info & Copy */}
            <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-semibold text-slate-200">{selectedFile.path}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                  {selectedFile.language}
                </span>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 px-3 py-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code text */}
            <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-200 leading-relaxed select-text bg-slate-950/90">
              <pre className="whitespace-pre">{selectedFile.content}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
