import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors, fontSize, spacing } from '../theme';

import { HomeScreen } from '../screens/Home/HomeScreen';
import { GameCatalogueScreen } from '../screens/Home/GameCatalogueScreen';
import { GameDetailScreen } from '../screens/Home/GameDetailScreen';
import { MeetupsScreen } from '../screens/Meetups/MeetupsScreen';
import { MeetupDetailScreen } from '../screens/Meetups/MeetupDetailScreen';
import { CafesScreen } from '../screens/Cafes/CafesScreen';
import { CafeDetailScreen } from '../screens/Cafes/CafeDetailScreen';
import { MessagesScreen } from '../screens/Messages/MessagesScreen';
import { ChatDetailScreen } from '../screens/Messages/ChatDetailScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { HostModal } from '../screens/Host/HostModal';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.bg },
  headerTintColor: colors.textPrimary,
  headerTitleStyle: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.md },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: colors.bg },
};

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="GameCatalogue" component={GameCatalogueScreen} options={{ title: 'Game Catalogue' }} />
      <Stack.Screen name="GameDetail" component={GameDetailScreen} options={{ title: '' }} />
      <Stack.Screen name="MeetupDetail" component={MeetupDetailScreen} options={{ title: 'Meetup' }} />
      <Stack.Screen name="CafeDetail" component={CafeDetailScreen} options={{ title: '' }} />
    </Stack.Navigator>
  );
}

function MeetupsStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="MeetupsMain" component={MeetupsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MeetupDetail" component={MeetupDetailScreen} options={{ title: 'Meetup' }} />
      <Stack.Screen name="CafeDetail" component={CafeDetailScreen} options={{ title: '' }} />
      <Stack.Screen name="GameDetail" component={GameDetailScreen} options={{ title: '' }} />
    </Stack.Navigator>
  );
}

function CafesStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="CafesMain" component={CafesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CafeDetail" component={CafeDetailScreen} options={{ title: '' }} />
      <Stack.Screen name="GameDetail" component={GameDetailScreen} options={{ title: '' }} />
      <Stack.Screen name="MeetupDetail" component={MeetupDetailScreen} options={{ title: 'Meetup' }} />
    </Stack.Navigator>
  );
}

function MessagesStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="MessagesMain" component={MessagesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} options={({ route }: any) => ({ title: '' })} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="GameDetail" component={GameDetailScreen} options={{ title: '' }} />
      <Stack.Screen name="MeetupDetail" component={MeetupDetailScreen} options={{ title: 'Meetup' }} />
    </Stack.Navigator>
  );
}

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={tabStyles.bar}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const isCenter = index === 2;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (isCenter) {
          return (
            <TouchableOpacity
              key={route.key}
              style={tabStyles.hostBtn}
              onPress={() => navigation.navigate('HostModal')}
              activeOpacity={0.85}
            >
              <Text style={tabStyles.hostBtnText}>+</Text>
            </TouchableOpacity>
          );
        }

        const EMOJIS = ['🏠', '🎲', '', '☕', '💬', '👤'];
        const LABELS = ['Home', 'Meetups', '', 'Cafes', 'Messages', 'Profile'];
        const adjustedIndex = index > 2 ? index - 1 : index;

        return (
          <TouchableOpacity
            key={route.key}
            style={tabStyles.tab}
            onPress={onPress}
            activeOpacity={0.75}
          >
            <Text style={[tabStyles.tabEmoji, { opacity: isFocused ? 1 : 0.45 }]}>{EMOJIS[index]}</Text>
            <Text style={[tabStyles.tabLabel, { color: isFocused ? colors.brand : colors.textMuted }]}>
              {LABELS[index]}
            </Text>
            {isFocused && <View style={tabStyles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} />
      <Tab.Screen name="MeetupsTab" component={MeetupsStack} />
      <Tab.Screen name="HostPlaceholder" component={HomeStack} />
      <Tab.Screen name="CafesTab" component={CafesStack} />
      <Tab.Screen name="MessagesTab" component={MessagesStack} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Main" component={MainTabs} />
        <RootStack.Screen
          name="HostModal"
          component={HostModal}
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'Host a Meetup',
            ...screenOptions,
          }}
        />
        <RootStack.Screen
          name="MeetupDetail"
          component={MeetupDetailScreen}
          options={{ ...screenOptions, headerShown: true, title: 'Meetup' }}
        />
        <RootStack.Screen
          name="CafeDetail"
          component={CafeDetailScreen}
          options={{ ...screenOptions, headerShown: true, title: '' }}
        />
        <RootStack.Screen
          name="GameDetail"
          component={GameDetailScreen}
          options={{ ...screenOptions, headerShown: true, title: '' }}
        />
        <RootStack.Screen
          name="GameCatalogue"
          component={GameCatalogueScreen}
          options={{ ...screenOptions, headerShown: true, title: 'Game Catalogue' }}
        />
        <RootStack.Screen
          name="ChatDetail"
          component={ChatDetailScreen}
          options={({ route }: any) => ({ ...screenOptions, headerShown: true, title: '' })}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const tabStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1, borderTopColor: colors.border,
    paddingBottom: 24, paddingTop: spacing.sm,
    alignItems: 'flex-end',
  },
  tab: { flex: 1, alignItems: 'center', gap: 2, paddingTop: spacing.xs, position: 'relative' },
  tabEmoji: { fontSize: 20 },
  tabLabel: { fontSize: fontSize.xs, fontFamily: 'Poppins_500Medium' },
  activeIndicator: {
    position: 'absolute', top: 0, left: '25%', right: '25%',
    height: 2, backgroundColor: colors.brand, borderRadius: 1,
  },
  hostBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: colors.brand,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8, marginHorizontal: spacing.sm,
    shadowColor: colors.brand, shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  hostBtnText: { fontSize: 28, color: '#fff', fontFamily: 'Poppins_700Bold', lineHeight: 32 },
});
