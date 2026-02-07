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
// } from "../../utils.js";

// import {
//   updateShoulderRotator,
//   solveElbowIK,
//   getCalcStep_inPlace,
//   solveFingers,
// } from "../../utils.js";

// I am keeping both centerJoint and stepCenterJoint for now in case
// additional animation needs to be done to the shoulder joint but not the spine joint
// that the legs are mapping onto
// export default class Legs {
//   constructor(
//     state,
//     valuesForReversing,

//     spine,
//     motion,
//     shoulderSpineJoint,
//     stepCenterJoint,
//     stepCenterRadius,
//     stepAheadJoint,
//     stepBehindJoint,
//     stepPivotSize,
//     fingerLen,
//     rotationRadius = 0.007, // original as default
//     rotationRange = 2.2, // original as default
//     stepThreshhold = 0.06, // original as default
//     stepWiggleRoom = 0.02, // original as default
//     stepWideness = 3.4,
//     stepReach = 0.0453,
//     upperArmLength = 0.042,
//     forearmLength = 0.026,
//   ) {
//     this.TAU = Math.PI * 2;
//     this.state = state;
//     this.valuesForReversing = valuesForReversing;
//     this.spine = spine;

//     this.motion = motion;

//     this.shoulderSpineJoint = shoulderSpineJoint; // anchorCenter
//     this.rotatorJoint0 = [0.5, 0.5]; //anchorFront/Back0/1
//     this.rotatorJoint1 = [0.5, 0.5];

//     this.rotationRadius = rotationRadius;
//     this.rotationRange = rotationRange;

//     this.stepPivotSize = stepPivotSize;
//     this.stepCenterJoint = stepCenterJoint; //can be same as anchor or different (spine.joints[2])
//     this.stepCenterRadius = stepCenterRadius; //can be same as anchor or different
//     this.stepAheadJoint = stepAheadJoint;
//     this.stepBehindJoint = stepBehindJoint;

//     this.centerToAheadAngle = 0;
//     this.centerToBehindAngle = 0;
//     this.chestAngle = 0; // rename
//     this.stepsDistanceApart = 0;

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

//     this.elbows = [
//       [0.5, 0.5],
//       [0.5, 0.5],
//     ];

//     this.muscles = [
//       [0.5, 0.5],
//       [0.5, 0.5],
//       [0.5, 0.5],
//       [0.5, 0.5],
//     ];

//     this.feet = [
//       [0.5, 0.5],
//       [0.5, 0.5],
//     ];

//     // 10 fingers × vec2
//     this.fingerBuffer = new Float32Array(20);

//     // Inside constructor
//     this.calcStepBuffer = [
//       [0, 0], // step 0
//       [0, 0], // step 1
//     ];
//     this.bigStepBuffer = [
//       [0, 0], // pivoted step 0
//       [0, 0], // pivoted step 1
//     ];

//     // Convenience views (NO allocation after this)
//     this.fingers = [
//       Array.from({ length: 5 }, (_, i) =>
//         this.fingerBuffer.subarray(i * 2, i * 2 + 2),
//       ),
//       Array.from({ length: 5 }, (_, i) =>
//         this.fingerBuffer.subarray(10 + i * 2, 10 + i * 2 + 2),
//       ),
//     ];

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

//     this.fingerLen = fingerLen;
//     this.fingerAngleOffset = 7;

//     this.stepTargets = [
//       [0.5, 0.5],
//       [0.5, 0.5],
//     ];

//     this.stepThreshhold = stepThreshhold;
//     this.stepWiggleRoom = stepWiggleRoom;
//     this.stepWideness = stepWideness;
//     this.stepReach = stepReach;

//     this.upperArmLength = upperArmLength;
//     this.forearmLength = forearmLength;
//   }

//   // not using rn
//   getStepValues() {
//     if (this.valuesForReversing.goingBackwards) {
//     this.stepThreshhold = 0.03;
//       this.stepWideness = 5;
//       this.stepReach = 0.0253;
//     } else {
//       this.stepThreshhold = 0.09;
//       this.stepWideness = 4;
//       this.stepReach = 0.0463;
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

//   solveStepTargetsPaired() {
//     // get dot product of steps' current locations
//     // const mainDot = _getDotScalar(
//     //   this.stepTargets[0],
//     //   this.stepTargets[1],
//     //   this.stepCenterJoint.direction
//     // );

//     // let leftIsAhead = mainDot > 0;

//     let data = getFrontStepsSagTrans(
//       this.stepTargets[0],
//       this.stepTargets[1],
//       this.stepAheadJoint.angle,
//       this.stepCenterJoint.angle,
//     );

//     this.stepsDistanceApart = data.tDistanceApart;
//     this.stepsTCenter = data.tCenter;
//     this.stepsTAngle = data.tAngle;
//     this.stepsTLine = data.tLine;
//     this.stepsSAngle = data.sAngle;
//     this.stepsSLine = data.sLine;

//     this.chestAngle = data.sAngle;

//     // PACKAGE AND SEND DATA TO MOTION CLASS
//     let dataForMotionClass = {
//       frontSteps_tDistanceApart: this.stepsDistanceApart,
//       frontStepsTCenter: this.stepsTCenter,
//       frontStepsTAngle: this.stepsTAngle,
//       frontStepsTLine: this.stepsTLine,
//       frontStepsSAngle: this.stepsSAngle,
//       frontStepsSLine: this.stepsSLine,
//       frontSteps_aheadJointAngle: this.stepAheadJoint.angle,
//       frontSteps_spineJointAngle: this.stepCenterJoint.angle,
//     };

//     // if (this.state.swayBodyFront) {
//     this.motion.update_frontStepsData(dataForMotionClass); // will cause updateCurveAngles on subMotions to update on their next update

//     // }

//     // if (leftIsAhead) {
//     //   // console.log("Left is ahead");
//     // } else {
//     // }
//     ////////////////////////////////////////////////////////////////
//     const distanceOut = this.stepCenterRadius + this.stepReach + 0.01;

//     let calcStep0 = [0, 0];
//     let calcStep1 = [0, 0];

//     getCalcStep_inPlace(
//       calcStep0,
//       this.stepCenterJoint,
//       this.centerToAheadAngle,
//       this.centerToBehindAngle,
//       distanceOut,
//       this.stepWideness,
//       false,
//       this.valuesForReversing.goingBackwards,
//     );
//     getCalcStep_inPlace(
//       calcStep1,
//       this.stepCenterJoint,
//       this.centerToAheadAngle,
//       this.centerToBehindAngle,
//       distanceOut,
//       this.stepWideness,
//       true,
//       this.valuesForReversing.goingBackwards,
//     );

//     // const bigStep0 = getPivotedStep(
//     //   calcStep0,
//     //   this.stepTargets[1],
//     //   this.stepPivotSize,
//     //   distanceOut,
//     //   false
//     // );
//     // const bigStep1 = getPivotedStep(
//     //   calcStep1,
//     //   this.stepTargets[0],
//     //   this.stepPivotSize,
//     //   distanceOut,
//     //   true
//     // );

//     // FOR THRESHHOLD CHECK
//     let lDist = _getDistanceScalar(calcStep0, this.stepTargets[0]);
//     let rDist = _getDistanceScalar(calcStep1, this.stepTargets[1]);

//     // FOR PARALLEL CHECK
//     // const lDot = _getDotScalar(
//     //   this.stepTargets[1],
//     //   calcStep0,
//     //   this.stepCenterJoint.direction
//     // );

//     // let leftDesiredIsAhead = lDot > 0;

//     // const rDot = _getDotScalar(
//     //   this.stepTargets[0],
//     //   calcStep1,
//     //   this.stepCenterJoint.direction
//     // );
//     // let rightDesiredIsAhead = rDot > 0;

//     // REMOVE IN FUTURE
//     // this.debugDesiredExtra[0][0] = bigStep0[0];
//     // this.debugDesiredExtra[0][1] = bigStep0[1];
//     // this.debugDesiredExtra[1][0] = bigStep1[0];
//     // this.debugDesiredExtra[1][1] = bigStep1[1];
//     // this.debugDesired[0] = calcStep0;
//     // this.debugDesired[1] = calcStep1;
//     ///////////////////////////////////////////////

//     // PICK STEP
//     if (this.state.takeStep0) {
//       this.stepTargets[0] = calcStep0;
//       // REMOVED FOR MOBILE
//       // if (!leftDesiredIsAhead) {
//       //   this.stepTargets[0] = bigStep0;
//       //   this.stepTargets[0].angle = calcStep0.angle; //????
//       // } else {
//       //   this.stepTargets[0] = calcStep0;
//       // }
//       this.state.stepCompleted(false);
//     } else if (lDist > this.stepThreshhold + this.stepWiggleRoom) {
//       this.state.catchUp(false);
//     }

//     if (this.state.takeStep1) {
//       this.stepTargets[1] = calcStep1;

//       // if (!rightDesiredIsAhead) {
//       //   console.log('oop big step')
//       //   this.stepTargets[1] = bigStep1;
//       //   this.stepTargets[1].angle = calcStep1.angle; //???? update: yes, for finger placement, thank you past me
//       // } else {
//       //   this.stepTargets[1] = calcStep1;
//       // }

//       this.state.stepCompleted(true);
//     } else if (rDist > this.stepThreshhold + this.stepWiggleRoom) {
//       this.state.catchUp(true);
//     }
//   }

//   update() {

//     console.log(`LEGS: going backwards? `, this.valuesForReversing.goingBackwards);
//     this.getStepValues();
//     // if ( this.valuesForReversing.jumpRotation) {
//     //      console.log(`rotation delta of hop inside legsClass: `, this.valuesForReversing.jumpRotation)
//     //   console.log(`first position after jump: `, this.valuesForReversing.jumpedFirstPosition)

//     // }

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
//       this.shoulderSpineJoint.angle,
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
//       this.shoulderSpineJoint.angle,
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
} from "../../utils.js";

import {
  updateShoulderRotator,
  solveElbowIK,
  getCalcStep_inPlace,
  solveFingers,
} from "../../utils.js";

// I am keeping both centerJoint and stepCenterJoint for now in case
// additional animation needs to be done to the shoulder joint but not the spine joint
// that the legs are mapping onto
export default class Legs {
  constructor(
    state,
    valuesForReversing,

    spine,
    motion,
    shoulderSpineJoint,
    stepCenterJoint,
    stepCenterRadius,
    stepAheadJoint,
    stepBehindJoint,
    stepPivotSize,
    fingerLen,
    rotationRadius = 0.007, // original as default
    rotationRange = 2.2, // original as default
    forwardStepThreshhold = 0.06, // original as default
    reverseStepThreshhold = .06,
    forwardStepWiggleRoom = 0.02, // original as default
    reverseStepWiggleRoom = .02,
    forwardStepWideness = 3.4,
    reverseStepWideness = 3.4,
    forwardStepReach = 0.0453,
    reverseStepReach = .0453,
    upperArmLength = 0.042,
    forearmLength = 0.026,
  ) {
    this.TAU = Math.PI * 2;
    this.state = state;
    this.valuesForReversing = valuesForReversing;
    this.spine = spine;

    this.motion = motion;

    this.shoulderSpineJoint = shoulderSpineJoint; // anchorCenter
    this.rotatorJoint0 = [0.5, 0.5]; //anchorFront/Back0/1
    this.rotatorJoint1 = [0.5, 0.5];

    this.rotationRadius = rotationRadius;
    this.rotationRange = rotationRange;

    this.stepPivotSize = stepPivotSize;
    this.stepCenterJoint = stepCenterJoint; //can be same as anchor or different (spine.joints[2])
    this.stepCenterRadius = stepCenterRadius; //can be same as anchor or different
    this.stepAheadJoint = stepAheadJoint;
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

    this.elbows = [
      [0.5, 0.5],
      [0.5, 0.5],
    ];

    // this.muscles = [
    //   [0.5, 0.5],
    //   [0.5, 0.5],
    //   [0.5, 0.5],
    //   [0.5, 0.5],
    // ];

    this.muscleBuffer = new Float32Array(8);

// Create views into the buffer
this.muscles = Array.from({ length: 4 }, (_, i) =>
  this.muscleBuffer.subarray(i * 2, i * 2 + 2)
);
    this.feet = [
      [0.5, 0.5],
      [0.5, 0.5],
    ];

    // 10 fingers × vec2
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

  

    this.fingerLen = fingerLen;
    this.fingerAngleOffset = 7;

    this.stepTargets = [
      [0.5, 0.5],
      [0.5, 0.5],
    ];

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

  // ─────────────────────────────────────────────
  // TRANSITION: Reset steps when switching from backward to forward
  // ─────────────────────────────────────────────
  // resetStepsOnForward() {
  //   console.log('reset')
  //   console.log(this.state.takeStep0)
 
  //   this.state.takeStep0 = true;
  //    this.state.takeStep1 = false;
  // }

  solveStepTargetsPaired() {
    // get dot product of steps' current locations
    // const mainDot = _getDotScalar(
    //   this.stepTargets[0],
    //   this.stepTargets[1],
    //   this.stepCenterJoint.direction
    // );

    // let leftIsAhead = mainDot > 0;

    let data = getFrontStepsSagTrans(
      this.stepTargets[0],
      this.stepTargets[1],
      this.stepAheadJoint.angle,
      this.stepCenterJoint.angle,
    );

    this.stepsDistanceApart = data.tDistanceApart;
    this.stepsTCenter = data.tCenter;
    this.stepsTAngle = data.tAngle;
    this.stepsTLine = data.tLine;
    this.stepsSAngle = data.sAngle;
    this.stepsSLine = data.sLine;

    this.chestAngle = data.sAngle;

    // PACKAGE AND SEND DATA TO MOTION CLASS
    let dataForMotionClass = {
      frontSteps_tDistanceApart: this.stepsDistanceApart,
      frontStepsTCenter: this.stepsTCenter,
      frontStepsTAngle: this.stepsTAngle,
      frontStepsTLine: this.stepsTLine,
      frontStepsSAngle: this.stepsSAngle,
      frontStepsSLine: this.stepsSLine,
      frontSteps_aheadJointAngle: this.stepAheadJoint.angle,
      frontSteps_spineJointAngle: this.stepCenterJoint.angle,
    };

    // if (this.state.swayBodyFront) {
    this.motion.update_frontStepsData(dataForMotionClass); // will cause updateCurveAngles on subMotions to update on their next update

    // }

    // if (leftIsAhead) {
    //   // console.log("Left is ahead");
    // } else {
    // }
    ////////////////////////////////////////////////////////////////
    const distanceOut = this.stepCenterRadius + this.stepReach + 0.01;

    let calcStep0 = [0, 0];
    let calcStep1 = [0, 0];

    getCalcStep_inPlace(
      calcStep0,
      this.stepCenterJoint,
      this.centerToAheadAngle,
      this.centerToBehindAngle,
      distanceOut,
      this.stepWideness,
      false,
      this.valuesForReversing.goingBackwards,
    );
    getCalcStep_inPlace(
      calcStep1,
      this.stepCenterJoint,
      this.centerToAheadAngle,
      this.centerToBehindAngle,
      distanceOut,
      this.stepWideness,
      true,
      this.valuesForReversing.goingBackwards,
    );

    // const bigStep0 = getPivotedStep(
    //   calcStep0,
    //   this.stepTargets[1],
    //   this.stepPivotSize,
    //   distanceOut,
    //   false
    // );
    // const bigStep1 = getPivotedStep(
    //   calcStep1,
    //   this.stepTargets[0],
    //   this.stepPivotSize,
    //   distanceOut,
    //   true
    // );

    // FOR THRESHHOLD CHECK
    let lDist = _getDistanceScalar(calcStep0, this.stepTargets[0]);
    let rDist = _getDistanceScalar(calcStep1, this.stepTargets[1]);

    // FOR PARALLEL CHECK
    // const lDot = _getDotScalar(
    //   this.stepTargets[1],
    //   calcStep0,
    //   this.stepCenterJoint.direction
    // );

    // let leftDesiredIsAhead = lDot > 0;

    // const rDot = _getDotScalar(
    //   this.stepTargets[0],
    //   calcStep1,
    //   this.stepCenterJoint.direction
    // );
    // let rightDesiredIsAhead = rDot > 0;

    // REMOVE IN FUTURE
    // this.debugDesiredExtra[0][0] = bigStep0[0];
    // this.debugDesiredExtra[0][1] = bigStep0[1];
    // this.debugDesiredExtra[1][0] = bigStep1[0];
    // this.debugDesiredExtra[1][1] = bigStep1[1];
    // this.debugDesired[0] = calcStep0;
    // this.debugDesired[1] = calcStep1;
    ///////////////////////////////////////////////

    // PICK STEP
    if (this.state.takeStep0) {
      this.stepTargets[0] = calcStep0;
      // REMOVED FOR MOBILE
      // if (!leftDesiredIsAhead) {
      //   this.stepTargets[0] = bigStep0;
      //   this.stepTargets[0].angle = calcStep0.angle; //????
      // } else {
      //   this.stepTargets[0] = calcStep0;
      // }
      this.state.stepCompleted(false);
    } else if (lDist > this.stepThreshhold + this.stepWiggleRoom) {
      this.state.catchUp(false);
    }

    if (this.state.takeStep1) {
      this.stepTargets[1] = calcStep1;

      // if (!rightDesiredIsAhead) {
      //   console.log('oop big step')
      //   this.stepTargets[1] = bigStep1;
      //   this.stepTargets[1].angle = calcStep1.angle; //???? update: yes, for finger placement, thank you past me
      // } else {
      //   this.stepTargets[1] = calcStep1;
      // }

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
      this.shoulderSpineJoint.angle,
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
      this.shoulderSpineJoint.angle,
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

    solveFingers(
      this.stepTargets[0],
      this.fingers[0],
      this.fingerLen,
      false,
      this.fingerAngleOffset,
    );

    solveFingers(
      this.stepTargets[1],
      this.fingers[1],
      this.fingerLen,
      true,
      this.fingerAngleOffset,
    );
  }
}