import { View, Text, FlatList } from "react-native";
import React, { useEffect, useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";

type Props = {
  categoryId: number;
};

const CategoryFriendCurrentList = ({ categoryId }: Props) => {
  const { themeStyles, appFontStyles } = useGlobalStyle();
  const { selectedFriend } = useSelectedFriend();
  const { allCapsulesList } = useCapsuleList(); // to include preadded
  const [allMomentsInCategory, setAllMomentsInCategory] = useState();

  // useFocusEffect(
  //     useCallback(() => {

  //     }, [categoryId, allCapsulesList])
  // )

  useEffect(() => {
    if (!categoryId || !allCapsulesList || !selectedFriend) {
      return;
    }

    if (allCapsulesList.length > 0) {
 
      const capsulesInCategory = allCapsulesList.filter(
        (capsule) => capsule?.user_category === categoryId
      );
      setAllMomentsInCategory(capsulesInCategory);
    }
  }, [categoryId, allCapsulesList]);

  const renderMomentsInCategoryItem = useCallback(
    ({ item, index }) => (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          height: 40,
          borderRadius: 10,
          backgroundColor: themeStyles.lighterOverlayBackgroundColor,
          width: "100%",
          marginVertical: 6,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 40,
            alignItems: "center",
            justifyContent: "start",
            flexDirection: "row",
          }}
        >
          <MaterialCommunityIcons
            name={"comment-outline"}
            size={20}
            color={themeStyles.primaryText.color}
            style={{opacity: item.preAdded ? .4 : 1 }}
          />
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text style={[themeStyles.primaryText, {opacity: item.preAdded ? .4 : 1 }]}>{item.capsule}</Text>
        </View>
      </View>
    ),
    [allMomentsInCategory, themeStyles]
  );

  return (
    <>
      {selectedFriend && (
        <FlatList
          ListHeaderComponent={
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                backgroundColor: "teal",
                height: "auto",
               // height: 30,
                
              }}
            >
              <Text
                style={[themeStyles.primaryText, appFontStyles.subWelcomeText]}
              >
                Current ideas {selectedFriend.name}
              </Text>
            </View>
          }
          stickyHeaderIndices={[0]}
          data={allMomentsInCategory}
          renderItem={renderMomentsInCategoryItem}
        />
      )}
    </>
  );
};

export default CategoryFriendCurrentList;
