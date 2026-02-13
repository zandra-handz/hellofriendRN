// import {
//   _getPointTowardB,
//   _getCenterPoint,
//   _getCenterPoint_inPlace,
//   _getDistanceScalar,
//   _getDotScalar,
//   _subtractVec,
//   _getAngleFromXAxis,
//   _getForwardAngle,
// } from "../../utils.js";

// import {
//   updateShoulderRotator,
//   getBackFrontStepDistance,
//   solveBackElbowIK,
//   getCalcStep_inPlace,
//   solveFingers,
// } from "../../utils.js";

// // I am keeping both centerJoint and stepCenterJoint for now in case
// // additional animation needs to be done to the shoulder joint but not the spine joint
// // that the legs are mapping onto
// export default class FollowerLegs {
//   constructor(
//     state,
//     valuesForReversing,
//     joints,
//     jointAngles,
//     anchorJIndex,
//     aheadJIndex,
//     motion,
//     frontLegs_stepTargets,
//     hipSpineJoint,
//     stepCenterJoint,
//     stepCenterRadius,
//     stepAheadJoint0,
//     stepAheadJoint1,
//     stepBehindJoint,
//     stepPivotSize,
//     fingerLen,
//     rotationRadius = 0.007, // original as default
//     rotationRange = 2.2, // original as default
//     forwardStepThreshhold = 0.06, // original as default
//     reverseStepThreshhold,
//     forwardStepWiggleRoom = 0.02, // original as default
//     reverseStepWiggleRoom,
//     forwardStepWideness = 3.4,
//     reverseStepWideness,
//     forwardStepReach = 0.0453,
//     reverseStepReach,
//     upperArmLength = 0.042,
//     forearmLength = 0.026,
//   ) {
//     this.TAU = Math.PI * 2;

//     this.state = state;
//     this.valuesForReversing = valuesForReversing;

//     this.joints = joints;
//     this.jointAngles = jointAngles;
//     this.anchorJIndex = anchorJIndex;
//     this.motion = motion;
//     this.frontLegs_stepTargets = frontLegs_stepTargets;
//     this.hipSpineJoint = hipSpineJoint;
//     // this.rotatorJoint0 = [0.5, 0.5]; //anchorFront/Back0/1
//     // this.rotatorJoint1 = [0.5, 0.5];

//     this.rotatorJoint0 = new Float32Array([0.5, 0.5]);
//     this.rotatorJoint1 = new Float32Array([0.5, 0.5]);

//     this.rotationRadius = rotationRadius;
//     this.rotationRange = rotationRange;

//     this.stepPivotSize = stepPivotSize;
//     this.stepCenterJoint = stepCenterJoint; //can be same as anchor or different (spine.joints[2])
//     this.stepCenterRadius = stepCenterRadius; //can be same as anchor or different
//     /// TEMP
//     this.stepAheadJoint = stepAheadJoint0;

//     this.stepAheadJoint0 = stepAheadJoint0;
//     this.stepAheadJoint1 = stepAheadJoint1;

//     this.stepBehindJoint = stepBehindJoint;

//     this.anchorJIndex = anchorJIndex;
//     this.aheadJIndex = aheadJIndex;

//     this.distFromFrontStep0 = 0;
//     this.distFromFrontStep1 = 0;

//     this.forwardAngle0 = 0;
//     this.forwardAngle1 = 0;
//     this.centerToAheadAngle = 0;
//     this.centerToBehindAngle = 0;

//     this.prevBackwards = false;

//     this.elbows = [new Float32Array([0.5, 0.5]), new Float32Array([0.5, 0.5])];

 

//     this.muscleBuffer = new Float32Array(8);

//     // Create views into the buffer
//     this.muscles = Array.from({ length: 4 }, (_, i) =>
//       this.muscleBuffer.subarray(i * 2, i * 2 + 2),
//     );

 
//     // this.fingers = [
//     //   [
//     //     [0.5, 0.5],
//     //     [0.5, 0.5],
//     //     [0.5, 0.5],
//     //     [0.5, 0.5],
//     //     [0.5, 0.5],
//     //   ],

//     //   [
//     //     [0.5, 0.5],
//     //     [0.5, 0.5],
//     //     [0.5, 0.5],
//     //     [0.5, 0.5],
//     //     [0.5, 0.5],
//     //   ],
//     // ];

//     // 10 fingers × vec2
//     this.fingerBuffer = new Float32Array(20);

//     // Convenience views (no allocation after this)
//     this.fingers = [
//       Array.from({ length: 5 }, (_, i) =>
//         this.fingerBuffer.subarray(i * 2, i * 2 + 2),
//       ),
//       Array.from({ length: 5 }, (_, i) =>
//         this.fingerBuffer.subarray(10 + i * 2, 10 + i * 2 + 2),
//       ),
//     ];

//     this.fingerLen = fingerLen;
//     this.fingerAngleOffset = 3;
//     // this.stepTargets = [
//     //   [0.5, 0.5],
//     //   [0.5, 0.5],
//     // ];

//     this.stepTargets = [
//       new Float32Array([0.5, 0.5]),
//       new Float32Array([0.5, 0.5]),
//     ];

//      this.stepTargetAngles = [0, 0];

//     this.flippedChestLines = {};

//     this.stepThreshhold = forwardStepThreshhold;
//     this.stepWiggleRoom = forwardStepWiggleRoom;
//     this.stepWideness = forwardStepWideness;
//     this.stepReach = forwardStepReach;

//     this.forwardStepThreshhold = forwardStepThreshhold;
//     this.forwardStepWiggleRoom = forwardStepWiggleRoom;
//     this.forwardStepWideness = forwardStepWideness;
//     this.forwardStepReach = forwardStepReach;

//     this.reverseStepThreshhold = reverseStepThreshhold;
//     this.reverseStepWiggleRoom = reverseStepWiggleRoom;
//     this.reverseStepWideness = reverseStepWideness;
//     this.reverseStepReach = reverseStepReach;

//     this.upperArmLength = upperArmLength;
//     this.forearmLength = forearmLength;
//   }

//   updateBackwardAngle() {
//     this.centerToBehindAngle = _getForwardAngle(
//       this.stepCenterJoint,
//       this.stepBehindJoint,
//     );
//   }

//   getStepValues(goingBackwards) {
//     if (goingBackwards) {
//       this.stepThreshhold = this.reverseStepThreshhold;
//       this.stepWideness = this.reverseStepWideness;
//       this.stepReach = this.reverseStepReach;
//     } else {
//       this.stepThreshhold = this.forwardStepThreshhold;
//       this.stepWideness = this.forwardStepWideness;
//       this.stepReach = this.forwardStepReach;
//     }
//   }
//   updateDistanceFromFrontStep() {
//     this.distFromFrontStep0 = getBackFrontStepDistance(
//       this.stepTargets[0],
//       this.motion.frontStepsTLine[0],
//     );
//     this.distFromFrontStep1 = getBackFrontStepDistance(
//       this.stepTargets[1],
//       this.motion.frontStepsTLine[1],
//     );
//   }  
//   updateDistanceFromFrontStep() {
//     const s0 = this.stepTargets[0];
//     const f0 = this.motion.frontStepsTLine[0];
//     const dx0 = f0[0] - s0[0];
//     const dy0 = f0[1] - s0[1];
//     this.distFromFrontStep0 = Math.sqrt(dx0 * dx0 + dy0 * dy0);

//     const s1 = this.stepTargets[1];
//     const f1 = this.motion.frontStepsTLine[1];
//     const dx1 = f1[0] - s1[0];
//     const dy1 = f1[1] - s1[1];
//     this.distFromFrontStep1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
//   }
//   // DIFFERENT FROM LEGS WHICH USE THE SAME FORWARD ANGLE
//   updateForwardAngles() {
//     const forwardPoint0 = [0, 0];
//     const forwardPoint1 = [0, 0];
//     _getCenterPoint_inPlace(
//       this.frontLegs_stepTargets[0],
//       this.stepAheadJoint,
//       forwardPoint0,
//     );
//     _getCenterPoint_inPlace(
//       this.frontLegs_stepTargets[1],
//       this.stepAheadJoint,
//       forwardPoint1,
//     );

//     this.forwardAngle0 = _getForwardAngle(this.stepCenterJoint, forwardPoint0);
//     this.forwardAngle1 = _getForwardAngle(this.stepCenterJoint, forwardPoint1);
//   }

//   solveStepTargetsBackPaired() {
//     ////////////////////////////////////////////////////////////////
//     const distanceOut = (this.stepCenterRadius + this.stepReach) * 1.4;

//     const widenessAdj = 1.3;
//     // just reverses the 0/1 for is1

//     let calcStep0 = [0, 0];
//     let calcStep1 = [0, 0];

//     getCalcStep_inPlace(
//       calcStep0,
//       this.stepCenterJoint,
//       this.forwardAngle0,
//       // this.centerToBehindAngle,
//       this.forwardAngle0,
//       distanceOut,
//       this.stepWideness * widenessAdj,
//       false,
//       this.valuesForReversing.goingBackwards,
//     );
//     getCalcStep_inPlace(
//       calcStep1,
//       this.stepCenterJoint,
//       this.forwardAngle1,
//       //   this.centerToBehindAngle,
//       this.forwardAngle1,
//       distanceOut,
//       this.stepWideness * widenessAdj,
//       true,
//       this.valuesForReversing.goingBackwards,
//     );

//     const nextStep0 = calcStep0;
//     const nextStep1 = calcStep1;

//     let lDist = _getDistanceScalar(calcStep0, this.stepTargets[0]);
//     let rDist = _getDistanceScalar(calcStep1, this.stepTargets[1]);

//     const goingBackwards = this.valuesForReversing.goingBackwards;

//     // // CHANGING STEP PATTERN WHEN GOING BACKWARDS
//     if (
//       goingBackwards ? this.state.takeSyncedSteps0 : this.state.takeSyncedSteps1
//     ) {
//       this.stepTargets[0][0] = nextStep0[0];
//       this.stepTargets[0][1] = nextStep0[1];
//       this.stepTargets[0].angle = calcStep0.angle;
//       // this.state.syncedStepsCompleted(goingBackwards ? false : true);
//       this.state.syncedStepsCompleted(!goingBackwards);
//     } else if (
//       lDist >
//       this.stepThreshhold + this.stepWiggleRoom
//       // &&
//       // !goingBackwards
//     ) {
//       // if (goingBackwards) {
//       //   console.log("BACKWARDS WALKING BAKC LEG NEEDS CATCH UP");
//       // }
//       //console.log("back leg need to catch up");
//       this.state.catchUp(!goingBackwards);
//     }

//     if (
//       goingBackwards ? this.state.takeSyncedSteps1 : this.state.takeSyncedSteps0
//     ) {
//       this.stepTargets[1][0] = nextStep1[0];
//       this.stepTargets[1][1] = nextStep1[1];
//       this.stepTargets[1].angle = calcStep1.angle;
//       // this.state.syncedStepsCompleted(goingBackwards? true : false);
//       this.state.syncedStepsCompleted(goingBackwards);
//     } else if (rDist > this.stepThreshhold + this.stepWiggleRoom) {
//       // if (goingBackwards) {
//       //   console.log("BACKWARDS WALKING BAKC LEG NEEDS CATCH UP");
//       // }
//       // this.state.catchUp(goingBackwards? true : false);
//       this.state.catchUp(goingBackwards);
//     }

//     // OLD, WITHOUT CHANGING STEP PATTERN FOR GOING BACKWADS
//     // if (this.state.takeSyncedSteps1) {
//     //   this.stepTargets[0][0] = nextStep0[0];
//     //   this.stepTargets[0][1] = nextStep0[1];
//     //   this.stepTargets[0].angle = calcStep0.angle;
//     //   this.state.syncedStepsCompleted(true);
//     // } else if (lDist > this.stepThreshhold + this.stepWiggleRoom) {
//     //   // console.log("back leg need to catch up");
//     //   this.state.catchUp(true);
//     // }

//     // if (this.state.takeSyncedSteps0) {
//     //   this.stepTargets[1][0] = nextStep1[0];
//     //   this.stepTargets[1][1] = nextStep1[1];
//     //   this.stepTargets[1].angle = calcStep1.angle;
//     //   this.state.syncedStepsCompleted(false);
//     // } else if (rDist > this.stepThreshhold + this.stepWiggleRoom) {
//     //   // console.log("back leg need to catch up");
//     //   this.state.catchUp(false);
//     // }
//   }

//   update() {
//     if (this.valuesForReversing?.goingBackwards !== this.prevBackwards) {
//       this.getStepValues(this.valuesForReversing.goingBackwards);

//       this.prevBackwards = this.valuesForReversing.goingBackwards;
//       // console.log("SWITHCED!!", this.prevBackwards);
//     }

//     this.updateDistanceFromFrontStep();
//     // this.updateForwardAngle();
//     this.updateForwardAngles();

//     if (this.valuesForReversing.goingBackwards) {
//       this.updateBackwardAngle();
//     }

//     // updates rotator joint position only
//     updateShoulderRotator(
//       this.rotatorJoint0,
//       this.rotationRadius,
//       this.rotationRange,
//       this.state.followerPhase,
//       this.joints[this.anchorJIndex],
//       this.jointAngles[this.anchorJIndex],
//       // this.hipSpineJoint.angle,
//       false,
//       false,
//     );

//     // updates rotator joint position only
//     updateShoulderRotator(
//       this.rotatorJoint1,
//       this.rotationRadius,
//       this.rotationRange,
//       this.state.followerPhase,
//       this.joints[this.anchorJIndex],
//       this.jointAngles[this.anchorJIndex],
//       // [this.hipSpineJoint[0], this.hipSpineJoint[1]],
//       // this.hipSpineJoint.angle,
//       true,
//       true,
//     );

//     this.solveStepTargetsBackPaired();

//     solveBackElbowIK(
//       this.rotatorJoint0,
//       this.elbows[0],
//       this.stepTargets[0],
//       this.upperArmLength,
//       this.forearmLength,
//       false,
//     );
//     solveBackElbowIK(
//       this.rotatorJoint1,
//       this.elbows[1],
//       this.stepTargets[1],
//       this.upperArmLength,
//       this.forearmLength,
//       true,
//     );

//     // this.muscles[0] = _getCenterPoint(this.stepTargets[0], this.elbows[0]);
//     // this.muscles[1] = _getCenterPoint(this.elbows[0], this.stepCenterJoint);
//     // this.muscles[2] = _getCenterPoint(this.stepTargets[1], this.elbows[1]);
//     // this.muscles[3] = _getCenterPoint(this.elbows[1], this.stepCenterJoint);

//     // // set muscles
//     _getCenterPoint_inPlace(
//       this.stepTargets[0],
//       this.elbows[0],
//       this.muscles[0],
//     );
//     _getCenterPoint_inPlace(
//       this.elbows[0],
//       this.stepCenterJoint,
//       this.muscles[1],
//     );
//     _getCenterPoint_inPlace(
//       this.stepTargets[1],
//       this.elbows[1],
//       this.muscles[2],
//     );
//     _getCenterPoint_inPlace(
//       this.elbows[1],
//       this.stepCenterJoint,
//       this.muscles[3],
//     );

//     solveFingers(
//       this.stepTargets[0],
//       this.fingers[0],
//       this.fingerLen,
//       false,
//       this.fingerAngleOffset,
//     );

//     solveFingers(
//       this.stepTargets[1],
//       this.fingers[1],
//       this.fingerLen,
//       true,
//       this.fingerAngleOffset,
//     );
//   }
// }



import {
  _getPointTowardB,
  _getCenterPoint,
  _getCenterPoint_inPlace,
  _getDistanceScalar,
  _getDotScalar,
  _subtractVec,
  _getAngleFromXAxis,
  _getForwardAngle,
} from "../../utils.js";

import {
  updateShoulderRotator,
  getBackFrontStepDistance,
  solveBackElbowIK,
  getCalcStep_inPlace,
  solveFingers,
  solveFirstFingerOnly_Opt,
} from "../../utils.js";

export default class FollowerLegs {
  constructor(
    state,
    valuesForReversing,
    joints,
    jointAngles,
    anchorJIndex,
    aheadJIndex,
    motion,
    frontLegs_stepTargets,
    hipSpineJoint,
    stepCenterJoint,
    stepCenterRadius,
    stepAheadJoint0,
    stepAheadJoint1,
    stepBehindJoint,
    stepPivotSize,
    fingerLen,
    rotationRadius = 0.007,
    rotationRange = 2.2,
    forwardStepThreshhold = 0.06,
    reverseStepThreshhold,
    forwardStepWiggleRoom = 0.02,
    reverseStepWiggleRoom,
    forwardStepWideness = 3.4,
    reverseStepWideness,
    forwardStepReach = 0.0453,
    reverseStepReach,
    upperArmLength = 0.042,
    forearmLength = 0.026,
  ) {
    this.TAU = Math.PI * 2;

    this.state = state;
    this.valuesForReversing = valuesForReversing;

    this.joints = joints;
    this.jointAngles = jointAngles;
    this.anchorJIndex = anchorJIndex;
    this.motion = motion;
    this.frontLegs_stepTargets = frontLegs_stepTargets;
    this.hipSpineJoint = hipSpineJoint;

    this.rotatorJoint0 = new Float32Array([0.5, 0.5]);
    this.rotatorJoint1 = new Float32Array([0.5, 0.5]);

    this.rotationRadius = rotationRadius;
    this.rotationRange = rotationRange;

    this.stepPivotSize = stepPivotSize;
    this.stepCenterJoint = stepCenterJoint;
    this.stepCenterRadius = stepCenterRadius;
    
    this.stepAheadJoint = stepAheadJoint0;
    this.stepAheadJoint0 = stepAheadJoint0;
    this.stepAheadJoint1 = stepAheadJoint1;
    this.stepBehindJoint = stepBehindJoint;

    this.anchorJIndex = anchorJIndex;
    this.aheadJIndex = aheadJIndex;

    this.distFromFrontStep0 = 0;
    this.distFromFrontStep1 = 0;

    this.forwardAngle0 = 0;
    this.forwardAngle1 = 0;
    this.centerToAheadAngle = 0;
    this.centerToBehindAngle = 0;

    this.prevBackwards = false;

    this.elbows = [new Float32Array([0.5, 0.5]), new Float32Array([0.5, 0.5])];

    this.muscleBuffer = new Float32Array(8);

    // Create views into the buffer
    this.muscles = Array.from({ length: 4 }, (_, i) =>
      this.muscleBuffer.subarray(i * 2, i * 2 + 2),
    );

    // ✅ OPTIMIZED: Only store first finger for each leg (2 legs × 2 floats = 4 floats)
    this.fingerBuffer = new Float32Array(4);

    // ✅ OPTIMIZED: Just 2 Float32Array views (one per leg)
    this.fingers = [
      this.fingerBuffer.subarray(0, 2),  // First finger leg 0
      this.fingerBuffer.subarray(2, 4),  // First finger leg 1
    ];

    this.fingerLen = fingerLen;
    this.fingerAngleOffset = 3;

    this.stepTargets = [
      new Float32Array([0.5, 0.5]),
      new Float32Array([0.5, 0.5]),
    ];

    this.stepTargetAngles = [0, 0];

    this.flippedChestLines = {};

    this.stepThreshhold = forwardStepThreshhold;
    this.stepWiggleRoom = forwardStepWiggleRoom;
    this.stepWideness = forwardStepWideness;
    this.stepReach = forwardStepReach;

    this.forwardStepThreshhold = forwardStepThreshhold;
    this.forwardStepWiggleRoom = forwardStepWiggleRoom;
    this.forwardStepWideness = forwardStepWideness;
    this.forwardStepReach = forwardStepReach;

    this.reverseStepThreshhold = reverseStepThreshhold;
    this.reverseStepWiggleRoom = reverseStepWiggleRoom;
    this.reverseStepWideness = reverseStepWideness;
    this.reverseStepReach = reverseStepReach;

    this.upperArmLength = upperArmLength;
    this.forearmLength = forearmLength;
  }

  updateBackwardAngle() {
    this.centerToBehindAngle = _getForwardAngle(
      this.stepCenterJoint,
      this.stepBehindJoint,
    );
  }

  getStepValues(goingBackwards) {
    if (goingBackwards) {
      this.stepThreshhold = this.reverseStepThreshhold;
      this.stepWideness = this.reverseStepWideness;
      this.stepReach = this.reverseStepReach;
    } else {
      this.stepThreshhold = this.forwardStepThreshhold;
      this.stepWideness = this.forwardStepWideness;
      this.stepReach = this.forwardStepReach;
    }
  }

  updateDistanceFromFrontStep() {
    const s0 = this.stepTargets[0];
    const f0 = this.motion.frontStepsTLine[0];
    const dx0 = f0[0] - s0[0];
    const dy0 = f0[1] - s0[1];
    this.distFromFrontStep0 = Math.sqrt(dx0 * dx0 + dy0 * dy0);

    const s1 = this.stepTargets[1];
    const f1 = this.motion.frontStepsTLine[1];
    const dx1 = f1[0] - s1[0];
    const dy1 = f1[1] - s1[1];
    this.distFromFrontStep1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
  }

  // DIFFERENT FROM LEGS WHICH USE THE SAME FORWARD ANGLE
  updateForwardAngles() {
    const forwardPoint0 = [0, 0];
    const forwardPoint1 = [0, 0];
    _getCenterPoint_inPlace(
      this.frontLegs_stepTargets[0],
      this.stepAheadJoint,
      forwardPoint0,
    );
    _getCenterPoint_inPlace(
      this.frontLegs_stepTargets[1],
      this.stepAheadJoint,
      forwardPoint1,
    );

    this.forwardAngle0 = _getForwardAngle(this.stepCenterJoint, forwardPoint0);
    this.forwardAngle1 = _getForwardAngle(this.stepCenterJoint, forwardPoint1);
  }

  solveStepTargetsBackPaired() {
    const distanceOut = (this.stepCenterRadius + this.stepReach) * 1.4;
    const widenessAdj = 1.3;

    let calcStep0 = [0, 0];
    let calcStep1 = [0, 0];

    getCalcStep_inPlace(
      calcStep0,
      this.stepCenterJoint,
      this.forwardAngle0,
      this.forwardAngle0,
      distanceOut,
      this.stepWideness * widenessAdj,
      false,
      this.valuesForReversing.goingBackwards,
    );
    getCalcStep_inPlace(
      calcStep1,
      this.stepCenterJoint,
      this.forwardAngle1,
      this.forwardAngle1,
      distanceOut,
      this.stepWideness * widenessAdj,
      true,
      this.valuesForReversing.goingBackwards,
    );

    const nextStep0 = calcStep0;
    const nextStep1 = calcStep1;

    let lDist = _getDistanceScalar(calcStep0, this.stepTargets[0]);
    let rDist = _getDistanceScalar(calcStep1, this.stepTargets[1]);

    const goingBackwards = this.valuesForReversing.goingBackwards;

    if (
      goingBackwards ? this.state.takeSyncedSteps0 : this.state.takeSyncedSteps1
    ) {
      this.stepTargets[0][0] = nextStep0[0];
      this.stepTargets[0][1] = nextStep0[1];
      this.stepTargetAngles[0] = this.forwardAngle0;
      this.state.syncedStepsCompleted(!goingBackwards);
    } else if (lDist > this.stepThreshhold + this.stepWiggleRoom) {
      this.state.catchUp(!goingBackwards);
    }

    if (
      goingBackwards ? this.state.takeSyncedSteps1 : this.state.takeSyncedSteps0
    ) {
      this.stepTargets[1][0] = nextStep1[0];
      this.stepTargets[1][1] = nextStep1[1];
      this.stepTargetAngles[1] = this.forwardAngle1;
      this.state.syncedStepsCompleted(goingBackwards);
    } else if (rDist > this.stepThreshhold + this.stepWiggleRoom) {
      this.state.catchUp(goingBackwards);
    }
  }

  update() {
    if (this.valuesForReversing?.goingBackwards !== this.prevBackwards) {
      this.getStepValues(this.valuesForReversing.goingBackwards);
      this.prevBackwards = this.valuesForReversing.goingBackwards;
    }

    this.updateDistanceFromFrontStep();
    this.updateForwardAngles();

    if (this.valuesForReversing.goingBackwards) {
      this.updateBackwardAngle();
    }

    updateShoulderRotator(
      this.rotatorJoint0,
      this.rotationRadius,
      this.rotationRange,
      this.state.followerPhase,
      this.joints[this.anchorJIndex],
      this.jointAngles[this.anchorJIndex],
      false,
      false,
    );

    updateShoulderRotator(
      this.rotatorJoint1,
      this.rotationRadius,
      this.rotationRange,
      this.state.followerPhase,
      this.joints[this.anchorJIndex],
      this.jointAngles[this.anchorJIndex],
      true,
      true,
    );

    this.solveStepTargetsBackPaired();

    solveBackElbowIK(
      this.rotatorJoint0,
      this.elbows[0],
      this.stepTargets[0],
      this.upperArmLength,
      this.forearmLength,
      false,
    );
    solveBackElbowIK(
      this.rotatorJoint1,
      this.elbows[1],
      this.stepTargets[1],
      this.upperArmLength,
      this.forearmLength,
      true,
    );

    // set muscles
    _getCenterPoint_inPlace(
      this.stepTargets[0],
      this.elbows[0],
      this.muscles[0],
    );
    _getCenterPoint_inPlace(
      this.elbows[0],
      this.stepCenterJoint,
      this.muscles[1],
    );
    _getCenterPoint_inPlace(
      this.stepTargets[1],
      this.elbows[1],
      this.muscles[2],
    );
    _getCenterPoint_inPlace(
      this.elbows[1],
      this.stepCenterJoint,
      this.muscles[3],
    );

    // ✅ OPTIMIZED: Only calculate first finger, write directly to buffer
    const firstFinger0 = solveFirstFingerOnly_Opt(
      this.stepTargets[0],
      this.fingerLen,
      false,
      this.fingerAngleOffset,
      this.stepTargetAngles[0],
    );
    this.fingers[0][0] = firstFinger0[0];
    this.fingers[0][1] = firstFinger0[1];

    const firstFinger1 = solveFirstFingerOnly_Opt(
      this.stepTargets[1],
      this.fingerLen,
      true,
      this.fingerAngleOffset,
      this.stepTargetAngles[1],
    );
    this.fingers[1][0] = firstFinger1[0];
    this.fingers[1][1] = firstFinger1[1];
  }
}