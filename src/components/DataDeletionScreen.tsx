/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { clearDatabaseData } from '../lib/db';
import { Trash2, ShieldCheck, Smartphone, Globe, ArrowRight, HelpCircle } from 'lucide-react';

export const DataDeletionScreen: React.FC = () => {
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInstantWipe = async () => {
    if (window.confirm('This will wipe all locally stored Word and PDF document metadata, purge IndexedDB, and reset ad configurations. Proceed with client-side deletion?')) {
      setLoading(true);
      try {
        await clearDatabaseData();
        localStorage.clear();
        setComplete(true);
      } catch (e) {
        console.error(e);
        alert('An error occurred during local data purge.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col justify-between p-6 select-text selection:bg-[#c9a84c]/20">
      
      {/* Dynamic Main Body Card */}
      <div className="max-w-md w-full mx-auto my-auto space-y-6">
        
        {/* Title */}
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 bg-red-950/20 text-[#f43f5e] border border-red-500/10 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Trash2 size={24} />
          </div>
          <h1 className="text-xl font-bold font-sans">DocuMorph Data Deletion</h1>
          <p className="text-zinc-500 text-xs font-mono">GOOGLE PLAY SAFETY ASSURANCE PANEL</p>
        </div>

        {/* Content Section */}
        <div className="bg-[#161616] border border-zinc-900 rounded-2xl p-5 space-y-4 font-sans text-sm leading-relaxed text-zinc-300">
          <h3 className="text-white font-bold text-xs font-mono uppercase tracking-wider">How DocuMorph Holds Data:</h3>
          <p className="text-xs">
            Due to our zero-server privacy-first design, DocuMorph <span className="font-semibold text-white">never uploads or registers your documents on any cloud network or database</span>. All document compilation, layout formatting, and history tracking take place strictly inside your browser sandbox (`IndexedDB`).
          </p>

          <div className="border-t border-zinc-900 pt-4 space-y-3">
            <h3 className="text-white font-bold text-xs font-mono uppercase tracking-wider">Option 1: Purge locally from this device</h3>
            <p className="text-xs text-zinc-400">
              Clicking below will clear your complete browser IndexedDB history, reset onboarding consent forms, and wipe local storage variables completely.
            </p>

            {complete ? (
              <div className="bg-emerald-950/15 border border-[#22c55e]/20 text-emerald-400 p-3 rounded-xl flex items-center space-x-2 text-xs">
                <ShieldCheck size={16} />
                <span>Wipe Completed: All local states and database records deleted.</span>
              </div>
            ) : (
              <button
                onClick={handleInstantWipe}
                disabled={loading}
                className="w-full bg-[#f43f5e]/15 hover:bg-[#f43f5e]/25 text-[#f43f5e] border border-[#f43f5e]/25 py-2.5 px-4 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1.5 focus:outline-none"
              >
                <span>{loading ? 'Wiping Cache...' : 'Clear My Local Data (Instant Wipe)'}</span>
                <ArrowRight size={12} />
              </button>
            )}
          </div>

          <div className="border-t border-zinc-900 pt-4 space-y-2.5">
            <h3 className="text-white font-bold text-xs font-mono uppercase tracking-wider">Option 2: Delete via Android system settings</h3>
            <p className="text-xs text-zinc-400">
              If you have installed DocuMorph as a Trusted Web Activity (TWA) from the Google Play Store, you can perform an absolute wipe of all local cookies, cache, and indexes through the operating system:
            </p>
            <ol className="list-decimal list-inside text-xs text-zinc-400 space-y-1 pl-1">
              <li>Open Android device <span className="text-white font-medium">Settings</span>.</li>
              <li>Navigate to <span className="text-white font-medium">Apps &amp; Notifications</span> → <span className="text-white font-medium">DocuMorph</span>.</li>
              <li>Tap <span className="text-white font-medium">Storage &amp; Cache</span>.</li>
              <li>Press <span className="text-white font-medium">Clear Storage / Clear Data</span>.</li>
            </ol>
          </div>
        </div>

        {/* Security Trust badge */}
        <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-4 flex items-start space-x-3 max-w-sm mx-auto">
          <ShieldCheck className="text-emerald-500 mt-0.5 flex-shrink-0" size={18} />
          <div className="text-left font-sans">
            <h5 className="text-xs font-bold text-white">GDPR &amp; CCPA Compliance</h5>
            <p className="text-[10px] text-zinc-500 mt-1">Since we gather, upload, and sell zero document payloads, you maintain total ownership and are immune to secondary breach risks.</p>
          </div>
        </div>
      </div>

      {/* Footer footer */}
      <div className="text-center py-4 text-[10px] text-zinc-600 font-sans mt-6 max-w-md mx-auto">
        <p>DocuMorph Compliance Operations Group | Version 2.0</p>
        <p className="mt-1">For direct inquiries, delete cached browser states or uninstall the application.</p>
      </div>
    </div>
  );
};
