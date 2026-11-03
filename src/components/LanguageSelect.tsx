import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Globe, CheckCircle2, Sparkles, Volume2, Share2, Download } from 'lucide-react';
import { PublishLinkModal } from './PublishLinkModal';
import { PWAInstallButton } from './PWAInstallButton';

interface LanguageSelectProps {
  isModal?: boolean;
  onClose?: () => void;
}

export const LanguageSelect: React.FC<LanguageSelectProps> = ({ isModal = false, onClose }) => {
  const { language, setLanguage, setHasChosenLanguageFirstTime, t } = useApp();
  const [showPublishModal, setShowPublishModal] = useState(false);

  const handleSelect = (lang: 'hi' | 'en') => {
    setLanguage(lang);
    setHasChosenLanguageFirstTime(true);
    localStorage.setItem('jjr_lang_selected', 'true');
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={`w-full ${isModal ? 'p-6 bg-slate-900 text-white rounded-3xl' : 'min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-black text-white flex flex-col items-center justify-center p-4'}`}>
      <div className="w-full max-w-md mx-auto flex flex-col items-center text-center">
        {/* App Logo & Header */}
        {!isModal && (
          <div className="mb-6 flex flex-col items-center">
            <img
              src="joshi.jpg"
              alt="Joshi Ji"
              style={{ width: '100px', height: '100px', borderRadius: '50%', border: '3px solid gold', objectFit: 'cover' }}
              className="shadow-2xl shadow-amber-500/40 mb-3"
            />
            <h2 className="text-3xl font-black text-white flex items-center justify-center gap-2">
              Joshi Ji Reels 👑
            </h2>
            <p className="text-purple-200/80 text-sm mt-1 font-medium">
              {t.appTagline}
            </p>
          </div>
        )}

        <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-center gap-2 mb-2 text-orange-400">
            <Globe className="w-5 h-5" />
            <h2 className="text-xl font-bold text-white">
              {language === 'hi' ? 'अपनी भाषा चुनें' : 'Select Your Language'}
            </h2>
          </div>
          <p className="text-xs text-purple-300/80 mb-6">
            {language === 'hi'
              ? 'आप इसे बाद में प्रोफ़ाइल से कभी भी बदल सकते हैं'
              : 'You can change this anytime from your Profile'}
          </p>

          {/* Big Buttons for Village Users */}
          <div className="space-y-4 w-full">
            {/* Hindi Button */}
            <button
              onClick={() => handleSelect('hi')}
              className={`w-full group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 border-2 active:scale-95 ${
                language === 'hi'
                  ? 'border-orange-500 bg-gradient-to-r from-orange-600/40 via-purple-700/40 to-orange-500/20 shadow-lg shadow-orange-500/20'
                  : 'border-white/10 bg-white/5 hover:border-orange-400/50 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-2xl border border-orange-500/30">
                    अ
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white flex items-center gap-2">
                      हिंदी
                      <span className="text-xs bg-orange-500/30 text-orange-300 px-2 py-0.5 rounded-full font-semibold border border-orange-500/30">
                        देसी
                      </span>
                    </div>
                    <div className="text-xs text-purple-200/80 font-medium mt-0.5">
                      सरल व आसान (गांव और शहर के लिए)
                    </div>
                  </div>
                </div>
                <div className="text-orange-400">
                  {language === 'hi' ? (
                    <CheckCircle2 className="w-7 h-7 text-orange-400" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-white/30" />
                  )}
                </div>
              </div>
            </button>

            {/* English Button */}
            <button
              onClick={() => handleSelect('en')}
              className={`w-full group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 border-2 active:scale-95 ${
                language === 'en'
                  ? 'border-purple-500 bg-gradient-to-r from-purple-600/40 via-orange-600/30 to-purple-500/20 shadow-lg shadow-purple-500/20'
                  : 'border-white/10 bg-white/5 hover:border-purple-400/50 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-2xl border border-purple-500/30">
                    A
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white flex items-center gap-2">
                      English
                      <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full font-semibold border border-purple-500/30">
                        Global
                      </span>
                    </div>
                    <div className="text-xs text-purple-200/80 font-medium mt-0.5">
                      Modern & Universal format
                    </div>
                  </div>
                </div>
                <div className="text-purple-400">
                  {language === 'en' ? (
                    <CheckCircle2 className="w-7 h-7 text-purple-400" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-white/30" />
                  )}
                </div>
              </div>
            </button>
          </div>

          {/* Confirm Button */}
          <button
            onClick={() => handleSelect(language)}
            className="mt-6 w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-amber-200" />
            {language === 'hi' ? 'ऐप में प्रवेश करें (Enter App)' : 'Proceed to App'}
          </button>

          {/* Quick Install & Publish Link Controls */}
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
            <PWAInstallButton variant="header" />
            <button
              type="button"
              onClick={() => setShowPublishModal(true)}
              className="text-purple-300 hover:text-orange-400 flex items-center gap-1 font-bold underline"
            >
              <Share2 className="w-3.5 h-3.5 text-orange-400" />
              <span>{language === 'hi' ? 'पब्लिश लिंक' : 'Publish Link'}</span>
            </button>
          </div>
        </div>
      </div>

      {showPublishModal && (
        <PublishLinkModal onClose={() => setShowPublishModal(false)} />
      )}
    </div>
  );
};
