"use client";

import { useState } from "react";
import {
  X,
  GraduationCap,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Award,
  Sparkles,
  Building2,
  Layers,
} from "lucide-react";
import { generateRandomQuiz, QuizQuestion } from "@/lib/quiz";

interface SalesQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLightMode: boolean;
}

export function SalesQuizModal({ isOpen, onClose, isLightMode }: SalesQuizModalProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => generateRandomQuiz(10));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQuestion = questions[currentIndex];
  const selectedOptionIndex = selectedAnswers[currentIndex];
  const hasAnsweredCurrent = selectedOptionIndex !== undefined;

  const score = questions.reduce((acc, q, idx) => {
    const picked = selectedAnswers[idx];
    if (picked !== undefined && q.options[picked]?.isCorrect) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const handleSelectOption = (optionIdx: number) => {
    if (hasAnsweredCurrent) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIdx,
    }));
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setQuestions(generateRandomQuiz(10));
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsFinished(false);
  };

  const getScoreRank = (finalScore: number) => {
    if (finalScore >= 9) {
      return {
        title: "President's Club Ready",
        subtitle: "Outstanding command of Oracle 26ai, OCI, AI, and modernization value propositions!",
        badgeClass: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
      };
    }
    if (finalScore >= 7) {
      return {
        title: "Trusted Federal Cloud Advisor",
        subtitle: "Strong instincts across both existing Oracle accounts and greenfield prospects.",
        badgeClass: "bg-sky-500/15 text-sky-400 border-sky-500/30",
      };
    }
    if (finalScore >= 5) {
      return {
        title: "Rising Account Executive",
        subtitle: "Good foundation—review the coaching takeaways below to sharpen your pitch.",
        badgeClass: "bg-amber-500/15 text-amber-500 border-amber-500/30",
      };
    }
    return {
      title: "Oracle 101 Refresher Recommended",
      subtitle: "Review the scenario takeaways below and try another 10-question round!",
      badgeClass: "bg-rose-500/15 text-rose-500 border-rose-500/30",
    };
  };

  const optionLetters = ["A", "B", "C", "D"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-w-3xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">Oracle Federal Salesperson Quiz</h2>
              <p className="text-xs text-zinc-400">
                Technical Offerings &amp; OCI Value Differentiation vs. Other Cloud Providers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isFinished && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                Score: {score} / {Object.keys(selectedAnswers).length}
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Close Quiz"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {!isFinished && currentQuestion ? (
            <>
              {/* Progress Bar & Question Meta */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      <Layers className="h-3 w-3" />
                      {currentQuestion.category}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        currentQuestion.installBase === "Existing Oracle Install Base"
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      }`}
                    >
                      <Building2 className="h-3 w-3" />
                      {currentQuestion.installBase}
                    </span>
                  </div>
                </div>

                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Customer Scenario Box */}
              <div
                className={`p-5 rounded-xl border ${
                  isLightMode
                    ? "bg-[#f8fafc] border-[#cbd5e1]"
                    : "bg-zinc-950/60 border-zinc-800"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Customer Scenario
                </p>
                <p className="text-base md:text-lg font-medium text-zinc-100 leading-relaxed">
                  {currentQuestion.scenario}
                </p>
              </div>

              {/* 4 Salesperson Answer Choices */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Choose the Best Salesperson Response:
                </p>
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOptionIndex === idx;
                  const isCorrectOption = opt.isCorrect;

                  let optionStyle = isLightMode
                    ? "bg-[#ffffff] border-[#cbd5e1] hover:border-sky-500 text-zinc-200"
                    : "bg-zinc-950/40 border-zinc-800 hover:border-sky-500/60 text-zinc-200";

                  if (hasAnsweredCurrent) {
                    if (isCorrectOption) {
                      optionStyle =
                        "bg-emerald-500/15 border-emerald-500 text-zinc-100 ring-1 ring-emerald-500/40";
                    } else if (isSelected && !isCorrectOption) {
                      optionStyle =
                        "bg-rose-500/15 border-rose-500 text-zinc-100 ring-1 ring-rose-500/40";
                    } else {
                      optionStyle = isLightMode
                        ? "bg-[#f1f5f9] border-[#e2e8f0] text-zinc-500 opacity-70"
                        : "bg-zinc-950/20 border-zinc-800/50 text-zinc-500 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={hasAnsweredCurrent}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                        hasAnsweredCurrent ? "cursor-default" : "cursor-pointer"
                      } ${optionStyle}`}
                    >
                      <span
                        className={`h-7 w-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border ${
                          hasAnsweredCurrent && isCorrectOption
                            ? "bg-emerald-500 text-white border-emerald-500"
                            : hasAnsweredCurrent && isSelected && !isCorrectOption
                              ? "bg-rose-500 text-white border-rose-500"
                              : "bg-zinc-800 text-zinc-300 border-zinc-700"
                        }`}
                      >
                        {optionLetters[idx]}
                      </span>
                      <span className="flex-1 text-sm md:text-base leading-relaxed">
                        {opt.text}
                      </span>
                      {hasAnsweredCurrent && isCorrectOption && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      )}
                      {hasAnsweredCurrent && isSelected && !isCorrectOption && (
                        <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Sales Coaching Takeaway */}
              {hasAnsweredCurrent && (
                <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/25 space-y-1.5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
                    <Sparkles className="h-4 w-4" />
                    <span>Sales Coaching Takeaway</span>
                  </div>
                  <p className="text-sm text-zinc-200 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Final Quiz Scorecard View */
            <div className="space-y-6">
              {(() => {
                const rank = getScoreRank(score);
                return (
                  <div
                    className={`p-6 rounded-2xl border text-center space-y-3 ${
                      isLightMode
                        ? "bg-[#f8fafc] border-[#cbd5e1]"
                        : "bg-zinc-950/60 border-zinc-800"
                    }`}
                  >
                    <div className="mx-auto h-14 w-14 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                      <Award className="h-8 w-8" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-zinc-100">
                      {score} / {questions.length}{" "}
                      <span className="text-sky-400">
                        ({Math.round((score / questions.length) * 100)}%)
                      </span>
                    </div>
                    <div className="inline-block">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${rank.badgeClass}`}
                      >
                        {rank.title}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400 max-w-lg mx-auto">{rank.subtitle}</p>
                  </div>
                );
              })()}

              {/* Question-by-Question Review */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Scenario Review ({questions.length} Questions)
                </h3>
                <div className="space-y-3">
                  {questions.map((q, idx) => {
                    const userPickIdx = selectedAnswers[idx];
                    const userPicked = userPickIdx !== undefined ? q.options[userPickIdx] : null;
                    const winningOption = q.options.find((o) => o.isCorrect);
                    const wasRight = Boolean(userPicked?.isCorrect);

                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-xl border space-y-2 ${
                          isLightMode
                            ? "bg-[#ffffff] border-[#cbd5e1]"
                            : "bg-zinc-950/40 border-zinc-800"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-sky-400">Q{idx + 1}.</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-medium">
                              {q.category}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                              {q.installBase}
                            </span>
                          </div>
                          {wasRight ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500 shrink-0">
                              <CheckCircle2 className="h-4 w-4" /> Correct
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500 shrink-0">
                              <XCircle className="h-4 w-4" /> Missed
                            </span>
                          )}
                        </div>

                        <p className="text-sm font-medium text-zinc-200">{q.scenario}</p>

                        {!wasRight && userPicked && (
                          <p className="text-xs text-rose-400">
                            <strong>Your response:</strong> {userPicked.text}
                          </p>
                        )}
                        {winningOption && (
                          <p className="text-xs text-emerald-500">
                            <strong>Winning pitch:</strong> {winningOption.text}
                          </p>
                        )}
                        <p className="text-xs text-zinc-400 pt-1 border-t border-zinc-800/60">
                          <strong>Why it wins:</strong> {q.explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/40 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>New Random Quiz</span>
          </button>

          {!isFinished ? (
            <button
              type="button"
              disabled={!hasAnsweredCurrent}
              onClick={handleNext}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-sky-500 hover:bg-sky-400 ${
                isLightMode ? "text-white" : "text-zinc-950"
              }`}
            >
              <span>
                {currentIndex + 1 < questions.length ? "Next Question" : "View Final Score"}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer bg-sky-500 hover:bg-sky-400 ${
                isLightMode ? "text-white" : "text-zinc-950"
              }`}
            >
              <span>Done</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

