export type BookingStatus = 'available' | 'partial' | 'booked';

export interface BookingData {
  [dateStr: string]: {
    status: BookingStatus;
    morningBooked?: boolean;
    eveningBooked?: boolean;
  };
}

export interface VenueItem {
  id: string;
  name: string;
  type: 'INDOOR' | 'OUTDOOR' | 'GARDEN';
  capacity: string;
  description: string;
  image: string;
  status: 'Available' | 'Booked';
}

export interface GalleryItem {
  id: string;
  alt: string;
  category: 'INDOOR' | 'GARDEN' | 'STAGE';
  image: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  stars: number;
}

export interface PackageItem {
  id: string;
  name: string;
  price: number;
  priceDisplay: string;
  capacity: string;
  tagline: string;
  inclusions: string[];
  note: string;
  featured?: boolean;
}
