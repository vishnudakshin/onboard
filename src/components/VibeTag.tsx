import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Vibe } from '../types';
import { colors, radius, fontSize } from '../theme';

interface Props { vibe: Vibe }

export function VibeTag({ vibe }: Props) {
  return (
    <View style={styles.tag}>
      <Text style={styles.label}>{vibe.charAt(0).toUpperCase() + vibe.slice(1)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1, borderColor: colors.border,
  },
  label: { fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: 'Poppins_500Medium' },
});
