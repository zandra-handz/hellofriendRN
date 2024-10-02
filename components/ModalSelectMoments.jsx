import React, { useState } from 'react'; 
import ThoughtBubbleOutlineSvg from '../assets/svgs/thought-bubble-outline.svg'; // Import the SVG

import { useGlobalStyle } from '../context/GlobalStyleContext';

import AlertFormNoSubmit from '../components/AlertFormNoSubmit';

const ModalSelectMoments = ({
    isVisible, 
    formBody,
    close,
}) => {
    const { themeStyles } = useGlobalStyle();
 
    return (
        <AlertFormNoSubmit
            isModalVisible={isVisible}  
            headerContent={<ThoughtBubbleOutlineSvg width={38} height={38} color={themeStyles.modalIconColor.color} />}
            questionText="Add shared moments"
            formBody={  formBody
            }
            formHeight={610} 
            onCancel={() => { 
                    close(); 
            }} 
            cancelText="Done"
        />
    );
};

export default ModalSelectMoments;
