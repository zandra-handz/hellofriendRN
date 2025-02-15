
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AlertConfirm from '../components/AlertConfirm';
import AlertList from '../components/AlertList';
import RowItemFriendDelete from '../components/RowItemFriendDelete';

const RowItemFriend = ({ friend, onRemove, onUpdate }) => {
    const [isFriendDetailsModalVisible, setIsFriendDetailsModalVisible] = useState(false);

    const toggleFriendDetailsModal = () => {
        setIsFriendDetailsModalVisible(true);

    };

    const closeFriendDetailsModal = () => {
        setIsFriendDetailsModalVisible(false);

    };
    
    return (
        <View style={styles.row}>
            <Text style={styles.name}>{friend.name}</Text> 
            <TouchableOpacity onPress={toggleFriendDetailsModal}>
                <View style={styles.iconContainer}>
                    <FontAwesome5 name="ellipsis-v" size={24} />
                </View>
            </TouchableOpacity>
            <AlertList
                    fixedHeight={true}
                    height={230}
                    isModalVisible={isFriendDetailsModalVisible}
                    content={
                        <View>
                        <RowItemFriendDelete friend={friend} 
                        />
                        </View>
                    }
                    useSpinner={false}
                    toggleModal={closeFriendDetailsModal}
                    headerContent={<Text style={{fontFamily: 'Poppins-Bold', fontSize: 18}}>{friend.name}</Text>}
                    onConfirm={closeFriendDetailsModal}
                    onCancel={closeFriendDetailsModal}
                    cancelText="Go Back"
                />
        </View>

        



    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        paddingHorizontal: 20, 
        width: '100%',
        marginBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: 'gray',
        borderRadius: 20,
    },
    name: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
    },
    iconContainer: {

    },
    button: {
        color: 'blue'
    }
});

export default RowItemFriend;
