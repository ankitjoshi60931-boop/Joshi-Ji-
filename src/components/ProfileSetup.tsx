import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Camera, Upload, User, Sparkles, Check, ArrowRight, ShieldCheck, Image as ImageIcon } from 'lucide-react';

interface ProfileSetupProps {
  initialPhone?: string;
  onComplete?: () => void;
}

// 8 Popular, colorful Indian / Desi avatars ready with 1 tap
const DESI_AVATARS = [
  {
    id: 'desi_1',
    name: 'देसी छोरा (Desi Boy)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'desi_2',
    name: 'नृत्यांगना (Desi Girl)',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'desi_3',
    name: 'किसान वीर (Kisan)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'desi_4',
    name: 'स्वैग स्टार (Swag)',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'desi_5',
    name: 'देसी कलाकार (Artist)',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'desi_6',
    name: 'कॉमेडी किंग (Comedy)',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'desi_7',
    name: 'पारंपरिक (Traditional)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'desi_8',
    name: 'जोशी जी फैन 👑',
    url: '/joshi.jpg'
  }
];

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ initialPhone, onComplete }) => {
  const { language, registerNewProfile, currentUser } = useApp();

  const phone = initialPhone || currentUser?.phone || '+91 98000 00000';
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string>(DESI_AVATARS[0].url);
  const [bio, setBio] = useState('देसी हुनर, अपनी पहचान! 🇮🇳 | जोशी जी रील्स');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-fill username when name changes if user hasn't typed custom username
  const handleNameChange = (val: string) => {
    setName(val);
    const clean = val
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .slice(0, 20);
    if (!username || username === clean.slice(0, -1) || clean.startsWith(username)) {
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      setUsername(clean ? `${clean}_${randomSuffix}` : `user_${randomSuffix}`);
    }
  };

  // Upload Photo from device or camera
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg(language === 'hi' ? 'फोटो का साइज 5MB से कम होना चाहिए' : 'Photo must be under 5MB');
        return;
      }
      setErrorMsg(null);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg(language === 'hi' ? 'कृपया अपना नाम दर्ज करें' : 'Please enter your name');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await registerNewProfile({
        phone,
        displayName: name.trim(),
        username: (username.trim() || `user_${Date.now().toString().slice(-4)}`).replace(/[^a-zA-Z0-9_]/g, ''),
        bio: bio.trim(),
        photoURL: selectedPhoto
      });

      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      console.error('Error creating profile:', err);
      setErrorMsg(language === 'hi' ? 'प्रोफ़ाइल बनाने में त्रुटि हुई, कृपया पुनः प्रयास करें' : 'Failed to create profile, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-black text-white flex flex-col justify-center items-center p-4 py-8">
      <div className="w-full max-w-md mx-auto">
        {/* Brand Banner */}
        <div className="text-center mb-5">
          <img
            src="/joshi.jpg"
            alt="Joshi Ji Reels"
            style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid gold', objectFit: 'cover' }}
            className="shadow-2xl shadow-amber-500/40 mb-2 mx-auto"
          />
          <h2 className="text-2xl font-black text-white flex items-center justify-center gap-1.5">
            Joshi Ji Reels 👑
          </h2>
          <div className="inline-flex items-center gap-1.5 bg-orange-500/20 border border-orange-500/40 px-3 py-1 rounded-full text-xs text-orange-300 font-bold mt-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'hi' ? 'स्टेप ३: नई प्रोफाइल सेटअप' : 'Step 3: Profile Setup'}</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Section 1: Name Question */}
            <div>
              <label className="block text-sm font-black text-amber-300 mb-1.5">
                {language === 'hi' ? '१. आपका नाम क्या है?' : '1. What is your name?'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder={language === 'hi' ? 'अपना पूरा नाम लिखें (जैसे: राहुल शर्मा)' : 'Enter your full name'}
                className="w-full bg-black/50 border-2 border-purple-500/50 focus:border-orange-500 rounded-2xl px-4 py-3.5 text-white placeholder-purple-300/40 text-base font-bold outline-none transition-all"
                autoFocus
              />

              {/* Username preview */}
              <div className="flex items-center gap-1.5 mt-2 text-xs text-purple-200">
                <span className="font-semibold text-purple-300">यूजरनेम:</span>
                <span className="font-mono bg-black/40 px-2 py-0.5 rounded border border-white/10 text-orange-300">
                  @{username || 'username'}
                </span>
              </div>
            </div>

            {/* Section 2: Photo Question */}
            <div>
              <label className="block text-sm font-black text-amber-300 mb-2">
                {language === 'hi' ? '२. अपना फोटो लगाओ' : '2. Add your photo'}
              </label>

              {/* Live Photo Preview */}
              <div className="flex flex-col items-center justify-center mb-3">
                <div className="relative group">
                  <img
                    src={selectedPhoto}
                    alt="Selected Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-orange-500 shadow-xl shadow-orange-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-lg border-2 border-black hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    title="Upload Photo"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[11px] text-purple-300 font-semibold mt-1.5">
                  {language === 'hi' ? 'लाइव प्रोफाइल फोटो' : 'Live Profile Photo Preview'}
                </span>
              </div>

              {/* File Upload Button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-3 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-500/40 text-xs font-bold text-white flex items-center justify-center gap-2 mb-3 cursor-pointer transition-all active:scale-98"
              >
                <Upload className="w-4 h-4 text-orange-400" />
                <span>{language === 'hi' ? '📁 गैलरी या कैमरे से फोटो अपलोड करें' : 'Upload from Gallery / Camera'}</span>
              </button>

              {/* Or Select Popular Desi Avatar */}
              <div>
                <p className="text-[11px] text-purple-300/80 font-bold mb-2">
                  {language === 'hi' ? 'या लोकप्रिय देसी अवतार चुनें:' : 'Or choose a ready avatar:'}
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {DESI_AVATARS.map((avatar) => {
                    const isSelected = selectedPhoto === avatar.url;
                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => setSelectedPhoto(avatar.url)}
                        className={`relative rounded-xl p-1 border-2 transition-all flex flex-col items-center gap-1 cursor-pointer active:scale-95 ${
                          isSelected
                            ? 'border-orange-500 bg-orange-500/20 scale-105 shadow-md shadow-orange-500/40'
                            : 'border-white/10 hover:border-white/30 bg-black/30'
                        }`}
                      >
                        <img
                          src={avatar.url}
                          alt={avatar.name}
                          className="w-11 h-11 rounded-lg object-cover"
                        />
                        <span className="text-[9px] font-bold text-center leading-tight truncate w-full text-purple-200">
                          {avatar.name.split(' ')[0]}
                        </span>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-0.5 text-black">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Optional Bio */}
            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">
                {language === 'hi' ? 'बायो (अपने बारे में कुछ लिखें):' : 'Bio (Tell about yourself):'}
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={150}
                className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-purple-300/40 outline-none focus:border-orange-500"
                placeholder={language === 'hi' ? 'उदा. देसी डांसर, गाँव का हुनर' : 'e.g. Desi Creator, Village talent'}
              />
            </div>

            {errorMsg && (
              <div className="text-rose-400 text-xs font-semibold bg-rose-500/20 p-2.5 rounded-xl border border-rose-500/30 text-center">
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-200" />
                  <span>{language === 'hi' ? 'मेरी प्रोफाइल बनाएं और रील्स देखें' : 'Create Profile & Enter App'}</span>
                  <ArrowRight className="w-5 h-5 text-amber-200" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
