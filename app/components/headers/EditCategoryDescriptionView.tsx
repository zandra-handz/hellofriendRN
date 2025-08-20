// EditCategoryDescriptionView.tsx
import React, { useRef, useState, useEffect } from "react";
import { View, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GlobalPressable from "../appwide/button/GlobalPressable";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { useCategories } from "@/src/context/CategoriesContext";
 
export default function EditCategoryDescriptionView({
  categoryId,
  startingText,
  nullTextInputView,
  onSave,
}: {
  startingText?: string;
  categoryId: number;
  nullTextInputView: () => void;
  onSave: (newText: string) => void;
}) {
  const { themeStyles } = useGlobalStyle();
 
  const { updateCategory, updateCategoryMutation } = useCategories();
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
            themeStyles.genericText,
            {
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
          color={themeStyles.footerIcon.color}
        />
      </GlobalPressable>
    </>
  );
}


//   const renderEditView = () => {
//   return (
//     <>
//       <View style={{ height: 100, width: "100%" }}>
//         <TextInput
//           ref={textInputRef}
//           style={[
//             themeStyles.genericText,
//             {
//               flex: 1,
//               fontSize: 15,
//               textAlignVertical: "top",
//               textAlign: "left",
//               paddingRight: 2,
//               height: 200,
//             },
//           ]}
//           autoFocus={true}
//           value={textInput}
//           onChangeText={handleTextChange}
//           multiline
//         />
//       </View>
//       <GlobalPressable onPress={handleUpdateCategory}>
//         <MaterialCommunityIcons
//           name={"check"}
//           size={20}
//           color={themeStyles.footerIcon.color}
//         />
//       </GlobalPressable>
//     </>
//   );
// };