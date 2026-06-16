import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Review } from '../types';
import { colors, fontSize, spacing } from '../theme';

interface Props { review: Review }

export function ReviewItem({ review }: Props) {
  const stars = '★'.repeat(review.stars) + '☆'.repeat(5 - review.stars);
  return (
    <View style={styles.item}>
      <View style={styles.header}>
        <Text style={styles.author}>{review.author}</Text>
        <Text style={styles.stars}>{stars}</Text>
        <Text style={styles.date}>{review.date}</Text>
      </View>
      <Text style={styles.text}>{review.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: spacing.md,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    gap: spacing.xs,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  author: { fontSize: fontSize.sm, color: colors.textPrimary, fontFamily: 'Poppins_600SemiBold', flex: 1 },
  stars: { fontSize: fontSize.sm, color: colors.accentWarn },
  date: { fontSize: fontSize.xs, color: colors.textMuted, fontFamily: 'Poppins_400Regular' },
  text: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: 'Poppins_400Regular', lineHeight: 20 },
});
