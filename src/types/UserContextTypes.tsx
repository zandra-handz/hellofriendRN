export interface UserProfile {
  first_name: string;
  last_name: string;
  date_of_birth: string; // ISO string, e.g. "1989-07-13"
  gender: string;
}

export interface UserSettings {
  receive_notifications: boolean;
  simplify_app_for_focus: boolean;
  language_preference: string;
  large_text: boolean;
  high_contrast_mode: boolean;
  screen_reader: boolean;
  manual_dark_mode: boolean;
  expo_push_token: string;
}

export interface UserAddress {
  title: string;
  address: string;
  coordinates: [number, number]; // [latitude, longitude]
}

export interface User {
  id: number;
  created_on: string; // ISO string
  is_banned_user: boolean;
  is_subscribed_user: boolean;
  subscription_expiration_date: string | null; // could be null
  username: string;
  email: string;
  app_setup_complete: boolean;
  is_test_user: boolean;
  phone_number: string | null;
  addresses: UserAddress[];
  profile: UserProfile;
  settings: UserSettings;
}
