// import { useEffect, useRef } from "react";
// import { AppState } from "react-native";
// import { useQueryClient } from "@tanstack/react-query";
// import { showFlashMessage } from "../utils/ShowFlashMessage";
// DEBUG VERSION — fires setInterval immediately every 5 seconds
// const useDateChangeRefresh = () => {
//   const queryClient = useQueryClient();

//   useEffect(() => {
//     console.log(`[useDateChangeRefresh] DEBUG — starting interval immediately`);
//     const interval = setInterval(() => {
//       console.log(`[useDateChangeRefresh] DEBUG tick at ${new Date().toLocaleTimeString()} — invalidating friendListAndUpcoming`);
//       queryClient.invalidateQueries({ queryKey: ["friendListAndUpcoming"] });
//     }, 1000 * 5);

//     return () => clearInterval(interval);
//   }, [queryClient]);
// };

// export default useDateChangeRefresh;

// PRODUCTION VERSION — uncomment below and remove debug version above when done testing
//
import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { showFlashMessage } from "../utils/ShowFlashMessage";

const useDateChangeRefresh = () => {
  const queryClient = useQueryClient();
  const lastDateRef = useRef(new Date().toDateString());

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;

    const checkDateChange = () => {
      const today = new Date().toDateString();

      if (today !== lastDateRef.current) {
        console.log(
          `[useDateChangeRefresh] date changed to ${today} — invalidating friendListAndUpcoming`,
        );

        lastDateRef.current = today;
        queryClient.invalidateQueries({ queryKey: ["friendListAndUpcoming"] });
      }
    };

    const refreshHourlyGeckoConfig = () => {
      console.log(
        `[useDateChangeRefresh] hourly gecko config refresh at ${new Date().toLocaleTimeString()}`,
      );
      queryClient.invalidateQueries({ queryKey: ["userGeckoConfigs"] });
    };

    const handleSync = () => {
      checkDateChange();
      refreshHourlyGeckoConfig();
    };

    // run on mount
    handleSync();

    // run when app comes to foreground
    const appStateSub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        showFlashMessage("Syncing...", false, 1000);
        handleSync();
      }
    });

    // sync to top of next hour
    const now = new Date();
    const msUntilNextHour =
      (60 - now.getMinutes()) * 60 * 1000 -
      now.getSeconds() * 1000 -
      now.getMilliseconds() +
      20000;

    console.log(
      `[useDateChangeRefresh] hourly interval will start at ${new Date(
        Date.now() + msUntilNextHour,
      ).toLocaleTimeString()}`,
    );

    showFlashMessage(
      `setInterval will start at ${new Date(
        Date.now() + msUntilNextHour,
      ).toLocaleTimeString()}`,
      false,
      1000,
    );

    timeout = setTimeout(() => {
      handleSync();
      interval = setInterval(() => {
        handleSync();
      }, 1000 * 60 * 60);
    }, msUntilNextHour);

    return () => {
      appStateSub.remove();
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [queryClient]);
};

export default useDateChangeRefresh;