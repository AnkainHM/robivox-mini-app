import { useState, useRef, useEffect } from 'react';
import { Language } from '../../models/models';
import styles from './LanguageSelect.module.css';

interface LanguageSelectProps {
  languages: Language[];
  selectedLanguage: string | null;
  onLanguageChange: (languageId: string) => void;
  loading?: boolean;
  error?: string;
}

export const LanguageSelect: React.FC<LanguageSelectProps> = ({
  languages,
  selectedLanguage,
  onLanguageChange,
  loading = false,
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedLanguageObj = languages.find(lang => lang.id === selectedLanguage);

  const filteredLanguages = languages.filter(language => {
    const name = language.translations[0]?.name || language.id;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;      
      if (isOpen && !target.closest(`.${styles.modalContainer}`)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredLanguages.length > 0) {
      handleLanguageSelect(filteredLanguages[0].id);
    }
  };

  const handleLanguageSelect = (languageId: string) => {
    onLanguageChange(languageId);
    setIsOpen(false);
    setSearchQuery('');
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка языков...</div>;
  }

  if (error) {
    return <div className={styles.error}>Ошибка: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <label className={styles.label}>Выберите язык:</label>

      <div
        className={styles.dropdownHeader}
        onClick={() => setIsOpen(true)}
      >
        <span>
          {selectedLanguage
            ? (selectedLanguageObj?.translations.find(el => el.languageCode === 'ru')?.name || selectedLanguageObj?.id || 'Неизвестный язык')
            : 'Выберите язык'}
        </span>
        <span className={styles.arrow}>▼</span>
      </div>
      
      {isOpen && (
        <div className={styles.overlay}>
          <div className={styles.modalContainer}>
            <div className={styles.modalHeader}>
              <h3>Выберите язык</h3>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setIsOpen(false);
                  setSearchQuery('');
                }}
              >
                ✕
              </button>
            </div>

            <input
              ref={inputRef}
              type="text"
              placeholder="Поиск языка..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.searchInput}
            />

            <div className={styles.optionsList}>
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((language) => (
                  <div
                    key={language.id}
                    className={`${styles.option} ${selectedLanguage === language.id ? styles.selected : ''}`}
                    onClick={() => handleLanguageSelect(language.id)}
                  >
                    {language.translations.find(el => el.languageCode === 'ru')?.name || language.id}
                  </div>
                ))
              ) : (
                <div className={styles.noResults}>Языки не найдены</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};