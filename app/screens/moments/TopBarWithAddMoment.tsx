import { View, Pressable  } from "react-native";
import React from "react";
import useAppNavigations from "@/src/hooks/useAppNavigations"; 
import SvgIcon from "@/app/styles/SvgIcons";
import manualGradientColors  from "@/app/styles/StaticColors";
// no props rn
// type Props = {
//   onPress: () => void;
// };

//TopBar is based on this
const TopBarWithAddMoment = ({ textColor, backgroundColor }) => {
  const { navigateToMomentFocus } = useAppNavigations();
  const handleNavigateToCreateNew = () => {
    navigateToMomentFocus({ screenCameFrom: 0 }); //meaning, moment save will trigger nav back
  };
  return (
    <View style={{ paddingHorizontal: 10 }}>
      <View //could make whole bar a pressable instead
        style={[
          {
            backgroundColor: backgroundColor,
            paddingHorizontal: 20,
            flexDirection: "row",
            paddingVertical: 10,
            alignItems: "center",
            justifyContent: "center",
            // justifyContent: 'space-between',
            borderRadius: 999,
            marginVertical: 10,
          },
        ]}
      >
        <Pressable hitSlop={20} onPress={handleNavigateToCreateNew}>
          <View style={{ position: "absolute", top: 0, right: -10 }}>
            <SvgIcon
              name={"plus"}
              size={16}
              color={manualGradientColors.homeDarkColor}
              style={{
                backgroundColor: manualGradientColors.lightColor,
                borderRadius: 999,
              }}
            />
          </View>

          <SvgIcon name="leaf" size={26} color={textColor} />
        </Pressable>
      </View>
    </View>
  );
};

export default TopBarWithAddMoment;
