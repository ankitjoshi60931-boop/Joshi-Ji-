import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useApp } from '../context/AppContext';
import { Download, Smartphone, Apple, Check, Share2, Sparkles, X, ExternalLink, QrCode } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'header' | 'card' | 'floating' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { language } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        setInstalledSuccess(true);
        setTimeout(() => setInstalledSuccess(false), 3000);
        return;
      }
    }
    // If not directly promptable (e.g. inside an iframe or iOS Safari or already prompting), open the friendly install guide modal!
    setShowModal(true);
  };

  // If already installed on device
  if (isInstalled && variant !== 'card') {
    return null;
  }

  return (
    <>
      {variant === 'header' && (
        <button
          onClick={handleInstallClick}
          className="px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-md shadow-orange-500/30 active:scale-95 transition-all cursor-pointer border border-amber-300/40"
          title={language === 'hi' ? 'ऐप इंस्टॉल करें' : 'Install App'}
        >
          <Download className="w-3.5 h-3.5 text-amber-100 animate-bounce" />
          <span>{language === 'hi' ? 'इंस्टॉल करें' : 'Install App'}</span>
        </button>
      )}

      {variant === 'card' && (
        <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-purple-900/60 via-purple-800/40 to-orange-950/60 border border-orange-500/40 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/joshi.jpg"
              alt="Joshi Ji Reels"
              style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid gold', objectFit: 'cover' }}
              className="shadow-lg shadow-amber-500/30 shrink-0"
            />
            <div>
              <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                <span>{language === 'hi' ? 'मोबाइल में ऐप इंस्टॉल करें' : 'Install on Mobile'}</span>
                <span className="text-[10px] bg-orange-500/40 text-orange-200 px-1.5 py-0.2 rounded font-bold">
                  PWA
                </span>
              </h4>
              <p className="text-[11px] text-purple-200/80 mt-0.5">
                {language === 'hi'
                  ? 'बिना प्ले स्टोर के सीधे फोन स्क्रीन पर चलाएं'
                  : 'Fast, smooth full-screen reel experience'}
              </p>
            </div>
          </div>

          <button
            onClick={handleInstallClick}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black shadow-lg shadow-orange-500/30 flex items-center gap-1.5 active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-200" />
            <span>{language === 'hi' ? 'इंस्टॉल' : 'Install'}</span>
          </button>
        </div>
      )}

      {/* Install Instruction Modal for Android, Chrome, and iOS */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-gradient-to-b from-purple-950 via-slate-900 to-black border-2 border-orange-500/40 rounded-3xl p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <img
                src="/joshi.jpg"
                alt="Joshi Ji Reels"
                style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px solid gold', objectFit: 'cover' }}
                className="shadow-xl shadow-amber-500/30 mx-auto mb-3"
              />
              <h3 className="text-lg font-black text-white">
                {language === 'hi' ? 'जोशी जी रील्स ऐप इंस्टॉल करें' : 'Install Joshi Ji Reels'}
              </h3>
              <p className="text-xs text-orange-300 font-semibold mt-0.5">
                {language === 'hi' ? 'अपने मोबाइल की होम स्क्रीन पर जोड़ें' : 'Add to your Home Screen'}
              </p>
            </div>

            {/* Platform Guides */}
            <div className="space-y-3 my-4 text-xs">
              {/* Android & Chrome */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
                  <Smartphone className="w-4 h-4" />
                  <span>Android / Chrome:</span>
                </div>
                <p className="text-purple-200 leading-relaxed">
                  {language === 'hi' ? (
                    <>
                      1. ऊपर या नीचे <strong>थ्री-डॉट्स (⋮)</strong> मेनू पर टैप करें।<br />
                      2. <strong>"Install app"</strong> या <strong>"Add to Home screen"</strong> चुनें।
                    </>
                  ) : (
                    <>
                      1. Tap the browser menu <strong>(⋮)</strong>.<br />
                      2. Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                    </>
                  )}
                </p>
              </div>

              {/* iPhone / iOS */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-sky-400 font-extrabold text-sm">
                  <Apple className="w-4 h-4" />
                  <span>iPhone / iPad (Safari):</span>
                </div>
                <p className="text-purple-200 leading-relaxed">
                  {language === 'hi' ? (
                    <>
                      1. सफारी के नीचे <strong>शेयर (Share ⎙)</strong> बटन दबाएं।<br />
                      2. थोड़ा नीचे स्क्रॉल करें और <strong>"Add to Home Screen"</strong> पर टैप करें।
                    </>
                  ) : (
                    <>
                      1. Tap the <strong>Share</strong> icon in Safari.<br />
                      2. Scroll down and tap <strong>"Add to Home Screen"</strong>.
                    </>
                  )}
                </p>
              </div>
            </div>

            {isInstallable && (
              <button
                onClick={async () => {
                  const ok = await install();
                  if (ok) setShowModal(false);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer mb-2 active:scale-98"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'hi' ? 'सीधा इंस्टॉल करें (Direct Install)' : 'Install Now'}</span>
              </button>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all"
            >
              {language === 'hi' ? 'समझ गया (Close)' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
