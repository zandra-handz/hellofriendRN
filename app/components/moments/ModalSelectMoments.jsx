import React  from 'react'; 
import ThoughtBubbleOutlineSvg from '@/app/assets/svgs/thought-bubble-outline.svg'; // Import the SVG

import { useGlobalStyle } from '@/src/context/GlobalStyleContext';

import AlertFormNoSubmit from '../alerts/AlertFormNoSubmit';

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
