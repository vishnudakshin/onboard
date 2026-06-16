import React from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../../store/useStore';
import { MEETUPS } from '../../mockData';
import { colors, radius, fontSize, spacing } from '../../theme';
import { TopBar } from '../../components/TopBar';
import { ReliabilityMeter } from '../../components/ReliabilityMeter';
import { MeepleBadge } from '../../components/MeepleBadge';
import { DifficultyPill } from '../../components/DifficultyPill';
import { VibeTag } from '../../components/VibeTag';
import { MeetupCard } from '../../components/MeetupCard';
import { GAME_MAP } from '../../mockData';

export function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { currentUser } = useStore();

  const completedMeetups = MEETUPS.filter(m =>
    m.status === 'completed' && m.roster.some(r => r.userId === currentUser.id)
  );
  const upcomingMeetups = MEETUPS.filter(m =>
    (m.status === 'open' || m.status === 'full') &&
    m.roster.some(r => r.userId === currentUser.id)
  );
  const hostedMeetups = MEETUPS.filter(m => m.host.id === currentUser.id);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TopBar showLocation={false} />

      {/* Profile header */}
      <View style={styles.header}>
        <View style={styles.avatarWrap}>
          <Image source={{ uri: currentUser.avatarUrl }} style={styles.avatar} />
          {currentUser.isSuperHost && (
            <View style={styles.superBadge}><Text>🔥</Text></View>
          )}
        </View>
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{currentUser.name}</Text>
            <TouchableOpacity style={styles.editBtn}><Text style={styles.editText}>Edit</Text></TouchableOpacity>
          </View>
          <Text style={styles.handle}>{currentUser.handle}</Text>
          {currentUser.isSuperHost && (
            <Text style={styles.superHost}>Super Host 🔥</Text>
          )}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatBox value={currentUser.followers} label="Followers" />
        <View style={styles.statDivider} />
        <StatBox value={currentUser.following} label="Following" />
        <View style={styles.statDivider} />
        <StatBox value={hostedMeetups.length} label="Hosted" />
        <View style={styles.statDivider} />
        <StatBox value={completedMeetups.length} label="Played" />
      </View>

      <View style={styles.body}>
        {/* Reliability */}
        <Section title="Reliability">
          <ReliabilityMeter
            percent={currentUser.reliability.percent}
            showedUp={currentUser.reliability.showedUp}
            joined={currentUser.reliability.joined}
          />
        </Section>

        {/* Preferred games & style */}
        <Section title="Preferred Games">
          <View style={styles.pillRow}>
            {currentUser.topGameIds.map(id => {
              const g = GAME_MAP[id];
              return g ? (
                <TouchableOpacity
                  key={id}
                  style={styles.gamePill}
                  onPress={() => navigation.navigate('GameDetail', { gameId: id })}
                >
                  <Text style={styles.gamePillText}>{g.name}</Text>
                </TouchableOpacity>
              ) : null;
            })}
          </View>
          <View style={styles.pillRow}>
            {currentUser.preferredDifficulties.map(d => <DifficultyPill key={d} difficulty={d} size="sm" />)}
            {currentUser.preferredVibes.map(v => <VibeTag key={v} vibe={v} />)}
          </View>
        </Section>

        {/* Meeple Awards */}
        <Section title={`🪵 ${currentUser.meeples.length} Meeples`}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.meeplesRow}>
            {currentUser.meeples.map(m => <MeepleBadge key={m.id} award={m} />)}
          </ScrollView>
        </Section>

        {/* Upcoming */}
        {upcomingMeetups.length > 0 && (
          <Section title="Upcoming Meetups">
            <View style={styles.meetupList}>
              {upcomingMeetups.map(m => (
                <MeetupCard
                  key={m.id}
                  meetup={m}
                  onPress={() => navigation.navigate('MeetupDetail', { meetupId: m.id })}
                  compact
                />
              ))}
            </View>
          </Section>
        )}

        {/* Hosted */}
        {hostedMeetups.length > 0 && (
          <Section title="Hosted Meetups">
            <View style={styles.meetupList}>
              {hostedMeetups.slice(0, 3).map(m => (
                <MeetupCard
                  key={m.id}
                  meetup={m}
                  onPress={() => navigation.navigate('MeetupDetail', { meetupId: m.id })}
                  compact
                />
              ))}
            </View>
          </Section>
        )}

        {/* Settings stub */}
        <Section title="">
          <TouchableOpacity style={styles.settingsRow}>
            <Text style={styles.settingsText}>⚙ Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsRow}>
            <Text style={[styles.settingsText, { color: colors.difficultyHeavy }]}>← Log out</Text>
          </TouchableOpacity>
        </Section>
      </View>
    </ScrollView>
  );
}

function StatBox({ value, label }: { value: number; label: string }) {
  return (
    <View style={statStyles.box}>
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.wrap}>
      {title ? <Text style={sectionStyles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

const statStyles = StyleSheet.create({
  box: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  value: { fontSize: fontSize.xl, color: colors.textPrimary, fontFamily: 'Poppins_700Bold' },
  label: { fontSize: fontSize.xs, color: colors.textMuted, fontFamily: 'Poppins_400Regular' },
});

const sectionStyles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  title: { fontSize: fontSize.lg, color: colors.textPrimary, fontFamily: 'Poppins_700Bold' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', gap: spacing.lg, padding: spacing.lg,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  avatarWrap: { position: 'relative' },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: colors.brand },
  superBadge: {
    position: 'absolute', bottom: -4, right: -4,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.accentStreak,
    alignItems: 'center', justifyContent: 'center',
  },
  headerInfo: { flex: 1, justifyContent: 'center', gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { fontSize: fontSize.xxl, color: colors.textPrimary, fontFamily: 'Poppins_700Bold' },
  editBtn: {
    backgroundColor: colors.surface, borderRadius: radius.pill,
    paddingHorizontal: 12, paddingVertical: 4,
    borderWidth: 1, borderColor: colors.border,
  },
  editText: { fontSize: fontSize.sm, color: colors.brand, fontFamily: 'Poppins_600SemiBold' },
  handle: { fontSize: fontSize.sm, color: colors.textMuted, fontFamily: 'Poppins_400Regular' },
  superHost: { fontSize: fontSize.sm, color: colors.accentStreak, fontFamily: 'Poppins_600SemiBold' },
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  statDivider: { width: 1, height: 32, backgroundColor: colors.border },
  body: { padding: spacing.lg, gap: spacing.xl, paddingBottom: 40 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  gamePill: {
    backgroundColor: colors.surfaceAlt, borderRadius: radius.pill,
    paddingHorizontal: 12, paddingVertical: 4,
    borderWidth: 1, borderColor: colors.brand + '44',
  },
  gamePillText: { fontSize: fontSize.sm, color: colors.brand, fontFamily: 'Poppins_600SemiBold' },
  meeplesRow: { gap: spacing.sm, paddingRight: spacing.lg },
  meetupList: { gap: spacing.md },
  settingsRow: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  settingsText: { fontSize: fontSize.md, color: colors.textSecondary, fontFamily: 'Poppins_500Medium' },
});
