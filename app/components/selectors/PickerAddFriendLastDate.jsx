import React from "react";
import { View, StyleSheet } from "react-native";
import PickerDate from "./PickerDate";

const PickerAddFriendLastDate = ({
  friendDate,
  setFriendDate,
  showDatePicker,
  setShowDatePicker,
}) => {
  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);

    if (selectedDate) {
      const dateWithoutTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      setFriendDate(dateWithoutTime);
      console.log("Selected Date:", dateWithoutTime);
    }
  };

  return (
    <View style={styles.dateContainer}>
      <PickerDate
        value={friendDate}
        mode="date"
        display="default"
        containerText="Last hello: "
        maximumDate={new Date()}
        onChange={onChangeDate}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        inline={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dateText: {
    fontSize: 16,
    marginVertical: 14,
    fontFamily: "Poppins-Regular",
  },
  dateContainer: {
    // borderRadius: 8,
    // width: "100%",
    // padding: 0,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 0 },
    // shadowOpacity: 0.0,
    // shadowRadius: 0,
    // elevation: 0,
    marginVertical: 10,
    height: 60,
  },
  label: {
    fontSize: 17,
    fontFamily: "Poppins-Bold",
  },
});

export default PickerAddFriendLastDate;
