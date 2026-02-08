import GaitState from "./geckoClasses/gaitClass.js";
import MotionGlobal from "./geckoClasses/motionGlobal.js";
import Body from "./geckoClasses/bodyClass.js";
import FourLegs from "./geckoClasses/fourLegsClass.js";

export default class Gecko {
  constructor(startingCoord=[0.,0.], hintDist=.04) {
    this.gaitSpeedScalar = 9;
    this.reverseGaitSpeedScalar = 40;

    this.forwardStepThreshhold = 0.1;
    this.reverseStepThreshhold = .02;

    this.forwardStepWideness = 4;
    this.reverseStepWideness = 6;

    this.forwardStepReach = .0463;
    this.reverseStepReach = .0253;

    this.stepPivotSize = 0.24;
    this.motionDilutionScalar = 0.5;
    this.mir_MotionDilutionScalar = 0.5;
    this.startingCoord = startingCoord;
    this.hintDist = hintDist;

 
    this.valuesForReversing = {
      // Scalar values
      direction: 0,           // clamped relative angle to stepsAngle
      turnRadius: 0,          // distance metric for pivot/backwards
      goingBackwards: false,  // are we in backwards mode
      totalRotation: 0,       // cumulative rotation while going backwards
      rotationChange: 0,      // change in first.angle per frame
      jumpRotation: 0,        // rotation amount during jump
      jumpFrameCount: 0,      // frame counter for jump animation
      framesSinceLastJump: 0, // cooldown counter
      rotationDir: 0,         // direction of rotation (-1, 0, 1)
      lateralOffsetSign: 0,   // sign of lateral offset
      turnDirection: 0,       // normalized lateral turn direction (-1 to 1)
      stiffnessBlend: 0,      // interpolates stiffness while going backwards
      backwardsAngle: 0,      // angle when backwards started
      
      // Preallocated buffers (from solveFirst_withBackwardsDetect)
      _dirBuffer: new Float32Array(2),
      _nBuffer: new Float32Array(2),
      _vecToCursorBuffer: new Float32Array(2),
      _perpVectorBuffer: new Float32Array(2),
      _normalizedBuffer: new Float32Array(2),
      jumpedFirstPosition: new Float32Array(2),
      jumpedCursorPosition: new Float32Array(2),
      
      // ✅ Ring buffers instead of dynamic arrays
      distanceHistory: new Float32Array(6),      // max length = 6
      distanceHistoryIndex: 0,
      distanceHistoryCount: 0,
      
      turnDirectionHistory: new Float32Array(2), // max length = 2
      turnDirectionHistoryIndex: 0,
      turnDirectionHistoryCount: 0,
    };

    this.oneTimeEnterComplete = false; // set only once
    this.sleepWalkMode = false;

    this.gait = new GaitState(this.gaitSpeedScalar, this.reverseGaitSpeedScalar);
    this.motion = new MotionGlobal(
      this.gait,
      this.valuesForReversing,
      this.motionDilutionScalar,
      this.mir_MotionDilutionScalar,
      
    );

    this.body = new Body(
      this.gait,
      this.valuesForReversing,
      this.motion,
      this.startingCoord,
      this.hintDist,
    
    );

    this.body.init();

    this.legs = new FourLegs(
      this.gait,
      this.valuesForReversing,
      this.body.spine,
      this.motion,
      this.forwardStepThreshhold,
      this.reverseStepThreshhold,
      this.stepPivotSize,
      this.stepPivotSize,
      this.forwardStepWideness,
      this.reverseStepWideness,
      this.forwardStepReach,
      this.reverseStepReach,
      // rotationRadius,
      // rotationRange,
      // upperArmLength,
      // foreArmLength
    );
  }

  updateEnter(complete) {
    if (complete) {
      this.oneTimeEnterComplete = true;
    } else {
      this.oneTimeEnterComplete = false;
    }
  }

  updateSleepWalkMode(on) {
    if (on) {
      this.sleepWalkMode = true;
    } else {
    this.sleepWalkMode = false;
    }

  }

  update(leadPoint_lead, leadPoint_distanceTraveled, leadPoint_isMoving) {
    // if (this.sleepWalkMode) {
    //   console.log('gecko is in sleep mode')
    // }

    //     if (this.valuesForReversing.goingBackwards) {
    //   console.log('GOING BACKWARDS!');

    // } 
  
    this.gait.update(leadPoint_distanceTraveled, this.valuesForReversing.goingBackwards); 
    this.legs.update();
    this.body.update(leadPoint_lead, leadPoint_isMoving);
  }
}
