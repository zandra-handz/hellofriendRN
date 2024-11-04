import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

import { FlashList } from '@shopify/flash-list';
import { useCapsuleList } from '../context/CapsuleListContext';
import ThoughtBubbleOutlineSvg from '../assets/svgs/thought-bubble-outline.svg'; // Import the SVG
import { GestureHandlerRootView, TapGestureHandler, LongPressGestureHandler, State } from 'react-native-gesture-handler';
import ItemViewMoment from '../components/ItemViewMoment';
import { useGlobalStyle } from '../context/GlobalStyleContext';

const ItemMomentMulti = ({  
  width = 100,
  height = 100,
  spacer = 20,
  limit, 
  newestFirst, 
  containerWidth = 320,
  includeCategoryTitle = false,
  lastIndex = 3, 
  svgOpacity = 0.3,
  textOpacity = 0.3, 
  slideShow = true,  
  Interval = 6000,
  pauseAnimation = false,
}) => { 
  const [selectedMoment, setSelectedMoment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const [ slideShowInterval, setSlideShowInterval] = useState(0);
  const [notFirst, setNotFirst ] = useState(false);
  const [momentAnimations, setMomentAnimations] = useState({});
  const [currentIndex, setCurrentIndex] = useState(lastIndex); 
  const listToDisplay = newestFirst ? newestFirst : [];
  const moments = useMemo(() => listToDisplay.slice(0, limit), [listToDisplay, limit]);
  const [ iconStyle, setIconStyle ] = useState([]);
  const [stop, setStop ] =useState(false);
  const { themeStyles } = useGlobalStyle();
 
  

  useEffect(() => {
    const animations = {};
    moments.forEach(moment => {
      animations[moment.id] = {
        svgOpacity: new Animated.Value(svgOpacity),
        textOpacity: new Animated.Value(textOpacity),
      };
    });
    setMomentAnimations(animations);
    console.log('useEffect for setting momentAnimations');
  }, [moments, svgOpacity, themeStyles, textOpacity]);


  useEffect(() => {
    console.log('themeStyles changed!');
    setCurrentIndex(3);
    setIconStyle(themeStyles.friendFocusSectionIcon);
    setStop(false);
    
  }, [themeStyles]);

  useEffect(() => {
    if (moments.length > 0 && lastIndex !== undefined) {
      setSelectedMoment(moments[lastIndex] || moments[moments.length - 1]);
      setCurrentIndex(lastIndex || moments.length - 1);
    
    }
  }, [moments, lastIndex]);

  useEffect(() => {
    console.log('useEffect for intervals for animation triggered');
    
    if (pauseAnimation || !slideShow || moments.length === 0) {
      return;  // If paused or slideshow is disabled, don't start the interval
    }

    if (slideShow && moments.length > 0 && pauseAnimation == false ) {
     
      const intervalId = setInterval(() => {
        setCurrentIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % moments.length;
          setSelectedMoment(moments[nextIndex]);
          
          Object.keys(momentAnimations).forEach(id => {
            const animation = momentAnimations[id];
            Animated.timing(animation.svgOpacity, {
              toValue: id === moments[nextIndex].id ? 1 : svgOpacity,
              duration: 300,
              useNativeDriver: true,
            }).start();
            Animated.timing(animation.textOpacity, {
              toValue: id === moments[nextIndex].id ? 1 : textOpacity,
              duration: 300,
              useNativeDriver: true,
            }).start();
          });
          setNotFirst(true);
          setSlideShowInterval(Interval);
          console.log('nextIndex: ', nextIndex);
          return nextIndex;
        });
      }, slideShowInterval);
  
      return () => clearInterval(intervalId);
    }
  }, [slideShow, moments, slideShowInterval, pauseAnimation, momentAnimations, svgOpacity, textOpacity]);

  const openModal = useCallback((moment) => {
    setSelectedMoment(moment);
    setIsModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedMoment(null);
    setIsModalVisible(false);
  }, []);

  useEffect(() => {
    console.log('hhhhhhhhhhhhhhhhhhhhillo',pauseAnimation);

  }, [pauseAnimation]);

  const calculateFontSize = (width) => width * 0.055;
  const calculateBubbleContainerDimensions = (width, height) => ({
    width: width * 0.78,
    height: height * 0.9,
  });

  const calculateLeftPadding = (bubbleWidth) => bubbleWidth * 0.26;
  const bubbleContainerDimensions = calculateBubbleContainerDimensions(width, height);
  const generateUniqueKey = (item) => `${item.id}-${item.capsule}`;

  const handleDoubleTap = useCallback((moment) => {
    setOpacityState(prevState => {
      const newOpacityState = {};
      Object.keys(momentAnimations).forEach(id => {
        const animation = momentAnimations[id];
        const newOpacity = id === moment.id ? (prevState[moment.id] === 1 ? svgOpacity : 1) : svgOpacity;
        newOpacityState[id] = newOpacity;
        Animated.timing(animation.svgOpacity, {
          toValue: newOpacity,
          duration: 300,
          useNativeDriver: true,
        }).start();
        Animated.timing(animation.textOpacity, {
          toValue: newOpacity,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
      return newOpacityState;
    });
  }, [momentAnimations, svgOpacity]);

  const handleLongPress = useCallback((moment) => {
    openModal(moment);
  }, [openModal]);

  const handleTap = useCallback((event, moment) => {
    if (event.nativeEvent.state === State.END) {
      const currentTime = new Date().getTime();
      const tapDelay = 300; 

      if (lastTap && (currentTime - lastTap) < tapDelay) {
        console.log(`handleDoubleTap`);
        //handleDoubleTap(moment); handledoubletap not working with automated slideshow yet
      } else {
        console.log(`handleDoubleTap`);
        //handleDoubleTap(moment); 
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
                minDurationMs={500} 
              >
                <TapGestureHandler
                  onHandlerStateChange={(event) => handleTap(event, moment)}
                  numberOfTaps={1}
                >
                  <View style={[styles.relativeContainer, { width, height, marginRight: 10 }]}>
                    <Animated.View style={{ opacity: animation.svgOpacity}}>
                    <ThoughtBubbleOutlineSvg
                      key={themeStyles.friendFocusSectionIcon.color} // Use color as the key
                      width={width}
                      height={height}
                      color={themeStyles.friendFocusSectionIcon.color}
                    />
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
      <View style={[styles.containerBelow, { width: containerWidth }]}>
        {selectedMoment && notFirst && (  
          <Text 
            style={[styles.selectedMomentDisplayText, themeStyles.friendFocusSectionText]} 
            numberOfLines={6} 
            ellipsizeMode='tail'
          >
            {selectedMoment.capsule}
          </Text>
        )}
      </View>
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
    color: 'transparent',
    fontFamily: 'Poppins-Regular',
    textAlign: 'left',
  },
  selectedMomentDisplayText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryCircle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#d3d3d3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    color: 'transparent',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  containerBelow: {
    position: 'absolute',
    top: 74,
    height: 100,
    width: '100%',
    paddingHorizontal: 0,
    backgroundColor: 'rgba(0,0,0,0.0)',
    justifyContent: 'center',
    alignItems: 'center', 
  },
});

export default ItemMomentMulti;
