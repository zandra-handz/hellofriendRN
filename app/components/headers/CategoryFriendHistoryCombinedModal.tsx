import { useSelectedFriendStats } from "@/src/context/SelectedFriendStatsContext";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import InfoItem from "./InfoItem";
import CategoryFriendCurrentList from "./CategoryFriendCurrentList";
import { daysSincedDateField } from "@/src/utils/DaysSince";
import HelloQuickView from "../alerts/HelloQuickView";
import MakeDefaultCats from "./MakeDefaultCats";
import CatDescriptEditable from "./CatDescriptEditable";
import manualGradientColors  from "@/app/styles/StaticColors";
import { useFriendListAndUpcoming } from "@/src/context/FriendListAndUpcomingContext";
// import { useFriendList } from "@/src/context/FriendListContext";
import { useHelloes } from "@/src/context/HelloesContext";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ModalListWithView from "../alerts/ModalListWithView";
import { AppFontStyles } from "@/app/styles/AppFonts";
import CategoryFriendHistoryList from "./CategoryFriendHistoryList";
import { useCapsuleList } from "@/src/context/CapsuleListContext";

import { ItemViewProps } from "@/src/types/MiscTypes";
interface Props {
  isVisible: boolean;
  closeModal: () => void;
  categoryId: number;
  onSearchPress: () => void;
}

const CategoryFriendHistoryCombinedModal: React.FC<Props> = ({
  userId,
  userDefaultCategory,
  friendId,
  friendName,

  themeColors,
  isVisible,
  closeModal,
  categoryId,
  primaryColor = "orange",
  lighterOverlayColor = "yellow",
  primaryBackground = "red",

  friendDefaultCategory,
  userCategories,
}) => {
  const { capsuleList } = useCapsuleList();

  const category = Array.isArray(userCategories)
    ? userCategories.find((category) => category.id === categoryId) || null
    : null;

  const startingText = category?.description || null;
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;
  const { helloesList } = useHelloes();
  // const { friendList } = useFriendList();
  const { friendListAndUpcoming} = useFriendListAndUpcoming();
  const friendList = friendListAndUpcoming?.friends;
  const { selectedFriendStats } = useSelectedFriendStats();

  const [quickView, setQuickView] = useState<null | ItemViewProps>(null);

  const handleNullQuickView = () => {
    setQuickView(null);
  };

  const textInputRef = useRef(null);

  const [textInputView, setTextInputView] = useState<null | ItemViewProps>(
    null
  );

  const handleNullTextInputView = () => {
    setTextInputView(null);
  };

  const handleViewHello = (id, momentOriginalId) => {
    const helloIndex = helloesList.findIndex((hello) => hello.id === id);
    const helloObject = helloIndex !== -1 ? helloesList[helloIndex] : null;

    if (helloObject != undefined) {
      const daysSince = daysSincedDateField(helloObject.date);

      const word = Number(daysSince) != 1 ? `days` : `day`;
      console.log("helloobject@@");
      setQuickView({
        topBarText: `Hello on ${helloObject.past_date_in_words}   |   ${daysSince} ${word} ago`,
        view: (
          <HelloQuickView
            data={helloObject}
            friendId={friendId}
            momentOriginalId={momentOriginalId}
            index={helloIndex}
            themeColors={themeColors}
            themeAheadOfLoading={themeColors}
            primaryColor={primaryColor}
          />
        ),
        message: `hi hi hi`,
        update: false,
      });
    }
  };

  useEffect(() => {
    if (selectedFriendStats) {
      // console.warn(`SELECTED FRIEND STATS ---->>>>`, selectedFriendStats);

      const categoryHistoryForFriend = selectedFriendStats.find(
        (category) => category.id === categoryId
      );
      if (categoryHistoryForFriend) {
        console.log(categoryHistoryForFriend);
        const capsuleHistory = categoryHistoryForFriend.capsule_ids;
        console.log(capsuleHistory);
      } else {
        console.error(`no capsules here`);
      }
    }
  }, [selectedFriendStats]);

  useFocusEffect(
    useCallback(() => {
      if (category && textInputRef && textInputRef.current) {
        textInputRef.current.value = category?.description;
      }
    }, [category])
  );

  const [textInput, setTextInput] = useState(startingText);

  const handleTextChange = (text) => {
    if (textInputRef?.current) {
      textInputRef.current.value = text;
      setTextInput(text);
    }
  };

  const [momentsInCategory, setMomentsInCategory] = useState(null);

  // const momentsInCategory = capsuleList.filter(
  //   (capsule) => capsule?.user_category === categoryId
  // );

  useFocusEffect(
    useCallback(() => {
      if (category && capsuleList && capsuleList?.length > 0) {
        const moments = capsuleList.filter(
          (capsule) => capsule?.user_category === categoryId
        );
        setMomentsInCategory(moments);
      }
    }, [category, capsuleList])
  );
  const [showEdit, setShowEdit] = useState(false);

  const handleToggleTextInputView = (view) => {
    setTextInputView({
      topBarText: `Edit description`,
      view: view, // already JSX
      message: `hi hi hi`,
      update: false,
    });
  };

  // const toggleEdit = () => {
  //   console.log("toggled edit");
  //   setShowEdit((prev) => !prev);

  //         setTextInputView({
  //       topBarText: `Edit description`,
  //       view: (<View></View>
  //         // <HelloQuickView
  //         //   data={helloObject}
  //         //   momentOriginalId={momentOriginalId}
  //         //   index={helloIndex}
  //         // />
  //       ),
  //       message: `hi hi hi`,
  //       update: false,
  //     });
  // };

  const FOOTER_BUTTON_SPACE = 40;
  return (
    <ModalListWithView
      bottomSpacer={FOOTER_BUTTON_SPACE}
      borderRadius={60}
      isVisible={isVisible}
      textInputView={textInputView}
      nullTextInputView={handleNullTextInputView}
      quickView={quickView}
      nullQuickView={handleNullQuickView}
      helpModeTitle="Help mode: Category History"
      useModalBar={true}
      infoItem={
        <InfoItem
          fontSize={24}
          infoText={`${category.name}`}
          primaryColor={primaryColor}
        />
      }
      secondInfoItem={
        <View
          style={{
            height: showEdit ? "100%" : "auto",
            maxHeight: showEdit ? "100%" : 160,
            backgroundColor: primaryBackground,
            width: "100%",
          }}
        >
          <CatDescriptEditable
            userId={userId}
            primaryColor={primaryColor}
            subWelcomeTextStyle={subWelcomeTextStyle}
            nullTextInputView={handleNullTextInputView}
            onToggle={handleToggleTextInputView}
            categoryObject={category}
          />
        </View>
      }
      rightSideButtonItem={
        <MaterialCommunityIcons
          name={`tree`}
          size={30}
          color={manualGradientColors.darkHomeColor}
        />
      }
      children={
        <View style={styles.bodyContainer}>
          <View
            style={[
              styles.sectionContainer,
              {
                backgroundColor: showEdit ? "red" : "transparent",

                paddingTop: 0,
                borderRadius: 20,
              },
            ]}
          >
            <MakeDefaultCats
              userId={userId}
              userDefaultCategory={userDefaultCategory}
              friendId={friendId}
              friendName={friendName}
              categoryId={categoryId}
              friendDefaultCategory={friendDefaultCategory}
              primaryColor={primaryColor}
              subWelcomeTextStyle={subWelcomeTextStyle}
            />
          </View>
          {!showEdit && (
            <View style={[styles.sectionContainer, { flexGrow: 1 }]}>
              <View style={{ maxHeight: 300 }}>
                <CategoryFriendCurrentList
                  friendId={friendId}
                  friendName={friendName}
                  primaryColor={primaryColor}
                  lighterOverlayColor={lighterOverlayColor}
                  subWelcomeTextStyle={subWelcomeTextStyle}
                  categoryId={categoryId}
                />
              </View>
              <CategoryFriendHistoryList
                friendId={friendId}
                categoryId={categoryId}
                friendList={friendList}
                helloesList={helloesList}
                primaryColor={primaryColor}
                closeModal={closeModal}
                onViewHelloPress={handleViewHello}
              />
            </View>
          )}
        </View>
      }
      onClose={closeModal}
    />
  );
};

const styles = StyleSheet.create({
  bodyContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    textAlign: "left",
  },
  headerContainer: {
    margin: "2%",
  },
  sectionContainer: {
    // height: 100,
    width: "100%",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 30,
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    textAlignVertical: "top",
    textAlign: "left",
    paddingRight: 2,
    height: 200,
  },
});

export default CategoryFriendHistoryCombinedModal;
