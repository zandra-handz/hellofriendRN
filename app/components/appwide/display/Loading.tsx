import { View } from "react-native";
import React from "react";
import LoadingPage from "../spinner/LoadingPage"; 

interface LoadingProps {
  isLoading: boolean;
}

const Loading: React.FC<LoadingProps> = ({ isLoading, backgroundColor }) => {
  
  return (
    <>
      {isLoading && (
        <View style={{ flex: 1, width: "100%" }}>
          <LoadingPage
            loading={true}
            spinnerSize={30}
            spinnerType={"flow"}
            color={backgroundColor}
          />
        </View>
      )}
    </>
  );
};

export default Loading;
