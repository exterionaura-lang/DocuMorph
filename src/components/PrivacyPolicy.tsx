/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack?: () => void;
  hideHeader?: boolean;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack, hideHeader = false }) => {
  return (
    <div className="flex flex-col h-full text-white bg-[#0f0f0f]">
      {!hideHeader && (
        <header className="flex items-center space-x-3 p-4 border-b border-[#1f1f1f] bg-[#0f0f0f] sticky top-0 z-10">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 rounded-lg hover:bg-[#1f1f1f] text-[#c9a84c] transition-colors"
              aria-label="Back"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <span className="font-sans font-semibold text-lg tracking-tight">Privacy Policy</span>
        </header>
      )}

      <div className="flex-1 overflow-y-auto p-6 space-y-6 font-sans text-sm text-zinc-300 max-w-2xl mx-auto leading-relaxed">
        <div className="flex items-center space-x-3 bg-zinc-900/40 p-4 border border-[#2a2a2a] rounded-2xl mb-2">
          <ShieldAlert className="text-[#c9a84c] flex-shrink-0" size={24} />
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Privacy Guaranteed</h4>
            <p className="text-xs text-zinc-400 mt-0.5">Your files never leave your device. All parsing and PDF creation occurs 100% locally in your browser sandbox.</p>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold text-base mb-2">1. Overview</h3>
          <p>
            DocuMorph (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) provides a browser-based, offline-first Word-to-PDF conversion service. We are committed to protecting our users&apos; privacy. This Privacy Policy details our practices concerning local files, data encryption, third-party advertising, and your rights as a Google Play Store / Trusted Web Activity customer.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold text-base mb-2">2. Local File Processing Guarantee</h3>
          <p>
            DocuMorph is designed around a &quot;zero-server&quot; architecture for high privacy and robust performance:
          </p>
          <ul className="list-disc list-inside mt-2 pl-2 space-y-1 text-zinc-400">
            <li>Any document (e.g. `.docx` files) is parsed in your local sandbox browser using client side scripts.</li>
            <li>No database or remote file storage exists to copy, index, or hold your original layouts.</li>
            <li>Generated PDFs are saved temporarily in your device&apos;s isolated IndexedDB store (`documorph_db`) solely for access history and single-user control.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold text-base mb-2">3. Locally Retained Data &amp; IndexedDB</h3>
          <p>
            The files converted inside DocuMorph are stored inside your browser&apos;s IndexedDB instance. Since this data is locked behind your device&apos;s digital signature, nobody online (including our developer team) can view, extract, or share these files.
          </p>
          <p className="mt-2 text-zinc-400">
            You can flush and delete this history instantly by navigating to <span className="text-white font-medium">Settings → Delete All My Data / Purge Cache</span>. If the application is uninstalled, your local browser sandbox and associated files are deleted permanently by the operating system.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold text-base mb-2">4. Advertising &amp; Third-Party Services</h3>
          <p>
            DocuMorph displays advertisements provided by Google AdSense and/or Google AdMob to keep the app free for all users.
          </p>
          <p className="mt-2">
            Google&apos;s advertising services may collect and use certain data to serve relevant advertisements, including:
          </p>
          <ul className="list-disc list-inside mt-2 pl-2 space-y-1 text-zinc-400">
            <li>Device identifiers (advertising ID)</li>
            <li>General location (country/region level only)</li>
            <li>App interaction data (which ad was shown, which ad was tapped)</li>
            <li>Interest-based inferences (if you consented to personalised ads)</li>
          </ul>
          <p className="mt-2">
            Google&apos;s advertising data practices are governed by Google&apos;s own Privacy Policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#c9a84c] underline">https://policies.google.com/privacy</a>
          </p>
          <p className="mt-2 text-[#c9a84c] font-medium">
            YOUR DOCUMENTS ARE NEVER SHARED WITH ADVERTISERS. Ad targeting is based strictly on general app context, never your files or generated text.
          </p>
          <p className="mt-2">
            Ad Consent &amp; Opt-Out details:
          </p>
          <ul className="list-disc list-inside mt-2 pl-2 space-y-1 text-zinc-400">
            <li>You chose your ad preference during first setup (personalised or non-personalised).</li>
            <li>You can change this at any time: Settings → Ad Preferences.</li>
            <li>To opt out of personalised ads globally: <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-[#c9a84c] underline">https://adssettings.google.com</a></li>
            <li>Android Users: Navigate to Settings → Google → Ads → Opt out of Ads Personalisation.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold text-base mb-2">5. Cryptographic Transit Security</h3>
          <p>
            While our application is client-side, any networking layer or script bundle lookup operates under Strict HTTPS (SSL/TLS). This guarantees that bad actors on public WiFi cannot intercept the application assets or insert malware injections.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold text-base mb-2">6. Compliance with Play Store Polices</h3>
          <p>
            We adhere strictly to the Google Play Store developer distribution rules. Our app maintains a dedicated, public web endpoint for user account deletion requests and offline index wiping, located on the web at: `/delete-data`.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold text-base mb-2">7. Changes to Policy</h3>
          <p>
            We may adjust our policies from time to time to accommodate engine upgrades or compliance modifications. Any updates are marked within the version control badge of this screen.
          </p>
          <p className="text-xs text-zinc-500 mt-4">
            Last Updated: May 23, 2026 | Version 2.0 (Play Store Edition)
          </p>
        </div>
      </div>
    </div>
  );
};
