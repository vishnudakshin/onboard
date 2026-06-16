import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { colors } from '../theme';

interface Props {
  uri: string;
  size?: number;
  isSuperHost?: boolean;
}

export function Avatar({ uri, size = 40, isSuperHost = false }: Props) {
  return (
    <View style={[styles.wrapper, { width: size + 4, height: size + 4, borderRadius: (size + 4) / 2 }]}>
      <View style={[styles.ring, { borderRadius: (size + 4) / 2 }]} />
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2, zIndex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center' },
  ring: {
    ...StyleSheet.absoluteFill,
    borderWidth: 2,
    borderColor: colors.brand,
  },
});
