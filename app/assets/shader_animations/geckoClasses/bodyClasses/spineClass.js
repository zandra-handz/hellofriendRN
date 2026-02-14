import { solveProcJoint_inPlace } from "./utils_otherJoints.js";
import { intersectLines } from "./utils_motionCalcs.js";
import { solveFirst_withBackwardsDetect } from "./utils_firstJoint.js";

import {
  _getCenterPoint,
  _makeDistancePoint,
  _makeDistancePoint_inPlace,
  _getDirVec_inPlace,
  _getCenterPoint_inPlace,
  _makeOffscreenPoint,
  _makeOffscreenPoint_inPlace,
  _getDistanceScalar,
} from "../../utils.js";
import {
  // getStartAndEndPoints_inPlace,
  // intersectLines,
  // intersectLines_inPlace,
  intersectLines_inPlace_Opt,
  getSpineSagTrans_inPlace,
} from "../../utils.js"; 

export default class Spine {
  constructor(
    state,
    valuesForReversing,
    motion,
    startingCoord,
    totalNumJoints,
    unchainedAnchorIndex = 0,
    unchainedDist = 0.04,
    snoutDist = 0.02,
    hintDist = 0.05,
    segmentRange,
    baseRadius = 0.02,
    jointClamps,
    jointRadii,
    updatesGlobalMotion = false,

    motionRange = [2, 10], // original default for spine
    motionIndicesLength = 9, // original default for spine

    motionBaseClamp = 24, // original default for spine
  ) {
    this.state = state;
    this.motion = motion;
    this.startingCoord = startingCoord;
    this.TAU = Math.PI * 2;
    this.updatesGlobalMotion = updatesGlobalMotion;
    this.testTick = 0;
    this.head = [0.5, 0.5];
    this.snout = [0.5, 0.5];
    this.hint = [0.5, 0.5];

    this.hintJoint = new Float32Array(2);
    this.center = new Float32Array(2);

    this.unchainedDist = unchainedDist;
    this.snoutDist = snoutDist;
    this.hintDist = hintDist;
    this.hintDistStart = hintDist;
    this.hintDistEnd = hintDist + 0.09;
    this.hintMoveSpeed = 0.001;
    this.hintDistScalar = 1;
    this.hintGoingForward = true;

    this.valuesForReversing = valuesForReversing;

    this.joints = [];
    this.totalNumJoints = totalNumJoints;
    this.unchainedAnchorIndex = unchainedAnchorIndex;
    this.segmentStart = segmentRange[0];
    this.segmentEnd = segmentRange[1];
    this.intersectionPoint = 1; // stored in spine motion as well

    this._intersectResult = {
      // raw storage (what your intersect computes)
      position: new Float32Array(2),
      mirroredDir: new Float32Array(2),
      mirroredLineEnd: new Float32Array(2),
      mirroredStepsPoint: new Float32Array(2),
      transverseLine: new Float32Array(2),

      mirroredStepLineStart: new Float32Array(2),
      mirroredStepLineEnd: new Float32Array(2),

      projectedStepsPoint: new Float32Array(2),
      projectedLineStart: new Float32Array(2),
      projectedLineEnd: new Float32Array(2),

      mSLineStart: new Float32Array(2),
      mSLineEnd: new Float32Array(2),

      mirroredAngle: 0,
      distFromSteps: 0,

      // ✅ Motion-compatible fields (aliases / derived)
      intersectionPoint: null, // will alias to position
      sDistFromSteps: 0, // alias to distFromSteps
      mSAngle: 0, // alias to mirroredAngle
      mSCenter: new Float32Array(2),

      // Motion expects [ [x,y], [x,y] ] shape
      mSLine: null,
      mTLine: null,
    };

    // Wire references ONCE (no allocations per frame)
    this._intersectResult.intersectionPoint = this._intersectResult.position;
    this._intersectResult.mSLine = [
      this._intersectResult.mSLineStart,
      this._intersectResult.mSLineEnd,
    ];
    this._intersectResult.mTLine = [
      this._intersectResult.mirroredStepLineStart,
      this._intersectResult.mirroredStepLineEnd,
    ];

    // Also preallocate for spine center lines result
    this._spineSagTransResult = {
      center: new Float32Array(2),
      lineDir: new Float32Array(2),
      perpendicularDir: new Float32Array(2),
      tStart: new Float32Array(2),
      tEnd: new Float32Array(2),
      distanceApart: 0,
      angle: 0,
      tAngle: 0,
    };

    this._midPointBuffer = new Float32Array(2);
    this._dirVecBuffer = new Float32Array(2);

    // Reusable line buffers for intersection
    this._line1Buffer = [null, null];
    this._line2Buffer = [null, null];

    this.jointClamps = jointClamps;

    this.jointBuffer = new Float32Array((totalNumJoints + 1) * 2);

    this.jointAngles = new Float32Array(totalNumJoints + 1); // +1 here
    this.jointSecondaryAngles = new Float32Array(totalNumJoints + 1);
    this.jointmirroredSecondaryAngles = new Float32Array(totalNumJoints + 1);
    this.jointThirdAngles = new Float32Array(totalNumJoints + 1);
    this.jointIndices = new Uint16Array(totalNumJoints + 1);
    this.jointAngleDiffs = new Float32Array(totalNumJoints + 1);
    this.jointGlobalAngles = new Float32Array(totalNumJoints + 1);

    this.joints = [];
    for (let i = 0; i <= totalNumJoints; i++) {
      const joint = this.jointBuffer.subarray(i * 2, i * 2 + 2);

      this.joints.push(joint);
    }

    // Create buffer for directions
    this.jointDirectionsBuffer = new Float32Array((totalNumJoints + 1) * 2);

    // Create array of views into the buffer
    this.jointDirections = [];
    for (let i = 0; i <= totalNumJoints; i++) {
      const direction = this.jointDirectionsBuffer.subarray(i * 2, i * 2 + 2);
      this.jointDirections.push(direction);
    }

    this.jointRadii = jointRadii;

    this.first = this.joints[0];
    // this.firstAngle = this.jointAngles[0];
    this.bodyLength = 0.13;
    this.currentLength = 0; //stored in spineMotion as well
    this.currentJointLength = this.segmentEnd + 1 - this.segmentStart;

    // this.centerFlanks = [new Float32Array(2), new Float32Array(2)];
    // this.intersectionFlanks = [new Float32Array(2), new Float32Array(2)];

    this.manualAdjust = 2; // start mirrored angle animation later in the joint chain than midway

    this.segmentCenterIndex =
      Math.ceil((this.segmentEnd + 1 - this.segmentStart) / 2) +
      this.manualAdjust;

    this.motion3Start = this.segmentCenterIndex;

    // PREVIOUSLY A SEPARATE CLASS CALLED SUBMOTION BUT WAS TOO CONFUSING
    this.motionCenter = [0.5, 0.5];
    this.motionLength = 0;
    this.motionFirstAngle = 0;
    this.motionSecondAngle = 0;
    this.motion2Start = motionRange[0];
    this.motionIndicesLength = motionIndicesLength;
    this.motion2End = motionRange[1];
    this.motionBaseClamp = motionBaseClamp;
    this.motionClamps = [];
    for (let i = 0; i <= this.motionIndicesLength; i++) {
      this.motionClamps.push(this.motionBaseClamp);
    }

    this.unchainedJoints = [
      new Float32Array(2), // snout
      new Float32Array(2), // head
    ];

    this.motionScalars = [0.02, 0.02, 0.03, 0.04, 0.03, 0.02, 0.02, 0.02]; // Example pattern
    /////////////////////////////////////////////////////////////////////////////

    this.isMoving = false;
  }

  updateMotionFirstAngle() {
    this.motionFirstAngle = this.motion.realignmentAngle1;
  }

  // update_unchainedJoints(leadPoint_lead) {
  //   const midPoint = _getCenterPoint_inPlace(
  //     this.motion.frontStepsSLine[1],
  //     leadPoint_lead,
  //     this._midPointBuffer, // Reuse buffer
  //   );

  //   const dirVec = _getDirVec_inPlace(
  //     this.joints[this.unchainedAnchorIndex],
  //     midPoint,
  //     this._dirVecBuffer, // Reuse buffer
  //   );
  //   // Update head & snout in place
  //   this.head = _makeDistancePoint_inPlace(
  //     this.joints[this.unchainedAnchorIndex],
  //     dirVec,
  //     this.unchainedDist,
  //     this.unchainedJoints[1],
  //   ); // head
  //   this.snout = _makeDistancePoint_inPlace(
  //     this.unchainedJoints[1],
  //     dirVec,
  //     this.snoutDist,
  //     this.unchainedJoints[0],
  //   ); // snout

  //   if (!this.isMoving) {
  //     if (this.hintDist >= this.hintDistEnd) {
  //       this.hintDist = this.hintDistStart;
  //     } else {
  //       this.hintDist += this.hintMoveSpeed;
  //     }

  //     this.hint = _makeDistancePoint_inPlace(
  //       this.unchainedJoints[0],
  //       dirVec,
  //       this.hintDist,
  //       this.hintJoint,
  //     );
  //   } else {
  //     this.hint = _makeOffscreenPoint_inPlace(this.hintJoint);
  //   }
  // }


  update_unchainedJoints(leadPoint_lead) {
    const anchorJoint = this.joints[this.unchainedAnchorIndex];
    const frontStepsEnd = this.motion.frontStepsSLine[1];
    
    // Calculate midpoint directly into buffer
    const midX = (frontStepsEnd[0] + leadPoint_lead[0]) * 0.5;
    const midY = (frontStepsEnd[1] + leadPoint_lead[1]) * 0.5;
    
    // Calculate direction vector directly
    let dirX = midX - anchorJoint[0];
    let dirY = midY - anchorJoint[1];
    const dirLen = Math.sqrt(dirX * dirX + dirY * dirY);
    
    // Normalize
    if (dirLen > 0) {
      const invLen = 1 / dirLen;
      dirX *= invLen;
      dirY *= invLen;
    }
    
    // Update head in place
    const headJoint = this.unchainedJoints[1];
    headJoint[0] = anchorJoint[0] + dirX * this.unchainedDist;
    headJoint[1] = anchorJoint[1] + dirY * this.unchainedDist;
    
    // Update snout in place
    const snoutJoint = this.unchainedJoints[0];
    snoutJoint[0] = headJoint[0] + dirX * this.snoutDist;
    snoutJoint[1] = headJoint[1] + dirY * this.snoutDist;
    
    // Update hint
    if (!this.isMoving) {
      if (this.hintDist >= this.hintDistEnd) {
        this.hintDist = this.hintDistStart;
      } else {
        this.hintDist += this.hintMoveSpeed;
      }
      
      this.hintJoint[0] = snoutJoint[0] + dirX * this.hintDist;
      this.hintJoint[1] = snoutJoint[1] + dirY * this.hintDist;
    } else {
      // Offscreen
      this.hintJoint[0] = -1;
      this.hintJoint[1] = -1;
    }
  }


  // updateCurrentLength() {
  //   const length = _getDistanceScalar(
  //     this.joints[this.segmentEnd],
  //     this.joints[this.segmentStart],
  //   );
  //   this.currentLength = length;

  //   _getCenterPoint_inPlace(
  //     this.joints[this.segmentEnd],
  //     this.joints[this.segmentStart],
  //     this.center,
  //   );

  //   // No assignment needed - writes directly to this._spineSagTransResult
  //   getSpineSagTrans_inPlace(
  //     this.joints[this.segmentEnd],
  //     this.joints[this.segmentStart],
  //     this._spineSagTransResult,
  //   );

  //   this._line1Buffer[0] = this._spineSagTransResult.tStart;
  //   this._line1Buffer[1] = this._spineSagTransResult.tEnd;
  //   this._line2Buffer[0] = this.motion.frontStepsTCenter;
  //   this._line2Buffer[1] = this.motion.frontStepsSLine[1];

  //   // No assignment needed - writes directly to this._intersectResult
  //   intersectLines_inPlace_Opt(
  //     this._line1Buffer,
  //     this._spineSagTransResult.tAngle,
  //     this.motion.frontSteps_tDistanceApart,
  //     this._line2Buffer,
  //     this.motion.frontStepsSAngle,
  //     this._intersectResult,
  //   );

  //   if (this.updatesGlobalMotion) {
  //     this.motion.update_mirroredFrontStepsData(this._intersectResult);
  //   }

  //   this.intersectionPoint = this._intersectResult.position;

  //   if (this.motion.centerIntersection != null) {
  //     this.motionSecondAngle = this.motion.realignmentAngle2;
  //   }
  // }

    updateCurrentLength() {
    const endJoint = this.joints[this.segmentEnd];
    const startJoint = this.joints[this.segmentStart];
    
    // Calculate length inline
    const dx = endJoint[0] - startJoint[0];
    const dy = endJoint[1] - startJoint[1];
    this.currentLength = Math.sqrt(dx * dx + dy * dy);
    
    // Update center inline
    this.center[0] = (endJoint[0] + startJoint[0]) * 0.5;
    this.center[1] = (endJoint[1] + startJoint[1]) * 0.5;
    
    // getSpineSagTrans_inPlace writes to this._spineSagTransResult
    getSpineSagTrans_inPlace(
      endJoint,
      startJoint,
      this._spineSagTransResult,
    );
    
    // Reuse line buffers - only update references if they change
    // (if these are already pointing to the right arrays, skip assignment)
    this._line1Buffer[0] = this._spineSagTransResult.tStart;
    this._line1Buffer[1] = this._spineSagTransResult.tEnd;
    this._line2Buffer[0] = this.motion.frontStepsTCenter;
    this._line2Buffer[1] = this.motion.frontStepsSLine[1];
    
    // intersectLines_inPlace_Opt writes to this._intersectResult
    intersectLines_inPlace_Opt(
      this._line1Buffer,
      this._spineSagTransResult.tAngle,
      this.motion.frontSteps_tDistanceApart,
      this._line2Buffer,
      this.motion.frontStepsSAngle,
      this._intersectResult,
    );
    
    //this is what pivots the butt (lol)
    if (this.updatesGlobalMotion) {
      this.motion.update_mirroredFrontStepsData(this._intersectResult);
    }
    
    // this.intersectionPoint already aliases this._intersectResult.position
    // No need to reassign unless you're using it elsewhere
    
    if (this.motion.centerIntersection != null) {
      this.motionSecondAngle = this.motion.realignmentAngle2;
    }
  }

  update(leadPoint_lead, leadPoint_isMoving) {
    this.isMoving = leadPoint_isMoving;

    // this.updateMotionFirstAngle();
    // Inline if this is just one assignment
    this.motionFirstAngle = this.motion.realignmentAngle1;
    

    solveFirst_withBackwardsDetect(
      this.motion.frontStepsTCenter,
      this.motion.frontStepsTAngle,
      this.motion.frontSteps_tDistanceApart,
      this.valuesForReversing,
      leadPoint_lead,
      this.first,
      this.jointRadii,
      this.jointIndices,
      this.jointAngles,
      this.jointSecondaryAngles,
      this.jointmirroredSecondaryAngles,

      this.jointAngleDiffs,
      this.motion.realignmentAngle1, // necessary for secondaryAngle
      this.motion.realignmentAngle2, // adding the third animation here as well to keep code cleam/less confusing
      true,
    );
    for (let i = 0; i < this.totalNumJoints; i++) {
      solveProcJoint_inPlace(
        i,
        this.joints[i], // ahead
        this.jointAngles, // aheadAngle
        this.jointSecondaryAngles, // aheadSecondaryAngle
        this.jointThirdAngles, // aheadThirdAngle
        this.jointmirroredSecondaryAngles, // aheadMirroredSecondaryAngle
        this.jointAngleDiffs,
        this.jointDirections,
        this.jointIndices,
        this.joints[i + 1],
        this.jointRadii[i + 1],
        this.jointClamps[i + 1],
        this.motion2Start,
        this.motion3Start, // starting joint of third calculations
        this.motion2End,
        // this.motionClamps,
        this.jointClamps,
        this.valuesForReversing.goingBackwards,
        this.valuesForReversing.stiffnessBlend,
 
      );
    }

    this.update_unchainedJoints(leadPoint_lead);
    this.updateCurrentLength();
  }
}
