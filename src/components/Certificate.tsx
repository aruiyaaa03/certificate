import React, { useRef, useEffect } from 'react';
import { CertificateData } from '../types';
import { GuillocheBorder } from './GuillocheBorder';
import { SecurityWatermark } from './SecurityWatermark';
import { BoardLogo } from './BoardLogo';
import { SignatureBlock } from './Signatures';

interface CertificateProps {
  data: CertificateData;
  onChange: (data: CertificateData) => void;
  isEditable?: boolean;
  scale?: number;
}

// Seamless ContentEditable field that naturally resizes without any clipping or character limits
const EditableWord: React.FC<{
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  isEditable: boolean;
  fontStyle?: React.CSSProperties;
  className?: string;
  underlineStyle?: 'none' | 'dotted' | 'solid';
}> = ({
  value,
  onChange,
  placeholder = '',
  isEditable,
  fontStyle,
  className = '',
  underlineStyle = 'none',
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);

  // Keep DOM content in sync with prop value when not focused
  useEffect(() => {
    if (spanRef.current && document.activeElement !== spanRef.current) {
      spanRef.current.textContent = value || '';
    }
  }, [value]);

  const borderClass =
    underlineStyle === 'dotted'
      ? 'border-b border-dotted border-slate-400'
      : underlineStyle === 'solid'
      ? 'border-b border-solid border-slate-500'
      : '';

  if (!isEditable) {
    return (
      <span
        style={fontStyle}
        className={`inline-block px-1 mx-0.5 leading-tight ${borderClass} ${className}`}
      >
        {value || placeholder}
      </span>
    );
  }

  return (
    <span
      ref={spanRef}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => {
        const text = e.currentTarget.textContent || '';
        onChange(text.trim());
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      style={fontStyle}
      title="Click to edit text"
      className={`inline-block px-1.5 mx-0.5 leading-tight transition-all rounded-xs outline-hidden cursor-text hover:bg-slate-500/10 focus:bg-rose-50/80 focus:ring-1 focus:ring-rose-400 ${
        borderClass || 'border-b border-transparent hover:border-slate-400/60'
      } ${className}`}
    >
      {value || placeholder}
    </span>
  );
};

export const Certificate: React.FC<CertificateProps> = ({
  data,
  onChange,
  isEditable = true,
  scale = 1,
}) => {
  const updateField = <K extends keyof CertificateData>(key: K, value: CertificateData[K]) => {
    onChange({
      ...data,
      [key]: value,
    });
  };

  // Typography for changeable user data (Authentic Script Calligraphy matching demo photo)
  const getChangeableStyle = (customSize?: number): React.CSSProperties => {
    let fontFamily = "'Alex Brush', 'Great Vibes', cursive";
    if (data.changeableFont === 'calligraphy') {
      fontFamily = "'Great Vibes', cursive";
    } else if (data.changeableFont === 'arial') {
      fontFamily = 'Arial, Helvetica, sans-serif';
    } else if (data.changeableFont === 'times') {
      fontFamily = "'Libre Baskerville', 'Times New Roman', serif";
    } else if (data.changeableFont === 'gothic') {
      fontFamily = "'UnifrakturMaguntia', serif";
    } else if (data.changeableFont === 'courier') {
      fontFamily = "'Courier Prime', monospace";
    }

    const fontWeightMap = {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    };

    const baseSize = customSize || data.changeableFontSize || 24;

    return {
      fontFamily,
      fontWeight: fontWeightMap[data.changeableFontWeight] || 600,
      color: data.changeableTextColor || '#0b132b',
      fontSize: `${baseSize}px`,
      lineHeight: '1.15',
      letterSpacing: data.changeableFont === 'script' || data.changeableFont === 'calligraphy' ? '0.025em' : 'normal',
    };
  };

  // Typography for official formal fixed label phrases (Authentic Gothic Blackletter matching demo photo)
  const getLabelStyle = (extraSize?: number): React.CSSProperties => {
    if (data.labelFont === 'arial') {
      return {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontWeight: 600,
        fontSize: extraSize ? `${extraSize - 2}px` : '17px',
        color: '#1e293b',
        letterSpacing: 'normal',
      };
    }
    if (data.labelFont === 'times') {
      return {
        fontFamily: "'Libre Baskerville', 'Times New Roman', serif",
        fontWeight: 600,
        fontSize: extraSize ? `${extraSize - 1}px` : '18px',
        color: '#1e293b',
        letterSpacing: 'normal',
      };
    }
    // Default Gothic Old English font as in authentic demo photo
    return {
      fontFamily: "'UnifrakturMaguntia', serif",
      fontWeight: 400,
      fontSize: extraSize ? `${extraSize}px` : '21px',
      color: '#111827',
      letterSpacing: '0.02em',
    };
  };

  const getPaperBackground = () => {
    switch (data.paperTone) {
      case 'parchment':
        return 'bg-[#faf6ee]';
      case 'white':
        return 'bg-[#ffffff]';
      case 'cream':
      default:
        return 'bg-[#fdfbf7]';
    }
  };

  // Line gap style to allow generous breathing room
  const lineGapStyle = {
    marginBottom: `${Math.round(13 * data.lineSpacing)}px`,
  };

  return (
    <div
      id="ssc-certificate-print-area"
      style={{
        width: '1120px',
        height: '790px',
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
      }}
      className={`certificate-container relative shrink-0 overflow-hidden shadow-2xl select-text transition-all duration-200 border border-slate-300/40 ${getPaperBackground()}`}
    >
      {/* 1. Custom Scanned Photo Background (if user uploads one) */}
      {data.templateMode === 'custom' && data.customTemplateUrl && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
          <img
            src={data.customTemplateUrl}
            alt="Custom Certificate Template"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 2. Authentic Vector Guilloche Security Border */}
      {data.templateMode !== 'custom' && (
        <GuillocheBorder themeColor={data.themeColor} />
      )}

      {/* 3. Spirograph Rosette Watermark Background */}
      {data.templateMode !== 'custom' && (
        <SecurityWatermark
          themeColor={data.themeColor}
          opacity={data.watermarkOpacity}
          showRosettes={data.showRosettes}
          showSeal={data.showSealWatermark}
        />
      )}

      {/* 4. Structured Certificate Content Container */}
      <div
        className="relative z-10 w-full h-full flex flex-col justify-between"
        style={{
          padding: '52px 64px 44px 64px',
        }}
      >
        {/* ============================================================== */}
        {/* TOP HEADER SECTION (Institution, Country, Logo, Exam Title)     */}
        {/* ============================================================== */}
        <div className="w-full shrink-0">
          {/* Top Row: Serial & ID No. (Left) | Registration No. (Right) */}
          <div className="flex items-start justify-between text-xs font-serif text-slate-800 px-1">
            {/* Left Box: Serial Number & ID Number */}
            <div className="flex flex-col gap-0.5 text-left">
              {/* Serial No. with Red Stamp */}
              <div className="flex items-center gap-1 font-semibold text-slate-800 text-xs">
                <EditableWord
                  value={data.serialPrefix}
                  onChange={(val) => updateField('serialPrefix', val)}
                  isEditable={isEditable}
                  placeholder="Serial No. JBC-22-"
                  className="text-slate-800 font-serif text-xs font-semibold"
                />
                <span className="text-red-700 font-mono tracking-widest font-bold text-xs bg-red-50/80 px-1.5 py-0.5 rounded-xs border border-red-200 inline-flex items-center">
                  <EditableWord
                    value={data.serialNumber}
                    onChange={(val) => updateField('serialNumber', val)}
                    isEditable={isEditable}
                    placeholder="0184920"
                    className="text-red-700 font-mono tracking-widest font-bold text-xs"
                  />
                </span>
              </div>

              {/* ID No. / JBCS No. */}
              <div className="flex items-center gap-1 text-xs mt-0.5">
                <EditableWord
                  value={data.idNoLabel}
                  onChange={(val) => updateField('idNoLabel', val)}
                  isEditable={isEditable}
                  placeholder="ID No. :"
                  className="text-slate-800 font-medium text-[11px] font-serif"
                />
                <EditableWord
                  value={data.idNumber}
                  onChange={(val) => updateField('idNumber', val)}
                  isEditable={isEditable}
                  placeholder="210984712"
                  className="text-slate-900 font-bold text-[11px] font-mono"
                />
              </div>
            </div>

            {/* Right Box: Registration Number */}
            <div className="text-right font-serif flex items-center justify-end gap-1 text-slate-800 text-xs font-medium">
              <EditableWord
                value={data.registrationNoLabel}
                onChange={(val) => updateField('registrationNoLabel', val)}
                isEditable={isEditable}
                placeholder="Registration No. :"
                className="font-semibold whitespace-nowrap text-right text-xs"
              />
              <EditableWord
                value={data.registrationNo}
                onChange={(val) => updateField('registrationNo', val)}
                isEditable={isEditable}
                placeholder="1914205831/2021-2022"
                className="font-mono text-slate-900 font-bold text-xs text-right"
              />
            </div>
          </div>

          {/* Center: ARIYAN ICT HUB , KUSHTIA & BANGLADESH */}
          <div className="text-center mt-1 flex flex-col items-center">
            {/* 1. Formal Institution Name: ARIYAN ICT HUB , KUSHTIA */}
            <div className="flex items-center justify-center flex-wrap gap-1 leading-tight">
              <EditableWord
                value={data.institutionName}
                onChange={(val) => updateField('institutionName', val)}
                isEditable={isEditable}
                placeholder="ARIYAN ICT HUB"
                className="font-serif-header text-xl md:text-2xl font-black tracking-wider text-slate-900 uppercase text-center"
              />
              <span className="font-serif-header text-xl md:text-2xl font-black text-slate-900">,</span>
              <EditableWord
                value={data.institutionLocation}
                onChange={(val) => updateField('institutionLocation', val)}
                isEditable={isEditable}
                placeholder="KUSHTIA"
                className="font-serif-header text-xl md:text-2xl font-black tracking-wider text-slate-900 uppercase text-center"
              />
            </div>

            {/* 2. Middle Point: BANGLADESH */}
            <h2 className="font-serif tracking-[0.4em] text-xs md:text-sm font-bold text-slate-800 uppercase mt-0.5 leading-tight">
              <EditableWord
                value={data.country}
                onChange={(val) => updateField('country', val)}
                isEditable={isEditable}
                placeholder="BANGLADESH"
                className="font-serif tracking-[0.4em] text-xs md:text-sm font-bold text-slate-800 uppercase text-center"
              />
            </h2>

            {/* 3. Middle Logo (Official Crest) */}
            {data.showLogo && (
              <div className="my-1 flex items-center justify-center">
                <BoardLogo customLogoUrl={data.logoUrl} size={50} />
              </div>
            )}

            {/* 4. Course / Examination Title: Secondary School Certificate Examination 2023 */}
            <div className="mt-1 text-center w-full flex items-center justify-center">
              <EditableWord
                value={data.examTitle || 'Secondary School Certificate Examination 2023'}
                onChange={(val) => updateField('examTitle', val)}
                isEditable={isEditable}
                placeholder="Secondary School Certificate Examination 2023"
                fontStyle={{
                  fontFamily: "'UnifrakturMaguntia', serif",
                  fontSize: '27px',
                  color: '#0f172a',
                  letterSpacing: '0.02em',
                }}
                className="w-full max-w-[920px] font-gothic text-2xl md:text-[27px] text-slate-950 font-normal tracking-wide text-center py-0.5"
              />
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MAIN CERTIFICATE BODY SECTION                                   */}
        {/* Exactly matching the authentic demo photo layout and pattern   */}
        {/* ============================================================== */}
        <div
          className="my-auto py-1 flex flex-col items-center justify-center text-center w-full max-w-[940px] mx-auto"
          style={{
            transform: `scale(${data.fontSizeScale})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Line 1: This is to certify that [Tanvir Hasan Chowdhury] */}
          <div
            className="w-full flex items-baseline justify-center whitespace-nowrap leading-none"
            style={lineGapStyle}
          >
            <span style={getLabelStyle(21)} className="mr-2 select-none">
              {data.certifyIntro}
            </span>
            <EditableWord
              value={data.studentName}
              onChange={(val) => updateField('studentName', val)}
              placeholder="Tanvir Hasan Chowdhury"
              isEditable={isEditable}
              fontStyle={getChangeableStyle(data.changeableFontSize + 2)}
              underlineStyle={data.changeableUnderline}
              className="font-bold tracking-wide"
            />
          </div>

          {/* Line 2: son/daughter of [Md. Rafiqul Islam] and [Mst. Salma Khatun] */}
          <div
            className="w-full flex items-baseline justify-center whitespace-nowrap leading-none"
            style={lineGapStyle}
          >
            <span style={getLabelStyle(20)} className="mr-1.5 select-none">
              {data.parentagePrefix}
            </span>
            <EditableWord
              value={data.fatherName}
              onChange={(val) => updateField('fatherName', val)}
              placeholder="Md. Rafiqul Islam"
              isEditable={isEditable}
              fontStyle={getChangeableStyle()}
              underlineStyle={data.changeableUnderline}
            />
            <span style={getLabelStyle(20)} className="mx-2 select-none">
              and
            </span>
            <EditableWord
              value={data.motherName}
              onChange={(val) => updateField('motherName', val)}
              placeholder="Mst. Salma Khatun"
              isEditable={isEditable}
              fontStyle={getChangeableStyle()}
              underlineStyle={data.changeableUnderline}
            />
          </div>

          {/* Line 3: of [Collectorate School And College, Kushtia] */}
          <div
            className="w-full flex items-baseline justify-center whitespace-nowrap leading-none"
            style={lineGapStyle}
          >
            <span style={getLabelStyle(20)} className="mr-2 select-none">
              {data.schoolPrefix}
            </span>
            <EditableWord
              value={data.schoolName}
              onChange={(val) => updateField('schoolName', val)}
              placeholder="Collectorate School And College, Kushtia"
              isEditable={isEditable}
              fontStyle={getChangeableStyle(data.changeableFontSize + 1)}
              underlineStyle={data.changeableUnderline}
              className="tracking-wide"
            />
          </div>

          {/* Line 4: bearing Roll Kushtia - 105 No. 148520 duly passed the */}
          <div
            className="w-full flex items-baseline justify-center whitespace-nowrap leading-none"
            style={lineGapStyle}
          >
            <span style={getLabelStyle(20)} className="mr-2 select-none">
              {data.rollPrefix}
            </span>
            <EditableWord
              value={data.centerCode}
              onChange={(val) => updateField('centerCode', val)}
              placeholder="Kushtia - 105"
              isEditable={isEditable}
              fontStyle={getChangeableStyle()}
              underlineStyle={data.changeableUnderline}
            />
            <span style={getLabelStyle(20)} className="mx-2 select-none">
              No.
            </span>
            <EditableWord
              value={data.rollNo}
              onChange={(val) => updateField('rollNo', val)}
              placeholder="148520"
              isEditable={isEditable}
              fontStyle={getChangeableStyle()}
              underlineStyle={data.changeableUnderline}
            />
            <span style={getLabelStyle(20)} className="ml-2 select-none">
              {data.passedPrefix}
            </span>
          </div>

          {/* Line 5: Secondary School Certificate Examination of 2023 in Humanities Group and */}
          <div
            className="w-full flex items-baseline justify-center whitespace-nowrap leading-none"
            style={lineGapStyle}
          >
            <span style={getLabelStyle(20)} className="mr-1.5 select-none">
              {data.examNamePrefix}
            </span>
            <EditableWord
              value={data.examYear}
              onChange={(val) => updateField('examYear', val)}
              placeholder="2023"
              isEditable={isEditable}
              fontStyle={getChangeableStyle()}
              underlineStyle={data.changeableUnderline}
            />
            <span style={getLabelStyle(20)} className="mx-2 select-none">
              {data.inGroupPrefix}
            </span>
            <EditableWord
              value={data.groupName}
              onChange={(val) => updateField('groupName', val)}
              placeholder="Humanities"
              isEditable={isEditable}
              fontStyle={getChangeableStyle()}
              underlineStyle={data.changeableUnderline}
            />
            <span style={getLabelStyle(20)} className="ml-1.5 select-none">
              {data.groupSuffix}
            </span>
          </div>

          {/* Line 6: obtained G.P.A. 4.22 in the scale of 5.00. */}
          <div
            className="w-full flex items-baseline justify-center whitespace-nowrap leading-none"
            style={lineGapStyle}
          >
            <span style={getLabelStyle(20)} className="mr-2 select-none">
              {data.gpaPrefix}
            </span>
            <EditableWord
              value={data.gpa}
              onChange={(val) => updateField('gpa', val)}
              placeholder="4.22"
              isEditable={isEditable}
              fontStyle={getChangeableStyle(data.changeableFontSize + 2)}
              underlineStyle={data.changeableUnderline}
              className="font-bold font-mono"
            />
            <span style={getLabelStyle(20)} className="ml-2 select-none">
              {data.gpaScalePrefix} {data.gpaScale}
            </span>
          </div>

          {/* Line 7: His/Her date of birth as recorded is Fourth July Two Thousand And */}
          <div
            className="w-full flex items-baseline justify-center whitespace-nowrap leading-none"
            style={{ marginBottom: data.dobInWordsLine2 ? `${Math.round(9 * data.lineSpacing)}px` : '0px' }}
          >
            <span style={getLabelStyle(20)} className="mr-2 select-none">
              {data.dobPrefix}
            </span>
            <EditableWord
              value={data.dobInWordsLine1}
              onChange={(val) => updateField('dobInWordsLine1', val)}
              placeholder="Fourth July Two Thousand And"
              isEditable={isEditable}
              fontStyle={getChangeableStyle()}
              underlineStyle={data.changeableUnderline}
            />
          </div>

          {/* Line 8: Five. (Centered right below line 7 exactly as in demo photo) */}
          {data.dobInWordsLine2 && (
            <div className="w-full flex items-baseline justify-center whitespace-nowrap leading-none">
              <EditableWord
                value={data.dobInWordsLine2}
                onChange={(val) => updateField('dobInWordsLine2', val)}
                placeholder="Five."
                isEditable={isEditable}
                fontStyle={getChangeableStyle()}
                underlineStyle={data.changeableUnderline}
              />
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* BOTTOM FOOTER (Place: Jashore, Result Date, and 3 Signatures)  */}
        {/* ============================================================== */}
        <div className="w-full shrink-0 pt-2 border-t border-slate-300/60 px-1">
          <div className="grid grid-cols-12 items-end">
            {/* Left: Place (Jashore) & Result Date (28 July, 2023) */}
            <div className="col-span-4 flex flex-col text-left font-serif text-xs text-slate-800">
              <div className="font-bold text-slate-900 text-sm">
                <EditableWord
                  value={data.issuePlace}
                  onChange={(val) => updateField('issuePlace', val)}
                  isEditable={isEditable}
                  placeholder="Jashore"
                  className="font-bold text-slate-900 text-sm text-left"
                />
              </div>

              <div className="flex items-center gap-1 mt-1 text-slate-800 font-medium text-xs">
                <EditableWord
                  value={data.resultDateLabel}
                  onChange={(val) => updateField('resultDateLabel', val)}
                  isEditable={isEditable}
                  placeholder="Date of Publication of Result :"
                  className="font-semibold text-slate-800 text-left text-xs"
                />
                <EditableWord
                  value={data.resultDate}
                  onChange={(val) => updateField('resultDate', val)}
                  isEditable={isEditable}
                  placeholder="28 July, 2023"
                  className="font-bold text-slate-900 text-left text-xs"
                />
              </div>
            </div>

            {/* Middle & Right: The 3 Signatures */}
            <div className="col-span-8 grid grid-cols-3 items-end gap-2 text-center">
              {/* 1. Compared */}
              <SignatureBlock
                signatureId="compared"
                data={data.signatures.compared}
                onUpdate={(up) =>
                  onChange({
                    ...data,
                    signatures: { ...data.signatures, compared: up },
                  })
                }
                isEditable={isEditable}
              />

              {/* 2. Checked */}
              <SignatureBlock
                signatureId="checked"
                data={data.signatures.checked}
                onUpdate={(up) =>
                  onChange({
                    ...data,
                    signatures: { ...data.signatures, checked: up },
                  })
                }
                isEditable={isEditable}
              />

              {/* 3. Controller of Examinations */}
              <SignatureBlock
                signatureId="controller"
                data={data.signatures.controller}
                onUpdate={(up) =>
                  onChange({
                    ...data,
                    signatures: { ...data.signatures, controller: up },
                  })
                }
                isEditable={isEditable}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
