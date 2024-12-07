
//<Text style={[styles.containerText, styles.inlineText, {color: themeAheadOfLoading.fontColor}]}>
//{containerText}
//</Text>

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useGlobalStyle } from '../context/GlobalStyleContext'; 
import { useFriendList } from '../context/FriendListContext';
const PickerMenuOptions = ({
  options = [],
  onSelectOption,
  selectedOption, 
  buttonStyle,
  widthForHorizontal='80%',
  buttonTextStyle,  
  useSvg = true,  
  svgIcons = [], 
  labels = [], 
  labelPosition = 'below',  
}) => {

  const { themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList(); 

  return (
    <View style={styles.container}> 

        {options.length === 0 && (
          <Text style={styles.noOptionsText}>''</Text>
        )}
        {options.length > 0 && options.length < 5 && (
          
          <View style={[styles.optionsContainer, {width: widthForHorizontal}]}>
            {options.map((option, index) => (
              <View style={{marginHorizontal: '1%'}}>
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
                  styles.optionContent, styles.labelBelow
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
              </View>
            ))}
          </View>
        )}
        {options.length > 5 && (

          <FlatList
            data={options}
            horizontal={true}
            keyExtractor={(item, index) => `option-${index}`}
            renderItem={({ item, index }) => (
              <View style={{width: 160}}>
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
                  styles.optionContent, styles.labelBelow
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
              </View>
            )}
            showsHorizontalScrollIndicator={false}
            scrollIndicatorInsets={{ right: 1 }}
            initialScrollIndex={0}
              decelerationRate="fast" 

            /> 
        )}
        
      </View> 
  );
};

const styles = StyleSheet.create({
  container: { 
    
    paddingHorizontal: '2%', 
    paddingVertical: '3%', 
    flexDirection: 'row',
    width: '100%', 
    justifyContent: 'center',
    height: '100%', 

    
    //backgroundColor: 'red',
  }, 
  containerText: {
    fontSize: 17, 
     
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
    padding: '4%',
    minWidth: 76,
    width: 'auto',
    flex: 1,  
    borderRadius: 10,   
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedOptionButton: { 
    borderWidth: 2,
  },
  optionText: {  
  },
  selectedOptionText: {   
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
