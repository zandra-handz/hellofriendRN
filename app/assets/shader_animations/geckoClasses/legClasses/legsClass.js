 import {
  _getPointTowardB,
  _getCenterPoint,
  _getDistanceScalar,
  _getDotScalar,
  _subtractVec,
  _getAngleFromXAxis,
  _getForwardAngle,

  getFrontStepsSagTrans,
} from "../../utils.js";
 

import { updateShoulderRotator, solveElbowIK, getCalcStep, getPivotedStep, solveFingers } from "../../utils.js";

// I am keeping both centerJoint and stepCenterJoint for now in case
// additional animation needs to be done to the shoulder joint but not the spine joint
// that the legs are mapping onto
export default class Legs {
  constructor(
    state,
    spine,
    motion,
    shoulderSpineJoint,
    stepCenterJoint,
    stepCenterRadius,
    stepAheadJoint,
    stepPivotSize,
    fingerLen,
    // syncedJoint,
    u_center_joint,
    u_rotator_joint_prefix,
    u_offset = 0,
    u_step_target_prefix,
    u_elbow_prefix,
    u_muscle_prefix,
    u_feet_prefix,
    u_finger_prefix,
    u_debug_prefix,
    u_debug_extra_prefix,
    rotationRadius = 0.007, // original as default
    rotationRange = 2.2, // original as default
    stepThreshhold = 0.06, // original as default
    stepWiggleRoom = 0.02, // original as default
    stepWideness = 3.4,
    stepReach = 0.0453,
    upperArmLength = 0.042,
    forearmLength = 0.026
  ) {
    this.TAU = Math.PI * 2;
    this.state = state;
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

    this.centerToAheadAngle = 0;
    this.chestAngle = 0; // rename
    this.stepsDistanceApart = 0;

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

    this.muscles = [
      [0.5, 0.5],
      [0.5, 0.5],
      [0.5, 0.5],
      [0.5, 0.5],
    ];

    this.feet = [
      [0.5, 0.5],
      [0.5, 0.5],
    ];

    this.fingers = [
      [
        [0.5, 0.5],
        [0.5, 0.5],
        [0.5, 0.5],
        [0.5, 0.5],
        [0.5, 0.5],
      ],

      [
        [0.5, 0.5],
        [0.5, 0.5],
        [0.5, 0.5],
        [0.5, 0.5],
        [0.5, 0.5],
      ],
    ];

    this.fingerLen = fingerLen;
    this.fingerAngleOffset = 5;

    this.stepTargets = [
      [0.5, 0.5],
      [0.5, 0.5],
    ];

    this.stepThreshhold = stepThreshhold;
    this.stepWiggleRoom = stepWiggleRoom;
    this.stepWideness = stepWideness;
    this.stepReach = stepReach;

    this.upperArmLength = upperArmLength;
    this.forearmLength = forearmLength;

    this.u_center_joint = u_center_joint;
    this.u_rotator_joint_prefix = u_rotator_joint_prefix;
    (this.u_offset = u_offset),
      (this.u_step_target_prefix = u_step_target_prefix);
    this.u_elbow_prefix = u_elbow_prefix;
    this.u_muscle_prefix = u_muscle_prefix;
    this.u_feet_prefix = u_feet_prefix;
    this.u_finger_prefix = u_finger_prefix; // will be ten, they go from 01 - 15
    this.u_debug_prefix = u_debug_prefix;
    this.u_debug_extra_prefix = u_debug_extra_prefix;

    this.debugDesired = [
      [0.5, 0.5],
      [0.5, 0.5],
    ];
    this.debugDesiredExtra = [
      [0.5, 0.5],
      [0.5, 0.5],
    ];
  }

  // get direction from center to step ahead joint
  updateForwardAngle() {
    this.centerToAheadAngle = _getForwardAngle(
      this.stepCenterJoint,
      this.stepAheadJoint
    );
  }

  solveStepTargetsPaired() {
    // get dot product of steps' current locations
    const mainDot = _getDotScalar(
      this.stepTargets[0],
      this.stepTargets[1],
      this.stepCenterJoint.direction
    );

    let leftIsAhead = mainDot > 0;

    let data = getFrontStepsSagTrans(
      this.stepTargets[0],
      this.stepTargets[1],
      this.stepAheadJoint.angle,
      this.stepCenterJoint.angle
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

    if (leftIsAhead) {
      // console.log("Left is ahead");
    } else {
    }
    ////////////////////////////////////////////////////////////////
    const distanceOut = this.stepCenterRadius + this.stepReach + 0.01;

    const calcStep0 = getCalcStep(
      this.stepCenterJoint,
      this.centerToAheadAngle,
      distanceOut,
      this.stepWideness,
      false
    );
    const calcStep1 = getCalcStep(
      this.stepCenterJoint,
      this.centerToAheadAngle,
      distanceOut,
      this.stepWideness,
      true
    );

    const bigStep0 = getPivotedStep(
      calcStep0,
      this.stepTargets[1],
      this.stepPivotSize,
      distanceOut,
      false
    );
    const bigStep1 = getPivotedStep(
      calcStep1,
      this.stepTargets[0],
      this.stepPivotSize,
      distanceOut,
      true
    );

    // FOR THRESHHOLD CHECK
    let lDist = _getDistanceScalar(calcStep0, this.stepTargets[0]);
    let rDist = _getDistanceScalar(calcStep1, this.stepTargets[1]);

    // FOR PARALLEL CHECK
    const lDot = _getDotScalar(
      this.stepTargets[1],
      calcStep0,
      this.stepCenterJoint.direction
    );

    let leftDesiredIsAhead = lDot > 0;

    const rDot = _getDotScalar(
      this.stepTargets[0],
      calcStep1,
      this.stepCenterJoint.direction
    );
    let rightDesiredIsAhead = rDot > 0;

    // REMOVE IN FUTURE
    this.debugDesiredExtra[0][0] = bigStep0[0];
    this.debugDesiredExtra[0][1] = bigStep0[1];
    this.debugDesiredExtra[1][0] = bigStep1[0];
    this.debugDesiredExtra[1][1] = bigStep1[1];
    this.debugDesired[0] = calcStep0;
    this.debugDesired[1] = calcStep1;
    ///////////////////////////////////////////////

    // PICK STEP
    if (this.state.takeStep0) {
      if (!leftDesiredIsAhead) {
        this.stepTargets[0] = bigStep0;
        this.stepTargets[0].angle = calcStep0.angle; //????
      } else {
        this.stepTargets[0] = calcStep0;
      }
      this.state.stepCompleted(false);
    } else if (lDist > this.stepThreshhold + this.stepWiggleRoom) {
      this.state.catchUp(false);
    }

    if (this.state.takeStep1) {
      if (!rightDesiredIsAhead) {
        this.stepTargets[1] = bigStep1;
        this.stepTargets[1].angle = calcStep1.angle; //???? update: yes, for finger placement, thank you past me
      } else {
        this.stepTargets[1] = calcStep1;
      }

      this.state.stepCompleted(true);
    } else if (rDist > this.stepThreshhold + this.stepWiggleRoom) {
      this.state.catchUp(true);
    }
  }

  //   updateDebugUniforms() {
  //     this.gl.setUniformPairsLoop(
  //       2,
  //       this.u_offset,
  //       [this.u_debug_prefix, this.u_debug_extra_prefix],
  //       [this.debugDesired, this.debugDesiredExtra]
  //     );
  //   }

  //   updateUniforms() {
  //     // CENTER JOINT
  //     this.gl.setSingleUniform(`${this.u_center_joint}`, this.shoulderSpineJoint);

  //     // SHOULDER JOINTS
  //     this.gl.setSingleUniform(
  //       `${this.u_rotator_joint_prefix}0`,
  //       this.rotatorJoint0
  //     );
  //     this.gl.setSingleUniform(
  //       `${this.u_rotator_joint_prefix}1`,
  //       this.rotatorJoint1
  //     );

  //     // STEP TARGET, ELBOW, AND FEET JOINTS
  //     this.gl.setUniformPairsLoop(
  //       2,
  //       this.u_offset,
  //       [this.u_step_target_prefix, this.u_elbow_prefix, this.u_feet_prefix],
  //       [this.stepTargets, this.elbows, this.feet]
  //     );

  //     this.gl.setArrayOfUniforms(this.u_muscle_prefix, this.muscles);
  //     this.gl.setArrayOfUniforms(`${this.u_finger_prefix}${0}`, this.fingers[0]);
  //     this.gl.setArrayOfUniforms(`${this.u_finger_prefix}${1}`, this.fingers[1]);

  //   }

  update() {
    this.updateForwardAngle();

    // updates rotator joint position only
    updateShoulderRotator(
      this.rotatorJoint0,
      this.rotationRadius,
      this.rotationRange,
      this.state.phase,
      [this.shoulderSpineJoint[0], this.shoulderSpineJoint[1]],
      this.shoulderSpineJoint.angle,
      false,
      false
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
      true
    );
    this.solveStepTargetsPaired();

    solveElbowIK(
      this.rotatorJoint0,
      this.elbows[0],
      this.stepTargets[0],
      this.upperArmLength,
      this.forearmLength,
      false
    );
    solveElbowIK(
      this.rotatorJoint1,
      this.elbows[1],
      this.stepTargets[1],
      this.upperArmLength,
      this.forearmLength,
      true
    );

    //     this.muscles[0] = _getCenterPoint(this.stepTargets[0], this.elbows[0]);
    // this.muscles[1] = _getCenterPoint(this.elbows[0], this.rotatorJoint0);
    // this.muscles[2] = _getCenterPoint(this.stepTargets[1], this.elbows[1]);
    // this.muscles[3] = _getCenterPoint(this.elbows[1], this.rotatorJoint1);
    //     this.muscles[0] = _getPointTowardB( this.elbows[0], this.rotatorJoint0, .7);
    // this.muscles[1] = _getPointTowardB(this.elbows[0], this.rotatorJoint0, .9);
    // this.muscles[2] =_getPointTowardB(this.elbows[1], this.rotatorJoint1, .85);
    // this.muscles[3] = _getPointTowardB(this.elbows[1], this.rotatorJoint1, .9);

    this.muscles[0] = _getCenterPoint(this.stepTargets[0], this.elbows[0]);
    this.muscles[1] = _getCenterPoint(this.elbows[0], this.stepCenterJoint);
    this.muscles[2] = _getCenterPoint(this.stepTargets[1], this.elbows[1]);
    this.muscles[3] = _getCenterPoint(this.elbows[1], this.stepCenterJoint);
    solveFingers(
      this.stepTargets[0],
      this.fingers[0],
      this.fingerLen,
      false,
      this.fingerAngleOffset
    );

    solveFingers(
      this.stepTargets[1],
      this.fingers[1],
      this.fingerLen,
      true,
      this.fingerAngleOffset
    );

    // this.updateUniforms();
    // this.updateDebugUniforms();
  }

  // LOGGING OPTIONS
  logData() {
    console.log(`Legs centerToAheadAngle: ${this.centerToAheadAngle}`);
    console.log(
      `Thresh: ${this.stepThreshhold}, Wideness: ${this.stepWideness}, Reach: ${this.stepReach}, Radius: ${this.stepCenterRadius}`
    );
    console.log(`Legs perpendicular of steps angle: ${this.chestAngle}`);
  }

  logAllUniformNames() {
    console.log("Center Joint Uniform:", this.u_center_joint);
    console.log("Rotator Joint 0 Uniform:", `${this.u_rotator_joint_prefix}0`);
    console.log("Rotator Joint 1 Uniform:", `${this.u_rotator_joint_prefix}1`);
    for (let i = 0; i < 2; i++) {
      console.log(`${this.u_step_target_prefix}${i + this.u_offset}`);
    }
    for (let i = 0; i < 2; i++) {
      console.log(`${this.u_elbow_prefix}${i + this.u_offset}`);
    }
    for (let i = 0; i < 2; i++) {
      console.log(`${this.u_feet_prefix}${i + this.u_offset}`);
    }
    for (let i = 0; i < 2; i++) {
      console.log(`${this.u_debug_prefix}${i + this.u_offset}`);
    }
    for (let i = 0; i < 2; i++) {
      console.log(`${this.u_debug_extra_prefix}${i + this.u_offset}`);
    }
  }
}
