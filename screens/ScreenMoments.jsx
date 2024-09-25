import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useCapsuleList } from '../context/CapsuleListContext';
import ItemMomentMultiPlain from '../components/ItemMomentMultiPlain';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import ButtonGoToAddMoment from '../components/ButtonGoToAddMoment';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useSelectedFriend } from '../context/SelectedFriendContext';

const ScreenMoments = ({ route, navigation }) => {
    const { themeStyles, gradientColors } = useGlobalStyle(); 
    const { calculatedThemeColors } = useSelectedFriend();
    const { capsuleList } = useCapsuleList();
    const [isCapsuleListReady, setIsCapsuleListReady] = useState(false);
    const [triggerUpdate, setTriggerUpdate] = useState(false);
    const [checkboxesParent, setCheckboxesParent] = useState(false);
    const [changes, setChanges] = useState(false);
    const [trigger, setTrigger] = useState(1);

    const toggleCheckboxesParent = () => {
        console.log('Checkbox toggle tracker in parent: ', checkboxesParent);
        setCheckboxesParent(!checkboxesParent);
    };

    const setChangesToTrue = (hasChanges) => {
        setChanges(hasChanges); // Update changes state directly
    };

    useEffect(() => {
        console.log('changes from child successfully updated!');
        console.log(changes);
    }, [changes]);

    const handleChangeDetection = (hasChanges) => {
        console.log('Changes detected in child:', hasChanges);
        setChangesToTrue(hasChanges); // Update the changes state
    };



    useEffect(() => {
        console.log('trigger: ', trigger);
    }, [trigger]);

    useEffect(() => {
        if (capsuleList.length > 0) {
            setIsCapsuleListReady(true);
        }
    }, [capsuleList]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            // Call the checkForChangesTrigger here
            setTrigger(prev => prev+1); // Trigger the check for changes

            // Check for changes before navigating away
            if (checkboxesParent && changes) {
                e.preventDefault();

                Alert.alert(
                    '',
                    'Do you want to save your changes before leaving?',
                    [
                        { 
                            text: 'Yes', 
                            style: 'destructive',
                            onPress: () => {
                                setTriggerUpdate(prev => !prev); // Trigger the save function
                                navigation.dispatch(e.data.action); // Navigate away
                            }
                        },
                        { 
                            text: 'No', 
                            style: 'default',
                            onPress: () => navigation.dispatch(e.data.action) // Navigate away without saving
                        }
                    ]
                );
            }
        });

        return unsubscribe; // Cleanup the event listener on unmount
    }, [navigation, checkboxesParent, changes]);

    return ( 
        <LinearGradient
            colors={[calculatedThemeColors.darkColor, calculatedThemeColors.lightColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.container, themeStyles.signinContainer]}
        >
            <View style={{ flex: 1, width: '100%' }}>
                {isCapsuleListReady ? (
                    <>  
                        <ItemMomentMultiPlain 
                            triggerUpdate={triggerUpdate} 
                            parentCheckboxesTracker={toggleCheckboxesParent} 
                            parentChangesTracker={handleChangeDetection} // Callback function to handle changes
                            trigger={trigger} // Pass the trigger variable
                            navigation={navigation}
                        />
                        <ButtonGoToAddMoment buttonColor={calculatedThemeColors.darkColor} />
                    </>
                ) : (
                    <Text></Text>
                )}
            </View> 
        </LinearGradient> 
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1,  
        padding: 0,
        justifyContent: 'space-between',
    },
});

export default ScreenMoments;
