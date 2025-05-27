import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type AuthScreenParams = {
  createNewAccount?: boolean;
};

export type WelcomeToAuthScreenParams = {
  Auth: { createNewAccount?: boolean };
};

export type AuthScreenNavigationProp = NativeStackNavigationProp<
  WelcomeToAuthScreenParams,
  "Auth"
>;
