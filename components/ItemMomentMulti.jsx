import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useCapsuleList } from '../context/CapsuleListContext';
import BubbleChatSquareSolidSvg from '../assets/svgs/bubble-chat-square-solid.svg'; 
import ThoughtBalloonLightBlueSvg from '../assets/svgs/thought-balloon-light-blue.svg';

import ItemViewMoment from '../components/ItemViewMoment';
import { GestureHandlerRootView, TapGestureHandler, LongPressGestureHandler, State } from 'react-native-gesture-handler';

const ItemMomentMulti = ({  
  width = 100,
  height = 100,
  spacer = 20,
  limit,
  newestFirst = true,
  svgColor = 'white',
  containerWidth = 320,
  includeCategoryTitle = true,
  svgOpacity = 0.3,
  textOpacity = 0.3,
}) => {
  const { newestFirst: newestFirstList } = useCapsuleList();
  const [selectedMoment, setSelectedMoment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const [momentAnimations, setMomentAnimations] = useState({});
  const [opacityState, setOpacityState] = useState({});  

  const listToDisplay = newestFirst ? newestFirstList : [];
  const moments = useMemo(() => listToDisplay.slice(0, limit), [listToDisplay, limit]);

  useEffect(() => { 
    const animations = {};
    const opacityStates = {};
    moments.forEach(moment => {
      animations[moment.id] = {
        svgOpacity: new Animated.Value(svgOpacity),
        textOpacity: new Animated.Value(textOpacity),
      };
      opacityStates[moment.id] = svgOpacity;  
    });
    setMomentAnimations(animations);
    setOpacityState(opacityStates);
  }, [moments, svgOpacity, textOpacity]);

  const openModal = useCallback((moment) => {
    setSelectedMoment(moment);
    setIsModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedMoment(null);
    setIsModalVisible(false);
  }, []);

  const calculateFontSize = (width) => width * 0.055;
  const calculateBubbleContainerDimensions = (width, height) => ({
    width: width * 0.78,
    height: height * 0.9,
  });

  const calculateLeftPadding = (bubbleWidth) => bubbleWidth * 0.26;
  const bubbleContainerDimensions = calculateBubbleContainerDimensions(width, height);
  const generateUniqueKey = (item) => `${item.id}-${item.capsule}`;

  const handleDoubleTap = useCallback((moment) => {
    console.log('Double tap detected');
    setOpacityState(prevState => {
      const newOpacityState = {};
      const newMomentAnimations = { ...momentAnimations };
      
      moments.forEach(m => {
        newOpacityState[m.id] = svgOpacity;
        Animated.timing(newMomentAnimations[m.id].svgOpacity, {
          toValue: svgOpacity,
          duration: 300,
          useNativeDriver: true,
        }).start();
        Animated.timing(newMomentAnimations[m.id].textOpacity, {
          toValue: svgOpacity,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
 
      const newOpacity = prevState[moment.id] === 1 ? svgOpacity : 1;
      newOpacityState[moment.id] = newOpacity;
      Animated.timing(newMomentAnimations[moment.id].svgOpacity, {
        toValue: newOpacity,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(newMomentAnimations[moment.id].textOpacity, {
        toValue: newOpacity,
        duration: 300,
        useNativeDriver: true,
      }).start();

      return newOpacityState;
    });
  }, [momentAnimations, moments, svgOpacity]);

  const handleLongPress = useCallback((moment) => {
    console.log('Long press detected');
    openModal(moment);
  }, [openModal]);

  const handleTap = useCallback((event, moment) => {
    if (event.nativeEvent.state === State.END) {
      const currentTime = new Date().getTime();
      const tapDelay = 300; // Time delay to distinguish between single and double tap

      if (lastTap && (currentTime - lastTap) < tapDelay) {
        handleDoubleTap(moment);
      } else {
        handleDoubleTap(moment); // Handle single tap if needed
      }

      setLastTap(currentTime);
    }
  }, [handleDoubleTap, lastTap]);

  return (
    <GestureHandlerRootView style={{ width: containerWidth, minHeight: 2 }}>
      <FlashList
        data={moments}
        horizontal
        keyExtractor={(moment) => generateUniqueKey(moment)}
        renderItem={({ item: moment }) => {
          const animation = momentAnimations[moment.id] || { svgOpacity: new Animated.Value(svgOpacity), textOpacity: new Animated.Value(textOpacity) };

          return (
            <View style={{ paddingRight: spacer }}>
              <LongPressGestureHandler
                onHandlerStateChange={(event) => {
                  if (event.nativeEvent.state === State.ACTIVE) {
                    handleLongPress(moment);
                  }
                }}
                minDurationMs={500} // Duration for long press
              > 
                  <TapGestureHandler
                    onHandlerStateChange={(event) => handleTap(event, moment)}
                    numberOfTaps={1}
                  >
                    <View style={[styles.relativeContainer, { width, height, marginRight: 10 }]}>
                      <Animated.View style={{ opacity: animation.svgOpacity }}>
                        <ThoughtBalloonLightBlueSvg width={width} height={height} color={svgColor} />
                      </Animated.View>
                      <View style={[styles.bubbleContainer, bubbleContainerDimensions, { paddingLeft: calculateLeftPadding(bubbleContainerDimensions.width) }]}>
                        <Animated.Text style={[styles.bubbleText, { fontSize: calculateFontSize(width), top: bubbleContainerDimensions.height * 0.21, opacity: animation.textOpacity }]} numberOfLines={7}>
                          {moment.capsule} 
                          </Animated.Text>
                        {includeCategoryTitle && (
                          <View style={[styles.categoryCircle, { backgroundColor: 'transparent' }]}>
                            <Animated.Text style={[styles.categoryText, {fontSize: calculateFontSize(width * .8), opacity: animation.textOpacity}]} numberOfLines={1}>Cat: {moment.typedCategory}</Animated.Text>
                          </View>
                        )} 
                      </View>
                    </View>
                  </TapGestureHandler> 
              </LongPressGestureHandler>
            </View>
          );
        }}
        estimatedItemSize={width * 1.1}
        showsHorizontalScrollIndicator={false}
        scrollIndicatorInsets={{ right: 1 }}
      />
      {isModalVisible && (
        <ItemViewMoment moment={selectedMoment} onClose={closeModal} />
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  relativeContainer: {},
  bubbleContainer: {
    position: 'absolute',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    zIndex: 1,
  },
  bubbleText: {
    color: 'black',
    fontFamily: 'Poppins-Regular',
    textAlign: 'left',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  categoryCircle: {
    position: 'absolute',
    bottom: -50,
    right: 12,
    width: 106,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'right', 
    textAlign: 'right',
  },
  categoryText: {
    color: 'black', 
    fontFamily: 'Poppins-Regular',
    textTransform: 'uppercase',
    overflow: 'hidden', 
    textAlign: 'right',
  },
});

export default ItemMomentMulti;
