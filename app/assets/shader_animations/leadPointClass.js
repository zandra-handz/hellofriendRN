export function _getDirVec(start, end) {
  const x = end[0] - start[0];
  const y = end[1] - start[1];

  const lineLength = Math.sqrt(x * x + y * y);
  const dirX = x / lineLength;
  const dirY = y / lineLength;

  return [dirX, dirY];
}

export function _makeDistancePoint(pointA, dirVec, distScalar) {
  const x = pointA[0] + dirVec[0] * distScalar;
  const y = pointA[1] + dirVec[1] * distScalar;

  return [x, y];
}

export default class Mover {
  //time based update, updates every frame
  constructor(lead=[.0,.0], u_debug_lead_point_prefix = "debugLeadPoint") {
    this.lead =  lead;
    this.leadDistanceTraveled = 0;
    this.prevLead = [...this.lead];
    this.leadVelocity = [0, 0];

    this.defaultDampening = 6.4;
    this.defaultSpring = 20;

    this.dampening = 6.4;
    this.spring = 20;

    this.u_debug_lead_point_prefix = u_debug_lead_point_prefix;

    this.inputDistance = 0;

    this.isMoving = false;
    this.stillModeThreshhold = 0.00001; // how much sooner than vel setting to [0,0] do we set still mode
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
    const [vx, vy] = this.leadVelocity;
    return Math.sqrt(vx * vx + vy * vy) < this.stillModeThreshhold;
  }

  updateLeadPointSmooth(path, dt = 1) {
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
    this.lead = [pos[0] + vx * dt, pos[1] + vy * dt];

    const moved = Math.sqrt(vx * vx + vy * vy) * dt;
    this.leadDistanceTraveled += moved;

    this.isMoving = !this.isLeadStationary(); 
  }

  update(path) {
    // use mouse.user_pointer or a soul

    // console.log(`PATH`, path);

    this.updateLeadPointSmooth(path);
  }
}
