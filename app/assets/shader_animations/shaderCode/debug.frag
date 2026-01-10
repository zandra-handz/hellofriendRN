//   const source = Skia.RuntimeEffect.Make(`
//     vec3 startColor = vec3(${color1Converted});
//     vec3 endColor = vec3(${color2Converted});

//     uniform float u_scale;
//     uniform float u_time;
//     uniform vec2 u_resolution;
//     uniform vec2 u_soul;
//     uniform vec2 u_lead;
//     uniform vec2 u_joints[15];
//     uniform vec2 u_head;
//     uniform vec2 u_snout;
//     uniform vec2 u_hint;
//     uniform vec2 u_tail[13];

 
//     uniform vec2 u_steps[4];
//     uniform vec2 u_elbows[4];
//     uniform vec2 u_shoulders[4];
//     uniform vec2 u_muscles[8];
//     uniform vec2 u_fingers[20];

//     float TWO_PI = 6.28318530718;
    
//     float distFCircle(vec2 uv, vec2 center, float radius) {
//       return length(uv - center) - radius;
//     }

 
// float smoothMin(float a, float b, float k) {
//   //clamp --> x, minVal, maxVal
//     float h = clamp(0.5 + 0.5*(b - a)/k, 0.0, 1.0);
//     return mix(b, a, h) - k*h*(1.0 - h);
// }

// float lineSegmentSDF(vec2 p, vec2 a, vec2 b) {
//     vec2 pa = p - a;
//     vec2 ba = b - a;
//     float h = clamp(dot(pa, ba)/dot(ba,ba), 0.0, 1.0);
//     return length(pa - ba*h);
// }


// half4 main(vec2 fragCoord) {
//     vec2 uv = (fragCoord - 0.5 * u_resolution) / u_resolution.y;
//     uv /= u_scale;
//     uv = uv - vec2(0.0);

//     // Convert positions to centered UV space
//     vec2 soulUV = u_soul - 0.5;
//     vec2 leadUV = u_lead - 0.5;
//     vec2 hintUV = u_hint - .5;
//     vec2 snoutUV = u_snout - 0.5;
//     vec2 headUV = u_head - 0.5;

//     vec3 color = vec3(0.0);
//     float alpha = 0.0;

//     // Lead dot
//     float leadMask = step(distance(uv, leadUV), 0.04);
//     color += vec3(1.0, 0.0, 0.0) * leadMask;
//     alpha = max(alpha, leadMask);

//     // Soul dot
//     float soulMask = step(distance(uv, soulUV), 0.008);
//     color += vec3(0.0, 1.0, 0.0) * soulMask;
//     alpha = max(alpha, soulMask);

//     // Spine joints with smoothMin blending

//     float circleSizeDiv = .8; // adjust if needed



//     float hint_dot = step(distance(uv, hintUV), .008);
  


//     float armThickness = 0.005; 
//     float backArmThickness = .007;
//     float fingerThickness = 0.0025; 
    
//     // in tail
//     float blendAmt = 0.054;

//     float spineBlend = .054;
//     float spineTailBlend = 0.0003;
//     float shoulderBlend = 0.01;
//     float stepBlend = 0.003;
//     float fingerBlend = 0.01;
//     float fingerLineBlend = .0025;   
//     float muscleBlend = 0.024;   

//     float fingerRadius = 0.0015;  
//     float stepRadius = .007; 
//     float lowerMuscleRadius = .001;
//     float upperMuscleRadius = 0.005; // or whatever radius you want
//     float backMuscleBlend = .03; // ultimate controller of how much of back upper leg muscle to add
//     float backUpperMuscleRadius = .86;
  


//     float circle0 = distFCircle(uv, snoutUV, 0.003 / circleSizeDiv);
//     float circle1 = distFCircle(uv, headUV, 0.019 / circleSizeDiv);
//     float circle1b = distFCircle(uv, u_joints[1], 0.0 / circleSizeDiv);
//     float circle2 = distFCircle(uv, u_joints[2], 0.001 / circleSizeDiv);
//     float circle3 = distFCircle(uv, u_joints[3], 0.004 / circleSizeDiv);
//     float circle4 = distFCircle(uv, u_joints[4], 0.004 / circleSizeDiv);
//     float circle5 = distFCircle(uv, u_joints[5], 0.004 / circleSizeDiv);
//     float circle6 = distFCircle(uv, u_joints[6], 0.004 / circleSizeDiv);
//     float circle7 = distFCircle(uv, u_joints[7], 0.003 / circleSizeDiv);
//     float circle8 = distFCircle(uv, u_joints[8], 0.003 / circleSizeDiv);
//     float circle9 = distFCircle(uv, u_joints[9], 0.003 / circleSizeDiv);
//     float circle10 = distFCircle(uv, u_joints[10], 0.003 / circleSizeDiv);
//     float circle11 = distFCircle(uv, u_joints[11], 0.003 / circleSizeDiv);
//     float circle12 = distFCircle(uv, u_joints[12], 0.002 / circleSizeDiv);
//     float circle13 = distFCircle(uv, u_joints[13], 0.002 / circleSizeDiv);
//     float circle14 = distFCircle(uv, u_joints[14], 0.0004 / circleSizeDiv);

//     float circleMerge = smoothMin(
//         smoothMin(circle0, circle1, 0.03),
//         smoothMin(circle1b, circle2, 0.05),
//         0.005
//     );

//     circleMerge = smoothMin(circleMerge, circle3, spineBlend);
//     circleMerge = smoothMin(circleMerge, circle4, spineBlend);
//     circleMerge = smoothMin(circleMerge, circle5, spineBlend);
//     circleMerge = smoothMin(circleMerge, circle6, spineBlend);
//     circleMerge = smoothMin(circleMerge, circle7, spineBlend);
//     circleMerge = smoothMin(circleMerge, circle8, spineBlend);
//     circleMerge = smoothMin(circleMerge, circle9, spineBlend);
//    // circleMerge = smoothMin(circleMerge, circle10, spineBlend);
//     // circleMerge = smoothMin(circleMerge, circle11, spineBlend);
//     //circleMerge = smoothMin(circleMerge, circle12, spineBlend);
//    circleMerge = smoothMin(circleMerge, circle13, spineBlend);
//    // circleMerge = smoothMin(circleMerge, circle14, spineBlend);


     
//     float tailCircle0  = distFCircle(uv, u_tail[0],  0.002 / circleSizeDiv);
//     float tailCircle1  = distFCircle(uv, u_tail[1],  0.005 / circleSizeDiv);
//     float tailCircle2  = distFCircle(uv, u_tail[2],  0.004 / circleSizeDiv);
//     float tailCircle3  = distFCircle(uv, u_tail[3],  0.0042 / circleSizeDiv);
//     float tailCircle4  = distFCircle(uv, u_tail[4],  0.005 / circleSizeDiv);
//     float tailCircle5  = distFCircle(uv, u_tail[5],  0.005 / circleSizeDiv);
//     float tailCircle6  = distFCircle(uv, u_tail[6],  0.005 / circleSizeDiv);
//     float tailCircle7  = distFCircle(uv, u_tail[7],  0.004 / circleSizeDiv);
//     float tailCircle8  = distFCircle(uv, u_tail[8],  0.0027 / circleSizeDiv);
//     float tailCircle9  = distFCircle(uv, u_tail[9],  0.002 / circleSizeDiv);
//     float tailCircle10 = distFCircle(uv, u_tail[10], 0.001 / circleSizeDiv);
//     float tailCircle11 = distFCircle(uv, u_tail[11], 0.0001 / circleSizeDiv);
//     float tailCircle12 = distFCircle(uv, u_tail[12], 0.0001 / circleSizeDiv);

//     float tailCircleMerge = smoothMin(
//         smoothMin(tailCircle0, tailCircle1, 0.03),
//         smoothMin(tailCircle2, tailCircle3, 0.05),
//         0.005
//     );

//     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle4, blendAmt +.04);
//     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle5, blendAmt);
//     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle6, blendAmt);
//     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle7, blendAmt);
//     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle8, blendAmt);
//     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle9, blendAmt);
//     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle10, blendAmt);
//     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle11, blendAmt);
//     tailCircleMerge = smoothMin(tailCircleMerge, tailCircle12, blendAmt);


//     float bodySDF = smoothMin(circleMerge, tailCircleMerge, spineTailBlend);




//     // ARMS /////////////////////////////////////////////////////////////////////////////////

//     float arm0Upper = lineSegmentSDF(uv, u_joints[2], u_elbows[0]);   
//     float arm0Lower = lineSegmentSDF(uv, u_elbows[0], u_steps[0]); 
//     float arm1Upper = lineSegmentSDF(uv, u_joints[2], u_elbows[1]);   
//     float arm1Lower = lineSegmentSDF(uv, u_elbows[1], u_steps[1]); 
//     float arm2Upper = lineSegmentSDF(uv, u_joints[13], u_elbows[2]);   
//     float arm2Lower = lineSegmentSDF(uv, u_elbows[2], u_steps[2]); 
//     float arm3Upper = lineSegmentSDF(uv, u_joints[13], u_elbows[3]);   
//     float arm3Lower = lineSegmentSDF(uv, u_elbows[3], u_steps[3]); 


//     float arm0SDF = min(arm0Upper, arm0Lower) - armThickness;
//     float arm1SDF = min(arm1Upper, arm1Lower) - armThickness;
//     float arm2SDF = min(arm2Upper, arm2Lower) - backArmThickness;
//     float arm3SDF = min(arm3Upper, arm3Lower) - backArmThickness;

//     bodySDF = smoothMin(bodySDF, arm0SDF, shoulderBlend);
//     bodySDF = smoothMin(bodySDF, arm1SDF, shoulderBlend);
//     bodySDF = smoothMin(bodySDF, arm2SDF, shoulderBlend);
//     bodySDF = smoothMin(bodySDF, arm3SDF, shoulderBlend);

//     // FRONT MUSCLES
//     float musclesSDF0 = distFCircle(uv, u_muscles[0], lowerMuscleRadius);
//     float musclesSDF1  = distFCircle(uv, u_muscles[1], upperMuscleRadius );
//     float musclesSDF2 = distFCircle(uv, u_muscles[2], lowerMuscleRadius);
//     float musclesSDF3  = distFCircle(uv, u_muscles[3], upperMuscleRadius );

//     // not using these two
//    // bodySDF = smoothMin(bodySDF, musclesSDF0 , muscleBlend );
//     // bodySDF = smoothMin(bodySDF, musclesSDF2 , muscleBlend );

//     bodySDF = smoothMin(bodySDF, musclesSDF1 , muscleBlend ); 
//     bodySDF = smoothMin(bodySDF, musclesSDF3 , muscleBlend ); 

//     // BACK MUSCLES
//     float musclesSDF4 = distFCircle(uv, u_muscles[4], lowerMuscleRadius);
//     float musclesSDF5  = distFCircle(uv, u_muscles[5], upperMuscleRadius );
//     float musclesSDF6 = distFCircle(uv, u_muscles[6], lowerMuscleRadius);
//     float musclesSDF7  = distFCircle(uv, u_muscles[7], upperMuscleRadius );

//     // not using these two
//     // bodySDF = smoothMin(bodySDF, musclesSDF4 , muscleBlend );
//     // bodySDF = smoothMin(bodySDF, musclesSDF6 , muscleBlend );

//     bodySDF = smoothMin(bodySDF, musclesSDF5 , backMuscleBlend);
//     bodySDF = smoothMin(bodySDF, musclesSDF7 , backMuscleBlend); 



//     // STEPS ///////////////////////////////////////////////////////////////////////

//     float stepSDF0 = distFCircle(uv, u_steps[0], stepRadius);
//     float stepSDF1 = distFCircle(uv, u_steps[1], stepRadius);
//     float stepSDF2 = distFCircle(uv, u_steps[2], stepRadius);
//     float stepSDF3 = distFCircle(uv, u_steps[3], stepRadius);

//     bodySDF = smoothMin(bodySDF, stepSDF0, stepBlend);
//     bodySDF = smoothMin(bodySDF, stepSDF1, stepBlend);
//     bodySDF = smoothMin(bodySDF, stepSDF2, stepBlend);
//     bodySDF = smoothMin(bodySDF, stepSDF3, stepBlend);

//     // FINGERS ////////////////////////////////////////////////////////////////////////////

//     float fingerLine0 = lineSegmentSDF(uv, u_fingers[0], u_steps[0]) - fingerThickness;
//     float fingerLine1 = lineSegmentSDF(uv, u_fingers[1], u_steps[0]) - fingerThickness;
//     float fingerLine2 = lineSegmentSDF(uv, u_fingers[2], u_steps[0]) - fingerThickness;
//     float fingerLine3 = lineSegmentSDF(uv, u_fingers[3], u_steps[0]) - fingerThickness;
//     float fingerLine4 = lineSegmentSDF(uv, u_fingers[4], u_steps[0]) - fingerThickness;

//     float fingerLine5 = lineSegmentSDF(uv, u_fingers[5], u_steps[1]) - fingerThickness;
//     float fingerLine6 = lineSegmentSDF(uv, u_fingers[6], u_steps[1]) - fingerThickness;
//     float fingerLine7 = lineSegmentSDF(uv, u_fingers[7], u_steps[1]) - fingerThickness;
//     float fingerLine8 = lineSegmentSDF(uv, u_fingers[8], u_steps[1]) - fingerThickness;
//     float fingerLine9 = lineSegmentSDF(uv, u_fingers[9], u_steps[1]) - fingerThickness;

//     float fingerLine10 = lineSegmentSDF(uv, u_fingers[10], u_steps[2]) - fingerThickness;
//     float fingerLine11 = lineSegmentSDF(uv, u_fingers[11], u_steps[2]) - fingerThickness;
//     float fingerLine12 = lineSegmentSDF(uv, u_fingers[12], u_steps[2]) - fingerThickness;
//     float fingerLine13 = lineSegmentSDF(uv, u_fingers[13], u_steps[2]) - fingerThickness;
//     float fingerLine14 = lineSegmentSDF(uv, u_fingers[14], u_steps[2]) - fingerThickness;

//     float fingerLine15 = lineSegmentSDF(uv, u_fingers[15], u_steps[3]) - fingerThickness;
//     float fingerLine16 = lineSegmentSDF(uv, u_fingers[16], u_steps[3]) - fingerThickness;
//     float fingerLine17 = lineSegmentSDF(uv, u_fingers[17], u_steps[3]) - fingerThickness;
//     float fingerLine18 = lineSegmentSDF(uv, u_fingers[18], u_steps[3]) - fingerThickness;
//     float fingerLine19 = lineSegmentSDF(uv, u_fingers[19], u_steps[3]) - fingerThickness;

//     bodySDF = smoothMin(bodySDF, fingerLine0, fingerLineBlend );
//     bodySDF = smoothMin(bodySDF, fingerLine1,fingerLineBlend );
//     bodySDF = smoothMin(bodySDF, fingerLine2, fingerLineBlend );
//     bodySDF = smoothMin(bodySDF, fingerLine3, fingerLineBlend );
//     bodySDF = smoothMin(bodySDF, fingerLine4, fingerLineBlend);
    
//     bodySDF = smoothMin(bodySDF, fingerLine5, fingerLineBlend );
//     bodySDF = smoothMin(bodySDF, fingerLine6, fingerLineBlend );
//     bodySDF = smoothMin(bodySDF, fingerLine7, fingerLineBlend );
//     bodySDF = smoothMin(bodySDF, fingerLine8, fingerLineBlend );
//     bodySDF = smoothMin(bodySDF, fingerLine9, fingerLineBlend);
    
//     bodySDF = smoothMin(bodySDF, fingerLine10, fingerLineBlend );
//     bodySDF = smoothMin(bodySDF, fingerLine11, fingerLineBlend );
//     bodySDF = smoothMin(bodySDF, fingerLine12, fingerLineBlend );
//     bodySDF = smoothMin(bodySDF, fingerLine13, fingerLineBlend );
//     bodySDF = smoothMin(bodySDF, fingerLine14, fingerLineBlend);
    
//     bodySDF = smoothMin(bodySDF, fingerLine15, fingerLineBlend );
//     bodySDF = smoothMin(bodySDF, fingerLine16, fingerLineBlend );
//     bodySDF = smoothMin(bodySDF, fingerLine17, fingerLineBlend );
//     bodySDF = smoothMin(bodySDF, fingerLine18, fingerLineBlend );
//     bodySDF = smoothMin(bodySDF, fingerLine19, fingerLineBlend);


//       // F LEFT
//       float fingerSDF0 = distFCircle(uv, u_fingers[0], fingerRadius);
//       float fingerSDF1 = distFCircle(uv, u_fingers[1], fingerRadius);
//       float fingerSDF2 = distFCircle(uv, u_fingers[2], fingerRadius);
//       float fingerSDF3 = distFCircle(uv, u_fingers[3], fingerRadius);
//       float fingerSDF4 = distFCircle(uv, u_fingers[4], fingerRadius); 
//       // F RIGHT
//       float fingerSDF5 = distFCircle(uv, u_fingers[5], fingerRadius);
//       float fingerSDF6 = distFCircle(uv, u_fingers[6], fingerRadius);
//       float fingerSDF7 = distFCircle(uv, u_fingers[7], fingerRadius);
//       float fingerSDF8 = distFCircle(uv, u_fingers[8], fingerRadius);
//       float fingerSDF9 = distFCircle(uv, u_fingers[9], fingerRadius); 
//       // B LEFT
//       float fingerSDF10 = distFCircle(uv, u_fingers[10], fingerRadius);
//       float fingerSDF11 = distFCircle(uv, u_fingers[11], fingerRadius);
//       float fingerSDF12 = distFCircle(uv, u_fingers[12], fingerRadius);
//       float fingerSDF13 = distFCircle(uv, u_fingers[13], fingerRadius);
//       float fingerSDF14 = distFCircle(uv, u_fingers[14], fingerRadius);
//       // BACK r
//       float fingerSDF15 = distFCircle(uv, u_fingers[15], fingerRadius);
//       float fingerSDF16 = distFCircle(uv, u_fingers[16], fingerRadius);
//       float fingerSDF17 = distFCircle(uv, u_fingers[17], fingerRadius);
//       float fingerSDF18 = distFCircle(uv, u_fingers[18], fingerRadius);
//       float fingerSDF19 = distFCircle(uv, u_fingers[19], fingerRadius);

//       bodySDF = smoothMin(bodySDF, fingerSDF0, fingerBlend);
//       bodySDF = smoothMin(bodySDF, fingerSDF1, fingerBlend);
//        bodySDF = smoothMin(bodySDF, fingerSDF2, fingerBlend);
//       bodySDF = smoothMin(bodySDF, fingerSDF3, fingerBlend);
//        bodySDF = smoothMin(bodySDF, fingerSDF4, fingerBlend);

//       bodySDF = smoothMin(bodySDF, fingerSDF5, fingerBlend);
//       bodySDF = smoothMin(bodySDF, fingerSDF6, fingerBlend);
//       bodySDF = smoothMin(bodySDF, fingerSDF7, fingerBlend);
//       bodySDF = smoothMin(bodySDF, fingerSDF8, fingerBlend);
//       bodySDF = smoothMin(bodySDF, fingerSDF9, fingerBlend);

//       bodySDF = smoothMin(bodySDF, fingerSDF10, fingerBlend);
//       bodySDF = smoothMin(bodySDF, fingerSDF11, fingerBlend);
//       bodySDF = smoothMin(bodySDF, fingerSDF12, fingerBlend);
//       bodySDF = smoothMin(bodySDF, fingerSDF13, fingerBlend);
//       bodySDF = smoothMin(bodySDF, fingerSDF14, fingerBlend);

//       bodySDF = smoothMin(bodySDF, fingerSDF15, fingerBlend);
//       bodySDF = smoothMin(bodySDF, fingerSDF16, fingerBlend);
//       bodySDF = smoothMin(bodySDF, fingerSDF17, fingerBlend);
//       bodySDF = smoothMin(bodySDF, fingerSDF18, fingerBlend);
//       bodySDF = smoothMin(bodySDF, fingerSDF19, fingerBlend);









//     ///////////////////////////////////////////////////////////////////////////////////////

//     float bodyMask = smoothstep(0.0, 0.002, -bodySDF);
//     vec3 body = endColor * bodyMask;



//     //////////////////////////////////////////////////

//     float spineMask = smoothstep(0.0, 0.002, -circleMerge);
//     vec3 spine = startColor * spineMask;
//     color += vec3(0.0, 0.0, 1.0) * bodyMask;
//     alpha = max(alpha, bodyMask);

//     // Tail dots (yellow)
//     // for (int i = 0; i < 13; i++) {
//     //     vec2 tailUV = u_tail[i] - 0.5;
//     //     float tailMask = step(distance(uv, tailUV), 0.008);
//     //     color += vec3(1.0, 1.0, 0.0) * tailMask;
//     //     alpha = max(alpha, tailMask);
//     // }

//     // Snout and head
//     // color += vec3(1.0, 0.0, 1.0) * step(distance(uv, snoutUV), 0.008);
//     // alpha = max(alpha, step(distance(uv, snoutUV), 0.008));

//     // color += vec3(0.0, 1.0, 1.0) * step(distance(uv, headUV), 0.008);
//     // alpha = max(alpha, step(distance(uv, headUV), 0.008));

//     // Steps
//     // for (int i = 0; i < 4; i++) {
//     //     vec2 stepUV = u_steps[i] - 0.5;
//     //     float stepMask = step(distance(uv, stepUV), 0.01);
//     //     color += vec3(1.0, 0.0, 1.0) * stepMask;
//     //     alpha = max(alpha, stepMask);
//     // }

//     // Elbows
//     // for (int i = 0; i < 4; i++) {
//     //     vec2 elbowUV = u_elbows[i] - 0.5;
//     //     float elbowMask = step(distance(uv, elbowUV), 0.004);
//     //     color += vec3(1.0, 0.0, 1.0) * elbowMask;
//     //     alpha = max(alpha, elbowMask);
//     // }

//     // Shoulders
//     // for (int i = 0; i < 4; i++) {
//     //     vec2 shoulderUV = u_shoulders[i] - 0.5;
//     //     float shoulderMask = step(distance(uv, shoulderUV), 0.004);
//     //     color += vec3(1.0, 0.0, 1.0) * shoulderMask;
//     //     alpha = max(alpha, shoulderMask);
//     // }
//  //body + color
//     return vec4( body, bodyMask); //bodyMask
// } 
// `);