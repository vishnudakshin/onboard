import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ScrollView, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStore } from '../../store/useStore';
import { colors, spacing } from '../../theme';
import { GameCard } from '../../components/GameCard';
import { Chip } from '../../components/Chip';
import { Difficulty, GameCategory } from '../../types';
import { difficultyColor } from '../../theme';

type PlayTimeFilter = 'all' | '<30' | '30-60' | '60-120' | '120+';
type PlayersFilter = 'all' | '2' | '3-4' | '5-6' | '7+';

export function GameCatalogueScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const initialDifficulty = route.params?.difficulty as Difficulty | undefined;
  const { games } = useStore();

  const [difficulties, setDifficulties] = useState<Difficulty[]>(initialDifficulty ? [initialDifficulty] : []);
  const [playTime, setPlayTime] = useState<PlayTimeFilter>('all');
  const [players, setPlayers] = useState<PlayersFilter>('all');
  const [categories, setCategories] = useState<GameCategory[]>([]);

  const toggleDiff = (d: Difficulty) =>
    setDifficulties(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const toggleCategory = (c: GameCategory) =>
    setCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const filtered = games.filter(g => {
    if (difficulties.length && !difficulties.includes(g.difficulty)) return false;
    if (categories.length && !categories.includes(g.category)) return false;
    if (playTime === '<30' && g.playTimeMin >= 30) return false;
    if (playTime === '30-60' && (g.playTimeMin < 30 || g.playTimeMin > 60)) return false;
    if (playTime === '60-120' && (g.playTimeMin < 60 || g.playTimeMin > 120)) return false;
    if (playTime === '120+' && g.playTimeMin < 120) return false;
    if (players === '2' && g.minPlayers > 2) return false;
    if (players === '3-4' && (g.maxPlayers < 3 || g.minPlayers > 4)) return false;
    if (players === '5-6' && (g.maxPlayers < 5 || g.minPlayers > 6)) return false;
    if (players === '7+' && g.maxPlayers < 7) return false;
    return true;
  });

  const DIFFS: Difficulty[] = ['light', 'medium', 'heavy'];
  const PLAY_TIMES: PlayTimeFilter[] = ['all', '<30', '30-60', '60-120', '120+'];
  const PLAYERS: PlayersFilter[] = ['all', '2', '3-4', '5-6', '7+'];
  const CATS: { key: GameCategory; label: string }[] = [
    { key: 'strategy', label: 'Strategy' }, { key: 'party', label: 'Party' },
    { key: 'family', label: 'Family' }, { key: 'coop', label: 'Co-op' },
    { key: 'deckbuilder', label: 'Deck-builder' }, { key: 'social-deduction', label: 'Social Deduction' },
  ];

  return (
    <View style={styles.container}>
      {/* Sticky filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBar}
      >
        {DIFFS.map(d => (
          <Chip
            key={d}
            label={d.charAt(0).toUpperCase() + d.slice(1)}
            active={difficulties.includes(d)}
            color={difficultyColor[d]}
            onPress={() => toggleDiff(d)}
          />
        ))}
        <View style={styles.divider} />
        {PLAY_TIMES.filter(p => p !== 'all').map(p => (
          <Chip key={p} label={p + ' min'} active={playTime === p} onPress={() => setPlayTime(playTime === p ? 'all' : p)} />
        ))}
        <View style={styles.divider} />
        {PLAYERS.filter(p => p !== 'all').map(p => (
          <Chip key={p} label={p + ' players'} active={players === p} onPress={() => setPlayers(players === p ? 'all' : p)} />
        ))}
        <View style={styles.divider} />
        {CATS.map(c => (
          <Chip key={c.key} label={c.label} active={categories.includes(c.key)} onPress={() => toggleCategory(c.key)} />
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={g => g.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <GameCard
              game={item}
              onPress={() => navigation.navigate('GameDetail', { gameId: item.id })}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No games match your filters</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  filterBar: {
    flexDirection: 'row', gap: spacing.sm,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
    alignItems: 'center',
  },
  divider: { width: 1, height: 24, backgroundColor: colors.border },
  grid: { padding: spacing.lg },
  columnWrapper: { gap: spacing.md, marginBottom: spacing.md },
  gridItem: { flex: 1 },
  empty: { textAlign: 'center', color: colors.textMuted, fontSize: 14, marginTop: 40, fontFamily: 'Poppins_400Regular' },
});
