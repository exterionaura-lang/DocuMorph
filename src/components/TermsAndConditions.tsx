/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, Scale } from 'lucide-react';

interface TermsAndConditionsProps {
  onBack?: () => void;
  hideHeader?: boolean;
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onBack, hideHeader = false }) => {
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
          <span className="font-sans font-semibold text-lg tracking-tight">Terms &amp; Conditions</span>
        </header>
      )}

      <div className="flex-1 overflow-y-auto p-6 space-y-6 font-sans text-sm text-zinc-300 max-w-2xl mx-auto leading-relaxed">
        <div className="flex items-center space-x-3 bg-zinc-900/40 p-4 border border-[#2a2a2a] rounded-2xl mb-2">
          <Scale className="text-[#c9a84c] flex-shrink-0" size={24} />
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">User Contract</h4>
            <p className="text-xs text-zinc-400 mt-0.5">Please review our standard terms of use carefully. By converting files, you agree to these terms.</p>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold text-base mb-1">1. Acceptance of Terms</h3>
          <p>
            By accessing or playing inside the DocuMorph application sandbox, you acknowledge that you have read, understood, and agree to remain fully bound by this Agreement. If you disagree with any portion of these conditions, you are prohibited from importing documents or requesting script-based conversions.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold text-base mb-1">2. Local Computation and Zero Warranty</h3>
          <p>
            DocuMorph is a client-side document processing tool. Conversions are processed with best-effort web rendering libraries inside your web browser. Due to formatting differences between docx standards, we make no guarantees, warranties, or claims regarding accurate layouts, column structures, or dynamic chart reproductions in the output PDFs. All software is provided &quot;AS IS&quot; without liability of any kind.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold text-base mb-1">3. Permitted Usage / Fair Use</h3>
          <p>
            You may convert an unlimited number of personal and commercial Word `.docx` documents. We do not inspect, log, or restrict your content volume, since conversions happen on-device. However, you are strictly prohibited from reverse-engineering the script bundles, mounting automated scrapers, or modifying core runtime packages.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold text-base mb-1">4. Intellectual Property</h3>
          <p>
            We claim no ownership over the files you import or convert. All text, styles, fonts, and structures inside your documents remain your sole copyrighted material. DocuMorph, its aesthetic layout, code files, logo assets, and custom user interface styles are copyright © 2026 DocuMorph Inc.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold text-base mb-1">8. Advertisements</h3>
          <p>
            DocuMorph is provided free of charge. In consideration of free access, you agree to view advertisements displayed within the App.
          </p>
          <div className="mt-2 space-y-2 border-l-2 border-[#c9a84c] pl-3 text-zinc-400">
            <p>
              <span className="text-white font-medium">8.1</span> You agree not to use ad-blocking software, browser extensions, or any technical means to prevent advertisements from loading inside the Trusted Web Activity sandbox.
            </p>
            <p>
              <span className="text-white font-medium">8.2</span> Advertisements are served by Google AdSense / AdMob. We are not responsible for the content, accuracy, or safety of third-party ads.
            </p>
            <p>
              <span className="text-white font-medium">8.3</span> Clicking on advertisements may direct you to third-party web domains. We are not responsible for the content, cookies, tracking, or security of those sites.
            </p>
            <p>
              <span className="text-white font-medium">8.4</span> We reserve the right to modify, add, or remove advertisement placements, configurations, or networks at any time without notice.
            </p>
            <p>
              <span className="text-white font-medium">8.5</span> Premium / ad-free access may be offered as an in-app purchase in a future version of the App.
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold text-base mb-1">9. Indemnification</h3>
          <p>
            You agree to defend, indemnify, and hold harmless DocuMorph and its developers against any legal damage claims, processing losses, data glitches, or device faults resulting from your use of the application or violation of this user contract.
          </p>
        </div>

        <div>
          <p className="text-xs text-zinc-500 mt-4">
            Last Updated: May 23, 2026 | Version 2.0 (Play Store Edition)
          </p>
        </div>
      </div>
    </div>
  );
};
