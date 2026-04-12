import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getLiveSeshInvites } from "@/src/calls/api";

type Props = {
  userId: number;
  enabled?: boolean;
};

const useLiveSeshInvites = ({ userId, enabled = true }: Props) => {
  const { data, isLoading, isSuccess, refetch } = useQuery({
    queryKey: ["liveSeshInvites", userId],
    queryFn: () => getLiveSeshInvites(),
    enabled: !!userId && enabled,
    staleTime: 0,
  });

  const sent = useMemo(() => data?.sent ?? [], [data?.sent]);
  const pending = useMemo(() => data?.pending ?? [], [data?.pending]);

  return {
    data,
    sent,
    pending,
    isLoading,
    isSuccess,
    refetch,
  };
};

export default useLiveSeshInvites;
