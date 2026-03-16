import { Alert, StyleProp, TextStyle } from "react-native";
import React, { useEffect  } from "react";

import OptionNoToggle from "@/app/components/headers/OptionNoToggle";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";

import useDeleteCategory from "@/src/hooks/CategoryCalls/useDeleteCategory";

import ButtonTrash from "@/app/components/buttons/helloes/ButtonTrash";
type Props = {
  userId: number;
  categoryId: number;
  categoryName: string;
  textColor: string;
  backgroundColor: string;
  buttonColor: string;
  textStyle: StyleProp<TextStyle>;
  buttonPadding?: number;
};

const DeleteCategory = ({
  userId,
  categoryId,
  categoryName,
  textColor,
  backgroundColor,
  buttonColor,
  textStyle,
  buttonPadding = 4,
  onDeleteSuccess
}: Props) => {
  const { deleteCategory, deleteCategoryMutation } = useDeleteCategory({
    userId: userId,
  });

//   useEffect(() => {
//     if (deleteCategoryMutation.isSuccess) {
       
//       showFlashMessage(`${categoryName} deleted`, false, 1000);
//     }
//   }, [deleteCategoryMutation.isSuccess]);

//   useEffect(() => {
//     if (deleteCategoryMutation.isError) {
//       showFlashMessage(`${categoryName} not deleted`, true, 1000);
//     }
//   }, [deleteCategoryMutation.isError]);

  const handleDelete = () => {
    deleteCategory({ id: categoryId });
      onDeleteSuccess();
   
  };

  const handleConfirmDelete = () => {
    if (!categoryId) {
      return;
    }

    Alert.alert(
      `Delete Category`,
      `Are you SURE you want to delete ${categoryName}?`,
      [
        {
          text: "No!!",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => handleDelete(),
        },
      ],
    );
  };

  return (
    <OptionNoToggle
      label={`Delete`}
      icon={`trash`}
      primaryColor={textColor}
      backgroundColor={backgroundColor}
      buttonColor={buttonColor}
      textStyle={textStyle}
      buttonPadding={buttonPadding}
      onPress={handleConfirmDelete}
      rightSlot={<ButtonTrash onPress={handleConfirmDelete} />}
    />
  );
};

export default DeleteCategory;
