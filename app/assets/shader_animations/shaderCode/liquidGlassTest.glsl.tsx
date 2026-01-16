export const LAST_SELECTED_GLSL = `
uniform vec2 u_lastSelected;
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_aspect; 

// SDF of a rounded rectangle
float sdfRect(vec2 center, vec2 size, vec2 p, float r) {
    vec2 p_rel = p - center;
    vec2 q = abs(p_rel) - size;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float sdfRectUV(vec2 centerUV, vec2 sizeUV, vec2 uv, float radiusUV) {
    // Everything in UV space (0..1)
    vec2 p_rel = uv - centerUV;
    vec2 q = abs(p_rel) - sizeUV;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radiusUV;
}

// Calculate normal vector based on SDF gradient (without dFdx/dFdy)
vec3 getNormal(float sd, float thickness, vec2 fragCoord, vec2 center, float rectWidth, float rectHeight, float cornerRadius) {
    // Manually calculate gradient using finite differences
    float eps = 2.0; // Increased epsilon for better gradient calculation
    float sd_center = sdfRect(center, vec2(rectWidth, rectHeight), fragCoord, cornerRadius);
    float sd_x = sdfRect(center, vec2(rectWidth, rectHeight), fragCoord + vec2(eps, 0.0), cornerRadius);
    float sd_y = sdfRect(center, vec2(rectWidth, rectHeight), fragCoord + vec2(0.0, eps), cornerRadius);
    
    float dx = sd_x - sd_center;
    float dy = sd_y - sd_center;
    
    // Normalize the 2D gradient
    float grad_len = length(vec2(dx, dy));
    if (grad_len > 0.0001) {
        dx /= grad_len;
        dy /= grad_len;
    }
    
    // The cosine and sine between normal and the xy plane.
    float n_cos = max(thickness + sd, 0.0) / thickness;
    float n_sin = sqrt(max(1.0 - n_cos * n_cos, 0.0)); // Ensure non-negative
    
    // Return normalized 3D normal
    vec3 normal = vec3(dx * n_cos, dy * n_cos, n_sin);
    float len = length(normal);
    if (len > 0.0001) {
        normal /= len;
    }
    return normal;
}

// Height function (like in reference)
float height(float sd, float thickness) {
    if (sd >= 0.0) {
        return 0.0;
    }
    if (sd < -thickness) {
        return thickness;
    }
    
    float x = thickness + sd;
    return sqrt(max(thickness * thickness - x * x, 0.0)); // Ensure non-negative
}

// Background with stripes across entire screen - APPLY TRANSFORMS HERE
vec3 bgStrips(vec2 uv) {
    // Apply the same transforms you have in main()
    uv -= vec2(0.5); 
    uv.x *= u_aspect;
    uv.x /= u_scale;
    
    // Convert to pixel coordinates for stripes
    float pixelY = uv.y * u_resolution.y;
    
    // Create alternating stripes across entire screen
    if (mod(pixelY / 20.0, 2.0) < 1.0) {
        return vec3(0.0, 0.5, 1.0); // Blue stripe
    } else {
        return vec3(0.9, 0.9, 0.9); // Light gray stripe
    }
}

// Combined background - ONLY stripes now
vec3 bg(vec2 uv) {
    return bgStrips(uv);
}

vec4 main(vec2 fragCoord) {
    // Convert to UV (0..1)
    vec2 uv = fragCoord / u_resolution;
    
    // Parameters (adjusted for visual appearance)
     
//     uv -= vec2(0.5); 
//     uv.x *= u_aspect;
//    uv.x /= u_scale;

    float thickness = 10.0 * u_scale;        // Thinner glass
    float index = 2.0;                       // Higher refractive index  
    float base_height = thickness * 12.0;    // Deeper glass
    float color_mix = 0.3;
    vec3 color_base = vec3(1.0, 1.0, 1.0); // White glass
     
    vec2 center = u_lastSelected * u_resolution;
    
    // If no position selected yet, use center of screen
    if (length(u_lastSelected) < 0.001) {
        center = u_resolution  ;
    }
    
    // Rectangle size (in pixels, scaled)
    float rectWidth = 28.0 ;
    float rectHeight = 10.0 ;
    float cornerRadius = 64.0;
    
    // Calculate SDF
    float sd = sdfRect(center, vec2(rectWidth, rectHeight), fragCoord, cornerRadius);
    
    // Background with anti-aliasing
    float bgMix = clamp(sd / (100.0 * u_scale), 0.0, 1.0) * 0.1 + 0.9;
    vec3 bgColor = mix(vec3(0.0), bg(uv), bgMix);
    float bgAlpha = smoothstep(-4.0 * u_scale, 0.0, sd);
    
    // Inside glass area
    if (sd < 0.0) {
        // Calculate normal vector (passing necessary parameters)
        vec3 normal = getNormal(sd, thickness, fragCoord, center, rectWidth, rectHeight, cornerRadius);
        
        // Calculate height at this point
        float h = height(sd, thickness);
        
        // Ray optics refraction
        vec3 incident = vec3(0.0, 0.0, -1.0); // Looking straight down
        vec3 refract_vec;
        
        // Calculate refraction - note: air to glass, so 1.0/1.5
        // But we're inside glass looking out, so use 1.5/1.0
        float eta = 1.0 / index; // Air to glass refraction
        
        // Calculate dot product and check for total internal reflection
        float NdotI = dot(normal, incident);
        float k = 1.0 - eta * eta * (1.0 - NdotI * NdotI);
        
        if (k < 0.0) {
            // Total internal reflection - use reflection instead
            refract_vec = reflect(incident, normal);
        } else {
            // Normal refraction
            refract_vec = eta * incident - (eta * NdotI + sqrt(k)) * normal;
        }
        
        // Calculate where the refracted ray hits the base plane
        float refract_length = (h + base_height) / abs(refract_vec.z);
        
        // This is the screen coordinate where we sample the background
        vec2 coord1 = fragCoord + refract_vec.xy * refract_length * 3.5;
        
        // Ensure we stay within bounds
        coord1 = clamp(coord1, vec2(0.0), u_resolution);
        
        // Convert refracted coordinate to UV and APPLY THE SAME TRANSFORMS
        vec2 refractedUV = coord1 / u_resolution;
        refractedUV -= vec2(0.5); 
        refractedUV.x *= u_aspect;
        refractedUV.x /= u_scale;
        
        // Sample background with transformed refracted UV
        vec3 refract_color = bgStrips(refractedUV);
        
        // Reflection - simplified version
        vec3 reflect_vec = reflect(incident, normal);
        float c = clamp(abs(reflect_vec.x - reflect_vec.y), 0.0, 1.0);
        vec3 reflect_color = vec3(c, c, c);
        
        // Combine refraction and reflection
        // Use normal.z to control reflection amount (more reflection at grazing angles)
        float reflection_amount = clamp((1.0 - normal.z) * 2.0, 0.0, 1.0);
        vec3 glassColor = mix(refract_color, reflect_color, reflection_amount * 0.5);
        
        // Mix with base color
        glassColor = mix(glassColor, color_base, color_mix);
        
        // Add specular highlight in center
        vec2 toCenter = (fragCoord - center) / (rectWidth * 2.0);
        float centerDist = length(toCenter);
        float specular = 1.0 - smoothstep(0.0, 0.8, centerDist);
        specular = pow(specular, 4.0) * 0.3;
        glassColor += vec3(1.0) * specular;
        
        // Edge highlight
        float edgeDist = abs(sd) / thickness;
        float edgeHighlight = 1.0 - smoothstep(0.7, 1.0, edgeDist);
        glassColor += vec3(1.0, 1.0, 0.95) * edgeHighlight * 0.1;
        
        // Mix with background for anti-aliasing at edges
        vec3 finalColor = mix(glassColor, bgColor, 1.0 - bgAlpha);
        
        // Calculate alpha
        float glassAlpha = 1.0;
        if (sd > -thickness) {
            // At the curved edges, use the height to determine opacity
            glassAlpha = h / thickness;
        }
        
        // Apply anti-aliasing at the edge
        glassAlpha = min(glassAlpha, bgAlpha);
        
        // Ensure minimum opacity
        glassAlpha = max(glassAlpha, 0.4);
        
        return vec4(finalColor, glassAlpha);
    }
    
    // Outside glass area - just show background
    return vec4(bgColor, 1.0);
}
`;
// export const LAST_SELECTED_GLSL = `
// uniform vec2 u_lastSelected;
// uniform vec2 u_resolution;
// uniform float u_scale;
// uniform float u_aspect;

// // SDF of a rounded rectangle
// float sdfRect(vec2 center, vec2 size, vec2 p, float r) {
//     vec2 p_rel = p - center;
//     vec2 q = abs(p_rel) - size;
//     return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
// }

// // Simplified height function (like in reference)
// float height(float sd, float thickness) {
//     if (sd >= 0.0) {
//         return 0.0;
//     }
//     if (sd < -thickness) {
//         return thickness;
//     }
    
//     float x = thickness + sd;
//     return sqrt(thickness * thickness - x * x);
// }

// // Background with stripes across entire screen
// vec3 bgStrips(vec2 uv) {
//     // Convert to pixel coordinates for stripes
//     float pixelY = uv.y * u_resolution.y;
    
//     // Create alternating stripes across entire screen
//     if (mod(pixelY / 20.0, 2.0) < 1.0) {
//         return vec3(0.0, 0.5, 1.0); // Blue stripe
//     } else {
//         return vec3(0.9, 0.9, 0.9); // Light gray stripe
//     }
// }

// // Combined background - ONLY stripes now
// vec3 bg(vec2 uv) {
//     return bgStrips(uv);
// }

// vec4 main(vec2 fragCoord) {
//     // Convert to UV (0..1)
//     vec2 uv = fragCoord / u_resolution;
    
//     // Parameters (adjusted for visual appearance)
//     float thickness = 14.0 * u_scale; // Visual thickness
//     float index = 1.5; // Refractive index
//     float base_height = thickness * 8.0;
//     float color_mix = 0.3;
//     vec3 color_base = vec3(1.0, 1.0, 1.0); // White glass
    
//     // Center position - use last selected position
//     vec2 center = u_lastSelected * u_resolution;
    
//     // If no position selected yet, use center of screen
//     if (length(u_lastSelected) < 0.001) {
//         center = u_resolution * 0.5;
//     }
    
//     // Rectangle size (in pixels, scaled)
//     float rectWidth = 128.0 * u_scale;
//     float rectHeight = 64.0 * u_scale;
//     float cornerRadius = 64.0 * u_scale;
    
//     // Calculate SDF
//     float sd = sdfRect(center, vec2(rectWidth, rectHeight), fragCoord, cornerRadius);
    
//     // Background with anti-aliasing
//     float bgMix = clamp(sd / (100.0 * u_scale), 0.0, 1.0) * 0.1 + 0.9;
//     vec3 bgColor = mix(vec3(0.0), bg(uv), bgMix);
//     float bgAlpha = smoothstep(-4.0 * u_scale, 0.0, sd);
    
//     // Inside glass area
//     if (sd < 0.0) {
//         // Calculate height at this point
//         float h = height(sd, thickness);
        
//         // Create a "normal-like" vector based on SDF gradient
//         // This approximates the curvature of the glass
//         vec2 gradient = vec2(
//             sdfRect(center, vec2(rectWidth, rectHeight), fragCoord + vec2(1.0, 0.0), cornerRadius) - 
//             sdfRect(center, vec2(rectWidth, rectHeight), fragCoord - vec2(1.0, 0.0), cornerRadius),
//             sdfRect(center, vec2(rectWidth, rectHeight), fragCoord + vec2(0.0, 1.0), cornerRadius) - 
//             sdfRect(center, vec2(rectWidth, rectHeight), fragCoord - vec2(0.0, 1.0), cornerRadius)
//         );
        
//         // Normalize the gradient
//         float gradLen = length(gradient);
//         if (gradLen > 0.0001) {
//             gradient /= gradLen;
//         }
        
//         // Simulate refraction by offsetting UV based on gradient and height
//         // This mimics how the reference code uses refraction
//         float refractStrength = 0.02 * (h / thickness);
//         vec2 refractOffset = gradient * refractStrength;
        
//         // Sample background at refracted position
//         vec2 refractedUV = uv + refractOffset;
//         vec3 refractColor = bg(refractedUV);
        
//         // Add some noise/wobble to make it more liquid-like
//         float time = 0.0; // You could add a uniform for time to animate
//         float wobbleX = sin(refractedUV.y * 30.0 + time) * 0.001;
//         float wobbleY = cos(refractedUV.x * 25.0 + time) * 0.001;
//         refractColor = bg(refractedUV + vec2(wobbleX, wobbleY));
        
//         // Simulate reflection (simplified)
//         // In the reference, reflection is based on normal.z
//         // We'll approximate with gradient magnitude
//         float reflectAmount = (1.0 - abs(gradient.x) - abs(gradient.y)) * 2.0;
//         reflectAmount = clamp(reflectAmount, 0.0, 1.0);
        
//         // Simple reflection color (like in reference)
//         vec3 reflectColor = vec3(reflectAmount);
        
//         // Combine refraction and reflection like in reference
//         vec3 glassColor = mix(mix(refractColor, reflectColor, reflectAmount * 0.5), 
//                              color_base, color_mix);
        
//         // Add specular highlight in center
//         vec2 toCenter = (fragCoord - center) / (rectWidth * 2.0);
//         float centerDist = length(toCenter);
//         float specular = 1.0 - smoothstep(0.0, 0.8, centerDist);
//         specular = pow(specular, 4.0) * 0.4;
//         glassColor += vec3(1.0) * specular;
        
//         // Edge highlight
//         float edgeDist = abs(sd) / thickness;
//         float edgeHighlight = 1.0 - smoothstep(0.7, 1.0, edgeDist);
//         glassColor += vec3(1.0, 1.0, 0.95) * edgeHighlight * 0.2;
        
//         // Mix with background for anti-aliasing at edges
//         vec3 finalColor = mix(glassColor, bgColor, 1.0 - bgAlpha);
        
//         // Calculate alpha (more opaque in center, transparent at edges)
//         float glassAlpha = 1.0;
//         if (sd > -thickness) {
//             // At the curved edges, use the height to determine opacity
//             glassAlpha = h / thickness;
//             glassAlpha = mix(glassAlpha, 1.0, 0.3); // Keep some opacity
//         }
        
//         // Apply anti-aliasing at the edge
//         glassAlpha *= bgAlpha;
        
//         // Ensure we don't go below minimum opacity
//         glassAlpha = max(glassAlpha, 0.3);
        
//         return vec4(finalColor, glassAlpha);
//     }
    
//     // Outside glass area - just show background
//     return vec4(bgColor, 1.0);
// }
// `;





// export const LAST_SELECTED_GLSL = `
// uniform vec2 u_lastSelected;
// uniform vec2 u_resolution;
// uniform float u_scale;
// uniform float u_aspect;

// // SDF of a rounded rectangle
// float sdfRect(vec2 center, vec2 size, vec2 p, float r) {
//     vec2 p_rel = p - center;
//     vec2 q = abs(p_rel) - size;
//     return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
// }

// // Simplified height function (like in reference)
// float height(float sd, float thickness) {
//     if (sd >= 0.0) {
//         return 0.0;
//     }
//     if (sd < -thickness) {
//         return thickness;
//     }
    
//     float x = thickness + sd;
//     return sqrt(thickness * thickness - x * x);
// }

// // Create a more complex, visible background pattern
// vec3 bgStrips(vec2 uv) {
//     // Convert to pixel coordinates for stripes
//     float pixelY = uv.y * u_resolution.y;
    
//     // Add some horizontal variation to make distortion more visible
//     float pixelX = uv.x * u_resolution.x;
//     float horizontalPattern = sin(pixelX / 50.0) * 0.3 + 0.7;
    
//     // Create alternating stripes with horizontal variation
//     if (mod(pixelY / 20.0, 2.0) < 1.0) {
//         return vec3(0.0, 0.5, 1.0) * horizontalPattern; // Blue stripe with variation
//     } else {
//         return vec3(0.9, 0.9, 0.9) * (1.0 - horizontalPattern * 0.2); // Light gray stripe
//     }
// }

// // Add diagonal lines for more distortion visibility
// vec3 bgPattern(vec2 uv) {
//     vec3 stripes = bgStrips(uv);
    
//     // Add diagonal lines
//     float diagonal1 = sin((uv.x + uv.y) * 50.0) * 0.5 + 0.5;
//     float diagonal2 = cos((uv.x - uv.y) * 40.0) * 0.5 + 0.5;
    
//     // Darken areas where diagonals intersect
//     float pattern = diagonal1 * diagonal2;
//     stripes *= mix(0.8, 1.2, pattern);
    
//     // Add some dots/grid
//     float gridX = mod(uv.x * u_resolution.x, 40.0) / 40.0;
//     float gridY = mod(uv.y * u_resolution.y, 40.0) / 40.0;
//     float grid = step(0.95, gridX) + step(0.95, gridY);
//     stripes = mix(stripes, vec3(0.2, 0.3, 0.6), grid * 0.3);
    
//     return stripes;
// }

// // Combined background
// vec3 bg(vec2 uv) {
//     return bgPattern(uv);
// }

// vec4 main(vec2 fragCoord) {
//     // Convert to UV (0..1)
//     vec2 uv = fragCoord / u_resolution;
    
//     // Parameters - INCREASED for stronger effect
//     float thickness = 20.0 * u_scale; // Increased thickness
//     float index = 1.8; // Higher refractive index for stronger bending
//     float base_height = thickness * 8.0;
//     float color_mix = 0.2; // Less white mix for clearer glass
    
//     // Center position
//     vec2 center = u_lastSelected * u_resolution;
    
//     // If no position selected yet, use center of screen
//     if (length(u_lastSelected) < 0.001) {
//         center = u_resolution * 0.5;
//     }
    
//     // Rectangle size (in pixels, scaled)
//     float rectWidth = 150.0 * u_scale; // Larger rectangle
//     float rectHeight = 80.0 * u_scale;
//     float cornerRadius = 70.0 * u_scale;
    
//     // Calculate SDF
//     float sd = sdfRect(center, vec2(rectWidth, rectHeight), fragCoord, cornerRadius);
    
//     // Get base background color
//     vec3 baseBgColor = bg(uv);
    
//     // Background with anti-aliasing at edges
//     float bgMix = clamp(sd / (100.0 * u_scale), 0.0, 1.0) * 0.1 + 0.9;
//     vec3 bgColor = mix(vec3(0.0), baseBgColor, bgMix);
//     float bgAlpha = smoothstep(-6.0 * u_scale, 0.0, sd); // Softer edge
    
//     // Calculate gradient for normal approximation - MORE PRECISE
//     vec2 eps = vec2(2.0, 0.0); // Smaller epsilon for more precise gradient
    
//     vec2 gradient = vec2(
//         sdfRect(center, vec2(rectWidth, rectHeight), fragCoord + eps.xy, cornerRadius) - 
//         sdfRect(center, vec2(rectWidth, rectHeight), fragCoord - eps.xy, cornerRadius),
//         sdfRect(center, vec2(rectWidth, rectHeight), fragCoord + eps.yx, cornerRadius) - 
//         sdfRect(center, vec2(rectWidth, rectHeight), fragCoord - eps.yx, cornerRadius)
//     );
    
//     // Normalize gradient
//     float gradLen = length(gradient);
//     vec2 normal2D = vec2(0.0);
//     if (gradLen > 0.0001) {
//         normal2D = gradient / gradLen;
//     }
    
//     // Inside glass area
//     if (sd < 0.0) {
//         // Calculate height and curvature
//         float h = height(sd, thickness);
        
//         // STRONGER refraction effect
//         // The closer to edge, the stronger the refraction
//         float edgeFactor = 1.0 - smoothstep(-thickness * 0.8, 0.0, sd);
//         float centerFactor = 1.0 - edgeFactor; // Weaker in center
        
//         // Create refraction offset - MUCH STRONGER
//         // Direction depends on normal, magnitude depends on position
//         float refractStrength = 0.08 * edgeFactor + 0.02 * centerFactor; // Increased from 0.02
        
//         // Add curvature-based distortion
//         float curvature = h / thickness;
//         refractStrength *= (1.0 + curvature * 0.5);
        
//         // Apply refraction offset
//         vec2 refractOffset = normal2D * refractStrength;
        
//         // Add swirling/wavy distortion for liquid effect
//         vec2 toCenter = (fragCoord - center) / (rectWidth * 0.5);
//         float angle = atan(toCenter.y, toCenter.x);
//         float radius = length(toCenter);
        
//         // Swirl distortion - stronger at edges
//         float swirlAmount = 0.03 * edgeFactor;
//         angle += swirlAmount * (1.0 - radius) * 10.0;
        
//         // Wave distortion
//         float waveX = sin(uv.y * 30.0 + angle * 5.0) * 0.01 * edgeFactor;
//         float waveY = cos(uv.x * 25.0 + angle * 3.0) * 0.01 * edgeFactor;
        
//         // Combine all distortions
//         vec2 distortion = refractOffset + vec2(waveX, waveY);
        
//         // Rotate distortion for swirl effect
//         float ca = cos(swirlAmount);
//         float sa = sin(swirlAmount);
//         distortion = vec2(
//             distortion.x * ca - distortion.y * sa,
//             distortion.x * sa + distortion.y * ca
//         );
        
//         // Sample distorted background
//         vec2 distortedUV = uv + distortion;
//         // Wrap UV to avoid edge issues
//         distortedUV = fract(distortedUV);
        
//         vec3 distortedColor = bg(distortedUV);
        
//         // For comparison, also sample slightly different offset
//         vec2 offset2 = normal2D * refractStrength * 0.5;
//         vec3 color2 = bg(uv + offset2);
        
//         // Mix between different distortions for more complex look
//         distortedColor = mix(distortedColor, color2, 0.3);
        
//         // Calculate glass appearance
//         vec3 glassColor = distortedColor;
        
//         // Add slight blue tint to glass
//         vec3 glassTint = vec3(0.95, 0.97, 1.0);
//         glassColor *= glassTint;
        
//         // Add reflection (specular highlights)
//         float reflectivity = 0.3 * edgeFactor;
        
//         // Directional reflection based on normal
//         float reflection = abs(normal2D.x) * 0.5 + abs(normal2D.y) * 0.5;
//         reflection = pow(reflection, 2.0) * reflectivity;
        
//         // Center highlight (specular)
//         float centerDist = length(fragCoord - center) / (rectWidth * 0.5);
//         float specular = 1.0 - smoothstep(0.0, 0.6, centerDist);
//         specular = pow(specular, 8.0) * 0.5;
        
//         // Edge highlight (fresnel)
//         float fresnel = 1.0 - smoothstep(0.7, 1.0, edgeFactor);
//         fresnel = pow(fresnel, 2.0) * 0.3;
        
//         // Apply highlights
//         glassColor += vec3(1.0) * (specular + fresnel);
//         glassColor = mix(glassColor, vec3(reflection), reflectivity * 0.5);
        
//         // Calculate opacity - clear in center, more visible at edges
//         float glassAlpha = 0.85; // Base transparency
//         glassAlpha *= mix(0.7, 1.0, edgeFactor); // More opaque at edges
        
//         // Apply edge anti-aliasing
//         glassAlpha *= bgAlpha;
        
//         // Blend with background for smooth transition
//         vec3 finalColor = mix(glassColor, bgColor, 1.0 - bgAlpha);
        
//         return vec4(finalColor, glassAlpha);
//     }
    
//     // Outside glass area - just show background
//     return vec4(bgColor, 1.0);
// }`