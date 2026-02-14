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



// export function intersectLines_inPlace_Opt(
//   line1,
//   line1Angle,
//   line1DistanceApart,
//   line2,
//   line2Angle,
//   result // pre-allocated result object
// ) {
//   // Get intersection point
//   getIntersectionPoint_inPlace(line1, line2, result.position);
  
//   // Calculate mirrored angle without object allocation
//   const diff = _getNormAglDiff(line1Angle, line2Angle);
//   result.mirroredAngle = _normalizeToNegPItoPI(_add180(line1Angle - diff));
  
//   // Calculate direction vector from angle
//   result.mirroredDir[0] = Math.cos(result.mirroredAngle);
//   result.mirroredDir[1] = Math.sin(result.mirroredAngle);
  
//   // Make mirrored line end
//   makeLineFromAPoint_inPlace(
//     result.position,
//     result.mirroredDir,
//     0.24,
//     result.mirroredLineEnd,
//   );
  
//   // Calculate distance
//   result.distFromSteps = _getDistanceScalar(result.position, line2[0]);
  
//   // Make mirrored steps point
//   _makeDistancePoint_inPlace(
//     result.position,
//     result.mirroredDir,
//     result.distFromSteps,
//     result.mirroredStepsPoint,
//   );
  
//   // Calculate transverse line
//   _turnDirVec90ClockW_inPlace(result.mirroredDir, result.transverseLine);
  
//   // Make mirrored step line
//   makeLineOverACenter_inPlace(
//     result.mirroredStepsPoint,
//     result.transverseLine,
//     line1DistanceApart,
//     result.mirroredStepLineStart,
//     result.mirroredStepLineEnd,
//   );
  
//   // Make projected steps point
//   _makeDistancePoint_inPlace(
//     result.position,
//     result.mirroredDir,
//     result.distFromSteps,
//     result.projectedStepsPoint,
//   );
  
//   // Make projected line
//   makeLineOverACenter_inPlace(
//     result.projectedStepsPoint,
//     result.transverseLine,
//     line1DistanceApart,
//     result.projectedLineStart,
//     result.projectedLineEnd,
//   );
  
//   // Store line endpoints for mSLine
//   result.mSLineStart[0] = result.position[0];
//   result.mSLineStart[1] = result.position[1];
//   result.mSLineEnd[0] = result.mirroredLineEnd[0];
//   result.mSLineEnd[1] = result.mirroredLineEnd[1];
  
//   return result;
// }


export function intersectLines_inPlace_Opt(
  line1,
  line1Angle,
  line1DistanceApart,
  line2,
  line2Angle,
  result
) {
  // intersection point -> result.position (and Motion alias result.intersectionPoint points here)
  getIntersectionPoint_inPlace(line1, line2, result.position);

  // angle
  const diff = _getNormAglDiff(line1Angle, line2Angle);
  result.mirroredAngle = _normalizeToNegPItoPI(_add180(line1Angle - diff));

  // ✅ Motion alias
  result.mSAngle = result.mirroredAngle;

  // dir from angle
  result.mirroredDir[0] = Math.cos(result.mirroredAngle);
  result.mirroredDir[1] = Math.sin(result.mirroredAngle);

  // mirrored line end
  makeLineFromAPoint_inPlace(
    result.position,
    result.mirroredDir,
    0.24,
    result.mirroredLineEnd,
  );

  // distance from steps
  result.distFromSteps = _getDistanceScalar(result.position, line2[0]);

  // ✅ Motion alias
  result.sDistFromSteps = result.distFromSteps;

  // mirrored steps point
  _makeDistancePoint_inPlace(
    result.position,
    result.mirroredDir,
    result.distFromSteps,
    result.mirroredStepsPoint,
  );

  // transverse line
  _turnDirVec90ClockW_inPlace(result.mirroredDir, result.transverseLine);

  // mirrored step line (this becomes Motion's mTLine via alias array)
  makeLineOverACenter_inPlace(
    result.mirroredStepsPoint,
    result.transverseLine,
    line1DistanceApart,
    result.mirroredStepLineStart,
    result.mirroredStepLineEnd,
  );

  // projected (if you really want it—currently identical to mirrored)
  _makeDistancePoint_inPlace(
    result.position,
    result.mirroredDir,
    result.distFromSteps,
    result.projectedStepsPoint,
  );

  makeLineOverACenter_inPlace(
    result.projectedStepsPoint,
    result.transverseLine,
    line1DistanceApart,
    result.projectedLineStart,
    result.projectedLineEnd,
  );

  // mSLine endpoints (Motion uses mSLine via alias)
  result.mSLineStart[0] = result.position[0];
  result.mSLineStart[1] = result.position[1];
  result.mSLineEnd[0] = result.mirroredLineEnd[0];
  result.mSLineEnd[1] = result.mirroredLineEnd[1];

  // ✅ Motion expects mSCenter too
  result.mSCenter[0] = (result.mSLineStart[0] + result.mSLineEnd[0]) * 0.5;
  result.mSCenter[1] = (result.mSLineStart[1] + result.mSLineEnd[1]) * 0.5;

  return result;
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

// export function getSpineSagTrans_inPlace(startJoint, endJoint) {
//   const distanceApart = _getDistanceScalar(endJoint, startJoint);

//   const lineDir = [0, 0];
//   const perpendicularDir = [0, 0];
//   const center = [0, 0];

//   _getDirVec_inPlace(endJoint, startJoint, lineDir);
//   _turnDirVec90CounterC_inPlace(lineDir, perpendicularDir);

//   const angle = _getAngleFromXAxis(perpendicularDir);
//   _getCenterPoint_inPlace(startJoint, endJoint, center);

//   const tLineStart = [0, 0];
//   const tLineEnd = [0, 0];

//   makeLineOverACenter_inPlace(
//     center,
//     perpendicularDir,
//     0.18,
//     tLineStart,
//     tLineEnd,
//   );

//   const nAngle = _normalizeToNegPItoPI(angle);

//   return {
//     center: center,
//     tAngle: nAngle,
//     tStart: tLineStart,
//     tEnd: tLineEnd,
//     distanceApart: distanceApart,
//   };
// }


export function getSpineSagTrans_inPlace(startJoint, endJoint, result) {
  //   if (!result) {
  //   console.error("RESULT IS UNDEFINED");
  //   console.trace(); // ← THIS IS IMPORTANT
  //   return;
  // }
  result.distanceApart = _getDistanceScalar(endJoint, startJoint);

  _getDirVec_inPlace(endJoint, startJoint, result.lineDir);
  _turnDirVec90CounterC_inPlace(result.lineDir, result.perpendicularDir);

  const angle = _getAngleFromXAxis(result.perpendicularDir);
  _getCenterPoint_inPlace(startJoint, endJoint, result.center);

  makeLineOverACenter_inPlace(
    result.center,
    result.perpendicularDir,
    0.18,
    result.tStart,
    result.tEnd,
  );

  result.tAngle = _normalizeToNegPItoPI(angle);
  // No return!
}

export function intersectLines_inPlace(
  line1,
  line1Angle,
  line1DistanceApart,
  line2,
  line2Angle,
  result
) {
  getIntersectionPoint_inPlace(line1, line2, result.position);
  
  const diff = _getNormAglDiff(line1Angle, line2Angle);
  result.mirroredAngle = _normalizeToNegPItoPI(_add180(line1Angle - diff));
  
  result.mirroredDir[0] = Math.cos(result.mirroredAngle);
  result.mirroredDir[1] = Math.sin(result.mirroredAngle);
  
  makeLineFromAPoint_inPlace(
    result.position,
    result.mirroredDir,
    0.24,
    result.mirroredLineEnd,
  );
  
  result.distFromSteps = _getDistanceScalar(result.position, line2[0]);
  
  _makeDistancePoint_inPlace(
    result.position,
    result.mirroredDir,
    result.distFromSteps,
    result.mirroredStepsPoint,
  );
  
  _turnDirVec90ClockW_inPlace(result.mirroredDir, result.transverseLine);
  
  makeLineOverACenter_inPlace(
    result.mirroredStepsPoint,
    result.transverseLine,
    line1DistanceApart,
    result.mirroredStepLineStart,
    result.mirroredStepLineEnd,
  );
  
  _makeDistancePoint_inPlace(
    result.position,
    result.mirroredDir,
    result.distFromSteps,
    result.projectedStepsPoint,
  );
  
  makeLineOverACenter_inPlace(
    result.projectedStepsPoint,
    result.transverseLine,
    line1DistanceApart,
    result.projectedLineStart,
    result.projectedLineEnd,
  );
  
  result.mSLineStart[0] = result.position[0];
  result.mSLineStart[1] = result.position[1];
  result.mSLineEnd[0] = result.mirroredLineEnd[0];
  result.mSLineEnd[1] = result.mirroredLineEnd[1];
  // No return!
}
export function getBackFrontStepDistance(frontStep, backStep) {
  const dist = _getDistanceScalar(frontStep, backStep);

  return dist;
}

export function getFrontStepsSagTrans_inPlace(step, otherStep, out, tempLineDir, tempPerpDir) {
  // Remove the allocations:
  // const tempLineDir = [0, 0];  // ❌ DELETE
  // const tempPerpDir = [0, 0];  // ❌ DELETE

  // Center point
  _getCenterPoint_inPlace(step, otherStep, out.tCenter);

  // Distance
  out.tDistanceApart = _getDistanceScalar(step, otherStep);

  // Direction vectors (in-place)
  _getDirVec_inPlace(step, otherStep, tempLineDir);
  _turnDirVec90ClockW_inPlace(tempLineDir, tempPerpDir);

  // Angles
  out.sAngle = _normalizeToNegPItoPI(_getAngleFromXAxis(tempPerpDir));
  out.tAngle = _getAngleFromXAxis(tempLineDir);

  // tLine endpoints (already in-place)
  out.tLineStart[0] = step[0];
  out.tLineStart[1] = step[1];
  out.tLineEnd[0] = otherStep[0];
  out.tLineEnd[1] = otherStep[1];

  // sLine endpoints (in-place)
  makeLineOverACenter_inPlace(
    out.tCenter,
    tempPerpDir,
    0.2,
    out.sLineStart,
    out.sLineEnd
  );

  return out;
}

export function getFrontStepsSagTrans_inPlaceOld(step, otherStep, out) {
  // Reuse buffers (add these to your out object or as temp vars)
  const tempLineDir = [0, 0];
  const tempPerpDir = [0, 0];

  // Center point
  _getCenterPoint_inPlace(step, otherStep, out.tCenter);

  // Distance
  out.tDistanceApart = _getDistanceScalar(step, otherStep);

  // Direction vectors (in-place)
  _getDirVec_inPlace(step, otherStep, tempLineDir);
  _turnDirVec90ClockW_inPlace(tempLineDir, tempPerpDir);

  // Angles
  out.sAngle = _normalizeToNegPItoPI(_getAngleFromXAxis(tempPerpDir));
  out.tAngle = _getAngleFromXAxis(tempLineDir);

  // tLine endpoints (already in-place)
  out.tLineStart[0] = step[0];
  out.tLineStart[1] = step[1];
  out.tLineEnd[0] = otherStep[0];
  out.tLineEnd[1] = otherStep[1];

  // sLine endpoints (in-place)
  makeLineOverACenter_inPlace(
    out.tCenter,
    tempPerpDir,
    0.2,
    out.sLineStart,
    out.sLineEnd
  );

  return out;
}


// export function getFrontStepsSagTrans_inPlace(step, otherStep, out) {
//   // out must be:
//   // {
//   //   tCenter: Float32Array(2),
//   //   tLineStart: Float32Array(2),
//   //   tLineEnd: Float32Array(2),
//   //   sLineStart: Float32Array(2),
//   //   sLineEnd: Float32Array(2),
//   //   tDistanceApart: number,
//   //   sAngle: number,
//   //   tAngle: number,
//   // }

//   // --- EXACTLY LIKE OLD: center, distance, dirs ---
//   // NOTE: your _getCenterPoint_inPlace API seems inconsistent in your codebase,
//   // so we support both "returns vec" and "writes to provided out".
//   let centerPoint = _getCenterPoint_inPlace(step, otherStep, out.tCenter);
//   if (centerPoint && centerPoint !== out.tCenter) {
//     out.tCenter[0] = centerPoint[0];
//     out.tCenter[1] = centerPoint[1];
//     centerPoint = out.tCenter;
//   } else {
//     centerPoint = out.tCenter;
//   }

//   const tDistanceApart = _getDistanceScalar(step, otherStep);
//   const lineDir = _getDirVec(step, otherStep);
//   const perpDir = _turnDirVec90ClockW(lineDir); // VERY IMPORTANT TO GO CLOCKWISE

//   // --- EXACTLY LIKE OLD: angles ---
//   out.sAngle = _normalizeToNegPItoPI(_getAngleFromXAxis(perpDir));
//   out.tAngle = _getAngleFromXAxis(lineDir);
//   out.tDistanceApart = tDistanceApart;

//   // --- EXACTLY LIKE OLD: tLine shape, just split into start/end ---
//   out.tLineStart[0] = step[0];
//   out.tLineStart[1] = step[1];
//   out.tLineEnd[0] = otherStep[0];
//   out.tLineEnd[1] = otherStep[1];

//   // --- EXACTLY LIKE OLD: sLine via makeLineOverACenter(center, perpDir, 0.2) ---
//   // This preserves whatever ordering / internal behavior your old version had.
//   const sLine = makeLineOverACenter(centerPoint, perpDir, 0.2);

//   // sLine is expected to be: [ [x0,y0], [x1,y1] ]
//   out.sLineStart[0] = sLine[0][0];
//   out.sLineStart[1] = sLine[0][1];
//   out.sLineEnd[0] = sLine[1][0];
//   out.sLineEnd[1] = sLine[1][1];

//   return out;
// }










// export function getFrontStepsSagTrans_inPlace(step, otherStep, out) {
//   // ---- center point (MUST populate out.tCenter) ----
//   // Support both possible APIs:
//   // 1) _getCenterPoint_inPlace(step, otherStep, out.tCenter) writes into out.tCenter
//   // 2) _getCenterPoint_inPlace(step, otherStep) returns a vec2
//   let c = _getCenterPoint_inPlace(step, otherStep, out.tCenter);
//   if (c && c !== out.tCenter) {
//     // if it returned a center vec, copy it
//     out.tCenter[0] = c[0];
//     out.tCenter[1] = c[1];
//   }

//   // ---- distance (compute once) ----
//   const tDistanceApart = _getDistanceScalar(step, otherStep);
//   out.tDistanceApart = tDistanceApart;

//   // ---- t-line endpoints ----
//   out.tLineStart[0] = step[0];
//   out.tLineStart[1] = step[1];
//   out.tLineEnd[0] = otherStep[0];
//   out.tLineEnd[1] = otherStep[1];

//   // ---- directions ----
//   const lineDir = _getDirVec(step, otherStep);
//   const perpDir = _turnDirVec90ClockW(lineDir); // VERY IMPORTANT TO GO CLOCKWISE

//   // ---- angles (same as original) ----
//   out.sAngle = _normalizeToNegPItoPI(_getAngleFromXAxis(perpDir));
//   out.tAngle = _getAngleFromXAxis(lineDir);


//   // sagittal line endpoints (same length as before)
// const halfLen = 0.1;

// // compute raw endpoints from perpDir
// let sx0 = out.tCenter[0] - perpDir[0] * halfLen;
// let sy0 = out.tCenter[1] - perpDir[1] * halfLen;
// let sx1 = out.tCenter[0] + perpDir[0] * halfLen;
// let sy1 = out.tCenter[1] + perpDir[1] * halfLen;

// // ENFORCE STABLE ORDER:
// // make sLineEnd be the one that lies in +perpDir direction from center
// // (dot((endpoint - center), perpDir) should be >= 0 for the "end")
// const v0x = sx0 - out.tCenter[0];
// const v0y = sy0 - out.tCenter[1];
// const d0 = v0x * perpDir[0] + v0y * perpDir[1];

// // if start is actually the +perp side, swap so end is +perp
// if (d0 > 0) {
//   const tx = sx0; const ty = sy0;
//   sx0 = sx1; sy0 = sy1;
//   sx1 = tx;  sy1 = ty;
// }

// out.sLineStart[0] = sx0;
// out.sLineStart[1] = sy0;
// out.sLineEnd[0] = sx1;
// out.sLineEnd[1] = sy1;
 

//   return out;
// }


 




// export function getFrontStepsSagTrans(step, otherStep) {
//   const centerPoint = _getCenterPoint_inPlace(step, otherStep);
//   const tDistanceApart = _getDistanceScalar(step, otherStep);
//   const lineDir = _getDirVec(step, otherStep);
//   const perpDir = _turnDirVec90ClockW(lineDir); // VERY IMPORTANT TO GO CLOCKWISE

//   // Legs.chestAngle
//   const sAngle = _normalizeToNegPItoPI(_getAngleFromXAxis(perpDir));

//   const sLine = makeLineOverACenter(centerPoint, perpDir, 0.2);
//   const tAngle = _getAngleFromXAxis(lineDir);

//   return {
//     tCenter: centerPoint,
//     tLine: [
//       [step[0], step[1]],
//       [otherStep[0], otherStep[1]],
//     ],
//     tDistanceApart: tDistanceApart,
//     sLine: sLine,
//     sAngle: sAngle,
//     tAngle: tAngle,
//   };
// }

// LEGS

//joint will be the rotation joint when this is called in the update function

// UPDATES ROTATOR JOINT
// export function _solveShoulder(
//   radius,
//   range,
//   phase,
//   centerPoint,
//   centerAngle,
//   is1,
//   isFollower
// ) {
//   const perp = is1 ? -Math.PI / 2 : Math.PI / 2;
//   const side = isFollower ? 1 : -1;
//   const ang = centerAngle + perp;

//   const perpDirVec = _getScaledAngleDirVec(ang, radius);
//   const spineDirVec = _getAngleDirVec(centerAngle);

//   const bobAmount = radius * range;
//   const bob = _scaleDirVec(spineDirVec, bobAmount * phase * side);

//   //new rotator data
//   return [
//     centerPoint[0] + perpDirVec[0] + bob[0],
//     centerPoint[1] + perpDirVec[1] + bob[1],
//   ];
// }

//  allocation reduced version
export function _solveShoulder(
  radius,
  range,
  phase,
  centerPoint,
  centerAngle,
  is1,
  isFollower,
    goingBackwards = false,
) {
    const perpDirection = goingBackwards ? -1 : 1;
  const perp = is1 ? -Math.PI / 2 * perpDirection : Math.PI / 2 * perpDirection;
  // const perp = is1 ? -Math.PI / 2 : Math.PI / 2;
  const side = isFollower ? 1 : -1;
  const ang = centerAngle + perp;

  // inline perpDirVec calculation (was _getScaledAngleDirVec)
  const perpX = Math.cos(ang) * radius;
  const perpY = Math.sin(ang) * radius;

  // inline spineDirVec calculation (was _getAngleDirVec)
  const spineX = Math.cos(centerAngle);
  const spineY = Math.sin(centerAngle);

  // inline bob calculation (was _scaleDirVec)
  const bobAmount = radius * range;
  const bobX = spineX * bobAmount * phase * side;
  const bobY = spineY * bobAmount * phase * side;

  return [centerPoint[0] + perpX + bobX, centerPoint[1] + perpY + bobY];
}

export function updateShoulderRotator(
  rotator,
  radius,
  range,
  phase,
  centerPoint,
  centerAngle,
  is1,
  isFollower,
  goingBackwards = false
) {
  let newRotationPoint = _solveShoulder(
    radius,
    range,
    phase,
    centerPoint,
    centerAngle,
    is1,
    isFollower,
    goingBackwards 
  );

  // WHERE DATA GETS CHANGED
  rotator[0] = newRotationPoint[0];
  rotator[1] = newRotationPoint[1];
}






export function _solveShoulder_inPlace(
  rotator, // Write directly to output buffer
  radius,
  range,
  phase,
  centerPoint0,
  centerPoint1,
  centerAngle,
  is1,
  isFollower,
  goingBackwards = false,
) {
  const perpDirection = goingBackwards ? -1 : 1;
  const perp = is1 ? -Math.PI / 2 * perpDirection : Math.PI / 2 * perpDirection;
  const side = isFollower ? 1 : -1;
  const ang = centerAngle + perp;

  // inline perpDirVec calculation
  const perpX = Math.cos(ang) * radius;
  const perpY = Math.sin(ang) * radius;

  // inline spineDirVec calculation
  const spineX = Math.cos(centerAngle);
  const spineY = Math.sin(centerAngle);

  // inline bob calculation
  const bobAmount = radius * range;
  const bobX = spineX * bobAmount * phase * side;
  const bobY = spineY * bobAmount * phase * side;

  // ✅ Write directly to output - zero allocations
  rotator[0] = centerPoint0 + perpX + bobX;
  rotator[1] = centerPoint1 + perpY + bobY;
}

 


export function getArmMuscles(muscles, elbow, rotator, stepTarget) {
  muscles[0] = _getCenterPoint_inPlace(stepTarget, elbow);
  muscles[1] = _getCenterPoint_inPlace(elbow, rotator);
}

// // Sets elbow coords
// export function solveElbowIK(
//   rotator,
//   elbow,
//   stepTarget,
//   upperArmLength,
//   forearmLength,
//   is1,
// ) {
//   const { dist: dist, angle: baseAngle } = _getDistanceScalar_andAngle(
//     rotator,
//     stepTarget,
//   );

//   // Clamp distance to reachable range
//   const d = Math.min(
//     Math.max(dist, Math.abs(upperArmLength - forearmLength)),
//     upperArmLength + forearmLength,
//   );

//   // Side: right = bend outwards, left = bend inwards
//   const bendDir = is1 ? 1 : -1;

//   const shoulderToElbowAngle =
//     baseAngle +
//     bendDir *
//       Math.acos(
//         (upperArmLength * upperArmLength +
//           d * d -
//           forearmLength * forearmLength) /
//           (2 * upperArmLength * d),
//       );

//   elbow[0] = rotator[0] + Math.cos(shoulderToElbowAngle) * upperArmLength;
//   elbow[1] = rotator[1] + Math.sin(shoulderToElbowAngle) * upperArmLength;

//   elbow.stepAngle = _getAngleBetweenPoints(stepTarget, elbow);
//   rotator.stepAngle = baseAngle;
// }

// // Sets elbow coords
// export function solveBackElbowIK(
//   rotator,
//   elbow,
//   stepTarget,
//   upperArmLength,
//   forearmLength,
//   is1, 
// ) {
//   const { dist: dist, angle: baseAngle } = _getDistanceScalar_andAngle(
//     rotator,
//     stepTarget,
//   );

//   // Clamp distance to reachable range
//   const d = Math.min(
//     Math.max(dist, Math.abs(upperArmLength - forearmLength)),
//     upperArmLength + forearmLength,
//   );

//   // Side: right = bend outwards, left = bend inwards
//   const bendDir = !is1 ? 1 : -1;

//   const shoulderToElbowAngle =
//     baseAngle +
//     bendDir *
//       Math.acos(
//         (upperArmLength * upperArmLength +
//           d * d -
//           forearmLength * forearmLength) /
//           (2 * upperArmLength * d),
//       );

//   elbow[0] = rotator[0] + Math.cos(shoulderToElbowAngle) * upperArmLength;
//   elbow[1] = rotator[1] + Math.sin(shoulderToElbowAngle) * upperArmLength;
// }

// export function getPivotedStep(step, pivot, pivotSize, distanceOut, is1) {
//   const angle = is1 ? -pivotSize : pivotSize;

//   const x = step[0] - pivot[0];
//   const y = step[1] - pivot[1];

//   const cosA = Math.cos(angle);
//   const sinA = Math.sin(angle);

//   const newX = x * cosA - y * sinA + pivot[0];
//   const newY = x * sinA + y * cosA + pivot[1];

//   return [newX, newY];
// }


// Sets elbow coords
export function solveElbowIK(
  rotator,
  elbow,
  stepTarget,
  upperArmLength,
  forearmLength,
  is1,
) {
  // Inline distance and angle calculation - zero allocations
  const dx = stepTarget[0] - rotator[0];
  const dy = stepTarget[1] - rotator[1];
  const dist = Math.hypot(dx, dy);
  const baseAngle = Math.atan2(dy, dx);

  // Clamp distance to reachable range
  const d = Math.min(
    Math.max(dist, Math.abs(upperArmLength - forearmLength)),
    upperArmLength + forearmLength,
  );

  // Side: right = bend outwards, left = bend inwards
  const bendDir = is1 ? 1 : -1;

  const shoulderToElbowAngle =
    baseAngle +
    bendDir *
      Math.acos(
        (upperArmLength * upperArmLength +
          d * d -
          forearmLength * forearmLength) /
          (2 * upperArmLength * d),
      );

  elbow[0] = rotator[0] + Math.cos(shoulderToElbowAngle) * upperArmLength;
  elbow[1] = rotator[1] + Math.sin(shoulderToElbowAngle) * upperArmLength;

  // elbow.stepAngle = _getAngleBetweenPoints(stepTarget, elbow);
  // rotator.stepAngle = baseAngle;
}

// Sets elbow coords
export function solveBackElbowIK(
  rotator,
  elbow,
  stepTarget,
  upperArmLength,
  forearmLength,
  is1,
) {
  // Inline distance and angle calculation - zero allocations
  const dx = stepTarget[0] - rotator[0];
  const dy = stepTarget[1] - rotator[1];
  const dist = Math.hypot(dx, dy);
  const baseAngle = Math.atan2(dy, dx);

  // Clamp distance to reachable range
  const d = Math.min(
    Math.max(dist, Math.abs(upperArmLength - forearmLength)),
    upperArmLength + forearmLength,
  );

  // Side: right = bend outwards, left = bend inwards
  const bendDir = !is1 ? 1 : -1;

  const shoulderToElbowAngle =
    baseAngle +
    bendDir *
      Math.acos(
        (upperArmLength * upperArmLength +
          d * d -
          forearmLength * forearmLength) /
          (2 * upperArmLength * d),
      );

  elbow[0] = rotator[0] + Math.cos(shoulderToElbowAngle) * upperArmLength;
  elbow[1] = rotator[1] + Math.sin(shoulderToElbowAngle) * upperArmLength;
 

}

// export function getCalcStep(
//   centerJoint,
//   forwardAngle,
//   distanceOut,
//   stepWideness,
//   is1,
// ) {
//   const piMultiplier = is1 ? 1 : -1;
//   const offset = (piMultiplier * Math.PI) / stepWideness;

//   const xNext = centerJoint[0] + Math.cos(forwardAngle + offset) * distanceOut;
//   const yNext = centerJoint[1] + Math.sin(forwardAngle + offset) * distanceOut;

//   let nextStep = [xNext, yNext];
//   nextStep.angle = forwardAngle; // FOR FINGER PLACEMENT. finger placement should be decided here because should only change when step changes

//   return nextStep;
// }

// export function getCalcStepNew(
//   centerJoint,
//   forwardAngle,
//   backwardAngle,
//   distanceOut,
//   stepWideness,
//   is1,
//   goingBackwards = false,
// ) {
//   // if (goingBackwards) {
//   //   console.log('going backwards!!');
//   // }

//   const piMultiplier = is1 ? 1 : -1;
//   const offset = (piMultiplier * Math.PI) / stepWideness;

//   // When going backwards, add/subtract 90 degrees based on which side
//   const backwardsOffset = goingBackwards
//     ? is1
//       ? Math.PI / 3
//       : -Math.PI / 3
//     : 0;

//   const angle = goingBackwards ? backwardAngle : forwardAngle;
//   const effectiveAngle = forwardAngle + backwardsOffset;

//   const xNext =
//     centerJoint[0] + Math.cos(effectiveAngle + offset) * distanceOut;
//   const yNext =
//     centerJoint[1] + Math.sin(effectiveAngle + offset) * distanceOut;

//   let nextStep = [xNext, yNext];
//   nextStep.angle = forwardAngle;

//   return nextStep;
// }

export function getCalcStep_inPlace(
  outStep, // pre-allocated array [x, y]
  centerJoint,
  forwardAngle,
  backwardAngle,
  distanceOut,
  stepWideness,
  is1,
  goingBackwards = false,
) {
  const piMultiplier = is1 ? 1 : -1;
  const offset = (piMultiplier * Math.PI) / stepWideness;

  // When going backwards, add/subtract 90 degrees based on which side
  const backwardsOffset = goingBackwards
    ? is1
      ? Math.PI / 3
      : -Math.PI / 3
    : 0;

 // const angle = goingBackwards ? backwardAngle : forwardAngle;
  const effectiveAngle = forwardAngle + backwardsOffset;

  outStep[0] = centerJoint[0] + Math.cos(effectiveAngle + offset) * distanceOut;
  outStep[1] = centerJoint[1] + Math.sin(effectiveAngle + offset) * distanceOut;

  outStep.angle = forwardAngle;

  return outStep;
}













export function getCalcStep_inPlace_Opt(
  outStep, // pre-allocated array [x, y]
  centerJoint,
  forwardAngle,
  // backwardAngle,
  distanceOut,
  stepWideness,
  is1,
  goingBackwards = false,
 
) {
  const piMultiplier = is1 ? 1 : -1;
  const offset = (piMultiplier * Math.PI) / stepWideness;

  // When going backwards, add/subtract 90 degrees based on which side
  const backwardsOffset = goingBackwards
    ? is1
      ? Math.PI / 3
      : -Math.PI / 3
    : 0;

 // const angle = goingBackwards ? backwardAngle : forwardAngle;
  const effectiveAngle = forwardAngle + backwardsOffset;

  outStep[0] = centerJoint[0] + Math.cos(effectiveAngle + offset) * distanceOut;
  outStep[1] = centerJoint[1] + Math.sin(effectiveAngle + offset) * distanceOut;
 

  return forwardAngle;
}


// gapoCenterAngle is forwardAngle of step which gets attached to stepTarget and passed in separately as gapCenterAngle
// we flip the angle 180 degrees for this
export function solveFingers_Opt(stepTarget, fingers, fingerLen, is1, manualAdj, stepAngle) {
  const numFingers = fingers.length; // usually 5

  // Base angle for the gap
  let gapCenterAngle = stepAngle;

  // Flip the angle to correct the backward gap
  gapCenterAngle += Math.PI;

  // Side offset: fingers point slightly outward depending on hand
  const sideOffset = Math.PI / manualAdj; // adjust this to taste (small angle)
  gapCenterAngle += is1 ? sideOffset : -sideOffset;

  // Gap for the arm/wrist (adjustable)
  const gapAngle = (2 * Math.PI) / 1.7; // <------ lower to shrink arc of fingers

  const fanStart = gapCenterAngle + gapAngle / 2;
  const fanEnd = gapCenterAngle + 2 * Math.PI - gapAngle / 2;
  const fanAngle = fanEnd - fanStart; // remaining arc for fingers

  // Place each finger evenly along the fan
  for (let i = 0; i < numFingers; i++) {
    const t = numFingers === 1 ? 0.5 : i / (numFingers - 1);
    const angle = fanStart + t * fanAngle;

    // Convert polar to Cartesian
    const x = stepTarget[0] + Math.cos(angle) * fingerLen;
    const y = stepTarget[1] + Math.sin(angle) * fingerLen;

    fingers[i][0] = x;
    fingers[i][1] = y;
  }

  return fingers;
}


// Optimized: Only calculates the first finger (for shader-based finger calculation)
export function solveFirstFingerOnly_Opt(stepTarget, fingerLen, is1, manualAdj, stepAngle) {
  // Base angle for the gap
  let gapCenterAngle = stepAngle;

  // Flip the angle to correct the backward gap
  gapCenterAngle += Math.PI;

  // Side offset: fingers point slightly outward depending on hand
  const sideOffset = Math.PI / manualAdj;
  gapCenterAngle += is1 ? sideOffset : -sideOffset;

  // Gap for the arm/wrist (adjustable)
  const gapAngle = (2 * Math.PI) / 1.7;

  const fanStart = gapCenterAngle + gapAngle / 2;
  
  // Only calculate the first finger (t = 0)
  const angle = fanStart;

  // Convert polar to Cartesian
  const x = stepTarget[0] + Math.cos(angle) * fingerLen;
  const y = stepTarget[1] + Math.sin(angle) * fingerLen;

  return [x, y];
}


// gapoCenterAngle is forwardAngle of step which gets attached to stepTarget and passed in separately as gapCenterAngle
// we flip the angle 180 degrees for this
export function solveFingers(stepTarget, fingers, fingerLen, is1, manualAdj) {
  const numFingers = fingers.length; // usually 5

  // Base angle for the gap
  let gapCenterAngle = stepTarget.angle;

  // Flip the angle to correct the backward gap
  gapCenterAngle += Math.PI;

  // Side offset: fingers point slightly outward depending on hand
  const sideOffset = Math.PI / manualAdj; // adjust this to taste (small angle)
  gapCenterAngle += is1 ? sideOffset : -sideOffset;

  // Gap for the arm/wrist (adjustable)
  const gapAngle = (2 * Math.PI) / 1.7; // <------ lower to shrink arc of fingers

  const fanStart = gapCenterAngle + gapAngle / 2;
  const fanEnd = gapCenterAngle + 2 * Math.PI - gapAngle / 2;
  const fanAngle = fanEnd - fanStart; // remaining arc for fingers

  // Place each finger evenly along the fan
  for (let i = 0; i < numFingers; i++) {
    const t = numFingers === 1 ? 0.5 : i / (numFingers - 1);
    const angle = fanStart + t * fanAngle;

    // Convert polar to Cartesian
    const x = stepTarget[0] + Math.cos(angle) * fingerLen;
    const y = stepTarget[1] + Math.sin(angle) * fingerLen;

    fingers[i][0] = x;
    fingers[i][1] = y;
  }

  return fingers;
}

export function soul_infinity(center, progress, radius) {
  return [
    center[0] + Math.sin(progress) * radius * 2,
    center[1] + Math.cos(progress * 2) * radius,
  ];
}

export function soul_circle(center, progress, radius) {
  return [
    center[0] + Math.cos(progress) * radius,
    center[1] + Math.sin(progress) * radius,
  ];
}

export function soul_oneshot_enter_right(
  center = [0.5, 0.5],
  progress = 0,
  radius = 0.05,
) {
  const startX = 1 + radius * 2; // offscreen start
  const startY = center[1];

  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  const x = startX + (center[0] - startX) * clampedProgress;
  const y = startY + (center[1] - startY) * clampedProgress;

  return [x, y];
}

export function soul_oneshot_enter_top(
  center = [0.5, 0.5],
  progress = 0,
  radius = 0.05,
) {
  const startX = center[0];
  const startY = -radius * 2; // offscreen above top

  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  const x = startX + (center[0] - startX) * clampedProgress;
  const y = startY + (center[1] - startY) * clampedProgress;

  return [x, y];
}