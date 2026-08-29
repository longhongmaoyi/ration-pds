'use client';

import { useState } from 'react';
import { Search } from '@/components/beneficiary-search';
import { BeneficiaryCard, BeneficiaryRow } from '@/components/beneficiary-card';

interface SearchWrapperProps {
  initialData: BeneficiaryRow[];
  monthlyHeaders: string[];
  fetchError?: string;
}

function SearchWrapper({ initialData, monthlyHeaders, fetchError }: SearchWrapperProps) {
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = normalizedQuery
    ? initialData.filter((item) => {
        const haystack = `${item.sno} ${item.name} ${item.relative}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : initialData;

  return (
    <div className="space-y-4">
      <Search value={query} onChange={setQuery} />

      {fetchError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          डेटा लोड करने में त्रुटि: {fetchError}
        </div>
      )}

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-500">कोई परिणाम नहीं मिला / No results found</p>
        ) : (
          filtered.map((item) => (
            <BeneficiaryCard key={`${item.sno}-${item.name}`} beneficiary={item} monthlyHeaders={monthlyHeaders} />
          ))
        )}
      </div>
    </div>
  );
}

export { SearchWrapper };
