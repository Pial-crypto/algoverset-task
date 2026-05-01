'use client';

import { useCallback, useMemo, useState } from 'react';

import { useFilters } from './hooks/useFilters';
import { usePagination } from './hooks/usePagination';
import { useFetchTours } from './hooks/useFetchTours';
import { FilterSidebar } from './components/FilterSidebar';
import { SortBar } from './components/SortBar';
import { TourGrid } from './components/TourGrid';
import { Pagination } from './components/Pagination';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMaps, setShowMaps] = useState(false);
  const [pricePerDay, setPricePerDay] = useState(false);

  const [sortBy, setSortBy] = useState('most-popular');
  

 
  const { filters,
    toggleRegion,
    toggleAdventureStyle,
    toggleLanguage,
    toggleAgeRange,
    setTourLength,
    setPriceRange,
    setStartDate: setStartDateFilter,
    setDealOnly,
    setSearchQuery,
    resetFilters
  } = useFilters();

  const { currentPage, goToPage, reset: resetPagination, perPage } =
    usePagination();

  const { tours, loading, error, totalPages, total } = useFetchTours({
    currentPage,
    perPage,
    sortBy,
    filters,
  });

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.regions.length > 0) count++;
    if (filters.tourLength.min !== 1 || filters.tourLength.max !== 7) count++;
    if (filters.priceRange.min !== 100 || filters.priceRange.max !== 1200) count++;
    if (filters.adventureStyles.length > 0) count++;
    if (filters.languages.length > 0) count++;
    if (filters.ageRanges.length > 0) count++;
    if (filters.startDate) count++;
    if (filters.dealOnly) count++;
    return count;
  }, [filters]);

  // handlers
  const handleSearch = (query: string) => {
    if (typeof setSearchQuery === 'function') {
      setSearchQuery(query);
    }
    resetPagination();
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    resetPagination();
  };

  const handleViewChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  const handleResetFilters = () => {
    if (typeof resetFilters === 'function') {
      resetFilters();
    }
    resetPagination();
  };

  const handleToggleRegion = useCallback((region: string) => {
    if (typeof toggleRegion === 'function') {
      toggleRegion(region);
    }
    resetPagination();
  }, [resetPagination, toggleRegion]);

  const handleToggleAdventureStyle = useCallback((style: string) => {
    if (typeof toggleAdventureStyle === 'function') {
    console.log("Toggle Adventure Style:", style);
      toggleAdventureStyle(style);
    }
    resetPagination();
  }, [resetPagination, toggleAdventureStyle]);

  const handleToggleLanguage = useCallback((language: string) => {
    if (typeof toggleLanguage === 'function') {
      toggleLanguage(language);
    }
    resetPagination();
  }, [resetPagination, toggleLanguage]);

  const handleToggleAgeRange = useCallback((ageRange: string) => {
    if (typeof toggleAgeRange === 'function') {
      toggleAgeRange(ageRange);
    }
    resetPagination();
  }, [resetPagination, toggleAgeRange]);

  const handleSetTourLength = useCallback((min: number, max: number) => {
    if (typeof setTourLength === 'function') {
      setTourLength(min, max);
    }
    resetPagination();
  }, [resetPagination, setTourLength]);

  const handleSetPriceRange = useCallback((min: number, max: number) => {
    if (typeof setPriceRange === 'function') {
      setPriceRange(min, max);
    }
    resetPagination();
  }, [resetPagination, setPriceRange]);

  const handleSetStartDate = useCallback((date?: string) => {
    if (typeof setStartDateFilter === 'function') {
      setStartDateFilter(date);
    }
    resetPagination();
  }, [resetPagination, setStartDateFilter]);

  const handleSetDealOnly = useCallback((enabled: boolean) => {
    if (typeof setDealOnly === 'function') {
      setDealOnly(enabled);
    }
    resetPagination();
  }, [resetPagination, setDealOnly]);

  return (
    <div className="min-h-screen bg-[#eef2fb] p-4 md:p-6">
      <div className="mx-auto max-w-[1300px] rounded-2xl border bg-[#edf1fb] p-4 shadow md:p-6">

        {/* Header */}
        <div className="mb-5 flex items-center justify-between bg-white px-5 py-3 rounded-2xl">
          <h1 className="text-[32px] font-bold">Tours</h1>
          <Search />
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">

          {/* Sidebar */}
          <aside className="w-full lg:w-[320px]">
            <FilterSidebar
              filters={filters}
              activeFilterCount={activeFilterCount}
              onToggleRegion={handleToggleRegion}
              onToggleAdventureStyle={handleToggleAdventureStyle}
              onToggleLanguage={handleToggleLanguage}
              onToggleAgeRange={handleToggleAgeRange}
              onSetTourLength={handleSetTourLength}
              onSetPriceRange={handleSetPriceRange}
              onSetStartDate={handleSetStartDate}
              onSetDealOnly={handleSetDealOnly}
              onResetFilters={handleResetFilters}
            />
          </aside>

          {/* Main */}
          <main className="flex-1">

          <SortBar
  sortBy={sortBy}
  viewMode={viewMode}
  totalResults={total}
  searchQuery={filters.searchQuery}
  showMaps={showMaps}
  pricePerDay={pricePerDay}
  onSortChange={handleSortChange}
  onViewChange={handleViewChange}
  onSearchChange={handleSearch}
  onToggleShowMaps={setShowMaps}
  onTogglePricePerDay={setPricePerDay}
/>

            {loading && (
              <p className="text-center py-10">Loading tours...</p>
            )}

            {error && (
              <p className="text-center text-red-500">{error}</p>
            )}

            {!loading && !error && (
              <TourGrid
                tours={tours}
                viewMode={viewMode}
                pricePerDay={pricePerDay}
              />
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                hasNextPage={currentPage < totalPages}
                hasPreviousPage={currentPage > 1}
                onPageChange={goToPage}
              />
            )}

          </main>
        </div>
      </div>
    </div>
  );
}