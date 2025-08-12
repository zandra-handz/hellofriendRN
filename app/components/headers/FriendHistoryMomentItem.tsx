import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GlobalPressable from "../appwide/button/GlobalPressable";

type Props = {
  item: object;
  index: number;
  friendName: string;
  helloDate: string;
  onHelloPress: () => void;
};




const FriendHistoryMomentItem = ({
  item,
  index,
  friendName,
  helloDate,
  onHelloPress,
}: Props) => {
  const { themeStyles } = useGlobalStyle();
  return (
        <View
        style={[
          styles.momentCheckboxContainer,
          {
            paddingBottom: 10,
            paddingTop: 10,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: themeStyles.primaryText.color,
          },
        ]}
      >
        <View style={styles.momentItemTextContainer}>
          <View style={styles.checkboxContainer}>

          <MaterialCommunityIcons
            name={"leaf"}
            size={24}
            color={themeStyles.primaryText.color}
          />
          </View>

          <View style={{ width: "100%", flexShrink: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",

                width: "100%",
              }}
            >
              <Text
                style={[
                  styles.momentItemText,
                  themeStyles.primaryText,
                  { fontFamily: "Poppins-Bold" },
                ]}
              >
                @ {friendName} on{" "}
                {helloDate}
              </Text>
              <GlobalPressable
                hitSlop={20}
                style={{
                  backgroundColor: "red",
                  padding: 20,
                  zIndex: 40000,
                  elevation: 40000,
                }}
                onPress={onHelloPress(item.hello)}
              >
                <MaterialCommunityIcons
                  // name="hand-wave-outline"
                  name="calendar-heart"
                  size={16}
                  color={themeStyles.primaryText.color}
                  style={{ marginHorizontal: 4 }}
                />
              </GlobalPressable>
            </View>
            <Text style={[styles.momentItemText, themeStyles.primaryText]}>
              {item.time_score}
            </Text>
            <Text style={[styles.momentItemText, themeStyles.primaryText]}>
              {item.capsule}
            </Text>
          </View>
        </View>
      </View>
  );
};

//THIS BELOW COPYPASTAD FROM CATEGORYFRIENDHISTORYMODAL
// Just for list item (copy pasta'd this into CategoryHistoryModal as well)
const styles = StyleSheet.create({
  momentItemTextContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
 
    width: "100%",
  },
  momentItemText: {
    fontSize: 11,
    
    // lineHeight: 15,
    fontFamily: "Poppins-Regular",
    // width: "100%",
  },
  momentCheckboxContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
    paddingTop: 0,
    paddingRight: 10,
  },
});

export default FriendHistoryMomentItem;
