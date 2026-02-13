// export function toShaderSpace([x, y], aspect, scale) {
//   let sx = x - 0.5;
//   let sy = y - 0.5;

//   sx *= aspect;
//   sx /= scale;
//   sy /= scale;

//   return [sx, sy];
// }

// Calculate total number of points: spine + tail + all fingers + other small joints
 

export function transformSelected(
  point: [number, number],
  scale: number,
  out: [number, number],
  outIndex: number = 0
): void {
  const x = (point[0] - 0.5) / scale;
  const y = (point[1] - 0.5) / scale;

  out[outIndex + 0] = x;
  out[outIndex + 1] = y;
}

// Or if you want it to return a new array:
export function toGeckoSpace(
  point: [number, number],
  scale: number
): [number, number] {
  const x = (point[0] - 0.5) / scale;
  const y = (point[1] - 0.5) / scale;
  
  return [x, y];
}

export function packGeckoOnly(
  gecko,
  out: Float32Array,
  scale: number = 1
) {
  let i = 0;
  let vec2Index = 0;

  const DEBUG_PACK = false; // 👈 flip when you want logs
  const INDEX = false;

  const packVec2Named = (name: string, p: [number, number]) => {
    const baseFloatIndex = i;

    const x = (p[0] - 0.5) / scale;
    const y = (p[1] - 0.5) / scale;

    out[i++] = x;
    out[i++] = y;

    if (DEBUG_PACK) {
      console.log(
        `[${vec2Index}] ${name} | floats ${baseFloatIndex}-${baseFloatIndex + 1}`,
        { x, y }
      );
    }

        if (INDEX) {
      console.log(
        `[${vec2Index}] ${name} `,
        
      );
    }

    vec2Index++;
  };

  const spine = gecko.body.spine;
  const tail  = gecko.body.tail;

  // 0–2 : head-space
  packVec2Named("u_snout", spine.unchainedJoints[0] || [0, 0]);
  packVec2Named("u_head",  spine.unchainedJoints[1] || [0, 0]);
  packVec2Named("u_hint",  spine.hintJoint || [0, 0]);

  // 3–17 : u_joints[15]
  for (let j = 0; j < 15; j++) {
    packVec2Named(`u_joints[${j}]`, spine.joints[j] || [0, 0]);
  }

  // 18–30 : u_tail[13]
  for (let j = 0; j < 13; j++) {
    packVec2Named(`u_tail[${j}]`, tail.joints[j] || [0, 0]);
  }

// 31–34 : u_steps[4]
// 0,1 = front legs
// 2,3 = back legs

packVec2Named(
  "u_steps[0] front_leg_0",
  gecko.legs.frontLegs.stepTargets[0] || [0, 0]
);

packVec2Named(
  "u_steps[1] front_leg_1",
  gecko.legs.frontLegs.stepTargets[1] || [0, 0]
);

packVec2Named(
  "u_steps[2] back_leg_0",
  gecko.legs.backLegs.stepTargets[0] || [0, 0]
);

packVec2Named(
  "u_steps[3] back_leg_1",
  gecko.legs.backLegs.stepTargets[1] || [0, 0]
);

  // 35–38 : u_elbows[4]
  const elbows = [
    gecko.legs.frontLegs.elbows[0],
    gecko.legs.frontLegs.elbows[1],
    gecko.legs.backLegs.elbows[0],
    gecko.legs.backLegs.elbows[1]
  ];
  elbows.forEach((e, j) =>
    packVec2Named(`u_elbows[${j}]`, e || [0, 0])
  );

  // 39–42 : u_shoulders[4]
  const shoulders = [
    gecko.legs.frontLegs.rotatorJoint0,
    gecko.legs.frontLegs.rotatorJoint1,
    gecko.legs.backLegs.rotatorJoint0,
    gecko.legs.backLegs.rotatorJoint1
  ];
  shoulders.forEach((s, j) =>
    packVec2Named(`u_shoulders[${j}]`, s || [0, 0])
  );

  // 43–50 : u_muscles[8]
  const muscles = [
    ...gecko.legs.frontLegs.muscles,
    ...gecko.legs.backLegs.muscles
  ];
  muscles.forEach((m, j) =>
    packVec2Named(`u_muscles[${j}]`, m || [0, 0])
  );

  // 51–70 : u_fingers[20]
  const fingers = [
    ...gecko.legs.frontLegs.fingers,
    ...gecko.legs.backLegs.fingers
  ];

  let fingerIndex = 0;
  for (let legFingers of fingers) {
    if (legFingers && legFingers.length === 5) {
      for (let j = 0; j < 5; j++) {
        packVec2Named(
          `u_fingers[${fingerIndex++}]`,
          legFingers[j] || [0, 0]
        );
      }
    } else {
      for (let j = 0; j < 5; j++) {
     
        packVec2Named(`u_fingers[${fingerIndex++}]`, [0, 0]);
      }
    }
  }

  // 71 vec2 * 2 = 142 floats
  if (i !== 142) {
    console.error(`Expected 142 floats, packed ${i}`);
  }

  return out;
}


// // revert to this when debugging is not needed
// export function packGeckoOnlyProd(
//   gecko,
//   out: Float32Array,
//   scale: number = 1
// ) {
//   let i = 0;

//   const packVec2 = (p: [number, number]) => {
//     const x = (p[0] - 0.5) / scale;
//     const y = (p[1] - 0.5) / scale;
//     out[i++] = x;
//     out[i++] = y;
//   };

//   const spine = gecko.body.spine;
//   const tail  = gecko.body.tail;

//   // 0-2: head-space
//   packVec2(spine.unchainedJoints[0] || [0, 0]); // u_snout
//   packVec2(spine.unchainedJoints[1] || [0, 0]); // u_head
//   packVec2(spine.hintJoint || [0, 0]);          // u_hint

//   // 3-17: u_joints[15] - spine joints
//   for (let j = 0; j < 15; j++) {
//     packVec2(spine.joints[j] || [0, 0]);
//   }

//   // 18-30: u_tail[13]
//   for (let j = 0; j < 13; j++) {
//     packVec2(tail.joints[j] || [0, 0]);
//   }

// // 31–34 : u_steps[4]
// // [0–1] front legs, [2–3] back legs

// packVec2(gecko.legs.frontLegs.stepTargets[0] || [0, 0]);
// packVec2(gecko.legs.frontLegs.stepTargets[1] || [0, 0]);
// packVec2(gecko.legs.backLegs.stepTargets[0]  || [0, 0]);
// packVec2(gecko.legs.backLegs.stepTargets[1]  || [0, 0]);


//   // 35-38: u_elbows[4]
//   const elbows = [
//     gecko.legs.frontLegs.elbows[0],
//     gecko.legs.frontLegs.elbows[1],
//     gecko.legs.backLegs.elbows[0],
//     gecko.legs.backLegs.elbows[1]
//   ];
//   for (let e of elbows) packVec2(e || [0, 0]);

//   // 39-42: u_shoulders[4]
//   const shoulders = [
//     gecko.legs.frontLegs.rotatorJoint0,
//     gecko.legs.frontLegs.rotatorJoint1,
//     gecko.legs.backLegs.rotatorJoint0,
//     gecko.legs.backLegs.rotatorJoint1
//   ];
//   for (let s of shoulders) packVec2(s || [0, 0]);

//   // 43-50: u_muscles[8]
//   const muscles = [
//     ...gecko.legs.frontLegs.muscles,
//     ...gecko.legs.backLegs.muscles
//   ];
//   for (let m of muscles) packVec2(m || [0, 0]);

//   // 51-70: u_fingers[20]
//   const fingers = [
//     ...gecko.legs.frontLegs.fingers,
//     ...gecko.legs.backLegs.fingers
//   ];
//   for (let legFingers of fingers) {
//     if (legFingers && legFingers.length === 5) {
//       for (let j = 0; j < 5; j++) packVec2(legFingers[j] || [0, 0]);
//     } else {

//       for (let j = 0; j < 5; j++) packVec2([0, 0]);
//     }
//   }

//   if (i !== 142) {
//     console.error(`Expected 142 floats, packed ${i}`);
//   }

//   return out;
// }



export function packGeckoOnlyProdCompact40(
  gecko: any,
  out: Float32Array | number[],
  scale: number = 1,
) {
  let i = 0;

  const packVec2Safe = (p: [number, number] | null | undefined) => {
    if (p) {
      out[i++] = (p[0] - 0.5) / scale;
      out[i++] = (p[1] - 0.5) / scale;
    } else {
      out[i++] = 0;
      out[i++] = 0;
    }
  };

  const spine = gecko.body.spine;
  const tail = gecko.body.tail;
  const frontLegs = gecko.legs.frontLegs;
  const backLegs = gecko.legs.backLegs;

  // ─────────────────────────────────────────────
  // COMPACT LAYOUT (40 vec2 = 80 floats)
  // Body(12) + Tail(12) + Steps(4) + Elbows(4) + 
  // Muscles(4) + FirstFingers(4)
  // ─────────────────────────────────────────────

  // Body points (12 vec2)
  packVec2Safe(spine.unchainedJoints?.[0]);
  packVec2Safe(spine.unchainedJoints?.[1]);
  packVec2Safe(spine.joints?.[1]);
  packVec2Safe(spine.joints?.[2]);
  packVec2Safe(spine.joints?.[3]);
  packVec2Safe(spine.joints?.[4]);
  packVec2Safe(spine.joints?.[5]);
  packVec2Safe(spine.joints?.[6]);
  packVec2Safe(spine.joints?.[7]);
  packVec2Safe(spine.joints?.[8]);
  packVec2Safe(spine.joints?.[9]);
  packVec2Safe(spine.joints?.[13]);

  // Tail points (12 vec2)
  for (let j = 0; j < 12; j++) {
    packVec2Safe(tail.joints?.[j]);
  }

  // Steps (4 vec2)
  packVec2Safe(frontLegs.stepTargets?.[0]);
  packVec2Safe(frontLegs.stepTargets?.[1]);
  packVec2Safe(backLegs.stepTargets?.[0]);
  packVec2Safe(backLegs.stepTargets?.[1]);

  // Elbows (4 vec2)
  packVec2Safe(frontLegs.elbows?.[0]);
  packVec2Safe(frontLegs.elbows?.[1]);
  packVec2Safe(backLegs.elbows?.[0]);
  packVec2Safe(backLegs.elbows?.[1]);

  // Muscles (4 vec2)
  packVec2Safe(frontLegs.muscles?.[1]);
  packVec2Safe(frontLegs.muscles?.[3]);
  packVec2Safe(backLegs.muscles?.[1]);
  packVec2Safe(backLegs.muscles?.[3]);

  // First fingers (4 vec2) - shader calculates the other 16!
  if (frontLegs.fingers?.[0]) {
    out[i++] = (frontLegs.fingers[0][0] - 0.5) / scale;
    out[i++] = (frontLegs.fingers[0][1] - 0.5) / scale;
  } else {
    out[i++] = 0;
    out[i++] = 0;
  }

  if (frontLegs.fingers?.[1]) {
    out[i++] = (frontLegs.fingers[1][0] - 0.5) / scale;
    out[i++] = (frontLegs.fingers[1][1] - 0.5) / scale;
  } else {
    out[i++] = 0;
    out[i++] = 0;
  }

  if (backLegs.fingers?.[0]) {
    out[i++] = (backLegs.fingers[0][0] - 0.5) / scale;
    out[i++] = (backLegs.fingers[0][1] - 0.5) / scale;
  } else {
    out[i++] = 0;
    out[i++] = 0;
  }

  if (backLegs.fingers?.[1]) {
    out[i++] = (backLegs.fingers[1][0] - 0.5) / scale;
    out[i++] = (backLegs.fingers[1][1] - 0.5) / scale;
  } else {
    out[i++] = 0;
    out[i++] = 0;
  }

  // 40 vec2 * 2 floats = 80 floats
  if (i !== 80) {
    console.error(`Expected 80 floats (40 vec2), packed ${i}`);
  }

  return out;
}


export function packGeckoOnlyProdCompact42(
  gecko: any,
  out: Float32Array | number[],
  scale: number = 1,
) {
  let i = 0;

  const packVec2Safe = (p: [number, number] | null | undefined) => {
    if (p) {
      out[i++] = (p[0] - 0.5) / scale;
      out[i++] = (p[1] - 0.5) / scale;
    } else {
      out[i++] = 0;
      out[i++] = 0;
    }
  };

  const spine = gecko.body.spine;
  const tail = gecko.body.tail;
  const frontLegs = gecko.legs.frontLegs;
  const backLegs = gecko.legs.backLegs;

  // ─────────────────────────────────────────────
  // COMPACT LAYOUT (42 vec2 = 84 floats)
  // Body(12) + Tail(12) + Steps(4) + Elbows(4) + 
  // Muscles(4) + FirstFingers(4)
  // ─────────────────────────────────────────────

  // Body points (12 vec2)
  packVec2Safe(spine.unchainedJoints?.[0]);
  packVec2Safe(spine.unchainedJoints?.[1]);
  packVec2Safe(spine.joints?.[1]);
  packVec2Safe(spine.joints?.[2]);
  packVec2Safe(spine.joints?.[3]);
  packVec2Safe(spine.joints?.[4]);
  packVec2Safe(spine.joints?.[5]);
  packVec2Safe(spine.joints?.[6]);
  packVec2Safe(spine.joints?.[7]);
  packVec2Safe(spine.joints?.[8]);
  packVec2Safe(spine.joints?.[9]);
  packVec2Safe(spine.joints?.[13]);

  // Tail points (12 vec2)
  for (let j = 0; j < 12; j++) {
    packVec2Safe(tail.joints?.[j]);
  }

  // Steps (4 vec2)
  packVec2Safe(frontLegs.stepTargets?.[0]);
  packVec2Safe(frontLegs.stepTargets?.[1]);
  packVec2Safe(backLegs.stepTargets?.[0]);
  packVec2Safe(backLegs.stepTargets?.[1]);

  // Elbows (4 vec2)
  packVec2Safe(frontLegs.elbows?.[0]);
  packVec2Safe(frontLegs.elbows?.[1]);
  packVec2Safe(backLegs.elbows?.[0]);
  packVec2Safe(backLegs.elbows?.[1]);

  // Muscles (4 vec2)
  packVec2Safe(frontLegs.muscles?.[1]);
  packVec2Safe(frontLegs.muscles?.[3]);
  packVec2Safe(backLegs.muscles?.[1]);
  packVec2Safe(backLegs.muscles?.[3]);

  // ✅ FIXED: First fingers (4 vec2) - pack directly from Float32Array
  // fingers[0] is a Float32Array(2), so access [0] and [1] directly
  if (frontLegs.fingers?.[0]) {
    out[i++] = (frontLegs.fingers[0][0] - 0.5) / scale;
    out[i++] = (frontLegs.fingers[0][1] - 0.5) / scale;
  } else {
    out[i++] = 0;
    out[i++] = 0;
  }

  if (frontLegs.fingers?.[1]) {
    out[i++] = (frontLegs.fingers[1][0] - 0.5) / scale;
    out[i++] = (frontLegs.fingers[1][1] - 0.5) / scale;
  } else {
    out[i++] = 0;
    out[i++] = 0;
  }

  if (backLegs.fingers?.[0]) {
    out[i++] = (backLegs.fingers[0][0] - 0.5) / scale;
    out[i++] = (backLegs.fingers[0][1] - 0.5) / scale;
  } else {
    out[i++] = 0;
    out[i++] = 0;
  }

  if (backLegs.fingers?.[1]) {
    out[i++] = (backLegs.fingers[1][0] - 0.5) / scale;
    out[i++] = (backLegs.fingers[1][1] - 0.5) / scale;
  } else {
    out[i++] = 0;
    out[i++] = 0;
  }

  // 42 vec2 * 2 floats = 84 floats
  if (i !== 84) {
    console.error(`Expected 84 floats (42 vec2), packed ${i}`);
  }

  return out;
}



export function packGeckoOnlyProdCompact56(
  gecko: any,
  out: Float32Array | number[],
  scale: number = 1,
) {
  let i = 0;

  const packVec2Safe = (p: [number, number] | null | undefined) => {
    if (p) {
      out[i++] = (p[0] - 0.5) / scale;
      out[i++] = (p[1] - 0.5) / scale;
    } else {
      out[i++] = 0;
      out[i++] = 0;
    }
  };

  const spine = gecko.body.spine;
  const tail = gecko.body.tail;
  const frontLegs = gecko.legs.frontLegs;
  const backLegs = gecko.legs.backLegs;

  // ─────────────────────────────────────────────
  // COMPACT LAYOUT (56 vec2 = 112 floats)
  // Matches your SKSL usage exactly.
  //
  // Body(12): 0,1,4,5,6,7,8,9,10,11,12,16
  // Tail(12): 18..29 (12 pts)
  // Steps(4): 31..34
  // Elbows(4): 35..38
  // Muscles used(4): 44,46,48,50  (only the ones shader reads)
  // Fingers(20): 51..70
  // ─────────────────────────────────────────────

  // Body points
  packVec2Safe(spine.unchainedJoints?.[0]); // old 0: snout
  packVec2Safe(spine.unchainedJoints?.[1]); // old 1: head
  packVec2Safe(spine.joints?.[1]);          // old 4
  packVec2Safe(spine.joints?.[2]);          // old 5
  packVec2Safe(spine.joints?.[3]);          // old 6
  packVec2Safe(spine.joints?.[4]);          // old 7
  packVec2Safe(spine.joints?.[5]);          // old 8
  packVec2Safe(spine.joints?.[6]);          // old 9
  packVec2Safe(spine.joints?.[7]);          // old 10
  packVec2Safe(spine.joints?.[8]);          // old 11
  packVec2Safe(spine.joints?.[9]);          // old 12
  packVec2Safe(spine.joints?.[13]);         // old 16

  // Tail points (old 18..29) = tail.joints[0..11]
  for (let j = 0; j < 12; j++) {
    packVec2Safe(tail.joints?.[j]);
  }

  // Steps (old 31..34)
  packVec2Safe(frontLegs.stepTargets?.[0]);
  packVec2Safe(frontLegs.stepTargets?.[1]);
  packVec2Safe(backLegs.stepTargets?.[0]);
  packVec2Safe(backLegs.stepTargets?.[1]);

  // Elbows (old 35..38)
  packVec2Safe(frontLegs.elbows?.[0]);
  packVec2Safe(frontLegs.elbows?.[1]);
  packVec2Safe(backLegs.elbows?.[0]);
  packVec2Safe(backLegs.elbows?.[1]);

  // Muscles used by shader:
  // old 44,46 are front muscles[1], muscles[3]
  // old 48,50 are back muscles[1], muscles[3]
  packVec2Safe(frontLegs.muscles?.[1]);
  packVec2Safe(frontLegs.muscles?.[3]);
  packVec2Safe(backLegs.muscles?.[1]);
  packVec2Safe(backLegs.muscles?.[3]);

  // Fingers (old 51..70): 20 total (4 legs × 5)
  // frontLegs.fingers: 2 legs × 5 each
  for (let legIdx = 0; legIdx < 2; legIdx++) {
    const legFingers = frontLegs.fingers?.[legIdx];
    if (legFingers && legFingers.length === 5) {
      for (let f = 0; f < 5; f++) packVec2Safe(legFingers[f]);
    } else {
      for (let f = 0; f < 5; f++) packVec2Safe(undefined);
    }
  }
  // backLegs.fingers: 2 legs × 5 each
  for (let legIdx = 0; legIdx < 2; legIdx++) {
    const legFingers = backLegs.fingers?.[legIdx];
    if (legFingers && legFingers.length === 5) {
      for (let f = 0; f < 5; f++) packVec2Safe(legFingers[f]);
    } else {
      for (let f = 0; f < 5; f++) packVec2Safe(undefined);
    }
  }

  // 56 vec2 * 2 floats = 112 floats
  if (i !== 112) {
    console.error(`Expected 112 floats (56 vec2), packed ${i}`);
  }

  return out;
}


// Zero-allocation version
export function packGeckoOnlyProd(
  gecko,
  out: Float32Array | number[],
  scale: number = 1
) {
  let i = 0;

  const packVec2 = (p: [number, number]) => {
    out[i++] = (p[0] - 0.5) / scale;
    out[i++] = (p[1] - 0.5) / scale;
  };

  const packVec2Safe = (p: [number, number] | null | undefined) => {
    if (p) {
      out[i++] = (p[0] - 0.5) / scale;
      out[i++] = (p[1] - 0.5) / scale;
    } else {
      out[i++] = 0;
      out[i++] = 0;
    }
  };

  const spine = gecko.body.spine;
  const tail = gecko.body.tail;
  const frontLegs = gecko.legs.frontLegs;
  const backLegs = gecko.legs.backLegs;

  // 0-2: head-space
  packVec2Safe(spine.unchainedJoints[0]); // u_snout
  packVec2Safe(spine.unchainedJoints[1]); // u_head
  packVec2Safe(spine.hintJoint);          // u_hint

  // 3-17: u_joints[15] - spine joints
  for (let j = 0; j < 15; j++) {
    packVec2Safe(spine.joints[j]);
  }

  // 18-30: u_tail[13]
  for (let j = 0; j < 13; j++) {
    packVec2Safe(tail.joints[j]);
  }

  // 31-34: u_steps[4] - NO array creation
  packVec2Safe(frontLegs.stepTargets[0]);
  packVec2Safe(frontLegs.stepTargets[1]);
  packVec2Safe(backLegs.stepTargets[0]);
  packVec2Safe(backLegs.stepTargets[1]);

  // 35-38: u_elbows[4] - NO array creation
  packVec2Safe(frontLegs.elbows[0]);
  packVec2Safe(frontLegs.elbows[1]);
  packVec2Safe(backLegs.elbows[0]);
  packVec2Safe(backLegs.elbows[1]);

  // 39-42: u_shoulders[4] - NO array creation
  packVec2Safe(frontLegs.rotatorJoint0);
  packVec2Safe(frontLegs.rotatorJoint1);
  packVec2Safe(backLegs.rotatorJoint0);
  packVec2Safe(backLegs.rotatorJoint1);

  // 43-50: u_muscles[8] - NO spread operators
  // Assuming muscles is an array of 4 elements per leg
  for (let j = 0; j < frontLegs.muscles.length; j++) {
    packVec2Safe(frontLegs.muscles[j]);
  }
  for (let j = 0; j < backLegs.muscles.length; j++) {
    packVec2Safe(backLegs.muscles[j]);
  }

  // 51-70: u_fingers[20] - NO spread operators
  // frontLegs.fingers and backLegs.fingers are arrays of arrays (4 legs × 5 fingers)
  for (let legIdx = 0; legIdx < frontLegs.fingers.length; legIdx++) {
    const legFingers = frontLegs.fingers[legIdx];
    if (legFingers && legFingers.length === 5) {
      for (let j = 0; j < 5; j++) {
        packVec2Safe(legFingers[j]);
      }
    } else {
      for (let j = 0; j < 5; j++) {
        out[i++] = 0;
        out[i++] = 0;
      }
    }
  }
  for (let legIdx = 0; legIdx < backLegs.fingers.length; legIdx++) {
    const legFingers = backLegs.fingers[legIdx];
    if (legFingers && legFingers.length === 5) {
      for (let j = 0; j < 5; j++) {
        packVec2Safe(legFingers[j]);
      }
    } else {
      for (let j = 0; j < 5; j++) {
        out[i++] = 0;
        out[i++] = 0;
      }
    }
  }

  if (i !== 142) {
    console.error(`Expected 142 floats, packed ${i}`);
  }

  return out;
}

// 0–14   spine
// 15–27  tail
// 28–31  steps
// 32–35  elbows
// 36–39  shoulders
// 40–47  muscles
// 48–67  fingers

export function toShaderSpace_inplace(point, aspect, scale, out, outIndex) {
  let sx = point[0] - 0.5;
  let sy = point[1] - 0.5;
  //  sx *= aspect;

  sx /= scale;
  sy /= scale;


  out[outIndex + 0] = sx;
  out[outIndex + 1] = sy;
}


export function toShader(point, aspect, scale, out, outIndex) {
  let sx = point[0];
  let sy = point[1]  ;
  sx *= aspect;
  sx /= scale;
  sy /= scale;

  out[outIndex + 0] = sx;
  out[outIndex + 1] = sy;
}



export function toRawSpace_inplace(point, aspect, scale, out, outIndex) {
  let sx = point[0];
  let sy = point[1];// - 0.5;
  //    sx *= aspect;

  // sx /= scale;
  // sy /= scale;


  out[outIndex + 0] = sx;
  out[outIndex + 1] = sy;
}


// export function toShaderModel([x, y], scale) {
//   let sx = x - 0.5;
//   let sy = y - 0.5;

//   sx /= scale;
//   sy /= scale;

//   return [sx, sy];
// }

export function screenToGeckoSpace(
  p: [number, number],
  aspect: number,
  geckoScale: number
): [number, number] {
  // 1. recenter
  let x = p[0];
  let y =  p[1];  

  // 2. aspect correction
 // x *= aspect;

  // 3. scale
  // x *= geckoScale;
  // y *= geckoScale;

  return [x, y];
}



// export function screenToGeckoSpace_inPlace(
//   p: [number, number],
//   aspect: number,
//   geckoScale: number,
//   out: [number, number]
// ) {
//   //  out[0] = (p[0] - 0.5) * aspect * geckoScale; // x
//   // out[1] = (0.5 - p[1]) * geckoScale;          // y flipped
//    out[0] = (p[0]);// * geckoScale; // x
//  out[1] = (p[1]);// * geckoScale;          
// }

// export function toGeckoPointer_inPlace(point, aspect, scale, out, outIndex){
 
//   if (!aspect) { 
//     out = point;
//     return
//   }
 
//   let sx = point[0] + 0.625; // I have absolutely no idea why this works, (edit, since only x it must have to do with aspect) but it is the only thing that works right now to match gecko to user pointer
//   let sy = point[1] ;
//    sx *= aspect; 

//   out[outIndex + 0] = sx;
//   out[outIndex + 1] = sy;
 

// }


export function toGeckoSpace_inPlace(
  point: [number, number],
  gecko_scale: number,
  out: Float32Array | number[],
  outIndex: number = 0
): void {
  const x = (point[0] - 0.5) / gecko_scale;
  const y = (point[1] - 0.5) / gecko_scale;

  out[outIndex + 0] = x;
  out[outIndex + 1] = y;
}

export function toGeckoPointerScaled_inPlace(point, aspect, scale, gecko_size, out, outIndex){
 
  if (!aspect) { 
    out = point;
    return
  }
 
  let sx = point[0];// + 0.625;
  let sy = point[1];
  sx *= aspect;
  
  // Center the coordinates before scaling
  sx -= 0.5 * aspect;  // Move to origin
  sy -= 0.5;
  
  // Scale around center
  sx *= gecko_size;
  sy *= gecko_size;
  
  // Move back from origin
  sx += 0.5 * aspect;
  sy += 0.5;

    sx += 0.625 * aspect; // Scale the offset too, or just try 0.625

  out[outIndex + 0] = sx;
  out[outIndex + 1] = sy;
}


export function geckoToMoment_inPlace(
  geckoPoint: [number, number],
  aspect: number,
  gecko_size: number,
  out: Float32Array | number[],
  outIndex: number = 0
): void {
  if (!aspect) {
    out[outIndex + 0] = geckoPoint[0];
    out[outIndex + 1] = geckoPoint[1];
    return;
  }

  let sx = geckoPoint[0];
  let sy = geckoPoint[1];

  // undo final offset
  sx -= 0.625 * aspect;
  // console.log(gecko_size)
  // move to origin
  sx -= 0.5 * aspect;
  sy -= 0.5;

  // undo scale
  sx /= gecko_size;
  sy /= gecko_size;

  // move back
  sx += 0.5 * aspect;
  sy += 0.5;

  // undo aspect scaling
  sx /= aspect;

  out[outIndex + 0] = sx;
  out[outIndex + 1] = sy;
}


export function toShaderModel_inPlace(point, aspect, scale, out, outIndex) {
  let sx = point[0] - 0.5;
  let sy = point[1] - 0.5;
  //sx *= aspect;
  sx /= scale;
  sy /= scale;

  out[outIndex + 0] = sx;
  out[outIndex + 1] = sy;
}





export function toShaderModel_arrays_inPlace(
  points,
  flatArray,
  count,
  aspect = 1,
  scale = 1,
  offset = 0
) {
  for (let i = 0; i < count; i++) {
    const dst = offset + i;
    const base = dst * 2;

    if (points[i]) {
      toShaderModel_inPlace(points[i], aspect, scale, flatArray, base);
    } else {
      flatArray[base + 0] = 0.0;
      flatArray[base + 1] = 0.0;
    }
  }
}



 
 

export function packVec2Uniform_withRecenter_moments(
  points,
  flatArray,
  count,
  aspect = 1,
  scale = 1
) {
  for (let i = 0; i < count; i++) {
    const base = i * 2;

    const p = points[i];
    if (p) {
      flatArray[base + 0] = p.coord[0];
      flatArray[base + 1] = p.coord[1];
    } else {
      flatArray[base + 0] = 0.0;
      flatArray[base + 1] = 0.0;
    }
  }
}


 

export const hexToVec3 = (hex) => {
  // Remove '#' if present
  const cleanHex = hex.replace("#", "");
  // Parse R, G, B as integers
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return `${r.toFixed(4)}, ${g.toFixed(4)}, ${b.toFixed(4)}`;
};

