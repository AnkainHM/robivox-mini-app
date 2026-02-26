import { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
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
  const pictureUrl = voice.picture && voice.picture?.url
    ? `${import.meta.env.VITE_BACKEND_URL}${encodeURI(voice.picture?.url)}` : '';
  
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
      className={styles.container}
    >
      <button className={styles.backButton} onClick={handleBack}>
        <img src="assets/back_icon.svg" alt="back" />
        <span>Назад</span>
      </button>

      <div className={styles.avatarWrapper}>
        <div className={styles.avatar}>
          {voice.picture && (<img className={styles.avatarImg} src={pictureUrl} alt="img" />)}
          {!voice.picture && (<img
            className={styles.avatarImg}
            src={voice.gender === 'male' ? 'assets/male_avatar.jpg' : 'assets/female_avatar.jpg'} alt="img" />)}
                    
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
        </div>
        <div>{voice.translations[0]?.name || voice.id}</div>
        { voice.voiceType?.name === 'pro' && <div className={styles.proBadge}>pro</div> }
        { voice.voiceType?.name === 'pro+' && <div className={`${styles.proBadge} ${styles.proPlus}`}>pro+</div> }
        
        <div className={styles.description}>
          <div className={styles.descriptionPrice}>
            <div><b>Стоимость:</b></div>
            <div>1 токен за {1 / voice.price.price} символов</div>
          </div>

          { voice.translations[0]?.description
            && <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(voice.translations[0]?.description) }}></div>}
          
          { !voice.translations[0]?.description && <div><b>Коммерческие права:</b><br/>Можно использовать в коммерческих целях без доплаты</div>}          
        </div>
        
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