//items in friendList + the selectedFriend
export interface Friend {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  first_meet_entered: string;
  next_meet: number;
  user: number;

  created_on: string;
  updated_on: string;

  saved_color_dark: string;
  saved_color_light: string;
  theme_color_dark: string;
  theme_color_light: string;
  theme_color_font: string;
  theme_color_font_secondary: string;

  suggestion_settings: number;
}

export interface FriendAddresses {
  address: string;
  created_on: string;
  friend: number;
  id: number;
  is_default: boolean;
  latitude: string;
  longitude: string;
  title: string;
  updated_on: string;
  user: number;
  validated_address: boolean;
}

export interface FriendFaves {
  created_on: string;
  light_color: string;
  dark_color: string;
  font_color: string;
  font_color_secondary: string;
  friend: number;
  id: number;
  locations: number[];
  second_color_option: boolean;
  updated_on: string;
  use_friend_color_theme: boolean;
  user: number;
}

type EffortRequired = 1 | 2 | 3 | 4 | 5;
type PriorityLevel = 1 | 2 | 3;

export interface SuggestionSettings {
  can_schedule: boolean; //usage not implemented on backend as of 7/22/2025
  category_limit_formula: number; //new user categories aren't affected by this
  effort_required: EffortRequired;
  friend: number;
  id: number;
  phone_number: string | null;
  priority_level: PriorityLevel;
  user: number;
}

export interface FriendDashboardData {
  category_activations_left: number;
  date: string;
  days_since: number;
  days_since_words: string;
  first_meet_entered: string;
  first_name: string;
  friend_addresses: FriendAddresses;
  friend_faves: FriendFaves;
  future_date_in_words: string;
  id: number;
  last_name: string;
  name: string;
  previous_meet_type: string;
  suggestion_settings: SuggestionSettings;
  time_score: number;
}
