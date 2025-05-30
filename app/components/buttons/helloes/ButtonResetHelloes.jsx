import React, { useState, useEffect } from "react";

import { useUpcomingHelloes } from "@/src/context/UpcomingHelloesContext";
import { useUser } from "@/src/context/UserContext";
import ButtonToggleSize from "../scaffolding/ButtonToggleSize"; // Adjust the path as needed
import AlertConfirm from "../../alerts/AlertConfirm";
import AlertSuccessFail from "../../alerts/AlertSuccessFail"; 
import ByeSvg from "@/app/assets/svgs/bye.svg";
 
const ButtonResetHelloes = ({ title, onPress, confirmationAlert = true }) => {
  const {  handleRemixAllNextHelloes, remixAllNextHelloesMutation } = useUpcomingHelloes(); // MOVE TO CONTEXT
  const [isModalVisible, setModalVisible] = useState(false);
 
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [isFailModalVisible, setFailModalVisible] = useState(false);
 

  const { user } = useUser();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const confirmResetHelloes = async (userId) => {
    console.log('resetting helloes');
    if (!userId) {
      
      return;
    }

    await handleRemixAllNextHelloes(userId);

  };

 

  const successOk = () => {  
    setSuccessModalVisible(false);
    toggleModal();
  };

  const failOk = () => {
    setFailModalVisible(false);
  };


  useEffect(() => {
    if (remixAllNextHelloesMutation.isSuccess) {
      console.log('success!');
     // toggleModal();
      
      setSuccessModalVisible(true);
     // toggleModal();
      // showMessage(true, null, `All friend dates reset!`);
    } else if (remixAllNextHelloesMutation.isError) {
      console.log('error');
      setFailModalVisible(true);
    }

  }, [remixAllNextHelloesMutation]);
  return (
    <>
      <ButtonToggleSize
        title={title}
        onPress={toggleModal}
        iconName="refresh"
        style={{
          backgroundColor: "#e63946",
          width: 70,
          height: 35,
          borderRadius: 20,
        }}
      />
      {confirmationAlert && (
        <AlertConfirm
          fixedHeight={true}
          height={330}
          isModalVisible={isModalVisible}
          isFetching={remixAllNextHelloesMutation.isPending}
          useSpinner={true}
          toggleModal={toggleModal}
          headerContent={<ByeSvg width={36} height={36} />}
          questionText="Reset all hello dates? (This can't be reversed!)"
          onConfirm={() => confirmResetHelloes(user.id)}
          onCancel={toggleModal}
          confirmText="Reset All"
          cancelText="Nevermind"
        />
      )}
      <AlertSuccessFail
        isVisible={isSuccessModalVisible}
        message="Helloes reset!"
        onClose={successOk}
        type="success"
      />

      <AlertSuccessFail
        isVisible={isFailModalVisible}
        message="Could not reset :("
        onClose={failOk}
        tryAgain={false}
        onRetry={confirmResetHelloes}
        isFetching={remixAllNextHelloesMutation.isPending}
        type="failure"
      />
    </>
  );
};

export default ButtonResetHelloes;
