import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, fontSize } from '../theme';

interface Props { teachMin: number; playMin: number }

export function TimeEstimate({ teachMin, playMin }: Props) {
  return (
    <Text style={styles.text}>≈ {teachMin} min teach · {playMin} min play</Text>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: 'Poppins_400Regular' },
});
