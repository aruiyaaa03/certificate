import React, { useRef, useState, useEffect } from 'react';
import { X, RotateCcw, Check, PenTool } from 'lucide-react';

interface SignaturePadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
  title: string;
}

export const SignaturePadModal: React.FC<SignaturePadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [penColor, setPenColor] = useState('#1e3a8a'); // dark navy ink by default

  useEffect(() => {
    if (!isOpen) return;

    // Reset canvas when opened
    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Handle high DPI
      const ratio = Math.max(window.devicePixelRatio || 1, 2);
      canvas.width = 460 * ratio;
      canvas.height = 200 * ratio;
      canvas.style.width = '460px';
      canvas.style.height = '200px';

      ctx.scale(ratio, ratio);
      ctx.clearRect(0, 0, 460, 200);

      // Draw faint baseline guide
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(20, 150);
      ctx.lineTo(440, 150);
      ctx.stroke();
      ctx.setLineDash([]);

      setHasDrawn(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);

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
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ratio = Math.max(window.devicePixelRatio || 1, 2);
    ctx.clearRect(0, 0, canvas.width / ratio, canvas.height / ratio);

    // Re-draw faint baseline guide
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(20, 150);
    ctx.lineTo(440, 150);
    ctx.stroke();
    ctx.setLineDash([]);

    setHasDrawn(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create transparent export canvas without the baseline guide
    const offscreen = document.createElement('canvas');
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    // We can copy canvas content
    offCtx.drawImage(canvas, 0, 0);

    const dataUrl = offscreen.toDataURL('image/png');
    onSave(dataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-slate-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-xs text-slate-500 mb-2">
            Sign with your mouse or finger inside the box below:
          </p>

          <div className="border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden touch-none relative cursor-crosshair">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-[460px] h-[200px]"
            />
            {!hasDrawn && (
              <span className="absolute pointer-events-none text-xs text-slate-400 select-none">
                Draw signature here
              </span>
            )}
          </div>

          {/* Color picker */}
          <div className="flex items-center justify-between mt-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span>Ink Color:</span>
              <button
                type="button"
                onClick={() => setPenColor('#1e3a8a')}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  penColor === '#1e3a8a' ? 'scale-110 border-slate-800' : 'border-transparent'
                }`}
                style={{ backgroundColor: '#1e3a8a' }}
                title="Navy Ink"
              />
              <button
                type="button"
                onClick={() => setPenColor('#0f172a')}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  penColor === '#0f172a' ? 'scale-110 border-slate-800' : 'border-transparent'
                }`}
                style={{ backgroundColor: '#0f172a' }}
                title="Black Ink"
              />
              <button
                type="button"
                onClick={() => setPenColor('#1e40af')}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  penColor === '#1e40af' ? 'scale-110 border-slate-800' : 'border-transparent'
                }`}
                style={{ backgroundColor: '#1e40af' }}
                title="Royal Blue Ink"
              />
            </div>

            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1 text-slate-600 hover:text-rose-600 px-2.5 py-1 rounded-md hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasDrawn}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Apply Signature</span>
          </button>
        </div>
      </div>
    </div>
  );
};
