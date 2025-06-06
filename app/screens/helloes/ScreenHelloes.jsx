import React from "react";
import { View } from "react-native";
import { useFriendList } from "@/src/context/FriendListContext";
import { useHelloes } from "@/src/context/HelloesContext";

import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";

import HelloesTabs from "@/app/components/helloes/HelloesTabs";
import Loading from "@/app/components/appwide/display/Loading"; 

import GlobalAppHeaderIconVersion from "@/app/components/headers/GlobalAppHeaderIconVersion";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ScreenHelloes = () => {
  const { themeAheadOfLoading } = useFriendList();

  const { helloesList } = useHelloes();

  return (
    <SafeViewAndGradientBackground style={{ flex: 1 }}>
  
        {/* not sure if will work: */}
        <Loading isLoading={!helloesList} />

        {helloesList && (
          <>
            <GlobalAppHeaderIconVersion
              title={"Helloes with"}
              navigateTo="Helloes"
              icon={
                <MaterialCommunityIcons
                  name="hand-wave-outline"
                  size={30}
                  color={themeAheadOfLoading.fontColorSecondary}
                />
              }
            />

            <View style={{ flex: 1 }}>{helloesList && <HelloesTabs />}</View>
          </>
        )} 
    </SafeViewAndGradientBackground>
  );
};

export default ScreenHelloes;
