# Data Syncing

---

## friendListAndUpcoming — Daily Refresh at User's Local Midnight

### What this data is

`friendListAndUpcoming` is a paginated query that returns the user's friend list and their upcoming helloes. The backend filters upcoming helloes relative to the user's **local date** (not UTC), so this data must be considered stale and re-fetched whenever the user's local date rolls over to a new day.

---

### How the user's local time is sent to the backend

The backend does not store the user's local time or timezone. Instead, the app computes the user's local date at call time and passes it as a query parameter on every fetch.

**Fetch call:** `fetchUpcomingHelloesAndFriends` in `src/calls/api.tsx`

```ts
export const fetchUpcomingHelloesAndFriends = async () => {
  const today = new Date();
  const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const response = await helloFriendApiClient.get(
    "/friends/upcoming/friends-included/",
    { params: { local_date: localDate } }
  );
  return response.data;
};
```

`new Date()` uses the device's local time. The resulting `local_date` param is formatted as `YYYY-MM-DD` and sent as a query param to the backend on every request. The backend uses it to determine which upcoming helloes are relevant for that day.

---

### How the cache is kept up to date

#### `useDateChangeRefresh` (`src/hooks/useDateChangeRefresh.tsx`)

Handles all three scenarios that require a refresh:

- **App reopened after being closed** — runs `check()` immediately on mount
- **App brought back to foreground** — `AppState` listener runs `check()` whenever state becomes `"active"`
- **App left open past midnight** — `setTimeout` syncs to the next top of the hour (+20s buffer), then runs `setInterval` every hour so it always catches midnight

`check()` compares the current local date against `lastDateRef`. If the date has changed, it calls `queryClient.invalidateQueries` for `friendListAndUpcoming`, triggering an immediate background refetch for any active subscriber.

This hook is mounted in `LayoutInner` in `App.tsx`, which is always present while the user is logged in.

---

### Summary

| Mechanism | When it fires | What it does |
|---|---|---|
| `useDateChangeRefresh` — on mount | App open / reopened | Checks date immediately, invalidates if changed |
| `useDateChangeRefresh` — AppState | App foregrounded | Checks date, invalidates if changed |
| `useDateChangeRefresh` — setInterval | Every hour on the hour (+20s) | Checks date, invalidates if changed (catches midnight) |
| `fetchUpcomingHelloesAndFriends` | On every actual fetch | Sends today's `local_date` as a param so the backend returns the correct data |

---

### Persisted cache note

The app uses `PersistQueryClientProvider` with `maxAge: 24 hours`. If the app is closed for more than 24 hours, the entire cache is discarded on restore and a fresh fetch always occurs.

---

## Date fields from friendListAndUpcoming

**Backend-computed (using the `local_date` param):**
- `future_date_in_words` — e.g. "in 3 days". Pre-formatted, displayed as-is. Only accurate for the day fetched — stale cache will show wrong value.
- `past_date_in_words` — same, for past helloes.
- `date` — raw `YYYY-MM-DD`. All client-side formatting derives from this.

**Frontend formatting (`src/utils/dateUtils.tsx`, all native JS):**
- `isoDateToWeekdayMonthDay(YYYY-MM-DD)` → "Friday, March 14" — parses manually to avoid UTC shift
- `formatDayOfWeekAbbrevMonth(YYYY-MM-DD)` → "Friday, Mar 5" — also parses manually
- `daysSincedDateField(date)` → integer days since date — **does not parse manually**, passes straight to `new Date()`, potential off-by-one in negative UTC offset timezones
- `isoDateTimeToWeekdayMonthDay(ISO datetime)` → "Friday, March 28" — passes to `new Date()`, uses device local time

**Watch out for:**
- `future_date_in_words` / `past_date_in_words` go stale after midnight — core reason for daily refresh
- `daysSincedDateField` may return off-by-one for `YYYY-MM-DD` inputs in negative UTC offset timezones (unlike the other formatters which parse manually)
