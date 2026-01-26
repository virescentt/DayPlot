import React from 'react';
import { Svg, Line } from 'react-native-svg';

export default function Arrow({ length = 20, thickness = 2, color = '#3c6674', direction = 'up' }) {
  let rotation = 0;
  switch(direction) {
    case 'up': rotation = 0; break;
    case 'down': rotation = 180; break;
    case 'left': rotation = -90; break;
    case 'right': rotation = 90; break;
  }

  return (
    <Svg
      height={length}
      width={length}
      style={{ transform: [{ rotate: `${rotation}deg` }] }}
    >
      <Line
        x1={length/2}
        y1={0}
        x2={length/2}
        y2={length}
        stroke={color}
        strokeWidth={thickness}
      />
      <Line
        x1={length/4}
        y1={length/4}
        x2={length/2}
        y2={0}
        stroke={color}
        strokeWidth={thickness}
      />
      <Line
        x1={length*3/4}
        y1={length/4}
        x2={length/2}
        y2={0}
        stroke={color}
        strokeWidth={thickness}
      />
    </Svg>
  );
}