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
  getPivotedStep,
  solveFingers,
  getFrontStepsSagTrans,
} from "../../utils.js";

// I am keeping both centerJoint and stepCenterJoint for now in case
// additional animation needs to be done to the shoulder joint but not the spine joint
// that the legs are mapping onto
export default class FollowerLegs {
  constructor(
    state,
    valuesForReversing,
    spine,
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
    rotationRadius = 0.007, // original as default
    rotationRange = 2.2, // original as default
    stepThreshhold = 0.06, // original as default
    stepWiggleRoom = 0.02, // original as default
    stepWideness = 3.4,
    stepReach = 0.0453,
    upperArmLength = 0.042,
    forearmLength = 0.026,
  ) {
    this.TAU = Math.PI * 2;

    this.state = state;
    this.valuesForReversing = valuesForReversing;
    
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

    this.stepBehindJoint = stepBehindJoint;

    this.distFromFrontStep0 = 0;
    this.distFromFrontStep1 = 0;

    this.forwardAngle0 = 0;
    this.forwardAngle1 = 0;
    this.centerToAheadAngle = 0;
       this.centerToBehindAngle = 0;

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

 
 
  }

  // updateForwardAngle() {
  //   const xForward = this.stepAheadJoint[0] - this.stepCenterJoint[0];
  //   const yForward = this.stepAheadJoint[1] - this.stepCenterJoint[1];

  //   this.centerToAheadAngle = Math.atan2(yForward, xForward);
  // }


    updateBackwardAngle() { 

       this.centerToBehindAngle = _getForwardAngle( this.stepCenterJoint,  this.stepBehindJoint );
  }




  updateDistanceFromFrontStep() {
    this.distFromFrontStep0 = getBackFrontStepDistance(
      this.stepTargets[0],
      this.motion.frontStepsTLine[0],
    );
    this.distFromFrontStep1 = getBackFrontStepDistance(
      this.stepTargets[1],
      this.motion.frontStepsTLine[1],
    );
  }

  // DIFFERENT FROM LEGS WHICH USE THE SAME FORWARD ANGLE
  updateForwardAngles() {

    const forwardPoint0 = [0.,0.];
    const forwardPoint1 = [0.,0.];
    _getCenterPoint_inPlace(
      this.frontLegs_stepTargets[0],
      this.stepAheadJoint, forwardPoint0
    );
    _getCenterPoint_inPlace(
      this.frontLegs_stepTargets[1],
      this.stepAheadJoint,
      forwardPoint1
    );

    this.forwardAngle0 = _getForwardAngle(this.stepCenterJoint, forwardPoint0);
    this.forwardAngle1 = _getForwardAngle(this.stepCenterJoint, forwardPoint1);
  }

  solveStepTargetsBackPaired() {
    ////////////////////////////////////////////////////////////////
    const distanceOut = (this.stepCenterRadius + this.stepReach) * 1.4;

    const widenessAdj = 1.3;
    // just reverses the 0/1 for is1

    let calcStep0 = [0, 0];
    let calcStep1 = [0, 0];

    getCalcStep_inPlace(
      calcStep0,
      this.stepCenterJoint,
      this.forwardAngle0,
      // this.centerToBehindAngle,
         this.forwardAngle0,
      distanceOut,
      this.stepWideness * widenessAdj,
      false,
      this.valuesForReversing.goingBackwards
    );
    getCalcStep_inPlace(
      calcStep1,
      this.stepCenterJoint,
        this.forwardAngle1,
       //   this.centerToBehindAngle,
             this.forwardAngle1,
      distanceOut,
      this.stepWideness * widenessAdj,
      true,
         this.valuesForReversing.goingBackwards
    );


    const nextStep0 = calcStep0;
    const nextStep1 = calcStep1;

    let lDist = _getDistanceScalar(calcStep0, this.stepTargets[0]);
    let rDist = _getDistanceScalar(calcStep1, this.stepTargets[1]);





  const goingBackwards = this.valuesForReversing.goingBackwards;

 

// CHANGING STEP PATTERN WHEN GOING BACKWARDS
if (goingBackwards ? this.state.takeSyncedSteps0 : this.state.takeSyncedSteps1) { 
  this.stepTargets[0][0] = nextStep0[0];
  this.stepTargets[0][1] = nextStep0[1];
  this.stepTargets[0].angle = calcStep0.angle;
  this.state.syncedStepsCompleted(this.state.takeSyncedSteps1);
} else if (
  lDist > this.stepThreshhold + this.stepWiggleRoom &&
  !goingBackwards
) {
  console.log("back leg need to catch up");
  this.state.catchUp(true); 
}

if (goingBackwards ? this.state.takeSyncedSteps1 : this.state.takeSyncedSteps0) { 
  this.stepTargets[1][0] = nextStep1[0];
  this.stepTargets[1][1] = nextStep1[1];
  this.stepTargets[1].angle = calcStep1.angle;
  this.state.syncedStepsCompleted(false);
} else if (rDist > this.stepThreshhold + this.stepWiggleRoom) {
  console.log("back leg need to catch up");
  this.state.catchUp(!this.state.takeSyncedSteps0);
}

  

// OLD, WITHOUT CHANGING STEP PATTERN FOR GOING BACKWADS
    // if (this.state.takeSyncedSteps1) {
    //   this.stepTargets[0][0] = nextStep0[0];
    //   this.stepTargets[0][1] = nextStep0[1];
    //   this.stepTargets[0].angle = calcStep0.angle;
    //   this.state.syncedStepsCompleted(true);
    // } else if (lDist > this.stepThreshhold + this.stepWiggleRoom) {
    //   // console.log("back leg need to catch up");
    //   this.state.catchUp(true);
    // }

    // if (this.state.takeSyncedSteps0) {
    //   this.stepTargets[1][0] = nextStep1[0];
    //   this.stepTargets[1][1] = nextStep1[1];
    //   this.stepTargets[1].angle = calcStep1.angle;
    //   this.state.syncedStepsCompleted(false);
    // } else if (rDist > this.stepThreshhold + this.stepWiggleRoom) {
    //   // console.log("back leg need to catch up");
    //   this.state.catchUp(false);
    // }


  }

 

  update() {
    this.updateDistanceFromFrontStep();
    // this.updateForwardAngle();
    this.updateForwardAngles();


        if (this.valuesForReversing.goingBackwards){
      this.updateBackwardAngle();
    }


    // updates rotator joint position only
    updateShoulderRotator(
      this.rotatorJoint0,
      this.rotationRadius,
      this.rotationRange,
      this.state.followerPhase,
      [this.hipSpineJoint[0], this.hipSpineJoint[1]],
      this.hipSpineJoint.angle,
      false,
      false,
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

    // this.muscles[0] = _getCenterPoint(this.stepTargets[0], this.elbows[0]);
    // this.muscles[1] = _getCenterPoint(this.elbows[0], this.stepCenterJoint);
    // this.muscles[2] = _getCenterPoint(this.stepTargets[1], this.elbows[1]);
    // this.muscles[3] = _getCenterPoint(this.elbows[1], this.stepCenterJoint);


    // // set muscles
    _getCenterPoint_inPlace( this.stepTargets[0], this.elbows[0], this.muscles[0]);
    _getCenterPoint_inPlace( this.elbows[0], this.stepCenterJoint, this.muscles[1]);
    _getCenterPoint_inPlace( this.stepTargets[1], this.elbows[1], this.muscles[2]);
    _getCenterPoint_inPlace( this.elbows[1], this.stepCenterJoint, this.muscles[3]);

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
