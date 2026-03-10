 
import RootSiblings from "react-native-root-siblings";
import React, { useRef } from "react";
import LocalSolidSpinner, { SpinnerHandle } from "@/app/components/appwide/spinner/LocalSolidSpinner";

let spinnerSibling: RootSiblings | null = null;
let spinnerRef: React.RefObject<SpinnerHandle> | null = null;

const ensureSpinner = () => {
  if (!spinnerSibling) {
    spinnerRef = React.createRef<SpinnerHandle>();
    spinnerSibling = new RootSiblings(
      <LocalSolidSpinner ref={spinnerRef} />
    );
  }
};

export const showSpinner = (backgroundColor: string) => {
  ensureSpinner();
  spinnerRef?.current?.show(backgroundColor);
};

export const hideSpinner = () => {
  spinnerRef?.current?.hide();
};

// Optional: fully destroy after a delay if you want cleanup
export const destroySpinner = () => {
  if (spinnerSibling) {
    spinnerSibling.destroy();
    spinnerSibling = null;
    spinnerRef = null;
  }
};