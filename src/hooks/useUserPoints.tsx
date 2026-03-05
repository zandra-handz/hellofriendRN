import { useQueryClient, useMutation } from "@tanstack/react-query";
import { addPoints } from "@/src/calls/api";
import useUser from "./useUser";

const useUserPoints = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const totalPoints: number =
    queryClient.getQueryData(["userPoints"]) ??
    user?.profile?.total_points ??
    0;

  const addPointsMutation = useMutation({
    mutationFn: ({ amount, reason }: { amount: number; reason: string }) =>
      addPoints(amount, reason),
    onSuccess: (data) => {
      queryClient.setQueryData(["userPoints"], data.total_points);
    },
  });

  return {
    totalPoints,
    addPoints: addPointsMutation.mutate,
    isPending: addPointsMutation.isPending,
  };
};

export default useUserPoints;