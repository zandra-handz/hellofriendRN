// export function toShaderSpace([x, y], aspect, scale) {
//   let sx = x - 0.5;
//   let sy = y - 0.5;

//   sx *= aspect;
//   sx /= scale;
//   sy /= scale;

//   return [sx, sy];
// }

export function toShaderSpace_inplace(point, aspect, scale, out, outIndex) {
  let sx = point[0] - 0.5;
  let sy = point[1] - 0.5;
  //   sx *= aspect;

  sx /= scale;
  sy /= scale;


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



export function screenToGeckoSpace_inPlace(
  p: [number, number],
  aspect: number,
  geckoScale: number,
  out: [number, number]
) {
  //  out[0] = (p[0] - 0.5) * aspect * geckoScale; // x
  // out[1] = (0.5 - p[1]) * geckoScale;          // y flipped
   out[0] = (p[0]);// * geckoScale; // x
 out[1] = (p[1]);// * geckoScale;          
}

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

