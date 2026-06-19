import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing } from '../theme';
import { useStore } from '../store/useStore';

import { LoginScreen } from '../screens/Auth/LoginScreen';
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
import { ClubsScreen } from '../screens/Clubs/ClubsScreen';
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

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

// Common screens accessible from every tab
function withCommonScreens(Stack: ReturnType<typeof createNativeStackNavigator>, MainComponent: React.ComponentType<any>, mainName: string) {
  return () => (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name={mainName} component={MainComponent} options={{ headerShown: false }} />
      <Stack.Screen name="MeetupDetail" component={MeetupDetailScreen} options={{ title: 'Meetup' }} />
      <Stack.Screen name="CafeDetail" component={CafeDetailScreen} options={{ title: '' }} />
      <Stack.Screen name="GameDetail" component={GameDetailScreen} options={{ title: '' }} />
      <Stack.Screen name="GameCatalogue" component={GameCatalogueScreen} options={{ title: 'Game Catalogue' }} />
    </Stack.Navigator>
  );
}

const HomeStackNav = createNativeStackNavigator();
function HomeStack() {
  return (
    <HomeStackNav.Navigator screenOptions={screenOptions}>
      <HomeStackNav.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStackNav.Screen name="GameCatalogue" component={GameCatalogueScreen} options={{ title: 'Game Catalogue' }} />
      <HomeStackNav.Screen name="GameDetail" component={GameDetailScreen} options={{ title: '' }} />
      <HomeStackNav.Screen name="MeetupDetail" component={MeetupDetailScreen} options={{ title: 'Meetup' }} />
      <HomeStackNav.Screen name="CafeDetail" component={CafeDetailScreen} options={{ title: '' }} />
    </HomeStackNav.Navigator>
  );
}

const MeetupsStackNav = createNativeStackNavigator();
function MeetupsStack() {
  return (
    <MeetupsStackNav.Navigator screenOptions={screenOptions}>
      <MeetupsStackNav.Screen name="MeetupsMain" component={MeetupsScreen} options={{ headerShown: false }} />
      <MeetupsStackNav.Screen name="MeetupDetail" component={MeetupDetailScreen} options={{ title: 'Meetup' }} />
      <MeetupsStackNav.Screen name="CafeDetail" component={CafeDetailScreen} options={{ title: '' }} />
      <MeetupsStackNav.Screen name="GameDetail" component={GameDetailScreen} options={{ title: '' }} />
    </MeetupsStackNav.Navigator>
  );
}

const CafesStackNav = createNativeStackNavigator();
function CafesStack() {
  return (
    <CafesStackNav.Navigator screenOptions={screenOptions}>
      <CafesStackNav.Screen name="CafesMain" component={CafesScreen} options={{ headerShown: false }} />
      <CafesStackNav.Screen name="CafeDetail" component={CafeDetailScreen} options={{ title: '' }} />
      <CafesStackNav.Screen name="GameDetail" component={GameDetailScreen} options={{ title: '' }} />
      <CafesStackNav.Screen name="MeetupDetail" component={MeetupDetailScreen} options={{ title: 'Meetup' }} />
    </CafesStackNav.Navigator>
  );
}

const MessagesStackNav = createNativeStackNavigator();
function MessagesStack() {
  return (
    <MessagesStackNav.Navigator screenOptions={screenOptions}>
      <MessagesStackNav.Screen name="MessagesMain" component={MessagesScreen} options={{ headerShown: false }} />
      <MessagesStackNav.Screen name="ChatDetail" component={ChatDetailScreen} options={{ title: '' }} />
    </MessagesStackNav.Navigator>
  );
}

// Tab config: 4 real tabs + center placeholder
const TABS: { name: string; label: string; icon: IoniconName; iconActive: IoniconName }[] = [
  { name: 'HomeTab',     label: 'Home',     icon: 'home-outline',           iconActive: 'home' },
  { name: 'MeetupsTab', label: 'Meetups',  icon: 'people-outline',          iconActive: 'people' },
  { name: 'CafesTab',   label: 'Cafes',    icon: 'storefront-outline',      iconActive: 'storefront' },
  { name: 'MessagesTab',label: 'Messages', icon: 'chatbubble-ellipses-outline', iconActive: 'chatbubble-ellipses' },
];

function CustomTabBar({ state, descriptors, navigation }: any) {
  // Insert center + button between index 1 and 2
  const beforeCenter = state.routes.slice(0, 2);
  const afterCenter  = state.routes.slice(2);

  const renderTab = (route: any, index: number) => {
    const isFocused = state.index === index;
    const tabCfg = TABS[index];
    const onPress = () => {
      const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
      if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
    };
    return (
      <TouchableOpacity key={route.key} style={tabStyles.tab} onPress={onPress} activeOpacity={0.75}>
        <Ionicons
          name={isFocused ? tabCfg.iconActive : tabCfg.icon}
          size={22}
          color={isFocused ? colors.brand : colors.textMuted}
        />
        <Text style={[tabStyles.tabLabel, { color: isFocused ? colors.brand : colors.textMuted }]}>
          {tabCfg.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={tabStyles.bar}>
      {beforeCenter.map((r: any, i: number) => renderTab(r, i))}

      {/* Center host button */}
      <TouchableOpacity
        style={tabStyles.hostBtn}
        onPress={() => navigation.navigate('HostModal')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {afterCenter.map((r: any, i: number) => renderTab(r, i + 2))}
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab"      component={HomeStack} />
      <Tab.Screen name="MeetupsTab"   component={MeetupsStack} />
      <Tab.Screen name="CafesTab"     component={CafesStack} />
      <Tab.Screen name="MessagesTab"  component={MessagesStack} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const isAuthenticated = useStore(s => s.isAuthenticated);

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <RootStack.Screen name="Login" component={LoginScreen} />
        ) : (
          <RootStack.Screen name="Main" component={MainTabs} />
        )}
        <RootStack.Screen
          name="HostModal"
          component={HostModal}
          options={{ presentation: 'modal', headerShown: true, title: 'Host a Meetup', ...screenOptions }}
        />
        <RootStack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="ClubsTab"
          component={ClubsScreen}
          options={{ headerShown: false }}
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
          options={{ ...screenOptions, headerShown: true, title: '' }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const tabStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 20,
    paddingTop: spacing.sm,
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingTop: spacing.xs,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: 'Poppins_500Medium',
  },
  hostBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.sm,
    marginBottom: 8,
    shadowColor: colors.brand,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
});
