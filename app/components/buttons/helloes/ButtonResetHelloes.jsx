import React, { useState } from "react";

import { useUpcomingHelloes } from "@/src/context/UpcomingHelloesContext";
import { useUser } from "@/src/context/UserContext";
import ButtonToggleSize from "../scaffolding/ButtonToggleSize"; // Adjust the path as needed
import AlertConfirm from "../../alerts/AlertConfirm";
import AlertSuccessFail from "../../alerts/AlertSuccessFail";

import ByeSvg from "@/app/assets/svgs/bye.svg";
import { remixAllNextHelloes } from "@/src/calls/api"; // Ensure correct import

const ButtonResetHelloes = ({ title, onPress, confirmationAlert = true }) => {
  const { setUpdateTrigger } = useUpcomingHelloes(); // Removed unused variables
  const [isModalVisible, setModalVisible] = useState(false);

  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [isFailModalVisible, setFailModalVisible] = useState(false);

  const [isAttemptingToRemix, setIsAttemptingToRemix] = useState(false);

  const { user } = useUser();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const confirmResetHelloes = async () => {
    // Add 'async' keyword here
    try {
      setIsAttemptingToRemix(true);
      await remixAllNextHelloes(user.id);
      setIsAttemptingToRemix(false);
      setSuccessModalVisible(true);
    } catch (error) {
      setIsAttemptingToRemix(false);
      setFailModalVisible(true);
      console.error("Error resetting hello dates:", error);
    } finally {
      setModalVisible(false);
    }
  };

  const successOk = () => {
    setUpdateTrigger((prev) => !prev);
    setSuccessModalVisible(false);
  };

  const failOk = () => {
    setFailModalVisible(false);
  };

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
          isFetching={isAttemptingToRemix}
          useSpinner={true}
          toggleModal={toggleModal}
          headerContent={<ByeSvg width={36} height={36} />}
          questionText="Reset all hello dates? (This can't be reversed!)"
          onConfirm={confirmResetHelloes}
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
        isFetching={isAttemptingToRemix}
        type="failure"
      />
    </>
  );
};

export default ButtonResetHelloes;
