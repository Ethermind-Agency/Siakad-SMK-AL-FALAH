/**
 * Converts a month number (1-12) to its Roman numeral representation.
 */
export function getRomanMonth(month: number): string {
  const romanMonths = [
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'IX',
    'X',
    'XI',
    'XII',
  ];
  if (month < 1 || month > 12) {
    throw new Error(`Bulan tidak valid: ${month}. Harus antara 1 dan 12.`);
  }
  return romanMonths[month - 1];
}

/**
 * Generates official formatted letter number for SMKS AL-FALAH.
 * Template: {classification}/{paddedSequence}/SMK-AF/{romanMonth}/{year}
 * Example: 421.5/001/SMK-AF/IX/2026
 */
export function formatOutgoingLetterNumber(
  classificationCode: string,
  sequenceNumber: number,
  month: number,
  year: number
): string {
  const paddedSequence = sequenceNumber.toString().padStart(3, '0');
  const romanMonth = getRomanMonth(month);
  return `${classificationCode}/${paddedSequence}/SMK-AF/${romanMonth}/${year}`;
}

export const generateLetterNumber = formatOutgoingLetterNumber;
