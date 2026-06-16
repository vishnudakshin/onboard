import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, fontSize, spacing } from '../theme';

interface Props { showedUp: number; joined: number; percent: number }

export function ReliabilityMeter({ showedUp, joined, percent }: Props) {
  const fill = percent / 100;
  const barColor = percent >= 90 ? colors.accentSuccess : percent >= 70 ? colors.brand : colors.accentWarn;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Reliability</Text>
        <Text style={[styles.percent, { color: barColor }]}>{percent}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%`, backgroundColor: barColor }]} />
      </View>
      <Text style={styles.sub}>Showed up for {showedUp}/{joined} meetups</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: fontSize.md, color: colors.textPrimary, fontFamily: 'Poppins_600SemiBold' },
  percent: { fontSize: fontSize.md, fontFamily: 'Poppins_700Bold' },
  track: { height: 8, backgroundColor: colors.surfaceAlt, borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill },
  sub: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: 'Poppins_400Regular' },
});
