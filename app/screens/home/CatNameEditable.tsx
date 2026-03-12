import React from "react";
import { TextStyle } from "react-native";
import useUpdateCategory from "@/src/hooks/CategoryCalls/useUpdateCategory";
import OptionInputEdit from "@/app/components/headers/OptionInputEdit";
import { AppFontStyles } from "@/app/styles/AppFonts";

export default function CatNameEditable({
  userId,
  primaryColor = "orange",
  backgroundColor = "transparent",
  buttonColor = "transparent",
  textStyle,
  categoryObject,
}: {
  userId: number;
  primaryColor?: string;
  backgroundColor?: string;
  buttonColor?: string;
  textStyle?: TextStyle;
  categoryObject: any;
}) {
  const { updateCategory, updateCategoryMutation } = useUpdateCategory({ userId });
  const [name, setName] = React.useState(categoryObject?.name || "");

  return (
    <OptionInputEdit
      label="Name"
      value={name}
      onValueChange={setName}
      primaryColor={primaryColor}
      backgroundColor={backgroundColor}
      buttonColor={buttonColor}
      textStyle={textStyle ?? { fontSize: 15 }}
      placeholder="Category name..."
      buttonPadding={0}
      validate={(v) => (!v.trim() ? "Name required" : null)}
      onConfirm={() =>
        updateCategory({ id: categoryObject.id, updates: { name } })
      }
    />
  );
}