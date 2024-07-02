import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import CardGen from '../components/CardGen';
import CardStatus from '../components/CardStatus';

const interpolateColor = (startColor, endColor, factor) => {
  const result = startColor.slice();
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (endColor[i] - startColor[i]));
  }
  return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
};

const endColor = [25, 90, 25]; // Darker Forest Green
const startColor = [190, 255, 0]; // More Vibrant Yellow-Green

const getGradientColor = (index, total) => {
  const factor = (index / (total - 1)) * 2;
  const clampedFactor = Math.min(factor, 1);
  return interpolateColor(startColor, endColor, clampedFactor);
};

const TabScreen = ({ data, showStatusCard, leftContent, rightContent }) => (
  <FlatList
    ListHeaderComponent={showStatusCard && (
      <CardStatus
        title={leftContent}
        rightTitle={rightContent}
        description=""
        showFooter={false}
      />
    )}
    data={data}
    renderItem={({ item, index }) => (
      <CardGen
        key={item.id}
        title={item.title}
        description={item.description}
        showIcon={true}
        iconColor={getGradientColor(index, data.length)}
      />
    )}
    keyExtractor={item => item.id.toString()}
    contentContainerStyle={styles.tabContent}
  />
);

const styles = StyleSheet.create({
  tabContent: {
    padding: 0,
    
  },
});

export default TabScreen;
