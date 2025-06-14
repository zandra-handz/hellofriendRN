import React from 'react';

const useDynamicUIFunctions = () => {
  const getScoreColor = (range, score) => {
    const [min, max] = range;
    const clampedScore = Math.max(min, Math.min(score, max));
    const percent = (clampedScore - min) / (max - min);

    const r =
      percent < 0.5
        ? Math.round(255 * (percent * 2)) // 0 → 255 (green to yellow)
        : 255; // red stays max after midpoint

    const g =
      percent < 0.5
        ? 255 // green stays max before midpoint
        : Math.round(255 * (1 - (percent - 0.5) * 2)); // 255 → 0 (yellow to red)

    return `rgb(${r}, ${g}, 0)`;
  };

  return { getScoreColor };
};



export default useDynamicUIFunctions;
