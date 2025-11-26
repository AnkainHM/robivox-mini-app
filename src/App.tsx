import { useQuery } from '@apollo/client';
import { useState, useEffect, useMemo } from 'react';
import { GETLANGUAGES, GETVOICESBYLANGUAGE } from './lib/queries';
import { GetAllLanguagesResponse, GetVoicesByLanguageResponse, Language, Voice } from './models/models';
import './styles.css';
import { LanguageSelect } from './components/LanguageSelect/LanguageSelect';
import { GenderSelect } from './components/GenderSelcet/GenderSelect';
import { VoiceList } from './components/VoiceList/VoiceList';
import { SpeedSlider } from './components/SpeedSlider/SpeedSlider';
import { SelectedVoice } from './components/SelectedVoice/SelectedVoice';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

interface TelegramUser {
  id: number;
  first_name: string;
  username?: string;
}

interface TelegramWebApp {
  initDataUnsafe: { user?: TelegramUser, query_id: string };
  initData: any;
  ready: () => void;
  MainButton: {
    setText: (text: string) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  sendData: (data: string) => void;
  close: () => void;
  showAlert: (message: string) => void;
  onEvent: (event: string, handler: Function) => void;
  offEvent: (event: string, handler: Function) => void;
  isClosing: boolean;
  version: string;
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

const speedSteps = [0.1, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.25, 1.5, 2, 2.5, 3];
const speedStepsElevenlabs = [0.7, 0.8, 0.9, 1, 1.1, 1.2];

function App() {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
      const webApp = window.Telegram?.WebApp;
      console.log('webApp', webApp)
    if (!webApp) {
      setIsAuthorized(false);
      return;
    }
    
    if (!webApp.initDataUnsafe) {
      setIsAuthorized(false);
      return;
    }

    setIsAuthorized(true);
  }, []);

  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [selectedSpeed, setSelectedSpeed] = useState<number>(1);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const { data: languagesData, loading: languagesLoading, error: languagesError } = useQuery<GetAllLanguagesResponse>(GETLANGUAGES);
  const { data: voicesData, loading: voicesLoading, error: voicesError } = useQuery<GetVoicesByLanguageResponse>(GETVOICESBYLANGUAGE, {
    variables: { languageId: selectedLanguage },
    skip: !selectedLanguage,
  });

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (webApp && webApp.initDataUnsafe) {      
      webApp.ready();      
      webApp.MainButton.setText('Выбрать голос');
      if (!selectedLanguage || !selectedVoice || !selectedSpeed) {
        webApp.MainButton.hide();
        webApp.MainButton.disable();
      } else {
        webApp.MainButton.show();
        webApp.MainButton.enable();
      }

      const handleClick = async () => {
        if (selectedLanguage && selectedVoice && selectedSpeed) {
          const payload = {
            languageId: selectedLanguage,
            voiceId: selectedVoice.id,
            speed: selectedSpeed,
          };
          
          const initData = webApp.initData;

          if (!initData) {
            webApp.showAlert('Ошибка: не удалось получить данные авторизации');
            return;
          }

          try {            
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/telegram/webapp-data`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'bypass-tunnel-reminder': 'bypass-tunnel-reminder'
              },
              body: JSON.stringify({
                initData,
                payload,
              }),
            });

            if (response.ok) {
              webApp.close();
            } else {
              const errorText = await response.text();
              webApp.showAlert(`Ошибка сервера: ${response.status}`);
              console.error('Server error:', errorText);
              webApp.close();
            }
          } catch (error: any) {
            console.error('Fetch error:', error);
            webApp.showAlert('Ошибка сети: ' + (error.message || 'неизвестная'));
            webApp.close();
          }
        } else {
          webApp.showAlert('Выберите все параметры!');
        }
      };

      webApp.MainButton.onClick(handleClick);

      return () => {
        console.log('Cleaning up MainButton click handler');
        webApp.MainButton.offClick(handleClick);
      };
    } else {
      console.warn('Telegram WebApp not available or initDataUnsafe missing');
    }
  }, [selectedLanguage, selectedVoice, selectedSpeed]);

  useEffect(() => {
  if (languagesData && !selectedLanguage) {
    const languages = languagesData.GetAllLanguages || [];
    if (languages.length > 0) {      
      const defaultLanguage = languages.find(lang => lang.id === '14bc7a82-ffa0-4b67-b73c-7bd5854cb99e');
      if (defaultLanguage) {
        setSelectedLanguage(defaultLanguage.id);
      } else {        
        setSelectedLanguage(languages[0].id);
      }
    }
  }
}, [languagesData, selectedLanguage]);
  
  const languages: Language[] = languagesData?.GetAllLanguages || [];
  const voices: Voice[] = voicesData?.GetVoicesByLanguage || [];
    
  const filteredVoices = useMemo(() => {
    if (!selectedGender) return voices;
    return voices.filter((voice) => voice.gender === selectedGender);
  }, [voices, selectedGender]);

  const handleGenderChange = (gender: string) => { 
    const newgender = gender === selectedGender ? null : gender
    setSelectedGender(newgender);        
  };

  const handleLanguageChange = (languageId: string) => {
    setSelectedLanguage(languageId);
    setSelectedVoice(null);
    setSelectedSpeed(1);
    setSelectedGender(null); 
  };

  const handleVoiceSelect = (voice: Voice | null) => {    
    setSelectedVoice(voice);    
    setSelectedSpeed(1);
  };

  const handleVoiceReset = () => {
    setSelectedVoice(null);
  }

  const handleSpeedChange = (speed: number) => {
    setSelectedSpeed(speed);
  };

  const getSpeedStepsForSelectedVoice = () => {
    if (!selectedVoice) return speedSteps;
    return selectedVoice.service.name === 'ElevenLabs' ? speedStepsElevenlabs : speedSteps;
  };

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Загрузка...</div>
      </div>
    );
  }
  
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="text-red-500 text-lg font-semibold mb-4">
          🔒 Доступ запрещён
        </div>
        <p className="text-gray-600">
          Это приложение работает только внутри Telegram.<br />
          Откройте его через бота или ссылку в Telegram.
        </p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-4 max-w-md mx-auto">
      <div className="container">
        {!selectedVoice && (
          <LanguageSelect
            languages={languages}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
            loading={languagesLoading}
            error={languagesError?.message}
          />
        )}
        
        {selectedLanguage && (
          <div>
            {!selectedVoice && (
              <div>
                <GenderSelect
                  gender={selectedGender}
                  onGenderChange={handleGenderChange}
                />
                <VoiceList
                  voices={filteredVoices}
                  selectedVoice={selectedVoice}
                  onVoiceSelect={handleVoiceSelect}
                />
              </div>
            )}

            
            {selectedVoice && (
              <div>
                <SelectedVoice
                  voice={selectedVoice}
                  onResetVoice={handleVoiceReset}
                />
                <SpeedSlider
                  value={selectedSpeed}
                  onChange={handleSpeedChange}
                  steps={getSpeedStepsForSelectedVoice()}
                  disabled={!selectedVoice}
                />
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

export default App;
