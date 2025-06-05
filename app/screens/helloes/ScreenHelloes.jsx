import React from "react";
import { View } from "react-native";
import { useFriendList } from "@/src/context/FriendListContext";
import { useHelloes } from "@/src/context/HelloesContext";

import SafeView from "@/app/components/appwide/format/SafeView";

import HelloesTabs from "@/app/components/helloes/HelloesTabs";
import Loading from "@/app/components/appwide/display/Loading";
import GradientBackground from "@/app/components/appwide/display/GradientBackground";

import GlobalAppHeaderIconVersion from "@/app/components/headers/GlobalAppHeaderIconVersion";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ScreenHelloes = () => {
  const { themeAheadOfLoading } = useFriendList();

  const { helloesList } = useHelloes();

  return (
    <SafeView style={{ flex: 1 }}>
      <GradientBackground useFriendColors={true}>
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
      </GradientBackground>
    </SafeView>
  );
};

export default ScreenHelloes;
