// EditCategoryDescriptionView.tsx
import React, { useRef, useState, useEffect } from "react";
import { View, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GlobalPressable from "../appwide/button/GlobalPressable"; 
 
import useUpdateCategory from "@/src/hooks/CategoryCalls/useUpdateCategory";
 
export default function EditCategoryDescriptionView({
  userId,
  categoryId,
  startingText,
  nullTextInputView,
  onSave,
  primaryColor='orange',
}: {
  startingText?: string;
  categoryId: number;
  nullTextInputView: () => void;
  onSave: (newText: string) => void;
}) {  
  const { updateCategory, updateCategoryMutation } = useUpdateCategory({userId: userId});
  const [text, setText] = useState(startingText || "");
  const textInputRef = useRef<TextInput>(null);

  const handleSave = () => {
    onSave(text);
  };
useEffect(() => {
  if (updateCategoryMutation.isSuccess) {
    nullTextInputView();

  }

}, [updateCategoryMutation.isSuccess]);
  
  const handleUpdateCategory = () => {
    updateCategory({
     
      id: categoryId,

      updates: { description: text },
    });
 
  };


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
              paddingRight: 2,
              height: 200,
            },
          ]}
          autoFocus
          value={text}
          onChangeText={setText}
          // onSubmitEditing={handleUpdateCategory}
          // multiline={false}
          multiline
        />
      </View>
      <GlobalPressable onPress={handleUpdateCategory}>
        <MaterialCommunityIcons
          name="check"
          size={20}
          color={primaryColor}
        />
      </GlobalPressable>
    </>
  );
}
