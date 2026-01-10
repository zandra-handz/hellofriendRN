//update this inside of animate to move

import { soul_oneshot_enter_right, soul_oneshot_enter_top, soul_infinity } from "./utils";

export function _getPointOnCircle(centerPoint, angle, radiusScalar) {
  const x = centerPoint[0] + Math.cos(angle) * radiusScalar;
  const y = centerPoint[1] + Math.sin(angle) * radiusScalar;

  return [x, y];
}

export function _getStartAngleTop() {
  return Math.PI / 2;
}

export default class Soul {
  constructor(center = [0.5, 0.5], radius = 0.05, u_soul_prefix = "soul") {
    this.center = center; //center
    this.radius = radius; //distanceScalar
    this.progress = _getStartAngleTop();
    this.soul = [0.5, 0.5];
    this.speed = 0.03;
    this.u_soul_prefix = u_soul_prefix;
    this.done = false;
  }

  update(dt = 1) {
    if (this.done) return;

    this.progress += this.speed * dt;

    if (this.progress >= 1) {
      this.progress = 1;
      this.done = true;
    }

    // this.soul = _getPointOnCircle(this.center, this.progress, this.radius);
    this.soul = soul_oneshot_enter_top(
      this.center,
      this.progress,
      this.radius
    );
  }
}
