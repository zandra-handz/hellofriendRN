import { StyleSheet } from "react-native";
import React from "react";
import SvgIcon from "@/app/styles/SvgIcons";
import OptionListItem from "../headers/OptionListItem";

type Props = {
  sessionData: {
    id: number;
    steps: number;
    distance: number;
    started_on: string;
    ended_on: string;
    friend: number;
    user: number;
  };
  primaryColor?: string;
};

const formatSessionDate = (dateStr: string) => {
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
    ...(isCurrentYear ? {} : { year: "numeric" }),
  }).format(date);
};

const formatDuration = (startedOn: string, endedOn: string) => {
  if (!startedOn || !endedOn) return "";
  const diffMs = new Date(endedOn).getTime() - new Date(startedOn).getTime();
  const minutes = Math.floor(diffMs / 60000);
  const seconds = Math.floor((diffMs % 60000) / 1000);
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
};

const GeckoFriendSessionItem = ({
  sessionData,
  primaryColor = "orange",
}: Props) => {
  const duration = formatDuration(sessionData.started_on, sessionData.ended_on);
  const label = formatSessionDate(sessionData.started_on);
  const sublabel = `${sessionData.steps} steps · ${Math.round(sessionData.distance)} distance · ${duration}`;

  return (
    <OptionListItem
      label={label}
      sublabel={sublabel}
      primaryColor={primaryColor}
      backgroundColor="transparent"
      buttonColor="transparent"
      icon={<SvgIcon name="gecko_mine" color={primaryColor} size={40} />}
    />
  );
};

const styles = StyleSheet.create({});

export default GeckoFriendSessionItem;