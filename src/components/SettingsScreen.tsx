/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { clearDatabaseData } from '../lib/db';
import { useAd } from '../context/AdContext';
import { AdPreferences } from './AdPreferences';
import { Shield, FileText, Trash2, Heart, ArrowLeft, ArrowUpRight, Scale, BookOpen, Fingerprint } from 'lucide-react';
import { PrivacyPolicy } from './PrivacyPolicy';
import { TermsAndConditions } from './TermsAndConditions';
import { BannerAd } from './BannerAd';

interface SettingsScreenProps {
  onShowToast: (msg: string) => void;
  onPurgeComplete: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onShowToast, onPurgeComplete }) => {
  const { setConsent } = useAd();
  const [activeLegal, setActiveLegal] = useState<'privacy' | 'terms' | 'licences' | null>(null);

  const handlePurgeAllData = async () => {
    const confirmText1 = "⚠️ CRITICAL ACTION ⚠️\n\nAre you sure you want to delete all converted PDFs from your local browser database?\n\nThis action cannot be undone.";
    const confirmText2 = "FINAL VERIFICATION:\n\nThis will permanently delete all indexed files and wipe your history from IndexedDB. Your uploaded layouts will be lost forever.\n\nType OK or proceed?";

    if (window.confirm(confirmText1)) {
      if (window.confirm(confirmText2)) {
        try {
          // Clear IndexedDB
          await clearDatabaseData();
          
          // Clear LocalStorage
          localStorage.removeItem('documorph_user_agreed_v1');
          localStorage.removeItem('documorph_ad_consent_v1');
          localStorage.removeItem('documorph_export_unlocked_until');
          
          // Clear context state
          setConsent(null);

          onShowToast('Database purged and local cache cleared.');
          onPurgeComplete(); // Force app state reload or onboarding reboot
        } catch (error) {
          console.error('Failed to purge cache:', error);
          onShowToast('Glitch during purging. Try again.');
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0f0f0f] text-white">
      
      {/* Settings Scrolling Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 max-w-md mx-auto w-full">
        
        {/* Profile Card / Version Info */}
        <div className="bg-[#161616] border border-zinc-900 rounded-2xl p-4 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 flex items-center justify-center font-bold text-lg font-sans">
            DM
          </div>
          <div>
            <h3 className="font-bold font-sans text-white text-sm">DocuMorph</h3>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Google Play Store Edition v2.0</p>
          </div>
        </div>

        {/* Ad Preferences Section (Part 6) */}
        <AdPreferences onShowToast={onShowToast} />

        {/* Legal & Policies */}
        <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl overflow-hidden p-4 space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-zinc-800">
            <Shield size={16} className="text-[#c9a84c]" />
            <h3 className="font-sans font-semibold text-sm text-white">Legal &amp; Policies</h3>
          </div>

          <div className="space-y-1">
            {/* Row: Privacy Policy */}
            <button
              onClick={() => setActiveLegal('privacy')}
              className="w-full flex items-center justify-between text-xs py-2.5 text-zinc-300 hover:text-white transition-colors border-b border-zinc-900 text-left font-sans"
            >
              <span className="flex items-center space-x-2">
                <Shield size={14} className="text-[#c9a84c]" />
                <span>Privacy Policy</span>
              </span>
              <BookOpen size={14} className="text-zinc-600" />
            </button>

            {/* Row: Terms & Conditions */}
            <button
              onClick={() => setActiveLegal('terms')}
              className="w-full flex items-center justify-between text-xs py-2.5 text-zinc-300 hover:text-white transition-colors border-b border-zinc-900 text-left font-sans"
            >
              <span className="flex items-center space-x-2">
                <Scale size={14} className="text-[#c9a84c]" />
                <span>Terms &amp; Conditions</span>
              </span>
              <FileText size={14} className="text-zinc-600" />
            </button>

            {/* Row: Open Source Licences */}
            <button
              onClick={() => setActiveLegal('licences')}
              className="w-full flex items-center justify-between text-xs py-2.5 text-zinc-300 hover:text-white transition-colors text-left font-sans"
            >
              <span className="flex items-center space-x-2">
                <Fingerprint size={14} className="text-[#c9a84c]" />
                <span>Open Source Licences</span>
              </span>
              <ArrowUpRight size={14} className="text-zinc-600" />
            </button>
          </div>
        </div>

        {/* System & Storage Cache */}
        <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl overflow-hidden p-4 space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-zinc-800">
            <Trash2 size={16} className="text-[#f43f5e]" />
            <h3 className="font-sans font-semibold text-sm text-white">Advanced &amp; Storage</h3>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] text-zinc-500 leading-normal font-sans pb-1">
              DocuMorph processes conversions locally inside sandboxed caches. You are strictly in control of your documents. Tap below to delete all indexed storage and reset app data.
            </p>

            <button
              onClick={handlePurgeAllData}
              className="w-full bg-red-950/20 border border-red-500/20 text-[#f43f5e] hover:bg-red-950/30 font-sans text-xs font-semibold py-2.5 rounded-xl transition flex items-center justify-center space-x-2"
            >
              <Trash2 size={14} />
              <span>Delete All My Data / Purge Cache</span>
            </button>
          </div>
        </div>

        {/* Disclaimer / App credit */}
        <div className="text-center py-4 space-y-1">
          <p className="text-[10px] text-zinc-600 font-sans">
            DocuMorph is fully compliant with Google Play Store Developer Guidelines.
          </p>
          <p className="text-[10px] text-zinc-600 font-sans flex items-center justify-center space-x-1">
            <span>Made with precision by DocuMorph Dev Team</span>
            <span className="text-[#c9a84c]">💛</span>
          </p>
        </div>

        {/* Small Bottom Banner ad */}
        <div className="pt-2">
          <BannerAd size="small" />
        </div>
      </div>

      {/* DETAILED OVERLAY ROUTING OF LEGAL COMPILATION */}
      {activeLegal !== null && (
        <div className="fixed inset-0 bg-[#0f0f0f] z-50 flex flex-col">
          <header className="flex items-center space-x-3 p-4 border-b border-[#1f1f1f] bg-[#0f0f0f] sticky top-0">
            <button
              onClick={() => setActiveLegal(null)}
              className="p-1 rounded-lg hover:bg-zinc-900 text-[#c9a84c] transition-colors"
              aria-label="Close"
            >
              <ArrowLeft size={20} />
            </button>
            <span className="font-sans font-semibold text-base">
              {activeLegal === 'privacy' && 'Privacy Policy'}
              {activeLegal === 'terms' && 'Terms & Conditions'}
              {activeLegal === 'licences' && 'Open Source Licences'}
            </span>
          </header>

          <div className="flex-1 overflow-y-auto">
            {activeLegal === 'privacy' && <PrivacyPolicy hideHeader />}
            {activeLegal === 'terms' && <TermsAndConditions hideHeader />}
            {activeLegal === 'licences' && (
              /* OPEN SOURCE LICENSES DISPLAY */
              <div className="p-6 space-y-5 max-w-2xl mx-auto text-zinc-300 font-sans text-sm leading-relaxed">
                <div className="bg-zinc-900/60 p-4 border border-zinc-800 rounded-2xl mb-2">
                  <Fingerprint className="text-[#c9a84c]" size={24} />
                  <h4 className="font-semibold text-white mt-2 font-sans text-sm">Credits &amp; License Disclosures</h4>
                  <p className="text-xs text-zinc-400 mt-1">DocuMorph relies on modular open source libraries to perform local parsing on user devices. We gratefully disclose these licenses:</p>
                </div>

                <div className="space-y-4 pt-1">
                  <div className="border-b border-zinc-900 pb-3">
                    <h4 className="font-bold text-white text-xs font-mono font-semibold">mammoth (MIT License)</h4>
                    <span className="text-[10px] text-zinc-500 font-mono">Word .docx document XML conversion engine.</span>
                    <pre className="text-[10px] text-zinc-500 font-mono bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 mt-1 max-h-24 overflow-y-auto leading-normal">
{`Copyright (c) 2013-2022 Michael Angell
Permission is hereby granted, free of charge, to any person obtaining a copy...`}
                    </pre>
                  </div>

                  <div className="border-b border-zinc-900 pb-3">
                    <h4 className="font-bold text-white text-xs font-mono font-semibold">html2pdf.js (MIT License)</h4>
                    <span className="text-[10px] text-zinc-500 font-mono">Client-side HTML-to-PDF compiler.</span>
                    <pre className="text-[10px] text-zinc-500 font-mono bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 mt-1 max-h-24 overflow-y-auto leading-normal">
{`Copyright (c) 2017-2021 Erik Koopmans
Permission is hereby granted, free of charge, to any person obtaining a copy...`}
                    </pre>
                  </div>

                  <div className="border-b border-zinc-900 pb-3">
                    <h4 className="font-bold text-white text-xs font-mono font-semibold">jszip (MIT / GPLv3 License)</h4>
                    <span className="text-[10px] text-zinc-500 font-mono">JavaScript-based archive zipping algorithm.</span>
                    <pre className="text-[10px] text-zinc-500 font-mono bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 mt-1 max-h-24 overflow-y-auto leading-normal">
{`Copyright (c) 2009-2016 Stuart Knightley, David Duponchel, Franz Buchinger`}
                    </pre>
                  </div>

                  <div className="border-b border-zinc-900 pb-3">
                    <h4 className="font-bold text-white text-xs font-mono font-semibold">idb (ISC License)</h4>
                    <span className="text-[10px] text-zinc-500 font-mono">Promisified IndexedDB wrapper.</span>
                    <pre className="text-[10px] text-zinc-500 font-mono bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 mt-1 max-h-24 overflow-y-auto leading-normal">
{`Copyright 2016 Jake Archibald
Permission to use, copy, modify, and/or distribute this software...`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-xs font-mono font-semibold">lucide-react (ISC License)</h4>
                    <span className="text-[10px] text-zinc-500 font-mono">Precision vector visual icon library.</span>
                    <pre className="text-[10px] text-zinc-500 font-mono bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 mt-1 max-h-24 overflow-y-auto leading-normal">
{`Copyright (c) 2023 Lucide Contributors`}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
