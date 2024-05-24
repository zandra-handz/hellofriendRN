import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import CardGen from '../components/CardGen';
import CardStatus from '../components/CardStatus';
import { useCapsuleList } from '../context/CapsuleListContext'; // Import useCapsuleList hook
import NextHello from '../data/FriendDashboardData'; // Import the NextHello component
import DaysSince from '../data/FriendDaysSince'; // Import the NextHello component

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

const TabScreenFriend = () => {
  const { capsuleList } = useCapsuleList(); // Get capsule list from CapsuleListContext

  return (
    <FlatList
      ListHeaderComponent={(
        <>
          <CardStatus
            title={<NextHello />}
            rightTitle={<DaysSince />}
            description=""
            showFooter={false}
          />
        </>
      )}
      data={capsuleList} // Iterate through capsuleList
      renderItem={({ item, index }) => (
        <CardGen
          key={index} // Use index as the key for unique rendering
          title={item.typedCategory}
          description={item.capsule}
          showIcon={true}
          iconColor={getGradientColor(index, capsuleList.length)} // Adjust gradient color based on capsuleList length
          capsule={item} // Pass the entire capsule as a prop to CardGen
        />
      )}
      keyExtractor={(item, index) => index.toString()} // Use index as the key extractor
      contentContainerStyle={styles.tabContent}
    />
  );
};

const styles = StyleSheet.create({
  tabContent: {
    padding: 0,
  },
});

export default TabScreenFriend;
