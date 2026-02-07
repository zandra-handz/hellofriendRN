import { getSpineSagTrans_inPlace, intersectLines } from "../../utils.js";
import { _getCenterPoint, _getCenterPoint_inPlace, _getDistanceScalar } from "../../utils.js";
import {  solveProcJoint_inPlace } from "./utilsPChain.js";

export default class Tail {
  constructor(
    state,
    valuesForReversing,
    motion,
    // subMotion,
    cursor,
    totalNumJoints,
    segmentRange,
    baseRadius = 0.02,
    tailClamps,
    tailRadii, 
    updatesGlobalMotion = false,
    motionRange = [0, 6],
    motionIndicesLength = 6, // original default for spine
    motionBaseClamp = 8, // original default for spine
 
  ) {
    this.state = state;
    this.valuesForReversing = valuesForReversing;
    this.motion = motion;
    this.cursor = cursor;
    this.TAU = Math.PI * 2;
    this.updatesGlobalMotion = updatesGlobalMotion;

    this.joints = [this.cursor];
    this.totalNumJoints = totalNumJoints;
    this.segmentStart = segmentRange[0];
    this.segmentEnd = segmentRange[1];
    this.intersectionPoint = 1; // stored in spine motion as well

    this.tailClamps = tailClamps;

    // for (let i = 0; i <= totalNumJoints; i++) {
    //   const joint = [0.5, 0.5];

    //   joint.angle = 0;
    //   joint.secondaryAngle = 0; // A RECALC OF ANGLE based on spineMotion/center of current front steps. gets calculated/set inside joint solver (not used for first joint)
    //   joint.thirdAngle = 0; // only for second half of curve, an additional recalculation/correction after getting the body length according to second angle
    //   joint.radius = 0;
    //   joint.index = 0;
    //   joint.angleDiff = 0;
    //   joint.globalAngle = 0;
    //   joint.direction = [1, 0];

    //   this.joints.push(joint);
    // }

    // TO SWITCH OVER TO!
// All other properties as typed arrays
// this.jointAngles = new Float32Array(numJoints);
// this.jointSecondaryAngles = new Float32Array(numJoints);
// this.jointThirdAngles = new Float32Array(numJoints);
// this.jointRadii = new Float32Array(numJoints);
// this.jointIndices = new Uint16Array(numJoints); // or Uint8Array if < 256 joints
// this.jointAngleDiffs = new Float32Array(numJoints);
// this.jointGlobalAngles = new Float32Array(numJoints);
// this.jointDirections = new Float32Array(numJoints * 2); // vec2 for each joint
this.jointBuffer = new Float32Array((totalNumJoints + 1) * 2);
 
for (let i = 0; i <= totalNumJoints; i++) {
  // Create a view into the buffer for position
  const joint = this.jointBuffer.subarray(i * 2, i * 2 + 2);
  
  // Add other properties with dot notation
  joint.angle = 0;
  joint.secondaryAngle = 0;
  joint.thirdAngle = 0;
  joint.radius = 0;
  joint.index = 0;
  joint.angleDiff = 0;
  joint.globalAngle = 0;
  joint.direction = [1, 0];
  
  this.joints.push(joint);
}


    this.jointRadii = tailRadii;

    // for (let i = 0; i <= this.totalNumJoints; i++) {
    //   this.jointRadii.push(baseRadius);
    // }

    this.first = this.joints[0];

    this.bodyLength = 0.13;
    this.currentLength = 0; //stored in spineMotion as well
    this.currentJointLength = this.segmentEnd + 1 - this.segmentStart;

    this.center = 0; // stored in spineMotion as well
    // this.centerFlanks = [new Float32Array(2), new Float32Array(2)];
    this.manualAdjust = 2; // start mirrored angle animation later in the joint chain than midway
    let segmentCenterIndex =
      Math.ceil((this.segmentEnd + 1 - this.segmentStart) / 2) +
      this.manualAdjust;

    this.motion3Start = segmentCenterIndex;

    // PREVIOUSLY A SEPARATE CLASS CALLED SUBMOTION BUT WAS TOO CONFUSING
    this.motionCenter = [0.5, 0.5];
    this.motionLength = 0;
    this.motionFirstAngle = 0;
    this.motionSecondAngle = 0;

    this.motion2Start = motionRange[0];
    this.motionIndicesLength = motionIndicesLength;
    this.motion2End = motionRange[1];

    this.motionIndicesLength = motionIndicesLength;
    this.motionBaseClamp = motionBaseClamp;
    this.motionClamps = [];
    for (let i = 0; i <= this.motionIndicesLength; i++) {
      this.motionClamps.push(this.motionBaseClamp);
    }

    this.motionScalars = [0.02, 0.02, 0.03, 0.04, 0.03, 0.02, 0.02, 0.02]; // Example pattern
    /////////////////////////////////////////////////////////////////////////////

  
  }
 

  updateCurrentLength() {
    //length of body
    const length = _getDistanceScalar(
      this.joints[this.segmentEnd],
      this.joints[this.segmentStart],
    );
    this.currentLength = length;

    // set this.center
    _getCenterPoint_inPlace(
      this.joints[this.segmentEnd],
      this.joints[this.segmentStart],
      this.center,
    );


    const tailCenterLines = getSpineSagTrans_inPlace(
      this.joints[this.segmentEnd],
      this.joints[this.segmentStart],
    ); 

    const intersection = intersectLines(
      [tailCenterLines.tStart, tailCenterLines.tEnd],
      tailCenterLines.tAngle,
      this.motion.frontSteps_tDistanceApart,
      this.motion.frontStepsSLine,
      this.motion.frontStepsSAngle,

      // this.center,
      // this.centerFlanks,
    );

    if (this.updatesGlobalMotion) { 
      this.motion.update_mirroredFrontStepsData(intersection);
    }

    this.intersectionPoint = intersection.intersectionPoint; 
    if (this.motion.centerIntersection != null) {
  
      this.motionSecondAngle = this.motion.realignmentAngle2; 
    }
  } 

  update() {
 

    for (let i = 0; i < this.totalNumJoints; i++) {
      solveProcJoint_inPlace(
        i,
        this.joints[i],
        this.joints[i + 1],
        this.jointRadii[i + 1],
        this.tailClamps[i],
        this.motion2Start,
        this.motion3Start, // starting joint of third calculations
        this.motion2End,
        this.tailClamps,
        this.valuesForReversing.goingBackwards,
        this.valuesForReversing.stiffnessBlend
        // this.motionScalars,
        // false,
      );
    }

    this.updateCurrentLength(); 
  }

 
}
