import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import Animated, {
  runOnJS,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  SlideInLeft,
  FadeIn,
  FadeInLeft,
  SlideInUp,
  FadeOut,
  withDelay,
  
} from "react-native-reanimated";
import PlainSafeView from "../appwide/format/PlainSafeView";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
 
const QuickView = ({
  message,
  view,
  isInsideModal = false,
  topBarText = `Help mode`,
  update = false,
  duration = 2000,
  onClose,
}: {
  message: string;
  view?: React.ReactElement;
  isInsideModal?: boolean;
  update?: boolean;
  duration?: number;
  onClose: () => void;
  topBarText: string;
}) => {
  const scale = useSharedValue(0);
  const translateX = useSharedValue(-600);
 
  const fade = useSharedValue(1);
  const { themeStyles, appFontStyles, manualGradientColors } = useGlobalStyle();
  
  useEffect(() => {
    fade.value = 1;
    scale.value = withTiming(1, { duration: 200 }); 
    translateX.value = withDelay(100, withTiming(1, { duration: 100 }))
  }, [update]);

  const handleManualClose = () => {
       translateX.value = withTiming(-600, { duration: 40 })
    scale.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(onClose)(); 
      }
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ scale: scale.value }],
  }));

  const topBarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value}]


  }));

  // useEffect(() => {
  //   console.log("change in update in quickmessage:", update);
  // }, [update]);

    const insets = useSafeAreaInsets();

  return (
    <PlainSafeView
      turnSafeOff={isInsideModal}
      style={[StyleSheet.absoluteFillObject, styles.overlay]}
    > 
        
      <Animated.View
        // entering={SlideInLeft.duration(100).delay(100)}
        // exiting={FadeOut.duration(20)}
        style={[topBarStyle, {
          flexDirection: "row",
          position: "absolute",
          backgroundColor: "hotpink",
          borderBottomWidth: 2,
          borderTopWidth: 2,
          borderColor: "hotpink",
          top: isInsideModal ? 0 : insets.top,
          left: 0,
          width: "100%",
          height: "auto",
        }]}
      >
          
        <View
          style={{
            flex: 1,
            paddingHorizontal: 6,
            paddingVertical: 2,
            backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
          }}
        > 

            
          <Text
            style={[
              themeStyles.primaryText,
              { 
                fontFamily: "Poppins-Bold",
                fontSize: 14,
                padding: 4,
                paddingHorizontal: 10,
                borderRadius: 999,
              },
            ]}
          >
            {topBarText}
          </Text>
        </View>
      </Animated.View>
    
      <Animated.View
        style={[
          styles.messageContainer,
          animatedStyle,
          themeStyles.primaryBackground,
          { borderRadius: 20, marginTop: 0 },
        ]}
      >
 
        {!update && (
        //   <ScrollView
        //     contentContainerStyle={{ flexDirection: "row", alignItems: "center",   padding: 10 }}
        //   >
            <View style={{  flex: 1,  padding: 10 }}
     >
                
              {view != undefined && view}
            {/* <Text
              style={[
                themeStyles.primaryText,
                appFontStyles.subWelcomeText,
                { lineHeight: 24 },
              ]}
            >
              {" "}
              {message}
            </Text> */}
            
      
       
          </View>
        )}
        {update && (
          <Text style={[themeStyles.primaryText, appFontStyles.subWelcomeText]}>
            update
          </Text>
        )}
        <Pressable
          onPress={handleManualClose}
          hitSlop={30}
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",

            flexDirection: "row",
            borderRadius: 999,
            // position: "absolute",
            // top: 10,
            // right: 10,
            //  backgroundColor: "blue",
          }}
        >
          <Text
            style={[
              themeStyles.primaryText,
              { fontFamily: "Poppins-Bold", fontSize: 13, marginRight: 5 },
            ]}
          >
            Got it!
          </Text>
          <MaterialCommunityIcons
            name={"check-circle"}
            size={24}
           // color={themeStyles.primaryText.color}
            color={manualGradientColors.lightColor}
          />
        </Pressable>
      </Animated.View>
    </PlainSafeView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flexDirection: "column",

    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: 99999,
    elevation: 99999,
   // backgroundColor: "rgba(0, 0, 0, 0.84)",
    backgroundColor: "rgba(128, 128, 128, 0.8)", //neutral gray
  },
  messageContainer: {
    padding: 20, 
    width: "98%",
    textAlign: "center",
    flexDirection: "column",
    justifyContent: "center",
    top: 80,
  height: 600,
  },
});

// export default QuickView;
export default React.memo(QuickView, (prevProps, nextProps) => {
  return (
    prevProps.message === nextProps.message &&
    prevProps.view === nextProps.view &&
    prevProps.isInsideModal === nextProps.isInsideModal &&
    prevProps.update === nextProps.update &&
    prevProps.duration === nextProps.duration &&
    prevProps.topBarText === nextProps.topBarText &&
    prevProps.onClose === nextProps.onClose
  );
});
