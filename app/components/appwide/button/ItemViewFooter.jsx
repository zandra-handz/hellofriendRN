
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useGlobalStyle } from '@/src/context/GlobalStyleContext';
import TrashOutlineSvg from '@/app/assets/svgs/trash-outline.svg';
import EditOutlineSvg from '@/app/assets/svgs/edit-outline.svg';


const ItemViewFooter = ({ buttons, maxButtons, showLabels, alignment = 'left', padding = 26 }) => {
  
  const { themeStyles } = useGlobalStyle(); 

  const displayedButtons = maxButtons ? buttons.slice(0, maxButtons) : buttons;

  const determineSvg = (buttonPurpose, buttonIconSize, onPress) => {
    if (buttonPurpose == 'edit') {
      return <EditOutlineSvg width={buttonIconSize} height={buttonIconSize} color={themeStyles.genericText.color}  />;

    } 

    if (buttonPurpose == 'delete') {
      return <TrashOutlineSvg width={buttonIconSize} height={buttonIconSize} color={themeStyles.genericText.color}  />;

    } 

  };

  return (
    <View style={[styles.container, {
      justifyContent: 
        alignment === 'center' ? 'space-between' :
        alignment === 'left' ? 'flex-start' :
        alignment === 'right' ? 'flex-end' : 'flex-end'
    }]}>
      {displayedButtons.map((button, index) => (
        <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={button.onPress}
        >
          <View style={[styles.iconContainer, {
            paddingLeft: 
            alignment == 'right' ? padding : 0, paddingRight: alignment == 'left' ? padding : 0}]}>
            {determineSvg(button.buttonPurpose, button.buttonIconSize)}
          </View>
          {showLabels !== false && <Text style={themeStyles.genericText}>{button.label}</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row',  
    alignContent: 'center', 
    alignItems: 'center',
    height: 'auto',
    width: '100%', 
    borderRadius: 10,  
    zIndex: 1,
  },
  button: { 
    alignItems: 'center',  
  },
  iconContainer: { 
  },
});

export default ItemViewFooter;
