import { View } from "react-native";
import React from "react";
import LoadingPage from "../spinner/LoadingPage";
// import { useFriendList } from "@/src/context/FriendListContext";
import { useGlobalStyle } from "@/src/context/GlobalStyleContext";

interface LoadingProps {
  isLoading: boolean;
}

const Loading: React.FC<LoadingProps> = ({ isLoading }) => {
//   const { themeAheadOfLoading } = useFriendList();
  const { themeStyles } = useGlobalStyle();
  return (
    <>
      {isLoading && (
        <View style={{ flex: 1, width: "100%" }}>
          <LoadingPage
            loading={true}
            spinnerSize={30}
            spinnerType={"flow"}
            color={themeStyles.primaryBackground.backgroundColor}
          />
        </View>
      )}
    </>
  );
};

export default Loading;
