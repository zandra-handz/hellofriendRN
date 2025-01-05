import React, { useState } from 'react';
import FormFriendColorThemeUpdate from '../forms/FormFriendColorThemeUpdate';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import ArtistColorPaletteSvg from '../assets/svgs/artist-color-palette.svg';
import AlertFormSubmit from '../components/AlertFormSubmit';

const ModalFormColorTheme = ({
    isVisible, 
    formRef,
    close,
}) => {
    const { themeStyles } = useGlobalStyle();
    const [isMakingCall, setIsMakingCall] = useState(false);

    const MODAL_BODY_HEIGHT = 610;

    return (
        <AlertFormSubmit
            isModalVisible={isVisible} 
            isMakingCall={isMakingCall}
            headerContent={<ArtistColorPaletteSvg width={38} height={38} color={themeStyles.modalIconColor.color} />}
            
            questionText="Update color theme"
            formBody={
                <FormFriendColorThemeUpdate
                    ref={formRef}
                    onMakingCallChange={(isMakingCall) => {
                        setIsMakingCall(isMakingCall); 
                        console.log("Is making callaaa:", isMakingCall); 
                    }}
                />
            }
            formHeight={MODAL_BODY_HEIGHT}
            onConfirm={async () => {
                if (formRef.current) {
                    setIsMakingCall(true);
                    await formRef.current.submit();
                    setIsMakingCall(false);
                    close(); // Close after submission completes
                }
            }}
            onCancel={() => {
                if (!isMakingCall) {
                    close();
                }
            }}
            confirmText="Save colors"
            cancelText="Cancel"
        />
    );
};

export default ModalFormColorTheme;
