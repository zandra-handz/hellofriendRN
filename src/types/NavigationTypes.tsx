export type RootStackParamList = {
  hellofriend: undefined;
  UserDetails: undefined;
  MomentFocus: {
    screenCameFrom: number;
    momentText?: string | null;
  };
    Gecko: {
      selection?: number | null;
      autoPick?: false | null;
    }
    
  GeckoSelectSettings: {
    selection: number; 
  }
  Moments: {
    scrollTo: number | null;
  };
  MomentView: {
    moment: object;
    index: number;
  };
  PreAdded: undefined;
  Finalize: undefined;
  Reload: undefined;
  Helloes: undefined;
  HelloView: {
    startingIndex: number | null;
    inPersonFilter: boolean;
  };
  Images: undefined;
  ImageView: undefined;
  AddImage: {
    imageUri: string;
  };
  Locations: undefined;
  LocationView: undefined;
  UnsavedLocationView: undefined;
  Location: {
    location: any; // Adjust to your location type // YES I DID USE GPITY TO DO THIS FOR ME
    favorite: boolean;
  };
  LocationSend: undefined;
  LocationEdit: {
    location: Location,
    focusOn?: string,
  }
  LocationCreate: undefined;
  LocationSearch: undefined;
  MidpointLocationSearch: undefined;
  CalculateTravelTimes: undefined;
  AddHello: undefined;
  SelectFriend: {
    useNavigateBack?: boolean 
  };
  AddFriend: undefined;

  Fidget: undefined;

  Welcome: undefined;
  Auth: {
    usernameEntered: string | null;
  };
  NewAccount: {
    usernameEntered: string | null;
  };
  RecoverCredentials: undefined;
};
