import React, { useState } from 'react';
import { SignatureData } from '../types';
import { Upload, PenLine, RotateCcw, EyeOff, Edit3 } from 'lucide-react';
import { SignatureModal } from './SignatureModal';

export interface SignatureProps {
  signatureId: 'compared' | 'checked' | 'controller';
  data: SignatureData;
  onUpdate: (updated: SignatureData) => void;
  isEditable?: boolean;
}

// Authentic Vector Signatures mimicking the original certificate in the demo photo
export const DefaultSignatures = {
  compared: () => (
    <svg viewBox="0 0 160 55" className="w-28 h-10 select-none overflow-visible">
      {/* "Arch" / "Auely" fluid cursive pen stroke */}
      <path
        d="M 15 42 C 22 28, 30 14, 38 12 C 45 10, 48 24, 52 38 C 55 42, 60 40, 68 28 C 74 18, 80 18, 88 32 C 92 38, 98 40, 110 35 C 122 30, 134 22, 142 34"
        fill="none"
        stroke="#1e3a8a"
        strokeWidth="2.0"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Cross mark and flourish */}
      <path
        d="M 32 26 C 50 24, 75 25, 95 24"
        fill="none"
        stroke="#1e3a8a"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M 105 38 C 115 45, 135 48, 148 42"
        fill="none"
        stroke="#1e3a8a"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),

  checked: () => (
    <svg viewBox="0 0 160 55" className="w-28 h-10 select-none overflow-visible">
      {/* "Af" / Checked controller signature */}
      <path
        d="M 25 40 C 35 25, 45 12, 55 8 C 62 5, 68 15, 65 30 C 62 44, 48 48, 42 42 C 38 38, 50 32, 65 34 C 80 36, 100 35, 115 32"
        fill="none"
        stroke="#1e293b"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Downstroke and cross loop */}
      <path
        d="M 52 14 L 46 50"
        fill="none"
        stroke="#1e293b"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M 38 30 Q 60 28 85 29"
        fill="none"
        stroke="#1e293b"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),

  controller: () => (
    <svg viewBox="0 0 180 60" className="w-32 h-11 select-none overflow-visible">
      {/* Distinctive Controller of Examinations loop and cursive underline */}
      <path
        d="M 20 32 C 16 18, 30 10, 42 16 C 54 22, 50 40, 44 45 C 38 50, 28 42, 34 32 C 40 22, 58 18, 72 24 C 84 30, 92 42, 108 36 C 120 30, 132 20, 145 28 C 152 34, 148 44, 138 46 C 125 48, 110 38, 120 28"
        fill="none"
        stroke="#0f172a"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Swirling flourish */}
      <path
        d="M 70 38 C 90 48, 120 52, 160 42 C 168 40, 172 35, 165 32 C 158 29, 142 36, 135 44"
        fill="none"
        stroke="#0f172a"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
};

export const SignatureBlock: React.FC<SignatureProps> = ({
  signatureId,
  data,
  onUpdate,
  isEditable = true,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'draw' | 'upload' | 'default'>('draw');

  const handleModalSave = (result: { type: 'drawn' | 'custom' | 'default'; imageData?: string }) => {
    onUpdate({
      ...data,
      type: result.type,
      imageData: result.imageData,
    });
  };

  const handleOpenDraw = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setModalMode('draw');
    setIsModalOpen(true);
  };

  const handleOpenUpload = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setModalMode('upload');
    setIsModalOpen(true);
  };

  const handleResetToDefault = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onUpdate({
      ...data,
      type: 'default',
      imageData: undefined,
    });
  };

  const handleToggleNone = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onUpdate({
      ...data,
      type: data.type === 'none' ? 'default' : 'none',
    });
  };

  const renderSignatureVisual = () => {
    if (data.type === 'none') {
      return (
        <div className="w-28 h-10 border border-dashed border-slate-300 rounded-md flex items-center justify-center text-[10px] text-slate-400">
          (No Signature)
        </div>
      );
    }

    if ((data.type === 'custom' || data.type === 'drawn') && data.imageData) {
      return (
        <img
          src={data.imageData}
          alt={data.label}
          className="max-h-11 max-w-[130px] object-contain select-none pointer-events-none"
        />
      );
    }

    // Default vector signatures
    const Component = DefaultSignatures[signatureId] || DefaultSignatures.compared;
    return <Component />;
  };

  const DefaultComp = DefaultSignatures[signatureId] || DefaultSignatures.compared;

  return (
    <div className="group relative flex flex-col items-center">
      {/* Signature Graphic Area with click to edit */}
      <div
        onClick={() => isEditable && handleOpenDraw()}
        title={isEditable ? 'Click to draw or upload signature' : undefined}
        className={`h-12 flex items-end justify-center pb-1 transition-all rounded-md px-2 ${
          isEditable
            ? 'cursor-pointer hover:bg-slate-500/10 hover:ring-1 hover:ring-indigo-300'
            : ''
        }`}
      >
        {renderSignatureVisual()}
      </div>

      {/* Label underneath */}
      <div className="text-center mt-0.5">
        {isEditable ? (
          <input
            type="text"
            value={data.label}
            onChange={(e) => onUpdate({ ...data, label: e.target.value })}
            className="text-xs md:text-sm font-serif font-bold text-slate-900 bg-transparent text-center border-b border-transparent hover:border-slate-300 focus:border-rose-500 focus:outline-hidden px-1 transition-colors"
          />
        ) : (
          <span className="text-xs md:text-sm font-serif font-bold text-slate-900">
            {data.label}
          </span>
        )}
      </div>

      {/* Visible Action Badges for easy Draw / Upload (hidden on print) */}
      {isEditable && (
        <div className="no-print mt-1 flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={handleOpenDraw}
            className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded transition cursor-pointer"
            title="Draw signature digitally"
          >
            <PenLine className="w-2.5 h-2.5" />
            <span>Draw</span>
          </button>

          <button
            type="button"
            onClick={handleOpenUpload}
            className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded transition cursor-pointer"
            title="Upload signature image (photo/PNG/JPG)"
          >
            <Upload className="w-2.5 h-2.5" />
            <span>Upload</span>
          </button>

          {data.type !== 'default' && (
            <button
              type="button"
              onClick={handleResetToDefault}
              className="flex items-center gap-0.5 px-1 py-0.5 text-[9px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded transition cursor-pointer"
              title="Reset to official default signature"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Default</span>
            </button>
          )}
        </div>
      )}

      {/* Full Signature Studio Modal */}
      <SignatureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        signatureId={signatureId}
        signatureLabel={data.label}
        initialMode={modalMode}
        defaultComponent={<DefaultComp />}
      />
    </div>
  );
};
