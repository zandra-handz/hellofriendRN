import { geckoToMoment_inPlace } from "./animUtils";

export default class MirrorMoments {
  constructor(
    moments = [],
    gecko_size = 1,
    //   sleepWalk0,
    playMode = 1,
    center = [0.5, 0.5],
    radius = 0.05,
  ) {
    this.moments = moments.map((m) => ({
      id: m.id,
      coord: new Float32Array(m.coord),
      // stored_index: m.stored_index,
      guest_progress: m.guest_progress,
    }));
    this.gecko_size = gecko_size;
    this.playMode = playMode;
    //   this.sleepWalk0 = sleepWalk0;
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

    this.holdingsVersion = 0;

    this.center = center;
    this.radius = radius;
    this.radiusSquared = radius * radius;

    this.selected = { id: null, coord: new Float32Array([-100, -100]) };
    this.lastSelected = { id: null, coord: new Float32Array([-100, -100]) };
    this.lastSelectedCoord = [0, 0];

    this.newProgress = null;

    this.trigger_update_host_with_guest_progress = null;

    // this.holdings = [
    //   { id: null, coord: new Float32Array(2), stored_index: null },
    //   { id: null, coord: new Float32Array(2), stored_index: null },
    //   { id: null, coord: new Float32Array(2), stored_index: null },
    //   { id: null, coord: new Float32Array(2), stored_index: null },
    // ];

    // Tracks moment ids whose coord changed since last flushDirty().
    // Producer marks writes; the rAF loop consumes via flushDirty() before
    // sending the host broadcast so only changed moments go on the wire.
    // this.dirtyIds = new Set();

    // this.initializeHoldings();
  }

  // initializeHoldings() {
  //   for (let i = 0; i < this.moments.length; i++) {
  //     const moment = this.moments[i];
  //     if (
  //       moment.stored_index !== null &&
  //       moment.stored_index >= 0 &&
  //       moment.stored_index < 4
  //     ) {
  //       this.holdings[moment.stored_index].id = moment.id;
  //       this.holdings[moment.stored_index].stored_index = moment.stored_index;
  //     }
  //   }

  //   for (let i = 0; i < 4; i++) {
  //     if (this.holdings[i].id === null) {
  //       this.holdings[i].coord[0] = -100;
  //       this.holdings[i].coord[1] = -100;
  //     }
  //   }
  // }

  setAspect(aspect) {
    this.aspect = aspect;
  }

  reset(momentsData = [], center = [0.5, 0.5], radius = 0.05) {
    this.center[0] = center[0];
    this.center[1] = center[1];
    this.radius = radius;
    this.radiusSquared = radius * radius;

    this.moments = momentsData.map((m) => ({
      id: m.id,
      coord: new Float32Array(m.coord),
      stored_index: m.stored_index,
    }));

    this.momentsLength = this.moments.length;

    this.momentIndexById.clear();
    for (let i = 0; i < this.moments.length; i++) {
      this.momentIndexById.set(this.moments[i].id, i);
    }

    this.selectedMomentIndex = -1;
    this.draggingMomentIndex = -1;

    this.selected.id = null;
    this.selected.coord[0] = -100;
    this.selected.coord[1] = -100;

    this.lastSelected.id = null;
    this.lastSelected.coord[0] = -100;
    this.lastSelected.coord[1] = -100;

    this.lastSelectedCoord[0] = 0;
    this.lastSelectedCoord[1] = 0;

    this.lastTap = null;
    this.lastTapId = null;
    this.lastTapIndex = null;

    this.subsequentTapCount = 0;

    // for (let i = 0; i < 4; i++) {
    //   this.holdings[i].id = null;
    //   this.holdings[i].stored_index = null;
    //   this.holdings[i].coord[0] = -100;
    //   this.holdings[i].coord[1] = -100;
    // }

    // this.initializeHoldings();

    // Full rebuild → peer needs the whole set.
    //   this._markAllDirty();
  }
  initialLoad(momentsData = []) {
    this.moments = momentsData.map((m) => ({
      id: m.id,
      coord: new Float32Array(m.coord),
      // stored_index: m.stored_index ?? null,
      guest_progress: m.guest_progress ?? 0,
    }));

    this.momentsLength = this.moments.length;

    this.momentIndexById.clear();
    for (let i = 0; i < this.moments.length; i++) {
      this.momentIndexById.set(this.moments[i].id, i);
    }

    // for (let i = 0; i < 4; i++) {
    //   this.holdings[i].id = null;
    //   this.holdings[i].stored_index = null;
    //   this.holdings[i].coord[0] = -100;
    //   this.holdings[i].coord[1] = -100;
    // }

    // this.initializeHoldings();
  }
  updateOrAddMoments(momentsData) {
    for (let i = 0; i < momentsData.length; i++) {
      const m = momentsData[i];

      if (this.moments[i]) {
        if (!this.moments[i].coord)
          this.moments[i].coord = new Float32Array([0.5, 0.5]);

        const prevX = this.moments[i].coord[0];
        const prevY = this.moments[i].coord[1];

        this.moments[i].coord[0] =
          m.coord?.[0] ?? this.moments[i].coord[0] ?? 0.5;
        this.moments[i].coord[1] =
          m.coord?.[1] ?? this.moments[i].coord[1] ?? 0.5;

        this.moments[i].id = m.id ?? this.moments[i].id;

        // this.moments[i].stored_index =
        //   m.stored_index !== undefined
        //     ? m.stored_index
        //     : this.moments[i].stored_index;

        // if (
        //   prevX !== this.moments[i].coord[0] ||
        //   prevY !== this.moments[i].coord[1]
        // ) {
        //   this._markDirty(this.moments[i].id);
        // }
      } else {
        this.moments[i] = {
          id: m.id ?? null,
          // stored_index: m.stored_index ?? null,
          coord: new Float32Array([m.coord?.[0] ?? 0.5, m.coord?.[1] ?? 0.5]),
        };
        // this._markDirty(this.moments[i].id);
      }
    }

    this.momentsLength = this.moments.length;

    this.momentIndexById.clear();
    for (let i = 0; i < this.moments.length; i++) {
      this.momentIndexById.set(this.moments[i].id, i);
    }
  }

  updateAllCoords(updatedData) {
    for (let i = 0; i < updatedData.length; i++) {
      const m = updatedData[i];

      const x = m.coord?.[0] ?? 0.5;
      const y = m.coord?.[1] ?? 0.5;

      if (!this.moments[i].coord) this.moments[i].coord = new Float32Array(2);

      const prevX = this.moments[i].coord[0];
      const prevY = this.moments[i].coord[1];

      this.moments[i].coord[0] = x;
      this.moments[i].coord[1] = y;

      // if (prevX !== x || prevY !== y) {
      //   this._markDirty(this.moments[i].id);
      // }
    }

    this.momentsLength = updatedData.length;
  }

  // clearHolding(holdIndex) {
  //   if (!this.aspect) {
  //     return this.holdings;
  //   }

  //   const holding = this.holdings[holdIndex];
  //   if (!holding?.id) return this.holdings;

  //   const idx = this.momentIndexById.get(holding.id);
  //   const moment = idx !== undefined ? this.moments[idx] : null;

  //   if (!moment) {
  //     return this.holdings;
  //   }

  //   moment.stored_index = null;

  //   geckoToMoment_inPlace(
  //     holding.coord,
  //     this.aspect,
  //     this.gecko_size,
  //     moment.coord,
  //     0,
  //   );
  //   // this._markDirty(moment.id);

  //   holding.id = null;
  //   holding.stored_index = null;
  //   holding.coord[0] = -100;
  //   holding.coord[1] = -100;

  //   this.holdingsVersion++;

  //   return this.holdings;
  // }

  // updateHold(moment, holdIndex) {
  //   if (!moment || holdIndex < 0 || holdIndex >= 4) {
  //     return this.holdings;
  //   }

  //   const momentIndex = this.momentIndexById.get(moment.id);
  //   if (momentIndex === undefined) {
  //     console.warn(`Moment ${moment.id} not found in momentIndexById`);
  //     return this.holdings;
  //   }

  //   const m = this.moments[momentIndex];
  //   const currentHoldIndex = m.stored_index;

  //   if (currentHoldIndex === holdIndex) {
  //     return this.holdings;
  //   }

  //   for (let i = 0; i < this.moments.length; i++) {
  //     if (i !== momentIndex && this.moments[i].stored_index === holdIndex) {
  //       this.moments[i].stored_index = null;
  //     }
  //   }

  //   if (currentHoldIndex != null && currentHoldIndex !== holdIndex) {
  //     this.clearHolding(currentHoldIndex);
  //   }

  //   const targetHolding = this.holdings[holdIndex];

  //   if (targetHolding.id != null && targetHolding.id !== moment.id) {
  //     this.clearHolding(holdIndex);
  //   }

  //   targetHolding.id = moment.id;
  //   targetHolding.stored_index = holdIndex;
  //   m.stored_index = holdIndex;

  //   this.holdingsVersion++;
  //   return this.holdings;
  // }

  // clearAllHoldings() {
  //   if (!this.aspect) {
  //     return this.holdings;
  //   }

  // //   this.sleepWalk0.current.pawsCleared();
  //   if (this.trigger_remote) {
  //     this.trigger_remote = false;
  //   }

  //   for (let i = 0; i < this.moments.length; i++) {
  //     if (this.moments[i].stored_index !== null) {
  //       this.moments[i].stored_index = null;
  //     }
  //   }

  //   for (let i = 0; i < 4; i++) {
  //     const holding = this.holdings[i];

  //     if (holding.id) {
  //       const idx = this.momentIndexById.get(holding.id);
  //       const moment = idx !== undefined ? this.moments[idx] : null;

  //       if (moment) {
  //         geckoToMoment_inPlace(
  //           holding.coord,
  //           this.aspect,
  //           this.gecko_size,
  //           moment.coord,
  //           0,
  //         );
  //         // this._markDirty(moment.id);
  //       }
  //     }

  //     holding.id = null;
  //     holding.stored_index = null;
  //     holding.coord[0] = -100;
  //     holding.coord[1] = -100;
  //   }

  //   return this.holdings;
  // }

  // updateSelected(holdIndex) {
  //   if (holdIndex < 0 || holdIndex >= 4) return null;

  //   const holding = this.holdings[holdIndex];
  //   if (!holding.id) return null;

  //   const idx = this.momentIndexById.get(holding.id);
  //   const moment = idx !== undefined ? this.moments[idx] : null;

  //   if (!moment) return null;

  //   this.selected.id = moment.id;
  //   this.selected.coord[0] = moment.coord[0];
  //   this.selected.coord[1] = moment.coord[1];

  //   this.lastSelected.id = moment.id;

  //   return { ...this.lastSelected };
  // }

  update(
    userPointer,
    // isDragging,
    newTap,
    // wasDoubleTap,
    altCoord,
    // holdingCoords,
  ) {
    for (let i = 0; i < this.moments.length; i++) {
      // skip currently tapped moment so it doesn’t fight growth
      if (i === this.selectedMomentIndex) continue;

      this.moments[i].guest_progress *= 0.85; //  rapid decay

      if (this.moments[i].guest_progress < 0.5) {
        this.moments[i].guest_progress = 0;
      }
    }

    let ux = userPointer[0];
    let uy = userPointer[1];

    // console.log(newTap)

    if (!this.lastTap) {
      this.lastTap = performance.now();
    }

    //  console.log(this.selected)

    // if (wasDoubleTap && this.lastSelected.id !== -1) {
    //   this.lastSelected.id = -1;
    // }

    const fallbackLastSelectedCoord = altCoord;
    // let lastSelectedIsHeld = false;

    // if (!lastSelectedIsHeld) {
    this.lastSelectedCoord[0] = fallbackLastSelectedCoord[0];
    this.lastSelectedCoord[1] = fallbackLastSelectedCoord[1];

    let closestIndex = -1;
    let closestDistSquared = Infinity;

    for (let i = 0; i < this.moments.length; i++) {
      const dx = ux - this.moments[i].coord[0];
      const dy = uy - this.moments[i].coord[1];
      const distSquared = dx * dx + dy * dy;

      if (distSquared < closestDistSquared) {
        closestDistSquared = distSquared;
        closestIndex = i;
      }
    }

    const SELECT_RADIUS = this.radius;
    const SELECT_RADIUS_SQ = SELECT_RADIUS * SELECT_RADIUS;

    if (closestDistSquared > SELECT_RADIUS_SQ) {
      // console.log('deselecting...')

      this.draggingMomentIndex = -1;
      this.selectedMomentIndex = -1;

      this.selected.id = -1;
      this.selected.coord[0] = -100;
      this.selected.coord[1] = -100;

      // if (!lastSelectedIsHeld) {
      this.lastSelected.id = -1;
      this.lastSelected.coord[0] = altCoord[0];
      this.lastSelected.coord[1] = altCoord[1];
      // }

      return;
    }

    // if (closestIndex >= 0 && (!lastSelectedIsHeld || wasTap)) {
    if (closestIndex >= 0 && newTap) {
      const pickedMoment = this.moments[closestIndex];
      const coord = pickedMoment.coord;
      if (coord[0] !== ux || coord[1] !== uy) {
        coord[0] = ux;
        coord[1] = uy;
        // this._markDirty(pickedMoment.id);
      }

      this.draggingMomentIndex = closestIndex;
      this.selectedMomentIndex = closestIndex;
      this.selectedMomentId = pickedMoment.id;

      this.selected.id = pickedMoment.id;
      this.lastSelected.id = pickedMoment.id;

      // if (!lastSelectedIsHeld) {
      this.lastSelected.coord[0] = this.lastSelectedCoord[0];
      this.lastSelected.coord[1] = this.lastSelectedCoord[1];
      // }
      if (newTap && this.selected.id && this.selected.id != -1) {
        // CHECK IF NEW TAP EVENT ELSE DO NOTHING
        if (newTap != this.lastTap) {
          this.lastTap = newTap; // reset after use
          // CHECK IF THIS IS A DIFFERENT MOMENT WE ARE TAPPING ON

          if (this.lastTapIndex != closestIndex) {
            // DONT DELETE, BRING BACK IF NEEDED, JUST TRYING SOMETHING ELSE/ SLOW DECAY AT TOP OF THIS FUNCTION INSTEAD
            // if (this.lastTapIndex) {
            //   this.moments[this.lastTapIndex].guest_progress = 0;
            // }

            this.subsequentTapCount = 0;
          } else {
            this.subsequentTapCount += 1;
          }
          this.moments[closestIndex].guest_progress += 1;
          this.lastTapIndex = closestIndex; // reset after use
          this.lastTapId = this.moments[closestIndex].id; // reset after use
          // console.log(this.moments[closestIndex]);
          if (this.moments[closestIndex].guest_progress % 25 === 0) {
            // console.log('DIVISIBEL BY 10', this.moments[closestIndex].guest_progress)
            this.newProgress = this.moments[closestIndex].guest_progress;
            this.trigger_update_host_with_guest_progress = performance.now();
          }
        }
      }
    }
  }
}
