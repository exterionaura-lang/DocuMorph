/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdConsentType, AdState } from '../types';

interface AdContextProps extends AdState {
  setConsent: (consent: AdConsentType) => void;
  incrementConversionCount: () => void;
  triggerInterstitial: (onClose: () => void) => void;
  activeInterstitial: { visible: boolean; onClose: () => void } | null;
  closeInterstitial: () => void;
}

const AdContext = createContext<AdContextProps | undefined>(undefined);

// Publisher ID placeholder. In production, this gets swapped with real AdSense Publisher ID
const PUBLISHER_ID = 'ca-pub-1234567890123456';

export const AdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consentType, setConsentTypeState] = useState<AdConsentType>(null);
  const [adsLoaded, setAdsLoaded] = useState(false);
  const [conversionCount, setConversionCount] = useState(0);
  const [lastInterstitialShown, setLastInterstitialShown] = useState(0);
  const [activeInterstitial, setActiveInterstitial] = useState<{ visible: boolean; onClose: () => void } | null>(null);

  const COOLDOWN_MS = 30000; // 30 seconds minimum between interstitials

  // Load consent on startup
  useEffect(() => {
    const rawConsent = localStorage.getItem('documorph_ad_consent_v1');
    if (rawConsent) {
      try {
        const parsed = JSON.parse(rawConsent);
        if (parsed && (parsed.consent === 'personalised' || parsed.consent === 'non-personalised')) {
          setConsentTypeState(parsed.consent);
          injectAdSenseScript(parsed.consent);
        }
      } catch (e) {
        console.error('Error parsing ad consent from localStorage', e);
      }
    }
  }, []);

  const injectAdSenseScript = (type: AdConsentType) => {
    if (!type) return;

    // Check if the script is already loaded
    const existingScript = document.getElementById('adsense-script');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'adsense-script';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER_ID}`;
    script.async = true;
    script.crossOrigin = 'anonymous';

    if (type === 'non-personalised') {
      script.setAttribute('data-npa', '1');
    }

    script.onload = () => {
      setAdsLoaded(true);
      console.log(`Google AdSense initialized successfully (${type} mode)`);
    };

    script.onerror = () => {
      console.warn('Google AdSense failed to load (probably blocked by user/browser)');
      setAdsLoaded(false);
    };

    document.head.appendChild(script);
  };

  const setConsent = (type: AdConsentType) => {
    if (type) {
      const consentObj = {
        consent: type,
        date: new Date().toISOString(),
      };
      localStorage.setItem('documorph_ad_consent_v1', JSON.stringify(consentObj));
    } else {
      localStorage.removeItem('documorph_ad_consent_v1');
    }
    setConsentTypeState(type);
    if (type) {
      injectAdSenseScript(type);
    }
  };

  const incrementConversionCount = () => {
    setConversionCount((prev) => prev + 1);
  };

  const triggerInterstitial = (onClose: () => void) => {
    const now = Date.now();
    const timeSinceLast = now - lastInterstitialShown;

    if (timeSinceLast >= COOLDOWN_MS) {
      console.log('Cooldown passed, displaying interstitial ad');
      setLastInterstitialShown(now);
      setActiveInterstitial({ visible: true, onClose });
    } else {
      console.log(`Interstitial cooldown active. Skip interstitial. Remaining: ${Math.max(0, COOLDOWN_MS - timeSinceLast)}ms`);
      // Cooldown in effect, call onClose immediately
      onClose();
    }
  };

  const closeInterstitial = () => {
    if (activeInterstitial) {
      activeInterstitial.onClose();
      setActiveInterstitial(null);
    }
  };

  return (
    <AdContext.Provider
      value={{
        consentType,
        adsLoaded,
        conversionCount,
        lastInterstitialShown,
        interstitialCooldown: COOLDOWN_MS,
        setConsent,
        incrementConversionCount,
        triggerInterstitial,
        activeInterstitial,
        closeInterstitial,
      }}
    >
      {children}
    </AdContext.Provider>
  );
};

export const useAd = () => {
  const context = useContext(AdContext);
  if (context === undefined) {
    throw new Error('useAd must be used within an AdProvider');
  }
  return context;
};
