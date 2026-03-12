import RootSiblings from "react-native-root-siblings";
import React from "react"; 
import ModalMessage from "./ModalMessage";

let currentModal: RootSiblings | null = null;

export const showModalMessage = ({
  title,
  body,
  confirmLabel = "Got it!",
  onConfirm,
  dismissOnBackdrop = true,
}: {
  title: string;
  body?: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  dismissOnBackdrop?: boolean;
}) => {
  const destroy = () => {
    if (currentModal) {
      currentModal.destroy();
      currentModal = null;
    }
  };

  const element = (
    <ModalMessage
      title={title}
      body={body}
      confirmLabel={confirmLabel}
      onConfirm={onConfirm}
      onClose={destroy}
      dismissOnBackdrop={dismissOnBackdrop}
    />
  );

  if (currentModal) {
    currentModal.update(element);
  } else {
    currentModal = new RootSiblings(element);
  }
};

export const dismissModalMessage = () => {
  if (currentModal) {
    currentModal.destroy();
    currentModal = null;
  }
};