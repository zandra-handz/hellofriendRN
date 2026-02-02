import Legs from "./legClasses/legsClass.js";
import FollowerLegs from "./legClasses/followerLegsClass.js";

let backUpLegLen = 0.05;
let backLowLegLen = 0.02;
let backFingerLen = 0.026;

let fingerLen = 0.026;

export default class FourLegs {
  constructor(
    state,
    valuesForReversing,

    spine,
    motion,
    stepThreshhold = 0.11, // original as default
    stepPivotSizeFront,
    stepPivotSizeBack,

    rotationRadius = 0.007, // original as default
    rotationRange = 2.2, // original as default

    stepWideness = 4,
    stepReach = 0.0463,
    upperArmLength = 0.042,
    forearmLength = 0.026, //upperArmLength * 0.619047619;
  ) {
    this.TAU = Math.PI * 2;

    this.state = state;
    this.spine = spine;
    this.valuesForReversing = valuesForReversing;

    this.stepWiggleRoom = stepThreshhold / 3;

    // this.stepAheadJointFront = spine.first; // head
    // this.shoulderSpineJoint = spine.joints[2];
    // this.stepCenterJointFront = spine.joints[2];
    // this.distanceOutRadiusFront = 0.02;

    // this.stepAheadJointBack = spine.joints[2]; // head
    // this.hipSpineJoint = spine.joints[13];
    // this.stepCenterJointBack = spine.joints[13];
    // this.distanceOutRadiusBack = 0.02;

    this.stepAheadJointFront = spine.first; // head
    this.shoulderSpineJoint = spine.joints[2];
    this.stepCenterJointFront = spine.joints[2];
    this.distanceOutRadiusFront = 0.02;

    this.stepBehindJointFront = spine.joints[0]; // guessing

    this.stepAheadJointBack = spine.joints[2]; // head
    this.hipSpineJoint = spine.joints[13];
    this.stepCenterJointBack = spine.joints[13];
    this.distanceOutRadiusBack = 0.02;
    this.stepBehindJointBack = spine.joints[13]; // guessing

    this.frontLegs = new Legs(
      state,
      this.valuesForReversing,
      spine,
      motion,
      this.shoulderSpineJoint,
      this.stepCenterJointFront,
      this.distanceOutRadiusFront,
      this.stepAheadJointFront,
      this.stepBehindJointFront,
      stepPivotSizeFront,
      fingerLen, 
   
      rotationRadius,
      rotationRange,
      stepThreshhold,
      this.stepWiggleRoom,
      stepWideness,
      stepReach,
      upperArmLength,
      forearmLength,
    );

    this.backLegs = new FollowerLegs(
      state,
      this.valuesForReversing,
      spine,
      motion,
      this.frontLegs.stepTargets,
      this.hipSpineJoint,
      this.stepCenterJointBack,
      this.distanceOutRadiusBack,
      this.stepAheadJointBack,
      this.stepAheadJointBack,
      this.stepBehindJointBack,
      stepPivotSizeBack,
      backFingerLen, 
      rotationRadius,
      rotationRange,
      stepThreshhold + 0.01,
      this.stepWiggleRoom,
      stepWideness,
      stepReach,
      backUpLegLen,
      backLowLegLen,
    );
  }

  update() {
    this.frontLegs.update();
    this.backLegs.update();
  }

  //   logAllUniformNames() {
  //     this.frontLegs.logAllUniformNames();
  //     this.backLegs.logAllUniformNames();
  //   }
}
