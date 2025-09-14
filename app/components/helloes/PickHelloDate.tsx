import { View, Text, StyleSheet, Pressable } from "react-native";
import manualGradientColors  from "@/src/hooks/StaticColors";
import { AppFontStyles } from "@/src/hooks/StaticFonts";
import GlobalPressable from "../appwide/button/GlobalPressable";
import HalfScreenModal from "../alerts/HalfScreenModal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
type Props = {
  primaryColor: string;
  selected: any;
  onChange: (index: number) => void;
};

const PickHelloDate = ({
  primaryColor,
  selected,
  onChange,
  modalVisible,
  setModalVisible,
}: Props) => {
  useEffect(() => {
    console.log(`modalvisivle:`, modalVisible);
  }, [modalVisible]);
  const renderButtonStyle = useCallback(
    () => {
      return (
        <Pressable
          onPress={() => setModalVisible(true)}
          style={{
            backgroundColor: "transparent",
            alignItems: "center",
            justifyContent: "start",
            height: "100%",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <MaterialCommunityIcons
            name={"calendar"}
            size={20}
            color={primaryColor}
            style={{ marginRight: 10 }}
          />
          <Text
            style={{
              color: primaryColor,
            }}
          >
            {moment(selected).format("MMM D YYYY")}
          </Text>
        </Pressable>
      );
    },
    [selected, setModalVisible, primaryColor] // dependencies go here
  );
  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={[styles.container ]}
      >
        {renderButtonStyle()}
      </Pressable>

      {modalVisible && (
        <HalfScreenModal
          primaryColor={primaryColor}
          backgroundColor={"orange"}
          isFullscreen={false}
          isVisible={modalVisible}
          children={
            <DateTimePicker
              testID="dateTimePicker"
              value={selected}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={onChange}
            />
          }
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50, 
    zIndex: 60000,
    paddingHorizontal: 20,
    flexDirection: "row",
  },
  section: {
    flex: 1,
    width: "100%",

    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {},
});
export default PickHelloDate;
