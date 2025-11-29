import React from 'react';
import {
  Canvas,
  Path,
  Group,
  Circle,
  useValue,
  useClock,
  useValueEffect,
  runSpring,
  SpringConfig
} from '@shopify/react-native-skia';

// Types
interface Point {
  x: number;
  y: number;
}

interface Chain {
  joints: Point[];
  angles: number[];
}

// Spring configuration for smooth animation
const springConfig: SpringConfig = {
  mass: 1,
  stiffness: 100,
  damping: 10,
};

class SkiaChain {
  joints: Point[] = [];
  angles: number[] = [];
  
  constructor(origin: Point, segments: number, length: number) {
    for (let i = 0; i < segments; i++) {
      this.joints.push({ x: origin.x, y: origin.y + i * length });
      this.angles.push(0);
    }
  }
  
  resolve(target: Point) {
    // FABRIK-like solver
    this.joints[0] = target;
    for (let i = 1; i < this.joints.length; i++) {
      const dx = this.joints[i-1].x - this.joints[i].x;
      const dy = this.joints[i-1].y - this.joints[i].y;
      this.angles[i] = Math.atan2(dy, dx);
      
      const dist = 64; // segment length
      this.joints[i] = {
        x: this.joints[i-1].x - Math.cos(this.angles[i]) * dist,
        y: this.joints[i-1].y - Math.sin(this.angles[i]) * dist
      };
    }
  }
}

export const LizardSkia = () => {
  const clock = useClock();
  const bodyWidth = [52, 58, 40, 60, 68, 71, 65, 50, 28, 15, 11, 9, 7, 7];
  
  // Animation values
  const time = useValue(0);
  const headTargetX = useValue(200);
  const headTargetY = useValue(200);
  const bodyPath = useValue(() => new Path());
  const legs = useValue<Array<{shoulder: Point, foot: Point}>>([]);
  const eye1Pos = useValue({ x: 0, y: 0 });
  const eye2Pos = useValue({ x: 0, y: 0 });

  // Animation loop
  useValueEffect(clock, () => {
    time.current = clock.current / 1000;
    
    // Animate head target
    const newTargetX = 200 + Math.cos(time.current) * 50;
    const newTargetY = 200 + Math.sin(time.current * 0.7) * 30;
    
    runSpring(clock, headTargetX, newTargetX, springConfig);
    runSpring(clock, headTargetY, newTargetY, springConfig);
    
    // Calculate lizard geometry
    const center = { x: headTargetX.current, y: headTargetY.current };
    const spine = new SkiaChain(center, 14, 64);
    spine.resolve(center);
    
    // Calculate body outline
    const bodyPoints: Point[] = [];
    
    // Right side
    for (let i = 0; i < spine.joints.length; i++) {
      const point = getOffsetPoint(spine, i, Math.PI/2, 0, bodyWidth);
      bodyPoints.push(point);
    }
    
    // Left side (reverse)
    for (let i = spine.joints.length - 1; i >= 0; i--) {
      const point = getOffsetPoint(spine, i, -Math.PI/2, 0, bodyWidth);
      bodyPoints.push(point);
    }
    
    // Head points
    bodyPoints.push(getOffsetPoint(spine, 0, -Math.PI/6, -8, bodyWidth));
    bodyPoints.push(getOffsetPoint(spine, 0, 0, -6, bodyWidth));
    bodyPoints.push(getOffsetPoint(spine, 0, Math.PI/6, -8, bodyWidth));
    
    // Update body path
    const path = new Path();
    if (bodyPoints.length > 0) {
      path.moveTo(bodyPoints[0].x, bodyPoints[0].y);
      for (let i = 1; i < bodyPoints.length; i++) {
        path.lineTo(bodyPoints[i].x, bodyPoints[i].y);
      }
      path.close();
    }
    bodyPath.current = path;
    
    // Calculate legs
    const newLegs = [];
    for (let i = 0; i < 4; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const bodyIndex = i < 2 ? 3 : 7;
      const angle = i < 2 ? Math.PI/4 : Math.PI/3;
      
      const shoulder = getOffsetPoint(spine, bodyIndex, Math.PI/2 * side, -20, bodyWidth);
      const baseFoot = getOffsetPoint(spine, bodyIndex, angle * side, 80, bodyWidth);
      
      // Animate legs
      const foot = {
        x: baseFoot.x + Math.sin(time.current * 2 + i) * 15,
        y: baseFoot.y + Math.cos(time.current * 2 + i) * 8
      };
      
      newLegs.push({ shoulder, foot });
    }
    legs.current = newLegs;
    
    // Update eye positions
    eye1Pos.current = getOffsetPoint(spine, 0, 3*Math.PI/5, -7, bodyWidth);
    eye2Pos.current = getOffsetPoint(spine, 0, -3*Math.PI/5, -7, bodyWidth);
  });

  return (
    <Canvas style={{ flex: 1, backgroundColor: '#1a1a2e' }}>
      {/* Body */}
      <Path 
        path={bodyPath} 
        color="#52796f" 
        style="fill"
      />
      <Path
        path={bodyPath}
        color="#ffffff"
        style="stroke"
        strokeWidth={4}
      />
      
      {/* Legs */}
      {legs.current.map((leg, i) => (
        <Group key={i}>
          {/* Outer leg stroke */}
          <Path
            path={() => {
              const path = new Path();
              path.moveTo(leg.shoulder.x, leg.shoulder.y);
              const midX = (leg.shoulder.x + leg.foot.x) / 2;
              path.cubicTo(
                midX, leg.shoulder.y - 40,
                midX, leg.foot.y + 40,
                leg.foot.x, leg.foot.y
              );
              return path;
            }}
            color="#ffffff"
            style="stroke"
            strokeWidth={20}
          />
          {/* Inner leg fill */}
          <Path
            path={() => {
              const path = new Path();
              path.moveTo(leg.shoulder.x, leg.shoulder.y);
              const midX = (leg.shoulder.x + leg.foot.x) / 2;
              path.cubicTo(
                midX, leg.shoulder.y - 40,
                midX, leg.foot.y + 40,
                leg.foot.x, leg.foot.y
              );
              return path;
            }}
            color="#52796f"
            style="stroke"
            strokeWidth={16}
          />
        </Group>
      ))}
      
      {/* Eyes */}
      <Circle
        cx={eye1Pos.current.x}
        cy={eye1Pos.current.y}
        r={12}
        color="white"
      />
      <Circle
        cx={eye2Pos.current.x}
        cy={eye2Pos.current.y}
        r={12}
        color="white"
      />
    </Canvas>
  );
};

// Helper function
function getOffsetPoint(spine: Chain, index: number, angleOffset: number, lengthOffset: number, bodyWidth: number[]): Point {
  const joint = spine.joints[index];
  const angle = spine.angles[index] + angleOffset;
  const radius = bodyWidth[index] + lengthOffset;
  
  return {
    x: joint.x + Math.cos(angle) * radius,
    y: joint.y + Math.sin(angle) * radius
  };
}