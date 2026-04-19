import Legs from "./legClasses/legsClass.js";
import FollowerLegs from "./legClasses/followerLegsClass.js";
import ThemedListItem from "react-native-elements/dist/list/ListItem.js";
import ThemedDialog from "react-native-elements/dist/dialog/Dialog.js";

let backUpLegLen = 0.05;
let backLowLegLen = 0.02;
// let backFingerLen = 0.026;

// let fingerLen = 0.026; // logo still based on these
let backFingerLen = 0.02;

let fingerLen = 0.02;

export default class FourLegs {
  constructor(
    state,
    valuesForReversing,

    spine,
    motion,
    forwardStepThreshhold = 0.09, // original as default
    reverseStepThreshold = 0.09,
    stepPivotSizeFront,
    stepPivotSizeBack,
    stepWideness = 4,
    reverseStepWideness = 4,
    stepReach = 0.0463,
    reverseStepReach = 0.0463,

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
    this.jointAngles = spine.jointAngles;
    this.stepAheadJointFrontAngle = spine.jointAngles[0];
    this.shoulderSpineJoint = spine.joints[2];
    this.stepCenterJointFront = spine.joints[2];
    this.stepCenterJointFrontAngle = spine.jointAngles[2];
    this.distanceOutRadiusFront = 0.02;
    this.joints = spine.joints;

    this.stepBehindJointFront = spine.joints[0]; // guessing
    this.anchorJointIndex = 2;
    this.frontAheadAngleIndex = 0;

    this.back_anchorJIndex = 13;
    this.back_aheadJIndex = 2;

    this.stepAheadJointBack = spine.joints[2]; // head
    this.hipSpineJoint = spine.joints[13];
    this.stepCenterJointBack = spine.joints[13];
    this.distanceOutRadiusBack = 0.02;
    this.stepBehindJointBack = spine.joints[13]; // guessing

    this.frontLegs = new Legs(
      state,
      this.valuesForReversing,
      this.joints,
      this.jointAngles,
      this.anchorJointIndex,
      this.frontAheadAngleIndex,
      motion,
      // this.stepCenterJointFront,
      // this.stepCenterJointFrontAngle,
      this.distanceOutRadiusFront,
      this.stepAheadJointFront,
      // this.stepAheadJointFrontAngle,
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
      this.joints,
      this.jointAngles,
      this.back_anchorJIndex,
      this.back_aheadJIndex,
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
      reverseStepThreshold + 0.01,

      this.stepWiggleRoom,
      this.reverseStepWiggleRoom,
      stepWideness,
      reverseStepWideness,
      stepReach,
      reverseStepReach,
      backUpLegLen,
      backLowLegLen,
    );

    this.allStepTargets = [
      this.frontLegs.stepTargets[0],
      this.frontLegs.stepTargets[1],
      this.backLegs.stepTargets[0],
      this.backLegs.stepTargets[1],
    ];


    this.firstFingers = [
      this.frontLegs.fingers[0][0],
      this.frontLegs.fingers[1][0],
      this.backLegs.fingers[0][0],
      this.backLegs.fingers[1][0]
    ]

    this.allStepTargetAngles = new Float32Array(4);

    // this.allFingers = [
    //   this.frontLegs.fingers[0][0],
    //   this.frontLegs.fingers[0][1],
    //   this.frontLegs.fingers[0][2],
    //   this.frontLegs.fingers[0][3],
    //   this.frontLegs.fingers[0][4],

    //   this.frontLegs.fingers[1][0],
    //   this.frontLegs.fingers[1][1],
    //   this.frontLegs.fingers[1][2],
    //   this.frontLegs.fingers[1][3],
    //   this.frontLegs.fingers[1][4],

    //   this.backLegs.fingers[0][0],
    //   this.backLegs.fingers[0][1],
    //   this.backLegs.fingers[0][2],
    //   this.backLegs.fingers[0][3],
    //   this.backLegs.fingers[0][4],

    //   this.backLegs.fingers[1][0],
    //   this.backLegs.fingers[1][1],
    //   this.backLegs.fingers[1][2],
    //   this.backLegs.fingers[1][3],
    //   this.backLegs.fingers[1][4],


    // ];
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

    this.allStepTargetAngles[0] = this.frontLegs.stepTargetAngle0;
    this.allStepTargetAngles[1] = this.frontLegs.stepTargetAngle1;
    this.allStepTargetAngles[2] = this.backLegs.stepTargetAngles[0];
    this.allStepTargetAngles[3] = this.backLegs.stepTargetAngles[1];

    // }
  }

  //   logAllUniformNames() {
  //     this.frontLegs.logAllUniformNames();
  //     this.backLegs.logAllUniformNames();
  //   }
}
