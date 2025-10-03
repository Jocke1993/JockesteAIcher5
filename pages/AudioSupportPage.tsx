import React, { useState, useEffect, useCallback } from 'react';
import { UploadIcon } from '../components/icons/UploadIcon';
import { PlayIcon } from '../components/icons/PlayIcon';
import { PauseIcon } from '../components/icons/PauseIcon';
import { StopIcon } from '../components/icons/StopIcon';
import { GoogleDriveIcon } from '../components/icons/GoogleDriveIcon';

interface AudioSupportPageProps {
  t: any; // Translation object
  subject: 'English' | 'Svenska';
}

function AudioSupportPage({ t, subject }: AudioSupportPageProps): React.ReactElement {
  const [text, setText] = useState<string>('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [rate, setRate] = useState<number>(1);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
          const filteredVoices = availableVoices.filter(
            voice => voice.lang.startsWith('en-') || voice.lang.startsWith('sv-')
          );
          setVoices(filteredVoices);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);
  
  useEffect(() => {
    if (voices.length > 0) {
        const preferredLang = subject === 'Svenska' ? 'sv' : 'en';
        const currentVoice = voices.find(v => v.voiceURI === selectedVoiceURI);

        if (!currentVoice || !currentVoice.lang.startsWith(preferredLang)) {
            const defaultVoiceForSubject = voices.find(v => v.lang.startsWith(preferredLang)) || voices[0];
            if (defaultVoiceForSubject) {
                setSelectedVoiceURI(defaultVoiceForSubject.voiceURI);
            }
        }
    }
  }, [subject, voices, selectedVoiceURI]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const handlePlay = useCallback(() => {
    if (text.trim() === '') return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    handleStop();

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = voices.find(v => v.voiceURI === selectedVoiceURI);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = rate;
    
    utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
    };
    utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
    };
    
    window.speechSynthesis.speak(utterance);
  }, [text, selectedVoiceURI, voices, rate, isPaused, handleStop]);

  const handlePause = () => {
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };
  
  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleStop();
    setSelectedVoiceURI(e.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileText = e.target?.result as string;
        setText(fileText);
      };
      reader.readAsText(file, 'UTF-8');
    }
    event.target.value = ''; 
  };
  
  const filteredVoices = voices.filter(voice => voice.lang.startsWith(subject === 'Svenska' ? 'sv' : 'en'));

  const handleGoogleDriveClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="text-center mb-6">
          <p className="text-slate-500">{t.pasteOrUpload}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label htmlFor="tts-text" className="block text-sm font-medium text-slate-600 mb-2">
              {t.yourTextForTTS}
            </label>
            <textarea
              id="tts-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.textPlaceholderTTS}
              className="w-full flex-grow p-3 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200 resize-none min-h-[250px]"
              aria-label={t.yourTextForTTS}
            />
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <label htmlFor="file-upload" className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 cursor-pointer">
                <UploadIcon className="w-5 h-5 mr-2" />
                {t.uploadFile}
              </label>
              <input id="file-upload" type="file" accept=".txt,.md" onChange={handleFileChange} className="hidden" />
              <button onClick={handleGoogleDriveClick} className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 cursor-pointer">
                  <GoogleDriveIcon className="w-5 h-5 mr-2" />
                  {t.loadFromGoogleDrive}
              </button>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-center space-y-6">
            <div>
              <label htmlFor="voice-select" className="block text-sm font-medium text-slate-600 mb-2">
                {t.voice}
              </label>
              {filteredVoices.length > 0 ? (
                <select
                  id="voice-select"
                  value={selectedVoiceURI}
                  onChange={handleVoiceChange}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200"
                >
                  {filteredVoices.map(voice => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>
                      {`${voice.name} (${voice.lang})`}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-sm text-slate-500 text-center p-3 bg-slate-100 border border-slate-200 rounded-lg">
                  <p>{t.noVoicesMessage}</p>
                  <a
                    href={
                      subject === 'Svenska'
                        ? 'https://www.google.com/search?q=installera+text-till-tal-r%C3%B6ster+windows+macos'
                        : 'https://www.google.com/search?q=install+text-to-speech+voices+windows+macos'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-indigo-600 hover:text-indigo-700 mt-1 inline-block"
                  >
                    {t.noVoicesLinkText} &rarr;
                  </a>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="rate-slider" className="block text-sm font-medium text-slate-600 mb-2">
                {t.speed} ({rate.toFixed(1)}x)
              </label>
              <input
                id="rate-slider"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={isSpeaking && !isPaused ? handlePause : handlePlay}
                disabled={!text.trim() || filteredVoices.length === 0}
                className="flex items-center justify-center w-28 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200"
                aria-label={isSpeaking && !isPaused ? t.pause : (isPaused ? t.resume : t.play)}
              >
                {isSpeaking && !isPaused ? <PauseIcon className="w-5 h-5 mr-2" /> : <PlayIcon className="w-5 h-5 mr-2" />}
                {isSpeaking && !isPaused ? t.pause : (isPaused ? t.resume : t.play)}
              </button>
              <button
                onClick={handleStop}
                disabled={!isSpeaking}
                className="flex items-center justify-center px-4 py-2.5 bg-slate-500 text-white font-semibold rounded-lg shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200"
                aria-label={t.stop}
              >
                <StopIcon className="w-5 h-5 mr-2" />
                {t.stop}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">{t.loadFromGoogleDrive}</h3>
            <p className="text-slate-600 mb-6">{t.googleDriveInstructions}</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AudioSupportPage;