 'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Filters, Tour } from '../types';

interface Props {
  currentPage: number;
  perPage: number;
  sortBy: string;
  filters: Filters;
}

export const useFetchTours = ({
  currentPage,
  perPage,
  sortBy,
  filters,
}: Props) => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchTours = async () => {
      try {
        setLoading(true);
        setError(null);

        const params: any = {
          page: currentPage,
          limit: perPage,
          sortBy,
        };


        if (filters.searchQuery?.trim()) {
          params.search = filters.searchQuery.trim();
        }

        if (filters.regions.length) {
          params.region = filters.regions; 
        }

        if (filters.adventureStyles.length) {
          params.adventureStyle = filters.adventureStyles;
        }

        if (filters.languages.length) {
          params.language = filters.languages;
        }

        if (filters.ageRanges.length) {
          params.ageRange = filters.ageRanges; 
        }

        if (filters.priceRange) {
          params.minPrice = filters.priceRange.min;
          params.maxPrice = filters.priceRange.max;
        }

        if (filters.tourLength) {
          params.minDuration = filters.tourLength.min;
          params.maxDuration = filters.tourLength.max;
        }

        if (filters.startDate) {
          params.startDate = new Date(filters.startDate).toISOString();
        }

        if (filters.dealOnly) {
          params.dealOnly = true;
        }

        const res = await axios.get('/api/tours', {
          params,
          signal: controller.signal,
          paramsSerializer: {
            indexes: null, 
          },
        });

        setTours(res.data.data || []);
        setTotalPages(res.data.meta?.totalPages || 1);
        setTotal(res.data.meta?.total || 0);
      } catch (err: any) {
        if (err.name === 'CanceledError') return;
        console.error(err);
        setError('Failed to load tours');
      } finally {
        setLoading(false);
      }
    };

    
    const delay = setTimeout(fetchTours, 300);

    return () => {
      clearTimeout(delay);
      controller.abort(); // cancel previous request
    };
  }, [currentPage, perPage, sortBy, JSON.stringify(filters)]);

  return { tours, loading, error, totalPages, total };
};