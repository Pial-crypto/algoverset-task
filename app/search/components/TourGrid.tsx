'use client';

import { Tour } from '../types/index';
import { TourCard } from './TourCard';

interface TourGridProps {
  tours: Tour[];
  viewMode?: 'grid' | 'list';
  isLoading?: boolean;
  pricePerDay?: boolean;
}

export const TourGrid = ({ tours, viewMode = 'grid', isLoading = false, pricePerDay = false }: TourGridProps) => {
  if (isLoading) {
    return (
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        : 'space-y-4'
      }>
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg animate-pulse h-80" />
        ))}
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-12 text-center">
        <p className="text-gray-600 text-lg">No tours found matching your criteria.</p>
        <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid'
      ? 'grid grid-cols-1 gap-4'
      : 'space-y-4'
    }>
      {tours.map(tour => (
        <TourCard
          key={tour.id}
          tour={tour}
          viewMode={viewMode}
          pricePerDay={pricePerDay}
        />
      ))}
    </div>
  );
};
