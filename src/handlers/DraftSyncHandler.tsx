import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { saveMomentAPI } from "@/src/calls/api";
import useUser from "@/src/hooks/useUser";
import useUpdateUpcomingItemCache from "@/src/hooks/useUpdateUpcomingItemCache";

const DRAFTS_KEY = "momentDrafts";

const DraftSyncHandler = () => {
  const { isOnline } = useNetworkStatus();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { addToUpcomingCapsuleSummary } = useUpdateUpcomingItemCache({ userId: user?.id ?? 0 });

  useEffect(() => {
    if (isOnline !== true || !user?.id) return;

    const syncDrafts = async () => {
      const drafts = queryClient.getQueryData<any[]>([DRAFTS_KEY, user.id]) ?? [];
      if (!drafts.length) return;

      console.log("DraftSyncHandler: syncing", drafts.length, "draft(s)");

      for (const draft of drafts) {
        try {
          const data = await saveMomentAPI(draft.moment);

          const formatted = {
            id: data.id,
            friend: data.friend,
            typedCategory: data.typed_category || "Uncategorized",
            capsule: data.capsule,
            created: data.created_on,
            preAdded: data.pre_added_to_hello,
            user_category: data.user_category || null,
            user_category_name: data.user_category_name || "No category",
            screen_x: data.screen_x,
            screen_y: data.screen_y,
            coord: [data.screen_x, data.screen_x],
            stored_index: null,
            easy_score: data.easy_score,
            hard_score: data.hard_score,
            quick_score: data.quick_score,
            long_score: data.long_score,
            relevant_score: data.relevant_score,
            random_score: data.random_score,
            unique_score: data.unique_score,
            generic_score: data.generic_score,
            isDraft: false,
          };

          queryClient.setQueryData(
            ["Moments", draft.userId, draft.friendId],
            (old: any) => {
              if (!old) return [formatted];
              const found = old.some((m: any) => m.id === draft.draftId);
              console.log("DraftSyncHandler: replacing draft in cache, found:", found);
              return old.map((m: any) => m.id === draft.draftId ? formatted : m);
            }
          );

          addToUpcomingCapsuleSummary({
            friend_id: draft.friendId,
            category_name: formatted.user_category_name,
          });

          const remaining = queryClient.getQueryData<any[]>([DRAFTS_KEY, user.id]) ?? [];
          queryClient.setQueryData(
            [DRAFTS_KEY, user.id],
            remaining.filter((d) => d.draftId !== draft.draftId)
          );

          console.log("DraftSyncHandler: synced", draft.draftId, "→", data.id);
        } catch (error) {
          console.error("DraftSyncHandler: sync failed for", draft.draftId, error);
          break;
        }
      }
    };

    syncDrafts();
  }, [isOnline, user?.id]);

  return null;
};

export default DraftSyncHandler;