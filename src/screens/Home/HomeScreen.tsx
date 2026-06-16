import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../../store/useStore';
import { colors, radius, fontSize, spacing } from '../../theme';
import { TopBar } from '../../components/TopBar';
import { SectionHeader } from '../../components/SectionHeader';
import { MeetupCard } from '../../components/MeetupCard';
import { CafeCard } from '../../components/CafeCard';
import { GameCard } from '../../components/GameCard';
import { TournamentCard } from '../../components/TournamentCard';
import { difficultyColor } from '../../theme';

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { meetups, cafes, games, tournaments } = useStore();
  const openMeetups = meetups.filter(m => m.status === 'open' || m.status === 'full');

  return (
    <View style={styles.container}>
      <TopBar />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroSub}>Find a table to</Text>
          <Text style={styles.heroMain}>
            <Text style={styles.heroNormal}>play</Text>
            <Text style={styles.heroBrand}>.</Text>
          </Text>
          <TouchableOpacity style={styles.locationBtn} activeOpacity={0.8}>
            <Text style={styles.locationDot}>◎</Text>
            <Text style={styles.locationBtnText}>Use Current Location →</Text>
          </TouchableOpacity>
        </View>

        {/* Meetups Near You */}
        <View style={styles.section}>
          <SectionHeader title="🎲 Meetups Near You" onSeeAll={() => navigation.navigate('MeetupsTab')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
            {openMeetups.slice(0, 5).map(m => (
              <MeetupCard
                key={m.id}
                meetup={m}
                onPress={() => navigation.navigate('MeetupDetail', { meetupId: m.id })}
              />
            ))}
          </ScrollView>
        </View>

        {/* Board Game Cafes */}
        <View style={styles.section}>
          <SectionHeader title="☕ Board Game Cafes" onSeeAll={() => navigation.navigate('CafesTab')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
            {cafes.map(c => (
              <CafeCard
                key={c.id}
                cafe={c}
                onPress={() => navigation.navigate('CafeDetail', { cafeId: c.id })}
              />
            ))}
          </ScrollView>
        </View>

        {/* Game Catalogue */}
        <View style={styles.section}>
          <SectionHeader title="📚 Game Catalogue" onSeeAll={() => navigation.navigate('GameCatalogue')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
            {games.map(g => (
              <GameCard
                key={g.id}
                game={g}
                onPress={() => navigation.navigate('GameDetail', { gameId: g.id })}
              />
            ))}
          </ScrollView>
        </View>

        {/* Events & Tournaments */}
        <View style={styles.section}>
          <SectionHeader title="🏆 Events & Tournaments" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
            {tournaments.map(t => (
              <TournamentCard key={t.id} tournament={t} />
            ))}
          </ScrollView>
        </View>

        {/* Browse by Difficulty */}
        <View style={styles.section}>
          <SectionHeader title="Browse by Difficulty" />
          <View style={styles.diffRow}>
            {(['light', 'medium', 'heavy'] as const).map(d => (
              <TouchableOpacity
                key={d}
                style={[styles.diffTile, { borderColor: difficultyColor[d], backgroundColor: difficultyColor[d] + '18' }]}
                onPress={() => navigation.navigate('GameCatalogue', { difficulty: d })}
                activeOpacity={0.8}
              >
                <View style={[styles.diffDot, { backgroundColor: difficultyColor[d] }]} />
                <Text style={[styles.diffLabel, { color: difficultyColor[d] }]}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 40 },
  hero: {
    padding: spacing.xxl, paddingTop: spacing.xxxl,
    borderBottomWidth: 1, borderBottomColor: colors.border,
    marginBottom: spacing.xl,
  },
  heroSub: { fontSize: fontSize.xxl, color: colors.textSecondary, fontFamily: 'Poppins_400Regular' },
  heroMain: { fontSize: fontSize.display, fontFamily: 'Poppins_700Bold', lineHeight: 48 },
  heroNormal: { color: colors.textPrimary },
  heroBrand: { color: colors.brand },
  locationBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.pill, borderWidth: 1, borderColor: colors.brand,
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
    alignSelf: 'flex-start',
  },
  locationDot: { color: colors.accentSuccess, fontSize: fontSize.lg },
  locationBtnText: { color: colors.textPrimary, fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.md },
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.xxl },
  carousel: { gap: spacing.md, paddingRight: spacing.lg },
  diffRow: { flexDirection: 'row', gap: spacing.md },
  diffTile: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: spacing.xl,
    borderRadius: radius.card, borderWidth: 1.5, gap: spacing.sm,
  },
  diffDot: { width: 12, height: 12, borderRadius: 6 },
  diffLabel: { fontSize: fontSize.md, fontFamily: 'Poppins_700Bold' },
});
