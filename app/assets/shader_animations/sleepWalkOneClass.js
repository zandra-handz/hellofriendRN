//update this inside of animate to move

// import {
//   soul_oneshot_enter_right,
//   soul_oneshot_enter_top,
//   soul_infinity,
//   soul_circle,
// } from "./utils"; 
import { toGeckoPointerScaled_inPlace } from "./animUtils";


export function _getPointOnCircle(centerPoint, angle, radiusScalar) {
  const x = centerPoint[0] + Math.cos(angle) * radiusScalar;
  const y = centerPoint[1] + Math.sin(angle) * radiusScalar;

  return [x, y];
}

export function _getStartAngleTop() {
  return Math.PI / 2;
}

export default class SleepWalk0 {
  constructor(center = [0.5, 0.5], radius = 2, gecko_size) {
    this.moments = [];

    this.aspect = null;
    this.gecko_size = gecko_size;

    this.center = center; //center
    this.radius = radius; //distanceScalar
    this.progress = _getStartAngleTop();
    this.soul = [0.5, 0.5];
    this.speed = 0.3;
    this.done = false;

    this.autoSelectCoord = [-100, -100];
    this.autoSelectId = -1;

    this.startPoint = this.center;

    this.walk = [0.5, 0.5];
    this.tick = 0; 

    this.currentIndex = 0;
    this.currentPos = [0, 0];

    this.autoTap = false;
  }

  setAspect(aspect) {
    // console.log("SETTING ASPECT IN SLEEPWALK");
    this.aspect = aspect;
  }

  setMoments(moments) {
    this.moments = moments;
  }

  updateCurrentPos(momentsRef, aspect, scale) {
    const moments = momentsRef.current.moments;
    if (!moments || moments.length === 0 || !aspect) return;

    let tries = 0;

    while (tries < moments.length) {
      const currentMoment = moments[this.currentIndex];

      if (currentMoment.coord[0] === -100) {
        this.currentIndex = (this.currentIndex + 1) % moments.length;
        tries++;
        continue;
      }

      this.autoSelectId = moments[this.currentIndex].id;

      //this.currentPos = moments[this.currentIndex].coord;

      // console.log(`sleepWalk`,moments[this.currentIndex].id)

      this.autoSelectCoord[0] = currentMoment.coord[0];
      this.autoSelectCoord[1] = currentMoment.coord[1];

      toGeckoPointerScaled_inPlace(
        currentMoment.coord,
        aspect,
        scale,
        this.gecko_size,
        this.currentPos,
        0,
      );

      // this.autoSelectCoord[0] = this.currentPos[0];
      // this.autoSelectCoord[1] = this.currentPos[1];

      // console.log(`CLASS: `, this.autoSelectCoord);
      // console.log(`CLASS ID :`, this.autoSelectId );
  

      // advance for next time
      this.currentIndex = (this.currentIndex + 1) % moments.length;
      return;
    }

    // If all moments are invalid, do nothing
  }

  updateBegin(pos) {
    this.startPoint = pos;
  }

  resetTick() {
    this.tick = 0;
  }

  // update(dt = 1) {
  //     console.log(this.moments);
  //     this.tick += 1;
  //     this.progress += this.speed * dt;

  //     // Wrap progress to keep it in [0, 2π]
  //     if (this.progress >= Math.PI * 2) {
  //         this.progress -= Math.PI * 2;
  //     }

  //     this.walk = soul_circle(
  //         this.center,
  //         this.progress,
  //         this.radius
  //     );
  // }

  update(momentsRef, scale) {
    // console.log(`autoselect`, this.autoSelectCoord)
    if (this.tick > 50) {
      this.tick = 0;
    }

    if (this.tick === 0) {
      this.updateCurrentPos(momentsRef, this.aspect, scale);
    }
// console.log(this.currentPos);
    this.tick += 1;
    this.walk = this.currentPos;
  }
}
