import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react"; 
import useAppNavigations from "@/src/hooks/useAppNavigations";
import SvgIcon from "@/app/styles/SvgIcons";
import useImages from "@/src/hooks/ImageCalls/useImages";
import useImageUploadFunctions from "@/src/hooks/useImageUploadFunctions"; 
import useFriendDash from "@/src/hooks/useFriendDash";
 

type Props = {
  userId: number;
  friendId: number; 
  primaryColor: string;
  primaryOverlayColor: string; 
};

const History = ({ userId, friendId, primaryColor, primaryOverlayColor }: Props) => {
 
 
  const {   navigateToHistory } = useAppNavigations();
    const { loadingDash } = useFriendDash({userId: userId, friendId: friendId});
 
  return (
    <>
      {friendId && (
        <View
          style={[
            styles.outerContainer,
            {
              backgroundColor: loadingDash ? "transparent" : primaryOverlayColor, // dynamic
            },
          ]}
        >
          <View style={styles.innerContainer}>
            {!loadingDash && (
              <View style={styles.rowSpaceBetween}>
                <Pressable
                  hitSlop={10}
                  onPress={navigateToHistory}
                  style={styles.row}
                >
                  <SvgIcon
                    name="pie_chart"
                    size={20}
                    color={primaryColor} // dynamic
                    style={styles.icon}
                  />
                  <Text
                    style={[
                      styles.titleText,
                      { color: primaryColor }, // dynamic
                    ]}
                  >
                    History  
                  </Text>
                </Pressable>

         
              </View>
            )}
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    overflow: "hidden",
    height: 30,
    flexShrink: 1,
    width: "100%",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
  },
  innerContainer: {
    borderRadius: 20,
    flexDirection: "row",
    height: 40,
    width: "100%",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
  rowSpaceBetween: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  icon: {
    marginBottom: 0,
  },
  titleText: {
    marginLeft: 15, 
    fontSize: 13,
    fontWeight: 'bold',
    // fontWeight: "bold",
  },
  rightButtonGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    fontWeight: "bold",
    fontSize: 13,
  },
  divider: {
    width: 1,
    height: "100%",
    opacity: 0.7,
    marginHorizontal: 10,
  },
});

export default History;
