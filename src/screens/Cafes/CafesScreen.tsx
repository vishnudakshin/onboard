import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../../store/useStore';
import { colors, spacing, fontSize } from '../../theme';
import { TopBar } from '../../components/TopBar';
import { CafeCard } from '../../components/CafeCard';

type Sort = 'distance' | 'offers' | 'price' | 'rating';

export function CafesScreen() {
  const navigation = useNavigation<any>();
  const { cafes } = useStore();
  const [sort, setSort] = useState<Sort>('distance');

  const sorted = [...cafes].sort((a, b) => {
    if (sort === 'distance') return a.distanceKm - b.distanceKm;
    if (sort === 'price') return a.pricePerHour - b.pricePerHour;
    if (sort === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
    if (sort === 'offers') return (b.offer ? 1 : 0) - (a.offer ? 1 : 0);
    return 0;
  });

  const SORTS: { key: Sort; label: string }[] = [
    { key: 'distance', label: 'Distance' },
    { key: 'offers', label: 'Offers' },
    { key: 'price', label: 'Price ▾' },
    { key: 'rating', label: 'Rating' },
  ];

  return (
    <View style={styles.container}>
      <TopBar />
      <View style={styles.header}>
        <Text style={styles.count}>{cafes.length} Board Game Cafes In Chennai</Text>
        <View style={styles.sortRow}>
          {SORTS.map(s => (
            <TouchableOpacity
              key={s.key}
              style={[styles.sortTab, sort === s.key && styles.sortTabActive]}
              onPress={() => setSort(s.key)}
            >
              <Text style={[styles.sortLabel, sort === s.key && styles.sortLabelActive]}>{s.label}</Text>
              {sort === s.key && <View style={styles.sortUnderline} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <FlatList
        data={sorted.length % 2 !== 0 ? [...sorted, { id: '__placeholder__' } as any] : sorted}
        keyExtractor={c => c.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => item.id === '__placeholder__'
          ? <View style={{ flex: 1 }} />
          : (
          <CafeCard
            cafe={item}
            onPress={() => navigation.navigate('CafeDetail', { cafeId: item.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  count: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: 'Poppins_500Medium', marginBottom: spacing.sm },
  sortRow: { flexDirection: 'row', gap: spacing.lg },
  sortTab: { paddingBottom: spacing.sm },
  sortTabActive: {},
  sortLabel: { fontSize: fontSize.sm, color: colors.textMuted, fontFamily: 'Poppins_500Medium' },
  sortLabelActive: { color: colors.brand, fontFamily: 'Poppins_700Bold' },
  sortUnderline: { height: 2, backgroundColor: colors.brand, borderRadius: 1, marginTop: 2 },
  row: { gap: spacing.sm },
  list: { padding: spacing.md, gap: spacing.sm },
});
