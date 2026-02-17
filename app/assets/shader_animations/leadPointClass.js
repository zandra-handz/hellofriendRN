 

// export default class Mover {
//   //time based update, updates every frame
//   constructor(lead=[.0,.0], u_debug_lead_point_prefix = "debugLeadPoint") {
//     this.lead =  lead;
    
//     // [0] = leadFollowerAngle, nothing planned for the others right now
//     this.angles = [.0]; // DO NOT REMOVE, NEEDED FOR FIRST JOINT SOLVER IN SPINE
  
//     this.leadDistanceTraveled = 0;
//     this.prevLead = [...this.lead];
//     this.leadVelocity = [0, 0];

//     this.defaultDampening = 6.4;
//     this.defaultSpring = 20;

//     this.dampening = 5.4; //6.4
//     this.spring = 30; //2-
//  this.lastMovingTime = null; 
//     this.u_debug_lead_point_prefix = u_debug_lead_point_prefix;

//     this.inputDistance = 0;

//     this.isMoving = false;
//     this.stillModeThreshhold = 0.00001; // how much sooner than vel setting to [0,0] do we set still mode
//   this.speed = 0;
//   }

//   changeOverallSpeed(dampening, spring) {
//     this.dampening = dampening;
//     this.spring = spring;
//   }

//   resetSpeed() {
//     this.dampening = this.defaultDampening;
//     this.spring = this.defaultSpring;
//   }

//   // isLeadStationary() {
//   //   const [vx, vy] = this.leadVelocity;
//   //   return Math.sqrt(vx * vx + vy * vy) < this.stillModeThreshhold;
//   // }


//     isLeadStationary() {
//     return this.speed < this.stillModeThreshhold;
//   }

 

//   updateLeadPointSmooth(path, dt = 1, currentTime = Date.now()) {
//     const target = path;
//     const pos = this.lead;

//     const dx = target[0] - pos[0];
//     const dy = target[1] - pos[1];
//     const dist = Math.sqrt(dx * dx + dy * dy);

//     // Threshold for "close enough" to target
//     const epsilon = 0.0001;

//     if (dist < epsilon) {
//       // Snap to target and reset velocity
//       this.lead = [...target];
//       this.leadVelocity[0] = 0;
//       this.leadVelocity[1] = 0;
//       this.isMoving = false;
//       return;
//     }

//     this.leadVelocity[0] += dx * this.spring * dt;
//     this.leadVelocity[1] += dy * this.spring * dt;

//     this.leadVelocity[0] *= Math.exp(-this.dampening * dt);
//     this.leadVelocity[1] *= Math.exp(-this.dampening * dt);

//     const vx = this.leadVelocity[0];
//     const vy = this.leadVelocity[1];
//     // this.lead = [pos[0] + vx * dt, pos[1] + vy * dt];
//     // in place
//     this.lead[0] = pos[0] + vx*dt;
//     this.lead[1] = pos[1] + vy*dt;

//         this.speed = Math.sqrt(
//       this.leadVelocity[0] * this.leadVelocity[0] +
//       this.leadVelocity[1] * this.leadVelocity[1]
//     );


//     const rawSpeed = Math.sqrt(
//   this.leadVelocity[0] ** 2 + this.leadVelocity[1] ** 2
// );

// // Snap small velocities to zero
// this.speed = rawSpeed < this.stillModeThreshhold ? 0 : rawSpeed;

// if (this.speed > 0) {
//   // Creature is moving, reset timestamp
//   this.lastMovingTime = null;
// } else {
//   // Creature is still, record the last time it had speed
//   if (this.lastMovingTime === null) {
//     this.lastMovingTime = currentTime;
//   }
// }

//     const moved = this.speed * dt;
//     this.leadDistanceTraveled += moved;

//     this.isMoving = !this.isLeadStationary();

// // older version before we had speed
//     // const moved = Math.sqrt(vx * vx + vy * vy) * dt;
//     // this.leadDistanceTraveled += moved;

//     // this.isMoving = !this.isLeadStationary(); 
//   }

//   update(path) { 
//     // use mouse.user_pointer or a soul
 

//     this.updateLeadPointSmooth(path);
//   }
// }


export default class Mover {
  // frame-based update (dt defaults to 1 just like your old behavior)
  constructor(lead0, lead1, u_debug_lead_point_prefix = "debugLeadPoint") {
    this.lead = [lead0, lead1];

    // [0] = leadFollowerAngle
    this.angles = [0.0];

    this.leadDistanceTraveled = 0;

    // old code allocated once here; it did NOT update prevLead every frame.
    // keep same behavior unless you truly use prevLead elsewhere.
    this.prevLead = [...this.lead];

    this.leadVelocity = [0, 0];

    this.defaultDampening = 6.4;
    this.defaultSpring = 20;

    this.dampening = 5.4; // same as old
    this.spring = 30;     // same as old

    this.lastMovingTime = null;
    this.u_debug_lead_point_prefix = u_debug_lead_point_prefix;

    this.inputDistance = 0;

    this.isMoving = false;
    this.stillModeThreshhold = 0.00001;
    this.speed = 0;
  }

  changeOverallSpeed(dampening, spring) {
    this.dampening = dampening;
    this.spring = spring;
  }

  resetSpeed() {
    this.dampening = this.defaultDampening;
    this.spring = this.defaultSpring;
  }

  isLeadStationary() {
    return this.speed < this.stillModeThreshhold;
  }

  // dt=1 by default (MATCHES OLD)
  updateLeadPointSmooth(path, dt = 1, currentTime = Date.now()) {
    const target = path;
    const pos = this.lead;

    const dx = target[0] - pos[0];
    const dy = target[1] - pos[1];
    const dist = Math.sqrt(dx * dx + dy * dy);

    const epsilon = 0.0001;

    if (dist < epsilon) {
      // OLD did: this.lead = [...target]; (alloc + changes reference)
      // To keep the SAME position result but avoid allocations:
      pos[0] = target[0];
      pos[1] = target[1];

      this.leadVelocity[0] = 0;
      this.leadVelocity[1] = 0;

      this.isMoving = false;
      return;
    }

    // EXACT OLD MATH
    this.leadVelocity[0] += dx * this.spring * dt;
    this.leadVelocity[1] += dy * this.spring * dt;

    this.leadVelocity[0] *= Math.exp(-this.dampening * dt);
    this.leadVelocity[1] *= Math.exp(-this.dampening * dt);

    const vx = this.leadVelocity[0];
    const vy = this.leadVelocity[1];

    // EXACT OLD UPDATE FORM
    this.lead[0] = pos[0] + vx * dt;
    this.lead[1] = pos[1] + vy * dt;

    // EXACT OLD speed logic (two sqrt’s collapsed to one, same result)
    const rawSpeed = Math.sqrt(vx * vx + vy * vy);
    this.speed = rawSpeed < this.stillModeThreshhold ? 0 : rawSpeed;

    if (this.speed > 0) {
      this.lastMovingTime = null;
    } else if (this.lastMovingTime === null) {
      this.lastMovingTime = currentTime;
    }

    const moved = this.speed * dt;
    this.leadDistanceTraveled += moved;

    this.isMoving = !this.isLeadStationary();
  }

  // IMPORTANT: keep signature like old (don’t pass dt)
  update(path) {
    this.updateLeadPointSmooth(path);
  }
}












// export default class Mover {
//   // Updates every frame
//   constructor(lead = [0.0, 0.0], u_debug_lead_point_prefix = "debugLeadPoint") {
//     this.lead = lead;

//     // [0] = leadFollowerAngle (mutable buffer)
//     this.angles = [0.0]; // DO NOT REMOVE, NEEDED FOR FIRST JOINT SOLVER IN SPINE

//     this.leadDistanceTraveled = 0;
//     this.prevLead = [this.lead[0], this.lead[1]];
//     this.leadVelocity = [0, 0];

//     this.defaultDampening = 6.4;
//     this.defaultSpring = 20;

//     this.dampening = 5.4;
//     this.spring = 30;

//     this.lastMovingTime = null;
//     this.u_debug_lead_point_prefix = u_debug_lead_point_prefix;

//     this.inputDistance = 0;

//     this.isMoving = false;
//     this.stillModeThreshhold = 0.00001;

//     this.speed = 0;

//     // dt handling:
//     // - "seconds": you pass dt in seconds (recommended from rAF)
//     // - "frames": you pass dt in old-style frame units (dt=1 ~= one frame)
//     this.dtMode = "seconds"; // "seconds" | "frames"

//     // Dynamic FPS estimate so dtFrames ~= 1 per rendered frame (matches old feel at 60/90/120hz)
//     this._fpsEstimate = 60;

//     // Optional safety clamp (seconds). Set to Infinity to fully match old "no clamp" behavior.
//     this.maxDtSeconds = 0.1; // try 0.1; set Infinity to disable
//   }

//   changeOverallSpeed(dampening, spring) {
//     this.dampening = dampening;
//     this.spring = spring;
//   }

//   resetSpeed() {
//     this.dampening = this.defaultDampening;
//     this.spring = this.defaultSpring;
//   }

//   isLeadStationary() {
//     return this.speed < this.stillModeThreshhold;
//   }

//   updateLeadPointSmooth(path, dt = 1 / 60, currentTime = Date.now()) {
//     // ----------------------------
//     // Convert dt to "frame units"
//     // ----------------------------
//     let dtFrames;

//     if (this.dtMode === "frames") {
//       dtFrames = dt;
//     } else {
//       // dt is seconds
//       let dtSeconds = dt;

//       if (dtSeconds < 0) dtSeconds = 0;
//       if (dtSeconds > this.maxDtSeconds) dtSeconds = this.maxDtSeconds;

//       // Estimate fps (EMA smoothing) so dtFrames ~= 1 per rendered frame.
//       // This recreates the old "dt=1 every frame" feel across 60/90/120Hz.
//       const instFps = dtSeconds > 0 ? 1 / dtSeconds : this._fpsEstimate;
//       this._fpsEstimate = this._fpsEstimate * 0.9 + instFps * 0.1;

//       dtFrames = dtSeconds * this._fpsEstimate;
//     }

//     // ----------------------------
//     // Old mover math (allocation-free)
//     // ----------------------------
//     const target = path;
//     const pos = this.lead;

//     // keep prev lead updated (only affects you if you use it elsewhere)
//     this.prevLead[0] = pos[0];
//     this.prevLead[1] = pos[1];

//     const dx = target[0] - pos[0];
//     const dy = target[1] - pos[1];

//     // "close enough" epsilon (squared compare = same as old sqrt compare)
//     const epsilon = 0.0001;
//     const epsilonSq = epsilon * epsilon;
//     const distSq = dx * dx + dy * dy;

//     if (distSq < epsilonSq) {
//       // Snap to target (same on-screen result as old, but no allocation / preserves reference)
//       pos[0] = target[0];
//       pos[1] = target[1];

//       this.leadVelocity[0] = 0;
//       this.leadVelocity[1] = 0;

//       this.isMoving = false;
//       this.speed = 0;

//       // IMPORTANT: match old behavior: return before touching lastMovingTime
//       return;
//     }

//     // Spring acceleration
//     this.leadVelocity[0] += dx * this.spring * dtFrames;
//     this.leadVelocity[1] += dy * this.spring * dtFrames;

//     // Damping
//     const damp = Math.exp(-this.dampening * dtFrames);
//     this.leadVelocity[0] *= damp;
//     this.leadVelocity[1] *= damp;

//     // Integrate position
//     const vx = this.leadVelocity[0];
//     const vy = this.leadVelocity[1];
//     pos[0] = pos[0] + vx * dtFrames;
//     pos[1] = pos[1] + vy * dtFrames;

//     // Speed + snap-to-zero (same as old logic, but computed once)
//     const vSq = vx * vx + vy * vy;
//     const rawSpeed = Math.sqrt(vSq);
//     this.speed = rawSpeed < this.stillModeThreshhold ? 0 : rawSpeed;

//     // Still / moving timestamps (same as old)
//     if (this.speed > 0) {
//       this.lastMovingTime = null;
//     } else if (this.lastMovingTime === null) {
//       this.lastMovingTime = currentTime;
//     }

//     // Distance traveled (same as old)
//     this.leadDistanceTraveled += this.speed * dtFrames;

//     // isMoving (same as old)
//     this.isMoving = !this.isLeadStationary();
//   }

//   // Default dt assumes seconds mode.
//   update(path, dt = 1 / 60, currentTime = Date.now()) {
//     this.updateLeadPointSmooth(path, dt, currentTime);
//   }
// }
