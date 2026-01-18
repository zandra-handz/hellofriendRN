import { dot, minus, _subtractVec, _subtractVec_inPlace, _getAngleBetweenPoints, _getAngleFromXAxis, _getAngleFromXAxis_inPlace } from "../../utils";


// does not set the extra motion angles, those have their own updaters
export function updateJoint(index, joint, ahead, newAngle, radius, angleDiff, direction){
  joint[0] = ahead[0] + Math.cos(newAngle) * radius;
  joint[1] = ahead[1] + Math.sin(newAngle) * radius;
  joint.angle = newAngle;
  joint.radius = radius;
  joint.index = index + 1;
  joint.angleDiff = angleDiff; 
  joint.direction = direction; 
};
 
// setter and updater for joint.secondaryAngle
export function updateJointSecondaryAngle(needs, joint, finalAngle, prevJSecondaryAngle, procAngle){
  if (needs) { 
    // add to joint.angle (essentially), and update joint.secondaryAngle for the next angle
    finalAngle.angle = prevJSecondaryAngle + procAngle;
    joint.secondaryAngle = finalAngle.angle;
   } else { 
    // just pass on joint.secondaryAngle as is
    joint.secondaryAngle = prevJSecondaryAngle;
   }
};

// setter and updator for joint.mirroredSecondaryAngle
export function updateJointThirdAngle(needs, joint, finalAngle, prevJThirdAngle, procAngle) {
  if (needs && prevJThirdAngle) {
    // add to joint.angle (essentially), and update joint.mirroredSecondaryAngle
    finalAngle.angle = procAngle + prevJThirdAngle;
    joint.mirroredSecondaryAngle = finalAngle.angle;
  } else{ 
    joint.mirroredSecondaryAngle = prevJThirdAngle;
  } 
  }
 


export function constrainBlendClampAngle(
  index,
  ahead,
  joint,
  curDirVector,
  radius,
  maxBend
) {
  if (ahead.angle === undefined) {
    ahead.angle = _getAngleBetweenPoints(joint, ahead);
  }

  let curLen = Math.sqrt(dot(curDirVector, curDirVector));

  // IF POINTS ARE IDENTICAL
  if (curLen === 0) {
    joint[0] = ahead[0] + radius;
    joint[1] = ahead[1];
    joint.angle = ahead.angle;
    joint.radius = radius;
    joint.index = index + 1;
    joint.angleDiff = 0;
    // joint.globalAngle = ahead.globalAngle;
    joint.direction = [1, 0];

    // joint.secondaryAngle = ahead.angle;
    return;
  }

  // CONSTRAIN
  // a. normalize
  let newDirVector = [curDirVector[0] / curLen, curDirVector[1] / curLen]; // normalize by length of current vector

  // b. new angle with normalized vector
  let newAngle = Math.atan2(newDirVector[1], newDirVector[0]);

  // BLEND
  // a. subtract the ahead.angle, shifts angle reference to ahead.angle!
  let blendAhead = (newAngle -= ahead.angle);
  // b. normalize to  -π to π
  blendAhead = Math.atan2(Math.sin(blendAhead), Math.cos(blendAhead));

  // ENFORCE CLAMP
  // Pos clamp: Math.min --> return maxBend if maxBend is smaller than our calculated angle, otherwise return calculated angle
  // Neg clamp: Math.max --> return -maxBend if larger than our calculated angle, etc
  blendAhead = Math.max(-maxBend, Math.min(maxBend, blendAhead));

  return { angle: blendAhead, direction: newDirVector };
}

 

export function constrainBlendClampAngle_inPlace(index, ahead, joint, dirVec, radius, maxBend, outDir) {
  // set ahead.angle if undefined
  if (ahead.angle === undefined) ahead.angle = _getAngleBetweenPoints(joint, ahead);

  let len = Math.sqrt(dot(dirVec, dirVec));

  if (len === 0) {
    joint[0] = ahead[0] + radius;
    joint[1] = ahead[1];
    joint.angle = ahead.angle;
    joint.radius = radius;
    joint.index = index + 1;
    joint.angleDiff = 0;

    outDir[0] = 1;
    outDir[1] = 0;

    return { angle: 0, direction: outDir };
  }

  // normalize in place
  outDir[0] = dirVec[0] / len;
  outDir[1] = dirVec[1] / len;

  let newAngle = Math.atan2(outDir[1], outDir[0]);

  let blendAhead = newAngle - ahead.angle;
  blendAhead = Math.atan2(Math.sin(blendAhead), Math.cos(blendAhead));
  blendAhead = Math.max(-maxBend, Math.min(maxBend, blendAhead));

  return { angle: blendAhead, direction: outDir };
}


export function solveFirst_inPlace(
  cursor,
  first,
  radius,
  secondMotionAngle,
  secondMotionMirroredAngle
) {
  // update angles directly
  first.secondaryAngle = secondMotionAngle;
  first.mirroredSecondaryAngle = secondMotionMirroredAngle ?? secondMotionAngle;

  // initialize cursor.angle if missing
  if (cursor.angle === undefined) cursor.angle = _getAngleBetweenPoints(first, cursor);

  // compute dir in-place
  const dx = first[0] - cursor[0];
  const dy = first[1] - cursor[1];
  const d = Math.sqrt(dx * dx + dy * dy);

  // handle zero-distance case
  if (d === 0) {
    first[0] = cursor[0] + radius;
    first[1] = cursor[1];
    first.angle = 0;
    first.radius = radius;
    first.index = 0;
    return;
  }

  // normalized direction
  const nx = dx / d;
  const ny = dy / d;

  // update first position in-place
  first[0] = cursor[0] + nx * radius;
  first[1] = cursor[1] + ny * radius;

  const prelimAngle = _getAngleFromXAxis_inPlace(nx, ny); // still a small array allocation here, could inline if needed
  const angleDiff = prelimAngle - cursor.angle;

  first.angleDiff = angleDiff;
  first.angle = cursor.angle + angleDiff;
  first.radius = radius;
  first.index = 0;
}


export function solveFirst(
  cursor,
  first,
  radius,
  secondMotionAngle,
  secondMotionMirroredAngle
) {
 
  first.secondaryAngle = secondMotionAngle;
  first.mirroredSecondaryAngle = secondMotionMirroredAngle ? secondMotionMirroredAngle : secondMotionAngle;

  if (cursor.angle === undefined) cursor.angle = _getAngleBetweenPoints(first, cursor);

  let dir = _subtractVec(first, cursor);
  let d = Math.sqrt(dot(dir, dir)); 

  if (d === 0) { 
 
    first[0] = cursor[0] + radius; 
    first[1] = cursor[1]; 
    first.angle = 0; 
    first.radius = radius; 
    first.index = 0;
    return;
  }

  let n = [dir[0] / d, dir[1] / d];
  first[0] = cursor[0] + n[0] * radius;
  first[1] = cursor[1] + n[1] * radius;

  let prelimAngle = _getAngleFromXAxis(n);
  let angleDiff = prelimAngle - cursor.angle;

  first.angleDiff = angleDiff;
  first.angle = cursor.angle + angleDiff;
  first.radius = radius;
  first.index = 0; 
}


// Loop over this. values passed in to this are arrays
export function solveProcJoint(index,ahead,joint,radius, maxBend, motion2Start, 
  motion3Start, // spine // turning point for angle that will layer on third angle
  motion2End,
  secondMotionClamps,
  // secondMotionScalars, 
) {
  // let curveAngleScalar = 1;
  let inMotionRange = index >= motion2Start && index <= motion2End;
  let setSecondary = ahead.secondaryAngle && inMotionRange;
  let setThird = (index > motion3Start) && inMotionRange;

  if (setSecondary) {
    maxBend = TAU / secondMotionClamps[index - motion2Start];
    // curveAngleScalar = secondMotionScalars[index - motion2Start];
  } else {
    maxBend = TAU / maxBend;
  }

  let dirVec = minus(joint, ahead);
  let procBlend = constrainBlendClampAngle(index, ahead, joint, dirVec, radius,maxBend );

  const finalAngle = { angle: ahead.angle + procBlend.angle};
  // let newAngle = ahead.angle + procBlend.angle; 

  updateJointSecondaryAngle(setSecondary, joint, finalAngle, ahead.secondaryAngle, procBlend.angle);
  updateJointThirdAngle(setThird, joint, finalAngle, ahead.mirroredSecondaryAngle, procBlend.angle );

  updateJoint(index, joint, ahead, finalAngle.angle, radius, procBlend.angle, procBlend.direction);
   
}

export function solveProcJoint_inPlace(
  index,
  ahead,
  joint,
  radius,
  maxBend,
  motion2Start,
  motion3Start,
  motion2End,
  secondMotionClamps
) {
  const inMotionRange = index >= motion2Start && index <= motion2End;
  const setSecondary = ahead.secondaryAngle && inMotionRange;
  const setThird = index > motion3Start && inMotionRange;

  if (setSecondary) {
    maxBend = Math.PI * 2 / secondMotionClamps[index - motion2Start];
  } else {
    maxBend = Math.PI * 2 / maxBend;
  }

  // reuse joint.direction array to avoid allocation
  const dir = joint.direction || (joint.direction = [0, 0]);
  _subtractVec_inPlace(joint, ahead, dir); // reuses dir array

  const procBlend = constrainBlendClampAngle_inPlace(index, ahead, joint, dir, radius, maxBend, dir);

  const finalAngle = { angle: ahead.angle + procBlend.angle };

  updateJointSecondaryAngle(setSecondary, joint, finalAngle, ahead.secondaryAngle, procBlend.angle);
  updateJointThirdAngle(setThird, joint, finalAngle, ahead.mirroredSecondaryAngle, procBlend.angle);

  updateJoint(index, joint, ahead, finalAngle.angle, radius, procBlend.angle, procBlend.direction);
}


export const TAU = Math.PI * 2;

// Use for tail, made separate function instead of conditional checking in original function
export function mir_solveProcJoint(index,ahead,joint,radius, maxBend, motion2Start, 
  motion3Start, // spine // turning point for angle that will layer on third angle
  motion2End,
  secondMotionClamps,
  // secondMotionScalars, 
) {
  // let curveAngleScalar = 1;
  let inMotionRange = index >= motion2Start && index <= motion2End;
  let needsSecondary = ahead.secondaryAngle && inMotionRange;
  let needsThird = (index > motion3Start) && inMotionRange;

  if (needsSecondary) {
    maxBend = TAU / secondMotionClamps[index - motion2Start];
    // curveAngleScalar = secondMotionScalars[index - motion2Start];
  } else {
    maxBend = TAU / maxBend;
  }

  let dirVec = minus(joint, ahead);
  let procBlend = constrainBlendClampAngle(index, ahead, joint, dirVec, radius,maxBend );
 
  let newAngle = ahead.angle + procBlend.angle;
  if (needsSecondary ) {
    newAngle = ahead.secondaryAngle + procBlend.angle;
    joint.secondaryAngle = newAngle;
  } else {
    joint.secondaryAngle = ahead.secondaryAngle;
  }

  if (needsThird && ahead.mirroredSecondaryAngle) {
    newAngle = procBlend.angle + ahead.mirroredSecondaryAngle;
    joint.mirroredSecondaryAngle = newAngle;
  } else {
    joint.mirroredSecondaryAngle = ahead.mirroredSecondaryAngle;
  } 

  setJoint(index, joint, ahead, newAngle, radius, procBlend.angle, procBlend.direction);
   
}
