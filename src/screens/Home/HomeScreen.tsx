import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../store/useStore';
import { colors, radius, fontSize, spacing, gradient } from '../../theme';
import { TopBar } from '../../components/TopBar';

interface Section {
  key: string;
  label: string;
  sub: string;
  nav: string | null;
}

const SECTIONS: Section[] = [
  { key: 'meetups',     label: 'Meetups',       sub: 'Find games near you today',   nav: 'MeetupsTab' },
  { key: 'cafes',       label: 'Cafes',          sub: "Browse Chennai's best spots", nav: 'CafesTab' },
  { key: 'tournaments', label: 'Tournaments',    sub: 'Compete and win prizes',      nav: null },
  { key: 'clubs',       label: 'Clubs',          sub: 'Make & join gaming clubs',    nav: 'ClubsTab' },
  { key: 'catalogue',   label: 'Game Catalogue', sub: '120+ games to discover',      nav: 'GameCatalogue' },
];

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { meetups, cafes, games, tournaments } = useStore();
  const [search, setSearch] = useState('');

  const openMeetups = meetups.filter(m => m.status === 'open' || m.status === 'full');

  const counts: Record<string, string> = {
    meetups:     `${openMeetups.length} open now`,
    cafes:       `${cafes.length} nearby`,
    tournaments: `${tournaments.length} upcoming`,
    clubs:       'Browse all',
    catalogue:   'Browse all',
  };

  // Pair into rows of 2; last odd item spans full width
  const rows: (Section | null)[][] = [];
  for (let i = 0; i < SECTIONS.length; i += 2) {
    rows.push([SECTIONS[i], SECTIONS[i + 1] ?? null]);
  }

  return (
    <View style={styles.container}>
      <TopBar />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Hero card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>BOARD GAME MEETUPS</Text>
          <Text style={styles.heroMain}>
            Find a table to <Text style={styles.heroBrand}>play.</Text>
          </Text>
          <TouchableOpacity style={styles.locationBtn} activeOpacity={0.8}>
            <View style={styles.locationDot} />
            <Text style={styles.locationBtnText}>Use current location →</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search cafes, gamers, clubs..."
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Explore grid */}
        <Text style={styles.exploreTitle}>Explore</Text>
        <View style={styles.grid}>
          {rows.map((row, ri) => (
            <View key={ri} style={styles.row}>
              {row.map(s =>
                s ? (
                  <TouchableOpacity
                    key={s.key}
                    style={[styles.box, row[1] === null && styles.boxFull]}
                    activeOpacity={0.8}
                    onPress={() => s.nav && navigation.navigate(s.nav)}
                  >
                    {/* Warm glow — radiates from bottom-right corner */}
                    <LinearGradient
                      colors={gradient.warmGlow}
                      start={{ x: 1, y: 1 }}
                      end={{ x: 0, y: 0 }}
                      style={StyleSheet.absoluteFill}
                      pointerEvents="none"
                    />
                    <Text style={styles.boxLabel}>{s.label}</Text>
                    <Text style={styles.boxSub}>{s.sub}</Text>
                    <View style={styles.countPill}>
                      <Text style={styles.countText}>{counts[s.key]}</Text>
                    </View>
                  </TouchableOpacity>
                ) : null
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content:   { paddingBottom: 40 },

  heroCard: {
    margin: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.xl,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  heroEyebrow: {
    fontSize: fontSize.xs,
    color: colors.accent,
    fontFamily: 'Poppins_600SemiBold',
    letterSpacing: 1,
  },
  heroMain: {
    fontSize: fontSize.xxxl,
    color: colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
    lineHeight: 40,
  },
  heroBrand: { color: colors.accent },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignSelf: 'flex-start',
  },
  locationDot: {
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: colors.accentSuccess,
  },
  locationBtnText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
  },

  searchWrap: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  searchInput: {
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
  },

  exploreTitle: {
    fontSize: fontSize.xl,
    color: colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },

  grid: { paddingHorizontal: spacing.lg, gap: spacing.md },
  row:  { flexDirection: 'row', gap: spacing.md },

  box: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 150,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  boxFull: { flex: 1 },

  boxLabel: {
    fontSize: fontSize.lg,
    color: colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
  },
  boxSub: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
  countPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    marginTop: spacing.sm,
  },
  countText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontFamily: 'Poppins_500Medium',
  },
});
