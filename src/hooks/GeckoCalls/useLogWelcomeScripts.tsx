import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logWelcomeScripts } from "../../calls/api";
import useUser from "../useUser";

type ScriptEntry = {
  script_id: number;
  shown_at: string;
};

const useLogWelcomeScripts = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const timeoutRef = useRef(null);

  const logWelcomeScriptsMutation = useMutation({
    mutationFn: (entries: ScriptEntry[]) => logWelcomeScripts(entries),
    onSuccess: (serverData) => {
      console.log("logWelcomeScripts success:", serverData);
      queryClient.invalidateQueries({ queryKey: ["userGeckoScriptsLedger", user?.id] });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        logWelcomeScriptsMutation.reset();
      }, 2000);
    },
    onError: (error) => {
      console.error("Error logging welcome scripts:", error);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        logWelcomeScriptsMutation.reset();
      }, 2000);
    },
  });

  const logScripts = async (entries: ScriptEntry[]) => {
    try {
      await logWelcomeScriptsMutation.mutateAsync(entries);
    } catch (error) {
      console.error("Error logging welcome scripts:", error);
    }
  };

  return {
    logScripts,
    logWelcomeScriptsMutation,
  };
};

export default useLogWelcomeScripts;
