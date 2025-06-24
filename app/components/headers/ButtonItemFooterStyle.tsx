import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useCallback } from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// could use the animated styles in ItemFooter here maybe; no specific use case in mind yet so haven't included
const ButtonItemFooterStyle = ({ item, onPress, previewData }) => {
  const { themeStyles, appFontStyles, appContainerStyles } = useGlobalStyle();

  const footerHeight = 90;
  const footerWithPreviewHeight = 340;
  const footerPaddingBottom = 20;

  const iconHorizontalSpacing = 20;

  const RenderIconButton = useCallback(
    () => (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          //flex: 1,
          width: 'auto',
          marginLeft: iconHorizontalSpacing, 
         
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed ? 0.6 : 1, // optional visual feedback
        })}
      >
        <MaterialCommunityIcons
          name="send"
          size={50}
          color={themeStyles.primaryText.color}
        />
        {/* <Text style={[themeStyles.primaryText, appFontStyles.welcomeText, {fontSize: 44}]}>{currentIndex + 1}<Text style={[themeStyles.primaryText, appFontStyles.welcomeText, {fontSize: 22}]}>
                  
                 /{data.length} </Text></Text> */}
      </Pressable>
    ),
    [onPress, themeStyles]
  );

  return (
    <View
      style={[
        styles.container,
        {
          height: 'auto',
          paddingBottom: footerPaddingBottom,
          backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
        },
      ]}
    >
      {/* <View style={[styles.divider, themeStyles.divider]} /> */}
          <View
            style={[styles.previewContainer]}
          > 
          <View style={{flexDirection: 'row', width: '100%', marginVertical: 10}}>
            <Text style={[themeStyles.primaryText, appFontStyles.welcomeText]}>Preview</Text>

          </View>
          {previewData}
  
          </View>
        <View style={styles.section}>
          <>
            <Text style={[themeStyles.primaryText, appFontStyles.welcomeText]}>Send SMS</Text>

            <RenderIconButton/>
            </>
        </View> 

      {/* <View style={[styles.divider, themeStyles.divider]} />
   
        <View style={styles.section}>
            <RenderIconButton/>
        </View> 

      <View style={[styles.divider, themeStyles.divider]} />
   
        <View style={styles.section}>
            <RenderIconButton/>
        </View>  */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "100%",
    paddingHorizontal: 10,
    position: "absolute",
    bottom: 0,
    zIndex: 1,
  },
  section: {
    marginVertical: 20,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  divider: {
    marginVertical: 10,
  },
    previewContainer: {
     paddingVertical: 20, 
     borderRadius: 10,
    width: '100%',
    height: 'auto',
    flex: 1,
    flexShrink: 1, 
  },
});

export default ButtonItemFooterStyle;
