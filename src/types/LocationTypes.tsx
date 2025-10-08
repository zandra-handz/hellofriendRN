export interface Location {
  id: number;
  title: string;
  latitude: string | number;
  longitude: string | number;
  address: string;
  // Optional and extended fields
  isFave?: boolean;
  isPastHello?: boolean;
  helloCount?: number;
  friendsCount?: number;
  friends?: { id: number; name: string | number }[];
  personal_experience_info?: string;
  parking_score?: string;
  validatedAddress?: boolean;
  zipCode?: string | null;
  category?: string | null;
}

export interface FocusedLocation {
  address: string;
  id: number;
  category?: string | null;
  friends?: { id: number; name: string | number }[];
  friendsCount?: number;
  helloCount?: number;

  title: string;
  latitude: string | number;
  longitude: string | number;
  matchedIndex?: number | null; // not using after getting rid of car sliders?
  matchingHelloes: { id: number }[]; // is this correct?
  // Optional and extended fields
  isFave?: boolean;
  isPastHello?: boolean;
  personal_experience_info?: string;
  parking_score?: string;
  validatedAddress?: boolean;
  zipCode?: string | null;
}
