import React from 'react';
import { View, StyleSheet } from 'react-native';
import PushPinSolidSvg from '../assets/svgs/push-pin-solid.svg';
import ArrowRightCircleOutlineSvg from '../assets/svgs/arrow-right-circle-outline.svg';
import ArrowLeftCircleOutlineSvg from '../assets/svgs/arrow-left-circle-outline.svg';
import ArrowFullScreenOutlineSvg from '../assets/svgs/arrow-full-screen-outline.svg';

const IconDynamicBase = ({ icons, choices, selectedChoice, svgWidth = 50, svgHeight = 50, svgColor = 'black' }) => {
  const adjustLists = (icons, choices) => {
    let adjustedIcons = [...icons];
    let adjustedChoices = [...choices];

    if (icons.length > choices.length) {
      adjustedIcons = icons.filter((_, index) => index % 2 === 0);
    } else if (icons.length < choices.length) {
      const diff = choices.length - icons.length;
      const spreadIcons = [];

      for (let i = 0; i < choices.length; i++) {
        spreadIcons.push(icons[i % icons.length]);
      }

      adjustedIcons = spreadIcons;
    }

    return { adjustedIcons, adjustedChoices };
  };

  const { adjustedIcons, adjustedChoices } = adjustLists(icons, choices);

  // Find the index of the selected choice
  const selectedIndex = adjustedChoices.indexOf(selectedChoice);
  const SelectedSvgIcon = selectedIndex !== -1 ? adjustedIcons[selectedIndex] : null;

  return (
    <View style={styles.container}>
      {SelectedSvgIcon && (
        <View style={styles.iconContainer}>
          <SelectedSvgIcon width={svgWidth} height={svgHeight} fill={svgColor} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  iconContainer: {
    margin: 8,
  },
});

export default IconDynamicBase;
