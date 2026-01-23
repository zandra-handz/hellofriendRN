 

export default class Mover {
  //time based update, updates every frame
  constructor(lead=[.0,.0], u_debug_lead_point_prefix = "debugLeadPoint") {
    this.lead =  lead;
    this.leadDistanceTraveled = 0;
    this.prevLead = [...this.lead];
    this.leadVelocity = [0, 0];

    this.defaultDampening = 6.4;
    this.defaultSpring = 20;

    this.dampening = 5.4; //6.4
    this.spring = 30; //2-
 this.lastMovingTime = null; 
    this.u_debug_lead_point_prefix = u_debug_lead_point_prefix;

    this.inputDistance = 0;

    this.isMoving = false;
    this.stillModeThreshhold = 0.00001; // how much sooner than vel setting to [0,0] do we set still mode
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

  // isLeadStationary() {
  //   const [vx, vy] = this.leadVelocity;
  //   return Math.sqrt(vx * vx + vy * vy) < this.stillModeThreshhold;
  // }


    isLeadStationary() {
    return this.speed < this.stillModeThreshhold;
  }

 

  updateLeadPointSmooth(path, dt = 1, currentTime = Date.now()) {
    const target = path;
    const pos = this.lead;

    const dx = target[0] - pos[0];
    const dy = target[1] - pos[1];
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Threshold for "close enough" to target
    const epsilon = 0.0001;

    if (dist < epsilon) {
      // Snap to target and reset velocity
      this.lead = [...target];
      this.leadVelocity[0] = 0;
      this.leadVelocity[1] = 0;
      this.isMoving = false;
      return;
    }

    this.leadVelocity[0] += dx * this.spring * dt;
    this.leadVelocity[1] += dy * this.spring * dt;

    this.leadVelocity[0] *= Math.exp(-this.dampening * dt);
    this.leadVelocity[1] *= Math.exp(-this.dampening * dt);

    const vx = this.leadVelocity[0];
    const vy = this.leadVelocity[1];
    // this.lead = [pos[0] + vx * dt, pos[1] + vy * dt];
    // in place
    this.lead[0] = pos[0] + vx*dt;
    this.lead[1] = pos[1] + vy*dt;

        this.speed = Math.sqrt(
      this.leadVelocity[0] * this.leadVelocity[0] +
      this.leadVelocity[1] * this.leadVelocity[1]
    );


    const rawSpeed = Math.sqrt(
  this.leadVelocity[0] ** 2 + this.leadVelocity[1] ** 2
);

// Snap small velocities to zero
this.speed = rawSpeed < this.stillModeThreshhold ? 0 : rawSpeed;

if (this.speed > 0) {
  // Creature is moving, reset timestamp
  this.lastMovingTime = null;
} else {
  // Creature is still, record the last time it had speed
  if (this.lastMovingTime === null) {
    this.lastMovingTime = currentTime;
  }
}

    const moved = this.speed * dt;
    this.leadDistanceTraveled += moved;

    this.isMoving = !this.isLeadStationary();

// older version before we had speed
    // const moved = Math.sqrt(vx * vx + vy * vy) * dt;
    // this.leadDistanceTraveled += moved;

    // this.isMoving = !this.isLeadStationary(); 
  }

  update(path) { 
    // use mouse.user_pointer or a soul

    // console.log(`PATH`, path);

    this.updateLeadPointSmooth(path);
  }
}
