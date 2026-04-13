import React from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from "react-native";
import { useLDTheme } from "@/src/context/LDThemeContext";
import useUser from "@/src/hooks/useUser";
import useLiveSeshInvites from "@/src/hooks/LiveSeshCalls/useLiveSeshInvites";
import useAcceptLiveSeshInvite from "@/src/hooks/LiveSeshCalls/useAcceptLiveSeshInvite";
import useCurrentLiveSesh from "@/src/hooks/LiveSeshCalls/useCurrentLiveSesh";
import SvgIcon from "@/app/styles/SvgIcons";
import useAppNavigations from "@/src/hooks/useAppNavigations";

type Invite = {
  id: number;
  sender: number;
  recipient: number;
  sender_username: string;
  recipient_username: string;
  created_on: string;
  updated_on: string;
  accepted_on: string | null;
};

const LiveSeshInvitesPanel: React.FC = () => {
  const { user } = useUser();
  const userId = user?.id;
  const { lightDarkTheme } = useLDTheme();
  const { navigateToSecretGecko} = useAppNavigations();

  const { data, pending, sent, isLoading } = useLiveSeshInvites({
    userId: userId ?? 0,
    enabled: !!userId,
  });

  const { handleAcceptInvite, acceptMutation } = useAcceptLiveSeshInvite({
    userId: userId ?? 0,
  });

  const { currentLiveSesh } = useCurrentLiveSesh({
    userId: userId ?? 0,
    enabled: !!userId,
  });

  const sessionIsActive = !!(
    currentLiveSesh?.expires_at &&
    new Date(currentLiveSesh.expires_at).getTime() > Date.now()
  );

  console.log("[LiveSeshInvitesPanel]", { userId, isLoading, data, pending, sent });

  const confirmAccept = (invite: Invite) => {
    Alert.alert(
      "Accept invite?",
      `Accept live sesh invite from ${invite.sender_username}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Accept",
          style: "default",
          onPress: () => handleAcceptInvite(invite.id),
        },
      ],
      { cancelable: true },
    );
  };

  if (!userId) return null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: lightDarkTheme.cardBackground ?? "#1c1c1c",
          borderColor: lightDarkTheme.lighterOverlayBackground ?? "#2a2a2a",
        },
      ]}
    >
      <View style={styles.header}>
        <SvgIcon name="account_plus" size={16} color={lightDarkTheme.primaryText} />
        <Text style={[styles.headerText, { color: lightDarkTheme.primaryText }]}>
          Live Sesh Invites
        </Text>
        {sessionIsActive && !currentLiveSesh?.is_host && (
          <Pressable
            onPress={navigateToSecretGecko}
            style={styles.joinChevron}
            hitSlop={8}
          >
            <SvgIcon name="chevron_right" size={18} color="#000000" />
          </Pressable>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator size="small" color={lightDarkTheme.primaryText} />
      ) : (
        pending.map((invite: Invite) => (
          <View key={invite.id} style={styles.row}>
            <Text
              style={[styles.rowText, { color: lightDarkTheme.primaryText }]}
              numberOfLines={1}
            >
              {invite.sender_username}
            </Text>
            <Pressable
              onPress={() => confirmAccept(invite)}
              disabled={acceptMutation.isPending}
              style={[
                styles.acceptBtn,
                acceptMutation.isPending && { opacity: 0.5 },
              ]}
            >
              <Text style={styles.acceptText}>Accept</Text>
            </Pressable>
          </View>
        ))
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    //height: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  joinChevron: {
    marginLeft: "auto",
    backgroundColor: "#7FE629",
    borderRadius: 50,
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 13,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingVertical: 6,
  },
  rowText: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
  },
  acceptBtn: {
    backgroundColor: "#7FE629",
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  acceptText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 12,
    color: "#000000",
  },
  activeSessionBtn: {
    marginTop: 8,
    backgroundColor: "#7FE629",
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  activeSessionText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 13,
    color: "#000000",
  },
});

export default LiveSeshInvitesPanel;
