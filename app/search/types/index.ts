export interface Tour {
  id: string;
  title: string;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  duration: number;
  experiences: number;
  description: string;
  language: string[];
  ageGroup: string;
  includes: string[];
  freeBooking: boolean;
  premiumInclusion: boolean;
  tourType: string;
  region: string;
  adventureStyle: string[];
  startDate?: string;
}

export interface Filters {
  regions: string[];
  tourLength: {
    min: number;
    max: number;
  };
  priceRange: {
    min: number;
    max: number;
  };
  adventureStyles: string[];
  languages: string[];
  ageRanges: string[];
  startDate?: string;
  dealOnly: boolean;
  searchQuery: string;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface Region {
  name: string;
  count: number;
}

export interface TourStats {
  total: number;
  filtered: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
}
