// import { _getDirVec } from "../../utils";



// export function makeLineOverACenter(centerPoint, extensionVector, length) {
//   const lineStartX = centerPoint[0] + extensionVector[0] * (length / 2);
//   const lineStartY = centerPoint[1] + extensionVector[1] * (length / 2);

//   const lineStart = [lineStartX, lineStartY];

//   const lineEndX = centerPoint[0] - extensionVector[0] * (length / 2);
//   const lineEndY = centerPoint[1] - extensionVector[1] * (length / 2);

//   const lineEnd = [lineEndX, lineEndY];
//   return [lineStart, lineEnd];
// }


// export function getIntersectionPoint(
//   aLine, bLine
// ) {
//   const x1 = aLine[0][0],
//     y1 = aLine[0][1];
//   const x2 = bLine[0][0],
//     y2 = bLine[0][1];

//   const dx1 = aLine[1][0] - x1;
//   const dy1 = aLine[1][1] - y1;
//   const dx2 = bLine[1][0] - x2;
//   const dy2 = bLine[1][1] - y2;

//   const denominator = dx1 * dy2 - dy1 * dx2;

//   if (denominator === 0) {
//     console.log("Lines are parallel, no intersection.");
//     return null;
//   }

//   const t = ((x2 - x1) * dy2 - (y2 - y1) * dx2) / denominator;
//   const intersectionX = x1 + t * dx1;
//   const intersectionY = y1 + t * dy1;

//   return [intersectionX, intersectionY]; // Return the position directly
// }



// export function getStartAndEndPoints(
//   centerPoint,
//   lineStartPoint,
//   lineEndPoint,
//   length
// ) {
//   const extensionVector = _getDirVec(lineEndPoint, lineStartPoint);

//   const startX = centerPoint[0] + (extensionVector[0] * length) / 2;
//   const startY = centerPoint[1] + (extensionVector[1] * length) / 2;
//   const startPoint = [startX, startY];

//   const endX = centerPoint[0] - (extensionVector[0] * length) / 2;
//   const endY = centerPoint[1] - (extensionVector[1] * length) / 2;
//   const endPoint = [endX, endY];

//   return [startPoint, endPoint];
// }




// export function intersectLines(
//   line1,
//   line1Angle,
//   line1DistanceApart,
//   line2,
//   line2Angle,
 
// ) {
//   //line 2 is chest angle data

//   const position = getIntersectionPoint(
//     line1, line2
//   );

//   const mirrored = _getMirrorAngleWithAngleRef(line1Angle, line2Angle);
//   const mirroredLine = makeLineFromAPoint(
//     [position[0], position[1]],
//     mirrored.direction,
//     0.24
//   );

//   const distFromSteps = _getDistanceScalar(position, line2[0]);
//   const mirroredStepsPoint = _makeDistancePoint(
//     [position[0], position[1]],
//     mirrored.direction,
//     distFromSteps
//   );

//   const transverseLine = _turnDirVec90ClockW(mirrored.direction);
//   const mirroredStepLine = makeLineOverACenter(
//     mirroredStepsPoint,
//     transverseLine,
//     line1DistanceApart,
//   );

//   //// experimental
//   const projectedStepsPoint = _makeDistancePoint(
//     [position[0], position[1]],
//     mirrored.direction,
//     distFromSteps
//   );

//   const projectedStepLine = makeLineOverACenter(
//     projectedStepsPoint,
//     transverseLine,
//     line1DistanceApart
//   );

//   // position.distFromSteps = distFromSteps;
//   // position.mirroredAngle = mirrored.angle;
//   // position.mirroredDistFromSteps = mirroredStepsPoint;
//   // position.mirroredLineStart = mirroredLine[0];
//   // position.mirroredLineEnd = mirroredLine[1];
//   // // position.chestAngleData = allFirstAngleData; // spineMotion.allFirstAngleData;
//   // position.mirroredStepsLineStart = mirroredStepLine[0];
//   // position.mirroredStepsLineEnd = mirroredStepLine[1];
//   // position.projectedStepsLineStart = projectedStepLine[0];
//   // position.projectedStepsLineEnd = projectedStepLine[1];


  
//   return { 
//     intersectionPoint: position,
//     sDistFromSteps: distFromSteps,
//     mSCenter: mirroredStepsPoint,
//     mSLine: mirroredLine,
//     mTLine: mirroredStepLine,
//     pTLine: projectedStepLine,
//     mSAngle: mirrored.angle,
//   }

 
// }