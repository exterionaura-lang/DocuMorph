/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAd } from '../context/AdContext';
import { Shield, Eye, Lock, Gift, Coins, ChevronRight, Scale, Info, ArrowLeft } from 'lucide-react';
import { PrivacyPolicy } from './PrivacyPolicy';
import { TermsAndConditions } from './TermsAndConditions';

interface AppOnboardingProps {
  onComplete: () => void;
}

export const AppOnboarding: React.FC<AppOnboardingProps> = ({ onComplete }) => {
  const { setConsent } = useAd();
  const [step, setStep] = useState<1 | 2>(1);
  const [showLegal, setShowLegal] = useState<'privacy' | 'terms' | null>(null);

  const handleAgreeAndContinue = () => {
    localStorage.setItem('documorph_user_agreed_v1', 'true');
    setStep(2);
  };

  const handleSelectConsent = (type: 'personalised' | 'non-personalised') => {
    setConsent(type);
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-[#0f0f0f] z-40 flex flex-col justify-between p-6 text-white overflow-y-auto selection:bg-[#c9a84c]/30 selection:text-white">
      
      {/* Step Indicators */}
      <div className="w-full flex justify-center items-center space-x-3 mt-4">
        <span 
          className={`h-2 rounded-full transition-all duration-300 ${
            step === 1 ? 'w-6 bg-[#c9a84c]' : 'w-2 bg-[#2a2a2a]'
          }`}
        />
        <span 
          className={`h-2 rounded-full transition-all duration-300 ${
            step === 2 ? 'w-6 bg-[#c9a84c]' : 'w-2 bg-[#2a2a2a]'
          }`}
        />
      </div>

      {/* Main Card Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full py-8">
        
        {step === 1 ? (
          /* STEP 1: Welcome & Privacy Consent */
          <div className="w-full flex flex-col items-center text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#c9a84c] to-[#e4c673] flex items-center justify-center shadow-xl shadow-[#c9a84c]/20">
              <span className="text-[#0f0f0f] font-sans font-extrabold text-3xl">D</span>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold tracking-tight font-sans text-white">
                Welcome to <span className="text-[#c9a84c]">DocuMorph</span>
              </h1>
              <p className="text-zinc-400 text-xs mt-2 font-light">
                Professional browser-safe Word to PDF Converter v2.0
              </p>
            </div>

            <div className="w-full space-y-4 pt-2">
              <div className="flex items-start text-left space-x-3 bg-[#161616] p-3.5 border border-[#222] rounded-2xl">
                <Lock size={18} className="text-[#c9a84c] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Full Privacy Sandbox</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Your documents are transformed 100% locally on your phone. No cloud servers are used.
                  </p>
                </div>
              </div>

              <div className="flex items-start text-left space-x-3 bg-[#161616] p-3.5 border border-[#222] rounded-2xl">
                <Shield size={18} className="text-[#c9a84c] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Play Store Complaint</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Easy offline management, full history storage, and complete deletion safety controls.
                  </p>
                </div>
              </div>

              <div className="flex items-start text-left space-x-3 bg-[#161616] p-3.5 border border-[#222] rounded-2xl">
                <Gift size={18} className="text-[#c9a84c] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-white">100% Free Service</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    No hidden trial subscriptions or paywalls. Supported entirely by non-obtrusive ad layouts.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-zinc-500 font-sans px-2">
              By pressing &quot;I Agree &amp; Continue&quot;, you grant our locally sandboxed tool consent to parse files and store conversion histories on your device under our{' '}
              <button onClick={() => setShowLegal('privacy')} className="text-[#c9a84c] hover:underline inline focus:outline-none">
                Privacy Policy
              </button>{' '}
              and{' '}
              <button onClick={() => setShowLegal('terms')} className="text-[#c9a84c] hover:underline inline focus:outline-none">
                Terms of Use
              </button>.
            </div>

            <button
              onClick={handleAgreeAndContinue}
              className="w-full bg-[#c9a84c] hover:bg-[#b0903c] text-[#0f0f0f] py-4 rounded-xl font-sans font-semibold text-sm transition-all duration-300 flex items-center justify-center space-x-1 shadow-lg shadow-[#c9a84c]/10"
            >
              <span>I Agree &amp; Continue</span>
              <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          /* STEP 2: Ad Consent (Mandatory Disclosure) */
          <div className="w-full flex flex-col items-center space-y-5">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-[#222] flex items-center justify-center text-[#c9a84c]">
              <Coins size={24} />
            </div>

            <div className="text-center">
              <h2 className="text-lg font-bold tracking-tight font-sans text-white">
                Support DocuMorph — It&apos;s Free!
              </h2>
              <p className="text-xs text-[#c9a84c] mt-1 font-mono uppercase tracking-widest text-[10px]">
                Ad Consent Preferences
              </p>
            </div>

            <div className="bg-[#161616] border border-[#222] rounded-2xl p-4 text-xs space-y-3.5 text-zinc-300 w-full font-sans leading-relaxed">
              <p className="font-semibold text-white text-center border-b border-zinc-800/80 pb-2">
                DocuMorph is completely FREE to use.<br />
                To keep it free, we show advertisements.
              </p>

              <div>
                <h5 className="font-semibold text-white flex items-center space-x-1 text-xs">
                  <span>📢 What this means for you:</span>
                </h5>
                <ul className="list-disc list-inside pl-1 mt-1 space-y-1 text-zinc-400">
                  <li>You will see banner ads at the bottom of some screens</li>
                  <li>A skippable interstitial ad plays during conversions</li>
                  <li>Ads are served securely by Google AdSense</li>
                </ul>
              </div>

              <div>
                <h5 className="font-semibold text-white flex items-center space-x-1 text-xs">
                  <span>🎯 About Personalised Ads:</span>
                </h5>
                <p className="text-zinc-400 mt-1 pl-1">
                  Google may show ads tailored to your general interests. You can select non-personalised ads if you prefer.
                </p>
              </div>

              <div className="bg-[#0f0f0f] p-2.5 rounded-lg border border-zinc-800 text-[11px] text-zinc-400">
                ⚠️ Your document details, input files, and output contents are <span className="text-emerald-400 font-medium font-sans">NEVER shared</span> with advertisers.
              </div>
            </div>

            {/* Consent Selection Buttons (Side-by-Side as specified) */}
            <div className="w-full flex space-x-3 mt-2">
              <button
                onClick={() => handleSelectConsent('personalised')}
                className="flex-1 bg-[#c9a84c] hover:bg-[#b0903c] text-[#0f0f0f] py-3.5 px-2 rounded-xl font-sans font-bold text-xs transition-all duration-300 text-center shadow-lg shadow-[#c9a84c]/15"
              >
                ✓ Accept Personalised
              </button>

              <button
                onClick={() => handleSelectConsent('non-personalised')}
                className="flex-1 bg-transparent hover:bg-neutral-900 text-[#c9a84c] border border-[#c9a84c] py-3.5 px-2 rounded-xl font-sans font-medium text-xs transition-all duration-300 text-center"
              >
                Non-Personalised Ads
              </button>
            </div>

            {/* Small fine print links */}
            <div className="text-[10px] text-zinc-500 font-sans flex flex-wrap justify-center items-center gap-3 pt-2">
              <button onClick={() => setShowLegal('privacy')} className="hover:text-zinc-300 underline focus:outline-none">
                Privacy Policy
              </button>
              <span className="text-zinc-700">|</span>
              <button onClick={() => setShowLegal('terms')} className="hover:text-zinc-300 underline focus:outline-none">
                Terms &amp; Conditions
              </button>
              <span className="text-zinc-700">|</span>
              <a 
                href="https://adssettings.google.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-zinc-300 underline flex items-center space-x-0.5 focus:outline-none"
              >
                <span>Google Ad Settings</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Embedded Legal Modals */}
      {showLegal !== null && (
        <div className="fixed inset-0 bg-[#0f0f0f] z-50 flex flex-col">
          <header className="flex items-center space-x-3 p-4 border-b border-[#1f1f1f] bg-[#0f0f0f] sticky top-0">
            <button
              onClick={() => setShowLegal(null)}
              className="p-1 rounded-lg hover:bg-zinc-900 text-[#c9a84c] transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <span className="font-sans font-semibold text-base">
              {showLegal === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
            </span>
          </header>
          <div className="flex-1 overflow-y-auto">
            {showLegal === 'privacy' ? (
              <PrivacyPolicy hideHeader />
            ) : (
              <TermsAndConditions hideHeader />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
