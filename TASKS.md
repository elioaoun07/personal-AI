# Tasks & Calendar Feature Guide

## Overview
A blazing-fast, offline-first Tasks, Reminders & Calendar system built with React Native, Expo, and SQLite.

## Features

### ✨ Quick Add
The fastest way to capture tasks. Just type naturally:

**Examples:**
- `Pay water bill tomorrow 9am #home !high`
- `Call mom next tuesday 7pm`
- `Buy light bulbs` (creates a timeless task)
- `Review PR in 2 hours`
- `Meeting today 3pm`

**Syntax:**
- `#tag` — Add tags (e.g., `#work`, `#home`, `#urgent`)
- `!high`, `!med`, `!low` — Set priority
- `today`, `tonight`, `tomorrow` — Quick date references
- `next monday`, `next tue`, etc. — Specific weekdays
- `in X min/hours/days` — Relative time
- `3pm`, `15:00`, `9:30am` — Specific times

### 📋 Smart Lists

**Overdue**
Tasks that are past their due date. Color-coded in red for visibility.

**Today**
Tasks due today. Perfect for daily planning.

**Week**
All tasks due this week. Great for weekly planning sessions.

**Timeless**
Tasks without due dates. Your backlog and ideas.

**All**
Every task in the system, sorted intelligently.

### 📅 Calendar View
- **Week strip**: Quickly navigate dates
- **Date filtering**: See tasks for any specific day
- **Visual overview**: Plan your schedule at a glance

### ⚡ Swipe Actions

**Swipe Right → Complete**
Mark a task as done instantly.

**Swipe Left → Snooze**
- **30m**: Quick snooze for 30 minutes
- **Tonight**: Reschedule to 8pm today
- **Tomorrow**: Move to 9am tomorrow

### 🔁 Recurring Tasks
Set repeating patterns:
- Daily
- Weekdays (Mon-Fri)
- Weekly
- Monthly

When you complete a recurring task, the next occurrence is automatically created.

### 🔔 Reminders
- **Local notifications**: No internet required
- **Action buttons** (iOS): Complete, Snooze 30m, or Tomorrow directly from notifications
- **Smart scheduling**: Notifications are automatically scheduled when you set a due date

### ✅ Subtasks
Break down complex tasks into smaller steps. Each subtask can be checked off independently.

## Keyboard Tips

- **Enter/Return**: Submit Quick Add or subtask input
- **Tab through fields** in Task Details for fast editing
- Pull-down to refresh any list

## Performance

- **<100ms list rendering**: Optimized FlatList with memoization
- **Offline-first**: All data stored locally in SQLite
- **Instant updates**: Optimistic UI updates before DB commits
- **Indexed queries**: Fast lookups on due dates and status

## Data Management

### Reset Database
Go to the Dev screen (tap on "Dev Tools" from About page or navigate to `/dev`):
1. **Seed Sample Tasks** — Create 7 example tasks to explore features
2. **Clear All Data** — Delete everything and start fresh
3. **List Notifications** — View scheduled reminders

### Backup (Manual)
Your data lives in an SQLite database at:
```
<app-data>/SQLite/tasks.db
```

For automated backup, consider:
- Cloud sync (future feature)
- Device backup (iOS/Android native)

## Dark Mode
Theme follows system preferences automatically via Tamagui theming.

## Accessibility
- Large tap targets (44×44pt minimum)
- VoiceOver/TalkBack support
- Dynamic font sizes
- High-contrast color modes

## Common Workflows

### Morning Planning
1. Open **Today** tab
2. Review overdue items (if any)
3. Add new tasks via Quick Add
4. Swipe to complete or snooze as needed

### Weekly Review
1. Switch to **Week** tab
2. Scan upcoming tasks
3. Adjust priorities and due dates
4. Add missing items

### Brain Dump
1. Use Quick Add without dates
2. Tasks go to **Timeless** list
3. Review and schedule later

## Troubleshooting

**Notifications not appearing?**
- Check app permissions in iOS Settings / Android Settings
- Ensure reminders are set (due_at must be in the future)
- Re-create the task if needed

**Tasks not refreshing?**
- Pull down to refresh any list
- Check the Dev screen for DB health

**Performance slow?**
- Clear completed tasks periodically
- Contact support if you have >1000 active tasks

## Roadmap
- [ ] Collaborative lists (shared tasks)
- [ ] Cloud sync (Supabase backend)
- [ ] Custom lists/projects
- [ ] Attachments & links
- [ ] Location-based reminders
- [ ] Apple Watch / Wear OS complications

## Support
For issues or feature requests, please open a GitHub issue or contact the dev team.

---

**Built with ❤️ using Expo, React Native, SQLite, Zustand, and Tamagui.**
