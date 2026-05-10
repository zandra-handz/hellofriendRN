import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGeckoStepsLast24Hrs } from "../../calls/api";
import useUser from "../useUser";

const useGeckoStepsLast24Hrs = () => {
  const { user } = useUser();

  const query = useQuery({
    queryKey: ["geckoStepsLast24Hrs", user?.id],
    queryFn: async () => {
      const data = await fetchGeckoStepsLast24Hrs();
      console.log("[geckoStepsLast24Hrs - network fetch]", data);
      return data;
    },
    enabled: !!user?.id,
    staleTime: 0,
  });

  useEffect(() => {
    if (query.dataUpdatedAt) {
      console.log(
        "[geckoStepsLast24Hrs - dataUpdatedAt]",
        new Date(query.dataUpdatedAt).toISOString(),
        query.data,
      );
    }
  }, [query.dataUpdatedAt]);

  return query;
};

export default useGeckoStepsLast24Hrs;
