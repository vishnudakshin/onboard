import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Meetup } from '../types';
import { GAME_MAP } from '../mockData';
import { colors, radius, fontSize, spacing } from '../theme';
import { Avatar } from './Avatar';
import { DifficultyPill } from './DifficultyPill';
import { VibeTag } from './VibeTag';
import { SeatsIndicator } from './SeatsIndicator';
import { DepositBadge } from './DepositBadge';
import { TimeEstimate } from './TimeEstimate';

interface Props {
  meetup: Meetup;
  onPress: () => void;
  compact?: boolean;
}

export function MeetupCard({ meetup, onPress, compact }: Props) {
  const game = GAME_MAP[meetup.gameIds[0]];
  const slotLabel = meetup.slots.length
    ? `${meetup.slots[0].startTime} – ${meetup.slots[meetup.slots.length - 1].endTime}`
    : '';
  const isToday = meetup.date === 'Today';
  const gameCount = meetup.gameIds.length;

  return (
    <TouchableOpacity style={[styles.card, compact && styles.cardCompact]} onPress={onPress} activeOpacity={0.85}>
      {/* Host row */}
      <View style={styles.hostRow}>
        <Avatar uri={meetup.host.avatarUrl} size={32} isSuperHost={meetup.host.isSuperHost} />
        <View style={styles.hostInfo}>
          <Text style={styles.hostName}>{meetup.host.name}</Text>
          {meetup.host.isSuperHost && <Text style={styles.superHost}>Super Host 🔥</Text>}
        </View>
        {gameCount > 1 && (
          <View style={styles.multiGame}>
            <Text style={styles.multiGameText}>+{gameCount - 1} more</Text>
          </View>
        )}
      </View>

      {/* Game cover */}
      {game && (
        <View style={styles.coverWrap}>
          <Image source={{ uri: game.coverUrl }} style={styles.cover} />
          <View style={styles.gameLabelWrap}>
            <Text style={styles.gameLabel}>{game.name}</Text>
          </View>
          {meetup.status === 'full' && (
            <View style={styles.fullBadge}><Text style={styles.fullText}>FULL</Text></View>
          )}
        </View>
      )}

      {/* Meta */}
      <View style={styles.meta}>
        <View style={styles.row}>
          {game && <DifficultyPill difficulty={game.difficulty} size="sm" />}
          {game && <TimeEstimate teachMin={game.teachTimeMin} playMin={game.playTimeMin} />}
          <Text style={styles.playerRange}>{game?.minPlayers}–{game?.maxPlayers} players</Text>
        </View>

        <View style={styles.row}>
          {meetup.vibes.map(v => <VibeTag key={v} vibe={v} />)}
          {meetup.beginnersWelcome && (
            <View style={styles.beginnerChip}>
              <Text style={styles.beginnerText}>Beginners welcome</Text>
            </View>
          )}
        </View>

        <Text style={styles.cafe}>{meetup.cafe.name}, {meetup.cafe.area}</Text>

        <View style={styles.row}>
          <Text style={styles.dateText}>{isToday ? '📅 Today' : `📅 ${meetup.date}`}</Text>
          <Text style={styles.slotText}>🕐 {slotLabel}</Text>
        </View>

        <View style={styles.bottomRow}>
          <SeatsIndicator filled={meetup.seatsFilled} total={meetup.seatsTotal} />
          <DepositBadge amount={meetup.depositAmount} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden',
  },
  cardCompact: { width: '100%' },
  hostRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md },
  hostInfo: { flex: 1 },
  hostName: { fontSize: fontSize.sm, color: colors.textPrimary, fontFamily: 'Poppins_600SemiBold' },
  superHost: { fontSize: fontSize.xs, color: colors.accentStreak, fontFamily: 'Poppins_500Medium' },
  multiGame: {
    backgroundColor: colors.brand + '22', borderRadius: radius.pill,
    paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1, borderColor: colors.brand,
  },
  multiGameText: { fontSize: fontSize.xs, color: colors.brand, fontFamily: 'Poppins_600SemiBold' },
  coverWrap: { width: '100%', height: 140, position: 'relative' },
  cover: { width: '100%', height: '100%' },
  gameLabelWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  gameLabel: { fontSize: fontSize.lg, color: '#fff', fontFamily: 'Poppins_700Bold' },
  fullBadge: {
    position: 'absolute', top: spacing.sm, right: spacing.sm,
    backgroundColor: colors.accentWarn + 'DD',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill,
  },
  fullText: { fontSize: fontSize.xs, color: '#000', fontFamily: 'Poppins_700Bold' },
  meta: { padding: spacing.md, gap: spacing.sm },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm },
  cafe: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: 'Poppins_400Regular' },
  dateText: { fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: 'Poppins_400Regular' },
  slotText: { fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: 'Poppins_400Regular' },
  playerRange: { fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: 'Poppins_400Regular' },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xs },
  beginnerChip: {
    backgroundColor: colors.accentSuccess + '22', borderRadius: radius.pill,
    paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: colors.accentSuccess + '66',
  },
  beginnerText: { fontSize: fontSize.xs, color: colors.accentSuccess, fontFamily: 'Poppins_500Medium' },
});
