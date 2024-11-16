import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Text, Animated, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import { useFriendList } from '../context/FriendListContext';

import MomentCard from '../components/MomentCard';
import ItemViewMoment from '../components/ItemViewMoment';
import SearchBar from '../components/SearchBar';
import SpinOutlineSvg from '../assets/svgs/spin-outline.svg';

import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useCapsuleList } from '../context/CapsuleListContext';
import { update } from 'firebase/database';

const ITEM_HEIGHT = 160; // Define the height of each item

const MomentsList = (navigation) => {
    const { themeStyles } = useGlobalStyle();
    const { themeAheadOfLoading } = useFriendList();  
    const { capsuleList, setMomentIdToAnimate, momentIdToAnimate, updateCacheWithNewPreAdded, updateCapsuleMutation, categoryNames, categoryStartIndices, preAddedTracker, momentsSavedToHello, updateCapsule } = useCapsuleList();
    
    const [selectedMomentToView, setSelectedMomentToView] = useState(null);
    const [isMomentViewVisible, setMomentViewVisible] = useState(false);
    const flatListRef = useRef(null);
    const scrollY = useRef(new Animated.Value(0)).current;

    const fadeAnim = useRef(new Animated.Value(1)).current;
    const heightAnim = useRef(new Animated.Value(ITEM_HEIGHT)).current;
    const translateY = useRef(new Animated.Value(0)).current; // Added for animation

    const moments = capsuleList;
    const momentListBottomSpacer = Dimensions.get("screen").height - 200;
   
    useEffect(() => {
        if (momentIdToAnimate) { 
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200, // Adjust duration as needed
                    useNativeDriver: true,
                }),
                Animated.timing(heightAnim, {
                    toValue: 0,
                    duration: 200, // Adjust duration as needed
                    useNativeDriver: true, // `useNativeDriver: false` is needed for height animations
                }),
                Animated.timing(translateY, {
                    toValue: -ITEM_HEIGHT, // Move the items upwards when a card is removed
                    duration: 200, // Adjust duration as needed
                    useNativeDriver: true,
                })
            ]).start(() => { 
                updateCacheWithNewPreAdded();
                setMomentIdToAnimate(false);
                fadeAnim.setValue(1);  // Reset fade for future use
                heightAnim.setValue(ITEM_HEIGHT); // Reset height for future use
                translateY.setValue(0); // Reset translateY for future use
            });
        }
    }, [momentIdToAnimate]);

    const scrollToRandomItem = () => {
        if (capsuleList.length === 0) return;

        const randomIndex = Math.floor(Math.random() * capsuleList.length);
        flatListRef.current?.scrollToIndex({
            index: randomIndex,
            animated: true,
        });
    };

    const saveToHello = async (moment) => { 
        try {
            updateCapsule(moment.id);
        } catch (error) {
            console.error('Error during pre-save:', error);
        };
    };

    const openMomentView = (moment) => {
        setSelectedMomentToView(moment);
        setMomentViewVisible(true);
    };

    const closeMomentView = () => {
        setMomentViewVisible(false);
    };

    const scrollToCategoryStart = (category) => {
        const categoryIndex = categoryStartIndices[category];
        console.log('hi', categoryIndex);
        if (categoryIndex !== undefined) { 
            flatListRef.current?.scrollToIndex({ index: categoryIndex > 0 ? categoryIndex : 0, animated: true });
        }
    };

    const renderCategoryButtons = () => {
        return( 
            <View style={styles.categoryContainer}>
                <FlatList
                    data={categoryNames}
                    horizontal={false}
                    keyExtractor={(categoryName) => (categoryName ? categoryName.toString() : 'Uncategorized')}
                    renderItem={({ item: categoryName }) => (
                        <TouchableOpacity style={styles.categoryButton} onPress={() => {scrollToCategoryStart(categoryName)}}>
                            <Text style={styles.categoryText}>#{categoryName}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        );
    };
    const renderMomentCard = ({ item, index }) => {
        // Calculate the offset of the current item in relation to the scroll position
        const offset = index * ITEM_HEIGHT;
    
        // Get the distance of the card's position relative to the scrollY
        const distanceFromTop = scrollY.interpolate({
            inputRange: [offset - ITEM_HEIGHT, offset, offset + ITEM_HEIGHT],
            outputRange: [0.93, .98, 0.84], // Scale down and up as the card moves in and out of the view
            extrapolate: 'clamp',
        });
    
        const opacity = item.id === momentIdToAnimate ? fadeAnim : 1;  // Fade out when it's being animated
    
        // Apply translation for all items except the one being removed
        const translate = item.id === momentIdToAnimate ? translateY : 0;
    
        return (
            <Animated.View
                style={[
                    styles.cardContainer,
                    {
                        transform: [{ scale: distanceFromTop }, { translateY: translate }],
                        opacity,  // Fading effect
                    },
                ]}
            >
                <MomentCard
                    key={item.id}
                    moment={item}
                    index={index}
                    onPress={() => openMomentView(item)}  // Open the moment view when the card is pressed
                    onSliderPull={() => saveToHello(item)}  // Save moment to Hello when slider is pulled
                />
            </Animated.View>
        );
    };
    

    return (
        <View style={styles.container}>
            {renderCategoryButtons()}
            <View style={styles.searchBarContent}>
                <TouchableOpacity style={{alignContent: 'center', marginHorizontal: '1%', alignItems: 'center', flexDirection: 'row'}} onPress={scrollToRandomItem}>
                    <SpinOutlineSvg height={34} width={34} color={themeAheadOfLoading.fontColor}/>
                    <Text style={[styles.randomButtonText, {color: themeAheadOfLoading.fontColorSecondary}]}></Text>
                </TouchableOpacity> 
                <SearchBar data={capsuleList} borderColor={'transparent'} onPress={openMomentView} searchKeys={['capsule', 'typedCategory']} />
            </View>
            <View style={styles.listContainer}>
                <Animated.FlatList
                    ref={flatListRef}
                    data={capsuleList}
                    renderItem={renderMomentCard}
                    keyExtractor={(item, index) => item.id ? item.id.toString() : `placeholder-${index}`}
                    getItemLayout={(data, index) => (
                        { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
                    )}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    ListFooterComponent={() => <View style={{ height: momentListBottomSpacer }} />}
                    onScrollToIndexFailed={(info) => {
                        flatListRef.current?.scrollToOffset({
                            offset: info.averageItemLength * info.index,
                            animated: true,
                        });
                    }}
                />
            </View>
            {isMomentViewVisible && selectedMomentToView && (
                <ItemViewMoment
                    onClose={closeMomentView}
                    moment={selectedMomentToView}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        zIndex: 1,
    },
    categoryContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        zIndex: 5,
        backgroundColor: 'darkgray',
        borderRadius: 20,
        height: 'auto',
        width: 'auto',
        padding: 10,
    },
    categoryButton: {
        borderBottomWidth: .8,
        borderBottomColor: 'darkgray',
        paddingVertical: 10,
        paddingHorizontal: 4,
    },
    categoryText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
    },
    searchBarContent: {
        width: '97%',
        marginVertical: '2%',
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: 2,
    },
    listContainer: {
        height: Dimensions.get("screen").height - 100,
        width: Dimensions.get("screen").width,
        overflow: 'visible',
    },
    cardContainer: { 
        height: 'auto',
        alignItems: 'center',
    },
});

export default MomentsList;
