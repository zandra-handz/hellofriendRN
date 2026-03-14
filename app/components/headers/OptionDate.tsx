import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextStyle,
} from "react-native";
import SvgIcon from "@/app/styles/SvgIcons";
import PickerDate from "@/app/components/selectors/PickerDate";

type Props = {
  label: string;
  value: Date;
  onValueChange: (date: Date) => void;
  primaryColor: string;
  backgroundColor: string;
  buttonColor: string;
  textStyle: TextStyle;
  icon?: React.ReactElement;
  buttonPadding?: number;
  maximumDate?: Date;
  minimumDate?: Date;
};

const OptionDate: React.FC<Props> = ({
  label,
  value,
  onValueChange,
  primaryColor,
  backgroundColor,
  buttonColor,
  textStyle,
  icon,
  buttonPadding = 4,
  maximumDate,
  minimumDate,
}) => {
  const [showPicker, setShowPicker] = React.useState(false);

  const onChangeDate = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      const dateWithoutTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
      );
      onValueChange(dateWithoutTime);
    }
  };

  const displayValue = value.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Pressable
      onPress={() => setShowPicker((prev) => !prev)}
      style={[styles.button, { padding: buttonPadding, backgroundColor: buttonColor }]}
      android_ripple={{ color: "rgba(255,255,255,0.08)" }}
    >
      <View style={[styles.inner, { backgroundColor }]}>
        <View style={styles.left}>
          {!!icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text
            style={[textStyle, styles.label, { color: primaryColor }]}
            numberOfLines={1}
          >
            {label}
          </Text>
        </View>

        <View style={styles.valueColumn}>
          <Text
            style={[textStyle, styles.valueText, { color: primaryColor }]}
            numberOfLines={1}
          >
            {displayValue}
          </Text>
        </View>

        <View style={styles.actionsColumn}>
          <SvgIcon name="calendar" size={18} color={primaryColor} />
        </View>
      </View>

      {showPicker && (
        <PickerDate
          value={value}
          mode="date"
          display="default"
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          onChange={onChangeDate}
          showDatePicker={showPicker}
          setShowDatePicker={setShowPicker}
          inline={true}
        />
      )}
    </Pressable>
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
  actionsColumn: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 52,
    justifyContent: "flex-end",
  },
});

export default OptionDate;