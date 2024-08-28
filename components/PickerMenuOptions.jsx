import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


const PickerMenuOptions = ({
  options = [],
  onSelectOption,
  selectedOption,
  containerText = 'Select an option',
  containerStyle,
  buttonStyle,
  buttonTextStyle,
  includeContainer = false,
  layout = 'row', // New prop to control layout
  useSvg = false, // New prop to toggle between text and SVG
  svgColor = 'black',
  svgIcons = [], // Array of SVG components
  labels = [], // Array of labels to be shown with SVGs (optional)
  labelPosition = 'below', // New prop to control label position
  inline = false, // New prop for inline layout
}) => {
  return (
    <View
      style={[
        includeContainer ? [styles.container, containerStyle] : undefined,
        inline && styles.inlineContainer, // Apply inline styles if `inline` is true
      ]}
    >
      <View style={inline ? styles.inlineContent : undefined}>
        <Text style={[styles.containerText, inline && styles.inlineText]}>
          {containerText}
        </Text>
        {options.length === 0 ? (
          <Text style={styles.noOptionsText}>No options available</Text>
        ) : (
          <View style={[styles.optionsContainer, layout === 'row' && styles.rowLayout]}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedOption === index && styles.selectedOptionButton,
                  buttonStyle,
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
                        <Text style={styles.optionLabel}>{labels[index]}</Text>
                      )}
                      {React.createElement(svgIcons[index], { width: 30, height: 30, color: svgColor })}
                      {labelPosition === 'below' && labels[index] && (
                        <Text style={styles.optionLabel}>{labels[index]}</Text>
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
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 8,
  },
  inlineContainer: {
    flexDirection: 'row', // Display items in a row for inline layout
    alignItems: 'center',
  },
  inlineContent: {
    flexDirection: 'row', // Keep content in a row
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  containerText: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
    marginRight: 10, // Space between text and options
  },
  inlineText: {
    flex: 1, // Allow text to fill available space
  },
  optionsContainer: {
    flexDirection: 'column', // Default layout is column
  },
  rowLayout: {
    flexDirection: 'row', // Override to display options in a row
    flexWrap: 'wrap', // Allows wrapping of buttons if they exceed container width
  },
  optionButton: {
    padding: 10,
    paddingBottom: 6,
    borderRadius: 20,
    marginVertical: 4,
    alignItems: 'center',
  },
  selectedOptionButton: {
    backgroundColor: '#d4edda',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  selectedOptionText: {
    color: 'green',
    fontFamily: 'Poppins-Bold',
  },
  optionContent: {
    flexDirection: 'row', // Default layout for beside
    alignItems: 'center',
  },
  labelBelow: {
    flexDirection: 'column', // Change to column if labels are below
    alignItems: 'center', 
    
  },
  optionLabel: {
    marginRight: 14, // Space between label and SVG for beside position
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
