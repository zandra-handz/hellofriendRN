

// import { geckoToMoment_inPlace } from "./animUtils";

 
// export default class Moments {
//   constructor(
//     moments = [],
//     gecko_size = 1,
//     sleepWalk0,
//     center = [0.5, 0.5],
//     radius = 0.05,
//   ) {
//     this.moments = moments.map((m) => ({
//       id: m.id,
//       coord: new Float32Array(m.coord), // preallocate
//       stored_index: m.stored_index,
//     }));
//     this.gecko_size = gecko_size;
//     this.sleepWalk0 = sleepWalk0;
//     this.momentsLength = moments.length;
//     this.aspect = null;
//     this.momentIndexById = new Map();
//     for (let i = 0; i < this.moments.length; i++) {
//       this.momentIndexById.set(this.moments[i].id, i);
//     }

//     this.selectedMomentIndex = -1;
//     this.draggingMomentIndex = -1;

//     this.use_remote_paws_update = true;

//     this.trigger_remote = false;

//     this.lastAutoPickUpId = -1;
//     this.lastHoldingIndex = -1;

//     // ONLY HERE TO INCREMENT WHEN THIS CHANGES SO THAT ANIMATION UPDATES
//     this.holdingsVersion = 0;

//     this.center = center;
//     this.radius = radius;
//     this.radiusSquared = radius * radius;

//     this.selected = { id: null, coord: new Float32Array([-100, -100]) };
//     this.lastSelected = { id: null, coord: new Float32Array([-100, -100]) };
//     this.lastSelectedCoord = [0, 0];

//     this.holdings = [
//       { id: null, coord: new Float32Array(2), stored_index: null },
//       { id: null, coord: new Float32Array(2), stored_index: null },
//       { id: null, coord: new Float32Array(2), stored_index: null },
//       { id: null, coord: new Float32Array(2), stored_index: null },
//     ];
//     this.initializeHoldings();
//   }

//   initializeHoldings() {
//     for (let i = 0; i < this.moments.length; i++) {
//       const moment = this.moments[i];
//       if (
//         moment.stored_index !== null &&
//         moment.stored_index >= 0 &&
//         moment.stored_index < 4
//       ) {
//         this.holdings[moment.stored_index].id = moment.id;
//         this.holdings[moment.stored_index].stored_index = moment.stored_index;
//       }
//     }

//     // Set empty holdings offscreen
//     for (let i = 0; i < 4; i++) {
//       if (this.holdings[i].id === null) {
//         this.holdings[i].coord[0] = -100;
//         this.holdings[i].coord[1] = -100;
//       }
//     }
//   }

//   setAspect(aspect) {
//     this.aspect = aspect;
//   }

//   reset(momentsData = [], center = [0.5, 0.5], radius = 0.05) {
//     // Reset core geometry
//     this.center[0] = center[0];
//     this.center[1] = center[1];
//     this.radius = radius;
//     this.radiusSquared = radius * radius;

//     // Rebuild moments array (identity of Moments stays the same)
//     this.moments = momentsData.map((m) => ({
//       id: m.id,
//       coord: new Float32Array(m.coord),
//       stored_index: m.stored_index,
//     }));

//     this.momentsLength = this.moments.length;

//     // Rebuild index map
//     this.momentIndexById.clear();
//     for (let i = 0; i < this.moments.length; i++) {
//       this.momentIndexById.set(this.moments[i].id, i);
//     }

//     // Reset interaction state
//     this.selectedMomentIndex = -1;
//     this.draggingMomentIndex = -1;

//     // Reset selection markers
//     this.selected.id = null;
//     this.selected.coord[0] = -100;
//     this.selected.coord[1] = -100;

//     this.lastSelected.id = null;
//     this.lastSelected.coord[0] = -100;
//     this.lastSelected.coord[1] = -100;

//     this.lastSelectedCoord[0] = 0;
//     this.lastSelectedCoord[1] = 0;

//     // Reset holdings
//     for (let i = 0; i < 4; i++) {
//       this.holdings[i].id = null;
//       this.holdings[i].stored_index = null;
//       this.holdings[i].coord[0] = -100;
//       this.holdings[i].coord[1] = -100;
//     }

//     // Re-apply stored_index → holding mapping
//     this.initializeHoldings();
//   }

//   updateOrAddMoments(momentsData) {
//     for (let i = 0; i < momentsData.length; i++) {
//       const m = momentsData[i];

//       // If the moment already exists, update it
//       if (this.moments[i]) {
//         // Ensure coord array exists
//         if (!this.moments[i].coord)
//           this.moments[i].coord = new Float32Array([0.5, 0.5]);

//         this.moments[i].coord[0] =
//           m.coord?.[0] ?? this.moments[i].coord[0] ?? 0.5;
//         this.moments[i].coord[1] =
//           m.coord?.[1] ?? this.moments[i].coord[1] ?? 0.5;

//         // Keep ID consistent
//         this.moments[i].id = m.id ?? this.moments[i].id;
        
//         // ✅ Use the incoming stored_index if provided, otherwise keep existing
//         this.moments[i].stored_index = m.stored_index !== undefined 
//           ? m.stored_index 
//           : this.moments[i].stored_index;
//       } else {
//         // New moment → add it
//         this.moments[i] = {
//           id: m.id ?? null,
//           stored_index: m.stored_index ?? null, // Changed from i to null
//           coord: new Float32Array([m.coord?.[0] ?? 0.5, m.coord?.[1] ?? 0.5]),
//         };
//       }
//     }

//     // Update the length
//     this.momentsLength = this.moments.length;

//     // Rebuild the index map
//     this.momentIndexById.clear();
//     for (let i = 0; i < this.moments.length; i++) {
//       this.momentIndexById.set(this.moments[i].id, i);
//     }
//   }

//   updateAllCoords(updatedData) {
//     for (let i = 0; i < updatedData.length; i++) {
//       const m = updatedData[i];

//       // Default to 0.5 if coord or individual value is missing
//       const x = m.coord?.[0] ?? 0.5;
//       const y = m.coord?.[1] ?? 0.5;

//       // Make sure the target moments[i].coord array exists
//       if (!this.moments[i].coord) this.moments[i].coord = new Float32Array(2);

//       this.moments[i].coord[0] = x;
//       this.moments[i].coord[1] = y;
//     }

//     this.momentsLength = updatedData.length;
//   }

//   clearHolding(holdIndex) {
//     if (!this.aspect) {
//       return this.holdings;
//     }

//     const holding = this.holdings[holdIndex];
//     if (!holding?.id) return this.holdings;

//     const idx = this.momentIndexById.get(holding.id);
//     const moment = idx !== undefined ? this.moments[idx] : null;

//     if (!moment) {
//       return this.holdings;
//     }

//     moment.stored_index = null;

//     //   Convert Gecko space → Moment space
//     geckoToMoment_inPlace(
//       holding.coord, // input Gecko coord
//       this.aspect,
//       this.gecko_size,
//       moment.coord, // write into moment.coord directly
//       0,
//     );

//     // Clear holding
//     holding.id = null;
//     holding.stored_index = null;
//     holding.coord[0] = -100;
//     holding.coord[1] = -100;

//     // trigger to make animation update
//     this.holdingsVersion++;

//     return this.holdings;
//   }

//   updateHold(moment, holdIndex) {
//     if (!moment || holdIndex < 0 || holdIndex >= 4) {
//       return this.holdings;
//     }

//     const momentIndex = this.momentIndexById.get(moment.id);
//     if (momentIndex === undefined) {
//       console.warn(`Moment ${moment.id} not found in momentIndexById`);
//       return this.holdings;
//     }

//     const m = this.moments[momentIndex];
//     const currentHoldIndex = m.stored_index;

//     // Early return if already in the right slot
//     if (currentHoldIndex === holdIndex) {
//       return this.holdings;
//     }

//     // ✅ Clear any OTHER moment claiming this slot (but not the current moment)
//     for (let i = 0; i < this.moments.length; i++) {
//       if (i !== momentIndex && this.moments[i].stored_index === holdIndex) {
//         this.moments[i].stored_index = null;
//       }
//     }

//     // If the moment is in a different holding, clear that old slot
//     if (currentHoldIndex != null && currentHoldIndex !== holdIndex) {
//       this.clearHolding(currentHoldIndex);
//     }

//     const targetHolding = this.holdings[holdIndex];

//     // Clear whatever's in the target holding (if it's a different moment)
//     if (targetHolding.id != null && targetHolding.id !== moment.id) {
//       this.clearHolding(holdIndex);
//     }

//     // Assign the moment to this holding
//     targetHolding.id = moment.id;
//     targetHolding.stored_index = holdIndex;
//     m.stored_index = holdIndex;
     

//     // trigger to make animation update
//     this.holdingsVersion++;
//     return this.holdings;
//   }

//   clearAllHoldings() {
//     if (!this.aspect) {
//       return this.holdings;
//     }

//     this.sleepWalk0.current.pawsCleared();
//     if (this.trigger_remote) {
//       this.trigger_remote = false;
//     }

//     // Clear stored_index for ALL moments, not just held ones
//     for (let i = 0; i < this.moments.length; i++) {
//       if (this.moments[i].stored_index !== null) {
//         this.moments[i].stored_index = null;
//       }
//     }

//     // Clear all 4 holdings
//     for (let i = 0; i < 4; i++) {
//       const holding = this.holdings[i];
      
//       if (holding.id) {
//         const idx = this.momentIndexById.get(holding.id);
//         const moment = idx !== undefined ? this.moments[idx] : null;

//         if (moment) {
//           // Convert Gecko space → Moment space
//           geckoToMoment_inPlace(
//             holding.coord,
//             this.aspect,
//             this.gecko_size,
//             moment.coord,
//             0,
//           );
//         }
//       }

//       // Clear the holding
//       holding.id = null;
//       holding.stored_index = null;
//       holding.coord[0] = -100;
//       holding.coord[1] = -100;
//     }

//     return this.holdings;
//   }

//   updateSelected(holdIndex) {
//     if (holdIndex < 0 || holdIndex >= 4) return null;

//     const holding = this.holdings[holdIndex];
//     if (!holding.id) return null;

//     const idx = this.momentIndexById.get(holding.id);
//     const moment = idx !== undefined ? this.moments[idx] : null;
    
//     if (!moment) return null;

//     // Update selected to the moment in this holding
//     this.selected.id = moment.id;
//     this.selected.coord[0] = moment.coord[0];
//     this.selected.coord[1] = moment.coord[1];

//     // Move current selected to lastSelected
//     this.lastSelected.id = moment.id;

//     // Return the updated lastSelected object
//     return { ...this.lastSelected };
//   }

//   update(
//     userPointer,
//     isDragging,
//     wasTap,
//     wasDoubleTap,
//     altCoord,
//     holdingCoords,
//   ) {
//     let ux = userPointer[0];
//     let uy = userPointer[1];


// //     console.log(holdingCoords)
// //     if (!Number.isFinite(holdingCoords[0])) {
// //   console.error("Bad holdingCoords buffer", holdingCoords);
// // }
 

//     if (
//       this.sleepWalk0.current.auto_pick_up.current &&
//       !this.sleepWalk0.current.paws_cleared_for_auto
//     ) {
//       if (!this.use_remote_paws_update) {
//         console.log("clear all holdings");
//         this.clearAllHoldings();
//       } else {
//         this.trigger_remote = true;
//       }
//     }

//     if (this.sleepWalk0.current.pickUpNextId !== this.lastAutoPickUpId) {
//       const idx = this.momentIndexById.get(this.sleepWalk0.current.pickUpNextId);
//       const m = idx !== undefined ? this.moments[idx] : null;
      
//       // Find first free holding slot
//       let h_index = -1;
//       for (let i = 0; i < 4; i++) {
//         if (this.holdings[i].id === null) {
//           h_index = i;
//           break;
//         }
//       }
      
//       // Fallback to cycling if all full
//       if (h_index === -1) {
//         h_index = (this.lastHoldingIndex + 1) % 4;
//       }

//       if (m) {
//         this.updateHold(m, h_index);
//         this.lastHoldingIndex = h_index;
//         this.lastAutoPickUpId = this.sleepWalk0.current.pickUpNextId;
//       }
//     }

//     if (this.sleepWalk0.current.autoSelectCoord[0] !== -100) {
//       ux = this.sleepWalk0.current.autoSelectCoord[0];
//       uy = this.sleepWalk0.current.autoSelectCoord[1];
//       this.lastSelected.id = this.sleepWalk0.current.autoSelectId;
//       this.selected.id = -1;
//       this.selected.coord[0] = -100;
//       this.selected.coord[1] = -100;
//       this.draggingMomentIndex = -1;
//       this.selectedMomentIndex = -1;
//     }

//     // everything that will break out of auto
//     if (isDragging || wasTap || wasDoubleTap) {
//       ux = userPointer[0];
//       uy = userPointer[1];
//       this.sleepWalk0.current.autoSelectCoord[0] = -100;
//       this.sleepWalk0.current.autoSelectCoord[1] = -100;
//       this.sleepWalk0.current.autoSelectId = -1;
//     }

//     // DESELECT NO MATTER WHERE ON SCREEN DOUBLE TAP IS
//     if (wasDoubleTap && this.lastSelected.id !== -1) {
//       this.lastSelected.id = -1;
//     }

//     const fallbackLastSelectedCoord = altCoord;
//     let lastSelectedIsHeld = false;

//     // Move moments that are in holdings offscreen
//     for (let i = 0; i < 4; i++) {
//       const holding = this.holdings[i];
//       if (holding.id !== null) {
//         // holding.coord[0] = holdingCoords[i][0];
//         // holding.coord[1] = holdingCoords[i][1];

//         holding.coord[0] = holdingCoords[i * 2];
// holding.coord[1] = holdingCoords[i * 2 + 1];

//         const idx = this.momentIndexById.get(holding.id);
//         const moment = idx !== undefined ? this.moments[idx] : null;
        
//         if (moment) {
//           moment.coord[0] = -100;
//           moment.coord[1] = -100;

//           if (this.lastSelected.id === holding.id) {
//             lastSelectedIsHeld = true;
//             this.lastSelected.coord[0] = holding.coord[0];
//             this.lastSelected.coord[1] = holding.coord[1];
//           }
//         }
//       } else {
//         holding.coord[0] = -100;
//         holding.coord[1] = -100;
//       }
//     }

//     if (!lastSelectedIsHeld) {
//       this.lastSelectedCoord[0] = fallbackLastSelectedCoord[0];
//       this.lastSelectedCoord[1] = fallbackLastSelectedCoord[1];
//     }



    

//     if (
//       !isDragging &&
//       this.sleepWalk0.current.autoSelectCoord[0] === -100
//     ) {
//       this.draggingMomentIndex = -1;
//       this.selectedMomentIndex = -1;
//       this.selected.coord[0] = -100;
//       this.selected.coord[1] = -100;

//       if (!lastSelectedIsHeld) {
//         this.lastSelected.coord[0] = this.lastSelectedCoord[0];
//         this.lastSelected.coord[1] = this.lastSelectedCoord[1];
//      //   console.log('no last selected, setting to', this.lastSelectedCoord)
//       }

//       return;
//     }

//     // if dragging
//     if (
//       this.draggingMomentIndex >= 0 &&
//       this.sleepWalk0.current.autoSelectId === -1
//     ) {
//       const coord = this.moments[this.draggingMomentIndex].coord;
//       coord[0] = ux;
//       coord[1] = uy;

//       this.selectedMomentIndex = this.draggingMomentIndex;
//       this.selected.coord[0] = ux;
//       this.selected.coord[1] = uy;
//       this.lastSelected.coord[0] = this.lastSelectedCoord[0];
//       this.lastSelected.coord[1] = this.lastSelectedCoord[1];

//       return;
//     }

//     let closestIndex = -1;
//     let closestDistSquared = Infinity;

//     for (let i = 0; i < this.moments.length; i++) {
//       const dx = ux - this.moments[i].coord[0];
//       const dy = uy - this.moments[i].coord[1];
//       const distSquared = dx * dx + dy * dy;

//       if (distSquared < closestDistSquared) {
//         closestDistSquared = distSquared;
//         closestIndex = i;
//       }
//     }

//     const SELECT_RADIUS = this.radius;
//     const SELECT_RADIUS_SQ = SELECT_RADIUS * SELECT_RADIUS;

//     if (closestDistSquared > SELECT_RADIUS_SQ) {
//       this.draggingMomentIndex = -1;
//       this.selectedMomentIndex = -1;

//       this.selected.id = -1;
//       this.selected.coord[0] = -100;
//       this.selected.coord[1] = -100;

//       // ONLY snap back if lastSelected is NOT held
//       if (!lastSelectedIsHeld) {
//         this.lastSelected.id = -1;
//         this.lastSelected.coord[0] = altCoord[0];
//         this.lastSelected.coord[1] = altCoord[1];
//       }

//       return;
//     }

//     // DRAG MOMENT IF IT IS PRESSED ON AND NOT SPECIAL SELECTED
//     if (closestIndex >= 0 && (!lastSelectedIsHeld || wasTap)) {
//       const coord = this.moments[closestIndex].coord;
//       coord[0] = ux;
//       coord[1] = uy;

//       this.draggingMomentIndex = closestIndex;
//       this.selectedMomentIndex = closestIndex;
//       this.selectedMomentId = this.moments[closestIndex].id;

//       this.selected.id = this.moments[closestIndex].id;
//       this.lastSelected.id = this.moments[closestIndex].id;

//       if (!lastSelectedIsHeld) {
//         this.lastSelected.coord[0] = this.lastSelectedCoord[0];
//         this.lastSelected.coord[1] = this.lastSelectedCoord[1];
//       }
//     }
//   }
// }



                                                                                                                                                                                                                                          
  import { geckoToMoment_inPlace } from "./animUtils";                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
  export default class Moments {                                                                                                                                                                                                              constructor(                                                                                                                                                                                                                                moments = [],                                                                                                                                                                                                                             gecko_size = 1,                                                                                                                                                                                                                     
      sleepWalk0,
      center = [0.5, 0.5],
      radius = 0.05,
    ) {
      this.moments = moments.map((m) => ({
        id: m.id,
        coord: new Float32Array(m.coord),
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

      this.holdingsVersion = 0;

      this.center = center;
      this.radius = radius;
      this.radiusSquared = radius * radius;

      this.selected = { id: null, coord: new Float32Array([-100, -100]) };
      this.lastSelected = { id: null, coord: new Float32Array([-100, -100]) };
      this.lastSelectedCoord = [0, 0];

      this.holdings = [
        { id: null, coord: new Float32Array(2), stored_index: null },
        { id: null, coord: new Float32Array(2), stored_index: null },
        { id: null, coord: new Float32Array(2), stored_index: null },
        { id: null, coord: new Float32Array(2), stored_index: null },
      ];

      // Tracks moment ids whose coord changed since last flushDirty().
      // Producer marks writes; the rAF loop consumes via flushDirty() before
      // sending the host broadcast so only changed moments go on the wire.
      this.dirtyIds = new Set();

      this.initializeHoldings();

       // Peer needs the full initial state — first flushDirty() returns everything.
      this._markAllDirty();
    }

    _markDirty(id) {
      if (id != null) this.dirtyIds.add(id);
    }

    _markAllDirty() {
      this.dirtyIds.clear();
      for (let i = 0; i < this.moments.length; i++) {
        const id = this.moments[i].id;
        if (id != null) this.dirtyIds.add(id);
      }
    }

    // Called by the rAF loop. Returns [{id, coord:[x,y], stored_index}] for
    // only the changed moments, then clears the set.
    flushDirty() {
      if (this.dirtyIds.size === 0) return null;
      const out = [];
      for (const id of this.dirtyIds) {
        const idx = this.momentIndexById.get(id);
        if (idx === undefined) continue;
        const m = this.moments[idx];
        out.push({
          id: m.id,
          coord: [m.coord[0], m.coord[1]],
          stored_index: m.stored_index,
        });
      }
      this.dirtyIds.clear();
      return out;
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

      for (let i = 0; i < 4; i++) {
        if (this.holdings[i].id === null) {
          this.holdings[i].coord[0] = -100;
          this.holdings[i].coord[1] = -100;
        }
      }
    }

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

      for (let i = 0; i < 4; i++) {
        this.holdings[i].id = null;
        this.holdings[i].stored_index = null;
        this.holdings[i].coord[0] = -100;
        this.holdings[i].coord[1] = -100;
      }

      this.initializeHoldings();

      // Full rebuild → peer needs the whole set.
      this._markAllDirty();
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

          this.moments[i].stored_index =
            m.stored_index !== undefined
              ? m.stored_index
              : this.moments[i].stored_index;

          if (
            prevX !== this.moments[i].coord[0] ||
            prevY !== this.moments[i].coord[1]
          ) {
            this._markDirty(this.moments[i].id);
          }
        } else {
          this.moments[i] = {
            id: m.id ?? null,
            stored_index: m.stored_index ?? null,
            coord: new Float32Array([m.coord?.[0] ?? 0.5, m.coord?.[1] ?? 0.5]),
          };
          this._markDirty(this.moments[i].id);
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

        if (prevX !== x || prevY !== y) {
          this._markDirty(this.moments[i].id);
        }
      }

      this.momentsLength = updatedData.length;
    }

    clearHolding(holdIndex) {
      if (!this.aspect) {
        return this.holdings;
      }

      const holding = this.holdings[holdIndex];
      if (!holding?.id) return this.holdings;

      const idx = this.momentIndexById.get(holding.id);
      const moment = idx !== undefined ? this.moments[idx] : null;

      if (!moment) {
        return this.holdings;
      }

      moment.stored_index = null;

      geckoToMoment_inPlace(
        holding.coord,
        this.aspect,
        this.gecko_size,
        moment.coord,
        0,
      );
      this._markDirty(moment.id);

      holding.id = null;
      holding.stored_index = null;
      holding.coord[0] = -100;
      holding.coord[1] = -100;

      this.holdingsVersion++;

      return this.holdings;
    }

    updateHold(moment, holdIndex) {
      if (!moment || holdIndex < 0 || holdIndex >= 4) {
        return this.holdings;
      }

      const momentIndex = this.momentIndexById.get(moment.id);
      if (momentIndex === undefined) {
        console.warn(`Moment ${moment.id} not found in momentIndexById`);
        return this.holdings;
      }

      const m = this.moments[momentIndex];
      const currentHoldIndex = m.stored_index;

      if (currentHoldIndex === holdIndex) {
        return this.holdings;
      }

      for (let i = 0; i < this.moments.length; i++) {
        if (i !== momentIndex && this.moments[i].stored_index === holdIndex) {
          this.moments[i].stored_index = null;
        }
      }

      if (currentHoldIndex != null && currentHoldIndex !== holdIndex) {
        this.clearHolding(currentHoldIndex);
      }

      const targetHolding = this.holdings[holdIndex];

      if (targetHolding.id != null && targetHolding.id !== moment.id) {
        this.clearHolding(holdIndex);
      }

      targetHolding.id = moment.id;
      targetHolding.stored_index = holdIndex;
      m.stored_index = holdIndex;

      this.holdingsVersion++;
      return this.holdings;
    }

    clearAllHoldings() {
      if (!this.aspect) {
        return this.holdings;
      }

      this.sleepWalk0.current.pawsCleared();
      if (this.trigger_remote) {
        this.trigger_remote = false;
      }

      for (let i = 0; i < this.moments.length; i++) {
        if (this.moments[i].stored_index !== null) {
          this.moments[i].stored_index = null;
        }
      }

      for (let i = 0; i < 4; i++) {
        const holding = this.holdings[i];

        if (holding.id) {
          const idx = this.momentIndexById.get(holding.id);
          const moment = idx !== undefined ? this.moments[idx] : null;

          if (moment) {
            geckoToMoment_inPlace(
              holding.coord,
              this.aspect,
              this.gecko_size,
              moment.coord,
              0,
            );
            this._markDirty(moment.id);
          }
        }

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

      const idx = this.momentIndexById.get(holding.id);
      const moment = idx !== undefined ? this.moments[idx] : null;

      if (!moment) return null;

      this.selected.id = moment.id;
      this.selected.coord[0] = moment.coord[0];
      this.selected.coord[1] = moment.coord[1];

      this.lastSelected.id = moment.id;

      return { ...this.lastSelected };
    }

    update(
      userPointer,
      isDragging,
      wasTap,
      wasDoubleTap,
      altCoord,
      holdingCoords,
    ) {
      let ux = userPointer[0];
      let uy = userPointer[1];

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
        const idx = this.momentIndexById.get(this.sleepWalk0.current.pickUpNextId);
        const m = idx !== undefined ? this.moments[idx] : null;

        let h_index = -1;
        for (let i = 0; i < 4; i++) {
          if (this.holdings[i].id === null) {
            h_index = i;
            break;
          }
        }

        if (h_index === -1) {
          h_index = (this.lastHoldingIndex + 1) % 4;
        }

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

      if (isDragging || wasTap || wasDoubleTap) {
        ux = userPointer[0];
        uy = userPointer[1];
        this.sleepWalk0.current.autoSelectCoord[0] = -100;
        this.sleepWalk0.current.autoSelectCoord[1] = -100;
        this.sleepWalk0.current.autoSelectId = -1;
      }

      if (wasDoubleTap && this.lastSelected.id !== -1) {
        this.lastSelected.id = -1;
      }

      const fallbackLastSelectedCoord = altCoord;
      let lastSelectedIsHeld = false;

      for (let i = 0; i < 4; i++) {
        const holding = this.holdings[i];
        if (holding.id !== null) {
          holding.coord[0] = holdingCoords[i * 2];
          holding.coord[1] = holdingCoords[i * 2 + 1];

          const idx = this.momentIndexById.get(holding.id);
          const moment = idx !== undefined ? this.moments[idx] : null;

          if (moment) {
            if (moment.coord[0] !== -100 || moment.coord[1] !== -100) {
              this._markDirty(moment.id);
            }
            moment.coord[0] = -100;
            moment.coord[1] = -100;

            if (this.lastSelected.id === holding.id) {
              lastSelectedIsHeld = true;
              this.lastSelected.coord[0] = holding.coord[0];
              this.lastSelected.coord[1] = holding.coord[1];
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
      }

      if (
        !isDragging &&
        this.sleepWalk0.current.autoSelectCoord[0] === -100
      ) {
        this.draggingMomentIndex = -1;
        this.selectedMomentIndex = -1;
        this.selected.coord[0] = -100;
        this.selected.coord[1] = -100;

        if (!lastSelectedIsHeld) {
          this.lastSelected.coord[0] = this.lastSelectedCoord[0];
          this.lastSelected.coord[1] = this.lastSelectedCoord[1];
        }

        return;
      }

      if (
        this.draggingMomentIndex >= 0 &&
        this.sleepWalk0.current.autoSelectId === -1
      ) {
        const dragMoment = this.moments[this.draggingMomentIndex];
        const coord = dragMoment.coord;
        if (coord[0] !== ux || coord[1] !== uy) {
          coord[0] = ux;
          coord[1] = uy;
          this._markDirty(dragMoment.id);
        }

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

        if (distSquared < closestDistSquared) {
          closestDistSquared = distSquared;
          closestIndex = i;
        }
      }

      const SELECT_RADIUS = this.radius;
      const SELECT_RADIUS_SQ = SELECT_RADIUS * SELECT_RADIUS;

      if (closestDistSquared > SELECT_RADIUS_SQ) {
        this.draggingMomentIndex = -1;
        this.selectedMomentIndex = -1;

        this.selected.id = -1;
        this.selected.coord[0] = -100;
        this.selected.coord[1] = -100;

        if (!lastSelectedIsHeld) {
          this.lastSelected.id = -1;
          this.lastSelected.coord[0] = altCoord[0];
          this.lastSelected.coord[1] = altCoord[1];
        }

        return;
      }

      if (closestIndex >= 0 && (!lastSelectedIsHeld || wasTap)) {
        const pickedMoment = this.moments[closestIndex];
        const coord = pickedMoment.coord;
        if (coord[0] !== ux || coord[1] !== uy) {
          coord[0] = ux;
          coord[1] = uy;
          this._markDirty(pickedMoment.id);
        }

        this.draggingMomentIndex = closestIndex;
        this.selectedMomentIndex = closestIndex;
        this.selectedMomentId = pickedMoment.id;

        this.selected.id = pickedMoment.id;
        this.lastSelected.id = pickedMoment.id;

        if (!lastSelectedIsHeld) {
          this.lastSelected.coord[0] = this.lastSelectedCoord[0];
          this.lastSelected.coord[1] = this.lastSelectedCoord[1];
        }
      }
    }
  }

 