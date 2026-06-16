import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, fontSize } from '../theme';

interface Props { amount: number }

export function DepositBadge({ amount }: Props) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>Pay ₹{amount} to join</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.brand + '22',
    borderWidth: 1, borderColor: colors.brand,
    borderRadius: radius.pill,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  text: { fontSize: fontSize.xs, color: colors.brand, fontFamily: 'Poppins_600SemiBold' },
});
