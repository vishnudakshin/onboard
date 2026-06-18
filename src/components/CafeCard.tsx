import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Cafe } from '../types';
import { colors, radius, fontSize, spacing } from '../theme';
import { RatingStars } from './RatingStars';

interface Props { cafe: Cafe; onPress: () => void }

export function CafeCard({ cafe, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: cafe.photos[0] }} style={styles.image} resizeMode="cover" />
        <View style={styles.tag}><Text style={styles.tagText}>Board Game Cafe</Text></View>
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>{cafe.name}</Text>

        <RatingStars rating={cafe.rating} size="sm" />

        <View style={styles.distanceRow}>
          <Ionicons name="location-outline" size={11} color={colors.textMuted} />
          <Text style={styles.distanceText} numberOfLines={1}>{cafe.area} · {cafe.distanceKm} km</Text>
        </View>

        <Text style={styles.detail}>{cafe.hours}</Text>
        <Text style={styles.detail}>₹{cafe.pricePerHour}{cafe.perPerson ? '/person' : '/hr'}</Text>

        {cafe.offer && (
          <Text style={styles.offer} numberOfLines={2}>{cafe.offer.text}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden',
  },
  imageWrap: { position: 'relative', height: 220 },
  image: { width: '100%', height: '100%' },
  tag: {
    position: 'absolute', bottom: spacing.sm, left: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: radius.pill,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  tagText: { fontSize: 9, color: '#fff', fontFamily: 'Poppins_500Medium' },
  body: { padding: spacing.sm, gap: 4 },
  name: {
    fontSize: 13, color: colors.textPrimary,
    fontFamily: 'Poppins_700Bold', lineHeight: 18,
  },
  distanceRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  distanceText: {
    fontSize: 10, color: colors.textMuted,
    fontFamily: 'Poppins_400Regular', flex: 1,
  },
  detail: {
    fontSize: 10, color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
  offer: {
    fontSize: 10, color: colors.brand,
    fontFamily: 'Poppins_500Medium',
  },
});
