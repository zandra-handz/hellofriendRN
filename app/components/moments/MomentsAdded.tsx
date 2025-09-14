import { View, Text, Pressable } from "react-native";
import React, { useState } from "react"; 
import { useNavigation } from "@react-navigation/native";
import { AppFontStyles } from "@/src/hooks/StaticFonts";
import Animated, {
  SlideInDown,
  FadeIn,
  SharedValue,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";

interface MomentsAddedProps {
  visibilityValue: SharedValue<number>;
}

const MomentsAdded: React.FC<MomentsAddedProps> = ({
 
  overlayBackgroundColor,
  darkerOverlayColor,
  primaryColor,
  capsuleList,
  preAdded,
  visibilityValue,
}) => { 

  const [hide, setHide] = useState(false);
  const navigation = useNavigation();

  // const preAddedCount = preAdded.length;
  // const capsuleCount = capsuleList.length + preAddedCount;

  useAnimatedReaction(
    () => visibilityValue.value,
    (newVal, oldVal) => {
      if (newVal !== oldVal) {
        runOnJS(setHide)(!!newVal);
      }
    }
  );

  return (
    <>
      <View
        style={[
          {
            height: 300,
            width: "100%",
            alignItems: "center",
            flexDirection: "column",
            position: "absolute",
            justifyContent: "center",
            top: 100,
            bottom: 200,
            right: 0,
            left: 0,
            zIndex: hide ? 0 : 2000,
            paddingHorizontal: 20,
          },
        ]}
      >
        {!hide && (
          <Animated.View
            entering={FadeIn}
            style={[
              {
                backgroundColor: overlayBackgroundColor,
                flexDirection: "column",
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
                alignContent: "center",
                height: "auto",
                width: "100%",
                borderRadius: 999,
                padding: 10,
              },
            ]}
          >
            <Text
              style={[ 
                AppFontStyles.subWelcomeText,
                { color: primaryColor, fontSize: 14 },
              ]}
            >
              Total ideas: {capsuleList?.length + preAdded?.length}
            </Text>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={[ 
                    AppFontStyles.subWelcomeText,
                  { color: primaryColor, fontSize: 14 },
                ]}
              >
                Added to hello: {preAdded?.length}
              </Text>

              {preAdded?.length > 0 && (
                <Pressable
                  style={[{ height: "100%", alignItems: "center" }]}
                  onPress={() => navigation.navigate("PreAdded")}
                >
                  <Text
                    style={[ 
                        AppFontStyles.subWelcomeText,
                      {
                        color: primaryColor,
                        marginLeft: 10,
                        fontSize: 14,
                        paddingHorizontal: 14,
                        borderRadius: 999,
                        // fontFamily: "Poppins-Bold",
                        backgroundColor: darkerOverlayColor,
                      },
                    ]}
                  >
                    Restore
                  </Text>
                </Pressable>
              )}
            </View>
          </Animated.View>
        )}
      </View>
    </>
  );
};

export default MomentsAdded;
