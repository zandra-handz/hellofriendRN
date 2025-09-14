import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import React, { useState, useEffect, useRef, useMemo } from "react"; 
import {  MaterialIcons } from "@expo/vector-icons";
import Animated, { SlideInLeft } from "react-native-reanimated"; 
import manualGradientColors  from "@/src/hooks/StaticColors";
 
import FlashMessage from "../alerts/FlashMessage";

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

const AddCustomLocation = ({
  primaryColor='orange',
  primaryBackground, 
  onSubmit,
 
  height = 60,
  fontStyle = 1,
  addToOnPress,
}: Props) => { 
  const customEntryRef = useRef(null);
  const [customEntry, setCustomEntry] = useState("");
 
  const ENTER_MESSAGE_WIDTH = 60;

  const [flashMessage, setFlashMessage] = useState<null | {
    text: string;
    error: boolean;
    duration: number;
  }>(null);

 
 
 
    const [inputActive, setInputActive] = useState(false);

 
 

  useEffect(() => {
    if (inputActive && customEntryRef.current) {
 
      setCustomEntry(" "); // space or something else
      setTimeout(() => setCustomEntry(""), 0);
      setTimeout(() => {
        customEntryRef.current?.focus();
      }, 50);
    } else if (!inputActive && customEntryRef.current) {
      setTimeout(() => {
        setCustomEntry("");
      }, 50);
    }
  }, [inputActive]);
 
 

  const toggleInput = () => {
 

    // if (inputActive) {

    //   clearInput();
    // } else {
    //   handleRefocus();
    // }
    setInputActive((prev) => !prev);
  };

  const handleSave = () => {
    onSubmit(customEntry);
    // handleCreateCategory();
  };

  const handleCreateCategory = async () => {
    // if (!newCategoryRef?.current?.value) {
    //   return;
    // }
 
  };

  const handleUpdateCustomEntryText = (text: string) => {
 
    setCustomEntry(text);
 
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
 
 
        <Pressable
          onPress={toggleInput}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 0,
            borderRadius: fontStyle === 2 ? 20 : 0,
            width: inputActive ? "100%" : "100%",
            height: height - 20,
            backgroundColor: inputActive
              ? manualGradientColors.lightColor
              : "transparent",
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

          {!inputActive && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 18,
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
                Manual 
              </Text>
            </View>
          )}

          {inputActive && (
            <Animated.View
              key="inputBox"
              entering={SlideInLeft}
              style={{
                width: "90%",
                flexGrow: 1,
                paddingLeft: 11,
                paddingRight: 0,
              }}
            >
              <TextInput
                ref={customEntryRef}
                style={[ 
                  {
                    color: primaryColor,
                    fontFamily: "Poppins-Regular",
                    fontSize: 14,
                    lineHeight: 14,
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: primaryColor,
                    borderRadius: fontStyle === 2 ? 20 : 0,
                    width: "100%",
                    flex: 1,

                    flexDirection: "row",
                    alignItems: "center",
                    alignContents: "center",
                    paddingLeft: 12,
                    paddingRight: ENTER_MESSAGE_WIDTH + 12, // space for enter message
                    backgroundColor: primaryBackground,
                  },
                ]}
                autoFocus={true}
                value={customEntry}
                onSubmitEditing={handleSave}
                onChangeText={handleUpdateCustomEntryText}
              />

              {customEntry && customEntry.length > 0 && (
                <View
                  style={{
                    position: "absolute",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    width: ENTER_MESSAGE_WIDTH,

                    right: 0,
                  }}
                >
                  <View
                    style={{
                      flexWrap: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: ENTER_MESSAGE_WIDTH - 20, // for paddingHorizontal of 10
                    }}
                  >
                    <Text
                      style={[ 
                        {
                          color: primaryColor,
                          opacity: 0.6,
                          fontSize: 13,
                          lineHeight: 12,
                          fontWeight: "bold",
                        },
                      ]}
                    >
                      Press Enter
                    </Text>
                  </View>
                </View>
              )}
            </Animated.View>
          )}
        </Pressable>
    
    </>
  );
};

export default AddCustomLocation;
