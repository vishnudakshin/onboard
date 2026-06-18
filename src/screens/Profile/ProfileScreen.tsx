import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../store/useStore';
import { MEETUPS, GAME_MAP, USER_MAP, CAFE_MAP } from '../../mockData';
import { colors, radius, fontSize, spacing, gradient } from '../../theme';
import { TopBar } from '../../components/TopBar';
import { MeepleAward } from '../../types';

// Per-award icon mapping
const AWARD_ICONS: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  tablemaster:         'ribbon-outline',
  mastermind:          'bulb-outline',
  'grand-architect':   'construct-outline',
  'master-of-deception': 'eye-off-outline',
  'mind-reader':       'eye-outline',
  kingmaker:           'star-outline',
  closer:              'flag-outline',
  'giant-slayer':      'flash-outline',
  'heart-of-the-table': 'heart-outline',
  'hype-engine':       'megaphone-outline',
  'grace-under-fire':  'shield-outline',
  'the-glue':          'link-outline',
  peacekeeper:         'leaf-outline',
  'the-natural':       'sparkles-outline',
  "lady-lucks-favourite": 'dice-outline',
  'comeback-kid':      'rocket-outline',
  'ever-present':      'flame-outline',
  marathoner:          'timer-outline',
  convener:            'people-outline',
  'city-explorer':     'compass-outline',
  polymath:            'trophy-outline',
};

// Profile uses the unified midnight purple palette + gold for awards
const P = {
  bg:          colors.bg,
  surface:     colors.surface,
  surfaceAlt:  colors.surfaceAlt,
  gold:        colors.gold,
  goldLight:   colors.goldLight,
  awardCard:   colors.awardCard,
  awardBorder: colors.awardBorder,
  border:      colors.border,
};

export function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { currentUser } = useStore();

  const completedMeetups = MEETUPS.filter(m =>
    m.status === 'completed' && (
      m.host.id === currentUser.id ||
      m.roster.some(r => r.userId === currentUser.id)
    )
  );
  const hostedMeetups = MEETUPS.filter(m => m.host.id === currentUser.id);

  // Frequently plays with
  const coPlayerCount: Record<string, number> = {};
  completedMeetups.forEach(m => {
    [m.host.id, ...m.roster.map(r => r.userId)].forEach(id => {
      if (id !== currentUser.id) coPlayerCount[id] = (coPlayerCount[id] ?? 0) + 1;
    });
  });
  const frequentPlayers = Object.entries(coPlayerCount)
    .sort((a, b) => b[1] - a[1]).slice(0, 4)
    .map(([id]) => USER_MAP[id]).filter(Boolean);

  // Frequently plays at
  const allUserMeetups = MEETUPS.filter(m =>
    m.host.id === currentUser.id || m.roster.some(r => r.userId === currentUser.id)
  );
  const cafeCount: Record<string, number> = {};
  allUserMeetups.forEach(m => { cafeCount[m.cafe.id] = (cafeCount[m.cafe.id] ?? 0) + 1; });
  const frequentCafes = Object.entries(cafeCount)
    .sort((a, b) => b[1] - a[1]).slice(0, 3)
    .map(([id]) => CAFE_MAP[id]).filter(Boolean);

  const initials = currentUser.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();

  // Awards: sort by votes desc, show top 4, collapse rest
  const [showAllAwards, setShowAllAwards] = useState(false);
  const sortedMeeples = [...currentUser.meeples].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));
  const topMeeples  = sortedMeeples.slice(0, 4);
  const restMeeples = sortedMeeples.slice(4);
  const visibleMeeples = showAllAwards ? sortedMeeples : topMeeples;

  return (
    <ScrollView style={pStyles.container} showsVerticalScrollIndicator={false}>
      {/* TopBar in dark mode */}
      <View style={pStyles.header}>
        <TopBar showLocation={false} />
        <TouchableOpacity
          style={pStyles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={pStyles.backBtnText}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Profile section */}
      <View style={pStyles.profileSection}>
        <View style={pStyles.avatarCircle}>
          <Text style={pStyles.avatarText}>{initials}</Text>
        </View>
        <Text style={pStyles.name}>{currentUser.name}</Text>
        <Text style={pStyles.handle}>{currentUser.handle}</Text>

        <View style={pStyles.statsRow}>
          <StatBox value={completedMeetups.length} label="PLAYED" />
          <StatBox value={hostedMeetups.length} label="HOSTED" />
          <StatBox value={currentUser.followers} label="FOLLOWERS" />
          <StatBox value={currentUser.following} label="FOLLOWING" />
        </View>
      </View>

      {/* Bio */}
      {currentUser.bio && (
        <View style={pStyles.bioSection}>
          <Text style={pStyles.bioText}>{currentUser.bio}</Text>
        </View>
      )}

      {/* Reliability */}
      <View style={pStyles.reliabilitySection}>
        <View style={pStyles.reliabilityHeader}>
          <Text style={pStyles.reliabilityTitle}>RELIABILITY — {currentUser.reliability.percent}%</Text>
        </View>
        <View style={pStyles.reliabilityBar}>
          <View style={[pStyles.reliabilityFill, { width: `${currentUser.reliability.percent}%` }]} />
        </View>
        <Text style={pStyles.reliabilitySub}>
          Showed up for {currentUser.reliability.showedUp} of {currentUser.reliability.joined} meetups
        </Text>
      </View>

      {/* Meeple Awards */}
      <View style={pStyles.awardsSection}>
        <View style={pStyles.awardsTitleRow}>
          <Text style={pStyles.awardsTitle}>Meeple awards</Text>
          <View style={pStyles.meepleCount}>
            <Text style={pStyles.meepleCountText}>{sortedMeeples.length} meeples</Text>
          </View>
        </View>
        <View style={pStyles.awardsGrid}>
          {visibleMeeples.map(a => (
            <AwardCard key={a.id} award={a} />
          ))}
        </View>
        {restMeeples.length > 0 && (
          <TouchableOpacity
            style={pStyles.seeAllBtn}
            onPress={() => setShowAllAwards(v => !v)}
            activeOpacity={0.75}
          >
            <Text style={pStyles.seeAllText}>
              {showAllAwards ? 'Show less' : `See all (${restMeeples.length} more)`}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Frequently plays with */}
      {frequentPlayers.length > 0 && (
        <View style={pStyles.section}>
          <Text style={pStyles.sectionTitle}>Frequently Plays With</Text>
          <View style={pStyles.pillRow}>
            {frequentPlayers.map(u => (
              <View key={u.id} style={pStyles.playerPill}>
                <Text style={pStyles.playerPillText}>{u.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Frequently plays at */}
      {frequentCafes.length > 0 && (
        <View style={pStyles.section}>
          <Text style={pStyles.sectionTitle}>Frequently Plays At</Text>
          {frequentCafes.map(c => (
            <TouchableOpacity
              key={c.id}
              style={pStyles.cafeRow}
              onPress={() => navigation.navigate('CafeDetail', { cafeId: c.id })}
            >
              <View>
                <Text style={pStyles.cafeName}>{c.name}</Text>
                <Text style={pStyles.cafeArea}>{c.area}</Text>
              </View>
              <Text style={pStyles.cafeArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Settings */}
      <View style={[pStyles.section, { paddingBottom: 40 }]}>
        <TouchableOpacity style={pStyles.settingsRow}>
          <Text style={pStyles.settingsText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={pStyles.settingsRow}>
          <Text style={[pStyles.settingsText, { color: colors.difficultyHeavy }]}>Log out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function StatBox({ value, label }: { value: number; label: string }) {
  return (
    <View style={pStyles.statBox}>
      <Text style={pStyles.statValue}>{value}</Text>
      <Text style={pStyles.statLabel}>{label}</Text>
    </View>
  );
}

function AwardCard({ award }: { award: MeepleAward }) {
  const iconName = AWARD_ICONS[award.awardKey] ?? 'star-outline';
  const wonCount = award.votes ?? 1;
  return (
    <View style={pStyles.awardCard}>
      {/* Bottom-right warm glow */}
      <LinearGradient
        colors={gradient.awardGlow}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={pStyles.awardIconWrap}>
        <Ionicons name={iconName} size={22} color={colors.gold} />
      </View>
      <Text style={pStyles.awardTitle}>{award.title}</Text>
      <Text style={pStyles.awardSub}>{award.subtext}</Text>
      <View style={pStyles.wonPill}>
        <Text style={pStyles.wonText}>x{wonCount} won</Text>
      </View>
    </View>
  );
}

const pStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: P.bg },
  header: { position: 'relative' },
  backBtn: {
    position: 'absolute',
    right: spacing.lg,
    top: spacing.lg,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: { fontSize: fontSize.lg, color: colors.textSecondary, fontFamily: 'Poppins_500Medium' },

  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: P.border,
    gap: spacing.xs,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6D28D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: { fontSize: fontSize.xxl, color: '#fff', fontFamily: 'Poppins_700Bold' },
  name: { fontSize: fontSize.xxl, color: colors.textPrimary, fontFamily: 'Poppins_700Bold' },
  handle: { fontSize: fontSize.sm, color: colors.textMuted, fontFamily: 'Poppins_400Regular' },

  statsRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.md,
  },
  statBox: { alignItems: 'center', gap: 2 },
  statValue: { fontSize: fontSize.xxl, color: colors.textPrimary, fontFamily: 'Poppins_700Bold' },
  statLabel: { fontSize: fontSize.xs, color: colors.textMuted, fontFamily: 'Poppins_500Medium', letterSpacing: 0.5 },

  bioSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bioText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 20,
  },

  reliabilitySection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: P.border,
    gap: spacing.sm,
  },
  reliabilityHeader: { flexDirection: 'row', alignItems: 'center' },
  reliabilityTitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontFamily: 'Poppins_600SemiBold',
    letterSpacing: 0.5,
  },
  reliabilityBar: {
    height: 6,
    backgroundColor: P.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  reliabilityFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 3,
  },
  reliabilitySub: { fontSize: fontSize.xs, color: colors.textMuted, fontFamily: 'Poppins_400Regular' },

  awardsSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  awardsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  awardsTitle: { fontSize: fontSize.xl, color: colors.textPrimary, fontFamily: 'Poppins_700Bold' },
  meepleCount: {
    backgroundColor: colors.gold + '30',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.gold + '50',
  },
  meepleCountText: { fontSize: fontSize.xs, color: colors.gold, fontFamily: 'Poppins_700Bold' },

  awardsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  seeAllBtn: {
    alignSelf: 'center',
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  seeAllText: { fontSize: fontSize.sm, color: colors.accent, fontFamily: 'Poppins_600SemiBold' },

  awardCard: {
    width: '47%',
    backgroundColor: P.awardCard,
    borderRadius: radius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: P.awardBorder,
    gap: spacing.xs,
    overflow: 'hidden',
  },
  awardIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.gold + '18',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  awardTitle: { fontSize: fontSize.md, color: colors.gold, fontFamily: 'Poppins_700Bold', lineHeight: 20 },
  awardSub: { fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: 'Poppins_400Regular', lineHeight: 16, flex: 1 },
  wonPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.gold + '18',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.gold + '40',
    marginTop: spacing.xs,
  },
  wonText: { fontSize: fontSize.xs, color: colors.gold, fontFamily: 'Poppins_600SemiBold' },

  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: P.border,
    gap: spacing.sm,
  },
  sectionTitle: { fontSize: fontSize.lg, color: colors.textPrimary, fontFamily: 'Poppins_700Bold' },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  playerPill: {
    backgroundColor: P.surface,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: P.border,
  },
  playerPillText: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: 'Poppins_500Medium' },
  cafeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: P.border,
  },
  cafeName: { fontSize: fontSize.sm, color: colors.textPrimary, fontFamily: 'Poppins_600SemiBold' },
  cafeArea: { fontSize: fontSize.xs, color: colors.textMuted, fontFamily: 'Poppins_400Regular' },
  cafeArrow: { color: colors.gold, fontSize: fontSize.lg },
  settingsRow: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: P.border },
  settingsText: { fontSize: fontSize.md, color: colors.textSecondary, fontFamily: 'Poppins_500Medium' },
});
