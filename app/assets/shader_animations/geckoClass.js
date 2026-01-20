import GaitState from "./geckoClasses/gaitClass.js";
import MotionGlobal from "./geckoClasses/motionGlobal.js";
import Body from "./geckoClasses/bodyClass.js";
import FourLegs from "./geckoClasses/fourLegsClass.js";

export default class Gecko {
  constructor(startingCoord=[0.,0.], hintDist=.04) {
    this.gaitSpeedScalar = 9;
    this.stepThreshhold = 0.1;
    this.stepPivotSize = 0.24;
    this.motionDilutionScalar = 0.5;
    this.mir_MotionDilutionScalar = 0.5;
    this.startingCoord = startingCoord;
    this.hintDist = hintDist;
 
    this.oneTimeEnterComplete = false; // set only once
    this.userControlOverride = false; // not using yet

    this.gait = new GaitState(this.gaitSpeedScalar);
    this.motion = new MotionGlobal(
      this.gait,
      this.motionDilutionScalar,
      this.mir_MotionDilutionScalar,
      "debugMotionGlobal"
    );

    this.body = new Body(
      this.gait,
      this.motion,
      this.startingCoord,
      this.hintDist
    );

    this.body.init();

    this.legs = new FourLegs(
      this.gait,
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

  update(leadPoint_lead, leadPoint_distanceTraveled, leadPoint_isMoving) {
    this.gait.update(leadPoint_distanceTraveled); 
    this.legs.update();
    this.body.update(leadPoint_lead, leadPoint_isMoving);
  }
}
