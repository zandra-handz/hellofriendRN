import { useQuery } from "@tanstack/react-query";
import { getCurrentLiveSesh } from "@/src/calls/api";

type Props = {
  userId: number;
  enabled?: boolean;
};

const useCurrentLiveSesh = ({ userId, enabled = true }: Props) => {
  const { data, isLoading, isSuccess, refetch } = useQuery({
    queryKey: ["currentLiveSesh", userId],
    queryFn: () => getCurrentLiveSesh(),
    enabled: !!userId && enabled,
    staleTime: 0,
  });

  return {
    currentLiveSesh: data,
    isLoading,
    isSuccess,
    refetch,
  };
};

export default useCurrentLiveSesh;
