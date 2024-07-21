import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useLocationList } from '../context/LocationListContext';
import AlertSmall from '../components/AlertSmall';
import InputAddLocationQuickSave from '../components/InputAddLocationQuickSave';
import MenuLocationOptions from '../components/MenuLocationOptions';

const ButtonSaveLocation = ({ location, saveable=true, size = 11, iconSize = 16, family = 'Poppins-Bold', color="black", style }) => {
    const { locationList, selectedLocation } = useLocationList();
    const [isTemp, setIsTemp ] = useState(saveable);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isMenuVisible, setMenuVisible] = useState(false);

    const handlePress = () => {
        setIsTemp(false);
        setModalVisible(true);
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const toggleMenu = () => {
        setMenuVisible(!isMenuVisible);
    };

    const closeModal = () => {
        setModalVisible(false);
        setMenuVisible(false);
    };

    const handleEdit = () => {
        // Handle edit location
    };

    const handleDelete = () => {
        // Handle delete location
    };

    const handleHelp = () => {
        // Handle help
    };

    return (
        <View>
            {isTemp && (
                <TouchableOpacity onPress={handlePress} style={[styles.container, style]}> 
                    <FontAwesome5 name="save" size={iconSize} /> 
                    <Text style={[styles.saveText, { fontSize: size, color: color, fontFamily: family }]}> SAVE</Text>
                </TouchableOpacity>
            )}

            {!isTemp && (
                <View style={styles.container}>
                    <FontAwesome5 name="ellipsis-v" size={iconSize} onPress={toggleMenu} />
                    <FontAwesome5 name="bookmark" size={iconSize} />
                </View>
            )}

            {/* Menu Modal */}
            <Modal
                visible={isMenuVisible}
                transparent
                animationType="slide"
                onRequestClose={toggleMenu}
            >
                <View style={styles.modalBackground}>
                    <MenuLocationOptions
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onHelp={handleHelp}
                        closeMenu={toggleMenu} // Pass the function to close the menu
                    />
                </View>
            </Modal>

            {/* Alert Modal */}
            <AlertSmall
                isModalVisible={isModalVisible}
                toggleModal={closeModal}
                modalContent={
                    <InputAddLocationQuickSave
                        onClose={closeModal}
                        title={selectedLocation.title}
                        address={selectedLocation.address}
                    />
                }
                modalTitle={'Save Location'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 0,
    }, 
    saveText: {
        marginLeft: 8, 
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    },
});

export default ButtonSaveLocation;
