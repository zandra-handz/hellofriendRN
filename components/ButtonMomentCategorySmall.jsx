import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelectedFriend } from '../context/SelectedFriendContext';
import ButtonBottomActionBase from '../components/ButtonBottomActionBase';
import ThoughtBubbleOutlineSvg from '../assets/svgs/thought-bubble-outline.svg'; // Import the SVG

const ButtonMomentCategorySmall = ({ onPress, categoryText, momentCount, highlighted }) => {
    const { calculatedThemeColors } = useSelectedFriend();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const closeModal = () => setIsModalVisible(false);

    return (
        <View style={[
            styles.container, 
            { 
                borderWidth: highlighted ? 2 : 1, // Border width when highlighted or not
                borderColor: highlighted ? 'blue' : 'transparent', // Highlighted color or transparent
            }
        ]}> 
            <View style={styles.buttonContainer}> 
                <ButtonBottomActionBase
                    onPress={onPress}
                    preLabel={momentCount}
                    preLabelFontSize={18} 
                    preLabelColor='white'  
                    label={categoryText}
                    height={36}
                    radius={20}
                    fontMargin={3} 
                    labelFontSize={12}  
                    labelContainerMarginHorizontal={6} 
                    showGradient={true}
                    lightColor={calculatedThemeColors.lightColor}
                    darkColor={calculatedThemeColors.darkColor}
                    showShape={true} 
                    shapePosition="right"
                    shapeSource={ThoughtBubbleOutlineSvg} 
                    shapeWidth={40}
                    shapeHeight={40}
                    shapePositionValue={-4}
                    shapePositionValueVertical={-9}
                    shapeLabel={momentCount}
                    shapeLabelColor='white'
                    shapeLabelFontSize={16}
                    shapeLabelPositionRight='96%'  
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        marginRight: 8,
        borderRadius: 20, // Match the radius of the button
    },
    buttonContainer: {
        height: 36,
        alignItems: 'center',
        width: 100, 
    },
});

export default ButtonMomentCategorySmall;
