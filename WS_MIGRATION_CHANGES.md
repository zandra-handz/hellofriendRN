# WS Migration Changes — Remove useGeckoScoreState, use socket scoreStateRef

All changes marked with `// [WS migration]` comments in the code.

---

## useGeckoEnergySocket.tsx

1. Added `'ready'` to socketStatus type union
2. Added `hasReceivedScoreState` ref (tracks first score_state message)
3. In `ws.onmessage`, on first `score_state` message: sets `hasReceivedScoreState` to true and calls `setSocketStatus('ready')`

**To undo:** Remove `'ready'` from type, remove `hasReceivedScoreState` ref, remove the `if (!hasReceivedScoreState.current)` block in onmessage

---

## useGeckoSynthesizer_WS.tsx

1. Removed `geckoScoreState` from params and type definition
2. Added `socketStatus: string` to params and type definition
3. `gecko` memo: removed `geckoScoreState` from null check, reads `base_multiplier`/`multiplier` from `ss` (scoreStateRef.current) instead of `geckoScoreState`, dep changed from `geckoScoreState` to `socketStatus`
4. `streakActive` memo: reads from `scoreStateRef.current` instead of `geckoScoreState`, dep changed to `[socketStatus]`
5. streak `useEffect`: reads `scoreStateRef.current` for expires_at check instead of `geckoScoreState`
6. `isAwake` memo: dep changed from `[geckoScoreState]` to `[socketStatus]`

**To undo:** Restore `geckoScoreState` param, remove `socketStatus` param, revert all memo deps and reads back to `geckoScoreState`

---

## ScreenGecko.tsx

1. `useGeckoScoreState` kept — used for initial load + offline fallback
2. Added useEffect to seed `scoreStateRef.current` from `geckoScoreState` if socket hasn't connected yet
3. Removed `geckoScoreStateRef` ref and its sync useEffect
4. Replaced useEffect that set `multiplierRef` from `geckoScoreState` with two: one from `geckoScoreState` (fallback), one from `registerOnScoreState` (socket)
5. Removed `geckoScoreState` from `useGeckoSynthesizer_WS` call args
6. Added `socketStatus` to `useGeckoSynthesizer_WS` call args
7. Changed MomentsSkia props: `geckoScoreState={scoreStateRef.current ?? geckoScoreState}`, `geckoScoreStateRef={scoreStateRef}`
8. Added `socketStatus={socketStatus}` prop to MomentsSkia

**To undo:** Remove the scoreStateRef seeding useEffect, restore `geckoScoreStateRef` and its sync useEffect, remove `registerOnScoreState` useEffect, restore the single `geckoScoreState` multiplierRef useEffect, restore original MomentsSkia props, remove `socketStatus` prop

---

## MomentsSkia.tsx

1. Added `socketStatus` to destructured props
2. Gait sync useEffect: reads from `geckoScoreStateRef?.current` instead of `geckoScoreState`, dep changed from `[geckoScoreState]` to `[socketStatus]`
3. Both `new Gecko(...)` calls: changed 4th arg from `geckoScoreState` to `geckoScoreStateRef?.current`

**To undo:** Remove `socketStatus` from props, revert useEffect to read `geckoScoreState` with `[geckoScoreState]` dep, revert Gecko constructor args to `geckoScoreState`
