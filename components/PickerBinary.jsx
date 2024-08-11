import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

const PickerBinary = ({
  LeftSvg,
  RightSvg,
  leftLabel = '', // Add leftLabel prop
  rightLabel = '', // Add rightLabel prop
  leftLabelPosition = 'below', // Add leftLabelPosition prop
  rightLabelPosition = 'below', // Add rightLabelPosition prop
  evenSplit = true,
  leftProportion = 0.5,
  rightProportion = 0.5,
  onPressLeft,
  onPressRight,
  containerText = '', // Add containerText prop
}) => {
  // Adjust proportions to ensure they sum to 1 if evenSplit is false
  const totalProportion = evenSplit ? 1 : leftProportion + rightProportion;
  const leftWidth = (evenSplit ? 0.5 : leftProportion / totalProportion) * 100 + '%';
  const rightWidth = (evenSplit ? 0.5 : rightProportion / totalProportion) * 100 + '%';

  return (
    <View style={styles.container}>
      <Text style={styles.containerText}>{containerText}</Text>
      <View style={styles.contentContainer}>
        <TouchableOpacity
          style={[styles.side, { width: leftWidth }]}
          onPress={onPressLeft}
        >
          {leftLabel && leftLabelPosition === 'above' && (
            <Text style={styles.label}>{leftLabel}</Text>
          )}
          <LeftSvg width="100%" height="100%" />
          {leftLabel && leftLabelPosition === 'below' && (
            <Text style={styles.label}>{leftLabel}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.side, { width: rightWidth }]}
          onPress={onPressRight}
        >
          {rightLabel && rightLabelPosition === 'above' && (
            <Text style={styles.label}>{rightLabel}</Text>
          )}
          <RightSvg width="100%" height="100%" />
          {rightLabel && rightLabelPosition === 'below' && (
            <Text style={styles.label}>{rightLabel}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  containerText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    textAlign: 'left',
    marginVertical: 10,
    color: 'black', // Adjust text color as needed
  },
  contentContainer: {
    flexDirection: 'row',
  },
  side: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Adjust as needed
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'black',
    textAlign: 'center',
    marginVertical: 5,
  },
});

export default PickerBinary;
