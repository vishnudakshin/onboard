import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Vibe } from '../types';
import { colors, radius, fontSize } from '../theme';

const VIBE_ICONS: Record<Vibe, string> = {
  casual: '😊', competitive: '⚔️', social: '🤝', marathon: '🏃',
};

interface Props { vibe: Vibe }

export function VibeTag({ vibe }: Props) {
  const label = vibe.charAt(0).toUpperCase() + vibe.slice(1);
  return (
    <View style={styles.tag}>
      <Text style={styles.icon}>{VIBE_ICONS[vibe]}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1, borderColor: colors.border,
  },
  icon: { fontSize: 10 },
  label: { fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: 'Poppins_500Medium' },
});
