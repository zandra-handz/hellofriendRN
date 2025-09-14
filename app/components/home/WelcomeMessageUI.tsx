import { View,  Pressable } from "react-native";
import React, { useMemo }  from "react"; 
import FriendModalIntegrator from "../friends/FriendModalIntegrator";
import Animated, {
 
  SlideInLeft, 
} from "react-native-reanimated"; 

import { MaterialCommunityIcons } from "@expo/vector-icons";
import manualGradientColors from "@/src/hooks/StaticColors";
 
interface WelcomeMessageUIProps {
  username: string;
  isNewUser: boolean; // in parent: {new Date(user?.user?.created_on).toDateString() === new Date().toDateString()
  isKeyboardVisible: boolean; // indirect condition to change message to friend picker
  onPress: () => void; // because i have turned this component into a focus moment text button
  // in order to let it fill as much space as possible while still being under the friend picker
  borderBottomRightRadius: number;
  borderBottomLeftRadius: number;
  backgroundColor: string;
 
}

const WelcomeMessageUI: React.FC<WelcomeMessageUIProps> = ({
  primaryColor,
  welcomeTextStyle,
   subWelcomeTextStyle,
   friendId,
   friendName,
   themeAheadOfLoading,
  username = "",
  isNewUser = false,
  borderBottomRightRadius = 10,
  borderBottomLeftRadius = 10,
  backgroundColor = "red",
  isKeyboardVisible = false,
  onPress = () => {},
}) => {
 

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const message = isNewUser
    ? `Hi ${username}! Welcome to hellofriend!`
    : `Welcome back ${username}!`;

 const conditionalMessage = useMemo(
  () => {
    if (isKeyboardVisible) {
      return `Write an idea:`
    } else {
      return message;
    }
  },[
    message, isKeyboardVisible
  ]
 )

  return (
    <AnimatedPressable
      onPress={onPress}
      layout={SlideInLeft}
      // entering={ZoomInEasyUp}
      // exiting={FadeOut}
      style={[
        {
          backgroundColor: backgroundColor,
          borderBottomLeftRadius: borderBottomLeftRadius,
          borderBottomRightRadius: borderBottomRightRadius,
          alignText: "center",
          flexWrap: "flex",
          width: "100%",
          padding: 10,
          paddingTop: 10, // same as friend message
          paddingBottom: 10, // same as friend message
          flexDirection: "row",
          justifyContent: "flex-start",
          backgroundColor: 'transparent',
          height: 200,
        },
      ]}
    >
      <MaterialCommunityIcons
      name={'leaf'}
      size={1200}
      color={manualGradientColors.homeDarkColor}
      style={{position: 'absolute',  top: -740, left: -470, opacity: .2, transform: [
        {'rotate': '200deg'}, 
          { scaleX: -1 },   
      ]}}
      />
      <>
        <Animated.Text
          style={[
            welcomeTextStyle,
      {
      paddingTop: 40,
      color: primaryColor,
    //  color: backgroundColor,
      fontSize: 38,
      lineHeight: 48,
      backgroundColor: 'rgba(0,0,0,0.4)', // semi-transparent background
      borderRadius: 8,
      paddingHorizontal: 8,
    },
          ]}
        >
          {conditionalMessage}{' '}
          
          <View
            style={{
              height: welcomeTextStyle.fontSize - 2,
              opacity: 0.6,
            
            }}
          >
            {!isKeyboardVisible && (
              
            <FriendModalIntegrator
              includeLabel={true}
              height={"100%"}
              friendId={friendId}
              friendName={friendName}
              primaryColor={primaryColor}
              themeAheadOfLoading={themeAheadOfLoading}
              iconSize={subWelcomeTextStyle.fontSize + 4}
              customLabel={"Pick friend"}
              customFontStyle={subWelcomeTextStyle}
              navigationDisabled={true}
              useGenericTextColor={true}
            />
            
            )}
          </View>
        </Animated.Text>
      </>
    </AnimatedPressable>
  );
};

//export default WelcomeMessageUI;

export default React.memo(WelcomeMessageUI);
