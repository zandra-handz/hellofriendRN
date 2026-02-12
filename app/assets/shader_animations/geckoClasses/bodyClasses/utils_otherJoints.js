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


// At top of file
const PI = Math.PI;
const PI_2 = Math.PI * 2;
const PI_OVER_2 = Math.PI / 2;
const PI_OVER_3 = Math.PI / 3;
const PI_OVER_4 = Math.PI / 4;
const PI_OVER_6 = Math.PI / 6;
const TAU = Math.PI * 2;

// Use these throughout instead of recalculating

// does not set the extra motion angles, those have their own updaters
export function updateJointCoords(
 
  joint,
  ahead,
  newAngle,
  radius, 
  direction,
) {
  joint[0] = ahead[0] + Math.cos(newAngle) * radius;
  joint[1] = ahead[1] + Math.sin(newAngle) * radius;
//   joint.angle = newAngle;
//   joint.radius = radius;
//   joint.index = index + 1;
//   joint.angleDiff = angleDiff;
//   joint.direction = direction;
}

export function updateJointSecondaryAngle(
  index,
  needs,
  finalAngle,
  secondaryAngles,
  procAngle,
) {
  if (needs) {
    finalAngle.angle = secondaryAngles[index] + procAngle;
    secondaryAngles[index + 1] = finalAngle.angle;
  } else {
    secondaryAngles[index + 1] = secondaryAngles[index];
  }
}

export function updateJointThirdAngle(
  index,
  needs,
  finalAngle,
  mirroredSecondaryAngles,
  procAngle,
) {
  if (needs && mirroredSecondaryAngles[index]) {
    // add to joint.angle (essentially), and update joint.mirroredSecondaryAngle
    finalAngle.angle = procAngle + mirroredSecondaryAngles[index];
    mirroredSecondaryAngles[index + 1] = finalAngle.angle;
  } else {
    mirroredSecondaryAngles[index + 1] = mirroredSecondaryAngles[index];
  }
}

export function constrainBlendClampAngle_inPlace(
  index,
  ahead,
  jointAngles,
  jointAngleDiffs,
  joint,
  dirVec,
  maxBend,
  goingBackwards,
  stiffnessBlend,
  outDir,
) {
  // set ahead.angle if undefined
  if (jointAngles[index] === undefined)
    jointAngles[index] = _getAngleBetweenPoints(joint, ahead);

  let len = Math.sqrt(dot(dirVec, dirVec));

  if (len === 0) {
    joint[0] = ahead[0] + radius;
    joint[1] = ahead[1];
    jointAngles[index + 1] = jointAngles[index];
    // joint.index = index + 1;
    jointAngleDiffs[index + 1] = 0;

    outDir[0] = 1;
    outDir[1] = 0;

    return { angle: 0, direction: outDir };
  }

  // normalize in place
  outDir[0] = dirVec[0] / len;
  outDir[1] = dirVec[1] / len;

  let newAngle = Math.atan2(outDir[1], outDir[0]);

  let blendAhead = newAngle - jointAngles[index];
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

export function solveProcJoint_inPlace(
  index,
  ahead,
  jointAngles,
  secondaryAngles,
  thirdAngles,
  mirroredSecondaryAngles,
  jointAngleDiffs,
  jointDirections,
  jointIndices,
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
  const setSecondary = !goingBackwards && secondaryAngles[index] && inMotionRange;

  const setThird = !goingBackwards && index > motion3Start && inMotionRange;

  if (setSecondary) {
    maxBend = PI_2 / secondMotionClamps[index - motion2Start];
  } else {
    maxBend = PI_2/ maxBend;
  }

  // reuse joint.direction array to avoid allocation
  const dir = jointDirections[index + 1] || (jointDirections[index + 1] = [0, 0]);
  _subtractVec_inPlace(joint, ahead, dir); // reuses dir array

  const procBlend = constrainBlendClampAngle_inPlace(
    index,
    ahead,
    jointAngles,
    jointAngleDiffs,
    joint,
    dir,
    maxBend,
    goingBackwards,
    stiffnessBlend,
    dir,
  );

  //   const finalAngle = { angle: aheadAngle + procBlend.angle };
  const finalAngle = { angle: jointAngles[index] + procBlend.angle };

  if (!goingBackwards) {
    updateJointSecondaryAngle(
      index,
      setSecondary,
      finalAngle,
      secondaryAngles,
      procBlend.angle,
    );
    updateJointThirdAngle(
      index,
      setThird,
      finalAngle,
      mirroredSecondaryAngles,
      procBlend.angle,
    );
  } else {
    // Explicitly preserve existing values
    secondaryAngles[index + 1] = secondaryAngles[index];
    mirroredSecondaryAngles[index + 1] = mirroredSecondaryAngles[index];
  }

  updateJointCoords(
    joint,
    ahead,
    finalAngle.angle,
    radius, 
    procBlend.direction,
  );

  jointAngles[index + 1] = finalAngle.angle;
  jointAngleDiffs[index + 1] = procBlend.angle;
  jointDirections[index + 1] = procBlend.direction;
  jointIndices[index + 1] = index + 1;
  
}
