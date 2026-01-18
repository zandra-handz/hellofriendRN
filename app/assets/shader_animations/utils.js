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


export function _makeDistancePoint_inPlace(pointA, dirVec, distScalar, out = null) {
  if (!out) out = [0, 0]; // fallback if no array provided
  out[0] = pointA[0] + dirVec[0] * distScalar;
  out[1] = pointA[1] + dirVec[1] * distScalar;
  return out;
}

export function _makeOffscreenPoint(offscreenX=-1000., offscreenY=-1000.){
  return [offscreenX, offscreenY]; 
};

export function _makeOffscreenPoint_inPlace(out = null, offscreenX = -1000, offscreenY = -1000) {
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

export function _turnDirVec90ClockW(direction) {
  const perpendicularX = -direction[1]; // ? clockwise?
  const perpendicularY = direction[0]; // ? clockwise?

  return [perpendicularX, perpendicularY];
}

// OUTPUT: direction vector
export function _getAngleDirVec(angle){
  return [Math.cos(angle), Math.sin(angle)];
}

// INPUT: angle
// OUTPUT: direction vector
export function _getScaledAngleDirVec(angle, scalar){
  return [Math.cos(angle) * scalar, Math.sin(angle) * scalar];
}

export function _scaleDirVec(dirVec, scalar){
  return [dirVec[0] * scalar, dirVec[1] * scalar];
}



// ANGLE OUTPUT

export function _add180(angle) {
    return angle + Math.PI;
}


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

//for solveElbowIK
export function _getDistanceScalar_andAngle(pointA, pointB) {
 
  const x = pointB[0] - pointA[0];
  const y = pointB[1] - pointA[1];

  const dist = Math.sqrt(x * x + y * y);
  const angle = Math.atan2(y, x);

  return {
    dist: dist,
    angle: angle
  }
  
 
}



// body class
export function getWeightedValues(
  weights,
  numOfJoints,
  weightedLength,
  defaultValuesMessage = `Autofill warning: weights passed in to getWeightedValues func either not an array or not the correct length. Default values used instead.`
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

export function makeLineFromAPoint(
  startingPoint,
  extensionVector,
  length = 0.24
) {
  const lineStart = startingPoint;

  const lineEndX = lineStart[0] + extensionVector[0] * length;
  const lineEndY = lineStart[1] + extensionVector[1] * length;

  const lineEnd = [lineEndX, lineEndY];

  return [lineStart, lineEnd];
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

export function getStartAndEndPoints(
  centerPoint,
  lineStartPoint,
  lineEndPoint,
  length
) {
  const extensionVector = _getDirVec(lineEndPoint, lineStartPoint);

  const startX = centerPoint[0] + (extensionVector[0] * length) / 2;
  const startY = centerPoint[1] + (extensionVector[1] * length) / 2;
  const startPoint = [startX, startY];

  const endX = centerPoint[0] - (extensionVector[0] * length) / 2;
  const endY = centerPoint[1] - (extensionVector[1] * length) / 2;
  const endPoint = [endX, endY];

  return [startPoint, endPoint];
}

export function intersectLines(
  line1,
  line1Angle,
  line1DistanceApart,
  line2,
  line2Angle
) {
  //line 2 is chest angle data

  const position = getIntersectionPoint(line1, line2);

  const mirrored = _getMirrorAngleWithAngleRef(line1Angle, line2Angle);
  const mirroredLine = makeLineFromAPoint(
    [position[0], position[1]],
    mirrored.direction,
    0.24
  );

  const distFromSteps = _getDistanceScalar(position, line2[0]);
  const mirroredStepsPoint = _makeDistancePoint(
    [position[0], position[1]],
    mirrored.direction,
    distFromSteps
  );

  const transverseLine = _turnDirVec90ClockW(mirrored.direction);
  const mirroredStepLine = makeLineOverACenter(
    mirroredStepsPoint,
    transverseLine,
    line1DistanceApart
  );

  //// experimental
  const projectedStepsPoint = _makeDistancePoint(
    [position[0], position[1]],
    mirrored.direction,
    distFromSteps
  );

  const projectedStepLine = makeLineOverACenter(
    projectedStepsPoint,
    transverseLine,
    line1DistanceApart
  );

  // position.distFromSteps = distFromSteps;
  // position.mirroredAngle = mirrored.angle;
  // position.mirroredDistFromSteps = mirroredStepsPoint;
  // position.mirroredLineStart = mirroredLine[0];
  // position.mirroredLineEnd = mirroredLine[1];
  // // position.chestAngleData = allFirstAngleData; // spineMotion.allFirstAngleData;
  // position.mirroredStepsLineStart = mirroredStepLine[0];
  // position.mirroredStepsLineEnd = mirroredStepLine[1];
  // position.projectedStepsLineStart = projectedStepLine[0];
  // position.projectedStepsLineEnd = projectedStepLine[1];

  return {
    intersectionPoint: position,
    sDistFromSteps: distFromSteps,
    mSCenter: mirroredStepsPoint,
    mSLine: mirroredLine,
    mTLine: mirroredStepLine,
    pTLine: projectedStepLine,
    mSAngle: mirrored.angle,
  };
}

export function getSpineSagTrans(startJoint, endJoint) {
  const distanceApart = _getDistanceScalar(endJoint, startJoint);
  const lineDir = _getDirVec_inPlace(endJoint, startJoint);

  const perpendicularDir = _turnDirVec90CountrC(lineDir);
  const angle = _getAngleFromXAxis(perpendicularDir);
  const center = _getCenterPoint_inPlace(startJoint, endJoint);

  const tLine = makeLineOverACenter(center, perpendicularDir, 0.18);

  const nAngle = _normalizeToNegPItoPI(angle);

  return {
    center: center,
    tAngle: nAngle,
    tStart: tLine[0],
    tEnd: tLine[1],
    distanceApart: distanceApart,
  };
}

export function getBackFrontStepDistance(frontStep, backStep) {
  const dist = _getDistanceScalar(frontStep, backStep);

  return dist;
}

export function getFrontStepsSagTrans(step, otherStep) {
  const centerPoint = _getCenterPoint_inPlace(step, otherStep);
  const tDistanceApart = _getDistanceScalar(step, otherStep);
  const lineDir = _getDirVec(step, otherStep);
  const perpDir = _turnDirVec90ClockW(lineDir); // VERY IMPORTANT TO GO CLOCKWISE

  // Legs.chestAngle
  const sAngle = _normalizeToNegPItoPI(_getAngleFromXAxis(perpDir));

  const sLine = makeLineOverACenter(centerPoint, perpDir, 0.2);
  const tAngle = _getAngleFromXAxis(lineDir);

  return {
    tCenter: centerPoint,
    tLine: [
      [step[0], step[1]],
      [otherStep[0], otherStep[1]],
    ],
    tDistanceApart: tDistanceApart,
    sLine: sLine,
    sAngle: sAngle,
    tAngle: tAngle,
  };
}







// LEGS

 

//joint will be the rotation joint when this is called in the update function

// UPDATES ROTATOR JOINT
export function _solveShoulder(
  radius,
  range,
  phase,
  centerPoint,
  centerAngle,
  is1,
  isFollower
) {
  const perp = is1 ? -Math.PI / 2 : Math.PI / 2;
  const side = isFollower ? 1 : -1;
  const ang = centerAngle + perp;

  const perpDirVec = _getScaledAngleDirVec(ang, radius);
  const spineDirVec = _getAngleDirVec(centerAngle);

  const bobAmount = radius * range;
  const bob = _scaleDirVec(spineDirVec, bobAmount * phase * side);

  //new rotator data
  return [
    centerPoint[0] + perpDirVec[0] + bob[0],
    centerPoint[1] + perpDirVec[1] + bob[1],
  ];
}

export function updateShoulderRotator(
  rotator,
  radius,
  range,
  phase,
  centerPoint,
  centerAngle,
  is1,
  isFollower
) {
  let newRotationPoint = _solveShoulder(
 
    radius,
    range,
    phase,
    centerPoint,
    centerAngle,
    is1,
    isFollower
  );

  // WHERE DATA GETS CHANGED
  rotator[0] = newRotationPoint[0];
  rotator[1] = newRotationPoint[1];
}


export function getArmMuscles(muscles, elbow, rotator, stepTarget){
  muscles[0] = _getCenterPoint_inPlace(stepTarget, elbow);
  muscles[1] = _getCenterPoint_inPlace(elbow, rotator);
};


// Sets elbow coords
export function solveElbowIK(
  rotator,
  elbow,
  stepTarget,
  upperArmLength,
  forearmLength,
  is1,  
) { 

  const { dist: dist, angle: baseAngle} = _getDistanceScalar_andAngle(rotator, stepTarget);


  // Clamp distance to reachable range
  const d = Math.min(
    Math.max(dist, Math.abs(upperArmLength - forearmLength)),
    upperArmLength + forearmLength
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
          (2 * upperArmLength * d)
      );

  elbow[0] = rotator[0] + Math.cos(shoulderToElbowAngle) * upperArmLength;
  elbow[1] = rotator[1] + Math.sin(shoulderToElbowAngle) * upperArmLength;

  elbow.stepAngle = _getAngleBetweenPoints(stepTarget, elbow);
  rotator.stepAngle = baseAngle;
 
}



// Sets elbow coords
export function solveBackElbowIK(
  rotator,
  elbow,
  stepTarget,
  upperArmLength,
  forearmLength,
  is1,
  backwards = false
) {
     const { dist: dist, angle: baseAngle} = _getDistanceScalar_andAngle(rotator, stepTarget);
 

  // Clamp distance to reachable range
  const d = Math.min(
    Math.max(dist, Math.abs(upperArmLength - forearmLength)),
    upperArmLength + forearmLength
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
          (2 * upperArmLength * d)
      );

  elbow[0] = rotator[0] + Math.cos(shoulderToElbowAngle) * upperArmLength;
  elbow[1] = rotator[1] + Math.sin(shoulderToElbowAngle) * upperArmLength;
}


export function getPivotedStep(
  step,
  pivot,
  pivotSize,
  distanceOut,
  is1
) {
  const angle = is1 ? -pivotSize : pivotSize;

  const x = step[0] - pivot[0];
  const y = step[1] - pivot[1];

  const cosA = Math.cos(angle) ;
  const sinA = Math.sin(angle);

  const newX = x * cosA - y * sinA + pivot[0];
  const newY = x * sinA + y * cosA + pivot[1];

  return [newX, newY];
}


export function getCalcStep(
  centerJoint,
  forwardAngle,
  distanceOut,
  stepWideness,
  is1
) {
  const piMultiplier = is1 ? 1 : -1;
  const offset = (piMultiplier * Math.PI) / stepWideness;

  const xNext = centerJoint[0] + Math.cos(forwardAngle + offset) * distanceOut;
  const yNext = centerJoint[1] + Math.sin(forwardAngle + offset) * distanceOut;

  let nextStep = [xNext, yNext];
  nextStep.angle = forwardAngle; // FOR FINGER PLACEMENT. finger placement should be decided here because should only change when step changes

  return nextStep;
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
    return [center[0] + Math.sin(progress) * radius*2, 
                    center[1] + Math.cos(progress*2) * radius
    ]
 
}

export function soul_oneshot_enter_right(center = [0.5, 0.5], progress = 0, radius = 0.05) {
  const startX = 1 + radius * 2;  // offscreen start
  const startY = center[1];
 
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  const x = startX + (center[0] - startX) * clampedProgress;
  const y = startY + (center[1] - startY) * clampedProgress;

  return [x, y];
}


export function soul_oneshot_enter_top(
  center = [0.5, 0.5],
  progress = 0,
  radius = 0.05
) {
  const startX = center[0];
  const startY = -radius * 2; // offscreen above top

  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  const x = startX + (center[0] - startX) * clampedProgress;
  const y = startY + (center[1] - startY) * clampedProgress;

  return [x, y];
}
