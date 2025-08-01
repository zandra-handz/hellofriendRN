import { View, Text } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Moment } from "../types/MomentContextTypes";
import { RootStackParamList } from "../types/NavigationTypes";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type NavToMomentsProp = {
  scrollTo: number | null;
};

type NavToMomentViewProp = {
  moment: Moment; // <-- whatever your `moment` object type is
  index: number;
};

interface hookReturns {
  navigateToAddFriend: () => void;
  navigateToFinalize: () => void;
  navigateToLocationSearch: () => void;
  navigateToMomentFocus: () => void;
  navigateToMoments: ({ scrollTo }: NavToMomentsProp) => void;
  navigateToMomentView: ({ moment, index }: NavToMomentViewProp) => void;

  navigateBack: () => void;
}

const useAppNavigations = (): hookReturns => {
  const navigation = useNavigation<NavigationProp>();

  const navigateToAddFriend = () => {
    navigation.navigate("AddFriend");
  };

  const navigateToMomentFocus = () => {
    navigation.navigate("MomentFocus");
  };

  const navigateToMoments = ({ scrollTo }: NavToMomentsProp) => {
    navigation.navigate("Moments", { scrollTo: scrollTo });
  };

  const navigateToMomentView = ({ moment, index }: NavToMomentViewProp) => {
    navigation.navigate("MomentView", { moment, index });
  };

  const navigateToLocationSearch = () => {
    navigation.navigate("LocationSearch");
  };

  const navigateToFinalize = () => {
    navigation.navigate("Finalize");
  };

  const navigateBack = () => {
    navigation.goBack();
  };

  return {
    navigateToAddFriend,
    navigateToFinalize,
    navigateToLocationSearch,
    navigateToMomentFocus,
    navigateToMoments,
    navigateToMomentView,

    navigateBack,
  };
};

export default useAppNavigations;
