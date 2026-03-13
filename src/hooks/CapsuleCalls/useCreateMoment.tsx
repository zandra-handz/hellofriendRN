// // import { View, Text } from "react-native";
// // import React, { useRef } from "react";
// // import { useMutation, useQueryClient } from "@tanstack/react-query";
// // import { saveMomentAPI } from "@/src/calls/api";

// // import useUpdateUpcomingItemCache from "../useUpdateUpcomingItemCache";

// // type Props = {
// //   userId: number;
// //   friendId: number;
// // };

// // const useCreateMoment = ({ userId, friendId }: Props) => {
// //   const timeoutRef = useRef(null);

// //   const queryClient = useQueryClient();

// //   const { addToUpcomingCapsuleSummary} = useUpdateUpcomingItemCache({userId: userId})

// //   const handleCreateMoment = async (momentData) => {

// //     const moment = {
// //        user: userId,

// //       friend: momentData.friend,
// //       capsule: momentData.moment,
// //       user_category: momentData.selectedUserCategory,
// //       screen_x: .5,
// //       screen_y: .5,
// //     };

// //     try {
// //       await createMomentMutation.mutateAsync(moment);
// //     } catch (error) {
// //       console.error("Error saving moment:", error);
// //     }
// //   };

// //   const createMomentMutation = useMutation({
// //     mutationFn: (data) => saveMomentAPI(data),
// //     onError: (error) => {
// //       if (timeoutRef.current) {
// //         clearTimeout(timeoutRef.current);
// //       }
// //       timeoutRef.current = setTimeout(() => {
// //         createMomentMutation.reset();
// //       }, 500);
// //     },
// //     onSuccess: (data) => {
// //   const formattedMoment = {
// //     id: data.id,
// //     typedCategory: data.typed_category || "Uncategorized",
// //     capsule: data.capsule,
// //     created: data.created_on,
// //     preAdded: data.pre_added_to_hello,
// //     user_category: data.user_category || null,
// //     user_category_name: data.user_category_name || null,
// //     screen_x: data.screen_x,
// //     screen_y: data.screen_y,
// //     stored_index: null,
// //     easy_score: data.easy_score,
// //     hard_score: data.hard_score,
// //     quick_score: data.quick_score,
// //     long_score: data.long_score,
// //     relevant_score: data.relevant_score,
// //     random_score: data.random_score,
// //     unique_score: data.unique_score,
// //     generic_score: data.generic_score,
// //   };

// //       queryClient.setQueryData(
// //         ["Moments", userId, friendId],
// //         (old) => (old ? [formattedMoment, ...old] : [formattedMoment])
// //       );

// //       addToUpcomingCapsuleSummary({friend_id: friendId, category_name: formattedMoment.user_category_name  })
// //       if (timeoutRef.current) {
// //         clearTimeout(timeoutRef.current);
// //       }
// //       timeoutRef.current = setTimeout(() => {
// //         createMomentMutation.reset();
// //       }, 500);
// //     },
// //   });

// //   return {
// //     handleCreateMoment,
// //     createMomentMutation,
// //   };
// // };

// // export default useCreateMoment;

// import { useRef, useEffect } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { saveMomentAPI } from "@/src/calls/api";
// import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
// import useUpdateUpcomingItemCache from "../useUpdateUpcomingItemCache";

// type Props = {
//   userId: number;
//   friendId: number;
// };

// const DRAFTS_KEY = "momentDrafts";

// type MomentDraft = {
//   draftId: string;
//   userId: number;
//   friendId: number;
//   moment: {
//     user: number;
//     friend: number;
//     capsule: string;
//     user_category: number | null;
//     screen_x: number;
//     screen_y: number;
//   };
//   createdAt: number;
// };

// const useCreateMoment = ({ userId, friendId }: Props) => {
//   const timeoutRef = useRef(null);
//   const queryClient = useQueryClient();
//   const { isOnline } = useNetworkStatus();
//   const { addToUpcomingCapsuleSummary } = useUpdateUpcomingItemCache({ userId });

// const formatMoment = (data: any) => ({
//     id: data.id,
//     friend: data.friend,
//     typedCategory: data.typed_category || "Uncategorized",
//     capsule: data.capsule,
//     created: data.created_on,
//     preAdded: data.pre_added_to_hello,
//     user_category: data.user_category || null,
//     user_category_name: data.user_category_name || "No category",
//     screen_x: data.screen_x,
//     screen_y: data.screen_y,
//     coord: [data.screen_x, data.screen_x], // matches backend mapping (x, x) not (x, y)
//     stored_index: null,
//     easy_score: data.easy_score,
//     hard_score: data.hard_score,
//     quick_score: data.quick_score,
//     long_score: data.long_score,
//     relevant_score: data.relevant_score,
//     random_score: data.random_score,
//     unique_score: data.unique_score,
//     generic_score: data.generic_score,
//     isDraft: false,
//   });

//   const saveDraft = (momentData) => {
//     const draftId = `draft_${Date.now()}`;

//     const draft: MomentDraft = {
//       draftId,
//       userId,
//       friendId,
//       moment: {
//         user: userId,
//         friend: momentData.friend,
//         capsule: momentData.moment,
//         user_category: momentData.selectedUserCategory,
//         screen_x: 0.5,
//         screen_y: 0.5,
//       },
//       createdAt: Date.now(),
//     };

//     // save to drafts queue for persistence + sync
//     const existing = queryClient.getQueryData<MomentDraft[]>([DRAFTS_KEY, userId]) ?? [];
//     queryClient.setQueryData([DRAFTS_KEY, userId], [...existing, draft]);

//     // also add to Moments cache immediately with isDraft: true
// const draftMoment = {
//   id: draftId,
//   user: userId,
//   friend: momentData.friend,
//   typedCategory: momentData.selectedUserCategoryName || "Uncategorized",
//   capsule: momentData.moment,
//   created: new Date().toISOString(),
//   preAdded: false,
//   user_category: momentData.selectedUserCategory || null,
//   user_category_name: momentData.selectedUserCategoryName || "No category",
//   screen_x: 0.5,
//   screen_y: 0.5,
//   coord: [0.5, 0.5],
//   stored_index: null,
//   easy_score: null,
//   hard_score: null,
//   quick_score: null,
//   long_score: null,
//   relevant_score: null,
//   random_score: null,
//   unique_score: null,
//   generic_score: null,
//   isDraft: true,
// };

//     queryClient.setQueryData(
//       ["Moments", userId, friendId],
//       (old: any) => (old ? [draftMoment, ...old] : [draftMoment])
//     );

//     console.log("Draft saved and shown optimistically:", draftId);
//   };

//   const syncDrafts = async () => {
//     const drafts = queryClient.getQueryData<MomentDraft[]>([DRAFTS_KEY, userId]) ?? [];
//     if (!drafts.length) return;
//       console.log('DRAFTS TO SYNC:', JSON.stringify(drafts, null, 2));

//     console.log(`Syncing ${drafts.length} draft(s)...`);

//     for (const draft of drafts) {
//       try {
//         const data = await saveMomentAPI(draft.moment);
//         const formattedMoment = formatMoment(data);

//         // replace draft entry with real server data
//         queryClient.setQueryData(
//           ["Moments", draft.userId, draft.friendId],
//           (old: any) => {
//             if (!old) return [formattedMoment];
//             return old.map((m: any) =>
//               m.id === draft.draftId ? formattedMoment : m
//             );
//           }
//         );

//         addToUpcomingCapsuleSummary({
//           friend_id: draft.friendId,
//           category_name: formattedMoment.user_category_name,
//         });

//         // remove from drafts queue
//         const remaining = queryClient.getQueryData<MomentDraft[]>([DRAFTS_KEY, userId]) ?? [];
//         queryClient.setQueryData(
//           [DRAFTS_KEY, userId],
//           remaining.filter((d) => d.draftId !== draft.draftId)
//         );

//         console.log("Draft synced:", draft.draftId, "→ real id:", data.id);
//       } catch (error) {
//         console.error("Draft sync failed for:", draft.draftId, error);
//         break;
//       }
//     }
//   };

//   useEffect(() => {
//     if (isOnline) {
//       syncDrafts();
//     }
//   }, [isOnline]);

//   const handleCreateMoment = async (momentData) => {
//     if (!isOnline) {
//       saveDraft(momentData);
//       return;
//     }

//     const moment = {
//       user: userId,
//       friend: momentData.friend,
//       capsule: momentData.moment,
//       user_category: momentData.selectedUserCategory,
//       screen_x: 0.5,
//       screen_y: 0.5,
//     };

//     try {
//       await createMomentMutation.mutateAsync(moment);
//     } catch (error) {
//       console.error("Error saving moment:", error);
//     }
//   };

//   const createMomentMutation = useMutation({
//     mutationFn: (data) => saveMomentAPI(data),
//     onError: () => {
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);
//       timeoutRef.current = setTimeout(() => createMomentMutation.reset(), 500);
//     },
//     onSuccess: (data) => {
//       const formattedMoment = formatMoment(data);

//       queryClient.setQueryData(
//         ["Moments", userId, friendId],
//         (old: any) => (old ? [formattedMoment, ...old] : [formattedMoment])
//       );
//       addToUpcomingCapsuleSummary({
//         friend_id: friendId,
//         category_name: formattedMoment.user_category_name,
//       });

//       if (timeoutRef.current) clearTimeout(timeoutRef.current);
//       timeoutRef.current = setTimeout(() => createMomentMutation.reset(), 500);
//     },
//   });

//   const pendingDrafts = queryClient.getQueryData<MomentDraft[]>([DRAFTS_KEY, userId]) ?? [];

//   return {
//     handleCreateMoment,
//     createMomentMutation,
//     pendingDrafts,
//     hasPendingDrafts: pendingDrafts.length > 0,
//   };
// };

// export default useCreateMoment;

import { useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveMomentAPI } from "@/src/calls/api";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import useUpdateUpcomingItemCache from "../useUpdateUpcomingItemCache";

type Props = {
  userId: number;
  friendId: number;
};

const DRAFTS_KEY = "momentDrafts";

type MomentDraft = {
  draftId: string;
  userId: number;
  friendId: number;
  moment: {
    user: number;
    friend: number;
    capsule: string;
    user_category: number | null;
    screen_x: number;
    screen_y: number;
  };
  createdAt: number;
};

const useCreateMoment = ({ userId, friendId }: Props) => {
  const timeoutRef = useRef(null);
  const queryClient = useQueryClient();
  const { isOnline } = useNetworkStatus();
  const { addToUpcomingCapsuleSummary } = useUpdateUpcomingItemCache({
    userId,
  });

  const formatMoment = (data: any) => ({
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
  });

  const saveDraft = (momentData) => {
    const draftId = `draft_${Date.now()}`;

    const draft: MomentDraft = {
      draftId,
      userId,
      friendId,
      moment: {
        user: userId,
        friend: momentData.friend,
        capsule: momentData.moment,
        user_category: momentData.selectedUserCategory,

        screen_x: 0.5,
        screen_y: 0.5,
      },
      createdAt: Date.now(),
    };

    const existing =
      queryClient.getQueryData<MomentDraft[]>([DRAFTS_KEY, userId]) ?? [];
    queryClient.setQueryData([DRAFTS_KEY, userId], [...existing, draft]);

    const draftMoment = {
      id: draftId,
      user: userId,
      friend: momentData.friend,
      typedCategory: momentData.selectedUserCategoryName || "Uncategorized",
      capsule: momentData.moment,
      created: new Date().toISOString(),
      preAdded: false,
      user_category: momentData.selectedUserCategory || null,
      user_category_name: `UNSAVED · ${momentData.selectedUserCategoryName || "No category"}`,
      screen_x: 0.5,
      screen_y: 0.5,
      coord: [0.5, 0.5],
      stored_index: null,
      easy_score: null,
      hard_score: null,
      quick_score: null,
      long_score: null,
      relevant_score: null,
      random_score: null,
      unique_score: null,
      generic_score: null,
      isDraft: true,
    };

    queryClient.setQueryData(["Moments", userId, friendId], (old: any) =>
      old ? [draftMoment, ...old] : [draftMoment],
    );

    console.log("Draft saved and shown optimistically:", draftId);
  };

  // const syncDrafts = async () => {
  //   const drafts =
  //     queryClient.getQueryData<MomentDraft[]>([DRAFTS_KEY, userId]) ?? [];
  //   if (!drafts.length) return;

  //   console.log("DRAFTS TO SYNC:", JSON.stringify(drafts, null, 2));
  //   console.log(`Syncing ${drafts.length} draft(s)...`);

  //   for (const draft of drafts) {
  //     try {
  //       const data = await saveMomentAPI(draft.moment);
  //       const formattedMoment = formatMoment(data);

  //       queryClient.setQueryData(
  //         ["Moments", draft.userId, draft.friendId],
  //         (old: any) => {
  //           if (!old) return [formattedMoment];
  //           const replaced = old.map((m: any) =>
  //             m.id === draft.draftId ? formattedMoment : m,
  //           );
  //           console.log(
  //             "SYNC REPLACE: found draft?",
  //             old.some((m: any) => m.id === draft.draftId),
  //           );
  //           console.log(
  //             "SYNC REPLACE: before count",
  //             old.length,
  //             "after count",
  //             replaced.length,
  //           );
  //           return replaced;
  //         },
  //       );

  //       addToUpcomingCapsuleSummary({
  //         friend_id: draft.friendId,
  //         category_name: formattedMoment.user_category_name,
  //       });

  //       const remaining =
  //         queryClient.getQueryData<MomentDraft[]>([DRAFTS_KEY, userId]) ?? [];
  //       queryClient.setQueryData(
  //         [DRAFTS_KEY, userId],
  //         remaining.filter((d) => d.draftId !== draft.draftId),
  //       );

  //       console.log("Draft synced:", draft.draftId, "→ real id:", data.id);
  //     } catch (error) {
  //       console.error("Draft sync failed for:", draft.draftId, error);
  //       break;
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (isOnline === true) {
  //     syncDrafts();
  //   }
  // }, [isOnline]);

  const handleCreateMoment = async (momentData) => {
    if (isOnline === false) {
      saveDraft(momentData);
      return;
    }

    const moment = {
      user: userId,
      friend: momentData.friend,
      capsule: momentData.moment,
      user_category: momentData.selectedUserCategory,
      screen_x: 0.5,
      screen_y: 0.5,
    };

    try {
      await createMomentMutation.mutateAsync(moment);
    } catch (error) {
      console.error("Error saving moment:", error);
    }
  };

  const createMomentMutation = useMutation({
    mutationFn: (data) => saveMomentAPI(data),
    onError: () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => createMomentMutation.reset(), 500);
    },
    onSuccess: (data) => {
      const formattedMoment = formatMoment(data);

      queryClient.setQueryData(["Moments", userId, friendId], (old: any) =>
        old ? [formattedMoment, ...old] : [formattedMoment],
      );
      addToUpcomingCapsuleSummary({
        friend_id: friendId,
        category_name: formattedMoment.user_category_name,
      });

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => createMomentMutation.reset(), 500);
    },
  });

  const pendingDrafts =
    queryClient.getQueryData<MomentDraft[]>([DRAFTS_KEY, userId]) ?? [];

  return {
    handleCreateMoment,
    createMomentMutation,
    pendingDrafts,
    hasPendingDrafts: pendingDrafts.length > 0,
  };
};

export default useCreateMoment;
