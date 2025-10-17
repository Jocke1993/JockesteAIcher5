import React, { useState } from 'react';
import { Header } from './components/Header';
import CheckAssignmentPage from './pages/CheckAssignmentPage';
import TestChatPage from './pages/TestChatPage';
import AudioSupportPage from './pages/AudioSupportPage';

type Page = 'check' | 'test' | 'audio';
type Subject = 'English' | 'Svenska';

const translations = {
  en: {
    headerSubtitle: 'AI-powered tools for learning and feedback.',
    subject: 'Subject',
    checkAssignment: 'Check Assignment',
    test: 'Study Help',
    audioSupport: 'Audio Support',
    footerText: 'Powered by AI. Always double-check feedback with your teacher.',
    
    // Check Assignment Page
    assignmentInstructions: 'Assignment Instructions',
    instructionsPlaceholder: "Paste the teacher's instructions here...",
    yourText: 'Your Text',
    textPlaceholder: 'Paste your completed assignment text here...',
    errorMessage: 'Please provide both assignment instructions and your text.',
    getFeedback: 'Get Feedback',
    generating: 'Generating...',
    clear: 'Clear',
    feedbackWillAppear: 'Your feedback will appear here',
    feedbackWillAppearSub: 'Fill in the instructions and your text, then click "Get Feedback" to start.',
    generatingFeedback: 'Generating Feedback...',
    generatingFeedbackSub: 'The AI is analyzing your text. This might take a moment.',
    followingInstructions: 'Following Instructions',
    languageAndStyle: 'Language & Style',
    
    // Generic chat translations (used by Test page)
    chatWelcome: 'Welcome! How can I help you think through your assignment today?',
    chatPlaceholder: 'Ask a question or describe what you need help with...',
    send: 'Send',
    thinking: 'Thinking...',

    // Audio Support Page
    pasteOrUpload: 'Paste text or upload a file to have it read aloud.',
    uploadFile: 'Upload File',
    yourTextForTTS: 'Your text for text-to-speech',
    textPlaceholderTTS: 'Type or paste your text here...',
    voice: 'Voice',
    speed: 'Speed',
    play: 'Play',
    pause: 'Pause',
    stop: 'Stop',
    resume: 'Resume',
    noVoicesMessage: 'No voices were found in your browser. You may need to install them in your operating system settings.',
    noVoicesLinkText: 'Learn how',
    loadFromGoogleDrive: 'Load from Google Drive',
    googleDriveInstructions: 'To load text from Google Drive, please open your document, copy the text, and paste it into the text box here.',
    close: 'Close',
  },
  sv: {
    headerSubtitle: 'AI-drivna verktyg för lärande och feedback.',
    subject: 'Ämne',
    checkAssignment: 'Granska uppgift',
    test: 'Plugghjälp',
    audioSupport: 'Ljudstöd',
    footerText: 'Drivs av AI. Dubbelkolla alltid feedback med din lärare.',

    // Check Assignment Page
    assignmentInstructions: 'Uppdragsinstruktioner',
    instructionsPlaceholder: 'Klistra in lärarens instruktioner här...',
    yourText: 'Din text',
    textPlaceholder: 'Klistra in din färdiga uppgiftstext här...',
    errorMessage: 'Vänligen ange både uppdragsinstruktioner och din text.',
    getFeedback: 'Få feedback',
    generating: 'Genererar...',
    clear: 'Rensa',
    feedbackWillAppear: 'Din feedback kommer att visas här',
    feedbackWillAppearSub: 'Fyll i instruktionerna och din text, klicka sedan på "Få feedback" för att börja.',
    generatingFeedback: 'Genererar feedback...',
    generatingFeedbackSub: 'AI:n analyserar din text. Detta kan ta en liten stund.',
    followingInstructions: 'Följa instruktioner',
    languageAndStyle: 'Språk & Stil',

    // Generic chat translations (used by Test page)
    chatWelcome: 'Välkommen! Hur kan jag hjälpa dig att tänka igenom din uppgift idag?',
    chatPlaceholder: 'Ställ en fråga eller beskriv vad du behöver hjälp med...',
    send: 'Skicka',
    thinking: 'Tänker...',

    // Audio Support Page
    pasteOrUpload: 'Klistra in text eller ladda upp en fil för att få den uppläst.',
    uploadFile: 'Ladda upp fil',
    yourTextForTTS: 'Din text för uppläsning',
    textPlaceholderTTS: 'Skriv eller klistra in din text här...',
    voice: 'Röst',
    speed: 'Hastighet',
    play: 'Spela upp',
    pause: 'Pausa',
    stop: 'Stoppa',
    resume: 'Återuppta',
    noVoicesMessage: 'Inga röster hittades i din webbläsare. Du kan behöva installera dem i ditt operativsystems inställningar.',
    noVoicesLinkText: 'Lär dig hur',
    loadFromGoogleDrive: 'Ladda från Google Drive',
    googleDriveInstructions: 'För att ladda text från Google Drive, vänligen öppna ditt dokument, kopiera texten och klistra in den i textrutan här.',
    close: 'Stäng',
  },
};

function App(): React.ReactElement {
  const [currentPage, setCurrentPage] = useState<Page>('check');
  const [subject, setSubject] = useState<Subject>('English');

  const t = subject === 'English' ? translations.en : translations.sv;
  
  const PageNavigation: React.FC = () => (
    <div className="flex space-x-2 rounded-xl bg-slate-100 p-1.5" role="tablist">
        <button
          role="tab"
          aria-selected={currentPage === 'check'}
          onClick={() => setCurrentPage('check')}
          className={`w-full rounded-lg py-3 px-4 text-base font-semibold transition-colors duration-200 ${currentPage === 'check' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}
        >
          {translations.sv.checkAssignment}
        </button>
        <button
          role="tab"
          aria-selected={currentPage === 'test'}
          onClick={() => setCurrentPage('test')}
          className={`w-full rounded-lg py-3 px-4 text-base font-semibold transition-colors duration-200 ${currentPage === 'test' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}
        >
          {translations.sv.test}
        </button>
        <button
          role="tab"
          aria-selected={currentPage === 'audio'}
          onClick={() => setCurrentPage('audio')}
          className={`w-full rounded-lg py-3 px-4 text-base font-semibold transition-colors duration-200 ${currentPage === 'audio' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}
        >
          {translations.sv.audioSupport}
        </button>
    </div>
  );

  const SubjectSwitcher: React.FC = () => (
    <div role="radiogroup" className="flex rounded-lg bg-slate-100 p-1">
        <button
            role="radio"
            aria-checked={subject === 'English'}
            onClick={() => setSubject('English')}
            className={`w-1/2 rounded-md py-1.5 text-sm font-semibold transition-colors duration-200 ${subject === 'English' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
        >
            Engelska
        </button>
        <button
            role="radio"
            aria-checked={subject === 'Svenska'}
            onClick={() => setSubject('Svenska')}
            className={`w-1/2 rounded-md py-1.5 text-sm font-semibold transition-colors duration-200 ${subject === 'Svenska' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
        >
            Svenska
        </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Header subtitle={t.headerSubtitle} />
      <main className="container mx-auto p-4 md:p-8">
        
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-4 mb-10">
                <div className="w-full max-w-2xl">
                    <PageNavigation />
                </div>
                <div className="w-full max-w-2xl">
                    <SubjectSwitcher />
                </div>
            </div>

            {currentPage === 'check' && <CheckAssignmentPage t={t} subject={subject} />}
            {currentPage === 'test' && <TestChatPage t={t} subject={subject} />}
            {currentPage === 'audio' && <AudioSupportPage t={t} subject={subject} />}
        </div>

      </main>
      <footer className="text-center p-4 mt-8 text-sm text-slate-500">
        <p>{t.footerText}</p>
      </footer>
    </div>
  );
}

export default App;