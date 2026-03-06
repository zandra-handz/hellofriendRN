import React from "react";
import { StyleSheet, View } from "react-native";
import ButtonFriend from "./ButtonFriend";
import ButtonFriendSelected from "./ButtonFriendSelected";

type Friend = {
  id: number;
  name: string;
  theme_color_light?: string;
  theme_color_dark?: string;
  fontColor?: string;
};

type Props = {
  friend: Friend;
  selectedFriendId: number | null;
  primaryColor: string;
  buttonColor: string;
  height?: number;
  // unselected
  onPress: () => void;
  onLongPress?: () => void;
  // selected
  onLongPressSelected?: () => void;
};

const FriendButtonWrapper = ({
  friend,
  selectedFriendId,
  primaryColor,
  buttonColor,
  height = 50,
  onPress,
  onLongPress,
  onLongPressSelected,
}: Props) => {
  const isSelected = friend.id === selectedFriendId;

  return (
    <View style={styles.container}>
      {isSelected ? (
        <ButtonFriendSelected
          friend={friend}
          primaryColor={primaryColor}
          buttonColor={buttonColor}
          borderColor={friend.fontColor ?? friend.theme_color_light ?? primaryColor}
          height={height}
          onLongPress={onLongPressSelected}
        />
      ) : (
        <ButtonFriend
          friend={friend}
          primaryColor={primaryColor}
          buttonColor={buttonColor}
          height={height}
          onPress={onPress}
          onLongPress={onLongPress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50000,
    height: 50,
  },
});

export default FriendButtonWrapper;