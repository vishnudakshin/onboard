import React from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useStore } from '../../store/useStore';
import { GAME_MAP, USER_MAP, BILLS } from '../../mockData';
import { colors, radius, fontSize, spacing } from '../../theme';
import { DifficultyPill } from '../../components/DifficultyPill';
import { VibeTag } from '../../components/VibeTag';
import { SeatsIndicator } from '../../components/SeatsIndicator';
import { DepositBadge } from '../../components/DepositBadge';
import { Avatar } from '../../components/Avatar';
import { PrimaryButton } from '../../components/PrimaryButton';
import { BillSplitRow } from '../../components/BillSplitRow';

export function MeetupDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { meetupId } = route.params;
  const { meetups, currentUser, joinMeetup, cancelMeetup } = useStore();
  const meetup = meetups.find(m => m.id === meetupId);
  if (!meetup) return null;

  const games = meetup.gameIds.map(id => GAME_MAP[id]).filter(Boolean);
  const isJoined = meetup.roster.some(r => r.userId === currentUser.id && r.status === 'confirmed');
  const isFull = meetup.seatsFilled >= meetup.seatsTotal;
  const isCompleted = meetup.status === 'completed';
  const bill = BILLS.find(b => b.meetupId === meetupId);
  const slotLabel = meetup.slots.length
    ? `${meetup.slots[0].startTime} – ${meetup.slots[meetup.slots.length - 1].endTime}`
    : '';

  const handleJoin = () => {
    joinMeetup(meetupId);
    Alert.alert('Joined!', `Deposit of ₹${meetup.depositAmount} paid. You're in! 🎲`);
  };

  const handleCancel = () => {
    Alert.alert('Cancel Booking', 'Your deposit will be refunded since this is more than 2 hours before the meetup.', [
      { text: 'Keep Booking', style: 'cancel' },
      { text: 'Cancel', style: 'destructive', onPress: () => { cancelMeetup(meetupId, currentUser.id); navigation.goBack(); } },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Game Cover */}
      {games[0] && (
        <View style={styles.coverWrap}>
          <Image source={{ uri: games[0].coverUrl }} style={styles.cover} />
          <View style={styles.coverOverlay}>
            <Text style={styles.gameName}>{games.map(g => g.name).join(' + ')}</Text>
            {games[0] && <DifficultyPill difficulty={games[0].difficulty} />}
          </View>
        </View>
      )}

      <View style={styles.body}>
        {/* Host */}
        <View style={styles.hostRow}>
          <Avatar uri={meetup.host.avatarUrl} size={44} isSuperHost={meetup.host.isSuperHost} />
          <View>
            <Text style={styles.hostName}>Hosted by {meetup.host.name}</Text>
            {meetup.host.isSuperHost && <Text style={styles.superHost}>Super Host</Text>}
          </View>
        </View>

        {/* Details */}
        <View style={styles.card}>
          <Row label="Cafe" value={`${meetup.cafe.name}, ${meetup.cafe.area}`} />
          <Row label="Date" value={meetup.date === 'Today' ? 'Today' : meetup.date} />
          <Row label="Time" value={slotLabel} />
          <Row label="Est. time" value={`${meetup.estimatedTotalMin} min total`} />
          <Row label="Games" value={[...games.map(g => g.name), ...(meetup.byoGameNames ?? [])].join(', ')} />
        </View>

        {/* Vibes */}
        <View style={styles.row}>
          {meetup.vibes.map(v => <VibeTag key={v} vibe={v} />)}
          {meetup.beginnersWelcome && (
            <View style={styles.beginnerChip}><Text style={styles.beginnerText}>Beginners welcome</Text></View>
          )}
        </View>

        {/* Note */}
        {meetup.note && (
          <View style={styles.noteBox}>
            <Text style={styles.noteLabel}>Host's note</Text>
            <Text style={styles.noteText}>{meetup.note}</Text>
          </View>
        )}

        {/* Seats & Deposit */}
        <View style={styles.row}>
          <SeatsIndicator filled={meetup.seatsFilled} total={meetup.seatsTotal} />
          <DepositBadge amount={meetup.depositAmount} />
        </View>

        {/* Roster */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Players ({meetup.seatsFilled}/{meetup.seatsTotal})</Text>
          <View style={styles.avatarRow}>
            {meetup.roster.filter(r => r.status === 'confirmed').map(r => {
              const u = USER_MAP[r.userId];
              return u ? <Avatar key={r.userId} uri={u.avatarUrl} size={36} /> : null;
            })}
            {Array.from({ length: meetup.seatsTotal - meetup.seatsFilled }).map((_, i) => (
              <View key={i} style={styles.emptySlot} />
            ))}
          </View>
        </View>

        {/* Bill Split (completed) */}
        {isCompleted && bill && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bill Split</Text>
            {bill.lineItems.map(item => (
              <View key={item.label} style={styles.lineItem}>
                <Text style={styles.lineLabel}>{item.label}</Text>
                <Text style={styles.lineAmount}>₹{item.amount}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>₹{bill.total}</Text>
            </View>
            {bill.splits.map(s => <BillSplitRow key={s.userId} split={s} />)}
          </View>
        )}

        {/* Reliability rules info */}
        {!isCompleted && (
          <View style={styles.rulesBox}>
            <Text style={styles.rulesTitle}>How Pay &amp; Join works</Text>
            <Text style={styles.rulesText}>• Cancel 2+ hrs before start → full refund</Text>
            <Text style={styles.rulesText}>• No-show → deposit goes to the cafe + reliability drops</Text>
            <Text style={styles.rulesText}>• Show up → deposit credited toward your bill</Text>
          </View>
        )}

        {/* CTA */}
        {!isCompleted && (
          isJoined ? (
            <View style={styles.ctaRow}>
              <PrimaryButton label="You're in! ✓" onPress={() => {}} disabled style={{ flex: 1 }} />
              <PrimaryButton label="Cancel" variant="outline" onPress={handleCancel} style={{ flex: 1 }} />
            </View>
          ) : (
            <PrimaryButton
              label={isFull ? 'Meetup Full' : `Pay ₹${meetup.depositAmount} & Join`}
              onPress={handleJoin}
              disabled={isFull}
            />
          )
        )}
      </View>
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>
      <Text style={rowStyles.value}>{value}</Text>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  label: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: 'Poppins_400Regular' },
  value: { fontSize: fontSize.sm, color: colors.textPrimary, fontFamily: 'Poppins_600SemiBold', flex: 1, textAlign: 'right' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  coverWrap: { height: 200, position: 'relative' },
  cover: { width: '100%', height: '100%' },
  coverOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.65)',
    padding: spacing.lg, gap: spacing.sm,
  },
  gameName: { fontSize: fontSize.xxl, color: '#fff', fontFamily: 'Poppins_700Bold' },
  body: { padding: spacing.lg, gap: spacing.lg },
  hostRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  hostName: { fontSize: fontSize.md, color: colors.textPrimary, fontFamily: 'Poppins_600SemiBold' },
  superHost: { fontSize: fontSize.xs, color: colors.accentStreak, fontFamily: 'Poppins_500Medium' },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.card,
    padding: spacing.md, borderWidth: 1, borderColor: colors.border,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  noteBox: {
    backgroundColor: colors.surfaceAlt, borderRadius: radius.card,
    padding: spacing.md, borderLeftWidth: 3, borderLeftColor: colors.brand,
  },
  noteLabel: { fontSize: fontSize.xs, color: colors.brand, fontFamily: 'Poppins_600SemiBold', marginBottom: 4 },
  noteText: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: 'Poppins_400Regular' },
  section: { gap: spacing.sm },
  sectionTitle: { fontSize: fontSize.md, color: colors.textPrimary, fontFamily: 'Poppins_700Bold' },
  avatarRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  emptySlot: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed' },
  lineItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  lineLabel: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: 'Poppins_400Regular' },
  lineAmount: { fontSize: fontSize.sm, color: colors.textPrimary, fontFamily: 'Poppins_600SemiBold' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border, marginTop: spacing.xs },
  totalLabel: { fontSize: fontSize.md, color: colors.textPrimary, fontFamily: 'Poppins_700Bold' },
  totalAmount: { fontSize: fontSize.md, color: colors.brand, fontFamily: 'Poppins_700Bold' },
  rulesBox: { backgroundColor: colors.surfaceAlt, borderRadius: radius.card, padding: spacing.md, gap: spacing.xs },
  rulesTitle: { fontSize: fontSize.sm, color: colors.textPrimary, fontFamily: 'Poppins_700Bold', marginBottom: 4 },
  rulesText: { fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: 'Poppins_400Regular' },
  ctaRow: { flexDirection: 'row', gap: spacing.md },
  beginnerChip: {
    backgroundColor: colors.accentSuccess + '22', borderRadius: radius.pill,
    paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: colors.accentSuccess + '66',
  },
  beginnerText: { fontSize: fontSize.xs, color: colors.accentSuccess, fontFamily: 'Poppins_500Medium' },
});
