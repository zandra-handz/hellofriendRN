//update this inside of animate to move

import { soul_oneshot_enter_right, soul_oneshot_enter_top, soul_oneshot_enter_top_inPlace,  soul_infinity } from "./utils";

export function _getPointOnCircle(centerPoint, angle, radiusScalar) {
  const x = centerPoint[0] + Math.cos(angle) * radiusScalar;
  const y = centerPoint[1] + Math.sin(angle) * radiusScalar;

  return [x, y];
}

export function _getStartAngleTop() {
  return Math.PI / 2;
}

// export default class Soul {
//   constructor(center = [0.5, 0.5], radius = 0.05, u_soul_prefix = "soul") {
//     this.center = center; //center
//     this.radius = radius; //distanceScalar
//     this.progress = _getStartAngleTop();
//     this.soul = [0.5, 0.5];
//     this.speed = 0.03;
//     this.u_soul_prefix = u_soul_prefix;
//     this.done = false;
//   }

//   update(dt = 1) {
//     if (this.done) return;

//     this.progress += this.speed * dt;

//     if (this.progress >= 1) {
//       this.progress = 1;
//       this.done = true;
//     }

//     // this.soul = _getPointOnCircle(this.center, this.progress, this.radius);
//     this.soul = soul_oneshot_enter_top(
//       this.center,
//       this.progress,
//       this.radius
//     );
//   }
// }


export default class DarkSoul {
  constructor(positions, dwellTimes, travelDurations = 30, radius = 0.05, onLoop = null) {
    this.positions = positions;
    this.dwellTimes = dwellTimes;
    // travelDurations: number (uniform) or array (per-segment, indexed by source position)
    this.travelDurations = travelDurations;
    this.radius = radius;
    // onLoop(self): fired when the sequence wraps back to index 0 — mutate positions in place here for re-randomization
    this.onLoop = onLoop;
    this.count = positions.length;
    this.index = 0;
    this.phase = 0; // 0 = dwell, 1 = travel
    this.elapsed = 0;
    this.soul = [positions[0][0], positions[0][1]];
    this.done = false;
  }

  update(dt = 1) {
    this.elapsed += dt;

    if (this.phase === 0) {
      const here = this.positions[this.index];
      this.soul[0] = here[0];
      this.soul[1] = here[1];
      if (this.elapsed >= this.dwellTimes[this.index]) {
        this.elapsed = 0;
        this.phase = 1;
      }
      return;
    }

    const nextIndex = (this.index + 1) % this.count;
    const a = this.positions[this.index];
    const b = this.positions[nextIndex];
    const dur = Array.isArray(this.travelDurations)
      ? this.travelDurations[this.index]
      : this.travelDurations;
    let t = dur <= 0 ? 1 : this.elapsed / dur;
    if (t >= 1) t = 1;
    this.soul[0] = a[0] + (b[0] - a[0]) * t;
    this.soul[1] = a[1] + (b[1] - a[1]) * t;
    if (t >= 1) {
      this.elapsed = 0;
      this.index = nextIndex;
      this.phase = 0;
      if (nextIndex === 0 && this.onLoop) {
        this.onLoop(this);
        // re-snap soul to the (possibly mutated) new entry so the next dwell starts clean
        this.soul[0] = this.positions[0][0];
        this.soul[1] = this.positions[0][1];
      }
    }
  }
}