import { create } from 'zustand';
import { Meetup, Chat, Cafe, BoardGame, User, Bill, Attendee } from '../types';
import { MEETUPS, MEETUP_MAP, CAFES, GAMES, CURRENT_USER, USER_MAP, CHATS, BILLS, TOURNAMENTS, GAME_MAP } from '../mockData';
import type { Tournament } from '../types';

interface AppState {
  meetups: Meetup[];
  cafes: Cafe[];
  games: BoardGame[];
  currentUser: User;
  chats: Chat[];
  bills: Bill[];
  tournaments: Tournament[];
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  joinMeetup: (meetupId: string) => void;
  cancelMeetup: (meetupId: string, userId: string) => void;
  hostMeetup: (meetup: Omit<Meetup, 'id' | 'roster' | 'seatsFilled' | 'status'>) => void;
  sendMessage: (chatId: string, text: string) => void;
  markChatRead: (chatId: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  meetups: MEETUPS,
  cafes: CAFES,
  games: GAMES,
  currentUser: CURRENT_USER,
  chats: CHATS,
  bills: BILLS,
  tournaments: TOURNAMENTS,
  isAuthenticated: false,

  login: async (email, password) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    if (!email.trim() || !password.trim()) return false;
    set({ isAuthenticated: true });
    return true;
  },

  logout: () => set({ isAuthenticated: false }),

  joinMeetup: (meetupId) => {
    set(state => ({
      meetups: state.meetups.map(m => {
        if (m.id !== meetupId) return m;
        const alreadyJoined = m.roster.some(r => r.userId === state.currentUser.id);
        if (alreadyJoined || m.seatsFilled >= m.seatsTotal) return m;
        const newAttendee: Attendee = {
          userId: state.currentUser.id,
          status: 'confirmed',
          depositPaid: m.depositAmount,
          depositCredited: 0,
          forfeitedToCafe: 0,
        };
        const newFilled = m.seatsFilled + 1;
        return {
          ...m,
          roster: [...m.roster, newAttendee],
          seatsFilled: newFilled,
          status: newFilled >= m.seatsTotal ? 'full' : m.status,
        };
      }),
    }));

    // Create/update group chat for the meetup
    const meetup = get().meetups.find(m => m.id === meetupId);
    if (!meetup) return;
    const state = get();
    const existingChat = state.chats.find(c => c.meetupId === meetupId);
    if (!existingChat) {
      const newChat: Chat = {
        id: `ch-${meetupId}`,
        type: 'group',
        meetupId,
        name: `${GAME_MAP[meetup.gameIds[0]]?.name ?? 'Meetup'} @ ${meetup.cafe.name}`,
        participants: [state.currentUser.id, ...meetup.roster.map(r => r.userId)],
        messages: [],
        lastMessage: `${state.currentUser.name} joined the meetup`,
        lastTimestamp: new Date().toISOString(),
        unreadCount: 0,
      };
      set(s => ({ chats: [newChat, ...s.chats] }));
    }
  },

  cancelMeetup: (meetupId, userId) => {
    set(state => ({
      meetups: state.meetups.map(m => {
        if (m.id !== meetupId) return m;
        return {
          ...m,
          roster: m.roster.map(r =>
            r.userId === userId
              ? { ...r, status: 'cancelledEarly' as const }
              : r
          ),
          seatsFilled: Math.max(0, m.seatsFilled - 1),
          status: 'open',
        };
      }),
    }));
  },

  hostMeetup: (meetupData) => {
    const id = `m-${Date.now()}`;
    const newMeetup: Meetup = {
      ...meetupData,
      id,
      roster: [{
        userId: meetupData.host.id,
        status: 'confirmed',
        depositPaid: meetupData.depositAmount,
        depositCredited: 0,
        forfeitedToCafe: 0,
      }],
      seatsFilled: 1,
      status: 'open',
    };

    const gameName = GAME_MAP[meetupData.gameIds[0]]?.name ?? 'Meetup';
    const newChat: Chat = {
      id: `ch-${id}`,
      type: 'group',
      meetupId: id,
      name: `${gameName} @ ${meetupData.cafe.name}`,
      participants: [meetupData.host.id],
      messages: [{
        id: `msg-${Date.now()}`,
        senderId: meetupData.host.id,
        text: `Meetup created! Join us for ${gameName} at ${meetupData.cafe.name} 🎲`,
        timestamp: new Date().toISOString(),
      }],
      lastMessage: `Meetup created! Join us for ${gameName} at ${meetupData.cafe.name} 🎲`,
      lastTimestamp: new Date().toISOString(),
      unreadCount: 0,
    };

    set(state => ({
      meetups: [newMeetup, ...state.meetups],
      chats: [newChat, ...state.chats],
    }));
  },

  sendMessage: (chatId, text) => {
    const { currentUser } = get();
    set(state => ({
      chats: state.chats.map(c => {
        if (c.id !== chatId) return c;
        const msg = {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          text,
          timestamp: new Date().toISOString(),
        };
        return { ...c, messages: [...c.messages, msg], lastMessage: text, lastTimestamp: msg.timestamp };
      }),
    }));
  },

  markChatRead: (chatId) => {
    set(state => ({
      chats: state.chats.map(c =>
        c.id === chatId ? { ...c, unreadCount: 0 } : c
      ),
    }));
  },
}));
