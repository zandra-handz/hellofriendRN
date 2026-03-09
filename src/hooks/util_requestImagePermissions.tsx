// utils/requestImagePermission.ts
import * as ImagePicker from 'expo-image-picker';

export const requestImagePermission = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Sorry, we need camera roll permissions to make this work!');
  }
};