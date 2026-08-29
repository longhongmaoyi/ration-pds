'use client';

import { Input } from '@/components/ui/input';

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function Search({ value, onChange }: SearchProps) {
  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="लाभार्थी खोजें / Search by name or S.No."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-xl border-2 border-red-100 bg-white text-base focus-visible:border-red-500 focus-visible:ring-red-200"
      />
    </div>
  );
}
