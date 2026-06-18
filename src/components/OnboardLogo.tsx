import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  size?: 'sm' | 'md';
}

const CONFIG = {
  sm: { fontSize: 10, borderWidth: 1,   paddingHorizontal: 6, paddingVertical: 1,  letterSpacing: 2.0 },
  md: { fontSize: 13, borderWidth: 1.5, paddingHorizontal: 8, paddingVertical: 2,  letterSpacing: 2.5 },
};

export function OnboardLogo({ size = 'md' }: Props) {
  const c = CONFIG[size];
  const textStyle = {
    fontFamily: 'monospace' as const,
    fontSize: c.fontSize,
    fontWeight: '800' as const,
    letterSpacing: c.letterSpacing,
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderWidth: c.borderWidth,
          paddingHorizontal: c.paddingHorizontal,
          paddingVertical: c.paddingVertical,
        },
      ]}
    >
      <Text style={[textStyle, styles.on]}>ON</Text>
      <Text style={[textStyle, styles.board]}>BOARD</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#7C3AED',
    borderRadius: 4,
  },
  on:    { color: '#C084FC' },
  board: { color: '#E9D5FF' },
});
