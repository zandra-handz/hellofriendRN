import React from 'react'; 
import BaseFriendViewImages from '../components/BaseFriendViewImages';
import TogglerActionButton from '../components/TogglerActionButton';
import GridViewOutlineSvg from '../assets/svgs/grid-view-outline.svg';

import { useNavigation } from '@react-navigation/native';

const ComposerFriendImages = ({ 
  onPress, 
  buttonHeight = 70,
  buttonRadius = 20, 
  justifyIconContent = 'center',
  inactiveIconColor = 'white',
  topIconSize = 30,
  bottomIconSize = 30,
  oneBackgroundColor = 'black', // #2B2B2B
}) => { 
  const navigation = useNavigation(); 

  const navigateToImageScreen = () => {
    navigation.navigate('Images'); 
    if (onPress) onPress(); 
}; 

  return (
    <BaseFriendViewImages
      buttonHeight={100}
      buttonRadius={buttonRadius}

      showGradient={true}
      lightColor={oneBackgroundColor}
      darkColor={oneBackgroundColor}
      buttonComponent={
        <TogglerActionButton  
          navigateToLocationScreen={navigateToImageScreen}
          height={buttonHeight}
          borderRadius={buttonRadius}
          justifyContent={justifyIconContent}
          marginLeft={16}
          backgroundColor={oneBackgroundColor}
          topIconSize={topIconSize}
          bottomIconSize={bottomIconSize}
          iconColor={inactiveIconColor}
          highlightIconColor={oneBackgroundColor}
          oneButtonOnly={true}
          firstPageTopSvg={GridViewOutlineSvg} 
          firstPageBottomSvg={GridViewOutlineSvg}
        />
      }
    />
  );
};

export default ComposerFriendImages;
