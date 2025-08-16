// import { Canvas, Path } from "@shopify/react-native-skia";

// const accountPath = "M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" 

// export default function LeafPath({ count, x, y, size, color }) {
//   return (
//     // <Canvas style={{ flex: 1 }}>
//       <Path
//         path={accountPath}
//         color={'red'}
//         style="fill"
//         transform={[
//           { translateX: x },
//           { translateY: y },
//           { scale: size / 24 } // 24 is the default icon viewbox size
//         ]}
//       />
//     // </Canvas>
//   );
// }

import React from "react";
import { Canvas, Group, Path } from "@shopify/react-native-skia";
import { useSharedValue, useDerivedValue } from "react-native-reanimated";

const leafPath =
  "M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z";

interface LeafPathProps {
  count: ReturnType<typeof useSharedValue>; // Reanimated shared value
  centerX: number;
  centerY: number;
  radius: number;
  size: number;
  color: string;
}

export default function LeafPath({ count, centerX, centerY, radius, size, color }: LeafPathProps) {
  // Derived value that computes leaf positions from the shared value
  const positions = useDerivedValue(() => {
    const arr: { x: number; y: number }[] = [];
    const n = Math.floor(count.value);
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2;
      arr.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      });
    }
    return arr;
  }, [count]);

  return (
    <Group>
      {positions.value?.map((p, i) => (
        <Path
          key={i}
          path={leafPath}
          color={color}
          style="fill"
          transform={[
            { translateX: p.x },
            { translateY: p.y },
            { scale: size / 24 },
          ]}
        />
      ))}
    </Group>
  );
}
