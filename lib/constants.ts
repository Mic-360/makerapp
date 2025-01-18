export const cities = [
  'Delhi',
  'Mumbai',
  'Kolkata',
  'Bengaluru',
  'Chennai',
  'Hyderabad',
  'Ahmedabad',
  'Pune',
  'Jaipur',
];

export const categories = [
  '3D Printer',
  'Laser Cutting',
  'Vinyl Cutter',
  'CNC Router',
  'Laser Engraver',
  'Wood CNC',
  '3D Scanner',
  'Lathe Machine',
  'PCB Machine',
  'Soldering Station',
  '3D Printer',
  'Laser Cutting',
  'Vinyl Cutter',
  'CNC Router',
  'Laser Engraver',
  'Wood CNC',
  '3D Scanner',
  'Lathe Machine',
  'PCB Machine',
  'Soldering Station',
];

interface SortOption {
  id: string;
  label: string;
}

export const sortOptions: SortOption[] = [
  { id: 'location-closest', label: 'Location (Closest first)' },
  { id: 'location-farthest', label: 'Location (Farthest first)' },
  { id: 'price-low', label: 'Price (Low to High cost)' },
  { id: 'price-high', label: 'Price (High to Low cost)' },
  { id: 'popularity', label: 'Popularity' },
  { id: 'rating', label: 'Customer Rating' },
  { id: 'newest', label: 'Whats new' },
];

export interface MakerSpace {
  id: string;
  name: string;
  location: string;
  image: string;
  stars: number;
  shortDescription: string;
  fullDescription: string;
  categories: string[];
}
