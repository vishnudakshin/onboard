import React from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useStore } from '../../store/useStore';
import { CAFE_MAP } from '../../mockData';
import { colors, radius, fontSize, spacing } from '../../theme';
import { DifficultyPill } from '../../components/DifficultyPill';
import { TimeEstimate } from '../../components/TimeEstimate';
import { PrimaryButton } from '../../components/PrimaryButton';

export function GameDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { gameId } = route.params;
  const { games } = useStore();
  const game = games.find(g => g.id === gameId);
  if (!game) return null;

  const cafesWithGame = game.cafeIds.map(id => CAFE_MAP[id]).filter(Boolean);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: game.coverUrl }} style={styles.cover} />
      <View style={styles.body}>
        <Text style={styles.name}>{game.name}</Text>
        <View style={styles.pillRow}>
          <DifficultyPill difficulty={game.difficulty} />
          <View style={styles.weightBadge}>
            <Text style={styles.weightText}>⚖ {game.weight.toFixed(1)}/5 complexity</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <Stat label="Teach time" value={`${game.teachTimeMin} min`} />
          <Stat label="Play time" value={`${game.playTimeMin} min`} />
          <Stat label="Players" value={`${game.minPlayers}–${game.maxPlayers}`} />
          <Stat label="Category" value={game.category.replace('-', ' ')} />
        </View>

        <TimeEstimate teachMin={game.teachTimeMin} playMin={game.playTimeMin} />

        <View style={styles.descSection}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.blurb}>{game.blurb}</Text>
        </View>

        {cafesWithGame.length > 0 && (
          <View style={styles.descSection}>
            <Text style={styles.sectionTitle}>Available at ({cafesWithGame.length} cafes)</Text>
            {cafesWithGame.map(c => (
              <TouchableOpacity
                key={c.id}
                style={styles.cafeRow}
                onPress={() => navigation.navigate('CafeDetail', { cafeId: c.id })}
              >
                <View>
                  <Text style={styles.cafeName}>{c.name}</Text>
                  <Text style={styles.cafeArea}>{c.area}</Text>
                </View>
                <Text style={styles.cafeArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <PrimaryButton
          label={`Host a meetup with ${game.name} →`}
          onPress={() => navigation.navigate('HostModal', { gameId: game.id })}
          style={{ marginTop: spacing.xl }}
        />
      </View>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={statStyles.stat}>
      <Text style={statStyles.label}>{label}</Text>
      <Text style={statStyles.value}>{value}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  stat: { backgroundColor: colors.surfaceAlt, borderRadius: radius.sm, padding: spacing.md, flex: 1, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  label: { fontSize: fontSize.xs, color: colors.textMuted, fontFamily: 'Poppins_400Regular', marginBottom: 4 },
  value: { fontSize: fontSize.md, color: colors.textPrimary, fontFamily: 'Poppins_700Bold' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  cover: { width: '100%', height: 220 },
  body: { padding: spacing.lg, gap: spacing.lg, paddingBottom: 40 },
  name: { fontSize: fontSize.xxxl, color: colors.textPrimary, fontFamily: 'Poppins_700Bold' },
  pillRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  weightBadge: {
    backgroundColor: colors.surfaceAlt, borderRadius: radius.pill,
    paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: colors.border,
  },
  weightText: { fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: 'Poppins_500Medium' },
  statsGrid: { flexDirection: 'row', gap: spacing.sm },
  descSection: { gap: spacing.sm },
  sectionTitle: { fontSize: fontSize.lg, color: colors.textPrimary, fontFamily: 'Poppins_700Bold' },
  blurb: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: 'Poppins_400Regular', lineHeight: 22 },
  cafeRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  cafeName: { fontSize: fontSize.sm, color: colors.textPrimary, fontFamily: 'Poppins_600SemiBold' },
  cafeArea: { fontSize: fontSize.xs, color: colors.textMuted, fontFamily: 'Poppins_400Regular' },
  cafeArrow: { color: colors.brand, fontSize: fontSize.lg },
});
