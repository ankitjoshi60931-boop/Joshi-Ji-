import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Search, PlusCircle, MessageSquare, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { t, activeTab, setActiveTab, currentUser, chats } = useApp();

  const totalUnread = chats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-xl border-t border-purple-900/40">
      <div className="max-w-md mx-auto h-[68px] flex items-center justify-around px-2">
        {/* 1. Home */}
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 ${
            activeTab === 'feed'
              ? 'text-orange-400 font-black'
              : 'text-purple-300/70 hover:text-purple-200'
          }`}
        >
          <Home className={`w-6 h-6 ${activeTab === 'feed' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-1 font-bold">{t.navHome}</span>
        </button>

        {/* 2. Search */}
        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 ${
            activeTab === 'search'
              ? 'text-orange-400 font-black'
              : 'text-purple-300/70 hover:text-purple-200'
          }`}
        >
          <Search className={`w-6 h-6 ${activeTab === 'search' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-1 font-bold">{t.navSearch}</span>
        </button>

        {/* 3. Upload Center Special Big Button */}
        <button
          onClick={() => setActiveTab('upload')}
          className="flex flex-col items-center justify-center flex-1 -mt-4 active:scale-90 transition-transform"
        >
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-purple-600 p-0.5 shadow-xl shadow-orange-500/40 border border-white/20">
            <div className="w-full h-full bg-gradient-to-tr from-orange-600 to-amber-500 rounded-2xl flex items-center justify-center text-white">
              <span className="text-3xl font-light leading-none">+</span>
            </div>
          </div>
          <span className="text-[10px] mt-1 font-bold text-orange-300">{t.navUpload}</span>
        </button>

        {/* 4. Chat */}
        <button
          onClick={() => setActiveTab('chat')}
          className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 ${
            activeTab === 'chat'
              ? 'text-orange-400 font-black'
              : 'text-purple-300/70 hover:text-purple-200'
          }`}
        >
          <div className="relative">
            <MessageSquare className={`w-6 h-6 ${activeTab === 'chat' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-2 bg-orange-500 text-black text-[9px] font-black px-1.5 py-0.2 rounded-full">
                {totalUnread}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-bold">{t.navChat}</span>
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 ${
            activeTab === 'profile'
              ? 'text-orange-400 font-black'
              : 'text-purple-300/70 hover:text-purple-200'
          }`}
        >
          {currentUser ? (
            <img
              src={currentUser.photoURL}
              alt="Profile"
              className={`w-6 h-6 rounded-full object-cover border ${
                activeTab === 'profile' ? 'border-orange-500 ring-2 ring-orange-500/30' : 'border-white/30'
              }`}
            />
          ) : (
            <User className={`w-6 h-6 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          )}
          <span className="text-[10px] mt-1 font-bold">{t.navProfile}</span>
        </button>
      </div>
    </div>
  );
};
