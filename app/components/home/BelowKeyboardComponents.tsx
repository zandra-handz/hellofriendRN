import React from "react";
import { View } from 'react-native';
import AddOptionsList from "./AddOptionsList";
import HomeButtonUpNext from "./HomeButtonUpNext";
import HomeScrollCalendarLights from './HomeScrollCalendarLights';
import HomeScrollSoon from "./HomeScrollSoon";
import HomeFriendItems from "./HomeFriendItems";
import HomeButtonSelectedFriend from "./HomeButtonSelectedFriend";
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
            paddingTop: 10, 
          },
        ]}
    >
      {friendListLength > 0 && <AddOptionsList />}

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
        {!isFriendSelected && friendListLength > 0 && (
          <HomeButtonUpNext
            onPress={onPress}
            borderRadius={10}
            height={500}
            borderColor="black"
          />
        )}
        {isFriendSelected && (
          <>
            <HomeButtonSelectedFriend
              onPress={onPress}
              borderRadius={10}
              borderColor="black"
              height={"100%"}
            />
            <HomeFriendItems borderRadius={10} height={100} />
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
            
        {isFriendSelected && (
                  <HomeScrollCalendarLights
                    height={"5%"}
                    borderRadius={40}
                    borderColor="black"
                  />
                )}
                
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default BelowKeyboardComponents;
