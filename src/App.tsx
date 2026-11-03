import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageSelect } from './components/LanguageSelect';
import { OtpLogin } from './components/OtpLogin';
import { Feed } from './components/Feed';
import { SearchDiscover } from './components/SearchDiscover';
import { UploadReel } from './components/UploadReel';
import { ChatModal } from './components/ChatModal';
import { Profile } from './components/Profile';
import { BottomNav } from './components/BottomNav';
import { AdminPanel } from './components/AdminPanel';
import { ProfileSetup } from './components/ProfileSetup';

const MainApp: React.FC = () => {
  const {
    hasChosenLanguageFirstTime,
    currentUser,
    activeTab,
    showAdminPanel,
    setShowAdminPanel,
    appSettings
  } = useApp();

  // 1. App opens directly with Login Page ("अपना Mobile Number डालो")
  if (!currentUser) {
    return <OtpLogin />;
  }

  // 2. If user is logged in but profile setup is pending ("आपका नाम क्या है? अपना फोटो लगाओ")
  if (!currentUser.isProfileComplete && currentUser.role !== 'owner') {
    return <ProfileSetup initialPhone={currentUser.phone} />;
  }

  return (
    <div className="min-h-screen bg-black text-white flex justify-center font-['Hind',sans-serif]">
      {/* Mobile-centric constrained app wrapper */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-slate-950 relative shadow-2xl border-x border-purple-900/30">
        {/* Main Active Tab Screen */}
        <main className="flex-1 overflow-hidden">
          {activeTab === 'feed' && <Feed />}
          {activeTab === 'search' && <SearchDiscover />}
          {activeTab === 'upload' && <UploadReel />}
          {activeTab === 'chat' && <ChatModal />}
          {activeTab === 'profile' && <Profile />}
        </main>

        {/* Master Admin Panel (Only for Owner @joshiji) */}
        {showAdminPanel && (
          <AdminPanel onClose={() => setShowAdminPanel(false)} />
        )}

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
