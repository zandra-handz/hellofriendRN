 

import {
  dot, 
  _subtractVec,
  _subtractVec_inPlace,
  _getAngleBetweenPoints,
  _getAngleFromXAxis,
  _getAngleFromXAxis_inPlace,
} from "../../utils";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function handleBackwardsJump_inPlace(
  goingBackwards,
  cursor,
  first, 
  jointAngles,
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

  let firstJointAngle = jointAngles[0];

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

    firstJointAngle +=  INCREMENT * rotationDir;

    // Store the jump rotation for use elsewhere
    goingBackwards.jumpRotation = INCREMENT * rotationDir;

    first[0] = cursor[0] + Math.cos(firstJointAngle) * pushDistance;
    first[1] = cursor[1] + Math.sin(firstJointAngle) * pushDistance;

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

  return firstJointAngle;


}

 




// const MAX_BACKWARDS_DISTANCE = 0.15;
// const MIN_BACKWARDS_DISTANCE = 0.02;

// const HISTORY_BACKWARDS = 6;
// const HISTORY_FORWARDS = 4;
// const HISTORY_STEP_LINE = 2;

// const DISTANCE_MIN = 0.04;
// const GROW_DISTANCE_MIN = 0.05;

// const STIFFNESS_SPEED = 0.8;
// const HALF_PI = Math.PI * 0.5;
// const TWO_PI = Math.PI * 2;











// export function solveFirst_withBackwardsDetect(
//   stepsCenter,
//   stepsAngle,
//   frontSteps_distanceApart,
//   goingBackwards,
//   cursor,
//   first,
//   jointRadii,
//   jointIndices,
//   jointAngles,
//   jointSecondaryAngles,
//   jointmirroredSecondaryAngles,
//   jointAngleDiffs,
//   secondMotionAngle,
//   secondMotionMirroredAngle,
// ) {
//   // Buffers are already preallocated in constructor - no need to check
  
//   const angleAtStart = jointAngles[0];
//   const radius = jointRadii[0];

//   jointSecondaryAngles[0] = secondMotionAngle;
//   jointmirroredSecondaryAngles[0] = secondMotionMirroredAngle
//     ? secondMotionMirroredAngle
//     : secondMotionAngle;

//   if (cursor.angle === undefined)
//     cursor.angle = _getAngleBetweenPoints(first, cursor);

//   // Use pre-allocated buffers
//   const dir = goingBackwards._dirBuffer;
//   _subtractVec_inPlace(first, cursor, dir);
//   let d = Math.sqrt(dot(dir, dir));

//   if (d === 0) {
//     first[0] = cursor[0] + jointRadii[0];
//     first[1] = cursor[1];
//     jointAngles[0] = 0;
//     jointIndices[0] = 0;
//     return;
//   }

//   const n = goingBackwards._nBuffer;
//   n[0] = dir[0] / d;
//   n[1] = dir[1] / d;
  
//   first[0] = cursor[0] + n[0] * radius;
//   first[1] = cursor[1] + n[1] * radius;

//   let prelimAngle = _getAngleFromXAxis(n);
//   let angleDiff = prelimAngle - cursor.angle;
//   jointAngleDiffs[0] = angleDiff;
//   jointAngles[0] = cursor.angle + angleDiff;

//   if (angleAtStart !== undefined) {
//     let delta = jointAngles[0] - angleAtStart;
//     while (delta > Math.PI) delta -= TWO_PI;
//     while (delta < -Math.PI) delta += TWO_PI;
//     goingBackwards.rotationDir = Math.sign(delta);
//   }

//   jointRadii[0] = radius;
//   jointIndices[0] = 0;

//   const vecToCursor = goingBackwards._vecToCursorBuffer;
//   _subtractVec_inPlace(cursor, stepsCenter, vecToCursor);
//   let distanceToCursor = Math.sqrt(dot(vecToCursor, vecToCursor));

//   const normalizedVec = goingBackwards._normalizedBuffer;
//   normalizedVec[0] = vecToCursor[0] / distanceToCursor;
//   normalizedVec[1] = vecToCursor[1] / distanceToCursor;
//   let angleToCursor = _getAngleFromXAxis(normalizedVec);

//   const perpVector = goingBackwards._perpVectorBuffer;
//   perpVector[0] = Math.cos(stepsAngle - HALF_PI);
//   perpVector[1] = Math.sin(stepsAngle - HALF_PI);
  
//   let lateralOffset =
//     vecToCursor[0] * perpVector[0] + vecToCursor[1] * perpVector[1];

//   goingBackwards.lateralOffsetSign = Math.sign(lateralOffset);

//   let normalizedTurnDirection = lateralOffset / distanceToCursor;
//   normalizedTurnDirection = Math.max(-1, Math.min(1, normalizedTurnDirection));
//   goingBackwards.turnDirection = normalizedTurnDirection;

//   ///////////////////////////// BACKWARD RANGE

//   // const MAX_BACKWARDS_DISTANCE = 0.15;
//   // const MIN_BACKWARDS_DISTANCE = 0.02;

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
 
//   goingBackwards.distanceHistory[goingBackwards.distanceHistoryIndex] = distanceToCursor;
//   goingBackwards.distanceHistoryIndex = (goingBackwards.distanceHistoryIndex + 1) % 6;
//   if (goingBackwards.distanceHistoryCount < 6) {
//     goingBackwards.distanceHistoryCount++;
//   }

 
  

//   let trigger_distanceJump = false;
//   let trigger_turnJump = false;
//   let isShrinking = false;

//   if (goingBackwards.distanceHistoryCount >= HISTORY_BACKWARDS && isInBackwardsRange) {
//     isShrinking = true;

//     // Check if all values are decreasing
//     for (let i = 1; i < goingBackwards.distanceHistoryCount; i++) {
//       const prevIdx = (goingBackwards.distanceHistoryIndex - goingBackwards.distanceHistoryCount + i - 1 + 6) % 6;
//       const currIdx = (goingBackwards.distanceHistoryIndex - goingBackwards.distanceHistoryCount + i + 6) % 6;
      
//       if (goingBackwards.distanceHistory[currIdx] >= goingBackwards.distanceHistory[prevIdx]) {
//         isShrinking = false;
//         break;
//       }
//     }

//     trigger_distanceJump = isShrinking;
//   }

//   ///////////////////// TURN DIRECTION ////////////////////////////////////////////////
 
//   goingBackwards.turnDirectionHistory[goingBackwards.turnDirectionHistoryIndex] = goingBackwards.turnDirection;
//   goingBackwards.turnDirectionHistoryIndex = (goingBackwards.turnDirectionHistoryIndex + 1) % 2;
//   if (goingBackwards.turnDirectionHistoryCount < 2) {
//     goingBackwards.turnDirectionHistoryCount++;
//   }

//   if (!isShrinking && goingBackwards.turnDirectionHistoryCount >= HISTORY_STEP_LINE) {
//     let allBelowZero = true;
//     for (let i = 0; i < goingBackwards.turnDirectionHistoryCount; i++) {
//       if (goingBackwards.turnDirectionHistory[i] >= 0.5) {
//         allBelowZero = false;
//         break;
//       }
//     }

//     if (allBelowZero && isInBackwardsRange) {
//       isShrinking = true;
//     }

//     trigger_turnJump = isShrinking;
//   }
 
//   if (!isShrinking && distanceToCursor < DISTANCE_MIN) {
//     isShrinking = true;
//   }
 
//   let isGrowing = false;

//   if (goingBackwards.distanceHistoryCount >= HISTORY_FORWARDS) {
//     let increasing = true;
//     let allAboveMin = true;

//     for (let i = goingBackwards.distanceHistoryCount - HISTORY_FORWARDS; i < goingBackwards.distanceHistoryCount; i++) {
//       const currIdx = (goingBackwards.distanceHistoryIndex - goingBackwards.distanceHistoryCount + i + 6) % 6;
//       const prevIdx = (goingBackwards.distanceHistoryIndex - goingBackwards.distanceHistoryCount + i - 1 + 6) % 6;
      
//       if (goingBackwards.distanceHistory[currIdx] <= goingBackwards.distanceHistory[prevIdx]) {
//         increasing = false;
//       }

//       if (goingBackwards.distanceHistory[currIdx] < GROW_DISTANCE_MIN) {
//         allAboveMin = false;
//       }
//     }

//     isGrowing = increasing || allAboveMin;
//   }

//   if (isShrinking && !goingBackwards.goingBackwards && !isGrowing) {
//     const COOLDOWN_FRAMES = trigger_distanceJump ? 60 : 20;

//     if (goingBackwards.framesSinceLastJump >= COOLDOWN_FRAMES) {
//       goingBackwards.goingBackwards = true;
//       goingBackwards.totalRotation = 0;
//       goingBackwards.backwardsAngle = jointAngles[0];
//       goingBackwards.framesSinceLastJump = 0;
//     }
//   }

//   if (!goingBackwards.goingBackwards) {
//     goingBackwards.framesSinceLastJump++;
//   }

//   if (goingBackwards.goingBackwards) {
//     handleBackwardsJump_inPlace(goingBackwards, cursor, first, jointAngles, radius, n, isGrowing);
//   }
 
//   if (goingBackwards.goingBackwards) {
//     goingBackwards.stiffnessBlend += STIFFNESS_SPEED;
//     if (goingBackwards.stiffnessBlend > 1.0)
//       goingBackwards.stiffnessBlend = 1.0;
//   } else {
//     goingBackwards.stiffnessBlend -= STIFFNESS_SPEED;
//     if (goingBackwards.stiffnessBlend < 0.0)
//       goingBackwards.stiffnessBlend = 0.0;
//   }
// }


// import {
//   dot,
//   _subtractVec_inPlace,
//   _getAngleBetweenPoints,
//   _getAngleFromXAxis,
// } from "../../utils";

/* -------------------------------- CONSTANTS -------------------------------- */

const MAX_BACKWARDS_DISTANCE = 0.15;
const MIN_BACKWARDS_DISTANCE = 0.02;

const MAX_BACKWARDS_DISTANCE_SQ = MAX_BACKWARDS_DISTANCE * MAX_BACKWARDS_DISTANCE;
const MIN_BACKWARDS_DISTANCE_SQ = MIN_BACKWARDS_DISTANCE * MIN_BACKWARDS_DISTANCE;

const HISTORY_BACKWARDS = 6;
const HISTORY_FORWARDS = 4;
const HISTORY_STEP_LINE = 2;

const DISTANCE_MIN = 0.04;
const DISTANCE_MIN_SQ = DISTANCE_MIN * DISTANCE_MIN;

const GROW_DISTANCE_MIN = 0.05;

const STIFFNESS_SPEED = 0.8;

const HALF_PI = Math.PI * 0.5;
const TWO_PI = Math.PI * 2;

/* ------------------------------ HELPERS ------------------------------------ */

function wrapPI(x) {
  if (x > Math.PI) return x - TWO_PI;
  if (x < -Math.PI) return x + TWO_PI;
  return x;
}

/* ------------------------------ MAIN --------------------------------------- */

export function solveFirst_withBackwardsDetect(
  stepsCenter,
  stepsAngle,
  frontSteps_distanceApart,
  goingBackwards,
  cursor,
  first,
  jointRadii,
  jointIndices,
  jointAngles,
  jointSecondaryAngles,
  jointmirroredSecondaryAngles,
  jointAngleDiffs,
  secondMotionAngle,
  secondMotionMirroredAngle,
) {
  const angleAtStart = jointAngles[0];
  const radius = jointRadii[0];

  /* ------------------ secondary angles ------------------ */

  jointSecondaryAngles[0] = secondMotionAngle;
  jointmirroredSecondaryAngles[0] =
    secondMotionMirroredAngle ?? secondMotionAngle;

  /* ------------------ cursor angle ------------------ */

  if (cursor.angle === undefined) {
    cursor.angle = _getAngleBetweenPoints(first, cursor);
  }

  /* ------------------ direction to cursor ------------------ */

  const dir = goingBackwards._dirBuffer;
  _subtractVec_inPlace(first, cursor, dir);

  const dSq = dot(dir, dir);

  if (dSq === 0) {
    first[0] = cursor[0] + radius;
    first[1] = cursor[1];
    jointAngles[0] = 0;
    jointIndices[0] = 0;
    return;
  }

  const d = Math.sqrt(dSq);

  const n = goingBackwards._nBuffer;
  n[0] = dir[0] / d;
  n[1] = dir[1] / d;

  first[0] = cursor[0] + n[0] * radius;
  first[1] = cursor[1] + n[1] * radius;

  const prelimAngle = _getAngleFromXAxis(n);
  const angleDiff = prelimAngle - cursor.angle;

  jointAngleDiffs[0] = angleDiff;
  jointAngles[0] = cursor.angle + angleDiff;

  /* ------------------ rotation direction ------------------ */

  if (angleAtStart !== undefined) {
    const delta = wrapPI(jointAngles[0] - angleAtStart);
    goingBackwards.rotationDir = Math.sign(delta);
  }

  jointRadii[0] = radius;
  jointIndices[0] = 0;

  /* ------------------ vector from steps to cursor ------------------ */

  const vecToCursor = goingBackwards._vecToCursorBuffer;
  _subtractVec_inPlace(cursor, stepsCenter, vecToCursor);

  const distSq = dot(vecToCursor, vecToCursor);
  const distanceToCursor = Math.sqrt(distSq);

  /* ------------------ lateral offset ------------------ */

  const perp = goingBackwards._perpVectorBuffer;
  perp[0] = Math.cos(stepsAngle - HALF_PI);
  perp[1] = Math.sin(stepsAngle - HALF_PI);

  const lateralOffset =
    vecToCursor[0] * perp[0] + vecToCursor[1] * perp[1];

  goingBackwards.lateralOffsetSign = Math.sign(lateralOffset);

  const normalizedTurnDirection =
    distanceToCursor > 0
      ? Math.max(-1, Math.min(1, lateralOffset / distanceToCursor))
      : 0;

  goingBackwards.turnDirection = normalizedTurnDirection;

  /* ------------------ backward range ------------------ */

  const isInBackwardsRange =
    distSq >= MIN_BACKWARDS_DISTANCE_SQ &&
    distSq <= MAX_BACKWARDS_DISTANCE_SQ;

  const angleToCursor = _getAngleFromXAxis(vecToCursor);
  let relativeAngle = wrapPI(angleToCursor - stepsAngle);

  const clampedRelativeAngle = -Math.max(
    -HALF_PI,
    Math.min(HALF_PI, relativeAngle),
  );

  goingBackwards.turnRadius =
    distanceToCursor * 2 - frontSteps_distanceApart;

  goingBackwards.direction = clampedRelativeAngle;

  /* ------------------ distance history (ring buffer) ------------------ */

  const dh = goingBackwards.distanceHistory;
  const dhIdx = goingBackwards.distanceHistoryIndex;

  dh[dhIdx] = distanceToCursor;
  goingBackwards.distanceHistoryIndex = (dhIdx + 1) % HISTORY_BACKWARDS;

  if (goingBackwards.distanceHistoryCount < HISTORY_BACKWARDS) {
    goingBackwards.distanceHistoryCount++;
  }

  /* ------------------ shrinking detection ------------------ */

  let isShrinking = false;
  let trigger_distanceJump = false;

  if (
    goingBackwards.distanceHistoryCount >= HISTORY_BACKWARDS &&
    isInBackwardsRange
  ) {
    isShrinking = true;

    for (let i = 1; i < HISTORY_BACKWARDS; i++) {
      const a =
        dh[(dhIdx + i) % HISTORY_BACKWARDS];
      const b =
        dh[(dhIdx + i - 1) % HISTORY_BACKWARDS];

      if (a >= b) {
        isShrinking = false;
        break;
      }
    }

    trigger_distanceJump = isShrinking;
  }

  /* ------------------ turn direction history ------------------ */

  const th = goingBackwards.turnDirectionHistory;
  const thIdx = goingBackwards.turnDirectionHistoryIndex;

  th[thIdx] = normalizedTurnDirection;
  goingBackwards.turnDirectionHistoryIndex =
    (thIdx + 1) % HISTORY_STEP_LINE;

  if (
    goingBackwards.turnDirectionHistoryCount < HISTORY_STEP_LINE
  ) {
    goingBackwards.turnDirectionHistoryCount++;
  }

  if (
    !isShrinking &&
    goingBackwards.turnDirectionHistoryCount >= HISTORY_STEP_LINE &&
    isInBackwardsRange
  ) {
    let allBelow = true;

    for (let i = 0; i < HISTORY_STEP_LINE; i++) {
      if (th[i] >= 0.5) {
        allBelow = false;
        break;
      }
    }

    if (allBelow) {
      isShrinking = true;
    }
  }

  /* ------------------ emergency shrink ------------------ */

  if (!isShrinking && distSq < DISTANCE_MIN_SQ) {
    isShrinking = true;
  }

  /* ------------------ growing detection ------------------ */

  let isGrowing = false;

  if (goingBackwards.distanceHistoryCount >= HISTORY_FORWARDS) {
    let increasing = true;
    let allAboveMin = true;

    for (let i = 1; i < HISTORY_FORWARDS; i++) {
      const a =
        dh[(dhIdx + i) % HISTORY_BACKWARDS];
      const b =
        dh[(dhIdx + i - 1) % HISTORY_BACKWARDS];

      if (a <= b) increasing = false;
      if (a < GROW_DISTANCE_MIN) allAboveMin = false;
    }

    isGrowing = increasing || allAboveMin;
  }

  /* ------------------ jump trigger ------------------ */

  if (isShrinking && !goingBackwards.goingBackwards && !isGrowing) {
    const cooldown = trigger_distanceJump ? 60 : 20;

    if (goingBackwards.framesSinceLastJump >= cooldown) {
      goingBackwards.goingBackwards = true;
      goingBackwards.totalRotation = 0;
      goingBackwards.backwardsAngle = jointAngles[0];
      goingBackwards.framesSinceLastJump = 0;
    }
  }

  if (!goingBackwards.goingBackwards) {
    goingBackwards.framesSinceLastJump++;
  }

  /* ------------------ apply backward jump ------------------ */

  if (goingBackwards.goingBackwards) {
    handleBackwardsJump_inPlace(
      goingBackwards,
      cursor,
      first,
      jointAngles,
      radius,
      n,
      isGrowing,
    );
  }

  /* ------------------ stiffness blend ------------------ */

  if (goingBackwards.goingBackwards) {
    goingBackwards.stiffnessBlend = Math.min(
      1,
      goingBackwards.stiffnessBlend + STIFFNESS_SPEED,
    );
  } else {
    goingBackwards.stiffnessBlend = Math.max(
      0,
      goingBackwards.stiffnessBlend - STIFFNESS_SPEED,
    );
  }
}
