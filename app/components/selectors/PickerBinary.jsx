import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

const PickerBinary = ({
  LeftSvg,
  RightSvg,
  leftLabel = "",
  rightLabel = "",
  leftLabelPosition = "below",
  rightLabelPosition = "below",
  evenSplit = true,
  leftProportion = 0.5,
  rightProportion = 0.5,
  onPressLeft,
  onPressRight,
  containerText = "",
}) => {
  const totalProportion = evenSplit ? 1 : leftProportion + rightProportion;
  const leftWidth =
    (evenSplit ? 0.49 : leftProportion / totalProportion) * 100 + "%";
  const rightWidth =
    (evenSplit ? 0.49 : rightProportion / totalProportion) * 100 + "%";
  const { themeStyles } = useGlobalStyle();

  return (
    <View style={styles.container}>
      <Text style={[styles.containerText, themeStyles.subHeaderText]}>
        {containerText}
      </Text>
      <View style={[styles.contentContainer]}>
        <TouchableOpacity
          style={[
            styles.side,
            themeStyles.genericTextBackgroundShadeTwo,
            {
              borderColor: themeStyles.genericTextBackground,
              width: leftWidth,
            },
          ]}
          onPress={onPressLeft}
        >
          {leftLabel && leftLabelPosition === "above" && (
            <Text style={[styles.label, themeStyles.subHeaderText]}>
              {leftLabel}
            </Text>
          )}
          <View style={styles.iconContainer}>
            <LeftSvg
              width="70%"
              height="70%"
              color={themeStyles.modalIconColor.color}
            />
          </View>
          {leftLabel && leftLabelPosition === "below" && (
            <Text style={[styles.label, themeStyles.subHeaderText]}>
              {leftLabel}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.side,
            themeStyles.genericTextBackgroundShadeTwo,
            {
              borderColor: themeStyles.genericTextBackground,
              width: rightWidth,
            },
          ]}
          onPress={onPressRight}
        >
          {rightLabel && rightLabelPosition === "above" && (
            <Text style={[styles.label, themeStyles.subHeaderText]}>
              {rightLabel}
            </Text>
          )}
          <View style={styles.iconContainer}>
            <RightSvg
              width="70%"
              height="70%"
              color={themeStyles.modalIconColor.color}
            />
          </View>
          {rightLabel && rightLabelPosition === "below" && (
            <Text style={[styles.label, themeStyles.subHeaderText]}>
              {rightLabel}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    padding: 5,
  },
  containerText: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    textAlign: "left",
    marginVertical: 10,
  },
  contentContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  side: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderWidth: 0,
    height: "90%",
    borderRadius: 20,
  },
  iconContainer: {
    width: "70%",
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  label: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "black",
    textAlign: "center",
  },
});

export default PickerBinary;
