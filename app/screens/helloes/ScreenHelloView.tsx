import React, { useEffect, useState } from "react"; 
import { useRoute } from "@react-navigation/native"; 
import SafeViewAndGradientBackground from "@/app/components/appwide/format/SafeViewAndGradBackground";
 
import { useFocusEffect } from "@react-navigation/native"; 
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
    <SafeViewAndGradientBackground style={{ flex: 1 }}>
    
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
 
    </SafeViewAndGradientBackground>
  );
};

export default ScreenHelloView;
