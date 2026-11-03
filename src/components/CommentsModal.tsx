import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Send, Trash2, MessageCircle, ShieldCheck } from 'lucide-react';
import { scanContentForModeration } from '../utils/moderation';

interface CommentsModalProps {
  reelId: string;
  onClose: () => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({ reelId, onClose }) => {
  const { t, language, comments, currentUser, isOwner, handleAddComment, handleDeleteComment, handleRecordViolation } = useApp();
  const [commentText, setCommentText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const reelComments = comments[reelId] || [];

  const handlePost = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commentText.trim()) return;

    // AI Moderation on comment text
    const check = scanContentForModeration(commentText);
    if (!check.passed) {
      if (currentUser) {
        handleRecordViolation(currentUser.uid, 'Abusive comment');
      }
      setErrorMsg(
        language === 'hi'
          ? 'टिप्पणी में आपत्तिजनक या गाली-गलौज वाले शब्द पाए गए हैं!'
          : 'Inappropriate or abusive words detected in comment!'
      );
      return;
    }

    handleAddComment(reelId, commentText);
    setCommentText('');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center animate-in fade-in">
      <div className="w-full max-w-md bg-gradient-to-b from-purple-950 via-slate-900 to-black border-t border-purple-500/30 rounded-t-3xl max-h-[80vh] flex flex-col text-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-orange-400" />
            <h3 className="font-extrabold text-base text-white">
              {t.comment} ({reelComments.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comment List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 divide-y divide-white/5">
          {reelComments.length === 0 ? (
            <div className="text-center py-12 text-purple-300/60 text-sm">
              <span className="text-3xl block mb-2">💬</span>
              {t.noCommentsYet}
            </div>
          ) : (
            reelComments.map((c) => {
              const canDelete = isOwner || (currentUser && currentUser.uid === c.authorId);
              return (
                <div key={c.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3 group">
                  <div className="flex items-start gap-3">
                    <img
                      src={c.authorPhoto}
                      alt={c.authorName}
                      className="w-8 h-8 rounded-full object-cover border border-purple-500/30 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{c.authorName}</span>
                        <span className="text-[11px] text-purple-300/70">@{c.authorUsername}</span>
                        <span className="text-[10px] text-purple-400/50">· {c.createdAt}</span>
                      </div>
                      <p className="text-sm text-purple-100 mt-0.5 break-words">{c.text}</p>
                    </div>
                  </div>

                  {canDelete && (
                    <button
                      onClick={() => handleDeleteComment(c.id, reelId)}
                      title={language === 'hi' ? 'कमेंट हटाएं' : 'Delete Comment'}
                      className="text-purple-400 hover:text-rose-400 p-1 opacity-70 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Post Form */}
        <div className="p-3 border-t border-white/10 bg-black/40 shrink-0">
          {errorMsg && (
            <div className="text-rose-400 text-xs font-bold mb-2 p-2 bg-rose-500/20 rounded-lg">
              {errorMsg}
            </div>
          )}
          <form onSubmit={handlePost} className="flex items-center gap-2">
            {currentUser && (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName}
                className="w-8 h-8 rounded-full object-cover border border-orange-500 shrink-0"
              />
            )}
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t.addCommentPlaceholder}
              className="flex-1 bg-white/10 border border-white/15 rounded-full px-4 py-2.5 text-sm text-white placeholder-purple-300/50 outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="p-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white disabled:opacity-40 hover:from-orange-600 cursor-pointer shadow-md shadow-orange-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
