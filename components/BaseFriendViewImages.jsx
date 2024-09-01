import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';  
import ItemImageMulti from '../components/ItemImageMulti';  
import { useImageList } from '../context/ImageListContext';

const BaseFriendViewImages = ({
  buttonHeight = 136,
  buttonRadius = 10, 
  headerSvg = null,
  allItems,   
  backgroundColor = 'transparent', 
  showGradient = true,
  darkColor = 'black',
  lightColor = '#C0C0C0',
  direction = { x: 1, y: 0 },     
}) => {  
  const { imageList } = useImageList();
  const [isImageListReady, setIsImageListReady] = useState(false);

  useEffect(() => {
    if (imageList.length > 0) {
      setIsImageListReady(true);
    }
  }, [imageList]);

  return (
    <View style={styles.container}>  
      <View style={{ flexDirection: 'row' }}>
        <View style={[styles.mainButtonContainer, { height: buttonHeight, borderRadius: buttonRadius, width: '100%' }]}>
          <View style={{
              flexDirection: 'row',
              width: '100%',
              height: buttonHeight,
              padding: 6,
              borderRadius: buttonRadius, 
              overflow: 'hidden',
              backgroundColor: showGradient ? 'transparent' : backgroundColor,
            }}
          >
            {showGradient && (
              <LinearGradient
                colors={[darkColor, lightColor]}
                start={{ x: 0, y: 0 }}
                end={direction}
                style={StyleSheet.absoluteFillObject}
              />
            )}
            <View style={[styles.mainSection, { height: buttonHeight, width: '100%', borderRadius: buttonRadius }]}>
              <View style={styles.svgContainer}>
                {headerSvg}
              </View>
              <View style={{ flexDirection: 'row' }}>
                {isImageListReady && (
                  <View style={{ flex: 1 }}> 
                    <ItemImageMulti imageData={allItems} width={40} height={40} containerWidth={254} borderRadius={buttonRadius} /> 
                  </View>
                )} 
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({ 
  mainSection: {
    flexDirection: 'row',
    paddingHorizontal: 10, 
    paddingTop: 5,
    paddingBottom: 4, 
    flex: 1 
  },
  svgContainer: {
    paddingTop: 7,
    marginRight: 30,   
},   
});

export default BaseFriendViewImages;
