/**
 * Expo LinearGradient Direction Reference
 * ========================================
 *
 * Coordinate System:
 *   (0, 0) = Top-Left
 *   (1, 0) = Top-Right
 *   (0, 1) = Bottom-Left
 *   (1, 1) = Bottom-Right
 *
 * Array format: [startX, startY, endX, endY]
 *
 * Direction Breakdown:
 * ┌─────────────────────────┬─────────────────┬─────────────────┬─────────────────────┐
 * │ Desired Direction       │ start           │ end             │ Array               │
 * ├─────────────────────────┼─────────────────┼─────────────────┼─────────────────────┤
 * │ Left → Right            │ {x:0, y:0.5}    │ {x:1, y:0.5}    │ [0, 0.5, 1, 0.5]    │
 * │ Right → Left            │ {x:1, y:0.5}    │ {x:0, y:0.5}    │ [1, 0.5, 0, 0.5]    │
 * │ Top → Bottom            │ {x:0.5, y:0}    │ {x:0.5, y:1}    │ [0.5, 0, 0.5, 1]    │
 * │ Bottom → Top            │ {x:0.5, y:1}    │ {x:0.5, y:0}    │ [0.5, 1, 0.5, 0]    │
 * │ Top-Left → Bottom-Right │ {x:0, y:0}      │ {x:1, y:1}      │ [0, 0, 1, 1]        │
 * │ Bottom-Right → Top-Left │ {x:1, y:1}      │ {x:0, y:0}      │ [1, 1, 0, 0]        │
 * │ Top-Right → Bottom-Left │ {x:1, y:0}      │ {x:0, y:1}      │ [1, 0, 0, 1]        │
 * │ Bottom-Left → Top-Right │ {x:0, y:1}      │ {x:1, y:0}      │ [0, 1, 1, 0]        │
 * └─────────────────────────┴─────────────────┴─────────────────┴─────────────────────┘
 */

const gradientDirections = {
  // Horizontal
  leftToRight: [0, 0.5, 1, 0.5],
  rightToLeft: [1, 0.5, 0, 0.5],

  // Vertical
  topToBottom: [0.5, 0, 0.5, 1],
  bottomToTop: [0.5, 1, 0.5, 0],

  // Diagonal (corner to corner)
  topLeftToBottomRight: [0, 0, 1, 1],
  bottomRightToTopLeft: [1, 1, 0, 0],
  topRightToBottomLeft: [1, 0, 0, 1],
  bottomLeftToTopRight: [0, 1, 1, 0],


  topLeftToTopRight: [0,0,1,0],
  bottomRightToBottomLeft:  [1, 1, 0, 1],
  topLeftToBottomLeft: [0,0,0,1]
};

export const screenGradients = {
    default: gradientDirections.bottomLeftToTopRight,
    welcome: gradientDirections.bottomLeftToTopRight

};

export default gradientDirections;
