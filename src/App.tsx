/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AdProvider, useAd } from './context/AdContext';
import { AppOnboarding } from './components/AppOnboarding';
import { ConversionProgress } from './components/ConversionProgress';
import { HistoryManager } from './components/HistoryManager';
import { SettingsScreen } from './components/SettingsScreen';
import { DataDeletionScreen } from './components/DataDeletionScreen';
import { InterstitialAd } from './components/InterstitialAd';
import { BannerAd } from './components/BannerAd';
import { 
  Upload, FolderOpen, Settings, AlertCircle, FileText, 
  HelpCircle, ArrowUp, CheckCircle, Flame, ShieldAlert, Sparkles 
} from 'lucide-react';

export default function App() {
  return (
    <AdProvider>
      <DocuMorphMain />
    </AdProvider>
  );
}

function DocuMorphMain() {
  const { consentType, triggerInterstitial, activeInterstitial } = useAd();
  
  // App routing/screens
  const [currentTab, setCurrentTab] = useState<0 | 1 | 2>(0); // 0 = Home/Upload, 1 = History, 2 = Settings
  const [onboarded, setOnboarded] = useState(false);
  const [checkingOnboardState, setCheckingOnboardState] = useState(true);
  
  // File Conversion States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeConversionFile, setActiveConversionFile] = useState<File | null>(null);

  // Drag-and-drop feedback
  const [isDragging, setIsDragging] = useState(false);

  // Custom premium Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check onboarding on boot
  useEffect(() => {
    const agreed = localStorage.getItem('documorph_user_agreed_v1');
    const adConsent = localStorage.getItem('documorph_ad_consent_v1');
    
    if (agreed === 'true' && adConsent) {
      setOnboarded(true);
    } else {
      setOnboarded(false);
    }
    setCheckingOnboardState(false);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Auto-expire toasts in 2.5s
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Google Play URL endpoint routing check
  if (typeof window !== 'undefined' && window.location.pathname === '/delete-data') {
    return <DataDeletionScreen />;
  }

  if (checkingOnboardState) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col justify-center items-center">
        <div className="w-8 h-8 rounded-full border-2 border-zinc-800 border-t-[#c9a84c] animate-spin" />
      </div>
    );
  }

  if (!onboarded) {
    return <AppOnboarding onComplete={() => setOnboarded(true)} />;
  }

  // File picker handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const isDocx = file.name.toLowerCase().endsWith('.docx') || 
                  file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    if (!isDocx) {
      showToast('DocuMorph supports Word .docx files only.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) { // 20MB limit
      showToast('Maximum document size is 20MB.');
      return;
    }

    setSelectedFile(file);
    showToast('File loaded. Ready to convert.');
  };

  // Drag and drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  // Trigger Conversion (Including first pre-conversion Interstitial Ad check)
  const handleRequestConversion = () => {
    if (!selectedFile) return;

    // Trigger AdSense/AdMob Interstitial prior to beginning parsing
    console.log('Pre-conversion: Requesting interstitial ad display.');
    triggerInterstitial(() => {
      // Callback: Launches conversion progression
      setActiveConversionFile(selectedFile);
    });
  };

  const handleResetConversion = () => {
    setSelectedFile(null);
    setActiveConversionFile(null);
    setCurrentTab(1); // Auto route to history list to view conversions!
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col justify-between selection:bg-[#c9a84c]/20">
      
      {/* 1. Header Navigation Area */}
      <header className="bg-[#0f0f0f] border-b border-[#1f1f1f] py-4 px-5 flex items-center justify-between sticky top-0 z-30 max-w-md w-full mx-auto">
        <div className="flex items-center space-x-2">
          {/* Main Gold Ribbon Logo */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#c9a84c] to-[#e4c673] flex items-center justify-center shadow-md shadow-[#c9a84c]/10">
            <span className="text-[#0f0f0f] font-sans font-extrabold text-base">D</span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-bold text-sm tracking-tight leading-none text-white">DocuMorph</span>
            <span className="text-[9px] text-[#52525b] font-mono tracking-widest mt-0.5 font-bold">PDF CONVERTER</span>
          </div>
        </div>

        <div className="text-[10px] text-zinc-500 font-mono flex items-center space-x-1 border border-zinc-850 px-2 py-0.5 rounded bg-zinc-900/30">
          <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full inline-block animate-pulse" />
          <span>Local Process</span>
        </div>
      </header>

      {/* 2. Primary Layout content body */}
      <main className="flex-1 w-full max-w-md mx-auto flex flex-col overflow-hidden">
        {activeConversionFile ? (
          /* CONVERSION WORK IN PROGRESS */
          <ConversionProgress 
            file={activeConversionFile} 
            onReset={handleResetConversion} 
            onShowToast={showToast}
          />
        ) : (
          /* PERSISTENT MAIN SCREENS Routing */
          <div className="flex-1 flex flex-col h-full">
            
            {/* TAB SCREEN 0: Home / Upload */}
            {currentTab === 0 && (
              <div className="flex-1 flex flex-col justify-between p-4 space-y-4">
                <div className="space-y-4 flex-1 flex flex-col justify-center">
                  
                  {/* Promo Message */}
                  <div className="text-center space-y-1.5 py-2 max-w-xs mx-auto">
                    <h2 className="text-lg font-bold font-sans tracking-tight text-white">Convert DOCX to PDF</h2>
                    <p className="text-xs text-zinc-400 font-sans font-light">
                      Professional on-device document formatter. High-fidelity parsing under 100% web privacy guarantees.
                    </p>
                  </div>

                  {/* Drag and Drop Box */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 min-h-64 ${
                      isDragging 
                        ? 'border-[#c9a84c] bg-[#c9a84c]/5 scale-[1.01]' 
                        : selectedFile 
                        ? 'border-emerald-500/40 bg-zinc-950 p-6' 
                        : 'border-[#2d2d2d] bg-zinc-950 hover:bg-[#161616]/40 cursor-pointer'
                    }`}
                  >
                    {selectedFile ? (
                      /* File Loaded details */
                      <div className="space-y-4 w-full flex flex-col items-center">
                        <div className="w-12 h-12 bg-emerald-950/20 text-emerald-400 border border-emerald-500/10 rounded-2xl flex items-center justify-center">
                          <FileText size={24} />
                        </div>

                        <div className="space-y-1 overflow-hidden w-full px-2">
                          <h4 className="text-sm font-semibold truncate text-zinc-150 font-sans" title={selectedFile.name}>
                            {selectedFile.name}
                          </h4>
                          <span className="text-[11px] text-zinc-500 font-mono uppercase block">
                            Size: {Math.round(selectedFile.size / 102.4) / 10} KB • Word Docx
                          </span>
                        </div>

                        <button
                          onClick={removeSelectedFile}
                          className="text-[#f43f5e] hover:text-[#f43f5e]/80 text-xs font-sans font-medium focus:outline-none"
                        >
                          Remove file
                        </button>
                      </div>
                    ) : (
                      /* Import Action placeholder prompt */
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 space-y-4">
                        <input
                          type="file"
                          accept=".docx"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-[#c9a84c] shadow-lg">
                          <Upload size={22} className="animate-pulse" />
                        </div>

                        <div className="space-y-1 px-4">
                          <span className="block text-sm font-bold text-zinc-250 font-sans">
                            Tap to browse files
                          </span>
                          <span className="block text-xs text-zinc-500 leading-relaxed font-sans font-light">
                            or drag and drop your standard Word .docx document here
                          </span>
                        </div>

                        <span className="inline-block text-[9px] font-mono bg-zinc-900 text-zinc-500 px-3 py-1 rounded-full uppercase tracking-wider">
                          Limit 20MB
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Main Conversion Trigger Button */}
                  {selectedFile && (
                    <button
                      onClick={handleRequestConversion}
                      className="w-full bg-[#c9a84c] hover:bg-[#b0903c] text-[#0f0f0f] py-4 rounded-2xl font-sans font-bold text-sm tracking-wide transition duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-[#c9a84c]/10"
                    >
                      <span>CONVERT TO PDF</span>
                      <ArrowUp size={16} />
                    </button>
                  )}

                </div>

                {/* Persistent Banner Ad spacer on Home */}
                <div className="pt-2">
                  <BannerAd size="small" />
                </div>
              </div>
            )}

            {/* TAB SCREEN 1: Historymanager list */}
            {currentTab === 1 && (
              <HistoryManager onShowToast={showToast} />
            )}

            {/* TAB SCREEN 2: Settings manager */}
            {currentTab === 2 && (
              <SettingsScreen 
                onShowToast={showToast} 
                onPurgeComplete={() => {
                  setOnboarded(false);
                  setCurrentTab(0);
                }} 
              />
            )}

          </div>
        )}
      </main>

      {/* 3. Global bottom-docked Tab Navigation bar (Hidden during conversion) */}
      {!activeConversionFile && (
        <nav className="bg-[#111111] border-t border-zinc-900 py-2.5 px-6 flex items-center justify-around sticky bottom-0 z-30 max-w-md w-full mx-auto shadow-2xl">
          {/* Tab 0: Upload */}
          <button
            onClick={() => setCurrentTab(0)}
            className={`flex flex-col items-center space-y-1 select-none focus:outline-none transition ${
              currentTab === 0 ? 'text-[#c9a84c]' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Upload size={18} />
            <span className="text-[10px] font-medium font-sans">Upload</span>
          </button>

          {/* Tab 1: History list */}
          <button
            onClick={() => setCurrentTab(1)}
            className={`flex flex-col items-center space-y-1 select-none focus:outline-none transition ${
              currentTab === 1 ? 'text-[#c9a84c]' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <FolderOpen size={18} />
            <span className="text-[10px] font-medium font-sans">Files</span>
          </button>

          {/* Tab 2: Settings panel */}
          <button
            onClick={() => setCurrentTab(2)}
            className={`flex flex-col items-center space-y-1 select-none focus:outline-none transition ${
              currentTab === 2 ? 'text-[#c9a84c]' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Settings size={18} />
            <span className="text-[10px] font-medium font-sans">Settings</span>
          </button>
        </nav>
      )}

      {/* Slide Premium Toast Alert Overlay */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#c9a84c] text-[#0f0f0f] py-2.5 px-4 rounded-xl text-xs font-sans font-bold flex items-center space-x-2 shadow-2xl border border-[#c9a84c]/20 max-w-xs text-center">
          <CheckCircle size={14} className="flex-shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Global overlay for active interstitial modal */}
      {activeInterstitial && <InterstitialAd />}
    </div>
  );
}
