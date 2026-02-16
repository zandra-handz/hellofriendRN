import React, { useRef } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import SvgIcon from "@/app/styles/SvgIcons";

type Props = {
  color: string;
  backgroundColor: string;
  borderColor: string;
  moment: object | null;
  hasContent: boolean;
  showButton: boolean;
  noContentText: string;
  onPressEdit: (moment: object) => void;
  onPressNew: () => void;
};

const GlassPreviewBottom = ({
  color = "red",
  backgroundColor = "orange",
  borderColor = "pink",
  moment,
  hasContent = false,
  showButton = false,
  noContentText = "No content",
  onPressEdit,
  onPressNew,
}: Props) => {
  const translateY = useSharedValue(300); // Start off-screen
  const hasAnimated = useRef(false); // Track if we've animated
    useFocusEffect(
    React.useCallback(() => {
      // Only animate if we haven't animated yet
      if (!hasAnimated.current) {
        translateY.value = withSpring(100, {
          damping: 40,
          stiffness: 500,
        });
        hasAnimated.current = true;
      }

      // Reset when screen loses focus (navigating away)
      return () => {
        translateY.value = 300;
        hasAnimated.current = false;
      };
    }, [])
  );


  const containerAnimationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View style={[containerAnimationStyle, styles.previewOuter]}>
      <View
        style={[
          styles.previewWrapper,
          {
            backgroundColor,
            borderColor,
          },
        ]}
      >
        {moment?.id && (
          <Pressable
            onPress={() => onPressEdit(moment)}
            style={styles.momentViewButton}
          >
            <SvgIcon name={`chevron_double_right`} size={28} color={color} />
          </Pressable>
        )}

        {moment && (
            <View style={styles.scrollViewContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.previewHeader, { color }]}>
              {moment.category}
            </Text>

            <Text style={[styles.previewText, { color }]}>
              {moment.capsule}
            </Text>
          </ScrollView>
          </View>
        )}

        {!moment && (
              <View style={styles.scrollViewContainer}>
          <Pressable onPress={onPressNew} style={styles.noMomentWrapper}>
            <Text style={[styles.noMomentText, { color }]}>
              {noContentText}{" "}
              <Text style={[styles.buttonText, { color }]}>Add one?</Text>
            </Text>
          </Pressable>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  previewOuter: {
    width: "100%",
    paddingHorizontal: 0,
  //  bottom: -70,
    height: 240,
    paddingBottom: 200,
   // backgroundColor: 'orange'
  },
  previewWrapper: {
    width: "100%",
    height: 220,
   // borderWidth: 2,
    borderRadius: 70,
    padding: 30,
    paddingTop: 20,
    
    paddingBottom: 0, 
  },

  noMomentWrapper: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  noMomentText: {
    fontSize: 17,
  },
  previewText: {
    fontSize: 14,
    lineHeight: 22,
    alignSelf: 'center'
  },
  previewHeader: {
    fontSize: 15,
    fontWeight: "bold",
    lineHeight: 32,
        alignSelf: 'center'

  },
  scrollViewContainer: {
    height: 110,
    width: '100%',
    
   // backgroundColor: 'pink',

  },
  momentViewButton: {
    padding: 20,
    width: "100%",
    height: 50,
    top: 0,
    right: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    zIndex: 9000,
    position: "absolute",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default GlassPreviewBottom;
