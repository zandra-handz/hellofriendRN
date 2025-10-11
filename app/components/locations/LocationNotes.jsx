
import React, {   useMemo } from "react";
import {
  View,
  Text, 
  Pressable,
  StyleSheet,
} from "react-native";    
 
import SvgIcon from "@/app/styles/SvgIcons";

const LocationNotes = ({
  location,
  iconSize = 26, 
  openEditModal, 
  themeAheadOfLoading,
  primaryColor,
  compact=false,
  noLabel=false,
}) => {  
  
  const handlePress = () => {
    const modalData = {
      title: "Notes",
      icon: memoizedIcon,
      contentData: location.personal_experience_info,
      location: location,
      focusOn: 'focusNotes',
 
    };
    openEditModal(modalData); 
  };
 
  const hasNotes = useMemo(() => {
  return location && location.personal_experience_info ? true : false;
}, [location]);



    const memoizedIcon = useMemo(
    () => (
      <SvgIcon
        name={hasNotes ? "note_text" : "note_edit_outline"}
        size={iconSize}
        color={
          hasNotes
            ? primaryColor
            : primaryColor
        }
        style={{ marginRight: 4 }}
      />
    ),
    [
      hasNotes,
      iconSize,
      themeAheadOfLoading.lightColor,
      primaryColor,
    ]
  );

  return (
    <View>
      {location && !String(location.id).startsWith("temp") && (
        <View style={styles.container}>
 
          <Pressable
            onPress={handlePress}
            style={({ pressed }) => ({
              flexDirection: compact ? "column" :  "row",
              alignItems: "center",
              opacity: pressed ? 0.6 : 1,
            })}
          >
            {memoizedIcon}
            {!noLabel && (
              
            <Text style={  {color: primaryColor}}>Notes</Text>
            
            )}
          </Pressable> 
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 2,
  },
  contentContainer: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "space-between",
  },
  notesContainer: {
    width: "100%",
    height: "60%",
    borderRadius: 30,
    padding: 20,
    textAlign: "top",
    justifyContent: "flex-start",
  },
  notesText: {
    fontSize: 15,
    lineHeight: 21,
  },
  parkingScoreContainer: {
    width: "100%",
    height: "30%",
    borderRadius: 30,
    padding: 20,
  },
  iconContainer: {
    margin: 0,
  },
  saveText: {
    marginLeft: 8,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
  },
  textContainer: {
    padding: 0,
    textAlign: "top",
  },
  containerTitle: {
    fontSize: 16,
    marginBottom: "4%",
  },
  textInput: {
    textAlign: "top",
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    height: 100,
  },
});

export default LocationNotes;
