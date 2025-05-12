import React from "react";
import { View, StyleSheet } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFriendList } from "@/src/context/FriendListContext";
import LeavesTwoFallingOutlineThickerSvg from "@/app/assets/svgs/leaves-two-falling-outline-thicker.svg";
import LeafSingleOutlineSvg from "@/app/assets/svgs/leaf-single-outline.svg";
import LeafSingleOutlineInvertedSvg from "@/app/assets/svgs/leaf-single-outline-inverted.tsx";

const LeafTopContainer = ({
  height = "100%",
  width = "101%",
  minHeight = "96%",
  paddingTop = 0,
  paddingBottom = "0%",
  paddingHorizontal = "0%",
  children,
}) => {
  const { themeStyles } = useGlobalStyle();
  const { themeAheadOfLoading } = useFriendList();

  return (
    <>
      <View
        style={[
          styles.container,
          themeStyles.genericTextBackground,
          {
            width: width,
            height: height,
            minHeight: minHeight,
            paddingTop: paddingTop,
            paddingBottom: paddingBottom,
            paddingHorizontal: paddingHorizontal,
            borderColor: themeAheadOfLoading.lightColor,
          },
        ]}
      >
        {/* <View
          style={{ 
            position: "absolute",
           // zIndex: 5000,
            top: -218,
            left: -100,
            transform: [{ rotate: "30deg" }],
          }}
        > */}

        <View
          style={{
            position: "absolute",
            // zIndex: 5000,
            top: -170,
            left: -40,
            transform: [{ rotate: "20deg" }],
          }}
        >
          <LeafSingleOutlineInvertedSvg
            // height={560}
            // width={560}
            height={500}
            width={540}
            fill={themeStyles.genericTextBackgroundShadeTwo.backgroundColor}
            stroke={themeAheadOfLoading.lightColor}
          />
        </View>
        <View
          style={{
            position: "absolute",
            //zIndex: 5000,
            top: -230,
            left: 36,
            transform: [{ rotate: "-20deg" }, { scaleX: -1 }],
          }}
        >
          <LeafSingleOutlineInvertedSvg
            // height={560}
            // width={560}
            height={170}
            width={170}
            fill={themeStyles.genericTextBackgroundShadeTwo.backgroundColor}
            stroke={themeAheadOfLoading.lightColor}
          />
        </View>
        <View
          style={{
            position: "absolute",
            //zIndex: 5000,
            top: -292,
            left: -71,
            transform: [{ rotate: "20deg" }],
          }}
        >
          <LeafSingleOutlineInvertedSvg
            // height={560}
            // width={560}
            height={566}
            width={566}
            fill={themeStyles.genericTextBackgroundShadeTwo.backgroundColor}
            stroke={themeAheadOfLoading.lightColor}
          />
        </View>

        {children && children}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignContent: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderRadius: 30,
    flexDirection: "column",
    justifyContent: "space-between",
  },
});

export default LeafTopContainer;
