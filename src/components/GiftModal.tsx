import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, Heart, Gift as GiftIcon, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GiftModalProps {
  reelId: string;
  creatorName: string;
  creatorId: string;
  onClose: () => void;
}

export const GiftModal: React.FC<GiftModalProps> = ({ reelId, creatorName, onClose }) => {
  const { t, language, handleSendGift } = useApp();
  const [selectedGift, setSelectedGift] = useState<'heart' | 'flower' | 'mithai' | 'crown'>('heart');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const gifts = [
    {
      id: 'heart' as const,
      name: language === 'hi' ? 'दिल (Heart)' : 'Heart',
      price: 10,
      emoji: '💖',
      color: 'from-pink-500 to-rose-500',
      tag: '₹10'
    },
    {
      id: 'flower' as const,
      name: language === 'hi' ? 'गुलाब फूल' : 'Rose Flower',
      price: 50,
      emoji: '🌹',
      color: 'from-red-500 to-orange-500',
      tag: '₹50'
    },
    {
      id: 'mithai' as const,
      name: language === 'hi' ? 'देसी मिठाई' : 'Desi Sweets',
      price: 100,
      emoji: '🍬',
      color: 'from-amber-500 to-yellow-500',
      tag: '₹100'
    },
    {
      id: 'crown' as const,
      name: language === 'hi' ? 'शाही ताज (Crown)' : 'Royal Crown',
      price: 500,
      emoji: '👑',
      color: 'from-purple-600 via-amber-500 to-orange-500',
      tag: '₹500'
    }
  ];

  const handleSend = () => {
    setSending(true);
    const chosen = gifts.find(g => g.id === selectedGift)!;

    // Confetti celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      handleSendGift(reelId, selectedGift, chosen.price);
      setSending(false);
      setSentSuccess(true);

      setTimeout(() => {
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-gradient-to-b from-purple-950 via-slate-900 to-black border-t sm:border border-purple-500/30 rounded-t-3xl sm:rounded-3xl p-6 text-white shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <GiftIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">{t.giftTitle}</h3>
              <p className="text-xs text-purple-300">@{creatorName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="py-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mb-3 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-black text-white">{t.giftSuccess}</h4>
            <p className="text-sm text-emerald-300 mt-1">{t.walletDeducted}</p>
          </div>
        ) : (
          <div className="py-4">
            <p className="text-xs text-purple-200/80 mb-4">
              {language === 'hi'
                ? 'आपका भेजा गया उपहार सीधा क्रिएटर की कमाई (Earnings) में जुड़ेगा:'
                : 'Your gift directly adds to the creator earnings balance:'}
            </p>

            {/* Gifts Grid with Big Simple Tap Targets */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {gifts.map(gift => (
                <button
                  key={gift.id}
                  onClick={() => setSelectedGift(gift.id)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center relative text-center active:scale-95 ${
                    selectedGift === gift.id
                      ? 'border-orange-500 bg-gradient-to-b from-orange-500/30 via-purple-600/30 to-black/60 shadow-lg shadow-orange-500/20 scale-102'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <span className="text-4xl mb-2 filter drop-shadow">{gift.emoji}</span>
                  <span className="text-sm font-extrabold text-white">{gift.name}</span>
                  <span className="mt-1 px-3 py-0.5 rounded-full bg-orange-500 text-black text-xs font-black shadow">
                    {gift.tag}
                  </span>
                </button>
              ))}
            </div>

            {/* Big Send Button */}
            <button
              onClick={handleSend}
              disabled={sending}
              className="w-full py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
            >
              {sending ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-200" />
                  <span>
                    {language === 'hi'
                      ? `${gifts.find(g => g.id === selectedGift)?.tag} भेजें`
                      : `Send ${gifts.find(g => g.id === selectedGift)?.tag}`}
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
