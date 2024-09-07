import React from 'react'; 
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';  
import ItemImageMulti from '../components/ItemImageMulti';  
import { useImageList } from '../context/ImageListContext';
import PhotoSolidSvg from '../assets/svgs/photo-solid.svg'; // Import the SVG


const BaseFriendViewImages = ({
  buttonHeight = 136,
  buttonRadius = 10,  
  backgroundColor = 'transparent', 
  showGradient = true,
  darkColor = 'black',
  lightColor = '#C0C0C0',
  direction = { x: 1, y: 0 },
  buttonComponent = null, // New prop for button component
}) => {  
  const { imageList } = useImageList();
  const [isImageListReady, setIsImageListReady] = useState(false);

  useEffect(() => {
    if (imageList.length > 0) {
      setIsImageListReady(true);
    }
  }, [imageList]);

  return (  
    <View style={[styles.container, { backgroundColor: showGradient ? 'transparent' : backgroundColor, height: buttonHeight, borderRadius: buttonRadius }]}>
      {showGradient && (
        <LinearGradient
          colors={[darkColor, lightColor]}
          start={{ x: 0, y: 0 }}
          end={direction}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      <View style={styles.headerContainer}> 
          <PhotoSolidSvg width={68} height={68} color="white" />

      </View> 
      <View style={styles.contentContainer}>
        {isImageListReady && (
          <ItemImageMulti imageData={imageList} width={50} height={50} containerWidth={254} borderRadius={10} />
        )}
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
    justifyContent: 'center', // Vertically centers content
  },
  buttonContainer: {
    marginLeft: 10, // Space between content and action button
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BaseFriendViewImages;
