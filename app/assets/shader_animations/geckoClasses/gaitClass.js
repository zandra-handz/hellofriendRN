// Gait animation via distance leading point for creature travels instead of time
export default class GaitState {
  constructor(speedScalar, reverseSpeedScalar) {
    this.TAU = Math.PI * 2;
    this.gaitDistanceCorrection = 0;
    this.accumulatedDistance = 0;
    this.inputDistance = 0; // raw mouse-driven distance //mouse
    this.finalDistance = 0;

    this.maxAdvanceRate = 0.03; // distance per frame (tunable)
    this.catchUpGain = 0.15;
    this.speedScalar = speedScalar;
    this.reverseSpeedScalar = reverseSpeedScalar;

    this.scalar = this.speedScalar; // initialize to forward scalar

    this.threshold = 0.94;
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

    // New: backwards movement tracking
    this.isReversing = false;
  }

  get phaseAngle() {
    // New
    const direction = this.isReversing ? -1 : 1;
    return this.finalDistance * this.TAU * this.scalar * direction;
    // return this.finalDistance * this.TAU * this.scalar;
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

  update(externalDistanceDriver, goingBackwards) {
    this.isReversing = goingBackwards;
  
//console.log(this.phase)
    if (this.isReversing) {
      this.updateSpeedScalar(this.reverseSpeedScalar);
        // console.log('gait is in reversal!!');
    } else {
      // console.log(`~~~~~~~~~~`)
      this.updateSpeedScalar(this.speedScalar);
    } 

    this.externalDistanceDriver = externalDistanceDriver;

    this.finalDistance = externalDistanceDriver + this.gaitDistanceCorrection;

    if (this.isReversing) {
      if (this.phase < -0.89) {
        this.takeStep0 = true;
      }
      if (this.phase > 0.89) {
        this.takeStep1 = true;
      }

      if (this.followerPhase < -0.89) {
        this.takeSyncedSteps0 = true;
      } else if (this.followerPhase > 0.89) {
        this.takeSyncedSteps1 = true;
      }
    } else {
      // Normal forward step triggers
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
    }

    if (this.followerPhase > 0.94 || this.followerPhase < -0.94) {
      // console.log("setting sway to tru!!");
      this.swayBodyFront = true;
    } else {
      this.swayBodyFront = false;
    }

    // if (this.takeStep0){

    //        console.log('setting step')
    // } else if (this.takeStep1){
    //     console.log('                       setting step')
      
    // } else {
    //     console.log('                              no step')
    // }
  }

  jumpUpdate(inputDistance, dt = 1) {
    // this.inputDistance += inputDistance;
    this.gaitDistanceCorrection += inputDistance;

    this.finalDistance =
      this.externalDistanceDriver + this.gaitDistanceCorrection;

    // Reverse step triggers when going backwards
    if (this.isReversing) {
      if (this.phase < -0.89) {
        this.takeStep0 = true;
      }
      if (this.phase > 0.89) {
        this.takeStep1 = true;
      }

      if (this.followerPhase < -0.89) {
        this.takeSyncedSteps0 = true;
      } else if (this.followerPhase > 0.89) {
        this.takeSyncedSteps1 = true;
      }
    } else {
      // Normal forward step triggers
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
