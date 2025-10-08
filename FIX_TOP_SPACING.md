# Fixed: Top Bar Covered by System UI

## Changes Made

### File: `app/index.tsx`

**Problem:** The QuickAdd input bar was being covered by the phone's status bar (clock, WiFi, battery icons).

**Solution:** 
1. Added a wrapper `View` with dynamic padding for the status bar
2. Configured `StatusBar` to not be translucent
3. Added platform-specific padding for Android

**Changes:**
```tsx
// Before:
<SafeAreaView style={styles.container}>
  <StatusBar barStyle="dark-content" />
  <QuickAdd ... />
  ...
</SafeAreaView>

// After:
<View style={styles.wrapper}>
  <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" translucent={false} />
  <SafeAreaView style={styles.container}>
    <QuickAdd ... />
    ...
  </SafeAreaView>
</View>
```

**New Style:**
```tsx
wrapper: {
  flex: 1,
  backgroundColor: '#FAFAFA',
  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
}
```

## Result

✅ The QuickAdd input bar now has proper spacing at the top
✅ No overlap with system UI (clock, WiFi, battery icons)
✅ Works on both iOS and Android
✅ SafeAreaView still handles bottom insets (home indicator, etc.)

## How It Works

- **iOS**: `SafeAreaView` automatically handles the notch and status bar
- **Android**: We manually add `StatusBar.currentHeight` as padding to push content below the status bar
- **Both**: `translucent={false}` ensures the status bar is opaque and content doesn't go behind it

The app should now display correctly with proper spacing at the top! 🎉
