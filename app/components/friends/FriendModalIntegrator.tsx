import React, { useCallback, useState, useRef } from "react";
import { View, Text, Pressable, DimensionValue } from "react-native";

 
import { useFriendDash } from "@/src/context/FriendDashContext";
import LoadingPage from "../appwide/spinner/LoadingPage"; 
 import { AppFontStyles } from "@/app/styles/AppFonts";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { useNavigation } from "@react-navigation/native";
import useDoublePress from "../buttons/useDoublePress";
import { MaterialCommunityIcons } from "@expo/vector-icons"; 

interface FriendModalIntegratorProps {
  addToPress: () => void;
  color: string;
  height: DimensionValue;
  addToOpenModal: () => void;
  includeLabel: boolean;
  navigationDisabled: boolean;
  useGenericTextColor?: boolean;
  iconSize: number;
  width: DimensionValue;
  customLabel: string | null; 
}



const FriendModalIntegrator: React.FC<FriendModalIntegratorProps> = ({
  
  color,
  height = "auto",
  customLabel = "", 
 
  useGenericTextColor = false,
  includeLabel = false,
  iconSize = 22,
  width = "auto",
  // friendId, // trying to just use name, but this is available if needed
  friendName,
  themeAheadOfLoading,
  primaryColor='orange',
}) => {
  // console.log("FRIEND SELECTOR RERENDERED");
 
  const navigation = useNavigation(); 
  const { loadingDash } = useFriendDash(); 

  const { navigateToAddFriend, navigateToSelectFriend} = useAppNavigations();

  const handleNavigateToSelectFriend = () => {
    navigateToSelectFriend({useNavigateBack: false})

  };
const { handleDoublePress} = useDoublePress({onSinglePress: handleNavigateToSelectFriend, onDoublePress: navigateToAddFriend})
  
  const [lastPress, setLastPress] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const DOUBLE_PRESS_DELAY = 300;


  const handlePress = () => {
    const now = Date.now();






  };
  

  const firstSelectLabel = customLabel ? customLabel : `Pick friend: `;

  const defaultLabelStyle = {
    fontWeight: "bold",
    fontSize: 15,
  };

  const RenderText = useCallback(
    () => (
      <Text
        style={[ AppFontStyles.subWelcomeText, 
          {
            color:
              friendName && !useGenericTextColor
                ? themeAheadOfLoading.fontColorSecondary
                : primaryColor,

            zIndex: 2,
          },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {(!useGenericTextColor && `For:  ${friendName}`) ||
          firstSelectLabel}
      </Text>
    ),
    [ 
      defaultLabelStyle,
      friendName,
      themeAheadOfLoading,
      primaryColor,
    ]
  );

  const RenderIcon = useCallback(
    () => (
      <MaterialCommunityIcons
        name="account-switch-outline"
        size={iconSize}
        color={
          loadingDash
            ? "transparent"
            : friendName && !useGenericTextColor
              ? color || themeAheadOfLoading.fontColorSecondary
              : primaryColor
        }
      />
    ),
    [loadingDash, friendName, themeAheadOfLoading, primaryColor]
  );

  return (
    <>
      <Pressable
        // onPress={openModal}
        onPress={handleDoublePress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Friend selector button"
        style={{
          flexDirection: "row",
          height: height,
          alignItems: "center",

          width: width,
        }}
      >
        <View
          style={{
            width: "auto",
            height: "100%",
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          {loadingDash && (
            <View style={{ paddingRight: "14%" }}>
              <LoadingPage
                loading={true}
                spinnerType="flow"
                spinnerSize={30}
                color={themeAheadOfLoading.darkColor}
                includeLabel={false}
              />
            </View>
          )}

          {!loadingDash && includeLabel && <RenderText />}

          <View style={{ paddingLeft: 0, marginLeft: 6 }}>
            <RenderIcon />
          </View>
        </View>
      </Pressable>
    </>
  );
};

export default FriendModalIntegrator;
