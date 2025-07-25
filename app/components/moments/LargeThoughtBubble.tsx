import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import AddMomentButton from "../buttons/moments/AddMomentButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  capsuleCount: number;
};

const LargeThoughtBubble = ({ capsuleCount = 5 }: Props) => {
  const { themeStyles, appContainerStyles } = useGlobalStyle();

  const ITEM_SIZE = 70;
  return (
    //   <LizardSvg
    //     height={300}
    //     width={300}
    //     color={themeStyles.genericTextBackground.backgroundColor}
    //     style={appContainerStyles.bigLizardRotate}
    //   />
    <>
      {/* <MaterialCommunityIcons
        name={"thought-bubble"}
        //   size={300}
        size={160}
        //   color={themeStyles.genericTextBackground.backgroundColor}
        color={themeStyles.overlayBackgroundColor.backgroundColor}
        style={styles.containerForLarger}
      /> */}
      <MaterialCommunityIcons
        name={"thought-bubble"}
        //   size={300}
        size={70}
        borderRadius={999}
        backgroundColor={themeStyles.primaryBackground.backgroundColor}
        //   color={themeStyles.genericTextBackground.backgroundColor}

        color={themeStyles.primaryText.color}
        style={[
          styles.container,
          { borderColor: themeStyles.primaryText.color },
        ]}
      />
      <View style={[styles.textPlacement, { alignItems: 'center', width: 70 * .7}]}>
        
      <Text
        style={[
          themeStyles.primaryText,
      
          {  fontSize: 16, fontWeight: 'bold',  color: themeStyles.primaryBackground.backgroundColor },
        ]}
      >
        {capsuleCount}
      </Text>
      
      </View>
        <View style={[styles.addButtonPlacement, { alignItems: 'flex-start', width: 70 * .7}]}>
        
        <AddMomentButton iconSize={20} circleSize={26}/>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  // container: {
  // position: "absolute",
  // zIndex: -1,
  // width: '100%',

  // top: -90,
  // opacity: .4,
  // right: -200,

  // },

  //   container: {
  //     position: "absolute",
  //     right: -20,
  //     top: -40,
  //     padding: 10,
  //     borderWidth: StyleSheet.hairlineWidth,
  //   },
  textPlacement: {
    position: "absolute",
    zIndex: 60000,
    top: -52,
    right: 22,
  },
    addButtonPlacement: {
    position: "absolute",
    zIndex: 60000,
    top: -42,
    right: 17,
  },

  container: {
    position: "absolute",
    right: -0,
    top: -80,
    zIndex: 30000,
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
});

export default LargeThoughtBubble;
