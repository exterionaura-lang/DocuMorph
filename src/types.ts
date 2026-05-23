export interface ConvertedFile {
  id: string;
  name: string;
  pdfSize: number;
  convertedAt: string;
  pdfBlob: Blob;
}

export type AdConsentType = 'personalised' | 'non-personalised' | null;

export interface AdState {
  consentType: AdConsentType;
  adsLoaded: boolean;
  conversionCount: number;
  lastInterstitialShown: number;
  interstitialCooldown: number;
}

// Global window decoration for Adsense
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

