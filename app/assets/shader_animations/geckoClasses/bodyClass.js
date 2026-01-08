import Spine from "./bodyClasses/spineClass.js";
import Tail from "./bodyClasses/tailClass.js";


import { getWeightedValues } from "../utils.js";

export default class Body {
  constructor(state, motion ) {
 
    this.state = state;
    this.motion = motion;  

    this.stiffC = 24;
    this.normalC = 12;
    this.looseC = 8;

    // SPINE

    this.spineNumOfJoints = 15;
    let spineDesCtrRange = [2, 13]; // designated center

    this.spineMotion_len = 12; 
    this.spineMotion_range = [2, 13]; 
    this.spineMotion_baseClamp = 8;


    // SPINE RADII //////////////////////////////////////////////////////////////

    let headNeckChestRadii = [0.064, 0.023, 0.022]; // joints 0 -2
   // this.unchainedDist = headNeckChestRadii.reduce((sum, r) => sum + r, 0); // distance above center joint to declare head joint
    this.unchainedDist = .07;
    
    this.snoutDist =  .03;
    let bodyWeights = [0.01, 0.025, 0.022, 0.022,0.02, 0.02, 0.01, 0.003, 0.001];
    let hipAndTConRadius = [0.015, 0.001]; // original: radius8, radius9

    // Body's weighted radii, fixed to be whatever is not included in head and back radii above
    // let bodyNumOfWeighted = this.spineNumOfJoints - 5;
    let bodyNumOfWeighted = 9;
    let bodyWLength = 0.14; 
    let bodyWRadii = getWeightedValues(
      bodyWeights,
      bodyNumOfWeighted,
      bodyWLength
    );

    this.spineRadii = [
      ...headNeckChestRadii,
      ...bodyWRadii,
      ...hipAndTConRadius,
    ];

    /////////////////////////////////////////////////////////////////////////////////////////

    // this.spineClamps = getSpineClampValues(this.spineNumOfJoints, this.spineRadii, this.stiffC, this.normalC, this.looseC);
    this.spineClamps = [
      this.normalC,  //0
      this.normalC,  //1
      24,   //2
     24, //3
     24,  //4
      24,  //5
      24,24, 24, 12, 12,12,8,  8];
    // TAIL
    // this.tailNumOfJoints = 6;
    // let tailDesCtrRange = [0, 3]; // designated center

    this.tailNumOfJoints = 13;
    let tailDesCtrRange = [0, 12]; // designated center

    // this.tailMotionLen = 6;
    // this.tailMotionRange = [0, 6];
    
    // Is this right??
    this.tailMotionLen = 12;
    this.tailMotionRange = [0, 12];

    // let tailLength = .22;
    let tailLength = 0.30;

    // USE FOR SIX JOINTED TAIL
    // let tailWeights = [0.03, 0.03, 0.03, 0.025, 0.025, 0.025];
      //  let bodyWeights = [0.01, 0.025, 0.022, 0.022,0.02, 0.02, 0.01, 0.003, 0.001];
   let tailWeights = [0.01, .002, 0.02, .02, 0.02, .025, 0.025, .025, 0.02, .02, 0.001, .001];
 
    let tailWRadii = getWeightedValues(tailWeights,this.tailNumOfJoints,tailLength);

    this.tailRadii = tailWRadii;
 
        this.tailClamps = [
      24,
      24,
      24,
      24,
      24,
      24,
     24,
     24,
     24,
     12,
      8,
      8
    ];



    let unchainedAnchorIndex = 2;

        this.spine = null;
    this.tail = null;


 
  }
 
init() {
  const spineDesCtrRange = [2, 13];
  const unchainedAnchorIndex = 2;

  this.spine = new Spine(
 
    this.state,
    this.motion, 
    this.spineNumOfJoints,
    unchainedAnchorIndex,
    this.unchainedDist,
    this.snoutDist,
    spineDesCtrRange,
    this.baseRadius,
    this.spineClamps,
    this.spineRadii,
    "joint",
    "debugSpine",
    "spineCenter",
    "spineIntersection",
    true,
    this.spineMotion_range,
    this.spineMotion_len,
    this.spineMotion_baseClamp,
    "debugSpineMotion"
  );

  // IMPORTANT: spine.joints now definitely exists
  this.tail = new Tail(
  
    this.state,
    this.motion,
    this.spine.joints[10],
    this.tailNumOfJoints,
    [0, 12],
    this.baseRadius,
    this.tailClamps,
    this.tailRadii,
    "tail",
    "debugTail",
    "tailCenter",
    "tailIntersection",
    false
  );
}


  update(leadPoint_lead) {
  
    this.motion.update_headPosition(this.headRadiiSum);
    this.spine.update(leadPoint_lead);
 
    this.tail.update();
  }
}
