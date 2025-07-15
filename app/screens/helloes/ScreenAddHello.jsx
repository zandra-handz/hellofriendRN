import React from "react"; 
import ContentAddHello from "@/app/components/helloes/ContentAddHello"; 
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
 
const ScreenAddHello = () => {
  return (
    <SafeViewAndGradientBackground styles={[{ flex: 1 }]}>
      <ContentAddHello /> 
    </SafeViewAndGradientBackground>
  );
};
 

export default ScreenAddHello;
