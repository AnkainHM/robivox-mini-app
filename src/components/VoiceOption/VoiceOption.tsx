import { useEffect, useRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import { Voice } from '../../models/models';
import styles from './VoiceOption.module.css';

interface VoiceOptionProps {
  voice: Voice;
  isSelected: boolean;
  isPlaying: boolean;
  onSelect: (voice: Voice) => void;
  onPlay: (voiceId: string) => void;
  onPause: (voiceId: string) => void;
}

export const VoiceOption: React.FC<VoiceOptionProps> = ({
  voice,
  isSelected,
  isPlaying,
  onSelect,
  onPlay,
  onPause
}) => {
  const audioRef = useRef<any>(null);
  const audioUrl = voice.audio && voice.audio?.url
    ? `${import.meta.env.VITE_BACKEND_URL}${encodeURI(voice.audio?.url)}` : '';

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isPlaying) {
      onPause(voice.id);
    } else {
      onPlay(voice.id);
    }
  };

  const handleVoiceSelect = () => {
    onSelect(voice);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.audio.current.play();
      } else {
        audioRef.current.audio.current.pause();
        audioRef.current.audio.current.currentTime = 0;
      }
    }
  }, [isPlaying]);

  return (
    <div 
      className={`${styles.voice} ${isSelected ? styles.selected : ''}`}
      onClick={handleVoiceSelect}
    >

      <div className={styles.avatar}>
        <img src={voice.gender === 'male' ? '/assets/male_avatar.jpg' : '/assets/female_avatar.jpg'} alt="img" />
      </div>
      <div className={styles.voiceInfo}>
        <h3 className={styles.voiceName}>{voice.translations[0]?.name || voice.id}</h3>
        <span className={styles.voiceGender}>{voice.gender === 'male' ? 'Мужской' : 'Женский'}</span>
        {/* TODO fix */}
        { voice.price.id === '835b8f86-1e45-46db-8e93-8ca754012399' && <span className={styles.proBadge}>pro</span> }
        { voice.price.id === '8054727c-ca87-4e6a-be12-522ecf98c5ab' && <span className={`${styles.proBadge} ${styles.proPlus}`}>pro+</span>}
      </div>
      {voice.audio !== null &&
        <button
          className={isPlaying ? styles.stopBtn : styles.playBtn}
          onClick={handlePlayClick}
        >
          {isPlaying ? (
            <div className={styles.stopIcon} />
          ) : (
            <div className={styles.playIcon} />
          )}
        </button>
      }      
      
      <div className={styles.playerWrapper}>
        <AudioPlayer
          src={audioUrl}
          autoPlayAfterSrcChange={false}
          showJumpControls={false}
          customProgressBarSection={[]}
          customControlsSection={[]}
          className={styles.audioPlayer}
          style={{ display: 'none' }}
          ref={audioRef}
          onPlay={() => onPlay(voice.id)}
          onPause={() => onPause(voice.id)}
          onEnded={() => onPause(voice.id)}
        />
      </div>      
    </div>
  );
};