import { View,  Text, FlatList } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import useFullHelloes from "@/src/hooks/useFullHelloes"; 
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FullHello } from "@/src/types/HelloTypes";
import ModalInfoText from "../headers/ModalInfoText";
import LoadingPage from "../appwide/spinner/LoadingPage"; 
import { useFriendStyle } from "@/src/context/FriendStyleContext"; 

type Props = {
  data: FullHello;
  momentOriginalId?: string;
  index: number;
};

const HelloQuickView = ({ data, friendId, momentOriginalId, index }: Props) => {
  const { themeStyles } = useGlobalStyle();
  const { selectedFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendStyle();
 
  const [highlightedMoment, setHighlightedMoment] = useState(undefined);

  const SPINNER_SIZE = 30;  
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
 
  } = useFullHelloes({ friendId: selectedFriend?.id, indexNeeded: index });

  fetchUntilIndex(index);

  const [helloToView, setHelloToView] = useState(undefined);
  const [helloCapsuleData, setHelloCapsuleData] = useState(undefined);

  const helloCapsules = helloToView?.thought_capsules_shared ?? null;
 

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
    }
  }, [helloCapsules]);

  useEffect(() => {
    if (helloesListFull) {
      setHelloToView(helloesListFull.find((hello) => hello.id === data.id));
    }
  }, [helloesListFull]);

  const ICON_MARGIN_RIGHT = 10;
  const ICON_SIZE = 20;
 
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
 
            </View>
          )}
 
        </View>
      )}
    </>
  );
};

export default HelloQuickView;
