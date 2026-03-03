// src/constants/toastMessages.ts

// ---- Types ----

export interface FlashMessageData {
  text: string;
  error: boolean;
  duration: number;
}

// ---- Durations (ms) ----

export const TOAST_DURATION_FAST = 600;
export const TOAST_DURATION_REGULAR = 1000;
export const TOAST_DURATION_SLOW = 2000;

// ---- Strings ----

// Modal - User Settings
export const modal_settings_update_success_string = "Success!";
export const modal_settings_update_error_string = "Oops! Something went wrong";

// Modal - Friend Faves Theme
export const modal_friendfaves_manualoff_success_string = "Custom colors off";
export const modal_friendfaves_manualoff_error_string = "Oops! Theme update failed";
export const modal_friendfaves_manualon_success_string = "Custom colors on!";
export const modal_friendfaves_manualon_error_string = "Oops! Could not enable manual theme";
export const modal_friendfaves_colors_success_string = "Colors saved!";
export const modal_friendfaves_colors_error_string = "Oops! Color update failed";

// Screen - Moments / Hello
export const screen_moments_addtohello_success_string = "Added to hello!";
export const screen_moments_addtohello_error_string = "Oops! Not added";
export const screen_moments_missingdata_error_string = "Oops! Missing data required";

// Modal - Account
export const modal_account_update_success_string = "Account updated!";
export const modal_account_update_error_string = "Oops! Account update failed";

// ---- Helpers ----

const success = (text: string, duration: number): FlashMessageData => ({
  text,
  error: false,
  duration,
});

const error = (text: string, duration: number): FlashMessageData => ({
  text,
  error: true,
  duration,
});

// ---- Toasts ----

// Modal - User Settings
export const settingsUpdateSuccess = success(modal_settings_update_success_string, TOAST_DURATION_REGULAR);
export const settingsUpdateError = error(modal_settings_update_error_string, TOAST_DURATION_REGULAR);

// Modal - Friend Faves Theme
export const friendFavesManualOffSuccess = success(modal_friendfaves_manualoff_success_string, TOAST_DURATION_REGULAR);
export const friendFavesManualOffError = error(modal_friendfaves_manualoff_error_string, TOAST_DURATION_REGULAR);
export const friendFavesManualOnSuccess = success(modal_friendfaves_manualon_success_string, TOAST_DURATION_REGULAR);
export const friendFavesManualOnError = error(modal_friendfaves_manualon_error_string, TOAST_DURATION_SLOW);
export const friendFavesColorsSavedSuccess = success(modal_friendfaves_colors_success_string, TOAST_DURATION_REGULAR);
export const friendFavesColorsSavedError = error(modal_friendfaves_colors_error_string, TOAST_DURATION_REGULAR);

// Screen - Moments / Hello
export const momentsAddToHelloSuccess = success(screen_moments_addtohello_success_string, TOAST_DURATION_REGULAR);
export const momentsAddToHelloError = error(screen_moments_addtohello_error_string, TOAST_DURATION_REGULAR);
export const momentsMissingDataError = error(screen_moments_missingdata_error_string, TOAST_DURATION_SLOW);

// Modal - Account
export const accountUpdateSuccess = success(modal_account_update_success_string, TOAST_DURATION_REGULAR);
export const accountUpdateError = error(modal_account_update_error_string, TOAST_DURATION_REGULAR);