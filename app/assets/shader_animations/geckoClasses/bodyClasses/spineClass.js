 
import { solveFirst, solveProcJoint } from "./utilsPChain.js";
import { _getCenterPoint, _makeDistancePoint, _getDistanceScalar,  _getDirVec } from "../../utils.js";
import { getStartAndEndPoints, intersectLines, getSpineSagTrans } from "../../utils.js";




export default class Spine {
  constructor(
   
    state,
    motion,  
    totalNumJoints,
    unchainedAnchorIndex = 0,
    unchainedDist = 0.04,
    snoutDist = 0.02,
    segmentRange,
    baseRadius = 0.02,
    jointClamps,
    jointRadii,
    u_prefix = "joint",
    u_debug_prefix = "debugSpine",
    u_center_prefix = "spineCenter",
    u_intersection_prefix = "spineIntersection",
    updatesGlobalMotion = false,

    motionRange = [2, 10], // original default for spine
    motionIndicesLength = 9, // original default for spine

    motionBaseClamp = 24, // original default for spine
    u_motion_debug_prefix = "debugSpineMotion",
    u_unchained_prefix = "spineUnchained"
  ) {
 
    this.state = state;
    this.motion = motion;  
    this.TAU = Math.PI * 2;
    this.updatesGlobalMotion = updatesGlobalMotion;

    // this.lead = this.cursor; 

//     this.prevLocomotionDistance = 0; 

// this.prevLocomotionDistance = this.leadPoint.locomotionDistance;

    // Not part of chain because weirdly circular, but influenced by angle caused by front steps
    this.head = [0.5, 0.5];
    this.snout = [0.5, 0.5];

    this.unchainedDist = unchainedDist;
    this.snoutDist = snoutDist;

    this.joints = [];
    this.totalNumJoints = totalNumJoints;
    this.unchainedAnchorIndex = unchainedAnchorIndex;
    this.segmentStart = segmentRange[0];
    this.segmentEnd = segmentRange[1];
    this.intersectionPoint = 1; // stored in spine motion as well

    this.jointClamps = jointClamps;

    for (let i = 0; i <= totalNumJoints; i++) {
      const joint = [0.5, 0.5];

      joint.angle = 0;
      joint.secondaryAngle = 0; // A RECALC OF ANGLE based on spineMotion/center of current front steps. gets calculated/set inside joint solver (not used for first joint)
      joint.thirdAngle = 0; // only for second half of curve, an additional recalculation/correction after getting the body length according to second angle
      joint.radius = 0;
      joint.index = 0;
      joint.angleDiff = 0;
      joint.globalAngle = 0;
      joint.direction = [1, 0];

      this.joints.push(joint);
    }

    this.jointRadii = jointRadii;

    // this.jointRadii = [];

    // for (let i = 0; i <= this.totalNumJoints; i++) {
    //   this.jointRadii.push(baseRadius);
    // }

    this.first = this.joints[0];

    this.bodyLength = 0.13;
    this.currentLength = 0; //stored in spineMotion as well
    this.currentJointLength = this.segmentEnd + 1 - this.segmentStart;

    this.center = 0; // stored in spineMotion as well

    // front steps cast onto center
    this.centerFlanks = [
      [0.5, 0.5],
      [0.5, 0.5],
    ];
    this.intersectionFlanks = [
      [0.5, 0.5],
      [0.5, 0.5],
    ];

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

    this.motionScalars = [0.02, 0.02, 0.03, 0.04, 0.03, 0.02, 0.02, 0.02]; // Example pattern
    /////////////////////////////////////////////////////////////////////////////

    this.u_prefix = u_prefix;
    this.u_unchained_prefix = u_unchained_prefix;

    this.unchainedJoints = [];
    this.u_debug_prefix = u_debug_prefix;

    this.u_center_prefix = u_center_prefix;
    this.u_intersection_prefix = u_intersection_prefix;
    this.u_motion_debug_prefix = u_motion_debug_prefix;

    this.debugs = [];
    this.motion_debugs = [];
  }
 

  updateMotionFirstAngle() {
    this.motionFirstAngle = this.motion.realignmentAngle1;
    // if (this.motion.frontStepsSLine) {
    //   this.debugs[0] = this.motion.frontStepsSLine[0];
    //   this.debugs[1] = this.motion.frontStepsSLine[1];
    // }
  }

  updateCurrentLength() {
    const length = _getDistanceScalar(
      this.joints[this.segmentEnd],
      this.joints[this.segmentStart]
    );
    this.currentLength = length;

    const mid = _getCenterPoint(
      this.joints[this.segmentEnd],
      this.joints[this.segmentStart]
    );
    this.center = mid;

    const spineCenterLines = getSpineSagTrans(
      this.joints[this.segmentEnd],
      this.joints[this.segmentStart]
    );

    // center line debug
    this.debugs[0] = [spineCenterLines.tStart[0], spineCenterLines.tStart[1]];
    this.debugs[1] = [spineCenterLines.tEnd[0], spineCenterLines.tEnd[1]];

    // uses local motion class that gets this data from global motion
    // const allFirstAngleData = this.subMotion.allFirstAngleData;// this.motion.allFrontStepsData

    this.centerFlanks = getStartAndEndPoints(
      this.center,
      spineCenterLines.tEnd,
      spineCenterLines.tStart,
      this.motion.frontSteps_tDistanceApart
    );

    this.debugs[2] = this.centerFlanks[0];
    this.debugs[3] = this.centerFlanks[1];

    // replace with direct motion.Props
    // const frontStepLines = {
    //   angle: this.motion.frontStepssAngle,
    //   end: this.motion.frontStepsSLine[1],
    //   center: this.motion.frontStepsTCenter,
    //   distanceApart: this.motion.frontSteps_tDistanceApart,
    // };

    const intersection = intersectLines(
      [spineCenterLines.tStart, spineCenterLines.tEnd],
      spineCenterLines.tAngle,
      this.motion.frontSteps_tDistanceApart,
      [this.motion.frontStepsTCenter, this.motion.frontStepsSLine[1]], // mirrored line starts from tCenter
      this.motion.frontStepsSAngle
    );

    if (this.updatesGlobalMotion) {
      // console.log(`${this.u_debug_prefix}, updating global motion`)
      this.motion.update_mirroredFrontStepsData(intersection);
    }

    this.intersectionPoint = intersection.intersectionPoint;

    this.intersectionFlanks = getStartAndEndPoints(
      this.intersectionPoint,
      spineCenterLines.tEnd,
      spineCenterLines.tStart,
      this.motion.frontSteps_tDistanceApart
    );

    this.debugs[4] = this.intersectionFlanks[0];
    this.debugs[5] = this.intersectionFlanks[1];

    // warning this function uses the motion data JUST updated above
    if (this.motion.centerIntersection != null) {
      this.motionSecondAngle = this.motion.realignmentAngle2;
      // this.debugs[2] = this.motion.mir_frontStepsSLine[0];
      // this.debugs[3] =  this.motion.mir_frontStepsSLine[1];
    }
  }

  updateJointRadii(radii) {
    const expectedLength = this.totalNumJoints + 1;

    if (!Array.isArray(radii)) return;

    for (let i = 0; i < expectedLength; i++) {
      if (radii[i] !== undefined) {
        this.jointRadii[i] = radii[i];
      }
    }
  }

  //customized because I have no other use case
  // HEAD
  update_unchainedJoints(leadPoint_lead) {
    let midPoint = _getCenterPoint(this.motion.frontStepsSLine[1], leadPoint_lead);

    let dirVec = _getDirVec(this.joints[this.unchainedAnchorIndex], midPoint);
    let head = _makeDistancePoint(
      this.joints[this.unchainedAnchorIndex],
      dirVec,
      this.unchainedDist
    );

    let snout = _makeDistancePoint(head, dirVec, this.snoutDist);

    // Put snout first so in ascending order like joints are
    this.unchainedJoints = [snout, head];
  }

//   updateDebugsUniforms() {
//     this.gl.setSingleUniform(`${this.u_center_prefix}`, this.center);
//     this.gl.setSingleUniform(
//       `${this.u_intersection_prefix}`,
//       this.intersectionPoint
//     );
//     this.gl.setArrayOfUniforms(this.u_debug_prefix, this.debugs);
//     this.gl.setArrayOfUniforms(this.u_motion_debug_prefix, this.motion_debugs);
//   }

//   updateUniforms() {
//     this.gl.setArrayOfUniforms(this.u_prefix, this.joints);
//     this.gl.setArrayOfUniforms(this.u_unchained_prefix, this.unchainedJoints);
//   }

  update(leadPoint_lead) {
    // this.updateLeadPoint();
    this.updateMotionFirstAngle();
    // console.log(`${this.u_debug_prefix}, ${this.subMotion.curveAngle}`)

    solveFirst(
      // this.cursor,
      // this.lead,
      // this.leadPoint.lead,
      leadPoint_lead,
      this.first,
      this.jointRadii[0],
      this.motion.realignmentAngle1, // necessary for secondaryAngle
      this.motion.realignmentAngle2, // adding the third animation here as well to keep code cleam/less confusing
      true
    );
    for (let i = 0; i < this.totalNumJoints; i++) {
      solveProcJoint(
        i,
        this.joints[i],
        this.joints[i + 1],
        this.jointRadii[i + 1],
        this.jointClamps[i + 1],
        this.motion2Start,
        this.motion3Start, // starting joint of third calculations
        this.motion2End,
        // this.motionClamps,
        this.jointClamps,
        this.motionScalars,
        true
      );
    }

    this.update_unchainedJoints(leadPoint_lead);

    this.updateCurrentLength();

    // this.updateUniforms();
    // this.updateDebugsUniforms();
  }

  // LOGGING
  logSpineData(name = `Spine Segment Data`, limitRange, full = false) {
    let start = 0;
    let end = this.joints.length - 1;
    let totalLength = 0;

    // Optional range handling (start / end, inclusive)
    if (Array.isArray(limitRange) && limitRange.length === 2) {
      start = Math.max(0, limitRange[0]);
      end = Math.min(this.joints.length - 1, limitRange[1]);
    }

    console.group(`Spine Class Debug | ${name} [${start} → ${end}]`);

    for (let i = start; i <= end; i++) {
      const joint = this.joints[i];
      const radius = this.jointRadii[i];

      totalLength += radius;

      if (full) {
        console.log(`${this.u_prefix}[${i}]`, {
          position: [joint[0], joint[1]],
          radius,
          angle: joint.angle,
          secondaryAngle: joint.secondaryAngle ?? null,
          thirdAngle: joint.thirdAngle ?? null,
          angleDiff: joint.angleDiff,
          globalAngle: joint.globalAngle,
          direction: joint.direction,
          index: joint.index,
        });
      } else {
        console.log(`${this.u_prefix}[${i}]`, {
          radius,
          angle: joint.angle,
          secondaryAngle: joint.secondaryAngle ?? null,
          thirdAngle: joint.thirdAngle ?? null,
          // angleDiff: joint.angleDiff,
          // globalAngle: joint.globalAngle,
          direction: joint.direction,
          index: joint.index,
        });
      }
    }

    // console.log("Total spine length (sum of radii):", totalLength);

    console.groupEnd();

    return totalLength;
  }
}
