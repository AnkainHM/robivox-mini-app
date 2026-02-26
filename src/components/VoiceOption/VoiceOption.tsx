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
  const pictureUrl = voice.picture && voice.picture?.url
    ? `${import.meta.env.VITE_BACKEND_URL}${encodeURI(voice.picture?.url)}` : '';

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
      className={styles.voice}
      onClick={handleVoiceSelect}
    >
      <div className={styles.avatar}>
        {voice.picture && (<img src={pictureUrl} alt="img" />)}
        {!voice.picture && (<img src={voice.gender === 'male' ? 'assets/male_avatar.jpg' : 'assets/female_avatar.jpg'} alt="img" />)}
      </div>
      <div className={styles.voiceInfo}>
        <h3 className={styles.voiceName}>{voice.translations[0]?.name || voice.id}</h3>        
        { voice.voiceType?.name === 'pro' && <div className={styles.proBadge}>pro</div> }
        { voice.voiceType?.name === 'pro+' && <div className={`${styles.proBadge} ${styles.proPlus}`}>pro+</div>}
      </div>

      {voice.audio !== null &&
        <button
          className={styles.playBtn}
          onClick={handlePlayClick}
        >
          <img 
            className={`${!isPlaying ? styles.playIcon : ''}`}
            src={isPlaying ? 'assets/stop_icon.svg' : 'assets/play_icon.svg'} alt="play" />          
        </button>
      }

      <div className={styles.selectBtn}>
        <img src='assets/select_icon.svg' alt="select" />
      </div>
      
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