import { View, Text, TextInput, ScrollView } from "react-native";
import React, { useState, useRef, useCallback } from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GlobalPressable from "../appwide/button/GlobalPressable";
 
import useUpdateCategory from "@/src/hooks/CategoryCalls/useUpdateCategory";
import EditCategoryDescriptionView from "./EditCategoryDescriptionView";
type Props = {
  categoryObject: object;
  editEnabled: boolean;
  onToggle: () => void;
};

const CatDescriptEditable = ({ userId, primaryColor='orange', nullTextInputView, categoryObject, editEnabled = true, onToggle }: Props) => {
  const {  appFontStyles } = useGlobalStyle();
 
  const [showEdit, setShowEdit] = useState(false);
 
  const { updateCategory } = useUpdateCategory({userId: userId});


  const textInputRef = useRef(null);

  const startingText = categoryObject?.description || null;

  const [textInput, setTextInput] = useState(startingText);
  useFocusEffect(
    useCallback(() => {
      if (categoryObject && textInputRef && textInputRef.current) {
        textInputRef.current.value = category?.description;
      }
    }, [categoryObject])
  );

  const handleTextChange = (text) => {
    if (textInputRef?.current) {
      textInputRef.current.value = text;
      setTextInput(text);
    }
  };

  const handleUpdateCategory = () => {
    updateCategory({
  
      id: categoryObject.id,

      updates: { description: textInputRef.current.value },
    });

    setShowEdit(false);
  };

  const renderEditView = () => {
  return (
    <>
      <View style={{ height: 100, width: "100%" }}>
        <TextInput
          ref={textInputRef}
          style={[
           
            {
              color: primaryColor,
              flex: 1,
              fontSize: 15,
              textAlignVertical: "top",
              textAlign: "left",
              paddingRight: 2,
              height: 200,
            },
          ]}
          autoFocus={true}
          value={textInput}
          onChangeText={handleTextChange}
          multiline
        />
      </View>
      <GlobalPressable onPress={handleUpdateCategory}>
        <MaterialCommunityIcons
          name={"check"}
          size={20}
          color={primaryColor}
        />
      </GlobalPressable>
    </>
  );
};

const toggleEdit = () => {
  onToggle(<EditCategoryDescriptionView nullTextInputView={nullTextInputView} categoryId={categoryObject.id} startingText={startingText} onSave={handleUpdateCategory}/>); // pass the function, not the JSX
  setShowEdit((prev) => !prev);
};
  return (
    <>
      <GlobalPressable
        style={{ position: "absolute", top: -10, right: -20 }}
        onPress={toggleEdit}
      >
        <MaterialCommunityIcons
          name={ "pencil-outline"}
          size={15}
          style={{opacity: .7}}
          color={primaryColor}
        />
      </GlobalPressable>
      {/* <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                  <EditDescriptionButton
            marginRight={0}
            maxWidth={200}
              editMode={editEnabled}
              onPress={toggleEdit}
              fontSize={12}

            />
      </View> */}

      

      {/* <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          height: "auto",
          alignItems: "center",
          marginTop: 10,
          marginBottom: 20,
        }}
      >
        <Text
          style={[
            themeStyles.primaryText,
            appFontStyles.subWelcomeText,
            { fontSize: 16 },
          ]}
        >
          Description: {categoryObject.description}
        </Text>
      </View> */}



      {/* {!showEdit && ( */}
        <ScrollView style={{ height: "auto", maxHeight: 200, width: "100%" }}>
          <Text
            style={[ 
              appFontStyles.subWelcomeText,
              { color: primaryColor, fontSize: 15, lineHeight: 22 },
            ]}
          >

            {categoryObject?.description}
          </Text>
        </ScrollView>
      {/* )} */}
    </>
  );
};

export default CatDescriptEditable;
