import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle,
  Settings,
  Globe,
  Wallet,
  Shield,
  LogOut,
  Edit3,
  Play,
  Grid,
  Heart,
  Bookmark,
  Sparkles,
  Phone,
  User,
  X
} from 'lucide-react';
import { EarningsModal } from './EarningsModal';
import { LanguageSelect } from './LanguageSelect';
import { PWAInstallButton } from './PWAInstallButton';
import { PublishLinkModal } from './PublishLinkModal';

export const Profile: React.FC = () => {
  const {
    t,
    language,
    currentUser,
    setCurrentUser,
    reels,
    isOwner,
    setShowAdminPanel,
    showEarningsModal,
    setShowEarningsModal,
    showLanguageModal,
    setShowLanguageModal,
    logout,
    setActiveReelIndex,
    setActiveTab
  } = useApp();

  const [activeTab, setActiveProfileTab] = useState<'reels' | 'liked' | 'saved'>('reels');
  const [showEditProfileModal, setShowEditProfileModal] = useState<boolean>(false);
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);

  // Edit profile form state
  const [editName, setEditName] = useState(currentUser?.displayName || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editPhoto, setEditPhoto] = useState(currentUser?.photoURL || '');

  if (!currentUser) return null;

  // Filter reels authored by current user
  const userReels = reels.filter(r => r.authorId === currentUser.uid || r.authorUsername === currentUser.username);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      displayName: editName.trim() || currentUser.displayName,
      bio: editBio.trim() || currentUser.bio,
      photoURL: editPhoto.trim() || currentUser.photoURL
    });
    setShowEditProfileModal(false);
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-[calc(100vh-68px)] bg-gradient-to-b from-purple-950 via-slate-900 to-black text-white p-4 pb-24 overflow-y-auto">
      {/* Top Bar with Settings, Language, Logout */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-lg text-white">@{currentUser.username}</span>
          {currentUser.isVerified && (
            <CheckCircle className="w-4 h-4 text-blue-400 fill-blue-400" />
          )}
          {isOwner && (
            <span className="text-[10px] bg-gradient-to-r from-orange-500 to-amber-500 text-black font-black px-2 py-0.5 rounded-full shadow">
              {t.ownerBadge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={() => setShowLanguageModal(true)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-orange-400 flex items-center gap-1 text-xs font-bold"
            title={t.changeLang}
          >
            <Globe className="w-4 h-4" />
            <span>{language === 'hi' ? 'हिंदी' : 'EN'}</span>
          </button>

          {/* Prominent Logout Button */}
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/35 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow active:scale-95"
            title={language === 'hi' ? 'लॉगआउट करें' : 'Logout'}
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>{language === 'hi' ? 'लॉगआउट' : 'Logout'}</span>
          </button>
        </div>
      </div>

      {/* Profile Header Avatar & Stats */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
        <div className="relative shrink-0">
          <img
            src={isOwner ? "joshi.jpg" : currentUser.photoURL}
            alt={currentUser.displayName}
            style={{ width: '120px', height: '120px', borderRadius: '50%', border: '3px solid gold', objectFit: 'cover' }}
            className="shadow-2xl shadow-amber-500/30"
          />
          {currentUser.isVerified && (
            <div className="absolute bottom-1 right-1 bg-blue-500 text-white p-1.5 rounded-full shadow-lg border-2 border-black">
              <CheckCircle className="w-4 h-4 fill-white text-blue-500" />
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="w-full flex-1 grid grid-cols-3 gap-1.5 text-center">
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
            <div className="text-lg font-black text-white">{currentUser.reelsCount}</div>
            <div className="text-[10px] text-purple-300 uppercase font-bold">{t.reelsCount}</div>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
            <div className="text-lg font-black text-white">
              {currentUser.followersCount >= 1000
                ? `${(currentUser.followersCount / 1000).toFixed(1)}k`
                : currentUser.followersCount}
            </div>
            <div className="text-[10px] text-purple-300 uppercase font-bold">{t.followers}</div>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
            <div className="text-lg font-black text-white">{currentUser.followingCount}</div>
            <div className="text-[10px] text-purple-300 uppercase font-bold">{t.followingCount}</div>
          </div>
        </div>
      </div>

      {/* Name and Hindi Bio */}
      <div className="mb-5">
        <h2 className="text-xl font-black text-white flex items-center gap-1.5">
          {isOwner ? 'Joshi Ji Reels 👑' : currentUser.displayName}
        </h2>
        {isOwner && (
          <div className="text-xs text-amber-300 font-bold mb-1">
            {currentUser.displayName} (@{currentUser.username})
          </div>
        )}
        <p className="text-xs text-purple-200 mt-1 leading-relaxed whitespace-pre-line font-normal">
          {currentUser.bio}
        </p>

        {currentUser.phone && (
          <div className="text-[11px] text-purple-300/80 mt-1 flex items-center gap-1">
            <Phone className="w-3 h-3 text-orange-400" />
            <span>{currentUser.phone} (सत्यापित खाता)</span>
          </div>
        )}
      </div>

      {/* Big Action Buttons */}
      <div className="space-y-2.5 mb-6">
        {/* PWA Mobile Install Banner */}
        <PWAInstallButton variant="card" />

        {/* Prominent My Earnings Button */}
        <button
          onClick={() => setShowEarningsModal(true)}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base shadow-lg shadow-orange-500/30 flex items-center justify-between active:scale-98 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-amber-200" />
            </div>
            <div className="text-left">
              <div>{t.myEarningsBtn}</div>
              <div className="text-[10px] text-amber-100 font-semibold">
                10k Views = ₹100 | Gifts & UPI Payout
              </div>
            </div>
          </div>
          <span className="text-lg font-black bg-black/30 px-3 py-1 rounded-xl text-amber-300">
            ₹{(currentUser.pendingBalance || 0).toLocaleString()}
          </span>
        </button>

        <div className="flex gap-2">
          {/* Edit Profile Button */}
          <button
            onClick={() => setShowEditProfileModal(true)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Edit3 className="w-3.5 h-3.5 text-orange-400" />
            <span>{t.editProfile}</span>
          </button>

          {/* Publish Link Button */}
          <button
            onClick={() => setShowPublishModal(true)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 border border-purple-500/40 text-purple-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-orange-400" />
            <span>{language === 'hi' ? 'पब्लिश लिंक' : 'Publish Link'}</span>
          </button>

          {/* Master Admin Button for Owner @joshiji */}
          {isOwner && (
            <button
              onClick={() => setShowAdminPanel(true)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-800 to-purple-600 hover:from-purple-700 hover:to-purple-500 border border-amber-300/40 text-amber-200 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Thumbnails Tabs */}
      <div className="border-t border-white/10 pt-2">
        <div className="flex justify-around border-b border-white/10 pb-2 mb-3">
          <button
            onClick={() => setActiveProfileTab('reels')}
            className={`flex items-center gap-1.5 text-xs font-black pb-2 border-b-2 transition-all ${
              activeTab === 'reels'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-purple-300/60'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>{t.myReelsTab} ({userReels.length})</span>
          </button>

          <button
            onClick={() => setActiveProfileTab('liked')}
            className={`flex items-center gap-1.5 text-xs font-black pb-2 border-b-2 transition-all ${
              activeTab === 'liked'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-purple-300/60'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>{t.likedReelsTab}</span>
          </button>

          <button
            onClick={() => setActiveProfileTab('saved')}
            className={`flex items-center gap-1.5 text-xs font-black pb-2 border-b-2 transition-all ${
              activeTab === 'saved'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-purple-300/60'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>{t.savedReelsTab}</span>
          </button>
        </div>

        {/* Thumbnail Grid */}
        <div className="grid grid-cols-3 gap-1.5">
          {userReels.length === 0 ? (
            <div className="col-span-3 text-center py-10 px-4 bg-white/5 rounded-2xl border border-white/5 text-purple-300/80 text-xs">
              <span className="text-3xl block mb-2">🎬</span>
              <p className="font-bold text-white mb-1">
                {language === 'hi' ? 'आपने अभी तक कोई रील अपलोड नहीं की है' : 'No reels uploaded yet'}
              </p>
              <p className="text-[11px] text-purple-300/70 mb-3">
                {language === 'hi' ? 'अपना हुनर दिखाएं और 10,000 व्यूज पर ₹100 कमाएं!' : 'Share your talent and earn ₹100 per 10k views!'}
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/30 cursor-pointer transition-all active:scale-95"
              >
                {language === 'hi' ? '+ पहली रील अपलोड करें' : '+ Upload First Reel'}
              </button>
            </div>
          ) : (
            userReels.map((reel) => (
              <div
                key={reel.id}
                onClick={() => {
                  const idx = reels.findIndex(r => r.id === reel.id);
                  if (idx !== -1) {
                    setActiveReelIndex(idx);
                    setActiveTab('feed');
                  }
                }}
                className="relative aspect-[9/14] rounded-lg overflow-hidden bg-black/40 border border-white/10 group cursor-pointer"
              >
                <img
                  src={reel.thumbnailUrl}
                  alt={reel.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-white drop-shadow">
                    <Play className="w-3 h-3 fill-white" />
                    <span>{reel.viewsCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-gradient-to-b from-purple-950 via-slate-900 to-black border border-purple-500/30 rounded-3xl p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="font-extrabold text-base">{t.editProfile}</h3>
              <button onClick={() => setShowEditProfileModal(false)}>
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-purple-200 font-bold mb-1">पूरा नाम (Full Name)</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-purple-200 font-bold mb-1">हिंदी बायो (Bio)</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-purple-200 font-bold mb-1">फ़ोटो URL (Avatar URL)</label>
                <input
                  type="text"
                  value={editPhoto}
                  onChange={(e) => setEditPhoto(e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black rounded-xl shadow-lg shadow-orange-500/30 cursor-pointer"
              >
                सुरक्षित करें (Save)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Language Selector Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm">
            <LanguageSelect isModal onClose={() => setShowLanguageModal(false)} />
          </div>
        </div>
      )}

      {/* Earnings Modal */}
      {showEarningsModal && (
        <EarningsModal onClose={() => setShowEarningsModal(false)} />
      )}

      {/* Publish Link Modal */}
      {showPublishModal && (
        <PublishLinkModal onClose={() => setShowPublishModal(false)} />
      )}
    </div>
  );
};
