import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { useGlobalStyle } from "../context/GlobalStyleContext";
import { useSelectedFriend } from "../context/SelectedFriendContext";
import ArrowLeftCircleOutline from "../assets/svgs/arrow-left-circle-outline.svg";
import { useNavigation } from "@react-navigation/native";
import LoadingPage from "../components/LoadingPage";
import { useFriendList } from "../context/FriendListContext";
import { LinearGradient } from "expo-linear-gradient";
import ImageGallerySingleOutlineSvg from "../assets/svgs/image-gallery-single-outline.svg";

import SlideToDeleteHeader from '../components/SlideToDeleteHeader';

import TrashOutlineSvg from "../assets/svgs/trash-outline.svg";


//positioning doesn't entirely match HeaderMoments, may see issues on other screens/platforms
//but this is an improvement over HeaderBaseItemView

const HeaderImageWithSlider = ({     itemData,
    
    onBackPress, 
    onSliderPull,
    headerTitle='Header title here' }) => {


    const { width, height } = Dimensions.get('window'); 

  const { themeStyles } = useGlobalStyle();
  const { loadingNewFriend } = useSelectedFriend();
  const { themeAheadOfLoading } = useFriendList();
  const navigation = useNavigation();

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  const handleNavigateToAllImages = () => {
    navigation.navigate("Images");
  };

  return (
    <>
      <LinearGradient
        colors={[themeAheadOfLoading.darkColor, themeAheadOfLoading.lightColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.headerContainer]}
      >
        {loadingNewFriend && themeAheadOfLoading && (
          <View
            style={[
              styles.loadingWrapper,
              { backgroundColor: themeAheadOfLoading.darkColor },
            ]}
          >
            <LoadingPage
              loading={loadingNewFriend}
              spinnerType="flow"
              color={"transparent"} //themeAheadOfLoading.lightColor
              includeLabel={false}
            />
          </View>
        )}
        {!loadingNewFriend && (
          <View style={{flexDirection: 'column', height: '100%', paddingHorizontal: '4%', justifyContent: 'space-between'}}>
          <View style={{ flexDirection: 'row', width: width - 18, alignItems: 'center', alignContent: 'center', justifyContent: 'space-between'}}>
            <View
              style={{
                flexDirection: "row",
                width: "50%", 
                justifyContent: "flex-start",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={onBackPress}>
                <ArrowLeftCircleOutline
                  height={30}
                  width={30}
                  color={themeAheadOfLoading.fontColor}
                />
              </TouchableOpacity>
            </View>

            <View style={{flexDirection: 'row', width: '50%', alignItems: 'center', justifyContent: 'flex-end'}}>
            
            <Text
              style={[
                styles.headerText,
                themeStyles.headerText,
                {
                  color: themeAheadOfLoading.fontColorSecondary, 
                },
              ]}
            >
              {headerTitle}
            </Text> 
              <TouchableOpacity onPress={handleNavigateToAllImages}>
                 
                  <ImageGallerySingleOutlineSvg
                    height={36}
                    width={36}
                    color={themeAheadOfLoading.fontColorSecondary}
                    style={{paddingHorizontal: 22 }}

                  /> 
              </TouchableOpacity>
            </View>
            
            
          </View>
            <View style={styles.sliderContainer}>
          <SlideToDeleteHeader
            itemToDelete={itemData}
            onPress={onSliderPull}
            sliderWidth={"100%"}
            targetIcon={TrashOutlineSvg}
          />
        </View>
          </View>
          
        )}
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: { 
    padding: '3%',
    paddingTop: '1%',
    paddingHorizontal: '3%',
    alignItems: "center",
    //justifyContent: "space-between",
    height: 80, 
    flexDirection: 'column',
    justifyContent: 'flex-start', 
    paddingBottom: '1%',
    
  }, 
  headerText: { 
    fontSize: 20, 
    fontFamily: "Poppins-Regular",
   
  },
  usernameText: {
    fontSize: 14,
    paddingVertical: 2,
    fontFamily: "Poppins-Bold",
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderContainer: {
    //position: "absolute",
    bottom: 0,
    left: -4,
    right: 0,
    zIndex: 3,
    height: 28, 
    width: "100%",
  },
});

export default HeaderImageWithSlider;
