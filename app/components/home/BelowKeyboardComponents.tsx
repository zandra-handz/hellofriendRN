import React, { useEffect } from "react";
import { View, ScrollView } from "react-native";
import HomeButtonUpNext from "./HomeButtonUpNext";
import HomeScrollCalendarLights from "./HomeScrollCalendarLights";
import { fetchCompletedMomentsAPI } from "@/src/calls/api";
import HomeFriendItems from "./HomeFriendItems";
import SelectedFriendHome from "./SelectedFriendHome";
import Animated, {
  SharedValue,
  SlideInLeft,
  SlideOutRight,
  FadeInUp,
  FadeOutDown,
} from "react-native-reanimated";

interface BelowKeyboardComponentsProps {
  slideAnim: SharedValue<number>;
  friendListLength: number;
  isFriendSelected: boolean;
  onPress: () => void;
}

const BelowKeyboardComponents: React.FC<BelowKeyboardComponentsProps> = ({
  slideAnim,
  friendListLength,
  isFriendSelected,
  onPress,
}) => {

 
  return (
    <Animated.View 
      entering={FadeInUp}
      exiting={FadeOutDown}
      style={[
        {
          alignItems: "center",
          //flexDirection: "column",
          //justifyContent: "space-between",
          flex: 1,
          paddingTop: 30,
          width: '100%',   
        },
      ]}
    >
      {/* <Animated.View
        style={[
        
          { 
              width:'100%', //added
              flex: 1, // added
            transform: [{ translateX: slideAnim }],
          },
        ]}
      > */}
    
       
        {/* <View style={{position: 'absolute', zIndex: 40000, elevation: 40000, left: 0, top: -16}}>
         {friendListLength > 0 && <AddOptionsList />}
         
          
        </View> */}


        {!isFriendSelected && friendListLength > 0 && (
          <HomeButtonUpNext
            onPress={onPress}
            borderRadius={10}
            height={"100%"}
            borderColor="black"
          />
        )}
        {isFriendSelected && (
          <View style={{height: '100%' }}>  
            <SelectedFriendHome
              onPress={onPress}
              borderRadius={10}
              borderColor="black"
              height={"100%"}
            />
              
            {/* <HomeFriendItems borderRadius={10} height={100} /> */}
          </View>
        )}  
         
      {/* </Animated.View> */}
    </Animated.View>
  );
};

export default BelowKeyboardComponents;
