import React, { useState } from 'react';
import { Header } from './components/Header';
import CheckAssignmentPage from './pages/CheckAssignmentPage';
import DiscussionHelpPage from './pages/DiscussionHelpPage';
import TestChatPage from './pages/TestChatPage';

type Page = 'check' | 'discuss' | 'test';
type Subject = 'English' | 'Svenska';

const translations = {
  en: {
    headerSubtitle: 'AI-powered tools for learning and feedback.',
    subject: 'Subject',
    checkAssignment: 'Check Assignment',
    discussionAndHelp: 'Discussion & Help',
    test: 'Test',
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
    
    // Discussion Page
    chatWelcome: 'Welcome! How can I help you think through your assignment today?',
    chatPlaceholder: 'Ask a question or describe what you need help with...',
    send: 'Send',
    thinking: 'Thinking...',
  },
  sv: {
    headerSubtitle: 'AI-drivna verktyg för lärande och feedback.',
    subject: 'Ämne',
    checkAssignment: 'Granska uppgift',
    discussionAndHelp: 'Diskussion & hjälp',
    test: 'Test',
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

    // Discussion Page
    chatWelcome: 'Välkommen! Hur kan jag hjälpa dig att tänka igenom din uppgift idag?',
    chatPlaceholder: 'Ställ en fråga eller beskriv vad du behöver hjälp med...',
    send: 'Skicka',
    thinking: 'Tänker...',
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
          {t.checkAssignment}
        </button>
        <button
          role="tab"
          aria-selected={currentPage === 'discuss'}
          onClick={() => setCurrentPage('discuss')}
          className={`w-full rounded-lg py-3 px-4 text-base font-semibold transition-colors duration-200 ${currentPage === 'discuss' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}
        >
          {t.discussionAndHelp}
        </button>
        <button
          role="tab"
          aria-selected={currentPage === 'test'}
          onClick={() => setCurrentPage('test')}
          className={`w-full rounded-lg py-3 px-4 text-base font-semibold transition-colors duration-200 ${currentPage === 'test' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}
        >
          {t.test}
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
            English
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
                <div className="w-full max-w-lg">
                    <PageNavigation />
                </div>
                <div className="w-full max-w-lg">
                    <SubjectSwitcher />
                </div>
            </div>

            {currentPage === 'check' && <CheckAssignmentPage t={t} subject={subject} />}
            {currentPage === 'discuss' && <DiscussionHelpPage t={t} subject={subject} />}
            {currentPage === 'test' && <TestChatPage t={t} subject={subject} />}
        </div>

      </main>
      <footer className="text-center p-4 mt-8 text-sm text-slate-500">
        <p>{t.footerText}</p>
      </footer>
    </div>
  );
}

export default App;