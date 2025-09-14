import { View, Text, Pressable } from "react-native";
import React from "react";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
 import { AppFontStyles } from "@/src/hooks/StaticFonts";

import GlobalPressable from "../appwide/button/GlobalPressable";
import ToNextButton from "./ToNextButton";
import ActionAndBack from "./ActionAndBack"; 
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { MaterialIcons  } from "@expo/vector-icons";

type Props = {
  onPress: () => void;
  label: string;
  iconName: string;
  forwardFlowOn: boolean;
};

const EscortBar = ({
  onPress,
  label = "Save and Continue",
  iconName = "keyboard-arrow-left",
  forwardFlowOn = true, 
 
  primaryColor,
  primaryBackground,
}: Props) => { 
  const { navigateBack } = useAppNavigations(); 

  return (
    <Animated.View entering={SlideInDown} exiting={SlideOutDown}>
      <GlobalPressable
        onPress={onPress}
        style={[
          {
            height: 50,
            paddingHorizontal: 5,
            flexDirection: "row",
            backgroundColor: 'orange',
            
            width: "100%", 
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 10, 
            backgroundColor: primaryBackground,
      
        
          },
        ]}
      >
        <View style={{width: '100%', flexDirection: 'row' , alignItems: 'center', height: '100%', justifyContent: "space-between",  }}>

        <Pressable
          hitSlop={10}
          style={{
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={navigateBack}
        >
          <MaterialIcons
            name={`${iconName}`}
            size={20}
            color={primaryColor}
          />
        </Pressable>

        <View style={{ alignItems: "center", flexDirection: "row"  }}>
          <Text
            style={[ 
              AppFontStyles?.subWelcomeText,
              { color: primaryColor, fontSize: 13, marginRight: 12 },
            ]}
          >
            {label}
          </Text>


          {forwardFlowOn && <ToNextButton  onPress={onPress} />}
          {!forwardFlowOn && <ActionAndBack  onPress={onPress} />}
        </View>
        </View>
      </GlobalPressable>
    </Animated.View>
  );
};

export default EscortBar;
