import { StyleSheet, Text, View, Animated, DimensionValue } from "react-native";
import React, { useCallback } from "react";
import { useUpcomingHelloes } from "@/src/context/UpcomingHelloesContext";
import { useFriendList } from "@/src/context/FriendListContext";
import SoonItemButton from "./SoonItemButton";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useNavigation } from "@react-navigation/native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import LoadingPage from "../appwide/spinner/LoadingPage";

interface HomeScrollSoonProps {
  startAtIndex: number;
  height: DimensionValue;
  maxHeight: DimensionValue;
  borderRadius: number;
  borderColor: string;
}

//single press will select friend but remain on home screen, double press will select friend and take user directly to moments screen
const HomeScrollSoon: React.FC<HomeScrollSoonProps> = ({
  startAtIndex = 1,
  height,
  maxHeight = 130,
  borderRadius = 20,
  borderColor = "transparent",
}) => {
  const { themeStyles, themeStyleSpinners } = useGlobalStyle();
  const navigation = useNavigation();
  const { upcomingHelloes, isLoading } = useUpcomingHelloes();
  const { setFriend } = useSelectedFriend();
  const { friendList, friendListLength, getThemeAheadOfLoading } =
    useFriendList();



    const itemColor = themeStyles.primaryText.color;
    const elementBackgroundColor = themeStyles.overlayBackgroundColor.backgroundColor;

  const handleDoublePress = useCallback(
    (hello) => {
      const { id, name } = hello.friend;
      const selectedFriend = id === null ? null : { id: id, name: name };

      const friend = friendList.find((friend) => friend.id === hello.friend.id);
      getThemeAheadOfLoading(friend);
      setFriend(selectedFriend);
      navigation.navigate("Moments");
    },
    [friendList, getThemeAheadOfLoading, setFriend, navigation]
  );

  const handlePress = useCallback(
    (hello) => {
      const id = hello.friend.id;
      const name = hello.friend.name;
      const selectedFriend = id === null ? null : { id: id, name: name };

      const friend = friendList.find((friend) => friend.id === id);
      getThemeAheadOfLoading(friend);
      setFriend(selectedFriend);
    },
    [friendList, getThemeAheadOfLoading, setFriend, navigation]
  );

  const renderListItem = useCallback(
    ({ item, index }) => (
      <View
        style={{
          marginBottom: 2,
          height: 50,
          width: "100%",
          flexDirection: "row",
        }}
      >
        <SoonItemButton
        textColor={itemColor}
        backgroundColor={elementBackgroundColor}
          height={"100%"}
          friendName={item.friend.name}
          date={item.future_date_in_words}
          width={"100%"}
          onPress={() => handlePress(item)}
          onDoublePress={() => handleDoublePress(item)}
        />
      </View>
    ),
    [handlePress, itemColor, elementBackgroundColor]
  );

  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `upcoming-${index}`;

  const renderUpcomingHelloes = () => {
    return (
      <>
      {upcomingHelloes && upcomingHelloes.length > 0 && (
        
      <Animated.FlatList
        data={upcomingHelloes.slice(0).slice(startAtIndex)} // skip first
        //horizontal={true}
        // getItemLayout={(data, index) => ({
        //   length: soonButtonWidth,
        //   offset: soonButtonWidth * index,
        //   index,
        // })}
        renderItem={renderListItem}
        keyExtractor={extractItemKey}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => <View style={{ height: 500 }} />}
        //  snapToAlignment="start" // Align items to the top of the list when snapped
        // decelerationRate="fast"
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
          borderRadius: borderRadius,
          borderColor: borderColor,
          height: height,
          maxHeight: maxHeight,
        },
      ]}
    >
      {isLoading && !upcomingHelloes && (
        <View style={styles.loadingWrapper}>
          <LoadingPage
            loading={isLoading}
            includeLabel={false}
            label=""
            spinnerSize={70}
            color="#000002"
            spinnerType={themeStyleSpinners?.homeScreen}
          />
        </View>
      )}
      {!isLoading && (
        <> 

          {friendListLength === 0 && (
            <View style={styles.noFriendsTextContainer}>
              <Text
                style={[
                  {
                    color: themeStyles.genericTextBackground.backgroundColor,
                    fontSize: 18,
                  },
                ]}
              >
                Suggested meet up dates will go here.
              </Text>
            </View>
          )}

          {friendListLength > 0 && (
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
