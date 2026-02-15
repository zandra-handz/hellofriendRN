import { dist } from "@shopify/react-native-skia";
import {
  dot,
  minus,
  _subtractVec,
  _subtractVec_inPlace,
  _getAngleBetweenPoints,
  _getAngleFromXAxis,
  _getAngleFromXAxis_inPlace,
} from "../../utils";

// does not set the extra motion angles, those have their own updaters
export function updateJoint(
  index,
  joint,
  ahead,
  newAngle,
  radius,
  angleDiff,
  direction,
) {
  joint[0] = ahead[0] + Math.cos(newAngle) * radius;
  joint[1] = ahead[1] + Math.sin(newAngle) * radius;
  joint.angle = newAngle;
  joint.radius = radius;
  joint.index = index + 1;
  joint.angleDiff = angleDiff;
  joint.direction = direction;
}

// setter and updater for joint.secondaryAngle
export function updateJointSecondaryAngle(
  needs,
  joint,
  finalAngle,
  prevJSecondaryAngle,
  procAngle,
) {
  if (needs) {
    // add to joint.angle (essentially), and update joint.secondaryAngle for the next angle
    finalAngle.angle = prevJSecondaryAngle + procAngle;
    joint.secondaryAngle = finalAngle.angle;
  } else {
    // just pass on joint.secondaryAngle as is
    joint.secondaryAngle = prevJSecondaryAngle;
  }
}

// setter and updator for joint.mirroredSecondaryAngle
export function updateJointThirdAngle(
  needs,
  joint,
  finalAngle,
  prevJThirdAngle,
  procAngle,
) {
  if (needs && prevJThirdAngle) {
    // add to joint.angle (essentially), and update joint.mirroredSecondaryAngle
    finalAngle.angle = procAngle + prevJThirdAngle;
    joint.mirroredSecondaryAngle = finalAngle.angle;
  } else {
    joint.mirroredSecondaryAngle = prevJThirdAngle;
  }
}

export function constrainBlendClampAngle(
  index,
  ahead,
  joint,
  curDirVector,
  radius,
  maxBend,
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

export function constrainBlendClampAngle_inPlaceOld(
  index,
  ahead,
  joint,
  dirVec,
  radius,
  maxBend,
  outDir,
) {
  // set ahead.angle if undefined
  if (ahead.angle === undefined)
    ahead.angle = _getAngleBetweenPoints(joint, ahead);

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

export function constrainBlendClampAngle_inPlace(
  index,
  ahead,
  joint,
  dirVec,
  radius,
  maxBend,
  goingBackwards,
  stiffnessBlend,
  outDir,
) {
  // set ahead.angle if undefined
  if (ahead.angle === undefined)
    ahead.angle = _getAngleBetweenPoints(joint, ahead);

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
    const stiffnessMultiplier = 1.0 - stiffnessBlend * (1.0 - minStiffness);
    effectiveMaxBend = maxBend * stiffnessMultiplier;
  } else {
    // Use normal maxBend when not going backwards
    effectiveMaxBend = maxBend;
  }

  // ENFORCE CLAMP
  blendAhead = Math.max(
    -effectiveMaxBend,
    Math.min(effectiveMaxBend, blendAhead),
  );

  return { angle: blendAhead, direction: outDir };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function handleBackwardsJump(
  goingBackwards,
  cursor,
  first,
  radius,
  n,
  isGrowing,
) {
  // Early exit if creature is moving forward
  if (isGrowing) {
    // console.log('Aborting backwards jump - creature moving forward');
    goingBackwards.goingBackwards = false;
    goingBackwards.totalRotation = 0;
    goingBackwards.jumpRotation = 0;
    goingBackwards.jumpedFirstPosition = null;
    goingBackwards.jumpedCursorPosition = null;
    goingBackwards.jumpFrameCount = 0;
    console.log('IS GROWING ----- RETURN')
    return;
  }
 
  const rotationAmountDivisor = 3.; // Divide total rotation by this (higher = less rotation)

  const jumpBackTimeLength = 20; // Total frames for the entire animation sequence
  const useReleasePhase = true; // Set to true to gradually decrease, false to stay pushed out

  // Rotation timing controls
  const rotationStartFrame = 0; // When to start rotating
  const rotationEndFrame = 10; // When to stop rotating

  // Initialize frame counter on first call
  if (goingBackwards.jumpFrameCount === undefined) {
    goingBackwards.jumpFrameCount = 0;
  }

  // Increment frame counter
  goingBackwards.jumpFrameCount++;

  // Define the push-out wave phases (in frames)
  const quickPushPhase = 5; // Frames 0-5: Quick push to 75% (6/8)
  const slowPushPhase = 10; // Frames 5-15: Slow push to 100% (8/8)
  const holdPhase = useReleasePhase ? 30 : 45; // Adjust hold based on whether we release
  const releasePhase = 15; // Frames 45-60: Slow release back to normal (only if enabled)

  const maxPushMultiplier = 3; // Maximum push distance multiplier

  let pushMultiplier;

  if (goingBackwards.jumpFrameCount <= quickPushPhase) {
    // Quick push to 75% of max
    const progress = goingBackwards.jumpFrameCount / quickPushPhase;
    pushMultiplier = maxPushMultiplier * 0.75 * progress;
  } else if (goingBackwards.jumpFrameCount <= quickPushPhase + slowPushPhase) {
    // Slow push from 75% to 100%
    const progress =
      (goingBackwards.jumpFrameCount - quickPushPhase) / slowPushPhase;
    pushMultiplier = maxPushMultiplier * (0.75 + 0.25 * progress);
  } else if (
    goingBackwards.jumpFrameCount <=
    quickPushPhase + slowPushPhase + holdPhase
  ) {
    // Hold at maximum
    pushMultiplier = maxPushMultiplier;
  } else if (useReleasePhase) {
    // Slow release back down (only if enabled)
    const releaseProgress =
      (goingBackwards.jumpFrameCount -
        quickPushPhase -
        slowPushPhase -
        holdPhase) /
      releasePhase;
    pushMultiplier = maxPushMultiplier * (1 - releaseProgress);
  } else {
    // Stay at max if release phase is disabled
    pushMultiplier = maxPushMultiplier;
  }

  const pushDistance = radius * pushMultiplier;
  first[0] = cursor[0] + n[0] * pushDistance;
  first[1] = cursor[1] + n[1] * pushDistance;

  // Only rotate if within the rotation frame range
  const shouldRotate =
    goingBackwards.jumpFrameCount >= rotationStartFrame &&
    goingBackwards.jumpFrameCount <= rotationEndFrame;

  if (shouldRotate) {
    const TOTAL_TARGET = Math.PI / 2 / rotationAmountDivisor; // Adjust total rotation
    const rotationDuration = rotationEndFrame - rotationStartFrame;
    const INCREMENT = TOTAL_TARGET / rotationDuration;
    // old
    // const rotationDir = goingBackwards.turnDirection < 0 ? -1 : 1;

      // Use the raw lateral offset sign instead of turnDirection
  const rotationDir = goingBackwards.lateralOffsetSign || 0;

    first.angle += INCREMENT * rotationDir;

    // Store the jump rotation for use elsewhere
    goingBackwards.jumpRotation = INCREMENT * rotationDir;

    first[0] = cursor[0] + Math.cos(first.angle) * pushDistance;
    first[1] = cursor[1] + Math.sin(first.angle) * pushDistance;

    goingBackwards.jumpedFirstPosition = [first[0], first[1]];
    goingBackwards.jumpedCursorPosition = [cursor[0], cursor[1]];

    if (goingBackwards.totalRotation === undefined) {
      goingBackwards.totalRotation = 0;
    }
    goingBackwards.totalRotation += INCREMENT;
  }

  // Check if animation sequence is complete
  if (goingBackwards.jumpFrameCount >= jumpBackTimeLength) {
    // Reset everything
    goingBackwards.goingBackwards = false;
    goingBackwards.totalRotation = 0;
    goingBackwards.jumpRotation = 0;
    goingBackwards.jumpedFirstPosition = null;
    goingBackwards.jumpedCursorPosition = null;
    goingBackwards.jumpFrameCount = 0;
  }
}

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////
// function handleBackwardsJumpFast(
//   goingBackwards,
//   cursor,
//   first,
//   radius,
//   n,
//   isGrowing,
// ) {
//   // Early exit if creature is moving forward
//   if (isGrowing) {
//     goingBackwards.goingBackwards = false;
//     goingBackwards.totalRotation = 0;
//     goingBackwards.jumpRotation = 0;
//     goingBackwards.jumpedFirstPosition = null;
//     goingBackwards.jumpedCursorPosition = null;
//     goingBackwards.jumpFrameCount = 0;
//     return;
//   }

//   const rotationAmountDivisor = 2; // Divide total rotation by this (higher = less rotation)
//   const jumpBackTimeLength = 9; // Total frames: 3 push + 3 rotate + 3 drop

//   // Phase durations
//   const pushPhase = 3; // Frames 0-3: Push out
//   const rotatePhase = 3; // Frames 3-6: Rotate
//   const dropPhase = 3; // Frames 6-9: Drop back

//   // Initialize frame counter on first call
//   if (goingBackwards.jumpFrameCount === undefined) {
//     goingBackwards.jumpFrameCount = 0;
//   }

//   // Increment frame counter
//   goingBackwards.jumpFrameCount++;

//   const maxPushMultiplier = 1; // Maximum push distance multiplier
//   let pushMultiplier;
//   let shouldRotate = false;

//   // Phase 1: PUSH (frames 0-3)
//   if (goingBackwards.jumpFrameCount <= pushPhase) {
//     const progress = goingBackwards.jumpFrameCount / pushPhase;
//     pushMultiplier = maxPushMultiplier * progress; // 0 → 1

//     // Phase 2: ROTATE (frames 3-6)
//   } else if (goingBackwards.jumpFrameCount <= pushPhase + rotatePhase) {
//     pushMultiplier = maxPushMultiplier; // Hold at max
//     shouldRotate = true;

//     // Phase 3: DROP (frames 6-9)
//   } else {
//     const dropProgress =
//       (goingBackwards.jumpFrameCount - pushPhase - rotatePhase) / dropPhase;
//     pushMultiplier = maxPushMultiplier * (1 - dropProgress); // 1 → 0
//   }

//   const pushDistance = radius * pushMultiplier;
//   first[0] = cursor[0] + n[0] * pushDistance;
//   first[1] = cursor[1] + n[1] * pushDistance;

//   if (shouldRotate) {
//     const TOTAL_TARGET = Math.PI / 2 / rotationAmountDivisor;
//     const INCREMENT = TOTAL_TARGET / rotatePhase;
//     const rotationDir = goingBackwards.turnDirection < 0 ? -1 : 1;

//     first.angle += INCREMENT * rotationDir;
//     goingBackwards.jumpRotation = INCREMENT * rotationDir;

//     first[0] = cursor[0] + Math.cos(first.angle) * pushDistance;
//     first[1] = cursor[1] + Math.sin(first.angle) * pushDistance;

//     goingBackwards.jumpedFirstPosition = [first[0], first[1]];
//     goingBackwards.jumpedCursorPosition = [cursor[0], cursor[1]];

//     if (goingBackwards.totalRotation === undefined) {
//       goingBackwards.totalRotation = 0;
//     }
//     goingBackwards.totalRotation += INCREMENT;
//   }

//   // Check if animation sequence is complete
//   if (goingBackwards.jumpFrameCount >= jumpBackTimeLength) {
//     goingBackwards.goingBackwards = false;
//     goingBackwards.totalRotation = 0;
//     goingBackwards.jumpRotation = 0;
//     goingBackwards.jumpedFirstPosition = null;
//     goingBackwards.jumpedCursorPosition = null;
//     goingBackwards.jumpFrameCount = 0;
//   }
// }

export function solveFirst_withBackwardsDetect(
  stepsCenter,
  stepsAngle,
  frontSteps_distanceApart,
  goingBackwards,
  cursor,
  first,
  radius,
  secondMotionAngle,
  secondMotionMirroredAngle,
) {
  first.secondaryAngle = secondMotionAngle;
  first.mirroredSecondaryAngle = secondMotionMirroredAngle
    ? secondMotionMirroredAngle
    : secondMotionAngle;

  if (cursor.angle === undefined)
    cursor.angle = _getAngleBetweenPoints(first, cursor);

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

    while (delta > Math.PI) delta -= 2 * Math.PI;
    while (delta < -Math.PI) delta += 2 * Math.PI;

    // goingBackwards.rotationChange = Math.abs(delta);
    // goingBackwards.rotationDelta = delta;
  }

  goingBackwards.prevFirstAngle = first.angle;

  let prelimAngle = _getAngleFromXAxis(n);
  let angleDiff = prelimAngle - cursor.angle;
  first.angleDiff = angleDiff;
  first.angle = cursor.angle + angleDiff;

  first.radius = radius;
  first.index = 0;

  let vecToCursor = _subtractVec(cursor, stepsCenter);
  let distanceToCursor = Math.sqrt(dot(vecToCursor, vecToCursor));

  //  if (distanceToCursor < .06) {
  // console.log('distanceToCursor:', distanceToCursor);
  //  }
  let angleToCursor = _getAngleFromXAxis([
    vecToCursor[0] / distanceToCursor,
    vecToCursor[1] / distanceToCursor,
  ]);

let perpVector = [
  Math.cos(stepsAngle - Math.PI / 2),
  Math.sin(stepsAngle - Math.PI / 2),
];
let lateralOffset =
  vecToCursor[0] * perpVector[0] + vecToCursor[1] * perpVector[1];

// console.log('vecToCursor:', vecToCursor, 'perpVector:', perpVector, 'lateralOffset:', lateralOffset);

goingBackwards.lateralOffsetSign = Math.sign(lateralOffset);
goingBackwards.lateralOffsetSign = Math.sign(lateralOffset); // -1, 0, or 1

// console.log('lateralOffset:', lateralOffset, 'sign:', goingBackwards.lateralOffsetSign);
 

// Use the MAGNITUDE of vecToCursor for normalization, not step width
  let normalizedTurnDirection = lateralOffset / distanceToCursor;
  normalizedTurnDirection = Math.max(-1, Math.min(1, normalizedTurnDirection));
  goingBackwards.turnDirection = normalizedTurnDirection; // 1 is center
  // if (goingBackwards.turnDirection !== 1) {
  //    console.log('TURN DIRECTION', goingBackwards.turnDirection)

  // }

  ///////////////////////////// BACKWARD RANGE

  const MAX_BACKWARDS_DISTANCE = 0.15;
  const MIN_BACKWARDS_DISTANCE = 0.02;

  let isInBackwardsRange =
    distanceToCursor >= MIN_BACKWARDS_DISTANCE &&
    distanceToCursor <= MAX_BACKWARDS_DISTANCE;

  let relativeAngle = angleToCursor - stepsAngle;

  while (relativeAngle > Math.PI) relativeAngle -= 2 * Math.PI;
  while (relativeAngle < -Math.PI) relativeAngle += 2 * Math.PI;

  let clampedRelativeAngle = -Math.max(
    -Math.PI / 2,
    Math.min(Math.PI / 2, relativeAngle),
  );

  goingBackwards.turnRadius =
    distanceToCursor + distanceToCursor - frontSteps_distanceApart;

  goingBackwards.direction = clampedRelativeAngle;

  if (!goingBackwards.distanceHistory) {
    goingBackwards.distanceHistory = [];
  }

  goingBackwards.distanceHistory.push(distanceToCursor);

  const historyLengthBackwards = 6; // Keep this sensitive for backwards detection
  const historyLengthForwards = 4; // Make forward detection more responsive

  const historyLengthBackwardsStepLine = 2;

  let trigger_distanceJump = false;
  let trigger_turnJump = false;

  if (goingBackwards.distanceHistory.length > historyLengthBackwards) {
    goingBackwards.distanceHistory.shift();
  }
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

    trigger_distanceJump = isShrinking;
  }

  ///////////////////// TURN DIRECTION ////////////////////////////////////////////////

  if (!goingBackwards.turnDirectionHistory) {
    goingBackwards.turnDirectionHistory = [];
  }

  goingBackwards.turnDirectionHistory.push(goingBackwards.turnDirection);

  if (
    goingBackwards.turnDirectionHistory.length > historyLengthBackwardsStepLine
  ) {
    goingBackwards.turnDirectionHistory.shift();
  }

  // if (isShrinking) {
  //       console.log('jump back triggered by distance: ', isShrinking, Date.now());

  // }

  if (
    !isShrinking &&
    goingBackwards.turnDirectionHistory.length >= historyLengthBackwardsStepLine
  ) {
    let allBelowZero = true;
    for (let i = 0; i < goingBackwards.turnDirectionHistory.length; i++) {
      if (goingBackwards.turnDirectionHistory[i] >= 0.7) {
        // If ANY value is >= 0
        allBelowZero = false; // Then NOT all are below zero
        break;
      }
    }

    if (allBelowZero && isInBackwardsRange) {
      // If all ARE below zero
      //console.log('all turndirection ', Date.now())

      isShrinking = true;
    }

    trigger_turnJump = isShrinking;

    // if (isShrinking) {
    //   console.log("jump back triggered by turn: ", isShrinking, Date.now());
    // } else {
    //   console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    // }
  }
  const TURN_DIRECTION_MIN = 0.6;
  const DISTANCE_MIN = 0.04;

    let isGrowing = false;

  if (
    !isShrinking &&
   // !goingBackwards.goingBackwards &&
     goingBackwards.turnDirection < TURN_DIRECTION_MIN &&
    distanceToCursor < DISTANCE_MIN
  ) {
    console.log('EMERGENCY SHRINK', Date.now(), goingBackwards.goingBackwards)
    isShrinking = true;
  } 


  if (goingBackwards.distanceHistory.length >= historyLengthForwards) {
    isGrowing = true; 
    for (
      let i = goingBackwards.distanceHistory.length - historyLengthForwards;
      i < goingBackwards.distanceHistory.length;
      i++
    ) {
      if (
        goingBackwards.distanceHistory[i] <=
        goingBackwards.distanceHistory[i - 1]
      ) {
        isGrowing = false;
        break;
      }
      isShrinking = !isGrowing;
    }
  }

  if (isShrinking && !goingBackwards.goingBackwards && !isGrowing) {
    // Add !isGrowing check
    const COOLDOWN_FRAMES = trigger_distanceJump ? 60 : 15;

    if (goingBackwards.framesSinceLastJump === undefined) {
      goingBackwards.framesSinceLastJump = COOLDOWN_FRAMES;
    }

    if (goingBackwards.framesSinceLastJump >= COOLDOWN_FRAMES) {
      goingBackwards.goingBackwards = true;
      goingBackwards.totalRotation = 0;
      goingBackwards.backwardsAngle = first.angle;
      goingBackwards.framesSinceLastJump = 0;
    }
  }



  if (goingBackwards.goingBackwards) {
    handleBackwardsJump(goingBackwards, cursor, first, radius, n, isGrowing);
  }

    if (
    !goingBackwards.goingBackwards &&
    goingBackwards.framesSinceLastJump !== undefined
  ) {
    goingBackwards.framesSinceLastJump++;
  }

  if (goingBackwards.stiffnessBlend === undefined) {
    goingBackwards.stiffnessBlend = 0.0;
  }
 
  const stiffnessSpeed = 0.8;

  if (goingBackwards.goingBackwards) {
    goingBackwards.stiffnessBlend += stiffnessSpeed;
    if (goingBackwards.stiffnessBlend > 1.0)
      goingBackwards.stiffnessBlend = 1.0;
  } else {
    goingBackwards.stiffnessBlend -= stiffnessSpeed;
    if (goingBackwards.stiffnessBlend < 0.0)
      goingBackwards.stiffnessBlend = 0.0;
  }
}




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function solveFirst_inPlace(
  cursor,
  first,
  radius,
  secondMotionAngle,
  secondMotionMirroredAngle,
) {
  // update angles directly
  first.secondaryAngle = secondMotionAngle;
  first.mirroredSecondaryAngle = secondMotionMirroredAngle ?? secondMotionAngle;

  // initialize cursor.angle if missing
  if (cursor.angle === undefined)
    cursor.angle = _getAngleBetweenPoints(first, cursor);

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
  secondMotionMirroredAngle,
) {
  first.secondaryAngle = secondMotionAngle;
  first.mirroredSecondaryAngle = secondMotionMirroredAngle
    ? secondMotionMirroredAngle
    : secondMotionAngle;

  if (cursor.angle === undefined)
    cursor.angle = _getAngleBetweenPoints(first, cursor);

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
export function solveProcJoint(
  index,
  ahead,
  joint,
  radius,
  maxBend,
  motion2Start,
  motion3Start, // spine // turning point for angle that will layer on third angle
  motion2End,
  secondMotionClamps,
  // secondMotionScalars,
) {
  // let curveAngleScalar = 1;
  let inMotionRange = index >= motion2Start && index <= motion2End;
  let setSecondary = ahead.secondaryAngle && inMotionRange;
  let setThird = index > motion3Start && inMotionRange;

  if (setSecondary) {
    maxBend = TAU / secondMotionClamps[index - motion2Start];
    // curveAngleScalar = secondMotionScalars[index - motion2Start];
  } else {
    maxBend = TAU / maxBend;
  }

  let dirVec = minus(joint, ahead);
  let procBlend = constrainBlendClampAngle(
    index,
    ahead,
    joint,
    dirVec,
    radius,
    maxBend,
  );

  const finalAngle = { angle: ahead.angle + procBlend.angle };
  // let newAngle = ahead.angle + procBlend.angle;

  updateJointSecondaryAngle(
    setSecondary,
    joint,
    finalAngle,
    ahead.secondaryAngle,
    procBlend.angle,
  );
  updateJointThirdAngle(
    setThird,
    joint,
    finalAngle,
    ahead.mirroredSecondaryAngle,
    procBlend.angle,
  );

  updateJoint(
    index,
    joint,
    ahead,
    finalAngle.angle,
    radius,
    procBlend.angle,
    procBlend.direction,
  );
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
  secondMotionClamps,
) {
  const inMotionRange = index >= motion2Start && index <= motion2End;
  const setSecondary = ahead.secondaryAngle && inMotionRange;
  const setThird = index > motion3Start && inMotionRange;

  if (setSecondary) {
    maxBend = (Math.PI * 2) / secondMotionClamps[index - motion2Start];
  } else {
    maxBend = (Math.PI * 2) / maxBend;
  }

  // reuse joint.direction array to avoid allocation
  const dir = joint.direction || (joint.direction = [0, 0]);
  _subtractVec_inPlace(joint, ahead, dir); // reuses dir array

  const procBlend = constrainBlendClampAngle_inPlaceOld(
    index,
    ahead,
    joint,
    dir,
    radius,
    maxBend,
    dir,
  );

  const finalAngle = { angle: ahead.angle + procBlend.angle };

  updateJointSecondaryAngle(
    setSecondary,
    joint,
    finalAngle,
    ahead.secondaryAngle,
    procBlend.angle,
  );
  updateJointThirdAngle(
    setThird,
    joint,
    finalAngle,
    ahead.mirroredSecondaryAngle,
    procBlend.angle,
  );

  updateJoint(
    index,
    joint,
    ahead,
    finalAngle.angle,
    radius,
    procBlend.angle,
    procBlend.direction,
  );
}

export const TAU = Math.PI * 2;

// Use for tail, made separate function instead of conditional checking in original function
export function mir_solveProcJoint(
  index,
  ahead,
  joint,
  radius,
  maxBend,
  motion2Start,
  motion3Start, // spine // turning point for angle that will layer on third angle
  motion2End,
  secondMotionClamps,
  // secondMotionScalars,
) {
  // let curveAngleScalar = 1;
  let inMotionRange = index >= motion2Start && index <= motion2End;
  let needsSecondary = ahead.secondaryAngle && inMotionRange;
  let needsThird = index > motion3Start && inMotionRange;

  if (needsSecondary) {
    maxBend = TAU / secondMotionClamps[index - motion2Start];
    // curveAngleScalar = secondMotionScalars[index - motion2Start];
  } else {
    maxBend = TAU / maxBend;
  }

  let dirVec = minus(joint, ahead);
  let procBlend = constrainBlendClampAngle(
    index,
    ahead,
    joint,
    dirVec,
    radius,
    maxBend,
  );

  let newAngle = ahead.angle + procBlend.angle;
  if (needsSecondary) {
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

  setJoint(
    index,
    joint,
    ahead,
    newAngle,
    radius,
    procBlend.angle,
    procBlend.direction,
  );
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
  stiffnessBlend,
) {
  const inMotionRange = index >= motion2Start && index <= motion2End;
  const setSecondary = !goingBackwards && ahead.secondaryAngle && inMotionRange;

  const setThird = !goingBackwards && index > motion3Start && inMotionRange;

  if (setSecondary) {
    maxBend = (Math.PI * 2) / secondMotionClamps[index - motion2Start];
  } else {
    maxBend = (Math.PI * 2) / maxBend;
  }

  // reuse joint.direction array to avoid allocation
  const dir = joint.direction || (joint.direction = [0, 0]);
  _subtractVec_inPlace(joint, ahead, dir); // reuses dir array

  const procBlend = constrainBlendClampAngle_inPlace(
    index,
    ahead,
    joint,
    dir,
    radius,
    maxBend,
    goingBackwards,
    stiffnessBlend,
    dir,
  );

  const finalAngle = { angle: ahead.angle + procBlend.angle };

  if (!goingBackwards) {
    updateJointSecondaryAngle(
      setSecondary,
      joint,
      finalAngle,
      ahead.secondaryAngle,
      procBlend.angle,
    );
    updateJointThirdAngle(
      setThird,
      joint,
      finalAngle,
      ahead.mirroredSecondaryAngle,
      procBlend.angle,
    );
  } else {
    // Explicitly preserve existing values
    joint.secondaryAngle = ahead.secondaryAngle;
    joint.mirroredSecondaryAngle = ahead.mirroredSecondaryAngle;
  }

  updateJoint(
    index,
    joint,
    ahead,
    finalAngle.angle,
    radius,
    procBlend.angle,
    procBlend.direction,
  );
}
