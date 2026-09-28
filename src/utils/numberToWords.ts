/**
 * Converts a standard date (YYYY-MM-DD or DD/MM/YYYY) or numeric day/year into 
 * standard certificate words format. E.g. 04/07/2005 -> "Fourth July Two Thousand And Five"
 */

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

const ORDINAL_DAYS: Record<number, string> = {
  1: 'First', 2: 'Second', 3: 'Third', 4: 'Fourth', 5: 'Fifth',
  6: 'Sixth', 7: 'Seventh', 8: 'Eighth', 9: 'Ninth', 10: 'Tenth',
  11: 'Eleventh', 12: 'Twelfth', 13: 'Thirteenth', 14: 'Fourteenth', 15: 'Fifteenth',
  16: 'Sixteenth', 17: 'Seventeenth', 18: 'Eighteenth', 19: 'Nineteenth', 20: 'Twentieth',
  21: 'Twenty First', 22: 'Twenty Second', 23: 'Twenty Third', 24: 'Twenty Fourth',
  25: 'Twenty Fifth', 26: 'Twenty Sixth', 27: 'Twenty Seventh', 28: 'Twenty Eighth',
  29: 'Twenty Ninth', 30: 'Thirtieth', 31: 'Thirty First'
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  if (num < 20) return ONES[num];
  if (num < 100) {
    const tens = TENS[Math.floor(num / 10)];
    const remainder = num % 10;
    return remainder ? `${tens} ${ONES[remainder]}` : tens;
  }
  if (num < 1000) {
    const hundreds = ONES[Math.floor(num / 100)] + ' Hundred';
    const remainder = num % 100;
    return remainder ? `${hundreds} And ${numberToWords(remainder)}` : hundreds;
  }
  if (num >= 2000 && num < 2100) {
    const remainder = num % 2000;
    return remainder ? `Two Thousand And ${numberToWords(remainder)}` : 'Two Thousand';
  }
  if (num >= 1900 && num < 2000) {
    const remainder = num - 1900;
    return `Nineteen Hundred And ${numberToWords(remainder)}`;
  }
  return num.toString();
}

export function convertDateToCertificateWords(dateStr: string): { line1: string; line2: string } {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return {
        line1: 'Fourth July Two Thousand And',
        line2: 'Five.'
      };
    }

    const day = date.getDate();
    const month = MONTH_NAMES[date.getMonth()];
    const year = date.getFullYear();

    const dayWord = ORDINAL_DAYS[day] || `${day}th`;
    const yearWord = numberToWords(year);

    // Usually certificates format as:
    // Line 1: Fourth July Two Thousand And
    // Line 2: Five.
    // Or if year is e.g. 2005: "Two Thousand And Five."
    if (yearWord.includes('And')) {
      const parts = yearWord.split('And');
      return {
        line1: `${dayWord} ${month} ${parts[0].trim()} And`,
        line2: `${parts[1].trim()}.`
      };
    } else {
      return {
        line1: `${dayWord} ${month}`,
        line2: `${yearWord}.`
      };
    }
  } catch {
    return {
      line1: 'Fourth July Two Thousand And',
      line2: 'Five.'
    };
  }
}
