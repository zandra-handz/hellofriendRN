import { View, Pressable, Text } from "react-native";
import React from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useAppNavigations from "@/src/hooks/useAppNavigations";


// no props rn 
// type Props = {
//   onPress: () => void;
// };

//TopBar is based on this
const TopBarWithAddMoment = () => {
  const { navigateToMomentFocus } = useAppNavigations();

  const handleNavigateToCreateNew = () => {
    navigateToMomentFocus({screenCameFrom: 0}); //meaning, moment save will trigger nav back

  };
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  return (
    <View style={{ paddingHorizontal: 10 }}>
      <View //could make whole bar a pressable instead
        style={[
          themeStyles.primaryBackground,
          {
            paddingHorizontal: 20,
            flexDirection: "row",
            paddingVertical: 10,
            alignItems: "center",
            justifyContent: "center",
            // justifyContent: 'space-between',
            borderRadius: 10,
            marginVertical: 10,
          },
        ]}
      >
        <Pressable hitSlop={20} onPress={handleNavigateToCreateNew}>
          <View style={{ position: "absolute", top: 0, right: -10 }}>
            <MaterialCommunityIcons
              name={"plus"}
              size={16}
              color={manualGradientColors.homeDarkColor}
              style={{
                backgroundColor: manualGradientColors.lightColor,
                borderRadius: 999,
              }}
            />
          </View>

          <MaterialCommunityIcons
            name="leaf"
            size={26}
            color={themeStyles.primaryText.color}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default TopBarWithAddMoment;
