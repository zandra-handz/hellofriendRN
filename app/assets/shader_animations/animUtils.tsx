// export function toShaderSpace([x, y], aspect, scale) {
//   let sx = x - 0.5;
//   let sy = y - 0.5;

//   sx *= aspect;
//   sx /= scale;
//   sy /= scale;

//   return [sx, sy];
// }

// Calculate total number of points: spine + tail + all fingers + other small joints
 

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


// revert to this when debugging is not needed
export function packGeckoOnlyProd(
  gecko,
  out: Float32Array,
  scale: number = 1
) {
  let i = 0;

  const packVec2 = (p: [number, number]) => {
    const x = (p[0] - 0.5) / scale;
    const y = (p[1] - 0.5) / scale;
    out[i++] = x;
    out[i++] = y;
  };

  const spine = gecko.body.spine;
  const tail  = gecko.body.tail;

  // 0-2: head-space
  packVec2(spine.unchainedJoints[0] || [0, 0]); // u_snout
  packVec2(spine.unchainedJoints[1] || [0, 0]); // u_head
  packVec2(spine.hintJoint || [0, 0]);          // u_hint

  // 3-17: u_joints[15] - spine joints
  for (let j = 0; j < 15; j++) {
    packVec2(spine.joints[j] || [0, 0]);
  }

  // 18-30: u_tail[13]
  for (let j = 0; j < 13; j++) {
    packVec2(tail.joints[j] || [0, 0]);
  }

// 31–34 : u_steps[4]
// [0–1] front legs, [2–3] back legs

packVec2(gecko.legs.frontLegs.stepTargets[0] || [0, 0]);
packVec2(gecko.legs.frontLegs.stepTargets[1] || [0, 0]);
packVec2(gecko.legs.backLegs.stepTargets[0]  || [0, 0]);
packVec2(gecko.legs.backLegs.stepTargets[1]  || [0, 0]);


  // 35-38: u_elbows[4]
  const elbows = [
    gecko.legs.frontLegs.elbows[0],
    gecko.legs.frontLegs.elbows[1],
    gecko.legs.backLegs.elbows[0],
    gecko.legs.backLegs.elbows[1]
  ];
  for (let e of elbows) packVec2(e || [0, 0]);

  // 39-42: u_shoulders[4]
  const shoulders = [
    gecko.legs.frontLegs.rotatorJoint0,
    gecko.legs.frontLegs.rotatorJoint1,
    gecko.legs.backLegs.rotatorJoint0,
    gecko.legs.backLegs.rotatorJoint1
  ];
  for (let s of shoulders) packVec2(s || [0, 0]);

  // 43-50: u_muscles[8]
  const muscles = [
    ...gecko.legs.frontLegs.muscles,
    ...gecko.legs.backLegs.muscles
  ];
  for (let m of muscles) packVec2(m || [0, 0]);

  // 51-70: u_fingers[20]
  const fingers = [
    ...gecko.legs.frontLegs.fingers,
    ...gecko.legs.backLegs.fingers
  ];
  for (let legFingers of fingers) {
    if (legFingers && legFingers.length === 5) {
      for (let j = 0; j < 5; j++) packVec2(legFingers[j] || [0, 0]);
    } else {

      for (let j = 0; j < 5; j++) packVec2([0, 0]);
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

export function toGeckoPointer_inPlace(point, aspect, scale, out, outIndex){
 
  if (!aspect) { 
    out = point;
    return
  }
 
  let sx = point[0] + 0.625; // I have absolutely no idea why this works, (edit, since only x it must have to do with aspect) but it is the only thing that works right now to match gecko to user pointer
  let sy = point[1] ;
   sx *= aspect;
  // sx /= scale;
  // sy /= scale;

  out[outIndex + 0] = sx;
  out[outIndex + 1] = sy;

  // out[0] = sx;
  // out[1] = sy;

  // console.log(out);

 

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

