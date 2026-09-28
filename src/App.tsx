/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  CertificateData,
  INITIAL_CERTIFICATE_DATA,
} from './types';
import { Certificate } from './components/Certificate';
import { EditorSidebar } from './components/EditorSidebar';
import {
  exportCertificateAsPdf,
  exportCertificateAsPng,
  printCertificate,
} from './utils/exportPdf';
import {
  FileDown,
  Printer,
  ZoomIn,
  ZoomOut,
  PanelRightClose,
  PanelRightOpen,
  RotateCcw,
  Award,
  HelpCircle,
  X,
  FileCheck,
  Type,
} from 'lucide-react';

export default function App() {
  const [certData, setCertData] = useState<CertificateData>(INITIAL_CERTIFICATE_DATA);
  const [zoomScale, setZoomScale] = useState<number>(0.92);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportStatus, setExportStatus] = useState<string>('');
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-fit zoom on mount and resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth - 48; // padding
      const targetWidth = 1120;
      if (containerWidth < targetWidth) {
        const computed = Math.max(0.45, Math.min(1.05, containerWidth / targetWidth));
        setZoomScale(Number(computed.toFixed(2)));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      setExportStatus('Generating PDF...');
      await exportCertificateAsPdf('ssc-certificate-print-area', certData.studentName, (msg) => {
        setExportStatus(msg);
      });
      setTimeout(() => setExportStatus(''), 3500);
    } catch (err) {
      console.error(err);
      setExportStatus('PDF export failed. Try using the Print button.');
      setTimeout(() => setExportStatus(''), 4000);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPng = async () => {
    try {
      setIsExporting(true);
      setExportStatus('Generating Image...');
      await exportCertificateAsPng('ssc-certificate-print-area', certData.studentName, (msg) => {
        setExportStatus(msg);
      });
      setTimeout(() => setExportStatus(''), 3500);
    } catch (err) {
      console.error(err);
      setExportStatus('Image export failed.');
      setTimeout(() => setExportStatus(''), 4000);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    setExportStatus('Opening Print Dialog...');
    printCertificate();
    setTimeout(() => setExportStatus(''), 2500);
  };

  const handleResetToTemplate = () => {
    if (window.confirm('Reset all fields back to the original Arian ICT Corner template?')) {
      setCertData(INITIAL_CERTIFICATE_DATA);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* ================= TOP NAVIGATION BAR ================= */}
      <header className="no-print bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between shrink-0 z-30">
        {/* Left: Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              <span>Certificate Studio</span>
              <span className="text-[11px] font-normal text-slate-400">
                ARIYAN ICT HUB · Kushtia
              </span>
            </h1>
          </div>
        </div>

        {/* Center: Quick Toolbar */}
        <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1">
          {/* Quick Font Selector for Changeable text */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded border border-slate-800 text-xs">
            <Type className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-[11px] text-slate-400 font-medium">Text Font:</span>
            <select
              value={certData.changeableFont}
              onChange={(e) =>
                setCertData((prev) => ({
                  ...prev,
                  changeableFont: e.target.value as any,
                }))
              }
              className="bg-transparent text-rose-400 font-bold text-xs focus:outline-hidden cursor-pointer"
            >
              <option value="arial" className="bg-slate-900 text-white font-sans">
                Arial (Default)
              </option>
              <option value="times" className="bg-slate-900 text-white font-serif">
                Times / Serif
              </option>
              <option value="calligraphy" className="bg-slate-900 text-white">
                Calligraphy (Script)
              </option>
              <option value="script" className="bg-slate-900 text-white">
                Cursive (Alex Brush)
              </option>
              <option value="gothic" className="bg-slate-900 text-white font-serif">
                Gothic Old English
              </option>
              <option value="courier" className="bg-slate-900 text-white font-mono">
                Courier Typewriter
              </option>
            </select>
          </div>

          <span className="h-4 w-px bg-slate-800 mx-0.5" />

          {/* Zoom controls */}
          <button
            type="button"
            onClick={() => setZoomScale((prev) => Math.max(0.4, Number((prev - 0.08).toFixed(2))))}
            className="p-1.5 hover:bg-slate-800 text-slate-300 rounded transition cursor-pointer"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-400 px-1 min-w-[45px] text-center">
            {Math.round(zoomScale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoomScale((prev) => Math.min(1.3, Number((prev + 0.08).toFixed(2))))}
            className="p-1.5 hover:bg-slate-800 text-slate-300 rounded transition cursor-pointer"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomScale(1)}
            className="text-[11px] px-2 py-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition cursor-pointer"
            title="Actual size 100%"
          >
            100%
          </button>

          <span className="h-4 w-px bg-slate-800 mx-1" />

          {/* Preview Mode */}
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded transition cursor-pointer ${
              isPreviewMode
                ? 'bg-rose-600 text-white font-semibold'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
            title="Toggle preview without edit lines"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>{isPreviewMode ? 'Exit Preview' : 'Preview'}</span>
          </button>

          {/* Reset template */}
          <button
            type="button"
            onClick={handleResetToTemplate}
            className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition cursor-pointer"
            title="Restore original template data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Right: Primary Print & PDF Export Buttons */}
        <div className="flex items-center gap-2">
          {/* Quick PDF button */}
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-medium text-xs shadow-xs transition cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">Save to PDF</span>
          </button>

          {/* Quick Print button */}
          <button
            type="button"
            onClick={handlePrint}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-medium text-xs border border-slate-700 shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Help Instructions Modal Trigger */}
          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
            title="User Guide & Features"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Sidebar Toggle */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
            title={isSidebarOpen ? 'Hide Editor Panel' : 'Show Editor Panel'}
          >
            {isSidebarOpen ? (
              <PanelRightClose className="w-5 h-5 text-rose-400" />
            ) : (
              <PanelRightOpen className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* ================= MAIN CONTENT WORKSPACE ================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Certificate Viewport Area */}
        <div
          ref={containerRef}
          className="flex-1 overflow-auto bg-slate-900/80 p-4 sm:p-8 flex flex-col items-center justify-start min-h-full"
        >
          {/* Certificate Wrapper with scaled container height compensation */}
          <div
            className="relative transition-all duration-150"
            style={{
              width: `${1120 * zoomScale}px`,
              height: `${790 * zoomScale}px`,
            }}
          >
            <Certificate
              data={certData}
              onChange={setCertData}
              isEditable={!isPreviewMode}
              scale={zoomScale}
            />
          </div>

          {/* Notice banner below certificate (no-print) */}
          <div className="no-print mt-6 mb-4 text-xs text-slate-400 text-center max-w-xl flex items-center justify-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Click on any text or number to edit in-place</span>
            </span>
            <span>·</span>
            <span>Default Font: Arial</span>
            <span>·</span>
            <span>A4 Landscape Ready</span>
          </div>
        </div>

        {/* Collapsible Editor Sidebar (Right Panel) */}
        {isSidebarOpen && (
          <aside className="no-print h-full shrink-0 animate-in slide-in-from-right duration-200">
            <EditorSidebar
              data={certData}
              onChange={setCertData}
              onExportPdf={handleExportPdf}
              onPrint={handlePrint}
              onExportPng={handleExportPng}
              isExporting={isExporting}
              exportStatus={exportStatus}
            />
          </aside>
        )}
      </div>

      {/* ================= HELP / GUIDE MODAL ================= */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-800 rounded-xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                  AIC
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Certificate Studio Guide
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 my-4 text-xs text-slate-600 leading-relaxed">
              <div className="flex gap-2.5">
                <span className="font-bold text-rose-600 text-sm">1.</span>
                <p>
                  <strong className="text-slate-900">Direct In-Place Editing:</strong> Click directly
                  on student name, father/mother name, institution, roll/reg number, GPA, dates, or
                  any text right on the certificate to type and update instantly without overlapping!
                </p>
              </div>

              <div className="flex gap-2.5">
                <span className="font-bold text-rose-600 text-sm">2.</span>
                <p>
                  <strong className="text-slate-900">Arial Font & Typography Controls:</strong> Default
                  font is set to Arial as requested. You can customize font family (Arial, Times, Calligraphy, Script, Gothic, Courier), font weight, ink color, and line spacing directly from the top bar or sidebar "Font & Design" tab.
                </p>
              </div>

              <div className="flex gap-2.5">
                <span className="font-bold text-rose-600 text-sm">3.</span>
                <p>
                  <strong className="text-slate-900">Signatures (Compared, Checked, Controller):</strong> Pre-loaded authentic signatures. Hover or click to draw your signature or upload from your device.
                </p>
              </div>

              <div className="flex gap-2.5">
                <span className="font-bold text-rose-600 text-sm">4.</span>
                <p>
                  <strong className="text-slate-900">Save to PDF & Print:</strong> Click{' '}
                  <span className="bg-rose-100 text-rose-700 font-semibold px-1 rounded">
                    Save to PDF
                  </span>{' '}
                  for a crisp vector A4 landscape PDF export or{' '}
                  <span className="bg-slate-200 text-slate-800 font-semibold px-1 rounded">
                    Print
                  </span>{' '}
                  for native printer output.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
