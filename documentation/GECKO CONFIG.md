# Gecko Config

The gecko has four configurable sections, each mapped to a visual part of the gecko chart in `ScreenGeckoManage`. Each section corresponds to one field on the backend `GeckoConfigs` model and is edited through `OptionChoiceEdit` (a single-select from backend-provided choices). The `feet` section (Active Hours) has an additional `HoursSelector` subcomponent because it also writes a list of hour integers alongside the type.

## Section → backend field mapping

Defined in `SECTION_CONFIG_MAP` at the top of `app/screens/home/ScreenGeckoManage.tsx`.

- **head → Memory**
  - `valueField`: `memory_type`
  - `labelField`: `memory_type_label`
  - `choicesField`: `memory_types`
- **feet → Active Hours**
  - `valueField`: `active_hours_type`
  - `labelField`: `active_hours_type_label`
  - `choicesField`: `active_hours_types`
  - Additionally writes `active_hours` (list of ints 0–23)
- **body → Story**
  - `valueField`: `story_type`
  - `labelField`: `story_type_label`
  - `choicesField`: `story_types`
- **tail → Personality**
  - `valueField`: `personality_type`
  - `labelField`: `personality_type_label`
  - `choicesField`: `personality_types`

## Shared choice-edit flow (head / body / tail / feet type)

- User taps a section on the `GeckoChart`; `handleUpDrillCategoryId` stores the section id in `viewCategoryId`.
- `activeConfig` is resolved from `SECTION_CONFIG_MAP[viewCategoryId]`.
- `currentValue` = `geckoConfigs[activeConfig.valueField]`.
- `currentChoices` is built from `geckoConfigs.available_choices[activeConfig.choicesField]`, remapping backend `{ value, label }` → `{ id, label }` that `OptionChoiceEdit` expects.
- On confirm, `handleChoiceChange` fires `updateGeckoConfigs({ [activeConfig.valueField]: newValue })` — a single-field PATCH.

## Active Hours (`feet` section) — extra logic

### Overview
- Rendered only when `viewCategoryId === "feet"`.
- `HoursSelector` receives `hourType` (`active_hours_type`), `activeHours` (int list), and `maxHours` (from `geckoConfigs.thresholds.max_active_hours`).
- On save it calls `onSave(hours, newHourType)`, which maps to `handleActiveHours` → `updateGeckoConfigs({ active_hours, active_hours_type })`. Both fields ship in one request so a mode flip and hour change are atomic.

### hourType values (must match backend `ActivityHours`)
- `1` = DAY
- `2` = NIGHT
- `3` = RANDOM

### Day / Night modes — `ValueSlider_Range` with `circular` + `timeMode`
- The slider picks a single **start hour**; the selected set is `[start, start+1, …, start+span-1]` wrapping mod 24 (`buildHours` in `HoursSelector.tsx`).
- `span` = `activeHours.length || maxHours`. If the user hasn't saved anything yet, the slider defaults to a span of `maxHours` starting at hour 0.
- `ValueSlider_Range` in `circular` mode uses `totalUnits = maxValue - minValue + 1` (24 for hours 0–23) so the track represents 24 hour-slots and wraps: dragging past hour 23 shows the span continuing from hour 0 on the left.
- In circular mode the slider's `maximumValue` is no longer clamped to `maxValue - range`; the thumb can reach hour 23.
- The span overlay renders as one bar if contiguous, or two bars (primary + overflow) if the span wraps past the right edge. Native min/max track tints are set to transparent in range mode so the overlay is the only visible bar.
- `timeMode` replaces numeric tick labels with `12a`, `12p`, the **start** (`value`) label, and the **end** (`(value + range - 1) % 24`) label, absolutely positioned at their percent-of-track.
- Live "Day" / "Night" classification label is shown above the slider using `classifyBlock(start, span)` — mirrors the backend validation in `GeckoConfigsSerializer.validate`:
  - Compute the circular center of the block as `(start + (length - 1) / 2) % 24`.
  - Compute `circularDistance(center, 12)` and `circularDistance(center, 0)`, where `circularDistance(a, b) = min(|a - b| mod 24, 24 - |a - b| mod 24)`.
  - Closer to 12 → `"day"`, closer to 0 → `"night"`, equal → `null`.
- On save (`handleConfirm`):
  - If the classified type differs from the current `hourType`, an `Alert.alert` asks the user to confirm switching modes (e.g. Day → Night). Cancel aborts; OK runs `commitSave`.
  - If the classified type matches, `commitSave` fires immediately.
- `commitSave` for day/night: `onSave(buildHours(startHour, span), classifiedType)`.

### Random mode — `RandomHoursGrid`
- Rendered when `hourType === 3` (RANDOM). Horizontal `FlatList` of 24 cells, each labeled via `formatHour` (`12a`, `1a`, …, `11p`).
- Selection count is locked at exactly `maxHours`:
  - On mount, if `value.length !== maxHours`, the component auto-picks `maxHours` random hours via Fisher-Yates shuffle and calls `onChange` with the sorted result.
  - Initial `randomHours` state in `HoursSelector` uses the saved `activeHours` if it already has exactly `maxHours` entries; otherwise the grid auto-populates.
- Interaction model (swap, never add/remove):
  - Tap a **filled** cell → it becomes the "pickup" (rendered at 0.35 opacity). Tap the same cell again to cancel the pickup.
  - Tap an **empty** cell while something is picked up → remove the pickup hour, add the tapped hour, clear the pickup. Result is re-sorted and fired via `onChange`.
  - Tap an empty cell with nothing picked up → no-op.
- On save, `commitSave` branches on `hourType`: random fires `onSave(randomHours, RANDOM)`; no classification alert applies because random is explicit.

## Backend validation (for reference)

The frontend mirrors `GeckoConfigsSerializer.validate` in `hellosbackend/.../serializers.py` so the UI never submits data the backend will reject:

- `active_hours` must be unique and `<= max_active_hours`.
- DAY/NIGHT modes require a **single contiguous block** (no multiple windows), and the block's circular center must be closer to noon (DAY) or midnight (NIGHT).
- RANDOM allows any hours and multiple blocks — only the max cap applies.
- When `hours` is omitted and the mode is being created or changed, the serializer fills in defaults:
  - DAY → `range(6, 18)` (6am–5pm)
  - NIGHT → `[18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5]` (6pm–5am)
  - RANDOM → `range(0, 24, 2)` (every other hour)
- The serializer accepts `local_hour` (0–23) write-only for any time-of-day-sensitive logic; the frontend is not currently sending this.
