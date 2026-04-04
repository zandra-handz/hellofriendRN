import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextStyle,
  FlatList,
} from "react-native";

type Props = {
  value: number[];
  maxHours?: number;
  color: string;
  textStyle?: TextStyle;
  onChange: (hours: number[]) => void;
};

const formatHour = (h: number): string => {
  if (h === 0) return "12a";
  if (h === 12) return "12p";
  if (h < 12) return `${h}a`;
  return `${h - 12}p`;
};

const pickRandom = (n: number): number[] => {
  const all = Array.from({ length: 24 }, (_, i) => i);
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.slice(0, Math.min(n, 24)).sort((a, b) => a - b);
};

const RandomHoursGrid = ({
  value,
  maxHours = 16,
  color,
  textStyle,
  onChange,
}: Props) => {
  const [pickup, setPickup] = useState<number | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    if (value.length !== maxHours) {
      onChange(pickRandom(maxHours));
    }
  }, []);

  const selected = new Set(value);

  const handleTap = (h: number) => {
    if (selected.has(h)) {
      setPickup((prev) => (prev === h ? null : h));
      return;
    }
    if (pickup !== null) {
      const next = value
        .filter((x) => x !== pickup)
        .concat(h)
        .sort((a, b) => a - b);
      onChange(next);
      setPickup(null);
    }
  };

  const renderItem = useCallback(
    ({ item: h }: { item: number }) => {
      const isSelected = selected.has(h);
      const isPickup = pickup === h;
      return (
        <Pressable
          onPress={() => handleTap(h)}
          style={[
            styles.cell,
            {
              backgroundColor: isSelected ? color : "transparent",
              borderColor: color,
              opacity: isPickup ? 0.35 : 1,
            },
          ]}
        >
          <Text
            style={[
              textStyle,
              styles.cellText,
              { color: isSelected ? "#000" : color },
            ]}
            numberOfLines={1}
          >
            {formatHour(h)}
          </Text>
        </Pressable>
      );
    },
    [selected, pickup, color, textStyle],
  );

  const data = Array.from({ length: 24 }, (_, i) => i);

  return (
    <FlatList
      data={data}
      keyExtractor={(h) => String(h)}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={styles.sep} />}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    alignItems: "center",
    paddingHorizontal: 4,
  },
  sep: {
    width: 4,
  },
  cell: {
    width: 34,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cellText: {
    fontSize: 10,
    fontWeight: "600",
  },
});

export default RandomHoursGrid;
