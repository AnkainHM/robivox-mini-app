import styles from './SpeedSlider.module.css';

interface SpeedSliderProps {
  value: number;
  onChange: (value: number) => void;
  steps: number[];
  disabled?: boolean;
}

export const SpeedSlider: React.FC<SpeedSliderProps> = ({
  value,
  onChange,
  steps,
  disabled = false,
}) => {
  const currentIndex = steps.indexOf(value);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = Number(e.target.value);
    onChange(steps[index]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.label}>
        <div>{ steps[0] }x</div>
        <div className={styles.speedLabel}>Скорость: { value }x</div>
        <div>{ steps[steps.length -1 ] }x</div>
      </div>
      <div className={styles.sliderWrapper}>
        <input
          type="range"
          min="0"
          max={steps.length - 1}
          step="1"
          value={safeIndex}
          onChange={handleChange}
          disabled={disabled}
          className={styles.slider}
        />
      </div>
    </div>
  );
};