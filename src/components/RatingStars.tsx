import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, fontSize } from '../theme';

interface Props { rating: number | null; size?: 'sm' | 'md' }

export function RatingStars({ rating, size = 'md' }: Props) {
  const isSmall = size === 'sm';
  if (rating === null) return <Text style={[styles.text, isSmall && styles.sm, { color: colors.textMuted }]}>-- ★</Text>;
  return <Text style={[styles.text, isSmall && styles.sm]}>{rating.toFixed(1)} ★</Text>;
}

const styles = StyleSheet.create({
  text: { fontSize: fontSize.md, color: colors.accentWarn, fontFamily: 'Poppins_600SemiBold' },
  sm: { fontSize: fontSize.sm },
});
