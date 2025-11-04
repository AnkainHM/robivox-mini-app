import { useEffect, useRef, useState } from 'react';
import { Voice } from '../../models/models';
import styles from './SelectedVoice.module.css';
import AudioPlayer from 'react-h5-audio-player';

interface SelectedVoiceProps {
  voice: Voice;
  onResetVoice: () => void;
}

export const SelectedVoice: React.FC<SelectedVoiceProps> = ({
  voice,
  onResetVoice  
}) => {
  const audioRef = useRef<any>(null);
  const audioUrl = voice.audio && voice.audio?.url
    ? `${import.meta.env.VITE_BACKEND_URL}${encodeURI(voice.audio?.url)}` : '';
  
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  
  const handleBack = () => {    
    onResetVoice();
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying)    
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
      className={`${styles.container} ${voice.gender === 'male' ? styles.male : styles.female}`}
    >
      <div className={styles.top}>
        <button className={styles.backButton} onClick={handleBack}>
          {'<'}
        </button>
        <div className={styles.avatar}>
          <img src={voice.gender === 'male' ? '/assets/male_avatar.jpg' : '/assets/female_avatar.jpg'} alt="img" />
        </div>
        <div className={styles.playBtnWrapper}>
          {voice.audio !== null && 
            <button
              className={`${
                isPlaying ? styles.stopBtn : styles.playBtn
              }`}
              onClick={handlePlayClick}
            >
              {isPlaying ? (
                <div className={styles.stopIcon} />
              ) : (
                <div className={styles.playIcon} />
              )}
            </button>
          }
        </div> 
      </div>

      <div className={styles.bottom}>
        <div>{voice.translations[0]?.name || voice.id}</div>
        { voice.price.id === '835b8f86-1e45-46db-8e93-8ca754012399' && <div className={styles.proBadge}>pro</div> }
        { voice.price.id === '8054727c-ca87-4e6a-be12-522ecf98c5ab' && <div className={`${styles.proBadge} ${styles.proPlus}`}>pro+</div>}
      </div>
      
      <div className={styles.player}>
        <AudioPlayer
          src={audioUrl}
          autoPlayAfterSrcChange={false}
          showJumpControls={false}
          customProgressBarSection={[]}
          customControlsSection={[]}
          className={styles.audioPlayer}
          style={{ display: 'none' }}
          ref={audioRef}
        />
      </div>
    </div>
  );
};