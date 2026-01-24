

export default class Moments {
  constructor(moments = [], center = [0.5, 0.5], radius = 0.05) {
    this.moments = moments.map(m => ({
      id: m.id,
      coord: new Float32Array(m.coord), // preallocate
    }));
    this.momentsLength = moments.length;

    this.selectedMomentIndex = -1;
    this.draggingMomentIndex = -1;

    this.center = center;
    this.radius = radius;
    this.radiusSquared = radius * radius;

    // Preallocated highlight coordinates
    this.selected = { id: 0, coord: new Float32Array(2) };
    this.lastSelected = { id: 0, coord: new Float32Array(2) };
    this.holding0 = { id: 0, coord: new Float32Array(2) };
  }

  updateAllCoords(updatedData) {
    // update existing moments in place
    for (let i = 0; i < updatedData.length; i++) {
      const m = updatedData[i];
      this.moments[i].coord[0] = m.coord[0];
      this.moments[i].coord[1] = m.coord[1];
    }
    this.momentsLength = updatedData.length;
  }
 

  update(userPointer, isDragging, isMoving, altCoord, holding0Coord) {
    // console.log('MOMENTS UPDATING: ', userPointer, isDragging, isMoving, altCoord)
 
    const [ux, uy] = userPointer;

    if (!isDragging && !isMoving) {
      this.draggingMomentIndex = -1;
      this.selectedMomentIndex = -1;

      // Move highlight offscreen
      this.selected.coord[0] = -100;
      this.selected.coord[1] = -100;

      return;
    }

    // If already dragging a moment, update its coords directly
    if (this.draggingMomentIndex >= 0) {
      // console.log('already dragging', Date.now());
      const coord = this.moments[this.draggingMomentIndex].coord;
      coord[0] = ux;
      coord[1] = uy;
      // coord[0] = altCoord[0];
      // coord[1] = altCoord[1];

      this.selectedMomentIndex = this.draggingMomentIndex;

      // Update highlight
      this.selected.coord[0] = ux;
      this.selected.coord[1] = uy;
      // this.lastSelected.coord[0] = ux;
      // this.lastSelected.coord[1] = uy;
 
      // this.selected.coord[0] = altCoord[0];
      // this.selected.coord[1] = altCoord[1];
      this.lastSelected.coord[0] = altCoord[0];
      this.lastSelected.coord[1] = altCoord[1];

      this.holding0.coord[0] = holding0Coord[0];
      this.holding0.coord[1] = holding0Coord[1];


 
      return;
    } else {
      // console.log('not dragging', Date.now())
    }

    // Find the closest moment
    let closestIndex = -1;
    // let closestDistSquared = 0.5 * 0.5;
    let closestDistSquared = Infinity; // start with no limit

    // for (let i = 0; i < this.momentsLength; i++) {
    
    //   const dx = ux - this.moments[i].coord[0];
    //   const dy = uy - this.moments[i].coord[1];
    //   const distSquared = dx * dx + dy * dy;

    //   if (distSquared <= closestDistSquared) {
    //     closestDistSquared = distSquared;
    //     closestIndex = i;
    //   }
    // }


    for (let i = 0; i < this.momentsLength; i++) {
  const dx = ux - this.moments[i].coord[0];
  const dy = uy - this.moments[i].coord[1];
  const distSquared = dx * dx + dy * dy;

  if (distSquared < closestDistSquared) {
    closestDistSquared = distSquared;
    closestIndex = i;
  }
}


    // if (closestIndex >= 0) {
    //   this.draggingMomentIndex = closestIndex;

    //   const coord = this.moments[closestIndex].coord;
    //   coord[0] = ux;
    //   coord[1] = uy;

    //   this.selectedMomentIndex = closestIndex;
    //   this.selectedMomentId = this.moments[closestIndex].id;

    //   // Update highlights without allocating
    //   this.selected.coord[0] = ux;
    //   this.selected.coord[1] = uy;
    //   this.lastSelected.coord[0] = ux;
    //   this.lastSelected.coord[1] = uy;
    // } else {
    //   this.draggingMomentIndex = -1;
    //   this.selectedMomentIndex = -1;

    //   // Move highlights offscreen
    //   this.selected.coord[0] = -100;
    //   this.selected.coord[1] = -100;
    // }

    if (closestIndex >= 0) {
  this.draggingMomentIndex = closestIndex;

  const coord = this.moments[closestIndex].coord;
  // console.log('dragging: ', coord)
  coord[0] = ux;
  coord[1] = uy;
    // coord[0] = altCoord[0];
    // coord[1] = altCoord[1];




  this.selectedMomentIndex = closestIndex;
  this.selectedMomentId = this.moments[closestIndex].id;

  // Update highlights including the id
  this.selected.id = this.moments[closestIndex].id;
  this.lastSelected.id = this.moments[closestIndex].id;

  // this.selected.coord[0] = ux;
  // this.selected.coord[1] = uy;
  
  this.selected.coord[0] = coord[0];
  this.selected.coord[1] = coord[1];
  // this.lastSelected.coord[0] = ux;
  // this.lastSelected.coord[1] = uy;

    // this.selected.coord[0] = altCoord[0];
    // this.selected.coord[1] = altCoord[1];
    this.lastSelected.coord[0] = altCoord[0];
    this.lastSelected.coord[1] = altCoord[1];


      this.holding0.coord[0] = holding0Coord[0];
      this.holding0.coord[1] = holding0Coord[1];



}

  }
}
