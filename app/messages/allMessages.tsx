import { useMessage } from "@/src/context/MessageContext";

const useMessageCentralizer = () => {
  const { showMessage } = useMessage();

  const errorMessageFormaat = ({ itemType, actionType }) => {
    return `Oops! Could not ${actionType} ${itemType}.`;
  };

  const successMessageFormaat = ({ itemType, actionType }) => {
    return `Success! ${itemType} ${actionType}.`;
  };

  // ScreenAuth wrapped in signinMutation.isPending
  const showVerifyingCredentialsMessage = () => {
    showMessage(true, null, "Signing you in...");
  };

  // ScreenAuth wrapped in signinMutation.isError
  const showSigninErrorMessage = () => {
    showMessage(true, null, "Oops! Could not sign you in.");
  };

  return {
    showVerifyingCredentialsMessage,
    showSigninErrorMessage,
  }
};


export default useMessageCentralizer();
