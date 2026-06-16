import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, fontSize, spacing } from '../theme';

interface Props { filled: number; total: number }

export function SeatsIndicator({ filled, total }: Props) {
  const isNearlyFull = filled / total >= 0.8;
  const countColor = isNearlyFull ? colors.accentWarn : colors.accentSuccess;
  return (
    <View style={styles.container}>
      <View style={styles.dots}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i < filled ? countColor : colors.surfaceAlt, borderColor: countColor },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.label, { color: countColor }]}>{filled}/{total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.surface,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1, borderColor: colors.border,
  },
  dots: { flexDirection: 'row', gap: 3 },
  dot: { width: 7, height: 7, borderRadius: 4, borderWidth: 1 },
  label: { fontSize: fontSize.xs, fontFamily: 'Poppins_600SemiBold' },
});
