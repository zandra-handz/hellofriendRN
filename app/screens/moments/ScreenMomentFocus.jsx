import React from "react";  
import { useRoute } from "@react-navigation/native"; 
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
import MomentWriteEditView from "@/app/components/moments/MomentWriteEditView"; 
import Animated, { SlideInDown  } from "react-native-reanimated";
const ScreenMomentFocus = () => {
  const route = useRoute();
  const momentText = route.params?.momentText ?? null;
  const updateExistingMoment = route.params?.updateExistingMoment ?? false;
  const existingMomentObject = route.params?.existingMomentObject ?? null;
 
  return (
    <SafeViewAndGradientBackground styles={{ flex: 1 }}>
      <Animated.View entering={SlideInDown}  style={{flex: 1}}>
        
      <MomentWriteEditView
        momentText={momentText || null}
        updateExistingMoment={updateExistingMoment}
        existingMomentObject={existingMomentObject}
      />
      
      </Animated.View>

    </SafeViewAndGradientBackground>
  );
};

 

export default ScreenMomentFocus;
