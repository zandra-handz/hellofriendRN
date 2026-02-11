import { geckoToMoment_inPlace } from "./animUtils";

export default class Moments {
  constructor(
    moments = [],
    gecko_size = 1,
    sleepWalk0,
    center = [0.5, 0.5],
    radius = 0.05,
  ) {
    this.moments = moments.map((m) => ({
      id: m.id,
      coord: new Float32Array(m.coord), // preallocate
      stored_index: m.stored_index,
    }));
    this.gecko_size = gecko_size;
    this.sleepWalk0 = sleepWalk0;
    this.momentsLength = moments.length;
    this.aspect = null;
    this.momentIndexById = new Map();
    for (let i = 0; i < this.moments.length; i++) {
      this.momentIndexById.set(this.moments[i].id, i);
    }

    this.selectedMomentIndex = -1;
    this.draggingMomentIndex = -1;

    this.use_remote_paws_update = true;

    this.trigger_remote = false;

    this.lastAutoPickUpId = -1;
    this.lastHoldingIndex = -1;

    this.center = center;
    this.radius = radius;
    this.radiusSquared = radius * radius;

    this.selected = { id: null, coord: new Float32Array([-100, -100]) };
    this.lastSelected = { id: null, coord: new Float32Array([-100, -100]) };
    this.lastSelectedCoord = [0, 0];

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

  setAspect(aspect) {
    // console.log("SETTING ASPECT IN MOMENTS");
    this.aspect = aspect;
  }

  reset(momentsData = [], center = [0.5, 0.5], radius = 0.05) {
    // Reset core geometry
    this.center[0] = center[0];
    this.center[1] = center[1];
    this.radius = radius;
    this.radiusSquared = radius * radius;

    // Rebuild moments array (identity of Moments stays the same)
    this.moments = momentsData.map((m) => ({
      id: m.id,
      coord: new Float32Array(m.coord),
      stored_index: m.stored_index,
    }));

    this.momentsLength = this.moments.length;

    // Reset interaction state
    this.selectedMomentIndex = -1;
    this.draggingMomentIndex = -1;

    // Reset selection markers
    this.selected.id = null;
    this.selected.coord[0] = -100;
    this.selected.coord[1] = -100;

    this.lastSelected.id = null;
    this.lastSelected.coord[0] = -100;
    this.lastSelected.coord[1] = -100;

    this.lastSelectedCoord[0] = 0;
    this.lastSelectedCoord[1] = 0;

    // Reset holdings
    for (let i = 0; i < 4; i++) {
      this.holdings[i].id = null;
      this.holdings[i].stored_index = null;
      this.holdings[i].coord[0] = -100;
      this.holdings[i].coord[1] = -100;
    }

    // Re-apply stored_index → holding mapping
    this.initializeHoldings();
  }

  // updateAllCoords(updatedData) {
  //   for (let i = 0; i < updatedData.length; i++) {
  //     const m = updatedData[i];
  //     this.moments[i].coord[0] = m.coord[0];
  //     this.moments[i].coord[1] = m.coord[1];
  //   }
  //   this.momentsLength = updatedData.length;
  // }

  updateOrAddMoments(momentsData) {
    for (let i = 0; i < momentsData.length; i++) {
      const m = momentsData[i];

      // If the moment already exists, update it
      if (this.moments[i]) {
        // Ensure coord array exists
        if (!this.moments[i].coord)
          this.moments[i].coord = new Float32Array([0.5, 0.5]);

        this.moments[i].coord[0] =
          m.coord?.[0] ?? this.moments[i].coord[0] ?? 0.5;
        this.moments[i].coord[1] =
          m.coord?.[1] ?? this.moments[i].coord[1] ?? 0.5;

        // Keep ID and stored_index consistent
        this.moments[i].id = m.id ?? this.moments[i].id;
        this.moments[i].stored_index =
          m.stored_index ?? this.moments[i].stored_index;
      } else {
        // New moment → add it
        this.moments[i] = {
          id: m.id ?? null,
          stored_index: m.stored_index ?? i,
          coord: new Float32Array([m.coord?.[0] ?? 0.5, m.coord?.[1] ?? 0.5]),
        };
      }
    }

    // Update the length
    this.momentsLength = this.moments.length;
  }

  updateAllCoords(updatedData) {
    for (let i = 0; i < updatedData.length; i++) {
      const m = updatedData[i];

      // Default to 0.5 if coord or individual value is missing
      const x = m.coord?.[0] ?? 0.5;
      const y = m.coord?.[1] ?? 0.5;

      // Make sure the target moments[i].coord array exists
      if (!this.moments[i].coord) this.moments[i].coord = [];

      this.moments[i].coord[0] = x;
      this.moments[i].coord[1] = y;
    }

    this.momentsLength = updatedData.length;
  }

  clearHolding(holdIndex) {
    if (!this.aspect) {
      // console.log('NO ASPECT CANNOT CLEAR');
      return this.holdings;
    }

    const holding = this.holdings[holdIndex];
    if (!holding.id) return this.holdings;

    // const moment = this.moments.find((m) => m.id === holding.id);

    const idx = this.momentIndexById.get(holding.id);
    const moment = idx !== undefined ? this.moments[idx] : null;
    if (!moment) {
      // console.log("no matching moment found");
      return this.holdings;
    }

    moment.stored_index = null;

    // Debug what we're working with
    // console.log('holding.coord BEFORE conversion:', holding.coord);

    // 🔹 Convert Gecko space → Moment space
    geckoToMoment_inPlace(
      holding.coord, // input Gecko coord
      this.aspect,
      this.gecko_size,
      moment.coord, // write into moment.coord directly
      0,
    );

    //console.log('moment.coord AFTER conversion:', moment.coord);

    // Clear holding
    holding.id = null;
    holding.stored_index = null;
    holding.coord[0] = -100;
    holding.coord[1] = -100;

    return this.holdings;
  }

  // updateHold(moment, holdIndex) {
  //   if (!moment || holdIndex < 0 || holdIndex >= 4) {
  //     return this.holdings;
  //   }

  //   if (currentHoldIndex === holdIndex) {
  //     return this.holdings;
  //   }

  //   const momentIndex = this.moments.findIndex((m) => m.id === moment.id);
  //   if (momentIndex === -1) return this.holdings;

  //   const m = this.moments[momentIndex];
  //   const currentHoldIndex = m.stored_index;

  //   // If the moment is in a different holding, clear that old slot
  //   if (currentHoldIndex != null && currentHoldIndex !== holdIndex) {
  //     this.clearHolding(currentHoldIndex);
  //   }

  //   const targetHolding = this.holdings[holdIndex];

  //   // If the holding is occupied by a different moment, do nothing
  //   if (targetHolding.id != null && targetHolding.id !== moment.id) {
  //     return this.holdings;
  //   }

  //   // Assign the moment to this holding
  //   targetHolding.id = moment.id;
  //   targetHolding.stored_index = holdIndex;
  //   m.stored_index = holdIndex;
  //   // console.log("updated hold");
  //   return this.holdings;
  // }







  updateHold(moment, holdIndex) {
  if (!moment || holdIndex < 0 || holdIndex >= 4) {
    return this.holdings;
  }

  const momentIndex = this.moments.findIndex((m) => m.id === moment.id);
  if (momentIndex === -1) return this.holdings;

  const m = this.moments[momentIndex];
  const currentHoldIndex = m.stored_index;

  // Move this check AFTER defining currentHoldIndex
  if (currentHoldIndex === holdIndex) {
    return this.holdings;
  }

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
  console.log("updated hold");
  return this.holdings;
}


  clearAllHoldings() {
    if (!this.aspect) {
      return this.holdings;
    }

    console.log(
      this.sleepWalk0.current.auto_pick_up.current,
      this.sleepWalk0.current.paws_cleared_for_auto,
    );

    // ✅ Set the flag FIRST, before any early returns
    this.sleepWalk0.current.pawsCleared();
    if (this.trigger_remote) {
      this.trigger_remote = false;
    }
    console.log("momentsClass clearAllHoldings: paws cleared flag set");

    // Clear all 4 holdings
    for (let i = 0; i < 4; i++) {
      const holding = this.holdings[i];

      if (!holding.id) continue; // Skip empty holdings

      const idx = this.momentIndexById.get(holding.id);
      const moment = idx !== undefined ? this.moments[idx] : null;

      if (!moment) continue;

      // Clear the moment's stored_index
      moment.stored_index = null;

      // Convert Gecko space → Moment space
      geckoToMoment_inPlace(
        holding.coord,
        this.aspect,
        this.gecko_size,
        moment.coord,
        0,
      );

      // Clear the holding
      holding.id = null;
      holding.stored_index = null;
      holding.coord[0] = -100;
      holding.coord[1] = -100;
    }

    return this.holdings;
  }

  updateSelected(holdIndex) {
    if (holdIndex < 0 || holdIndex >= 4) return null;

    const holding = this.holdings[holdIndex];
    if (!holding.id) return null;

    const moment = this.moments.find((m) => m.id === holding.id);
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

  update(
    userPointer,
    isDragging,
    // isMoving,
    wasTap,
    // sleepWalk0,
    wasDoubleTap,
    altCoord,
    holdingCoords,
  ) {
    let ux = userPointer[0];
    let uy = userPointer[1];

    // console.log(
    //   this.sleepWalk0.current.auto_pick_up.current,
    //   this.sleepWalk0.current.paws_cleared_for_auto,
    // );
    //       console.log(`AUTO PICK UP MODE`,this.sleepWalk0.current.auto_pick_up.current)
    if (
      this.sleepWalk0.current.auto_pick_up.current &&
      !this.sleepWalk0.current.paws_cleared_for_auto
    ) {
      if (!this.use_remote_paws_update) {
        console.log("clear all holdings");
        this.clearAllHoldings();
      } else {
        this.trigger_remote = true;
      }
    }

    if (this.sleepWalk0.current.pickUpNextId !== this.lastAutoPickUpId) {
      const m = this.moments.find(
        (m) => m.id === this.sleepWalk0.current.pickUpNextId,
      );
      const h_index = (this.lastHoldingIndex + 1) % 4;

      if (m) {
        this.updateHold(m, h_index);
        this.lastHoldingIndex = h_index;

        this.lastAutoPickUpId = this.sleepWalk0.current.pickUpNextId;
      }
    }

    if (this.sleepWalk0.current.autoSelectCoord[0] !== -100) {
      ux = this.sleepWalk0.current.autoSelectCoord[0];
      uy = this.sleepWalk0.current.autoSelectCoord[1];
      this.lastSelected.id = this.sleepWalk0.current.autoSelectId;
      this.selected.id = -1;
      this.selected.coord[0] = -100;
      this.selected.coord[1] = -100;
      this.draggingMomentIndex = -1;
      this.selectedMomentIndex = -1;
    }

    // everything that will break out of auto
    if (isDragging || wasTap || wasDoubleTap) {
      // console.log('double tap')
      ux = userPointer[0];
      uy = userPointer[1];
      this.sleepWalk0.current.autoSelectCoord[0] = -100;
      this.sleepWalk0.current.autoSelectCoord[1] = -100;
      this.sleepWalk0.current.autoSelectId = -1;
    }

    // DESELECT NO MATTER WHERE ON SCREEN DOUBLE TAP IS
    if (wasDoubleTap && this.lastSelected.id !== -1) {
      // console.log(this.lastSelected.id)
      this.lastSelected.id = -1;
    }

    const fallbackLastSelectedCoord = altCoord;
    let lastSelectedIsHeld = false;

    // Move moments that are in holdings offscreen
    for (let i = 0; i < 4; i++) {
      const holding = this.holdings[i];
      if (holding.id !== null) {
        holding.coord[0] = holdingCoords[i][0];
        holding.coord[1] = holdingCoords[i][1];

        const moment = this.moments.find((m) => m.id === holding.id);
        if (moment) {
          moment.coord[0] = -100;
          moment.coord[1] = -100;

          if (this.lastSelected.id === holding.id) {
            lastSelectedIsHeld = true;
            this.lastSelected.coord[0] = holding.coord[0];
            this.lastSelected.coord[1] = holding.coord[1];
          } else {
          }
        }
      } else {
        holding.coord[0] = -100;
        holding.coord[1] = -100;
      }
    }

    if (!lastSelectedIsHeld) {
      this.lastSelectedCoord[0] = fallbackLastSelectedCoord[0];
      this.lastSelectedCoord[1] = fallbackLastSelectedCoord[1];
      // console.log(`set last selected`, this.lastSelectedCoord);
    }

    if (
      !isDragging &&
      //!isMoving &&
      this.sleepWalk0.current.autoSelectCoord[0] === -100
    ) {
      this.draggingMomentIndex = -1;
      this.selectedMomentIndex = -1;
      this.selected.coord[0] = -100;
      this.selected.coord[1] = -100;

      // console.log('last selected held? ', this.lastSelectedCoord)
      // this.lastSelected.coord[0] = this.lastSelectedCoord[0];
      // this.lastSelected.coord[1] = this.lastSelectedCoord[1];
      if (!lastSelectedIsHeld) {
        this.lastSelected.coord[0] = this.lastSelectedCoord[0];
        this.lastSelected.coord[1] = this.lastSelectedCoord[1];
      }

      return;
    }

    // if dragging
    if (
      this.draggingMomentIndex >= 0 &&
      this.sleepWalk0.current.autoSelectId === -1
    ) {
      // console.log(this.draggingMomentIndex)
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

    for (let i = 0; i < this.moments.length; i++) {
      const dx = ux - this.moments[i].coord[0];
      const dy = uy - this.moments[i].coord[1];
      const distSquared = dx * dx + dy * dy;

      // if (this.moments[i].id === sleepWalk0.current.autoSelectId) {
      //   console.log('FOUND MATCHING!')
      //   console.log(this.moments[i].id, this.moments[i].coord)
      //   console.log(sleepWalk0.current.autoSelectCoord)
      // }

      // console.log(`userpointer`, userPointer);
      // console.log(`coord`, ux, uy);

      if (distSquared < closestDistSquared) {
        closestDistSquared = distSquared;
        closestIndex = i;
      }
    }

    const SELECT_RADIUS = this.radius;
    const SELECT_RADIUS_SQ = SELECT_RADIUS * SELECT_RADIUS;

    if (closestDistSquared > SELECT_RADIUS_SQ) {
      // console.log('DESELECTIN')
      this.draggingMomentIndex = -1;
      this.selectedMomentIndex = -1;

      this.selected.id = -1;
      this.selected.coord[0] = -100;
      this.selected.coord[1] = -100;

      // ONLY snap back if lastSelected is NOT held
      if (!lastSelectedIsHeld) {
        // console.log('NOT HELD')
        this.lastSelected.id = -1;
        this.lastSelected.coord[0] = altCoord[0];
        this.lastSelected.coord[1] = altCoord[1];
      } else {
        //  console.log('HELD')
        // console.log('last selected held')
      }

      return;
    }

    // if (closestIndex >= 0 && (!lastSelectedIsHeld || wasTap || sleepWalk0.current.autoSelectCoord[0] !== -100)) {

    // DRAG MOMENT IF IT IS PRESSED ON AND NOT SPECIAL SELECTED
    if (closestIndex >= 0 && (!lastSelectedIsHeld || wasTap)) {
      const coord = this.moments[closestIndex].coord;
      coord[0] = ux;
      coord[1] = uy;

      this.draggingMomentIndex = closestIndex;
      this.selectedMomentIndex = closestIndex;
      this.selectedMomentId = this.moments[closestIndex].id;

      this.selected.id = this.moments[closestIndex].id;
      this.lastSelected.id = this.moments[closestIndex].id;

      // this will select the autoselect in advance
      // this.selected.coord[0] = coord[0];
      // this.selected.coord[1] = coord[1];

      if (lastSelectedIsHeld) {
        // this.lastSelected.coord[0] = this.lastSelectedCoord[0];
        // this.lastSelected.coord[1] = this.lastSelectedCoord[1];
      } else {
        this.lastSelected.coord[0] = this.lastSelectedCoord[0];
        this.lastSelected.coord[1] = this.lastSelectedCoord[1];
      }
    }
  }
}
