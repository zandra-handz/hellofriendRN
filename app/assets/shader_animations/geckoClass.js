import GaitState from "./geckoClasses/gaitClass.js";
import MotionGlobal from "./geckoClasses/motionGlobal.js";
import Body from "./geckoClasses/bodyClass.js";
import FourLegs from "./geckoClasses/fourLegsClass.js";

export default class Gecko {
  constructor(startingCoord=[0.,0.], hintDist=.04) {
    this.gaitSpeedScalar = 9;
    this.reverseGaitSpeedScalar = 20;
    this.stepThreshhold = 0.1;
    this.stepPivotSize = 0.24;
    this.motionDilutionScalar = 0.5;
    this.mir_MotionDilutionScalar = 0.5;
    this.startingCoord = startingCoord;
    this.hintDist = hintDist;

 
this.valuesForReversing = {
  direction: 0,           // clamped relative angle to stepsAngle
  turnRadius: 0,          // distance metric for pivot/backwards
  goingBackwards: false,  // are we in backwards mode
  totalRotation: 0,       // cumulative rotation while going backwards
  rotationChange: 0,      // change in first.angle per frame
  prevFirstAngle: undefined, // store previous first.angle to compute rotationChange
  distanceHistory: [],    // history of distances to detect shrinking/growing
  turnDirection: 0,       // normalized lateral turn direction (-1 to 1)
  stiffnessBlend: 0       // interpolates stiffness while going backwards
};


    this.oneTimeEnterComplete = false; // set only once
    this.sleepWalkMode = false;

    this.gait = new GaitState(this.gaitSpeedScalar, this.reverseGaitSpeedScalar);
    this.motion = new MotionGlobal(
      this.gait,
      this.valuesForReversing,
      this.motionDilutionScalar,
      this.mir_MotionDilutionScalar,
      "debugMotionGlobal"
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
      this.stepThreshhold,
      this.stepPivotSize,
      this.stepPivotSize
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
