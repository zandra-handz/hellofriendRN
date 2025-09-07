import { View, Text } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Moment } from "../types/MomentContextTypes";
import { RootStackParamList } from "../types/NavigationTypes";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type NavToHelloViewProps = {
  startingIndex: number | null; // can this be null?
  inPersonFilter: boolean;
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

type NavToAuthProp = {
  usernameEntered: string | null;
};

type NavToNewAccountProp = {
  usernameEntered: string | null;
};

interface hookReturns {
  navigateToHome: () => void;
  navigateToAddFriend: () => void;
  navigateToSelectFriend: () => void;
  navigateToFinalize: () => void;
  navigateToHelloes: () => void;
  navigateToHelloView: ({
    startingIndex,
    inPersonFilter,
  }: NavToHelloViewProps) => void;
  navigateToLocationSearch: () => void;
  navigateToMomentFocus: ({ screenCameFrom }: NavToMomentFocusProp) => void;
  navigateToMomentFocusWithText: ({
    screenCameFrom,
    momentText,
  }: NavToMomentFocusWithTextProp) => void;
  navigateToMoments: ({ scrollTo }: NavToMomentsProp) => void;
  navigateToMomentView: ({ moment, index }: NavToMomentViewProps) => void;

  navigateToFidget: () => void;
  navigateToAuth: ({ usernameEntered }: NavToAuthProp) => void;
  navigateToNewAccount: ({ usernameEntered }: NavToNewAccountProp) => void;
  navigateToRecoverCredentials: () => void;
  navigateBack: () => void;
}

const useAppNavigations = (): hookReturns => {
  const navigation = useNavigation<NavigationProp>();


  const navigateToHome = () => {
    navigation.navigate("hellofriend")

  };

  const navigateToAddFriend = () => {
    navigation.navigate("AddFriend");
  };

  const navigateToSelectFriend = () => {
    navigation.navigate("SelectFriend");
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

  const navigateToMoments = ({ scrollTo }: NavToMomentsProp) => {
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

  return {
    navigateToHome,
    navigateToAddFriend,
    navigateToSelectFriend,
    navigateToFinalize,
    navigateToHelloes,
    navigateToHelloView,
    navigateToLocationSearch,
    navigateToMomentFocus,
    navigateToMomentFocusWithText,
    navigateToMoments,
    navigateToMomentView,
    navigateToWelcome,
    navigateToAuth,
    navigateToNewAccount,
    navigateToRecoverCredentials,
    navigateToFidget,

    navigateBack,
  };
};

export default useAppNavigations;
