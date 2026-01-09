precision mediump float;


// DISTANCE FIELDS
//need sphere/dot product if want rounded edges
float tzb_lineSegmentSDF(vec2 uv, vec2 start, vec2 end, float r){
  float h = min(1., max(0., dot(uv-start, end-start)/dot(end-start, end-start) ));
  return length(uv-start-(end-start)*h)-r;

}


float tzb_sStep(float _width, float _offset, float _uvAxis){
  return smoothstep(_offset - _width, _width, _uvAxis) -
        smoothstep(_offset, _offset + _width, _uvAxis);
}


// a = shapeOne, b = shapeTwo, k = mixValue
// short variables here because I am still learning and this is easier to look at
float tzb_sMin(float a, float b, float k){
  float h = clamp(.5 + (.5*(b-a/k)), 0., 1. );
                      // creates parabolic curve
  return mix(b, a, h) - k*h*(1. - h);   // 1. - value inverts the value


}

vec3 tzb_sMinMask(float _tzb_sMin, vec3 _color){
  float mask = smoothstep(.0,.002, _tzb_sMin);
  return mask * _color;

}


//point on circle
vec2 tzb_jointCoords(float theta, float r){
  return vec2(cos(theta), sin(theta))*r;

;}
 
// most expensive, uses sqrt
// produces perfect circular distance
//  but more precise, good for interpolations
float tzb_circleTrueSDF(vec2 _uv, float r){
  return length(_uv) - r; // the distance minus the circle cut off
}

float distFCircle(vec2 uv, vec2 center, float radius) {
  return length(uv - center) - radius; 
}

// SmoothMin function
float smoothMin(float a, float b, float k) {
  float h = clamp(0.5 + (0.5 * (b - a) / k), 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
 

float lineSegmentSDF(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba)/dot(ba,ba), 0.0, 1.0);
    return length(pa - ba*h);
}

  
float tzb_circleDotP(vec2 uv, float r){
  return dot(uv,uv), r*r;
  
}

// This one needs larger circle nad inner circle size
// rather than thickness
// intentionaly because I think it'll be easier to map onto other things as a visual in RN 
float tzb_circleOutline(vec2 uv, float outerD, float innerD){
  return step(length(uv), outerD) - step(length(uv), innerD);
}



uniform vec2 u_resolution;
uniform float u_time; // This is now cumulativeTime from JavaScript
 

uniform vec2 soul;
 
uniform vec2 u_mouse;
uniform vec2 user_pointer;
uniform vec2 move_creature_to;
uniform vec2 debugLeadPoint;

uniform vec2 joint0; 
uniform vec2 joint1;
uniform vec2 joint2; 
uniform vec2 joint3;
uniform vec2 joint4;
uniform vec2 joint5;  
uniform vec2 joint6;  
uniform vec2 joint7;
uniform vec2 joint8;  
uniform vec2 joint9; 
uniform vec2 joint10; 
uniform vec2 joint11;
uniform vec2 joint12; 
uniform vec2 joint13;
uniform vec2 joint14; 
uniform vec2 spineCenter;
uniform vec2 spineIntersection;

uniform vec2 spineUnchained0;
uniform vec2 spineUnchained1;



uniform vec2 debugSpine0;
uniform vec2 debugSpine1;
uniform vec2 debugSpine2;  // flank0
uniform vec2 debugSpine3;  // flank1
uniform vec2 debugSpine4;  // intersectionFlank0
uniform vec2 debugSpine5;  // intersectionFlank1

uniform vec2 debugMotionGlobal0;
uniform vec2 debugMotionGlobal1;
uniform vec2 debugMotionGlobal2;
uniform vec2 debugMotionGlobal3;
uniform vec2 debugMotionGlobal4;
uniform vec2 debugMotionGlobal5;

// line between mirrored steps, not ready yet
uniform vec2 debugMotionGlobal6;
uniform vec2 debugMotionGlobal7; 
uniform vec2 debugMotionGlobal8;

// uniform vec2 debugSpineMotion0;
// uniform vec2 debugSpineMotion1;
// uniform vec2 debugSpineMotion2;
// uniform vec2 debugSpineMotion3;

 

uniform vec2 debugTailMotion0;
uniform vec2 debugTailMotion1; 



 
uniform vec2 anchorFront0;
uniform vec2 anchorFront1;
uniform vec2 anchorBack0;
uniform vec2 anchorBack1;

uniform vec2 stepTarget0;
uniform vec2 stepTarget1;
uniform vec2 stepTarget2;
uniform vec2 stepTarget3;


uniform vec2 desired0; 
uniform vec2 desired1;
uniform vec2 desired2; 
uniform vec2 desired3;


uniform vec2 desiredExtra0; 
uniform vec2 desiredExtra1;
uniform vec2 desiredExtra2; 
uniform vec2 desiredExtra3;
 
uniform vec2 foot0;
uniform vec2 foot1;
uniform vec2 foot2;
uniform vec2 foot3;


uniform vec2 fingerBack00;
uniform vec2 fingerBack01;
uniform vec2 fingerBack02;
uniform vec2 fingerBack03;
uniform vec2 fingerBack04;
 
uniform vec2 fingerBack10;
uniform vec2 fingerBack11;
uniform vec2 fingerBack12;
uniform vec2 fingerBack13;
uniform vec2 fingerBack14;


uniform vec2 fingerFront00;
uniform vec2 fingerFront01;
uniform vec2 fingerFront02;
uniform vec2 fingerFront03;
uniform vec2 fingerFront04;

uniform vec2 fingerFront10;
uniform vec2 fingerFront11;
uniform vec2 fingerFront12;
uniform vec2 fingerFront13;
uniform vec2 fingerFront14;


 
uniform vec2 elbow0;
uniform vec2 elbow1;
uniform vec2 elbow2;
uniform vec2 elbow3;

uniform vec2 musclesFront0;
uniform vec2 musclesFront1;
uniform vec2 musclesFront2;
uniform vec2 musclesFront3;

uniform vec2 musclesBack0;
uniform vec2 musclesBack1;
uniform vec2 musclesBack2;
uniform vec2 musclesBack3;



uniform vec2 tail0;
uniform vec2 tail1;
uniform vec2 tail2;
uniform vec2 tail3;
uniform vec2 tail4;
uniform vec2 tail5;
uniform vec2 tail6;
// Added
uniform vec2 tail7;
uniform vec2 tail8;
uniform vec2 tail9;
uniform vec2 tail10;
uniform vec2 tail11;
uniform vec2 tail12;
uniform vec2 tail13;

uniform float radius0;
uniform float radius1;
uniform float radius2;
uniform float radius3;
uniform float radius4;
uniform float radius5;
uniform float radius6;

 
 
// uniform float size_scalar;
vec3 darkColor         = vec3(0.298, 0.686, 0.314);
vec3 lightColor        = vec3(0.627, 0.945, 0.263);
vec3 headColor       = vec3(0.2627, 0.3294, 0.9451);
vec3 joint1Color  = vec3(0.9451, 0.2627, 0.2627);
vec3 joint2Color  = vec3(0.9686, 0.9569, 0.1294);
vec3 stepTargetColor  = vec3(0.2627, 0.9451, 0.9333);
vec3 footColor  = vec3(0.2235, 0.9961, 0.3373);
vec3 elbowColor  = vec3(0.9961, 0.8157, 0.2235);
vec3 armColor = vec3(0.3, 0.8, 0.4);
vec3 shoulderColor = vec3(0.8863, 0.1961, 0.8863);
vec3 tailColor = darkColor;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv.x += uv.x/u_resolution.x;
   // uv -= 0.5;

    uv.y = 1. - uv.y;

    vec2 uMouse = joint0.xy/u_resolution;
   // uMouse -= vec2(.5);

    vec2 s = soul;
    vec2 j  = user_pointer; 
    vec2 dLP = debugLeadPoint;

    vec2 j1 = joint1;
    vec2 j2 = joint2;
    vec2 j0 = joint0;
    vec2 j3 = joint3;
    vec2 j4 = joint4;
    vec2 j5 = joint5;
    vec2 j6 = joint6;
    vec2 j7 = joint7;
    vec2 j8 = joint8;
    vec2 j9 = joint9;
    vec2 j10 = joint10;
    vec2 j11 = joint11;
    vec2 j12 = joint12;
    vec2 j13 = joint13;
    vec2 j14 = joint14; 
    vec2 sC = spineCenter;
    vec2 sI = spineIntersection;

    vec2 dSC0 = debugSpine0;
    vec2 dSC1 = debugSpine1;
    vec2 dSC2 = debugSpine2; //flank
    vec2 dSC3 = debugSpine3; //flank
    vec2 dSC4 = debugSpine4; //intersectionFlank
    vec2 dSC5 = debugSpine5; //intersectionFlank



    // vec2 dS0 = debugSpineMotion0;
    // vec2 dS1 = debugSpineMotion1;
    // vec2 dS2 = debugSpineMotion2;
    // vec2 dS3 = debugSpineMotion3;

    vec2 dMG0 = debugMotionGlobal0;
    vec2 dMG1 = debugMotionGlobal1;
    vec2 dMG2 = debugMotionGlobal2;
    vec2 dMG3 = debugMotionGlobal3;
    // mirrored
    vec2 dMG4 = debugMotionGlobal4;
    vec2 dMG5 = debugMotionGlobal5; 
    vec2 dMG6 = debugMotionGlobal6;
    vec2 dMG7 = debugMotionGlobal7;
    // mirrored step center
    vec2 dMG8 = debugMotionGlobal8; 


    vec2 snout = spineUnchained0;
    vec2 head = spineUnchained1;
 

    vec2 dT0 = debugTailMotion0;
    vec2 dT1 = debugTailMotion1;
 

    vec2 sT0 = stepTarget0;
    vec2 sT1 = stepTarget1;
    vec2 sT2 = stepTarget2;
    vec2 sT3 = stepTarget3;

    vec2 d0 = desired0;
    vec2 d1 = desired1;
    vec2 d2 = desired2;
    vec2 d3 = desired3;
 

    vec2 dE0 = desiredExtra0;
    vec2 dE1 = desiredExtra1;
    vec2 dE2 = desiredExtra2;
    vec2 dE3 = desiredExtra3;

    vec2 f0 = foot0;
    vec2 f1 = foot1;
    vec2 f2 = foot2;
    vec2 f3 = foot3;

 
    vec2 fgB00 = fingerBack00;
    vec2 fgB01 = fingerBack01;
    vec2 fgB02 = fingerBack02;
    vec2 fgB03 = fingerBack03;
    vec2 fgB04 = fingerBack04;

    
    vec2 fgB10 = fingerBack10;
    vec2 fgB11 = fingerBack11;
    vec2 fgB12 = fingerBack12;
    vec2 fgB13 = fingerBack13;
    vec2 fgB14 = fingerBack14;


    vec2 fgF00 = fingerFront00;
    vec2 fgF01 = fingerFront01;
    vec2 fgF02 = fingerFront02;
    vec2 fgF03 = fingerFront03;
    vec2 fgF04 = fingerFront04;

    vec2 fgF10 = fingerFront10;
    vec2 fgF11 = fingerFront11;
    vec2 fgF12 = fingerFront12;
    vec2 fgF13 = fingerFront13;
    vec2 fgF14 = fingerFront14;

    vec2 mF0 = musclesFront0;
    vec2 mF1 = musclesFront1;
    vec2 mF2 = musclesFront2;
    vec2 mF3 = musclesFront3;

    vec2 mB0 = musclesBack0;
    vec2 mB1 = musclesBack1;
    vec2 mB2 = musclesBack2;
    vec2 mB3 = musclesBack3;

 
    vec2 e0 = elbow0;
    vec2 e1 = elbow1;
    vec2 e2 = elbow2;
    vec2 e3 = elbow3;

    vec2 t0 = tail0;
    vec2 t1 = tail1;
    vec2 t2 = tail2;
    vec2 t3 = tail3;
    vec2 t4 = tail4;
    vec2 t5 = tail5;
    vec2 t6 = tail6;
    vec2 t7 = tail7;
    vec2 t8 = tail8;
    vec2 t9 = tail9;
    vec2 t10 = tail10;
    vec2 t11 = tail11;
    vec2 t12 = tail12;
    vec2 t13 = tail13;

    vec2 m = uMouse;

    vec2 aF0 = anchorFront0;
    vec2 aF1 = anchorFront1;
    vec2 aB0 = anchorBack0;
    vec2 aB1 = anchorBack1;
  
    float base = 0.005;
    float speed = 3.0; // Don't multiply by wave_speed_mult here anymore
    
  
    float r2 = base;
    float r3 = base - .02;

    float circleSizeDiv = 7.; 
    float smallerDiv = 26.; 
    float evenSmallerDiv = 32.;
    
    
    float circleSize = .02;



 
    vec3 lead = step(distance(uv, dLP), .04) * stepTargetColor; 

    vec3 soul_dot =  step(distance(uv, s), .008) * stepTargetColor; 
  

////////// SPINE & TAIL //////////////////////////////////////////////////////

    // Using for spine and tail
    float blendAmt = .054; 
    
    // Circle calculations using distFCircle
    // float circle0 = distFCircle(uv, j0, .05 / circleSizeDiv);
    float circle0 = distFCircle(uv,  snout, .03 / circleSizeDiv);
    float circle1 = distFCircle(uv, head, .19 / circleSizeDiv);
    float circle1b = distFCircle(uv, j1, .0 / circleSizeDiv); //ZERPED PIT RN
    float circle2 = distFCircle(uv, j2, .01 / circleSizeDiv);
    float circle3 = distFCircle(uv, j3, .04 / circleSizeDiv);
    float circle4 = distFCircle(uv, j4, .04 / circleSizeDiv);
    float circle5 = distFCircle(uv, j5, .04 / circleSizeDiv);
    float circle6 = distFCircle(uv, j6, .04 / circleSizeDiv);
    float circle7 = distFCircle(uv, j7, .03 / circleSizeDiv); // REMOVED FOR NOW
    float circle8 = distFCircle(uv, j8, .03 / circleSizeDiv);
    float circle9 = distFCircle(uv, j9, .03 / circleSizeDiv);
    float circle10 = distFCircle(uv, j10, .03 / circleSizeDiv);
    float circle11 = distFCircle(uv, j11, .03 / circleSizeDiv);
    float circle12 = distFCircle(uv, j12, .02 / circleSizeDiv);
    float circle13 = distFCircle(uv, j13, .02 / circleSizeDiv);
    float circle14 = distFCircle(uv, j14, .02 / circleSizeDiv);
    float circleMerge = smoothMin(
      smoothMin(circle0, circle1, 0.03),
      smoothMin(circle1b, circle2, 0.05),
      0.005
    );

    circleMerge = smoothMin(circleMerge, circle3,blendAmt);
    circleMerge = smoothMin(circleMerge, circle4,blendAmt);
    circleMerge = smoothMin(circleMerge, circle5, blendAmt);
    circleMerge = smoothMin(circleMerge, circle6,blendAmt);
    circleMerge = smoothMin(circleMerge, circle7, blendAmt); // REMOVED FOR NOW
    circleMerge = smoothMin(circleMerge, circle8, blendAmt);
    circleMerge = smoothMin(circleMerge, circle9, blendAmt);
    // circleMerge = smoothMin(circleMerge, circle10, blendAmt);
    circleMerge = smoothMin(circleMerge, circle11, .02);
    //circleMerge = smoothMin(circleMerge, circle12, blendAmt);
    circleMerge = smoothMin(circleMerge, circle13, .02);

    // Apply the mask to control transparency
    float mask = smoothstep(0.0, 0.002, -circleMerge);

    // Final color based on the mask
    vec3 spine = lightColor * mask;  // Using circle2Color or any other color you'd like


    // float tailCircle0  = distFCircle(uv, t0,  .02 / circleSizeDiv);
    // float tailCircle1  = distFCircle(uv, t1,  .05 / circleSizeDiv);
    // float tailCircle2  = distFCircle(uv, t2,  .04 / circleSizeDiv);
    // float tailCircle3  = distFCircle(uv, t3,  .04 / circleSizeDiv);
    // float tailCircle4  = distFCircle(uv, t4,  .04 / circleSizeDiv);
    // float tailCircle5  = distFCircle(uv, t5,  .03 / circleSizeDiv);
    // float tailCircle6  = distFCircle(uv, t6,  .03 / circleSizeDiv);
    // float tailCircle7  = distFCircle(uv, t7,  .03 / circleSizeDiv);
    // float tailCircle8  = distFCircle(uv, t8,  .02 / circleSizeDiv);
    // float tailCircle9  = distFCircle(uv, t9,  .02 / circleSizeDiv);
    // float tailCircle10 = distFCircle(uv, t10, .02 / circleSizeDiv);
    // float tailCircle11 = distFCircle(uv, t11, .001 / circleSizeDiv);
    // float tailCircle12 = distFCircle(uv, t12, .001 / circleSizeDiv);

float tailCircle0  = distFCircle(uv, t0,  .02  / circleSizeDiv);
float tailCircle1  = distFCircle(uv, t1,  .05 / circleSizeDiv);
float tailCircle2  = distFCircle(uv, t2,  .04 / circleSizeDiv);
float tailCircle3  = distFCircle(uv, t3,  .042 / circleSizeDiv);
float tailCircle4  = distFCircle(uv, t4,  .05 / circleSizeDiv);
float tailCircle5  = distFCircle(uv, t5,  .05 / circleSizeDiv);
float tailCircle6  = distFCircle(uv, t6,  .05 / circleSizeDiv);
float tailCircle7  = distFCircle(uv, t7,  .04 / circleSizeDiv);
float tailCircle8  = distFCircle(uv, t8,  .027 / circleSizeDiv);
float tailCircle9  = distFCircle(uv, t9,  .02 / circleSizeDiv);
float tailCircle10 = distFCircle(uv, t10, .01 / circleSizeDiv);
float tailCircle11 = distFCircle(uv, t11, .001 / circleSizeDiv);
float tailCircle12 = distFCircle(uv, t12, .001 / circleSizeDiv);

    float tailCircleMerge = smoothMin(
      smoothMin(tailCircle0, tailCircle1, 0.03),
      smoothMin(tailCircle2, tailCircle3, 0.05),
      0.005
    );
 

    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle4,  blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle5,  blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle6,  blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle7,  blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle8,  blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle9,  blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle10, blendAmt);
     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle11, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle12, blendAmt);


    float spineTailBlend = 0.03;

    // Unified body SDF
    float bodySDF = smoothMin(circleMerge, tailCircleMerge, spineTailBlend);



    // float tailMask = smoothstep(.0,.002, -tailCircleMerge);
    // vec3 tail = lightColor * tailMask;
    



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  

  float armThickness = 0.006; 
  float backArmThicnkess = .007;
  float arm0Upper = lineSegmentSDF(uv, j2, e0);   
  float arm0Lower = lineSegmentSDF(uv, e0, sT0); 
  float arm1Upper = lineSegmentSDF(uv, j2, e1);   
  float arm1Lower = lineSegmentSDF(uv, e1, sT1); 
  float arm2Upper = lineSegmentSDF(uv, j13, e2);   
  float arm2Lower = lineSegmentSDF(uv, e2, sT2); 
  float arm3Upper = lineSegmentSDF(uv, j13, e3);   
  float arm3Lower = lineSegmentSDF(uv, e3, sT3); 

  //   float arm0Upper = lineSegmentSDF(uv, aF0, e0);   
  // float arm0Lower = lineSegmentSDF(uv, e0, sT0); 
  // float arm1Upper = lineSegmentSDF(uv, aF1, e1);   
  // float arm1Lower = lineSegmentSDF(uv, e1, sT1); 
  // float arm2Upper = lineSegmentSDF(uv, aB0, e2);   
  // float arm2Lower = lineSegmentSDF(uv, e2, sT2); 
  // float arm3Upper = lineSegmentSDF(uv, aB1, e3);   
  // float arm3Lower = lineSegmentSDF(uv, e3, sT3); 
  

float arm0SDF = min(arm0Upper, arm0Lower) - armThickness;
float arm1SDF = min(arm1Upper, arm1Lower) - armThickness;
float arm2SDF = min(arm2Upper, arm2Lower) - backArmThicnkess;
float arm3SDF = min(arm3Upper, arm3Lower) - backArmThicnkess;


float shoulderBlend = 0.01;
bodySDF = smoothMin(bodySDF, arm0SDF, shoulderBlend);
bodySDF = smoothMin(bodySDF, arm1SDF, shoulderBlend);
bodySDF = smoothMin(bodySDF, arm2SDF, shoulderBlend);
bodySDF = smoothMin(bodySDF, arm3SDF, shoulderBlend);

float fingerRadius = 0.002;
float fingerBlend = 0.012;   
float fingerLineBlend = .0025;
float fingerThickness = 0.0025; 

float stepRadius = .009;
float stepSDF0 = distFCircle(uv, sT0, stepRadius);
float stepSDF1 = distFCircle(uv, sT1, stepRadius);
float stepSDF2 = distFCircle(uv, sT2, stepRadius);
float stepSDF3 = distFCircle(uv, sT3, stepRadius);

float stepBlend = 0.007;
bodySDF = smoothMin(bodySDF, stepSDF0, stepBlend);
bodySDF = smoothMin(bodySDF, stepSDF1, stepBlend);
bodySDF = smoothMin(bodySDF, stepSDF2, stepBlend);
bodySDF = smoothMin(bodySDF, stepSDF3, stepBlend);

float lowerMuscleRadius = .001;

float upperMuscleRadius = 0.005; // or whatever radius you want
float muscleBlend = 0.024;   

float backUpperMuscleRadius = .006;
float backMuscleBlend = .03;

float musclesFrontSDF0 = distFCircle(uv, mF0, lowerMuscleRadius);
float musclesFrontSDF1  = distFCircle(uv, mF1, upperMuscleRadius );
float musclesFrontSDF2 = distFCircle(uv, mF2, lowerMuscleRadius);
float musclesFrontSDF3  = distFCircle(uv, mF3, upperMuscleRadius );

// bodySDF = smoothMin(bodySDF, musclesFrontSDF0 , muscleBlend );
bodySDF = smoothMin(bodySDF, musclesFrontSDF1 , muscleBlend );
// bodySDF = smoothMin(bodySDF, musclesFrontSDF2 , muscleBlend );
bodySDF = smoothMin(bodySDF, musclesFrontSDF3 , muscleBlend ); 


float musclesBackSDF0 = distFCircle(uv, mB0, lowerMuscleRadius);
float musclesBackSDF1  = distFCircle(uv, mB1,backUpperMuscleRadius );
float musclesBackSDF2 = distFCircle(uv, mB2, lowerMuscleRadius);
float musclesBackSDF3  = distFCircle(uv, mB3, backUpperMuscleRadius );

// bodySDF = smoothMin(bodySDF, musclesBackSDF0 , muscleBlend );
bodySDF = smoothMin(bodySDF, musclesBackSDF1 , backMuscleBlend);
// bodySDF = smoothMin(bodySDF, musclesBackSDF2 , muscleBlend );
bodySDF = smoothMin(bodySDF, musclesBackSDF3 , backMuscleBlend); 



float fingerSDF0 = distFCircle(uv, fgB00, fingerRadius);
float fingerSDF1 = distFCircle(uv, fgB01, fingerRadius);
float fingerSDF2 = distFCircle(uv, fgB02, fingerRadius);
float fingerSDF3 = distFCircle(uv, fgB03, fingerRadius);
float fingerSDF4 = distFCircle(uv, fgB04, fingerRadius); 

float fingerSDF5 = distFCircle(uv, fgB10, fingerRadius);
float fingerSDF6 = distFCircle(uv, fgB11, fingerRadius);
float fingerSDF7 = distFCircle(uv, fgB12, fingerRadius);
float fingerSDF8 = distFCircle(uv, fgB13, fingerRadius);
float fingerSDF9 = distFCircle(uv, fgB14, fingerRadius); 






float fingerLine0 = lineSegmentSDF(uv, fgB00, stepTarget2)  - fingerThickness;
float fingerLine1 = lineSegmentSDF(uv, fgB01, stepTarget2)  - fingerThickness;
float fingerLine2 = lineSegmentSDF(uv, fgB02, stepTarget2)  - fingerThickness;
float fingerLine3 = lineSegmentSDF(uv, fgB03, stepTarget2)  - fingerThickness;
float fingerLine4 = lineSegmentSDF(uv, fgB04, stepTarget2)  - fingerThickness;

float fingerLine5 = lineSegmentSDF(uv, fgB10, stepTarget3)  - fingerThickness;
float fingerLine6 = lineSegmentSDF(uv, fgB11, stepTarget3)  - fingerThickness;
float fingerLine7 = lineSegmentSDF(uv, fgB12, stepTarget3) - fingerThickness;
float fingerLine8 = lineSegmentSDF(uv, fgB13, stepTarget3) - fingerThickness;
float fingerLine9 = lineSegmentSDF(uv, fgB14, stepTarget3) - fingerThickness;






 
float fingerSDF10 = distFCircle(uv, fgF00, fingerRadius) ;
float fingerSDF11 = distFCircle(uv, fgF01, fingerRadius);
float fingerSDF12 = distFCircle(uv, fgF02, fingerRadius);
float fingerSDF13 = distFCircle(uv, fgF03, fingerRadius);
float fingerSDF14 = distFCircle(uv, fgF04, fingerRadius);

float fingerSDF15 = distFCircle(uv, fgF10, fingerRadius);
float fingerSDF16 = distFCircle(uv, fgF11, fingerRadius);
float fingerSDF17 = distFCircle(uv, fgF12, fingerRadius);
float fingerSDF18 = distFCircle(uv, fgF13, fingerRadius);
float fingerSDF19 = distFCircle(uv, fgF14, fingerRadius);


float fingerLine10 = lineSegmentSDF(uv, fgF00, stepTarget0) - fingerThickness;
float fingerLine11 = lineSegmentSDF(uv, fgF01, stepTarget0) - fingerThickness;
float fingerLine12 = lineSegmentSDF(uv, fgF02, stepTarget0) - fingerThickness;
float fingerLine13 = lineSegmentSDF(uv, fgF03, stepTarget0) - fingerThickness;
float fingerLine14 = lineSegmentSDF(uv, fgF04, stepTarget0) - fingerThickness;

float fingerLine15 = lineSegmentSDF(uv, fgF10, stepTarget1) - fingerThickness;
float fingerLine16 = lineSegmentSDF(uv, fgF11, stepTarget1) - fingerThickness;
float fingerLine17 = lineSegmentSDF(uv, fgF12, stepTarget1) - fingerThickness;
float fingerLine18 = lineSegmentSDF(uv, fgF13, stepTarget1) - fingerThickness;
float fingerLine19 = lineSegmentSDF(uv, fgF14, stepTarget1) - fingerThickness;


// back left finger lines
bodySDF = smoothMin(bodySDF, fingerLine0, fingerLineBlend );
bodySDF = smoothMin(bodySDF, fingerLine1,fingerLineBlend );
bodySDF = smoothMin(bodySDF, fingerLine2, fingerLineBlend );
bodySDF = smoothMin(bodySDF, fingerLine3, fingerLineBlend );
bodySDF = smoothMin(bodySDF, fingerLine4, fingerLineBlend);
// back right
bodySDF = smoothMin(bodySDF, fingerLine5, fingerLineBlend );
bodySDF = smoothMin(bodySDF, fingerLine6, fingerLineBlend );
bodySDF = smoothMin(bodySDF, fingerLine7, fingerLineBlend );
bodySDF = smoothMin(bodySDF, fingerLine8, fingerLineBlend );
bodySDF = smoothMin(bodySDF, fingerLine9, fingerLineBlend);
// front left
bodySDF = smoothMin(bodySDF, fingerLine10, fingerLineBlend );
bodySDF = smoothMin(bodySDF, fingerLine11, fingerLineBlend );
bodySDF = smoothMin(bodySDF, fingerLine12, fingerLineBlend );
bodySDF = smoothMin(bodySDF, fingerLine13, fingerLineBlend );
bodySDF = smoothMin(bodySDF, fingerLine14, fingerLineBlend);
// front right
bodySDF = smoothMin(bodySDF, fingerLine15, fingerLineBlend );
bodySDF = smoothMin(bodySDF, fingerLine16, fingerLineBlend );
bodySDF = smoothMin(bodySDF, fingerLine17, fingerLineBlend );
bodySDF = smoothMin(bodySDF, fingerLine18, fingerLineBlend );
bodySDF = smoothMin(bodySDF, fingerLine19, fingerLineBlend);


bodySDF = smoothMin(bodySDF, fingerSDF0, fingerBlend);
bodySDF = smoothMin(bodySDF, fingerSDF1, fingerBlend);
bodySDF = smoothMin(bodySDF, fingerSDF2, fingerBlend);
bodySDF = smoothMin(bodySDF, fingerSDF3, fingerBlend);
bodySDF = smoothMin(bodySDF, fingerSDF4, fingerBlend);

bodySDF = smoothMin(bodySDF, fingerSDF5, fingerBlend);
bodySDF = smoothMin(bodySDF, fingerSDF6, fingerBlend);
bodySDF = smoothMin(bodySDF, fingerSDF7, fingerBlend);
bodySDF = smoothMin(bodySDF, fingerSDF8, fingerBlend);
bodySDF = smoothMin(bodySDF, fingerSDF9, fingerBlend);

bodySDF = smoothMin(bodySDF, fingerSDF10, fingerBlend);
bodySDF = smoothMin(bodySDF, fingerSDF11, fingerBlend);
bodySDF = smoothMin(bodySDF, fingerSDF12, fingerBlend);
bodySDF = smoothMin(bodySDF, fingerSDF13, fingerBlend);
bodySDF = smoothMin(bodySDF, fingerSDF14, fingerBlend);

bodySDF = smoothMin(bodySDF, fingerSDF15, fingerBlend);
bodySDF = smoothMin(bodySDF, fingerSDF16, fingerBlend);
bodySDF = smoothMin(bodySDF, fingerSDF17, fingerBlend);
bodySDF = smoothMin(bodySDF, fingerSDF18, fingerBlend);
bodySDF = smoothMin(bodySDF, fingerSDF19, fingerBlend);

float bodyMask = smoothstep(0.0, 0.002, -bodySDF);
vec3 body = lightColor * bodyMask;









vec3 stepTargetCircle0 = step(distance(uv, sT0), .013) * lightColor;
vec3 stepTargetCircle1 = step(distance(uv, sT1), .013) * lightColor;
vec3 stepTargetCircle2 = step(distance(uv, sT2), .013) * lightColor;
vec3 stepTargetCircle3 = step(distance(uv, sT3), .013) * lightColor;
vec3 steps = vec3(stepTargetCircle0 + stepTargetCircle1 + stepTargetCircle2 + stepTargetCircle3);


  // float arm0Mask = smoothstep(armThickness, armThickness - 0.001, min(arm0Upper, arm0Lower));
  // float arm1Mask = smoothstep(armThickness, armThickness - 0.001, min(arm1Upper, arm1Lower));
  // float arm2Mask = smoothstep(armThickness, armThickness - 0.001, min(arm2Upper, arm2Lower));
  // float arm3Mask = smoothstep(armThickness, armThickness - 0.001, min(arm3Upper, arm3Lower));



// Combine all the circles into a single result
// vec3 spine = vec3(
//   circleColor0 + circleColor1 + circleColor2 + circleColor3 + circleColor4 + 
//   circleColor5 + circleColor6 + circleColor7 + circleColor8 + 
//   circleColor9 + circleColor10 + circleColor11 + circleColor12 + 
//   circleColor13
// );

    // vec3 debugSpineCircle0 = step(distance(uv, dS0), .004) * joint1Color;
    // vec3 debugSpineCircle1 = step(distance(uv, dS1), .004) * joint1Color;
 
    // vec3 debug_spine = vec3(debugSpineCircle0 + debugSpineCircle1);

 
    vec3 debugTailCircle0 = step(distance(uv, dT0), .004) * joint1Color;
    vec3 debugTailCircle1 = step(distance(uv, dT1), .004) * joint1Color;
    vec3 debug_tail = vec3(debugTailCircle0 + debugTailCircle1);


    vec3 spineCenterCircle = step(distance(uv, sC), .01) * elbowColor;
    vec3 spine_center = vec3(spineCenterCircle);

    vec3 spineIntersectionCircle = step(distance(uv, sI), .01) * joint1Color;
    vec3 spine_intersection = vec3(spineIntersectionCircle);

   //2nd and 3rd spine debug, not 2nd and 3rd flank
    vec3 debugSpineFlank2 = step(distance(uv, dSC2), .006) * stepTargetColor;
    vec3 debugSpineFlank3 = step(distance(uv, dSC3), .006) * stepTargetColor;
 
    vec3 debug_spine_flanks = vec3(debugSpineFlank2 + debugSpineFlank3);


       //4th and 5th spine debug, not 4th and 5th intersectionFlank
    vec3 debugSpineIntFlank4 = step(distance(uv, dSC4), .006) * joint1Color;
    vec3 debugSpineIntFlank5 = step(distance(uv, dSC5), .006) * joint1Color;
 
    vec3 debug_spine_int_flanks = vec3(debugSpineIntFlank4 + debugSpineIntFlank5);



        vec3 mirroredStepsCenterCircle = step(distance(uv, dMG8), .01) * joint1Color;
    vec3 mirrored_steps_center = vec3(mirroredStepsCenterCircle);

    vec3 shoulderF0Circle = step(distance(uv, aF0), radius4/smallerDiv) * shoulderColor;
    vec3 shoulderF1Circle = step(distance(uv, aF1), radius4/smallerDiv) * shoulderColor;
    vec3 shoulderB0Circle = step(distance(uv, aB0), radius4/smallerDiv) * shoulderColor;
    vec3 shoulderB1Circle = step(distance(uv, aB1), radius4/smallerDiv) * shoulderColor;


    vec3 shoulders = vec3(shoulderF0Circle + shoulderF1Circle + shoulderB0Circle + shoulderB1Circle);

    // vec3 anchorCircle0 = step(distance(uv, aJ0), radius4/circleSizeDiv) * joint1Color;


  


    vec3 desiredCircle0  = step(distance(uv, d0), .004) * elbowColor;
    vec3 desiredCircle1 = step(distance(uv, d1), .004) * elbowColor;
    vec3 desiredCircle2  = step(distance(uv, d2), .004) * shoulderColor;
    vec3 desiredCircle3 = step(distance(uv, d3), .004) * shoulderColor;
    vec3 desired = vec3(desiredCircle0 + desiredCircle1 + desiredCircle2 + desiredCircle3);


    vec3 desiredExtraCircle0  = step(distance(uv, dE0), .004) * footColor;
    vec3 desiredExtraCircle1 = step(distance(uv, dE1), .004) * footColor;
    vec3 desiredExtraCircle2  = step(distance(uv, dE2), .004) * footColor;
    vec3 desiredExtraCircle3 = step(distance(uv, dE3), .004) * footColor;
    vec3 desiredExtra = vec3(desiredExtraCircle0 + desiredExtraCircle1 + desiredExtraCircle2 + desiredExtraCircle3);
  

    vec3 footCircle0 = step(distance(uv, f0), radius4/evenSmallerDiv) * footColor;
    vec3 footCircle1 = step(distance(uv, f1), radius4/evenSmallerDiv) * footColor;
    vec3 footCircle2 = step(distance(uv, f2), radius4/evenSmallerDiv) * footColor;
    vec3 footCircle3 = step(distance(uv, f3), radius4/evenSmallerDiv) * footColor;
    vec3 feet = vec3(footCircle0 + footCircle1 + footCircle2 + footCircle3);
  
    vec3 elbowCircle0 = step(distance(uv, e0), radius4/evenSmallerDiv) * elbowColor;
    vec3 elbowCircle1 = step(distance(uv, e1), radius4/evenSmallerDiv) * elbowColor;
    vec3 elbowCircle2 = step(distance(uv, e2), radius4/evenSmallerDiv) * elbowColor;
    vec3 elbowCircle3 = step(distance(uv, e3), radius4/evenSmallerDiv) * elbowColor;
    vec3 elbows = vec3(elbowCircle0 + elbowCircle1 + elbowCircle2 + elbowCircle3);




  //////////////// TO VISUALIZE IK IN ELBOW/ARM 


    float lineThickness = .001;
  float stepCenterFront = lineSegmentSDF(uv, dMG0, dMG1);    

  
  float stepCenterFrontHor = lineSegmentSDF(uv, dMG2, dMG3);  
  float stepCenterBack = lineSegmentSDF(uv, dMG4, dMG5);  
  float stepCenterBackHor = lineSegmentSDF(uv, dMG6, dMG7);
 
  float spineMidline = lineSegmentSDF(uv, dSC0, dSC1);    
  float spineFlankDirLine = lineSegmentSDF(uv, dSC2, dSC3);    

  float stepToStep0 = lineSegmentSDF(uv, sT2, dMG2);
  float stepToStep1 = lineSegmentSDF(uv, sT3, dMG3);


  // Debug
  float stepCenterFrontMask = smoothstep(lineThickness, lineThickness - .001, stepCenterFront);
  float stepCenterFrontHorMask = smoothstep(lineThickness, lineThickness - .001, stepCenterFrontHor);
  float stepCenterBackMask = smoothstep(lineThickness, lineThickness - .001, stepCenterBack);
  float stepCenterBackHorMask = smoothstep(lineThickness, lineThickness - .001, stepCenterBackHor);
  
  float spineMidlineMask = smoothstep(lineThickness, lineThickness - .001, spineMidline);
  float spineFlankDirLineMask = smoothstep(lineThickness, lineThickness - .001, spineFlankDirLine);
  

  float stepToStep0Mask = smoothstep(lineThickness, lineThickness - .001, stepToStep0);
  float stepToStep1Mask = smoothstep(lineThickness, lineThickness - .001, stepToStep1);

  // vec3 arm0Line = armColor * arm0Mask;
  // vec3 arm1Line = armColor * arm1Mask;
  // vec3 arm2Line = armColor * arm2Mask;
  // vec3 arm3Line = armColor * arm3Mask;

  vec3 stepCenterFrontLine = joint1Color * stepCenterFrontMask;
  vec3 stepCenterFrontHorLine = joint1Color * stepCenterFrontHorMask;
  vec3 stepCenterBackLine = stepTargetColor * stepCenterBackMask;
  vec3 stepCenterBackHorLine = stepTargetColor * stepCenterBackHorMask;

  vec3 stepToStep0Line = stepTargetColor * stepToStep0Mask;
  vec3 stepToStep1Line = stepTargetColor * stepToStep1Mask;
  
  vec3 spineMidlineLine = elbowColor * spineMidlineMask;

  vec3 spineFlankLine = elbowColor * spineFlankDirLineMask;

  

  
//gl_FragColor = vec4(soul_dot + lead + debug_spine_int_flanks + debug_spine_flanks + mirrored_steps_center + spine_intersection + spine_center + desired + desiredExtra + steps + body + shoulders + elbows + stepCenterFrontLine + stepCenterFrontHorLine + stepCenterBackLine + stepCenterBackHorLine + spineMidlineLine + stepToStep0Line + stepToStep1Line , 1.0);
//gl_FragColor = vec4(soul_dot, 1.0);
 gl_FragColor = vec4( soul_dot  + body  + shoulders + elbows , 1.0);
 //gl_FragColor = vec4( lead +   body  + shoulders + elbows , 1.0);

//gl_FragColor = vec4( body  + shoulders + elbows  + arm0Line + arm1Line +   arm2Line + arm3Line  + tail, 1.0);


}