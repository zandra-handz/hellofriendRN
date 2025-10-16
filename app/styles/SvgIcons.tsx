// SvgIcon.js
import React from "react";
import {
  DimensionValue,
  StyleProp,
  ViewStyle,
  View,
  OpaqueColorValue,
} from "react-native";

import AccountSvg from "./svgs/account";
import AccountPlusSvg from "./svgs/account-plus";
import AccountSwitchOutlineSvg from "./svgs/account-switch-outline";
import ArrowRightSvg from "./svgs/arrow-right";
import BellSvg from "./svgs/bell";

import BookmarkSvg from "./svgs/bookmark";
import EyeSvg from "./svgs/eye";
import EyeClosedSvg from "./svgs/eye-closed";
import DeleteSvg from "./svgs/delete";
import LeafSvg from "./svgs/leaf";
import CalendarClockSvg from "./svgs/calendar-clock";
import CalendarSvg from "./svgs/calendar";
import CancelSvg from "./svgs/cancel";
import CarSvg from "./svgs/car";
import CarCogSvg from "./svgs/car-cog";
import CheckSvg from "./svgs/check";
import CheckCircleSvg from "./svgs/check-circle";
import ChevronLeftSvg from "./svgs/chevron-left";
import ChevronDownSvg from "./svgs/chevron-down";
import ChevronUpSvg from "./svgs/chevron-up";
import ChevronDoubleRightSvg from "./svgs/chevron-double-right";
import ChevronDoubleLeftSvg from "./svgs/chevron-double-left";
import CloseOutlineSvg from "./svgs/close-outline"; //IonIcons
import CommentSearchOutlineSvg from "./svgs/comment-search-outline";
import CompareSvg from "./svgs/compare";
import FormatFontSizeIncreaseSvg from "./svgs/format-font-size-increase";
import GestureSwipeVerticalSvg from "./svgs/gesture-swipe-vertical";
import HelpCircleSvg from "./svgs/help-circle";
import ImageFilterCenterFocusSvg from "./svgs/image-filter-center-focus";
import LockOutlineSvg from "./svgs/lock-outline";
import MapMarkerSvg from "./svgs/map-marker";
import NoteEditOutlineSvg from "./svgs/note-edit-outline";
import NoteTextSvg from "./svgs/note-text";
import PencilSvg from "./svgs/pencil";
import PieChartSvg from "./svgs/pie-chart" // IonIcons
import PinOutlineSvg from "./svgs/pin-outline";
import PlusSvg from "./svgs/plus";
import PlusCircleSvg from "./svgs/plus-circle";
import CalendarOutlineSvg from "./svgs/calendar-outline";
import SendSvg from "./svgs/send";
import SendCircleOutlineSvg from "./svgs/send-circle-outline";
import StarSvg from "./svgs/star";
import TextShadowSvg from "./svgs/text-shadow";
import ThemeLightDarkSvg from "./svgs/theme-light-dark";
import VolumeHighSvg from "./svgs/volume-high";
// Import your SVGs here
// Example:
// import LeafSvg from '../assets/icons/leaf.svg';
// import CoffeeSvg from '../assets/icons/coffee.svg';

const svgIcons = {
  account: AccountSvg,
  account_plus: AccountPlusSvg,
  account_switch_outline: AccountSwitchOutlineSvg,
  arrow_right: ArrowRightSvg,
  bookmark: BookmarkSvg,
  bell: BellSvg,
  delete: DeleteSvg,
  leaf: LeafSvg, // welcome message
  calendar: CalendarSvg, // hello quick view
  calendar_clock: CalendarClockSvg,
  cancel: CancelSvg,
  check: CheckSvg,
  close_outline: CloseOutlineSvg,
  compare: CompareSvg,
  comment_search_outline: CommentSearchOutlineSvg,
  eye: EyeSvg,
  eye_closed: EyeClosedSvg,
  pencil: PencilSvg, // hello quick view
  pie_chart: PieChartSvg,
  pin_outline: PinOutlineSvg, // friend header
  plus: PlusSvg,
  plus_circle: PlusCircleSvg,
  calendar_outline: CalendarOutlineSvg, // friend header
  lock_outlne: LockOutlineSvg,
  send: SendSvg,
  send_circle_outline: SendCircleOutlineSvg, // location map screen button
  chevron_left: ChevronLeftSvg,
  chevron_down: ChevronDownSvg,
  chevron_up: ChevronUpSvg,
  chevron_double_left: ChevronDoubleLeftSvg,
  chevron_double_right: ChevronDoubleRightSvg,
  help_circle: HelpCircleSvg, // help button
  image_filter_center_focus: ImageFilterCenterFocusSvg,
  gesture_swipe_vertical: GestureSwipeVerticalSvg,
  check_circle: CheckCircleSvg,
  map_marker: MapMarkerSvg,
  note_edit_outline: NoteEditOutlineSvg, // location notes
  note_text: NoteTextSvg, // location notes
  car: CarSvg,
  car_cog: CarCogSvg,
  star: StarSvg,
  theme_light_dark: ThemeLightDarkSvg,
  text_shadow: TextShadowSvg,
  format_font_size_increase: FormatFontSizeIncreaseSvg,
  volume_high: VolumeHighSvg,
};

type Props = {
  name: string;
  size: DimensionValue;
  color?: OpaqueColorValue | string;
  style?: StyleProp<ViewStyle>;
};

export default function SvgIcon({
  name,
  size = 24,
  color = "red",

  style,
}: Props) {
  const Icon = svgIcons[name];

  if (!Icon) {
    console.warn(`Unknown SVG icon: "${name}"`);
    return <View style={{ width: size, height: size }} />;
  }

  return <Icon width={size} height={size} fill={color} style={style} />;
}
