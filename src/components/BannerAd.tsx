/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useAd } from '../context/AdContext';

interface BannerAdProps {
  size: 'small' | 'large' | 'medium-rect';
  className?: string;
}

export const BannerAd: React.FC<BannerAdProps> = ({ size, className = '' }) => {
  const { consentType } = useAd();
  const [adFailed, setAdFailed] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // If the user has not consented to any ads yet, do not trigger/render AdSense layout
    if (!consentType) return;

    let timer: NodeJS.Timeout;
    try {
      // Small timeout to simulate ad load and trigger the visual shimmer
      timer = setTimeout(() => {
        setAdLoaded(true);
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      }, 1200);
    } catch (e) {
      console.warn('AdSense push failed', e);
      setAdFailed(true);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [consentType, size]);

  if (!consentType || adFailed) {
    return null;
  }

  // Define size bounds
  let containerStyle: React.CSSProperties = {};
  let adSlotId = 'SLOT_BANNER_SMALL';
  let adFormat = 'auto';

  if (size === 'small') {
    containerStyle = { width: '320px', height: '50px' };
    adSlotId = 'SLOT_BANNER_SMALL';
    adFormat = 'auto';
  } else if (size === 'large') {
    containerStyle = { width: '320px', height: '100px' };
    adSlotId = 'SLOT_BANNER_LARGE';
    adFormat = 'auto';
  } else if (size === 'medium-rect') {
    containerStyle = { width: '300px', height: '250px' };
    adSlotId = 'SLOT_MEDIUM_RECT';
    adFormat = 'rectangle';
  }

  return (
    <div className={`mt-4 mb-4 flex flex-col items-center justify-center w-full ${className}`} id={`banner-ad-${size}`}>
      {/* Universal 9px Label above Ad Slot */}
      <span className="text-[9px] tracking-widest text-[#52525b] uppercase font-mono mb-1">
        ADVERTISEMENT
      </span>

      <div 
        className="relative bg-[#141414] border border-[#2a2a2a] rounded-lg overflow-hidden flex items-center justify-center"
        style={containerStyle}
      >
        {/* Shimmer Placeholder/Skeleton */}
        {!adLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a1a1a] animate-pulse">
            <div className="w-12 h-2 bg-[#2a2a2a] rounded-full mb-2"></div>
            <div className="w-24 h-1.5 bg-[#2a2a2a] rounded-full"></div>
          </div>
        )}

        {/* Real AdSense tag - rendered in dark app context */}
        <div className={`w-full h-full flex items-center justify-center ${adLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '100%' }}
            data-ad-client="ca-pub-1234567890123456"
            data-ad-slot={adSlotId}
            data-ad-format={adFormat}
            data-full-width-responsive={size === 'small' ? 'true' : 'false'}
          />
        </div>
      </div>
    </div>
  );
};
