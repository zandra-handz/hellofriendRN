import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { useImageList } from '../context/ImageListContext';


import ItemMomentMulti from '../components/ItemMomentMulti';
import ItemImageMulti from '../components/ItemImageMulti';

const ActionFriendPageAllImages = ({ isModalVisible, toggleModal, onClose }) => {
    const { imageList } = useImageList();
    const [isImageListReady, setIsImageListReady] = useState(false);

    useEffect(() => {
        if (imageList.length > 0) {
            setIsImageListReady(true);
        }
    }, [imageList]);

    return (
        <Modal visible={isModalVisible} onRequestClose={toggleModal} transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity> 
                    <ScrollView>
                        {isImageListReady ? (
                            <>  
                            <ItemImageMulti height={120} width={120} singleLineScroll={false} />
                            </>
                           
                        ) : (
                            <Text>Loading...</Text>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '100%',
        backgroundColor: 'black',
        justifyContent: 'space-around',
        alignContent: 'center',
        borderRadius: 0,
        padding: 4,
        paddingTop:50,
        height: '100%',
        maxHeight: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    closeText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    item: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default ActionFriendPageAllImages;
