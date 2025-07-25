import React, { useEffect } from "react";
import { View, ScrollView } from "react-native";
import HomeButtonUpNext from "./HomeButtonUpNext"; 
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
          width: '100%',   
        },
      ]}
    > 


        {!isFriendSelected && friendListLength > 0 && (
          <HomeButtonUpNext
            onPress={onPress}
            borderRadius={10}
            height={"100%"}
            borderColor="black"
          />
        )}
        {isFriendSelected && (
          <View style={{height: '100%'  }}>  
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
