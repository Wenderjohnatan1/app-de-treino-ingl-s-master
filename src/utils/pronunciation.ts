import { Phrase } from '../types';

// Phonetic dictionary for common English words to represent American pronunciation phonetics in Portuguese
const PHONETIC_MAP: Record<string, string> = {
  "good": "gúd",
  "morning": "mór-nin",
  "night": "náit",
  "thank": "fénk",
  "thanks": "fénks",
  "you": "iú",
  "you're": "iór",
  "your": "iór",
  "welcome": "uél-kam",
  "excuse": "éks-kiúz",
  "me": "mí",
  "sorry": "só-ri",
  "please": "plíz",
  "yes": "iés",
  "no": "nóu",
  "how": "háu",
  "are": "ár",
  "what": "uót",
  "what's": "uóts",
  "name": "néim",
  "is": "íz",
  "nice": "náis",
  "to": "tú",
  "meet": "mít",
  "old": "ôuld",
  "where": "uér",
  "from": "fróm",
  "brazil": "bra-zíl",
  "afternoon": "éf-ter-nún",
  "goodbye": "gud-bái",
  "can": "kén",
  "help": "hélp",
  "understand": "ân-der-sténd",
  "could": "kúd",
  "repeat": "ri-pít",
  "that": "dét",
  "speak": "spík",
  "slowly": "slóu-li",
  "does": "dâz",
  "this": "dís",
  "mean": "mín",
  "see": "sí",
  "tomorrow": "tu-mó-rou",
  "say": "séi",
  "hungry": "hân-gri",
  "thirsty": "fêrs-ti",
  "let's": "léts",
  "go": "góu",
  "time": "táim",
  "bathroom": "béf-rúm",
  "like": "láik",
  "much": "mâtch",
  "beautiful": "biú-ti-fúl",
  "have": "hév",
  "day": "déi",
  "english": "ín-glish",
  "only": "óun-li",
  "little": "lí-tol",
  "never": "né-ver",
  "mind": "máind",
  "congratulations": "con-græ-chu-léi-shanz",
  "happy": "hé-pi",
  "birthday": "bêrf-dei",
  "work": "uêrk",
  "here": "híar",
  "live": "lív",
  "know": "nóu",
  "think": "fínk",
  "so": "sóu",
  "tired": "tá-iard",
  "too": "tú",
  "luck": "lâk",
  "later": "léi-ter",
  "take": "téik",
  "care": "kér",
  "keep": "kíp",
  "it": "ít",
  "up": "âp",
  "fun": "fân",
  "lost": "lóst",
  "wait": "uéit",
  "minute": "mí-nit",
  "problem": "pró-blem",
  "course": "kórs",
  "right": "ráit",
  "really": "rí-li",
  "pity": "pí-ti",
  "sure": "shúr",
  "idea": "ai-día",
  "busy": "bí-zi",
  "today": "tu-déi",
  "going": "góu-in",
  "on": "ón",
  "need": "níd",
  "doctor": "dók-tor",
  "call": "kól",
  "police": "po-lís",
  "fire": "fá-ier",
  "look": "lúk",
  "out": "áut",
  "stop": "stóp",
  "far": "fár",
  "near": "níar",
  "straight": "stréit",
  "ahead": "a-héd",
  "turn": "têrn",
  "street": "strít",
  "tourist": "tú-rist",
  "buy": "bái",
  "water": "uó-ter",
  "map": "mép",
  "beach": "bítch",
  "love": "lâv",
  "city": "sí-ti",
  "exchange": "éks-tchéindj",
  "rate": "réit",
  "money": "mâ-ni",
  "accept": "ak-sépt",
  "card": "kárd",
  "credit": "kré-dit",
  "weather": "ué-der",
  "hot": "hót",
  "cold": "kôuld",
  "rain": "réin",
  "song": "sóŋ",
  "job": "djób",
  "next": "nékst",
  "airport": "ér-pórt",
  "hotel": "hou-tél",
  "nearest": "ní-rest",
  "the": "dâ",
  "a": "êi",
  "an": "én",
  "and": "énd",
  "of": "óv",
  "for": "fór",
  "in": "ín",
  "we": "uí",
  "he": "hí",
  "she": "shí",
  "they": "déi",
  "i": "ái",
  "my": "mái",
  "at": "ét",
  "with": "uíd",
  "about": "a-báut",
  "or": "ór",
  "by": "bái",
  "these": "díz",
  "those": "dóuz",
  "all": "ól",
  "some": "sâm",
  "any": "é-ni",
  "every": "é-vri",
  "very": "vé-ri"
};

export interface PronunciationTutorial {
  phoneticSpelling: string;
  tips: string[];
}

/**
 * Returns a phonetic guide and specific pronunciation tips for any given English phrase.
 */
export function getPronunciationGuide(englishText: string): PronunciationTutorial {
  const cleanText = englishText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
  const words = cleanText.toLowerCase().split(/\s+/);

  // Generate phonetic spelling word-by-word
  const phoneticWords = words.map(word => {
    // 1. Check exact dictionary match
    if (PHONETIC_MAP[word]) {
      return PHONETIC_MAP[word];
    }

    // 2. Fallback heuristic converter
    let phonetic = word;
    
    // Replace common phonetic structures
    phonetic = phonetic.replace(/tion$/g, "shân");
    phonetic = phonetic.replace(/ght$/g, "t");
    phonetic = phonetic.replace(/ea/g, "i");
    phonetic = phonetic.replace(/ee/g, "i");
    phonetic = phonetic.replace(/oo/g, "u");
    phonetic = phonetic.replace(/ou/g, "au");
    phonetic = phonetic.replace(/ow$/g, "ou");
    phonetic = phonetic.replace(/ay$/g, "ei");
    phonetic = phonetic.replace(/ai/g, "ei");
    phonetic = phonetic.replace(/^wh/g, "u");
    phonetic = phonetic.replace(/^wr/g, "r");
    phonetic = phonetic.replace(/ph/g, "f");
    phonetic = phonetic.replace(/ch/g, "tch");
    phonetic = phonetic.replace(/sh/g, "sh");
    phonetic = phonetic.replace(/th/g, "t"); // simple approximation for text view
    phonetic = phonetic.replace(/y$/g, "i");
    
    // Keep it readable
    return phonetic;
  });

  const phoneticSpelling = `/${phoneticWords.join(" ")}/`;

  // Build educational pronunciation tips based on features detected in the original English phrase
  const tips: string[] = [];
  const lowerText = englishText.toLowerCase();

  // Rule 1: 'th' sound
  if (lowerText.includes("th")) {
    const thWords = englishText.split(/\s+/).filter(w => w.toLowerCase().includes("th")).map(w => w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ""));
    const sampleWord = thWords[0] || "this/thank";
    
    if (lowerText.includes("thank") || lowerText.includes("thirsty") || lowerText.includes("birthday") || lowerText.includes("bathroom")) {
      tips.push(`👅 **Som do TH Soprado (Surdo)** em *"${sampleWord}"*: Coloque a ponta da língua levemente entre os dentes da frente e apenas assopre o ar, sem vibrar as cordas vocais. Soa como um 'F' ou 'S' soprado.`);
    } else {
      tips.push(`🗣️ **Som do TH Vibrado (Sonoro)** em *"${sampleWord}"*: Coloque a ponta da língua entre os dentes e faça o som vibrar (como um 'D' ou 'Z' vibrado).`);
    }
  }

  // Rule 2: Retroflex American 'R'
  if (lowerText.includes("r")) {
    const rWords = englishText.split(/\s+/).filter(w => w.toLowerCase().includes("r")).map(w => w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ""));
    if (rWords.length > 0) {
      tips.push(`🤠 **O "R" Retroflexo Americano**: Em palavras como *"${rWords[0]}"*, enrole a língua para trás no céu da boca sem tocar os dentes. É igual ao sotaque caipira de "por-ta" ou "car-to".`);
    }
  }

  // Rule 3: Silent E endings
  if (/\b\w+e\b/.test(lowerText)) {
    const wordsWithSilentE = englishText.split(/\s+/).filter(w => /\w+e$/.test(w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ""))).map(w => w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ""));
    // Filter out common short words where E is not silent (like me, we, she, he, the)
    const silentEWords = wordsWithSilentE.filter(w => !["me", "we", "she", "he", "the", "be"].includes(w.toLowerCase()));
    if (silentEWords.length > 0) {
      tips.push(`🤫 **"E" Mudo no final**: Na palavra *"${silentEWords[0]}"*, a letra 'E' final é totalmente silenciosa. A pronúncia termina no som da consoante anterior.`);
    }
  }

  // Rule 4: -ing endings
  if (lowerText.includes("ing")) {
    const ingWords = englishText.split(/\s+/).filter(w => w.toLowerCase().includes("ing")).map(w => w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ""));
    if (ingWords.length > 0) {
      tips.push(`🔇 **O "G" Silencioso no -ING**: No final de *"${ingWords[0]}"*, o som do 'G' não é pronunciado. O som morre sutilmente em um som nasal no 'N' (como em *mór-nin*).`);
    }
  }

  // Rule 5: Double 'o'
  if (lowerText.includes("oo")) {
    const ooWords = englishText.split(/\s+/).filter(w => w.toLowerCase().includes("oo")).map(w => w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ""));
    if (ooWords.length > 0) {
      tips.push(`👄 **Duplo "O" (som de U)**: Em *"${ooWords[0]}"*, as letras 'OO' se unem com som de 'U' em português (como em *gúd* ou *nún*).`);
    }
  }

  // Rule 6: Initial 'H' (strong R sound)
  if (/\bh[aeiou]\w*/i.test(lowerText)) {
    const hWords = englishText.split(/\s+/).filter(w => /^h[aeiou]/i.test(w)).map(w => w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ""));
    if (hWords.length > 0) {
      tips.push(`🦁 **O "H" com som de "R" forte**: No início de *"${hWords[0]}"*, a letra 'H' é pronunciada expelindo o ar com força, como o 'R' em "rato" ou "rio".`);
    }
  }

  // Rule 7: Flapped T/D (T with soft R sound)
  if (/[aeiou]t[aeiou]/i.test(lowerText) || /tt/i.test(lowerText) || /ty/i.test(lowerText)) {
    const tWords = englishText.split(/\s+/).filter(w => /[aeiou]t[aeiou]/i.test(w) || /tt/i.test(w) || /ty/i.test(w)).map(w => w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ""));
    if (tWords.length > 0) {
      tips.push(`🕊️ **O "T" que vira "R" suave**: Em *"${tWords[0]}"*, o 'T' (ou 'TT') fica entre vogais e soa como o 'R' fraco de "caro" ou "nora" no português (como no sotaque americano).`);
    }
  }

  // Fallback / standard tip if we don't have enough specific ones
  if (tips.length < 2) {
    tips.push(`🎯 **Sons Colados (Connected Speech)**: Em inglês, junte o som final de uma palavra com o início da próxima para soar natural! Por exemplo, "what is" vira "uó-tiz".`);
  }

  // Add the general layout usage tip so any user knows how to read
  tips.unshift(`💡 **Como ler**: Fale os pedaços aproximados como se estivesse lendo em português. As partes destacadas em **rosa/negrito** indicam onde colocar a maior força da voz (sílaba tônica).`);

  return {
    phoneticSpelling,
    tips: tips.slice(0, 4) // Return up to 4 high-quality tips
  };
}

export interface PhoneticPart {
  text: string;
  isStressed: boolean;
  isHyphen: boolean;
  isSpace: boolean;
}

/**
 * Parses a phonetic spelling string (e.g. "/uél-kam mór-nin/") into individual structured syllables
 * so the React UI can style the stressed/tonic syllables dynamically with vibrant highlights.
 */
export function parsePhonetic(phonetic: string): PhoneticPart[] {
  const parts: PhoneticPart[] = [];
  const clean = phonetic.replace(/^\/|\/$/g, "");
  
  const words = clean.split(" ");
  words.forEach((word, wordIdx) => {
    const syllables = word.split("-");
    syllables.forEach((syllable, sylIdx) => {
      // Accent letters check
      const isStressed = /[áéíóúâêôãõ]/i.test(syllable);
      parts.push({
        text: syllable,
        isStressed,
        isHyphen: false,
        isSpace: false
      });
      if (sylIdx < syllables.length - 1) {
        parts.push({
          text: "-",
          isStressed: false,
          isHyphen: true,
          isSpace: false
        });
      }
    });
    if (wordIdx < words.length - 1) {
      parts.push({
        text: " ",
        isStressed: false,
        isHyphen: false,
        isSpace: true
      });
    }
  });
  return parts;
}

/**
 * Text-to-Speech function with speed control support.
 * @param text The text to read aloud
 * @param slow Whether to play back slowly (0.55 rate) or normal (0.85 rate)
 */
export function playTextToSpeech(text: string, slow: boolean = false): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = slow ? 0.52 : 0.82; // 0.52 is nice and clear for slow playback, 0.82 is standard
  window.speechSynthesis.speak(utterance);
}
