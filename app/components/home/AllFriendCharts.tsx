import { View, Text } from "react-native";
import React, { useCallback, useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import LabeledArrowButton from "../appwide/button/LabeledArrowButton";
import { useNavigation } from "@react-navigation/native";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Donut from "../headers/Donut";
import { useUserSettings } from "@/src/context/UserSettingsContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import useMomentSortingFunctions from "@/src/hooks/useMomentSortingFunctions";
import { ScrollView } from "react-native-gesture-handler";
import Pie from "../headers/Pie";

type Props = {
  selectedFriend: boolean;
  outerPadding: DimensionValue;
};

const AllFriendCharts = ({ selectedFriend, outerPadding }: Props) => {
  const { themeStyles, manualGradientColors } = useGlobalStyle();
  const navigation = useNavigation();
  const { capsuleList } = useCapsuleList();

  const [categoryColors, setCategoryColors] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const {
    userCategories,
    createNewCategory,
    updateCategory,
    deleteCategory,
    createNewCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
  } = useUserSettings();

  const {
    categorySizes,
    addCategoryItem,
    moveCategoryCount,
    generateGradientColors,
    generateRandomColors,
  } = useMomentSortingFunctions({
    listData: capsuleList,
  });
  const HEIGHT = 170;

  const [categoriesMap, setCategoriesMap] = useState({});
  const [categoriesSortedList, setCategoriesSortedList] = useState([]);
  const [tempCategoriesSortedList, setTempCategoriesSortedList] = useState([]);
  const [tempCategoriesMap, setTempCategoriesMap] = useState({});
  useFocusEffect(
    useCallback(() => {
      if (!capsuleList || capsuleList?.length < 1) {
        return;
      }

      let categories = categorySizes();
      //  console.log(categories);
      setCategoriesMap(categories.lookupMap);
      setCategoriesSortedList(categories.sortedList);
      setTempCategoriesSortedList(categories.sortedList);
      setTempCategoriesMap(categories.lookupMap);
    }, [capsuleList])
  );

  useEffect(() => {
    if (userCategories && userCategories.length > 0) {
      setCategoryColors(
        generateGradientColors(
          userCategories,
          manualGradientColors.lightColor,
          manualGradientColors.homeDarkColor
          // themeAheadOfLoading.darkColor
        )
      );
      //         setCategoryColors(
      //     generateRandomColors(
      //       userCategories
      //     )
      //   );
    }
  }, [userCategories]);

  useEffect(() => {
    if (categoryColors && tempCategoriesSortedList) {
      const userCategorySet = new Set(
        tempCategoriesSortedList.map((item) => item.user_category)
      );

      const filteredColors = categoryColors
        .filter((item) => userCategorySet.has(item.user_category))
        .map((item) => item.color);
      setColors(filteredColors);
    }
  }, [categoryColors, tempCategoriesSortedList]);

  return (
    <View
      style={[
        {
          overflow: "hidden",
          height: HEIGHT,
          padding: 10,
          backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
          borderRadius: 20,
        },
      ]}
    >
      <View
        style={{
          borderRadius: 20,
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",

          // backgroundColor: 'orange',
          marginBottom: outerPadding,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <MaterialCommunityIcons
            name="graph"
            size={20}
            color={themeStyles.primaryText.color}
            style={{ marginBottom: 0 }}
          />
          <Text
            style={[
              themeStyles.primaryText,
              {
                marginLeft: 6,
                marginRight: 12,
                fontWeight: "bold",
              },
            ]}
          >
            Health stats
          </Text>
        </View>
        <LabeledArrowButton
          color={themeStyles.primaryText.color}
          label="View"
          opacity={0.7}
          onPress={() => navigation.navigate("Helloes")}
        />
      </View>
      <ScrollView horizontal>
        <View style={{marginHorizontal: 6}}>
            
        <Donut
          radius={50}
          strokeWidth={10}
          outerStrokeWidth={14}
          data={tempCategoriesSortedList}
          colors={colors}
        />
        
        </View>
       <View style={{marginHorizontal: 6}}>
            
        <Pie
          data={tempCategoriesSortedList}
          widthAndHeight={100}
          labelSize={5}
          onSectionPress={() => console.log("hi!")}
        />
        
        </View>
      </ScrollView>

      <View style={{ width: "100%", height: 10 }}></View>
    </View>
  );
};

export default AllFriendCharts;
