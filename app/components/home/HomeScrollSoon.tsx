import { StyleSheet, Text, View, DimensionValue, FlatList } from "react-native";
import React, { useCallback } from "react";
import Animated from // FadeOut, // FadeIn, // SlideOutDown, // SlideInDown,
"react-native-reanimated";
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
  itemListLength,
  friendList,
  primaryColor = "orange",
  overlayColor,
  darkerOverlayColor,
  lighterOverlayColor,
  handleSelectFriend,
  onPress,
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
      navigation,
    ],
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
      // handleSelectFriend(id);
      onPress(id);
    },
    [
      // friendList,
      //  getThemeAheadOfLoading,
      handleSelectFriend,
      //  navigation
    ],
  );

  const renderListItem = useCallback(
    ({ item, index }) => (
      <View style={styles.listItemContainer}>
        <SoonItemButton
          textColor={primaryColor}
          backgroundColor={elementBackgroundColor}
          darkerOverlayColor={darkerOverlayColor}
          lighterOverlayColor={lighterOverlayColor}
          friendList={friendList}
          overlayColor={overlayColor}
          height={"100%"}
          friendName={item.friend.name}
          friendId={item.friend.id}
          friendCapsuleCount={item.capsule_count}
          date={item.date}
          width={"100%"}
          onPress={() => handlePress(item)}
          onDoublePress={() => handleDoublePress(item)}
        />
      </View>
    ),
    [
      handlePress,
      primaryColor,
      lighterOverlayColor,
      darkerOverlayColor,
      itemColor,
      elementBackgroundColor,
    ],
  );

  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `upcoming-${index}`;

  const renderUpcomingHelloes = () => {
    return (
      <>
        <View style={styles.headerWrapper}>
          <Text
            style={[styles.headerText, { 
              color: primaryColor,
            }]}
          >
            Soon
          </Text>
        </View>
        {upcomingHelloes?.length > 0 && (
          <FlatList
            data={upcomingHelloes.slice(0).slice(startAtIndex, 5)}
            renderItem={renderListItem}
            keyExtractor={extractItemKey}
            initialNumToRender={6}
            maxToRenderPerBatch={6}
            windowSize={6}
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
  noFriendsTextContainer: {
    flex: 1,
    flexDirection: "row",
    zIndex: 1,

    paddingLeft: "2%",
    // paddingRight: '16%',
    width: "100%",
  }, 
  buttonContainer: {
    flex: 1,
    flexDirection: "column",
    height: 200,
    width: "100%",
    // backgroundColor: 'pink',
    alignItems: "center",
  },
  listItemContainer: {
    marginBottom: 2,
    height: 50,
    width: "100%",
    flexDirection: "row",
  },
  headerWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 10,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
    lineHeight: 24,
  },
});

export default HomeScrollSoon;
