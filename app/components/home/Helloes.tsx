import { View, Text, Pressable } from "react-native";
import React from "react";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { useHelloes } from "@/src/context/HelloesContext";
import LoadingBlock from "../appwide/spinner/LoadingBlock";

type Props = {

  outerPadding: number;
};

const Helloes = ({
 isLoading, // loadingDash, NOT helloes
  primaryColor,
  primaryOverlayColor,
 friendId, 
}: Props) => {

  const { helloesList } = useHelloes();
  const { navigateToHelloes } = useAppNavigations();
  const PADDING = 20;

  return (
    <>
      {friendId && (
        <View
          style={[
            {
              overflow: "hidden",
              height: 60,
              flexShrink: 1,
              width: "100%",
              padding: PADDING,
              flexDirection: "row",
              alignItems: "center",
              //   paddingBottom: 10,
              backgroundColor: isLoading ? 'transparent' : primaryOverlayColor,
              borderRadius: 16, // the others are at 20 as of 7/7/25, this one is too short to look like it matches when it is also at 20
            },
          ]}
        >

          {/* {isLoading && (
            <LoadingBlock
            loading={true}
            />
          )} */}
          {!isLoading && ( 

         
          <View
            style={{
              borderRadius: 20,
              flexDirection: "row",
              height: "100%",
              width: "100%",
              alignItems: "center",

              // marginBottom: outerPadding, // turn back on to add body content to this component
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Pressable
                hitSlop={10}
                onPress={
                  helloesList && helloesList.length > 0
                    ? navigateToHelloes
                    : () => {}
                }
                style={{ flexDirection: "row" }}
              >
                <MaterialCommunityIcons
                  //  name="image-edit-outline"
                  name="calendar-heart"
                  // name="graph"
                  size={20}
                  color={primaryColor}
                  style={{ marginBottom: 0 }}
                />
                <Text
                  style={[
                    {
                      color: primaryColor,
                      marginLeft: 6,
                      marginRight: 12,
                      fontWeight: "bold",
                    },
                  ]}
                >
                  Helloes ({helloesList && helloesList.length})
                </Text>
              </Pressable>
              <Pressable hitSlop={10} onPress={navigateToHelloes}>
                <Text
                  style={[
                    { color: primaryColor, fontWeight: "bold", fontSize: 13 },
                  ]}
                >
                  Details
                </Text>
              </Pressable>
            </View>
          </View>
           )}
        </View>
      )}
    </>
  );
};

export default Helloes;
