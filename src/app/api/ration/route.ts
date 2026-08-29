import { NextResponse } from 'next/server';

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || '';
const SHEET_NAME = 'Sheet1';
const API_KEY = process.env.GOOGLE_API_KEY || '';

function buildApiUrl(): string {
  const encodedSheet = encodeURIComponent(SHEET_NAME);
  return `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodedSheet}?key=${API_KEY}`;
}

function parseFamilyMemberCount(value: unknown): number {
  if (typeof value === 'number') return value;

  const str = String(value ?? '').trim();

  if (!str) return 0;

  const normalized = str.replace(/ /g, '');

  if (normalized.includes('+')) {
    const parts = normalized.split('+').map((part) => parseFloat(part));
    const sum = parts.reduce((acc, val) => acc + (Number.isNaN(val) ? 0 : val), 0);
    return Math.round(sum * 10) / 10;
  }

  if (normalized.includes('.')) {
    const parsed = parseFloat(normalized);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  const parsed = parseInt(normalized, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function cleanString(value: unknown): string {
  return String(value ?? '').trim();
}

export async function GET() {
  try {
    if (!API_KEY) {
      throw new Error('Missing GOOGLE_API_KEY');
    }

    const response = await fetch(buildApiUrl(), {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Google Sheets API error:', response.status, text);
      throw new Error(`Google Sheets API responded with ${response.status}`);
    }

    const payload = await response.json();
    const rows: unknown[][] = payload.values;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ data: [], monthlyHeaders: [] });
    }

    const [headerRow, ...dataRows] = rows;

    const monthlyHeaders = headerRow.slice(4).map((cell) => String(cell ?? '').trim());

    const data = dataRows.map((row) => {
      const sno = cleanString(row[0]);
      const name = cleanString(row[1]);
      const relative = cleanString(row[2]);
      const familyMemberRaw = row[3];
      const familyMembers = parseFamilyMemberCount(familyMemberRaw);

      const monthly: Record<string, { status: 'distributed' | 'pending' | 'cancelled'; kg: string }> = {};

      headerRow.slice(4).forEach((_, index) => {
        const cell = cleanString(row[index + 4] ?? '');

        if (!cell) {
          monthly[`month-${index}`] = { status: 'pending', kg: '0' };
        } else if (cell === 'Cancel' || cell === 'α' || cell.toLowerCase() === 'cancel') {
          monthly[`month-${index}`] = { status: 'cancelled', kg: cell };
        } else if (cell === '0') {
          monthly[`month-${index}`] = { status: 'pending', kg: '0' };
        } else {
          monthly[`month-${index}`] = { status: 'distributed', kg: cell };
        }
      });

      return {
        sno,
        name,
        relative,
        familyMembers,
        totalEntitlement: familyMembers * 4,
        monthly,
      };
    });

    return NextResponse.json({ data, monthlyHeaders });
  } catch (error) {
    console.error('Failed to fetch Google Sheet:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ration data' },
      { status: 500 }
    );
  }
}
