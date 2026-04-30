'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Filters } from '../types/index';
import { ADVENTURE_STYLES, AGE_RANGES, LANGUAGES, REGIONS, TOUR_LENGTHS } from '../data/dummyTours';
import { ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Slider } from '@mui/material';

const toDateOnly = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface FilterSidebarProps {
  filters: Filters;
  activeFilterCount: number;
  onToggleRegion: (region: string) => void;
  onToggleAdventureStyle: (style: string) => void;
  onToggleLanguage: (language: string) => void;
  onToggleAgeRange: (ageRange: string) => void;
  onSetTourLength: (min: number, max: number) => void;
  onSetPriceRange: (min: number, max: number) => void;
  onSetStartDate: (date?: string) => void;
  onSetDealOnly: (enabled: boolean) => void;
  onResetFilters: () => void;
}

interface SectionState {
  [key: string]: boolean;
}

export const FilterSidebar = ({
  filters,
  activeFilterCount,
  onToggleRegion,
  onToggleAdventureStyle,
  onToggleLanguage,
  onToggleAgeRange,
  onSetTourLength,
  onSetPriceRange,
  onSetStartDate,
  onSetDealOnly,
  onResetFilters
}: FilterSidebarProps) => {
  const safeToggleRegion = (region: string) => {
    if (typeof onToggleRegion === 'function') onToggleRegion(region);
  };
  const safeToggleAdventureStyle = (style: string) => {
    if (typeof onToggleAdventureStyle === 'function') onToggleAdventureStyle(style);
  };
  const safeToggleLanguage = (language: string) => {
    if (typeof onToggleLanguage === 'function') onToggleLanguage(language);
  };
  const safeToggleAgeRange = (ageRange: string) => {
    if (typeof onToggleAgeRange === 'function') onToggleAgeRange(ageRange);
  };
  const safeSetTourLength = (min: number, max: number) => {
    if (typeof onSetTourLength === 'function') onSetTourLength(min, max);
  };
  const safeSetPriceRange = (min: number, max: number) => {
    if (typeof onSetPriceRange === 'function') onSetPriceRange(min, max);
  };
  const safeSetStartDate = (date?: string) => {
    if (typeof onSetStartDate === 'function') onSetStartDate(date);
  };
  const safeSetDealOnly = (enabled: boolean) => {
    if (typeof onSetDealOnly === 'function') onSetDealOnly(enabled);
  };
  const safeResetFilters = () => {
    if (typeof onResetFilters === 'function') onResetFilters();
  };

  const TOUR_LENGTH_MIN = 1;
  const TOUR_LENGTH_MAX = 30;
  const PRICE_MIN = 100;
  const PRICE_MAX = 2000;

  const [openSections, setOpenSections] = useState<SectionState>({
    tourLength: true,
    price: true,
    adventureStyles: true,
    language: true,
    ageRange: true,
    regions: true,
    date: true,
    deals: true,
  });
  const [calendarMonth, setCalendarMonth] = useState(() => {
    if (!filters.startDate) return new Date(2021, 2, 1);
    const initial = new Date(filters.startDate);
    return Number.isNaN(initial.getTime()) ? new Date(2021, 2, 1) : new Date(initial.getFullYear(), initial.getMonth(), 1);
  });
  const [tourLengthDraft, setTourLengthDraft] = useState<[number, number]>([filters.tourLength.min, filters.tourLength.max]);
  const [priceDraft, setPriceDraft] = useState<[number, number]>([filters.priceRange.min, filters.priceRange.max]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleTourLengthMinChange = (nextMin: number) => {
    const boundedMin = Math.max(TOUR_LENGTH_MIN, Math.min(nextMin, tourLengthDraft[1]));
    setTourLengthDraft([boundedMin, tourLengthDraft[1]]);
    safeSetTourLength(boundedMin, tourLengthDraft[1]);
  };

  const handleTourLengthMaxChange = (nextMax: number) => {
    const boundedMax = Math.min(TOUR_LENGTH_MAX, Math.max(nextMax, tourLengthDraft[0]));
    setTourLengthDraft([tourLengthDraft[0], boundedMax]);
    safeSetTourLength(tourLengthDraft[0], boundedMax);
  };

  const handlePriceMinChange = (nextMin: number) => {
    const boundedMin = Math.max(PRICE_MIN, Math.min(nextMin, priceDraft[1]));
    setPriceDraft([boundedMin, priceDraft[1]]);
    safeSetPriceRange(boundedMin, priceDraft[1]);
  };

  const handlePriceMaxChange = (nextMax: number) => {
    const boundedMax = Math.min(PRICE_MAX, Math.max(nextMax, priceDraft[0]));
    setPriceDraft([priceDraft[0], boundedMax]);
    safeSetPriceRange(priceDraft[0], boundedMax);
  };

  useEffect(() => {
    setTourLengthDraft([filters.tourLength.min, filters.tourLength.max]);
  }, [filters.tourLength.max, filters.tourLength.min]);

  useEffect(() => {
    setPriceDraft([filters.priceRange.min, filters.priceRange.max]);
  }, [filters.priceRange.max, filters.priceRange.min]);

  const FilterSection = ({ title, section, children }: { title: string; section: string; children: ReactNode }) => (
    <div className="border-b border-[#c9d2e6] pb-4 last:border-b-0 last:pb-0">
      <button
        type="button"
        onClick={() => toggleSection(section)}
        className="flex w-full items-center justify-between text-left text-[31px] font-semibold text-[#1e293b]"
      >
        <span className="text-[31px] leading-none">{title}</span>
        <ChevronDown className={`h-5 w-5 transition-transform ${openSections[section] ? 'rotate-180' : ''}`} />
      </button>
      {openSections[section] && <div className="pt-4">{children}</div>}
    </div>
  );

  const appliedFilters = useMemo(() => {
    const applied: { key: string; label: string; clear: () => void }[] = [];
    if (filters.regions.length > 0) {
      applied.push({
        key: 'regions',
        label: `Regions: ${filters.regions.join(', ')}`,
        clear: () => filters.regions.forEach((region) => safeToggleRegion(region)),
      });
    }
    if (filters.tourLength.min !== 1 || filters.tourLength.max !== 7) {
      applied.push({
        key: 'tourLength',
        label: `Duration ${filters.tourLength.min} - ${filters.tourLength.max} days`,
        clear: () => safeSetTourLength(1, 7),
      });
    }
    if (filters.priceRange.min !== 100 || filters.priceRange.max !== 1200) {
      applied.push({
        key: 'price',
        label: `Price $${filters.priceRange.min} - $${filters.priceRange.max}`,
        clear: () => safeSetPriceRange(100, 1200),
      });
    }
    if (filters.adventureStyles.length > 0) {
      applied.push({
        key: 'adventure',
        label: `Adventure: ${filters.adventureStyles.join(', ')}`,
        clear: () => filters.adventureStyles.forEach((style) => safeToggleAdventureStyle(style)),
      });
    }
    if (filters.languages.length > 0) {
      applied.push({
        key: 'languages',
        label: `Language: ${filters.languages.join(', ')}`,
        clear: () => filters.languages.forEach((language) => safeToggleLanguage(language)),
      });
    }
    if (filters.ageRanges.length > 0) {
      applied.push({
        key: 'age',
        label: `Age: ${filters.ageRanges.join(', ')}`,
        clear: () => filters.ageRanges.forEach((ageRange) => safeToggleAgeRange(ageRange)),
      });
    }
    if (filters.startDate) {
      applied.push({
        key: 'startDate',
        label: `Date: ${new Date(filters.startDate).toLocaleDateString()}`,
        clear: () => safeSetStartDate(undefined),
      });
    }
    if (filters.dealOnly) {
      applied.push({
        key: 'deals',
        label: 'View all offers',
        clear: () => safeSetDealOnly(false),
      });
    }
    return applied;
  }, [
    filters,
    safeSetDealOnly,
    safeSetPriceRange,
    safeSetStartDate,
    safeSetTourLength,
    safeToggleAdventureStyle,
    safeToggleAgeRange,
    safeToggleLanguage,
    safeToggleRegion,
  ]);

  const monthLabel = calendarMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const selectedDate = filters.startDate
  ? new Date(filters.startDate.split('T')[0])
  : null;
  const startWeekDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const prevMonthDays = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 0).getDate();
  const calendarCells = useMemo(() => {
    const cells: { key: string; day: number; muted: boolean; dateString: string }[] = [];
    for (let i = startWeekDay - 1; i >= 0; i -= 1) {
      const day = prevMonthDays - i;
      const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, day);
      cells.push({ key: `prev-${day}`, day, muted: true, dateString: toDateOnly(date) });
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
      cells.push({ key: `cur-${day}`, day, muted: false, dateString: toDateOnly(date) });
    }
    while (cells.length < 42) {
      const day = cells.length - (startWeekDay + daysInMonth) + 1;
      const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, day);
      cells.push({ key: `next-${day}`, day, muted: true, dateString: toDateOnly(date) });
    }
    return cells;
  }, [calendarMonth, daysInMonth, prevMonthDays, startWeekDay]);

  return (
    <div className="space-y-4 rounded-xl border border-[#d7dceb] bg-[#f4f7fd] p-4 shadow-sm lg:sticky lg:top-4">
      <div className="rounded-xl border border-[#d7dceb] bg-[#dce2f0] p-5 shadow-sm">
        <p className="mb-3 text-[30px] font-semibold leading-none text-[#1f2937]">
          Applied Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
        </p>
        <div className="min-h-20 space-y-2 text-sm text-[#374151]">
          {appliedFilters.length === 0 && (
            <div className="rounded-lg border border-dashed border-[#aab7d4] p-2 text-[#64748b]">
              No filters selected yet.
            </div>
          )}
          {appliedFilters.map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-2 transition-all duration-200">
              <span className="line-clamp-1">{item.label}</span>
              <button
                type="button"
                onClick={item.clear}
                className="rounded-full border border-[#94a3b8] p-0.5 text-[#64748b]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={safeResetFilters}
          className="mt-4 w-full rounded-full border-2 border-[#1e3a8a] py-2 text-sm font-semibold text-[#0f3da5]"
        >
          RESET
        </button>
      </div>

      <div className="space-y-4 rounded-xl border border-[#d7dceb] bg-white p-4 shadow-sm">
        <button type="button" className="mb-3 flex w-full items-center justify-between rounded-xl border border-[#bac6e3] px-4 py-3">
          <span className="text-[30px] leading-none font-semibold text-[#1f2937]">Tour & Activities</span>
          <ChevronDown className="h-5 w-5 text-[#334155]" />
        </button>

        <FilterSection title="Regions" section="regions">
          <div className="space-y-3">
            {REGIONS.map((region) => (
              <label key={region.name} className="flex cursor-pointer items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={filters.regions.includes(region.name)}
                    onChange={() => safeToggleRegion(region.name)}
                    className="h-4 w-4 rounded border-[#94a3b8]"
                  />
                  <span className="text-[15px] font-medium text-[#334155]">{region.name}</span>
                </div>
                <span className="text-xs text-[#94a3b8]">{region.count}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Tour Length" section="tourLength">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between font-semibold">
              <span>min. {filters.tourLength.min} day</span>
              <span>max. {filters.tourLength.max} day</span>
            </div>
            <Slider
  min={TOUR_LENGTH_MIN}
  max={TOUR_LENGTH_MAX}
  value={tourLengthDraft}
  onChange={(_, value) => {
    const newValue = value as number[];
    const [min, max] = newValue;

    setTourLengthDraft([min, max]);

    console.log("TOUR LENGTH:", min, max);

    // 🔥 CALL API DIRECTLY
    safeSetTourLength(min, max);
  }}
  valueLabelDisplay="auto"
/>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min={TOUR_LENGTH_MIN}
                max={tourLengthDraft[1]}
                value={tourLengthDraft[0]}
                onChange={(event) => handleTourLengthMinChange(Number(event.target.value))}
                className="rounded-lg border border-[#c8d2e8] px-2 py-1.5"
              />
              <input
                type="number"
                min={tourLengthDraft[0]}
                max={TOUR_LENGTH_MAX}
                value={tourLengthDraft[1]}
                onChange={(event) => handleTourLengthMaxChange(Number(event.target.value))}
                className="rounded-lg border border-[#c8d2e8] px-2 py-1.5"
              />
            </div>
            <div className="space-y-2">
              {TOUR_LENGTHS.map((length) => (
                <label key={length.label} className="flex items-center gap-2 text-[15px] text-[#334155]">
                  <input
                    type="checkbox"
                    checked={filters.tourLength.min === length.min && filters.tourLength.max === length.max}
                    onChange={() => safeSetTourLength(length.min, length.max)}
                    className="h-4 w-4 rounded border-[#94a3b8]"
                  />
                  {length.label}
                </label>
              ))}
            </div>
          </div>
        </FilterSection>

        <FilterSection title="Price" section="price">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between font-semibold">
              <span>min. ${filters.priceRange.min}</span>
              <span>max. ${filters.priceRange.max}</span>
            </div>
            <Slider
  min={PRICE_MIN}
  max={PRICE_MAX}
  step={50}
  value={priceDraft}
  onChange={(_, value) => {
    const newValue = value as number[];
    const [min, max] = newValue;
  
    setPriceDraft([min, max]);
  
    safeSetPriceRange(min, max);
  }}
  onChangeCommitted={(_, value) => {
    const newValue = value as number[];
    const [min, max] = newValue;

    console.log("PRICE FINAL:", min, max); // debug

    safeSetPriceRange(min, max);
  }}
  valueLabelDisplay="auto"
  disableSwap
/>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min={PRICE_MIN}
                max={priceDraft[1]}
                step={50}
                value={priceDraft[0]}
                onChange={(event) => handlePriceMinChange(Number(event.target.value))}
                className="rounded-lg border border-[#c8d2e8] px-2 py-1.5"
              />
              <input
                type="number"
                min={priceDraft[0]}
                max={PRICE_MAX}
                step={50}
                value={priceDraft[1]}
                onChange={(event) => handlePriceMaxChange(Number(event.target.value))}
                className="rounded-lg border border-[#c8d2e8] px-2 py-1.5"
              />
            </div>
          </div>
        </FilterSection>

        <FilterSection title="Adventure Styles" section="adventureStyles">
          <div className="space-y-2">
            {ADVENTURE_STYLES.map((style) => (
              <label key={style} className="flex cursor-pointer items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.adventureStyles.includes(style)}
                    onChange={() => safeToggleAdventureStyle(style)}
                    className="h-4 w-4 rounded border-[#94a3b8]"
                  />
                  <span className="text-[15px] text-[#334155]">{style}</span>
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Language" section="language">
          <div className="space-y-2">
            {LANGUAGES.map((language) => (
              <label key={language} className="flex cursor-pointer items-center gap-2 text-[15px] text-[#334155]">
                <input
                  type="checkbox"
                  checked={filters.languages.includes(language)}
                  onChange={() => safeToggleLanguage(language)}
                  className="h-4 w-4 rounded border-[#94a3b8]"
                />
                {language}
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Age range" section="ageRange">
          <div className="grid grid-cols-2 gap-2">
            {AGE_RANGES.map((ageRange) => (
              <button
                key={ageRange}
                type="button"
                onClick={() => safeToggleAgeRange(ageRange)}
                className={`rounded-xl border px-3 py-2 text-sm ${
                  filters.ageRanges.includes(ageRange)
                    ? 'border-[#0f3da5] bg-[#eaf0ff] text-[#0f3da5]'
                    : 'border-[#d3dae8] bg-white text-[#334155]'
                }`}
              >
                {ageRange}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Date" section="date">
          <div className="rounded-2xl border border-[#d6dced] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xl font-semibold text-[#1f2937]">{monthLabel}</span>
              <div className="flex items-center gap-2 text-[#64748b]">
                <button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mb-2 grid grid-cols-7 text-center text-xs font-semibold text-[#94a3b8]">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((dayName) => (
                <span key={dayName}>{dayName}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm text-[#334155]">
            {calendarCells.map((cell) => {
  const cellDate = new Date(cell.dateString);

  const isActive =
    selectedDate &&
    selectedDate.toDateString() === cellDate.toDateString();
                return (
                  <button
                    key={cell.key}
                    type="button"
                   onClick={() => {
  if (cell.muted) return;
  safeSetStartDate(cell.dateString);
}}
                    className={`h-8 rounded-md ${isActive ? 'bg-[#114ecf] text-white' : ''} ${cell.muted ? 'text-[#c0c9dd]' : 'hover:bg-[#e7ecf8]'}`}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => safeSetStartDate(undefined)}
              className="mt-4 w-full rounded-full border-2 border-[#1e3a8a] py-2 text-sm font-semibold text-[#0f3da5]"
            >
              RESET
            </button>
          </div>
        </FilterSection>

        <FilterSection title="Deals" section="deals">
          <label className="flex cursor-pointer items-center justify-between text-[#334155]">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={filters.dealOnly}
                onChange={(event) => safeSetDealOnly(event.target.checked)}
                className="h-4 w-4 rounded border-[#94a3b8]"
              />
              <span className="text-[15px] font-medium">View All offers</span>
            </div>
            <span className="text-xs text-[#94a3b8]">814</span>
          </label>
        </FilterSection>
      </div>
    </div>
  );
};
