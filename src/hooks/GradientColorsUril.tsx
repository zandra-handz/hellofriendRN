export const generateGradientColors = (userCategoryIds, startColor, endColor) => {
 console.log(userCategoryIds)
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

//   const friend = listData?.[0]?.friend;
//   console.log(`friend`, friend)
 
  return userCategoryIds.map((item, index) => ({
    user_category: item, //item.id is only for if we are passing in userCategory objects
    color: generateColorForIndex(index, userCategoryIds.length),
    // friend: friend, // to match with new friend to guard against animating leaves too early
  }));
};



export const calculatePercentage = (
  numbers: number[],
  total: number,
): number[] => {
  const percentageArray: number[] = [];

  numbers.forEach(number => {
    const percentage = Math.round((number.size / total) * 100);
    percentageArray.push(percentage);
  });

  console.log(`calculating percentages: `, percentageArray);

  return percentageArray;
};
