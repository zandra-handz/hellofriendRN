import React from "react";
import { View, Text, Pressable } from "react-native";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import MomentsList from "@/app/components/moments/MomentsList";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useNavigation } from "@react-navigation/native";
import AddOutlineSvg from "@/app/assets/svgs/add-outline.svg";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SpeedDialDelux from "@/app/components/buttons/speeddial/SpeedDialDelux";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import Loading from "@/app/components/appwide/display/Loading";
import { useRoute } from "@react-navigation/native";
import usePrefetches from "@/src/hooks/usePrefetches";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";
import LargeThoughtBubble from "@/app/components/moments/LargeThoughtBubble";
const ScreenMoments = () => {
  const route = useRoute();
  const scrollTo = route.params.scrollTo ?? null;
  const { capsuleList } = useCapsuleList();
  const { themeStyles, appFontStyles, manualGradientColors } = useGlobalStyle();
  const { selectedFriend, loadingNewFriend } = useSelectedFriend();
const { navigateToMomentFocus } = useAppNavigations();
  const { prefetchUserAddresses, prefetchFriendAddresses } = usePrefetches();

  const navigation = useNavigation();
  prefetchUserAddresses();
  prefetchFriendAddresses();

  const handleRootPressPrefetch = () => {
    // prefetchUserAddresses();
    // prefetchFriendAddresses();
  };

  return (
    <SafeViewAndGradientBackground
      // includeBackgroundOverlay={true}
      backgroundOverlayHeight={120}
      // backgroundOverlayBottomRadius={20}
      style={{ flex: 1 }}
    >
      <View style={{ paddingHorizontal: 10 }}>
        <View
          style={[
            themeStyles.primaryBackground,
            {
              paddingHorizontal: 20,
flexDirection: 'row',
              paddingVertical: 10,
              alignItems: "center",
              justifyContent: "center",
             // justifyContent: 'space-between',
              borderRadius: 10,
              marginVertical: 10,
            },
          ]}
        >
          {/* <Text style={[themeStyles.primaryText, appFontStyles.subWelcomeText, {fontSize: 18, fontWeight: 'bold'}]}>Share mode</Text> */}

          <View>
            <Pressable onPress={navigateToMomentFocus} hitSlop={20} style={{position: 'absolute', top: 0, right: -10}}>
              <MaterialCommunityIcons
              name={'plus'}
              size={16}
              color={manualGradientColors.homeDarkColor}
              style={{backgroundColor: manualGradientColors.lightColor, borderRadius: 999}}
              />
            </Pressable>
            
          <MaterialCommunityIcons
      
            name="leaf"
            size={26}
            color={themeStyles.primaryText.color}
          />

          </View>
        
        </View>
      </View>
      <View
        style={{
          width: "100%",
          zIndex: 1,
          elevation: 1,
          paddingHorizontal: 20,
          alignItems: "center",
          width: "100%",

          // height: 60,
          height: 0,
          flexDirection: "column",
          justifyContent: "flex-end",
          marginTop: 0,
        }}
      >
        {/* <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "flex-start",
          //             padding: 10,
          //     backgroundColor: themeStyles.primaryBackground.backgroundColor,
          //  borderRadius: 10,
       
          }}
        >
          <Text
            style={[
              themeStyles.primaryText,
              appFontStyles.welcomeText,
             { fontSize: appFontStyles.welcomeText.fontSize - 10,  
             
              },
            ]}
          >
            Share mode
          </Text>
          {/* <LargeThoughtBubble/>  </View> */}
      </View>
      <View style={{ width: "100%", height: 4 }}></View>
      <Loading isLoading={loadingNewFriend} />

      {selectedFriend && !loadingNewFriend && (
        <>
          <View style={{ flex: 1 }}>
            {capsuleList && <MomentsList scrollTo={scrollTo} />}
          </View>
        </>
      )}
      {/* {selectedFriend && (
        <SpeedDialDelux
          rootIcon={AddOutlineSvg}
          topIcon={AddOutlineSvg}
          rootOnPressPrefetches={handleRootPressPrefetch}
          topOnPress={() => navigation.navigate("LocationSearch")} // selectedFriend needed for this screen I believe
          midIcon={<MaterialCommunityIcons name="hand-wave-outline" />}
          midOnPress={() => navigation.navigate("Finalize")}
          deluxButton={<AddMomentButton />}
        />
      )} */}
    </SafeViewAndGradientBackground>
  );
};

export default ScreenMoments;
