// UpNext.tsx
import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react"; 
import { AppFontStyles } from "@/app/styles/AppFonts";

type Props = {
  friendName: string | null;
  futureDateInWords: string | null;
  textColor: string;
  onPress: () => void;
};

const UpNext = ({
  friendName,
  futureDateInWords,
  textColor,
  onPress,
}: Props) => { 
  const HEIGHT = 200;
  const welcomeTextStyle = AppFontStyles.welcomeText;
  const subWelcomeTextStyle = AppFontStyles.subWelcomeText;

 

  return (
 
      <Pressable onPress={onPress} style={styles.container}>
        <Text
          style={[
            subWelcomeTextStyle,
            styles.headerText,
            {
              color: textColor,
            },
          ]}
        >
          Up next
        </Text>

        <Text
          numberOfLines={1}
          style={[
            welcomeTextStyle,
            styles.friendNameText,
            {
              color: textColor,
            },
          ]}
        >
          {friendName || "Please add a friend to use this feature!"}
        </Text>

        <Text
          style={[
        
            subWelcomeTextStyle,
                styles.subtitleText,
            {
              color: textColor,
            },
          ]}
        >
          Say hi on {futureDateInWords || ""}!
        </Text>
      </Pressable>
 
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 5,
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    paddingVertical: 20,
   
  
    
  
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 26, 
  },
  friendNameText: {
    fontSize: 40,
    lineHeight: 50,
  },
  subtitleText: {
    fontSize: 16,
    lineHeight: 32,
  },
});

export default React.memo(UpNext);
