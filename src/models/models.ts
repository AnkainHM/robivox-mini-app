export interface Language {
  id: string;
  translations: Translation[]
}

export interface Translation {
  id: string;
  name: string;
  languageCode: string;
}

export interface Voice {
  id: string;
  translations: TranslationVoice[];
  service: VoiceService;
  audio: UploadData | null;
  picture: UploadData | null;
  gender: string;
  price: Price;
  voiceType: VoiceType;
}

export interface VoiceType {
  name: string;
}

export interface Price {
  id: string;
}

export interface UploadData {
  url: string | null;
}

export interface VoiceService {
  name: string
}

export interface TranslationVoice {
  name: string;
  languageCode: string;
}

export interface GetAllLanguagesResponse {
  GetAllLanguages: Language[];
}

export interface GetVoicesByLanguageResponse {
  GetVoicesByLanguage: Voice[];
}

export interface VoiceOptionProps {
  voice: Voice;
  isSelected: boolean;
  onSelect: (voice: Voice) => void;
}