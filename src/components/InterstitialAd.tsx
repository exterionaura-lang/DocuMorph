/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAd } from '../context/AdContext';
import { BannerAd } from './BannerAd';

export const InterstitialAd: React.FC = () => {
  const { activeInterstitial, closeInterstitial } = useAd();
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (!activeInterstitial) return;

    // Reset countdown and skip state
    setCountdown(5);
    setCanSkip(false);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeInterstitial]);

  if (!activeInterstitial) return null;

  return (
    <div className="fixed inset-0 bg-[#0a0a0a]/98 z-50 flex flex-col justify-between items-center p-6 text-white select-none">
      
      {/* Top Bar with Logo and Timer or Skip Button */}
      <div className="w-full max-w-md flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          {/* DocuMorph Gold Ribbon Icon */}
          <div className="w-6 h-6 rounded bg-[#c9a84c] flex items-center justify-center font-bold text-[#0f0f0f] text-xs">
            D
          </div>
          <span className="font-sans font-semibold tracking-wider text-sm">DocuMorph</span>
        </div>

        {/* Skip Actions */}
        <div>
          {canSkip ? (
            <button
              onClick={closeInterstitial}
              className="bg-transparent hover:bg-[#c9a84c] text-[#c9a84c] hover:text-[#0f0f0f] border border-[#c9a84c] font-sans text-xs px-4 py-1.5 rounded-full transition-all duration-300 flex items-center space-x-1 font-medium shadow-lg hover:shadow-[#c9a84c]/20"
            >
              <span>Skip Ad</span>
              <span className="text-[10px]">▶</span>
            </button>
          ) : (
            <div className="text-xs text-[#52525b] bg-[#1a1a1a] px-3.5 py-1.5 rounded-full font-mono">
              Ad closes in <span className="text-[#c9a84c] font-bold">{countdown}</span>s
            </div>
          )}
        </div>
      </div>

      {/* Center 300x250 Ad Display */}
      <div className="flex flex-col items-center justify-center flex-1 my-8 max-w-md w-full">
        <BannerAd size="medium-rect" className="w-full flex justify-center scale-105" />
        <p className="text-xs text-[#52525b] mt-4 font-sans text-center">
          Your document conversion will begin automatically once skipped.
        </p>
      </div>

      {/* Bottom Legal / Appreciation Note */}
      <div className="w-full max-w-md text-center mb-6">
        <div className="text-[10px] text-[#52525b] font-sans flex items-center justify-center space-x-2">
          <span>Secure conversion processed locally inside your browser</span>
        </div>
        <p className="text-xs text-[#c9a84c]/80 mt-2 font-sans font-light">
          Ads keep DocuMorph <span className="font-semibold text-[#c9a84c]">100% FREE</span> for everyone 💛
        </p>
      </div>
    </div>
  );
};
