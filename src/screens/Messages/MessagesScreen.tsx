import React from 'react';
import { View, FlatList, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../../store/useStore';
import { colors, radius, fontSize, spacing } from '../../theme';
import { TopBar } from '../../components/TopBar';

export function MessagesScreen() {
  const navigation = useNavigation<any>();
  const { chats } = useStore();

  const sortedChats = [...chats].sort((a, b) =>
    new Date(b.lastTimestamp).getTime() - new Date(a.lastTimestamp).getTime()
  );

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <TopBar showLocation={false} />
      <FlatList
        data={sortedChats}
        keyExtractor={c => c.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Text style={styles.heading}>Messages</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatRow}
            onPress={() => navigation.navigate('ChatDetail', { chatId: item.id })}
            activeOpacity={0.8}
          >
            <View style={styles.avatarWrap}>
              {item.type === 'group' ? (
                <View style={styles.groupAvatar}><Text style={styles.groupEmoji}>🎲</Text></View>
              ) : (
                <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
              )}
              {item.type === 'group' && <View style={styles.groupBadge}><Text style={styles.groupBadgeText}>G</Text></View>}
            </View>
            <View style={styles.chatInfo}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.chatTime}>{formatTime(item.lastTimestamp)}</Text>
              </View>
              <View style={styles.chatBottom}>
                <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
                {item.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadCount}>{item.unreadCount}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>💬</Text>
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptySub}>Join a meetup to start chatting!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  list: { padding: spacing.lg },
  heading: { fontSize: fontSize.xxl, color: colors.textPrimary, fontFamily: 'Poppins_700Bold', marginBottom: spacing.lg },
  chatRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  avatarWrap: { position: 'relative' },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  groupAvatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.brand + '44',
    alignItems: 'center', justifyContent: 'center',
  },
  groupEmoji: { fontSize: 24 },
  groupBadge: {
    position: 'absolute', bottom: -2, right: -2,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center',
  },
  groupBadgeText: { fontSize: 9, color: '#fff', fontFamily: 'Poppins_700Bold' },
  chatInfo: { flex: 1 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatName: { fontSize: fontSize.md, color: colors.textPrimary, fontFamily: 'Poppins_600SemiBold', flex: 1 },
  chatTime: { fontSize: fontSize.xs, color: colors.textMuted, fontFamily: 'Poppins_400Regular' },
  chatBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  lastMessage: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: 'Poppins_400Regular', flex: 1 },
  unreadBadge: {
    backgroundColor: colors.brand, borderRadius: radius.pill,
    minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6,
  },
  unreadCount: { fontSize: fontSize.xs, color: '#fff', fontFamily: 'Poppins_700Bold' },
  empty: { alignItems: 'center', paddingTop: 80, gap: spacing.sm },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: fontSize.xl, color: colors.textPrimary, fontFamily: 'Poppins_700Bold' },
  emptySub: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: 'Poppins_400Regular' },
});
