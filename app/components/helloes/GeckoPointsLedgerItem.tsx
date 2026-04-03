import { StyleSheet } from "react-native";
import React from "react";
import SvgIcon from "@/app/styles/SvgIcons";
import OptionListItem from "../headers/OptionListItem";

type Props = {
  ledgerData: {
    id: number;
    amount: number;
    created_on: string;
    reason?: string | null;
  };
  primaryColor?: string;
};

const formatLedgerDate = (dateStr: string) => {
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

const GeckoPointsLedgerItem = ({
  ledgerData,
  primaryColor = "orange",
}: Props) => {
  const label = formatLedgerDate(ledgerData.created_on);
  const pointsLabel = ledgerData.amount > 0 ? `+${ledgerData.amount}` : `${ledgerData.amount}`;
  const sublabel = ledgerData.reason
    ? `${pointsLabel} pts · ${ledgerData.reason}`
    : `${pointsLabel} pts`;

  return (
    <OptionListItem
      label={label}
      sublabel={sublabel}
      primaryColor={primaryColor}
      backgroundColor="transparent"
      buttonColor="transparent"
      icon={<SvgIcon name="sprout_outline" color={primaryColor} size={40} />}
    />
  );
};

const styles = StyleSheet.create({});

export default GeckoPointsLedgerItem;
