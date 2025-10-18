export interface UserSettings {
  id: number;
  user: number;

  expo_push_token: string;
  high_contrast_mode: boolean;
  language_preference: string;
  large_text: boolean;

  lock_in_custom_string: string | null; // can be empty or a string number
  lock_in_next: boolean;

  manual_dark_mode: boolean;
  receive_notifications: boolean;
  screen_reader: boolean;
  simplify_app_for_focus: boolean;

  user_default_category: string | number | null;
}


export interface UserSettingsContextType {
  settings: UserSettings | undefined;
  loadingSettings: boolean;
  settingsLoaded: boolean;
}
