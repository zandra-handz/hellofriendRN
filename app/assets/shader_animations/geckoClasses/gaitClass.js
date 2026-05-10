

  export default class GaitState {                                                                                                                                                                                                                   
    constructor(speedScalar, reverseSpeedScalar, energyConfig, seed24h) {                                                                                                                                                                                     
      this.TAU = Math.PI * 2;                                                                                                                                                                                                                        
      this.gaitDistanceCorrection = 0;
      this.accumulatedDistance = 0;
      this.inputDistance = 0;
      this.finalDistance = 0;

      this.maxAdvanceRate = 0.03;
      this.catchUpGain = 0.15;
      this.speedScalar = speedScalar;
      this.reverseSpeedScalar = reverseSpeedScalar;

      this.stepCount = 0;
      this.scalar = this.speedScalar;

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
      this.isReversing = false;

    
      // comes from SOCKET
      this.stepsLast24h = seed24h.steps_last_24h ?? 0.0;
      this.sustenanceLast24h = seed24h.sustenance_last_24h ?? 0.0;


      // comes from GECKOSCORESTATE
      this.multiplier = energyConfig.multiplier ?? 1;
      this.baseMultiplier = energyConfig.base_multiplier ?? 1;
    }

    get energy() {
      return (this.sustenanceLast24h * 500) - (this.stepsLast24h + this.stepCount);
    }

    get phaseAngle() {
      const direction = this.isReversing ? -1 : 1;
      return this.finalDistance * this.TAU * this.scalar * direction;
    }

    get phase() {
      return Math.sin(this.phaseAngle);
    }

    get followerPhase() {
      return Math.sin(this.phaseAngle - this.syncedStepOffset);
    }

    get progress() {
      return this.finalDistance % this.cycle;
    }

    updateSpeedScalar(scalar) {
      this.scalar = scalar;
      this.cycle = 1 / scalar;
      this.step0Distance = Math.asin(this.threshold) / (this.TAU * scalar);
      this.step1Distance = -Math.asin(this.threshold) / (this.TAU * scalar);
    }

    update(externalDistanceDriver, goingBackwards) {
      // console.log('[gait energy]', this.energy);

      this.isReversing = goingBackwards;

      if (this.isReversing) {
        this.updateSpeedScalar(this.reverseSpeedScalar);
      } else {
        this.updateSpeedScalar(this.speedScalar);
      }

      this.externalDistanceDriver = externalDistanceDriver;
      this.finalDistance = externalDistanceDriver + this.gaitDistanceCorrection;

      if (this.isReversing) {
        if (this.phase < -0.89) this.takeStep0 = true;
        if (this.phase > 0.89) this.takeStep1 = true;
        if (this.followerPhase < -0.89) this.takeSyncedSteps0 = true;
        else if (this.followerPhase > 0.89) this.takeSyncedSteps1 = true;
      } else {
        if (this.phase > 0.89) this.takeStep0 = true;
        if (this.phase < -0.89) this.takeStep1 = true;
        if (this.followerPhase > 0.89) this.takeSyncedSteps0 = true;
        else if (this.followerPhase < -0.89) this.takeSyncedSteps1 = true;
      }

      if (this.followerPhase > 0.94 || this.followerPhase < -0.94) {
        this.swayBodyFront = true;
      } else {
        this.swayBodyFront = false;
      }
    }

    jumpUpdate(inputDistance, dt = 1) {
      this.gaitDistanceCorrection += inputDistance;
      this.finalDistance =
        this.externalDistanceDriver + this.gaitDistanceCorrection;

      if (this.isReversing) {
        if (this.phase < -0.89) this.takeStep0 = true;
        if (this.phase > 0.89) this.takeStep1 = true;
        if (this.followerPhase < -0.89) this.takeSyncedSteps0 = true;
        else if (this.followerPhase > 0.89) this.takeSyncedSteps1 = true;
      } else {
        if (this.phase > 0.89) this.takeStep0 = true;
        if (this.phase < -0.89) this.takeStep1 = true;
        if (this.followerPhase > 0.89) this.takeSyncedSteps0 = true;
        else if (this.followerPhase < -0.89) this.takeSyncedSteps1 = true;
      }

      if (this.followerPhase > 0.94 || this.followerPhase < -0.94) {
        this.swayBodyFront = true;
      } else {
        this.swayBodyFront = false;
      }
    }

    stepCompleted(is1) {
      if (is1) {
        this.takeStep1 = false;
        this.stepCount++;
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
      let jumpDistance =
        (is1 ? this.step1Distance : this.step0Distance) - this.progress;
      if (jumpDistance < 0) jumpDistance += this.cycle;
      this.jumpUpdate(jumpDistance);
      this.jumpCount++;
    }
  }
 
 