import { useQuery } from "@tanstack/react-query";
import useUser from "./useUser";
import { loadAllStaticData } from "@/src/calls/api";

type ScoreRule = {
  id: number;
  code: number;
  label: string;
  points: number;
  version: number;
  created_on: string;
  updated_on: string;
};

type WelcomeScript = {
  id: number;
  label: string;
  body: string;
  [key: string]: any;
};

type GeckoStaticData = {
  welcome_scripts: WelcomeScript[];
  score_rules: ScoreRule[];
};

const useGeckoStaticData = () => {
  const { user, isInitializing } = useUser();

  const {
    data,
    isLoading: loadingGeckoStaticData,
    isSuccess: geckoStaticDataLoaded,
  } = useQuery({
    queryKey: ["userGeckoStaticData", user?.id ?? 0],
    queryFn: (): Promise<GeckoStaticData> => loadAllStaticData(),
    enabled: !!user?.id && !isInitializing,
    retry: 3,
  });

  const welcomeScripts = data?.welcome_scripts;
  const rawScoreRules = data?.score_rules ?? [];

  const scoreRules = {
    all: rawScoreRules,
    codes: (code: number) => rawScoreRules.find((r) => r.code === code),
    labels: (label: string) => rawScoreRules.find((r) => r.label === label),
    points: (code: number) =>
      rawScoreRules.find((r) => r.code === code)?.points,
  };

  return {
    welcomeScripts,
    scoreRules,
    loadingGeckoStaticData,
    geckoStaticDataLoaded,
  };
};

export default useGeckoStaticData;
