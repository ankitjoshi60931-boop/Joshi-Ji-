import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Copy, Check, ExternalLink, Share2, Globe, QrCode, X, Sparkles } from 'lucide-react';

interface PublishLinkModalProps {
  onClose: () => void;
}

export const PUBLISH_URL = 'https://ais-pre-6ofqnn2353fek52msrmm4i-180991852006.asia-southeast1.run.app';

export const PublishLinkModal: React.FC<PublishLinkModalProps> = ({ onClose }) => {
  const { language } = useApp();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PUBLISH_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappMessage = `👑 *जोशी जी रील्स (Joshi Ji Reels)*\nदेसी हुनर, अपनी पहचान! 10,000 व्यूज पर ₹100 की गारंटीड कमाई।\n\nअभी ऐप खोलें और रील्स देखें 👇\n${PUBLISH_URL}`;

  // QR Code URL via reliable public qr API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(PUBLISH_URL)}&bgcolor=090514&color=f97316&margin=6`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-sm bg-gradient-to-b from-purple-950 via-slate-900 to-black border-2 border-orange-500/40 rounded-3xl p-6 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <img
            src="/joshi.jpg"
            alt="Joshi Ji Reels"
            style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px solid gold', objectFit: 'cover' }}
            className="shadow-xl shadow-orange-500/30 mx-auto mb-2"
          />
          <h3 className="text-lg font-black text-white">
            {language === 'hi' ? 'ऐप का पब्लिश लिंक' : 'Official Publish Link'}
          </h3>
          <p className="text-xs text-orange-300 font-semibold mt-0.5">
            {language === 'hi' ? 'लाइव शेयर एवं इंस्टॉलेशन यूआरएल' : 'Live Public Web App URL'}
          </p>
        </div>

        {/* URL Box with Copy Button */}
        <div className="p-3 bg-black/60 rounded-2xl border border-white/15 my-4">
          <label className="block text-[10px] text-purple-300 font-bold uppercase tracking-wider mb-1">
            {language === 'hi' ? 'पब्लिक लिंक (Public Link):' : 'Shared App URL:'}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={PUBLISH_URL}
              className="flex-1 bg-transparent text-xs text-amber-200 font-mono outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1 transition-all shrink-0 cursor-pointer shadow"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (language === 'hi' ? 'कॉपी हुआ!' : 'Copied!') : (language === 'hi' ? 'कॉपी' : 'Copy')}</span>
            </button>
          </div>
        </div>

        {/* QR Code for Mobile Scanning */}
        <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-2xl border border-white/10 mb-4">
          <img
            src={qrCodeUrl}
            alt="Scan QR Code to open Joshi Ji Reels on phone"
            className="w-36 h-36 rounded-xl border border-orange-500/30 shadow-md mb-2 bg-black"
          />
          <span className="text-[11px] text-purple-200 font-medium">
            📱 {language === 'hi' ? 'मोबाइल कैमरे से स्कैन करें और ऐप खोलें' : 'Scan with mobile camera to open & install'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* WhatsApp Share */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-98"
          >
            <span className="text-base">💬</span>
            <span>{language === 'hi' ? 'व्हाट्सएप पर दोस्तों को भेजें' : 'Share to WhatsApp'}</span>
          </a>

          {/* Open in New Window */}
          <a
            href={PUBLISH_URL}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
            <span>{language === 'hi' ? 'नई विंडो में खोलें' : 'Open in New Window'}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
