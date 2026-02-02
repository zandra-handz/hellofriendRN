import { dist } from "@shopify/react-native-skia";
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

 

export function constrainBlendClampAngle_inPlaceOld(index, ahead, joint, dirVec, radius, maxBend, outDir) {
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




export function constrainBlendClampAngle_inPlace(index, ahead, joint, dirVec, radius, maxBend, goingBackwards, stiffnessBlend, outDir) {
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



  // CALCULATE EFFECTIVE MAX BEND
  let effectiveMaxBend;
  if (goingBackwards && stiffnessBlend > 0) {
    // Apply stiffness restriction when going backwards
    const minStiffness = 0.2;
    const stiffnessMultiplier = 1.0 - (stiffnessBlend * (1.0 - minStiffness));
    effectiveMaxBend = maxBend * stiffnessMultiplier;
  } else {
    // Use normal maxBend when not going backwards
    effectiveMaxBend = maxBend;
  }

  // ENFORCE CLAMP
  blendAhead = Math.max(-effectiveMaxBend, Math.min(effectiveMaxBend, blendAhead));

 

  return { angle: blendAhead, direction: outDir };
}




export function solveFirst_withBackwardsDetect(
  stepsCenter,
  stepsAngle, 
  frontSteps_distanceApart,
  goingBackwards,

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

// --- ROTATION DEBUG (inline, no helper) ---
if (goingBackwards.prevFirstAngle !== undefined) {
  let delta = first.angle - goingBackwards.prevFirstAngle;

  // normalize to [-PI, PI]
  while (delta > Math.PI) delta -= 2 * Math.PI;
  while (delta < -Math.PI) delta += 2 * Math.PI;

  // Store the rotation change
  goingBackwards.rotationChange = Math.abs(delta);

 
}

goingBackwards.prevFirstAngle = first.angle;



  /// option one, no lock ///////////
  let prelimAngle = _getAngleFromXAxis(n);
  let angleDiff = prelimAngle - cursor.angle;

  first.angleDiff = angleDiff;
  first.angle = cursor.angle + angleDiff;
 
first.angleDiff = angleDiff;
first.angle = cursor.angle + angleDiff;

///////////////////////////////////////



  first.radius = radius;
  first.index = 0;

  // Measure distance and angle from stepsCenter to cursor
  let vecToCursor = _subtractVec(cursor, stepsCenter);
  let distanceToCursor = Math.sqrt(dot(vecToCursor, vecToCursor));
 

// Define the backwards range
const MAX_BACKWARDS_DISTANCE = 0.15;
const MIN_BACKWARDS_DISTANCE = 0.02;
const BREAK_OUT_DISTANCE = 0.015; // Force exit if distance gets this small

 
  //  if (distanceToCursor < .06) {
  // console.log('distanceToCursor:', distanceToCursor);
  //  }
  let angleToCursor = _getAngleFromXAxis([
    vecToCursor[0] / distanceToCursor,
    vecToCursor[1] / distanceToCursor
  ]);

 
let perpVector = [Math.cos(stepsAngle - Math.PI/2), Math.sin(stepsAngle - Math.PI/2)];
let lateralOffset = vecToCursor[0] * perpVector[0] + vecToCursor[1] * perpVector[1];
let normalizedTurnDirection = lateralOffset / (frontSteps_distanceApart / 2);
normalizedTurnDirection = Math.max(-1, Math.min(1, normalizedTurnDirection));
goingBackwards.turnDirection = normalizedTurnDirection; // -1 to 1, where 0 is center
// if (goingBackwards.turnDirection !== 1) {
//    console.log('TURN DIRECTION', goingBackwards.turnDirection)


// }


let isInBackwardsRange = distanceToCursor >= MIN_BACKWARDS_DISTANCE && distanceToCursor <= MAX_BACKWARDS_DISTANCE;



///////////////////////////////////////////////////////////////////


  // Calculate relative angle from stepsAngle
  let relativeAngle = angleToCursor - stepsAngle;
  
  while (relativeAngle > Math.PI) relativeAngle -= 2 * Math.PI;
  while (relativeAngle < -Math.PI) relativeAngle += 2 * Math.PI;

  let clampedRelativeAngle = -Math.max(-Math.PI / 2, Math.min(Math.PI / 2, relativeAngle));

  goingBackwards.turnRadius = distanceToCursor + distanceToCursor - frontSteps_distanceApart;
  
  goingBackwards.direction = clampedRelativeAngle;

  // Initialize distance history if needed
  if (!goingBackwards.distanceHistory) {
    goingBackwards.distanceHistory = [];
  }
 
  goingBackwards.distanceHistory.push(distanceToCursor);
 
const historyLengthBackwards = 7;  // Keep this sensitive for backwards detection
const historyLengthForwards = 4;   // Make forward detection more responsive

if (goingBackwards.distanceHistory.length > historyLengthBackwards) {
  goingBackwards.distanceHistory.shift();
}
  


 
// Check if distance is consistently shrinking
// let isShrinking = false;
// if ((goingBackwards.distanceHistory.length >= historyLengthBackwards) && isInBackwardsRange) {
//   isShrinking = true;
//   for (let i = 1; i < goingBackwards.distanceHistory.length; i++) {
    
//     if (goingBackwards.distanceHistory[i] >= goingBackwards.distanceHistory[i - 1]) {
//       isShrinking = false;
//       break;
//     }
//   }
// }

// Check if distance is consistently shrinking
let isShrinking = false;

if (
  goingBackwards.distanceHistory.length >= historyLengthBackwards &&
  isInBackwardsRange
) {
  isShrinking = true;

  let deltas = [];
  for (let i = 1; i < goingBackwards.distanceHistory.length; i++) {
    const prev = goingBackwards.distanceHistory[i - 1];
    const curr = goingBackwards.distanceHistory[i];
    const diff = curr - prev;

    deltas.push(diff);

    if (curr >= prev) {
      isShrinking = false;
      break;
    }
  }

  if (isShrinking) {
    const first = goingBackwards.distanceHistory[0];
    const last = goingBackwards.distanceHistory[goingBackwards.distanceHistory.length - 1];
    const totalShrink = last - first;

    // console.log(
    //   '[BACKWARDS SHRINK]',
    //   {
    //     range: `[${first.toFixed(4)} → ${last.toFixed(4)}]`,
    //     totalShrink: totalShrink.toFixed(4),
    //     deltas: deltas.map(d => d.toFixed(4))
    //   }
    // );
  }
}


const TURN_DIRECTION_MIN = .6;
const DISTANCE_MIN = .04;


// if (goingBackwards.turnDirection !== 1 && distanceToCursor > .12) {
//    console.log('TURN DIRECTION', goingBackwards.turnDirection, distanceToCursor, isInBackwardsRange, goingBackwards.distanceHistory.length, isShrinking)
   

// } else if (goingBackwards.turnDirection < .7 ) {
//   console.log(goingBackwards.turnDirection)
// }

if (!isShrinking && goingBackwards.turnDirection < TURN_DIRECTION_MIN && (distanceToCursor < DISTANCE_MIN)) {
console.log('NEED JUMP ERE')
isShrinking = true;
}
// else {
//   console.log(goingBackwards.turnDirection, distanceToCursor)
// }
// Check if distance is consistently growing
let isGrowing = false;
if (goingBackwards.distanceHistory.length >= historyLengthForwards) {
  isGrowing = true;
  for (let i = goingBackwards.distanceHistory.length - historyLengthForwards; i < goingBackwards.distanceHistory.length; i++) {
    if (goingBackwards.distanceHistory[i] <= goingBackwards.distanceHistory[i - 1]) {
      isGrowing = false;
      break;
    }
  }
}
 
// const MAX_ROTATION_CHANGE = .05; 


  
if (isShrinking && !goingBackwards.goingBackwards) { 
  goingBackwards.goingBackwards = true;
  goingBackwards.totalRotation = 0;
  goingBackwards.backwardsAngle = first.angle; // ← CAPTURE
  console.log('Entering backwards mode');
}

  

if (goingBackwards.goingBackwards) {
  // initialize totalRotation if undefined
  if (goingBackwards.totalRotation === undefined) goingBackwards.totalRotation = 0;

  const pushDistance = radius * 4; // how far back to push 
  first[0] = cursor[0] + n[0] * pushDistance;
  first[1] = cursor[1] + n[1] * pushDistance;
  // console.log('Pushing back while going backwards');

  // Start rotating only if totalRotation > 0 (i.e., after first push)
  if (goingBackwards.totalRotation > 0) {
    const TOTAL_TARGET = Math.PI / 2; // 90 degrees
    const INCREMENT = TOTAL_TARGET / 2; // two steps
    const rotationDir = goingBackwards.turnDirection < 0 ? -1 : 1;

    first.angle += INCREMENT * rotationDir;

    // Update push based on new rotated angle
    first[0] = cursor[0] + Math.cos(first.angle) * pushDistance;
    first[1] = cursor[1] + Math.sin(first.angle) * pushDistance;

    goingBackwards.totalRotation += INCREMENT;

    if (goingBackwards.totalRotation >= TOTAL_TARGET) {
      // console.log('Backwards 90° completed');
      goingBackwards.goingBackwards = false;
      goingBackwards.totalRotation = 0;
    }
  } else {
    // Mark that the first push happened
    goingBackwards.totalRotation += 0.0001; // tiny value to differentiate first frame
  }
}


 

if (goingBackwards.stiffnessBlend === undefined) {
  goingBackwards.stiffnessBlend = 0.0;
}
 
// SMOOTHLY INTERPOLATE STIFFNESS EVERY FRAME
const stiffnessSpeed = .8;// = 0.02; // Much slower transition (try 0.01-0.03)

if (goingBackwards.goingBackwards) {
  // Gradually increase stiffness when going backwards
  goingBackwards.stiffnessBlend += stiffnessSpeed;
  if (goingBackwards.stiffnessBlend > 1.0) goingBackwards.stiffnessBlend = 1.0;
} else {
  // Gradually decrease stiffness when going forward
  goingBackwards.stiffnessBlend -= stiffnessSpeed;
  if (goingBackwards.stiffnessBlend < 0.0) goingBackwards.stiffnessBlend = 0.0;
} 


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

export function solveProcJoint_inPlaceOld(
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

  const procBlend = constrainBlendClampAngle_inPlaceOld(index, ahead, joint, dir, radius, maxBend, dir);

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




export function solveProcJoint_inPlace(
  index,
  ahead,
  joint,
  radius,
  maxBend,
  motion2Start,
  motion3Start,
  motion2End,
  secondMotionClamps,
    goingBackwards = false,
  stiffnessBlend
) {
  const inMotionRange = index >= motion2Start && index <= motion2End;
  const setSecondary =
    !goingBackwards && ahead.secondaryAngle && inMotionRange;

  const setThird =
    !goingBackwards && index > motion3Start && inMotionRange;


  if (setSecondary) {
    maxBend = Math.PI * 2 / secondMotionClamps[index - motion2Start];
  } else {
    maxBend = Math.PI * 2 / maxBend;
  }

  // reuse joint.direction array to avoid allocation
  const dir = joint.direction || (joint.direction = [0, 0]);
  _subtractVec_inPlace(joint, ahead, dir); // reuses dir array

  const procBlend = constrainBlendClampAngle_inPlace(index, ahead, joint, dir, radius, maxBend, goingBackwards, stiffnessBlend, dir);

  const finalAngle = { angle: ahead.angle + procBlend.angle };

    if (!goingBackwards) {

  updateJointSecondaryAngle(setSecondary, joint, finalAngle, ahead.secondaryAngle, procBlend.angle);
  updateJointThirdAngle(setThird, joint, finalAngle, ahead.mirroredSecondaryAngle, procBlend.angle);
  } else {
    // Explicitly preserve existing values
    joint.secondaryAngle = ahead.secondaryAngle;
    joint.mirroredSecondaryAngle = ahead.mirroredSecondaryAngle;
  }
  
  updateJoint(index, joint, ahead, finalAngle.angle, radius, procBlend.angle, procBlend.direction);
}
