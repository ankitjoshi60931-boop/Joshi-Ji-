import { ReelItem, UserProfile, AppSettings, ChatThread, ChatMessage } from '../types';

export const INITIAL_APP_SETTINGS: AppSettings = {
  appName: 'Joshi Ji Reels (जोशी जी रील्स)',
  logoText: '👑 जोशी जी रील्स',
  primaryColor: '#7c3aed', // Purple
  secondaryColor: '#f97316', // Orange
  rulesHindi: '1. गाली-गलौज, अश्लील या हिंसक सामग्री कतई बर्दाश्त नहीं होगी।\n2. Instagram, TikTok, YouTube से डाउनलोड किया हुआ वॉटरमार्क वीडियो बैन होगा।\n3. सिर्फ और सिर्फ अपना ओरिजिनल देसी हुनर अपलोड करें।\n4. 10,000 व्यूज पर ₹100 की गारंटीड कमाई।',
  rulesEnglish: '1. No abusive language, vulgarity, or violent content allowed.\n2. Videos with Instagram/TikTok/YouTube watermarks are strictly prohibited.\n3. Only authentic, original creator content is allowed.\n4. Guaranteed earnings: ₹100 per 10,000 views upon reaching monetization eligibility.',
  ownerEmail: 'ankitjoshi60931@gmail.com',
  ownerUsername: 'joshiji',
  updatedAt: new Date().toISOString()
};

export const INITIAL_USERS: UserProfile[] = [
  {
    uid: 'owner_joshiji',
    phone: '+91 98260 12345',
    displayName: 'Ankit Joshi (जोशी जी)',
    username: 'joshiji',
    bio: 'संस्थापक एवं मालिक @ जोशी जी रील्स 👑 | भारत का अपना देसी वीडियो मंच 🇮🇳 | जय हिंद!',
    photoURL: '/joshi.jpg',
    isVerified: true,
    role: 'owner',
    isProfileComplete: true,
    followersCount: 148200,
    followingCount: 42,
    reelsCount: 48,
    viewsCount: 3820000,
    likesCount: 924000,
    monetizationEnabled: true,
    violationsCount: 0,
    banStatus: 'clean',
    totalEarnings: 38200,
    todayEarnings: 1240,
    pendingBalance: 8450,
    upiId: 'joshiji@okhdfcbank',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    uid: 'creator_ramesh',
    phone: '+91 98765 43210',
    displayName: 'Ramesh Desi Star',
    username: 'ramesh_comedy',
    bio: 'गाँव का छोरा, हँसी का फव्वारा 😂 हर दिन नया देसी प्रैंक और कॉमेडी!',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    isVerified: true,
    role: 'creator',
    followersCount: 24500,
    followingCount: 110,
    reelsCount: 32,
    viewsCount: 480000,
    likesCount: 98000,
    monetizationEnabled: true,
    violationsCount: 0,
    banStatus: 'clean',
    totalEarnings: 4800,
    todayEarnings: 320,
    pendingBalance: 1250,
    upiId: 'ramesh@paytm',
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    uid: 'creator_priya',
    phone: '+91 97123 45678',
    displayName: 'Priya Sharma (नृत्यांगना)',
    username: 'priya_dance',
    bio: 'राजस्थानी घूमर & क्लासिकल डांस लवर 💃 शुद्ध संस्कृति और ताल!',
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    isVerified: true,
    role: 'creator',
    followersCount: 18200,
    followingCount: 85,
    reelsCount: 22,
    viewsCount: 310000,
    likesCount: 75000,
    monetizationEnabled: true,
    violationsCount: 0,
    banStatus: 'clean',
    totalEarnings: 3100,
    todayEarnings: 180,
    pendingBalance: 900,
    upiId: 'priya@ybl',
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    uid: 'creator_kisan',
    phone: '+91 94567 89012',
    displayName: 'Kisan Veer (किसान वीर)',
    username: 'kisan_veer',
    bio: 'अन्नदाता की आवाज 🌾 आधुनिक जैविक खेती, ट्रैक्टर जुगाड़ और गांव की ताजा हवा!',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    isVerified: true,
    role: 'creator',
    followersCount: 12400,
    followingCount: 50,
    reelsCount: 16,
    viewsCount: 195000,
    likesCount: 42000,
    monetizationEnabled: true,
    violationsCount: 0,
    banStatus: 'clean',
    totalEarnings: 1950,
    todayEarnings: 110,
    pendingBalance: 650,
    upiId: 'kisanveer@sbi',
    createdAt: '2026-02-15T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_REELS: ReelItem[] = [
  {
    id: 'reel_1',
    authorId: 'owner_joshiji',
    authorUsername: 'joshiji',
    authorName: 'Ankit Joshi (जोशी जी)',
    authorPhoto: '/joshi.jpg',
    authorVerified: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
    caption: 'जोशी जी रील्स पर आप सभी का हार्दिक स्वागत है! 🙏 अपनी माटी का हुनर, अपनी पहचान। 100% असली देसी वीडियो मंच!',
    hashtags: ['#JoshiJiReels', '#DesiTalent', '#ApnaBharat', '#Swag', '#JaiShreeRam'],
    location: 'इंदौर, मध्य प्रदेश (Indore, MP)',
    musicTitle: 'Desi Dhol Dhamaka Beats',
    musicArtist: 'DJ Joshi Official',
    collaborators: ['ramesh_comedy', 'priya_dance'],
    likesCount: 12480,
    viewsCount: 89400,
    commentsCount: 452,
    sharesCount: 1820,
    status: 'approved',
    isOriginal: true,
    copyrightPassed: true,
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z'
  },
  {
    id: 'reel_2',
    authorId: 'creator_ramesh',
    authorUsername: 'ramesh_comedy',
    authorName: 'Ramesh Desi Star',
    authorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    authorVerified: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    caption: 'जब गांव में पहली बारिश होती है और खेत में ट्रैक्टर का पहिया फंस जाता है 😂 अंत तक जरूर देखना!',
    hashtags: ['#DesiComedy', '#VillageMasti', '#GaonKaChora', '#RameshJoshi', '#MonsoonVibes'],
    location: 'जयपुर, राजस्थान (Jaipur, RJ)',
    musicTitle: 'Rajasthani Folk Remix Beat',
    musicArtist: 'Manganiyar Troupe',
    collaborators: ['kisan_veer'],
    likesCount: 8920,
    viewsCount: 64200,
    commentsCount: 318,
    sharesCount: 940,
    status: 'approved',
    isOriginal: true,
    copyrightPassed: true,
    createdAt: '2026-03-02T12:30:00.000Z',
    updatedAt: '2026-03-02T12:30:00.000Z'
  },
  {
    id: 'reel_3',
    authorId: 'creator_priya',
    authorUsername: 'priya_dance',
    authorName: 'Priya Sharma (नृत्यांगना)',
    authorPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    authorVerified: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    caption: 'पारंपरिक घूमर नृत्य की एक झलक 💃 अपनी धरोहर को संजोना ही हमारा सबसे बड़ा गौरव है। जय राजपूताना!',
    hashtags: ['#Ghoomar', '#RoyalDance', '#CultureOfIndia', '#PriyaDance', '#FolkArt'],
    location: 'उदयपुर, राजस्थान (Udaipur, RJ)',
    musicTitle: 'Mhare Hiwda Mein Naache Mor',
    musicArtist: 'Folk Instrumentals',
    collaborators: [],
    likesCount: 15300,
    viewsCount: 112000,
    commentsCount: 520,
    sharesCount: 2400,
    status: 'approved',
    isOriginal: true,
    copyrightPassed: true,
    createdAt: '2026-03-03T15:45:00.000Z',
    updatedAt: '2026-03-03T15:45:00.000Z'
  },
  {
    id: 'reel_4',
    authorId: 'creator_kisan',
    authorUsername: 'kisan_veer',
    authorName: 'Kisan Veer (किसान वीर)',
    authorPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    authorVerified: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80',
    caption: 'गेहूं की नई जैविक तकनीक! बिना किसी केमिकल के बंपर पैदावार 🌾 किसान भाइयों जरूर शेयर करें!',
    hashtags: ['#KisanVeer', '#JaivikKheti', '#FarmerPower', '#IndianVillage', '#OrganicFarming'],
    location: 'करनाल, हरियाणा (Karnal, HR)',
    musicTitle: 'Dhartiputra Anthem',
    musicArtist: 'Desi Dhol Beats',
    collaborators: ['joshiji'],
    likesCount: 11400,
    viewsCount: 78900,
    commentsCount: 389,
    sharesCount: 3100,
    status: 'approved',
    isOriginal: true,
    copyrightPassed: true,
    createdAt: '2026-03-04T08:15:00.000Z',
    updatedAt: '2026-03-04T08:15:00.000Z'
  }
];

export const INITIAL_CHATS: ChatThread[] = [
  {
    id: 'chat_group_creators',
    isGroup: true,
    name: '👑 जोशी जी क्रिएटर क्लब (Joshi Ji Creators Club)',
    avatar: '/joshi.jpg',
    participants: ['owner_joshiji', 'creator_ramesh', 'creator_priya', 'creator_kisan'],
    participantNames: {
      owner_joshiji: 'जोशी जी',
      creator_ramesh: 'रमेश कॉमेडी',
      creator_priya: 'प्रिया शर्मा',
      creator_kisan: 'किसान वीर'
    },
    lastMessage: 'जोशी जी: सभी क्रिएटर नई मोनेटाइजेशन पॉलिसी देखें! 🎉',
    lastMessageTime: '10:45 AM',
    unreadCount: 2
  },
  {
    id: 'chat_ramesh',
    isGroup: false,
    name: 'Ramesh Desi Star',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    participants: ['owner_joshiji', 'creator_ramesh'],
    participantNames: {
      owner_joshiji: 'जोशी जी',
      creator_ramesh: 'रमेश कॉमेडी'
    },
    lastMessage: 'भैया कल नया वीडियो शूट कर रहा हूं, कोलैब करेंगे?',
    lastMessageTime: '09:20 AM',
    unreadCount: 1
  },
  {
    id: 'chat_priya',
    isGroup: false,
    name: 'Priya Sharma (नृत्यांगना)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    participants: ['owner_joshiji', 'creator_priya'],
    participantNames: {
      owner_joshiji: 'जोशी जी',
      creator_priya: 'प्रिया शर्मा'
    },
    lastMessage: 'थैंक यू सर! पहला पेआउट बैंक में आ गया 🙏',
    lastMessageTime: 'कल',
    unreadCount: 0
  }
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  chat_group_creators: [
    {
      id: 'msg_1',
      chatId: 'chat_group_creators',
      senderId: 'owner_joshiji',
      senderName: 'जोशी जी',
      type: 'text',
      content: 'नमस्कार सभी साथियों! जोशी जी रील्स पर अब 10,000 व्यूज पर ₹100 सीधा आपके बैंक में पहुंचेगा।',
      createdAt: '2026-03-04T10:00:00.000Z'
    },
    {
      id: 'msg_2',
      chatId: 'chat_group_creators',
      senderId: 'creator_ramesh',
      senderName: 'रमेश कॉमेडी',
      type: 'text',
      content: 'अरे वाह जोशी जी! यह तो गांव के टैलेंट के लिए वरदान साबित होगा! 👏🔥',
      createdAt: '2026-03-04T10:05:00.000Z'
    },
    {
      id: 'msg_3',
      chatId: 'chat_group_creators',
      senderId: 'creator_priya',
      senderName: 'प्रिया शर्मा',
      type: 'text',
      content: 'बहुत ही शानदार कदम! अब किसी को बाहर के ऐप्स पर जाने की जरूरत नहीं।',
      createdAt: '2026-03-04T10:12:00.000Z'
    },
    {
      id: 'msg_4',
      chatId: 'chat_group_creators',
      senderId: 'owner_joshiji',
      senderName: 'जोशी जी',
      type: 'text',
      content: 'सभी क्रिएटर नई मोनेटाइजेशन पॉलिसी देखें! 🎉',
      createdAt: '2026-03-04T10:45:00.000Z'
    }
  ],
  chat_ramesh: [
    {
      id: 'msg_r1',
      chatId: 'chat_ramesh',
      senderId: 'creator_ramesh',
      senderName: 'रमेश कॉमेडी',
      type: 'text',
      content: 'नमस्ते जोशी जी, कैसा चल रहा है सब?',
      createdAt: '2026-03-04T09:10:00.000Z'
    },
    {
      id: 'msg_r2',
      chatId: 'chat_ramesh',
      senderId: 'creator_ramesh',
      senderName: 'रमेश कॉमेडी',
      type: 'text',
      content: 'भैया कल नया वीडियो शूट कर रहा हूं, कोलैब करेंगे?',
      createdAt: '2026-03-04T09:20:00.000Z'
    }
  ],
  chat_priya: [
    {
      id: 'msg_p1',
      chatId: 'chat_priya',
      senderId: 'creator_priya',
      senderName: 'प्रिया शर्मा',
      type: 'text',
      content: 'थैंक यू सर! पहला पेआउट बैंक में आ गया 🙏',
      createdAt: '2026-03-03T18:00:00.000Z'
    }
  ]
};
