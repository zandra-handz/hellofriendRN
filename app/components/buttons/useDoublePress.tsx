// import { View, Text } from "react-native";
// import React, { useRef, useState } from "react";

// type Props = { onSinglePress: () => void; onDoublePress: () => void };

// const useDoublePress = ({ onSinglePress, onDoublePress }: Props) => {
//   const [lastPress, setLastPress] = useState<number | null>(null);
//   const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const DOUBLE_PRESS_DELAY = 120;

//   const handleDoublePress = () => {
//     const now = Date.now();

//     if (lastPress && now - lastPress < DOUBLE_PRESS_DELAY) {
//       // Double press detected
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//         timeoutRef.current = null;
//       }
//       console.log("double press here!");
//       onDoublePress();

//       setLastPress(null);
//     } else { 
//       setLastPress(now);

//       timeoutRef.current = setTimeout(() => {
//        onSinglePress();
//         setLastPress(null);
//         timeoutRef.current = null;
//       }, DOUBLE_PRESS_DELAY);
//     }
//   };

//   return {
//     handleDoublePress
//   }
// };

// export default useDoublePress;



import { useRef } from "react";

type Props = { onSinglePress: () => void; onDoublePress: () => void };

const useDoublePress = ({ onSinglePress, onDoublePress }: Props) => {
  const lastPress = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const DOUBLE_PRESS_DELAY = 220;

  const handleDoublePress = () => {
    const now = Date.now();

    if (lastPress.current && now - lastPress.current < DOUBLE_PRESS_DELAY) {
      clearTimeout(timeoutRef.current!);
      timeoutRef.current = null;
      lastPress.current = null;
      onDoublePress();
    } else {
      lastPress.current = now;
      timeoutRef.current = setTimeout(() => {
        onSinglePress();
        lastPress.current = null;
        timeoutRef.current = null;
      }, DOUBLE_PRESS_DELAY);
    }
  };

  return { handleDoublePress };
};

export default useDoublePress;