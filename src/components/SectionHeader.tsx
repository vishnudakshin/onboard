import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fontSize, spacing } from '../theme';

interface Props {
  title: string;
  onSeeAll?: () => void;
}

export function SectionHeader({ title, onSeeAll }: Props) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.underline} />
      </View>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: spacing.md },
  title: { fontSize: fontSize.lg, color: colors.textPrimary, fontFamily: 'Poppins_700Bold' },
  underline: { height: 2, width: 40, backgroundColor: colors.brand, borderRadius: 1, marginTop: 2 },
  seeAll: { fontSize: fontSize.sm, color: colors.brand, fontFamily: 'Poppins_600SemiBold' },
});
