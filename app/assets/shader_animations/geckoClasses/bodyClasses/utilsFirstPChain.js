// import {
//   dot,
//   minus,
//   _subtractVec,
//   _subtractVec_inPlace,
//   _getAngleBetweenPoints,
//   _getAngleFromXAxis,
//   _getAngleFromXAxis_inPlace,
// } from "../../utils";

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////
// export function handleBackwardsJump(
//   goingBackwards,
//   cursor,
//   first,
//   radius,
//   n,
//   isGrowing,
// ) {
//   // Early exit if creature is moving forward
//   if (isGrowing) {
//     // console.log('Aborting backwards jump - creature moving forward');
//     goingBackwards.goingBackwards = false;
//     goingBackwards.totalRotation = 0;
//     goingBackwards.jumpRotation = 0;
//     goingBackwards.jumpedFirstPosition = null;
//     goingBackwards.jumpedCursorPosition = null;
//     goingBackwards.jumpFrameCount = 0;
//     // console.log('IS GROWING ----- RETURN')
//     return;
//   }

//   const rotationAmountDivisor = 2; // Divide total rotation by this (higher = less rotation)

//   const jumpBackTimeLength = 20; // Total frames for the entire animation sequence
//   const useReleasePhase = true; // Set to true to gradually decrease, false to stay pushed out

//   // Rotation timing controls
//   const rotationStartFrame = 0; // When to start rotating
//   const rotationEndFrame = 10; // When to stop rotating

//   // Initialize frame counter on first call
//   if (goingBackwards.jumpFrameCount === undefined) {
//     goingBackwards.jumpFrameCount = 0;
//   }

//   // Increment frame counter
//   goingBackwards.jumpFrameCount++;

//   // Define the push-out wave phases (in frames)
//   const quickPushPhase = 5; // Frames 0-5: Quick push to 75% (6/8)
//   const slowPushPhase = 10; // Frames 5-15: Slow push to 100% (8/8)
//   const holdPhase = useReleasePhase ? 30 : 45; // Adjust hold based on whether we release
//   const releasePhase = 15; // Frames 45-60: Slow release back to normal (only if enabled)

//   const maxPushMultiplier = 3; // Maximum push distance multiplier

//   let pushMultiplier;

//   if (goingBackwards.jumpFrameCount <= quickPushPhase) {
//     // Quick push to 75% of max
//     const progress = goingBackwards.jumpFrameCount / quickPushPhase;
//     pushMultiplier = maxPushMultiplier * 0.75 * progress;
//   } else if (goingBackwards.jumpFrameCount <= quickPushPhase + slowPushPhase) {
//     // Slow push from 75% to 100%
//     const progress =
//       (goingBackwards.jumpFrameCount - quickPushPhase) / slowPushPhase;
//     pushMultiplier = maxPushMultiplier * (0.75 + 0.25 * progress);
//   } else if (
//     goingBackwards.jumpFrameCount <=
//     quickPushPhase + slowPushPhase + holdPhase
//   ) {
//     // Hold at maximum
//     pushMultiplier = maxPushMultiplier;
//   } else if (useReleasePhase) {
//     // Slow release back down (only if enabled)
//     const releaseProgress =
//       (goingBackwards.jumpFrameCount -
//         quickPushPhase -
//         slowPushPhase -
//         holdPhase) /
//       releasePhase;
//     pushMultiplier = maxPushMultiplier * (1 - releaseProgress);
//   } else {
//     // Stay at max if release phase is disabled
//     pushMultiplier = maxPushMultiplier;
//   }

//   const pushDistance = radius * pushMultiplier;
//   first[0] = cursor[0] + n[0] * pushDistance;
//   first[1] = cursor[1] + n[1] * pushDistance;

//   // Only rotate if within the rotation frame range
//   const shouldRotate =
//     goingBackwards.jumpFrameCount >= rotationStartFrame &&
//     goingBackwards.jumpFrameCount <= rotationEndFrame;

//   // always rotate some amount even when 0

//   if (shouldRotate) {
//     const TOTAL_TARGET = Math.PI / 2 / rotationAmountDivisor;
//     const rotationDuration = rotationEndFrame - rotationStartFrame;
//     const INCREMENT = TOTAL_TARGET / rotationDuration;

//     // Use rotation direction, fallback to lateral offset sign if no rotation detected
//     let rotationDir = goingBackwards.rotationDir;

//     // If no rotation detected (rotationDir is 0), use lateral offset as fallback
//     if (rotationDir === 0) {
//       rotationDir = goingBackwards.lateralOffsetSign || 1;
//     }

//     first.angle += INCREMENT * rotationDir;

//     //   if (shouldRotate) {
//     //     const TOTAL_TARGET = Math.PI / 2 / rotationAmountDivisor; // Adjust total rotation
//     //     const rotationDuration = rotationEndFrame - rotationStartFrame;
//     //     const INCREMENT = TOTAL_TARGET / rotationDuration;

//     //   const rotationDir = goingBackwards.rotationDir;
//     //     first.angle += INCREMENT * rotationDir;

//     // Store the jump rotation for use elsewhere
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
//     // Reset everything
//     goingBackwards.goingBackwards = false;
//     goingBackwards.totalRotation = 0;
//     goingBackwards.jumpRotation = 0;
//     goingBackwards.jumpedFirstPosition = null;
//     goingBackwards.jumpedCursorPosition = null;
//     goingBackwards.jumpFrameCount = 0;
//   }
// }

// export function solveFirst_withBackwardsDetect(
//   stepsCenter,
//   stepsAngle,
//   frontSteps_distanceApart,
//   goingBackwards,
//   cursor,
//   first,
//   radius,
//   secondMotionAngle,
//   secondMotionMirroredAngle,
// ) {
//   const angleAtStart = first.angle;

//   first.secondaryAngle = secondMotionAngle;
//   first.mirroredSecondaryAngle = secondMotionMirroredAngle
//     ? secondMotionMirroredAngle
//     : secondMotionAngle;

//   if (cursor.angle === undefined)
//     cursor.angle = _getAngleBetweenPoints(first, cursor);

//   let dir = _subtractVec(first, cursor);
//   let d = Math.sqrt(dot(dir, dir));

//   if (d === 0) {
//     first[0] = cursor[0] + radius;
//     first[1] = cursor[1];
//     first.angle = 0;
//     first.radius = radius;
//     first.index = 0;
//     return;
//   }

//   let n = [dir[0] / d, dir[1] / d];
//   first[0] = cursor[0] + n[0] * radius;
//   first[1] = cursor[1] + n[1] * radius;

//   //   goingBackwards.prevFirstAngle = first.angle;

//   let prelimAngle = _getAngleFromXAxis(n);
//   let angleDiff = prelimAngle - cursor.angle;
//   first.angleDiff = angleDiff;
//   first.angle = cursor.angle + angleDiff;

//   // NOW CALCULATE THE ROTATION DIRECTION
//   if (angleAtStart !== undefined) {
//     let delta = first.angle - angleAtStart;
//     // console.log(delta)

//     while (delta > Math.PI) delta -= 2 * Math.PI;
//     while (delta < -Math.PI) delta += 2 * Math.PI;

//     goingBackwards.rotationDir = Math.sign(delta); // -1 or 1
//   }

//   first.radius = radius;
//   first.index = 0;

//   let vecToCursor = _subtractVec(cursor, stepsCenter);
//   let distanceToCursor = Math.sqrt(dot(vecToCursor, vecToCursor));

//   //  if (distanceToCursor < .06) {
//   // console.log('distanceToCursor:', distanceToCursor);
//   //  }
//   let angleToCursor = _getAngleFromXAxis([
//     vecToCursor[0] / distanceToCursor,
//     vecToCursor[1] / distanceToCursor,
//   ]);

//   let perpVector = [
//     Math.cos(stepsAngle - Math.PI / 2),
//     Math.sin(stepsAngle - Math.PI / 2),
//   ];
//   let lateralOffset =
//     vecToCursor[0] * perpVector[0] + vecToCursor[1] * perpVector[1];

//   goingBackwards.lateralOffsetSign = Math.sign(lateralOffset);
//   goingBackwards.lateralOffsetSign = Math.sign(lateralOffset); // -1, 0, or 1

//   // Use the MAGNITUDE of vecToCursor for normalization, not step width
//   let normalizedTurnDirection = lateralOffset / distanceToCursor;
//   normalizedTurnDirection = Math.max(-1, Math.min(1, normalizedTurnDirection));
//   goingBackwards.turnDirection = normalizedTurnDirection; // 1 is center
//   // if (goingBackwards.turnDirection !== 1) {
//   //    console.log('TURN DIRECTION', goingBackwards.turnDirection)

//   // }

//   ///////////////////////////// BACKWARD RANGE

//   const MAX_BACKWARDS_DISTANCE = 0.15;
//   const MIN_BACKWARDS_DISTANCE = 0.02;

//   let isInBackwardsRange =
//     distanceToCursor >= MIN_BACKWARDS_DISTANCE &&
//     distanceToCursor <= MAX_BACKWARDS_DISTANCE;

//   let relativeAngle = angleToCursor - stepsAngle;

//   while (relativeAngle > Math.PI) relativeAngle -= 2 * Math.PI;
//   while (relativeAngle < -Math.PI) relativeAngle += 2 * Math.PI;

//   let clampedRelativeAngle = -Math.max(
//     -Math.PI / 2,
//     Math.min(Math.PI / 2, relativeAngle),
//   );

//   goingBackwards.turnRadius =
//     distanceToCursor + distanceToCursor - frontSteps_distanceApart;

//   goingBackwards.direction = clampedRelativeAngle;

//   if (!goingBackwards.distanceHistory) {
//     goingBackwards.distanceHistory = [];
//   }

//   goingBackwards.distanceHistory.push(distanceToCursor);

//   const historyLengthBackwards = 6; // Keep this sensitive for backwards detection
//   const historyLengthForwards = 4; // Make forward detection more responsive

//   const historyLengthBackwardsStepLine = 2;

//   let trigger_distanceJump = false;
//   let trigger_turnJump = false;

//   if (goingBackwards.distanceHistory.length > historyLengthBackwards) {
//     goingBackwards.distanceHistory.shift();
//   }
//   let isShrinking = false;

//   if (
//     goingBackwards.distanceHistory.length >= historyLengthBackwards &&
//     isInBackwardsRange
//   ) {
//     isShrinking = true;

//     let deltas = [];
//     for (let i = 1; i < goingBackwards.distanceHistory.length; i++) {
//       const prev = goingBackwards.distanceHistory[i - 1];
//       const curr = goingBackwards.distanceHistory[i];
//       const diff = curr - prev;

//       deltas.push(diff);

//       if (curr >= prev) {
//         isShrinking = false;
//         break;
//       }
//     }

//     trigger_distanceJump = isShrinking;
//   }

//   ///////////////////// TURN DIRECTION ////////////////////////////////////////////////

//   if (!goingBackwards.turnDirectionHistory) {
//     goingBackwards.turnDirectionHistory = [];
//   }

//   goingBackwards.turnDirectionHistory.push(goingBackwards.turnDirection);

//   if (
//     goingBackwards.turnDirectionHistory.length > historyLengthBackwardsStepLine
//   ) {
//     goingBackwards.turnDirectionHistory.shift();
//   }

//   // if (isShrinking) {
//   //       console.log('jump back triggered by distance: ', isShrinking, Date.now());

//   // }


//   if (
//     !isShrinking &&
//     goingBackwards.turnDirectionHistory.length >= historyLengthBackwardsStepLine
//   ) {
//     let allBelowZero = true;
//     for (let i = 0; i < goingBackwards.turnDirectionHistory.length; i++) {
//       if (goingBackwards.turnDirectionHistory[i] >= 0.5) {
//         // If ANY value is >= 0
//         allBelowZero = false; // Then NOT all are below zero
//         break;
//       }
//     }

//     if (allBelowZero && isInBackwardsRange) {
//       // If all ARE below zero
//       //console.log('all turndirection ', Date.now())

//       isShrinking = true;
//     }

//     trigger_turnJump = isShrinking;

//     // if (isShrinking) {
//     //   console.log("jump back triggered by turn: ", isShrinking, Date.now());
//     // } else {
//     //   console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
//     // }
//   }

//   const DISTANCE_MIN = 0.04;
//     const TURN_DIRECTION_MIN = 0.6;

//   if (
//     !isShrinking &&
//     // !goingBackwards.goingBackwards &&
//     //  goingBackwards.turnDirection < TURN_DIRECTION_MIN &&
//     distanceToCursor < DISTANCE_MIN
//   ) {
//     console.log("EMERGENCY SHRINK", Date.now(), goingBackwards.goingBackwards);
//     isShrinking = true;
//   }

//   //const GROW_DISTANCE_MIN = 0.06; // pick your min

// const GROW_DISTANCE_MIN = DISTANCE_MIN + .01;// + 0.01;

//   let isGrowing = false;

// if (goingBackwards.distanceHistory.length >= historyLengthForwards) {
//   let increasing = true;
//   let allAboveMin = true;

//   for (
//     let i = goingBackwards.distanceHistory.length - historyLengthForwards;
//     i < goingBackwards.distanceHistory.length;
//     i++
//   ) {
//     if (
//       goingBackwards.distanceHistory[i] <=
//       goingBackwards.distanceHistory[i - 1]
//     ) {
//       increasing = false;
//     }

//     if (goingBackwards.distanceHistory[i] < GROW_DISTANCE_MIN) {
//         // console.log('grooowwwwwwwwwwwwwwwwww', Date.now())
//       allAboveMin = false;
//     }
//   }

//   isGrowing = increasing || allAboveMin;
// }


// //   let isGrowing = false;

// //   if (goingBackwards.distanceHistory.length >= historyLengthForwards) {
// //     isGrowing = true;
// //     for (
// //       let i = goingBackwards.distanceHistory.length - historyLengthForwards;
// //       i < goingBackwards.distanceHistory.length;
// //       i++
// //     ) {
// //       if (
// //         goingBackwards.distanceHistory[i] <=
// //         goingBackwards.distanceHistory[i - 1]
// //       ) {
// //         isGrowing = false;
// //         break;
// //       }
// //     }
// //   }

//   if (isShrinking && !goingBackwards.goingBackwards && !isGrowing) {
//     // Add !isGrowing check
//     const COOLDOWN_FRAMES = trigger_distanceJump ? 60 : 20;

//     if (goingBackwards.framesSinceLastJump === undefined) {
//       goingBackwards.framesSinceLastJump = COOLDOWN_FRAMES;
//     }

//     if (goingBackwards.framesSinceLastJump >= COOLDOWN_FRAMES) {
//       goingBackwards.goingBackwards = true;
//       goingBackwards.totalRotation = 0;
//       goingBackwards.backwardsAngle = first.angle;
//       goingBackwards.framesSinceLastJump = 0;
//     }
//   }

//   if (
//     !goingBackwards.goingBackwards &&
//     goingBackwards.framesSinceLastJump !== undefined
//   ) {
//     goingBackwards.framesSinceLastJump++;
//   }

//   if (goingBackwards.goingBackwards) {
//     handleBackwardsJump(goingBackwards, cursor, first, radius, n, isGrowing);
//   }

//   if (goingBackwards.stiffnessBlend === undefined) {
//     goingBackwards.stiffnessBlend = 0.0;
//   }

//   const stiffnessSpeed = 0.8;

//   if (goingBackwards.goingBackwards) {
//     goingBackwards.stiffnessBlend += stiffnessSpeed;
//     if (goingBackwards.stiffnessBlend > 1.0)
//       goingBackwards.stiffnessBlend = 1.0;
//   } else {
//     goingBackwards.stiffnessBlend -= stiffnessSpeed;
//     if (goingBackwards.stiffnessBlend < 0.0)
//       goingBackwards.stiffnessBlend = 0.0;
//   }

//   // if (isShrinking) {
//   //   console.log(Date.now())
//   // }

//   // if (isGrowing) {
//   //       console.log(``, Date.now())
//   // }
// }



import {
  dot,
  minus,
  _subtractVec,
  _subtractVec_inPlace,
  _getAngleBetweenPoints,
  _getAngleFromXAxis,
  _getAngleFromXAxis_inPlace,
} from "../../utils";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function handleBackwardsJump(
  goingBackwards,
  cursor,
  first,
  radius,
  n,
  isGrowing,
) {
  // Early exit if creature is moving forward
  if (isGrowing) {
    goingBackwards.goingBackwards = false;
    goingBackwards.totalRotation = 0;
    goingBackwards.jumpRotation = 0;
    goingBackwards.jumpFrameCount = 0;
    return;
  }

  const rotationAmountDivisor = 2;
  const jumpBackTimeLength = 20;
  const useReleasePhase = true;

  // Rotation timing controls
  const rotationStartFrame = 0;
  const rotationEndFrame = 10;

  // Initialize frame counter on first call
  if (goingBackwards.jumpFrameCount === undefined) {
    goingBackwards.jumpFrameCount = 0;
  }

  goingBackwards.jumpFrameCount++;

  // Define the push-out wave phases (in frames)
  const quickPushPhase = 5;
  const slowPushPhase = 10;
  const holdPhase = useReleasePhase ? 30 : 45;
  const releasePhase = 15;

  const maxPushMultiplier = 3;

  let pushMultiplier;

  if (goingBackwards.jumpFrameCount <= quickPushPhase) {
    const progress = goingBackwards.jumpFrameCount / quickPushPhase;
    pushMultiplier = maxPushMultiplier * 0.75 * progress;
  } else if (goingBackwards.jumpFrameCount <= quickPushPhase + slowPushPhase) {
    const progress =
      (goingBackwards.jumpFrameCount - quickPushPhase) / slowPushPhase;
    pushMultiplier = maxPushMultiplier * (0.75 + 0.25 * progress);
  } else if (
    goingBackwards.jumpFrameCount <=
    quickPushPhase + slowPushPhase + holdPhase
  ) {
    pushMultiplier = maxPushMultiplier;
  } else if (useReleasePhase) {
    const releaseProgress =
      (goingBackwards.jumpFrameCount -
        quickPushPhase -
        slowPushPhase -
        holdPhase) /
      releasePhase;
    pushMultiplier = maxPushMultiplier * (1 - releaseProgress);
  } else {
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
    const TOTAL_TARGET = Math.PI / 2 / rotationAmountDivisor;
    const rotationDuration = rotationEndFrame - rotationStartFrame;
    const INCREMENT = TOTAL_TARGET / rotationDuration;

    // Use rotation direction, fallback to lateral offset sign if no rotation detected
    let rotationDir = goingBackwards.rotationDir;

    // If no rotation detected (rotationDir is 0), use lateral offset as fallback
    if (rotationDir === 0) {
      rotationDir = goingBackwards.lateralOffsetSign || 1;
    }

    first.angle += INCREMENT * rotationDir;

    // Store the jump rotation for use elsewhere
    goingBackwards.jumpRotation = INCREMENT * rotationDir;

    first[0] = cursor[0] + Math.cos(first.angle) * pushDistance;
    first[1] = cursor[1] + Math.sin(first.angle) * pushDistance;

    // Reuse pre-allocated arrays instead of creating new ones
    goingBackwards.jumpedFirstPosition[0] = first[0];
    goingBackwards.jumpedFirstPosition[1] = first[1];
    goingBackwards.jumpedCursorPosition[0] = cursor[0];
    goingBackwards.jumpedCursorPosition[1] = cursor[1];

    if (goingBackwards.totalRotation === undefined) {
      goingBackwards.totalRotation = 0;
    }
    goingBackwards.totalRotation += INCREMENT;
  }

  // Check if animation sequence is complete
  if (goingBackwards.jumpFrameCount >= jumpBackTimeLength) {
    goingBackwards.goingBackwards = false;
    goingBackwards.totalRotation = 0;
    goingBackwards.jumpRotation = 0;
    goingBackwards.jumpFrameCount = 0;
  }
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
  secondMotionMirroredAngle,
) {
  // Initialize buffers on first call
  if (!goingBackwards._dirBuffer) {
    goingBackwards._dirBuffer = [0, 0];
    goingBackwards._nBuffer = [0, 0];
    goingBackwards._vecToCursorBuffer = [0, 0];
    goingBackwards._perpVectorBuffer = [0, 0];
    goingBackwards._normalizedBuffer = [0, 0];
    goingBackwards.jumpedFirstPosition = [0, 0];
    goingBackwards.jumpedCursorPosition = [0, 0];
  }

  const angleAtStart = first.angle;

  first.secondaryAngle = secondMotionAngle;
  first.mirroredSecondaryAngle = secondMotionMirroredAngle
    ? secondMotionMirroredAngle
    : secondMotionAngle;

  if (cursor.angle === undefined)
    cursor.angle = _getAngleBetweenPoints(first, cursor);

  // OPTIMIZED: Use pre-allocated buffer
  const dir = goingBackwards._dirBuffer;
  _subtractVec_inPlace(first, cursor, dir);
  let d = Math.sqrt(dot(dir, dir));

  if (d === 0) {
    first[0] = cursor[0] + radius;
    first[1] = cursor[1];
    first.angle = 0;
    first.radius = radius;
    first.index = 0;
    return;
  }

  // OPTIMIZED: Use pre-allocated buffer
  const n = goingBackwards._nBuffer;
  n[0] = dir[0] / d;
  n[1] = dir[1] / d;
  
  first[0] = cursor[0] + n[0] * radius;
  first[1] = cursor[1] + n[1] * radius;

  let prelimAngle = _getAngleFromXAxis(n);
  let angleDiff = prelimAngle - cursor.angle;
  first.angleDiff = angleDiff;
  first.angle = cursor.angle + angleDiff;

  // NOW CALCULATE THE ROTATION DIRECTION
  if (angleAtStart !== undefined) {
    let delta = first.angle - angleAtStart;

    while (delta > Math.PI) delta -= 2 * Math.PI;
    while (delta < -Math.PI) delta += 2 * Math.PI;

    goingBackwards.rotationDir = Math.sign(delta);
  }

  first.radius = radius;
  first.index = 0;

  // OPTIMIZED: Use pre-allocated buffer
  const vecToCursor = goingBackwards._vecToCursorBuffer;
  _subtractVec_inPlace(cursor, stepsCenter, vecToCursor);
  let distanceToCursor = Math.sqrt(dot(vecToCursor, vecToCursor));

  // OPTIMIZED: Use pre-allocated buffer for normalized vector
  const normalizedVec = goingBackwards._normalizedBuffer;
  normalizedVec[0] = vecToCursor[0] / distanceToCursor;
  normalizedVec[1] = vecToCursor[1] / distanceToCursor;
  let angleToCursor = _getAngleFromXAxis(normalizedVec);

  // OPTIMIZED: Use pre-allocated buffer
  const perpVector = goingBackwards._perpVectorBuffer;
  perpVector[0] = Math.cos(stepsAngle - Math.PI / 2);
  perpVector[1] = Math.sin(stepsAngle - Math.PI / 2);
  
  let lateralOffset =
    vecToCursor[0] * perpVector[0] + vecToCursor[1] * perpVector[1];

  goingBackwards.lateralOffsetSign = Math.sign(lateralOffset);

  // Use the MAGNITUDE of vecToCursor for normalization, not step width
  let normalizedTurnDirection = lateralOffset / distanceToCursor;
  normalizedTurnDirection = Math.max(-1, Math.min(1, normalizedTurnDirection));
  goingBackwards.turnDirection = normalizedTurnDirection;

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

  const historyLengthBackwards = 6;
  const historyLengthForwards = 4;
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

    // OPTIMIZED: Removed unused 'deltas' array allocation
    for (let i = 1; i < goingBackwards.distanceHistory.length; i++) {
      const prev = goingBackwards.distanceHistory[i - 1];
      const curr = goingBackwards.distanceHistory[i];

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

  if (
    !isShrinking &&
    goingBackwards.turnDirectionHistory.length >= historyLengthBackwardsStepLine
  ) {
    let allBelowZero = true;
    for (let i = 0; i < goingBackwards.turnDirectionHistory.length; i++) {
      if (goingBackwards.turnDirectionHistory[i] >= 0.5) {
        allBelowZero = false;
        break;
      }
    }

    if (allBelowZero && isInBackwardsRange) {
      isShrinking = true;
    }

    trigger_turnJump = isShrinking;
  }

  const DISTANCE_MIN = 0.04;

  if (!isShrinking && distanceToCursor < DISTANCE_MIN) {
    console.log("EMERGENCY SHRINK", Date.now(), goingBackwards.goingBackwards);
    isShrinking = true;
  }

  const GROW_DISTANCE_MIN = DISTANCE_MIN + 0.01;

  let isGrowing = false;

  if (goingBackwards.distanceHistory.length >= historyLengthForwards) {
    let increasing = true;
    let allAboveMin = true;

    for (
      let i = goingBackwards.distanceHistory.length - historyLengthForwards;
      i < goingBackwards.distanceHistory.length;
      i++
    ) {
      if (
        goingBackwards.distanceHistory[i] <=
        goingBackwards.distanceHistory[i - 1]
      ) {
        increasing = false;
      }

      if (goingBackwards.distanceHistory[i] < GROW_DISTANCE_MIN) {
        allAboveMin = false;
      }
    }

    isGrowing = increasing || allAboveMin;
  }

  if (isShrinking && !goingBackwards.goingBackwards && !isGrowing) {
    const COOLDOWN_FRAMES = trigger_distanceJump ? 60 : 20;

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

  if (
    !goingBackwards.goingBackwards &&
    goingBackwards.framesSinceLastJump !== undefined
  ) {
    goingBackwards.framesSinceLastJump++;
  }

  if (goingBackwards.goingBackwards) {
    handleBackwardsJump(goingBackwards, cursor, first, radius, n, isGrowing);
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