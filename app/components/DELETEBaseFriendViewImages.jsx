import React from 'react'; 
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';  
import ItemImageMulti from '../components/ItemImageMulti';  
import { useImageList } from '../context/ImageListContext';
import PhotoSolidSvg from '../assets/svgs/photo-solid.svg'; // Import the SVG
import { useGlobalStyle } from '../context/GlobalStyleContext';


const BaseFriendViewImages = ({
  buttonHeight = 136,
  buttonRadius = 10,   
  buttonComponent = null, 
}) => {  
  const { themeStyles } = useGlobalStyle();
  const { imageList } = useImageList();
  const [isImageListReady, setIsImageListReady] = useState(false);

  useEffect(() => {
    if (imageList.length > 0) {
      setIsImageListReady(true);
    }
  }, [imageList]);

  return (  
    <View style={[styles.container, themeStyles.friendFocusSection, { height: buttonHeight, borderRadius: buttonRadius }]}>
 
    <View style={{ width: '90%', flexDirection: 'row', borderRadius: buttonRadius, height: buttonHeight, justifyContent: 'space-between', backgroundColor: 'transparent'}}> 
        
      <View style={styles.headerContainer}> 
          <PhotoSolidSvg width={50} height={50} style={themeStyles.friendFocusSectionIcon} />

      </View> 
      <View style={[styles.contentContainer]}>
     
        {isImageListReady && (
          <ItemImageMulti imageData={imageList} width={50} height={50} containerWidth={262} borderRadius={10} />
        )}
      </View>
      </View> 
      {buttonComponent && (
        <View style={styles.buttonContainer}>
          {buttonComponent}
        </View>
      )}
    </View>  
  );
};

const styles = StyleSheet.create({ 
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%', 
    position: 'relative',
    borderRadius: 10, // Ensure this matches buttonRadius if set dynamically
    overflow: 'hidden', // Add this to handle overflow
  },
  headerContainer: {
    paddingLeft: 10,
    marginRight: 10, // Adjust this to control space between SVG and content
    
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1, // Takes the remaining space in the row
    justifyContent: 'center',  
  },
  buttonContainer: {
    paddingRight: 10, // Space between content and action button
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

export default BaseFriendViewImages;
