import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Trash2,
  Ban,
  UserCheck,
  ToggleLeft,
  ToggleRight,
  Settings,
  DollarSign,
  Palette,
  FileText,
  Video,
  Users,
  MessageCircle,
  Save,
  Lock,
  Sparkles,
  X
} from 'lucide-react';
import { UserProfile, ReelItem } from '../types';

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const {
    t,
    language,
    currentUser,
    isOwner,
    reels,
    users,
    comments,
    appSettings,
    updateAppSettings,
    handleApproveReel,
    handleRejectReel,
    handleDeleteReel,
    handleToggleMonetization,
    handleBanUser,
    handleDeleteComment
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'reels' | 'users' | 'comments' | 'earnings' | 'settings'>('reels');

  // App Settings Form State
  const [appName, setAppName] = useState(appSettings.appName);
  const [logoText, setLogoText] = useState(appSettings.logoText);
  const [primaryColor, setPrimaryColor] = useState(appSettings.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(appSettings.secondaryColor);
  const [rulesHindi, setRulesHindi] = useState(appSettings.rulesHindi);
  const [rulesEnglish, setRulesEnglish] = useState(appSettings.rulesEnglish);
  const [saveSettingsNotice, setSaveSettingsNotice] = useState(false);

  // Strictly verify Master Owner permission
  if (!isOwner) {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-gradient-to-b from-red-950 via-slate-900 to-black border-2 border-red-500 rounded-3xl p-6 text-center text-white shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 text-red-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white">प्रवेश वर्जित (Access Denied)</h2>
          <p className="text-xs text-red-200 mt-2 leading-relaxed">
            {t.ownerOnlyNotice}
          </p>
          <button
            onClick={onClose}
            className="mt-6 w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-xl"
          >
            वापस जाएं (Back)
          </button>
        </div>
      </div>
    );
  }

  // Handle Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateAppSettings({
      appName,
      logoText,
      primaryColor,
      secondaryColor,
      rulesHindi,
      rulesEnglish
    });
    setSaveSettingsNotice(true);
    setTimeout(() => setSaveSettingsNotice(false), 2500);
  };

  // Flatten comments for moderation
  const allComments: { reelId: string; commentId: string; authorName: string; text: string; createdAt: string }[] = [];
  Object.entries(comments).forEach(([reelId, list]) => {
    list.forEach(c => {
      allComments.push({
        reelId,
        commentId: c.id,
        authorName: c.authorName,
        text: c.text,
        createdAt: c.createdAt
      });
    });
  });

  // Calculate platform totals
  const totalPlatformViews = reels.reduce((acc, r) => acc + (r.viewsCount || 0), 0);
  const totalPlatformLikes = reels.reduce((acc, r) => acc + (r.likesCount || 0), 0);
  const totalPlatformEarnings = users.reduce((acc, u) => acc + (u.totalEarnings || 0), 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-2xl bg-gradient-to-b from-purple-950 via-slate-900 to-black border-t sm:border border-amber-400/40 rounded-t-3xl sm:rounded-3xl p-6 text-white shadow-2xl max-h-[94vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 sticky top-0 bg-purple-950/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <img
              src="joshi.jpg"
              alt="Joshi Ji"
              style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid gold', objectFit: 'cover' }}
              className="shadow-lg shrink-0"
            />
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <span>{t.adminPanelTitle}</span>
                <span className="text-[10px] bg-amber-400 text-purple-950 px-2 py-0.5 rounded-full font-black">
                  OWNER @joshiji
                </span>
              </h3>
              <p className="text-[11px] text-amber-200/80">
                ऐप का संपूर्ण नियंत्रण (Full App Control)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation for Admin Sections */}
        <div className="flex gap-1 overflow-x-auto p-1.5 my-4 bg-white/5 rounded-2xl border border-white/10 text-xs font-bold">
          <button
            onClick={() => setActiveAdminTab('reels')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeAdminTab === 'reels'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>रील्स समीक्षा ({reels.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('users')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeAdminTab === 'users'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>यूजर व बैन ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('comments')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeAdminTab === 'comments'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>कमेंट्स मॉडरेशन ({allComments.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('earnings')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeAdminTab === 'earnings'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>कुल कमाई</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('settings')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeAdminTab === 'settings'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>ऐप सेटिंग्स</span>
          </button>
        </div>

        {/* TAB 1: REELS MODERATION */}
        {activeAdminTab === 'reels' && (
          <div className="space-y-3">
            <div className="text-xs text-purple-300 font-semibold mb-2">
              सभी रील्स देखें, मंजूरी दें, अस्वीकार करें या तुरंत हटाएं:
            </div>

            {reels.map(reel => (
              <div
                key={reel.id}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={reel.thumbnailUrl}
                    alt={reel.caption}
                    className="w-14 h-18 rounded-xl object-cover border border-purple-500/40 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{reel.authorName}</span>
                      <span className="text-[11px] text-purple-300">@{reel.authorUsername}</span>
                      <span
                        className={`text-[10px] px-2 py-0.2 rounded-full font-black ${
                          reel.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {reel.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-purple-100 line-clamp-1 mt-0.5">{reel.caption}</p>
                    <div className="text-[11px] text-purple-400 mt-1">
                      👁️ {reel.viewsCount.toLocaleString()} | ❤️ {reel.likesCount.toLocaleString()} | 💬 {reel.commentsCount}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {reel.status !== 'approved' && (
                    <button
                      onClick={() => handleApproveReel(reel.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{t.approveBtn}</span>
                    </button>
                  )}

                  {reel.status !== 'rejected' && (
                    <button
                      onClick={() => handleRejectReel(reel.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{t.rejectBtn}</span>
                    </button>
                  )}

                  {/* Master Delete Video Button */}
                  <button
                    onClick={() => handleDeleteReel(reel.id)}
                    className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1"
                    title={t.deleteVideoBtn}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>हटाएं</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT & BAN SYSTEM */}
        {activeAdminTab === 'users' && (
          <div className="space-y-3">
            <div className="text-xs text-purple-300 font-semibold mb-2">
              यूजर ब्लॉक / अनब्लॉक करें, स्ट्राइक देखें और मोनेटाइजेशन चालू / बंद करें:
            </div>

            {users.map(u => (
              <div
                key={u.uid}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={u.photoURL}
                    alt={u.displayName}
                    className="w-12 h-12 rounded-full object-cover border border-orange-500 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white">{u.displayName}</span>
                      <span className="text-xs text-purple-300">@{u.username}</span>
                      {u.role === 'owner' && <span className="text-xs">👑</span>}
                    </div>

                    <div className="text-[11px] text-purple-300 flex items-center gap-2 mt-0.5">
                      <span>{u.phone}</span>
                      <span>·</span>
                      <span>स्ट्राइक: {u.violationsCount}</span>
                      <span>·</span>
                      <span
                        className={`font-bold ${
                          u.banStatus === 'clean'
                            ? 'text-emerald-400'
                            : u.banStatus === 'warning1'
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        स्थिति: {u.banStatus.toUpperCase()}
                      </span>
                    </div>

                    {/* Monetization Switch Indicator */}
                    <div className="text-[11px] font-bold mt-1 flex items-center gap-1.5">
                      <span className="text-purple-300">मोनेटाइजेशन:</span>
                      <span className={u.monetizationEnabled ? 'text-emerald-400' : 'text-rose-400'}>
                        {u.monetizationEnabled ? 'चालू (ON) ✅' : 'बंद (OFF) ❌'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Admin Actions */}
                <div className="flex flex-wrap items-center gap-1.5 self-end sm:self-center">
                  {/* Monetization Toggle Switch */}
                  <button
                    onClick={() => handleToggleMonetization(u.uid)}
                    className="px-2.5 py-1 rounded-xl bg-purple-700/60 hover:bg-purple-600 text-white text-[11px] font-bold border border-purple-400/30"
                  >
                    मोनेटाइजेशन {u.monetizationEnabled ? 'बंद करें' : 'चालू करें'}
                  </button>

                  {/* Ban Buttons */}
                  {u.banStatus === 'clean' ? (
                    <>
                      <button
                        onClick={() => handleBanUser(u.uid, 'ban7days')}
                        className="px-2.5 py-1 rounded-xl bg-amber-600/80 hover:bg-amber-500 text-white text-[11px] font-bold"
                      >
                        7 दिन बैन
                      </button>
                      <button
                        onClick={() => handleBanUser(u.uid, 'banned')}
                        className="px-2.5 py-1 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white text-[11px] font-bold"
                      >
                        स्थायी बैन
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleBanUser(u.uid, 'clean')}
                      className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1"
                    >
                      <UserCheck className="w-3 h-3" />
                      <span>अनबैन करें</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: COMMENTS MODERATION */}
        {activeAdminTab === 'comments' && (
          <div className="space-y-3">
            <div className="text-xs text-purple-300 font-semibold mb-2">
              सभी कमेंट्स देखें और किसी भी अनुचित कमेंट को एक क्लिक में हटाएं:
            </div>

            {allComments.length === 0 ? (
              <div className="text-center py-10 text-purple-300/60 text-xs">
                कोई कमेंट मौजूद नहीं है।
              </div>
            ) : (
              allComments.map(c => (
                <div
                  key={c.commentId}
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="text-xs font-bold text-white">{c.authorName}</span>
                    <p className="text-xs text-purple-100 mt-0.5">{c.text}</p>
                    <span className="text-[10px] text-purple-400">{c.createdAt}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteComment(c.commentId, c.reelId)}
                    className="p-2 rounded-xl bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold flex items-center gap-1"
                    title={t.deleteComment}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>हटाएं</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: PLATFORM EARNINGS */}
        {activeAdminTab === 'earnings' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                <span className="text-xs text-purple-300 font-bold uppercase">कुल व्यूज</span>
                <div className="text-xl font-black text-amber-300 mt-1">
                  {totalPlatformViews.toLocaleString()}
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                <span className="text-xs text-purple-300 font-bold uppercase">कुल लाइक्स</span>
                <div className="text-xl font-black text-rose-400 mt-1">
                  {totalPlatformLikes.toLocaleString()}
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                <span className="text-xs text-purple-300 font-bold uppercase">क्रिएटर कमाई</span>
                <div className="text-xl font-black text-emerald-400 mt-1">
                  ₹{totalPlatformEarnings.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-900/30 border border-purple-500/30 rounded-2xl text-xs text-purple-200 space-y-2">
              <div className="font-extrabold text-orange-400 text-sm">मास्टर राजस्व विवरण (Revenue Insights)</div>
              <div>• 10,000 व्यूज = ₹100 क्रिएटर पूल से सीधे भुगतान योग्य</div>
              <div>• उपहार (Gifts) में से 100% राशि क्रिएटर को हस्तांतरित होती है</div>
              <div>• मालिक @joshiji के नियंत्रण में सभी वित्तीय रिकॉर्ड सुरक्षित हैं</div>
            </div>
          </div>
        )}

        {/* TAB 5: APP SETTINGS (NAME, LOGO, COLOR, RULES) */}
        {activeAdminTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            {saveSettingsNotice && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>सेटिंग्स सफलतापूर्वक सुरक्षित कर ली गई हैं!</span>
              </div>
            )}

            <div>
              <label className="block text-purple-200 font-bold mb-1">
                ऐप का नाम (App Name)
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-orange-500 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-purple-200 font-bold mb-1">
                लोगो टेक्स्ट (Logo Text)
              </label>
              <input
                type="text"
                value={logoText}
                onChange={(e) => setLogoText(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-orange-500 text-sm font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-purple-200 font-bold mb-1">
                  मुख्य रंग (Primary Purple)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                  />
                  <span className="font-mono text-purple-300">{primaryColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-purple-200 font-bold mb-1">
                  द्वितीयक रंग (Secondary Orange)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                  />
                  <span className="font-mono text-purple-300">{secondaryColor}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-purple-200 font-bold mb-1">
                कम्युनिटी नियम (Rules in Hindi)
              </label>
              <textarea
                value={rulesHindi}
                onChange={(e) => setRulesHindi(e.target.value)}
                rows={3}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-white outline-none focus:border-orange-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-purple-200 font-bold mb-1">
                Community Guidelines (Rules in English)
              </label>
              <textarea
                value={rulesEnglish}
                onChange={(e) => setRulesEnglish(e.target.value)}
                rows={3}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-white outline-none focus:border-orange-500 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{t.saveSettings}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
