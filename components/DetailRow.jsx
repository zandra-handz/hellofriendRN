import React from 'react';
import { View, Text, StyleSheet  } from 'react-native'; 
import { useGlobalStyle } from '../context/GlobalStyleContext'; // Import your context hook
 

const DetailRow = ({ 
    iconName, 
    color,
    iconSize,
    svg: Svg,
    label,
    value,
  useFill=false  }) => {

  const { themeStyles } = useGlobalStyle();

  return (
    <View style={styles.row}>
      
      <View style={styles.svgContainer}>
 
 {Svg && !useFill && <Svg height={iconSize} width={iconSize} color={color || themeStyles.genericText.color} />}
 {Svg && useFill && <Svg height={iconSize} width={iconSize} fill={color || themeStyles.genericText.color} />}
 
 </View>
      <View style={styles.textContainer}>

        {/* <FontAwesome5 name={iconName} size={iconSize} style={[styles.icon, themeStyles.modalIconColor]} />
         */}
        <Text style={[styles.label, themeStyles.modalText, {color: color || themeStyles.genericText.color }]}>{label}</Text>
        <Text style={[styles.value, themeStyles.modalText, {color: color || themeStyles.genericText.color}]}>{value}</Text>
  
      </View>
      <>  
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
     
    
    width: '100%',
    marginBottom: 8,
  },
  textContainer: {
    flexDirection: 'row',
    textAlign: 'center', 
  },
  svgContainer: {
    width: '7%', //ADJUST WIDTH OF SVG CONTAINER HERE
    flexDirection: 'row', 
   height: '100%',
   alignItems: 'center',
   justifyContent: 'center', 
   overflow: 'hidden',
   marginRight: '2%', //ADJUST GAP BETWEEN SVG AND LABEL HERE
   //backgroundColor: 'blue',

  },
  icon: {
    paddingTop: 2,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  value: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
  },
  customButton:  { 
    marginLeft: 6, 
    borderRadius: 15, 
    backgroundColor: '#ccc', 
    paddingVertical: 4, 
    paddingHorizontal: 8,
  }, 

  altButton: {
    borderRadius: 15, 
    paddingVertical: 4, 
    alignContent: 'center',
    paddingHorizontal: 10,
  },
});

export default DetailRow;
