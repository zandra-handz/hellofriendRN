import React, { useMemo} from "react";
import { Pressable, StyleSheet, TextStyle } from "react-native";
import OptionNoToggle from "./OptionNoToggle";
import SvgIcon from "@/app/styles/SvgIcons";
import useUserPoints from "@/src/hooks/useUserPoints";

interface Props {
  label: string;
  icon?: React.ReactElement;
  primaryColor: string;
  backgroundColor: string;
  buttonColor: string;
  textStyle: TextStyle;
  buttonPadding?: number;
}

const AddPointsButton: React.FC<Props> = ({
 
  icon,
  primaryColor,
  backgroundColor,
  buttonColor,
  textStyle,
  buttonPadding = 4,
}) => {
  const { addPoints, totalPoints } = useUserPoints();

  const handleAddPoints = () => {
    console.log('adding points')
    addPoints({ amount: 1, reason: "manual_add" });
  };

  const label = useMemo(() => {
    return `Total points: ${totalPoints}`
    
  }, [totalPoints]);

  return (
    <OptionNoToggle
      label={label}
      icon={icon}
      primaryColor={primaryColor}
      backgroundColor={backgroundColor}
      buttonColor={buttonColor}
      textStyle={textStyle}
      buttonPadding={buttonPadding}
      rightSlot={
        <Pressable
          onPress={handleAddPoints}
          style={({ pressed }) => [
            styles.container,
            {
              borderColor: primaryColor,
              backgroundColor: pressed ? "rgba(255,255,255,0.08)" : "transparent",
            },
          ]}
        >
          <SvgIcon name="plus" size={16} color={primaryColor} />
        </Pressable>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: 28,
    height: 28,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
});

export default AddPointsButton;