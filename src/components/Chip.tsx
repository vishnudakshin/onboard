import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, fontSize } from '../theme';

interface Props {
  label: string;
  active?: boolean;
  onPress?: () => void;
  color?: string;
  style?: ViewStyle;
}

export function Chip({ label, active, onPress, color, style }: Props) {
  const accentColor = color ?? colors.brand;
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        active
          ? { backgroundColor: accentColor + '33', borderColor: accentColor }
          : { backgroundColor: colors.surface, borderColor: colors.border },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.label, { color: active ? accentColor : colors.textSecondary }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: radius.pill, borderWidth: 1,
  },
  label: { fontSize: fontSize.sm, fontFamily: 'Poppins_500Medium' },
});
