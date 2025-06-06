import React, { useEffect, useState } from "react"; 
import { useRoute } from "@react-navigation/native"; 
import SafeView from "@/app/components/appwide/format/SafeView";
 
import { useFocusEffect } from "@react-navigation/native";
import GradientBackground from "@/app/components/appwide/display/GradientBackground";
import GlobalAppHeaderIconVersion from "@/app/components/headers/GlobalAppHeaderIconVersion";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFriendList } from "@/src/context/FriendListContext";

import { useHelloes } from "@/src/context/HelloesContext";
import CarouselSlider from "@/app/components/appwide/CarouselSlider"; 

import HelloViewPage from "@/app/components/helloes/HelloViewPage";

const ScreenHelloView = () => { 
  const { themeAheadOfLoading } = useFriendList();
  const { helloesList } = useHelloes(); 
  const [currentIndex, setCurrentIndex] = useState(0);
 
  const route = useRoute();
  const hello = route.params?.hello ?? null;
 
  const setIndex = (hello) => { 
    if (hello) { 
      const index = helloesList.findIndex((item) => item.id === hello.id);
      setCurrentIndex(index); 
    }
  };
 

  useEffect(() => {
    if (hello && helloesList.length > 0) {
      setIndex(hello);
    }
  }, [hello, helloesList]);
  
  
  return (
    <SafeView style={{ flex: 1 }}>
      <GradientBackground useFriendColors={true}>
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

        <CarouselSlider initialIndex={currentIndex} data={helloesList} children={HelloViewPage} />
      </GradientBackground>
    </SafeView>
  );
};

export default ScreenHelloView;
