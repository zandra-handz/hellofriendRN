// ShowLocalSpinner.ts
import RootSiblings from "react-native-root-siblings";
import React from "react";
import LocalSolidSpinner from "@/app/components/appwide/spinner/LocalSolidSpinner";

let spinnerSibling: RootSiblings | null = null;
let refCount = 0;

// export const showSpinner = (backgroundColor: string) => {
//   refCount++;
//   if (spinnerSibling) {
//     spinnerSibling.update(<LocalSolidSpinner loading={true} backgroundColor={backgroundColor} />);
//   } else {
//     spinnerSibling = new RootSiblings(<LocalSolidSpinner loading={true} backgroundColor={backgroundColor} />);
//   }
// };

// export const hideSpinner = () => {
//   refCount = Math.max(0, refCount - 1);
//   if (refCount === 0 && spinnerSibling) {
//     spinnerSibling.destroy();
//     spinnerSibling = null;
//   }
// };

export const showSpinner = (backgroundColor: string) => {
  if (spinnerSibling) {
    spinnerSibling.update(<LocalSolidSpinner loading={true} backgroundColor={backgroundColor} />);
    return;
  }
  spinnerSibling = new RootSiblings(<LocalSolidSpinner loading={true} backgroundColor={backgroundColor} />);
};

export const hideSpinner = () => {
  if (spinnerSibling) {
    spinnerSibling.destroy();
    spinnerSibling = null;
  }
};