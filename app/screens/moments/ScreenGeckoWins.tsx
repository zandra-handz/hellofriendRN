import { View, Text, Pressable } from "react-native";
import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import useUser from "@/src/hooks/useUser";
import { useLDTheme } from "@/src/context/LDThemeContext";
import useGeckoGameWins from "@/src/hooks/GeckoCalls/useGeckoGameWins";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { LinearTransition } from "react-native-reanimated";
import InfiniteScrollSpinner from "@/app/components/appwide/InfiniteScrollSpinner";
import TextHeader from "@/app/components/appwide/format/TextHeader";
import { AppFontStyles } from "@/app/styles/AppFonts";
import manualGradientColors from "@/app/styles/StaticColors";
import SvgIcon from "@/app/styles/SvgIcons";
import useUpdateGeckoGameWinPin from "@/src/hooks/GeckoCalls/useUpdateGeckoGameWinPin";

type GeckoWin = {
  id: number;
  capsule?: string;
  gecko_game_type?: number;
  gecko_game_type_label?: string;
  friend_name?: string;
  user_won_from_username?: string;
  created_on?: string;
  won_by_matching?: boolean;
  pinned?: boolean;
};

const ITEM_BOTTOM_MARGIN = 10;
const ICON_CIRCLE_SIZE = 46;

const GAME_TYPE_ICONS: Record<number, string> = {
  1: "leaf",
  2: "star",
  3: "paw",
  4: "heart",
  5: "chat",
  6: "compass_rose",
  7: "gecko_mine",
};

const iconForGameType = (typeId?: number): string => {
  if (typeId == null) return "heart";
  return GAME_TYPE_ICONS[typeId] ?? "heart";
};

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const ScreenGeckoWins = () => {
  const { user } = useUser();
  const { lightDarkTheme } = useLDTheme();
  const navigation = useNavigation();
  const { updateGeckoWinPin } = useUpdateGeckoGameWinPin();
  const {
    geckoGameWinsFlattened,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    geckoGameWinsIsLoading,
  } = useGeckoGameWins({ userId: user?.id });

  const backgroundColor = lightDarkTheme.primaryBackground;
  const textColor = lightDarkTheme.primaryText;
  const mutedColor = `${textColor}99`;
  const accentColor = manualGradientColors.lightColor;
  const borderColor = `${accentColor}22`;
  const welcomeTextStyle = AppFontStyles.welcomeText;

  const extractItemKey = (item: GeckoWin, index: number) =>
    item?.id ? `gecko-win-${item.id}` : `gecko-win-idx-${index}`;

  const renderItem = useCallback(
    ({ item }: { item: GeckoWin }) => {
      const opponent = item.user_won_from_username ?? item.friend_name ?? "";
      const iconName = iconForGameType(item.gecko_game_type);
      return (
        <Pressable
          onPress={() =>
            navigation.navigate("GeckoWinView", {
              capsule: item.capsule,
              geckoGameTypeLabel: item.gecko_game_type_label,
              opponent,
              createdOn: item.created_on,
            })
          }
          onLongPress={() =>
            updateGeckoWinPin({ winId: item.id, pinned: !item.pinned })
          }
          delayLongPress={350}
          style={{
            width: "100%",
            marginBottom: ITEM_BOTTOM_MARGIN,
            paddingHorizontal: 20,
            paddingTop: 18,
            paddingBottom: 16,
            borderRadius: 28,
            borderWidth: 2,
            borderColor,
            overflow: "hidden",
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              left: "15%",
              right: "15%",
              height: 1,
              opacity: 0.45,
              borderRadius: 1,
              backgroundColor: accentColor,
            }}
          />

          <View
            style={{
              width: ICON_CIRCLE_SIZE,
              height: ICON_CIRCLE_SIZE,
              borderRadius: 999,
              borderWidth: 2,
              borderColor: accentColor,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 14,
              marginTop: 2,
            }}
          >
            <SvgIcon name={iconName} size={22} color={accentColor} />
            {item.pinned ? (
              <View
                style={{
                  position: "absolute",
                  top: -4,
                  right: -6,
                  width: 20,
                  height: 20,
                  borderRadius: 999,
                  backgroundColor: backgroundColor,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SvgIcon name="pin" size={14} color={accentColor} />
              </View>
            ) : null}
          </View>

          <View style={{ flex: 1 }}>
            {item.gecko_game_type_label ? (
              <Text
                numberOfLines={1}
                style={[
                  welcomeTextStyle,
                  {
                    color: textColor,
                    fontSize: 18,
                    fontWeight: "700",
                    letterSpacing: -0.4,
                    marginBottom: 8,
                  },
                ]}
              >
                {item.gecko_game_type_label}
              </Text>
            ) : null}

            {item.capsule ? (
              <Text
                style={[
                  welcomeTextStyle,
                  {
                    color: textColor,
                    fontSize: 15,
                    lineHeight: 24,
                    opacity: 0.85,
                    marginBottom: 12,
                  },
                ]}
              >
                {item.capsule}
              </Text>
            ) : null}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={[
                  welcomeTextStyle,
                  {
                    color: mutedColor,
                    fontSize: 11,
                    fontWeight: "600",
                    letterSpacing: 1.4,
                    textTransform: "uppercase",
                    flexShrink: 1,
                  },
                ]}
                numberOfLines={1}
              >
                {opponent ? `from ${opponent}` : ""}
              </Text>
              <Text
                style={[
                  welcomeTextStyle,
                  {
                    color: mutedColor,
                    fontSize: 11,
                    fontWeight: "600",
                    letterSpacing: 1.4,
                    marginLeft: 8,
                  },
                ]}
              >
                {formatDate(item.created_on)}
              </Text>
            </View>
          </View>
        </Pressable>
      );
    },
    [
      textColor,
      mutedColor,
      borderColor,
      accentColor,
      backgroundColor,
      welcomeTextStyle,
      navigation,
      updateGeckoWinPin,
    ],
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
        paddingHorizontal: 14,
      }}
    >
      <TextHeader
        label="Gecko wins"
        color={textColor}
        fontStyle={AppFontStyles.welcomeText}
        showNext={false}
        nextEnabled={false}
      />
      <View style={{ flex: 1 }}>
        <Animated.FlatList
          fadingEdgeLength={20}
          data={geckoGameWinsFlattened as GeckoWin[]}
          itemLayoutAnimation={LinearTransition}
          renderItem={renderItem}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          keyExtractor={extractItemKey}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 4, paddingBottom: 24 }}
          ListEmptyComponent={
            !geckoGameWinsIsLoading ? (
              <Text style={{ color: mutedColor, padding: 20 }}>
                No wins yet.
              </Text>
            ) : null
          }
          ListFooterComponent={
            <InfiniteScrollSpinner
              isFetchingNextPage={isFetchingNextPage}
              color={textColor}
              height={120}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default ScreenGeckoWins;
