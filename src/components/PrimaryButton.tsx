import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, fontSize, spacing } from '../theme';

interface Props {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  variant?: 'solid' | 'outline';
}

export function PrimaryButton({ label, onPress, style, disabled, variant = 'solid' }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        variant === 'outline' && styles.outline,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
    >
      <Text style={[styles.label, variant === 'outline' && styles.outlineLabel]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.brand,
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5, borderColor: colors.brand,
  },
  disabled: { opacity: 0.5 },
  label: { fontSize: fontSize.md, color: '#fff', fontFamily: 'Poppins_700Bold' },
  outlineLabel: { color: colors.brand },
});
