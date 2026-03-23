import React, { useState, useCallback, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import useHelloes from "@/src/hooks/useHelloes";
import useHelloesManips from "@/src/hooks/HelloesFunctions/useHelloesManips";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import TextHeader from "@/app/components/appwide/format/TextHeader";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import HelloDetailCard from "@/app/components/home/HelloDetailCard";
import useUser from "@/src/hooks/useUser";
import HelloesList from "@/app/components/helloes/HelloesList";
import useFullHelloes from "@/src/hooks/HelloesCalls/useFullHelloes";
import { useLDTheme } from "@/src/context/LDThemeContext";
import { AppFontStyles } from "@/app/styles/AppFonts";
import MonthCalendarChartListV2 from "@/app/components/home/MonthCalenderChartListV2";
 
const ScreenHelloes = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const { selectedFriend } = useSelectedFriend();
  const { lightDarkTheme } = useLDTheme();
  const [triggerFetchAll, setTriggerFetchAll] = useState(false);

  const { helloesList } = useHelloes({
    userId: user?.id,
    friendId: selectedFriend?.id,
  });


 
  // Used only for the helloes list at the bottom and for navigableHelloes
  const { helloesListFull, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useFullHelloes({ friendId: selectedFriend?.id, fetchAll: triggerFetchAll });

  const { flattenHelloes } = useHelloesManips({ helloesData: helloesListFull });

  const [helloesData, setHelloesData] = useState(helloesListFull || []);
  const [triggerScroll, setTriggerScroll] = useState(undefined);
  const [inPersonFilter, setInPersonFilter] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const headerLabel = selectedFriend.name
    ? `Helloes for ${selectedFriend.name}`
    : "Helloes";

  const textColor = lightDarkTheme.primaryText;
  const backgroundColor = lightDarkTheme.primaryBackground;
  const welcomeTextStyle = AppFontStyles.welcomeText;

  const helloesDataFiltered = useMemo(() => {
    return inPersonFilter
      ? helloesListFull.filter((hello) => hello.type === "in person")
      : helloesListFull;
  }, [helloesListFull, inPersonFilter]);

  // Index of selected hello in helloesList — passed to HelloDetailCard
  // so it can call useFullHelloes with indexNeeded
const selectedIndex = useMemo(() => {
  if (!selectedId) return 0;
  const idx = helloesList?.findIndex((h) => h.id === selectedId);
  return idx != null && idx >= 0 ? idx : 0;
}, [helloesList, selectedId]);
  // Helloes to navigate through with arrows — scoped to selected month if one is active
  // const navigableHelloes = useMemo(() => {
  //   if (!helloesList?.length) return [];
  //   if (!selectedKey) return [...helloesList].sort((a, b) => b.date.localeCompare(a.date));
  //   const [year, month] = selectedKey.split("-").map(Number);
  //   return helloesList
  //     .filter((h) => {
  //       if (!h.date || h.hasOwnProperty("manual_reset")) return false;
  //       const d = new Date(h.date + "T00:00:00");
  //       return d.getFullYear() === year && d.getMonth() === month;
  //     })
  //     .sort((a, b) => b.date.localeCompare(a.date));
  // }, [helloesList, selectedKey]);
  const navigableHelloes = useMemo(() => {
  if (!helloesList?.length) return [];
  return helloesList
    .filter((h) => !h.hasOwnProperty("manual_reset"))
    .sort((a, b) => b.date.localeCompare(a.date));
}, [helloesList]);

  const handleSelectId = useCallback((id: string) => {
    setSelectedId(id);
    const hello = helloesList?.find((h) => h.id === id);
    if (!hello?.date) return;
    const d = new Date(hello.date + "T00:00:00");
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    setSelectedKey(key);
  }, [helloesList]);

  const navigateToSingleView = useCallback(
    (index) => {
      navigation.navigate("HelloView", {
        startingIndex: index,
        inPersonFilter: !!inPersonFilter,
      });
    },
    [inPersonFilter, navigation],
  );

  const handleSearchPress = (item) => {
    const itemIndex = helloesData.findIndex((hello) => hello.id === item);
    setTriggerScroll(itemIndex + 1);
  };
  console.log("selectedIndex", selectedIndex, "helloesList length", helloesList?.length);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: backgroundColor, paddingHorizontal: 0 }}
    >
      <TextHeader
        label={headerLabel}
        color={textColor} 
        fontStyle={welcomeTextStyle}
        showNext={false}
        nextEnabled={false}
      />

      <View style={styles.outerPieWrapper}>
        <MonthCalendarChartListV2
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          selectedKey={selectedKey}
          setSelectedKey={setSelectedKey}
          helloesList={helloesList}
          primaryColor={lightDarkTheme.primaryText}
          overlayBackground={lightDarkTheme.primaryColor}
          accentColor={selectedFriend.lightColor}
        />
      </View>

      {selectedId && (
        <View style={styles.detailWrapper}>
          <HelloDetailCard
            helloId={selectedId}
            helloIndex={selectedIndex}
            friendId={selectedFriend?.id}
            allHelloes={navigableHelloes}
            primaryColor={lightDarkTheme.primaryText}
            accentColor={selectedFriend.lightColor}
            overlayColor={lightDarkTheme.overlayBackground}
            onDismiss={() => setSelectedId(null)}
            onSelectId={handleSelectId}
          />
        </View>
      )}

      {helloesListFull && !selectedId && !selectedKey && (
        <>
          <Animated.View
            entering={SlideInDown.duration(200)}
            exiting={SlideOutDown.duration(200)}
            style={{
              paddingTop: 40,
              height: "45%",
              flexGrow: 1,
              width: "100%",
            }}
          >
            {selectedFriend &&
              helloesDataFiltered &&
              helloesDataFiltered.length > 0 && (
                <HelloesList
                  triggerScroll={triggerScroll}
                  helloesListFull={helloesDataFiltered}
                  isFetchingNextPage={isFetchingNextPage}
                  fetchNextPage={fetchNextPage}
                  hasNextPage={hasNextPage}
                  onPress={navigateToSingleView}
                  primaryColor={lightDarkTheme.primaryText}
                />
              )}
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  outerPieWrapper: {
    width: "100%",
    height: 280,
    paddingBottom: 0,
    paddingLeft: 20,

    paddingRight: 10
  },
  detailWrapper: {
    paddingHorizontal: 10,
    paddingTop: 8,
  },
});

export default ScreenHelloes;