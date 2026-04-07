import React from "react";
import SvgIcon from "@/app/styles/SvgIcons";
import OptionListItem from "../headers/OptionListItem";

type Props = {
  logData: {
    id: number;
    energy: number;
    surplus_energy: number;
    steps: number;
    friend: number | null;
    recorded_at: string;
  };
  friendNameMap: Record<number, string>;
  primaryColor?: string;
};

const formatExactTime = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const isCurrentYear = date.getFullYear() === now.getFullYear();

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    ...(isCurrentYear ? {} : { year: "numeric" }),
  }).format(date);
};

const GeckoEnergyLogItem = ({
  logData,
  friendNameMap,
  primaryColor = "orange",
}: Props) => {
  const label = formatExactTime(logData.recorded_at);
  const friendName = logData.friend
    ? friendNameMap[logData.friend] ?? "Unknown"
    : null;

  const sublabel = [
    `Energy: ${logData.energy}`,
    logData.surplus_energy ? `Surplus: ${logData.surplus_energy}` : null,
    `Steps: ${logData.steps}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <OptionListItem
      label={friendName ? `${friendName} · ${label}` : label}
      sublabel={sublabel}
      primaryColor={primaryColor}
      backgroundColor="transparent"
      buttonColor="transparent"
      icon={<SvgIcon name="sprout_outline" color={primaryColor} size={40} />}
    />
  );
};

export default GeckoEnergyLogItem;
