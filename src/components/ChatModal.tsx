import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Users,
  Video,
  Phone,
  Image,
  Mic,
  Send,
  ArrowLeft,
  X,
  Play,
  Square,
  MicOff,
  VideoOff,
  PhoneOff,
  Sparkles,
  Paperclip
} from 'lucide-react';
import { ChatThread, ChatMessage, UserProfile } from '../types';

export const ChatModal: React.FC = () => {
  const {
    t,
    language,
    currentUser,
    users,
    chats,
    messages,
    handleSendMessage,
    activeCall,
    startVideoCall,
    endVideoCall
  } = useApp();

  const [activeChatId, setActiveChatId] = useState<string | null>('chat_group_creators');
  const [chatTypeTab, setChatTypeTab] = useState<'all' | 'direct' | 'group'>('all');
  const [inputText, setInputText] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceInterval, setVoiceInterval] = useState<any>(null);

  // Video call controls inside call
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState(false);

  const activeChat = chats.find(c => c.id === activeChatId);
  const currentMessages = activeChatId ? messages[activeChatId] || [] : [];

  // Filter chats by tab
  const filteredChats = chats.filter(c => {
    if (chatTypeTab === 'direct') return !c.isGroup;
    if (chatTypeTab === 'group') return c.isGroup;
    return true;
  });

  // Send Text
  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeChatId) return;

    handleSendMessage(activeChatId, {
      type: 'text',
      content: inputText.trim()
    });
    setInputText('');
  };

  // Send Photo / Media attachment
  const handleSendPhoto = (url: string) => {
    if (!activeChatId) return;
    handleSendMessage(activeChatId, {
      type: 'image',
      content: '📷 फोटो',
      mediaUrl: url
    });
  };

  // Voice Chat Recording
  const startRecording = () => {
    setIsRecordingVoice(true);
    setRecordingSeconds(0);
    const interval = setInterval(() => {
      setRecordingSeconds(sec => sec + 1);
    }, 1000);
    setVoiceInterval(interval);
  };

  const stopAndSendRecording = () => {
    if (voiceInterval) clearInterval(voiceInterval);
    setIsRecordingVoice(false);

    if (activeChatId) {
      handleSendMessage(activeChatId, {
        type: 'voice',
        content: `🎤 वॉइस संदेश (${recordingSeconds || 2}s)`,
        voiceDurationSeconds: recordingSeconds || 2
      });
    }
    setRecordingSeconds(0);
  };

  const cancelRecording = () => {
    if (voiceInterval) clearInterval(voiceInterval);
    setIsRecordingVoice(false);
    setRecordingSeconds(0);
  };

  // Find target recipient user for 1-to-1 video calls
  const targetUserForCall = activeChat && !activeChat.isGroup
    ? users.find(u => u.displayName === activeChat.name || activeChat.participants.includes(u.uid))
    : users[1];

  return (
    <div className="w-full max-w-md mx-auto h-[calc(100vh-68px)] bg-gradient-to-b from-purple-950 via-slate-900 to-black text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {activeChatId && (
            <button
              onClick={() => setActiveChatId(null)}
              className="p-1 -ml-1 text-purple-300 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-black text-white leading-tight">
              {activeChat ? activeChat.name : t.chatTitle}
            </h2>
            <p className="text-[10px] text-emerald-400 font-semibold">
              {activeChat ? (activeChat.isGroup ? 'ग्रुप सदस्य सक्रिय' : t.online) : '1-to-1 + ग्रुप + वॉइस + वीडियो कॉल'}
            </p>
          </div>
        </div>

        {/* Call Buttons in Active Chat */}
        {activeChat && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => targetUserForCall && startVideoCall(targetUserForCall)}
              className="p-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/40"
              title={t.startVideoCall}
            >
              <Video className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Area: Conversation List OR Active Messages */}
      {!activeChatId ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Tabs */}
          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
            <button
              onClick={() => setChatTypeTab('all')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                chatTypeTab === 'all'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                  : 'text-purple-300'
              }`}
            >
              सभी (All)
            </button>
            <button
              onClick={() => setChatTypeTab('direct')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                chatTypeTab === 'direct'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                  : 'text-purple-300'
              }`}
            >
              1-to-1
            </button>
            <button
              onClick={() => setChatTypeTab('group')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                chatTypeTab === 'group'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                  : 'text-purple-300'
              }`}
            >
              ग्रुप (Group)
            </button>
          </div>

          {/* Chat Threads */}
          <div className="space-y-2">
            {filteredChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-12 h-12 rounded-full object-cover border border-purple-500/40"
                    />
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-black absolute -bottom-0.5 -right-0.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">{chat.name}</h3>
                    <p className="text-xs text-purple-200/80 truncate max-w-[200px] mt-0.5">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] text-purple-400">{chat.lastMessageTime}</div>
                  {chat.unreadCount ? (
                    <span className="inline-block px-1.5 py-0.5 mt-1 rounded-full bg-orange-500 text-black text-[10px] font-black">
                      {chat.unreadCount}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Message History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {currentMessages.map(msg => {
              const isMine = msg.senderId === currentUser?.uid || msg.senderId === 'owner_joshiji';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-purple-300/60 mb-0.5 px-1">
                    {msg.senderName}
                  </span>
                  <div
                    className={`max-w-[78%] rounded-2xl p-3 text-xs leading-relaxed shadow-md ${
                      isMine
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black font-semibold rounded-tr-none'
                        : 'bg-white/10 border border-white/10 text-white rounded-tl-none'
                    }`}
                  >
                    {msg.type === 'text' && <p>{msg.content}</p>}

                    {msg.type === 'image' && (
                      <div>
                        <img
                          src={msg.mediaUrl}
                          alt="Media"
                          className="rounded-xl max-h-48 object-cover mb-1"
                        />
                        <p className="text-[11px] font-medium">{msg.content}</p>
                      </div>
                    )}

                    {msg.type === 'voice' && (
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-black/20 flex items-center justify-center">
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </div>
                        <div className="flex-1">
                          <div className="h-1 bg-current opacity-40 rounded-full w-24 mb-1" />
                          <span className="text-[10px]">{msg.content}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Photo Share Simulator */}
          <div className="px-4 py-1 flex items-center gap-2 overflow-x-auto text-[11px] text-purple-300">
            <span>📷 {language === 'hi' ? 'त्वरित फोटो:' : 'Quick Share:'}</span>
            <button
              onClick={() => handleSendPhoto('https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80')}
              className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
            >
              देसी फोटो
            </button>
            <button
              onClick={() => handleSendPhoto('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80')}
              className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
            >
              खेत फोटो
            </button>
          </div>

          {/* Voice Recording Banner */}
          {isRecordingVoice && (
            <div className="p-3 bg-red-950/80 border-t border-red-500/40 flex items-center justify-between text-xs animate-pulse">
              <div className="flex items-center gap-2 text-rose-300 font-bold">
                <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                <span>रिकॉर्डिंग चालू है... {recordingSeconds}s</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={cancelRecording}
                  className="px-2.5 py-1 rounded-lg bg-white/10 text-white"
                >
                  रद्द करें
                </button>
                <button
                  onClick={stopAndSendRecording}
                  className="px-3 py-1 rounded-lg bg-rose-500 text-white font-bold"
                >
                  भेजें
                </button>
              </div>
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3 border-t border-white/10 bg-black/60 shrink-0">
            <form onSubmit={handleSendText} className="flex items-center gap-2">
              {/* Voice Record Button */}
              <button
                type="button"
                onClick={isRecordingVoice ? stopAndSendRecording : startRecording}
                className={`p-2.5 rounded-full border transition-all ${
                  isRecordingVoice
                    ? 'bg-rose-500 text-white border-rose-400'
                    : 'bg-white/10 hover:bg-white/20 text-orange-400 border-white/15'
                }`}
                title={t.sendVoiceNote}
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.typeMessagePlaceholder}
                className="flex-1 bg-white/10 border border-white/15 rounded-full px-4 py-2.5 text-xs text-white placeholder-purple-300/50 outline-none focus:border-orange-500"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white disabled:opacity-40 cursor-pointer shadow-md shadow-orange-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Real-time Video Call Overlay Modal */}
      {activeCall && activeCall.active && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-between p-6">
          {/* Top Call Info */}
          <div className="w-full flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                {activeCall.isRinging ? 'कॉल मिल रहा है (Ringing)...' : t.inVideoCall}
              </span>
            </div>
            <span className="text-xs text-purple-300 bg-white/10 px-3 py-1 rounded-full">
              HD 1080p
            </span>
          </div>

          {/* Caller Stream Display */}
          <div className="w-full flex-1 flex flex-col items-center justify-center my-4 relative rounded-3xl overflow-hidden bg-slate-900 border-2 border-purple-500/40">
            {isVideoDisabled ? (
              <div className="text-center p-6">
                <VideoOff className="w-16 h-16 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-purple-200">कैमरा बंद है</p>
              </div>
            ) : (
              <img
                src={activeCall.targetUser?.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80'}
                alt={activeCall.targetUser?.displayName}
                className="w-full h-full object-cover"
              />
            )}

            {/* Remote Info Banner */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <h4 className="text-sm font-extrabold text-white">
                {activeCall.targetUser?.displayName || 'रमेश स्टार'}
              </h4>
              <p className="text-[11px] text-orange-400">
                @{activeCall.targetUser?.username || 'ramesh_comedy'}
              </p>
            </div>

            {/* Self Camera PiP View */}
            <div className="absolute bottom-4 right-4 w-28 h-40 rounded-2xl overflow-hidden border-2 border-orange-500 shadow-2xl bg-black">
              <img
                src={currentUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                alt="Self"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-[9px] font-bold text-white">
                आप (You)
              </div>
            </div>
          </div>

          {/* Bottom Call Controls */}
          <div className="w-full flex items-center justify-center gap-5 pb-6">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-full border transition-all ${
                isMuted
                  ? 'bg-rose-500 border-rose-400 text-white'
                  : 'bg-white/15 border-white/20 text-white hover:bg-white/25'
              }`}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            <button
              onClick={() => setIsVideoDisabled(!isVideoDisabled)}
              className={`p-4 rounded-full border transition-all ${
                isVideoDisabled
                  ? 'bg-rose-500 border-rose-400 text-white'
                  : 'bg-white/15 border-white/20 text-white hover:bg-white/25'
              }`}
            >
              {isVideoDisabled ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </button>

            {/* End Call Button */}
            <button
              onClick={endVideoCall}
              className="p-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-600/50 active:scale-95 transition-all"
              title={t.endCall}
            >
              <PhoneOff className="w-7 h-7" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
