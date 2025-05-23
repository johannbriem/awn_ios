import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveKeys = async (appKey, apiKey) => {
  try {
    await AsyncStorage.setItem('userAppKey', appKey);
    await AsyncStorage.setItem('userApiKey', apiKey);
  } catch (error) {
    console.error('Failed to save API keys', error);
  }
};

export const loadKeys = async () => {
  try {
    const appKey = await AsyncStorage.getItem('userAppKey');
    const apiKey = await AsyncStorage.getItem('userApiKey');

    const fallbackAppKey = process.env.EXPO_PUBLIC_AMBIENT_APP_KEY;
    const fallbackApiKey = process.env.EXPO_PUBLIC_AMBIENT_API_KEY;

    return {
        appKey: appKey || fallbackAppKey,
        apiKey: apiKey || fallbackApiKey,
        usedFallback: !(appKey && apiKey),
    };
  } catch (error) {
    console.error('Failed to load API keys', error);
    return { appKey: null, apiKey: null, usedFallback: true };
  }
};
