# Tasks & Calendar App - Setup & Run Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Start Development Server
```bash
pnpm expo start
```

Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app for physical device

### 3. Seed Sample Data (Optional)
1. Navigate to About screen
2. Tap "Dev Tools"
3. Tap "Seed Sample Tasks"

This creates 7 example tasks to explore all features.

## 📱 Features Implemented

### ✅ Core Functionality
- [x] **Quick Add**: Natural language task input
  - Example: `Pay water bill tomorrow 9am #home !high`
  - Supports: dates, times, tags (#tag), priority (!high|!med|!low)
- [x] **Smart Lists**:
  - Overdue (past due date)
  - Today (due today)
  - Week (due this week)
  - Timeless (no due date)
  - All tasks
- [x] **Swipe Actions**:
  - Swipe right → Complete
  - Swipe left → Snooze (30m / Tonight / Tomorrow)
- [x] **Calendar View**:
  - Week strip navigation
  - Filter tasks by selected date
  - Add tasks for specific dates

### ✅ Advanced Features
- [x] **Task Details**:
  - Title, notes, subtasks
  - Priority (None/Low/Med/High)
  - Due date & time
  - All-day toggle
  - Recurring rules (Daily/Weekdays/Weekly/Monthly)
- [x] **Notifications**:
  - Local reminders (no internet required)
  - Actionable buttons (iOS): Complete, Snooze 30m, Tomorrow
  - Auto-scheduled when setting due dates
- [x] **Subtasks**: Break down complex tasks
- [x] **Tags**: Organize with hashtags
- [x] **Recurrence**: RRULE-based repeating tasks

### ✅ Data & Performance
- [x] SQLite database with migrations
- [x] Indexed queries (< 100ms list rendering)
- [x] Optimistic UI updates
- [x] Offline-first architecture
- [x] FlatList virtualization with memoization

### ✅ UX/UI
- [x] Zero-clutter interface
- [x] Empty states with friendly messages
- [x] Color-coded status (Overdue = red, Today = primary, etc.)
- [x] Haptic feedback (iOS/Android)
- [x] Pull-to-refresh
- [x] Modal presentations

## 🧪 Testing

### Run Unit Tests
```bash
pnpm test
```

Tests include:
- Natural language parser (`quickParse.test.ts`)
- Database operations
- Recurrence logic

### Manual Testing Checklist

#### Quick Add
- [ ] Create task: "Buy milk"
- [ ] With date: "Meeting tomorrow 3pm"
- [ ] With tags: "Review PR #work"
- [ ] With priority: "Urgent task !high"
- [ ] Complex: "Pay bill tomorrow 9am #home !high"

#### Lists
- [ ] Overdue shows past-due tasks
- [ ] Today shows today's tasks
- [ ] Week shows this week's tasks
- [ ] Timeless shows tasks without dates

#### Swipe Actions
- [ ] Swipe right completes task
- [ ] Swipe left shows snooze options
- [ ] Snooze 30m reschedules correctly
- [ ] Snooze Tomorrow moves to 9am next day

#### Task Details
- [ ] Edit title, notes
- [ ] Change priority
- [ ] Add/remove subtasks
- [ ] Toggle subtask completion
- [ ] Set recurring rule

#### Calendar
- [ ] Week strip scrolls
- [ ] Selecting date filters tasks
- [ ] FAB navigates to Quick Add

#### Notifications
- [ ] Permission request on first reminder
- [ ] Notification appears at due time
- [ ] Action buttons work (iOS)

## 🔧 Dev Tools

Access at `/dev` or via About screen:

- **Seed Sample Tasks**: Creates 7 test tasks
- **Clear All Data**: Resets database
- **List Notifications**: Shows scheduled reminders
- **Cancel All Notifications**: Clears reminder queue

## 📂 Project Structure

```
app/
  ├── _layout.tsx          # Root navigation config
  ├── index.tsx            # Home screen (task lists)
  ├── about.tsx            # About & navigation
  ├── calendar/
  │   └── index.tsx        # Calendar view
  ├── task/
  │   └── [id].tsx         # Task detail editor
  └── dev.tsx              # Dev tools

components/
  ├── QuickAdd.tsx         # Natural language input
  ├── TaskRow.tsx          # Swipeable task row
  ├── EmptyState.tsx       # Empty list placeholder
  └── CalendarStrip.tsx    # Week navigation

lib/
  ├── db.ts                # SQLite singleton & migrations
  ├── quickParse.ts        # Natural language parser
  ├── notify.ts            # Notification manager
  ├── log.ts               # Dev logger
  ├── store.ts             # Zustand state
  └── repo/
      ├── tasks.ts         # Task CRUD & queries
      └── events.ts        # Event CRUD (future)

db/
  └── migrations/
      └── 001_init.sql     # Initial schema
```

## 🎨 Tech Stack

- **Runtime**: Expo SDK 54 + React Native
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based)
- **State**: Zustand
- **Database**: expo-sqlite (SQLite)
- **Dates**: dayjs + plugins (timezone, relativeTime)
- **Recurrence**: rrule
- **Notifications**: expo-notifications
- **Gestures**: react-native-gesture-handler
- **Animations**: react-native-reanimated
- **Forms**: react-hook-form + zod
- **Icons**: lucide-react-native

## 📖 Documentation

See [TASKS.md](./TASKS.md) for:
- Feature guide
- Keyboard shortcuts
- Common workflows
- Troubleshooting

## 🐛 Known Issues / Future Enhancements

- [ ] Date/time picker UI (currently manual in task details)
- [ ] Cloud sync (Supabase integration ready)
- [ ] Shared lists / collaboration
- [ ] Attachments & file links
- [ ] Location-based reminders
- [ ] Apple Watch / Wear OS apps
- [ ] Dark mode theming (Tamagui ready)
- [ ] Custom list/project grouping

## 🎥 Demo Recording

To record a demo:

1. Run on simulator/emulator
2. Use built-in screen recording:
   - **iOS**: Simulator → File → Record Screen
   - **Android**: Studio → Run → Screen Record
3. Or use Expo dev tools:
   ```bash
   pnpm expo start
   # Press 'm' to open dev menu on device
   # Enable "Performance Monitor" for FPS overlay
   ```

## 📝 Deployment Checklist

### Before Production
- [ ] Update app.json (name, slug, version)
- [ ] Configure app icons & splash screen
- [ ] Set up EAS Build (eas.json)
- [ ] Configure push notifications (if adding remote)
- [ ] Add privacy policy & terms (if publishing)
- [ ] Test on physical devices (iOS + Android)
- [ ] Performance profiling (React DevTools)

### Build for Stores
```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

## 🤝 Contributing

1. Fork & clone
2. Create feature branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open Pull Request

## 📄 License

MIT

---

**Built with ❤️ for fast, focused productivity.**
