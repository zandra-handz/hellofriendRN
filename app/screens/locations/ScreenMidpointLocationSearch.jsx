import React from "react";
import { View, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import ContentFindMidpoint from "@/app/components/locations/ContentFindMidpoint";
import { useFriendList } from "@/src/context/FriendListContext";
const ScreenMidpointLocationSearch = () => {
  const route = useRoute();
  const userAddress = route?.params?.userAddress ?? null;
  const friendAddress = route?.params?.friendAddress ?? null;

  return (
    <View style={styles.container}>

        {/* address will be 'No address selected', go by existence of id instead */}
      {userAddress &&
        userAddress?.id &&
        friendAddress &&
        friendAddress?.id && (
          <ContentFindMidpoint
            userAddress={userAddress}
            friendAddress={friendAddress}
          />
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
});

export default ScreenMidpointLocationSearch;
