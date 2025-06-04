import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CoffeeMugSolidHeart from "@/app/assets/svgs/coffee-mug-solid-heart";
import PhoneChatMessageHeartSvg from "@/app/assets/svgs/phone-chat-message-heart";
import CoffeeMugFancySteamSvg from "@/app/assets/svgs/coffee-mug-fancy-steam";
import CelebrationSparkOutlineSvg from "@/app/assets/svgs/celebration-spark-outline";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

const PickerHelloType = ({
  title = "",
  selectedTypeChoice,
  onTypeChoiceChange, 
  labels = ["digital", "in person", "surprise", "N/A"],
}) => {
  const options = [
    "via text or social media",
    "in person",
    "happenstance",
    "unspecified",
  ];

  const svgIcons = [
    PhoneChatMessageHeartSvg,
    CoffeeMugSolidHeart,
    CelebrationSparkOutlineSvg,
    CoffeeMugFancySteamSvg,
  ];

  const HEIGHT = 120;
  const oneFifthWidth = "23%";

  const { themeStyles, manualGradientColors } = useGlobalStyle();

  return (
    <View
      style={[
        styles.container,
        { height: HEIGHT },
        // themeStyles.genericTextBackgroundShadeTwo
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Text style={[styles.title, themeStyles.genericText]}>{title}</Text>
      </View>

      <View style={[styles.optionsContainer, { width: "100%" }]}>
        {options.map((option, index) => (
          <View key={option || index} style={[styles.optionsContainer, { width: oneFifthWidth }]}>
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                themeStyles.genericIcon,
                themeStyles.genericTextBackgroundShadeTwo,
                {
                  height: "100%",
                  borderColor: themeStyles.genericText.color,
                },
                selectedTypeChoice === index && [
                  styles.selectedOptionButton,
                  {
                    borderWidth: 1,
                    borderColor: manualGradientColors.lightColor,
                    backgroundColor: manualGradientColors.homeDarkColor,
                  },
                ],
              ]}
              onPress={() => onTypeChoiceChange(index)}
            >
              <View style={[styles.optionContent, styles.labelBelow]}>
           
                  <>
                    {React.createElement(svgIcons[index], {
                      width: 24,
                      height: 24,
                      color:
                        selectedTypeChoice === index
                          ? manualGradientColors.lightColor
                          : themeStyles.genericText.color,
                    })}

                    {labels[index] && (
                      <Text
                        style={[
                          styles.optionLabel,
                          {
                            color:
                              selectedTypeChoice === index
                                ? manualGradientColors.lightColor
                                : themeStyles.genericText.color,
                          }, 
                        ]}
                      >
                        {labels[index]}
                      </Text>
                    )}
                  </> 
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 10,
    alignSelf: "center",
    padding: 0,
    overflow: "hidden",
  },
  title: {
    fontSize: 15,
    lineHeight: 21,
    textTransform: "uppercase",
  },
  optionsContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  optionsContainerFlatList: {
    justifyContent: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  optionButton: {
    padding: "3%",
    width: "100%",
    flex: 1,
    borderRadius: 10,
    minHeight: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedOptionButton: {
    borderWidth: 2,
  }, 
  optionContent: {
    flexDirection: "row",
    width: "100%",
    padding: 8,
  },
  labelBelow: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  optionLabel: {
    paddingTop: 4,
    textAlign: "center",
    fontSize: 14,
    //fontFamily: 'Poppins-Regular',
  },
});

export default PickerHelloType;
