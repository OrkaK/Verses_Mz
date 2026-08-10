import React, { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Trophy, Sparkles, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ReferenceQuiz({ verses, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  useEffect(() => {
    startNewQuiz();
  }, [verses]);

  const startNewQuiz = () => {
    if (!verses || verses.length < 3) return;

    // Build 5 randomized questions
    const qList = [];
    const shuffledVerses = [...verses].sort(() => Math.random() - 0.5);

    shuffledVerses.slice(0, 5).forEach((targetVerse) => {
      const isTypeA = Math.random() > 0.5; // Type A: Text -> Reference; Type B: Reference -> Text

      // Get 3 incorrect distractor verses
      const distractors = verses
        .filter((v) => v.id !== targetVerse.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      let options = [];
      if (isTypeA) {
        // Options are references
        options = [
          { id: targetVerse.id, text: targetVerse.reference, isCorrect: true },
          ...distractors.map((d) => ({ id: d.id, text: d.reference, isCorrect: false }))
        ].sort(() => Math.random() - 0.5);
      } else {
        // Options are text snippets
        options = [
          { id: targetVerse.id, text: `"${targetVerse.text.substring(0, 75)}..."`, isCorrect: true },
          ...distractors.map((d) => ({
            id: d.id,
            text: `"${d.text.substring(0, 75)}..."`,
            isCorrect: false
          }))
        ].sort(() => Math.random() - 0.5);
      }

      qList.push({
        targetVerse,
        type: isTypeA ? 'reference' : 'text',
        prompt: isTypeA
          ? `Which passage reference matches this scripture?`
          : `Which scripture text matches ${targetVerse.reference}?`,
        verseSnippet: `"${targetVerse.text}"`,
        referenceTitle: targetVerse.reference,
        options
      });
    });

    setQuestions(qList);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setIsQuizComplete(false);
  };

  const handleSelectOption = (option) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || isSubmitted) return;
    setIsSubmitted(true);

    if (selectedOption.isCorrect) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((idx) => idx + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsQuizComplete(true);
      if (score >= 3) {
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
        } catch (e) {}
      }
      if (onComplete && verses[0]) onComplete(verses[0], 4);
    }
  };

  const currentQ = questions[currentQuestionIndex];

  if (!currentQ && !isQuizComplete) return null;

  return (
    <div className="card flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-subtle">
        <div>
          <span className="badge badge-amber mb-1">Reference Quiz Trivia</span>
          <h3 className="serif-heading text-lg">Test Your Scripture Knowledge</h3>
        </div>

        {!isQuizComplete && (
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="text-muted">
              Question <strong className="text-primary">{currentQuestionIndex + 1}</strong> of {questions.length}
            </span>
            <span className="badge badge-terracotta">Score: {score}</span>
          </div>
        )}
      </div>

      {/* Quiz Screen */}
      {!isQuizComplete ? (
        <div className="flex flex-col gap-5">
          {/* Question Prompt Box */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-subtle flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              {currentQ.prompt}
            </p>
            {currentQ.type === 'reference' ? (
              <p className="scripture-text text-lg italic">{currentQ.verseSnippet}</p>
            ) : (
              <h2 className="serif-heading text-xl font-bold" style={{ color: '#1E293B' }}>
                {currentQ.referenceTitle}
              </h2>
            )}
          </div>

          {/* 4 Multiple Choice Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption?.id === opt.id && selectedOption?.text === opt.text;
              let btnStyle = 'bg-white border-subtle text-primary hover:border-medium';

              if (isSubmitted) {
                if (opt.isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                } else if (isSelected && !opt.isCorrect) {
                  btnStyle = 'bg-rose-50 border-rose-500 text-rose-950';
                } else {
                  btnStyle = 'bg-stone-100 border-stone-200 text-stone-400 opacity-60';
                }
              } else if (isSelected) {
                btnStyle = 'bg-terracotta/10 border-terracotta text-terracotta font-bold';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isSubmitted}
                  className={`p-4 rounded-lg border-2 text-left transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                  style={{
                    backgroundColor: isSubmitted && opt.isCorrect ? '#E8F5E9' : isSelected ? '#F6F0F2' : '#FFFFFF',
                    borderColor: isSubmitted && opt.isCorrect ? '#2E7D32' : isSelected ? '#8A737D' : '#EAE3D9'
                  }}
                >
                  <span className={`text-sm ${currentQ.type === 'text' ? 'scripture-text' : 'font-semibold'}`}>
                    {opt.text}
                  </span>

                  {isSubmitted && opt.isCorrect && <CheckCircle2 size={18} style={{ color: '#2E7D32' }} />}
                  {isSubmitted && isSelected && !opt.isCorrect && <XCircle size={18} style={{ color: '#C62828' }} />}
                </button>
              );
            })}
          </div>

          {/* Footer Submit / Next Controls */}
          <div className="flex items-center justify-end pt-2">
            {!isSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOption}
                className="btn btn-primary gap-2 disabled:opacity-50"
              >
                Submit Answer
              </button>
            ) : (
              <button onClick={handleNextQuestion} className="btn btn-primary gap-2">
                {currentQuestionIndex + 1 < questions.length ? 'Next Question' : 'View Results'}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Complete Results */
        <div className="p-6 rounded-lg bg-secondary/50 border border-subtle text-center flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mx-auto" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
            <Trophy size={32} />
          </div>

          <div>
            <h2 className="serif-heading text-2xl font-bold">Quiz Complete!</h2>
            <p className="text-sm text-secondary mt-1">
              You scored <strong className="text-terracotta text-lg">{score}</strong> out of {questions.length} ({Math.round((score / questions.length) * 100)}%)
            </p>
          </div>

          <button onClick={startNewQuiz} className="btn btn-primary gap-2 mt-2">
            <RotateCcw size={16} /> Play Another Round
          </button>
        </div>
      )}
    </div>
  );
}
