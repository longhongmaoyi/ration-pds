'use client';

import { useEffect, useState } from 'react';
import { BeneficiaryRow } from '@/components/beneficiary-card';
import { SearchWrapper } from '@/components/search-wrapper';

function Dashboard() {
  const [state, setState] = useState<{ data: BeneficiaryRow[]; monthlyHeaders: string[]; fetchError?: string }>({
    data: [],
    monthlyHeaders: [],
    fetchError: undefined,
  });

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    fetch(`${baseUrl}/api/ration`, { cache: 'no-store' })
      .then(async (res) => {
        const contentType = res.headers.get('content-type') || '';
        const body = contentType.includes('application/json') ? await res.json() : await res.text();
        if (!res.ok) {
          const message = typeof body === 'string' ? body : JSON.stringify(body);
          console.error('Ration API error:', res.status, message);
          throw new Error(message);
        }
        return body as { data: BeneficiaryRow[]; monthlyHeaders: string[] };
      })
      .then((json) => setState({ data: json.data ?? [], monthlyHeaders: json.monthlyHeaders ?? [] }))
      .catch((error) => setState({ data: [], monthlyHeaders: [], fetchError: error.message }));
  }, []);

  return <SearchWrapper initialData={state.data} monthlyHeaders={state.monthlyHeaders} fetchError={state.fetchError} />;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-red-100 bg-red-50/70">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <h1 className="text-center text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            लामीचौर बाजार राशन वितरण प्रणाली
          </h1>
          <p className="mt-1 text-center text-xs text-gray-600 sm:text-sm">
            Lamichaur Bazar Ration Distribution System
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-4 sm:px-6 sm:py-6">
        <Dashboard />
      </main>
    </div>
  );
}
