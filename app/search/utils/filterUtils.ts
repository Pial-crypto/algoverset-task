import { Tour, Filters } from '../types/index';

const isTourAvailableOnDate = (tour: Tour, dateString: string) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return true;
  const seed = Number.parseInt(tour.id, 10) || tour.id.length;
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const modulo = (seed * 7 + month * 3 + tour.duration) % 5;
  return (day + modulo) % 3 !== 0;
};

export const filterTours = (tours: Tour[], filters: Filters): Tour[] => {
  return tours.filter(tour => {
    // Filter by regions
    if (filters.regions.length > 0 && !filters.regions.includes(tour.region)) {
      return false;
    }

    // Filter by tour length (duration)
    if (tour.duration < filters.tourLength.min || tour.duration > filters.tourLength.max) {
      return false;
    }

    // Filter by price range
    if (tour.price < filters.priceRange.min || tour.price > filters.priceRange.max) {
      return false;
    }

    // Filter by adventure styles
    if (filters.adventureStyles.length > 0) {
      const hasMatchingStyle = tour.adventureStyle.some(style =>
        filters.adventureStyles.includes(style)
      );
      if (!hasMatchingStyle) return false;
    }

    // Filter by languages
    if (filters.languages.length > 0) {
      const hasMatchingLanguage = tour.language.some(lang =>
        filters.languages.includes(lang)
      );
      if (!hasMatchingLanguage) return false;
    }

    // Filter by age ranges
    if (filters.ageRanges.length > 0 && !filters.ageRanges.includes(tour.ageGroup)) {
      return false;
    }

    // Filter by selected date (placeholder availability logic for demo data)
    if (filters.startDate && !isTourAvailableOnDate(tour, filters.startDate)) {
      return false;
    }

    // Filter by deals only
    if (filters.dealOnly && !tour.discount) {
      return false;
    }

    // Filter by search query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      const matchesTitle = tour.title.toLowerCase().includes(query);
      const matchesLocation = tour.location.toLowerCase().includes(query);
      const matchesDescription = tour.description.toLowerCase().includes(query);

      if (!matchesTitle && !matchesLocation && !matchesDescription) {
        return false;
      }
    }

    return true;
  });
};

export const sortTours = (tours: Tour[], sortBy: string): Tour[] => {
  const sorted = [...tours];

  switch (sortBy) {
    case 'most-popular':
      return sorted.sort((a, b) => b.reviews - a.reviews);
    case 'rating-high':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'rating-low':
      return sorted.sort((a, b) => a.rating - b.rating);
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'duration-short':
      return sorted.sort((a, b) => a.duration - b.duration);
    case 'duration-long':
      return sorted.sort((a, b) => b.duration - a.duration);
    default:
      return sorted;
  }
};

export const paginateTours = (tours: Tour[], page: number, perPage: number) => {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const items = tours.slice(start, end);
  const totalPages = Math.ceil(tours.length / perPage);

  return {
    items,
    totalPages,
    currentPage: page,
    total: tours.length,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
};

export const getUniqueAdventureStyles = (tours: Tour[]): string[] => {
  const styles = new Set<string>();
  tours.forEach(tour => {
    tour.adventureStyle.forEach(style => styles.add(style));
  });
  return Array.from(styles).sort();
};

export const getUniqueLanguages = (tours: Tour[]): string[] => {
  const languages = new Set<string>();
  tours.forEach(tour => {
    tour.language.forEach(lang => languages.add(lang));
  });
  return Array.from(languages).sort();
};
