import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../store/useStore';
import { colors, fontSize, spacing } from '../theme';

interface Props { showLocation?: boolean }

function initials(name: string) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
}

export function TopBar({ showLocation = true }: Props) {
  const navigation = useNavigation<any>();
  const { currentUser } = useStore();
  const goHome = () => navigation.navigate('Main', { screen: 'HomeTab' });

  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        {/* Logo — ON purple, BOARD muted near-white, solid border */}
        <TouchableOpacity onPress={goHome} activeOpacity={0.8}>
          <View style={styles.logoBox}>
            <Text style={styles.logoOn}>ON</Text>
            <Text style={styles.logoBoard}>BOARD</Text>
          </View>
        </TouchableOpacity>

        {/* Avatar → Profile */}
        <TouchableOpacity
          style={styles.avatar}
          onPress={() => navigation.navigate('ProfileScreen')}
          activeOpacity={0.85}
        >
          <Text style={styles.avatarText}>{initials(currentUser.name)}</Text>
        </TouchableOpacity>
      </View>

      {showLocation && (
        <TouchableOpacity style={styles.locationRow} activeOpacity={0.75}>
          <Text style={styles.locationLabel}>YOUR LOCATION </Text>
          <Text style={styles.locationCity}>Chennai ▾</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoBox: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: colors.brand,
    borderRadius: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  logoOn:    { fontSize: 13, fontFamily: 'Courier New', fontWeight: '800', letterSpacing: 2.4, color: colors.logoPurple },
  logoBoard: { fontSize: 13, fontFamily: 'Courier New', fontWeight: '800', letterSpacing: 2.4, color: colors.logoMuted },
  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: fontSize.sm, color: '#fff', fontFamily: 'Poppins_700Bold' },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationLabel: { fontSize: fontSize.xs, color: colors.textMuted, fontFamily: 'Poppins_500Medium', letterSpacing: 0.5 },
  locationCity:  { fontSize: fontSize.sm, color: colors.accent,    fontFamily: 'Poppins_600SemiBold' },
});
