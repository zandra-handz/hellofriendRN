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

  const packVec2 = (p: [number, number]) => {
    const x = (p[0] - 0.5) / scale;
    const y = (p[1] - 0.5) / scale;
    out[i++] = x;
    out[i++] = y;
  };

  // TOTAL: 68 vec2s = 136 floats
  
  // 0-14: u_joints[15] - spine joints
  for (let j = 0; j < 15; j++) {
    packVec2(gecko.body.spine.joints[j] || [0, 0]);
  }

  // 15-27: u_tail[13] - tail joints
  for (let j = 0; j < 13; j++) {
    packVec2(gecko.body.tail.joints[j] || [0, 0]);
  }

  // 28-31: u_steps[4] - step targets
  for (let j = 0; j < 4; j++) {
    packVec2(
      (gecko.legs.frontLegs.stepTargets[j] || 
       gecko.legs.backLegs.stepTargets[j] || 
       [0, 0])
    );
  }

  // 32-35: u_elbows[4]
  const elbows = [
    gecko.legs.frontLegs.elbows[0],
    gecko.legs.frontLegs.elbows[1],
    gecko.legs.backLegs.elbows[0],
    gecko.legs.backLegs.elbows[1]
  ];
  for (let e of elbows) packVec2(e || [0, 0]);

  // 36-39: u_shoulders[4]
  const shoulders = [
    gecko.legs.frontLegs.rotatorJoint0,
    gecko.legs.frontLegs.rotatorJoint1,
    gecko.legs.backLegs.rotatorJoint0,
    gecko.legs.backLegs.rotatorJoint1
  ];
  for (let s of shoulders) packVec2(s || [0, 0]);

  // 40-47: u_muscles[8]
  const muscles = [
    ...gecko.legs.frontLegs.muscles,
    ...gecko.legs.backLegs.muscles
  ];
  if (muscles.length !== 8) {
    console.error('Expected 8 muscles, got:', muscles.length);
  }
  for (let m of muscles) packVec2(m || [0, 0]);

  // 48-67: u_fingers[20] (4 legs * 5 finger joints each)
  const fingers = [
    ...gecko.legs.frontLegs.fingers,
    ...gecko.legs.backLegs.fingers
  ];
  
  // Flatten the finger arrays (should be 4 arrays of 5 joints each)
  for (let legFingers of fingers) {
    if (legFingers && legFingers.length === 5) {
      for (let j = 0; j < 5; j++) {
        packVec2(legFingers[j] || [0, 0]);
      }
    } else {
      // Fill with zeros if missing
      for (let j = 0; j < 5; j++) {
        packVec2([0, 0]);
      }
    }
  }

  // Verify we packed exactly 68 vec2s (136 floats)
  if (i !== 136) {
    console.error(`Expected 136 floats, packed ${i}. Check your data structure.`);
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

