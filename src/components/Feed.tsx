import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  MessageCircle,
  Share2,
  Gift,
  Volume2,
  VolumeX,
  Play,
  Pause,
  MapPin,
  Music,
  CheckCircle,
  UserPlus,
  UserCheck,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Shield,
  Copy,
  Check
} from 'lucide-react';
import { CommentsModal } from './CommentsModal';
import { GiftModal } from './GiftModal';
import { PWAInstallButton } from './PWAInstallButton';
import { PublishLinkModal } from './PublishLinkModal';

export const Feed: React.FC = () => {
  const {
    t,
    language,
    reels,
    activeReelIndex,
    setActiveReelIndex,
    likedReels,
    handleLikeReel,
    followingUsers,
    handleFollowUser,
    isOwner,
    setShowAdminPanel,
    setShowLanguageModal
  } = useApp();

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showHeartBurst, setShowHeartBurst] = useState<boolean>(false);
  const [activeCommentsReelId, setActiveCommentsReelId] = useState<string | null>(null);
  const [activeGiftReel, setActiveGiftReel] = useState<{ id: string; authorName: string; authorId: string } | null>(null);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [expandedCaption, setExpandedCaption] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [videoHasError, setVideoHasError] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const currentReel = reels[activeReelIndex] || reels[0];

  // Auto-play when activeReelIndex changes
  useEffect(() => {
    setVideoHasError(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: mute and play
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(e => console.log('Autoplay handled:', e));
        }
      });
      setIsPlaying(true);
      setExpandedCaption(false);
    }
  }, [activeReelIndex]);

  // Fallback progression ticker when video element cannot stream
  useEffect(() => {
    if (videoHasError && isPlaying) {
      const interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 2.5));
      }, 250);
      return () => clearInterval(interval);
    }
  }, [videoHasError, isPlaying]);

  // Video progress updater
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration || 1;
      setProgress((current / total) * 100);
    }
  };

  // Toggle Play/Pause on single tap
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Double-tap to like
  const handleDoubleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentReel && !likedReels.has(currentReel.id)) {
      handleLikeReel(currentReel.id);
    }
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 900);
  };

  // Next / Prev Reel
  const handleNextReel = () => {
    if (activeReelIndex < reels.length - 1) {
      setActiveReelIndex(activeReelIndex + 1);
    } else {
      setActiveReelIndex(0); // loop
    }
  };

  const handlePrevReel = () => {
    if (activeReelIndex > 0) {
      setActiveReelIndex(activeReelIndex - 1);
    }
  };

  // Keyboard navigation (ArrowUp/ArrowDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        handleNextReel();
      } else if (e.key === 'ArrowUp') {
        handlePrevReel();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeReelIndex, reels.length, isPlaying]);

  if (!currentReel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black text-white p-4">
        <p className="text-purple-300">कोई रील उपलब्ध नहीं है</p>
      </div>
    );
  }

  const isLiked = likedReels.has(currentReel.id);
  const isFollowing = followingUsers.has(currentReel.authorId);

  const shareText = `Watch ${currentReel.authorName} on Joshi Ji Reels! 🇮🇳 ${currentReel.caption}`;
  const shareUrl = window.location.href;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="relative w-full h-[calc(100vh-68px)] max-w-md mx-auto bg-black overflow-hidden flex flex-col select-none">
      {/* Top Floating App Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 via-black/30 to-transparent">
        <div className="flex items-center gap-2.5">
          <img
            src="/joshi.jpg"
            alt="Joshi Ji Reels"
            className="w-9 h-9 rounded-xl object-cover border-2 border-amber-400 shadow-md shadow-orange-500/30"
          />
          <span className="font-black text-lg tracking-wide bg-gradient-to-r from-orange-400 via-amber-200 to-purple-300 bg-clip-text text-transparent drop-shadow">
            {t.appName}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* PWA Install Button */}
          <PWAInstallButton variant="header" />

          {/* Publish Link Modal Trigger */}
          <button
            onClick={() => setShowPublishModal(true)}
            className="px-2 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 hover:bg-white/25 text-white font-extrabold text-[11px] flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
            title="Publish & Share Link"
          >
            <Share2 className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden xs:inline">{language === 'hi' ? 'लिंक' : 'Link'}</span>
          </button>

          {/* Owner Admin Quick Access */}
          {isOwner && (
            <button
              onClick={() => setShowAdminPanel(true)}
              className="px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-700 to-orange-600 text-white font-extrabold text-[11px] flex items-center gap-1 border border-amber-300/40 shadow-lg shadow-purple-900/50 hover:scale-105 active:scale-95 transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>Admin</span>
            </button>
          )}

          {/* Language Toggle Button */}
          <button
            onClick={() => setShowLanguageModal(true)}
            className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-xs font-black text-orange-400 hover:bg-white/25 active:scale-95 transition-all"
            title={t.changeLang}
          >
            {language === 'hi' ? 'अ' : 'EN'}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.muted = !isMuted;
                setIsMuted(!isMuted);
              }
            }}
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div
        className="relative flex-1 bg-black flex items-center justify-center cursor-pointer"
        onClick={togglePlay}
        onDoubleClick={handleDoubleTap}
      >
        {!videoHasError ? (
          <video
            ref={videoRef}
            key={currentReel.id}
            src={currentReel.videoUrl}
            poster={currentReel.thumbnailUrl}
            loop
            playsInline
            autoPlay
            muted={isMuted}
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onError={() => {
              setVideoHasError(true);
            }}
            className="w-full h-full object-cover"
          />
        ) : (
          /* Graceful Animated Visualizer Fallback when video stream is blocked or unavailable */
          <div className="relative w-full h-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
            <img
              src={currentReel.thumbnailUrl}
              alt={currentReel.caption}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isPlaying ? 'scale-105 filter brightness-75' : 'scale-100 filter brightness-50'
              }`}
            />
            {/* Visualizer Beat Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 flex flex-col items-center justify-center">
              {/* Pulsing Avatar Disc */}
              <div className="relative mb-6">
                <div className={`absolute -inset-4 rounded-full bg-orange-500/30 blur-md ${isPlaying ? 'animate-ping' : ''}`} />
                <div className="w-24 h-24 rounded-full border-4 border-orange-500 shadow-2xl overflow-hidden relative z-10">
                  <img
                    src={currentReel.authorPhoto}
                    alt={currentReel.authorName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Music Equalizer Bars */}
              {isPlaying && (
                <div className="flex items-end gap-1.5 h-10 mb-2">
                  <div className="w-1.5 bg-orange-500 rounded-full animate-[bounce_0.6s_ease-in-out_infinite] h-8" />
                  <div className="w-1.5 bg-amber-400 rounded-full animate-[bounce_0.8s_ease-in-out_infinite] h-10" />
                  <div className="w-1.5 bg-purple-500 rounded-full animate-[bounce_0.5s_ease-in-out_infinite] h-6" />
                  <div className="w-1.5 bg-rose-500 rounded-full animate-[bounce_0.7s_ease-in-out_infinite] h-9" />
                  <div className="w-1.5 bg-orange-400 rounded-full animate-[bounce_0.9s_ease-in-out_infinite] h-7" />
                </div>
              )}
              <span className="text-xs font-bold text-amber-300 bg-black/60 px-3 py-1 rounded-full border border-orange-500/30">
                🎵 {currentReel.musicTitle}
              </span>
            </div>
          </div>
        )}

        {/* Big Heart Burst Animation on Double Tap */}
        {showHeartBurst && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="animate-ping">
              <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-2xl" />
            </div>
          </div>
        )}

        {/* Play/Pause Center Indicator */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none z-10">
            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center text-white animate-in zoom-in-75">
              <Play className="w-8 h-8 fill-white ml-1" />
            </div>
          </div>
        )}

        {/* Up / Down Navigation Controls for Village Users */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 opacity-40 hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevReel();
            }}
            disabled={activeReelIndex === 0}
            className="w-9 h-9 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white disabled:opacity-20 hover:bg-orange-500 active:scale-90"
            title="पिछली रील"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextReel();
            }}
            className="w-9 h-9 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-orange-500 active:scale-90"
            title="अगली रील"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Right Side Action Column (Like, Comment, Share, Follow, Gift) */}
        <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-4">
          {/* Creator Avatar & Follow Button */}
          <div className="relative mb-2">
            <img
              src={currentReel.authorPhoto}
              alt={currentReel.authorName}
              className="w-12 h-12 rounded-full object-cover border-2 border-orange-500 shadow-xl"
            />
            {/* Follow "+" Badge */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFollowUser(currentReel.authorId);
              }}
              className={`absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full p-1 shadow-lg transition-transform active:scale-90 ${
                isFollowing
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white animate-pulse'
              }`}
              title={isFollowing ? t.following : t.follow}
            >
              {isFollowing ? (
                <UserCheck className="w-3.5 h-3.5" />
              ) : (
                <UserPlus className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLikeReel(currentReel.id);
            }}
            className="flex flex-col items-center group active:scale-80 transition-transform"
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border ${
                isLiked
                  ? 'bg-rose-500/30 border-rose-500 text-rose-500'
                  : 'bg-black/40 border-white/20 text-white group-hover:text-rose-400'
              }`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-rose-500' : ''}`} />
            </div>
            <span className="text-[11px] font-black text-white mt-1 drop-shadow">
              {currentReel.likesCount.toLocaleString()}
            </span>
          </button>

          {/* Comment Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveCommentsReelId(currentReel.id);
            }}
            className="flex flex-col items-center group active:scale-80 transition-transform"
          >
            <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:text-orange-400">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-black text-white mt-1 drop-shadow">
              {currentReel.commentsCount.toLocaleString()}
            </span>
          </button>

          {/* Gift Button (Heart ₹10, Flower ₹50, Mithai ₹100, Crown ₹500) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveGiftReel({
                id: currentReel.id,
                authorName: currentReel.authorName,
                authorId: currentReel.authorId
              });
            }}
            className="flex flex-col items-center group active:scale-80 transition-transform"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 border border-amber-300 flex items-center justify-center text-white shadow-lg shadow-orange-500/40">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] font-black text-amber-300 mt-1 drop-shadow bg-black/50 px-1.5 py-0.2 rounded-full">
              {t.sendGift}
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowShareModal(true);
            }}
            className="flex flex-col items-center group active:scale-80 transition-transform"
          >
            <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:text-purple-300">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-black text-white mt-1 drop-shadow">
              {currentReel.sharesCount.toLocaleString()}
            </span>
          </button>

          {/* Spinning Music Vinyl Disk */}
          <div className="w-10 h-10 rounded-full border-2 border-white/30 overflow-hidden animate-[spin_4s_linear_infinite] mt-1 shadow-lg shadow-purple-900/50">
            <img
              src={currentReel.thumbnailUrl}
              alt="Music"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Bottom Overlay: Creator info, Caption, Collab, Hashtags, Location, Audio */}
        <div className="absolute left-0 right-16 bottom-0 z-20 p-4 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col gap-1.5 pointer-events-none">
          {/* Creator Handle with Blue Tick */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <span className="font-extrabold text-base text-white tracking-wide flex items-center gap-1 drop-shadow">
              @{currentReel.authorUsername}
              {currentReel.authorVerified && (
                <CheckCircle className="w-4 h-4 text-blue-400 fill-blue-400 inline" />
              )}
            </span>

            {/* If Collaboration with other creators */}
            {currentReel.collaborators && currentReel.collaborators.length > 0 && (
              <span className="text-[10px] bg-purple-700/80 text-purple-200 px-2 py-0.5 rounded-full font-bold border border-purple-400/30 flex items-center gap-1">
                <span>🤝 Collab:</span>
                {currentReel.collaborators.map(c => `@${c}`).join(', ')}
              </span>
            )}
          </div>

          {/* Location Tag */}
          {currentReel.location && (
            <div className="flex items-center gap-1 text-[11px] text-orange-300/90 font-medium">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span>{currentReel.location}</span>
            </div>
          )}

          {/* Caption (Hindi / English with More toggle) */}
          <div className="pointer-events-auto">
            <p
              className={`text-xs text-white/95 leading-relaxed font-normal ${
                expandedCaption ? '' : 'line-clamp-2'
              }`}
            >
              {currentReel.caption}
            </p>
            {currentReel.caption.length > 60 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedCaption(!expandedCaption);
                }}
                className="text-[11px] text-orange-400 font-bold hover:underline"
              >
                {expandedCaption ? (language === 'hi' ? 'कम देखें' : 'less') : (language === 'hi' ? '...और देखें' : '...more')}
              </button>
            )}
          </div>

          {/* Hashtags */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {currentReel.hashtags.map((tag, i) => (
              <span
                key={i}
                className="text-[11px] text-purple-300 font-semibold drop-shadow"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Audio Ticker */}
          <div className="flex items-center gap-2 pt-1 text-xs text-purple-200/90 font-medium">
            <Music className="w-3.5 h-3.5 text-orange-400 shrink-0 animate-pulse" />
            <div className="overflow-hidden whitespace-nowrap">
              <span className="inline-block animate-marquee">
                {currentReel.musicTitle} - {currentReel.musicArtist}
              </span>
            </div>
          </div>
        </div>

        {/* Video Scrubber Progress Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-gradient-to-b from-purple-950 via-slate-900 to-black border-t sm:border border-purple-500/30 rounded-t-3xl sm:rounded-3xl p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-orange-400" />
                <h3 className="font-extrabold text-base text-white">{t.share}</h3>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 py-5">
              {/* WhatsApp Share */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-emerald-600/30 border border-emerald-500/50 hover:bg-emerald-600/50 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all text-center"
              >
                <span className="text-3xl">💬</span>
                <span className="text-xs font-black text-emerald-200">
                  {language === 'hi' ? 'व्हाट्सएप पर शेयर' : 'WhatsApp Share'}
                </span>
              </a>

              {/* Copy Link */}
              <button
                onClick={copyToClipboard}
                className="p-4 rounded-2xl bg-purple-600/30 border border-purple-500/50 hover:bg-purple-600/50 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all text-center"
              >
                {copiedLink ? (
                  <Check className="w-8 h-8 text-emerald-400" />
                ) : (
                  <Copy className="w-8 h-8 text-purple-300" />
                )}
                <span className="text-xs font-black text-purple-200">
                  {copiedLink ? (language === 'hi' ? 'लिंक कॉपी हो गया!' : 'Copied!') : (language === 'hi' ? 'लिंक कॉपी करें' : 'Copy Link')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Drawer */}
      {activeCommentsReelId && (
        <CommentsModal
          reelId={activeCommentsReelId}
          onClose={() => setActiveCommentsReelId(null)}
        />
      )}

      {/* Gifts Modal */}
      {activeGiftReel && (
        <GiftModal
          reelId={activeGiftReel.id}
          creatorName={activeGiftReel.authorName}
          creatorId={activeGiftReel.authorId}
          onClose={() => setActiveGiftReel(null)}
        />
      )}

      {/* Publish Link Modal */}
      {showPublishModal && (
        <PublishLinkModal onClose={() => setShowPublishModal(false)} />
      )}
    </div>
  );
};
