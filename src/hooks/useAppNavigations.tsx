import { View, Text } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { RootStackParamList } from "../types/NavigationTypes";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type NavToMomentsProp = {
  scrollTo: number | null;
};

interface hookReturns {
  navigateToAddFriend: () => void;
  navigateToFinalize: () => void;
  navigateToLocationSearch: () => void;
  navigateToMomentFocus: () => void;
  navigateToMoments: ({scrollTo}: NavToMomentsProp) => void;
  
  navigateBack: () => void;

};

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

    navigateBack,
  };
};

export default useAppNavigations;
