//update this inside of animate to move

import { soul_oneshot_enter_right, soul_oneshot_enter_top, soul_infinity, soul_circle } from "./utils";

export function _getPointOnCircle(centerPoint, angle, radiusScalar) {
  const x = centerPoint[0] + Math.cos(angle) * radiusScalar;
  const y = centerPoint[1] + Math.sin(angle) * radiusScalar;

  return [x, y];
}

export function _getStartAngleTop() {
  return Math.PI / 2;
}

export default class SleepWalk0 {
  constructor(center = [0.5, 0.5], radius = 2.) {
    this.center = center; //center
    this.radius = radius; //distanceScalar
    this.progress = _getStartAngleTop();
    this.soul = [0.5, 0.5];
    this.speed = 0.3;
    // this.u_sleep_walk_prefix = u_sleep_walk_prefix;
    this.done = false;
    this.selected = [0.,0.];

    this.startPoint = this.center;

    this.walk = [.5,.5];



  }

  updateBegin(pos){
    this.startPoint = pos;

  };

update(dt = 1) {
    this.progress += this.speed * dt;
    
    // Wrap progress to keep it in [0, 2π]
    if (this.progress >= Math.PI * 2) {
        this.progress -= Math.PI * 2;
    }
    
    this.walk = soul_circle(
        this.center,
        this.progress,
        this.radius
    );
}
}
