import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../../store/useStore';
import { colors, spacing, fontSize, radius } from '../../theme';
import { TopBar } from '../../components/TopBar';
import { MeetupCard } from '../../components/MeetupCard';
import { Chip } from '../../components/Chip';
import { Difficulty, Vibe } from '../../types';

type DiffFilter = Difficulty | 'all';
type VibeFilter = Vibe | 'all';
type DateFilter = 'all' | 'today' | 'week';

export function MeetupsScreen() {
  const navigation = useNavigation<any>();
  const { meetups } = useStore();
  const [diff, setDiff] = useState<DiffFilter>('all');
  const [vibe, setVibe] = useState<VibeFilter>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [seatsFilter, setSeatsFilter] = useState(false);

  const GAME_MAP_LOCAL: Record<string, any> = {};
  const { games } = useStore();
  games.forEach(g => { GAME_MAP_LOCAL[g.id] = g; });

  const filtered = meetups.filter(m => {
    if (m.status === 'completed' || m.status === 'cancelled') return false;
    if (diff !== 'all') {
      const g = GAME_MAP_LOCAL[m.gameIds[0]];
      if (!g || g.difficulty !== diff) return false;
    }
    if (vibe !== 'all' && !m.vibes.includes(vibe)) return false;
    if (dateFilter === 'today' && m.date !== 'Today') return false;
    if (seatsFilter && m.seatsFilled >= m.seatsTotal) return false;
    return true;
  });

  return (
    <View style={styles.container}>
      <TopBar />

      <View style={styles.filters}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Difficulty</Text>
          {(['all', 'light', 'medium', 'heavy'] as DiffFilter[]).map(d => (
            <Chip key={d} label={d === 'all' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)} active={diff === d} onPress={() => setDiff(d)} />
          ))}
        </View>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Vibe</Text>
          {(['all', 'casual', 'competitive', 'social', 'marathon'] as VibeFilter[]).map(v => (
            <Chip key={v} label={v === 'all' ? 'All' : v.charAt(0).toUpperCase() + v.slice(1)} active={vibe === v} onPress={() => setVibe(v)} />
          ))}
        </View>
        <View style={styles.filterRow}>
          <Chip label="Today" active={dateFilter === 'today'} onPress={() => setDateFilter(dateFilter === 'today' ? 'all' : 'today')} />
          <Chip label="Has seats" active={seatsFilter} onPress={() => setSeatsFilter(!seatsFilter)} />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={m => m.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <MeetupCard
            meetup={item}
            onPress={() => navigation.navigate('MeetupDetail', { meetupId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No meetups found</Text>
            <Text style={styles.emptySub}>Try adjusting your filters</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  filters: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, alignItems: 'center' },
  filterLabel: { fontSize: fontSize.xs, color: colors.textMuted, fontFamily: 'Poppins_500Medium', width: 64 },
  row: { gap: spacing.sm },
  list: { padding: spacing.md, gap: spacing.sm },
  empty: { alignItems: 'center', paddingTop: 80, gap: spacing.sm },
  emptyTitle: { fontSize: fontSize.xl, color: colors.textPrimary, fontFamily: 'Poppins_700Bold' },
  emptySub: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: 'Poppins_400Regular' },
});
