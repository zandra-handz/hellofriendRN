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
                    duration: 100, // Adjust duration as needed
                    useNativeDriver: true,
                }),
                Animated.timing(heightAnim, {
                    toValue: 0,
                    duration: 100, // Adjust duration as needed
                    useNativeDriver: true, // `useNativeDriver: false` is needed for height animations
                }),
                Animated.timing(translateY, {
                    toValue: -ITEM_HEIGHT, // Move the items upwards when a card is removed
                    duration: 100, // Adjust duration as needed
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
        const inputRange = [
            (index - 1) * ITEM_HEIGHT, // Start scaling slightly earlier
            index * ITEM_HEIGHT + ITEM_HEIGHT / 3, // Finish scaling earlier
        ];

        const scale = scrollY.interpolate({
            inputRange,
            outputRange: [0.8, 1.0], 
            extrapolate: 'clamp',
        });

        const opacity = item.id === momentIdToAnimate ? fadeAnim : 1;

        // Apply translation (move upward) for all items except the one being removed
        const translate = item.id === momentIdToAnimate ? translateY : 0;

        return (
            <Animated.View style={[styles.cardContainer, { transform: [{ scale }, { translateY: translate }], opacity }]}>
                <MomentCard
                    key={item.id}
                    moment={item}
                    index={index} 
                    onPress={() => openMomentView(item)}
                    onSliderPull={() => saveToHello(item)}
                />
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            {renderCategoryButtons()}
            <View style={styles.searchBarContent}>
                <TouchableOpacity style={{alignContent: 'center', marginHorizontal: '1%', alignItems: 'center', flexDirection: 'row'}} onPress={scrollToRandomItem}>
                    <SpinOutlineSvg height={26} width={26} color={themeAheadOfLoading.fontColorSecondary}/>
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
        marginVertical: '1%',
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
        marginVertical: 0,
        height: 'auto',
        alignItems: 'center',
    },
});

export default MomentsList;
