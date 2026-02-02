// just data that all motions use
// nothing specific to lengths/chains/etc
import { _makeDistancePoint_inPlace, _getDirVec_inPlace, _makeLerpAngle } from "../utils.js";



export function getDilutedAngle(angle, referenceAngle, blendScalar){
  return _makeLerpAngle(angle, referenceAngle, blendScalar);
};


export default class MotionGlobal {
  constructor(
   
    state,
    valuesForReversing,
    dilutionScalar = 0.4,
    mir_dilutionScalar = 0.4,
    u_debug_prefix = "debugMotionGlobal",
     u_moving_snout_prefix = "motionGlobalSnout",
    u_moving_head_prefix = "motionGlobalHead"
  ) {
    this.TAU = Math.PI * 2;
 
    this.state = state; 
    this.valuesForReversing = valuesForReversing;

    this.frontSteps_aheadJointAngle = 0;
    this.frontSteps_stepCenterAngle = 0;

    this.frontStepsTCenter = [0.5, 0.5];
    this.frontSteps_tDistanceApart = 0;
    this.frontStepsTAngle = 0;
    this.frontStepsTLine = [
      [0.5, 0.5],
      [0.6, 0.5]
    ];

 

    this.frontStepsSAngle = 0;
    this.frontStepsSLine = [
      [0.5, 0.5],
      [0.6, 0.5]   
    ];

    this.frontStepsDilutedAngle = 0;
    this.dilutionScalar = dilutionScalar;
    this.mir_dilutionScalar = mir_dilutionScalar;

    // calculated AFTER spine length
    this.frontSteps_sDistFromIntrs = 0;
    this.mirrored_frontStepsAngle = 0;
    this.centerIntersection = {};

    this.mir_frontStepsSCenter = [0.5, 0.5];
    // this.mir_frontSteps_tDistanceApart = 0; // just use original, they will always be the same
    this.mir_frontStepsTAngle = 0;
    this.mir_frontStepsTLine = [];

    this.mir_frontStepsSAngle = 0;
    this.mir_frontStepsSLine = [];

    this.mir_frontStepsDilutedAngle = 0;
 
    this.realignmentAngle1 = 0;
    this.realignmentAngle2 = 0;
    this.realignmentAngle3 = 0;

    this.u_moving_snout_prefix = u_moving_snout_prefix;
    this.movingSnout = [0.5, 0.5];
    this.u_moving_head_prefix = u_moving_head_prefix;
    this.movingHead = [0.5, 0.5];

    

    this.u_debug_prefix = u_debug_prefix;
  
  }

  // updated in frontLegs solve pair steps
  update_frontStepsData(data) {

        let dScalar = this.valuesForReversing.goingBackwards ? 0 : this.dilutionScalar;

// OR JUST USE  this.dilutionScalar  to remove
    this.frontStepsTCenter = data.frontStepsTCenter;
    this.frontSteps_tDistanceApart = data.frontSteps_tDistanceApart;
    this.frontStepsTAngle = data.frontStepsTAngle;
    this.frontStepsTLine = data.frontStepsTLine;
    this.frontStepsSAngle = data.frontStepsSAngle;
    this.frontStepsSLine = data.frontStepsSLine;
    this.frontSteps_aheadJointAngle = data.frontSteps_aheadJointAngle;
    this.frontSteps_spineJointAngle = data.frontSteps_spineJointAngle;

    this.frontStepsDilutedAngle = getDilutedAngle(
      this.frontSteps_spineJointAngle,
      this.frontStepsSAngle,
      dScalar, // < --  HERE this.dilutionScalar  
    );
    this.realignmentAngle1 = this.frontStepsDilutedAngle;
 
 
  }

  // updated in body because goes off of radii set there
  update_headPosition(sumRadii) {
    let dist = 0.01;
    let dirVec = _getDirVec_inPlace(this.frontStepsTCenter, this.frontStepsSLine[1]);
    this.movingHead = _makeDistancePoint_inPlace(this.frontStepsTCenter, dirVec, dist);

    this.movingSnout = _makeDistancePoint_inPlace(
      this.frontStepsTCenter,
      dirVec,
      dist + 0.02
    );
  }

  update_mirroredFrontStepsData(data) {

         let dScalar = this.valuesForReversing.goingBackwards ? 0 : this.dilutionScalar;

    this.frontSteps_sDistFromIntrs = data.sDistFromSteps;

    this.mir_frontStepsSCenter = data.mSCenter;
    // this.mir_frontSteps_tDistanceApart = 0; // just use original, they will always be the same
    // this.mir_frontStepsTAngle = 0; //function isn't returning this yet
    this.mir_frontStepsTLine = data.mTLine;

    this.mir_frontStepsSAngle = data.mSAngle;
    this.mir_frontStepsSLine = data.mSLine;

    this.centerIntersection = data.intersectionPoint;
    // this.mirrored_frontStepsAngle = this.mir_frontStepsSAngle;
    this.mir_frontStepsDilutedAngle = getDilutedAngle(
      this.frontSteps_spineJointAngle,
      this.mir_frontStepsSAngle,
       dScalar, // < --  HERE this.dilutionScalar  
    );

    this.realignmentAngle2 = this.mir_frontStepsSAngle; 
 
  }
 
 
}
