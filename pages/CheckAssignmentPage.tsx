import React, { useState, useCallback } from 'react';
import { getAssignmentFeedback } from '../geminiService';
import { type Feedback } from '../types';
import { FeedbackDisplay } from '../components/FeedbackDisplay';

interface CheckAssignmentPageProps {
  t: any; // Translation object
  subject: 'English' | 'Svenska';
}

function CheckAssignmentPage({ t, subject }: CheckAssignmentPageProps): React.ReactElement {
  const [instructions, setInstructions] = useState<string>('');
  const [studentText, setStudentText] = useState<string>('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetFeedback = useCallback(async () => {
    if (!instructions.trim() || !studentText.trim()) {
      setError(t.errorMessage);
      return;
    }

    setIsLoading(true);
    setError(null);
    setFeedback(null);

    try {
      const result = await getAssignmentFeedback(instructions, studentText, subject);
      setFeedback(result);
    } catch (e) {
      console.error(e);
      setError('An error occurred while generating feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [instructions, studentText, subject, t.errorMessage]);

  const handleClear = () => {
    setInstructions('');
    setStudentText('');
    setFeedback(null);
    setError(null);
    setIsLoading(false);
  };

  const isButtonDisabled = isLoading || !instructions.trim() || !studentText.trim();
  
  const feedbackDisplayTranslations = {
    generatingFeedback: t.generatingFeedback,
    generatingFeedbackSub: t.generatingFeedbackSub,
    followingInstructions: t.followingInstructions,
    languageAndStyle: t.languageAndStyle,
    feedbackWillAppear: t.feedbackWillAppear,
    feedbackWillAppearSub: t.feedbackWillAppearSub,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="space-y-6">
          <div>
            <label htmlFor="instructions" className="block text-sm font-medium text-slate-600 mb-2">
              {t.assignmentInstructions}
            </label>
            <textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder={t.instructionsPlaceholder}
              className="w-full h-32 p-3 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200 resize-none"
              disabled={isLoading}
              aria-label={t.assignmentInstructions}
            />
          </div>
          <div>
            <label htmlFor="studentText" className="block text-sm font-medium text-slate-600 mb-2">
              {t.yourText}
            </label>
            <textarea
              id="studentText"
              value={studentText}
              onChange={(e) => setStudentText(e.target.value)}
              placeholder={t.textPlaceholder}
              className="w-full h-64 p-3 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200 resize-none"
              disabled={isLoading}
              aria-label={t.yourText}
            />
          </div>
        </div>
        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleGetFeedback}
            disabled={isButtonDisabled}
            className="inline-flex items-center justify-center px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? t.generating : t.getFeedback}
          </button>
          <button
            onClick={handleClear}
            disabled={isLoading}
            className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50 transition-colors"
          >
            {t.clear}
          </button>
        </div>
      </div>

      {/* Feedback Section */}
      <FeedbackDisplay feedback={feedback} isLoading={isLoading} translations={feedbackDisplayTranslations} />
    </div>
  );
}

export default CheckAssignmentPage;