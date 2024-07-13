import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import Svg, { Image } from 'react-native-svg'; // Import SVG and Image components from react-native-svg
import ItemViewMoment from '../components/ItemViewMoment'; 
import BubbleChatSvg from '../assets/svgs/bubble-chat.svg'; // Import the SVG
import { useCapsuleList } from '../context/CapsuleListContext';

const windowWidth = Dimensions.get('window').width;


const ItemMomentMulti = ({ momentData, horizontal = true, singleLineScroll = true, width = 160, height = 160, limit, newestFirst = true }) => {

    const { capsuleList } = useCapsuleList();
    const [selectedMoment, setSelectedMoment] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [momentText, setMomentText] = useState('');
    const [momentCategory, setMomentCategory] = useState('');

    const sortedMoments = capsuleList.sort((a, b) => {
        return newestFirst ? new Date(b.created) - new Date(a.created) : new Date(a.created) - new Date(b.created);
    });
    const [moments, setMoments] = useState(sortedMoments.slice(0, limit)); // Initialize moments with sorted and limited momentData
    

    useEffect(() => {
        console.log('TOOOOTTTAAAAAALLLLLLLLLLLLLLLLLLLLLLL number of moments:', moments.length);
    }, [moments.length]); // Update dependency array to include moments.length

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
        return width * 0.06; // Adjust this multiplier to get the desired proportion
    };

    const calculateBubbleContainerDimensions = (width, height) => {
        return {
            width: width * 0.8, // Adjust this multiplier to get the desired width
            height: height * 0.33, // Adjust this multiplier to get the desired height
        };
    };

    const calculateLeftPadding = (bubbleWidth) => {
        return bubbleWidth * 0.35; // Adjust this multiplier to get the desired left padding
    };

    const bubbleContainerDimensions = calculateBubbleContainerDimensions(width, height);

    return (
        <View style={styles.container}>
            <FlatList
                data={capsuleList}
                horizontal={horizontal && singleLineScroll}
                keyExtractor={(moment) => moment.id.toString()}
                renderItem={({ item: moment }) => (
                    <TouchableOpacity onPress={() => openModal(moment)}>
                        <View style={[styles.relativeContainer, { width, height }]}>  
                            <BubbleChatSvg width={width} height={height} style={styles.svgImage} />
                            <View style={[styles.bubbleContainer, bubbleContainerDimensions, { paddingLeft: calculateLeftPadding(bubbleContainerDimensions.width) }]}>
                                <Text style={[styles.bubbleText, { fontSize: calculateFontSize(width), top: bubbleContainerDimensions.height * 0.7 }]}>{moment.capsule}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                numColumns={horizontal && !singleLineScroll ? 3 : 1}
                columnWrapperStyle={horizontal && !singleLineScroll ? styles.imageRow : null}
                contentContainerStyle={horizontal && !singleLineScroll ? null : styles.imageContainer}
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
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    relativeContainer: {  
        position: 'relative',
    },
    bubbleContainer: {
        position: 'absolute',  
        justifyContent: 'flex-start', // Align items to the top
        alignItems: 'flex-start', // Align items to the left
        zIndex: 1, 
    },
    bubbleText: { 
        color: 'black',
        fontFamily: 'Poppins-Bold',
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
});

export default ItemMomentMulti;
