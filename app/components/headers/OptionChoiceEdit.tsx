import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextStyle,
  FlatList,
} from "react-native";
import SvgIcon from "@/app/styles/SvgIcons";

type Choice = {
  id: number | string;
  label: string;
};

type Props = {
  label: string;
  value: number | string | null;
  choices: Choice[];
  onValueChange: (id: number | string) => void;
  primaryColor: string;
  backgroundColor: string;
  buttonColor: string;
  textStyle: TextStyle;
  icon?: React.ReactElement;
  buttonPadding?: number;
  placeholder?: string;
  onConfirm?: () => void;
};

const ITEM_WIDTH = 100;
const ITEM_GAP = 8;

const OptionChoiceEdit: React.FC<Props> = ({
  label,
  value,
  choices,
  onValueChange,
  primaryColor,
  backgroundColor,
  buttonColor,
  textStyle,
  icon,
  buttonPadding = 4,
  placeholder = "None",
  onConfirm,
}) => {
  const [showEdit, setShowEdit] = useState(false);
  const [pendingValue, setPendingValue] = useState<number | string | null>(value);
  const listRef = useRef<FlatList>(null);

  const selectedLabel = choices.find((c) => c.id === value)?.label;

  const handleOpen = () => {
    setPendingValue(value);
    setShowEdit(true);
  };

  const handleConfirm = () => {
    if (pendingValue !== null) {
      onValueChange(pendingValue);
    }
    onConfirm?.();
    setShowEdit(false);
  };

  const handleCancel = () => {
    setPendingValue(value);
    setShowEdit(false);
  };

  const handleSelect = useCallback((id: number | string) => {
    setPendingValue(id);
  }, []);

  const renderChoice = useCallback(
    ({ item }: { item: Choice }) => {
      const isActive = item.id === pendingValue;
      return (
        <Pressable
          onPress={() => handleSelect(item.id)}
          style={[
            styles.choiceItem,
            {
              borderColor: isActive ? primaryColor : `${primaryColor}30`,
              backgroundColor: isActive ? `${primaryColor}18` : "transparent",
            },
          ]}
        >
          <Text
            style={[
              textStyle,
              styles.choiceLabel,
              {
                color: primaryColor,
                opacity: isActive ? 1 : 0.5,
                fontWeight: isActive ? "700" : "400",
              },
            ]}
            numberOfLines={1}
          >
            {item.label}
          </Text>
        </Pressable>
      );
    },
    [pendingValue, primaryColor, textStyle, handleSelect],
  );

  return (
    <View style={[styles.button, { padding: buttonPadding, backgroundColor: buttonColor }]}>
      <Pressable
        onPress={() => !showEdit && handleOpen()}
        android_ripple={{ color: "rgba(255,255,255,0.08)" }}
        style={[styles.inner, { backgroundColor }]}
      >
        <View style={styles.left}>
          {!!icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text
            style={[textStyle, styles.label, { color: primaryColor }]}
            numberOfLines={1}
          >
            {label}
          </Text>
        </View>

        {!showEdit && (
          <View style={styles.valueColumn}>
            <Text
              style={[
                textStyle,
                styles.valueText,
                { color: primaryColor },
                !selectedLabel && styles.placeholderText,
              ]}
              numberOfLines={1}
            >
              {selectedLabel || placeholder}
            </Text>
          </View>
        )}

        <View style={styles.actionsColumn}>
          {!showEdit ? (
            <Pressable onPress={handleOpen}>
              <SvgIcon name="pencil" size={18} color={primaryColor} />
            </Pressable>
          ) : (
            <>
              <Pressable onPress={handleCancel} style={styles.cancelButton}>
                <SvgIcon name="cancel" size={18} color={primaryColor} />
              </Pressable>
              <Pressable onPress={handleConfirm}>
                <SvgIcon name="check" size={18} color={primaryColor} />
              </Pressable>
            </>
          )}
        </View>
      </Pressable>

      {showEdit && (
        <View style={[styles.choiceRow, { backgroundColor }]}>
          <FlatList
            ref={listRef}
            data={choices}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderChoice}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.choiceListContent}
            ItemSeparatorComponent={() => <View style={{ width: ITEM_GAP }} />}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 10,
  },
  inner: {
    borderRadius: 6,
    paddingVertical: 1,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    width: 100,
  },
  iconWrap: {
    marginRight: 12,
  },
  label: {
    flexShrink: 1,
  },
  valueColumn: {
    flex: 1,
    paddingHorizontal: 10,
  },
  valueText: {
    fontSize: 14,
  },
  placeholderText: {
    opacity: 0.4,
  },
  actionsColumn: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 52,
    justifyContent: "flex-end",
  },
  cancelButton: {
    marginRight: 10,
  },
  choiceRow: {
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    paddingVertical: 8,
  },
  choiceListContent: {
    paddingHorizontal: 12,
  },
  choiceItem: {
    width: ITEM_WIDTH,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  choiceLabel: {
    fontSize: 13,
    textAlign: "center",
  },
});

export default OptionChoiceEdit;