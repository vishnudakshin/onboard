import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { BoardGame } from '../types';
import { CAFES } from '../mockData';
import { colors, radius, fontSize, spacing } from '../theme';
import { DifficultyPill } from './DifficultyPill';
import { TimeEstimate } from './TimeEstimate';

interface Props { game: BoardGame; onPress: () => void; compact?: boolean }

export function GameCard({ game, onPress, compact }: Props) {
  const cafesWithGame = CAFES.filter(c => game.cafeIds.includes(c.id)).length;
  return (
    <TouchableOpacity style={[styles.card, compact && styles.compact]} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: game.coverUrl }} style={styles.cover} />
      <View style={styles.body}>
        <Text style={styles.name}>{game.name}</Text>
        <View style={styles.row}>
          <DifficultyPill difficulty={game.difficulty} size="sm" />
          <Text style={styles.weight}>{game.weight.toFixed(1)}/5 weight</Text>
        </View>
        <TimeEstimate teachMin={game.teachTimeMin} playMin={game.playTimeMin} />
        <Text style={styles.players}>{game.minPlayers}–{game.maxPlayers} players</Text>
        <Text style={styles.blurb} numberOfLines={2}>{game.blurb}</Text>
        <Text style={styles.cafes}>Available at {cafesWithGame} cafe{cafesWithGame !== 1 ? 's' : ''}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden',
  },
  compact: { width: '100%', flexDirection: 'row' },
  cover: { width: '100%', height: 140, resizeMode: 'cover' },
  body: { padding: spacing.md, gap: spacing.xs },
  name: { fontSize: fontSize.md, color: colors.textPrimary, fontFamily: 'Poppins_700Bold' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  weight: { fontSize: fontSize.xs, color: colors.textMuted, fontFamily: 'Poppins_400Regular' },
  players: { fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: 'Poppins_400Regular' },
  blurb: { fontSize: fontSize.xs, color: colors.textMuted, fontFamily: 'Poppins_400Regular' },
  cafes: { fontSize: fontSize.xs, color: colors.brand, fontFamily: 'Poppins_500Medium' },
});
