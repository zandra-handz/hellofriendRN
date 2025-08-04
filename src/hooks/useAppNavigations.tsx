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
}

interface hookReturns {
  navigateToAddFriend: () => void;
  navigateToFinalize: () => void;
  navigateToHelloView: ({startingIndex, inPersonFilter}: NavToHelloViewProps) => void;
  navigateToLocationSearch: () => void;
  navigateToMomentFocus: ({screenCameFrom }: NavToMomentFocusProp) => void;
  navigateToMoments: ({ scrollTo }: NavToMomentsProp) => void;
  navigateToMomentView: ({ moment, index }: NavToMomentViewProps) => void;

  navigateBack: () => void;
}

const useAppNavigations = (): hookReturns => {
  const navigation = useNavigation<NavigationProp>();

  const navigateToAddFriend = () => {
    navigation.navigate("AddFriend");
  };


    const navigateToHelloView = ({ startingIndex, inPersonFilter }: NavToHelloViewProps) => {
    navigation.navigate("HelloView", { startingIndex, inPersonFilter });
  };


  const navigateToMomentFocus = ({screenCameFrom}: NavToMomentFocusProp) => {
    navigation.navigate("MomentFocus", {screenCameFrom: screenCameFrom });
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

  const navigateBack = () => {
    navigation.goBack();
  };

  return {
    navigateToAddFriend,
    navigateToFinalize,
    navigateToHelloView,
    navigateToLocationSearch,
    navigateToMomentFocus,
    navigateToMoments,
    navigateToMomentView,

    navigateBack,
  };
};

export default useAppNavigations;
