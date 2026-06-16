import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MeepleAward } from '../types';
import { colors, radius, fontSize, spacing } from '../theme';

interface Props { award: MeepleAward; onPress?: () => void }

const MEEPLE_ICONS: Record<string, string> = {
  tablemaster: '👑', mastermind: '🧠', 'grand-architect': '🏛️',
  'master-of-deception': '🎭', 'mind-reader': '🔮', kingmaker: '♟️',
  closer: '🏁', 'giant-slayer': '⚔️', 'heart-of-the-table': '❤️',
  'hype-engine': '🔥', 'grace-under-fire': '🕊️', 'the-glue': '🤝',
  peacekeeper: '☮️', 'the-natural': '⭐', 'lady-lucks-favourite': '🍀',
  'comeback-kid': '🚀', 'ever-present': '💪', marathoner: '🏃',
  convener: '🎪', 'city-explorer': '🗺️', polymath: '🪵',
};

export function MeepleBadge({ award, onPress }: Props) {
  const icon = MEEPLE_ICONS[award.awardKey] ?? '🪵';
  return (
    <TouchableOpacity style={styles.badge} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>{award.title}</Text>
      {award.type === 'voted' && award.votes != null && (
        <Text style={styles.votes}>{award.votes} votes</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 100, alignItems: 'center', gap: spacing.xs,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1, borderColor: colors.border,
  },
  iconWrap: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.brand + '44',
  },
  icon: { fontSize: 24 },
  title: { fontSize: fontSize.xs, color: colors.textPrimary, fontFamily: 'Poppins_600SemiBold', textAlign: 'center' },
  votes: { fontSize: fontSize.xs, color: colors.textMuted, fontFamily: 'Poppins_400Regular' },
});
