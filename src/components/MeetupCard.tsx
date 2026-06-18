import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Meetup } from '../types';
import { GAME_MAP } from '../mockData';
import { colors, radius, fontSize, spacing } from '../theme';
import { Avatar } from './Avatar';
import { DifficultyPill } from './DifficultyPill';
import { VibeTag } from './VibeTag';
import { SeatsIndicator } from './SeatsIndicator';

interface Props {
  meetup: Meetup;
  onPress: () => void;
}

export function MeetupCard({ meetup, onPress }: Props) {
  const allGames = meetup.gameIds.map(id => GAME_MAP[id]).filter(Boolean);
  const primaryGame = allGames[0];

  const slotLabel = meetup.slots.length
    ? `${meetup.slots[0].startTime} – ${meetup.slots[meetup.slots.length - 1].endTime}`
    : '';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Game cover with name overlay only (no difficulty in header) */}
      {primaryGame && (
        <View style={styles.coverWrap}>
          <Image source={{ uri: primaryGame.coverUrl }} style={styles.cover} resizeMode="cover" />
          <View style={styles.overlay}>
            <Text style={styles.overlayTitle} numberOfLines={3}>
              {allGames.map(g => g.name).join(' + ')}
              {meetup.byoGameNames?.length ? ' + ' + meetup.byoGameNames.join(' + ') : ''}
            </Text>
          </View>
          {meetup.status === 'full' && (
            <View style={styles.fullBadge}><Text style={styles.fullText}>FULL</Text></View>
          )}
        </View>
      )}

      {/* Host row */}
      <View style={styles.hostRow}>
        <Avatar uri={meetup.host.avatarUrl} size={22} isSuperHost={false} />
        <Text style={styles.hostName} numberOfLines={1}>{meetup.host.name}</Text>
      </View>

      {/* Description: difficulty pills (same pattern for single + multi game) */}
      <View style={styles.meta}>
        <View style={styles.pillRow}>
          {allGames.map(g => (
            <DifficultyPill key={g.id} difficulty={g.difficulty} size="sm" />
          ))}
          {meetup.byoGameNames?.map(n => (
            <View key={n} style={styles.byoPill}>
              <Text style={styles.byoPillText}>BYO</Text>
            </View>
          ))}
        </View>

        {meetup.vibes.length > 0 && (
          <View style={styles.pillRow}>
            {meetup.vibes.map(v => <VibeTag key={v} vibe={v} />)}
          </View>
        )}

        <Text style={styles.cafe} numberOfLines={1}>{meetup.cafe.name}</Text>
        <Text style={styles.metaLine} numberOfLines={1}>
          {meetup.date === 'Today' ? 'Today' : meetup.date}
          {slotLabel ? `  ·  ${slotLabel}` : ''}
        </Text>

        <SeatsIndicator filled={meetup.seatsFilled} total={meetup.seatsTotal} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden',
  },

  coverWrap: { width: '100%', height: 280, position: 'relative', backgroundColor: colors.surface },
  cover: { width: '100%', height: '100%', resizeMode: 'contain' },

  overlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.60)',
    paddingHorizontal: spacing.sm, paddingVertical: spacing.sm,
  },
  overlayTitle: {
    fontSize: 12, color: '#fff',
    fontFamily: 'Poppins_700Bold', lineHeight: 17,
  },

  fullBadge: {
    position: 'absolute', top: spacing.sm, right: spacing.sm,
    backgroundColor: colors.accentWarn + 'EE',
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: radius.pill,
  },
  fullText: { fontSize: 9, color: '#000', fontFamily: 'Poppins_700Bold' },

  hostRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 5, paddingHorizontal: spacing.sm, paddingTop: spacing.sm,
  },
  hostName: {
    fontSize: 11, color: colors.textSecondary,
    fontFamily: 'Poppins_500Medium', flex: 1,
  },

  meta: { padding: spacing.sm, gap: 6 },

  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },

  byoPill: {
    backgroundColor: colors.accent + '30',
    borderRadius: radius.pill,
    paddingHorizontal: 6, paddingVertical: 1,
    borderWidth: 1, borderColor: colors.accent + '55',
  },
  byoPillText: { fontSize: 9, color: colors.accent, fontFamily: 'Poppins_600SemiBold' },

  cafe: {
    fontSize: 11, color: colors.textSecondary,
    fontFamily: 'Poppins_500Medium',
  },
  metaLine: {
    fontSize: 10, color: colors.textMuted,
    fontFamily: 'Poppins_400Regular',
  },
});
