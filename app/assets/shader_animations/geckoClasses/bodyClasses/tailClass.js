import { getSpineSagTrans, intersectLines } from "../../utils.js";
import { _getCenterPoint, _getDistanceScalar } from "../../utils.js";
import { solveProcJoint } from "./utilsPChain.js";

export default class Tail {
  constructor(
 
    state,
    motion,
    // subMotion,
    cursor,
    totalNumJoints,
    segmentRange,
    baseRadius = 0.02,
    tailClamps,
    tailRadii,
    u_prefix = "joint",
    u_debug_prefix = "debugTail",
    u_center_prefix = "tailCenter",
    u_intersection_prefix = "tailIntersection",
    updatesGlobalMotion = false,
motionRange = [0, 6],
    motionIndicesLength = 6, // original default for spine
    motionBaseClamp = 8, // original default for spine
    u_motion_debug_prefix = "debugTailMotion"
  ) {
 
    this.state = state;
    this.motion = motion;
    this.cursor = cursor;
    this.TAU = Math.PI * 2;
    this.updatesGlobalMotion = updatesGlobalMotion;

    this.joints = [this.cursor];
    this.totalNumJoints = totalNumJoints;
     this.segmentStart = segmentRange[0];
    this.segmentEnd = segmentRange[1];
    this.intersectionPoint = 1; // stored in spine motion as well

    this.tailClamps = tailClamps;

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

    this.jointRadii = tailRadii;

    // for (let i = 0; i <= this.totalNumJoints; i++) {
    //   this.jointRadii.push(baseRadius);
    // }

    this.first = this.joints[0];

    this.bodyLength = 0.13;
    this.currentLength = 0; //stored in spineMotion as well
    this.currentJointLength = this.segmentEnd + 1 - this.segmentStart;

    this.center = 0; // stored in spineMotion as well
    this.centerFlanks = [
      [0.5, 0.5],
      [0.5, 0.5],
    ];
    this.manualAdjust = 2; // start mirrored angle animation later in the joint chain than midway
    let segmentCenterIndex =
      Math.ceil((this.segmentEnd + 1 - this.segmentStart) / 2) +
      this.manualAdjust;

    this.motion3Start = segmentCenterIndex;

    // PREVIOUSLY A SEPARATE CLASS CALLED SUBMOTION BUT WAS TOO CONFUSING
    this.motionCenter = [0.5, 0.5];
    this.motionLength = 0;
    this.motionFirstAngle = 0;
    this.motionSecondAngle = 0;


    this.motion2Start = motionRange[0];
    this.motionIndicesLength = motionIndicesLength;
    this.motion2End = motionRange[1]; 
 
    this.motionIndicesLength = motionIndicesLength; 
    this.motionBaseClamp = motionBaseClamp;
    this.motionClamps = [];
    for (let i = 0; i <= this.motionIndicesLength; i++) {
      this.motionClamps.push(this.motionBaseClamp);
    }

    this.motionScalars = [0.02, 0.02, 0.03, 0.04, 0.03, 0.02, 0.02, 0.02]; // Example pattern
    /////////////////////////////////////////////////////////////////////////////

    this.u_prefix = u_prefix;
    this.u_debug_prefix = u_debug_prefix;
    this.u_motion_debug_prefix = u_motion_debug_prefix;
    this.u_center_prefix = u_center_prefix;
    this.u_intersection_prefix = u_intersection_prefix;

    this.debugs = [];
    this.motion_debugs = [];
  }

  updateMotionFirstAngle() {
    //     const data = this.motion.allFrontStepsData;
    //  this.motionFirstAngle = data.mCenterJointAngle;
    //  console.log(`MOTION ANGLE`, this.motionFirstAngle);
    //  if (data.center) {
    //       this.debugs[0] = [data.sLineStart[0], data.sLineStart[1]];
    // this.debugs[1] = [data.sLineEnd[0], data.sLineEnd[1]];
    //  }
  }

  updateCurrentLength() {
    //length of body
    const length = _getDistanceScalar(
      this.joints[this.segmentEnd],
      this.joints[this.segmentStart]
    );
    this.currentLength = length;

    // mid point
    const mid = _getCenterPoint(
      this.joints[this.segmentEnd],
      this.joints[this.segmentStart]
    );
    this.center = mid;

    const tailCenterLines = getSpineSagTrans(
      this.joints[this.segmentEnd],
      this.joints[this.segmentStart]
    );

    // center line debug

    this.debugs[0] = [tailCenterLines.tStart[0], tailCenterLines.tStart[1]];
    this.debugs[1] = [tailCenterLines.tEnd[0], tailCenterLines.tEnd[1]];

    const intersection = intersectLines(
      [tailCenterLines.tStart, tailCenterLines.tEnd],
      tailCenterLines.tAngle,
      this.motion.frontSteps_tDistanceApart,
      this.motion.frontStepsSLine,
      this.motion.frontStepsSAngle,

      this.center,
      this.centerFlanks
    );

    if (this.updatesGlobalMotion) {
      // console.log(`${this.u_debug_prefix}, updating global motion`)
      this.motion.update_mirroredFrontStepsData(intersection);
    }

    this.intersectionPoint = intersection.intersectionPoint;

    // warning this function uses the motion data JUST updated above
    if (this.motion.centerIntersection != null) {
      // guards against null and undefined

      this.motionSecondAngle = this.motion.realignmentAngle2;

      this.debugs[2] = this.motion.mir_frontStepsSLine[0];
      this.debugs[3] = this.motion.mir_frontStepsSLine[1];
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
//   }





  update() {
    this.updateMotionFirstAngle();
 
    for (let i = 0; i < this.totalNumJoints; i++) {
      solveProcJoint(
        i,
        this.joints[i],
        this.joints[i + 1],
        this.jointRadii[i + 1],
        this.tailClamps[i],
       this.motion2Start,
        this.motion3Start, // starting joint of third calculations
        this.motion2End,
           this.tailClamps,
        this.motionScalars,
       false,
      );
    }

    this.updateCurrentLength();
    // this.updateUniforms();
    // this.updateDebugsUniforms();
  }




    logTailData(name = `Spine Segment Data`, limitRange, full = false) {
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
