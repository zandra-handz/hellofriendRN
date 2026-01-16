export const GECKO_BODY_GLSL = `

uniform float u_time;
uniform float u_scale;
uniform float u_gecko_scale;
uniform vec2 u_resolution;
uniform float u_aspect;

uniform vec3 startColor; // body start color
uniform vec3 endColor;   // body end color

uniform vec2 u_soul;
uniform vec2 u_lead;
uniform vec2 u_joints[15];
uniform vec2 u_head;
uniform vec2 u_snout;
uniform vec2 u_hint;
uniform vec2 u_tail[13];
uniform vec2 u_steps[4];
uniform vec2 u_elbows[4];
uniform vec2 u_shoulders[4];
uniform vec2 u_muscles[8];
uniform vec2 u_fingers[20];

// ------------------------------------------------
// Helpers
// ------------------------------------------------
float distFCircle(vec2 uv, vec2 center, float radius) {
    return length(uv - center) - radius;
}

float lineSegmentSDF(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba)/dot(ba,ba), 0.0, 1.0);
    return length(pa - ba*h);
}

float smoothMin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5*(b - a)/k, 0.0, 1.0);
    return mix(b, a, h) - k*h*(1.0 - h);
}

// ------------------------------------------------
// Main shader
// ------------------------------------------------
half4 main(vec2 fragCoord) {

    // Normalize coordinates
    vec2 uv = fragCoord / u_resolution;
    uv -= 0.5;
    uv.x *= u_aspect;

    vec2 gecko_uv = uv / u_gecko_scale;
    float s = 1.0 / u_gecko_scale;
    float circleSizeDiv = 0.8;

    // Body circles (head, snout, spine joints)
    float circle0 = distFCircle(gecko_uv, u_snout, 0.003 * s / circleSizeDiv);
    float circle1 = distFCircle(gecko_uv, u_head, 0.019 * s / circleSizeDiv);
    float circle1b = distFCircle(gecko_uv, u_joints[1], 0.0);
    float circle2 = distFCircle(gecko_uv, u_joints[2], 0.001 * s / circleSizeDiv);
    float circle3 = distFCircle(gecko_uv, u_joints[3], 0.004 * s / circleSizeDiv);
    float circle4 = distFCircle(gecko_uv, u_joints[4], 0.004 * s / circleSizeDiv);
    float circle5 = distFCircle(gecko_uv, u_joints[5], 0.004 * s / circleSizeDiv);
    float circle6 = distFCircle(gecko_uv, u_joints[6], 0.004 * s / circleSizeDiv);
    float circle7 = distFCircle(gecko_uv, u_joints[7], 0.003 * s / circleSizeDiv);
    float circle8 = distFCircle(gecko_uv, u_joints[8], 0.003 * s / circleSizeDiv);
    float circle9 = distFCircle(gecko_uv, u_joints[9], 0.003 * s / circleSizeDiv);
    float circle13 = distFCircle(gecko_uv, u_joints[13], 0.003 * s / circleSizeDiv);

    float circleMerge = smoothMin(
        smoothMin(circle0, circle1, 0.03),
        smoothMin(circle1b, circle2, 0.05),
        0.005
    );

    circleMerge = smoothMin(circleMerge, circle3, 0.054 * s);
    circleMerge = smoothMin(circleMerge, circle4, 0.054 * s);
    circleMerge = smoothMin(circleMerge, circle5, 0.054 * s);
    circleMerge = smoothMin(circleMerge, circle6, 0.054 * s);
    circleMerge = smoothMin(circleMerge, circle7, 0.054 * s);
    circleMerge = smoothMin(circleMerge, circle8, 0.054 * s);
    circleMerge = smoothMin(circleMerge, circle9, 0.054 * s);
    circleMerge = smoothMin(circleMerge, circle13, 0.054 * s);

    // Tail circles
    float tailCircleMerge = 1.0; // start large
    for(int i=0; i<13; i++){
        float r = 0.005 * s;
        tailCircleMerge = smoothMin(tailCircleMerge, distFCircle(gecko_uv, u_tail[i], r), 0.054 * s);
    }

    float bodySDF = smoothMin(circleMerge, tailCircleMerge, 0.0003 * s);

    // Arms
    float armThickness = 0.005 * s;
    float backArmThickness = 0.007 * s;

    for(int i=0;i<2;i++){
        float upper = lineSegmentSDF(gecko_uv, u_joints[2], u_elbows[i]);
        float lower = lineSegmentSDF(gecko_uv, u_elbows[i], u_steps[i]);
        bodySDF = smoothMin(bodySDF, min(upper, lower) - armThickness, 0.01 * s);
    }
    for(int i=2;i<4;i++){
        float upper = lineSegmentSDF(gecko_uv, u_joints[13], u_elbows[i]);
        float lower = lineSegmentSDF(gecko_uv, u_elbows[i], u_steps[i]);
        bodySDF = smoothMin(bodySDF, min(upper, lower) - backArmThickness, 0.01 * s);
    }

    // Fingers (lines and circles)
    float fingerThickness = 0.0025 * s;
    float fingerRadius = 0.0015 * s;

    for(int i=0;i<20;i++){
        int stepIndex = i / 5;
        float lineSDF = lineSegmentSDF(gecko_uv, u_fingers[i], u_steps[stepIndex]) - fingerThickness;
        float circleSDF = distFCircle(gecko_uv, u_fingers[i], fingerRadius);
        bodySDF = smoothMin(bodySDF, lineSDF, 0.0025 * s);
        bodySDF = smoothMin(bodySDF, circleSDF, 0.01 * s);
    }

    // Muscles
    bodySDF = smoothMin(bodySDF, distFCircle(gecko_uv, u_muscles[1], 0.005 * s), 0.024 * s);
    bodySDF = smoothMin(bodySDF, distFCircle(gecko_uv, u_muscles[3], 0.005 * s), 0.024 * s);
    bodySDF = smoothMin(bodySDF, distFCircle(gecko_uv, u_muscles[5], 0.86 * s), 0.03 * s);
    bodySDF = smoothMin(bodySDF, distFCircle(gecko_uv, u_muscles[7], 0.005 * s), 0.03 * s);

    float bodyMask = smoothstep(0.0, 0.002, -bodySDF);
    vec3 color = mix(vec3(0.0), endColor, bodyMask);

    return vec4(color, 1.0);
}
`;



export const GECKO_MOMENTS_GLSL = `

    uniform vec2 u_moments[64]; // HARD CODED MAX
    uniform int u_momentsLength;
    uniform vec2 u_selected;
    uniform vec2 u_lastSelected;

    uniform float u_scale;
    uniform float u_gecko_scale;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_aspect;
    uniform vec2 u_soul;
    uniform vec2 u_lead;
    uniform vec2 u_joints[15];
    uniform vec2 u_head;
    uniform vec2 u_snout;
    uniform vec2 u_hint;
    uniform vec2 u_tail[13];
 
    uniform vec2 u_steps[4];
    uniform vec2 u_elbows[4];
    uniform vec2 u_shoulders[4];
    uniform vec2 u_muscles[8];
    uniform vec2 u_fingers[20];

  
    float TWO_PI = 6.28318530718;
    
    float distFCircle(vec2 uv, vec2 center, float radius) {
      return length(uv - center) - radius;
    }

 
float smoothMin(float a, float b, float k) {
  //clamp --> x, minVal, maxVal
    float h = clamp(0.5 + 0.5*(b - a)/k, 0.0, 1.0);
    return mix(b, a, h) - k*h*(1.0 - h);
}



float lineSegmentSDF(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba)/dot(ba,ba), 0.0, 1.0);
    return length(pa - ba*h);
}
    
 
// Compute normal from a distance function for a circle
vec3 getNormal(vec2 uv, vec2 center, float radius) {
    // Compute the SDF
    float sd = distFCircle(uv, center, radius);

    // Approximate gradient using finite differences
    float eps = 0.001; // small offset
    float dx = distFCircle(uv + vec2(eps, 0.0), center, radius) - sd;
    float dy = distFCircle(uv + vec2(0.0, eps), center, radius) - sd;

    // Normal: x,y from gradient, z from sphere approximation
    float dz = sqrt(clamp(radius*radius - dx*dx - dy*dy, 0.0, 1.0));

    return normalize(vec3(dx, dy, dz));
}



half4 main(vec2 fragCoord) {

   
      vec2 uv = fragCoord / u_resolution; 
      
      uv -= vec2(0.5); 
      uv.x *= u_aspect;




    //uv /= u_scale; // scale everything
    vec2 moments_uv = uv /= u_scale;

    vec2 gecko_uv =uv /= u_gecko_scale;

    float s = 1.0 / u_gecko_scale;
    float momentsRadius = .01;
   

         vec2 gradUV = fragCoord / u_resolution;  // 0..1
    vec3 background = mix(backgroundStartColor, backgroundEndColor, gradUV.y); // vertical gradient
    vec3 color = background; // start with gradient
    float alpha = 1.0;       // background is fully opaque
vec2 soulUV        = u_soul; 
vec2 leadUV        = u_lead; 
vec2 hintUV        = u_hint; 
vec2 snoutUV       = u_snout; 
vec2 headUV        = u_head; 

vec2 selectedUV     = u_selected; 
vec2 lastSelectedUV = u_lastSelected; 

 
    float leadMask = step(distance(uv, leadUV), 0.04);
    vec3 lead_dot = vec3(1.0, 0.0, 0.0) * leadMask;
 
 
// vec3 moments = vec3(0.0); // start with zero

// for (int i = 0; i < 64; i++) {
//     if (i >= u_momentsLength) continue; // skip extra moments

    
//     float momentsMask = step(distance(moments_uv, u_moments[i]), 0.008);
//     moments += startColor * momentsMask; // accumulate
// }

float momentsField = 0.00;
float liquidRadius = 0.015;

float cutoffDist = 0.05;        // max distance to contribute
float cutoffDistSq = cutoffDist * cutoffDist;

for (int i = 0; i < 64; i++) {
    if (i >= u_momentsLength) break;

    vec2 toMoment = moments_uv - u_moments[i];
    float distSq = dot(toMoment, toMoment);  // squared distance

    if (distSq > cutoffDistSq) continue;     // skip far moments

    // inverse distance contribution (approx using sqrt)
    // note: approximate sqrt by sqrt(distSq) only if needed
    float dist = sqrt(distSq + 0.0001);       // avoid divide by zero
    momentsField += liquidRadius / dist;
}
// Map the field to a mask with smoothstep
float momentsMask = smoothstep(1.5, 0.8, momentsField); // tweak thresholds
vec3 momentsColor = startColor * momentsMask;

 


    vec3 selected = vec3(0.);
    float selectedMask = step(distance(moments_uv, selectedUV), .03);
    selected += startColor * selectedMask;


    
    // vec3 lastSelected = vec3(0.);
    // float lastSelectedMask = step(distance(moments_uv, lastSelectedUV), .02);
    // lastSelected += startColor * lastSelectedMask;


    float circleSizeDiv = .8; // adjust if needed

    float hintMask = step(distance(gecko_uv, hintUV), .008 * s);
    vec3 hintDot = startColor * hintMask;
  
    float armThickness = 0.005 * s; 
    float backArmThickness = .007 * s;
    float fingerThickness = 0.0025 * s; 
    
    // in tail
    float blendAmt = 0.054 * s;

    float spineBlend = .054 * s;
    float spineTailBlend = 0.0003 * s;
    float shoulderBlend = 0.01 * s;
    float stepBlend = 0.003 * s;
    float fingerBlend = 0.01 * s;
    float fingerLineBlend = .0025 * s;   
    float muscleBlend = 0.024 * s;   

    float fingerRadius = 0.0015 * s;  
    float stepRadius = .007 * s; 
    float lowerMuscleRadius = .001 * s;
    float upperMuscleRadius = 0.005 * s; // or whatever radius you want
    float backMuscleBlend = .03 * s; // ultimate controller of how much of back upper leg muscle to add
    float backUpperMuscleRadius = .86 * s;
  


    float circle0 = distFCircle(gecko_uv, snoutUV, 0.003 * s/ circleSizeDiv);
    float circle1 = distFCircle(gecko_uv, headUV, 0.019 * s / circleSizeDiv);
    float circle1b = distFCircle(gecko_uv, u_joints[1], 0.0 / circleSizeDiv);
    float circle2 = distFCircle(gecko_uv, u_joints[2], 0.001 * s / circleSizeDiv);
    float circle3 = distFCircle(gecko_uv, u_joints[3], 0.004 * s / circleSizeDiv);
    float circle4 = distFCircle(gecko_uv, u_joints[4], 0.004 * s/ circleSizeDiv);
    float circle5 = distFCircle(gecko_uv, u_joints[5], 0.004 * s/ circleSizeDiv);
    float circle6 = distFCircle(gecko_uv, u_joints[6], 0.004 * s / circleSizeDiv);
    float circle7 = distFCircle(gecko_uv, u_joints[7], 0.003 *s/ circleSizeDiv);
    float circle8 = distFCircle(gecko_uv, u_joints[8], 0.003* s / circleSizeDiv);
    float circle9 = distFCircle(gecko_uv, u_joints[9], 0.003 * s/ circleSizeDiv);
    float circle10 = distFCircle(gecko_uv, u_joints[10], 0.003  * s/ circleSizeDiv);
    float circle11 = distFCircle(gecko_uv, u_joints[11], 0.003 * s / circleSizeDiv);
    float circle12 = distFCircle(gecko_uv, u_joints[12], 0.002 * s/ circleSizeDiv);
    float circle13 = distFCircle(gecko_uv, u_joints[13], 0.002 *s/ circleSizeDiv);
    float circle14 = distFCircle(gecko_uv, u_joints[14], 0.0004*s / circleSizeDiv);

    float circleMerge = smoothMin(
        smoothMin(circle0, circle1, 0.03),
        smoothMin(circle1b, circle2, 0.05),
        0.005
    );

    circleMerge = smoothMin(circleMerge, circle3, spineBlend);
    circleMerge = smoothMin(circleMerge, circle4, spineBlend);
    circleMerge = smoothMin(circleMerge, circle5, spineBlend);
    circleMerge = smoothMin(circleMerge, circle6, spineBlend);
    circleMerge = smoothMin(circleMerge, circle7, spineBlend);
    circleMerge = smoothMin(circleMerge, circle8, spineBlend);
    circleMerge = smoothMin(circleMerge, circle9, spineBlend);
   // circleMerge = smoothMin(circleMerge, circle10, spineBlend);
    // circleMerge = smoothMin(circleMerge, circle11, spineBlend);
    //circleMerge = smoothMin(circleMerge, circle12, spineBlend);
   circleMerge = smoothMin(circleMerge, circle13, spineBlend);
   // circleMerge = smoothMin(circleMerge, circle14, spineBlend);


     
    float tailCircle0  = distFCircle(gecko_uv, u_tail[0],  0.002* s / circleSizeDiv);
    float tailCircle1  = distFCircle(gecko_uv, u_tail[1],  0.005*s / circleSizeDiv);
    float tailCircle2  = distFCircle(gecko_uv, u_tail[2],  0.004 * s/ circleSizeDiv);
    float tailCircle3  = distFCircle(gecko_uv, u_tail[3],  0.0042 * s/ circleSizeDiv);
    float tailCircle4  = distFCircle(gecko_uv, u_tail[4],  0.005 * s / circleSizeDiv);
    float tailCircle5  = distFCircle(gecko_uv, u_tail[5],  0.005 * s / circleSizeDiv);
    float tailCircle6  = distFCircle(gecko_uv, u_tail[6],  0.005*s / circleSizeDiv);
    float tailCircle7  = distFCircle(gecko_uv, u_tail[7],  0.004 * s / circleSizeDiv);
    float tailCircle8  = distFCircle(gecko_uv, u_tail[8],  0.0027 * s / circleSizeDiv);
    float tailCircle9  = distFCircle(gecko_uv, u_tail[9],  0.002 * s / circleSizeDiv);
    float tailCircle10 = distFCircle(gecko_uv, u_tail[10], 0.001 * s / circleSizeDiv);
    float tailCircle11 = distFCircle(gecko_uv, u_tail[11], 0.0001 * s / circleSizeDiv);
    float tailCircle12 = distFCircle(gecko_uv, u_tail[12], 0.0001 *s / circleSizeDiv);

    float tailCircleMerge = smoothMin(
        smoothMin(tailCircle0, tailCircle1, 0.03),
        smoothMin(tailCircle2, tailCircle3, 0.05),
        0.005
    );

    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle4, blendAmt +.04);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle5, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle6, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle7, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle8, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle9, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle10, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle11, blendAmt);
    tailCircleMerge = smoothMin(tailCircleMerge, tailCircle12, blendAmt);


    float bodySDF = smoothMin(circleMerge, tailCircleMerge, spineTailBlend);


    // ARMS /////////////////////////////////////////////////////////////////////////////////

    float arm0Upper = lineSegmentSDF(gecko_uv, u_joints[2], u_elbows[0]);   
    float arm0Lower = lineSegmentSDF(gecko_uv, u_elbows[0], u_steps[0]); 
    float arm1Upper = lineSegmentSDF(gecko_uv, u_joints[2], u_elbows[1]);   
    float arm1Lower = lineSegmentSDF(gecko_uv, u_elbows[1], u_steps[1]); 
    float arm2Upper = lineSegmentSDF(gecko_uv, u_joints[13], u_elbows[2]);   
    float arm2Lower = lineSegmentSDF(gecko_uv, u_elbows[2], u_steps[2]); 
    float arm3Upper = lineSegmentSDF(gecko_uv, u_joints[13], u_elbows[3]);   
    float arm3Lower = lineSegmentSDF(gecko_uv, u_elbows[3], u_steps[3]); 


    float arm0SDF = min(arm0Upper, arm0Lower) - armThickness;
    float arm1SDF = min(arm1Upper, arm1Lower) - armThickness;
    float arm2SDF = min(arm2Upper, arm2Lower) - backArmThickness;
    float arm3SDF = min(arm3Upper, arm3Lower) - backArmThickness;

    bodySDF = smoothMin(bodySDF, arm0SDF, shoulderBlend);
    bodySDF = smoothMin(bodySDF, arm1SDF, shoulderBlend);
    bodySDF = smoothMin(bodySDF, arm2SDF, shoulderBlend);
    bodySDF = smoothMin(bodySDF, arm3SDF, shoulderBlend);

    // FRONT MUSCLES
    float musclesSDF0 = distFCircle(gecko_uv, u_muscles[0], lowerMuscleRadius);
    float musclesSDF1  = distFCircle(gecko_uv, u_muscles[1], upperMuscleRadius );
    float musclesSDF2 = distFCircle(gecko_uv, u_muscles[2], lowerMuscleRadius);
    float musclesSDF3  = distFCircle(gecko_uv, u_muscles[3], upperMuscleRadius );

    // not using these two
   // bodySDF = smoothMin(bodySDF, musclesSDF0 , muscleBlend );
    // bodySDF = smoothMin(bodySDF, musclesSDF2 , muscleBlend );

    bodySDF = smoothMin(bodySDF, musclesSDF1 , muscleBlend ); 
    bodySDF = smoothMin(bodySDF, musclesSDF3 , muscleBlend ); 

    // BACK MUSCLES
    float musclesSDF4 = distFCircle(gecko_uv, u_muscles[4], lowerMuscleRadius);
    float musclesSDF5  = distFCircle(gecko_uv, u_muscles[5], upperMuscleRadius );
    float musclesSDF6 = distFCircle(gecko_uv, u_muscles[6], lowerMuscleRadius);
    float musclesSDF7  = distFCircle(gecko_uv, u_muscles[7], upperMuscleRadius );

    // not using these two
    // bodySDF = smoothMin(bodySDF, musclesSDF4 , muscleBlend );
    // bodySDF = smoothMin(bodySDF, musclesSDF6 , muscleBlend );

    bodySDF = smoothMin(bodySDF, musclesSDF5 , backMuscleBlend);
    bodySDF = smoothMin(bodySDF, musclesSDF7 , backMuscleBlend); 



    // STEPS ///////////////////////////////////////////////////////////////////////

    float stepSDF0 = distFCircle(gecko_uv, u_steps[0], stepRadius);
    float stepSDF1 = distFCircle(gecko_uv, u_steps[1], stepRadius);
    float stepSDF2 = distFCircle(gecko_uv, u_steps[2], stepRadius);
    float stepSDF3 = distFCircle(gecko_uv, u_steps[3], stepRadius);

    bodySDF = smoothMin(bodySDF, stepSDF0, stepBlend);
    bodySDF = smoothMin(bodySDF, stepSDF1, stepBlend);
    bodySDF = smoothMin(bodySDF, stepSDF2, stepBlend);
    bodySDF = smoothMin(bodySDF, stepSDF3, stepBlend);

    // FINGERS ////////////////////////////////////////////////////////////////////////////

    float fingerLine0 = lineSegmentSDF(gecko_uv, u_fingers[0], u_steps[0]) - fingerThickness;
    float fingerLine1 = lineSegmentSDF(gecko_uv, u_fingers[1], u_steps[0]) - fingerThickness;
    float fingerLine2 = lineSegmentSDF(gecko_uv, u_fingers[2], u_steps[0]) - fingerThickness;
    float fingerLine3 = lineSegmentSDF(gecko_uv, u_fingers[3], u_steps[0]) - fingerThickness;
    float fingerLine4 = lineSegmentSDF(gecko_uv, u_fingers[4], u_steps[0]) - fingerThickness;

    float fingerLine5 = lineSegmentSDF(gecko_uv, u_fingers[5], u_steps[1]) - fingerThickness;
    float fingerLine6 = lineSegmentSDF(gecko_uv, u_fingers[6], u_steps[1]) - fingerThickness;
    float fingerLine7 = lineSegmentSDF(gecko_uv, u_fingers[7], u_steps[1]) - fingerThickness;
    float fingerLine8 = lineSegmentSDF(gecko_uv, u_fingers[8], u_steps[1]) - fingerThickness;
    float fingerLine9 = lineSegmentSDF(gecko_uv, u_fingers[9], u_steps[1]) - fingerThickness;

    float fingerLine10 = lineSegmentSDF(gecko_uv, u_fingers[10], u_steps[2]) - fingerThickness;
    float fingerLine11 = lineSegmentSDF(gecko_uv, u_fingers[11], u_steps[2]) - fingerThickness;
    float fingerLine12 = lineSegmentSDF(gecko_uv, u_fingers[12], u_steps[2]) - fingerThickness;
    float fingerLine13 = lineSegmentSDF(gecko_uv, u_fingers[13], u_steps[2]) - fingerThickness;
    float fingerLine14 = lineSegmentSDF(gecko_uv, u_fingers[14], u_steps[2]) - fingerThickness;

    float fingerLine15 = lineSegmentSDF(gecko_uv, u_fingers[15], u_steps[3]) - fingerThickness;
    float fingerLine16 = lineSegmentSDF(gecko_uv, u_fingers[16], u_steps[3]) - fingerThickness;
    float fingerLine17 = lineSegmentSDF(gecko_uv, u_fingers[17], u_steps[3]) - fingerThickness;
    float fingerLine18 = lineSegmentSDF(gecko_uv, u_fingers[18], u_steps[3]) - fingerThickness;
    float fingerLine19 = lineSegmentSDF(gecko_uv, u_fingers[19], u_steps[3]) - fingerThickness;

    bodySDF = smoothMin(bodySDF, fingerLine0, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine1,fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine2, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine3, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine4, fingerLineBlend);
    
    bodySDF = smoothMin(bodySDF, fingerLine5, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine6, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine7, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine8, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine9, fingerLineBlend);
    
    bodySDF = smoothMin(bodySDF, fingerLine10, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine11, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine12, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine13, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine14, fingerLineBlend);
    
    bodySDF = smoothMin(bodySDF, fingerLine15, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine16, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine17, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine18, fingerLineBlend );
    bodySDF = smoothMin(bodySDF, fingerLine19, fingerLineBlend);


      // F LEFT
      float fingerSDF0 = distFCircle(gecko_uv, u_fingers[0], fingerRadius);
      float fingerSDF1 = distFCircle(gecko_uv, u_fingers[1], fingerRadius);
      float fingerSDF2 = distFCircle(gecko_uv, u_fingers[2], fingerRadius);
      float fingerSDF3 = distFCircle(gecko_uv, u_fingers[3], fingerRadius);
      float fingerSDF4 = distFCircle(gecko_uv, u_fingers[4], fingerRadius); 
      // F RIGHT
      float fingerSDF5 = distFCircle(gecko_uv, u_fingers[5], fingerRadius);
      float fingerSDF6 = distFCircle(gecko_uv, u_fingers[6], fingerRadius);
      float fingerSDF7 = distFCircle(gecko_uv, u_fingers[7], fingerRadius);
      float fingerSDF8 = distFCircle(gecko_uv, u_fingers[8], fingerRadius);
      float fingerSDF9 = distFCircle(gecko_uv, u_fingers[9], fingerRadius); 
      // B LEFT
      float fingerSDF10 = distFCircle(gecko_uv, u_fingers[10], fingerRadius);
      float fingerSDF11 = distFCircle(gecko_uv, u_fingers[11], fingerRadius);
      float fingerSDF12 = distFCircle(gecko_uv, u_fingers[12], fingerRadius);
      float fingerSDF13 = distFCircle(gecko_uv, u_fingers[13], fingerRadius);
      float fingerSDF14 = distFCircle(gecko_uv, u_fingers[14], fingerRadius);
      // BACK r
      float fingerSDF15 = distFCircle(gecko_uv, u_fingers[15], fingerRadius);
      float fingerSDF16 = distFCircle(gecko_uv, u_fingers[16], fingerRadius);
      float fingerSDF17 = distFCircle(gecko_uv, u_fingers[17], fingerRadius);
      float fingerSDF18 = distFCircle(gecko_uv, u_fingers[18], fingerRadius);
      float fingerSDF19 = distFCircle(gecko_uv, u_fingers[19], fingerRadius);

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

    ///////////////////////////////////////////////////////////////////////////////////////

    float bodyMask = smoothstep(0.0, 0.002, -bodySDF);
    vec3 body = endColor * bodyMask;
 


    vec3 bodyColor    = startColor   * bodyMask; 
    //  float finalAlpha = max(bodyMask, momentsMask);

 


    


vec3 colorAll = background; // 1️⃣ background gradient

// distance from last selected
float distToLast = length(moments_uv - lastSelectedUV);
float lastSelectedRadius = 0.02;

// smooth mask (1 at center, 0 at edge)
float lastSelectedMask = smoothstep(lastSelectedRadius, 0.0, distToLast);

// safe normalized vector
vec2 toCenter = moments_uv - lastSelectedUV;
float len = length(toCenter);
if (len > 0.0001) toCenter /= len;

// small perturbation for liquid effect
vec2 perturbedUV = moments_uv + toCenter * 0.008; // reduce for softness
perturbedUV = clamp(perturbedUV, 0.0, 1.0);

// sample gradient (soft color)
vec3 refractColor = mix(backgroundStartColor, backgroundEndColor, perturbedUV.y);

// Blend with **soft mask**, no additive
colorAll = mix(colorAll, refractColor, lastSelectedMask * 0.2);


// 2️⃣ overlay moments (liquid glass effect, semi-transparent)
vec3 momentsOverlay = startColor * momentsMask * 0.35; // 0.35 opacity
colorAll = mix(colorAll, momentsOverlay, momentsMask * 0.35);

// 3️⃣ overlay selected / lastSelected
vec3 selectedOverlay = startColor * selectedMask;
vec3 lastSelectedOverlay = startColor * lastSelectedMask;
colorAll += selectedOverlay + lastSelectedOverlay; // small dots, additive

// 4️⃣ overlay gecko/body
vec3 bodyOverlay = endColor * bodyMask;
colorAll = mix(colorAll, bodyOverlay, bodyMask); // smooth blend

float finalAlpha = 1.0;
return vec4(colorAll, finalAlpha);


} 

`


export const MOMENTS_ONLY_GLSL = `

uniform vec2 u_moments[64];      // HARD CODED MAX
uniform int u_momentsLength;
uniform vec2 u_selected;
uniform vec2 u_lastSelected;

uniform float u_scale;
uniform vec2 u_resolution;
uniform float u_aspect;

half4 main(vec2 fragCoord) {

    // Normalized UV
    vec2 uv = fragCoord / u_resolution;
    uv -= 0.5;
    uv.x *= u_aspect;

    // Apply scale
    vec2 moments_uv = uv / u_scale;

    // Background gradient (vertical)
    vec3 backgroundStartColor = vec3(0.0, 0.0, 0.0);
    vec3 backgroundEndColor = vec3(0.05, 0.05, 0.1);
    vec2 gradUV = fragCoord / u_resolution;
    vec3 colorAll = mix(backgroundStartColor, backgroundEndColor, gradUV.y);

    // Moments field
    float momentsField = 0.0;
    float liquidRadius = 0.015;
    float cutoffDist = 0.05;
    float cutoffDistSq = cutoffDist * cutoffDist;

    for (int i = 0; i < 64; i++) {
        if (i >= u_momentsLength) break;

        vec2 toMoment = moments_uv - u_moments[i];
        float distSq = dot(toMoment, toMoment);
        if (distSq > cutoffDistSq) continue;

        float dist = sqrt(distSq + 0.0001);
        momentsField += liquidRadius / dist;
    }

    float momentsMask = smoothstep(1.5, 0.8, momentsField);
    vec3 startColor = vec3(0.6, 0.8, 1.0); // bluish for moments
    vec3 momentsOverlay = startColor * momentsMask * 0.35;
    colorAll = mix(colorAll, momentsOverlay, momentsMask * 0.35);

    // Selected point
    vec3 selectedOverlay = startColor * step(distance(moments_uv, u_selected), 0.03);
    colorAll += selectedOverlay;

    // Last selected point (soft)
    float distToLast = length(moments_uv - u_lastSelected);
    float lastSelectedRadius = 0.02;
    float lastSelectedMask = smoothstep(lastSelectedRadius, 0.0, distToLast);
    vec3 lastSelectedOverlay = startColor * lastSelectedMask;
    colorAll += lastSelectedOverlay;

    return vec4(colorAll, 1.0);
}

`;
