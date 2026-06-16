import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Cafe } from '../types';
import { colors, radius, fontSize, spacing } from '../theme';
import { RatingStars } from './RatingStars';

interface Props { cafe: Cafe; onPress: () => void; compact?: boolean }

const FREE_TABLES = 3;

export function CafeCard({ cafe, onPress, compact }: Props) {
  return (
    <TouchableOpacity style={[styles.card, compact && styles.compact]} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: cafe.photos[0] }} style={styles.image} />
        <View style={styles.tag}><Text style={styles.tagText}>☕ Board Game Cafe</Text></View>
      </View>
      <View style={styles.body}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{cafe.name}</Text>
          <RatingStars rating={cafe.rating} size="sm" />
        </View>
        <Text style={styles.area}>{cafe.area}</Text>
        <View style={styles.pills}>
          <View style={styles.pill}><Text style={styles.pillText}>₹{cafe.pricePerHour}/hr{cafe.perPerson ? '/person' : ''}</Text></View>
          <View style={styles.pill}><Text style={styles.pillText}>{cafe.gameLibraryIds.length * 20}+ games</Text></View>
        </View>
        <View style={styles.available}>
          <Text style={styles.availableText}>{FREE_TABLES} tables free now</Text>
        </View>
        {cafe.offer && (
          <Text style={styles.offer}>🎁 {cafe.offer.text}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 260,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden',
  },
  compact: { width: '100%' },
  imageWrap: { position: 'relative', height: 130 },
  image: { width: '100%', height: '100%' },
  tag: {
    position: 'absolute', bottom: spacing.sm, left: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: radius.pill,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  tagText: { fontSize: fontSize.xs, color: '#fff', fontFamily: 'Poppins_500Medium' },
  body: { padding: spacing.md, gap: spacing.xs },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: fontSize.md, color: colors.textPrimary, fontFamily: 'Poppins_700Bold', flex: 1 },
  area: { fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: 'Poppins_400Regular' },
  pills: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  pill: {
    backgroundColor: colors.surfaceAlt, borderRadius: radius.pill,
    paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: colors.border,
  },
  pillText: { fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: 'Poppins_500Medium' },
  available: { marginTop: 2 },
  availableText: { fontSize: fontSize.xs, color: colors.accentSuccess, fontFamily: 'Poppins_600SemiBold' },
  offer: { fontSize: fontSize.xs, color: colors.brand, fontFamily: 'Poppins_500Medium' },
});
