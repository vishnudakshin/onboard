import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { BillSplit } from '../types';
import { USER_MAP } from '../mockData';
import { colors, fontSize, spacing } from '../theme';

interface Props { split: BillSplit }

export function BillSplitRow({ split }: Props) {
  const user = USER_MAP[split.userId];
  return (
    <View style={styles.row}>
      <Image source={{ uri: user?.avatarUrl }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{user?.name ?? 'Unknown'}</Text>
        <Text style={styles.sub}>Share ₹{split.share} – Deposit ₹{split.depositCredit}</Text>
      </View>
      <View style={styles.amountWrap}>
        <Text style={styles.amount}>₹{split.amountDue}</Text>
        <Text style={styles.amountLabel}>due</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  info: { flex: 1 },
  name: { fontSize: fontSize.sm, color: colors.textPrimary, fontFamily: 'Poppins_600SemiBold' },
  sub: { fontSize: fontSize.xs, color: colors.textMuted, fontFamily: 'Poppins_400Regular' },
  amountWrap: { alignItems: 'flex-end' },
  amount: { fontSize: fontSize.lg, color: colors.brand, fontFamily: 'Poppins_700Bold' },
  amountLabel: { fontSize: fontSize.xs, color: colors.textMuted, fontFamily: 'Poppins_400Regular' },
});
