import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fontSize, spacing } from '../theme';

interface Props { showLocation?: boolean }

export function TopBar({ showLocation = true }: Props) {
  return (
    <View style={styles.bar}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>ONBOARD</Text>
      </View>
      {showLocation && (
        <TouchableOpacity style={styles.location} activeOpacity={0.8}>
          <Text style={styles.locationLabel}>YOUR LOCATION</Text>
          <View style={styles.locationRow}>
            <Text style={styles.pin}>📍</Text>
            <Text style={styles.city}>Chennai ▾</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
    backgroundColor: colors.bg,
  },
  logo: {
    borderWidth: 2, borderColor: colors.brand,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 4,
  },
  logoText: { fontSize: fontSize.sm, color: colors.brand, fontFamily: 'Poppins_700Bold', letterSpacing: 2 },
  location: { alignItems: 'flex-end' },
  locationLabel: { fontSize: fontSize.xs, color: colors.textMuted, fontFamily: 'Poppins_500Medium', letterSpacing: 1 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pin: { fontSize: 12, color: colors.brand },
  city: { fontSize: fontSize.sm, color: colors.brand, fontFamily: 'Poppins_600SemiBold' },
});
