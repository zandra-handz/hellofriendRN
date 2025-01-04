import React from 'react';
import { View, Text, StyleSheet  } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useGlobalStyle } from '../context/GlobalStyleContext'; // Import your context hook
 

const DetailRow = ({ 
    iconName, 
    iconSize,
    svg,
    label,
    value  }) => {

  const { themeStyles } = useGlobalStyle();

  return (
    <View style={styles.row}>
      <View style={{flexDirection: 'row'}}>
        <FontAwesome5 name={iconName} size={iconSize} style={[styles.icon, themeStyles.modalIconColor]} />
        
        <Text style={[styles.label, themeStyles.modalText]}>{label}</Text>
        <Text style={[styles.value, themeStyles.modalText]}>{value}</Text>
  
      </View>
      <>  
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelSection: {
    flexDirection: 'row',
    alignItems: 'center',
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
    //fontFamily: 'Poppins-Regular',
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
