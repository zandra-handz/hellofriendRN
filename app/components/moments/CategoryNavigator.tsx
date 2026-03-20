// // MEMOIZED VERSION
// // performs better than non-memoized, per DevTools profiling
// import React, { useMemo, useState } from "react";
// import { View, ScrollView, StyleSheet, Pressable } from "react-native";
// import Animated, {
//   useAnimatedStyle,
//   SlideInDown,
//   SlideOutDown,
// } from "react-native-reanimated";
// import CategoryButton from "./CategoryButton"; 

// import SvgIcon from "@/app/styles/SvgIcons";
// import SearchModal from "../headers/SearchModal";
// import manualGradientColors  from "@/app/styles/StaticColors";
// import { SharedValue } from "react-native-reanimated";

// type Props = {
//   visibilityValue: SharedValue;
//   viewableItemsArray: SharedValue[];
//   categoryNames: string[];
//   categoryColorsMap: Record<string, string>;
//   onPress: () => void;
//   onSearchPress: () => void;
//   onClose: () => void;
// };
// const CategoryNavigator = ({
//   primaryColor, // because cat button needs the full style
//   backgroundColor,
//   visibilityValue,

//   viewableItemsArray,
//   categoryNames,
//   onPress,
//   onSearchPress,
//   categoryColorsMap,
//   onClose,
// }: Props) => {
//   const [searchModalVisible, setSearchModalVisible] = useState(false);

//   const visibilityStyle = useAnimatedStyle(() => ({
//     opacity: visibilityValue.value,
//   }));


//   const CONTAINER_HEIGHT = 240;
//   // const iconSize = 26; HARD CODED

//   const memoizedSearchIcon = useMemo(
//     () => (
//       <Pressable
//         onPress={() => setSearchModalVisible(true)}
//         style={({ pressed }) => ({
//           flexDirection: "row",
//           alignItems: "center",
//           justifyContent: "center",
//           borderRadius: 999,
//           paddingVertical: 5,

//           textAlign: "center",
//           opacity: pressed ? 0.6 : 1,
//         })}
//       >
//         <SvgIcon
//           name={"text_search"}
//           size={26}
//           color={primaryColor}
//           style={{}}
//         />
//       </Pressable>
//     ),
//     [primaryColor]
//   );
//   const renderedButtons = useMemo(
//     () => (
//       <View style={styles.buttonRow}>
//         {memoizedSearchIcon}
//         {categoryNames.map(({ category, categoryId }) => {
//           const categoryColor = categoryColorsMap[categoryId];

//           return (
//             <View
//               key={categoryId ?? category ?? "Uncategorized"}
//               style={styles.buttonWrapper}
//             >
//               <CategoryButton
//                 homeDarkColor={manualGradientColors.homeDarkColor}
//                 primaryColor={primaryColor}
//                 height={"auto"}
//                 viewableItemsArray={viewableItemsArray}
//                 label={category}
//                 highlightColor={categoryColor}
//                 onPress={() => onPress(category)}
//               />
//             </View>
//           );
//         })}
//       </View>
//     ),
//     [categoryNames, categoryColorsMap, onPress, viewableItemsArray]
//   );

//   return (
//     <>
//       {categoryColorsMap && (
//         <Animated.View
//           entering={SlideInDown}
//           exiting={SlideOutDown}
//           style={[
//             styles.categoryNavigatorContainer,
//             styles.momentsScreenPrimarySpacing,
//             {
//               backgroundColor: backgroundColor,
//               height: CONTAINER_HEIGHT,
//             },
//             visibilityStyle,
//           ]}
//         >
//           <Pressable
//             onPress={onClose}
//             style={{
//               width: "100%",
//               flexDirection: "row",
//               justifyContent: "center",
//               alignItems: "center",
//               // position: "absolute",
//               // top: -20,
//               //height: 30,
//               paddingTop: 10,
//               height: 50, //NOT same height as arrow up in category creator 11/09/2025
//               // backgroundColor: "red",
//               // backgroundColor: themeStyles.overlayBackgroundColor.backgroundColor,
//             }}
//           >
//             <SvgIcon
//               name={"chevron_down"}
//               color={primaryColor}
//               color={manualGradientColors.homeDarkColor}
//               size={16}
//               style={{
//                 backgroundColor: manualGradientColors.lightColor,
//                 borderRadius: 999,
//               }}
//             />
//           </Pressable>

//           <ScrollView
//             showsVerticalScrollIndicator={false}
//             style={[styles.scrollContainer]}
//           >
//             {renderedButtons}
//           </ScrollView>
//         </Animated.View>
//       )}

//       {searchModalVisible && (
//         <View>
//           <SearchModal
//             textColor={primaryColor}
//             primaryBackgroundColor={backgroundColor}
//             isVisible={searchModalVisible}
//             closeModal={() => setSearchModalVisible(false)}
//             onSearchPress={onSearchPress}
//           />
//         </View>
//       )}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   categoryLabel: {
//     fontFamily: "Poppins-Regular",
//     fontSize: 14,
//     paddingVertical: 0,
//     paddingHorizontal: 4,
//   },
//   //brought down from global context
//   momentsScreenPrimarySpacing: {
//     // borderRadius: 10,

//     padding: 0,
//   },
//   categoryNavigatorContainer: {
//     position: "absolute",
//     bottom: -24, //20
//     paddingTop: 0,
//     zIndex: 5, 
  
//     // width: "74%",
//     width: "100%",
//     selfAlign: "center",
//   },
//   scrollContainer: {
//     maxHeight: 136,
//     marginTop: 0,
//     borderRadius: 10,
//     padding: 10,
//     paddingTop: 0,
//   },
//   buttonRow: {
//     flexWrap: "wrap",
//     flexDirection: "row",
//     justifyContent: "flex-start",
//     alignItems: "center",
//   },
//   buttonWrapper: {
//     flexDirection: "row",

//     marginHorizontal: 0,
//     marginBottom: 10,
//   },
// });

// export default React.memo(CategoryNavigator);


// MEMOIZED VERSION
// performs better than non-memoized, per DevTools profiling
import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";

import SvgIcon from "@/app/styles/SvgIcons";
import SearchModal from "../headers/SearchModal";
import manualGradientColors from "@/app/styles/StaticColors";
import { SharedValue } from "react-native-reanimated";

type Props = {
  visibilityValue: SharedValue;
  viewableItemsArray: SharedValue[];
  categoryNames: string[];
  categoryColorsMap: Record<string, string>;
  onPress: () => void;
  onSearchPress: () => void;
  onClose: () => void;
};

const CategoryNavigator = ({
  primaryColor,
  backgroundColor,
  visibilityValue,
  viewableItemsArray,
  categoryNames,
  onPress,
  onSearchPress,
  categoryColorsMap,
  onClose,
}: Props) => {
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const visibilityStyle = useAnimatedStyle(() => ({
    opacity: visibilityValue.value,
  }));

  const CONTAINER_HEIGHT = 120;

  // ── Search icon tab ────────────────────────────────────────
  const memoizedSearchTab = useMemo(
    () => (
      <Pressable
        onPress={() => setSearchModalVisible(true)}
        style={({ pressed }) => [
          styles.tab,
          { opacity: pressed ? 0.5 : 1 },
        ]}
      >
        <SvgIcon
          name={"text_search"}
          size={18}
          color={primaryColor}
          style={{ opacity: 0.6 }}
        />
      </Pressable>
    ),
    [primaryColor],
  );

  // ── Category tabs ──────────────────────────────────────────
  const renderedTabs = useMemo(
    () => (
      <View style={styles.tabRow}>
        {memoizedSearchTab}

        {/* hairline divider after search icon */}
        <View style={[styles.tabDivider, { backgroundColor: `${primaryColor}22` }]} />

        {categoryNames.map(({ category, categoryId }) => {
          const categoryColor = categoryColorsMap[categoryId];

          return (
            <Pressable
              key={categoryId ?? category ?? "Uncategorized"}
              onPress={() => onPress(category)}
              style={({ pressed }) => [
                styles.tab,
                { opacity: pressed ? 0.5 : 1 },
              ]}
            >
              {/* small glowing dot — same as MomentItem */}
              <View
                style={[
                  styles.tabDot,
                  {
                    backgroundColor: categoryColor,
                    shadowColor: categoryColor,
                  },
                ]}
              />
              <Text
                style={[styles.tabLabel, { color: primaryColor }]}
                numberOfLines={1}
              >
                {category}
              </Text>
            </Pressable>
          );
        })}
      </View>
    ),
    [categoryNames, categoryColorsMap, onPress, primaryColor, memoizedSearchTab],
  );

  return (
    <>
      {categoryColorsMap && (
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={[
            styles.container,
            {
              backgroundColor: backgroundColor,
              height: CONTAINER_HEIGHT,
              // tinted top border instead of a hard background wall
              borderTopColor: `${manualGradientColors.lightColor}28`,
            },
            visibilityStyle,
          ]}
        >
          {/* ── Drag handle / close ─────────────────────────── */}
          <Pressable onPress={onClose} style={styles.handleRow}>
            <View
              style={[
                styles.handle,
                { backgroundColor: `${primaryColor}40` },
              ]}
            />
          </Pressable>

          {/* ── Scrollable tab row ──────────────────────────── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {renderedTabs}
          </ScrollView>
        </Animated.View>
      )}

      {searchModalVisible && (
        <SearchModal
          textColor={primaryColor}
          primaryBackgroundColor={backgroundColor}
          isVisible={searchModalVisible}
          closeModal={() => setSearchModalVisible(false)}
          onSearchPress={onSearchPress}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: -24,
    width: "100%",
    zIndex: 5,
    paddingBottom: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  // ── Handle ──────────────────────────────────────────────────
  handleRow: {
    width: "100%",
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },

  // ── Scroll ───────────────────────────────────────────────────
  scrollContent: {
    paddingHorizontal: 16,
  },
  tabRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  // ── Individual tab ───────────────────────────────────────────
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tabDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 3,
  },
  tabLabel: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    letterSpacing: 0.2,
  },

  // ── Divider between search and categories ────────────────────
  tabDivider: {
    width: StyleSheet.hairlineWidth,
    height: 18,
    marginHorizontal: 6,
  },
});

export default React.memo(CategoryNavigator);