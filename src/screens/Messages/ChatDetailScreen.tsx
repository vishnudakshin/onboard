import React, { useState, useRef } from 'react';
import { View, FlatList, Text, Image, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useStore } from '../../store/useStore';
import { USER_MAP } from '../../mockData';
import { colors, radius, fontSize, spacing } from '../../theme';

export function ChatDetailScreen() {
  const route = useRoute<any>();
  const { chatId } = route.params;
  const { chats, currentUser, sendMessage, markChatRead } = useStore();
  const chat = chats.find(c => c.id === chatId);
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);

  React.useEffect(() => { markChatRead(chatId); }, []);

  if (!chat) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(chatId, input.trim());
    setInput('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={listRef}
        data={chat.messages}
        keyExtractor={m => m.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item }) => {
          const isMe = item.senderId === currentUser.id;
          const sender = USER_MAP[item.senderId];
          return (
            <View style={[styles.msgWrap, isMe && styles.msgWrapMe]}>
              {!isMe && (
                <Image source={{ uri: sender?.avatarUrl }} style={styles.msgAvatar} />
              )}
              <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
                {!isMe && chat.type === 'group' && (
                  <Text style={styles.senderName}>{sender?.name ?? 'Unknown'}</Text>
                )}
                <Text style={[styles.msgText, isMe && styles.msgTextMe]}>{item.text}</Text>
                <Text style={[styles.msgTime, isMe && styles.msgTimeMe]}>{formatTime(item.timestamp)}</Text>
              </View>
            </View>
          );
        }}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend} activeOpacity={0.8}>
          <Text style={styles.sendIcon}>→</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  list: { padding: spacing.lg, gap: spacing.sm },
  msgWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  msgWrapMe: { flexDirection: 'row-reverse' },
  msgAvatar: { width: 28, height: 28, borderRadius: 14 },
  bubble: {
    maxWidth: '75%', borderRadius: radius.card, padding: spacing.md,
    gap: 2,
  },
  bubbleThem: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  bubbleMe: { backgroundColor: colors.brand },
  senderName: { fontSize: fontSize.xs, color: colors.brand, fontFamily: 'Poppins_600SemiBold', marginBottom: 2 },
  msgText: { fontSize: fontSize.sm, color: colors.textPrimary, fontFamily: 'Poppins_400Regular' },
  msgTextMe: { color: '#fff' },
  msgTime: { fontSize: fontSize.xs, color: colors.textMuted, fontFamily: 'Poppins_400Regular', alignSelf: 'flex-end' },
  msgTimeMe: { color: 'rgba(255,255,255,0.7)' },
  inputRow: {
    flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-end',
    padding: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
  input: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.card,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    fontSize: fontSize.sm, color: colors.textPrimary, fontFamily: 'Poppins_400Regular',
    borderWidth: 1, borderColor: colors.border, maxHeight: 100,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center',
  },
  sendIcon: { color: '#fff', fontSize: fontSize.xl, fontFamily: 'Poppins_700Bold' },
});
