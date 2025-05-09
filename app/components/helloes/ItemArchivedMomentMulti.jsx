import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, Modal, StyleSheet} from 'react-native';
 
import BubbleChatSquareSolidSvg from '@/app/assets/svgs/bubble-chat-square-solid.svg'; 
 

const ItemArchivedMomentMulti = ({
    archivedMomentData,
    horizontal = true,
    singleLineScroll = true,
    columns = 3, 
    width = 70,
    height = 70,
    limit, 
    svgColor = 'gray',
    includeCategoryTitle = false
}) => { 
    const [selectedMoment, setSelectedMoment] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false); 

    useEffect(() => {
        console.log('Total number of moments:', archivedMomentData.length);
    }, [archivedMomentData.length]);

    const openModal = (moment) => {
        setSelectedMoment(moment);
        setIsModalVisible(true);
    };

    const closeModal = () => {
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
            <FlatList
                data={archivedMomentData.slice(0, limit)}
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
                numColumns={horizontal && !singleLineScroll ? columns : 1} // Adjust numColumns based on horizontal and singleLineScroll props
                columnWrapperStyle={horizontal && !singleLineScroll ? styles.imageRow : null}
                contentContainerStyle={styles.flatlistContentContainer}
                // Remove estimatedItemSize for better column layout
            />

            <Modal visible={isModalVisible} onRequestClose={closeModal} transparent>
                <View style={styles.modalContainer}>
                    {/* Render modal content here */}
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
        color: 'white',
        fontFamily: 'Poppins-Bold',
        textAlign: 'left',
    },
    imageRow: {
        flex: 1,
        justifyContent: 'space-between',
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

export default ItemArchivedMomentMulti;
