import { createServer } from 'http';
import { Server } from 'socket.io';

const PORT = 3003;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  path: '/',
  pingTimeout: 60000,
  pingInterval: 25000,
});

// ============================================
// Types
// ============================================

interface LiveAttendee {
  socketId: string;
  userId: string;
  userName: string;
  avatarUrl?: string;
  joinedAt: number;
  isHost: boolean;
}

interface LiveMessage {
  id: string;
  gatheringSlug: string;
  userId: string;
  userName: string;
  avatarUrl?: string;
  content: string;
  timestamp: number;
  isSystem: boolean;
}

interface LiveMoment {
  id: string;
  gatheringSlug: string;
  userId: string;
  userName: string;
  type: 'highlight' | 'quote' | 'photo-placeholder';
  content: string;
  hearts: number;
  timestamp: number;
}

// Per-gathering state (in-memory, PROD-ONLY: Redis)
const gatheringState = new Map<string, {
  attendees: Map<string, LiveAttendee>;
  messages: LiveMessage[];
  moments: LiveMoment[];
}>();

function getGathering(slug: string) {
  if (!gatheringState.has(slug)) {
    gatheringState.set(slug, { attendees: new Map(), messages: [], moments: [] });
  }
  return gatheringState.get(slug)!;
}

// ============================================
// Mock bots
// ============================================

const MOCK_BOTS = [
  { userId: 'bot-1', userName: 'محمد', avatarUrl: '/images/hosts/mohammed.jpg' },
  { userId: 'bot-2', userName: 'فاطمة', avatarUrl: '/images/hosts/fatima_literary.jpg' },
  { userId: 'bot-3', userName: 'عبدالله', avatarUrl: '/images/hosts/abdullah.jpg' },
];

const MOCK_MESSAGES = [
  'وصلت قبل قليل، المكان رائع!',
  'الجو حميمي جداً، أحببت هذا',
  'هل أحد يعرف إن كان هناك موقف سيارات قريب؟',
  'الضيافة ممتازة، شكراً لكم',
  'هذه اللمة مختلفة فعلاً',
  'صاحب التجمع شخص مبدع',
];

const MOCK_MOMENTS = [
  { type: 'highlight' as const, content: 'لحظة الصمت الجماعي عند قراءة القصيدة' },
  { type: 'quote' as const, content: 'الكويت ليست مكاناً، الكويت حكاية' },
  { type: 'highlight' as const, content: 'النقاش حول ذاكرة المكان كان عميقاً' },
];

function seedMockActivity(slug: string) {
  const state = getGathering(slug);
  MOCK_BOTS.slice(0, 2).forEach((bot, i) => {
    state.attendees.set(bot.userId, {
      socketId: `bot-${i}`, userId: bot.userId, userName: bot.userName,
      avatarUrl: bot.avatarUrl, joinedAt: Date.now() - (i + 1) * 60000, isHost: false,
    });
  });
  for (let i = 0; i < 3; i++) {
    const bot = MOCK_BOTS[i % MOCK_BOTS.length];
    state.messages.push({
      id: `mock-msg-${i}-${Date.now()}`, gatheringSlug: slug,
      userId: bot.userId, userName: bot.userName, avatarUrl: bot.avatarUrl,
      content: MOCK_MESSAGES[i % MOCK_MESSAGES.length],
      timestamp: Date.now() - (3 - i) * 120000, isSystem: false,
    });
  }
  const mm = MOCK_MOMENTS[0];
  state.moments.push({
    id: `mock-moment-${Date.now()}`, gatheringSlug: slug,
    userId: MOCK_BOTS[0].userId, userName: MOCK_BOTS[0].userName,
    type: mm.type, content: mm.content, hearts: 3, timestamp: Date.now() - 300000,
  });
}

function startBotSimulation(slug: string) {
  const interval = setInterval(() => {
    const state = getGathering(slug);
    if (state.attendees.size < 3) return;
    const bot = MOCK_BOTS[Math.floor(Math.random() * MOCK_BOTS.length)];
    const msg = MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];
    const newMsg: LiveMessage = {
      id: `bot-msg-${Date.now()}`, gatheringSlug: slug,
      userId: bot.userId, userName: bot.userName, avatarUrl: bot.avatarUrl,
      content: msg, timestamp: Date.now(), isSystem: false,
    };
    state.messages.push(newMsg);
    io.to(`gathering:${slug}`).emit('message:new', newMsg);
  }, 45000 + Math.random() * 45000);
  return interval;
}

// ============================================
// Socket.io handlers
// ============================================

io.on('connection', (socket) => {
  console.log(`[Live] Connected: ${socket.id}`);

  socket.on('gathering:join', (payload: {
    gatheringSlug: string; userId: string; userName: string; avatarUrl?: string; isHost: boolean;
  }) => {
    const { gatheringSlug, userId, userName, avatarUrl, isHost } = payload;
    const state = getGathering(gatheringSlug);
    if (state.attendees.size === 0 && state.messages.length === 0) {
      seedMockActivity(gatheringSlug);
      startBotSimulation(gatheringSlug);
    }
    state.attendees.set(userId, { socketId: socket.id, userId, userName, avatarUrl, joinedAt: Date.now(), isHost });
    socket.join(`gathering:${gatheringSlug}`);
    socket.data.gatheringSlug = gatheringSlug;
    socket.data.userId = userId;

    const sysMsg: LiveMessage = {
      id: `sys-${Date.now()}`, gatheringSlug, userId: 'system', userName: 'النظام',
      content: `${userName} انضم لللمة`, timestamp: Date.now(), isSystem: true,
    };
    state.messages.push(sysMsg);
    socket.emit('gathering:state', {
      attendees: Array.from(state.attendees.values()),
      messages: state.messages.slice(-50),
      moments: state.moments,
    });
    socket.to(`gathering:${gatheringSlug}`).emit('message:new', sysMsg);
    socket.to(`gathering:${gatheringSlug}`).emit('attendee:join', state.attendees.get(userId));
  });

  socket.on('message:send', (payload: { content: string }) => {
    const { gatheringSlug, userId } = socket.data;
    if (!gatheringSlug || !userId) return;
    const state = getGathering(gatheringSlug);
    const attendee = state.attendees.get(userId);
    if (!attendee) return;
    const msg: LiveMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, gatheringSlug,
      userId, userName: attendee.userName, avatarUrl: attendee.avatarUrl,
      content: payload.content.slice(0, 500), timestamp: Date.now(), isSystem: false,
    };
    state.messages.push(msg);
    io.to(`gathering:${gatheringSlug}`).emit('message:new', msg);
  });

  socket.on('moment:create', (payload: { type: 'highlight' | 'quote'; content: string }) => {
    const { gatheringSlug, userId } = socket.data;
    if (!gatheringSlug || !userId) return;
    const state = getGathering(gatheringSlug);
    const attendee = state.attendees.get(userId);
    if (!attendee) return;
    const moment: LiveMoment = {
      id: `moment-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, gatheringSlug,
      userId, userName: attendee.userName, type: payload.type,
      content: payload.content.slice(0, 200), hearts: 0, timestamp: Date.now(),
    };
    state.moments.unshift(moment);
    if (state.moments.length > 20) state.moments.pop();
    io.to(`gathering:${gatheringSlug}`).emit('moment:new', moment);
  });

  socket.on('moment:heart', (payload: { momentId: string }) => {
    const { gatheringSlug } = socket.data;
    if (!gatheringSlug) return;
    const state = getGathering(gatheringSlug);
    const moment = state.moments.find((m) => m.id === payload.momentId);
    if (moment) {
      moment.hearts++;
      io.to(`gathering:${gatheringSlug}`).emit('moment:hearted', { momentId: moment.id, hearts: moment.hearts });
    }
  });

  socket.on('typing:start', () => {
    const { gatheringSlug, userId } = socket.data;
    if (!gatheringSlug || !userId) return;
    const state = getGathering(gatheringSlug);
    const attendee = state.attendees.get(userId);
    if (attendee) socket.to(`gathering:${gatheringSlug}`).emit('typing:start', { userId, userName: attendee.userName });
  });

  socket.on('typing:stop', () => {
    const { gatheringSlug, userId } = socket.data;
    if (!gatheringSlug || !userId) return;
    socket.to(`gathering:${gatheringSlug}`).emit('typing:stop', { userId });
  });

  socket.on('disconnect', () => {
    const { gatheringSlug, userId } = socket.data;
    if (!gatheringSlug || !userId) return;
    const state = getGathering(gatheringSlug);
    const attendee = state.attendees.get(userId);
    state.attendees.delete(userId);
    if (attendee) {
      const sysMsg: LiveMessage = {
        id: `sys-${Date.now()}`, gatheringSlug, userId: 'system', userName: 'النظام',
        content: `${attendee.userName} غادر اللمة`, timestamp: Date.now(), isSystem: true,
      };
      state.messages.push(sysMsg);
      socket.to(`gathering:${gatheringSlug}`).emit('message:new', sysMsg);
      socket.to(`gathering:${gatheringSlug}`).emit('attendee:leave', { userId });
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`[Lamma Live Companion] Running on port ${PORT}`);
});
