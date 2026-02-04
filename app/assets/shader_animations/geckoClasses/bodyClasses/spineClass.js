import { solveFirst_withBackwardsDetect, solveProcJoint_inPlace } from "./utilsPChain.js";
import {
  _getCenterPoint,
  _makeDistancePoint,
  _makeDistancePoint_inPlace,
  _getDirVec_inPlace,
  _getCenterPoint_inPlace,
  _makeOffscreenPoint,
  _makeOffscreenPoint_inPlace,
  _getDistanceScalar,
} from "../../utils.js";
import { 
  getStartAndEndPoints_inPlace,
  intersectLines,
  getSpineSagTrans_inPlace,
} from "../../utils.js";

export default class Spine {
  constructor(
    state,
    valuesForReversing,
    motion,
    startingCoord,
    totalNumJoints,
    unchainedAnchorIndex = 0,
    unchainedDist = 0.04,
    snoutDist = 0.02,
    hintDist = 0.05,
    segmentRange,
    baseRadius = 0.02,
    jointClamps,
    jointRadii, 
    updatesGlobalMotion = false,
  
    motionRange = [2, 10], // original default for spine
    motionIndicesLength = 9, // original default for spine

    motionBaseClamp = 24, // original default for spine
    
 
  ) {
    this.state = state;
    this.motion = motion;
    this.startingCoord = startingCoord;
    this.TAU = Math.PI * 2;
    this.updatesGlobalMotion = updatesGlobalMotion;

    this.head = [0.5, 0.5];
    this.snout = [0.5, 0.5];
    this.hint = [0.5, 0.5];

    this.hintJoint = new Float32Array(2);
    this.center = new Float32Array(2);

    this.unchainedDist = unchainedDist;
    this.snoutDist = snoutDist;
    this.hintDist = hintDist;

    this.valuesForReversing = valuesForReversing;

    this.joints = [];
    this.totalNumJoints = totalNumJoints;
    this.unchainedAnchorIndex = unchainedAnchorIndex;
    this.segmentStart = segmentRange[0];
    this.segmentEnd = segmentRange[1];
    this.intersectionPoint = 1; // stored in spine motion as well

    this.jointClamps = jointClamps;

    for (let i = 0; i <= totalNumJoints; i++) {
      const joint = [this.startingCoord[0], this.startingCoord[1]];

      joint.angle = 0;
      joint.secondaryAngle = 0; // A RECALC OF ANGLE based on spineMotion/center of current front steps. gets calculated/set inside joint solver (not used for first joint)
      joint.thirdAngle = 0; // only for second half of curve, an additional recalculation/correction after getting the body length according to second angle
      joint.radius = 0;
      joint.index = 0;
      joint.angleDiff = 0;
      joint.globalAngle = 0;
      joint.direction = [1, 0];

      this.joints.push(joint);
    }

    this.jointRadii = jointRadii;

    this.first = this.joints[0];
    this.bodyLength = 0.13;
    this.currentLength = 0; //stored in spineMotion as well
    this.currentJointLength = this.segmentEnd + 1 - this.segmentStart;

    this.center = 0;

    this.centerFlanks = [new Float32Array(2), new Float32Array(2)];
    this.intersectionFlanks = [new Float32Array(2), new Float32Array(2)];

    this.manualAdjust = 2; // start mirrored angle animation later in the joint chain than midway

    this.segmentCenterIndex =
      Math.ceil((this.segmentEnd + 1 - this.segmentStart) / 2) +
      this.manualAdjust;

    this.motion3Start = this.segmentCenterIndex;

    // PREVIOUSLY A SEPARATE CLASS CALLED SUBMOTION BUT WAS TOO CONFUSING
    this.motionCenter = [0.5, 0.5];
    this.motionLength = 0;
    this.motionFirstAngle = 0;
    this.motionSecondAngle = 0;
    this.motion2Start = motionRange[0];
    this.motionIndicesLength = motionIndicesLength;
    this.motion2End = motionRange[1];
    this.motionBaseClamp = motionBaseClamp;
    this.motionClamps = [];
    for (let i = 0; i <= this.motionIndicesLength; i++) {
      this.motionClamps.push(this.motionBaseClamp);
    }

    this.unchainedJoints = [
      new Float32Array(2), // snout
      new Float32Array(2), // head
    ];

    this.motionScalars = [0.02, 0.02, 0.03, 0.04, 0.03, 0.02, 0.02, 0.02]; // Example pattern
    /////////////////////////////////////////////////////////////////////////////
 
 

 
 

    this.isMoving = false;
  }

  updateMotionFirstAngle() {
    this.motionFirstAngle = this.motion.realignmentAngle1;
  }

  updateCurrentLength() {
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

    const spineCenterLines = getSpineSagTrans_inPlace(
      this.joints[this.segmentEnd],
      this.joints[this.segmentStart],
    );

    getStartAndEndPoints_inPlace(
      this.center,
      spineCenterLines.tEnd,
      spineCenterLines.tStart,
      this.motion.frontSteps_tDistanceApart,
      this.centerFlanks[0],
      this.centerFlanks[1],
    );

    const intersection = intersectLines(
      [spineCenterLines.tStart, spineCenterLines.tEnd],
      spineCenterLines.tAngle,
      this.motion.frontSteps_tDistanceApart,
      [this.motion.frontStepsTCenter, this.motion.frontStepsSLine[1]], // mirrored line starts from tCenter
      this.motion.frontStepsSAngle,
    );

    if (this.updatesGlobalMotion) { 
      this.motion.update_mirroredFrontStepsData(intersection);
    }

    this.intersectionPoint = intersection.intersectionPoint;

    getStartAndEndPoints_inPlace(
      this.intersectionPoint,
      spineCenterLines.tEnd,
      spineCenterLines.tStart,
      this.motion.frontSteps_tDistanceApart,
      this.intersectionFlanks[0],
      this.intersectionFlanks[1],
    );

    if (this.motion.centerIntersection != null) {
      this.motionSecondAngle = this.motion.realignmentAngle2;
    }
  }

  updateJointRadii(radii) {
    const expectedLength = this.totalNumJoints + 1;

    if (!Array.isArray(radii)) return;

    for (let i = 0; i < expectedLength; i++) {
      if (radii[i] !== undefined) {
        this.jointRadii[i] = radii[i];
      }
    }
  }

  update_unchainedJoints(leadPoint_lead) {
    const midPoint = _getCenterPoint_inPlace(
      this.motion.frontStepsSLine[1],
      leadPoint_lead,
      new Float32Array(2),
    );
    const dirVec = _getDirVec_inPlace(
      this.joints[this.unchainedAnchorIndex],
      midPoint,
      new Float32Array(2),
    );

    // Update head & snout in place
    this.head = _makeDistancePoint_inPlace(
      this.joints[this.unchainedAnchorIndex],
      dirVec,
      this.unchainedDist,
      this.unchainedJoints[1],
    ); // head
    this.snout = _makeDistancePoint_inPlace(
      this.unchainedJoints[1],
      dirVec,
      this.snoutDist,
      this.unchainedJoints[0],
    ); // snout

    if (!this.isMoving) {
      this.hint = _makeDistancePoint_inPlace(
        this.unchainedJoints[0],
        dirVec,
        this.hintDist,
        this.hintJoint,
      );
    } else {
      this.hint = _makeOffscreenPoint_inPlace(this.hintJoint);
    }
  }



 

  update(leadPoint_lead, leadPoint_isMoving) {
 
    this.isMoving = leadPoint_isMoving;

    // this.updateLeadPoint();
    this.updateMotionFirstAngle();

    solveFirst_withBackwardsDetect(
           this.motion.frontStepsTCenter,
      this.motion.frontStepsTAngle, 
      this.motion.frontSteps_tDistanceApart,
      this.valuesForReversing,
      leadPoint_lead,
      this.first,
      this.jointRadii[0],
      this.motion.realignmentAngle1, // necessary for secondaryAngle
      this.motion.realignmentAngle2, // adding the third animation here as well to keep code cleam/less confusing
      true,
    );
    for (let i = 0; i < this.totalNumJoints; i++) {
      solveProcJoint_inPlace(
        i,
        this.joints[i],
        this.joints[i + 1],
        this.jointRadii[i + 1],
        this.jointClamps[i + 1],
        this.motion2Start,
        this.motion3Start, // starting joint of third calculations
        this.motion2End,
        // this.motionClamps,
        this.jointClamps,
        this.valuesForReversing.goingBackwards,
        this.valuesForReversing.stiffnessBlend
        
        //this.motionScalars,
        //true,
      );
    }

    this.update_unchainedJoints(leadPoint_lead);
    this.updateCurrentLength();
  }
}
