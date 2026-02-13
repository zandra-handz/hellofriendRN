import {
  _getPointTowardB,
  _getCenterPoint,
  _getCenterPoint_inPlace,
  _getDistanceScalar,
  _getDotScalar,
  _subtractVec,
  _getAngleFromXAxis,
  _getForwardAngle,
  getFrontStepsSagTrans,
  getFrontStepsSagTrans_inPlace,
} from "../../utils.js";

import {
  updateShoulderRotator,
  solveElbowIK,
  getCalcStep_inPlace,
  getCalcStep_inPlace_Opt,
  solveFingers,
  solveFingers_Opt,
} from "../../utils.js";

// I am keeping both centerJoint and stepCenterJoint for now in case
// additional animation needs to be done to the shoulder joint but not the spine joint
// that the legs are mapping onto
export default class Legs {
  constructor(
    state,
    valuesForReversing,

    joints,
    jointAngles,
    anchorJIndex,
    aheadJIndex,

    motion,
    // stepCenterJoint,
    // stepCenterJointAngle,
    stepCenterRadius,
    stepAheadJoint,
    // stepAheadJointAngle,
    stepBehindJoint,
    stepPivotSize,
    fingerLen,
    rotationRadius = 0.007, // original as default
    rotationRange = 2.2, // original as default
    forwardStepThreshhold = 0.06, // original as default
    reverseStepThreshhold = 0.06,
    forwardStepWiggleRoom = 0.02, // original as default
    reverseStepWiggleRoom = 0.02,
    forwardStepWideness = 3.4,
    reverseStepWideness = 3.4,
    forwardStepReach = 0.0453,
    reverseStepReach = 0.0453,
    upperArmLength = 0.042,
    forearmLength = 0.026,
  ) {
    this.TAU = Math.PI * 2;
    this.state = state;
    this.valuesForReversing = valuesForReversing;
    this.jointAngles = jointAngles;
    this.joints = joints;
    this.anchorJIndex = anchorJIndex;
    this.aheadJIndex = aheadJIndex;

    this.motion = motion;

    this._calcStepBuffer0 = new Float32Array(2);
    this._calcStepBuffer1 = new Float32Array(2);
    this.shoulderSpineJoint = this.joints[this.anchorJIndex]; // anchorCenter
    this.shoulderSpineJointAngle = this.jointAngles[this.anchorJIndex];
    this.rotatorJoint0 = [0.5, 0.5]; //anchorFront/Back0/1
    this.rotatorJoint1 = [0.5, 0.5];

    this.rotationRadius = rotationRadius;
    this.rotationRange = rotationRange;

    this.stepPivotSize = stepPivotSize;
    this.stepCenterJoint = this.joints[this.anchorJIndex]; //can be same as anchor or different (spine.joints[2])
    this.stepCenterJointAngle = this.jointAngles[this.anchorJIndex];
    this.stepCenterRadius = stepCenterRadius; //can be same as anchor or different
    this.stepAheadJoint = stepAheadJoint;
    this.stepAheadJointAngle = this.jointAngles[this.aheadJIndex];
    this.stepBehindJoint = stepBehindJoint;

    this.centerToAheadAngle = 0;
    this.centerToBehindAngle = 0;
    this.chestAngle = 0; // rename
    this.stepsDistanceApart = 0;

    // 🔑 transition tracking
    this.prevBackwards = false;

    // TRANSVERSE LINE
    this.stepsTCenter = [0.5, 0.5];
    this.stepsTAngle = 0;
    this.stepsTLine = [
      [0.5, 0.5],
      [0.5, 0.5],
    ];

    // SAGITTAL
    this.stepsSAngle = 0;
    this.stepsSLine = [
      [0.5, 0.5],
      [0.5, 0.5],
    ];

    // this.syncedJoint = syncedJoint;
    this.elbows = [new Float32Array([0.5, 0.5]), new Float32Array([0.5, 0.5])];

    this.muscleBuffer = new Float32Array(8);

    // Create views into the buffer
    this.muscles = Array.from({ length: 4 }, (_, i) =>
      this.muscleBuffer.subarray(i * 2, i * 2 + 2),
    );

    this.fingerBuffer = new Float32Array(20);

    // Convenience views (no allocation after this)
    this.fingers = [
      Array.from({ length: 5 }, (_, i) =>
        this.fingerBuffer.subarray(i * 2, i * 2 + 2),
      ),
      Array.from({ length: 5 }, (_, i) =>
        this.fingerBuffer.subarray(10 + i * 2, 10 + i * 2 + 2),
      ),
    ];

    this._frontStepsSagTransResult = {
      tCenter: new Float32Array(2),

      tLineStart: new Float32Array(2),
      tLineEnd: new Float32Array(2),

      sLineStart: new Float32Array(2),
      sLineEnd: new Float32Array(2),

      tDistanceApart: 0,
      sAngle: 0,
      tAngle: 0,
    };

    this.fingerLen = fingerLen;
    this.fingerAngleOffset = 7;

    this.stepTargets = [
      new Float32Array([0.5, 0.5]),
      new Float32Array([0.5, 0.5]),
    ];
    this.stepTargetAngle0 = 0;
    this.stepTargetAngle1 = 0;

    this.calcStepAngle0 = 0;
    this.calcStepAngle1 = 0;

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

  // not using rn
  getStepValues() {
    if (this.valuesForReversing.goingBackwards) {
      this.stepThreshhold = this.reverseStepThreshhold;
      this.stepWideness = this.reverseStepWideness;
      this.stepReach = this.reverseStepReach;
    } else {
      this.stepThreshhold = this.forwardStepThreshhold;
      this.stepWideness = this.forwardStepWideness;
      this.stepReach = this.forwardStepReach;
    }
  }

  // get direction from center to step ahead joint
  updateForwardAngle() {
    this.centerToAheadAngle = _getForwardAngle(
      this.stepCenterJoint,
      this.stepAheadJoint,
    );
  }

  updateBackwardAngle() {
    this.centerToBehindAngle = _getForwardAngle(
      this.stepCenterJoint,
      this.stepBehindJoint,
    );
  }
  solveStepTargetsPaired() {
    let data = getFrontStepsSagTrans_inPlace(
      this.stepTargets[0],
      this.stepTargets[1],
      this._frontStepsSagTransResult
      //  this.jointAngles[this.aheadJIndex],
      //   this.jointAngles[this.anchorJIndex],
    );
const res = this._frontStepsSagTransResult;

  // Scalars
  this.stepsDistanceApart = res.tDistanceApart;
  this.stepsTAngle = res.tAngle;
  this.stepsSAngle = res.sAngle;
  this.chestAngle = res.sAngle;

  // If other code expects stepsTCenter to be a normal array, copy into it:
  this.stepsTCenter[0] = res.tCenter[0];
  this.stepsTCenter[1] = res.tCenter[1];

  // Rebuild legacy [ [x,y], [x,y] ] lines WITHOUT allocating new arrays
  this.stepsTLine[0][0] = res.tLineStart[0];
  this.stepsTLine[0][1] = res.tLineStart[1];
  this.stepsTLine[1][0] = res.tLineEnd[0];
  this.stepsTLine[1][1] = res.tLineEnd[1];

  this.stepsSLine[0][0] = res.sLineStart[0];
  this.stepsSLine[0][1] = res.sLineStart[1];
  this.stepsSLine[1][0] = res.sLineEnd[0];
  this.stepsSLine[1][1] = res.sLineEnd[1];

  // PACKAGE AND SEND DATA TO MOTION CLASS (same keys Motion already expects)
  const dataForMotionClass = {
    frontSteps_tDistanceApart: this.stepsDistanceApart,
    frontStepsTCenter: this.stepsTCenter,
    frontStepsTAngle: this.stepsTAngle,
    frontStepsTLine: this.stepsTLine,
    frontStepsSAngle: this.stepsSAngle,
    frontStepsSLine: this.stepsSLine,
    frontSteps_aheadJointAngle: this.jointAngles[this.aheadJIndex],
    frontSteps_spineJointAngle: this.jointAngles[this.anchorJIndex],
  };

  this.motion.update_frontStepsData(dataForMotionClass);
    const distanceOut = this.stepCenterRadius + this.stepReach + 0.01;

    // let calcStep0 = [0, 0];
    // let calcStep1 = [0, 0];
    let calcStep0 = this._calcStepBuffer0;
    let calcStep1 = this._calcStepBuffer1;

    // this.calcStepAngle0 = this.centerToAheadAngle;
    // this.calcStepAngle1 = this.centerToAheadAngle;

    this.calcStepAngle0 = getCalcStep_inPlace_Opt(
      calcStep0,
      this.stepCenterJoint,
      this.centerToAheadAngle,
      // this.centerToBehindAngle,
      distanceOut,
      this.stepWideness,
      false,
      this.valuesForReversing.goingBackwards,
    );

    getCalcStep_inPlace_Opt(
      calcStep1,
      this.stepCenterJoint,
      this.centerToAheadAngle,
      // this.centerToBehindAngle,
      distanceOut,
      this.stepWideness,
      true,
      this.valuesForReversing.goingBackwards,
    );

    let lDist = _getDistanceScalar(calcStep0, this.stepTargets[0]);
    let rDist = _getDistanceScalar(calcStep1, this.stepTargets[1]);

    // PICK STEP
    if (this.state.takeStep0) {
      this.stepTargets[0][0] = calcStep0[0];
      this.stepTargets[0][1] = calcStep0[1];
      this.stepTargetAngle0 = this.centerToAheadAngle; //  might as well just be more direct // this.calcStepAngle0;

      this.state.stepCompleted(false);
    } else if (lDist > this.stepThreshhold + this.stepWiggleRoom) {
      this.state.catchUp(false);
    }

    if (this.state.takeStep1) {
      this.stepTargets[1][0] = calcStep1[0];
      this.stepTargets[1][1] = calcStep1[1];
      this.stepTargetAngle1 = this.centerToAheadAngle;

      this.state.stepCompleted(true);
    } else if (rDist > this.stepThreshhold + this.stepWiggleRoom) {
      this.state.catchUp(true);
    }
  }

  update() {
    if (this.valuesForReversing?.goingBackwards !== this.prevBackwards) {
      this.getStepValues(this.valuesForReversing.goingBackwards);

      this.prevBackwards = this.valuesForReversing.goingBackwards;
      // console.log("SWITHCED!!", this.prevBackwards);
    }

    this.updateForwardAngle();

    if (this.valuesForReversing.goingBackwards) {
      this.updateBackwardAngle();
    }

    // updates rotator joint position only
    updateShoulderRotator(
      this.rotatorJoint0,
      this.rotationRadius,
      this.rotationRange,
      this.state.phase,
      [this.shoulderSpineJoint[0], this.shoulderSpineJoint[1]],
      this.shoulderSpineJointAngle,
      false,
      false,
      this.valuesForReversing.goingBackwards,
    );
    // updates rotator joint position only
    updateShoulderRotator(
      this.rotatorJoint1,
      this.rotationRadius,
      this.rotationRange,
      this.state.phase,
      [this.shoulderSpineJoint[0], this.shoulderSpineJoint[1]],
      this.shoulderSpineJointAngle,
      true,
      true,
      this.valuesForReversing.goingBackwards,
    );
    this.solveStepTargetsPaired();

    solveElbowIK(
      this.rotatorJoint0,
      this.elbows[0],
      this.stepTargets[0],
      this.upperArmLength,
      this.forearmLength,
      false,
    );
    solveElbowIK(
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

    solveFingers_Opt(
      this.stepTargets[0],
      this.fingers[0],
      this.fingerLen,
      false,
      this.fingerAngleOffset,
      this.stepTargetAngle0,
    );

    solveFingers_Opt(
      this.stepTargets[1],
      this.fingers[1],
      this.fingerLen,
      true,
      this.fingerAngleOffset,
      this.stepTargetAngle1,
    );
  }
}













// import {
//   _getPointTowardB,
//   _getCenterPoint,
//   _getCenterPoint_inPlace,
//   _getDistanceScalar,
//   _getDotScalar,
//   _subtractVec,
//   _getAngleFromXAxis,
//   _getForwardAngle,
//   getFrontStepsSagTrans,
//   getFrontStepsSagTrans_inPlace
// } from "../../utils.js";

// import {
//   updateShoulderRotator,
//   solveElbowIK,
//   getCalcStep_inPlace_Opt,
//   solveFingers,
// } from "../../utils.js";

// // I am keeping both centerJoint and stepCenterJoint for now in case
// // additional animation needs to be done to the shoulder joint but not the spine joint
// // that the legs are mapping onto
// export default class Legs {
//   constructor(
//     state,
//     valuesForReversing,

//     joints,
//     jointAngles,
//     anchorJIndex,
//     aheadJIndex,

//     motion,
//     // stepCenterJoint,
//     // stepCenterJointAngle,
//     stepCenterRadius,
//     stepAheadJoint,
//     // stepAheadJointAngle,
//     stepBehindJoint,
//     stepPivotSize,
//     fingerLen,
//     rotationRadius = 0.007, // original as default
//     rotationRange = 2.2, // original as default
//     forwardStepThreshhold = 0.06, // original as default
//     reverseStepThreshhold = .06,
//     forwardStepWiggleRoom = 0.02, // original as default
//     reverseStepWiggleRoom = .02,
//     forwardStepWideness = 3.4,
//     reverseStepWideness = 3.4,
//     forwardStepReach = 0.0453,
//     reverseStepReach = .0453,
//     upperArmLength = 0.042,
//     forearmLength = 0.026,
//   ) {
//     this.TAU = Math.PI * 2;
//     this.state = state;
//     this.valuesForReversing = valuesForReversing;
//     this.jointAngles = jointAngles;
//     this.joints = joints;
//     this.anchorJIndex = anchorJIndex;
//     this.aheadJIndex = aheadJIndex;

//     this.motion = motion;

//       this._calcStepBuffer0 = new Float32Array(2);
//   this._calcStepBuffer1 = new Float32Array(2);


//     this.shoulderSpineJoint = this.joints[this.anchorJIndex]; // anchorCenter
//     this.shoulderSpineJointAngle = this.jointAngles[this.anchorJIndex];
//     this.rotatorJoint0 = [0.5, 0.5]; //anchorFront/Back0/1
//     this.rotatorJoint1 = [0.5, 0.5];

//     this.rotationRadius = rotationRadius;
//     this.rotationRange = rotationRange;

//     this.stepPivotSize = stepPivotSize;
//     this.stepCenterJoint = this.joints[this.anchorJIndex]; //can be same as anchor or different (spine.joints[2])
//     this.stepCenterJointAngle = this.jointAngles[this.anchorJIndex];
//     this.stepCenterRadius = stepCenterRadius; //can be same as anchor or different
//     this.stepAheadJoint = stepAheadJoint;
//     this.stepAheadJointAngle =  this.jointAngles[this.aheadJIndex];
//     this.stepBehindJoint = stepBehindJoint;

//     this.centerToAheadAngle = 0;
//     this.centerToBehindAngle = 0;
//     this.chestAngle = 0; // rename
//     this.stepsDistanceApart = 0;

//     // 🔑 transition tracking
//     this.prevBackwards = false;

//     // TRANSVERSE LINE
//     this.stepsTCenter = [0.5, 0.5];
//     this.stepsTAngle = 0;
//     this.stepsTLine = [
//       [0.5, 0.5],
//       [0.5, 0.5],
//     ];

//     // SAGITTAL
//     this.stepsSAngle = 0;
//     this.stepsSLine = [
//       [0.5, 0.5],
//       [0.5, 0.5],
//     ];

//     // this.syncedJoint = syncedJoint;
//     this.elbows = [new Float32Array([0.5, 0.5]), new Float32Array([0.5, 0.5])];

//     this.muscleBuffer = new Float32Array(8);

// // Create views into the buffer
// this.muscles = Array.from({ length: 4 }, (_, i) =>
//   this.muscleBuffer.subarray(i * 2, i * 2 + 2)
// );

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

// this._frontStepsSagTransResult = {
//   tCenter: new Float32Array(2),

//   tLineStart: new Float32Array(2),
//   tLineEnd: new Float32Array(2),

//   sLineStart: new Float32Array(2),
//   sLineEnd: new Float32Array(2),

//   tDistanceApart: 0,
//   sAngle: 0,
//   tAngle: 0,
// };

//     this.fingerLen = fingerLen;
//     this.fingerAngleOffset = 7;

//         this.stepTargets = [
//       new Float32Array([0.5, 0.5]),
//       new Float32Array([0.5, 0.5]),
//     ];
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

//   // not using rn
//   getStepValues() {
//     if (this.valuesForReversing.goingBackwards) {
//       this.stepThreshhold = this.reverseStepThreshhold;
//       this.stepWideness = this.reverseStepWideness;
//       this.stepReach = this.reverseStepReach;
//     } else {
//       this.stepThreshhold = this.forwardStepThreshhold;
//       this.stepWideness = this.forwardStepWideness;
//       this.stepReach = this.forwardStepReach;
//     }
//   }

//   // get direction from center to step ahead joint
//   updateForwardAngle() {
//     this.centerToAheadAngle = _getForwardAngle(
//       this.stepCenterJoint,
//       this.stepAheadJoint,
//     );
//   }

//   updateBackwardAngle() {
//     this.centerToBehindAngle = _getForwardAngle(
//       this.stepCenterJoint,
//       this.stepBehindJoint,
//     );
//   }
// solveStepTargetsPaired() {
//   // Mutate the buffer in-place
//   getFrontStepsSagTrans_inPlace(
//     this.stepTargets[0],
//     this.stepTargets[1],
//     this._frontStepsSagTransResult
//   );

//   const res = this._frontStepsSagTransResult;

//   // Scalars
//   this.stepsDistanceApart = res.tDistanceApart;
//   this.stepsTAngle = res.tAngle;
//   this.stepsSAngle = res.sAngle;
//   this.chestAngle = res.sAngle;

//   // Center: either point at typed array, OR copy into your existing array.
//   // If other code expects a normal JS array, copy:
//   this.stepsTCenter[0] = res.tCenter[0];
//   this.stepsTCenter[1] = res.tCenter[1];

//   // Keep your existing line arrays, just overwrite values (no allocations)
//   this.stepsTLine[0][0] = res.tLineStart[0];
//   this.stepsTLine[0][1] = res.tLineStart[1];
//   this.stepsTLine[1][0] = res.tLineEnd[0];
//   this.stepsTLine[1][1] = res.tLineEnd[1];

//   this.stepsSLine[0][0] = res.sLineStart[0];
//   this.stepsSLine[0][1] = res.sLineStart[1];
//   this.stepsSLine[1][0] = res.sLineEnd[0];
//   this.stepsSLine[1][1] = res.sLineEnd[1];

//   // PACKAGE AND SEND DATA TO MOTION CLASS (still allocates an object; we can fix next)
//   const dataForMotionClass = {
//     frontSteps_tDistanceApart: this.stepsDistanceApart,
//     frontStepsTCenter: this.stepsTCenter,
//     frontStepsTAngle: this.stepsTAngle,
//     frontStepsTLine: this.stepsTLine,
//     frontStepsSAngle: this.stepsSAngle,
//     frontStepsSLine: this.stepsSLine,
//     frontSteps_aheadJointAngle: this.jointAngles[this.aheadJIndex],
//     frontSteps_spineJointAngle: this.jointAngles[this.anchorJIndex],
//   };

//   this.motion.update_frontStepsData(dataForMotionClass);
//     // }

//     // if (leftIsAhead) {
//     //   // console.log("Left is ahead");
//     // } else {
//     // }
//     ////////////////////////////////////////////////////////////////
//     const distanceOut = this.stepCenterRadius + this.stepReach + 0.01;

 
//     // let calcStep0 = [0, 0];
//     // let calcStep1 = [0, 0];
//     let calcStep0 = this._calcStepBuffer0;
//     let calcStep1 = this._calcStepBuffer1;

//     // this.calcStepAngle0 = this.centerToAheadAngle;
//     // this.calcStepAngle1 = this.centerToAheadAngle;

//     this.calcStepAngle0 = getCalcStep_inPlace_Opt(
//       calcStep0,
//       this.stepCenterJoint,
//       this.centerToAheadAngle,
//       // this.centerToBehindAngle,
//       distanceOut,
//       this.stepWideness,
//       false,
//       this.valuesForReversing.goingBackwards,
//     );

//     getCalcStep_inPlace_Opt(
//       calcStep1,
//       this.stepCenterJoint,
//       this.centerToAheadAngle,
//       // this.centerToBehindAngle,
//       distanceOut,
//       this.stepWideness,
//       true,
//       this.valuesForReversing.goingBackwards,
//     );


//     let lDist = _getDistanceScalar(calcStep0, this.stepTargets[0]);
//     let rDist = _getDistanceScalar(calcStep1, this.stepTargets[1]);

//     if (this.state.takeStep0) {
//       this.stepTargets[0][0] = calcStep0[0];
//       this.stepTargets[0][1] = calcStep0[1];
//       this.stepTargetAngle0 = this.centerToAheadAngle; //  might as well just be more direct // this.calcStepAngle0;

//       this.state.stepCompleted(false);
//     } else if (lDist > this.stepThreshhold + this.stepWiggleRoom) {
//       this.state.catchUp(false);
//     }

//     if (this.state.takeStep1) {
//       this.stepTargets[1][0] = calcStep1[0];
//       this.stepTargets[1][1] = calcStep1[1];
//       this.stepTargetAngle1 = this.centerToAheadAngle;

//       this.state.stepCompleted(true);
//     } else if (rDist > this.stepThreshhold + this.stepWiggleRoom) {
//       this.state.catchUp(true);
//     }
//   }

//   update() {
//     if (this.valuesForReversing?.goingBackwards !== this.prevBackwards) {
//       this.getStepValues(this.valuesForReversing.goingBackwards);

//       this.prevBackwards = this.valuesForReversing.goingBackwards;
//       // console.log("SWITHCED!!", this.prevBackwards);
//     }

//     this.updateForwardAngle();

//     if (this.valuesForReversing.goingBackwards) {
//       this.updateBackwardAngle();
//     }

//     // updates rotator joint position only
//     updateShoulderRotator(
//       this.rotatorJoint0,
//       this.rotationRadius,
//       this.rotationRange,
//       this.state.phase,
//       [this.shoulderSpineJoint[0], this.shoulderSpineJoint[1]],
//       this.shoulderSpineJointAngle,
//       false,
//       false,
//       this.valuesForReversing.goingBackwards,
//     );
//     // updates rotator joint position only
//     updateShoulderRotator(
//       this.rotatorJoint1,
//       this.rotationRadius,
//       this.rotationRange,
//       this.state.phase,
//       [this.shoulderSpineJoint[0], this.shoulderSpineJoint[1]],
//       this.shoulderSpineJointAngle,
//       true,
//       true,
//       this.valuesForReversing.goingBackwards,
//     );
//     this.solveStepTargetsPaired();

//     solveElbowIK(
//       this.rotatorJoint0,
//       this.elbows[0],
//       this.stepTargets[0],
//       this.upperArmLength,
//       this.forearmLength,
//       false,
//     );
//     solveElbowIK(
//       this.rotatorJoint1,
//       this.elbows[1],
//       this.stepTargets[1],
//       this.upperArmLength,
//       this.forearmLength,
//       true,
//     );

//     // set muscles
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
