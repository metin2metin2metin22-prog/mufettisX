const PENALTY_KEY = 'mufettisx_penalty_until';

// Ciddiyetsiz, lakayt, argo veya aşırı özensiz yanıtları tespit eden filtre
export const isUnseriousAnswer = (rawText: string): boolean => {
  const text = rawText.trim().toLowerCase();

  // 1. Çok kısa yanıtlar (4 harften kısa veya tek kelimelik lakayt laflar)
  if (text.length < 4) {
    return true; // Örn: 'sor', 'ok', 'tm', 'ee', 'yo', 'la'
  }

  // 2. Lakayt / ciddiyetsiz kalıplar ve argo
  const unseriousPatterns = [
    /^sor$/i,
    /^sor\s*bakal[ıi]m$/i,
    /^hadi\s*sor$/i,
    /^sor\s*hadi$/i,
    /^hadi$/i,
    /^ge[cç]$/i,
    /^pas$/i,
    /^bilmem$/i,
    /^bilmiyorum$/i,
    /^sanane$/i,
    /^banane$/i,
    /^bo[sş]ver$/i,
    /^salla$/i,
    /^farketmez$/i,
    /^aynen$/i,
    /^yok\s*ya$/i,
    /^napcan$/i,
    /^ne\s*alaka$/i,
    /^asdasd/i,
    /^qwe/i,
    /^test$/i,
    /^deneme$/i,
    /\b(lan|la|aga|kanka|knk|moruk|o[cç]|amk|aq|sik|pi[cç])\b/i
  ];

  for (const pattern of unseriousPatterns) {
    if (pattern.test(text)) {
      return true;
    }
  }

  // 3. Anlamsız harf tekrarları (Örn: 'aaaaaaa', 'sssss')
  if (/(.)\1{4,}/.test(text)) {
    return true;
  }

  // 4. Sesli harf içermeyen veya sadece rastgele basılmış tuşlar
  const hasVowels = /[aeıioöuü]/i.test(text);
  if (!hasVowels && text.length > 5) {
    return true;
  }

  return false;
};

// 5 Dakikalık ceza süresini başlatır (300 saniye)
export const applyPenalty = (seconds: number = 300): void => {
  const until = Date.now() + seconds * 1000;
  localStorage.setItem(PENALTY_KEY, until.toString());
};

// Kalan ceza süresini saniye cinsinden döndürür
export const getRemainingPenaltySeconds = (): number => {
  const stored = localStorage.getItem(PENALTY_KEY);
  if (!stored) return 0;

  const until = parseInt(stored, 10);
  const diffMs = until - Date.now();
  if (diffMs <= 0) {
    localStorage.removeItem(PENALTY_KEY);
    return 0;
  }

  return Math.ceil(diffMs / 1000);
};

// Cezayı temizler
export const clearPenalty = (): void => {
  localStorage.removeItem(PENALTY_KEY);
};
