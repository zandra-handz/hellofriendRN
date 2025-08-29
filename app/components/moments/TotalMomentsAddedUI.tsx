import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";
import React from "react";
import MomentAdded from "./MomentAdded";
import { Moment } from "@/src/types/MomentContextTypes"; 

interface TotalMomentsAddedUIProps {
  momentsAdded: Moment[] | [];
}

const TotalMomentsAddedUI: React.FC<TotalMomentsAddedUIProps> = ({
  momentsAdded,
  backgroundColor,
}) => {
 
  const CONTAINER_HEIGHT = 180;

  const extractItemKey = (item, index) =>
    item?.id ? item.id.toString() : `totalMoments-${index}`;

  return (
    <View style={[styles.container,   { height: CONTAINER_HEIGHT}]}>
     
      {/* <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          height: 30,
        }}
      >
        <Text style={[styles.title, themeStyles.subHeaderText]}>
          TALKED: {momentsAdded.length}
         </Text>

      </View> */}

      <View
        style={{
         // backgroundColor: "red",
          width: "100%",
          height: CONTAINER_HEIGHT,
          flex: 1,
          justifyContent: 'center',
        }}
      > 
<ScrollView contentContainerStyle={{ flexDirection: 'row',  justifyContent: 'flex-start', flexWrap: 'wrap' }}>
  {momentsAdded.map((item, index) => (
    <View key={item.id || index} style={{ width: 50, height: 50, margin: 3 }}>
      <MomentAdded
        moment={item}
        iconSize={26}
        size={14}
        color={backgroundColor}
        disabled={true}
        sameStyleForDisabled={true}
      />
    </View>
  ))}
</ScrollView>
            {/* <FlatList
              data={momentsAdded}
              horizontal={false}
              numColumns={6}
              keyExtractor={extractItemKey}
              renderItem={({ item }) => (
                <View style={{ width: '15%',  marginHorizontal: 3, height: 50 }}>
                  <MomentAdded
                    moment={item}
                    iconSize={26}
                    size={14}
                    color={themeStyles.primaryBackground.backgroundColor}
                    disabled={true}
                    sameStyleForDisabled={true}
                  />
                </View>
              )}
              ListEmptyComponent={() => (
                <Text style={themeStyles.primaryText}>No moments added.</Text>
              )}
            /> */}
         
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%", 
    
    borderRadius: 10,
    alignSelf: "center",
    padding: 0,
    overflow: "hidden",
  },
    title: {
    fontSize: 15,
    lineHeight: 21,
    textTransform: "uppercase",
  },
});

export default TotalMomentsAddedUI;