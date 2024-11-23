import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext'; 
import { useFriendList } from '../context/FriendListContext';
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
  const { themeAheadOfLoading } = useFriendList(); 

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={[styles.containerText, styles.inlineText, {color: themeAheadOfLoading.fontColor}]}>
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
                  styles.optionButton, themeStyles.genericIcon, themeStyles.genericTextBackgroundShadeTwo, {borderColor: themeStyles.genericText.color},
                  selectedOption === index && [styles.selectedOptionButton,  {borderWidth: 1, borderColor : themeAheadOfLoading.darkColor, backgroundColor: themeAheadOfLoading.darkColor}],
                  
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
                        <Text style={[styles.optionLabel, {color: themeAheadOfLoading.fontColor}]}>{labels[index]}</Text>
                      )}
                      {React.createElement(svgIcons[index], { width: 24, height: 24, color: selectedOption === index ? themeAheadOfLoading.fontColor : themeStyles.genericText.color })}
                      
                      {labelPosition === 'below' && labels[index] && ( 
                        <Text
                          style={[
                            styles.optionLabel,
                            { color: selectedOption === index ? themeAheadOfLoading.fontColor : themeStyles.genericText.color },
                            selectedOption === index && styles.selectedOptionText,
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
                        selectedOption === index && styles.selectedOptionText, {color: themeAheadOfLoading.fontColor},
                        
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
    fontFamily: 'Poppins-Regular', 
     
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
    minWidth: 76,
    width: 'auto',
    flex: 1, 
    paddingBottom: 4,
    paddingTop: 8,
    marginRight: 6,
    borderRadius: 10,
    borderWidth: 0,
    borderColor: '#ccc', 
    alignItems: 'center',
  },
  selectedOptionButton: { 
    borderWidth: 2,
  },
  optionText: { 
    fontFamily: 'Poppins-Regular', 
  },
  selectedOptionText: { 
    fontFamily: 'Poppins-Regular', 
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
