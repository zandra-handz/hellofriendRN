// src/navigation/types.ts

export type RootStackParamList = {
  hellofriend: undefined;
  UserDetails: undefined;
  MomentFocus: undefined;
  Moments: {
    scrollTo: number | null;
  }
  PreAdded: undefined;
  Finalize: undefined;
  Reload: undefined;
  MomentView: undefined;
  Images: undefined;
  ImageView: undefined;
  Helloes: undefined;
  HelloView: undefined;
  Locations: undefined;
  LocationView: undefined;
  UnsavedLocationView: undefined;
  Location: {
    location: any; // Adjust to your location type
    favorite: boolean;
  };
  LocationSend: undefined;
  LocationEdit: undefined;
  LocationCreate: undefined;
  LocationSearch: undefined;
  MidpointLocationSearch: undefined;
  CalculateTravelTimes: undefined;
  AddImage: undefined;
  AddHello: undefined;
  SelectFriend: undefined;
  AddFriend: undefined;

  Welcome: undefined;
  Auth: undefined;
  RecoverCredentials: undefined;
};
