import { View, StyleSheet } from "react-native";

const IconDynamicBase = ({
  icons,
  choices,
  selectedChoice,
  svgWidth = 50,
  svgHeight = 50,
  svgColor = "black",
}) => {
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
  const SelectedSvgIcon =
    selectedIndex !== -1 ? adjustedIcons[selectedIndex] : null;

  return (
    <View style={styles.container}>
      {SelectedSvgIcon && (
        <View style={styles.iconContainer}>
          <SelectedSvgIcon
            width={svgWidth}
            height={svgHeight}
            color={svgColor}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  iconContainer: {
    margin: 0,
  },
});

export default IconDynamicBase;
