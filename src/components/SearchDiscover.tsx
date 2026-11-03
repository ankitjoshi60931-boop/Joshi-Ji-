import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Flame, TrendingUp, CheckCircle, Play, UserPlus, UserCheck, Tag } from 'lucide-react';

export const SearchDiscover: React.FC = () => {
  const {
    t,
    language,
    reels,
    users,
    followingUsers,
    handleFollowUser,
    setActiveReelIndex,
    setActiveTab
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: language === 'hi' ? '🔥 ट्रेंडिंग' : '🔥 Trending' },
    { id: 'comedy', label: language === 'hi' ? '😂 देसी कॉमेडी' : '😂 Comedy' },
    { id: 'dance', label: language === 'hi' ? '💃 लोक नृत्य' : '💃 Folk Dance' },
    { id: 'farming', label: language === 'hi' ? '🌾 जैविक खेती' : '🌾 Agriculture' },
    { id: 'devotional', label: language === 'hi' ? '🚩 भजन व भक्ति' : '🚩 Devotional' },
    { id: 'food', label: language === 'hi' ? '🍲 गांव का स्वाद' : '🍲 Desi Food' }
  ];

  // Filter reels
  const filteredReels = reels.filter(r => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      r.caption.toLowerCase().includes(q) ||
      r.authorUsername.toLowerCase().includes(q) ||
      r.authorName.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q) ||
      r.hashtags.some(h => h.toLowerCase().includes(q));

    return matchesSearch;
  });

  return (
    <div className="w-full max-w-md mx-auto min-h-[calc(100vh-68px)] bg-gradient-to-b from-purple-950 via-slate-900 to-black text-white p-4 pb-24 overflow-y-auto">
      {/* Search Input Bar */}
      <div className="relative mb-4">
        <div className="flex items-center rounded-2xl bg-white/10 border border-white/15 px-3 py-2.5 focus-within:border-orange-500 shadow-inner">
          <Search className="w-5 h-5 text-orange-400 shrink-0 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'hi' ? 'क्रिएटर, हैशटैग या स्थान खोजें...' : 'Search creators, hashtags, location...'}
            className="w-full bg-transparent text-sm text-white placeholder-purple-300/40 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-purple-300 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400 shadow-md shadow-orange-500/20'
                : 'bg-white/5 text-purple-200 border-white/10 hover:border-white/20'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Trending Creators Bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-black uppercase text-orange-400 tracking-wider flex items-center gap-1">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>{language === 'hi' ? 'लोकप्रिय देसी क्रिएटर' : 'Trending Creators'}</span>
          </h3>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {users.map(u => {
            const isFollowing = followingUsers.has(u.uid);
            return (
              <div
                key={u.uid}
                className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center min-w-[120px] text-center shrink-0"
              >
                <div className="relative mb-1.5">
                  <img
                    src={u.photoURL}
                    alt={u.displayName}
                    className="w-12 h-12 rounded-full object-cover border border-purple-400/40"
                  />
                  {u.isVerified && (
                    <CheckCircle className="w-3.5 h-3.5 text-blue-400 fill-blue-400 absolute bottom-0 right-0" />
                  )}
                </div>
                <span className="text-xs font-bold text-white truncate max-w-[100px]">
                  {u.displayName}
                </span>
                <span className="text-[10px] text-purple-300">@{u.username}</span>

                <button
                  onClick={() => handleFollowUser(u.uid)}
                  className={`mt-2 w-full py-1 rounded-lg text-[10px] font-black transition-all ${
                    isFollowing
                      ? 'bg-white/10 text-emerald-400 border border-emerald-500/40'
                      : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow'
                  }`}
                >
                  {isFollowing ? t.following : `+ ${t.follow}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reels Discovery Grid */}
      <div>
        <h3 className="text-xs font-black uppercase text-purple-300 tracking-wider mb-3 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span>{language === 'hi' ? 'वायरल रील्स' : 'Viral Reels'} ({filteredReels.length})</span>
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          {filteredReels.map((reel) => (
            <div
              key={reel.id}
              onClick={() => {
                const idx = reels.findIndex(r => r.id === reel.id);
                if (idx !== -1) {
                  setActiveReelIndex(idx);
                  setActiveTab('feed');
                }
              }}
              className="relative aspect-[9/13] rounded-2xl overflow-hidden bg-black/50 border border-white/10 group cursor-pointer shadow-lg"
            >
              <img
                src={reel.thumbnailUrl}
                alt={reel.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                <span className="text-[11px] font-bold text-white line-clamp-1 drop-shadow">
                  {reel.caption}
                </span>
                <div className="flex items-center justify-between text-[10px] text-purple-200 mt-1">
                  <span>@{reel.authorUsername}</span>
                  <div className="flex items-center gap-1 font-bold text-amber-300">
                    <Play className="w-3 h-3 fill-amber-300" />
                    <span>{reel.viewsCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
