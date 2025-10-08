# 📱 Modern Mobile App

A cutting-edge React Native mobile application built with the latest and most stable technologies.

## 🚀 Tech Stack

- **Framework**: React Native via Expo (latest stable) with TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Animations**: React Native Reanimated & Gesture Handler
- **UI System**: Tamagui (universal, fast) + NativeWind (Tailwind-style for RN)
- **State Management**: Zustand (lightweight)
- **Server State**: TanStack Query (server cache)
- **Backend Ready**: Supabase.js compatible
- **Build & Distribution**: EAS CLI (Expo Application Services)
- **Testing**: Jest + React Native Testing Library
- **Lint/Format**: ESLint + Prettier (sane defaults)

## 🛠 Prerequisites

Make sure you have the following installed:
- Node.js (v18 or later)
- npm (v8 or later)
- Git

## 📦 Installation Status

✅ **Already Installed:**
- Node.js v22.20.0
- npm v11.5.2
- Git v2.51.0.1
- Expo CLI (global)
- EAS CLI (global)

## 🏃‍♂️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

This will open the Expo Dev Tools. You can:
- Press `a` to run on Android device/emulator
- Press `i` to run on iOS simulator (macOS only)
- Press `w` to run in web browser
- Scan QR code with Expo Go app on your phone

### 3. Development Commands

```bash
# Start development server
npm start

# Run on specific platform
npm run android
npm run ios
npm run web

# Testing
npm test              # Run tests once
npm run test:watch    # Run tests in watch mode

# Linting & Formatting
npm run lint          # Check for lint errors
npm run lint:fix      # Fix lint errors automatically
npm run format        # Format code with Prettier
npm run format:check  # Check if code is formatted

# Type Checking
npm run type-check    # Check TypeScript types

# Building (requires EAS account)
npm run build         # Build for all platforms
npm run build:android # Build for Android only
npm run build:ios     # Build for iOS only
```

## 📁 Project Structure

```
├── app/                 # Expo Router pages (file-based routing)
│   ├── _layout.tsx     # Root layout
│   ├── index.tsx       # Home screen
│   └── about.tsx       # About screen
├── components/         # Reusable UI components
│   └── AnimatedButton.tsx
├── lib/               # Utilities and configurations
│   ├── store.ts       # Zustand store
│   ├── query.ts       # TanStack Query setup
│   └── supabase.ts    # Supabase client
├── __tests__/         # Test files
├── assets/            # Images, fonts, etc.
└── ...config files
```

## 🔧 Configuration Files

- `app.json` - Expo configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `metro.config.js` - Metro bundler configuration
- `eas.json` - EAS Build configuration
- `jest.config.js` - Jest testing configuration
- `.prettierrc` - Prettier formatting rules
- `eslint.config.js` - ESLint rules

## 🎨 Styling

This project uses **NativeWind** for Tailwind-style styling in React Native. You can use Tailwind classes directly:

```jsx
<View className="flex-1 bg-white items-center justify-center p-4">
  <Text className="text-2xl font-bold text-blue-500">Hello World!</Text>
</View>
```

## 🔄 State Management

**Zustand** is configured for lightweight state management:

```typescript
import { useAppStore } from '@/lib/store'

const { user, setUser } = useAppStore()
```

## 🌐 API Integration

**TanStack Query** is set up for server state management:

```typescript
import { useQuery } from '@tanstack/react-query'

const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
})
```

## 🔐 Backend Integration

**Supabase** client is ready for authentication and database:

```typescript
import { supabase } from '@/lib/supabase'
// Add your Supabase URL and anon key to use
```

## 🚀 Building for Production

1. Set up EAS account: `npx eas login`
2. Configure your project: `npx eas build:configure`
3. Build: `npm run build`

## 📱 Device Testing

- **Android**: Use Expo Go app or Android Studio emulator
- **iOS**: Use Expo Go app or iOS Simulator (macOS only)
- **Web**: Runs in any modern browser

## 🧪 Testing

Write tests in the `__tests__` directory:

```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
```

## 🔍 Debugging

- Use React Native Debugger
- Flipper integration available
- Expo Dev Tools for network requests

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Router](https://expo.github.io/router/docs)
- [Tamagui](https://tamagui.dev)
- [NativeWind](https://www.nativewind.dev)
- [Zustand](https://zustand-demo.pmnd.rs)
- [TanStack Query](https://tanstack.com/query/latest)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.