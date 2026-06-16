# Onboard

Board game meetup app for Chennai, India. Host and join meetups at local board game cafes.

## Stack

- React Native + Expo (TypeScript)
- React Navigation (bottom tabs + native stack)
- Zustand (state management)
- Poppins font via `@expo-google-fonts/poppins`
- Mock data only — no backend, no auth

## Run

```bash
npm install
npx expo start
```

Then press `i` for iOS simulator or `a` for Android emulator, or scan the QR code with Expo Go.

## Features

- Browse board game cafes in Chennai with photos, reviews, table availability, and game libraries
- Meetup feed with filters (difficulty, vibe, date, seats)
- 6-step hosted meetup flow (cafe → table & time → games → players & deposit → vibe → publish)
- Join meetups with Pay & Join (deposit-based, mocked)
- Bill split screen with deposit credits applied per attendee
- Reliability scoring (showedUp / joined ratio)
- Meeple Awards system — voted and computed awards per meetup
- Group chats auto-created for each meetup
- Profile with reliability meter, preferred games, and meeple showcase

## Project Structure

```
src/
  types.ts          # All TypeScript interfaces and enums
  mockData.ts       # Seed data (8 games, 6 cafes, 10 meetups, awards)
  theme.ts          # Design tokens (colors, spacing, radii, font sizes)
  store/
    useStore.ts     # Zustand store with join/host/chat actions
  components/       # 20+ reusable components
  screens/
    Home/           # HomeScreen, GameCatalogueScreen, GameDetailScreen
    Meetups/        # MeetupsScreen, MeetupDetailScreen
    Cafes/          # CafesScreen, CafeDetailScreen
    Messages/       # MessagesScreen, ChatDetailScreen
    Profile/        # ProfileScreen
    Host/           # HostModal (6-step flow)
  navigation/
    AppNavigator.tsx  # Bottom tab nav + root stack
```
