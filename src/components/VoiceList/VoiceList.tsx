import { useState } from 'react';
import { Voice } from '../../models/models';
import { VoiceOption } from '../VoiceOption/VoiceOption';
import styles from './VoiceList.module.css';

interface VoiceListProps {
  voices: Voice[];
  selectedVoice: Voice | null;
  onVoiceSelect: (voice: Voice | null) => void;
}

export const VoiceList: React.FC<VoiceListProps> = ({
  voices,
  selectedVoice,
  onVoiceSelect,
}) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);  
  const [searchQuery, setSearchQuery] = useState('');

  const handleVoiceSelect = (voice: Voice) => {
    onVoiceSelect(voice);
    if (currentlyPlaying) {
      setCurrentlyPlaying(null);
    }
  };

  const handlePlay = (voiceId: string) => {
    setCurrentlyPlaying(voiceId);
  };

  const handlePause = (voiceId: string) => {
    if (currentlyPlaying === voiceId) {
      setCurrentlyPlaying(null);
    }
  };
  
  const filteredVoices = voices.filter((voice) => {
      const name = voice.translations[0]?.name || voice.id;
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

  return (
    <div>                  
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Поиск по имени..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {filteredVoices.length > 0 ? (
        filteredVoices.map((voice) => (
          <div className={styles.voiceItem} key={voice.id}>
            <VoiceOption
              voice={voice}
              isSelected={selectedVoice?.id === voice.id}
              isPlaying={currentlyPlaying === voice.id}
              onSelect={handleVoiceSelect}
              onPlay={handlePlay}
              onPause={handlePause}
            />
          </div>
        ))
      ) : (
        <div className={styles.noResults}>
          Голоса не найдены
        </div>
      )}
    </div>
  );
};
