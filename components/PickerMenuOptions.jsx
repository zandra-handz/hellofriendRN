import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useSelectedFriend } from '../context/SelectedFriendContext';

const PickerMenuOptions = ({
  options = [],
  onSelectOption,
  selectedOption,
  containerText = 'Select an option', 
  buttonStyle,
  widthForHorizontal='80%',
  buttonTextStyle,  
  useSvg = false,  
  svgIcons = [], 
  labels = [], 
  labelPosition = 'below',  
}) => {

  const { themeStyles } = useGlobalStyle();
  const { calculatedThemeColors } = useSelectedFriend();

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={[styles.containerText, styles.inlineText, {color: calculatedThemeColors.fontColor}]}>
          {containerText}
        </Text>
        {options.length === 0 ? (
          <Text style={styles.noOptionsText}>No options available</Text>
        ) : (
          <View style={[styles.optionsContainer, {width: widthForHorizontal}]}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton, themeStyles.genericIcon, themeStyles.genericTextBackgroundShadeTwo,
                  selectedOption === index && [styles.selectedOptionButton,  {backgroundColor : calculatedThemeColors.darkColor}],
                  themeStyles.selectedIconBorder,
                  buttonStyle
                ]}
                onPress={() => onSelectOption(index)}
              >
                <View style={[
                  styles.optionContent,
                  labelPosition === 'below' && styles.labelBelow
                ]}>
                  {useSvg && svgIcons[index] ? (
                    <>
                      {labelPosition === 'beside' && labels[index] && (
                        <Text style={[styles.optionLabel, {color: calculatedThemeColors.fontColor}]}>{labels[index]}</Text>
                      )}
                      {React.createElement(svgIcons[index], { width: 24, height: 24, color: calculatedThemeColors.fontColor })}
                      {labelPosition === 'below' && labels[index] && (
                        <Text style={[styles.optionLabel, {color: calculatedThemeColors.fontColor}]}>{labels[index]}</Text>
                      )}
                    </>
                  ) : (
                    <Text
                      style={[
                        styles.optionText,
                        selectedOption === index && styles.selectedOptionText,
                        buttonTextStyle,
                      ]}
                    >
                      {labels[index] || option}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    width: '100%',
    alignContent: 'center',
    flex: 1,  
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between', 
    alignContent: 'center', 
    width: '100%', 
  },
  containerText: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold', 
  },
  inlineText: {
    flex: 1, 
  },
  optionsContainer: {  
    justifyContent: 'space-between', 
    flexDirection: 'row',  
    flexWrap: 'wrap',
  }, 
  optionButton: {  
    minWidth: 96,
    paddingBottom: 4,
    paddingTop: 8,
    borderRadius: 20, 
    alignItems: 'center',
  },
  selectedOptionButton: {
    borderWidth: 0,  
  },
  optionText: { 
    fontFamily: 'Poppins-Regular',
  },
  selectedOptionText: {
    color: 'green',
    fontFamily: 'Poppins-Bold',
  },
  optionContent: {
    flexDirection: 'row', 
    width: '100%', 
  },
  labelBelow: {
    width: '100%',
    flexDirection: 'column', 
    alignItems: 'center', 
    textAlign: 'center',

    
  },
  optionLabel: {
    paddingTop: 4,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Poppins-Regular', 
  
    
  },
  noOptionsText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'gray',
    textAlign: 'center',
  },
});

export default PickerMenuOptions;
