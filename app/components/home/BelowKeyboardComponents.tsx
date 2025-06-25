import React from "react";
import { View } from 'react-native'; 
import HomeButtonUpNext from "./HomeButtonUpNext";
import HomeScrollCalendarLights from './HomeScrollCalendarLights';
 
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
      // entering={SlideInLeft}
      // exiting={SlideOutRight}
      entering={FadeInUp}
      exiting={FadeOutDown}
              style={[
          {
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            paddingTop: 40, 
          },
        ]}
    >
     

      <Animated.View
        style={[
          {
            // alignItems: "center",
            // flexDirection: "column",
            // justifyContent: "space-between",
            // flex: 1,
            // paddingTop: 10,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {/* <View style={{position: 'absolute', zIndex: 40000, elevation: 40000, left: 0, top: -16}}>
         {friendListLength > 0 && <AddOptionsList />}
         
          
        </View> */}
        {!isFriendSelected && friendListLength > 0 && (
          <HomeButtonUpNext
            onPress={onPress}
            borderRadius={10}
            height={'100%'}
            borderColor="black"
          />
        )}
        {isFriendSelected && (
          <>
            <SelectedFriendHome
              onPress={onPress}
              borderRadius={10}
              borderColor="black"
              height={"100%"}
            />
            <HomeFriendItems borderRadius={10} height={100} />
                    {isFriendSelected && (
                  <HomeScrollCalendarLights
                    height={"5%"}
                    borderRadius={40}
                    borderColor="black"
                  />
                )}
          </>
        )}
        {/* {isFriendSelected && (
          <HomeScrollSoon
            height={"100%"}
            maxHeight={600}
            borderRadius={10}
            borderColor="black"
          />
        )} */}
        <View>
            

                
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default BelowKeyboardComponents;
