import { View, Text, FlatList } from "react-native";
import React from "react"; 
import useImageUploadFunctions from "@/src/hooks/useImageUploadFunctions";
import { useNavigation } from "@react-navigation/native";
import SmallAddButton from "./SmallAddButton";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

const AddOptionsList = () => { 
  const navigation = useNavigation();
  const { selectedFriend } = useSelectedFriend();

  const { 
    handleCaptureImage,
    handleSelectImage,
  } = useImageUploadFunctions();



    const navigateToAddLocationScreen = () => {
      if (selectedFriend) {
        navigation.navigate("LocationSearch");
      }
  
      if (!selectedFriend) {
        Alert.alert(`I'm sorry!`, "Please select a friend first.", [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      }
    };

  const itemActions = [
    () => handleCaptureImage(),
    () => handleSelectImage(),
    () => navigation.navigate("AddHello"),
    () => navigateToAddLocationScreen(),
  ];

  const otherOptions = [
    "Add new photo",
    "Add upload",
    "Add hello",
    "Pick meet-up location",
  ];

  const renderOptionButton = (item : string, index : number) => {
    return (
      <View style={{ marginRight: 12 }}>
        <SmallAddButton label={item} onPress={itemActions[index]} />
      </View>
    );
  };

  return (
    <View style={{ height: "auto", width: "100%" }}>
      <FlatList
        data={otherOptions}
        horizontal
        keyExtractor={(item, index) => `satellite-${index}`}
        renderItem={(
          { item, index }  
        ) => renderOptionButton(item, index)}
        ListFooterComponent={() => <View style={{ width: 140 }} />}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default AddOptionsList;
