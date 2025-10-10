import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { SlideInLeft } from "react-native-reanimated";
import manualGradientColors from "@/app/styles/StaticColors";
import useCreateNewCategory from "@/src/hooks/CategoryCalls/useCreateNewCategory";
import SearchBarGoogleAddress from "../locations/SearchBarGoogleAddress";
import FlashMessage from "../alerts/FlashMessage";
import SearchBarAnimationWrapper from "../foranimations/SearchBarAnimationWrapper";

type Props = {
  userId: number;
  height: number;
  fontStyle?: number;
  addToOnPress?: ({
    categoryId,
    categoryName,
  }: {
    categoryId: number;
    categoryName: string;
  }) => void; //sets selected category Id after creating it
};

const FindNewLocation = ({
  primaryColor = "orange",
  primaryBackground,
  userId,
  height = 60,
  fontStyle = 1,
  onPress,
  addToOnPress,
}: Props) => {
  const newCategoryRef = useRef(null);
  const [newCategory, setNewCategory] = useState("");

  const searchStringRef = useRef(null);


  const HEIGHT = height - 20;
  const SEARCH_INPUT_LEFT_PADDING = 60;  // so google search input isn't covered by back button

  const [searchString, setSearchString] = useState("");
  const [mountingText, setMountingText] = useState("");

  const updateSearchString = (text) => {
    setSearchString(text);

    if (searchStringRef && searchStringRef.current) {
      searchStringRef.current.setText(text);
    }
  };

//   const ENTER_MESSAGE_WIDTH = 60;

  const [flashMessage, setFlashMessage] = useState<null | {
    text: string;
    error: boolean;
    duration: number;
  }>(null);

 
  const [inputActive, setInputActive] = useState(false);

  useEffect(() => {
    if (inputActive && newCategoryRef.current) {
      console.log("ready!!!!!!");
      setTimeout(() => setNewCategory(""), 0);
      setTimeout(() => {
        newCategoryRef.current?.focus();
      }, 50);
    } else if (!inputActive && newCategoryRef.current) {
      setTimeout(() => {
        setNewCategory("");
      }, 50);
    }
  }, [inputActive]);

  const toggleInput = () => {
    setInputActive((prev) => !prev);
  };

  return (
    <>
      {flashMessage && (
        <FlashMessage
          isInsideModal={true}
          message={flashMessage.text}
          error={flashMessage.error}
          onClose={() => setFlashMessage(null)}
        />
      )}

      <View
        style={{
        //   flexDirection: "row",
        //   alignItems: "center",
         

          paddingLeft: 0,
          borderRadius: fontStyle === 2 ? 20 : 0,
          width: inputActive ? "100%" : 60,
          height: !inputActive ? HEIGHT : '100%',
          backgroundColor: inputActive
            ? manualGradientColors.lightColor
            : "transparent",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "orange",
            height: "100%",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Pressable
            onPress={toggleInput}
            style={{
              width: "auto",
              paddingHorizontal: 10,
             // position: "absolute",
              zIndex: 40000,
              height: HEIGHT,
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'yellow',
              
            }}
          >
            <MaterialIcons
              name={!inputActive ? "add" : "keyboard-backspace"}
              color={primaryColor}
              color={manualGradientColors.homeDarkColor}
              size={16}
              style={{
                backgroundColor: manualGradientColors.lightColor,
                borderRadius: 999,
              }}
            />
          </Pressable>

          {!inputActive && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 36,
                width: 200,
                height: "100%",
              }}
            >
              <Text
                style={[
                  {
                    color: primaryColor,
                    fontSize: fontStyle === 2 ? 18 : 15,
                    fontWeight: fontStyle === 2 ? "regular" : "bold",
                    fontFamily: fontStyle === 2 ? "Poppins-Regular" : undefined,
                  },
                ]}
              >
                Add new
              </Text>
            </View>
          )}
        </View>

        {inputActive && (
          <Animated.View
            key="inputBox"
            entering={SlideInLeft}
            style={{
              width: "100%",
              // flexGrow: 1,
              position: "absolute",
              left: 0,
              right: 0,
              paddingLeft: 0,
              paddingRight: 0,
              backgroundColor: "pink",
            }}
          >
            <SearchBarAnimationWrapper>
                <View style={{width: '100%'}}>

            
              <SearchBarGoogleAddress
                ref={searchStringRef}
                mountingText={mountingText}
                autoFocus={true}
                onPress={onPress}
                searchBarLeftPadding={40}
                visible={true}
                onTextChange={updateSearchString}
                paddingLeft={SEARCH_INPUT_LEFT_PADDING}
                primaryColor={primaryColor}
                primaryBackground={primaryBackground}
              />
                  </View>
            </SearchBarAnimationWrapper>
          </Animated.View>
        )}
      </View>
    </>
  );
};

export default FindNewLocation;
