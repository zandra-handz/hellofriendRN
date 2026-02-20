import { useRef, useEffect, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFriendPickSession,
  getFriendPickSession,
} from "@/src/calls/api";

type Props = {
  friendId: number;
  friendName: string;
  sessionId?: string | null; // ADD THIS - for polling existing session
  enabled?: boolean;
};

const useFriendPickSession = ({ friendId, friendName, sessionId, enabled = true }: Props) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();

  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: () =>
      createFriendPickSession({
        friend: friendId,
        friend_name: friendName,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(["PickSession", friendId], data);
    },
    onError: (error) => {
      console.error("Error creating pick session:", error);
    },
  });

  // Get current session from cache
  const cachedSession = queryClient.getQueryData<{
    id: string;
    pressed_at: string | null;
    is_expired: boolean;
    expires_on: string;
  }>(["PickSession", friendId]);

  // Use sessionId prop if provided, otherwise use cached session id
  const activeSessionId = sessionId || cachedSession?.id;

// Poll for updates
const pollSession = useQuery({
  queryKey: ["PickSessionPoll", activeSessionId],
  queryFn: async () => {
    console.log("Polling pick session...", activeSessionId);
    const result = await getFriendPickSession(activeSessionId!);
    console.log("Poll result:", result);
    return result;
  },
  enabled: !!activeSessionId && enabled,
  refetchInterval: (query) => {
    const data = query.state.data;
    // Stop polling if pressed or expired
    if (data?.pressed_at || data?.is_expired) {
      return false;
    }
    return 500;
  },
  refetchIntervalInBackground: false,
});

  const session = pollSession.data || cachedSession;

  // Update cache when poll returns new data
  useEffect(() => {
    if (pollSession.data) {
      queryClient.setQueryData(["PickSession", friendId], pollSession.data);
    }
  }, [pollSession.data, friendId, queryClient]);

  // Create session on mount if enabled and no sessionId provided
  useEffect(() => {
    if (enabled && !sessionId && !cachedSession) {
      createSessionMutation.mutate();
    }
  }, [enabled, sessionId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  // Regenerate session (for when it expires)
  const regenerateSession = useCallback(() => {
    queryClient.removeQueries({ queryKey: ["PickSession", friendId] });
    createSessionMutation.mutate();
  }, [friendId, queryClient]);

  return {
    session,
    sessionId: activeSessionId,
    isCreating: createSessionMutation.isPending,
    isPolling: pollSession.isFetching,
    isPressed: !!session?.pressed_at,
    isExpired: session?.is_expired ?? false,
    pressedAt: session?.pressed_at ? new Date(session.pressed_at).getTime() : null,
    qrValue: activeSessionId ? `https://badrainbowz.com/friends/pick/${activeSessionId}/` : null,
    regenerateSession,
    createSessionMutation,
  };
};

export default useFriendPickSession;