import React, { useMemo } from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import useFullHelloes from "@/src/hooks/HelloesCalls/useFullHelloes";

type HelloLight = {
  id: string;
  date: string;
  past_date_in_words: string;
  type: string;
  user: number;
  location: number | null;
  location_name?: string;
  additional_notes?: string;
  thought_capsules_shared?: Record<string, any>;
};

type Props = {
  helloId: string | null;
  helloIndex: number;
  friendId: number;
  allHelloes: HelloLight[];
  primaryColor: string;
  accentColor?: string;
  overlayColor?: string;
  onDismiss?: () => void;
  onSelectId: (id: string) => void;
};

function formatTypeFull(type: string): string {
  if (!type) return "—";
  if (type.toLowerCase().includes("in person")) return "in person";
  if (type.toLowerCase().includes("text") || type.toLowerCase().includes("social")) return "text / social";
  if (type.toLowerCase().includes("call") || type.toLowerCase().includes("phone")) return "call";
  return type;
}

const HelloDetailCard = ({
  helloId,
  helloIndex,
  friendId,
  allHelloes,
  primaryColor,
  accentColor = "#a0f143",
  overlayColor,
  onDismiss,
  onSelectId,
}: Props) => {
  // Fetch until helloIndex is available — same pattern as HelloQuickView
  const { helloesListFull, fetchUntilIndex } = useFullHelloes({
    friendId,
    indexNeeded: helloIndex,
  });

  fetchUntilIndex(helloIndex);

  const hello = useMemo(
    () => helloesListFull?.find((h) => h.id === helloId) ?? null,
    [helloesListFull, helloId]
  );

  const capsuleEntries = useMemo(() => {
    if (!hello?.thought_capsules_shared) return [];
    return Object.entries(hello.thought_capsules_shared);
  }, [hello?.id]);

  if (!helloId) return null;

  const currentIndex = allHelloes.findIndex((h) => h.id === helloId);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allHelloes.length - 1;

  const goTo = (idx: number) => {
    if (idx >= 0 && idx < allHelloes.length) onSelectId(allHelloes[idx].id);
  };

  const cardBg = overlayColor ?? `${primaryColor}08`;

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor: `${accentColor}25` }]}>

      {/* Header: arrows + date + type + dismiss */}
      <View style={styles.headerRow}>
        <View style={styles.arrowBlock}>
          <Pressable onPress={() => goTo(currentIndex - 1)} disabled={!hasPrev} style={styles.arrowBtn}>
            <Text style={[styles.arrowText, { color: hasPrev ? accentColor : `${primaryColor}20` }]}>▲</Text>
          </Pressable>
          <Pressable onPress={() => goTo(currentIndex + 1)} disabled={!hasNext} style={styles.arrowBtn}>
            <Text style={[styles.arrowText, { color: hasNext ? accentColor : `${primaryColor}20` }]}>▼</Text>
          </Pressable>
        </View>

        <View style={styles.dateBlock}>
          <Text style={[styles.dateWords, { color: accentColor }]}>
            {hello?.past_date_in_words ?? allHelloes[currentIndex]?.past_date_in_words}
          </Text>
          <Text style={[styles.dateRaw, { color: `${primaryColor}40` }]}>
            {hello?.date ?? allHelloes[currentIndex]?.date}
          </Text>
        </View>

        <View style={[styles.typePill, { borderColor: `${accentColor}40`, backgroundColor: `${accentColor}12` }]}>
          <Text style={[styles.typeText, { color: accentColor }]}>
            {formatTypeFull(hello?.type ?? allHelloes[currentIndex]?.type)}
          </Text>
        </View>

        {onDismiss && (
          <Pressable onPress={onDismiss} hitSlop={12} style={[styles.dismissBtn, { borderColor: `${primaryColor}25` }]}>
            <Text style={[styles.dismissText, { color: `${primaryColor}50` }]}>✕</Text>
          </Pressable>
        )}
      </View>

      {allHelloes.length > 1 && (
        <Text style={[styles.counter, { color: `${primaryColor}25` }]}>
          {currentIndex + 1} / {allHelloes.length}
        </Text>
      )}

      {/* Full data — only shows once helloesListFull has loaded this hello */}
      {hello && (
        <>
          {!!hello.location_name && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoIcon, { color: `${primaryColor}40` }]}>◎</Text>
              <Text style={[styles.infoText, { color: `${primaryColor}70` }]}>{hello.location_name}</Text>
            </View>
          )}

          {capsuleEntries.length > 0 && (
            <View style={[styles.capsulesBlock, { borderColor: `${primaryColor}10` }]}>
              <FlatList
                data={capsuleEntries}
                keyExtractor={([key]) => key}
                scrollEnabled={false}
                renderItem={({ item: [key, capsule] }) => (
                  <View style={[styles.capsuleRow, { borderColor: `${primaryColor}10` }]}>
                    {!!capsule.user_category_name && (
                      <Text style={[styles.capsuleCategory, { color: `${accentColor}70` }]}>
                        {capsule.user_category_name}
                      </Text>
                    )}
                    <Text style={[styles.capsuleText, { color: primaryColor }]}>
                      {capsule.capsule}
                    </Text>
                  </View>
                )}
              />
            </View>
          )}

          {!!hello.additional_notes && (
            <View style={[styles.notesBlock, { borderColor: `${primaryColor}10`, backgroundColor: `${primaryColor}05` }]}>
              <Text style={[styles.notesLabel, { color: `${primaryColor}40` }]}>notes</Text>
              <Text style={[styles.notesText, { color: primaryColor }]}>{hello.additional_notes}</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  arrowBlock: {
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  arrowBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  arrowText: {
    fontSize: 18,
    fontFamily: "SpaceGrotesk-Bold",
  },
  dateBlock: {
    flex: 1,
    gap: 2,
  },
  dateWords: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 14,
    letterSpacing: 0.3,
  },
  dateRaw: {
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 11,
  },
  typePill: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  typeText: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 11,
    letterSpacing: 0.2,
  },
  dismissBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dismissText: {
    fontSize: 10,
    fontFamily: "SpaceGrotesk-Bold",
  },
  counter: {
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 10,
    textAlign: "right",
    marginTop: -6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoIcon: {
    fontSize: 13,
  },
  infoText: {
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 12,
  },
  capsulesBlock: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  capsuleRow: {
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 2,
  },
  capsuleCategory: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 10,
    letterSpacing: 0.3,
  },
  capsuleText: {
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 12,
  },
  notesBlock: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 3,
  },
  notesLabel: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 10,
    letterSpacing: 0.3,
  },
  notesText: {
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 12,
  },
});

export default HelloDetailCard;