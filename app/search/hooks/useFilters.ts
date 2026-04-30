'use client';

import { useState, useCallback } from 'react';
import { Filters } from '../types/index';

const DEFAULT_FILTERS: Filters = {
  regions: [],
  tourLength: { min: 1, max: 7 },
  priceRange: { min: 100, max: 1200 },
  adventureStyles: [],
  languages: [],
  ageRanges: [],
  startDate: undefined,
  dealOnly: false,
  searchQuery: '',
};

export const useFilters = () => {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const toggleRegion = useCallback((region: string) => {
    setFilters(prev => ({
      ...prev,
      regions: prev.regions.includes(region)
        ? prev.regions.filter(r => r !== region)
        : [...prev.regions, region]
    }));
  }, []);

  const toggleAdventureStyle = useCallback((style: string) => {
    setFilters(prev => ({
      ...prev,
      adventureStyles: prev.adventureStyles.includes(style)
        ? prev.adventureStyles.filter(s => s !== style)
        : [...prev.adventureStyles, style]
    }));
  }, []);

  const toggleLanguage = useCallback((language: string) => {
    setFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  }, []);

  const toggleAgeRange = useCallback((ageRange: string) => {
    setFilters(prev => ({
      ...prev,
      ageRanges: prev.ageRanges.includes(ageRange)
        ? prev.ageRanges.filter(a => a !== ageRange)
        : [...prev.ageRanges, ageRange]
    }));
  }, []);

  const setTourLength = useCallback((min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      tourLength: { min, max }
    }));
  }, []);

  const setPriceRange = useCallback((min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { min, max }
    }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: query
    }));
  }, []);

  const setStartDate = useCallback((date?: string) => {
    setFilters(prev => ({
      ...prev,
      startDate: date
    }));
  }, []);

  const setDealOnly = useCallback((enabled: boolean) => {
    setFilters(prev => ({
      ...prev,
      dealOnly: enabled
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS });
  }, []);

  const getActiveFilterCount = useCallback(() => {
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

  return {
    filters,
    toggleRegion,
    toggleAdventureStyle,
    toggleLanguage,
    toggleAgeRange,
    setTourLength,
    setPriceRange,
    setSearchQuery,
    setStartDate,
    setDealOnly,
    resetFilters,
    getActiveFilterCount
  };
};
