

export type RootStackParamList = {
  hellofriend: undefined;
  UserDetails: undefined;
  MomentFocus: {
    screenCameFrom: number;
  }
  Moments: {
    scrollTo: number | null;
  }
  MomentView: {
    moment: object;
    index: number;
  }
  PreAdded: undefined;
  Finalize: undefined;
  Reload: undefined; 
  Images: undefined;
  ImageView: undefined;
  Helloes: undefined;
  HelloView: {
    startingIndex: number | null;
    inPersonFilter: boolean;
    
  },
  Locations: undefined;
  LocationView: undefined;
  UnsavedLocationView: undefined;
  Location: {
    location: any; // Adjust to your location type // YES I DID USE GPITY TO DO THIS FOR ME
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
