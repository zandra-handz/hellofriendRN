import { StyleSheet, Text, View, Dimensions, Animated } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import FriendItemButton from "../friends/FriendItemButton";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

import { useNavigation } from "@react-navigation/native";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

const HomeFriendItems = ({
  height,
  maxHeight = 130,
  borderRadius = 20,
  borderColor = "transparent",
}) => {
  const navigation = useNavigation();
  const { manualGradientColors } = useGlobalStyle();
  const { darkColor, lightColor } = manualGradientColors;
  const { selectedFriend } = useSelectedFriend();

  const soonListRightSpacer = Dimensions.get("screen").width - 136;

  const friendItemButtonWidth = Dimensions.get("screen").width / 2.6;

  const buttonRightSpacer = 6;

  const calendarButtonHeight = height / 0.6;

  const handleNavigationPress = (name) => {
    navigation.navigate({ name });
  };

  const friendOptions = [
    {
      name: "Helloes",
      message: selectedFriend?.name ? `Past helloes` : "View past helloes!", // Fallback message if selectedFriend.name does not exist
    },
    {
      name: "Locations",
      message: "Saved locations",
    },

    {
      name: "Helloes",
      message: "More options coming soon!",
    },
  ];

  const renderFriendItems = () => {
    return (
      <Animated.FlatList
        data={friendOptions}
        horizontal={true}
        keyExtractor={(item, index) => `satellite-${index}`}
        getItemLayout={(data, index) => ({
          length: friendItemButtonWidth,
          offset: friendItemButtonWidth * index,
          index,
        })}
        renderItem={({ item }) => (
          <View
            style={{ marginRight: buttonRightSpacer, height: "100%", flex: 1 }}
          >
            <FriendItemButton
              height={"100%"}
              buttonTitle={item.message}
              width={friendItemButtonWidth}
              onPress={() => handleNavigationPress(item.name)}
            />
          </View>
        )}
        showsHorizontalScrollIndicator={false}
        scrollIndicatorInsets={{ right: 1 }}
        initialScrollIndex={0}
        ListFooterComponent={() => (
          <View style={{ width: soonListRightSpacer }} />
        )}
        snapToInterval={friendItemButtonWidth + buttonRightSpacer} // Set the snapping interval to the height of each item
        snapToAlignment="start"
        decelerationRate="fast"
      />
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: borderRadius,
          borderColor: borderColor,
          height: height,
          maxHeight: maxHeight,
        },
      ]}
    >
      <LinearGradient
        colors={['transparent', 'transparent']}
        //colors={[darkColor, lightColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          ...StyleSheet.absoluteFillObject,
        }}
      />

      <>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>HELLO HELPERS</Text>
        </View>

        <View
          style={[styles.buttonContainer, { height: calendarButtonHeight }]}
        >
          <>{renderFriendItems()}</>
        </View>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    flex: 1,
    height: "100%",
    overflow: "hidden",  
    borderWidth: 0,
    borderColor: "black", 
  },
  text: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  noFriendsTextContainer: {
    flex: 1,
    flexDirection: "row",
    zIndex: 1,

    paddingLeft: "2%",
    // paddingRight: '16%',
    width: "100%",
  },
  loadingWrapper: {
    flex: 1,
    width: "100%",
  },
  headerContainer: {
    width: "100%",
    paddingVertical: "0%",
  },
  headerText: {
    fontFamily: "Poppins-Bold",
    paddingLeft: "3%",

    fontSize: 18,
  },
  satelliteSection: {
    width: "33.33%",
    borderRadius: 0,
    marginLeft: -20,
    paddingLeft: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightblue",
  },
  satelliteButton: {
    alignItems: "center",
    alignContents: "center",
    justifyContent: "space-around",
  },
  buttonContainer: {
    flexDirection: "row",
    flex: 1,
    borderRadius: 30,
    paddingHorizontal: "3%",
  },
  button: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginLeft: ".6%",
    borderRightWidth: 0.8,
    paddingTop: 0,
    backgroundColor: "transparent",
    backgroundColor: "rgba(41, 41, 41, 0.1)",
  },
  satelliteText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    fontWeight: "bold",
    color: "white",
  },
});

export default HomeFriendItems;
