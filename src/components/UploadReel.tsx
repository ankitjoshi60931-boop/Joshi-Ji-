import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Upload,
  Video,
  FileCheck,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  Music,
  MapPin,
  Users,
  Image,
  Tag,
  Ban,
  CheckCircle2,
  Play
} from 'lucide-react';
import { scanContentForModeration, scanVideoForCopyright } from '../utils/moderation';
import confetti from 'canvas-confetti';

export const UploadReel: React.FC = () => {
  const {
    t,
    language,
    currentUser,
    users,
    handleUploadReel,
    handleRecordViolation,
    setActiveTab,
    setActiveReelIndex
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form State
  const [videoUrl, setVideoUrl] = useState<string>('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  const [videoFileName, setVideoFileName] = useState<string>('my_desi_talent_original.mp4');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80');
  const [caption, setCaption] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['#JoshiJiReels', '#DesiTalent']);
  const [customTag, setCustomTag] = useState<string>('');
  const [location, setLocation] = useState<string>('इंदौर, मध्य प्रदेश (Indore)');
  const [selectedMusic, setSelectedMusic] = useState<string>('Desi Dhol Beats - DJ Joshi');
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [previewError, setPreviewError] = useState<boolean>(false);
  
  // Security simulation controls
  const [simulateWatermark, setSimulateWatermark] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [securityError, setSecurityError] = useState<{
    type: 'moderation' | 'copyright' | 'banned';
    title: string;
    message: string;
    strikeInfo?: string;
  } | null>(null);

  // Available Sample Videos
  const sampleVideos = [
    {
      name: 'देसी डांस (Desi Dance)',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumb: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
      fileName: 'desi_dance_original.mp4'
    },
    {
      name: 'खेत और ट्रैक्टर (Farming)',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      thumb: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80',
      fileName: 'kisan_kheti_original.mp4'
    },
    {
      name: 'बारिश और मस्ती (Village Rain)',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      thumb: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      fileName: 'village_rain_comedy.mp4'
    }
  ];

  const popularHashtags = [
    '#JoshiJiReels',
    '#DesiTalent',
    '#GaonKiMasti',
    '#ViralVideo',
    '#ApnaBharat',
    '#KisanPower',
    '#DesiComedy'
  ];

  const popularLocations = [
    'इंदौर, मध्य प्रदेश (Indore)',
    'जयपुर, राजस्थान (Jaipur)',
    'वाराणसी, उत्तर प्रदेश (Kashi)',
    'पटना, बिहार (Patna)',
    'करनाल, हरियाणा (Karnal)',
    'दिल्ली (Delhi)'
  ];

  const musicLibrary = [
    'Desi Dhol Beats - DJ Joshi',
    'Rajasthani Folk Instrumental - Sarangi',
    'Bhangra Punjab Anthem - Dhol Master',
    'Krishna Flute & Sitar - Devotional Vibe',
    'Bollywood Acoustic Guitar - Romantic'
  ];

  // Quick caption helpers
  const hindiQuickPhrases = [
    'जय श्री राम 🚩',
    'अपनी माटी का हुनर 🌾',
    'गांव की असली मस्ती 😂',
    'भारत माता की जय 🇮🇳',
    'लाइक और शेयर जरूर करें 🙏'
  ];

  // Handle local video file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFileName(file.name);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  // Toggle Collaborator
  const toggleCollaborator = (username: string) => {
    if (collaborators.includes(username)) {
      setCollaborators(collaborators.filter(c => c !== username));
    } else {
      if (collaborators.length < 2) {
        setCollaborators([...collaborators, username]);
      }
    }
  };

  // Toggle Hashtag
  const toggleHashtag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTag.trim()) return;
    const formatted = customTag.startsWith('#') ? customTag.trim() : `#${customTag.trim()}`;
    if (!selectedTags.includes(formatted)) {
      setSelectedTags([...selectedTags, formatted]);
    }
    setCustomTag('');
  };

  // Upload Submission with Dual Security Engines
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is currently banned
    if (currentUser?.banStatus === 'banned') {
      setSecurityError({
        type: 'banned',
        title: language === 'hi' ? 'खाता स्थायी रूप से बैन है' : 'Account Permanently Banned',
        message: language === 'hi' ? '3 बार नियम उल्लंघन के कारण आप नई रील अपलोड नहीं कर सकते।' : 'You cannot upload reels due to permanent suspension.'
      });
      return;
    }

    if (currentUser?.banStatus === 'ban7days') {
      setSecurityError({
        type: 'banned',
        title: language === 'hi' ? 'खाता 7 दिनों के लिए बैन है' : 'Account Suspended (7 Days)',
        message: language === 'hi' ? 'दूसरी चेतावनी के कारण आपका खाता 7 दिन के लिए निलंबित है।' : 'Account is suspended for 7 days due to 2nd warning.'
      });
      return;
    }

    setIsUploading(true);
    setSecurityError(null);

    // SECURITY ENGINE 1: Auto AI Moderation (Abusive words, gaali, vulgar, violence)
    const moderationResult = scanContentForModeration(caption, selectedTags);
    if (!moderationResult.passed) {
      setIsUploading(false);
      const strike = handleRecordViolation(currentUser?.uid || 'user', 'Abusive content in upload');
      setSecurityError({
        type: 'moderation',
        title: t.againstRulesTitle,
        message: language === 'hi' ? moderationResult.reasonHindi : moderationResult.reasonEnglish,
        strikeInfo: language === 'hi' ? strike.msgHindi : strike.msgEng
      });
      return;
    }

    // SECURITY ENGINE 2: Auto Copyright & Watermark Detection
    const copyrightResult = scanVideoForCopyright(videoFileName, videoUrl, simulateWatermark);
    if (!copyrightResult.passed) {
      setIsUploading(false);
      setSecurityError({
        type: 'copyright',
        title: t.copyrightErrorTitle,
        message: language === 'hi' ? copyrightResult.reasonHindi : copyrightResult.reasonEnglish
      });
      return;
    }

    // Both Security Checks Passed! Uploading Reel
    setTimeout(() => {
      handleUploadReel({
        videoUrl,
        thumbnailUrl,
        caption: caption.trim() || 'देसी हुनर जोशी जी रील्स पर!',
        hashtags: selectedTags,
        location,
        musicTitle: selectedMusic.split(' - ')[0] || selectedMusic,
        musicArtist: selectedMusic.split(' - ')[1] || 'Joshi Ji Records',
        collaborators,
        isOriginal: true,
        copyrightPassed: true,
        status: 'approved'
      });

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });

      setIsUploading(false);
      setActiveReelIndex(0);
      setActiveTab('feed');
    }, 1200);
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-[calc(100vh-68px)] bg-gradient-to-b from-purple-950 via-slate-900 to-black text-white p-4 pb-24 overflow-y-auto">
      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
          <Upload className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">{t.uploadTitle}</h2>
          <p className="text-xs text-purple-300">{t.uploadSubtitle}</p>
        </div>
      </div>

      {/* Security Error Alert Banner */}
      {securityError && (
        <div className="mb-5 p-4 rounded-2xl bg-rose-950/80 border-2 border-rose-500 text-rose-200 animate-in zoom-in-95 shadow-xl">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-black text-white tracking-wide uppercase">
                {securityError.title}
              </h4>
              <p className="text-xs text-rose-200 mt-1 leading-relaxed">
                {securityError.message}
              </p>
              {securityError.strikeInfo && (
                <div className="mt-2 text-xs font-black p-2 bg-black/40 rounded-xl border border-rose-400/30 text-amber-300">
                  {securityError.strikeInfo}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleUploadSubmit} className="space-y-5">
        {/* Step 1: Select Video */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <label className="block text-xs font-extrabold text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Video className="w-4 h-4" />
            <span>1. {t.chooseVideo}</span>
          </label>

          {/* Video Preview */}
          <div className="relative aspect-[9/12] w-full max-w-[220px] mx-auto rounded-xl overflow-hidden bg-black border-2 border-purple-500/40 mb-3 shadow-lg">
            {!previewError ? (
              <video
                key={videoUrl}
                src={videoUrl}
                poster={thumbnailUrl}
                controls
                playsInline
                preload="metadata"
                onError={() => setPreviewError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full relative">
                <img src={thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-3">
                  <Play className="w-10 h-10 text-orange-400 mb-1" />
                  <span className="text-[11px] text-white font-bold">{videoFileName}</span>
                </div>
              </div>
            )}
            {simulateWatermark && (
              <div className="absolute top-3 right-3 bg-red-600/90 text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                [Watermark Simulated]
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-purple-200/80 mb-3">
            <span className="truncate max-w-[180px]">📁 {videoFileName}</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-500/40 hover:bg-orange-500/30 font-bold"
            >
              {t.changeVideo}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Quick Preset Sample Videos */}
          <div className="text-[11px] text-purple-300/80 font-bold mb-1.5">
            {language === 'hi' ? 'या डेमो वीडियो चुनें:' : 'Or choose sample video:'}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {sampleVideos.map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setVideoUrl(sample.url);
                  setThumbnailUrl(sample.thumb);
                  setVideoFileName(sample.fileName);
                  setPreviewError(false);
                }}
                className={`p-2 rounded-xl border text-[11px] text-center font-bold transition-all ${
                  videoUrl === sample.url
                    ? 'border-orange-500 bg-orange-500/20 text-white'
                    : 'border-white/10 bg-white/5 text-purple-300 hover:border-white/20'
                }`}
              >
                {sample.name}
              </button>
            ))}
          </div>

          {/* Watermark Simulation Toggle for testing */}
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
            <label className="text-[11px] text-purple-300 flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={simulateWatermark}
                onChange={(e) => setSimulateWatermark(e.target.checked)}
                className="rounded accent-orange-500"
              />
              <span>{language === 'hi' ? 'वॉटरमार्क टेस्ट (Simulate Watermark Block)' : 'Simulate Watermark Block'}</span>
            </label>
            <span className="text-[10px] text-orange-400 font-semibold">AI Security</span>
          </div>
        </div>

        {/* Step 2: Caption (Hindi / English) */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <label className="block text-xs font-extrabold text-orange-400 uppercase tracking-wider mb-2">
            2. {t.captionLabel}
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder={t.captionPlaceholder}
            rows={3}
            className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-sm text-white placeholder-purple-300/40 outline-none focus:border-orange-500 leading-relaxed"
          />

          {/* Quick Hindi Phrase Chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {hindiQuickPhrases.map((phrase, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCaption(prev => prev ? `${prev} ${phrase}` : phrase)}
                className="text-[11px] bg-purple-900/60 hover:bg-purple-800 text-purple-200 px-2.5 py-1 rounded-full border border-purple-500/30"
              >
                + {phrase}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Hashtags */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <label className="block text-xs font-extrabold text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            <span>3. {t.hashtagsLabel}</span>
          </label>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {popularHashtags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleHashtag(tag)}
                  className={`text-xs px-2.5 py-1 rounded-full font-bold border transition-all ${
                    isSelected
                      ? 'bg-orange-500 text-white border-orange-400'
                      : 'bg-white/5 text-purple-300 border-white/10 hover:border-white/30'
                  }`}
                >
                  {tag} {isSelected && '✓'}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              placeholder="#नया_हैशटैग"
              className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white placeholder-purple-300/40 outline-none"
            />
            <button
              type="button"
              onClick={handleAddCustomTag}
              className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold"
            >
              + जोड़ें
            </button>
          </div>
        </div>

        {/* Step 4: Location */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <label className="block text-xs font-extrabold text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>4. {t.locationLabel}</span>
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-sm text-white outline-none focus:border-orange-500"
          >
            {popularLocations.map((loc) => (
              <option key={loc} value={loc} className="bg-slate-900 text-white">
                📍 {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Step 5: Music Track Picker */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <label className="block text-xs font-extrabold text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Music className="w-3.5 h-3.5" />
            <span>5. {t.musicLabel}</span>
          </label>
          <select
            value={selectedMusic}
            onChange={(e) => setSelectedMusic(e.target.value)}
            className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-sm text-white outline-none focus:border-orange-500"
          >
            {musicLibrary.map((m) => (
              <option key={m} value={m} className="bg-slate-900 text-white">
                🎵 {m}
              </option>
            ))}
          </select>
        </div>

        {/* Step 6: Collaboration with up to 2 Creators */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <label className="block text-xs font-extrabold text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>6. {t.collabLabel}</span>
          </label>
          <p className="text-[11px] text-purple-300 mb-2">
            {language === 'hi' ? 'साथी क्रिएटर चुनें (अधिकतम 2):' : 'Select creators to collaborate with (max 2):'}
          </p>

          <div className="space-y-2">
            {users
              .filter(u => u.uid !== currentUser?.uid)
              .map(u => {
                const isSelected = collaborators.includes(u.username);
                return (
                  <button
                    key={u.uid}
                    type="button"
                    onClick={() => toggleCollaborator(u.username)}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500/20 text-white font-bold'
                        : 'border-white/10 bg-white/5 text-purple-200 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img src={u.photoURL} alt={u.displayName} className="w-6 h-6 rounded-full object-cover" />
                      <span>{u.displayName} (@{u.username})</span>
                    </div>
                    <span>{isSelected ? '✓ चयनित' : '+ जोड़ें'}</span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Step 7: Cover Photo (Thumbnail) */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <label className="block text-xs font-extrabold text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Image className="w-3.5 h-3.5" />
            <span>7. {t.coverPhotoLabel}</span>
          </label>
          <div className="flex items-center gap-3">
            <img
              src={thumbnailUrl}
              alt="Cover"
              className="w-16 h-20 rounded-xl object-cover border border-purple-500/40"
            />
            <div className="text-xs text-purple-300">
              <p className="font-semibold text-white">ऑटो-जेनरेटेड कवर फोटो</p>
              <p className="text-[11px] text-purple-300/70">वीडियो की सर्वश्रेष्ठ फ्रेम चुनी गई है</p>
            </div>
          </div>
        </div>

        {/* Big Village-friendly Upload Button */}
        <button
          type="submit"
          disabled={isUploading}
          className="w-full py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-orange-500/40 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
        >
          {isUploading ? (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{t.uploadingWait}</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-6 h-6 text-amber-200" />
              <span>{t.uploadNowBtn}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
