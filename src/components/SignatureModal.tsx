import React, { useRef, useState, useEffect } from 'react';
import {
  X,
  RotateCcw,
  Check,
  PenTool,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Undo2,
  Trash2,
  Sliders,
} from 'lucide-react';
import { SignatureData } from '../types';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { type: 'drawn' | 'custom' | 'default'; imageData?: string }) => void;
  signatureId: 'compared' | 'checked' | 'controller';
  signatureLabel: string;
  initialMode?: 'draw' | 'upload' | 'default';
  defaultComponent?: React.ReactNode;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  signatureId,
  signatureLabel,
  initialMode = 'draw',
  defaultComponent,
}) => {
  const [activeTab, setActiveTab] = useState<'draw' | 'upload' | 'default'>(initialMode);

  // Drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [penColor, setPenColor] = useState('#1e3a8a');
  const [penWidth, setPenWidth] = useState(2.2);
  const [strokeHistory, setStrokeHistory] = useState<ImageData[]>([]);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Upload state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedRawUrl, setUploadedRawUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [removeWhiteBg, setRemoveWhiteBg] = useState(true);
  const [threshold, setThreshold] = useState(215);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialMode);
      setStrokeHistory([]);
      setHasDrawn(false);
    }
  }, [isOpen, initialMode]);

  // Canvas initialization for drawing
  useEffect(() => {
    if (!isOpen || activeTab !== 'draw') return;

    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const ratio = Math.max(window.devicePixelRatio || 1, 2);
      const width = 480;
      const height = 200;

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(ratio, ratio);
      ctx.clearRect(0, 0, width, height);

      // Save initial blank state
      const initialSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setStrokeHistory([initialSnapshot]);
      setHasDrawn(false);
    }, 60);

    return () => clearTimeout(timer);
  }, [isOpen, activeTab]);

  // Process uploaded image with transparent background
  useEffect(() => {
    if (!uploadedRawUrl) {
      setProcessedUrl(null);
      return;
    }

    if (!removeWhiteBg) {
      setProcessedUrl(uploadedRawUrl);
      return;
    }

    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setProcessedUrl(uploadedRawUrl);
          setIsProcessing(false);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Standard luminosity calculation
          const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

          if (brightness >= threshold) {
            data[i + 3] = 0; // Transparent
          } else {
            // Smooth edge transition for anti-aliasing
            const fadeZone = 25;
            if (brightness > threshold - fadeZone) {
              const alphaRatio = (threshold - brightness) / fadeZone;
              data[i + 3] = Math.round(data[i + 3] * alphaRatio);
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setProcessedUrl(canvas.toDataURL('image/png'));
      } catch {
        setProcessedUrl(uploadedRawUrl);
      } finally {
        setIsProcessing(false);
      }
    };
    img.src = uploadedRawUrl;
  }, [uploadedRawUrl, removeWhiteBg, threshold]);

  if (!isOpen) return null;

  // --- DRAWING HANDLERS ---
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(x, y);
    lastPointRef.current = { x, y };

    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const currentX = clientX - rect.left;
    const currentY = clientY - rect.top;

    if (lastPointRef.current) {
      // Smooth quadratic curve interpolation for realistic calligraphy
      const midX = (lastPointRef.current.x + currentX) / 2;
      const midY = (lastPointRef.current.y + currentY) / 2;
      ctx.quadraticCurveTo(lastPointRef.current.x, lastPointRef.current.y, midX, midY);
      ctx.stroke();
    }

    lastPointRef.current = { x: currentX, y: currentY };
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    lastPointRef.current = null;

    // Snapshot stroke history for undo
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setStrokeHistory((prev) => [...prev.slice(-15), snap]);
  };

  const handleUndo = () => {
    if (strokeHistory.length <= 1) {
      handleClearCanvas();
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...strokeHistory];
    newHistory.pop(); // remove current
    const prevSnap = newHistory[newHistory.length - 1];

    ctx.putImageData(prevSnap, 0, 0);
    setStrokeHistory(newHistory);
    setHasDrawn(newHistory.length > 1);
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ratio = Math.max(window.devicePixelRatio || 1, 2);
    ctx.clearRect(0, 0, canvas.width / ratio, canvas.height / ratio);
    setStrokeHistory([]);
    setHasDrawn(false);
  };

  const handleSaveDrawn = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSave({ type: 'drawn', imageData: dataUrl });
    onClose();
  };

  // --- UPLOAD HANDLERS ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setUploadedRawUrl(url);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveUploaded = () => {
    if (!processedUrl) return;
    onSave({ type: 'custom', imageData: processedUrl });
    onClose();
  };

  // --- DEFAULT HANDLER ---
  const handleSaveDefault = () => {
    onSave({ type: 'default', imageData: undefined });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm md:text-base">
                Signature Studio: {signatureLabel}
              </h3>
              <p className="text-[11px] text-slate-500">
                স্বাক্ষর আঁকুন, ছবি আপলোড করুন অথবা অফিসিয়াল ডিফল্ট সিলেক্ট করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('draw')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'draw'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>✍️ Draw Signature (আঁকুন)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>📤 Upload Image (আপলোড)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('default')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'default'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>↺ Default (ডিফল্ট)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* TAB 1: DRAW SIGNATURE */}
          {activeTab === 'draw' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>মাউস বা আঙুল দিয়ে নিচের বক্সে স্বাক্ষর আঁকুন:</span>
                <span className="font-mono text-[11px] text-indigo-600">High-Res Vector Pen</span>
              </div>

              {/* Drawing Board with Faint Baseline Guideline */}
              <div className="relative border-2 border-slate-300 rounded-xl overflow-hidden shadow-inner bg-[#fffdfa] touch-none">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-[480px] h-[200px] cursor-crosshair block"
                />

                {/* Decorative Faint Baseline (not drawn to canvas, won't appear in export) */}
                <div className="absolute inset-x-4 top-[148px] border-b border-dashed border-slate-200 pointer-events-none" />

                {!hasDrawn && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400 select-none">
                    <PenTool className="w-8 h-8 mb-1.5 text-slate-300" />
                    <span className="text-xs font-medium">এখানে আপনার স্বাক্ষরটি আঁকুন</span>
                    <span className="text-[10px] text-slate-400">Sign with mouse, trackpad, or finger</span>
                  </div>
                )}
              </div>

              {/* Toolbar: Color, Thickness, Undo, Clear */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                {/* Pen Ink Color */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-medium">Ink Color:</span>
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                    {[
                      { color: '#1e3a8a', label: 'Navy Blue' },
                      { color: '#0f172a', label: 'Deep Black' },
                      { color: '#2563eb', label: 'Royal Blue' },
                      { color: '#451a03', label: 'Sepia Ink' },
                    ].map((c) => (
                      <button
                        key={c.color}
                        type="button"
                        onClick={() => setPenColor(c.color)}
                        title={c.label}
                        className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                          penColor === c.color ? 'scale-110 border-slate-900 shadow-xs' : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Pen Thickness */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-medium">Thickness:</span>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                    {[
                      { width: 1.6, label: 'Fine' },
                      { width: 2.3, label: 'Medium' },
                      { width: 3.5, label: 'Bold' },
                    ].map((w) => (
                      <button
                        key={w.label}
                        type="button"
                        onClick={() => setPenWidth(w.width)}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                          penWidth === w.width
                            ? 'bg-white text-indigo-700 shadow-xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {w.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Undo & Clear */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={!hasDrawn}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition text-xs font-medium cursor-pointer"
                    title="Undo last stroke"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>Undo</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearCanvas}
                    disabled={!hasDrawn}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition text-xs font-medium cursor-pointer"
                    title="Clear canvas"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveDrawn}
                  disabled={!hasDrawn}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Apply Drawn Signature</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD SIGNATURE IMAGE */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {!uploadedRawUrl ? (
                /* Dropzone / Upload button */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 hover:bg-indigo-50/80 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition group"
                >
                  <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-110 transition">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-sm text-slate-800 mb-1">
                    Click to select signature photo (PNG / JPG)
                  </span>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    সাদা কাগজের উপর কলমে করা স্বাক্ষরের ছবি বা স্ক্যান কপি সিলেক্ট করুন। সিস্টেম স্বয়ংক্রিয়ভাবে সাদা ব্যাকগ্রাউন্ড মুছে ট্রান্সপারেন্ট করে সার্টিফিকেটে বসাবে।
                  </p>
                </div>
              ) : (
                /* Preview & Settings */
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">Preview & Adjustments:</span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-indigo-600 hover:text-indigo-800 underline cursor-pointer font-medium"
                    >
                      Change Photo
                    </button>
                  </div>

                  {/* Checkerboard container to visually preview transparency */}
                  <div
                    className="h-32 border border-slate-300 rounded-xl flex items-center justify-center p-3 relative overflow-hidden"
                    style={{
                      backgroundImage:
                        'linear-gradient(45deg, #f1f5f9 25%, transparent 25%), linear-gradient(-45deg, #f1f5f9 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f1f5f9 75%), linear-gradient(-45deg, transparent 75%, #f1f5f9 75%)',
                      backgroundSize: '16px 16px',
                      backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                    }}
                  >
                    {isProcessing ? (
                      <span className="text-xs text-slate-500">Processing image...</span>
                    ) : processedUrl ? (
                      <img
                        src={processedUrl}
                        alt="Signature Preview"
                        className="max-h-24 max-w-full object-contain filter drop-shadow-xs"
                      />
                    ) : (
                      <span className="text-xs text-slate-400">Failed to render</span>
                    )}
                  </div>

                  {/* Transparent background options */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                      <input
                        type="checkbox"
                        checked={removeWhiteBg}
                        onChange={(e) => setRemoveWhiteBg(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Remove white paper background (স্বচ্ছ ব্যাকগ্রাউন্ড)</span>
                    </label>

                    {removeWhiteBg && (
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[11px] text-slate-500">
                          <span>Background removal sensitivity:</span>
                          <span className="font-mono font-bold text-slate-700">{threshold}</span>
                        </div>
                        <input
                          type="range"
                          min="150"
                          max="250"
                          value={threshold}
                          onChange={(e) => setThreshold(Number(e.target.value))}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setUploadedRawUrl(null)}
                      className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    >
                      Clear Image
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveUploaded}
                      disabled={!processedUrl}
                      className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Apply Uploaded Signature</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RESTORE DEFAULT SIGNATURE */}
          {activeTab === 'default' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-xs font-semibold text-slate-700 block mb-2">
                  Official Default Signature Preview:
                </span>
                <div className="h-16 flex items-center justify-center bg-white rounded-lg border border-slate-200 p-2 mb-2">
                  {defaultComponent || (
                    <span className="text-xs text-slate-400">Authentic Vector Pen Signature</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  বাংলাদেশ শিক্ষা বোর্ডের মূল সার্টিফিকেটের আদলে তৈরি ভেক্টর স্বাক্ষর।
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveDefault}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restore Official Default</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
