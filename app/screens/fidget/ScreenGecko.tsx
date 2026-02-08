import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  Text,
  Vibration,
} from "react-native";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import { useSelectedFriend } from "@/src/context/SelectedFriendContext";
import { useLDTheme } from "@/src/context/LDThemeContext";
import { useCapsuleList } from "@/src/context/CapsuleListContext";
import useEditMoment from "@/src/hooks/CapsuleCalls/useEditMoment";
import useUpdateMomentCoords from "@/src/hooks/CapsuleCalls/useUpdateCoords";
import manualGradientColors from "@/app/styles/StaticColors";
 
import SvgIcon from "@/app/styles/SvgIcons";
import useFriendDash from "@/src/hooks/useFriendDash";
import useUser from "@/src/hooks/useUser";
import MomentsSkia from "@/app/assets/shader_animations/MomentsSkia";
import PreAuthSafeViewAndGradientBackground from "@/app/components/appwide/format/PreAuthSafeViewAndGradBackground";
import {
  // useKeepAwake,
  // activateKeepAwake,
  activateKeepAwakeAsync,
  deactivateKeepAwake,
} from "expo-keep-awake";

type Props = {};

const ScreenGecko = (props: Props) => {
  const { user } = useUser();
  const { lightDarkTheme } = useLDTheme();
  const { capsuleList } = useCapsuleList();
  const { selectedFriend } = useSelectedFriend();
  const { navigateToMomentView, navigateToMomentFocus } = useAppNavigations();
  const handleNavigateToCreateNew = useCallback(() => {
    navigateToMomentFocus({ screenCameFrom: 1 });
  }, [navigateToMomentFocus]);

  const { friendDash } = useFriendDash({
    userId: user?.id,
    friendId: selectedFriend?.id,
  });

  const { handleEditMoment, editMomentMutation } = useEditMoment({
    userId: user?.id,
    friendId: selectedFriend?.id,
  });

  const { handleUpdateMomentCoords, updateMomentCoordsMutation } =
    useUpdateMomentCoords({
      userId: user?.id,
      friendId: selectedFriend?.id,
    });

  // const mod = (n, m) => {
  //   return ((n % m) + m) % m;
  // };

  const handleNavigateToMoment = useCallback(
    (m) => {
      navigateToMomentView({ moment: m, index: m.uniqueIndex });
    },
    [navigateToMomentView], // optional, if this function comes from props/context
  );

  // const momentCoords = useMemo(() => {
  //   return capsuleList.map((m) => ({
  //     id: m.id,
  //     coord: [m.screen_x, m.screen_y],
  //   }));
  // }, [capsuleList]);

  const MAX_MOMENTS = 40;

  const momentCoords = useMemo(() => {
 
    return capsuleList.slice(0, MAX_MOMENTS).map((m) => ({
      id: m.id,
      coord: [m.screen_x, m.screen_y],
      stored_index: m.stored_index,
    }));

  }, [capsuleList]);

  const [resetSkia, setResetSkia] = useState(null);

  const [manualOnly, setManualOnly] = useState(true);

  useEffect(() => {
    if (!manualOnly) {
      console.log("keep awake!!");
      activateKeepAwakeAsync();
    } else {
      deactivateKeepAwake();
      console.log("sleep");
    }

    return () => deactivateKeepAwake(); // safety cleanup
  }, [manualOnly]);

  const handleToggleManual = () => {
    setManualOnly((prev) => !prev);
  };

  useEffect(() => {
    setMoment({
      category: null,
      capsule: null,
      uniqueIndex: null,
      id: null,
    });
  }, [resetSkia]);

  const [scatteredMoments, setScatteredMoments] = useState(momentCoords);
  useEffect(() => {
    console.log(momentCoords)
    setScatteredMoments(momentCoords);
    setResetSkia(Date.now());
  }, [momentCoords]);

  // Function to randomize/scatter moments
  const handleRescatterMoments = () => {
    const minY = 0.2; // 10% down from top
    const maxY = 0.75; // 10% up from bottom

    const minX = 0.05;
    const maxX = 0.95;
    // console.log(`scattering moments!`, scatteredMoments);
    setScatteredMoments((prev) =>
      prev.map((m) => {
        const randomX = Math.random() * (maxX - minX) + minX; // clamp X
        const randomY = Math.random() * (maxY - minY) + minY; // clamp Y
        const storedIndex = m.stored_index;

        return {
          ...m,
          coord: [randomX, randomY],
          stored_index: storedIndex,
        };
      }),
    );
    // console.log(`done!`, scatteredMoments);
  };

  const handleRecenterMoments = () => {
    setScatteredMoments((prev) =>
      prev.map((m) => ({
        ...m,
        coord: [0.5, 0.5], // recenter all coords
      })),
    );
    // console.log('All moments recentered to [0.5, 0.5]');
  };

  //  const [count, setCount] = useState(0);

  const [moment, setMoment] = useState({
    category: null,
    capsule: null,
    uniqueIndex: null,
    id: null,
  });

  // might need to go in momentSkia instead, handled/kept track of in momentsClass
  // set this in momentsClass constructor
  // const hold = (id) => {
  // console.log('hold', id);

  // };

  // const drop = (id) => {
  //   console.log('drop', id);
  // };

  // useEffect(() => {
  //   console.log(`SCREENGECKO CAPSULES: `, capsuleList.length);

  // }, [capsuleList]);

  const handleGetMoment = useCallback((id) => {
    // console.log('handleGetMoment', id)
    const moment = capsuleList.find((c) => c.id === id);
    //  console.log(`setting moment`, moment)
    if (moment?.id) {
      setMoment({
        category: moment.user_category_name,
        capsule: moment.capsule,
        uniqueIndex: moment.uniqueIndex,
        id: moment.id,
      });

      // setCount((prev) => prev + Number(moment?.charCount));

      // --- Vibration ---
      Vibration.vibrate(50); // vibrate for 50ms
    } else {
  
      setMoment({
        category: null,
        capsule: null,
        uniqueIndex: null,
        id: null,
      });
    }
  }, [capsuleList]);

  const primaryColor = lightDarkTheme.priamryText;

  const BLANK_WINDOW_MESSAGE = useMemo(() => {
    if (!scatteredMoments || scatteredMoments.length < 1) {
      return `No moments to view.`;
    }
    return `Select a moment to view it.`;
  }, [scatteredMoments]);

  const TIME_SCORE = useMemo(() => {
    if (!friendDash || !friendDash?.time_score) {
      return 100;
    }
    return Math.round(100 / friendDash?.time_score);
  }, [friendDash]);

  const DAYS_SINCE = friendDash?.days_since || 0;

  // useEffect(() => {
  //   console.log(`spinner viewing: `, spinnerViewing);
  // }, [spinnerViewing]);

  return (
    <PreAuthSafeViewAndGradientBackground
      startColor={manualGradientColors.lightColor}
      endColor={manualGradientColors.darkColor}
      friendColorLight={selectedFriend.darkColor}
      friendColorDark={selectedFriend.lightColor}
      backgroundOverlayColor={lightDarkTheme.primaryBackground}
      friendId={selectedFriend?.id}
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <View
        style={[
          StyleSheet.absoluteFill,

          // { backgroundColor: lightDarkTheme?.primaryBackground },
        ]}
      >
        <MomentsSkia
          handleEditMoment={handleEditMoment}
          handleUpdateMomentCoords={handleUpdateMomentCoords}
          handleGetMoment={handleGetMoment}
          color1={manualGradientColors.lightColor}
          color2={manualGradientColors.homeDarkColor}
          bckgColor1={selectedFriend?.lightColor}
          bckgColor2={selectedFriend?.darkColor}
          momentsData={scatteredMoments}
          // startingCoord={[0.5, -.3]}
          startingCoord={[0.1, -0.5]}
          restPoint={[0.5, 0.6]}
          scale={1}
          gecko_scale={1}
          gecko_size={1.7}
          lightDarkTheme={lightDarkTheme}
          reset={resetSkia}
          // handleRescatterMoments={handleRescatterMomentsNormalizedSpace}
          handleRescatterMoments={handleRescatterMoments}
          handleRecenterMoments={handleRecenterMoments}
          // setScatteredMoments={setScatteredMoments}
          handleToggleManual={handleToggleManual}
          manualOnly={manualOnly}
        />
      </View>
      <View
        style={[
          styles.statsWrapper,
          { backgroundColor: lightDarkTheme.lighterOverlayBackground },
        ]}
      >
        <Text style={[styles.friendText, { color: primaryColor }]}>
          Friend: {selectedFriend.name}
        </Text>
        <Text style={[styles.statsText, { color: primaryColor }]}>
          Health: {TIME_SCORE}%
        </Text>
        <Text style={[styles.statsText, { color: primaryColor }]}>
          Days since: {DAYS_SINCE}
        </Text>
      </View>

      <View
        style={[
          styles.manualButtonWrapper,
          // { backgroundColor: lightDarkTheme.lighterOverlayBackground },
        ]}
      >
        {/* <Text style={[styles.scoreText, { color: primaryColor }]}>{count}</Text> */}
        <Pressable onPress={handleToggleManual} style={[styles.manualButton, {backgroundColor: lightDarkTheme.lighterOverlayBackground}]}>
          <SvgIcon
            name={manualOnly ? `motion_play_outline` : `motion_pause_outline`}
            size={36}
           color={lightDarkTheme.primaryBackground}
          ></SvgIcon>
        </Pressable>
      </View>

      <View style={styles.previewOuter}>
        <View
          style={[
            styles.previewWrapper,
            {
              backgroundColor: lightDarkTheme.darkerOverlayBackground,
              borderColor: selectedFriend.darkColor,
            },
          ]}
        >
           {scatteredMoments.length > 0 && (

        
          <Pressable
            onPress={() => handleNavigateToMoment(moment)}
            style={styles.momentViewButton}
          >
           
            <SvgIcon
              name={`chevron_double_right`}
              size={28}
              color={lightDarkTheme.primaryText}
            />
          </Pressable>
             )}
          {moment.id && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                style={[
                  styles.previewHeader,
                  { color: lightDarkTheme.primaryText },
                ]}
              >
                {moment.category}
              </Text>

              <Text
                style={[
                  styles.previewText,
                  { color: lightDarkTheme.primaryText },
                ]}
              >
                {moment.capsule}
              </Text>
            </ScrollView>
          )}
          {!moment.id && (
            <Pressable onPress={handleNavigateToCreateNew} style={styles.noMomentWrapper}>
              <Text
                style={[
                  styles.noMomentText,
                  { color: lightDarkTheme.primaryText },
                ]}
              >
                {BLANK_WINDOW_MESSAGE} <Text style={[styles.buttonText, {color: lightDarkTheme.primaryText}]}> Add one?</Text> 
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </PreAuthSafeViewAndGradientBackground>
  );
};

const styles = StyleSheet.create({
  statsWrapper: {
    // width: "100%",
    height: 106,
    padding: 20,
    paddingHorizontal: 20,
    top: 60,
    left: 16, //same as pawsetter
    flex: 1,
    // width: 170,
    position: "absolute",
    flexDirection: "column",
    //  alignItems: "center",
    borderRadius: 30,
    //   borderWidth: 1,
    //   shadowColor: "#000",
    //  shadowOffset: { width: 0, height: 4 },
    //   shadowOpacity: 0.3,
    //   shadowRadius: 4.65,
    //  elevation: 8,
  },

  scoreWrapper: {
    // width: "100%",
    height: 80,
    padding: 20,
    paddingHorizontal: 20,
    top: 150,
    left: 16, //same as pawsetter
    flex: 1,
    // width: 170,
    position: "absolute",
    flexDirection: "column",
    //  alignItems: "center",
    borderRadius: 30,
    //   borderWidth: 1,
    //   shadowColor: "#000",
    //  shadowOffset: { width: 0, height: 4 },
    //   shadowOpacity: 0.3,
    //   shadowRadius: 4.65,
    //  elevation: 8,
  },

  friendText: {
    fontWeight: "bold",
    fontSize: 17,
    lineHeight: 26,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16

  },
  statsText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  scoreText: {
    fontWeight: "bold",
    fontSize: 20,
  },
    manualButtonWrapper: {
    // width: "100%",
    height: 80,
    padding: 20,
    paddingHorizontal: 20,
    top: 160,
    left: 0, //same as pawsetter
    flex: 1,
    // width: 170,
    position: "absolute",
    flexDirection: "column",
    //  alignItems: "center",
    borderRadius: 999,
    borderRadius: 30,
 
  },
  manualButton: {
    paddingVertical: 20,
    borderRadius: 999,
    height: 60,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
         borderWidth: 1,
    //   shadowColor: "#000",
    //  shadowOffset: { width: 0, height: 4 },
    //   shadowOpacity: 0.3,
    //   shadowRadius: 4.65,
    //  elevation: 1,
  },
  previewOuter: {
    width: "100%",
    paddingHorizontal: 20,
    bottom: 10,
    height: 140,
  },
  previewWrapper: {
    width: "100%",
    height: 140,
    // backgroundColor: 'red',
    borderWidth: 2,
    borderRadius: 40,

    padding: 20,
  },
  noMomentWrapper: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  noMomentText: {
    fontSize: 17,
    //fontWeight: "bold",
  },
  previewText: {
    fontSize: 15,
    lineHeight: 22,
  },
  previewHeader: {
    fontSize: 15,
    fontWeight: "bold",
    lineHeight: 22,
  },
  momentViewButton: {
    padding: 20,
    width: "100%",
    height: 50,
    top: 0,
    right: 0,

    flexDirection: "row",
    justifyContent: "flex-end",
    // backgroundColor: 'teal',
    zIndex: 9000,

    position: "absolute",
  },
  holdMomentButton: {
    width: "auto",
    maxWidth: 90,
    flexDirection: "row",
    justifyContent: "center",

    padding: 8,
    borderRadius: 999,
    marginBottom: 20,
    alignItems: "center",
  },
  holdMomentText: {
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default ScreenGecko;
