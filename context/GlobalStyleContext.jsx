import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthUser } from './AuthUserContext';

const GlobalStyleContext = createContext();

export const useGlobalStyle = () => useContext(GlobalStyleContext);

export const GlobalStyleProvider = ({ children }) => {
  const { userAppSettings } = useAuthUser();
  const [styles, setStyles] = useState({
    fontSize: 16,
    highContrast: false,
    screenReader: false,
    receiveNotifications: false,
  });

  useEffect(() => {
    if (userAppSettings) {
      setStyles({
        fontSize: userAppSettings.large_text ? 20 : 16,
        highContrast: userAppSettings.high_contrast_mode,
        screenReader: userAppSettings.screen_reader,
        receiveNotifications: userAppSettings.receive_notifications,
      });
    }
  }, [userAppSettings]);

  return (
    <GlobalStyleContext.Provider value={styles}>
      {children}
    </GlobalStyleContext.Provider>
  );
};

export default GlobalStyleProvider;

