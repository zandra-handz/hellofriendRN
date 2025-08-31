import { View, Text, FlatList } from "react-native";
import React, { useEffect, useCallback, useState } from "react";
 
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCapsuleList } from "@/src/context/CapsuleListContext";

type Props = {
  categoryId: number;
};

const CategoryFriendCurrentList = ({
  categoryId,
  // friendId, // available if needed
  friendName,
  primaryColor, 
  subWelcomeTextStyle,
}: Props) => {
  const { allCapsulesList } = useCapsuleList(); // to include preadded
  const [allMomentsInCategory, setAllMomentsInCategory] = useState();
 

  useEffect(() => {
    if (!categoryId || !allCapsulesList || !friendName) {
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
            color={primaryColor}
            style={{ opacity: item.preAdded ? 0.4 : 1 }}
          />
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text
            style={{ color: primaryColor, opacity: item.preAdded ? 0.4 : 1 }}
          >
            {item.capsule}
          </Text>
        </View>
      </View>
    ),
    [allMomentsInCategory, primaryColor]
  );

  return (
    <>
      {friendName && (
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
              <Text style={[subWelcomeTextStyle, { color: primaryColor }]}>
                Current ideas {friendName}
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
