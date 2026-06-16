import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Difficulty } from '../types';
import { difficultyColor, colors, radius, fontSize, spacing } from '../theme';

interface Props {
  difficulty: Difficulty;
  size?: 'sm' | 'md';
}

export function DifficultyPill({ difficulty, size = 'md' }: Props) {
  const label = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  const color = difficultyColor[difficulty];
  const isSmall = size === 'sm';
  return (
    <View style={[styles.pill, { borderColor: color, backgroundColor: color + '22' }, isSmall && styles.pillSm]}>
      <View style={[styles.dot, { backgroundColor: color }, isSmall && styles.dotSm]} />
      <Text style={[styles.label, { color }, isSmall && styles.labelSm]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: radius.pill, borderWidth: 1,
  },
  pillSm: { paddingHorizontal: 8, paddingVertical: 2 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  dotSm: { width: 5, height: 5 },
  label: { fontSize: fontSize.sm, fontFamily: 'Poppins_600SemiBold' },
  labelSm: { fontSize: fontSize.xs },
});
