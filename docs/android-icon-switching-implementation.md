# Android App Icon Switching - Deep Implementation Guide

This document explains, in depth, how the **app icon change feature** was implemented in this project, including:

- architecture and design decisions
- Android manifest/activity alias setup
- native Kotlin module and storage flow
- React Native bridge and settings UI integration
- launch-time behavior
- edge cases and debugging notes

---

## 1) Goal and High-Level Strategy

### Goal
Allow users to pick a launcher icon from Settings, save that preference, and ensure Android shows the selected icon for the app.

### Strategy used
Android does not let apps directly mutate one launcher icon resource at runtime. The standard production approach is:

1. Define multiple launcher entry points (`activity-alias`) in `AndroidManifest.xml`.
2. Give each alias a different icon.
3. Enable exactly one alias at a time using `PackageManager.setComponentEnabledSetting`.
4. Persist the user selection in `SharedPreferences`.
5. Re-apply the saved alias state at app startup to keep icon state consistent.

This is exactly what is implemented here.

---

## 2) File-by-File Changes and Why

## `android/app/src/main/AndroidManifest.xml`

### What changed
- `MainActivity` no longer has the `MAIN` + `LAUNCHER` intent filter.
- `MainActivity` still keeps the deep link (`VIEW`) intent filter.
- Added three launcher aliases:
  - `.DefaultIconAlias` (enabled by default)
  - `.BlueIconAlias` (disabled initially)
  - `.GreenIconAlias` (disabled initially)

### Why
- If `MainActivity` also remains a launcher while aliases are launchers, multiple app entries may appear or state may behave inconsistently.
- `activity-alias` allows multiple launcher identities pointing to the same real activity.
- We switch alias states at runtime to switch icon.

### Key behavior
- Only one alias should be enabled at any moment.
- Android launcher uses the currently enabled alias icon.

---

## `android/app/src/main/res/drawable/ic_launcher_alt_blue.xml`
## `android/app/src/main/res/drawable/ic_launcher_alt_green.xml`

### What changed
- Added two vector drawable icon resources for alternate icons.

### Why
- Each alias needs a distinct icon resource.
- Vector drawables are simple and density-independent for this implementation.

---

## `android/app/src/main/java/com/razagro2/crashmonitorapp/AppIconManager.kt`

### What changed
Created `AppIconManager` singleton with:

- icon keys/constants:
  - `default`, `blue`, `green`
- `SharedPreferences` constants:
  - `PREFS = "app_icon_prefs"`
  - `KEY_SELECTED_ICON = "selected_icon"`
- helper methods:
  - `normalizeIcon(...)`
  - `saveSelectedIcon(...)`
  - `getSelectedIcon(...)`
  - `applySavedIcon(...)`
  - `applyIcon(...)`
  - internal `setAliasState(...)`

### Why
- Keeps all icon business logic centralized in one place.
- Avoids duplicating component switching logic in multiple classes.
- Makes JS bridge (`AppIconModule`) thin and clean.

### Core logic details
`applyIcon(context, icon)`:
1. normalizes user input
2. resolves package manager + package name
3. toggles each alias:
   - enable selected alias
   - disable all others
4. uses `PackageManager.DONT_KILL_APP` so switching is smooth

---

## `android/app/src/main/java/com/razagro2/crashmonitorapp/AppIconModule.kt`

### What changed
Created React Native native module exposing:

- `getSelectedIcon(promise)`
- `setSelectedIcon(icon, promise)`

### Why
- JS Settings screen cannot directly access `PackageManager`/`SharedPreferences`.
- This module is the bridge between RN JS and native Android behavior.

### Behavior
`setSelectedIcon`:
1. saves preference
2. applies alias state immediately
3. returns normalized selected icon to JS
4. sends `Promise.reject` on failures for UI error handling

---

## `android/app/src/main/java/com/razagro2/crashmonitorapp/AppIconPackage.kt`

### What changed
Created custom `ReactPackage` that registers `AppIconModule`.

### Why
- RN needs module registration to expose it in `NativeModules`.

---

## `android/app/src/main/java/com/razagro2/crashmonitorapp/MainApplication.kt`

### What changed
In `getPackages()`, added:

- `add(AppIconPackage())`

### Why
- Ensures custom native module is available to JS runtime.

---

## `android/app/src/main/java/com/razagro2/crashmonitorapp/MainActivity.kt`

### What changed
At startup (`onCreate`), added:

- `AppIconManager.applySavedIcon(this)`

### Why
- Guarantees app relaunch always re-syncs alias state with saved preference.
- Useful for consistency after upgrades, cache clears, launcher refresh variance, or manual state drift.

---

## `src/lib/appIcon.ts`

### What changed
Added JS wrapper utility around native module:

- `isAppIconSwitchSupported()`
- `getSelectedAppIcon()`
- `setSelectedAppIcon(icon)`
- `AppIconKey` union type (`'default' | 'blue' | 'green'`)

### Why
- Keeps screen components simple and typed.
- Centralizes platform checks and fallback behavior.
- Protects UI from malformed native values by normalizing in JS too.

---

## `src/screens/SettingsScreen.tsx`

### What changed
Added **App Icon** settings section:

- displays icon choices: Default, Blue, Green
- loads current saved icon on focus
- applies selection on tap
- shows selected state and error states
- explains behavior: icon persists and applies on next launch

### Why
- User-facing control point for this feature.
- Keeps feature discoverable and grouped in Settings.

### UI behavior details
1. On screen focus:
   - if unsupported platform/module: show informational message
   - else fetch current selected icon
2. On icon tap:
   - call native bridge to save + apply
   - update selected UI state
   - show confirmation alert

---

## 3) End-to-End Runtime Flow

1. User opens **Settings > App Icon**.
2. User taps one icon option.
3. JS (`SettingsScreen`) calls `setSelectedAppIcon(...)` from `src/lib/appIcon.ts`.
4. JS wrapper calls native module `AppIconModule.setSelectedIcon(...)`.
5. Native module:
   - persists choice in `SharedPreferences`
   - asks `AppIconManager` to toggle manifest aliases
6. Launcher observes alias changes and updates displayed icon (timing may vary by device/launcher).
7. On next app launch, `MainActivity.onCreate` calls `AppIconManager.applySavedIcon(...)`:
   - re-enforces persisted icon state for reliability.

---

## 4) Why This Is the Correct Native Android Pattern

- Uses official Android component enabled-state mechanism.
- No unofficial hacks or reflection.
- Works across modern Android versions.
- Preference persistence is lightweight and robust (`SharedPreferences`).
- Alias-based approach is widely used in production apps for icon switching.

---

## 5) Important Notes / Limitations

- Some launchers update icon instantly; others can delay refresh by a few seconds.
- During development, hot reload does not always reflect manifest/alias changes; full rebuild may be required.
- If app is force-stopped or launcher caches aggressively, icon refresh may appear delayed.
- This feature is Android-specific in this implementation.

---

## 6) Testing Checklist

1. Build/install fresh native app (`npx expo run:android`).
2. Open Settings and pick **Blue** icon.
3. Go Home and verify launcher icon updates.
4. Kill and relaunch app; verify icon remains Blue.
5. Repeat with **Green** and **Default**.
6. Reopen Settings; verify selected state matches actual persisted icon.

---

## 7) Troubleshooting

### Icon not changing
- Confirm alias names in manifest exactly match `AppIconManager` component names.
- Ensure only one alias is enabled at a time.
- Rebuild app after native changes.

### JS cannot call native module
- Confirm `AppIconPackage()` is added in `MainApplication`.
- Confirm module name in Kotlin (`"AppIconModule"`) matches `NativeModules.AppIconModule`.

### Wrong icon after relaunch
- Verify `AppIconManager.applySavedIcon(this)` runs in `MainActivity.onCreate`.
- Verify preference key/value is saved correctly.

---

## 8) Summary

The implementation is split into clean layers:

- **Manifest layer**: defines launcher aliases and icons.
- **Native logic layer**: persists + applies alias state (`AppIconManager`).
- **RN bridge layer**: exposes native operations to JS (`AppIconModule`, `AppIconPackage`).
- **UI layer**: lets user choose icon in Settings and handles UX/error states.
- **Startup sync layer**: ensures persisted icon is reapplied every launch (`MainActivity`).

This structure is maintainable, production-friendly, and matches standard Android native practices for dynamic launcher icon switching.

