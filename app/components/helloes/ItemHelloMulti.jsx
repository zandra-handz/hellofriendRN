import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

import ItemViewHello from '../components/ItemViewHello';  
import CoffeeCupPaperSolid from '@/app/assets/svgs/coffee-cup-paper-solid';
 
import IconDynamicHelloType from '../components/IconDynamicHelloType';

 
const ItemHelloMulti = ({ helloData, horizontal = true, singleLineScroll = true, width = 160, height = 160, limit, newestFirst = true }) => {
    
    const sortedHelloes = [...helloData].sort((a, b) => {
        return newestFirst ? new Date(b.created) - new Date(a.created) : new Date(a.created) - new Date(b.created);
    });
    const [helloes, setHelloes] = useState(sortedHelloes.slice(0, limit)); // Initialize moments with sorted and limited momentData

    const [selectedHello, setSelectedHello] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);


    useEffect(() => {
        console.log('HELLO COUNT:', helloes.length);
    }, [helloes.length]); // Update dependency array to include moments.length

    const openModal = (hello) => {
        console.log('Opening modal for hello:', hello);
        setSelectedHello(hello);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        console.log('Closing modal');
        setSelectedHello(null);
        setIsModalVisible(false);
        setIsEditing(false);
    };

    const calculateFontSize = (width) => {
        return width * 0.07;  
    };

    const calculateBubbleContainerDimensions = (width, height) => {
        return {
            width: width * 0.8,  
            height: height * 0.33,  
        };
    };

    const calculateLeftPadding = (bubbleWidth) => {
        return bubbleWidth * 0.3; 
    };

    const bubbleContainerDimensions = calculateBubbleContainerDimensions(width, height);

    return (
        <View style={styles.container}>
            <FlatList
                data={helloes}
                horizontal={horizontal && singleLineScroll}
                keyExtractor={(hello) => hello.id.toString()}
                renderItem={({ item: hello }) => (
                    <TouchableOpacity onPress={() => openModal(hello)}>
                        <View style={[styles.relativeContainer, { width, height }]}>  
                            <CoffeeCupPaperSolid width={width} height={height} color={"white"} style={styles.svgImage} />
                            <View style={[styles.bubbleContainer, bubbleContainerDimensions, { paddingLeft: calculateLeftPadding(bubbleContainerDimensions.width) }]}>
                                <Text style={[styles.bubbleText, { fontSize: calculateFontSize(width), top: bubbleContainerDimensions.height * 0.7 }]}>{hello.type}</Text>
                                <IconDynamicHelloType selectedChoice={hello.type}/>
                            
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
                    <ItemViewHello hello={selectedHello} onClose={closeModal} />
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
        justifyContent: 'flex-start',  
        alignItems: 'flex-start',  
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

export default ItemHelloMulti;
