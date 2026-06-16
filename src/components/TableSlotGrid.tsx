import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { CafeTable } from '../types';
import { colors, radius, fontSize, spacing } from '../theme';

const HOURS = ['11 am', '12 pm', '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm', '7 pm', '8 pm', '9 pm'];

const BUSY: Record<string, number[]> = {
  't1-1': [0, 1, 5, 6],
  't1-2': [3, 4],
  't1-3': [6, 7, 8],
  't1-4': [],
};

interface Props { tables: CafeTable[]; selectedSlot?: string; onSelectSlot?: (slot: string) => void }

export function TableSlotGrid({ tables, selectedSlot, onSelectSlot }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View>
        <View style={styles.headerRow}>
          <View style={styles.tableLabel} />
          {HOURS.map(h => (
            <View key={h} style={styles.slotHeader}>
              <Text style={styles.hourText}>{h}</Text>
            </View>
          ))}
        </View>
        {tables.map(table => (
          <View key={table.id} style={styles.tableRow}>
            <View style={styles.tableLabel}>
              <Text style={styles.tableName}>{table.label}</Text>
              <Text style={styles.tableSeats}>{table.seats}p</Text>
            </View>
            {HOURS.map((h, i) => {
              const busy = (BUSY[table.id] ?? []).includes(i);
              const slotKey = `${table.id}-${h}`;
              const selected = selectedSlot === slotKey;
              return (
                <TouchableOpacity
                  key={h}
                  style={[styles.slot, busy ? styles.slotBusy : styles.slotFree, selected && styles.slotSelected]}
                  onPress={() => !busy && onSelectSlot?.(slotKey)}
                  disabled={busy}
                >
                  {!busy && <Text style={[styles.slotText, selected && styles.slotTextSelected]}>Free</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', marginBottom: spacing.xs },
  tableRow: { flexDirection: 'row', marginBottom: spacing.xs },
  tableLabel: { width: 64, paddingRight: spacing.sm, justifyContent: 'center' },
  tableName: { fontSize: fontSize.xs, color: colors.textPrimary, fontFamily: 'Poppins_600SemiBold' },
  tableSeats: { fontSize: fontSize.xs, color: colors.textMuted, fontFamily: 'Poppins_400Regular' },
  slotHeader: { width: 52, alignItems: 'center', paddingBottom: 4 },
  hourText: { fontSize: 9, color: colors.textMuted, fontFamily: 'Poppins_400Regular' },
  slot: {
    width: 52, height: 36, marginRight: 2,
    borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
  },
  slotFree: { backgroundColor: colors.accentSuccess + '22', borderColor: colors.accentSuccess + '66' },
  slotBusy: { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
  slotSelected: { backgroundColor: colors.brand, borderColor: colors.brand },
  slotText: { fontSize: 9, color: colors.accentSuccess, fontFamily: 'Poppins_500Medium' },
  slotTextSelected: { color: '#fff' },
});
