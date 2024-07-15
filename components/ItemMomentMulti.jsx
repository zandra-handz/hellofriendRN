import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import Svg, { Image } from 'react-native-svg';
import { FlashList } from "@shopify/flash-list"; // Assuming this is a specific component library import
import { useCapsuleList } from '../context/CapsuleListContext';
import BubbleChatSquareSolidSvg from '../assets/svgs/bubble-chat-square-solid.svg';
import ItemViewMoment from '../components/ItemViewMoment';

const windowWidth = Dimensions.get('window').width;

const ItemMomentMulti = ({ momentData, horizontal = true, singleLineScroll = true, columns = 3, showCategoryHeader = false, width = 100, height = 100, limit, newestFirst = true, svgColor = 'white', includeCategoryTitle = false }) => {
    const { capsuleList } = useCapsuleList();
    const [selectedMoment, setSelectedMoment] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [momentText, setMomentText] = useState('');
    const [momentCategory, setMomentCategory] = useState('');

    const sortedMoments = capsuleList.sort((a, b) => newestFirst ? new Date(b.created) - new Date(a.created) : new Date(a.created) - new Date(b.created));
    const [moments, setMoments] = useState(sortedMoments.slice(0, limit));

    useEffect(() => {
        console.log('Total number of moments:', moments.length);
    }, [moments.length]);

    const openModal = (moment) => {
        console.log('Opening modal for moment:', moment);
        setSelectedMoment(moment);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        console.log('Closing modal');
        setSelectedMoment(null);
        setIsModalVisible(false);
        setIsEditing(false);
    };

    const calculateFontSize = (width) => {
        return width * 0.094;
    };

    const calculateBubbleContainerDimensions = (width, height) => {
        return {
            width: width * 1,
            height: height * 0.63,
        };
    };

    const calculateLeftPadding = (bubbleWidth) => {
        return bubbleWidth * 0.064;
    };

    const bubbleContainerDimensions = calculateBubbleContainerDimensions(width, height);

    return (
        <View style={{ minHeight: 2 }}>
            <FlashList
                data={capsuleList.slice(0, limit)}
                horizontal={horizontal && singleLineScroll}
                keyExtractor={(moment) => moment.id.toString()}
                renderItem={({ item: moment }) => (
                    <TouchableOpacity onPress={() => openModal(moment)}>
                        <View style={[styles.relativeContainer, { width, height, marginRight: 10 }]}>
                            <BubbleChatSquareSolidSvg width={width} height={height} color={svgColor} style={styles.svgImage} />
                            <View style={[styles.bubbleContainer, bubbleContainerDimensions, { paddingLeft: calculateLeftPadding(bubbleContainerDimensions.width) }]}>
                                <Text style={[styles.bubbleText, { fontSize: calculateFontSize(width), top: bubbleContainerDimensions.height * 0.2 }]}>{moment.capsule}</Text>
                                {includeCategoryTitle && (
                                    <View style={[styles.categoryCircle, { backgroundColor: 'green' }]}>
                                        <Text style={styles.categoryText}>{moment.typed_category}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                numColumns={horizontal && !singleLineScroll ? columns : 1}
                columnWrapperStyle={horizontal && !singleLineScroll ? styles.imageRow : null}
                estimatedItemSize={100}
            />

            <Modal visible={isModalVisible} onRequestClose={closeModal} transparent>
                <View style={styles.modalContainer}>
                    <ItemViewMoment moment={selectedMoment} onClose={closeModal} />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    relativeContainer: {
        position: 'relative',
    },
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
    imageContainer: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    imageRow: {
        flex: 1,
        justifyContent: 'space-between',
    },
    image: {
        margin: 5,
        borderRadius: 10,
        color: 'white',
        backgroundColor: 'white',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    categoryCircle: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default ItemMomentMulti;
