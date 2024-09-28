import React, { useState, useRef } from 'react';
import { useGlobalStyle } from '../context/GlobalStyleContext'; 
import ShopAddOutlineSvg from '../assets/svgs/shop-add-outline.svg';
import AlertFormSubmit from '../components/AlertFormSubmit';
import FormLocationQuickCreate from '../forms/FormLocationQuickCreate'; // Import the location creation form component

const ModalAddNewLocation = ({
    isVisible, 
    friends, 
    title, 
    address,
    close,
}) => {
    const { themeStyles } = useGlobalStyle();
    const [isMakingCall, setIsMakingCall] = useState(false);
    const formRef = useRef(null); // Create a ref for the form

    const handleMakingCallChange = (makingCall) => {
         
        console.log('isMakingCall in parent:', makingCall);
        setIsMakingCall(makingCall);  
    };

    return (
        <AlertFormSubmit
            isModalVisible={isVisible} 
            isMakingCall={isMakingCall}
            headerContent={<ShopAddOutlineSvg width={38} height={38} color={themeStyles.modalIconColor.color} />}
            questionText="Save location"
            formBody={
                <FormLocationQuickCreate
                    ref={formRef}  // Pass the ref to the child form
                    friends={friends}
                    title={title}
                    address={address}
                    onMakingCallChange={handleMakingCallChange}
                />
            }
            formHeight={610}
            onConfirm={async () => {
                if (formRef.current) {
                    setIsMakingCall(true);
                    await formRef.current.submit(); // Call the submit function via the ref
                    setIsMakingCall(false);
                    close(); // Close after submission completes
                }
            }}
            onCancel={() => {
                if (!isMakingCall) {
                    close();
                }
            }}
            confirmText="Save location"
            cancelText="Cancel"
        />
    );
};

export default ModalAddNewLocation;
