/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { useAd } from '../context/AdContext';
import { ConvertedFile } from '../types';
import { saveStoredFile } from '../lib/db';
import mammoth from 'mammoth';
import html2pdf from 'html2pdf.js';
import { 
  FileText, CheckCircle2, AlertTriangle, ArrowRight, Download, Share2, 
  RotateCcw, Eye, FileCheck, RefreshCw, Smartphone, Sparkles, HelpCircle 
} from 'lucide-react';
import { BannerAd } from './BannerAd';

interface ConversionProgressProps {
  file: File;
  onReset: () => void;
  onShowToast: (msg: string) => void;
}

export const ConversionProgress: React.FC<ConversionProgressProps> = ({ file, onReset, onShowToast }) => {
  const { triggerInterstitial, incrementConversionCount } = useAd();
  
  // Phase state
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'reading' | 'parsing' | 'ad_checkpoint' | 'rendering' | 'saving' | 'success' | 'error'>('reading');
  const [errorMessage, setErrorMessage] = useState('');
  const [convertedFileResult, setConvertedFileResult] = useState<ConvertedFile | null>(null);

  // Use refs to prevent closures from holding stale state during async ad gates
  const fileHtmlRef = useRef<string>('');
  const didStartRef = useRef<boolean>(false);

  useEffect(() => {
    if (didStartRef.current) return;
    didStartRef.current = true;
    startConversionFlow();
  }, [file]);

  const startConversionFlow = async () => {
    try {
      setProgress(10);
      setPhase('reading');

      // Step 1: Read DOCX file into ArrayBuffer
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        if (!e.target || !e.target.result) {
          handleFailure('Could not parse Word document content.');
          return;
        }
        
        setProgress(30);
        setPhase('parsing');

        try {
          const arrayBuffer = e.target.result as ArrayBuffer;
          // Step 2: Use mammoth to parse word file to HTML
          const result = await mammoth.convertToHtml({ arrayBuffer });
          fileHtmlRef.current = result.value;

          setProgress(50);
          setPhase('ad_checkpoint');

          // Trigger the 50% progress Point Interstitial
          console.log('Checkpoint reached: Triggering 50% interstitial ad.');
          triggerInterstitial(() => {
            // Callback: Runs after ad is skipped or cooldown is triggered
            generatePdfFromHtml();
          });

        } catch (parserError: any) {
          console.error(parserError);
          handleFailure('DOCX parsing failed. Please check if the file is corrupted.');
        }
      };

      reader.onerror = () => {
        handleFailure('File reader failed to access Word document.');
      };

      reader.readAsArrayBuffer(file);

    } catch (e: any) {
      handleFailure(e.message || 'An unexpected glitch occurred.');
    }
  };

  const generatePdfFromHtml = async () => {
    try {
      setPhase('rendering');
      setProgress(60);

      const htmlContent = fileHtmlRef.current;
      if (!htmlContent || htmlContent.trim() === '') {
        // Fallback layout if mammoth output is completely empty
        fileHtmlRef.current = `<p style="font-family: Arial, sans-serif; text-align: center; margin-top: 100px;">Converted Document: ${file.name}</p>`;
      }

      // Create a neat print wrapper elements with professional styling to guarantee high legibility
      const printWrapper = document.createElement('div');
      printWrapper.innerHTML = fileHtmlRef.current;
      printWrapper.style.padding = '25mm 20mm';
      printWrapper.style.color = '#000000';
      printWrapper.style.backgroundColor = '#ffffff';
      printWrapper.style.fontFamily = 'Georgia, Times, "Times New Roman", serif';
      printWrapper.style.fontSize = '12pt';
      printWrapper.style.lineHeight = '1.6';

      // Style nested headings so they render elegantly in A4
      const headings = printWrapper.querySelectorAll('h1, h2, h3, h4');
      headings.forEach((h: any) => {
        h.style.fontFamily = 'Arial, sans-serif';
        h.style.color = '#111111';
        h.style.marginTop = '1.2em';
        h.style.marginBottom = '0.5em';
      });

      const paragraphs = printWrapper.querySelectorAll('p');
      paragraphs.forEach((p: any) => {
        p.style.marginBottom = '1em';
      });

      const tables = printWrapper.querySelectorAll('table');
      tables.forEach((t: any) => {
        t.style.width = '100%';
        t.style.borderCollapse = 'collapse';
        t.style.marginTop = '1em';
        t.style.marginBottom = '1em';
        const cells = t.querySelectorAll('th, td');
        cells.forEach((c: any) => {
          c.style.border = '1px solid #dddddd';
          c.style.padding = '8px';
        });
      });

      // Smooth progress interval while generating layout
      let count = 60;
      const progressTimer = setInterval(() => {
        count = Math.min(88, count + 3);
        setProgress(count);
      }, 300);

      const pdfName = file.name.replace(/\.docx$/i, '') + '.pdf';
      const opt = {
        margin:       0, // We already padded the wrapper element natively for precise layout boundaries
        filename:     pdfName,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      } as any;

      // Run generator
      const pdfBlob = await html2pdf().from(printWrapper).set(opt).outputPdf('blob');
      clearInterval(progressTimer);

      setProgress(90);
      setPhase('saving');

      // Structure ConvertedFile profile
      const newFileObj: ConvertedFile = {
        id: Date.now().toString(),
        name: file.name,
        pdfSize: pdfBlob.size,
        convertedAt: new Date().toISOString(),
        pdfBlob: pdfBlob
      };

      // Store in IndexedDB
      await saveStoredFile(newFileObj);
      
      incrementConversionCount();
      
      setProgress(100);
      setPhase('success');
      setConvertedFileResult(newFileObj);
      onShowToast('PDF conversion completed securely.');

    } catch (renderError: any) {
      console.error(renderError);
      handleFailure('PDF layout compilation failed.');
    }
  };

  const handleFailure = (msg: string) => {
    setErrorMessage(msg);
    setPhase('error');
    onShowToast('Conversion suspended due to a glitch.');
  };

  const handleDownload = () => {
    if (!convertedFileResult) return;
    const url = URL.createObjectURL(convertedFileResult.pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = convertedFileResult.name.replace(/\.docx$/i, '') + '.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('PDF download saved.');
  };

  const handleOpenPdf = () => {
    if (!convertedFileResult) return;
    const url = URL.createObjectURL(convertedFileResult.pdfBlob);
    window.open(url, '_blank');
  };

  const handleShare = async () => {
    if (!convertedFileResult) return;
    
    // Create shared File wrapper
    const sharePdf = new File([convertedFileResult.pdfBlob], convertedFileResult.name.replace(/\.docx$/i, '') + '.pdf', {
      type: 'application/pdf',
    });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [sharePdf] })) {
      try {
        await navigator.share({
          files: [sharePdf],
          title: `DocuMorph PDF - ${convertedFileResult.name}`,
          text: 'PDF created with DocuMorph browser-sandbox converter!',
        });
        onShowToast('PDF shared successfully!');
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error(error);
          handleDownload();
        }
      }
    } else {
      handleDownload();
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 bg-[#0f0f0f] text-white overflow-y-auto selection:bg-[#c9a84c]/20">
      <div className="w-full max-w-sm flex flex-col items-center">
        
        {phase !== 'success' && phase !== 'error' ? (
          /* ACTIVE PROGRESS LOOPS */
          <div className="w-full text-center space-y-6">
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              {/* Outer visual rotation border */}
              <div className="absolute inset-0 rounded-full border border-zinc-800/80 p-1">
                <div className="w-full h-full rounded-full border-t border-[#c9a84c] animate-spin" style={{ animationDuration: '2s' }} />
              </div>
              
              {/* Core Symbol */}
              <div className="w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center text-[#c9a84c] shadow-lg">
                <RefreshCw size={26} className="animate-spin" style={{ animationDuration: '4s' }} />
              </div>
            </div>

            <div className="space-y-1.5 p-1.5">
              <h2 className="text-base font-bold font-sans">
                {phase === 'reading' && 'Reading Word File...'}
                {phase === 'parsing' && 'Compiling Doc Layouts...'}
                {phase === 'ad_checkpoint' && 'Caching Converter...'}
                {phase === 'rendering' && 'Rendering A4 Vector Spans...'}
                {phase === 'saving' && 'Saving locally to IndexedDB...'}
              </h2>
              <p className="text-zinc-500 text-xs font-mono">
                Running isolated JS runtime parser • {progress}% Complete
              </p>
            </div>

            {/* Flat progress slider */}
            <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-850 p-0.5">
              <div 
                className="bg-gradient-to-r from-[#c9a84c] to-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-[10px] text-zinc-500 font-sans max-w-xs mx-auto">
              Your files never leave your phone. All parsing is done in-browser via sandbox containers.
            </p>
          </div>
        ) : phase === 'success' && convertedFileResult ? (
          /* SUCCESS FEEDBACK BLOCK */
          <div className="w-full flex flex-col items-center text-center space-y-5 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950/20 text-[#22c55e] border border-[#22c55e]/10 flex items-center justify-center shadow-xl shadow-emerald-500/5">
              <CheckCircle2 size={28} />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold font-sans text-white">Conversion Successful!</h2>
              <span className="text-[11px] text-zinc-400 truncate max-w-xs block font-mono">
                {convertedFileResult.name.replace(/\.docx$/i, '')}.pdf
              </span>
            </div>

            {/* Micro A4 Representation Box */}
            <div className="bg-[#161616] border border-zinc-900 rounded-2xl p-4 w-full text-center space-y-3">
              <div className="w-10 h-12 bg-white rounded flex items-center justify-center mx-auto shadow-md">
                <span className="text-[#0f0f0f] font-sans font-extrabold text-[9px] uppercase tracking-wider">PDF</span>
              </div>
              <div className="flex flex-col space-y-1.5">
                <span className="text-xs text-zinc-300 font-sans">Size: {Math.round(convertedFileResult.pdfSize / 102.4) / 10} KB</span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">LOCAL IDB REGISTRATION SUCCESS</span>
              </div>
            </div>

            {/* Conversion outcome actions */}
            <div className="w-full grid grid-cols-2 gap-3 mt-1">
              <button
                onClick={handleDownload}
                className="bg-[#c9a84c] hover:bg-[#b0903c] text-[#0f0f0f] py-3.5 px-3 rounded-xl font-sans font-extrabold text-xs transition duration-300 flex items-center justify-center space-x-1.5 shadow-lg shadow-[#c9a84c]/10"
              >
                <Download size={14} />
                <span>Save to Device</span>
              </button>

              <button
                onClick={handleShare}
                className="bg-transparent hover:bg-zinc-900 text-[#c9a84c] border border-[#c9a84c] py-3.5 px-3 rounded-xl font-sans font-bold text-xs transition duration-300 flex items-center justify-center space-x-1.5"
              >
                <Share2 size={14} />
                <span>Share PDF</span>
              </button>

              <button
                onClick={handleOpenPdf}
                className="col-span-2 bg-[#2a2a2a] hover:bg-zinc-800 text-white font-sans text-xs font-semibold py-3 px-3 rounded-xl transition flex items-center justify-center space-x-1 border border-zinc-700"
              >
                <Eye size={14} />
                <span>Open in Web Preview</span>
              </button>
            </div>

            <button
              onClick={onReset}
              className="text-[#c9a84c] hover:text-[#b0903c] font-sans text-xs flex items-center justify-center space-x-1 select-none focus:outline-none pt-2"
            >
              <RotateCcw size={12} />
              <span>Convert Another Word Document</span>
            </button>

            {/* AD PLACEMENT: Part 4 Screen 3 Success Modal body BannerAd */}
            <div className="w-full pt-4 border-t border-zinc-900">
              <BannerAd size="large" className="w-full" />
            </div>
          </div>
        ) : (
          /* FAILURE CONTROL PANEL */
          <div className="w-full text-center space-y-6 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-red-950/20 text-[#f43f5e] border border-[#f43f5e]/10 flex items-center justify-center mx-auto">
              <AlertTriangle size={28} />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-base font-bold font-sans">Conversion Glitch</h2>
              <p className="text-zinc-400 text-xs font-sans max-w-xs mx-auto leading-normal">
                {errorMessage || 'Your file structure could not be parsed. Verify that the DOCX file is not password-protected and complies with normal word standards.'}
              </p>
            </div>

            <div className="flex flex-col space-y-3 w-full">
              <button
                onClick={onReset}
                className="w-full bg-[#2a2a2a] hover:bg-zinc-800 text-white font-sans text-xs font-semibold py-3.5 rounded-xl transition border border-zinc-700 flex items-center justify-center space-x-1.5"
              >
                <RotateCcw size={14} />
                <span>Try Another Document</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
