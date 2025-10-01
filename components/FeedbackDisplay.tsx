import React from 'react';
import { type Feedback } from '../types';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';
import { LanguageIcon } from './icons/LanguageIcon';

interface FeedbackDisplayProps {
  feedback: Feedback | null;
  isLoading: boolean;
  translations: {
    generatingFeedback: string;
    generatingFeedbackSub: string;
    followingInstructions: string;
    languageAndStyle: string;
    feedbackWillAppear: string;
    feedbackWillAppearSub: string;
  };
}

const FeedbackCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <div className="flex items-center mb-3">
            {icon}
            <h3 className="ml-3 text-lg font-semibold text-slate-800">{title}</h3>
        </div>
        <div className="text-slate-600 space-y-2 text-sm leading-relaxed">
           {children}
        </div>
    </div>
);


// FIX: Changed return type from JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
export function FeedbackDisplay({ feedback, isLoading, translations }: FeedbackDisplayProps): React.ReactElement {

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center h-full">
          <h3 className="text-lg font-semibold text-slate-700">{translations.generatingFeedback}</h3>
          <p className="mt-1 text-sm text-slate-500">{translations.generatingFeedbackSub}</p>
        </div>
      );
    }

    if (feedback) {
      return (
        <div className="space-y-6">
            <FeedbackCard title={translations.followingInstructions} icon={<ClipboardCheckIcon className="w-6 h-6 text-green-500" />}>
                <p>{feedback.instructionFollowing}</p>
            </FeedbackCard>
            <FeedbackCard title={translations.languageAndStyle} icon={<LanguageIcon className="w-6 h-6 text-sky-500" />}>
                <p>{feedback.languageFeedback}</p>
            </FeedbackCard>
        </div>
      );
    }
    
    return (
        <div className="flex flex-col items-center justify-center text-center h-full p-8 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300">
            <h3 className="text-lg font-semibold text-slate-700">{translations.feedbackWillAppear}</h3>
            <p className="mt-1 text-sm text-slate-500 max-w-sm">{translations.feedbackWillAppearSub}</p>
        </div>
    );
  };
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[400px]">
        {renderContent()}
    </div>
  );
}