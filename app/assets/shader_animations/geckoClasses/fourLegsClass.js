import Legs from "./legClasses/legsClass.js";
import FollowerLegs from "./legClasses/followerLegsClass.js";
import ThemedListItem from "react-native-elements/dist/list/ListItem.js";

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
    forwardStepThreshhold = 0.09, // original as default
    reverseStepThreshold = .09,
    stepPivotSizeFront,
    stepPivotSizeBack,
    stepWideness = 4,
    reverseStepWideness = 4,
    stepReach = 0.0463,
    reverseStepReach = .0463,

    rotationRadius = 0.007, // original as default
    rotationRange = 2.2, // original as default


    upperArmLength = 0.042,
    forearmLength = 0.026, //upperArmLength * 0.619047619;
  ) {
    this.TAU = Math.PI * 2;

    this.state = state;
    this.spine = spine;
    this.valuesForReversing = valuesForReversing;

    this.stepWiggleRoom = forwardStepThreshhold / 3; 
    this.reverseStepWiggleRoom = reverseStepThreshold / 3;

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
      forwardStepThreshhold,
      reverseStepThreshold,
      this.stepWiggleRoom,
      this.reverseStepWiggleRoom,
      stepWideness,
      reverseStepWideness,
      stepReach,
      reverseStepReach,
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
      forwardStepThreshhold + 0.01,
      reverseStepThreshold + .01,

      this.stepWiggleRoom,
      this.reverseStepWiggleRoom,
      stepWideness,
      reverseStepWideness,
      stepReach,
      reverseStepReach,
      backUpLegLen,
      backLowLegLen,
    );
  }

  // jumpUpdate() {
  //   if (
  //     !this.valuesForReversing.jumpRotation ||
  //     this.valuesForReversing.jumpRotation === 0
  //   ) {
  //     return;
  //   }

  //   const jumpRot = this.valuesForReversing.jumpRotation;
  //   const cos = Math.cos(jumpRot);
  //   const sin = Math.sin(jumpRot);
  //   const cursor = this.valuesForReversing.jumpedCursorPosition;

  //   // Front legs
  //   for (let i = 0; i < 2; i++) {
  //     const dx = this.frontLegs.stepTargets[i][0] - cursor[0];
  //     const dy = this.frontLegs.stepTargets[i][1] - cursor[1];

  //     this.frontLegs.stepTargets[i][0] = cursor[0] + (dx * cos - dy * sin);
  //     this.frontLegs.stepTargets[i][1] = cursor[1] + (dx * sin + dy * cos);
  //   }

  //   // Back legs
  //   for (let i = 0; i < 2; i++) {
  //     const dx = this.backLegs.stepTargets[i][0] - cursor[0];
  //     const dy = this.backLegs.stepTargets[i][1] - cursor[1];

  //     this.backLegs.stepTargets[i][0] = cursor[0] + (dx * cos - dy * sin);
  //     this.backLegs.stepTargets[i][1] = cursor[1] + (dx * sin + dy * cos);
  //   }
  // }

  // update() {
  //   this.frontLegs.update();
  //   this.backLegs.update();
  // }

  update() {
    //   if (this.valuesForReversing.jumpRotation && this.valuesForReversing.jumpRotation !== 0) {
    //     console.log('TRIGGER JUMP STEPS')
    //      this.jumpUpdate();
    //      console.log(`jump`, this.frontLegs.stepTargets)
    //   } else {
    // console.log('no jump',this.frontLegs.stepTargets)
    this.frontLegs.update();
    this.backLegs.update();

    // }
  }

  //   logAllUniformNames() {
  //     this.frontLegs.logAllUniformNames();
  //     this.backLegs.logAllUniformNames();
  //   }
}
