import { StyleSheet, Text, View, Dimensions, Animated } from "react-native";

import { useUpcomingHelloes } from "@/src/context/UpcomingHelloesContext";
import { LinearGradient } from "expo-linear-gradient";
import { useFriendList } from "@/src/context/FriendListContext";
import SoonButton from "../home/SoonButton";
  
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

import { useNavigation } from "@react-navigation/native";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import LoadingPage from "../appwide/spinner/LoadingPage";
 

const HomeScrollSoon = ({
  height,
  maxHeight = 130,
  borderRadius = 20,
  borderColor = "transparent",
}) => { 
  const { themeStyles, themeStyleSpinners, manualGradientColors } =
    useGlobalStyle();
    const navigation = useNavigation();
  const { darkColor, lightColor } = manualGradientColors;
  const { upcomingHelloes, isLoading } = useUpcomingHelloes();
  const { selectedFriend, setFriend } = useSelectedFriend();
  const { friendList, friendListLength, getThemeAheadOfLoading } =
    useFriendList();
  
 
  const handlePress = (hello) => { 
    const { id, name } = hello.friend;
    const selectedFriend = id === null ? null : { id: id, name: name };
    setFriend(selectedFriend);
    const friend = friendList.find((friend) => friend.id === hello.friend.id);
    getThemeAheadOfLoading(friend);
    navigation.navigate('Moments');
  };
 

  const renderUpcomingHelloes = () => {
    return (
      <Animated.FlatList
        data={upcomingHelloes.slice(0)}
        //horizontal={true}
        keyExtractor={(item, index) => `satellite-${index}`}
        // getItemLayout={(data, index) => ({
        //   length: soonButtonWidth,
        //   offset: soonButtonWidth * index,
        //   index,
        // })}
        renderItem={({ item }) => (
          <View
            style={{ marginBottom: 2, height: 50, width: '100%' , flexDirection: 'row'  }}
          >
            <SoonButton
              height={"100%"}
              friendName={item.friend_name}
              dateAsString={item.future_date_in_words}
           width={'100%'}
              onPress={() => handlePress(item)}
            />
          </View>
        )}   
        ListFooterComponent={() => (
          <View style={{ height: 100 }} />
        )} 
        //  snapToAlignment="start" // Align items to the top of the list when snapped
        // decelerationRate="fast"
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
       // colors={[darkColor, 'pink']}
        colors={['transparent', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          ...StyleSheet.absoluteFillObject,
        }}
      />

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
          <View style={styles.headerContainer}>
             <Text style={styles.headerText}>SOON</Text>
 
          </View>

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
            <View
              style={[styles.buttonContainer ]}
            > 
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
    height: '100%',
    overflow: "hidden",
    marginVertical: "1%",
    borderWidth: 0,
    borderColor: "black", 
    paddingVertical: "4%",
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
    flex: 1, 
   flexDirection: 'column',
    height: 200,
    width: '100%',
   // backgroundColor: 'pink',
    alignItems: 'center',
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

export default HomeScrollSoon;
