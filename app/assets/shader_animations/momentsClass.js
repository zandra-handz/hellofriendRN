export default class Moments {
  constructor(moments = [], center = [0.5, 0.5], radius = 0.05) {
    this.moments = moments.map((m) => ({
      id: m.id,
      coord: new Float32Array(m.coord), // preallocate
      stored_index: m.stored_index,
    }));
    this.momentsLength = moments.length;

    this.selectedMomentIndex = -1;
    this.draggingMomentIndex = -1;

    this.center = center;
    this.radius = radius;
    this.radiusSquared = radius * radius;

    // Preallocated highlight coordinates
    // this.selected = { id: 0, coord: new Float32Array(2) };
    // this.lastSelected = { id: 0, coord: new Float32Array(2) };



    this.selected = { id: null, coord: new Float32Array([-100, -100]) };
this.lastSelected = { id: null, coord: new Float32Array([-100, -100]) };
this.lastSelectedCoord = [0.,0.];

    this.holding0 = { id: 0, coord: new Float32Array(2) }; 
this.holdings = [
  { id: null, coord: new Float32Array(2), stored_index: null },
  { id: null, coord: new Float32Array(2), stored_index: null },
  { id: null, coord: new Float32Array(2), stored_index: null },
  { id: null, coord: new Float32Array(2), stored_index: null },
];
    this.initializeHoldings();
  }
initializeHoldings() {
  for (let i = 0; i < this.moments.length; i++) {
    const moment = this.moments[i];
    if (
      moment.stored_index !== null &&
      moment.stored_index >= 0 &&
      moment.stored_index < 4
    ) {
      this.holdings[moment.stored_index].id = moment.id;
      this.holdings[moment.stored_index].stored_index = moment.stored_index;
    }
  }
  
  // Set empty holdings offscreen
  for (let i = 0; i < 4; i++) {
    if (this.holdings[i].id === null) {
      this.holdings[i].coord[0] = -100;
      this.holdings[i].coord[1] = -100;
    }
  }
}

  updateAllCoords(updatedData) {
    for (let i = 0; i < updatedData.length; i++) {
      const m = updatedData[i];
      this.moments[i].coord[0] = m.coord[0];
      this.moments[i].coord[1] = m.coord[1];
    }
    this.momentsLength = updatedData.length;
  }

clearHolding(holdIndex) {
  const holding = this.holdings[holdIndex];
  if (!holding.id) return;

  const moment = this.moments.find(m => m.id === holding.id);
  if (!moment) {
    console.log("no matching moment found");
    return;
  }
 
  moment.stored_index = null;
  

  // Move moment to lastSelected if valid, else center
  if (this.lastSelected.coord[0] !== -100 && this.lastSelected.coord[1] !== -100) {
    moment.coord[0] = this.lastSelected.coord[0];
    moment.coord[1] = this.lastSelected.coord[1];
  } else {
    moment.coord[0] = 0.5;
    moment.coord[1] = 0.5;
  }

  // Clear holding
  holding.id = null;
  holding.stored_index = null;
  holding.coord[0] = -100;
  holding.coord[1] = -100;

  return this.holdings;
}

updateHold(moment, holdIndex) {
  if (!moment || holdIndex < 0 || holdIndex >= 4) {
    return this.holdings;
  }
 
  if (currentHoldIndex === holdIndex) {
   
    return this.holdings;
  }

  const momentIndex = this.moments.findIndex(m => m.id === moment.id);
  if (momentIndex === -1) return this.holdings;

  const m = this.moments[momentIndex];
  const currentHoldIndex = m.stored_index;


  // If the moment is in a different holding, clear that old slot
  if (currentHoldIndex != null && currentHoldIndex !== holdIndex) {
    this.clearHolding(currentHoldIndex);
  }

  const targetHolding = this.holdings[holdIndex];

  // If the holding is occupied by a different moment, do nothing
  if (targetHolding.id != null && targetHolding.id !== moment.id) {
    return this.holdings;
  }

  // Assign the moment to this holding
  targetHolding.id = moment.id;
  targetHolding.stored_index = holdIndex;
  m.stored_index = holdIndex;

  // Update selection
  // this.updateSelected(holdIndex);

  return this.holdings;
}



updateSelected(holdIndex) { 
  if (holdIndex < 0 || holdIndex >= 4) return null;

  const holding = this.holdings[holdIndex];
  if (!holding.id) return null;

  const moment = this.moments.find(m => m.id === holding.id);
  if (!moment) return null;


    // Update selected to the moment in this holding
  this.selected.id = moment.id;
  this.selected.coord[0] = moment.coord[0];
  this.selected.coord[1] = moment.coord[1];

  // Move current selected to lastSelected
  // this.lastSelected.id = this.selected.id;
    this.lastSelected.id = moment.id;
  // this.lastSelected.coord[0] = this.selected.coord[0];
  // this.lastSelected.coord[1] = this.selected.coord[1];



  // Return the updated lastSelected object
  return { ...this.lastSelected };
}



// update(
  //   userPointer,
  //   isDragging,
  //   isMoving,
  //   altCoord,
  //   holding0Coord,
  //   holding1Coord,
  //   holding2Coord,
  //   holding3Coord,
  // ) {
  //   // console.log('MOMENTS UPDATING: ', userPointer, isDragging, isMoving, altCoord)

  //   const [ux, uy] = userPointer;

  //   if (!isDragging && !isMoving) {
  //     this.draggingMomentIndex = -1;
  //     this.selectedMomentIndex = -1;

  //     // Move highlight offscreen
  //     this.selected.coord[0] = -100;
  //     this.selected.coord[1] = -100;

  //     return;
  //   }

  //   if (this.draggingMomentIndex >= 0) {
  //     const coord = this.moments[this.draggingMomentIndex].coord;
  //     coord[0] = ux;
  //     coord[1] = uy;

  //     this.selectedMomentIndex = this.draggingMomentIndex;

  //     // Update highlight
  //     this.selected.coord[0] = ux;
  //     this.selected.coord[1] = uy;
  //     this.lastSelected.coord[0] = altCoord[0];
  //     this.lastSelected.coord[1] = altCoord[1];

  //     this.holding0.coord[0] = holding0Coord[0];
  //     this.holding0.coord[1] = holding0Coord[1];

  //     return;
  //   }
  //   let closestIndex = -1; 
  //   let closestDistSquared = Infinity; // start with no limit

 

  //   for (let i = 0; i < this.momentsLength; i++) {
  //     const dx = ux - this.moments[i].coord[0];
  //     const dy = uy - this.moments[i].coord[1];
  //     const distSquared = dx * dx + dy * dy;

  //     if (distSquared < closestDistSquared) {
  //       closestDistSquared = distSquared;
  //       closestIndex = i;
  //     }
  //   }

  //   if (closestIndex >= 0) {
  //     this.draggingMomentIndex = closestIndex;

  //     const coord = this.moments[closestIndex].coord;

  //     coord[0] = ux;
  //     coord[1] = uy;

  //     this.selectedMomentIndex = closestIndex;
  //     this.selectedMomentId = this.moments[closestIndex].id;

  //     this.selected.id = this.moments[closestIndex].id;
  //     this.lastSelected.id = this.moments[closestIndex].id;

  //     this.selected.coord[0] = coord[0];
  //     this.selected.coord[1] = coord[1];

  //     this.lastSelected.coord[0] = altCoord[0];
  //     this.lastSelected.coord[1] = altCoord[1];

  //     this.holding0.coord[0] = holding0Coord[0];
  //     this.holding0.coord[1] = holding0Coord[1];
  //   }
  // }

update(
  userPointer,
  isDragging,
  isMoving,
  altCoord,
  holdingCoords, // array of 4 coords
) {
  const [ux, uy] = userPointer;

  this.lastSelectedCoord[0] = altCoord[0];
  this.lastSelectedCoord[1] = altCoord[1];

  

  // Move moments that are in holdings offscreen
  for (let i = 0; i < 4; i++) {
    const holding = this.holdings[i];
    if (holding.id !== null) {
      // Keep the holding visible
      holding.coord[0] = holdingCoords[i][0];
      holding.coord[1] = holdingCoords[i][1];

      // Move the moment itself offscreen instead of following holding
      const moment = this.moments.find(m => m.id === holding.id);
      if (moment) {
        moment.coord[0] = -100;
        moment.coord[1] = -100;

        if (this.lastSelected.id === holding.id) {

          // console.log(`holding coord `,holding.coord)

          this.lastSelectedCoord[0] = holding.coord[0]
          this.lastSelectedCoord[1] = holding.coord[1]
          // console.log('set lastselected coords');

        } 
        // else {
        //          this.lastSelectedCoord[0] = altCoord[0]
        //   this.lastSelectedCoord[1] = altCoord[1]

        // }
       
      }
    } else {
      holding.coord[0] = -100;
      holding.coord[1] = -100;


    }
  }

  if (!isDragging && !isMoving) {
    this.draggingMomentIndex = -1;
    this.selectedMomentIndex = -1;
    this.selected.coord[0] = -100;
    this.selected.coord[1] = -100;
        this.lastSelected.coord[0] = this.lastSelectedCoord[0];
    this.lastSelected.coord[1] = this.lastSelectedCoord[1];

    return;
  }

  if (this.draggingMomentIndex >= 0) {
    const coord = this.moments[this.draggingMomentIndex].coord;
    coord[0] = ux;
    coord[1] = uy;

    this.selectedMomentIndex = this.draggingMomentIndex;
    this.selected.coord[0] = ux;
    this.selected.coord[1] = uy;
    this.lastSelected.coord[0] = this.lastSelectedCoord[0];
    this.lastSelected.coord[1] = this.lastSelectedCoord[1];

    return;
  }

  let closestIndex = -1;
  let closestDistSquared = Infinity;

  for (let i = 0; i < this.momentsLength; i++) {
    const dx = ux - this.moments[i].coord[0];
    const dy = uy - this.moments[i].coord[1];
    const distSquared = dx * dx + dy * dy;

    if (distSquared < closestDistSquared) {
      closestDistSquared = distSquared;
      closestIndex = i;
    }
  }

  if (closestIndex >= 0) {
    const coord = this.moments[closestIndex].coord;
    coord[0] = ux;
    coord[1] = uy;

    this.draggingMomentIndex = closestIndex;
    this.selectedMomentIndex = closestIndex;
    this.selectedMomentId = this.moments[closestIndex].id;

    this.selected.id = this.moments[closestIndex].id;
    this.lastSelected.id = this.moments[closestIndex].id;

    this.selected.coord[0] = coord[0];
    this.selected.coord[1] = coord[1];

    this.lastSelected.coord[0] = this.lastSelectedCoord[0];
    this.lastSelected.coord[1] = this.lastSelectedCoord[1];
  }
}

}
