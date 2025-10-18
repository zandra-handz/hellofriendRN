// types/LDTheme.ts
export type LDTheme = {
  overlayBackground: string;
  darkerOverlayBackground: string;
  lighterOverlayBackground: string;
  primaryText: string;
  primaryBackground: string;
  darkerBackground: string;
  darkestBackground: string;
  dangerZoneText: string;

  toggleButtonColor: string;
  toggleOn: string;
  toggleOff: string;

  divider: {
    width: number;
    backgroundColor: string;
  };

  header: {
    backgroundColor: string;
    borderBottomColor: string;
    borderBottomWidth: number;
  };

  headerTextColor: string;
};
