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
  constructor(center = [0.5, 0.5], radius = 2,  gecko_size, paused, change_speed_setting, auto_pick_up, randomMomentIds) {
   

    this.aspect = null;
    this.gecko_size = gecko_size;
  

    this.change_speed_setting = change_speed_setting;

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
    this.paused = paused;
    this.auto_pick_up = auto_pick_up;
    this.paws_cleared_for_auto = false;
    this.randomMomentIds = randomMomentIds;
    this.pickUpNextId = -1;
 
  }

  setAspect(aspect) {
    // console.log("SETTING ASPECT IN SLEEPWALK");
    this.aspect = aspect;
  }

  pawsCleared(){
    if (this.auto_pick_up.current && !this.paws_cleared_for_auto){
       console.log('cleared')
        this.paws_cleared_for_auto = true; 

    } 
  }
 
  resetPaws(){
    if (!this.auto_pick_up.current){
      this.paws_cleared_for_auto = false;
    }

  }

updateCurrentPos(momentsRef, aspect, scale) {
  const moments = momentsRef.current.moments;
  if (!moments || moments.length === 0 || !aspect) return;

  let tries = 0;

  while (tries < moments.length) {
    const currentMoment = moments[this.currentIndex];

    if (!currentMoment || !currentMoment.coord) {
      this.currentIndex = (this.currentIndex + 1) % moments.length;
      tries++;
      continue;
    }

    // Skip off-screen / held moments
    if (currentMoment.coord[0] === -100) {
      this.currentIndex = (this.currentIndex + 1) % moments.length;
      tries++;
      continue;
    }

    // Only assign pickUpNextId if the current moment is valid AND in randomMomentIds
    // if (
    //   this.auto_pick_up.current &&
    //   Array.isArray(this.randomMomentIds.current) &&
    //   this.randomMomentIds.current.includes(currentMoment.id)
    // ) {
    //   this.pickUpNextId = currentMoment.id;
    // }

    // Only assign pickUpNextId if the current moment is valid, in randomMomentIds, 
// AND is different from the last one we picked up
if (
  this.auto_pick_up.current &&
  Array.isArray(this.randomMomentIds.current) &&
  this.randomMomentIds.current.includes(currentMoment.id) &&
  this.pickUpNextId !== currentMoment.id // ← ADD THIS LINE
) {
  this.pickUpNextId = currentMoment.id;
}

    // Set the coordinates
    this.autoSelectId = currentMoment.id;
    this.autoSelectCoord[0] = currentMoment.coord[0];
    this.autoSelectCoord[1] = currentMoment.coord[1];

    // Scale pointer
    toGeckoPointerScaled_inPlace(
      currentMoment.coord,
      aspect,
      scale,
      this.gecko_size,
      this.currentPos,
      0,
    );

    this.currentIndex = (this.currentIndex + 1) % moments.length;
    return;
  }

  // All invalid → default off-screen
  this.autoSelectCoord[0] = .5;
  this.autoSelectCoord[1] = .5;
  this.currentPos[0] = .5;
  this.currentPos[1] = .5;
}




// updateCurrentPos(momentsRef, aspect, scale) {
//   const moments = momentsRef.current.moments;
//   if (!moments || moments.length === 0 || !aspect) return;

//   let tries = 0;

//   while (tries < moments.length) {
//     const currentMoment = moments[this.currentIndex];

//     // Check if currentMoment and coord exist
//     if (!currentMoment || !currentMoment.coord) {
//       this.currentIndex = (this.currentIndex + 1) % moments.length;
//       tries++;
//       continue;
//     }

//     if (currentMoment.coord[0] === -100) {
//       this.currentIndex = (this.currentIndex + 1) % moments.length;
//       tries++;
//       continue;
//     }

//     this.autoSelectId = currentMoment.id;
//     this.autoSelectCoord[0] = currentMoment.coord[0];
//     this.autoSelectCoord[1] = currentMoment.coord[1];

//     toGeckoPointerScaled_inPlace(
//       currentMoment.coord,
//       aspect,
//       scale,
//       this.gecko_size,
//       this.currentPos,
//       0,
//     );

//     this.currentIndex = (this.currentIndex + 1) % moments.length;
//     return;
//   }

//   // If all moments are invalid, default to off-screen
//   this.autoSelectCoord[0] = -100;
//   this.autoSelectCoord[1] = -100;
//   this.currentPos[0] = -100;
//   this.currentPos[1] = -100;
// }
 

  resetTick() {
    this.tick = 0;
  } 

 
  update(momentsRef, scale) { 


    //added this to clear it because couldn't figure out where else more local I wasn't setting it
 if (!this.auto_pick_up.current) {
  this.paws_cleared_for_auto = false;
 }
 

 
  
  if (!this.paused.current) {
    if (this.tick > this.change_speed_setting.current) {
      this.tick = 0;


    }

    if (this.tick === 0) {
      this.updateCurrentPos(momentsRef, this.aspect, scale);
    }
// console.log(this.currentPos);
 
    this.tick += 1;
       this.walk = this.currentPos;

 
    // this.walk = this.currentPos;
  }
}
}
