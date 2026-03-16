 


import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, DimensionValue } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SoonRow from './SoonRow';

interface HomeScrollSoonProps {
  upcomingHelloes: any[];
  friendList: any[];
  isLoading: boolean;
  primaryColor?: string;
  onSoonPress: (id: number) => void;
  handleSelectFriend: (id: number) => void;
  startAtIndex?: number; 
}

const HomeScrollSoon: React.FC<HomeScrollSoonProps> = ({
  upcomingHelloes,
  friendList,
  isLoading,
  primaryColor = '#ffffff',
  onSoonPress,
  handleSelectFriend,
  startAtIndex = 1,  
  darkerOverlayColor,
}) => {

  const height = 270;
  
  const navigation = useNavigation();

  const handleDoublePress = useCallback(
    (friendId: number) => {
      handleSelectFriend(friendId);
      navigation.navigate('Moments' as never);
    },
    [handleSelectFriend, navigation],
  );

const renderItem = useCallback(
  ({ item, index }: { item: any; index: number }) => (
    <SoonRow
      date={item.date}
      friendName={item.friend.name}
      friendId={item.friend.id}
      capsuleCount={item.capsule_count}
      friendList={friendList}
      textColor={primaryColor}
      readabilityColor={darkerOverlayColor}   // ← add this
      showDivider={index > 0}
      onPress={() => onSoonPress(item.friend.id)}
      onDoublePress={() => handleDoublePress(item.friend.id)}
    />
  ),
  [friendList, primaryColor, darkerOverlayColor, onSoonPress, handleDoublePress],
);

  if (isLoading || !friendList?.length) return null;

  return (
    <View style={[styles.container, { height }]}>
      <Text style={[styles.header, { color: primaryColor }]}>Soon</Text>
      <FlatList
        data={upcomingHelloes?.slice(startAtIndex, 5)}
        renderItem={renderItem}
        keyExtractor={(item, i) => item?.id?.toString() ?? `soon-${i}`}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={6}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 0 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    // backgroundColor: 'red',
    paddingVertical: 20
  },
  header: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
    paddingHorizontal: 12,
  },
});

export default HomeScrollSoon;