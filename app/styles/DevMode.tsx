const DEV_MODE = false;

const devSettings = {
    devMode: DEV_MODE,
    baseURL: DEV_MODE ? "https://staging.badrainbowz.com/" : "https://badrainbowz.com/",
    socketURL: DEV_MODE ? "wss://staging.badrainbowz.com" : "wss://badrainbowz.com",
};


export default devSettings;
