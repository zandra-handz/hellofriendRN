import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import BackArrowLongerStemSvg from "@/app/assets/svgs/back-arrow-longer-stem.svg";

const KeyboardCoasterNotNow = ({
  onPress,
  borderRadius = 20,
  borderColor = "transparent",
  maxHeight = 100,
}) => {
  const { themeStyles } = useGlobalStyle();

  return (
    <View style={styles.absoluteContainer}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.container,
          {
            borderRadius: borderRadius,
            borderColor: borderColor,
            height: 40,
            maxHeight: maxHeight,
          },
        ]}
      >
        {/* <LinearGradient
          colors={[
            manualGradientColors.darkColor,
            manualGradientColors.lightColor,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
        /> */}

        <View
          style={{
            width: "100%",
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            justifyContent: "flex-start",
          }}
        >
          <View
            style={{
              marginTop: 10,
              width: 20, // cropped width
              height: 14, // cropped height
              overflow: "hidden", // this hides the overflowing part
            }}
          >
            <View
              style={{
                height: 20,
                width: 20,
                paddingLeft: 8,
                transform: [{ rotate: "270deg" }],
              }}
            >
              <BackArrowLongerStemSvg
                height={20}
                width={20}
                color={themeStyles.primaryText.color}
              />
            </View>
          </View>
          <Text
            style={[
              themeStyles.primaryText,
              { fontSize: 15, fontWeight: "bold" },
            ]}
          >
            dashboard
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  absoluteContainer: {
    // this button is only used on the home screen and features a unique option toggle
    width: "50%",
    height: 36,
    position: "absolute",
    bottom: 10,
    left: 0,
    zIndex: 3,
    elevation: 3,
  },
  container: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
    alignContent: "center",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
});

export default KeyboardCoasterNotNow;
