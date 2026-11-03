import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Language,
  UserProfile,
  ReelItem,
  ReelComment,
  AppSettings,
  ChatThread,
  ChatMessage,
  BanStatus
} from '../types';
import { translations } from '../locales/translations';
import {
  INITIAL_USERS,
  INITIAL_REELS,
  INITIAL_APP_SETTINGS,
  INITIAL_CHATS,
  INITIAL_MESSAGES
} from '../utils/mockData';
import { calculateNextStrike } from '../utils/moderation';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.hi;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  users: UserProfile[];
  reels: ReelItem[];
  activeTab: 'feed' | 'search' | 'upload' | 'chat' | 'profile';
  setActiveTab: (tab: 'feed' | 'search' | 'upload' | 'chat' | 'profile') => void;
  activeReelIndex: number;
  setActiveReelIndex: (index: number) => void;
  comments: Record<string, ReelComment[]>;
  chats: ChatThread[];
  messages: Record<string, ChatMessage[]>;
  appSettings: AppSettings;
  updateAppSettings: (newSettings: Partial<AppSettings>) => void;
  
  // Actions
  handleLikeReel: (reelId: string) => void;
  likedReels: Set<string>;
  followingUsers: Set<string>;
  handleFollowUser: (userId: string) => void;
  handleSendGift: (reelId: string, giftType: 'heart' | 'flower' | 'mithai' | 'crown', amount: number) => boolean;
  handleAddComment: (reelId: string, text: string) => void;
  handleDeleteComment: (commentId: string, reelId: string) => void;
  handleUploadReel: (newReel: Partial<ReelItem>) => void;
  handleApproveReel: (reelId: string) => void;
  handleRejectReel: (reelId: string) => void;
  handleDeleteReel: (reelId: string) => void;
  handleToggleMonetization: (userId: string) => void;
  handleBanUser: (userId: string, status: BanStatus, reason?: string) => void;
  handleSendMessage: (chatId: string, message: Partial<ChatMessage>) => void;
  handleRecordViolation: (userId: string, reason: string) => { newCount: number; status: BanStatus; msgHindi: string; msgEng: string };
  
  // UI Dialogs
  showLanguageModal: boolean;
  setShowLanguageModal: (show: boolean) => void;
  showEarningsModal: boolean;
  setShowEarningsModal: (show: boolean) => void;
  showAdminPanel: boolean;
  setShowAdminPanel: (show: boolean) => void;
  activeCall: { active: boolean; targetUser: UserProfile | null; isRinging: boolean } | null;
  startVideoCall: (user: UserProfile) => void;
  endVideoCall: () => void;
  isOwner: boolean;
  loginWithPhone: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  hasChosenLanguageFirstTime: boolean;
  setHasChosenLanguageFirstTime: (chosen: boolean) => void;
  registerNewProfile: (profileData: {
    phone: string;
    displayName: string;
    username: string;
    bio: string;
    photoURL: string;
  }) => Promise<UserProfile>;
  findUserByPhone: (phone: string) => UserProfile | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Language initialization
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('jjr_language') as Language;
    return saved === 'en' || saved === 'hi' ? saved : 'hi';
  });

  const [hasChosenLanguageFirstTime, setHasChosenLanguageFirstTime] = useState<boolean>(() => {
    return localStorage.getItem('jjr_lang_selected') === 'true';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('jjr_language', lang);
  };

  const t = translations[language];

  // Current User (Defaults to Owner @joshiji for easy demonstration of owner admin, or can logout to test OTP)
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('jjr_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((u: UserProfile) =>
          u.uid === 'owner_joshiji' || u.username === 'joshiji' ? { ...u, photoURL: '/joshi.jpg' } : u
        );
      } catch (e) {
        console.warn('Error reading saved users:', e);
      }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(() => {
    const savedUid = localStorage.getItem('jjr_current_uid');
    if (savedUid) {
      const savedUsersStr = localStorage.getItem('jjr_users');
      let allUsers = INITIAL_USERS;
      if (savedUsersStr) {
        try {
          allUsers = JSON.parse(savedUsersStr);
        } catch (e) {
          console.warn('Error reading saved users:', e);
        }
      }
      const found = allUsers.find((u: UserProfile) => u.uid === savedUid);
      if (found) {
        return found.uid === 'owner_joshiji' ? { ...found, photoURL: '/joshi.jpg' } : found;
      }
    }
    // Return null so the Login page is presented upon opening the app
    return null;
  });

  const setCurrentUser = (user: UserProfile | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem('jjr_current_uid', user.uid);
    } else {
      localStorage.removeItem('jjr_current_uid');
    }
  };

  // Reels
  const [reels, setReels] = useState<ReelItem[]>(() => {
    const saved = localStorage.getItem('jjr_reels');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If cached reels contain mixkit URLs that fail in browser iframe, upgrade to INITIAL_REELS
          const hasBrokenUrls = parsed.some((r: ReelItem) => r.videoUrl && r.videoUrl.includes('mixkit'));
          if (!hasBrokenUrls) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Error reading saved reels:', e);
      }
    }
    return INITIAL_REELS;
  });

  const [activeTab, setActiveTab] = useState<'feed' | 'search' | 'upload' | 'chat' | 'profile'>('feed');
  const [activeReelIndex, setActiveReelIndex] = useState<number>(0);

  // App Settings
  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('jjr_app_settings');
    return saved ? JSON.parse(saved) : INITIAL_APP_SETTINGS;
  });

  const updateAppSettings = (newSettings: Partial<AppSettings>) => {
    setAppSettings(prev => {
      const updated = { ...prev, ...newSettings, updatedAt: new Date().toISOString() };
      localStorage.setItem('jjr_app_settings', JSON.stringify(updated));
      return updated;
    });
  };

  // Liked & Following states
  const [likedReels, setLikedReels] = useState<Set<string>>(new Set(['reel_1']));
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set(['creator_ramesh']));

  // Comments
  const [comments, setComments] = useState<Record<string, ReelComment[]>>({
    reel_1: [
      {
        id: 'c1',
        reelId: 'reel_1',
        authorId: 'creator_ramesh',
        authorUsername: 'ramesh_comedy',
        authorName: 'Ramesh Desi Star',
        authorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        text: 'शानदार जोशी जी! हर गांव-कस्बे में आपका डंका बज रहा है 🔥',
        createdAt: '2 घंटे पहले'
      },
      {
        id: 'c2',
        reelId: 'reel_1',
        authorId: 'creator_priya',
        authorUsername: 'priya_dance',
        authorName: 'Priya Sharma',
        authorPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
        text: 'जय भारत! बहुत ही बेहतरीन प्लेटफार्म है ❤️',
        createdAt: '1 घंटा पहले'
      }
    ],
    reel_2: [
      {
        id: 'c3',
        reelId: 'reel_2',
        authorId: 'owner_joshiji',
        authorUsername: 'joshiji',
        authorName: 'Ankit Joshi',
        authorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        text: 'हंसते-हंसते लोटपोट हो गए रमेश भाई! 😂',
        createdAt: '4 घंटे पहले'
      }
    ]
  });

  // Chats & Messages
  const [chats, setChats] = useState<ChatThread[]>(INITIAL_CHATS);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);

  // Modals
  const [showLanguageModal, setShowLanguageModal] = useState<boolean>(false);
  const [showEarningsModal, setShowEarningsModal] = useState<boolean>(false);
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);
  const [activeCall, setActiveCall] = useState<{ active: boolean; targetUser: UserProfile | null; isRinging: boolean } | null>(null);

  // Persist reels & users to localStorage
  useEffect(() => {
    localStorage.setItem('jjr_reels', JSON.stringify(reels));
  }, [reels]);

  useEffect(() => {
    localStorage.setItem('jjr_users', JSON.stringify(users));
  }, [users]);

  // Is current user the master owner @joshiji?
  const isOwner = Boolean(
    currentUser && (
      currentUser.role === 'owner' ||
      currentUser.username.toLowerCase() === 'joshiji' ||
      currentUser.uid === 'owner_joshiji'
    )
  );

  // Like Reel Handler
  const handleLikeReel = (reelId: string) => {
    setLikedReels(prev => {
      const next = new Set(prev);
      const isLiked = next.has(reelId);
      if (isLiked) {
        next.delete(reelId);
      } else {
        next.add(reelId);
      }

      setReels(current =>
        current.map(r => {
          if (r.id === reelId) {
            return {
              ...r,
              likesCount: isLiked ? Math.max(0, r.likesCount - 1) : r.likesCount + 1
            };
          }
          return r;
        })
      );

      return next;
    });
  };

  // Follow User Handler
  const handleFollowUser = (userId: string) => {
    setFollowingUsers(prev => {
      const next = new Set(prev);
      const isFollowing = next.has(userId);
      if (isFollowing) {
        next.delete(userId);
      } else {
        next.add(userId);
      }

      setUsers(currentUsers =>
        currentUsers.map(u => {
          if (u.uid === userId) {
            return {
              ...u,
              followersCount: isFollowing ? Math.max(0, u.followersCount - 1) : u.followersCount + 1
            };
          }
          return u;
        })
      );

      return next;
    });
  };

  // Send Gift Handler (Heart ₹10, Flower ₹50, Mithai ₹100, Crown ₹500)
  const handleSendGift = (reelId: string, giftType: 'heart' | 'flower' | 'mithai' | 'crown', amount: number): boolean => {
    const targetReel = reels.find(r => r.id === reelId);
    if (!targetReel) return false;

    // Credit creator earnings
    setUsers(currUsers =>
      currUsers.map(u => {
        if (u.uid === targetReel.authorId) {
          return {
            ...u,
            totalEarnings: (u.totalEarnings || 0) + amount,
            todayEarnings: (u.todayEarnings || 0) + amount,
            pendingBalance: (u.pendingBalance || 0) + amount
          };
        }
        return u;
      })
    );

    // If current user is also updated, update currentUser state
    if (currentUser?.uid === targetReel.authorId) {
      setCurrentUser({
        ...currentUser,
        totalEarnings: (currentUser.totalEarnings || 0) + amount,
        todayEarnings: (currentUser.todayEarnings || 0) + amount,
        pendingBalance: (currentUser.pendingBalance || 0) + amount
      });
    }

    return true;
  };

  // Add Comment Handler
  const handleAddComment = (reelId: string, text: string) => {
    if (!currentUser || !text.trim()) return;

    const newComment: ReelComment = {
      id: `comment_${Date.now()}`,
      reelId,
      authorId: currentUser.uid,
      authorUsername: currentUser.username,
      authorName: currentUser.displayName,
      authorPhoto: currentUser.photoURL,
      text: text.trim(),
      createdAt: 'अभी-अभी'
    };

    setComments(prev => ({
      ...prev,
      [reelId]: [newComment, ...(prev[reelId] || [])]
    }));

    setReels(current =>
      current.map(r => {
        if (r.id === reelId) {
          return { ...r, commentsCount: (r.commentsCount || 0) + 1 };
        }
        return r;
      })
    );
  };

  // Delete Comment (by comment author or admin)
  const handleDeleteComment = (commentId: string, reelId: string) => {
    setComments(prev => ({
      ...prev,
      [reelId]: (prev[reelId] || []).filter(c => c.id !== commentId)
    }));
    setReels(current =>
      current.map(r => {
        if (r.id === reelId) {
          return { ...r, commentsCount: Math.max(0, (r.commentsCount || 1) - 1) };
        }
        return r;
      })
    );
  };

  // Upload Reel Handler
  const handleUploadReel = (newReelData: Partial<ReelItem>) => {
    if (!currentUser) return;

    const newReel: ReelItem = {
      id: `reel_${Date.now()}`,
      authorId: currentUser.uid,
      authorUsername: currentUser.username,
      authorName: currentUser.displayName,
      authorPhoto: currentUser.photoURL,
      authorVerified: currentUser.isVerified,
      videoUrl: newReelData.videoUrl || '',
      thumbnailUrl: newReelData.thumbnailUrl || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
      caption: newReelData.caption || '',
      hashtags: newReelData.hashtags || ['#JoshiJiReels'],
      location: newReelData.location || 'भारत (India)',
      musicTitle: newReelData.musicTitle || 'Original Audio',
      musicArtist: newReelData.musicArtist || currentUser.displayName,
      collaborators: newReelData.collaborators || [],
      likesCount: 0,
      viewsCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      status: 'approved',
      isOriginal: true,
      copyrightPassed: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...newReelData
    };

    setReels(prev => [newReel, ...prev]);

    // Update user reel count
    setUsers(curr =>
      curr.map(u => {
        if (u.uid === currentUser.uid) {
          return { ...u, reelsCount: (u.reelsCount || 0) + 1 };
        }
        return u;
      })
    );

    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        reelsCount: (currentUser.reelsCount || 0) + 1
      });
    }
  };

  // Moderation Strike recorder
  const handleRecordViolation = (userId: string, reason: string) => {
    const target = users.find(u => u.uid === userId) || currentUser;
    const currentCount = target?.violationsCount || 0;
    const strike = calculateNextStrike(currentCount);

    setUsers(curr =>
      curr.map(u => {
        if (u.uid === userId) {
          return {
            ...u,
            violationsCount: strike.newCount,
            banStatus: strike.banStatus,
            monetizationEnabled: strike.banStatus === 'banned' ? false : u.monetizationEnabled
          };
        }
        return u;
      })
    );

    if (currentUser?.uid === userId) {
      setCurrentUser({
        ...currentUser,
        violationsCount: strike.newCount,
        banStatus: strike.banStatus,
        monetizationEnabled: strike.banStatus === 'banned' ? false : currentUser.monetizationEnabled
      });
    }

    return {
      newCount: strike.newCount,
      status: strike.banStatus,
      msgHindi: strike.messageHindi,
      msgEng: strike.messageEnglish
    };
  };

  // Admin Controls
  const handleApproveReel = (reelId: string) => {
    setReels(prev => prev.map(r => r.id === reelId ? { ...r, status: 'approved' } : r));
  };

  const handleRejectReel = (reelId: string) => {
    setReels(prev => prev.map(r => r.id === reelId ? { ...r, status: 'rejected' } : r));
  };

  const handleDeleteReel = (reelId: string) => {
    setReels(prev => prev.filter(r => r.id !== reelId));
  };

  const handleToggleMonetization = (userId: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.uid === userId) {
          return { ...u, monetizationEnabled: !u.monetizationEnabled };
        }
        return u;
      })
    );
    if (currentUser?.uid === userId) {
      setCurrentUser({ ...currentUser, monetizationEnabled: !currentUser.monetizationEnabled });
    }
  };

  const handleBanUser = (userId: string, status: BanStatus) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.uid === userId) {
          return {
            ...u,
            banStatus: status,
            monetizationEnabled: status === 'banned' ? false : u.monetizationEnabled
          };
        }
        return u;
      })
    );
    if (currentUser?.uid === userId) {
      setCurrentUser({ ...currentUser, banStatus: status });
    }
  };

  // Chat message send
  const handleSendMessage = (chatId: string, messageData: Partial<ChatMessage>) => {
    if (!currentUser) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      chatId,
      senderId: currentUser.uid,
      senderName: currentUser.displayName,
      senderPhoto: currentUser.photoURL,
      type: messageData.type || 'text',
      content: messageData.content || '',
      mediaUrl: messageData.mediaUrl,
      voiceDurationSeconds: messageData.voiceDurationSeconds,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMsg]
    }));

    // Update last message in chat list
    setChats(prev =>
      prev.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            lastMessage: `${currentUser.displayName}: ${newMsg.content || (newMsg.type === 'voice' ? '🎤 वॉइस मैसेज' : '📷 मीडिया')}`,
            lastMessageTime: 'अभी'
          };
        }
        return c;
      })
    );
  };

  // Video Call simulation
  const startVideoCall = (targetUser: UserProfile) => {
    setActiveCall({
      active: true,
      targetUser,
      isRinging: true
    });
    // Auto pickup simulation after 2.5 seconds
    setTimeout(() => {
      setActiveCall(prev => prev ? { ...prev, isRinging: false } : null);
    }, 2500);
  };

  const endVideoCall = () => {
    setActiveCall(null);
  };

  // Find user by phone (supports full or last 10 digits)
  const findUserByPhone = (phone: string): UserProfile | undefined => {
    const clean = phone.replace(/\D/g, '');
    if (clean.length < 10) return undefined;
    const target10 = clean.slice(-10);
    return users.find(u => {
      const uClean = u.phone.replace(/\D/g, '');
      return uClean.slice(-10) === target10;
    });
  };

  // Login with OTP for existing user
  const loginWithPhone = async (phone: string, otp: string): Promise<boolean> => {
    const existing = findUserByPhone(phone);
    if (existing) {
      setCurrentUser(existing);
      return true;
    }
    return false;
  };

  // Step 3 Profile Creator: Register New User Profile
  const registerNewProfile = async (profileData: {
    phone: string;
    displayName: string;
    username: string;
    bio: string;
    photoURL: string;
  }): Promise<UserProfile> => {
    const cleanDigits = profileData.phone.replace(/\D/g, '');
    const newUid = `user_${cleanDigits || Date.now()}`;
    const formattedPhone = profileData.phone.startsWith('+91')
      ? profileData.phone
      : `+91 ${cleanDigits.slice(-10)}`;

    const newUser: UserProfile = {
      uid: newUid,
      phone: formattedPhone,
      displayName: profileData.displayName.trim() || `User_${cleanDigits.slice(-4)}`,
      username: profileData.username.trim() || `user_${cleanDigits.slice(-4)}`,
      bio: profileData.bio.trim() || 'देसी हुनर, अपनी पहचान! 🙏',
      photoURL: profileData.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      isVerified: false,
      role: 'creator',
      isProfileComplete: true,
      followersCount: 0,
      followingCount: 1, // Auto follows @joshiji 👑
      reelsCount: 0,
      viewsCount: 0,
      likesCount: 0,
      monetizationEnabled: false,
      violationsCount: 0,
      banStatus: 'clean',
      totalEarnings: 0,
      todayEarnings: 0,
      pendingBalance: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to Firestore
    try {
      await setDoc(doc(db, 'users', newUid), newUser);
    } catch (err) {
      console.warn('Firestore setDoc warning:', err);
    }

    setUsers(prev => {
      const updated = [newUser, ...prev.filter(u => u.uid !== newUid)];
      try {
        localStorage.setItem('jjr_users', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });

    setCurrentUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('jjr_current_uid');
    setCurrentUserState(null);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentUser,
        setCurrentUser,
        users,
        reels,
        activeTab,
        setActiveTab,
        activeReelIndex,
        setActiveReelIndex,
        comments,
        chats,
        messages,
        appSettings,
        updateAppSettings,
        handleLikeReel,
        likedReels,
        followingUsers,
        handleFollowUser,
        handleSendGift,
        handleAddComment,
        handleDeleteComment,
        handleUploadReel,
        handleApproveReel,
        handleRejectReel,
        handleDeleteReel,
        handleToggleMonetization,
        handleBanUser,
        handleSendMessage,
        handleRecordViolation,
        showLanguageModal,
        setShowLanguageModal,
        showEarningsModal,
        setShowEarningsModal,
        showAdminPanel,
        setShowAdminPanel,
        activeCall,
        startVideoCall,
        endVideoCall,
        isOwner,
        loginWithPhone,
        logout,
        hasChosenLanguageFirstTime,
        setHasChosenLanguageFirstTime,
        registerNewProfile,
        findUserByPhone
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
