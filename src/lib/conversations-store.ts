'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ConversationMessage {
  id: string; conversationId: string; senderId: string; senderName: string; senderAvatar?: string;
  content: string; timestamp: string; isFromHost: boolean; read: boolean;
}

export interface Conversation {
  id: string; hostId: string; attendeeId: string; attendeeName: string; attendeeAvatar?: string;
  gatheringSlug: string; gatheringTitle: string; lastMessageAt: string; unreadCount: number;
}

interface State {
  conversations: Conversation[];
  messages: ConversationMessage[];
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  getConversationsByHost: (hostId: string) => Conversation[];
  getMessages: (conversationId: string) => ConversationMessage[];
  sendMessage: (conversationId: string, content: string, isFromHost: boolean) => void;
  markRead: (conversationId: string) => void;
}

const seedConversations: Conversation[] = [
  { id: 'conv-1', hostId: 'user-khaled', attendeeId: 'user-noura', attendeeName: 'نورة العنزي', attendeeAvatar: '/images/hosts/noura.jpg', gatheringSlug: 'voices-poets-evening', gatheringTitle: 'أصوات جديدة: أمسية شعراء كويتيين', lastMessageAt: new Date(Date.now() - 3600000).toISOString(), unreadCount: 2 },
  { id: 'conv-2', hostId: 'user-khaled', attendeeId: 'user-ahmad', attendeeName: 'أحمد الكندري', attendeeAvatar: '/images/hosts/abdullah.jpg', gatheringSlug: 'voices-poets-evening', gatheringTitle: 'أصوات جديدة: أمسية شعراء كويتيين', lastMessageAt: new Date(Date.now() - 86400000).toISOString(), unreadCount: 0 },
  { id: 'conv-3', hostId: 'user-khaled', attendeeId: 'user-sara', attendeeName: 'سارة المصري', attendeeAvatar: '/images/hosts/amal.jpg', gatheringSlug: 'voices-poets-evening', gatheringTitle: 'أصوات جديدة: أمسية شعراء كويتيين', lastMessageAt: new Date(Date.now() - 172800000).toISOString(), unreadCount: 0 },
];

const seedMessages: ConversationMessage[] = [
  { id: 'm-1', conversationId: 'conv-1', senderId: 'user-noura', senderName: 'نورة', senderAvatar: '/images/hosts/noura.jpg', content: 'السلام عليكم، أود السؤال إن كان بإمكاني إحضار كاميرتي الخاصة؟', timestamp: new Date(Date.now() - 7200000).toISOString(), isFromHost: false, read: true },
  { id: 'm-2', conversationId: 'conv-1', senderId: 'user-khaled', senderName: 'خالد', content: 'وعليكم السلام، بالتأكيد! الكاميرا الخاصة مرحّب بها.', timestamp: new Date(Date.now() - 7000000).toISOString(), isFromHost: true, read: true },
  { id: 'm-3', conversationId: 'conv-1', senderId: 'user-noura', senderName: 'نورة', senderAvatar: '/images/hosts/noura.jpg', content: 'رائع، شكراً جزيلاً! هل هناك لون معيّن تفضّل أن نرتديه؟', timestamp: new Date(Date.now() - 3600000).toISOString(), isFromHost: false, read: false },
  { id: 'm-4', conversationId: 'conv-1', senderId: 'user-noura', senderName: 'نورة', senderAvatar: '/images/hosts/noura.jpg', content: 'وأيضاً، هل المكان قريب من موقف سيارات؟', timestamp: new Date(Date.now() - 3500000).toISOString(), isFromHost: false, read: false },
  { id: 'm-5', conversationId: 'conv-2', senderId: 'user-ahmad', senderName: 'أحمد', senderAvatar: '/images/hosts/abdullah.jpg', content: 'هل اللمة مناسبة للمبتدئين؟', timestamp: new Date(Date.now() - 90000000).toISOString(), isFromHost: false, read: true },
  { id: 'm-6', conversationId: 'conv-2', senderId: 'user-khaled', senderName: 'خالد', content: 'نعم، اللمة مصمّمة لكل المستويات.', timestamp: new Date(Date.now() - 86400000).toISOString(), isFromHost: true, read: true },
  { id: 'm-7', conversationId: 'conv-3', senderId: 'user-sara', senderName: 'سارة', senderAvatar: '/images/hosts/amal.jpg', content: 'هل المكان سهل الوصول من حولي؟', timestamp: new Date(Date.now() - 172800000).toISOString(), isFromHost: false, read: true },
];

export const useConversationsStore = create<State>()(
  persist(
    (set, get) => ({
      conversations: seedConversations, messages: seedMessages, hasHydrated: false, setHasHydrated: (v) => set({ hasHydrated: v }),
      getConversationsByHost: (hostId) => get().conversations.filter((c) => c.hostId === hostId).sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()),
      getMessages: (conversationId) => get().messages.filter((m) => m.conversationId === conversationId).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
      sendMessage: (conversationId, content, isFromHost) => {
        const now = new Date().toISOString();
        const conv = get().conversations.find((c) => c.id === conversationId);
        if (!conv) return;
        const newMsg: ConversationMessage = { id: `m-${Date.now()}`, conversationId, senderId: isFromHost ? conv.hostId : conv.attendeeId, senderName: isFromHost ? 'خالد' : conv.attendeeName, senderAvatar: isFromHost ? undefined : conv.attendeeAvatar, content, timestamp: now, isFromHost, read: isFromHost };
        set((s) => ({ messages: [...s.messages, newMsg], conversations: s.conversations.map((c) => c.id === conversationId ? { ...c, lastMessageAt: now, unreadCount: isFromHost ? c.unreadCount : c.unreadCount + 1 } : c) }));
        if (isFromHost) {
          setTimeout(() => {
            const replies = ['شكراً على الرد', 'تمام، فهمت', 'ممتاز، نراكم قريباً', 'أقدر توفّر لي تفاصيل أكثر؟', 'وصلت المتطلبات، شكراً'];
            const reply = replies[Math.floor(Math.random() * replies.length)];
            const replyMsg: ConversationMessage = { id: `m-${Date.now()}-reply`, conversationId, senderId: conv.attendeeId, senderName: conv.attendeeName, senderAvatar: conv.attendeeAvatar, content: reply, timestamp: new Date().toISOString(), isFromHost: false, read: false };
            set((s) => ({ messages: [...s.messages, replyMsg], conversations: s.conversations.map((c) => c.id === conversationId ? { ...c, lastMessageAt: new Date().toISOString(), unreadCount: c.unreadCount + 1 } : c) }));
          }, 2000 + Math.random() * 2000);
        }
      },
      markRead: (conversationId) => set((s) => ({ messages: s.messages.map((m) => m.conversationId === conversationId ? { ...m, read: true } : m), conversations: s.conversations.map((c) => c.id === conversationId ? { ...c, unreadCount: 0 } : c) })),
    }),
    { name: 'lamma-conversations', onRehydrateStorage: () => (s) => { s?.setHasHydrated(true); } },
  ),
);
