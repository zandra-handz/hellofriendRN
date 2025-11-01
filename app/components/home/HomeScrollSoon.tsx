import { StyleSheet, Text, View, DimensionValue } from "react-native";
import React, { useCallback } from "react";
import Animated, {
  // SlideInDown,
  // SlideOutDown,
  // FadeIn,
  // FadeOut,
} from "react-native-reanimated";
import manualGradientColors from "@/app/styles/StaticColors";
import SoonItemButton from "./SoonItemButton";
import { useNavigation } from "@react-navigation/native";
 

interface HomeScrollSoonProps {
  startAtIndex: number;
  height: DimensionValue;
  maxHeight: DimensionValue;
  borderRadius: number;
  borderColor: string;
}

//single press will select friend but remain on home screen, double press will select friend and take user directly to moments screen
const HomeScrollSoon: React.FC<HomeScrollSoonProps> = ({
  upcomingHelloes,
  isLoading, 
  friendList,
  primaryColor = "orange",
  overlayColor,
  darkerOverlayColor,
  lighterOverlayColor, 
  handleSelectFriend,
  startAtIndex = 1,
  height,
  maxHeight = 130,
  borderRadius = 20,
  borderColor = "transparent",
}) => {
  const navigation = useNavigation();
 

  const itemColor = primaryColor;
  const elementBackgroundColor = overlayColor;

  const handleDoublePress = useCallback(
    (hello) => {
      const { id } = hello.friend;
      handleSelectFriend(id);
      navigation.navigate("Moments");
    },
    [
      // friendList, 
      handleSelectFriend, 
      navigation
    ]
  );

  const handlePress = useCallback(
    (hello) => {
      // if (!friendList || friendList.length < 1) {
      //   return;
      // }
      const id = hello.friend.id;
      // const name = hello.friend.name;
      // const selectedFriend = id === null ? null : { id: id, name: name };

      // const friend = friendList.find((friend) => friend.id === id);
      handleSelectFriend(id);
    },
    [
      // friendList,
      //  getThemeAheadOfLoading, 
       handleSelectFriend, 
      //  navigation
      ]

  );

  const renderListItem = useCallback(
    ({ item, index }) => (
      // <Animated.View
      // entering={FadeIn}
      // exiting={FadeOut}
      <View
        style={{
          marginBottom: 2,
          height: 50,
          width: "100%",
          flexDirection: "row",
        }}
      >
        <SoonItemButton
          textColor={primaryColor}
          backgroundColor={elementBackgroundColor}
          darkerOverlayColor={darkerOverlayColor}
          lighterOverlayColor={lighterOverlayColor}
          friendList={friendList}
          overlayColor={overlayColor}
          manualGradientColors={manualGradientColors}
          height={"100%"}
          friendName={item.friend.name}
          friendId={item.friend.id}
          date={item.future_date_in_words}
          width={"100%"}
          onPress={() => handlePress(item)}
          onDoublePress={() => handleDoublePress(item)}
        />
        {/* </Animated.View> */}
      </View>
    ),
    [
      handlePress,
      primaryColor,
      lighterOverlayColor,
      darkerOverlayColor,
      itemColor,
      elementBackgroundColor,
    ]
  );

  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `upcoming-${index}`;

  const renderUpcomingHelloes = () => {
    return (
      <>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            width: "100%",
            marginBottom: 10,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 20, lineHeight: 24 }}>
            Soon
          </Text>
        </View>
        {upcomingHelloes?.length > 0 && (
          <Animated.FlatList
            data={upcomingHelloes.slice(0).slice(startAtIndex, 7)}
            renderItem={renderListItem}
            keyExtractor={extractItemKey}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
            removeClippedSubviews={true}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() => <View style={{ height: 500 }} />}
          />
        )}
      </>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          // backgroundColor: 'red',
          borderRadius: borderRadius,
          borderColor: borderColor,
          height: height,
          maxHeight: maxHeight,
        },
      ]}
    >
      {!isLoading && (
        <>
          {friendList?.length === 0 && (
            <View style={styles.noFriendsTextContainer}>
              <Text
                style={[
                  {
                    color: primaryColor,
                    fontSize: 18,
                  },
                ]}
              >
                Suggested meet up dates will go here.
              </Text>
            </View>
          )}

          {friendList.length > 0 && (
            <View style={[styles.buttonContainer]}>
              <>{renderUpcomingHelloes()}</>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    flex: 1,
    flexGrow: 1,
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
  buttonContainer: {
    flex: 1,
    flexDirection: "column",
    height: 200,
    width: "100%",
    // backgroundColor: 'pink',
    alignItems: "center",
  },
});

export default HomeScrollSoon;
