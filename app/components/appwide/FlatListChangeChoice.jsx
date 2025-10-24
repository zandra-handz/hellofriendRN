import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  View,
  Text, 
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
  import SvgIcon from "@/app/styles/SvgIcons"; 

// Forwarding ref to the parent to expose the TextInput value
const FlatListChangeChoice = forwardRef(
  (
    { 
      primaryColor,
      backgroundColor, 
  
      darkColor,
      title = "title",
      horizontal = true,
      choicesArray,
      oldChoice = "",
      onChoiceChange,
    },
    ref
  ) => { 
    const [newChoice, setNewChoice] = useState(oldChoice); // Use the starting text passed as prop
    const choiceRef = useRef();

    useEffect(() => {
      if (choiceRef.current) {
        choiceRef.current.setNativeProps({ text: oldChoice });
        setNewChoice(oldChoice);
      }
    }, []);

    // Expose the current value of the TextInput via the ref
    useImperativeHandle(ref, () => ({
      setText: (text) => {
        if (choiceRef.current) {
          choiceRef.current.setNativeProps({ text });
          setNewChoice(text);
        }
      },
      clearText: () => {
        if (choiceRef.current) {
          choiceRef.current.clear();
          setNewChoice("");
        }
      },
      getText: () => newChoice,
    }));

    useEffect(() => {
      setNewChoice(oldChoice); // Reset to starting text if it changes
    }, [oldChoice]);

    const handleChoiceChange = (text) => {
      console.log(text);
      setNewChoice(text);
      onChoiceChange(text);
    };

    return (
      <View
        style={[styles.container ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            height: "auto",
          }}
        >
          <Text style={[styles.title, {color: primaryColor}]}>
            {title}
          </Text> 
          <SvgIcon
          name={'pen'}
          size={30}
          color={'red'}/>
        </View>
        {choicesArray && (
          <FlatList
            data={choicesArray}
            ref={choiceRef}
            horizontal={horizontal}
            keyExtractor={(item, index) => `choice-${index}`}
            renderItem={({ item, index }) => (
              <View
                style={{ height: "100%", width: "auto", marginRight: "2%" }}
              >
                <TouchableOpacity
                  onPress={() => handleChoiceChange(String(item.value))}
                  style={[
                    styles.itemBox,
                    
                    {
                      width: 130,
                      borderWidth: 1,
                      backgroundColor: backgroundColor,
                      borderColor:
                        item.value === newChoice
                          ? darkColor
                          : backgroundColor
                    },
                  ]}
                >
                  <Text style={[primaryColor]}>{index + 1}</Text>
                  <Text style={[primaryColor]}>{item.label}</Text>
                </TouchableOpacity>
              </View>
            )}
            showsHorizontalScrollIndicator={false}
            scrollIndicatorInsets={{ right: 1 }}
            initialScrollIndex={0}
            decelerationRate="fast"
            ListFooterComponent={<View style={{ width: 120 }} />}
          />
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: '100%',
    borderRadius: 30, 
    alignSelf: "center",
    padding: 20,
  },
  title: {
    fontSize: 15,
    lineHeight: 21,
    textTransform: "uppercase",
  },
  itemBox: {
    flexDirection: "column",
    textAlignVertical: "top",
    alignContent: "center",
    borderWidth: 1,
    borderRadius: 20,
    padding: "6%",
    height: "100%",
    width: "100%",
  },
});

export default FlatListChangeChoice;
