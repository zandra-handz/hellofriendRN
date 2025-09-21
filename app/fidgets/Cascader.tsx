import { View } from "react-native";
import React from "react"; 
import GradientBackground from "../components/appwide/display/GradientBackground";
import { useFriendStyle } from "@/src/context/FriendStyleContext";
import { useUpcomingHelloes } from "@/src/context/UpcomingHelloesContext";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
  
import LoadingBlock from "../components/appwide/spinner/LoadingBlock";
type Props = {};

const Cascader = ({ isInitializing }: Props) => {
 

  const { themeAheadOfLoading } = useFriendStyle();

  const { selectedFriend } = useSelectedFriend();
  const marginH = 6;
  const marginV = 10;

  const heightP = '6%';

  function equidistantRange(start, end, step) {
    const arr = [];
    for (let i = start; i <= end; i += step) {
      arr.push(i);
    }
    return arr;
  }
 

  const delayArray = equidistantRange(0, 1800, 100);
  console.log(delayArray);

  return (
   
          <GradientBackground
            useFriendColors={!!selectedFriend?.id} 
            friendColorDark={themeAheadOfLoading.darkColor}
            friendColorLight={themeAheadOfLoading.lightColor}
          >
            <View
              style={{
                height: heightP,
                borderRadius: 30,
                marginHorizontal: marginH,
                marginVertical: marginV,
                paddingTop: 40, // JUST for loading block
              }}
            >
              <LoadingBlock loading={true} delay={delayArray[0]} />
            </View>
            <View
              style={{
                 height: heightP,
                borderRadius: 30,
                marginHorizontal: marginH,
                marginVertical: marginV,
              }}
            >
              <LoadingBlock loading={true} delay={delayArray[1]} />
            </View>
            <View
              style={{
                 height: heightP,
                borderRadius: 30,
                marginHorizontal: marginH,
                marginVertical: marginV,
              }}
            >
              <LoadingBlock loading={true} delay={delayArray[2]} />
            </View>
            <View
              style={{
                 height: heightP,
                borderRadius: 30,
                marginHorizontal: marginH,
                marginVertical: marginV,
              }}
            >
              <LoadingBlock loading={true} delay={delayArray[3]} />
            </View>
            <View
              style={{
               height: heightP,
                borderRadius: 30,
                marginHorizontal: marginH,
                marginVertical: marginV,
              }}
            >
              <LoadingBlock loading={true} delay={delayArray[4]} />
            </View>
            <View
              style={{
               height: heightP,
                borderRadius: 30,
                marginHorizontal: marginH,
                marginVertical: marginV,
              }}
            >
              <LoadingBlock loading={true} delay={delayArray[5]} />
            </View>
            <View
              style={{
                height: heightP,
                borderRadius: 30,
                marginHorizontal: marginH,
                marginVertical: marginV,
              }}
            >
              <LoadingBlock loading={true} delay={delayArray[6]} />
            </View>
            <View
              style={{
                height: heightP,
                borderRadius: 30,
                marginHorizontal: marginH,
                marginVertical: marginV,
              }}
            >
              <LoadingBlock loading={true} delay={delayArray[7]} />
            </View>
            <View
              style={{
                height: heightP,
                borderRadius: 30,
                marginHorizontal: marginH,
                marginVertical: marginV,
              }}
            >
              <LoadingBlock loading={true} delay={delayArray[8]} />
            </View>
            <View
              style={{
                height: heightP,
                borderRadius: 30,
                marginHorizontal: marginH,
                marginVertical: marginV,
              }}
            >
              <LoadingBlock loading={true} delay={delayArray[9]} />
            </View>
                        <View
              style={{
                height: heightP,
                borderRadius: 30,
                marginHorizontal: marginH,
                marginVertical: marginV,
              }}
            >
              <LoadingBlock loading={true} delay={delayArray[10]} />
            </View>
                        <View
              style={{
                height: heightP,
                borderRadius: 30,
                marginHorizontal: marginH,
                marginVertical: marginV,
              }}
            >
              <LoadingBlock loading={true} delay={delayArray[11]} />
            </View>
                        <View
              style={{
                height: heightP,
                borderRadius: 30,
                marginHorizontal: marginH,
                marginVertical: marginV,
              }}
            >
              <LoadingBlock loading={true} delay={delayArray[12]} />
            </View>
                        <View
              style={{
                height: heightP,
                borderRadius: 30,
                marginHorizontal: marginH,
                marginVertical: marginV,
              }}
            >
              <LoadingBlock loading={true} delay={delayArray[13]} />
            </View>


                                   <View
              style={{
                height: heightP,
                borderRadius: 30,
                marginHorizontal: marginH,
                marginVertical: marginV,
              }}
            >
              <LoadingBlock loading={true} delay={delayArray[14]} />
            </View>

                                   <View
              style={{
                height: heightP,
                borderRadius: 30,
                marginHorizontal: marginH,
                marginVertical: marginV,
              }}
            >
              <LoadingBlock loading={true} delay={delayArray[15]} />
            </View>

                                   <View
              style={{
                height: heightP,
                borderRadius: 30,
                marginHorizontal: marginH,
                marginVertical: marginV,
              }}
            >
              <LoadingBlock loading={true} delay={delayArray[16]} />
            </View>

                                   <View
              style={{
                height: heightP,
                borderRadius: 30,
                marginHorizontal: marginH,
                marginVertical: marginV,
              }}
            >
              <LoadingBlock loading={true} delay={delayArray[17]} />
            </View>

                                   <View
              style={{
                height: heightP,
                borderRadius: 30,
                marginHorizontal: marginH,
                marginVertical: marginV,
              }}
            >
              <LoadingBlock loading={true} delay={delayArray[18]} />
            </View>

       
          </GradientBackground>
    
  );
};

export default Cascader;
