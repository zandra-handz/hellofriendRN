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
export default class Moments {
  constructor(moments = [], center = [0.5, 0.5], radius = 0.05) {
    this.moments = moments; // {id: , coord: [x, y]}
    this.momentsLength = moments.length;
    this.selectedMomentIndex = -1; // -1 means no selection
    this.center = center; 
    this.radius = radius; 
    this.radiusSquared = radius * radius; // precompute for efficiency
    this.draggingMomentIndex = -1; 
    this.selected = {id: 0, coord: [-100, -100]}
    this.lastSelected = {id: 0, coord: [-100, -100]}
  }

//   reset(moments) {
//     this.moments = moments;
//     this.momentsLength = moments.length;
//     this.selectedMomentIndex = -1;
//   }
update(userPointer, isDragging) {
   
  const [ux, uy] = userPointer;
 

  if (!isDragging) {
    // user released the screen -> disengage any drag
    // console.log('reset')
   
    this.draggingMomentIndex = -1;
    this.selectedMomentIndex = -1;
      this.selected = {id: 0, coord: [-100, -100]}
    return;
  }

  // If a moment is already being dragged, move it
  if (this.draggingMomentIndex !== undefined && this.draggingMomentIndex >= 0) {
   
    this.moments[this.draggingMomentIndex].coord = [userPointer[0], userPointer[1]];
    this.selectedMomentIndex = this.draggingMomentIndex; // for animation/highlighting
    return;
  }

  // Starting a new drag: find the closest moment under the pointer
  let closestIndex = -1;
//   let closestDistSquared = this.radius * this.radius;

  let closestDistSquared = .5 * .5;
//   console.log('PICKING NEW DOT', userPointer, this.selectedMomentIndex, this.draggingMomentIndex, closestIndex);

  for (let i = 0; i < this.momentsLength; i++) {
    const [mx, my] = this.moments[i].coord;
    const dx = ux - mx;
    const dy = uy - my;
    const distSquared = dx * dx + dy * dy;

    if (distSquared <= closestDistSquared) {
      closestDistSquared = distSquared;
      closestIndex = i;
    }
  }

  if (closestIndex >= 0) {
    // console.log(closestIndex)
    // start dragging this new moment
    this.draggingMomentIndex = closestIndex;
    this.moments[closestIndex].coord = userPointer;
    this.selected = this.moments[closestIndex];
    this.lastSelected =  this.moments[closestIndex];
    // console.log(`user pointer`,userPointer)
    // console.log(this.lastSelected.coord)
    this.selectedMomentIndex = closestIndex;
    this.selectedMomentId = this.moments[closestIndex].id;
    // console.log(this.selected, userPointer);
  } else {
    // pointer not over any moment -> don't drag
    this.draggingMomentIndex = -1;
    this.selectedMomentIndex = -1;
  }
}

}

