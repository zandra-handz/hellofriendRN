import { Text, View, TouchableOpacity } from "react-native";
import React from "react"; 
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface OverlayLargeButtonProps {
  label: string;
  onPress: () => void;
  addTopRowElement: boolean;
  topRowElement?: React.ReactElement;
  topRowJustify: string;
  buttonOnBottom: boolean;
  customButton?: React.ReactElement;

}

const OverlayLargeButton: React.FC<OverlayLargeButtonProps> = ({
  label,
  onPress,
  addTopRowElement = false,
  topRowElement,
  topRowJustify = 'flex-end',
  buttonOnBottom = false,
  customButton,
  addressSetter,
  primaryColor,
  overlayColor,
  welcomeTextStyle,
}) => { 

  const iconSize = 30;

  return (
    <TouchableOpacity
      style={[
     
        {
          backgroundColor: overlayColor,
          marginVertical: 2,
          padding: 20,
          width: "100%",
          height: "auto",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
          textAlign: "center",
          flexWrap: "wrap",
        },
      ]}
      onPress={!buttonOnBottom ? onPress : () => {}}
      disabled={buttonOnBottom}
    >
      {addTopRowElement && (
        
      <View style={{flex: 1, height: 'auto',flexDirection: 'row', width: '100%', justifyContent: topRowJustify,    }}>
        {topRowElement}
      </View>
      
      )}
      <Text style={[  welcomeTextStyle, { color: primaryColor}]}>
        {label}
      </Text>
      {buttonOnBottom && (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <>
            {customButton && customButton}

            <TouchableOpacity
              onPress={onPress}
              style={{
                marginLeft: 20,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={[
                 
                  { color: primaryColor, fontWeight: "bold", fontSize: 13, marginRight: 6 },
                ]}
              >
                Change
              </Text>
              <MaterialCommunityIcons
                //name={"menu-swap"}
                name={"swap-horizontal-circle"}
                size={iconSize}
                color={primaryColor}
              />
            </TouchableOpacity>
          </>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default OverlayLargeButton;
