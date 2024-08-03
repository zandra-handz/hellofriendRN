
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AlertConfirm from '../components/AlertConfirm'; 
import AlertSuccessFail from '../components/AlertSuccessFail';
import { useAuthUser } from '../context/AuthUserContext';
import { useFriendList } from '../context/FriendListContext';
import { useUpcomingHelloes } from '../context/UpcomingHelloesContext';
import { deleteFriend } from '../api';


const RowItemFriendDelete = ({ friend, onRemove, onUpdate }) => {
    const { authUserState } = useAuthUser();
    const { friendList, setFriendList, removeFromFriendList } = useFriendList();
    // maybe we could check to see if it's necessary to refresh or not first
    const { setUpdateTrigger } = useUpcomingHelloes();
    const [isFriendDeleteModalVisible, setIsFriendDeleteModalVisible] = useState(false);    
    const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
    const [isFailModalVisible, setFailModalVisible] = useState(false);
    
    const [isDeleting, setIsDeleting] = useState(false);


    const toggleModal = () => {
        setIsFriendDeleteModalVisible(!isFriendDeleteModalVisible);
    };


    const successOk = () => {
        removeFromFriendList(friend.id);
        console.log(`${friend.name} removed from friend list.`);
        setUpdateTrigger(prev => !prev); 
        setSuccessModalVisible(false);
    };

    const failOk = () => { 
        setFailModalVisible(false);
    };

    const confirmDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteFriend(friend.id);
            setIsDeleting(false);
            console.log(`${friend.name} has been deleted.`);
            
            setSuccessModalVisible(true);  
        } catch (error){
            setIsDeleting(false);
            setFailModalVisible(true);
            console.error('Error deleting friend:', error);
        } finally {
            setIsFriendDeleteModalVisible(false);
        }

    };
    
    return (
        <>
        <View style={styles.row}>
            <Text style={styles.name}>Delete friend {friend.id}</Text> 
            <TouchableOpacity onPress={toggleModal}>
                <View style={styles.iconContainer}>
                    <FontAwesome5 name="trash" size={20} />
                </View>
            </TouchableOpacity>
            <AlertConfirm
                    fixedHeight={true}
                    height={330}
                    isModalVisible={isFriendDeleteModalVisible}
                    questionText="Delete friend? (This can't be reversed!)"
                    isFetching={isDeleting}
                    useSpinner={true}
                    toggleModal={toggleModal}
                    headerContent={<Text style={{fontFamily: 'Poppins-Bold', fontSize: 18}}>{friend.name}</Text>}
                    onConfirm={() => confirmDelete()} 
                    onCancel={toggleModal}
                    confirmText="Delete"
                    cancelText="Cancel"
                />

        </View>
        

        <AlertSuccessFail
            isVisible={isSuccessModalVisible}
            message='Friend has been deleted.'
            onClose={successOk}
            type='success'
        />

        <AlertSuccessFail
            isVisible={isFailModalVisible}
            message='Error deleting friend.'
            onClose={failOk}
            tryAgain={false} 
            isFetching={isDeleting}
            type='failure'
        />
    </>



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
        borderBottomColor: 'transparent',
        backgroundColor: 'transparent',
        borderRadius: 20,
    },
    name: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
    },
    iconContainer: {

    },
    button: { 
    }
});

export default RowItemFriendDelete;
