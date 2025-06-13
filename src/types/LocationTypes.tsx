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
