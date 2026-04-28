
  import React, { useRef } from "react";
  import { useMutation, useQueryClient } from "@tanstack/react-query";

  import { updateGeckoGameWinPin } from "@/src/calls/api";

  type PinPayload = {
    winId: number;
    pinned: boolean;
  };

  const useUpdateGeckoGameWinPin = () => {
    const queryClient = useQueryClient();
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const updateGeckoGameWinPinMutation = useMutation({
      mutationFn: (data: PinPayload) =>
        updateGeckoGameWinPin(data.winId, data.pinned),
      onSuccess: (data) => {
        queryClient.setQueriesData(
          { queryKey: ["geckoGameWins"] },
          (oldData: any) => {
            if (!oldData) return oldData;

            // paginated shape: { pages: [{ results: [...] }, ...] }
            if (oldData.pages) {
              return {
                ...oldData,
                pages: oldData.pages.map((page: any) => ({
                  ...page,
                  results: page.results?.map((win: any) =>
                    win.id === data.id ? { ...win, ...data } : win,
                  ),
                })),
              };
            }

            // single-page shape: { results: [...] }
            if (oldData.results) {
              return {
                ...oldData,
                results: oldData.results.map((win: any) =>
                  win.id === data.id ? { ...win, ...data } : win,
                ),
              };
            }

            // plain array
            if (Array.isArray(oldData)) {
              return oldData.map((win: any) =>
                win.id === data.id ? { ...win, ...data } : win,
              );
            }

            return oldData;
          },
        );

        queryClient.invalidateQueries({ queryKey: ["geckoGameWins"] });

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          updateGeckoGameWinPinMutation.reset();
        }, 1000);
      },

      onError: (error) => {
        console.error("Update gecko game win pin error:", error);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          updateGeckoGameWinPinMutation.reset();
        }, 1000);
      },
    });

    const updateGeckoWinPin = async (data: PinPayload) => {
      try {
        await updateGeckoGameWinPinMutation.mutateAsync(data);
      } catch (error) {
        console.error("Error updating gecko game win pin:", error);
      }
    };

    return { updateGeckoWinPin, updateGeckoGameWinPinMutation };
  };

  export default useUpdateGeckoGameWinPin;