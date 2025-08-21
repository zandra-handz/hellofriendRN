
import { showFlashMessage } from "../utils/ShowFlashMessage";

const useMessageCentralizer = () => {
 

 
  // ScreenAuth wrapped in signinMutation.isPending
 

  // ScreenAuth wrapped in signinMutation.isError
  const showSigninErrorMessage = () => {
   showFlashMessage(`Oops! Couldn't sign in`, false, 2000);
  };

  return { 
    showSigninErrorMessage,
  }
};


export default useMessageCentralizer;
