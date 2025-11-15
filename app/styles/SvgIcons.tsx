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
import AccountArrowLeftOutlineSvg from "./svgs/account-arrow-left-outline";
import AccountPlusSvg from "./svgs/account-plus";
import AccountSwitchOutlineSvg from "./svgs/account-switch-outline";
import ArrowRightSvg from "./svgs/arrow-right";
import BellSvg from "./svgs/bell";
import BugSvg from "./svgs/bug";
import BugOutlineSvg from "./svgs/bug-outline";
import BookmarkSvg from "./svgs/bookmark";
import EyeSvg from "./svgs/eye";
import EyeClosedSvg from "./svgs/eye-closed";
import DeleteSvg from "./svgs/delete";
import HandPointingRightSvg from "./svgs/hand-pointing-right";
import LeafSvg from "./svgs/leaf";
import CalendarClockSvg from "./svgs/calendar-clock";
import CalendarSvg from "./svgs/calendar";
import CameraOutlineSvg from "./svgs/camera-outline";
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
import HeartSvg from './svgs/heart';
import HelpCircleSvg from "./svgs/help-circle";
import ImageMultipleOutlineSvg from "./svgs/image-multiple-outline";
import InformationOutlineSvg from "./svgs/information-outline";
import ImageFilterCenterFocusSvg from "./svgs/image-filter-center-focus";
import LockOutlineSvg from "./svgs/lock-outline";
import LogoutSvg from "./svgs/logout";
import MapMarkerSvg from "./svgs/map-marker";
import MoonWaningCrescentSvg from "./svgs/moon-waning-crescent";
import NoteEditOutlineSvg from "./svgs/note-edit-outline";
import NoteTextSvg from "./svgs/note-text";
import PaletteSvg from "./svgs/palette";
import PenSvg from "./svgs/pen";
import PencilSvg from "./svgs/pencil";
import PencilCircleSvg from "./svgs/pencil-circle";
import PencilOutlineSvg from "./svgs/pencil-outline";
import PieChartSvg from "./svgs/pie-chart"; // IonIcons
import PinSvg from "./svgs/pin";
import PinOutlineSvg from "./svgs/pin-outline";
import PlusSvg from "./svgs/plus";
import PlusCircleSvg from "./svgs/plus-circle";
import RefreshSvg from "./svgs/refresh";
import CalendarOutlineSvg from "./svgs/calendar-outline";
import SendSvg from "./svgs/send";
import SendCircleOutlineSvg from "./svgs/send-circle-outline";
import SettingsSuggestSvg from "./svgs/settings_suggest";
import StarSvg from "./svgs/star";
import TextSearchSvg from "./svgs/text-search";
import TextShadowSvg from "./svgs/text-shadow";
import TimerSvg from "./svgs/timer";
import TimerCogSvg from "./svgs/timer-cog";
import TimerSyncSvg from "./svgs/timer-sync";
import TreeSvg from "./svgs/tree";
import ThemeLightDarkSvg from "./svgs/theme-light-dark";
import UploadOutlineSvg from "./svgs/upload-outline";
import WrenchSvg from "./svgs/wrench";
import VolumeHighSvg from "./svgs/volume-high";
// Import your SVGs here
// Example:
// import LeafSvg from '../assets/icons/leaf.svg';
// import CoffeeSvg from '../assets/icons/coffee.svg';

const svgIcons = {
  account: AccountSvg,
  account_arrow_left_outline: AccountArrowLeftOutlineSvg,
  account_plus: AccountPlusSvg,
  account_switch_outline: AccountSwitchOutlineSvg,
  arrow_right: ArrowRightSvg,
  bookmark: BookmarkSvg,
  bell: BellSvg,
  bug: BugSvg,
  bug_outline: BugOutlineSvg,
  delete: DeleteSvg,
  leaf: LeafSvg, // welcome message
  calendar: CalendarSvg, // hello quick view
  calendar_clock: CalendarClockSvg,
  camera_outline: CameraOutlineSvg,
  cancel: CancelSvg,
  check: CheckSvg,
  close_outline: CloseOutlineSvg,
  compare: CompareSvg,
  comment_search_outline: CommentSearchOutlineSvg, 
  eye: EyeSvg,
  eye_closed: EyeClosedSvg,
  hand_pointing_right: HandPointingRightSvg,
  palette: PaletteSvg,
  pen: PenSvg,
  pencil: PencilSvg, // hello quick view
  pencil_circle: PencilCircleSvg,
  pencil_outline: PencilOutlineSvg,
  pie_chart: PieChartSvg,
  pin: PinSvg,
  pin_outline: PinOutlineSvg, // friend header
  plus: PlusSvg,
  plus_circle: PlusCircleSvg,
  calendar_outline: CalendarOutlineSvg, // friend header
  lock_outlne: LockOutlineSvg,
  logout: LogoutSvg,
  send: SendSvg,
  send_circle_outline: SendCircleOutlineSvg, // location map screen button
  chevron_left: ChevronLeftSvg,
  chevron_down: ChevronDownSvg,
  chevron_up: ChevronUpSvg,
  chevron_double_left: ChevronDoubleLeftSvg,
  chevron_double_right: ChevronDoubleRightSvg,
  heart: HeartSvg,
  help_circle: HelpCircleSvg, // help button
  image_multiple_outline: ImageMultipleOutlineSvg,
  image_filter_center_focus: ImageFilterCenterFocusSvg,
  information_outline: InformationOutlineSvg,
  gesture_swipe_vertical: GestureSwipeVerticalSvg,
  check_circle: CheckCircleSvg,
  moon_waning_crescent: MoonWaningCrescentSvg,
  map_marker: MapMarkerSvg,
  note_edit_outline: NoteEditOutlineSvg, // location notes
  note_text: NoteTextSvg, // location notes
  car: CarSvg,
  car_cog: CarCogSvg,
  refresh: RefreshSvg,
  settings_suggest: SettingsSuggestSvg,
  star: StarSvg,
  theme_light_dark: ThemeLightDarkSvg,
  text_search: TextSearchSvg,
  text_shadow: TextShadowSvg,
  timer: TimerSvg,
  timer_cog: TimerCogSvg,
  timer_sync: TimerSyncSvg,
  tree: TreeSvg,
  upload_outline: UploadOutlineSvg,
  format_font_size_increase: FormatFontSizeIncreaseSvg,
  wrench: WrenchSvg,
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
