//update this inside of animate to move

 


export function _getPointOnCircle(centerPoint, angle, radiusScalar) {
  const x = centerPoint[0] + Math.cos(angle) * radiusScalar;
  const y = centerPoint[1] + Math.sin(angle) * radiusScalar;

  return [x,y];

}

  export function _getStartAngleTop(){
    return Math.PI/2;

  };


export default class Soul {
  constructor(  center = [0.5, 0.5], radius=.05, u_soul_prefix ="soul") {
 
    this.center = center; //center
    this.radius = radius; //distanceScalar
    this.progress = _getStartAngleTop();
    this.soul = [0.5, 0.5];
    this.speed = 0.03;
    this.u_soul_prefix = u_soul_prefix;
  
  } 

  update(dt = 1) {
    this.progress += this.speed * dt;
    this.soul = _getPointOnCircle(this.center, this.progress, this.radius);
 
  }
}
