import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import BaseFriendViewImages from '../components/BaseFriendViewImages';
import TogglerActionButton from '../components/TogglerActionButton';
import GridViewOutlineSvg from '../assets/svgs/grid-view-outline.svg';
import { useGlobalStyle } from '../context/GlobalStyleContext';
import { useImageList } from '../context/ImageListContext';
import { useNavigation } from '@react-navigation/native';
import { useAuthUser } from '../context/AuthUserContext';

const ComposerFriendImages = ({
  onPress,
  headerText='IMAGES',
  buttonHeight = 70,
  buttonRadius = 20,
  justifyIconContent = 'center',
  inactiveIconColor = 'white',
  topIconSize = 30,
  bottomIconSize = 30,
  backgroundColor = 'black', // #2B2B2B
  includeHeader = true,
  headerInside = false,
  headerHeight = 30,
  headerTextColor = 'white',
  headerFontFamily = 'Poppins-Bold',
  headerTextSize = 16, 
}) => {
  const { userAppSettings } = useAuthUser();
  const navigation = useNavigation();
  const { themeStyles } = useGlobalStyle();
  const { imageCount } = useImageList();
  const [ count, setCount ] = useState('');
  const calculatedButtonHeight = headerInside ? buttonHeight + headerHeight : buttonHeight;

  const navigateToImageScreen = () => {
    navigation.navigate('Images');
    if (onPress) onPress();
  };

  useEffect(() => {
    if ( userAppSettings && userAppSettings.simplify_app_for_focus) {
      setCount('');
    } else { 
      setCount(`(${imageCount})`);
    } 
  }, [userAppSettings.simplify_app_for_focus]);


  return (
    <View style={[styles.container, themeStyles.friendFocusSection, { borderRadius: buttonRadius }]}>
      <View style={[styles.containerInner, { borderRadius: buttonRadius }]}>
        {includeHeader && !headerInside && (
          <View style={[styles.headerContainer, { height: headerHeight }]}>
            <Text style={[styles.headerText, { color: headerTextColor, fontFamily: headerFontFamily, fontSize: headerTextSize }]}>
              {headerText} {count}
            </Text>
          </View>
        )}
        <View style={styles.containerInnerRow}>
          <View style={[styles.containerHeaderInside,  { backgroundColor: 'transparent', borderTopRightRadius: buttonRadius }]}>
            {includeHeader && headerInside && (
              <View style={[styles.headerContainer, themeStyles.friendFocusSection, { borderTopRightRadius: buttonRadius, height: headerHeight  }]}>
                <Text style={[styles.headerText, themeStyles.friendFocusSectionText, { fontFamily: headerFontFamily, fontSize: headerTextSize }]}>
                  {headerText} {count}
                </Text>
              </View>
            )} 
              <BaseFriendViewImages
                buttonHeight={buttonHeight}
                buttonRadius={buttonRadius}
                backgroundColor={backgroundColor}
                showGradient={false}
                buttonComponent={
                  <TogglerActionButton
                    navigateToLocationScreen={navigateToImageScreen}
                    height={calculatedButtonHeight}
                    borderRadius={buttonRadius}
                    justifyContent={justifyIconContent}
                    marginLeft={0}
                    backgroundColor={backgroundColor}
                    topIconSize={topIconSize}
                    bottomIconSize={bottomIconSize}
                    iconColor={inactiveIconColor}
                    highlightIconColor={backgroundColor}
                    oneButtonOnly={true}
                    firstPageTopSvg={GridViewOutlineSvg}
                    firstPageBottomSvg={GridViewOutlineSvg}
                  />
                }
              />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center', 
  },
  containerInner: {
    flexDirection: 'column',
    width: '100%',
    backgroundColor: 'transparent', 
  },
  containerHeaderInside: {
    flexDirection: 'column',
    marginBottom: 20,
    flex: 1,
    zIndex: 1,
  },
  containerInnerRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'transparent',
  },
  headerContainer: {
    justifyContent: 'center', 
    marginBottom: 2,
    zIndex: 0,
  },
  headerText: {
    marginLeft: 10, 
  },
});

export default ComposerFriendImages;
