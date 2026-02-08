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

  const angle = goingBackwards ? backwardAngle : forwardAngle;
  const effectiveAngle = forwardAngle + backwardsOffset;

  outStep[0] = centerJoint[0] + Math.cos(effectiveAngle + offset) * distanceOut;
  outStep[1] = centerJoint[1] + Math.sin(effectiveAngle + offset) * distanceOut;

  outStep.angle = forwardAngle; // think this is just used for fingers angle

  return outStep;
}

