export type SignatureType = 'default' | 'custom' | 'drawn' | 'none';

export interface SignatureData {
  type: SignatureType;
  imageData?: string; // base64 data url
  label: string;
}

export type ChangeableFontStyle = 'script' | 'calligraphy' | 'arial' | 'times' | 'gothic' | 'courier';
export type LabelFontStyle = 'gothic' | 'arial' | 'times';
export type FontWeightOption = 'normal' | 'medium' | 'semibold' | 'bold';
export type UnderlineStyle = 'none' | 'dotted' | 'solid';

export interface CertificateData {
  // Top Headers & Institution Branding
  institutionName: string; // "ARIYAN ICT HUB"
  institutionLocation: string; // "KUSHTIA"
  country: string; // "BANGLADESH"
  
  // Left side: Serial No. & ID No.
  serialPrefix: string; // "Serial No. JBC-22-"
  serialNumber: string; // "0232327"
  idNoLabel: string; // "JBCS No. :" (or "ID No. :")
  idNumber: string; // "232227965" (or "AIC-2023-784")
  
  // Right side: Registration Number
  registrationNoLabel: string; // "Registration No. :"
  registrationNo: string; // "2013580272/2021-2022"
  
  // Logo
  logoUrl?: string;
  showLogo: boolean;
  
  // Course / Exam Title
  examTitle: string; // "Secondary School Certificate Examination 2023"
  
  // Student Certification Body (8 Lines matching authentic SSC certificate)
  certifyIntro: string; // "This is to certify that"
  studentName: string; // "Tanvir Hasan Chowdhury"
  parentagePrefix: string; // "son/daughter of"
  fatherName: string; // "Md. Rafiqul Islam"
  motherName: string; // "Mst. Salma Khatun"
  schoolPrefix: string; // "of"
  schoolName: string; // "Kushtia Model High School & College"
  rollPrefix: string; // "bearing Roll"
  centerCode: string; // "Kushtia - 105"
  rollNo: string; // "148520"
  passedPrefix: string; // "duly passed the"
  examNamePrefix: string; // "Secondary School Certificate Examination of"
  examYear: string; // "2023"
  inGroupPrefix: string; // "in"
  groupName: string; // "Humanities"
  groupSuffix: string; // "Group and"
  gpaPrefix: string; // "obtained G.P.A."
  gpa: string; // "4.22"
  gpaScalePrefix: string; // "in the scale of"
  gpaScale: string; // "5.00."
  dobPrefix: string; // "His/Her date of birth as recorded is"
  dobInWordsLine1: string; // "Fourth July Two Thousand And"
  dobInWordsLine2: string; // "Five."
  
  // Bottom Place & Result Date
  issuePlace: string; // "Jashore"
  resultDateLabel: string; // "Date of Publication of Result :"
  resultDate: string; // "28 July, 2023"
  
  // Signatures
  signatures: {
    compared: SignatureData;
    checked: SignatureData;
    controller: SignatureData;
  };
  
  // Styling settings
  changeableFont: ChangeableFontStyle;
  changeableFontWeight: FontWeightOption;
  changeableTextColor: string;
  changeableUnderline: UnderlineStyle;
  changeableFontSize: number;
  labelFont: LabelFontStyle;
  lineSpacing: number;
  fontSizeScale: number;
  themeColor: 'magenta' | 'maroon' | 'navy' | 'emerald' | 'gold';
  paperTone: 'cream' | 'white' | 'parchment';
  watermarkOpacity: number;
  showRosettes: boolean;
  showSealWatermark: boolean;
  templateMode?: 'replica' | 'custom';
  customTemplateUrl?: string;
}

export const INITIAL_CERTIFICATE_DATA: CertificateData = {
  institutionName: 'ARIYAN ICT HUB',
  institutionLocation: 'KUSHTIA',
  country: 'BANGLADESH',
  
  serialPrefix: 'Serial No. JBC-22-',
  serialNumber: '0184920',
  idNoLabel: 'ID No. :',
  idNumber: '210984712',
  registrationNoLabel: 'Registration No. :',
  registrationNo: '1914205831/2021-2022',
  
  showLogo: true,
  examTitle: 'Secondary School Certificate Examination 2023',
  
  certifyIntro: 'This is to certify that',
  studentName: 'Tanvir Hasan Chowdhury',
  parentagePrefix: 'son/daughter of',
  fatherName: 'Md. Rafiqul Islam',
  motherName: 'Mst. Salma Khatun',
  schoolPrefix: 'of',
  schoolName: 'Kushtia Model High School & College',
  rollPrefix: 'bearing Roll',
  centerCode: 'Kushtia - 105',
  rollNo: '148520',
  passedPrefix: 'duly passed the',
  examNamePrefix: 'Secondary School Certificate Examination of',
  examYear: '2023',
  inGroupPrefix: 'in',
  groupName: 'Humanities',
  groupSuffix: 'Group and',
  gpaPrefix: 'obtained G.P.A.',
  gpa: '4.22',
  gpaScalePrefix: 'in the scale of',
  gpaScale: '5.00.',
  dobPrefix: 'His/Her date of birth as recorded is',
  dobInWordsLine1: 'Fifteenth August Two Thousand And',
  dobInWordsLine2: 'Five.',
  
  issuePlace: 'Jashore',
  resultDateLabel: 'Date of Publication of Result :',
  resultDate: '28 July, 2023',
  
  signatures: {
    compared: {
      type: 'default',
      label: 'Compared',
    },
    checked: {
      type: 'default',
      label: 'Checked',
    },
    controller: {
      type: 'default',
      label: 'Controller of Examinations',
    },
  },
  
  changeableFont: 'script', // Elegant cursive calligraphy as in demo photo!
  changeableFontWeight: 'semibold',
  changeableTextColor: '#0b132b',
  changeableUnderline: 'none', // Demo photo has natural unlined script
  changeableFontSize: 24,
  labelFont: 'gothic', // Gothic Blackletter for fixed labels as in demo photo!
  lineSpacing: 1.2,
  fontSizeScale: 1.0,
  themeColor: 'magenta',
  paperTone: 'cream',
  watermarkOpacity: 0.16,
  showRosettes: true,
  showSealWatermark: true,
  templateMode: 'replica',
};

export const BANGLADESH_BOARDS = [
  { id: 'jashore', name: 'Jashore Board', city: 'Jashore', code: 'JBC' },
  { id: 'dhaka', name: 'Dhaka Board', city: 'Dhaka', code: 'DBC' },
  { id: 'rajshahi', name: 'Rajshahi Board', city: 'Rajshahi', code: 'RBC' },
  { id: 'comilla', name: 'Cumilla Board', city: 'Cumilla', code: 'CBC' },
  { id: 'chattogram', name: 'Chattogram Board', city: 'Chattogram', code: 'CTG' },
  { id: 'barisal', name: 'Barishal Board', city: 'Barishal', code: 'BBC' },
  { id: 'sylhet', name: 'Sylhet Board', city: 'Sylhet', code: 'SBC' },
  { id: 'dinajpur', name: 'Dinajpur Board', city: 'Dinajpur', code: 'DJC' },
  { id: 'mymensingh', name: 'Mymensingh Board', city: 'Mymensingh', code: 'MBC' },
  { id: 'madrasah', name: 'Madrasah Board', city: 'Dhaka', code: 'MEB' },
  { id: 'technical', name: 'Technical Education Board', city: 'Dhaka', code: 'BTEB' },
];
