import {
  View,
  Text,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";

import React from 'react'
import SafeViewHome from "@/app/components/appwide/format/SafeViewHome";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import useUser from "@/src/hooks/useUser"; 
import SelectedFriendHome from "@/app/components/home/SelectedFriendHome";
import SelectedFriendFooter from "@/app/components/headers/SelectedFriendFooter";

type Props = {}

// pass friend colors to home screen if want some sort of fade-back-to-home-screen-colors
const ScreenFriendHome = (props: Props) => {

    
  return (
    <View>
      <Text>ScreenFriendHome</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {flex: 1, width: '100%'},
  innerContainer: {flexDirection: 'column'},
  rowContainer: {flexDirection: 'row'},
  labelWrapper: {},
  label: {},
});


export default ScreenFriendHome