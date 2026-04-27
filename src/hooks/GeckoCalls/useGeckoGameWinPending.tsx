import { useQuery } from "@tanstack/react-query";
import useUser from "../useUser";
import { fetchGeckoGameWinPending } from "@/src/calls/api";

type Props = {
  userId: number;
}
const useGeckoGameWinPending = ({userId}: Props) => {
  const { user } = useUser();

  const {
    data: geckoGameWinPending,
    isLoading: geckoGameWinPendingIsLoading,
    isSuccess: geckoGameWinPendingIsSuccess,
    isError: geckoGameWinPendingIsError,
    refetch: refetchGeckoGameWinPending,
  } = useQuery({
    queryKey: ["geckoGameWinPending", user?.id ?? 0],
    queryFn: () => fetchGeckoGameWinPending(),
    enabled: !!userId,
    retry: 3,
  });

  return {
    geckoGameWinPending,
    geckoGameWinPendingIsLoading,
    geckoGameWinPendingIsSuccess,
    geckoGameWinPendingIsError,
    refetchGeckoGameWinPending,
  };
};

export default useGeckoGameWinPending;
