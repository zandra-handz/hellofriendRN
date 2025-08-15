import { View, ScrollView, Text, FlatList } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import useFullHelloes from "@/src/hooks/useFullHelloes";
import { useHelloes } from "@/src/context/HelloesContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FullHello } from "@/src/types/HelloTypes";
import ModalInfoText from "../headers/ModalInfoText";
import LoadingPage from "../appwide/spinner/LoadingPage";
import { useFriendList } from "@/src/context/FriendListContext";
import TotalMomentsAddedUI from "../moments/TotalMomentsAddedUI";

type Props = {
  data: FullHello;
  momentOriginalId?: string;
  index: number;
};

const HelloQuickView = ({ data, momentOriginalId, index }: Props) => {
  const { themeStyles, appFontStyle } = useGlobalStyle();
  const { selectedFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();

  // console.error(data);
  // console.error(momentOriginalId);

  const [highlightedMoment, setHighlightedMoment] = useState(undefined);

  const SPINNER_SIZE = 30; // ?? not sure if right can't find my main spinner comp?
  const renderListItem = useCallback(
    ({ item, index }: { item: [string, any]; index: number }) => (
      <View
        style={{
          backgroundColor: item[0] === highlightedMoment ? "yellow" : "pink",
          height: "auto",
          justifyContent: "center",
          marginBottom: 10,
          paddingHorizontal: 8,
        }}
      >
        <Text style={{ color: "black" }}>{item[1]?.capsule}</Text>
        {/* <Text style={{ color: "black" }}>{item[0]}</Text>
        <Text style={{ color: "black" }}>{highlightedMoment}</Text> */}
      </View>
    ),
    [highlightedMoment]
  );

  const {
    helloesListFull,
    fetchUntilIndex,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useFullHelloes({ friendId: selectedFriend?.id, indexNeeded: index });

  fetchUntilIndex(index);

  const [helloToView, setHelloToView] = useState(undefined);
  const [helloCapsuleData, setHelloCapsuleData] = useState(undefined);

  const helloCapsules = helloToView?.thought_capsules_shared ?? null;

  // useEffect(() => {
  //   if (helloCapsules) {

  //   console.log(helloCapsules);
  //   const keyz = Object.keys(helloCapsules);

  //   }

  // }, [helloCapsules]);

  useEffect(() => {
    if (helloCapsules) {
      const entriesArray = Object.entries(helloCapsules);
      console.warn("Entries:", entriesArray);
      setHelloCapsuleData(entriesArray);

      if (momentOriginalId) {
        const highlight = entriesArray.find(
          (item) => item[0] === momentOriginalId
        );

        if (highlight) {
          console.warn(highlight);
          setHighlightedMoment(highlight[0]);
        }
      }
      // Example: [['key1', value1], ['key2', value2], ...]
    }
  }, [helloCapsules]);

  useEffect(() => {
    if (helloesListFull) {
      setHelloToView(helloesListFull.find((hello) => hello.id === data.id));
    }
  }, [helloesListFull]);

  const ICON_MARGIN_RIGHT = 10;
  const ICON_SIZE = 20;

  // console.log(helloToView);
  return (
    <>
      {!helloToView && (
        <View
          style={{
            flex: 1,

            width: "100%",

            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoadingPage
            loading={true}
            // includeLabel={true}
            spinnerType="circle"
            spinnerSize={SPINNER_SIZE}
            color={themeAheadOfLoading.lightColor}
          />
        </View>
      )}
      {helloToView && helloToView != undefined && (
        <View style={{ width: "100%" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 4,
            }}
          >
            <MaterialCommunityIcons
              name={"calendar"}
              color={themeStyles.primaryText.color}
              size={ICON_SIZE}
              style={{ marginRight: ICON_MARGIN_RIGHT }}
            />
            <ModalInfoText infoText={helloToView.past_date_in_words} />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 4,
              flexWrap: "flex",
              paddingRight: 10,
            }}
          >
            <MaterialCommunityIcons
              name={"calendar"}
              color={themeStyles.primaryText.color}
              size={ICON_SIZE}
              style={{ marginRight: ICON_MARGIN_RIGHT }}
            />
            <ModalInfoText infoText={helloToView.type} />
          </View>
          {helloToView?.location_name && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 4,
                flexWrap: "flex",
                paddingRight: 10,
              }}
            >
              <MaterialCommunityIcons
                name={"calendar"}
                color={themeStyles.primaryText.color}
                size={ICON_SIZE}
                style={{ marginRight: ICON_MARGIN_RIGHT }}
              />
              <ModalInfoText
                fontSize={14}
                lineHeight={18}
                infoText={helloToView.location_name}
              />
            </View>
          )}
          {helloToView?.additional_notes && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 4,
                flexWrap: "flex",
                paddingRight: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  height: "100%",
                  justifyContent: "flex-start",
                }}
              >
                <MaterialCommunityIcons
                  name={"pencil"}
                  color={themeStyles.primaryText.color}
                  size={ICON_SIZE}
                  style={{ marginRight: ICON_MARGIN_RIGHT }}
                />
              </View>
              <ModalInfoText infoText={helloToView.additional_notes} />
            </View>
          )}

          {helloCapsuleData && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 4,
                flexWrap: "flex",
                paddingRight: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  height: "100%",
                  justifyContent: "flex-start",
                  height: 200,
                  // backgroundColor: "orange",
                  width: "100%",
                }}
              >
                <MaterialCommunityIcons
                  name={"pencil"}
                  color={themeStyles.primaryText.color}
                  size={ICON_SIZE}
                  style={{ marginRight: ICON_MARGIN_RIGHT }}
                />
                {helloCapsuleData && (
                  <View
                    style={{
                      width: "100%",
                      height: 200,
                      //   backgroundColor: "red",
                    }}
                  >
                    <FlatList
                      data={helloCapsuleData}
                      renderItem={renderListItem}
                      style={{ flex: 1 }}
                    />
                  </View>
                )}
              </View>

              {/* <ModalInfoText infoText={helloToView.thought_capsules_shared} /> */}
            </View>
          )}

          {/* {helloToView?.additional_notes && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 4,
                flexWrap: "flex",
                paddingRight: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  height: "100%",
                  justifyContent: "flex-start",
                }}
              >
                <MaterialCommunityIcons
                  name={"pencil"}
                  color={themeStyles.primaryText.color}
                  size={ICON_SIZE}
                  style={{ marginRight: ICON_MARGIN_RIGHT }}
                />
              </View>
              <ModalInfoText infoText={helloToView.additional_notes} />
            </View>
            
          )}

                    {helloToView?.additional_notes && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 4,
                flexWrap: "flex",
                paddingRight: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  height: "100%",
                  justifyContent: "flex-start",
                }}
              >
                <MaterialCommunityIcons
                  name={"pencil"}
                  color={themeStyles.primaryText.color}
                  size={ICON_SIZE}
                  style={{ marginRight: ICON_MARGIN_RIGHT }}
                />
              </View>
              <ModalInfoText infoText={helloToView.additional_notes} />
            </View>
            
          )}
                    {helloToView?.additional_notes && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 4,
                flexWrap: "flex",
                paddingRight: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  height: "100%",
                  justifyContent: "flex-start",
                }}
              >
                <MaterialCommunityIcons
                  name={"pencil"}
                  color={themeStyles.primaryText.color}
                  size={ICON_SIZE}
                  style={{ marginRight: ICON_MARGIN_RIGHT }}
                />
              </View>
              <ModalInfoText infoText={helloToView.additional_notes} />
            </View>
            
          )} */}
        </View>
      )}
    </>
  );
};

export default HelloQuickView;
