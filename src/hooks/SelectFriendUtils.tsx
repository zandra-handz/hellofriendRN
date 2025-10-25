import manualGradientColors from "@/app/styles/StaticColors";




// USING CONTEXT VERSION INSEAD
export function setToAutoFriend({ selectFriend, friend, preConditionsMet })  {



  console.log("FRIEND PASSED TO AUTO: ", friend);
    if (!preConditionsMet) {
      const notReady = {
        id: null,
        isReady: false,
        lightColor: manualGradientColors.lightColor,
        darkColor: manualGradientColors.darkColor,
      };

      selectFriend(notReady);
      return;
    }
    if (!friend?.id) {
      const notReady = {
        id: null,
        isReady: true,
        lightColor: manualGradientColors.lightColor,
        darkColor: manualGradientColors.darkColor,
      };

      selectFriend(notReady);
      return;
    }

    if (preConditionsMet && !friend?.id) {
      const isReady = {
        id: null,
        isReady: true,
        lightColor: manualGradientColors.lightColor,
        darkColor: manualGradientColors.darkColor,
      };

      selectFriend(isReady);
    }

    const fromAuto = {
      isReady: true,
      user: friend?.user,
      id: friend?.id,
      name: friend?.name,
      last_name: friend?.last_name,
      next_meet: friend?.next_meet,
      saved_color_dark: friend?.saved_color_dark,
      saved_color_light: friend?.saved_color_light,

      theme_color_dark: friend?.theme_color_dark,
      theme_color_light: friend?.theme_color_light,
      theme_color_font: friend?.theme_color_font,
      theme_color_font_secondary: friend?.theme_color_font_secondary,
      suggestion_settings: friend?.suggestion_settings,
      created_on: friend?.created_on,
      updated_on: friend?.updated_on,

      darkColor: friend?.theme_color_dark,
      lightColor: friend?.theme_color_light,
      fontColor: friend?.theme_color_font,
      fontColorSecondary: friend?.theme_color_font_secondary,
    };

    selectFriend(fromAuto);
  };


  // USING CONTEXT VERSION INSTEAD
  export function setToFriend({ selectFriend, friend, preConditionsMet }) {
    if (!preConditionsMet || !friend?.id) {
      const notReady = {
        id: null,
        isReady: false,
        lightColor: manualGradientColors.lightColor,
        darkColor: manualGradientColors.darkColor,
      };

      selectFriend(notReady);
      return;
    }
 

    const fromFriendlist = {
      isReady: true,
      user: friend?.user,
      id: friend?.id,
      name: friend?.name,
      last_name: friend?.last_name,
      next_meet: friend?.next_meet,
      saved_color_dark: friend?.saved_color_dark,
      saved_color_light: friend?.saved_color_light,

      theme_color_dark: friend?.theme_color_dark,
      theme_color_light: friend?.theme_color_light,
      theme_color_font: friend?.theme_color_font,
      theme_color_font_secondary: friend?.theme_color_font_secondary,
      suggestion_settings: friend?.suggestion_settings,
      created_on: friend?.created_on,
      updated_on: friend?.updated_on,

      darkColor: friend?.theme_color_dark,
      lightColor: friend?.theme_color_light,
      fontColor: friend?.theme_color_font,
      fontColorSecondary: friend?.theme_color_font_secondary,
    };

    selectFriend(fromFriendlist);
  };



//    type handleSetThemeProps = {
//     lightColor: string;
//     darkColor: string;
//     fontColor: string;
//     fontColorSecondary: string;
//   };

  export function handleSetTheme({
    selectFriend,
    lightColor,
    darkColor,
    fontColor,
    fontColorSecondary}) {
    selectedFriend((prev) => ({
      ...prev,
      lightColor,
      darkColor,
      fontColor,
      fontColorSecondary,
    }));
  };

export function deselectFriend({selectFriend}){
    selectFriend({
      isReady: true,
      user: null,
      id: null,
      name: null,
      last_name: null,
      next_meet: null,
      saved_color_dark: null,
      saved_color_light: null,

      theme_color_dark: null,
      theme_color_light: null,
      theme_color_font: null,
      theme_color_font_secondary: null,
      suggestion_settings: null,
      created_on: null,
      updated_on: null,

      lightColor: manualGradientColors.lightColor,
      darkColor: manualGradientColors.darkColor,
      fontColor: manualGradientColors.homeDarkColor, // ?? TEMP, not sure if right
      fontColorSecondary: manualGradientColors.homeDarkColor, // ?? TEMP, not sure if right
    });
  };

  // for logging out
export function resetFriend({selectFriend}) {
    selectFriend({
      isReady: false,
      user: null,
      id: null,
      name: null,
      last_name: null,
      next_meet: null,
      saved_color_dark: null,
      saved_color_light: null,

      theme_color_dark: null,
      theme_color_light: null,
      theme_color_font: null,
      theme_color_font_secondary: null,
      suggestion_settings: null,
      created_on: null,
      updated_on: null,

      lightColor: manualGradientColors.lightColor,
      darkColor: manualGradientColors.darkColor,
      fontColor: manualGradientColors.homeDarkColor, // ?? TEMP, not sure if right
      fontColorSecondary: manualGradientColors.homeDarkColor, // ?? TEMP, not sure if right
    });
  };

