// import { View, Text } from "react-native";
// import React from "react";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { useNavigation } from "@react-navigation/native";
// import { Moment } from "../types/MomentContextTypes";
// import { RootStackParamList } from "../types/NavigationTypes";
// import { Location } from "../types/LocationTypes";
// type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// type NavToHelloViewProps = {
//   startingIndex: number | null; // can this be null?
//   inPersonFilter: boolean;
// };

// type NavToAddImageProps = {
//   imageUri: string;
// };

// type NavToSelectFriendProps = {
//   useNavigateBack?: boolean;
// };

// type NavToLocationEditProps = {
//   location: Location;
//   focusOn: string;
// };

// type NavToMomentsProp = {
//   scrollTo: number | null;
// };

// type NavToMomentViewProps = {
//   moment: Moment; // <-- whatever your `moment` object type is
//   index: number;
// };

// type NavToMomentFocusProp = {
//   screenCameFrom: number; // 0 = nav back after moment save, 1 = stay after moment save
// };
// type NavToMomentFocusWithTextProp = {
//   screenCameFrom: number; // 0 = nav back after moment save, 1 = stay after moment save
//   momentText?: string | null;
// };

// type NavToGeckoProp = {
//   selection?: number | null;
//   autoPick?: false | null;
// };

// type NavToGeckoSelectSettingsProp = {
//   selection: number;
// };

// type NavToAuthProp = {
//   usernameEntered: string | null;
// };

// type NavToNewAccountProp = {
//   usernameEntered: string | null;
// };

// interface hookReturns {
//   navigateToHome: () => void;
//   navigateToAddFriend: () => void;
//   navigateToSelectFriend: ({ useNavigateBack }: NavToSelectFriendProps) => void;
//   navigateToFinalize: () => void;
//   navigateToHistory: () => void;
//   navigateToHelloes: () => void;
//   navigateToHelloView: ({
//     startingIndex,
//     inPersonFilter,
//   }: NavToHelloViewProps) => void;
//   navigateToAddImage: ({ imageUri }: NavToAddImageProps) => void;

//   navigateToLocationSearch: () => void;
//   navigateToLocationEdit: ({
//     location,
//     focusOn,
//   }: NavToLocationEditProps) => void;
//   navigateToMomentFocus: ({ screenCameFrom }: NavToMomentFocusProp) => void;
//   navigateToMomentFocusWithText: ({
//     screenCameFrom,
//     momentText,
//   }: NavToMomentFocusWithTextProp) => void;
//   navigateToGecko: ({ selection, autoPick }: NavToGeckoProp) => void;
//   navigateToGeckoSelectSettings: ({
//     selection,
//   }: NavToGeckoSelectSettingsProp) => void;

//   navigateToMoments: ({ scrollTo }: NavToMomentsProp) => void;
//   navigateToMomentView: ({ moment, index }: NavToMomentViewProps) => void;

//   navigateToFidget: () => void;
//   navigateToAuth: ({ usernameEntered }: NavToAuthProp) => void;
//   navigateToNewAccount: ({ usernameEntered }: NavToNewAccountProp) => void;
//   navigateToRecoverCredentials: () => void;
//   navigateBack: () => void;
// }

// const useAppNavigations = (): hookReturns => {
//   const navigation = useNavigation<NavigationProp>();

//   const navigateToHome = () => {
//     navigation.navigate("hellofriend");
//   };

//   const navigateToAddFriend = () => {
//     navigation.navigate("AddFriend");
//   };

//   const navigateToSelectFriend = ({
//     useNavigateBack,
//   }: NavToSelectFriendProps) => {
//     navigation.navigate("SelectFriend", { useNavigateBack });
//   };

//   const navigateToHistory = () => {
//     navigation.navigate("History");
//   };

//   const navigateToHelloes = () => {
//     navigation.navigate("Helloes");
//   };

//   const navigateToHelloView = ({
//     startingIndex,
//     inPersonFilter,
//   }: NavToHelloViewProps) => {
//     navigation.navigate("HelloView", { startingIndex, inPersonFilter });
//   };

//   const navigateToAddImage = ({ imageUri }: NavToAddImageProps) => {
//     navigation.navigate("AddImage", { imageUri });
//   };

//   const navigateToLocationEdit = ({
//     location,
//     focusOn,
//   }: NavToLocationEditProps) => {
//     navigation.navigate("LocationEdit", {
//       category: location.category || "",
//       notes: location.personal_experience_info || "",
//       parking: location.parking_score || "",
//       focusOn: focusOn,
//     });
//   };

//   const navigateToMomentFocus = ({ screenCameFrom }: NavToMomentFocusProp) => {
//     navigation.navigate("MomentFocus", {
//       screenCameFrom: screenCameFrom,
//     });
//   };

//   const navigateToMomentFocusWithText = ({
//     screenCameFrom,
//     momentText,
//   }: NavToMomentFocusWithTextProp) => {
//     navigation.navigate("MomentFocus", {
//       screenCameFrom: screenCameFrom,
//       momentText: momentText,
//     });
//   };
// // const navigateToGecko = ({ selection = 0 }: NavToGeckoProp) => {
// //   navigation.navigate("Gecko", {
// //     selection,
// //   });
// // };

// const navigateToGecko = (
//   { selection = 0, autoPick = false}: NavToGeckoProp = {}
// ) => {
//   navigation.navigate("Gecko", { selection, autoPick });
// };


//   const navigateToGeckoSelectSettings = ({
//     selection,
//   }: NavToGeckoSelectSettingsProp) => {
//     navigation.navigate("GeckoSelectSettings", {
//       selection: selection,
//     });
//   };

//   const navigateToMoments = ({ scrollTo = null }: NavToMomentsProp) => {
//     navigation.navigate("Moments", { scrollTo: scrollTo });
//   };

//   const navigateToMomentView = ({ moment, index }: NavToMomentViewProps) => {
//     navigation.navigate("MomentView", { moment, index });
//   };

//   const navigateToLocationSearch = () => {
//     navigation.navigate("LocationSearch");
//   };

//   const navigateToFinalize = () => {
//     navigation.navigate("Finalize");
//   };

//   const navigateToFidget = () => {
//     navigation.navigate("Fidget");
//   };

//   const navigateToWelcome = () => {
//     navigation.navigate("Welcome");
//   };

//   const navigateToAuth = ({ usernameEntered }: NavToAuthProp) => {
//     navigation.navigate("Auth", { usernameEntered });
//   };

//   const navigateToNewAccount = ({ usernameEntered }: NavToNewAccountProp) => {
//     navigation.navigate("NewAccount", { usernameEntered });
//   };

//   const navigateToRecoverCredentials = () => {
//     navigation.navigate("RecoverCredentials");
//   };

//   const navigateBack = () => {
//     navigation.goBack();
//   };

//   return {
//     navigateToHome,
//     navigateToAddFriend,
//     navigateToSelectFriend,
//     navigateToFinalize,
//     navigateToHistory,
//     navigateToHelloes,
//     navigateToHelloView,
//     navigateToAddImage,
//     navigateToLocationEdit,
//     navigateToLocationSearch,
//     navigateToMomentFocus,
//     navigateToMomentFocusWithText,
//     navigateToGecko,
//     navigateToGeckoSelectSettings,
//     navigateToMoments,
//     navigateToMomentView,
//     navigateToWelcome,
//     navigateToAuth,
//     navigateToNewAccount,
//     navigateToRecoverCredentials,
//     navigateToFidget,

//     navigateBack,
//   };
// };

// export default useAppNavigations;
import { View, Text } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Moment } from "../types/MomentContextTypes";
import { RootStackParamList } from "../types/NavigationTypes";
import { Location } from "../types/LocationTypes";
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type NavToHelloViewProps = {
  startingIndex: number | null; // can this be null?
  inPersonFilter: boolean;
};

type NavToAddImageProps = {
  imageUri: string;
};

type NavToSelectFriendProps = {
  useNavigateBack?: boolean;
};

type NavToLocationEditProps = {
  location: Location;
  focusOn: string;
};

type NavToMomentsProp = {
  scrollTo: number | null;
};

type NavToMomentViewProps = {
  moment: Moment; // <-- whatever your `moment` object type is
  index: number;
};

type NavToMomentFocusProp = {
  screenCameFrom: number; // 0 = nav back after moment save, 1 = stay after moment save
};
type NavToMomentFocusWithTextProp = {
  screenCameFrom: number; // 0 = nav back after moment save, 1 = stay after moment save
  momentText?: string | null;
};

type NavToGeckoProp = {
  selection?: number | null;
  autoPick?: boolean | null;
};

type NavToGeckoSelectSettingsProp = {
  selection: number;
};

type NavToAuthProp = {
  usernameEntered: string | null;
};

type NavToNewAccountProp = {
  usernameEntered: string | null;
};

interface hookReturns {
  navigateToHome: () => void;
  navigateToAddFriend: () => void;
  navigateToSelectFriend: ({ useNavigateBack }: NavToSelectFriendProps) => void;
  navigateToFinalize: () => void;
  navigateToHistory: () => void;
  navigateToHelloes: () => void;
  navigateToHelloView: ({
    startingIndex,
    inPersonFilter,
  }: NavToHelloViewProps) => void;
  navigateToAddImage: ({ imageUri }: NavToAddImageProps) => void;

  navigateToLocationSearch: () => void;
  navigateToLocationEdit: ({
    location,
    focusOn,
  }: NavToLocationEditProps) => void;
  navigateToMomentFocus: ({ screenCameFrom }: NavToMomentFocusProp) => void;
  navigateToMomentFocusWithText: ({
    screenCameFrom,
    momentText,
  }: NavToMomentFocusWithTextProp) => void;
  navigateToGecko: ({ selection, autoPick }: NavToGeckoProp) => void;
  navigateToGeckoSelectSettings: ({
    selection,
  }: NavToGeckoSelectSettingsProp) => void;

  navigateToMoments: ({ scrollTo }: NavToMomentsProp) => void;
  navigateToMomentView: ({ moment, index }: NavToMomentViewProps) => void;

  navigateToFidget: () => void;
  navigateToAuth: ({ usernameEntered }: NavToAuthProp) => void;
  navigateToNewAccount: ({ usernameEntered }: NavToNewAccountProp) => void;
  navigateToRecoverCredentials: () => void;
  navigateBack: () => void;
  resetParams: (params: Partial<RootStackParamList[keyof RootStackParamList]>) => void;
}

const useAppNavigations = (): hookReturns => {
  const navigation = useNavigation<NavigationProp>();

  const navigateToHome = () => {
    navigation.navigate("hellofriend");
  };

  const navigateToAddFriend = () => {
    navigation.navigate("AddFriend");
  };

  const navigateToSelectFriend = ({
    useNavigateBack,
  }: NavToSelectFriendProps) => {
    navigation.navigate("SelectFriend", { useNavigateBack });
  };

  const navigateToHistory = () => {
    navigation.navigate("History");
  };

  const navigateToHelloes = () => {
    navigation.navigate("Helloes");
  };

  const navigateToHelloView = ({
    startingIndex,
    inPersonFilter,
  }: NavToHelloViewProps) => {
    navigation.navigate("HelloView", { startingIndex, inPersonFilter });
  };

  const navigateToAddImage = ({ imageUri }: NavToAddImageProps) => {
    navigation.navigate("AddImage", { imageUri });
  };

  const navigateToLocationEdit = ({
    location,
    focusOn,
  }: NavToLocationEditProps) => {
    navigation.navigate("LocationEdit", {
      category: location.category || "",
      notes: location.personal_experience_info || "",
      parking: location.parking_score || "",
      focusOn: focusOn,
    });
  };

  const navigateToMomentFocus = ({ screenCameFrom }: NavToMomentFocusProp) => {
    navigation.navigate("MomentFocus", {
      screenCameFrom: screenCameFrom,
    });
  };

  const navigateToMomentFocusWithText = ({
    screenCameFrom,
    momentText,
  }: NavToMomentFocusWithTextProp) => {
    navigation.navigate("MomentFocus", {
      screenCameFrom: screenCameFrom,
      momentText: momentText,
    });
  };

  const navigateToGecko = (
    { selection = 0, autoPick = false}: NavToGeckoProp = {}
  ) => {
    navigation.navigate("Gecko", { selection, autoPick });
  };

  const navigateToGeckoSelectSettings = ({
    selection,
  }: NavToGeckoSelectSettingsProp) => {
    navigation.navigate("GeckoSelectSettings", {
      selection: selection,
    });
  };

  const navigateToMoments = ({ scrollTo = null }: NavToMomentsProp) => {
    navigation.navigate("Moments", { scrollTo: scrollTo });
  };

  const navigateToMomentView = ({ moment, index }: NavToMomentViewProps) => {
    navigation.navigate("MomentView", { moment, index });
  };

  const navigateToLocationSearch = () => {
    navigation.navigate("LocationSearch");
  };

  const navigateToFinalize = () => {
    navigation.navigate("Finalize");
  };

  const navigateToFidget = () => {
    navigation.navigate("Fidget");
  };

  const navigateToWelcome = () => {
    navigation.navigate("Welcome");
  };

  const navigateToAuth = ({ usernameEntered }: NavToAuthProp) => {
    navigation.navigate("Auth", { usernameEntered });
  };

  const navigateToNewAccount = ({ usernameEntered }: NavToNewAccountProp) => {
    navigation.navigate("NewAccount", { usernameEntered });
  };

  const navigateToRecoverCredentials = () => {
    navigation.navigate("RecoverCredentials");
  };

  const navigateBack = () => {
    navigation.goBack();
  };

  // ✅ New function to reset/clear specific params
  const resetParams = (params: Partial<RootStackParamList[keyof RootStackParamList]>) => {
    navigation.setParams(params as any);
  };

  return {
    navigateToHome,
    navigateToAddFriend,
    navigateToSelectFriend,
    navigateToFinalize,
    navigateToHistory,
    navigateToHelloes,
    navigateToHelloView,
    navigateToAddImage,
    navigateToLocationEdit,
    navigateToLocationSearch,
    navigateToMomentFocus,
    navigateToMomentFocusWithText,
    navigateToGecko,
    navigateToGeckoSelectSettings,
    navigateToMoments,
    navigateToMomentView,
    navigateToWelcome,
    navigateToAuth,
    navigateToNewAccount,
    navigateToRecoverCredentials,
    navigateToFidget,
    navigateBack,
    resetParams, // ✅ Added to return
  };
};

export default useAppNavigations;