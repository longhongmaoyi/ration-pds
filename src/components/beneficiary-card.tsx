'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

export type MonthEntry = {
  status: 'distributed' | 'pending' | 'cancelled' | 'processing';
  kg: string;
};

export type BeneficiaryRow = {
  sno: string;
  name: string;
  relative: string;
  familyMembers: number;
  totalEntitlement: number;
  monthly: Record<string, MonthEntry>;
};

interface BeneficiaryCardProps {
  beneficiary: BeneficiaryRow;
  monthlyHeaders: string[];
}

function getKycBadge(value: string) {
  const normalized = value.trim();

  if (!normalized || normalized === '0') {
    return { label: 'लंबित', className: 'bg-gray-100 text-gray-800 border-gray-200' };
  }

  if (normalized === 'Cancel' || normalized === 'α' || normalized.toLowerCase() === 'cancel' || normalized.includes('नहीं हुआ')) {
    return { label: 'रद्द', className: 'bg-red-100 text-red-800 border-red-200' };
  }

  if (normalized.includes('हो गया') || normalized.toLowerCase().includes('completed') || normalized.toLowerCase().includes('done')) {
    return { label: 'पूर्ण', className: 'bg-green-100 text-green-800 border-green-200' };
  }

  if (normalized.toLowerCase().includes('processing') || normalized.includes('प्रगति') || normalized.toLowerCase().includes('in progress') || normalized.toLowerCase().includes('incomplete')) {
    return { label: 'प्रगति में', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
  }

  return { label: normalized, className: 'bg-green-100 text-green-800 border-green-200' };
}

export function BeneficiaryCard({ beneficiary, monthlyHeaders }: BeneficiaryCardProps) {
  const { sno, name, relative, familyMembers, totalEntitlement, monthly } = beneficiary;

  const baseMonthCount = Math.floor(monthlyHeaders.length / 2);

  return (
    <Card className="overflow-hidden rounded-2xl border-2 border-red-100 bg-white/90 shadow-sm transition hover:shadow-md">
      <CardHeader className="space-y-3 bg-red-50/60 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-gray-900 hindi">{name}</CardTitle>
            <p className="text-xs text-gray-600 hindi">संबंधी : {relative || '—'}</p>
          </div>
          <Badge variant="outline" className="shrink-0 border-red-200 bg-white text-xs text-red-700">
            #{sno}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-4 rounded-xl bg-white/70 px-4 py-3">
          <div>
            <p className="text-[11px] text-gray-500">परिवार के सदस्य</p>
            <p className="text-xl font-bold text-gray-900">{familyMembers}</p>
          </div>
          <div className="h-6 w-px bg-red-200" />
          <div>
            <p className="text-[11px] text-gray-500">कुल दायित्व</p>
            <p className="text-xl font-bold text-red-700">{totalEntitlement} kg</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="mb-2 text-xs font-medium text-gray-600">मासिक स्टेटस</div>
        <div className="rounded-xl border border-gray-100">
          <Table>
            <TableHeader>
              <TableRow className="bg-red-50/60 hindi">
                <TableHead className="w-[40%] text-xs font-medium text-gray-700">महीना</TableHead>
                <TableHead className="w-[25%] text-xs font-medium text-gray-700 hindi">परिवार के सदस्य</TableHead>
                <TableHead className="w-[20%] text-right text-xs font-medium text-gray-700 hindi">राशन दिया गया (KG)</TableHead>
                <TableHead className="w-[15%] text-center text-xs font-medium text-gray-700 hindi">KYC स्थिति</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: baseMonthCount }).map((_, index) => {
                const monthName = monthlyHeaders[index * 2] ?? `Month ${index + 1}`;
                const rationEntry = monthly[`month-${index * 2}`];
                const kycEntry = monthly[`month-${index * 2 + 1}`];
                const kycBadge = getKycBadge(kycEntry?.kg ?? '');

                return (
                  <TableRow key={monthName} className="text-sm hindi">
                    <TableCell className="font-medium text-gray-900">{monthName}</TableCell>
                    <TableCell className="text-gray-700">{familyMembers}</TableCell>
                    <TableCell className="text-right text-gray-700">{rationEntry?.kg ?? '0'}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={`${kycBadge.className} border text-[11px] hindi`}>{kycBadge.label}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
