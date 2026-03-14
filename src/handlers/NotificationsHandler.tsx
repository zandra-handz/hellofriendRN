import useNotificationsRegistration from "../hooks/useNotificationsRegistration";

type Props = {
  receiveNotifications: boolean | string;
  expoPushToken: string | null | "not ready";
};

const NotificationsHandler = ({ receiveNotifications, expoPushToken }: Props) => {
  useNotificationsRegistration({ receiveNotifications, expoPushToken });
  return null;
};

export default NotificationsHandler;