import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Tournament } from '../types';
import { GAME_MAP } from '../mockData';
import { colors, radius, fontSize, spacing } from '../theme';

interface Props { tournament: Tournament; onPress?: () => void }

export function TournamentCard({ tournament, onPress }: Props) {
  const game = GAME_MAP[tournament.gameId];
  const spotsLeft = tournament.teamsTotal - tournament.teamsRegistered;
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🏆</Text>
        <Text style={styles.name} numberOfLines={2}>{tournament.name}</Text>
      </View>
      <Text style={styles.game}>{game?.name ?? 'Board Game'}</Text>
      <Text style={styles.cafe}>{tournament.cafe.name}, {tournament.cafe.area}</Text>
      <Text style={styles.date}>📅 {tournament.startDate}</Text>
      <View style={styles.row}>
        <Text style={styles.teams}>{tournament.teamsRegistered}/{tournament.teamsTotal} teams</Text>
        {spotsLeft <= 3 && <Text style={styles.warn}>{spotsLeft} spots left!</Text>}
      </View>
      <View style={styles.fees}>
        <Text style={styles.entry}>Entry ₹{tournament.entryFee}</Text>
        {tournament.prizePool && (
          <Text style={styles.prize}>🥇 Prize pool ₹{tournament.prizePool.toLocaleString()}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 240,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1, borderColor: colors.brand + '44',
    padding: spacing.md, gap: spacing.xs,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  emoji: { fontSize: 24 },
  name: { flex: 1, fontSize: fontSize.md, color: colors.textPrimary, fontFamily: 'Poppins_700Bold' },
  game: { fontSize: fontSize.sm, color: colors.brand, fontFamily: 'Poppins_600SemiBold' },
  cafe: { fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: 'Poppins_400Regular' },
  date: { fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: 'Poppins_400Regular' },
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  teams: { fontSize: fontSize.xs, color: colors.textMuted, fontFamily: 'Poppins_500Medium' },
  warn: { fontSize: fontSize.xs, color: colors.accentWarn, fontFamily: 'Poppins_600SemiBold' },
  fees: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  entry: { fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: 'Poppins_500Medium' },
  prize: { fontSize: fontSize.xs, color: colors.accentSuccess, fontFamily: 'Poppins_600SemiBold' },
});
