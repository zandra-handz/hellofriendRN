//<Text style={[styles.containerText, styles.inlineText, {color: themeAheadOfLoading.fontColor}]}>
//{containerText}
//</Text>

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { useGlobalStyle } from "../context/GlobalStyleContext";
import { useFriendList } from "../context/FriendListContext";

const PickerMenuOptions = ({
  title = "title here",
  options = [],
  onSelectOption,
  selectedOption,
  buttonStyle,
  widthForHorizontal = "100%",
  buttonTextStyle,
  useSvg = true,
  svgIcons = [],
  labels = [],
  labelPosition = "below",
}) => {
  const { width, height } = Dimensions.get("window");

  // Calculate 1/5 of the screen's width and height
  const oneFifthWidth = width / 5; //button width for FlatList version
  const oneFourthWidth = width / 4.3; //button width for fewer than 5 options/no flatlist
  const oneThirteenthHeight = height / 13; //just used for non-Flatlist. 
  //I think FlatList buttons are slightly taller

  const { themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();

  return (
    <View style={[styles.container, themeStyles.genericTextBackgroundShadeTwo]}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          height: "auto",
        }}
      >
        <Text style={[styles.title, themeStyles.genericText]}>{title}</Text>
      </View>
      {options.length === 0 && <Text style={styles.noOptionsText}>''</Text>}
      {options.length > 0 && options.length < 5 && (
        <View style={[styles.optionsContainer, { width: "100%" }]}>
          {options.map((option, index) => (
            <View style={[styles.optionsContainer, { width: oneFifthWidth }]}>
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  themeStyles.genericIcon,
                  themeStyles.genericTextBackgroundShadeTwo,
                  { height: oneThirteenthHeight, borderColor: themeStyles.genericText.color },
                  selectedOption === index && [
                    styles.selectedOptionButton,
                    {
                      borderWidth: 1,
                      borderColor: themeAheadOfLoading.darkColor,
                      backgroundColor: themeAheadOfLoading.darkColor,
                    },
                  ],

                  buttonStyle,
                ]}
                onPress={() => onSelectOption(index)}
              >
                <View style={[styles.optionContent, styles.labelBelow]}>
                  {useSvg && svgIcons[index] ? (
                    <>
                      {React.createElement(svgIcons[index], {
                        width: 24,
                        height: 24,
                        color:
                          selectedOption === index
                            ? themeAheadOfLoading.fontColor
                            : themeStyles.genericText.color,
                      })}

                      {labels[index] && (
                        <Text
                          style={[
                            styles.optionLabel,
                            {
                              color:
                                selectedOption === index
                                  ? themeAheadOfLoading.fontColor
                                  : themeStyles.genericText.color,
                            },
                            selectedOption === index &&
                              styles.selectedOptionText,
                            buttonTextStyle,
                          ]}
                        >
                          {labels[index]}
                        </Text>
                      )}
                    </>
                  ) : (
                    <Text
                      style={[
                        styles.optionText,
                        selectedOption === index && styles.selectedOptionText,
                        { color: themeAheadOfLoading.fontColor },
                      ]}
                    >
                      {labels[index] || option}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      {options.length > 5 && (
        <View style={[styles.optionsContainerFlatList, { width: "100%" }]}>
          <FlatList
            data={options}
            horizontal={true}
            keyExtractor={(item, index) => `option-${index}`}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  themeStyles.genericIcon,
                  themeStyles.genericTextBackgroundShadeTwo,
                  {
                    width: oneFourthWidth,
                    borderColor: themeStyles.genericText.color,
                  },
                  selectedOption === index && [
                    styles.selectedOptionButton,
                    {
                      borderWidth: 1,
                      borderColor: themeAheadOfLoading.darkColor,
                      backgroundColor: themeAheadOfLoading.darkColor,
                    },
                  ],

                  buttonStyle,
                ]}
                onPress={() => onSelectOption(index)}
              >
                <View style={[styles.optionContent, styles.labelBelow]}>
                  {useSvg && svgIcons[index] ? (
                    <>
                      {React.createElement(svgIcons[index], {
                        width: 24,
                        height: 24,
                        color:
                          selectedOption === index
                            ? themeAheadOfLoading.fontColor
                            : themeStyles.genericText.color,
                      })}

                      {labels[index] && (
                        <Text
                          style={[
                            styles.optionLabel,
                            {
                              color:
                                selectedOption === index
                                  ? themeAheadOfLoading.fontColor
                                  : themeStyles.genericText.color,
                            },
                            selectedOption === index &&
                              styles.selectedOptionText,
                            buttonTextStyle,
                          ]}
                        >
                          {labels[index]}
                        </Text>
                      )}
                    </>
                  ) : (
                    <Text
                      style={[
                        styles.optionText,
                        selectedOption === index && styles.selectedOptionText,
                        { color: themeAheadOfLoading.fontColor },
                      ]}
                    >
                      {labels[index] || option}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            scrollIndicatorInsets={{ right: 1 }}
            initialScrollIndex={0}
            decelerationRate="fast"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    //flex: 1,
    height: "auto",
    borderRadius: 30,
    margin: "0%",
    alignSelf: "center",
    padding: 20,
    overflow: "hidden",

    //backgroundColor: 'red',
  },
  title: {
    fontSize: 15,
    lineHeight: 21,
    textTransform: "uppercase",
  },
  containerText: {
    fontSize: 17,
  },
  inlineText: {
    flex: 1,
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
  optionText: {},
  selectedOptionText: {},
  optionContent: {
    flexDirection: "row",
    width: "100%",
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
  itemBox: {
    flexDirection: "column",
    textAlignVertical: "top",
    alignContent: "center",
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "teal",
    padding: "6%",
    height: "100%",
    width: "100%",
  },
  noOptionsText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "gray",
    textAlign: "center",
  },
});

export default PickerMenuOptions;
