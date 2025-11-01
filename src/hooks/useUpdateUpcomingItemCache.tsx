import { useQueryClient } from "@tanstack/react-query";

type AddToUpcomingCapsuleSummaryArgs = {
  friend_id: number;
  category_name: string;
};

const useUpdateUpcomingItemCache = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();

  const addToUpcomingCapsuleSummary = ({
    friend_id,
    category_name,
  }: AddToUpcomingCapsuleSummaryArgs) => {
    queryClient.setQueryData(["friendListAndUpcoming", userId], (oldData: any) => {
      if (!oldData) return oldData;

      // Find the capsule summary for this friend
      const updatedCapsuleSummaries = oldData.capsule_summaries.map((cs: any) => {
        if (cs.id !== friend_id) return cs;

        // Copy capsule summary safely
        const newCapsuleSummary = Array.isArray(cs.capsule_summary)
          ? [...cs.capsule_summary]
          : [];

        // Find or create the category entry
        const existingCategory = newCapsuleSummary.find(
          (c) => c.user_category_name === category_name
        );

        if (existingCategory) {
          existingCategory.count += 1;
        } else {
          newCapsuleSummary.push({
            user_category_name: category_name,
            count: 1,
          });
        }

        // Recalculate total capsule count
        const newCapsuleCount = newCapsuleSummary.reduce(
          (sum, cat) => sum + (cat.count || 0),
          0
        );

        return {
          ...cs,
          capsule_summary: newCapsuleSummary,
          capsule_count: newCapsuleCount,
        };
      });

      return {
        ...oldData,
        capsule_summaries: updatedCapsuleSummaries,
      };
    });
  };


  const removeFromUpcomingCapsuleSummary = ({
    friend_id,
    category_name,
  }: UpdateUpcomingCapsuleSummaryArgs) => {

    console.log('REMOVING FROM CACHE')
    queryClient.setQueryData(["friendListAndUpcoming", userId], (oldData: any) => {
      if (!oldData) return oldData;

      const updatedCapsuleSummaries = oldData.capsule_summaries.map((cs: any) => {
        if (cs.id !== friend_id) return cs;

        const newCapsuleSummary = Array.isArray(cs.capsule_summary)
          ? [...cs.capsule_summary]
          : [];

        const existingCategoryIndex = newCapsuleSummary.findIndex(
          (c) => c.user_category_name === category_name
        );

        if (existingCategoryIndex >= 0) {
          newCapsuleSummary[existingCategoryIndex].count -= 1;

          // Remove category if count is 0
          if (newCapsuleSummary[existingCategoryIndex].count <= 0) {
            newCapsuleSummary.splice(existingCategoryIndex, 1);
          }
        }

        const newCapsuleCount = newCapsuleSummary.reduce(
          (sum, cat) => sum + (cat.count || 0),
          0
        );

        return {
          ...cs,
          capsule_summary: newCapsuleSummary,
          capsule_count: newCapsuleCount,
        };
      });

      return {
        ...oldData,
        capsule_summaries: updatedCapsuleSummaries,
      };
    });
  };

  return { addToUpcomingCapsuleSummary, removeFromUpcomingCapsuleSummary };
};
export default useUpdateUpcomingItemCache;
