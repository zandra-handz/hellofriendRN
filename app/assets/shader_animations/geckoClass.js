
import GaitState from "./geckoClasses/gaitClass.js";
import MotionGlobal from "./geckoClasses/motionGlobal.js";
import Body from "./geckoClasses/bodyClass.js";
import FourLegs from "./geckoClasses/fourLegsClass.js";


export default class Gecko{
    constructor( 

    ){ 
        this.gaitSpeedScalar = 9;
        this.stepThreshhold = .1;
        this.stepPivotSize = .24; 
        this.motionDilutionScalar = .5;
        this.mir_MotionDilutionScalar = .5;


        this.gait = new GaitState(this.gaitSpeedScalar);
        this.motion = new MotionGlobal(this.gait, this.motionDilutionScalar, this.mir_MotionDilutionScalar, "debugMotionGlobal")


        this.body = new Body(
          
            this.gait,
            this.motion, 
        )

        this.body.init()   

        this.legs = new FourLegs(
         
            this.gait,
            this.body.spine,
            this.motion,
            this.stepThreshhold,
            this.stepPivotSize,
            this.stepPivotSize

        )
    }


    update(leadPoint_lead, leadPoint_distanceTraveled){

        this.gait.update(leadPoint_distanceTraveled);
        this.motion.update(); // doesn't do anything
        this.legs.update();
        this.body.update(leadPoint_lead);
   
    }
}