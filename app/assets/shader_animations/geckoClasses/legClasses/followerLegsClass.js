import {
  _getPointTowardB,
  _getCenterPoint,
  _getDistanceScalar,
  _getDotScalar,
  _subtractVec,
  _getAngleFromXAxis,
  _getForwardAngle,
 
} from "../../utils.js";
 

import { updateShoulderRotator, getBackFrontStepDistance, solveBackElbowIK, getCalcStep, getPivotedStep, solveFingers, getFrontStepsSagTrans } from "../../utils.js";

// I am keeping both centerJoint and stepCenterJoint for now in case
// additional animation needs to be done to the shoulder joint but not the spine joint
// that the legs are mapping onto
export default class FollowerLegs {
  constructor(
   
    state,
    spine,
    motion,
    frontLegs_stepTargets,
    hipSpineJoint,
    stepCenterJoint,
    stepCenterRadius,
    stepAheadJoint0,
    stepAheadJoint1,
    stepPivotSize,
    fingerLen,
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
    this.frontLegs_stepTargets = frontLegs_stepTargets;
    this.hipSpineJoint = hipSpineJoint;
    this.rotatorJoint0 = [0.5, 0.5]; //anchorFront/Back0/1
    this.rotatorJoint1 = [0.5, 0.5];

    this.rotationRadius = rotationRadius;
    this.rotationRange = rotationRange;

    this.stepPivotSize = stepPivotSize;
    this.stepCenterJoint = stepCenterJoint; //can be same as anchor or different (spine.joints[2])
    this.stepCenterRadius = stepCenterRadius; //can be same as anchor or different
    /// TEMP
    this.stepAheadJoint = stepAheadJoint0;

    this.stepAheadJoint0 = stepAheadJoint0;
    this.stepAheadJoint1 = stepAheadJoint1;

    this.distFromFrontStep0 = 0;
    this.distFromFrontStep1 = 0;

    this.forwardAngle0 = 0;
    this.forwardAngle1 = 0;
    this.centerToAheadAngle = 0;
 
    this.elbows = [
      [0.5, 0.5],
      [0.5, 0.5],
    ];

    this.muscles = [
      [.5,.5], [.5,.5], [.5,.5], [.5,.5]
    ]
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
      [0.5, 0.5]],

      [
      [0.5, 0.5],
      [0.5, 0.5],
      [0.5, 0.5],
      [0.5, 0.5],
      [0.5, 0.5]],

    ];

    this.fingerLen = fingerLen;
      this.fingerAngleOffset = 3;
    this.stepTargets = [
      [0.5, 0.5],
      [0.5, 0.5],
    ];

    this.flippedChestLines = {};

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

  updateForwardAngle() {
    const xForward = this.stepAheadJoint[0] - this.stepCenterJoint[0];
    const yForward = this.stepAheadJoint[1] - this.stepCenterJoint[1];

    this.centerToAheadAngle = Math.atan2(yForward, xForward);
  }

  updateDistanceFromFrontStep() {
    this.distFromFrontStep0 = getBackFrontStepDistance(
      this.stepTargets[0],
      this.motion.frontStepsTLine[0]
    );
    this.distFromFrontStep1 = getBackFrontStepDistance(
      this.stepTargets[1],
      this.motion.frontStepsTLine[1]
    );
  }

  // DIFFERENT FROM LEGS WHICH USE THE SAME FORWARD ANGLE
  updateForwardAngles() {
    let forwardPoint0 = _getCenterPoint(
      this.frontLegs_stepTargets[0],
      this.stepAheadJoint
    );
    let forwardPoint1 = _getCenterPoint(
      this.frontLegs_stepTargets[1],
      this.stepAheadJoint
    );

    let minimum0 = _getForwardAngle(
      this.spine.centerFlanks[0],
      this.stepCenterJoint
    );
    let minimum1 = _getForwardAngle(
      this.spine.centerFlanks[1],
      this.stepCenterJoint
    );

    this.forwardAngle0 = _getForwardAngle(this.stepCenterJoint, forwardPoint0);
    this.forwardAngle1 = _getForwardAngle(this.stepCenterJoint, forwardPoint1);

    // this.forwardAngle0 = Math.max(this.forwardAngle0, minimum0);
    // this.forwardAngle1 = Math.max(this.forwardAngle1, minimum1);
  }

  solveStepTargetsBackPaired() {
    // console.log(`front legs chest data`, this.frontLegs.chestAngle);
    // console.log(`front legs chest data`, this.frontLegs.chestLinesData);
    // console.log(`BACK LEGS SPINE MOTION DATA : `, this.secondMotion.spineMotionCenter, this.secondMotion.spineMotionIntersection);

    const mainDot = _getDotScalar(
      this.stepTargets[0],
      this.stepTargets[1],
      this.stepCenterJoint.direction
    );

    // console.log(this.frontLegs.chestLinesData.step);

    // let angle = getHipsAngle(this.stepTargets[1], this.stepTargets[0]);
    //  let angle = getChestAngle(this.frontLegs.chestLinesData.otherStep, this.frontLegs.chestLineData.step);

    //     this.secondMotion.updateCurveAngle(angle);

    // if (leftIsAhead) {
    //   console.log("Back left is ahead");
    // } else if (rightIsAhead) {
    //   console.log("Back right is ahead");
    // } else {
    //   // console.log("Both level");
    // }
    ////////////////////////////////////////////////////////////////
    const distanceOut = (this.stepCenterRadius + this.stepReach)*1.4;


    const widenessAdj = 1.3;
    // just reverses the 0/1 for is1
    const calcStep0 = getCalcStep(
      this.stepCenterJoint,
      // this.centerToAheadAngle,
      this.forwardAngle0,
      distanceOut,
      this.stepWideness *widenessAdj,
      false
    );
    const calcStep1 = getCalcStep(
      this.stepCenterJoint,
      // this.centerToAheadAngle,
      this.forwardAngle1,
      distanceOut,
      this.stepWideness*widenessAdj,
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

    const flankStep0 = this.spine.centerFlanks[0];
    const flankStep1 = this.spine.centerFlanks[1];

    const mirroredStep0 = this.motion.centerIntersection.mirroredStepsLineStart;
    const mirroredStep1 = this.motion.centerIntersection.mirroredStepsLineEnd;

    const projectedStep0 =
      this.motion.centerIntersection.projectedStepsLineStart;
    const projectedStep1 = this.motion.centerIntersection.projectedStepsLineEnd;

     const nextStep0 = calcStep0;
     const nextStep1 = calcStep1;

    // const nextStep0 = flankStep0;
    // const nextStep1 = flankStep1;

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

    // set debug uniform
    this.debugDesiredExtra[0][0] = bigStep0[0];
    this.debugDesiredExtra[0][1] = bigStep0[1];
    this.debugDesiredExtra[1][0] = bigStep1[0];
    this.debugDesiredExtra[1][1] = bigStep1[1];
    this.debugDesired[0] = calcStep0;
    this.debugDesired[1] = calcStep1;

    if (this.state.takeSyncedSteps1) {
      // if (!leftDesiredIsAhead) {
      //   lDesiredX = bigStep0[0];
      //   lDesiredY = bigStep0[1];
      // }

      // this.stepTargets[0][0] = calcStep0[0];
      // this.stepTargets[0][1] = calcStep0[1];
      this.stepTargets[0][0] = nextStep0[0];
      this.stepTargets[0][1] = nextStep0[1];
      this.stepTargets[0].angle = calcStep0.angle;
      this.state.syncedStepsCompleted(true);
    } else if (lDist > this.stepThreshhold + this.stepWiggleRoom) {
      console.log("back leg need to catch up");
      this.state.catchUp(true);
      // this.state.catchUpFollower(true);
    }

    if (this.state.takeSyncedSteps0) {
      // if (!rightDesiredIsAhead) {
      //   rDesiredX = bigStep1[0];
      //   rDesiredY = bigStep1[1];
      // }

      // this.stepTargets[1][0] = calcStep1[0];
      // this.stepTargets[1][1] = calcStep1[1];
      this.stepTargets[1][0] = nextStep1[0];
      this.stepTargets[1][1] = nextStep1[1];
      this.stepTargets[1].angle = calcStep1.angle;
      this.state.syncedStepsCompleted(false);
    } else if (rDist > this.stepThreshhold + this.stepWiggleRoom) {
      console.log("back leg need to catch up");
      this.state.catchUp(false);
      //    this.state.catchUpFollower(false);
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
//     this.gl.setSingleUniform(`${this.u_center_joint}`, this.hipSpineJoint);

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

//    this.gl.setArrayOfUniforms(this.u_muscle_prefix, this.muscles); 

//     this.gl.setArrayOfUniforms(`${this.u_finger_prefix}${0}`, this.fingers[0]); 
//     this.gl.setArrayOfUniforms(`${this.u_finger_prefix}${1}`, this.fingers[1]); 
//   }

  update() {
    this.updateDistanceFromFrontStep();
    this.updateForwardAngle();
    this.updateForwardAngles();

    // updates rotator joint position only
    updateShoulderRotator(
      this.rotatorJoint0,
      this.rotationRadius,
      this.rotationRange,
      this.state.followerPhase,
      [this.hipSpineJoint[0], this.hipSpineJoint[1]],
      this.hipSpineJoint.angle,
      false,
      false
    );

    // updates rotator joint position only
    updateShoulderRotator(
      this.rotatorJoint1,
      this.rotationRadius,
      this.rotationRange,
      this.state.followerPhase,
      [this.hipSpineJoint[0], this.hipSpineJoint[1]],
      this.hipSpineJoint.angle,
      true,
      true
    );



    this.solveStepTargetsBackPaired();





    solveBackElbowIK(
      this.rotatorJoint0,
      this.elbows[0],
      this.stepTargets[0],
      this.upperArmLength,
      this.forearmLength,
      false
    );
    solveBackElbowIK(
      this.rotatorJoint1,
      this.elbows[1],
      this.stepTargets[1],
      this.upperArmLength,
      this.forearmLength,
      true
    );


    
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
    console.log(`back legs centerToAheadAngle: ${this.centerToAheadAngle}`);
    console.log(
      `Thresh: ${this.stepThreshhold}, Wideness: ${this.stepWideness}, Reach: ${this.stepReach}, Radius: ${this.stepCenterRadius}`
    );
    // console.log(`Legs perpendicular of steps angle: ${this.chestAngle}`);
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
