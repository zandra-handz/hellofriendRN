const registerForNotifications = async () => { 
    try {
        const { data: token } = await Notifications.getExpoPushTokenAsync({
            projectId: "3564e25f-85ac-4c60-9f14-93d9153871b3",
        });
        console.log('Expo Push Token:', token);
    
        // Store the token as a string
        await SecureStore.setItemAsync('pushToken', token);
        
        // Update the user accessibility settings
        await updateUserAccessibilitySettings(authUserState.user.id, { receive_notifications: true, expo_push_token: token });

        // Optionally, send a notification
        //await Notifications.scheduleNotificationAsync({
          //  content: {
            //    title: "Notifications Enabled",
              //  body: "Notifications for hellofriend are now enabled!",
                //sound: 'default',
            //},
            //trigger: null,  
       // });

        return token;
    } catch (error) {
        console.error('Failed to get push token or send notification:', error);
    } 
};


const registerForNotifications = async () => {
    try {
        const authStatus = await messaging().requestPermission();
        const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
            console.error('Failed to get push token, permission not granted');
            return;
        }

        const token = await messaging().getToken();
        console.log('FCM Device Token:', token);

        await SecureStore.setItemAsync('pushToken', token);
        await updateUserAccessibilitySettings(authUserState.user.id, { receive_notifications: true, expo_push_token: token });

        return token;
    } catch (error) {
        console.error('Failed to get push token or send notification:', error);
    }
};