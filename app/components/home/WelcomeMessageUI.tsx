import { View, Text, Pressable, TouchableOpacity } from "react-native";
import React  from "react"; 
import FriendModalIntegrator from "../friends/FriendModalIntegrator";
import Animated, {
 
  SlideInLeft, 
} from "react-native-reanimated";

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
    : `Hi ${username}! What would you like to do?`;

 

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
        },
      ]}
    >
      <>
        <Animated.Text
          style={[
            welcomeTextStyle,
            {
              color: primaryColor,
              fontSize: 46,
              lineHeight: 48,
            },
          ]}
        >
          {message}{' '}
          
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
