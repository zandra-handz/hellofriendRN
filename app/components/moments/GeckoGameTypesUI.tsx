import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import React, { useMemo, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import useUserSettings from "@/src/hooks/useUserSettings";
import AppModalFromTop from "../alerts/AppModalFromTop";
import SvgIcon from "@/app/styles/SvgIcons";

type Props = {
  hiddenTypesUnlocked: boolean;
  selectedValue: number;
  color: string;
  backgroundColor: string;
  highlightColor: string;
  isVisible: boolean;
  onSelect: (value: number) => void;
  onClose: () => void;
};

type Option = {
  value: number;
  label: string;
  hidden: boolean;
  match_only: boolean;
};

function getList({ hidden, data }: { hidden: boolean; data: Option[] }) {
  return hidden ? data : data.filter((o) => !o.hidden);
}

const GeckoGameTypesUI = ({
  hiddenTypesUnlocked,
  selectedValue,
  color,
  backgroundColor,
  highlightColor,
  isVisible,
  onSelect,
  onClose,
}: Props) => {
  const { geckoGameTypes } = useUserSettings();

  const options = useMemo(
    () => getList({ hidden: hiddenTypesUnlocked, data: geckoGameTypes }),
    [geckoGameTypes, hiddenTypesUnlocked],
  );

  const [showBottomFade, setShowBottomFade] = useState(false);

  return (
    <AppModalFromTop
      isVisible={isVisible}
      isFullscreen={true}
      questionText="Gecko game"
      primaryColor={color}
      backgroundColor={backgroundColor}
      modalIsTransparent={true}
      useCloseButton={true}
      onClose={onClose}
    >
      <Text style={[styles.subHeader, { color }]}>
        Pick the kind of moment this is — your gecko uses it to set up the game.
      </Text>

      <View style={styles.scrollWrap}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          showsVerticalScrollIndicator={false}
          onScroll={(e) => {
            const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
            const distanceFromBottom =
              contentSize.height - (layoutMeasurement.height + contentOffset.y);
            setShowBottomFade(distanceFromBottom > 8);
          }}
          scrollEventThrottle={16}
          onContentSizeChange={(_, h) => {
            // show fade if content overflows the typical viewport
            setShowBottomFade(h > 320);
          }}
        >
          {options.map((option) => {
            const isSelected = option.value === selectedValue;
            return (
              <View key={option.value} style={styles.cell}>
                <Pressable
                  onPress={() => onSelect(option.value)}
                  style={[
                    styles.card,
                    {
                      borderColor: isSelected ? highlightColor : `${color}30`,
                      backgroundColor: isSelected
                        ? `${highlightColor}22`
                        : `${color}0D`,
                    },
                  ]}
                >
                  <View style={styles.iconWrap}>
                    <SvgIcon
                      name="scatter_plot"
                      color={isSelected ? highlightColor : color}
                      size={28}
                    />
                  </View>
                  <Text
                    style={[
                      styles.cardLabel,
                      { color: isSelected ? highlightColor : color },
                    ]}
                    numberOfLines={3}
                  >
                    {option.label}
                  </Text>
                  {option.match_only && (
                    <Text style={[styles.badge, { color }]}>match only</Text>
                  )}
                </Pressable>
              </View>
            );
          })}
        </ScrollView>

        {showBottomFade && (
          <LinearGradient
            pointerEvents="none"
            colors={[`${backgroundColor}00`, backgroundColor]}
            style={styles.bottomFade}
          />
        )}
      </View>
    </AppModalFromTop>
  );
};

const styles = StyleSheet.create({
  subHeader: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    opacity: 0.85,
  },
  scrollWrap: {
    flex: 1,
    position: "relative",
  },
  scrollViewContainer: {
    paddingHorizontal: 10,
    paddingBottom: 80,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 64,
  },
  cell: {
    width: "50%",
    padding: 6,
  },
  card: {
    minHeight: 150,
    padding: 14,
    borderRadius: 18,
    borderWidth: 2,
    justifyContent: "space-between",
  },
  iconWrap: {
    alignItems: "flex-start",
    marginBottom: 10,
  },
  cardLabel: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    lineHeight: 22,
  },
  badge: {
    marginTop: 8,
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    opacity: 0.6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

export default GeckoGameTypesUI;
