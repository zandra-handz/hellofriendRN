import Legs from "./legClasses/legsClass.js";
import FollowerLegs from "./legClasses/followerLegsClass.js";



let backUpLegLen = 0.05;
let backLowLegLen = 0.02;
let backFingerLen = .01;

let fingerLen = .01;

export default class FourLegs {
  constructor(
  
    state,
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
    forearmLength = 0.026 //upperArmLength * 0.619047619;
  ) {
    this.TAU = Math.PI * 2;
 
    this.state = state;
    this.spine = spine;

    this.stepWiggleRoom = stepThreshhold / 3;

    this.stepAheadJointFront = spine.first; // head
    this.shoulderSpineJoint = spine.joints[2];
    this.stepCenterJointFront = spine.joints[2];
    this.distanceOutRadiusFront = 0.02;

    this.stepAheadJointBack = spine.joints[2]; // head
    this.hipSpineJoint = spine.joints[13];
    this.stepCenterJointBack = spine.joints[13];
    this.distanceOutRadiusBack = 0.02;

    this.frontLegs = new Legs(
    
      state,
      spine,
      motion,
      this.shoulderSpineJoint,
      this.stepCenterJointFront,
      this.distanceOutRadiusFront,
      this.stepAheadJointFront,
      stepPivotSizeFront,
      fingerLen,
      "anchorFrontCenter",
      "anchorFront",
      0,
      "stepTarget",
      "elbow",
      "musclesFront",
      "foot",
      "fingerFront",
      "desired",
      "desiredExtra",
      rotationRadius,
      rotationRange,
      stepThreshhold,
      this.stepWiggleRoom,
      stepWideness,
      stepReach,
      upperArmLength,
      forearmLength
    );






    this.backLegs = new FollowerLegs(
      state,
      spine,
      motion,
      this.frontLegs.stepTargets,
      this.hipSpineJoint,
      this.stepCenterJointBack,
      this.distanceOutRadiusBack,
      this.stepAheadJointBack,
      this.stepAheadJointBack,
      stepPivotSizeBack,
      backFingerLen,
      "anchorBackCenter",
      "anchorBack",
      2,
      "stepTarget",
      "elbow",
      "musclesBack",
      "foot",
      "fingerBack",
      "desired",
      "desiredExtra",
      rotationRadius,
      rotationRange,
      stepThreshhold +.01,
      this.stepWiggleRoom,
      stepWideness,
      stepReach,
      backUpLegLen,
      backLowLegLen
    );
}

  logInputData() {
    console.log(
      `FRONT Ahead joint: ${this.stepAheadJointFront.index}, r: ${this.stepAheadJointFront.radius}`
    );
    console.log(
      `FRONT Shoulder attach joint: ${this.shoulderSpineJoint.index}, r: ${this.shoulderSpineJoint.radius}`
    );
    console.log(
      `FRONT Step center joint: ${this.stepCenterJointFront.index}, r: ${this.stepCenterJointFront.radius}`
    );

    const frontStepsRadiusLength = this.spine.logSpineData(
      `Front step joints`,
      [this.stepAheadJointFront.index, this.stepCenterJointFront.index]
    );
    this.frontLegs.logData();

    console.log(
      `BACK Ahead joint: ${this.stepAheadJointBack.index}, r: ${this.stepAheadJointBack.radius}`
    );
    console.log(
      `BACK Shoulder attach joint: ${this.hipSpineJoint.index}, r: ${this.hipSpineJoint.radius}`
    );
    console.log(
      `BACK Step center joint: ${this.stepCenterJointBack.index}, r: ${this.stepCenterJointBack.radius}`
    );

    const backStepsRadiusLength = this.spine.logSpineData(`Back step joints`, [
      this.stepAheadJointBack.index,
      this.stepCenterJointBack.index,
    ]);

    console.log(
      `VARIANCE IN STEPS?`,
      frontStepsRadiusLength - backStepsRadiusLength
    );
    this.backLegs.logData();
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
