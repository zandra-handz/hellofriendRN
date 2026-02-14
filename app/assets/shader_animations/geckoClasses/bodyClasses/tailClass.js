 
 
// }
import {
  getSpineSagTrans_inPlace,
  intersectLines_inPlace,
} from "../../utils.js";

import {
  _getCenterPoint_inPlace,
  _getDistanceScalar,
} from "../../utils.js";

import { solveProcJoint_inPlace } from "./utils_otherJoints.js";

export default class Tail {
  constructor(
    state,
    valuesForReversing,
    motion,
    cursor,

    spineJointAngles,
    spineJointSecondaryAngles,
    spineJointmirroredSecondaryAngles,
    spineJointThirdAngles,
    spineJointIndices,
    spineJointAngleDiffs,
    spineJointGlobalAngles,

    cursorIndex,
    totalNumJoints,
    segmentRange,
    baseRadius = 0.02,
    tailClamps,
    tailRadii,
    updatesGlobalMotion = false,
    motionRange = [0, 6],
    motionIndicesLength = 6,
    motionBaseClamp = 8,
  ) {
    this.state = state;
    this.valuesForReversing = valuesForReversing;
    this.motion = motion;
    this.cursor = cursor;

    this.spineJointAngles = spineJointAngles;
    this.spineJointSecondaryAngles = spineJointSecondaryAngles;
    this.spineJointmirroredSecondaryAngles = spineJointmirroredSecondaryAngles;
    this.spineJointThirdAngles = spineJointThirdAngles;
    this.spineJointIndices = spineJointIndices;
    this.spineJointAngleDiffs = spineJointAngleDiffs;
    this.spineJointGlobalAngles = spineJointGlobalAngles;
    this.cursorIndex = cursorIndex;

    this.TAU = Math.PI * 2;
    this.updatesGlobalMotion = updatesGlobalMotion;

    this.joints = [this.cursor];
    this.totalNumJoints = totalNumJoints;
    this.segmentStart = segmentRange[0];
    this.segmentEnd = segmentRange[1];
    this.intersectionPoint = 1;

    this.tailClamps = tailClamps;

    // -------------------------
    // Joint buffers
    // -------------------------

    this.jointBuffer = new Float32Array((totalNumJoints + 1) * 2);

    this.jointAngles = new Float32Array(totalNumJoints + 1);
    this.jointSecondaryAngles = new Float32Array(totalNumJoints + 1);
    this.jointmirroredSecondaryAngles = new Float32Array(totalNumJoints + 1);
    this.jointThirdAngles = new Float32Array(totalNumJoints + 1);
    this.jointIndices = new Uint16Array(totalNumJoints + 1);
    this.jointAngleDiffs = new Float32Array(totalNumJoints + 1);
    this.jointGlobalAngles = new Float32Array(totalNumJoints + 1);

    for (let i = 0; i <= totalNumJoints; i++) {
      const joint = this.jointBuffer.subarray(i * 2, i * 2 + 2);
      this.joints.push(joint);
    }

    this.jointDirectionsBuffer = new Float32Array((totalNumJoints + 1) * 2);
    this.jointDirections = [];

    for (let i = 0; i <= totalNumJoints; i++) {
      const direction = this.jointDirectionsBuffer.subarray(
        i * 2,
        i * 2 + 2
      );
      this.jointDirections.push(direction);
    }

    this.jointRadii = tailRadii;

    this.first = this.joints[0];
  //  this.bodyLength = 0.13;
    this.currentLength = 0;
    this.currentJointLength = this.segmentEnd + 1 - this.segmentStart;

    // FIXED (was 0 before — that was wrong)
    this.center = new Float32Array(2);

    // -------------------------
    // Preallocated Sag Result
    // -------------------------

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

    // -------------------------
    // Preallocated Intersection Result
    // -------------------------

    this._intersectResult = {
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
    };

    // Motion settings
    this.motion2Start = motionRange[0];
    this.motion2End = motionRange[1];
    this.motionIndicesLength = motionIndicesLength;
    this.motionBaseClamp = motionBaseClamp;

    this.motionClamps = [];
    for (let i = 0; i <= this.motionIndicesLength; i++) {
      this.motionClamps.push(this.motionBaseClamp);
    }

    this.motionScalars = [0.02, 0.02, 0.03, 0.04, 0.03, 0.02, 0.02, 0.02];
  }

  // =========================================================
  // UPDATE LENGTH
  // =========================================================

  updateCurrentLength() {
    this.currentLength = _getDistanceScalar(
      this.joints[this.segmentEnd],
      this.joints[this.segmentStart]
    );

    _getCenterPoint_inPlace(
      this.joints[this.segmentEnd],
      this.joints[this.segmentStart],
      this.center
    );

    // Sag calculation (in-place)
    getSpineSagTrans_inPlace(
      this.joints[this.segmentEnd],
      this.joints[this.segmentStart],
      this._spineSagTransResult
    );

    // Intersection calculation (in-place)
    intersectLines_inPlace(
      [
        this._spineSagTransResult.tStart,
        this._spineSagTransResult.tEnd,
      ],
      this._spineSagTransResult.tAngle,
      this.motion.frontSteps_tDistanceApart,
      this.motion.frontStepsSLine,
      this.motion.frontStepsSAngle,
      this._intersectResult
    );

    if (this.updatesGlobalMotion) {
      this.motion.update_mirroredFrontStepsData(
        this._intersectResult
      );
    }

   // this.intersectionPoint = this._intersectResult.position;

    if (this.motion.centerIntersection != null) {
      this.motionSecondAngle = this.motion.realignmentAngle2;
    }
  }

  // =========================================================
  // UPDATE
  // =========================================================

  update() {
    // Pull cursor joint state from spine
    this.jointAngles[0] =
      this.spineJointAngles[this.cursorIndex];
    this.jointSecondaryAngles[0] =
      this.spineJointSecondaryAngles[this.cursorIndex];
    this.jointmirroredSecondaryAngles[0] =
      this.spineJointmirroredSecondaryAngles[this.cursorIndex];
    this.jointThirdAngles[0] =
      this.spineJointThirdAngles[this.cursorIndex];
    this.jointIndices[0] =
      this.spineJointIndices[this.cursorIndex];
    this.jointAngleDiffs[0] =
      this.spineJointAngleDiffs[this.cursorIndex];
    this.jointGlobalAngles[0] =
      this.spineJointGlobalAngles[this.cursorIndex];

    // Solve chain
    for (let i = 0; i < this.totalNumJoints; i++) {
      solveProcJoint_inPlace(
        i,
        this.joints[i],
        this.jointAngles,
        this.jointSecondaryAngles,
        this.jointThirdAngles,
        this.jointmirroredSecondaryAngles,
        this.jointAngleDiffs,
        this.jointDirections,
        this.jointIndices,
        this.joints[i + 1],
        this.jointRadii[i + 1],
        this.tailClamps[i],
        this.motion2Start,
        this.motion2End,
        this.tailClamps,
        this.valuesForReversing.goingBackwards,
        this.valuesForReversing.stiffnessBlend
      );
    }

    this.updateCurrentLength();
  }
}
