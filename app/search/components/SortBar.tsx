'use client';

import { List, LayoutGrid, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SortBarProps {
  sortBy: string;
  viewMode: 'grid' | 'list';
  totalResults: number;
  searchQuery: string;
  showMaps: boolean;
  pricePerDay: boolean;
  onSortChange: (sort: string) => void;
  onViewChange: (mode: 'grid' | 'list') => void;
  onSearchChange: (query: string) => void;
  onToggleShowMaps: (enabled: boolean) => void;
  onTogglePricePerDay: (enabled: boolean) => void;
}

const SORT_OPTIONS = [
  { value: 'most-popular', label: 'Most Popular' },
  { value: 'rating-high', label: 'Highest Rated' },
  { value: 'rating-low', label: 'Lowest Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'duration-short', label: 'Duration: Short to Long' },
  { value: 'duration-long', label: 'Duration: Long to Short' },
];

export const SortBar = ({
  sortBy,
  viewMode,
  totalResults,
  searchQuery,
  showMaps,
  pricePerDay,
  onSortChange,
  onViewChange,
  onSearchChange,
  onToggleShowMaps,
  onTogglePricePerDay,
}: SortBarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [history, setHistory] = useState<string[]>([]);

  const currentSortLabel = SORT_OPTIONS.find(opt => opt.value === sortBy)?.label || 'Sort By';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = window.localStorage.getItem('tour-search-history');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed)) {
        setHistory(parsed.filter(Boolean).slice(0, 5));
      }
    } catch {
   
    }
  }, []);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handle = setTimeout(() => {
      if (localQuery !== searchQuery) {
        onSearchChange(localQuery);
        const trimmed = localQuery.trim();
        if (trimmed && typeof window !== 'undefined') {
          setHistory((prev) => {
            const next = [trimmed, ...prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
            window.localStorage.setItem('tour-search-history', JSON.stringify(next));
            return next;
          });
        }
      }
    }, 400);
    return () => clearTimeout(handle);
  }, [localQuery, onSearchChange, searchQuery]);

  return (
    <div className="mb-5 rounded-xl border border-[#d7dceb] bg-white px-5 py-4">
      <div className="mb-4 text-[34px] leading-none font-semibold text-[#1f2937]">
        {totalResults} Tour &amp; Activities Found
      </div>
      <input
        value={localQuery}
        onChange={(event) => setLocalQuery(event.target.value)}
        placeholder="Search tours, region, highlights..."
        className="mb-4 w-full rounded-xl border border-[#c7d2ea] px-4 py-2 text-sm outline-none focus:border-[#0f3da5]"
      />
      {history.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {history.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setLocalQuery(item)}
              className="rounded-full border border-[#c7d2ea] bg-[#f7f9ff] px-3 py-1 text-xs text-[#334155] transition hover:bg-[#edf2ff]"
            >
              {item}
            </button>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 rounded-full border-2 border-[#0f3da5] px-7 py-2 text-sm font-semibold text-[#0f3da5]"
          >
            <span>Sort by: {currentSortLabel}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute left-0 z-10 mt-2 w-64 rounded-lg border border-[#d2daed] bg-white shadow-lg">
              {SORT_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 transition ${
                    sortBy === option.value
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onToggleShowMaps(!showMaps)}
            className="flex items-center gap-2 rounded-full border-2 border-[#0f3da5] px-6 py-2 text-sm font-semibold text-[#0f3da5]"
          >
            Show Maps
            <span className={`relative h-5 w-10 rounded-full ${showMaps ? 'bg-[#0f3da5]/20' : 'bg-slate-300'}`}>
              <span className={`absolute top-[2px] h-4 w-4 rounded-full ${showMaps ? 'right-[2px] bg-[#0f3da5]' : 'left-[2px] bg-white'}`} />
            </span>
          </button>
          <button
            type="button"
            onClick={() => onTogglePricePerDay(!pricePerDay)}
            className="flex items-center gap-2 rounded-full border-2 border-[#0f3da5] px-6 py-2 text-sm font-semibold text-[#0f3da5]"
          >
            Price Per Day
            <span className={`relative h-5 w-10 rounded-full ${pricePerDay ? 'bg-[#0f3da5]/20' : 'bg-slate-300'}`}>
              <span className={`absolute top-[2px] h-4 w-4 rounded-full ${pricePerDay ? 'right-[2px] bg-[#0f3da5]' : 'left-[2px] bg-white'}`} />
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#1e293b]">View</span>
          <button
            onClick={() => onViewChange('list')}
            className={`rounded-md p-2 transition ${
              viewMode === 'list'
                ? 'bg-[#e7ecf8] text-[#0f3da5]'
                : 'text-[#64748b] hover:bg-[#eef2fb]'
            }`}
            title="List view"
          >
            <List className="h-5 w-5" />
          </button>
          <button
            onClick={() => onViewChange('grid')}
            className={`rounded-md p-2 transition ${
              viewMode === 'grid'
                ? 'bg-[#e7ecf8] text-[#0f3da5]'
                : 'text-[#64748b] hover:bg-[#eef2fb]'
            }`}
            title="Grid view"
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
