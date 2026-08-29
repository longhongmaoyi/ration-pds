'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PackageCheck } from 'lucide-react';

export type MonthEntry = {
  status: 'distributed' | 'pending' | 'cancelled';
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

export function BeneficiaryCard({ beneficiary, monthlyHeaders }: BeneficiaryCardProps) {
  const { sno, name, relative, familyMembers, totalEntitlement, monthly } = beneficiary;

  const statusConfig: Record<string, { label: string; className: string }> = {
    distributed: { label: 'वितरित', className: 'bg-green-100 text-green-800 border-green-200' },
    pending: { label: 'लंबित', className: 'bg-gray-100 text-gray-800 border-gray-200' },
    cancelled: { label: 'रद्द', className: 'bg-red-100 text-red-800 border-red-200' },
  };

  return (
    <Card className="overflow-hidden rounded-2xl border-2 border-red-100 bg-white/90 shadow-sm transition hover:shadow-md">
      <CardHeader className="space-y-1 bg-red-50/60 pb-3">
        <CardTitle className="flex items-center justify-between gap-3 text-base">
          <span className="truncate text-lg font-semibold text-gray-900">{name}</span>
          <Badge variant="outline" className="shrink-0 border-red-200 bg-white text-xs text-red-700">
            #{sno}
          </Badge>
        </CardTitle>
        <p className="text-xs text-gray-600">संबंधी : {relative}</p>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="flex items-center justify-between rounded-xl bg-red-50/60 px-4 py-3">
          <div>
            <p className="text-xs text-gray-600">परिवार के सदस्य</p>
            <p className="text-2xl font-bold text-gray-900">{familyMembers}</p>
          </div>
          <div className="h-8 w-px bg-red-200" />
          <div className="text-right">
            <p className="text-xs text-gray-600">कुल दायित्व</p>
            <p className="text-2xl font-bold text-red-700">{totalEntitlement} kg</p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-gray-600">मासिक स्टेटस</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {monthlyHeaders.map((header, index) => {
              const entry = monthly[`month-${index}`];
              const config = statusConfig[entry?.status ?? 'pending'] ?? statusConfig.pending;

              return (
                <div
                  key={header}
                  className="flex flex-col items-center gap-1 rounded-xl border border-gray-100 bg-gray-50 px-2 py-2"
                >
                  <span className="text-[11px] font-medium text-gray-600">{header}</span>
                  <Badge className={`${config.className} text-[11px]`}>{config.label}</Badge>
                  <span className="text-[11px] text-gray-500">{entry?.kg ?? '0'}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
