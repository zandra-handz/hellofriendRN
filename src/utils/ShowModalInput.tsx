import RootSiblings from "react-native-root-siblings";
import React from "react";
import ModalInput from "./ModalInput";

let currentModal: RootSiblings | null = null;

export const showModalInput = ({
  title,
  body,
  placeholder,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  initialValue = "",
  onConfirm,
  onCancel,
  validate,
  dismissOnBackdrop = false,
  keyboardType,
}: {
  title: string;
  body?: string;
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  initialValue?: string;
  onConfirm?: (value: string) => void;
  onCancel?: () => void;
  validate?: (value: string) => string | null;
  dismissOnBackdrop?: boolean;
    keyboardType?: React.ComponentProps<typeof ModalInput>["keyboardType"];
    // "default"
    // "number-pad"          digits only, no decimal
    // "decimal-pad"         digits + decimal point
    // "numeric"             digits + decimal + minus
    // "email-address"       shows @ and . prominently
    // "phone-pad"           phone dialpad layout
    // "url"                 shows . / prominently
    // --- iOS only ---
    // "ascii-capable"
    // "numbers-and-punctuation"
    // "name-phone-pad"
    // "twitter"             shows @ and # prominently
    // "web-search"          shows . and space prominently
    // "visible-password"
}) => {
  const destroy = () => {
    if (currentModal) {
      currentModal.destroy();
      currentModal = null;
    }
  };

  const element = (
    <ModalInput
      title={title}
      body={body}
      placeholder={placeholder}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      initialValue={initialValue}
      onConfirm={onConfirm}
      onCancel={onCancel}
      onClose={destroy}
      validate={validate}
      dismissOnBackdrop={dismissOnBackdrop}
      keyboardType={keyboardType}
    />
  );

  if (currentModal) {
    currentModal.update(element);
  } else {
    currentModal = new RootSiblings(element);
  }
};

export const dismissModalInput = () => {
  if (currentModal) {
    currentModal.destroy();
    currentModal = null;
  }
};