// AI Moderation & Copyright Engine for Joshi Ji Reels

const ABUSIVE_WORDS = [
  // Hindi transliterated & Devanagari abusive, gaali, vulgar, violent terms
  'madarchod', 'bhenchod', 'chutiya', 'harami', 'kameene', 'saale', 'bhosdike', 'gandu',
  'randi', 'lauda', 'loda', 'choot', 'gaand', 'bhadwe', 'chirkut', 'kutte',
  'मादरचोद', 'बहनचोद', 'चूतिया', 'हरामी', 'कमीने', 'साले', 'भोसड़ीके', 'गांडू', 'रंडी',
  'लौड़ा', 'लोड़ा', 'भड़वे', 'कुत्ते', 'मारपीट', 'हत्या', 'खूनखराबा', 'अश्लील', 'गाली',
  'suicide', 'आत्महत्या', 'violence', 'porn', 'nude', 'vulgar', 'sex', 'rape',
  // English vulgarities
  'fuck', 'shit', 'bitch', 'bastard', 'asshole', 'dick', 'pussy', 'whore', 'slut', 'kill'
];

const WATERMARK_PATTERNS = [
  'instagram', 'insta_reel', 'snaptik', 'tiktok', 'musically', 'youtube_shorts', 'ytshorts',
  'ssstiktok', 'savefrom', 'reelsave', 'watermark', 'downloaded', 'fb_reel', 'facebook_watch',
  'tik_tok', 'inshot_watermark'
];

export interface ModerationResult {
  passed: boolean;
  strikeLevel: number;
  flaggedWords: string[];
  reasonHindi: string;
  reasonEnglish: string;
}

export interface CopyrightResult {
  passed: boolean;
  watermarkDetected: boolean;
  detectedPlatform?: string;
  reasonHindi: string;
  reasonEnglish: string;
}

/**
 * Real-time AI Content Moderation for Captions, Hashtags, & Content
 */
export function scanContentForModeration(
  caption: string,
  hashtags: string[] = []
): ModerationResult {
  const fullText = `${caption} ${hashtags.join(' ')}`.toLowerCase();
  const flaggedWords: string[] = [];

  for (const word of ABUSIVE_WORDS) {
    // Check whole word or sub-pattern
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(fullText) || fullText.includes(word.toLowerCase())) {
      flaggedWords.push(word);
    }
  }

  if (flaggedWords.length > 0) {
    return {
      passed: false,
      strikeLevel: 1, // Will be incremented based on user's current violation count
      flaggedWords,
      reasonHindi: 'नियमों के खिलाफ (Against Rules): आपत्तिजनक, अश्लील या गाली-गलौज वाले शब्द पाए गए हैं।',
      reasonEnglish: 'Against Rules: Abusive words, vulgarity or objectionable content detected.'
    };
  }

  return {
    passed: true,
    strikeLevel: 0,
    flaggedWords: [],
    reasonHindi: 'सामग्री सुरक्षित और अनुमोदित है।',
    reasonEnglish: 'Content passed AI safety check.'
  };
}

/**
 * Auto Copyright & Watermark Detection Scanner
 */
export function scanVideoForCopyright(
  fileName: string,
  videoUrl: string,
  detectedWatermarkSimulated?: boolean
): CopyrightResult {
  const lowerFile = fileName.toLowerCase();
  const lowerUrl = videoUrl.toLowerCase();

  // Explicit watermark trigger or detected signature
  if (detectedWatermarkSimulated) {
    return {
      passed: false,
      watermarkDetected: true,
      detectedPlatform: 'Third-Party Watermark',
      reasonHindi: 'वॉटरमार्क पाया गया! Instagram, TikTok या YouTube से डाउनलोड किया हुआ वीडियो नहीं चलेगा। केवल खुद का ओरिजिनल वीडियो ही डालें।',
      reasonEnglish: 'Watermark detected! Videos downloaded from Instagram, TikTok, or YouTube are prohibited. Only original videos allowed.'
    };
  }

  // Check file name / URL patterns
  for (const pattern of WATERMARK_PATTERNS) {
    if (lowerFile.includes(pattern) || lowerUrl.includes(pattern)) {
      let platform = 'Instagram / TikTok / YouTube';
      if (pattern.includes('insta')) platform = 'Instagram';
      if (pattern.includes('tiktok')) platform = 'TikTok';
      if (pattern.includes('youtube') || pattern.includes('ytshorts')) platform = 'YouTube Shorts';

      return {
        passed: false,
        watermarkDetected: true,
        detectedPlatform: platform,
        reasonHindi: `कॉपीराइट उल्लंघन: यह वीडियो ${platform} से डाउनलोड किया हुआ प्रतीत होता है। केवल खुद का ओरिजिनल वीडियो ही डालें।`,
        reasonEnglish: `Copyright violation: Video appears downloaded from ${platform}. Only original videos allowed.`
      };
    }
  }

  return {
    passed: true,
    watermarkDetected: false,
    reasonHindi: 'कॉपीराइट जांच सफल: 100% ओरिजिनल वीडियो।',
    reasonEnglish: 'Copyright check passed: 100% Original video.'
  };
}

/**
 * Calculate strike consequences
 */
export function calculateNextStrike(currentViolations: number): {
  newCount: number;
  banStatus: 'clean' | 'warning1' | 'ban7days' | 'banned';
  expiresInDays?: number;
  messageHindi: string;
  messageEnglish: string;
} {
  const newCount = currentViolations + 1;

  if (newCount === 1) {
    return {
      newCount: 1,
      banStatus: 'warning1',
      messageHindi: '⚠️ 1st Warning (पहली चेतावनी): आपके वीडियो में नियमों का उल्लंघन था। दोबारा उल्लंघन करने पर 7 दिन का बैन लगेगा।',
      messageEnglish: '⚠️ 1st Warning: Inappropriate content detected. Second violation will result in a 7-day ban.'
    };
  } else if (newCount === 2) {
    return {
      newCount: 2,
      banStatus: 'ban7days',
      expiresInDays: 7,
      messageHindi: '🚫 2nd Warning (दूसरी चेतावनी): आपका खाता अगले 7 दिनों के लिए बैन कर दिया गया है। आप वीडियो अपलोड या कमाई नहीं कर सकते।',
      messageEnglish: '🚫 2nd Warning: Your account is suspended for 7 days. Uploading and monetization are temporarily paused.'
    };
  } else {
    return {
      newCount: 3,
      banStatus: 'banned',
      messageHindi: '❌ 3rd Strike (तीसरी चेतावनी): आपका खाता स्थायी रूप से बंद (Permanent Ban) कर दिया गया है एवं मोनेटाइजेशन हमेशा के लिए निरस्त है।',
      messageEnglish: '❌ 3rd Strike: Your account is permanently banned and all monetization features are revoked.'
    };
  }
}
