////////////////////////////////////////////////////////////

export function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}

export function midpoint(a, b) {
  return [(a[0] + b[0]) * 0.5, (a[1] + b[1]) * 0.5];
}

export function minus(a, b) {
  return [a[0] - b[0], a[1] - b[1]];
}

export function plus(a, b) {
  return [a[0] + b[0], a[1] + b[1]];
}

export function times(a, scalar) {
  return [a[0] * scalar, a[1] * scalar];
}

export const TAU = Math.PI * 2;

/////////////////////////////////////////////////////////////

// INPUT: two points
export function _normalizeVector([x, y]) {
  const length = Math.hypot(x, y); // or  Math.sqrt(x * x + y * y);
  return length === 0 ? [0, 0] : [x / length, y / length];
}

// INPUT: angle
// no allocations
export function _normalizeToNegPItoPI(angle) {
  angle = (angle + Math.PI) % (2 * Math.PI);
  if (angle < 0) angle += 2 * Math.PI;
  return angle - Math.PI;
}

export function _normalizeDirVec(start, end) {
  return _normalizeVector([end[0] - start[0], end[1] - start[1]]); // Reuse the _normalizeVector function to normalize the direction vector
}

/////////////////////////////////////////////////////////////////////////

// POINT OUTPUT
export function _getCenterPoint(pointA, pointB) {
  return [(pointA[0] + pointB[0]) / 2, (pointA[1] + pointB[1]) / 2];
}

export function _getCenterPoint_inPlace(pointA, pointB, out = null) {
  if (!out) out = [0, 0]; // fallback if no array provided
  out[0] = (pointA[0] + pointB[0]) / 2;
  out[1] = (pointA[1] + pointB[1]) / 2;
  return out;
}

export function _makeDistancePoint(pointA, dirVec, distScalar) {
  const x = pointA[0] + dirVec[0] * distScalar;
  const y = pointA[1] + dirVec[1] * distScalar;

  return [x, y];
}

export function _makeDistancePoint_inPlace(
  pointA,
  dirVec,
  distScalar,
  out = null,
) {
  if (!out) out = [0, 0]; // fallback if no array provided
  out[0] = pointA[0] + dirVec[0] * distScalar;
  out[1] = pointA[1] + dirVec[1] * distScalar;
  return out;
}

export function _makeOffscreenPoint(offscreenX = -1000, offscreenY = -1000) {
  return [offscreenX, offscreenY];
}

export function _makeOffscreenPoint_inPlace(
  out = null,
  offscreenX = -1000,
  offscreenY = -1000,
) {
  if (!out) out = [0, 0]; // fallback if no array provided
  out[0] = offscreenX;
  out[1] = offscreenY;
  return out;
}

export function _getPointTowardB(pointA, pointB, t = 0.25) {
  return [
    pointA[0] + (pointB[0] - pointA[0]) * t,
    pointA[1] + (pointB[1] - pointA[1]) * t,
  ];
}

// SCALAR OUTPUT
export function _getDistanceScalar(pointA, pointB) {
  const x = pointB[0] - pointA[0];
  const y = pointB[1] - pointA[1];

  return Math.sqrt(x * x + y * y);
}

export function _getDotScalar(pointA, pointB, dirVec) {
  //negating here because (I think) my coord system here is weird
  // LOOK HERE IF ISSUES WHEN CONVERTING THIS CODE
  const negDirVec = [-dirVec[0], -dirVec[1]];

  const newDirVec = _getDirVec(pointA, pointB);

  return newDirVec[0] * negDirVec[0] + newDirVec[1] * negDirVec[1];
}

// VECTOR OUTPUT
export function _getDirVec(start, end) {
  const x = end[0] - start[0];
  const y = end[1] - start[1];

  const lineLength = Math.sqrt(x * x + y * y);
  const dirX = x / lineLength;
  const dirY = y / lineLength;

  return [dirX, dirY];
}

export function _getDirVec_inPlace(start, end, out = null) {
  if (!out) out = [0, 0]; // fallback
  const x = end[0] - start[0];
  const y = end[1] - start[1];
  const lineLength = Math.sqrt(x * x + y * y) || 1e-6; // prevent div by zero

  out[0] = x / lineLength;
  out[1] = y / lineLength;

  return out;
}

export function _subtractVec(a, b) {
  return [a[0] - b[0], a[1] - b[1]];
}

export function _subtractVec_inPlace(a, b, out) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
}

export function _turnDirVec90CountrC(direction) {
  const perpendicularX = direction[1]; // counterclockwise
  const perpendicularY = -direction[0]; // counterclockwise

  return [perpendicularX, perpendicularY];
}

export function _turnDirVec90CounterC_inPlace(direction, out) {
  const x = direction[0];
  const y = direction[1];

  out[0] = y; // counterclockwise
  out[1] = -x;

  return out;
}

export function _turnDirVec90ClockW(direction) {
  const perpendicularX = -direction[1]; // ? clockwise?
  const perpendicularY = direction[0]; // ? clockwise?

  return [perpendicularX, perpendicularY];
}

export function _turnDirVec90ClockW_inPlace(direction, out) {
  const x = direction[0];
  const y = direction[1];

  out[0] = -y; // counterclockwise
  out[1] = x;

  return out;
}

// OUTPUT: direction vector
export function _getAngleDirVec(angle) {
  return [Math.cos(angle), Math.sin(angle)];
}

export function _getAngleDirVec_inPlace(angle, outVec) {
  outVec[0] = Math.cos(angle);
  outVec[1] = Math.sin(angle);
  return outVec;
}

// INPUT: angle
// OUTPUT: direction vector
export function _getScaledAngleDirVec(angle, scalar) {
  return [Math.cos(angle) * scalar, Math.sin(angle) * scalar];
}

export function _scaleDirVec(dirVec, scalar) {
  return [dirVec[0] * scalar, dirVec[1] * scalar];
}

// ANGLE OUTPUT

export function _add180(angle) {
  return angle + Math.PI;
}

// no allocations
export function _makeLerpAngle(angleA, angleB, blendScalar) {
  blendScalar = Math.max(0, Math.min(1, blendScalar));
  let diff = _getNormAglDiff(angleA, angleB);
  return _normalizeToNegPItoPI(angleA + diff * blendScalar);
}

export function _getAngleBetweenPoints(a, b) {
  return Math.atan2(a[1] - b[1], a[0] - b[0]);
}

export function _getAngleFromXAxis(dirVec) {
  return Math.atan2(dirVec[1], dirVec[0]);
}

export function _getAngleFromXAxis_inPlace(dx, dy) {
  return Math.atan2(dy, dx);
}

export function _getNormAglDiff(angleA, angleB) {
  return _normalizeToNegPItoPI(angleB - angleA);
}

export function _getMirrorAngleWithAngleRef(angleA, angleRef) {
  let diff = _getNormAglDiff(angleA, angleRef);

  const mirrored = {};
  mirrored.angle = _normalizeToNegPItoPI(_add180(angleA - diff));
  mirrored.direction = _getAngleDirVec(mirrored.angle);

  return mirrored;
}

export function _getForwardAngle(startPoint, distPoint) {
  const forwardVec = _subtractVec(distPoint, startPoint);
  return _getAngleFromXAxis(forwardVec);
}

// COMBINED OUTPUT

// //for solveElbowIK
// export function _getDistanceScalar_andAngle(pointA, pointB) {

//   const x = pointB[0] - pointA[0];
//   const y = pointB[1] - pointA[1];

//   const dist = Math.sqrt(x * x + y * y);
//   const angle = Math.atan2(y, x);

//   return {
//     dist: dist,
//     angle: angle
//   }

// }

// this one may not work in glsl canvas bc of hypot
export function _getDistanceScalar_andAngle(pointA, pointB) {
  const x = pointB[0] - pointA[0];
  const y = pointB[1] - pointA[1];

  return {
    dist: Math.hypot(x, y), // sqrt(x*x + y*y)
    angle: Math.atan2(y, x),
  };
}

// body class
export function getWeightedValues(
  weights,
  numOfJoints,
  weightedLength,
  defaultValuesMessage = `Autofill warning: weights passed in to getWeightedValues func either not an array or not the correct length. Default values used instead.`,
) {
  if (!Array.isArray(weights) | (weights.length !== numOfJoints)) {
    const value = weightedLength / numOfJoints;
    // console.log(defaultValuesMessage);
    return Array(numOfJoints).fill(value);
  }
  let sumWeights = weights.reduce((a, b) => a + b, 0);
  // console.log(sumWeights);
  let radii = weights.map((w) => (w / sumWeights) * weightedLength);

  return radii;
}

// SPINE & TAIL

export function makeLineOverACenter(centerPoint, extensionVector, length) {
  const lineStartX = centerPoint[0] + extensionVector[0] * (length / 2);
  const lineStartY = centerPoint[1] + extensionVector[1] * (length / 2);

  const lineStart = [lineStartX, lineStartY];

  const lineEndX = centerPoint[0] - extensionVector[0] * (length / 2);
  const lineEndY = centerPoint[1] - extensionVector[1] * (length / 2);

  const lineEnd = [lineEndX, lineEndY];
  return [lineStart, lineEnd];
}

export function makeLineOverACenter_inPlace(
  centerPoint,
  extensionVector,
  length,
  outStart,
  outEnd,
) {
  const half = length * 0.5;

  const dx = extensionVector[0] * half;
  const dy = extensionVector[1] * half;

  outStart[0] = centerPoint[0] + dx;
  outStart[1] = centerPoint[1] + dy;

  outEnd[0] = centerPoint[0] - dx;
  outEnd[1] = centerPoint[1] - dy;

  return [outStart, outEnd];
}

export function makeLineFromAPoint(lineStart, extensionVector, length = 0.24) {
  const lineEndX = lineStart[0] + extensionVector[0] * length;
  const lineEndY = lineStart[1] + extensionVector[1] * length;

  const lineEnd = [lineEndX, lineEndY];

  return [lineStart, lineEnd];
}

export function makeLineFromAPoint_inPlace(
  startingPoint,
  extensionVector,
  length,
  lineEndOut,
) {
  lineEndOut[0] = startingPoint[0] + extensionVector[0] * length;
  lineEndOut[1] = startingPoint[1] + extensionVector[1] * length;

  return [startingPoint, lineEndOut];
}

export function getIntersectionPoint(aLine, bLine) {
  const x1 = aLine[0][0],
    y1 = aLine[0][1];
  const x2 = bLine[0][0],
    y2 = bLine[0][1];

  const dx1 = aLine[1][0] - x1;
  const dy1 = aLine[1][1] - y1;
  const dx2 = bLine[1][0] - x2;
  const dy2 = bLine[1][1] - y2;

  const denominator = dx1 * dy2 - dy1 * dx2;

  if (denominator === 0) {
    console.log("Lines are parallel, no intersection.");
    return null;
  }

  const t = ((x2 - x1) * dy2 - (y2 - y1) * dx2) / denominator;
  const intersectionX = x1 + t * dx1;
  const intersectionY = y1 + t * dy1;

  return [intersectionX, intersectionY]; // Return the position directly
}

export function getIntersectionPoint_inPlace(aLine, bLine, out) {
  const x1 = aLine[0][0],
    y1 = aLine[0][1];
  const x2 = bLine[0][0],
    y2 = bLine[0][1];

  const dx1 = aLine[1][0] - x1;
  const dy1 = aLine[1][1] - y1;
  const dx2 = bLine[1][0] - x2;
  const dy2 = bLine[1][1] - y2;

  const denominator = dx1 * dy2 - dy1 * dx2;

  if (denominator === 0) {
    console.log("Lines are parallel, no intersection.");
    return false; // or null
  }

  const t = ((x2 - x1) * dy2 - (y2 - y1) * dx2) / denominator;

  out[0] = x1 + t * dx1;
  out[1] = y1 + t * dy1;

  return true; // intersection written into 'out'
}

export function getStartAndEndPoints(
  centerPoint,
  lineStartPoint,
  lineEndPoint,
  length,
) {
  const extensionVector = [0, 0];
  _getDirVec_inPlace(lineEndPoint, lineStartPoint, extensionVector);

  const startX = centerPoint[0] + (extensionVector[0] * length) / 2;
  const startY = centerPoint[1] + (extensionVector[1] * length) / 2;
  const startPoint = [startX, startY];

  const endX = centerPoint[0] - (extensionVector[0] * length) / 2;
  const endY = centerPoint[1] - (extensionVector[1] * length) / 2;
  const endPoint = [endX, endY];

  return [startPoint, endPoint];
}

export function getStartAndEndPoints_inPlace(
  centerPoint,
  lineStartPoint,
  lineEndPoint,
  length,
  startOut,
  endOut,
) {
  // temporary vector for direction (allocates once per call)
  const extensionVector = [0, 0];
  _getDirVec_inPlace(lineEndPoint, lineStartPoint, extensionVector);

  const half = length * 0.5;
  const dx = extensionVector[0] * half;
  const dy = extensionVector[1] * half;

  startOut[0] = centerPoint[0] + dx;
  startOut[1] = centerPoint[1] + dy;

  endOut[0] = centerPoint[0] - dx;
  endOut[1] = centerPoint[1] - dy;
}

export function intersectLines(
  line1,
  line1Angle,
  line1DistanceApart,
  line2,
  line2Angle,
) {
  //line 2 is chest angle data

  const position = [0, 0];
  getIntersectionPoint_inPlace(line1, line2, position);
  const mirrored = _getMirrorAngleWithAngleRef(line1Angle, line2Angle);
  

  const mirroredLineEnd = [0, 0];
  makeLineFromAPoint_inPlace(
    position,
    mirrored.direction,
    0.24,
    mirroredLineEnd,
  );
  const distFromSteps = _getDistanceScalar(position, line2[0]);

  const mirroredStepsPoint = [0, 0];
  _makeDistancePoint_inPlace(
    position,
    mirrored.direction,
    distFromSteps,
    mirroredStepsPoint,
  );

  const transverseLine = [0, 0];
  _turnDirVec90ClockW_inPlace(mirrored.direction, transverseLine);

  const mirroredStepLineStart = [0, 0];
  const mirroredStepLineEnd = [0, 0];
  makeLineOverACenter_inPlace(
    mirroredStepsPoint,
    transverseLine,
    line1DistanceApart,
    mirroredStepLineStart,
    mirroredStepLineEnd,
  );

  //// experimental

  const projectedStepsPoint = [0, 0];
  _makeDistancePoint_inPlace(
    position,
    mirrored.direction,
    distFromSteps,
    projectedStepsPoint,
  );

  const projectedLineStart = [0, 0];
  const projectedLineEnd = [0, 0];

  makeLineOverACenter_inPlace(
    projectedStepsPoint,
    transverseLine,
    line1DistanceApart,
    projectedLineStart,
    projectedLineEnd,
  );

  return {
    intersectionPoint: position,
    sDistFromSteps: distFromSteps,
    mSCenter: mirroredStepsPoint,
    mSLine: [position, mirroredLineEnd],
    mTLine: [mirroredStepLineStart, mirroredStepLineEnd],
    pTLine: [projectedLineStart, projectedLineEnd],
    mSAngle: mirrored.angle,
  };
}

export function getSpineSagTrans_inPlace(startJoint, endJoint) {
  const distanceApart = _getDistanceScalar(endJoint, startJoint);

  const lineDir = [0, 0];
  const perpendicularDir = [0, 0];
  const center = [0, 0];

  _getDirVec_inPlace(endJoint, startJoint, lineDir);
  _turnDirVec90CounterC_inPlace(lineDir, perpendicularDir);

  const angle = _getAngleFromXAxis(perpendicularDir);
  _getCenterPoint_inPlace(startJoint, endJoint, center);

  const tLineStart = [0, 0];
  const tLineEnd = [0, 0];

  makeLineOverACenter_inPlace(
    center,
    perpendicularDir,
    0.18,
    tLineStart,
    tLineEnd,
  );

  const nAngle = _normalizeToNegPItoPI(angle);

  return {
    center: center,
    tAngle: nAngle,
    tStart: tLineStart,
    tEnd: tLineEnd,
    distanceApart: distanceApart,
  };
} 