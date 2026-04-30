'use client';

import { useMemo, useState } from 'react';
import { Tour, Filters } from '../types/index';
import { filterTours, sortTours, paginateTours } from '../utils/filterUtils';

export const useSearch = (allTours: Tour[], filters: Filters, currentPage: number, perPage: number = 9) => {
  const [sortBy, setSortBy] = useState('most-popular');

  const results = useMemo(() => {
    // Apply filters
    let filtered = filterTours(allTours, filters);

    // Apply sorting
    filtered = sortTours(filtered, sortBy);

    // Apply pagination
    const paginated = paginateTours(filtered, currentPage, perPage);

    return {
      items: paginated.items,
      total: paginated.total,
      totalPages: paginated.totalPages,
      currentPage: paginated.currentPage,
      hasNextPage: paginated.hasNextPage,
      hasPreviousPage: paginated.hasPreviousPage,
      perPage
    };
  }, [allTours, filters, sortBy, currentPage, perPage]);

  return {
    ...results,
    sortBy,
    setSortBy
  };
};
