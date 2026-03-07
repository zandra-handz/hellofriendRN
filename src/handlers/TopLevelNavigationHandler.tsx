import React, { ReactNode, useEffect } from "react";

import useAppNavigations from "../hooks/useAppNavigations";

type Props = {
  userId?: number | null;
  isInitializing?: boolean | null;
  children: ReactNode;
};

const TopLevelNavigationHandler = ({
  userId,
  isInitializing,
  children,
}: Props) => {
  const { navigateToWelcome } = useAppNavigations();

  useEffect(() => {
    const checkAuthentication = async () => {
      if (isInitializing) {
        // console.log("nav useeffect triggerd! returning without doing anything");
        return; // Wait until loading is complete
      }

      if (!userId) {
        // console.log("nav useeffect triggerd! not authenticated");
        navigateToWelcome();
      }

      if (userId) {
        // console.log(
        //   "nav useeffect triggerd! authenticated, not doing anything",
        // );
      }
    };

    checkAuthentication();
  }, [navigateToWelcome, isInitializing, userId]);

  return <>{children}</>;
};

export default TopLevelNavigationHandler;
