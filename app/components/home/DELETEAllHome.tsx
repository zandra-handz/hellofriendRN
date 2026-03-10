 


import React from "react";
import { StyleSheet, View } from "react-native";
 
import HomeScrollSoon from "./HomeScrollSoon";  

type Props = {
  userId: number;
  isLoading: boolean;
  height?: string;
  borderRadius?: number;
  borderColor?: string;
  navigateToFriendHome: (id: number) => void;
  textColor: string;
  overlayColor: string;
  lighterOverlayColor: string;
  darkerOverlayColor: string;
};

const AllHome = ({
 
  isLoading, 
  handleSelectFriend,
  textColor,
  overlayColor,
  lighterOverlayColor,
  darkerOverlayColor,
  onSoonPress,
  friendList,
  upcomingHelloes,
}: Props) => { 

 
 
 
  return ( 
            <HomeScrollSoon
              lighterOverlayColor={lighterOverlayColor}
              darkerOverlayColor={darkerOverlayColor}
              upcomingHelloes={upcomingHelloes}
              isLoading={isLoading}
              handleSelectFriend={handleSelectFriend}
              onPress={onSoonPress} 
              itemListLength={friendList?.length}
              friendList={friendList}
              primaryColor={textColor}
              overlayColor={overlayColor}
              height={"100%"}
              maxHeight={700}
              borderRadius={10}
              borderColor="black"
            /> 
  );
};

 

export default React.memo(AllHome);