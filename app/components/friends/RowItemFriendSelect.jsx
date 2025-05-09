
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ProfileCircleSvg from '@/app/assets/svgs/ProfileCircleSvg'; // Import ProfileCircleSvg
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
import AlertList from '../components/AlertList';
import RowItemFriendDelete from '../components/RowItemFriendDelete';
import { useSelectedFriend } from '@/src/context/SelectedFriendContext';

const RowItemFriendSelect = ({ friend }) => {
    const { selectedFriend } = useSelectedFriend();
    const { themeStyles } = useGlobalStyle();  
    const [isFriendDetailsModalVisible, setIsFriendDetailsModalVisible] = useState(false);
    const [ rowColor, setRowColor ] = useState(friend.darkColor || 'gray');
    const [ lightColor, setLightColor ] = useState(friend.lightColor || 'gray');
    const [ darkColor, setDarkColor ] = useState(friend.darkColor || 'gray');

    const toggleFriendDetailsModal = () => {
        setIsFriendDetailsModalVisible(true);

    };

    useEffect(() => {
        if (selectedFriend) {
            console.log(friend.darkColor);
            if (friend.id === selectedFriend.id) {
                setRowColor('limegreen');
            } else {
                setRowColor('transparent');
            }
        };

    }, [selectedFriend]);

    //to restore gradient: [1] - [0]
  const renderProfileIcon = () => { 
        return (
          <View style={{ flexDirection: 'row' }}>
            
            <ProfileCircleSvg width={32} height={32} startColor={darkColor || 'black'} endColor={lightColor || 'black'} />
             
          </View>
        ); 
  };



    const closeFriendDetailsModal = () => {
        setIsFriendDetailsModalVisible(false);

    };
    
    return (
        <View style={[styles.row, {backgroundColor: rowColor}]}>
            <Text style={[styles.name, themeStyles.genericText]}>{friend.name}</Text> 
            <TouchableOpacity onPress={toggleFriendDetailsModal}>
                <View style={styles.iconContainer}> 
                    {renderProfileIcon()}
                
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

export default RowItemFriendSelect;
