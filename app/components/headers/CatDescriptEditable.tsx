import React from "react";
import useUpdateCategory from "@/src/hooks/CategoryCalls/useUpdateCategory";
import OptionTextAreaEdit from "@/app/components/headers/OptionTextAreaEdit";
import { TextStyle, View, StyleSheet } from "react-native";

export default function CatDescriptEditable({
  userId,
  primaryColor = "orange",
  buttonColor = "transparent",
  subWelcomeTextStyle,
  nullTextInputView,
  categoryObject,
  height,
  editEnabled = true,
  onToggle,
}: {
  userId: number;
  primaryColor?: string;
  buttonColor?: string;
  subWelcomeTextStyle?: TextStyle;
  nullTextInputView: () => void;
  categoryObject: any;
  editEnabled?: boolean;
  onToggle?: () => void;
}) {
  const { updateCategory, updateCategoryMutation } = useUpdateCategory({ userId });
  const [text, setText] = React.useState(categoryObject?.description || "");

  React.useEffect(() => {
    if (updateCategoryMutation.isSuccess) {
      nullTextInputView();
    }
  }, [updateCategoryMutation.isSuccess]);

  return (
    <View style={[styles.container, {   flex: 1, borderColor: `${primaryColor}30`, backgroundColor: buttonColor }]}>
    
      <OptionTextAreaEdit
        label=""
        value={text}
        onValueChange={setText}
        primaryColor={primaryColor}
        backgroundColor="transparent"
        buttonColor="transparent"
        buttonPadding={0}
        textStyle={subWelcomeTextStyle ?? { fontSize: 14 }}
        placeholder="Add a description..."
        onConfirm={() =>
          updateCategory({ id: categoryObject.id, updates: { description: text } })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 10,
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});