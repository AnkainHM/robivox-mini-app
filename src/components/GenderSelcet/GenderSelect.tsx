import styles from './GenderSelect.module.css';

interface SpeedSelectProps {
  gender: string | null;
  onGenderChange: (gender: string) => void;
}

export const GenderSelect: React.FC<SpeedSelectProps> = ({
  gender,
  onGenderChange,
}) => {
  return (
    <div className={styles.container}>      
      <div className={styles.genderTabs}>
        <button
          className={`${styles.tab} ${gender === 'male' ? styles.active : ''}`}
          onClick={() => onGenderChange('male')}
        >          
          <img src="assets/male_icon.svg" alt="male_icon" />
          Мужской
        </button>
        <button
          className={`${styles.tab} ${gender === 'female' ? styles.active : ''}`}
          onClick={() => onGenderChange('female')}
        >
          <img src="assets/female_icon.svg" alt="male_icon" />
          Женский
        </button>
      </div>
    </div>
  );
};