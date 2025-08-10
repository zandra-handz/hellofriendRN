import { View, ScrollView, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import useFullHelloes from "@/src/hooks/useFullHelloes";
import { useHelloes } from "@/src/context/HelloesContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FullHello } from "@/src/types/HelloTypes";
import ModalInfoText from "../headers/ModalInfoText";
import LoadingPage from "../appwide/spinner/LoadingPage";
import { useFriendList } from "@/src/context/FriendListContext";

type Props = {
  data: FullHello;
  index: number;
};

const HelloQuickView = ({ data, index }: Props) => {
  const { themeStyles, appFontStyle } = useGlobalStyle();
  const { selectedFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();

  const SPINNER_SIZE = 30; // ?? not sure if right can't find my main spinner comp?

  const {
    helloesListFull,
    fetchUntilIndex,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useFullHelloes({ friendId: selectedFriend?.id, indexNeeded: index });

  fetchUntilIndex(index);

  const [helloToView, setHelloToView] = useState(undefined);

  useEffect(() => {
    if (helloesListFull) {
      setHelloToView(helloesListFull.find((hello) => hello.id === data.id));
    }
  }, [helloesListFull]);

  const ICON_MARGIN_RIGHT = 10;
  const ICON_SIZE = 20;

  console.log(helloToView);
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
        <ScrollView style={{ width: "100%" }}>
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
        </ScrollView>
      )}
    </>
  );
};

export default HelloQuickView;
