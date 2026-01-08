// Gait animation via distance leading point for creature travels instead of time
export default class GaitState {
  constructor(speedScalar) {
 
    this.TAU = Math.PI * 2;
    this.gaitDistanceCorrection = 0;
    this.accumulatedDistance = 0;
    this.inputDistance = 0; // raw mouse-driven distance //mouse
    this.finalDistance = 0;

    this.maxAdvanceRate = 0.03; // distance per frame (tunable)
    this.catchUpGain = 0.15;
    (this.scalar = speedScalar), (this.threshold = 0.94);
    this.cycle = 1 / this.scalar;
    this.jumpCount = 0;
    this.frontCenterAngle = 0;

    this.step0Distance = Math.asin(this.threshold) / (this.TAU * this.scalar);
    this.step1Distance = -Math.asin(this.threshold) / (this.TAU * this.scalar);

    this.externalDistanceDriver = 0;

    this.takeStep0 = false;
    this.takeStep1 = false;
    this.syncedStepOffset = 0.1;
    this.takeSyncedSteps0 = false;
    this.takeSyncedSteps1 = false;

    this.swayBodyFront = false;

    this.debugPhase = 0;
    this.debugFollowerPhase = 0;
  }

  get phaseAngle() {
    return this.finalDistance * this.TAU * this.scalar;
  }

 

  get phase() {
    return Math.sin(this.phaseAngle);
  }

  // used for back legs, exploring using for body sway; just offsets the phase a little for more natural walking movement
  get followerPhase() {
    return Math.sin(this.phaseAngle - this.syncedStepOffset);
  }

  get progress() {
    return this.finalDistance % this.cycle;
    // return this.accumulatedDistance % this.cycle;
  }

  updateSpeedScalar(scalar) {
    this.scalar = scalar;
    this.cycle = 1 / scalar;

    this.step0Distance = Math.asin(this.threshold) / (this.TAU * scalar);
    this.step1Distance = -Math.asin(this.threshold) / (this.TAU * scalar);
  }

  update(externalDistanceDriver, dt = 1) {
    this.externalDistanceDriver = externalDistanceDriver;

    this.finalDistance = externalDistanceDriver + this.gaitDistanceCorrection;

    this.debugPhase = this.phase;
    this.debugFollowerPhase = this.followerPhase;
    if (this.phase > 0.89) {
      this.takeStep0 = true;
    }
    if (this.phase < -0.89) {
      this.takeStep1 = true;
    }

    if (this.followerPhase > 0.89) {
      this.takeSyncedSteps0 = true;
    } else if (this.followerPhase < -0.89) {
      this.takeSyncedSteps1 = true;
    }

    if (this.followerPhase > 0.94 || this.followerPhase < -0.94) {
      // console.log("setting sway to tru!!");
      this.swayBodyFront = true;
    } else {
      this.swayBodyFront = false;
    }
  }

  jumpUpdate(inputDistance, dt = 1) {
    // this.inputDistance += inputDistance;
    this.gaitDistanceCorrection += inputDistance;

    this.finalDistance =
      this.externalDistanceDriver + this.gaitDistanceCorrection;
 
    this.debugPhase = this.phase;
    this.debugFollowerPhase = this.followerPhase;
    if (this.phase > 0.89) {
      this.takeStep0 = true;
    }
    if (this.phase < -0.89) {
      this.takeStep1 = true;
    }

    if (this.followerPhase > 0.89) {
      this.takeSyncedSteps0 = true;
    } else if (this.followerPhase < -0.89) {
      this.takeSyncedSteps1 = true;
    }

    if (this.followerPhase > 0.94 || this.followerPhase < -0.94) {
      // console.log("setting sway to tru!!");
      this.swayBodyFront = true;
    } else {
      this.swayBodyFront = false;
    }
  }
  // used after actual step logic in animation functions
  // is1 = primary step is on right side
  stepCompleted(is1) {
    if (is1) {
      this.takeStep1 = false;
    } else {
      this.takeStep0 = false;
    }
  }

  syncedStepsCompleted(is1) {
    if (is1) {
      this.takeSyncedSteps1 = false;
    } else {
      this.takeSyncedSteps0 = false;
    }
  }

  catchUp(is1) {
    // PRE JUMP LOGS
    // console.log("Before Jump:");
    // console.log(`Accumulated Distance: ${this.accumulatedDistance}`);
    // console.log(`Progress: ${this.progress}`);
    // console.log(`Step 0 Distance: ${this.step0Distance}`);
    // console.log(`Step 1 Distance: ${this.step1Distance}`);

    let jumpDistance =
      (is1 ? this.step1Distance : this.step0Distance) - this.progress;

    // If jump distance is negative, wrap it around the cycle
    if (jumpDistance < 0) jumpDistance += this.cycle;
    this.jumpUpdate(jumpDistance);
    this.jumpCount++;

    // POST JUMP LOGS:
    // console.log('After Jump:');
    // console.log(`New Accumulated Distance: ${this.accumulatedDistance}`);
    // console.log(`New Progress: ${this.progress}`);
    // console.log(`phase`, this.phase);
    // console.log(`followerPhase`, this.followerPhase);
  }
}
