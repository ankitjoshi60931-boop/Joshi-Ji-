export type Language = 'hi' | 'en';

export type UserRole = 'owner' | 'admin' | 'creator' | 'user';

export type BanStatus = 'clean' | 'warning1' | 'ban7days' | 'banned';

export interface UserProfile {
  uid: string;
  phone: string;
  displayName: string;
  username: string;
  bio: string;
  photoURL: string;
  isVerified: boolean; // Blue tick
  role: UserRole;
  isProfileComplete?: boolean;
  followersCount: number;
  followingCount: number;
  reelsCount: number;
  viewsCount: number;
  likesCount: number;
  monetizationEnabled: boolean;
  violationsCount: number;
  banStatus: BanStatus;
  banExpiresAt?: string;
  totalEarnings: number; // in Rupees
  todayEarnings: number;
  pendingBalance: number;
  upiId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReelItem {
  id: string;
  authorId: string;
  authorUsername: string;
  authorName: string;
  authorPhoto: string;
  authorVerified: boolean;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  hashtags: string[];
  location: string;
  musicTitle: string;
  musicArtist: string;
  collaborators: string[]; // up to 2 creators
  likesCount: number;
  viewsCount: number;
  commentsCount: number;
  sharesCount: number;
  status: 'approved' | 'pending' | 'rejected';
  isOriginal: boolean;
  copyrightPassed: boolean;
  hasWatermark?: boolean;
  detectedSource?: string;
  moderationNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReelComment {
  id: string;
  reelId: string;
  authorId: string;
  authorUsername: string;
  authorName: string;
  authorPhoto: string;
  text: string;
  createdAt: string;
}

export interface ReelGift {
  id: string;
  reelId: string;
  senderId: string;
  senderName: string;
  creatorId: string;
  giftType: 'heart' | 'flower' | 'mithai' | 'crown';
  amount: number; // ₹10, ₹50, ₹100, ₹500
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  type: 'text' | 'image' | 'video' | 'voice' | 'call';
  content: string;
  mediaUrl?: string;
  voiceDurationSeconds?: number;
  createdAt: string;
}

export interface ChatThread {
  id: string;
  isGroup: boolean;
  name: string;
  avatar: string;
  participants: string[]; // user UIDs
  participantNames: Record<string, string>;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface AppSettings {
  appName: string;
  logoText: string;
  primaryColor: string; // hex
  secondaryColor: string; // hex
  rulesHindi: string;
  rulesEnglish: string;
  ownerEmail: string;
  ownerUsername: string;
  updatedAt: string;
}
