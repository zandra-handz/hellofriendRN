import RootSiblings from "react-native-root-siblings";
import React from "react";
import ModalMessage from "./ModalMessage";

let currentModal: RootSiblings | null = null;

export const showModalMessage = ({
  title,
  body,
  confirmLabel = "Got it!",
  onConfirm,
  onClose,
  autoCloseTime,
  dismissOnBackdrop = true,
  floatingElement,
}: {
  title: string;
  body?: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  onClose?: () => void;
  autoCloseTime?: number | null;
  dismissOnBackdrop?: boolean;
  floatingElement?: React.ReactElement;
}) => {
  const destroy = () => {
    if (currentModal) {
   
      currentModal.destroy();
      currentModal = null;
    }
    if (onClose) {
      onClose();
    }
  };

  const element = (
    <ModalMessage
      title={title}
      body={body}
      confirmLabel={confirmLabel}
      onConfirm={onConfirm}
      onClose={destroy}
            autoCloseTime={autoCloseTime}
      dismissOnBackdrop={dismissOnBackdrop}
      floatingElement={floatingElement}
    />
  );

  if (currentModal) {
    currentModal.update(element);
  } else {
    currentModal = new RootSiblings(element);
  }
};

export const showModalMessageAndList = ({
  title,
  body,
  confirmLabel = "Got it!",
  onConfirm, 
  dismissOnBackdrop = true,
  floatingElement,
  listElement,
}: {
  title: string;
  body?: string;
  confirmLabel?: string;
  onConfirm?: () => void; 
  dismissOnBackdrop?: boolean;
  floatingElement?: React.ReactElement;
  listElement?: React.ReactElement;
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
      floatingElement={floatingElement}
      listElement={listElement}
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