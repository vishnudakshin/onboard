import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, TextInput, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store/useStore';
import { colors, radius, fontSize, spacing } from '../../theme';
import { TopBar } from '../../components/TopBar';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface Section {
  key: string;
  label: string;
  sub: string;
  icon: IoniconName;
  nav: string | null;
}

const SECTIONS: Section[] = [
  { key: 'meetups',     label: 'Meetups',        sub: 'Find games near you today',    icon: 'people-outline',            nav: 'MeetupsTab' },
  { key: 'cafes',       label: 'Cafes',           sub: "Browse Chennai's best spots",  icon: 'storefront-outline',        nav: 'CafesTab' },
  { key: 'tournaments', label: 'Tournaments',     sub: 'Compete and win prizes',       icon: 'trophy-outline',            nav: null },
  { key: 'clubs',       label: 'Clubs',           sub: 'Make & join gaming clubs',     icon: 'people-circle-outline',     nav: 'ClubsTab' },
  { key: 'catalogue',   label: 'Game Catalogue',  sub: '120+ games to discover',       icon: 'library-outline',           nav: 'GameCatalogue' },
];

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { width: screenWidth } = useWindowDimensions();
  const { meetups, cafes, tournaments } = useStore();
  const [search, setSearch] = useState('');

  const openMeetups = meetups.filter(m => m.status === 'open' || m.status === 'full');

  const counts: Record<string, string> = {
    meetups:     `${openMeetups.length} open now`,
    cafes:       `${cafes.length} nearby`,
    tournaments: `${tournaments.length} upcoming`,
    clubs:       'Browse all',
    catalogue:   'Browse all',
  };

  // Box width: half the screen minus 13px gutter on each side and 7px gap between boxes
  const boxWidth = (screenWidth - 26 - 7) / 2;

  // Pair into rows of 2
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

        {/* Section header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore</Text>
          <View style={styles.sectionLine} />
        </View>

        {/* Explore grid */}
        <View style={styles.grid}>
          {rows.map((row, ri) => (
            <View key={ri} style={styles.row}>
              {row.map(s =>
                s ? (
                  <TouchableOpacity
                    key={s.key}
                    style={[styles.box, { width: row[1] === null ? screenWidth - 26 : boxWidth }]}
                    activeOpacity={0.8}
                    onPress={() => s.nav && navigation.navigate(s.nav)}
                  >
                    {/* Radial glow — LinearGradient circle at bottom-right */}
                    <LinearGradient
                      colors={['rgba(124,58,237,0.28)', 'transparent']}
                      style={styles.glow}
                      pointerEvents="none"
                    />

                    <Ionicons name={s.icon} size={24} color="#C084FC" style={styles.boxIcon} />
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

  sectionHeader: {
    paddingHorizontal: 13,
    marginBottom: 9,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#F3E8FF',
    fontFamily: 'Poppins_700Bold',
  },
  sectionLine: {
    height: 2,
    width: 32,
    backgroundColor: '#7C3AED',
    borderRadius: 2,
    marginTop: 3,
  },

  grid: { paddingHorizontal: 13, gap: 7 },
  row:  { flexDirection: 'row', gap: 7 },

  box: {
    backgroundColor: '#1A1030',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(192,132,252,0.13)',
    paddingTop: 14,
    paddingHorizontal: 12,
    paddingBottom: 12,
    overflow: 'hidden',
    gap: 3,
  },

  glow: {
    position: 'absolute',
    bottom: -18,
    right: -18,
    width: 54,
    height: 54,
    borderRadius: 27,
  },

  boxIcon: { marginBottom: 2 },

  boxLabel: {
    fontSize: 14,
    color: '#F3E8FF',
    fontFamily: 'Poppins_700Bold',
  },
  boxSub: {
    fontSize: 11,
    color: '#6B4FA0',
    fontFamily: 'Poppins_500Medium',
    lineHeight: 15,
  },
  countPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(124,58,237,0.15)',
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginTop: 3,
  },
  countText: {
    fontSize: 11,
    color: '#C084FC',
    fontFamily: 'Poppins_600SemiBold',
  },
});
