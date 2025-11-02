export const generateGradientColorsMap = (data, startColor, endColor) => {
  const hexToRgb = (hex) => hex.match(/\w\w/g).map((c) => parseInt(c, 16));
  const rgbToHex = (rgb) =>
    '#' + rgb.map((c) => c.toString(16).padStart(2, '0')).join('');

  const start = hexToRgb(startColor);
  const end = hexToRgb(endColor);

 

  const generateColorForIndex = (index, total) => {
    const t = index / Math.max(total - 1, 1);
    const interpolated = start.map((s, j) =>
      Math.round(s + (end[j] - s) * t)
    );
    return rgbToHex(interpolated);
  };

  // Convert to lookup object
  return Object.fromEntries(
    data.map((item, index) => [
      item.id, // user_category !!! WILL BE STRING BECAUSE OBJECT KEYS ARE ALWAYS STRINGS
      generateColorForIndex(index, data.length), // color
    ])
  );
};