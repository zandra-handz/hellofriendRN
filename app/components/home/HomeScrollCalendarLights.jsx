 import {
  StyleSheet,
  Text,
  View,
  Dimensions, 
} from "react-native";

import { useUpcomingHelloes } from "@/src/context/UpcomingHelloesContext";
import { LinearGradient } from "expo-linear-gradient";
import { useFriendList } from "@/src/context/FriendListContext";
 
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
import { useHelloes } from "@/src/context/HelloesContext"; 

import { useNavigation } from "@react-navigation/native";

import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

import CalendarLightsDataPrepLayer from "../foranimations/CalendarLightsDataPrepLayer";
 
import LoadingPage from "../appwide/spinner/LoadingPage";

const HomeScrollCalendarLights= ({
  height,
  borderRadius = 20,
  borderColor = "transparent", 
}) => { 

  const navigation = useNavigation();
  const { themeStyles, themeStyleSpinners  } = useGlobalStyle(); 
  const { upcomingHelloes, isLoading } = useUpcomingHelloes();
  const { selectedFriend, setFriend, friendDashboardData  } = useSelectedFriend();
  const { friendList, friendListLength, themeAheadOfLoading, getThemeAheadOfLoading } = useFriendList();
    const { helloesList  } =
      useHelloes(); //useHelloesData();


  const soonButtonWidth = 140;
  // const friendItemButtonWidth = 160;

  const soonListRightSpacer = Dimensions.get("screen").width - 136;

  const friendItemButtonWidth = Dimensions.get("screen").width / 2.6;

  const buttonRightSpacer = 6;

  const calendarButtonHeight = height / 0.6;

  const handlePress = (hello) => {
    console.log("next hello date: ", hello.future_date_in_words);
    const { id, name } = hello.friend;
    const selectedFriend = id === null ? null : { id: id, name: name };
    setFriend(selectedFriend);
    const friend = friendList.find((friend) => friend.id === hello.friend.id);
    getThemeAheadOfLoading(friend);
  };

  const handleNavigationPress = (name) => {
    navigation.navigate({ name });
  };



  const friendOptions = [
    {
      name: "Helloes",
      message: selectedFriend?.name
        ? `Past helloes with ${selectedFriend.name}`
        : "View past helloes!", // Fallback message if selectedFriend.name does not exist
    },
    {
      name: "Locations",
      message: "Pick a meet-up spot!",
    },

    {
      name: "Helloes",
      message: "More options coming soon!",
    },
  ];



  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: borderRadius,
          borderColor: borderColor,
          height: height,
          maxHeight: 140,
        },
      ]}
    >
      <LinearGradient
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

 
          </View>
          
          {friendListLength === 0 && (
              <View style={styles.noFriendsTextContainer}>

                <Text
                  style={[{color: themeStyles.genericTextBackground.backgroundColor, fontSize: 18} ]}
                  >Suggested meet up dates will go here.</Text>

                  </View>
            )}

          {friendListLength > 0 && (
            
          <View
            style={[
              styles.buttonContainer,
              { height: calendarButtonHeight  },
            ]}
          > 
            {selectedFriend && friendListLength > 0 && helloesList && friendDashboardData && <>
                <CalendarLightsDataPrepLayer 
                 daySquareBorderRadius={20}
                 daySquareBorderColor={themeStyles.genericText.color}
                 opacityMinusAnimation={.2}
                 animationColor={themeAheadOfLoading.lightColor}
          /></>}

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
    flexGrow: 1,
    height: '100%',
    overflow: "hidden",
    marginVertical: "1%",
    borderWidth: 0,
    borderColor: "black",
    paddingHorizontal: "4%", 
    paddingVertical: "3%",
    
  },
  text: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  noFriendsTextContainer: { 
    
    flex: 1,
    flexDirection: 'row',
    zIndex: 1, 
    
    
     paddingLeft: '2%', 
   // paddingRight: '16%', 
    width: '100%', 

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
    paddingHorizontal: '3%',
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

export default HomeScrollCalendarLights;
