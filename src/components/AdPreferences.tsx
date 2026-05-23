/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAd } from '../context/AdContext';
import { Settings, HelpCircle, ExternalLink, ShieldCheck, Heart, AlertCircle } from 'lucide-react';
import { AdConsentType } from '../types';

interface AdPreferencesProps {
  onShowToast: (msg: string) => void;
}

export const AdPreferences: React.FC<AdPreferencesProps> = ({ onShowToast }) => {
  const { consentType, setConsent } = useAd();
  const [showSelector, setShowSelector] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [tempConsent, setTempConsent] = useState<AdConsentType>(consentType);

  const handleOpenSelector = () => {
    setTempConsent(consentType);
    setShowSelector(true);
  };

  const handleSavePreference = () => {
    setConsent(tempConsent);
    setShowSelector(false);
    onShowToast('Ad preference updated.');
  };

  return (
    <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl overflow-hidden p-4 space-y-4">
      <div className="flex items-center space-x-2 pb-2 border-b border-zinc-800">
        <Settings size={16} className="text-[#c9a84c]" />
        <h3 className="font-sans font-semibold text-sm text-white">Ad Preferences</h3>
      </div>

      <div className="space-y-3">
        {/* Row 1: Current preference */}
        <div className="flex items-center justify-between text-xs py-1">
          <div className="flex flex-col">
            <span className="text-zinc-300 font-medium font-sans">Current preference</span>
            <span className="text-[11px] text-[#c9a84c] mt-0.5 capitalize font-mono">
              {consentType === 'personalised' ? 'Personalised Ads ✓' : 'Non-Personalised Ads ✓'}
            </span>
          </div>

          <button
            onClick={handleOpenSelector}
            className="bg-[#2a2a2a] hover:bg-zinc-800 text-white font-sans text-[11px] font-semibold px-3.5 py-1.5 rounded-lg border border-zinc-700 transition"
          >
            Change
          </button>
        </div>

        {/* Row 2: Why am I seeing ads? */}
        <div className="flex items-center justify-between text-xs py-1 border-t border-zinc-900">
          <div className="flex flex-col">
            <span className="text-zinc-300 font-medium font-sans">Why am I seeing ads?</span>
            <span className="text-[10px] text-zinc-500 mt-0.5">Understand our free model</span>
          </div>

          <button
            onClick={() => setShowInfo(true)}
            className="text-zinc-400 hover:text-white font-sans text-xs flex items-center space-x-1"
          >
            <span>Info</span>
            <HelpCircle size={14} />
          </button>
        </div>

        {/* Row 3: Google Ad Settings */}
        <div className="flex items-center justify-between text-xs py-1 border-t border-zinc-900">
          <div className="flex flex-col">
            <span className="text-zinc-300 font-medium font-sans">Google Ad Settings</span>
            <span className="text-[10px] text-zinc-500 mt-0.5">Configure your Google-wide ad settings</span>
          </div>

          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c9a84c] hover:text-[#b0903c] font-sans text-xs flex items-center space-x-1"
          >
            <span>Open</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* CHANGE PREFERENCE BOTTOM SHEET OVERLAY */}
      {showSelector && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center">
          <div className="w-full max-w-md bg-[#1a1a1a] border-t border-[#2a2a2a] rounded-t-3xl p-6 text-white space-y-5 animate-slide-up">
            <div className="space-y-1 text-center">
              <h4 className="text-base font-bold font-sans">Change Ad Preference</h4>
              <p className="text-[11px] text-zinc-500">Configure how Google personalization applies inside DocuMorph</p>
            </div>

            <div className="space-y-3">
              {/* Personalised Box */}
              <label 
                className={`flex items-start space-x-3.5 p-3.5 rounded-xl border cursor-pointer transition ${
                  tempConsent === 'personalised' 
                    ? 'bg-[#c9a84c]/5 border-[#c9a84c]' 
                    : 'bg-[#141414] border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <input
                  type="radio"
                  name="ad_preference_consent"
                  checked={tempConsent === 'personalised'}
                  onChange={() => setTempConsent('personalised')}
                  className="mt-0.5 text-[#c9a84c] focus:ring-[#c9a84c] h-4 w-4"
                />
                <div className="text-left">
                  <span className="block text-xs font-semibold text-white font-sans">Personalised Ads (recommended)</span>
                  <span className="block text-[10px] text-zinc-400 mt-0.5 font-light">
                    Ads matched to your interests via Google cookies and safe browser diagnostics.
                  </span>
                </div>
              </label>

              {/* Non-Personalised Box */}
              <label 
                className={`flex items-start space-x-3.5 p-3.5 rounded-xl border cursor-pointer transition ${
                  tempConsent === 'non-personalised' 
                    ? 'bg-[#c9a84c]/5 border-[#c9a84c]' 
                    : 'bg-[#141414] border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <input
                  type="radio"
                  name="ad_preference_consent"
                  checked={tempConsent === 'non-personalised'}
                  onChange={() => setTempConsent('non-personalised')}
                  className="mt-0.5 text-[#c9a84c] focus:ring-[#c9a84c] h-4 w-4"
                />
                <div className="text-left">
                  <span className="block text-xs font-semibold text-white font-sans">Non-Personalised Ads</span>
                  <span className="block text-[10px] text-zinc-400 mt-0.5 font-light">
                    Generic ads. Google will not build profiles or target your digital interests.
                  </span>
                </div>
              </label>
            </div>

            {/* Quick Note about files */}
            <div className="flex items-center space-x-2 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 text-[10px] text-zinc-400">
              <ShieldCheck size={14} className="text-emerald-400 flex-shrink-0" />
              <span>We never parse, index, or share your document contents under either mode.</span>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-1">
              <button
                onClick={handleSavePreference}
                className="flex-1 bg-[#c9a84c] hover:bg-[#b0903c] text-[#0f0f0f] py-3 rounded-lg text-xs font-bold transition font-sans"
              >
                Save Preference
              </button>
              <button
                onClick={() => setShowSelector(false)}
                className="flex-1 bg-[#2a2a2a] hover:bg-zinc-800 text-white py-3 rounded-lg text-xs font-sans transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WHY AM I SEEING ADS INFO MODAL */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 text-white text-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] flex items-center justify-center mx-auto">
              <Heart size={20} />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold font-sans">Why am I seeing ads?</h4>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans font-light">
                DocuMorph is a completely free toolkit. Running on zero cloud subscriptions means we don&apos;t require users to input credit cards or pay for simple conversions.
              </p>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans font-light">
                These safe, secure banners support continuous upgrades, storage indexes, and development costs so DocuMorph stays available to everyone.
              </p>
              <p className="text-xs text-[#c9a84c] font-medium font-sans pt-1">
                Thank you for using DocuMorph! 💛
              </p>
            </div>

            <button
              onClick={() => setShowInfo(false)}
              className="w-full bg-[#2a2a2a] hover:bg-zinc-800 py-2 rounded-lg text-xs font-semibold select-none font-sans border border-zinc-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
