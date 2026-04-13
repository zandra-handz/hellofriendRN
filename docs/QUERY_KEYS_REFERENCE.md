# Query Keys Reference

## GECKO DOMAIN

### `["userGeckoScoreState", userId]` — current energy + revival time
- **Defined:** `src/hooks/useGeckoScoreState.tsx`
- **Refetched/Invalidated:**
  - `src/hooks/useDevDepleteEnergy.tsx:15` — refetch after depletion
  - `src/hooks/useDevResetEnergy.tsx:15` — refetch after reset
  - `src/hooks/useUpdateGeckoData.tsx:42` — refetch after game save
  - `src/hooks/useGeckoSynthesizer.tsx:340` — invalidate on streak expiry
  - `src/hooks/useGeckoSynthesizer_WS.tsx:105` — invalidate on streak expiry (WS)

### `["userGeckoConfigs", userId]` — active hours + gecko settings
- **Defined:** `src/hooks/GeckoCalls/useUserGeckoConfigs.tsx:6`
- **Refetched/Invalidated:**
  - `src/hooks/useDateChangeRefresh.tsx:54` — hourly refetch
  - `src/hooks/GeckoCalls/useUpdateGeckoConfigs.tsx:20` — setQueryData on update

### `["userGeckoSessions", userId]` — infinite paginated sessions
- **Defined:** `src/hooks/GeckoCalls/useUserGeckoSessions.tsx:28`
- **Refetched:** `src/hooks/useUpdateGeckoData.tsx:40`

### `["friendGeckoSessions", userId, friendId]` — infinite paginated sessions for friend
- **Defined:** `src/hooks/GeckoCalls/useFriendGeckoSessions.tsx:35`
- **Refetched:** `src/hooks/useUpdateGeckoData.tsx:40`

### `["userGeckoSessionsTimeRange", userId]` — last-12hr summary
- **Defined:** `src/hooks/GeckoCalls/useUserGeckoSessionsTimeRange.tsx:43`
- **Refetched:** `src/hooks/useUpdateGeckoData.tsx:45`

### `["friendGeckoSessionsTimeRange", userId, friendId]` — friend's last-12hr summary
- **Defined:** `src/hooks/GeckoCalls/useFriendGeckoSessionsTimeRange.tsx:108`
- **Refetched:** `src/hooks/useUpdateGeckoData.tsx:44`

### `["userGeckoCombinedData", userId]` — aggregated gecko stats
- **Defined:** `src/hooks/useUserGeckoCombinedData.tsx:6`
- **Refetched:** `src/hooks/useUpdateGeckoData.tsx:39`

### `["userGeckoPointsLedger", userId]` — infinite paginated points history
- **Defined:** `src/hooks/GeckoCalls/useUserGeckoPointsLedger.tsx:28`
- **Refetched:** `src/hooks/useUpdateGeckoData.tsx:41`

### `["userGeckoEnergyLog", userId]` — infinite paginated energy log
- **Defined:** `src/hooks/GeckoCalls/useUserGeckoEnergyLog.tsx:28`
- **Refetched/Invalidated:** none found

### `["userGeckoScriptsLedger", userId]` — infinite paginated scripts/prompts history
- **Defined:** `src/hooks/GeckoCalls/useUserGeckoScriptsLedger.tsx:28`
- **Invalidated:** `src/hooks/GeckoCalls/useLogWelcomeScripts.tsx:20`

### `["userGeckoSyncLog", userId, trigger, excludeTriggers, since, until]`
- **Defined:** `src/hooks/GeckoCalls/useUserGeckoSyncLog.tsx:42`
- **Refetched/Invalidated:** none found

### `["geckoVoice", personalityType, memoryType, storyType]`
- **Defined:** `src/hooks/useGeckoVoice.tsx:79` — cache-only

### `["userGeckoStaticData", userId]`
- **Defined:** `src/hooks/useGeckoStaticData.tsx:35` — not directly refetched

---

## FRIEND DOMAIN

### `["friendListAndUpcoming", userId]`
- **Defined:** `src/hooks/usefriendListAndUpcoming.tsx:14`
- **Refetched:**
  - `src/hooks/useDateChangeRefresh.tsx:46`
  - `src/hooks/useDeleteFriend.tsx:36-37`
  - `src/hooks/FriendCalls/useCreateFriend.tsx:80-81`
  - `src/hooks/useRemixUpcomingHelloes.tsx:17-18`

### `["friendDashboardData", userId, friendId]`
- **Defined:** `src/hooks/useFriendDash.tsx:16`
- **Refetched:**
  - `src/hooks/useUpdateGeckoData.tsx:28` — setQueryData
  - `src/hooks/FriendCalls/useLinkUserToFriend.tsx:17`

---

## HELLO / MOMENT DOMAIN

### `["pastHelloes", userId, friendId]`
- **Defined:** `src/hooks/useHelloes.tsx:29`

### `["pastHelloesFull", userId, friendId]`
- **Defined:** `src/hooks/HelloesCalls/useFullHelloes.tsx:35`

### `["Moments", userId, friendId]`
- **Defined:** `src/hooks/prefetchFriendDashUtil.tsx:24`
- **Invalidated:** `src/hooks/HelloesCalls/useCreateHello.tsx:70`

---

## USER DOMAIN

### `["currentUser"]`
- **Defined:** `src/hooks/useUser.tsx:106` — invalidated on auth events

### `["userSettings", userId]`
- **Defined:** `src/hooks/useTopLevelUserSettings.tsx:14`
- **Refetched:**
  - `src/hooks/FriendCalls/useCreateFriend.tsx:84`
  - `src/hooks/HelloesCalls/useCreateHello.tsx:77`
  - `src/hooks/useSelectFriend.tsx:75`
  - `src/hooks/useRemixUpcomingHelloes.tsx:20`

### `["userStats", userId]`
- **Defined:** `src/hooks/useUserStats.tsx:175`
- **Refetched:**
  - `src/hooks/CategoryCalls/useCreateNewCategory.tsx:13`
  - `src/hooks/CategoryCalls/useUpdateCategory.tsx:15`
  - `src/hooks/CategoryCalls/useDeleteCategory.tsx:65`
  - `src/hooks/HelloesCalls/useCreateHello.tsx:76`

### `["userAddresses", userId]`
- **Defined:** `src/hooks/useStartingUserAddresses.tsx:22`
- **Invalidated:**
  - `src/hooks/AddressCalls/useCreateUserAddress.tsx:25`
  - `src/hooks/AddressCalls/useDeleteUserAddress.tsx:17`
  - `src/hooks/useUpdatreUserAddress.tsx:18`

### `["friendAddresses", userId, friendId]`
- **Defined:** `src/hooks/useStartingFriendAddresses.tsx:20`
- **Prefetched:** `src/hooks/usePrefetches.tsx:28`

---

## LOCATION DOMAIN

### `["locationList", userId]`
- **Defined:** `src/hooks/useLocations.tsx:21`

### `["additionalDetails", userId, locationId]`
- **Defined:** `src/hooks/LocationCalls/useFetchAdditionalDetails.tsx:28`

---

## IMAGE DOMAIN

### `["friendImages", userId, friendId]`
- **Defined:** `src/hooks/ImageCalls/useImages.tsx:66`
- **Invalidated:**
  - `src/hooks/ImageCalls/useCreateImage.tsx:33`
  - `src/hooks/ImageCalls/useUpdateImage.tsx:22`
  - `src/hooks/ImageCalls/useDeleteImage.tsx:29`

---

## CATEGORY DOMAIN

### `["categories", userId]`
- **Defined:** `src/hooks/useCategories.tsx:20`

### `["selectedFriendStats", userId, friendId]`
- **Defined:** `src/hooks/useSelectedFriendStats.tsx:27`
- **Refetched:**
  - `src/hooks/CategoryCalls/useCreateNewCategory.tsx:14`
  - `src/hooks/CategoryCalls/useUpdateCategory.tsx:16`
  - `src/hooks/CategoryCalls/useDeleteCategory.tsx:66`
  - `src/hooks/useSelectedFriendStats.tsx:77` — manual refetch

---

## LIVE SESSION DOMAIN

### `["liveSeshInvites", userId]`
- **Defined:** `src/hooks/LiveSeshCalls/useLiveSeshInvites.tsx:12`
- **Refetched:**
  - `src/hooks/LiveSeshCalls/useCreateLiveSeshInvite.tsx:16`
  - `src/hooks/LiveSeshCalls/useAcceptLiveSeshInvite.tsx:15`

### `["currentLiveSesh", userId]`
- **Defined:** `src/hooks/LiveSeshCalls/useCurrentLiveSesh.tsx:11`
- **Refetched:**
  - `src/hooks/LiveSeshCalls/useCreateLiveSeshInvite.tsx:17`
  - `src/hooks/LiveSeshCalls/useAcceptLiveSeshInvite.tsx:16`

---

## OTHER

### `["friendLinkCode", userId]`
- **Defined:** `src/hooks/useFriendLinkCode.tsx:21`

### `["PickSessionPoll", activeSessionId]`
- **Defined:** `src/hooks/CapsuleCalls/useFriendPickSession.tsx:61`
- **Removed:** `src/hooks/CapsuleCalls/useFriendPickSession.tsx:106`

---

# CO-INVALIDATION GROUPS

## ★ Group 1 — Gecko Game Session Save (`useUpdateGeckoData.tsx`)
These 6 keys ALWAYS refetch together when a session is saved:
1. `["userGeckoCombinedData", userId]`
2. `["friendGeckoSessions", userId, friendId]`
3. `["userGeckoPointsLedger", userId]`
4. `["userGeckoScoreState", userId]`
5. `["friendGeckoSessionsTimeRange", userId, friendId]`
6. `["userGeckoSessionsTimeRange", userId]`

**Consolidation idea:** extract `useRefreshGeckoAfterGameSave(userId, friendId)`. Or use a shared key prefix like `["gecko", ...]` so a single `invalidateQueries({ queryKey: ["gecko"] })` covers them all. (Note: `userGeckoSyncLog`, `userGeckoEnergyLog`, `userGeckoScriptsLedger` are also gecko data — decide if they should refresh too.)

## Group 2 — Friend Add/Remove
- `["friendListAndUpcoming", userId]` + `["userSettings", userId]`
- Files: `useCreateFriend.tsx`, `useDeleteFriend.tsx`

## Group 3 — Hello Creation (`useCreateHello.tsx`)
- `["Moments", userId, friendId]` (invalidate)
- `["friendListAndUpcoming", userId]`
- `["userStats", userId]`
- `["userSettings", userId]`

## Group 4 — Category Mutations
- `["userStats", userId]` + `["selectedFriendStats", userId, friendId]`
- Files: `useCreateNewCategory.tsx`, `useUpdateCategory.tsx`, `useDeleteCategory.tsx`

## Group 5 — Live Session Invite Flow
- `["liveSeshInvites", userId]` + `["currentLiveSesh", userId]`
- Files: `useCreateLiveSeshInvite.tsx`, `useAcceptLiveSeshInvite.tsx`

## Group 6 — User Addresses
- `["userAddresses", userId]` invalidated by all 3 address mutation hooks

## Group 7 — Friend Images
- `["friendImages", userId, friendId]` invalidated by all 3 image mutation hooks

## Group 8 — Gecko Streak Expiry
- `["userGeckoScoreState", userId]` invalidated in both `useGeckoSynthesizer.tsx` and `useGeckoSynthesizer_WS.tsx` — duplicated logic worth sharing
