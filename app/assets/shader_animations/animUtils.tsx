export function toShaderSpace([x, y], aspect, scale) {
  let sx = x - 0.5;
  let sy = y - 0.5;

  sx *= aspect;
  sx /= scale;
  sy /= scale;

  return [sx, sy];
}

export function toShaderModel([x, y], scale) {
  let sx = x - 0.5;
  let sy = y - 0.5;

  sx /= scale;
  sy /= scale;

  return [sx, sy];
}


export function packVec2Uniform_withRecenter(points, flatArray, num, aspect = 1, scale = 1) {
  for (let i = 0; i < num; i++) {
    if (points[i]) {
      //    const [sx, sy] = [points[i][0], points[i][1]];
      const [sx, sy] = toShaderModel(points[i], scale);

      flatArray[i * 2 + 0] = sx;
      flatArray[i * 2 + 1] = sy;
    } else {
      flatArray[i * 2 + 0] = 0.0;
      flatArray[i * 2 + 1] = 0.0;
    }
  }
}

export function packVec2UniformFlat_withRecenter(
  src: Float32Array,
  dst: Float32Array,
  count: number,
  scale: number
) {
  let k = 0;

  for (let i = 0; i < count; i++) {
    const x = src[k];
    const y = src[k + 1];

    // skip zeros
    if (x !== 0 || y !== 0) {
      // convert each [x, y] to shader space
      const [sx, sy] = toShaderModel([x, y], scale);
      dst[k]     = sx;
      dst[k + 1] = sy;
    } else {
      dst[k]     = 0.0;
      dst[k + 1] = 0.0;
    }

    k += 2;
  }
}


export function packVec2Uniform_withRecenter_moments(
  points,
  flatArray,
  num,
  aspect = 1,
  scale = 1
) {
  for (let i = 0; i < num; i++) {
    if (points[i]) {
      // const [sx, sy] = toShaderSpace(points[i].coord, aspect, scale);
        const [sx, sy] = [points[i].coord[0], points[i].coord[1]]

      flatArray[i * 2 + 0] = sx;
      flatArray[i * 2 + 1] = sy;
    } else {
      flatArray[i * 2 + 0] = 0.0;
      flatArray[i * 2 + 1] = 0.0;
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

