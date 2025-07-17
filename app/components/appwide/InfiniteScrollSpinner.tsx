import { View } from "react-native";
import React from "react";
import LoadingPage from "./spinner/LoadingPage";
type Props = {
  isFetchingNextPage: boolean;
  color: string;
  height: number;
};

// use this in the listFooterComponent of flatlists that use infinite scroll
const InfiniteScrollSpinner = ({ color, height, isFetchingNextPage }: Props) => {
  return (
    <View style={{ height: height }}>
      {isFetchingNextPage && (
        <View style={{ height: 50 }}>
          <LoadingPage
            loading={true}
            spinnerSize={20}
            spinnerType={"flow"}
            color={color}
          />
        </View>
      )}
    </View>
  );
};

export default InfiniteScrollSpinner;
