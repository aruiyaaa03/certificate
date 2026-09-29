import React, { useState, useRef } from 'react';
import {
  CertificateData,
  INITIAL_CERTIFICATE_DATA,
} from '../types';
import {
  User,
  GraduationCap,
  PenTool,
  Sliders,
  Printer,
  FileDown,
  Image as ImageIcon,
  Sparkles,
  RotateCcw,
  Calendar,
  Building,
  Upload,
  CheckCircle2,
  Type,
  Palette,
  PenLine,
} from 'lucide-react';
import { convertDateToCertificateWords } from '../utils/numberToWords';
import { SignatureModal } from './SignatureModal';
import { DefaultSignatures } from './Signatures';

interface EditorSidebarProps {
  data: CertificateData;
  onChange: (data: CertificateData) => void;
  onExportPdf: () => void;
  onPrint: () => void;
  onExportPng: () => void;
  isExporting: boolean;
  exportStatus: string;
}

type TabKey = 'student' | 'exam' | 'signatures' | 'style' | 'presets';

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  data,
  onChange,
  onExportPdf,
  onPrint,
  onExportPng,
  isExporting,
  exportStatus,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('student');
  const [dobPickerValue, setDobPickerValue] = useState('2005-07-04');
  const [signatureModalState, setSignatureModalState] = useState<{
    isOpen: boolean;
    signatureId: 'compared' | 'checked' | 'controller';
    mode: 'draw' | 'upload' | 'default';
  }>({
    isOpen: false,
    signatureId: 'compared',
    mode: 'draw',
  });
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const handleSignatureModalSave = (result: {
    type: 'drawn' | 'custom' | 'default';
    imageData?: string;
  }) => {
    const key = signatureModalState.signatureId;
    onChange({
      ...data,
      signatures: {
        ...data.signatures,
        [key]: {
          ...data.signatures[key],
          type: result.type,
          imageData: result.imageData,
        },
      },
    });
  };

  const updateField = <K extends keyof CertificateData>(key: K, value: CertificateData[K]) => {
    onChange({
      ...data,
      [key]: value,
    });
  };

  const handleSignatureUpload = (
    sigKey: 'compared' | 'checked' | 'controller',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onChange({
        ...data,
        signatures: {
          ...data.signatures,
          [sigKey]: {
            ...data.signatures[sigKey],
            type: 'custom',
            imageData: dataUrl,
          },
        },
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDobDateChange = (dateVal: string) => {
    setDobPickerValue(dateVal);
    const converted = convertDateToCertificateWords(dateVal);
    onChange({
      ...data,
      dobInWordsLine1: converted.line1,
      dobInWordsLine2: converted.line2,
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      updateField('logoUrl', dataUrl);
      updateField('showLogo', true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Preset configurations
  const loadPreset = (presetName: 'ariyan' | 'demo' | 'dhaka' | 'rajshahi' | 'blank') => {
    if (presetName === 'ariyan') {
      onChange(INITIAL_CERTIFICATE_DATA);
    } else if (presetName === 'demo') {
      onChange({
        ...INITIAL_CERTIFICATE_DATA,
        institutionName: 'BOARD OF INTERMEDIATE AND SECONDARY EDUCATION',
        institutionLocation: 'JASHORE',
        schoolName: 'Collectorate School And College, Kushtia',
        serialPrefix: 'Serial No. JBC-22-',
        serialNumber: '0184920',
        idNoLabel: 'JBCS No. :',
        idNumber: '210984712',
        registrationNoLabel: 'Registration No. :',
        registrationNo: '1914205831/2021-2022',
        studentName: 'Tanvir Hasan Chowdhury',
        fatherName: 'Md. Rafiqul Islam',
        motherName: 'Mst. Salma Khatun',
        centerCode: 'Kushtia - 105',
        rollNo: '148520',
        examYear: '2023',
        groupName: 'Humanities',
        gpa: '4.22',
        issuePlace: 'Jashore',
        resultDate: '28 July, 2023',
        dobInWordsLine1: 'Fourth July Two Thousand And',
        dobInWordsLine2: 'Five.',
        changeableFont: 'script',
        labelFont: 'gothic',
        themeColor: 'magenta',
      });
    } else if (presetName === 'dhaka') {
      onChange({
        ...INITIAL_CERTIFICATE_DATA,
        institutionName: 'DHAKA RESIDENTIAL MODEL COLLEGE',
        institutionLocation: 'DHAKA',
        schoolName: 'Dhaka Residential Model College, Mohammadpur',
        idNumber: 'DRMC-2023-A01',
        serialPrefix: 'Serial No. DBC-',
        serialNumber: '0845192',
        registrationNo: '2112349081/2022-2023',
        studentName: 'Tasnim Ahmed Chowdhury',
        fatherName: 'Rafiqul Islam Chowdhury',
        motherName: 'Nasrin Sultana',
        centerCode: 'Dhaka - 105',
        rollNo: '118492',
        examYear: '2023',
        groupName: 'Science',
        gpa: '5.00',
        issuePlace: 'Dhaka',
        resultDate: '28 July, 2023',
        dobInWordsLine1: 'Twelfth March Two Thousand And Six.',
        dobInWordsLine2: '',
        themeColor: 'magenta',
      });
    } else if (presetName === 'rajshahi') {
      onChange({
        ...INITIAL_CERTIFICATE_DATA,
        institutionName: 'RAJSHAHI COLLEGIATE SCHOOL',
        institutionLocation: 'RAJSHAHI',
        schoolName: 'Rajshahi Collegiate School, Rajshahi',
        idNumber: 'RCS-2023-C02',
        serialPrefix: 'Serial No. RBC-',
        serialNumber: '0519284',
        registrationNo: '1918374621/2022-2023',
        studentName: 'Sadia Jahan Mim',
        fatherName: 'Mizanur Rahman',
        motherName: 'Salma Begum',
        centerCode: 'Rajshahi - 101',
        rollNo: '204910',
        examYear: '2023',
        groupName: 'Humanities',
        gpa: '4.89',
        issuePlace: 'Rajshahi',
        resultDate: '28 July, 2023',
        dobInWordsLine1: 'Fifteenth August Two Thousand And Five.',
        dobInWordsLine2: '',
        themeColor: 'maroon',
      });
    } else if (presetName === 'blank') {
      onChange({
        ...INITIAL_CERTIFICATE_DATA,
        studentName: 'Student Name Here',
        fatherName: "Father's Name",
        motherName: "Mother's Name",
        schoolName: 'Institute Name Here',
        centerCode: 'Kushtia - 271',
        rollNo: '000000',
        idNumber: 'AIC-0000',
        registrationNo: '0000000000/2022-2023',
        gpa: '4.22',
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 w-full max-w-md shadow-lg select-none">
      {/* Top Header / Export Actions */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
            <h2 className="font-bold text-slate-900 text-sm tracking-tight">
              ARIYAN ICT HUB Studio
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Kushtia, Bangladesh</span>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {/* Save to PDF */}
          <button
            type="button"
            onClick={onExportPdf}
            disabled={isExporting}
            className="flex flex-col items-center justify-center p-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 active:scale-95 disabled:opacity-50 transition shadow-xs text-xs font-semibold cursor-pointer"
            title="Download high-resolution PDF certificate"
          >
            <FileDown className="w-4 h-4 mb-0.5" />
            <span>Save to PDF</span>
          </button>

          {/* Print */}
          <button
            type="button"
            onClick={onPrint}
            disabled={isExporting}
            className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 active:scale-95 disabled:opacity-50 transition shadow-xs text-xs font-semibold cursor-pointer"
            title="Print certificate directly"
          >
            <Printer className="w-4 h-4 mb-0.5" />
            <span>Print</span>
          </button>

          {/* Save as PNG */}
          <button
            type="button"
            onClick={onExportPng}
            disabled={isExporting}
            className="flex flex-col items-center justify-center p-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 active:scale-95 disabled:opacity-50 transition shadow-xs text-xs font-medium cursor-pointer"
            title="Download crisp 300 DPI image"
          >
            <ImageIcon className="w-4 h-4 mb-0.5 text-slate-600" />
            <span>Save Image</span>
          </button>
        </div>

        {exportStatus && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-md border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{exportStatus}</span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 px-2 text-xs font-medium text-slate-600 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('student')}
          className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'student'
              ? 'border-rose-600 text-rose-600 font-semibold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Student Info</span>
        </button>

        <button
          onClick={() => setActiveTab('exam')}
          className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'exam'
              ? 'border-rose-600 text-rose-600 font-semibold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Institute & Exam</span>
        </button>

        <button
          onClick={() => setActiveTab('signatures')}
          className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'signatures'
              ? 'border-rose-600 text-rose-600 font-semibold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Signatures</span>
        </button>

        <button
          onClick={() => setActiveTab('style')}
          className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'style'
              ? 'border-rose-600 text-rose-600 font-semibold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Font & Design</span>
        </button>

        <button
          onClick={() => setActiveTab('presets')}
          className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'presets'
              ? 'border-rose-600 text-rose-600 font-semibold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Presets</span>
        </button>
      </div>

      {/* Tab Contents (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* ================= TAB 1: STUDENT INFO ================= */}
        {activeTab === 'student' && (
          <div className="space-y-3.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Student Full Name (STUDENTS NAME)
              </label>
              <input
                type="text"
                value={data.studentName}
                onChange={(e) => updateField('studentName', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:border-rose-500 focus:bg-white focus:outline-hidden text-slate-900 font-medium"
                placeholder="Tanvir Hasan Chowdhury"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Father's Name (students father's name)
                </label>
                <input
                  type="text"
                  value={data.fatherName}
                  onChange={(e) => updateField('fatherName', e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-md focus:border-rose-500 focus:bg-white focus:outline-hidden text-slate-900"
                  placeholder="Md. Rafiqul Islam"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mother's Name (student mother's name)
                </label>
                <input
                  type="text"
                  value={data.motherName}
                  onChange={(e) => updateField('motherName', e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-md focus:border-rose-500 focus:bg-white focus:outline-hidden text-slate-900"
                  placeholder="Mst. Salma Khatun"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span>Institute Name (of Institute name)</span>
              </label>
              <input
                type="text"
                value={data.schoolName}
                onChange={(e) => updateField('schoolName', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:border-rose-500 focus:bg-white focus:outline-hidden text-slate-900 font-semibold"
                placeholder="Arian ICT Corner, Kushtia"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Center / Roll Place (bearing Roll Kushtia - 105)
                </label>
                <input
                  type="text"
                  value={data.centerCode}
                  onChange={(e) => updateField('centerCode', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-900 font-bold"
                  placeholder="Kushtia - 105"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Roll No. (No. Student roll no)
                </label>
                <input
                  type="text"
                  value={data.rollNo}
                  onChange={(e) => updateField('rollNo', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md font-mono text-slate-900 font-bold"
                  placeholder="148520"
                />
              </div>
            </div>

            {/* Date of Birth Auto-Generator */}
            <div className="p-3 bg-rose-50/60 rounded-lg border border-rose-100 space-y-2">
              <label className="block font-semibold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-600" />
                  <span>Date of Birth (date of birth date)</span>
                </span>
                <span className="text-[10px] text-rose-700 font-normal">
                  Auto words converter
                </span>
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dobPickerValue}
                  onChange={(e) => handleDobDateChange(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-800 text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleDobDateChange(dobPickerValue)}
                  className="px-2.5 py-1.5 bg-rose-600 text-white rounded text-[11px] font-medium hover:bg-rose-700 transition"
                >
                  Convert
                </button>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5">
                  Date of Birth Text (Line 1):
                </span>
                <input
                  type="text"
                  value={data.dobInWordsLine1}
                  onChange={(e) => updateField('dobInWordsLine1', e.target.value)}
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                  placeholder="Fourth July Two Thousand And"
                />
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5">
                  Date of Birth Text (Line 2):
                </span>
                <input
                  type="text"
                  value={data.dobInWordsLine2}
                  onChange={(e) => updateField('dobInWordsLine2', e.target.value)}
                  className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs"
                  placeholder="Five."
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: EXAM & INSTITUTION ================= */}
        {activeTab === 'exam' && (
          <div className="space-y-3.5">
            {/* ARIYAN ICT HUB (EDITABLE) , KUSHTIA (EDITABLE) */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Header Institution Name
                </label>
                <input
                  type="text"
                  value={data.institutionName}
                  onChange={(e) => updateField('institutionName', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:border-rose-500 font-bold text-slate-900 text-xs"
                  placeholder="ARIYAN ICT HUB"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  value={data.institutionLocation}
                  onChange={(e) => updateField('institutionLocation', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:border-rose-500 font-bold text-slate-900 text-xs"
                  placeholder="KUSHTIA"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Country (Middle Point)
              </label>
              <input
                type="text"
                value={data.country}
                onChange={(e) => updateField('country', e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-900 font-bold text-xs text-center"
                placeholder="BANGLADESH"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Examination Title (EDITABLE)
              </label>
              <input
                type="text"
                value={data.examTitle}
                onChange={(e) => updateField('examTitle', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 font-medium"
                placeholder="Secondary School Certificate Examination 2023"
              />
            </div>

            {/* Serial No, ID No., and Registration No. */}
            <div className="p-3 bg-indigo-50/70 rounded-lg border border-indigo-200 space-y-2.5">
              <span className="font-bold text-indigo-950 block text-xs">
                Serial No., ID No. & Registration No.
              </span>

              {/* Serial No. */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-700 mb-0.5 font-medium">
                    Serial No. Prefix:
                  </label>
                  <input
                    type="text"
                    value={data.serialPrefix}
                    onChange={(e) => updateField('serialPrefix', e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-900 font-serif text-xs"
                    placeholder="Serial No. AIC-"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-red-700 font-bold mb-0.5">
                    Serial No. (Red Stamp):
                  </label>
                  <input
                    type="text"
                    value={data.serialNumber}
                    onChange={(e) => updateField('serialNumber', e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-red-300 rounded text-red-700 font-mono text-xs font-bold tracking-wider"
                    placeholder="0184920"
                  />
                </div>
              </div>

              {/* ID No. */}
              <div>
                <label className="block text-[11px] text-indigo-950 font-semibold mb-0.5">
                  ID No. (ID No. : EDITABLE):
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={data.idNoLabel}
                    onChange={(e) => updateField('idNoLabel', e.target.value)}
                    className="w-1/3 px-2 py-1 bg-white border border-slate-300 rounded text-slate-900 font-medium text-xs"
                    placeholder="ID No. :"
                  />
                  <input
                    type="text"
                    value={data.idNumber}
                    onChange={(e) => updateField('idNumber', e.target.value)}
                    className="w-2/3 px-2 py-1 bg-white border border-slate-300 rounded text-indigo-950 font-bold font-mono text-xs"
                    placeholder="210984712"
                  />
                </div>
              </div>

              {/* Registration No. */}
              <div>
                <label className="block text-[11px] text-slate-700 font-semibold mb-0.5">
                  Registration No. (Registration No. : EDITABLE):
                </label>
                <input
                  type="text"
                  value={data.registrationNo}
                  onChange={(e) => updateField('registrationNo', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-mono text-xs font-bold"
                  placeholder="1914205831/2021-2022"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Group (Humanities editable)
                </label>
                <input
                  type="text"
                  value={data.groupName}
                  onChange={(e) => updateField('groupName', e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 font-bold"
                  placeholder="Humanities"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Exam Year (2023 editable)
                </label>
                <input
                  type="text"
                  value={data.examYear}
                  onChange={(e) => updateField('examYear', e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 font-medium"
                  placeholder="2023"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Obtained GPA (4.22 editable)
                </label>
                <input
                  type="text"
                  value={data.gpa}
                  onChange={(e) => updateField('gpa', e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-md font-bold text-slate-900 text-sm"
                  placeholder="4.22"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Scale of GPA
                </label>
                <input
                  type="text"
                  value={data.gpaScale}
                  onChange={(e) => updateField('gpaScale', e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-md font-bold text-slate-900 text-sm"
                  placeholder="5.00."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Place of Issue (Jashore editable)
                </label>
                <input
                  type="text"
                  value={data.issuePlace}
                  onChange={(e) => updateField('issuePlace', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-900 font-bold"
                  placeholder="Jashore"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Result Date (28 July, 2023)
                </label>
                <input
                  type="text"
                  value={data.resultDate}
                  onChange={(e) => updateField('resultDate', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-900"
                  placeholder="28 July, 2023"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: SIGNATURES & LOGO ================= */}
        {activeTab === 'signatures' && (
          <div className="space-y-4">
            <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100">
              <span className="font-bold text-indigo-950 block text-xs mb-1">
                Official Signatures & Seal [স্বাক্ষর ব্যবস্থাপনা]
              </span>
              <p className="text-[11px] text-indigo-700 leading-relaxed">
                প্রতিটি স্বাক্ষরের জন্য আপনি ডিজিটালভাবে স্ক্রিনে আঁকতে পারেন (Draw), কাগজের স্বাক্ষরের ছবি আপলোড করতে পারেন (Upload), অথবা বোর্ডের অফিসিয়াল ডিফল্ট স্বাক্ষর (Default) রাখতে পারেন।
              </p>
            </div>

            {/* Signature Slot 1: Compared */}
            <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/90 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">1. Compared Signature [স্বাক্ষর]</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    data.signatures.compared.type === 'drawn'
                      ? 'bg-indigo-100 text-indigo-700'
                      : data.signatures.compared.type === 'custom'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {data.signatures.compared.type === 'drawn'
                    ? '✍️ Drawn'
                    : data.signatures.compared.type === 'custom'
                    ? '📤 Uploaded'
                    : 'Official Default'}
                </span>
              </div>

              {/* Preview Thumbnail */}
              <div
                onClick={() => setSignatureModalState({ isOpen: true, signatureId: 'compared', mode: 'draw' })}
                className="h-14 bg-white rounded-lg border border-slate-200 p-2 flex items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-slate-50/50 transition group relative"
                title="Click to draw or change signature"
              >
                {data.signatures.compared.imageData ? (
                  <img
                    src={data.signatures.compared.imageData}
                    alt={data.signatures.compared.label}
                    className="max-h-11 max-w-[140px] object-contain"
                  />
                ) : (
                  <DefaultSignatures.compared />
                )}
                <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition text-[10px] font-semibold text-indigo-900">
                  Click to Edit
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Signature Label (Compared):
                </label>
                <input
                  type="text"
                  value={data.signatures.compared.label}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      signatures: {
                        ...data.signatures,
                        compared: { ...data.signatures.compared, label: e.target.value },
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-500"
                  placeholder="Compared"
                />
              </div>

              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setSignatureModalState({ isOpen: true, signatureId: 'compared', mode: 'draw' })}
                  className="flex items-center justify-center gap-1 py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[11px] font-bold transition cursor-pointer"
                >
                  <PenTool className="w-3 h-3" />
                  <span>Draw (আঁকুন)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSignatureModalState({ isOpen: true, signatureId: 'compared', mode: 'upload' })}
                  className="flex items-center justify-center gap-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold transition cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload (আপলোড)</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...data,
                      signatures: {
                        ...data.signatures,
                        compared: { ...data.signatures.compared, type: 'default', imageData: undefined },
                      },
                    })
                  }
                  className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Default</span>
                </button>
              </div>
            </div>

            {/* Signature Slot 2: Checked */}
            <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/90 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">2. Checked Signature [স্বাক্ষর]</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    data.signatures.checked.type === 'drawn'
                      ? 'bg-indigo-100 text-indigo-700'
                      : data.signatures.checked.type === 'custom'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {data.signatures.checked.type === 'drawn'
                    ? '✍️ Drawn'
                    : data.signatures.checked.type === 'custom'
                    ? '📤 Uploaded'
                    : 'Official Default'}
                </span>
              </div>

              {/* Preview Thumbnail */}
              <div
                onClick={() => setSignatureModalState({ isOpen: true, signatureId: 'checked', mode: 'draw' })}
                className="h-14 bg-white rounded-lg border border-slate-200 p-2 flex items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-slate-50/50 transition group relative"
                title="Click to draw or change signature"
              >
                {data.signatures.checked.imageData ? (
                  <img
                    src={data.signatures.checked.imageData}
                    alt={data.signatures.checked.label}
                    className="max-h-11 max-w-[140px] object-contain"
                  />
                ) : (
                  <DefaultSignatures.checked />
                )}
                <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition text-[10px] font-semibold text-indigo-900">
                  Click to Edit
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Signature Label (Checked):
                </label>
                <input
                  type="text"
                  value={data.signatures.checked.label}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      signatures: {
                        ...data.signatures,
                        checked: { ...data.signatures.checked, label: e.target.value },
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-500"
                  placeholder="Checked"
                />
              </div>

              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setSignatureModalState({ isOpen: true, signatureId: 'checked', mode: 'draw' })}
                  className="flex items-center justify-center gap-1 py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[11px] font-bold transition cursor-pointer"
                >
                  <PenTool className="w-3 h-3" />
                  <span>Draw (আঁকুন)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSignatureModalState({ isOpen: true, signatureId: 'checked', mode: 'upload' })}
                  className="flex items-center justify-center gap-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold transition cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload (আপলোড)</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...data,
                      signatures: {
                        ...data.signatures,
                        checked: { ...data.signatures.checked, type: 'default', imageData: undefined },
                      },
                    })
                  }
                  className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Default</span>
                </button>
              </div>
            </div>

            {/* Signature Slot 3: Controller of Examinations */}
            <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/90 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">
                  3. Controller of Examinations [স্বাক্ষর]
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    data.signatures.controller.type === 'drawn'
                      ? 'bg-indigo-100 text-indigo-700'
                      : data.signatures.controller.type === 'custom'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {data.signatures.controller.type === 'drawn'
                    ? '✍️ Drawn'
                    : data.signatures.controller.type === 'custom'
                    ? '📤 Uploaded'
                    : 'Official Default'}
                </span>
              </div>

              {/* Preview Thumbnail */}
              <div
                onClick={() => setSignatureModalState({ isOpen: true, signatureId: 'controller', mode: 'draw' })}
                className="h-14 bg-white rounded-lg border border-slate-200 p-2 flex items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-slate-50/50 transition group relative"
                title="Click to draw or change signature"
              >
                {data.signatures.controller.imageData ? (
                  <img
                    src={data.signatures.controller.imageData}
                    alt={data.signatures.controller.label}
                    className="max-h-11 max-w-[140px] object-contain"
                  />
                ) : (
                  <DefaultSignatures.controller />
                )}
                <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition text-[10px] font-semibold text-indigo-900">
                  Click to Edit
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Signature Label (Controller of Examinations):
                </label>
                <input
                  type="text"
                  value={data.signatures.controller.label}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      signatures: {
                        ...data.signatures,
                        controller: { ...data.signatures.controller, label: e.target.value },
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-500"
                  placeholder="Controller of Examinations"
                />
              </div>

              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setSignatureModalState({ isOpen: true, signatureId: 'controller', mode: 'draw' })}
                  className="flex items-center justify-center gap-1 py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[11px] font-bold transition cursor-pointer"
                >
                  <PenTool className="w-3 h-3" />
                  <span>Draw (আঁকুন)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSignatureModalState({ isOpen: true, signatureId: 'controller', mode: 'upload' })}
                  className="flex items-center justify-center gap-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold transition cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload (আপলোড)</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...data,
                      signatures: {
                        ...data.signatures,
                        controller: { ...data.signatures.controller, type: 'default', imageData: undefined },
                      },
                    })
                  }
                  className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Default</span>
                </button>
              </div>
            </div>

            {/* Center Logo / Crest Upload */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">Certificate Logo / Crest</span>
                <label className="flex items-center gap-1 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={data.showLogo}
                    onChange={(e) => updateField('showLogo', e.target.checked)}
                    className="rounded text-rose-600"
                  />
                  <span>Show</span>
                </label>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 rounded hover:bg-slate-100 transition text-slate-700 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Logo from File</span>
                </button>
                {data.logoUrl && (
                  <button
                    type="button"
                    onClick={() => updateField('logoUrl', undefined)}
                    className="text-rose-600 hover:underline text-[11px] cursor-pointer"
                  >
                    Reset to Default Logo
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: FONT & DESIGN ================= */}
        {activeTab === 'style' && (
          <div className="space-y-4">
            {/* 1. Changeable Text Font Family (Arial default) */}
            <div className="p-3 bg-indigo-50/70 rounded-lg border border-indigo-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-indigo-950 text-xs flex items-center gap-1">
                  <Type className="w-3.5 h-3.5 text-indigo-700" />
                  <span>Changeable Text Font (পরিবর্তনযোগ্য লেখার ফন্ট)</span>
                </label>
                <span className="text-[10px] bg-indigo-200/80 text-indigo-900 px-1.5 py-0.5 rounded font-bold">
                  {data.changeableFont.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Default is set to Arial. You can change font family, weight, and style anytime:
              </p>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'arial', name: 'Arial (Default)', sample: 'Tanvir Hasan', family: 'Arial, sans-serif' },
                  { id: 'times', name: 'Times / Serif', sample: 'Tanvir Hasan', family: "'Libre Baskerville', serif" },
                  { id: 'calligraphy', name: 'Calligraphy (Script)', sample: 'Tanvir Hasan', family: "'Great Vibes', cursive" },
                  { id: 'script', name: 'Cursive (Alex Brush)', sample: 'Tanvir Hasan', family: "'Alex Brush', cursive" },
                  { id: 'gothic', name: 'Gothic Old English', sample: 'Tanvir Hasan', family: "'UnifrakturMaguntia', serif" },
                  { id: 'courier', name: 'Courier Typewriter', sample: 'Tanvir Hasan', family: "'Courier Prime', monospace" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateField('changeableFont', item.id as any)}
                    className={`p-2 rounded-md border text-left transition cursor-pointer ${
                      data.changeableFont === item.id
                        ? 'border-indigo-600 bg-white font-bold text-indigo-900 shadow-xs'
                        : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                    }`}
                  >
                    <span className="text-xs font-semibold block">{item.name}</span>
                    <span
                      className="text-xs block mt-0.5 truncate text-slate-800"
                      style={{ fontFamily: item.family }}
                    >
                      {item.sample}
                    </span>
                  </button>
                ))}
              </div>

              {/* Font Weight & Underline */}
              <div className="pt-2 border-t border-indigo-200/60 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-indigo-950 font-medium mb-1">
                    Font Weight:
                  </label>
                  <select
                    value={data.changeableFontWeight}
                    onChange={(e) => updateField('changeableFontWeight', e.target.value as any)}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-900 text-xs font-medium"
                  >
                    <option value="normal">Normal (400)</option>
                    <option value="medium">Medium (500)</option>
                    <option value="semibold">Semi-Bold (600)</option>
                    <option value="bold">Bold (700)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-indigo-950 font-medium mb-1">
                    Underline Style:
                  </label>
                  <select
                    value={data.changeableUnderline || 'dotted'}
                    onChange={(e) => updateField('changeableUnderline', e.target.value as any)}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-900 text-xs font-medium"
                  >
                    <option value="dotted">Dotted (ডটেড)</option>
                    <option value="solid">Solid Line (টানা দাগ)</option>
                    <option value="none">No Underline (দাগহীন)</option>
                  </select>
                </div>
              </div>

              {/* Text Ink Color */}
              <div className="pt-2 border-t border-indigo-200/60">
                <label className="block text-[11px] text-indigo-950 font-medium mb-1 flex items-center gap-1">
                  <Palette className="w-3 h-3" />
                  <span>Text Ink Color:</span>
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { id: '#0f172a', name: 'Black' },
                    { id: '#1e3a8a', name: 'Navy Blue' },
                    { id: '#1e293b', name: 'Charcoal' },
                    { id: '#831843', name: 'Burgundy' },
                    { id: '#065f46', name: 'Dark Green' },
                  ].map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => updateField('changeableTextColor', col.id)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                        data.changeableTextColor === col.id
                          ? 'scale-110 border-indigo-600 ring-2 ring-indigo-200'
                          : 'border-slate-300'
                      }`}
                      style={{ backgroundColor: col.id }}
                      title={col.name}
                    />
                  ))}
                  <input
                    type="color"
                    value={data.changeableTextColor}
                    onChange={(e) => updateField('changeableTextColor', e.target.value)}
                    className="w-6 h-6 p-0 border border-slate-300 rounded cursor-pointer"
                    title="Custom Color"
                  />
                </div>
              </div>

              {/* Line Spacing Slider */}
              <div className="pt-2 border-t border-indigo-200/60">
                <div className="flex items-center justify-between text-[11px] text-indigo-950 font-medium mb-1">
                  <span>Line Spacing (লাইনের মধ্যকার দূরত্ব)</span>
                  <span className="font-mono">{data.lineSpacing.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.85"
                  max="1.5"
                  step="0.05"
                  value={data.lineSpacing}
                  onChange={(e) => updateField('lineSpacing', parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            {/* 2. Official Fixed Label Font */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <label className="block font-semibold text-slate-800 text-xs">
                Official Label Phrases Font (অফিসিয়াল টেক্সট ফন্ট)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'arial', name: 'Arial (Clean)', font: 'font-sans' },
                  { id: 'gothic', name: 'Gothic (Classic)', font: 'font-gothic' },
                  { id: 'times', name: 'Serif (Times)', font: 'font-serif' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateField('labelFont', item.id as any)}
                    className={`p-2 rounded-md border text-center transition cursor-pointer ${
                      data.labelFont === item.id
                        ? 'border-rose-600 bg-white text-rose-700 font-bold shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className={`text-xs block ${item.font}`}>This is to certify</span>
                    <span className="text-[10px] text-slate-500 font-sans block mt-0.5">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Border Theme Color */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Guilloche Security Border Color (বর্ডারের রং)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'magenta', label: 'Original Magenta', color: '#9d174d' },
                  { id: 'maroon', label: 'Deep Maroon', color: '#881337' },
                  { id: 'navy', label: 'Classic Navy', color: '#1e3a8a' },
                  { id: 'emerald', label: 'Emerald Green', color: '#065f46' },
                  { id: 'gold', label: 'Vintage Gold', color: '#854d0e' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateField('themeColor', item.id as any)}
                    className={`flex items-center gap-1.5 p-2 rounded-md border text-left transition cursor-pointer ${
                      data.themeColor === item.id
                        ? 'border-slate-800 bg-slate-100 font-semibold'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate text-xs">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Overall Size Scaling Slider */}
            <div>
              <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                <span>Content Size Scaling (Fit Long Names)</span>
                <span>{Math.round(data.fontSizeScale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.85"
                max="1.15"
                step="0.02"
                value={data.fontSizeScale}
                onChange={(e) => updateField('fontSizeScale', parseFloat(e.target.value))}
                className="w-full accent-rose-600"
              />
            </div>
          </div>
        )}

        {/* ================= TAB 5: PRESETS ================= */}
        {activeTab === 'presets' && (
          <div className="space-y-3">
            <p className="text-slate-600 text-xs leading-relaxed">
              Load ready-made certificate configurations or restore original template data:
            </p>

            <button
              type="button"
              onClick={() => loadPreset('ariyan')}
              className="w-full text-left p-3 rounded-lg border border-rose-200 bg-rose-50/70 hover:bg-rose-100/70 transition group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 group-hover:text-rose-700">
                  ARIYAN ICT HUB, KUSHTIA (Default)
                </span>
                <span className="text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded font-semibold">
                  Official
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Kushtia - 271 · Humanities · GPA 4.22 · Jashore · 28 July, 2023
              </p>
            </button>

            <button
              type="button"
              onClick={() => loadPreset('demo')}
              className="w-full text-left p-3 rounded-lg border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/70 transition group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 group-hover:text-indigo-700">
                  100% Authentic Demo Match (Jashore Board)
                </span>
                <span className="text-[10px] bg-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded font-semibold">
                  Demo Image Match
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Board of Intermediate & Secondary Education, Jashore · Collectorate School · 4.22
              </p>
            </button>

            <button
              type="button"
              onClick={() => loadPreset('dhaka')}
              className="w-full text-left p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 group-hover:text-rose-700">
                  Dhaka Board 2023 (Science Group)
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-medium">
                  GPA 5.00
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Tasnim Ahmed Chowdhury · Dhaka Residential Model College
              </p>
            </button>

            <button
              type="button"
              onClick={() => loadPreset('rajshahi')}
              className="w-full text-left p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 group-hover:text-rose-700">
                  Rajshahi Board 2023 (Humanities Group)
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                  GPA 4.89
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Sadia Jahan Mim · Rajshahi Collegiate School
              </p>
            </button>

            <button
              type="button"
              onClick={() => loadPreset('blank')}
              className="w-full text-left p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">
                  Blank / Clean Template
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Start fresh with placeholder text to enter your custom student credentials.
              </p>
            </button>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-100 border-t border-slate-200 text-center text-[11px] text-slate-500">
        Click any text directly on the certificate to edit in-place
      </div>

      {/* Signature Studio Modal */}
      <SignatureModal
        isOpen={signatureModalState.isOpen}
        onClose={() => setSignatureModalState((prev) => ({ ...prev, isOpen: false }))}
        onSave={handleSignatureModalSave}
        signatureId={signatureModalState.signatureId}
        signatureLabel={data.signatures[signatureModalState.signatureId]?.label || 'Signature'}
        initialMode={signatureModalState.mode}
        defaultComponent={
          signatureModalState.signatureId === 'compared' ? (
            <DefaultSignatures.compared />
          ) : signatureModalState.signatureId === 'checked' ? (
            <DefaultSignatures.checked />
          ) : (
            <DefaultSignatures.controller />
          )
        }
      />
    </div>
  );
};
