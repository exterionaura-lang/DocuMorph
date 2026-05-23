/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { getStoredFiles, deleteStoredFile } from '../lib/db';
import { ConvertedFile } from '../types';
import { Download, Trash2, Share2, FileSpreadsheet, Eye, Play, Sparkles, CheckCircle2, Clock, X, AlertCircle } from 'lucide-react';
import JSZip from 'jszip';
import { BannerAd } from './BannerAd';

interface HistoryManagerProps {
  onShowToast: (msg: string) => void;
}

export const HistoryManager: React.FC<HistoryManagerProps> = ({ onShowToast }) => {
  const [files, setFiles] = useState<ConvertedFile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Rewarded Ad state
  const [rewardedPlaying, setRewardedPlaying] = useState(false);
  const [rewardedCountdown, setRewardedCountdown] = useState(10);
  const [exportUnlocked, setExportUnlocked] = useState(false);
  const [unlockTimeRemaining, setUnlockTimeRemaining] = useState(0);

  useEffect(() => {
    loadFiles();

    // Check if there's an existing active unlock in localStorage
    const savedUnlock = localStorage.getItem('documorph_export_unlocked_until');
    if (savedUnlock) {
      const until = parseInt(savedUnlock, 10);
      const remaining = Math.round((until - Date.now()) / 1000);
      if (remaining > 0) {
        setExportUnlocked(true);
        setUnlockTimeRemaining(remaining);
      }
    }
  }, []);

  // Handle countdown for active unlock badge
  useEffect(() => {
    if (!exportUnlocked || unlockTimeRemaining <= 0) {
      if (exportUnlocked) {
        setExportUnlocked(false);
        localStorage.removeItem('documorph_export_unlocked_until');
      }
      return;
    }

    const timer = setTimeout(() => {
      setUnlockTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [exportUnlocked, unlockTimeRemaining]);

  const loadFiles = async () => {
    setLoading(true);
    const stored = await getStoredFiles();
    setFiles(stored);
    setLoading(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleDownload = (file: ConvertedFile) => {
    const url = URL.createObjectURL(file.pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace(/\.docx$/i, '') + '.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('PDF download started.');
  };

  const handleOpenPdfInTab = (file: ConvertedFile) => {
    const url = URL.createObjectURL(file.pdfBlob);
    window.open(url, '_blank');
    // We don't revoke URL immediately so the tab can load it
  };

  const handleShare = async (file: ConvertedFile) => {
    const pdfFile = new File([file.pdfBlob], file.name.replace(/\.docx$/i, '') + '.pdf', {
      type: 'application/pdf',
    });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
      try {
        await navigator.share({
          files: [pdfFile],
          title: `DocuMorph PDF - ${file.name}`,
          text: 'Check out my converted PDF from DocuMorph!',
        });
        onShowToast('PDF shared successfully!');
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Share failed:', error);
          handleDownload(file); // fallback
        }
      }
    } else {
      // Fallback
      handleDownload(file);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this file from your local history?')) {
      await deleteStoredFile(id);
      onShowToast('File deleted from history.');
      loadFiles();
    }
  };

  // REWARDED AD FLOW
  const handleWatchAdToExport = () => {
    if (files.length === 0) {
      onShowToast('No files available to export!');
      return;
    }

    if (exportUnlocked) {
      // Already unlocked, trigger export immediately!
      exportZip();
      return;
    }

    // Play Ad
    setRewardedCountdown(10);
    setRewardedPlaying(true);
  };

  // Video Ad ticker
  useEffect(() => {
    if (!rewardedPlaying) return;

    const timer = setInterval(() => {
      setRewardedCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          completeRewardedAd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [rewardedPlaying]);

  const handleCloseAdEarly = () => {
    setRewardedPlaying(false);
    onShowToast('Watch the full ad to unlock export.');
  };

  const completeRewardedAd = () => {
    setRewardedPlaying(false);
    
    // Set 60 seconds unlock
    const unlockUntil = Date.now() + 60000;
    localStorage.setItem('documorph_export_unlocked_until', unlockUntil.toString());
    setExportUnlocked(true);
    setUnlockTimeRemaining(60);

    onShowToast('Reward unlocked! Batch export activated.');
    
    // Trigger actual export
    exportZip();
  };

  const exportZip = async () => {
    try {
      onShowToast('Assembling ZIP package...');
      const zip = new JSZip();

      files.forEach((file) => {
        const cleanName = file.name.replace(/\.docx$/i, '') + '.pdf';
        zip.file(cleanName, file.pdfBlob);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'DocuMorph_Batch_Conversions.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      onShowToast('ZIP downloaded successfully!');
    } catch (err) {
      console.error('Failed to create ZIP export:', err);
      onShowToast('Ad unavailable. Try again later.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0f0f0f] text-white">
      
      {/* File List / Content Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        
        {/* Rewarded Ad Promotion Panel */}
        {files.length > 0 && (
          <div className="bg-gradient-to-r from-[#1a1a1a] to-[#252525] border border-[#c9a84c]/30 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between space-y-3.5 md:space-y-0 md:space-x-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/10 text-[#c9a84c] flex items-center justify-center flex-shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#c9a84c]">Premium Bonus Feature</h4>
                <h3 className="text-sm font-bold font-sans mt-0.5 text-white">Export All Conversions as ZIP</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">
                  Watch a short 10s ad to package and download all your local PDFs instantly.
                </p>
              </div>
            </div>

            <div className="flex-shrink-0">
              {exportUnlocked ? (
                <button
                  onClick={exportZip}
                  className="w-full bg-[#22c55e]/15 border border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e]/25 py-2.5 px-4 rounded-xl text-xs font-sans font-bold transition flex items-center justify-center space-x-1.5 shadow-lg shadow-[#22c55e]/5"
                >
                  <CheckCircle2 size={14} />
                  <span>Export ZIP ({unlockTimeRemaining}s)</span>
                </button>
              ) : (
                <button
                  onClick={handleWatchAdToExport}
                  className="w-full bg-[#c9a84c] hover:bg-[#b0903c] text-[#0f0f0f] py-2.5 px-4 rounded-xl text-xs font-sans font-extrabold transition flex items-center justify-center space-x-1.5 shadow-lg shadow-[#c9a84c]/25"
                >
                  <Play size={10} fill="currentColor" />
                  <span>Watch Ad &amp; Export ▶</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-zinc-800 border-t-[#c9a84c] animate-spin" />
            <p className="text-xs text-zinc-500 font-sans">Loading document history...</p>
          </div>
        ) : files.length === 0 ? (
          /* Empty Space Layout */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4">
            <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-600">
              <FileSpreadsheet size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold font-sans text-zinc-300">No conversions yet</h3>
              <p className="text-xs text-zinc-500 max-w-xs font-sans leading-relaxed">
                Your converted documents will be indexed securely in this space. Import a Word doc (.docx) to begin!
              </p>
            </div>
          </div>
        ) : (
          /* File List Container */
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1.5 pb-1">
              <span className="text-xs text-zinc-500 font-medium font-sans">Local History ({files.length})</span>
              <span className="text-[10px] text-zinc-600 font-mono">ON-DEVICE INDEX</span>
            </div>

            <div className="space-y-2">
              {files.map((file) => (
                <div 
                  key={file.id} 
                  className="bg-[#161616] border border-zinc-900 rounded-2xl p-3.5 flex items-center justify-between hover:border-zinc-800 transition"
                >
                  <div className="flex items-start space-x-3 overflow-hidden pr-3">
                    <div className="w-9 h-9 rounded-xl bg-red-950/20 text-[#f43f5e] border border-[#f43f5e]/10 flex items-center justify-center flex-shrink-0 font-sans font-extrabold text-[10px]">
                      PDF
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-semibold text-zinc-200 truncate font-sans" title={file.name}>
                        {file.name.replace(/\.docx$/i, '')}.pdf
                      </h4>
                      <div className="flex items-center space-x-2 text-[10px] text-zinc-500 mt-1 font-mono">
                        <span>{formatSize(file.pdfSize)}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock size={10} className="mr-0.5" />
                          {new Date(file.convertedAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Tooltip Area */}
                  <div className="flex items-center space-x-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleOpenPdfInTab(file)}
                      className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
                      title="Open PDF"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => handleShare(file)}
                      className="p-2 text-zinc-400 hover:text-[#c9a84c] hover:bg-zinc-800 rounded-lg transition"
                      title="Share PDF"
                    >
                      <Share2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDownload(file)}
                      className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
                      title="Download PDF"
                    >
                      <Download size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="p-2 text-zinc-500 hover:text-[#f43f5e] hover:bg-zinc-800 rounded-lg transition"
                      title="Delete Entry"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medium-size active ad spacer for File manager */}
        {files.length > 3 && (
          <div className="pt-2">
            <BannerAd size="small" />
          </div>
        )}
      </div>

      {/* REWARDED VIDEO AD MODAL */}
      {rewardedPlaying && (
        <div className="fixed inset-0 bg-[#060606]/98 z-50 flex flex-col justify-between p-6 text-white select-none">
          <div className="w-full flex justify-between items-center mt-2 max-w-sm mx-auto">
            <div className="flex items-center space-x-2 text-[#c9a84c]">
              <Sparkles size={16} />
              <span className="font-sans font-bold text-xs uppercase tracking-widest text-[10px]">DocuMorph Sponsor Ad</span>
            </div>
            
            {/* Ad Countdown timer (Unskippable) */}
            <div className="text-xs bg-zinc-900 px-3.5 py-1.5 rounded-full font-mono text-zinc-400 flex items-center space-x-1.5 border border-zinc-800">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Unlocks in <b className="text-[#c9a84c]">{rewardedCountdown}s</b></span>
            </div>
          </div>

          {/* Interactive Core Video Representation */}
          <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
            <div className="w-full aspect-video bg-zinc-950 border border-zinc-850 rounded-2xl relative overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
              
              {/* Play symbol pulse */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-[#c9a84c]/10 flex items-center justify-center text-[#c9a84c] border border-[#c9a84c]/20 animate-pulse">
                  <Play size={24} fill="currentColor" className="ml-1" />
                </div>
              </div>

              {/* Top Banner on video */}
              <div className="z-10 flex items-center justify-between w-full">
                <span className="bg-[#c9a84c] text-[#0f0f0f] px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase">LIVE AD</span>
                <span className="text-[10px] text-zinc-400 font-mono">STREAM FEED</span>
              </div>

              {/* Progress bar overlay on video bottom */}
              <div className="z-10 w-full space-y-1 bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/40 backdrop-blur-sm">
                <div className="flex justify-between items-center text-[10px] text-zinc-300 font-mono">
                  <span>Batch ZIP Compressor Engine</span>
                  <span>{10 - rewardedCountdown}/10s Completed</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-850 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#c9a84c] to-amber-500 transition-all duration-1000 ease-linear"
                    style={{ width: `${(10 - rewardedCountdown) * 10}%` }}
                  />
                </div>
              </div>
            </div>

            <h4 className="text-xs font-bold text-zinc-300 mt-6 text-center font-sans">
              Watch this brief developer sponsorship spot to unlock full JSZip capabilities.
            </h4>
            <p className="text-[10px] text-zinc-500 mt-1.5 text-center px-4 leading-relaxed font-sans font-light">
              We compile and bind all IndexedDB blobs directly on your device, without utilizing paid remote proxy hosts.
            </p>
          </div>

          {/* Skip/Fail warning action */}
          <div className="w-full text-center max-w-sm mx-auto mb-4 space-y-4">
            <button
              onClick={handleCloseAdEarly}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 underline focus:outline-none flex items-center justify-center space-x-1 mx-auto"
            >
              <X size={12} />
              <span>Close Ad Early (No Reward)</span>
            </button>
            
            <p className="text-[10px] text-zinc-400 bg-zinc-950 p-2 rounded-xl border border-zinc-900 font-light font-sans max-w-xs mx-auto">
              ✨ Complete the video to download all conversions in one click!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
