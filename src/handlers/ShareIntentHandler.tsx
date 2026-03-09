import { useEffect } from "react";
import { Alert } from "react-native";
import { useShareIntentContext } from "expo-share-intent";
import { File } from "expo-file-system";
import useAppNavigations from "@/src/hooks/useAppNavigations";
import useImageUploadFunctions from "@/src/hooks/useImageUploadFunctions";
import { showFlashMessage } from "@/src/utils/ShowFlashMessage";

export default function ShareIntentHandler() {
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntentContext();
  const { navigateToMomentFocusWithText, navigateToAddImage } = useAppNavigations();
  const { requestPermission, imageUri, resizeImage } = useImageUploadFunctions();

  // useEffect(() => {
  //   requestPermission();
  // }, []);

  useEffect(() => {
    if (imageUri) {
      navigateToAddImage({ imageUri });
    }
  }, [imageUri]);

  useEffect(() => {
    if (!hasShareIntent || !shareIntent) return;

    if (shareIntent?.files?.length > 0) {
      const file = shareIntent.files[0];
      const uri = file?.path || file?.contentUri;
      if (uri) {
        processSharedFile(uri);
      } else {
        console.warn("No valid URI found for the shared file.");
      }
      resetShareIntent();
      return;
    }

    if (shareIntent?.text?.length > 0) {
      const sharedText = shareIntent.text.replace(/^["']|["']$/g, "");
      if (sharedText) {
        navigateToMomentFocusWithText({
          screenCameFrom: 0,
          momentText: sharedText,
        });
      } else {
        showFlashMessage(
          `length in shared text but data structure passed here is not valid`,
          true,
          2000,
        );
      }
      resetShareIntent();
      return;
    }
  }, [shareIntent, hasShareIntent]);

  const processSharedFile = async (url) => {
    if (url.startsWith("content://") || url.startsWith("file://")) {
      try {
        const file = new File(url);
        const fileInfo = await file.info();
        if (fileInfo?.exists) {
          if (fileInfo.uri.match(/\.(jpg|jpeg|png|gif)$/)) {
            const resizedImage = await resizeImage(fileInfo.uri);
            navigateToAddImage({ imageUri: resizedImage.uri });
          } else {
            Alert.alert("Unsupported File", "The shared file is not a valid image.");
          }
        } else {
          Alert.alert("Error", "Could not process the shared file.");
        }
      } catch (error) {
        console.error("Error processing shared file:", error);
        Alert.alert("Error", "An error occurred while processing the shared file.");
      }
    }
  };

  return null;
}