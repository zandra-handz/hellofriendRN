import React, { useCallback } from "react";
import { View, Text } from 'react-native';
import { useRoute } from "@react-navigation/native";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import GlobalAppHeader from "@/app/components/headers/GlobalAppHeader";
import LeavesTwoFallingOutlineThickerSvg from "@/app/assets/svgs/leaves-two-falling-outline-thicker.svg";
import { useFocusEffect } from "@react-navigation/native";
import CarouselSlider from "@/app/components/appwide/CarouselSlider";
import { useFriendList } from "@/src/context/FriendListContext";

import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

const ScreenUnsavedLocationView = () => {
  const route = useRoute();
  const currentIndex = route.params?.index ?? null;
  const { themeStyles, appFontStyles } = useGlobalStyle();

  const { capsuleList, deleteMomentRQuery } = useCapsuleList();
  // const [currentIndex, setCurrentIndex] = useState(0);
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();

  const renderHeader = useCallback(
    () => (
      <GlobalAppHeader
        title={"LOCATIONS"}
        navigateTo={"Locations"}
        icon={LeavesTwoFallingOutlineThickerSvg}
        altView={false}
      />
    ),
    [selectedFriend, loadingNewFriend, themeAheadOfLoading]
  );

  return (
    <SafeViewAndGradientBackground header={renderHeader} style={{ flex: 1 }}>
      {/* <CarouselSlider
        initialIndex={currentIndex}
        data={capsuleList}
        children={MomentViewPage}
      /> */}

      <View
        style={[
          //REMOVE IF USING momentsAdded code
          //appContainerStyles.screenContainer,
          { flexDirection: "column", justifyContent: "center" },
        ]}
      >
        <View
          style={{
            width: "100%",
            height: "auto",
            padding: 10,

            // START of code from momentsAdded to alter height
            top: 100,
            bottom: 200,
            right: 0,
            left: 0,
            height: 300,
            // END
          }}
        >
          <View
            style={[
              themeStyles.overlayBackgroundColor,
              {
                marginVertical: 2,
                padding: 20,
                width: "100%",
                height: "auto",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                textAlign: "center",
                flexWrap: "wrap",
              },
            ]}
          >
            <Text style={[themeStyles.primaryText, appFontStyles.welcomeText]}>
              Unsaved Location Single View
            </Text>
          </View>
         
        </View>
      </View>
    </SafeViewAndGradientBackground>
  );
};

export default ScreenUnsavedLocationView;
