// import RootSiblings from "react-native-root-siblings";
// import React from "react";
// import HelperMessage from "@/app/components/alerts/HelperMessage";
// import QuickView from "@/app/components/alerts/QuickView";
// let currentSibling: RootSiblings | null = null;

// type Props = {
//   topBarText?: string; 
//   message: string;
//   view?: React.ReactElement;
//   update: boolean;
//   duration: number;
// };

// export const ShowTextInputView = ({
//   topBarText=`Helper mode`,
 
//   message,
//   view,
//   update=false,
//   duration=2000,
// }: Props) => {
//   const triggerKey = Date.now();

//   if (currentSibling) {
//     console.log("current sibling detected!");
//     // Instead of destroying and recreating, just update the existing sibling
//     currentSibling.update(
//       <QuickView
   
//         topBarText={topBarText}
//         message={message}
//         view={view}
//         update={update}
//         duration={duration}
//         onClose={() => {
//           if (currentSibling) {
//             currentSibling.destroy();
//             currentSibling = null;
//           }
//         }}
//       />
//     );
//   } else {
//     currentSibling = new RootSiblings(
//       (
//         <QuickView
//          topBarText={topBarText}
//          view={view}
//           message={message}
//           update={update}
//           duration={duration}
//           onClose={() => {
//             if (currentSibling) {
//               currentSibling.destroy();
//               currentSibling = null;
//             }
//           }}
//         />
//       )
//     );
//   }
// };
