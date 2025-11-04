import { useRef, useEffect, useState } from 'react';
import { Voice } from '../../models/models';
import { VoiceOption } from '../VoiceOption/VoiceOption';
import styles from './VoicesDropdown.module.css';

interface VoicesDropdownProps {
  voices: Voice[];
  selectedVoice: Voice | null;
  onVoiceSelect: (voice: Voice) => void;
  loading?: boolean;
  error?: string;
  disabled?: boolean;
}

export const VoicesDropdown: React.FC<VoicesDropdownProps> = ({
  voices,
  selectedVoice,
  onVoiceSelect,
  loading = false,
  error,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);        
        if (currentlyPlaying) {
          setCurrentlyPlaying(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [currentlyPlaying]);

  const handleVoiceSelect = (voice: Voice) => {
    onVoiceSelect(voice);
    setIsOpen(false);    
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

  return (
    <div className={styles.container} ref={dropdownRef}>
      <label className={styles.label}>Выберите голос:</label>
      
      <button
        className={`${styles.dropdownButton} ${disabled ? styles.disabled : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {selectedVoice ? (
          <span className={styles.selectedText}>
            {selectedVoice.translations[0]?.name || selectedVoice.id}
          </span>
        ) : (
          <span className={styles.placeholder}>Выберите голос</span>
        )}
        <svg
          className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {loading && (
        <div className={styles.status}>Загрузка голосов...</div>
      )}
      
      {error && (
        <div className={styles.error}>Ошибка: {error}</div>
      )}

      {isOpen && !disabled && (
        <div className={styles.dropdownContent}>
          {voices.length === 0 ? (
            <div className={styles.empty}>
              {loading ? 'Загрузка...' : 'Голоса не найдены'}
            </div>
          ) : (
            voices.map((voice) => (
              <VoiceOption
                key={voice.id}
                voice={voice}
                isSelected={selectedVoice?.id === voice.id}
                isPlaying={currentlyPlaying === voice.id}
                onSelect={handleVoiceSelect}
                onPlay={handlePlay}
                onPause={handlePause}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};