import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import ModalWithGoBack from "../alerts/ModalWithGoBack";
import { useNavigation } from "@react-navigation/native";
import { useSelectedFriendStats } from "@/src/context/SelectedFriendStatsContext";
import { useFriendList } from "@/src/context/FriendListContext";
import { useHelloes } from "@/src/context/HelloesContext";
import { MaterialCommunityIcons, Foundation } from "@expo/vector-icons"; 

import CategoryFriendHistoryList from "./CategoryFriendHistoryList";
interface Props {
  title: string;
  isVisible: boolean;
  closeModal: () => void;
  friendId: number;
  categoryId: number;
}

// method of getting capsule count is TEMPORARY, likely need to change the backend/ backend call being
// made in SelectedFriendStatsContext to just return the count of capsules, and only fetch
// the capsules when needed, using the same hook as the user categories (already doing this)
// and get the count here from the backend as a capsule_ids list like we're doing for the overall user history
const CategoryFriendHistoryModal: React.FC<Props> = ({
  isVisible,
  closeModal,
  title,
  friendId = null,
  categoryId = 3,
}) => {
  const { themeStyles, appSpacingStyles, appFontStyles } = useGlobalStyle();
  const navigation = useNavigation();
  const { friendList } = useFriendList();
  const { helloesList } = useHelloes();

  const { selectedFriendStats } = useSelectedFriendStats();
  const [categoryID, setCategoryID] = useState(null);
  const [friendID, setFriendID] = useState(null);
  const [completedCapsuleCount, setCompletedCapsuleCount] = useState(null);

  if (!friendId) {
    return;
  }

  // useEffect(() => {
  //   if (categoryId && friendId && selectedFriendStats) {
  //     setCategoryID(categoryId);
  //     setFriendID(friendId);
 
  //   }
  // }, [categoryId, friendId, selectedFriendStats]);


 
 

  // const {
  //   categoryHistory,
  //   isLoading,
  //   isFetching,
  //   isFetchingNextPage,
  //   isError,
  //   fetchNextPage,
  //   hasNextPage,
  // } = useCategoryHistoryLookup({ categoryId: categoryID, friendId: friendID }); // DP WE MEED?

  // useEffect(() => {
  //   if (categoryHistory) {
  //     setCompletedCapsuleCount(categoryHistory.length);
  //   }
  // }, [categoryHistory]);

 
 
 
  return (
    <ModalWithGoBack
      isVisible={isVisible}
      headerIcon={
        <Text
          style={[
            themeStyles.primaryText,
            appFontStyles.welcomeText,
            { fontSize: 26 },
          ]}
        >
          <MaterialCommunityIcons
            name={"comment-check-outline"}
            size={24}
            color={themeStyles.modalIconColor.color}
          />
        </Text>
        // <MaterialIcons
        //   name={"category"}
        //   size={appSpacingStyles.modalHeaderIconSize}
        //   color={themeStyles.modalIconColor.color}
        // />
      }
      questionText={title} // + " " + getCapsuleCount(completedCapsuleCount)}
      children={
        <CategoryFriendHistoryList categoryId={categoryId} closeModal={closeModal}/>
      }
      onClose={closeModal}
    />
  );
};

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

export default CategoryFriendHistoryModal;
