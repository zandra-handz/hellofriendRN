import { useState } from "react";
import { geckoReadMoments } from "@/src/calls/api";

const useGeckoReadMoments = ({ friendId }: { friendId: number }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGeckoMoments = async (ids: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const data = await geckoReadMoments(friendId, ids);
      return data;
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchGeckoMoments, loading, error };
};

export default useGeckoReadMoments;