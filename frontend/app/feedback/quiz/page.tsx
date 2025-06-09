"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const QUESTION_SETS = {
  initial: [
    "How would you rate this session overall? (5 = Excellent, 1 = Poor)",
  ],
  positive: [
    "What did you enjoy most about the session?",
    "Was the presenter engaging and clear?",
    "Would you recommend this session to others?",
  ],
  negative: [
    "What could be improved about the session?",
    "Was there anything particularly disappointing?",
    "Would you like additional follow-up on this topic?",
  ],
};

const EMOJI_OPTIONS = [
  { emoji: "😍", label: "5", value: 5 },
  { emoji: "😊", label: "4", value: 4 },
  { emoji: "😐", label: "3", value: 3 },
  { emoji: "😞", label: "2", value: 2 },
  { emoji: "😠", label: "1", value: 1 },
];

type Answer = {
  emoji?: string;
  value?: number;
  text?: string;
};

export default function FeedbackQuiz() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const userId = searchParams.get("userId");

  const [currentQuestionSet, setCurrentQuestionSet] = useState<
    "initial" | "positive" | "negative"
  >("initial");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestions =
    currentQuestionSet === "initial"
      ? QUESTION_SETS.initial
      : currentQuestionSet === "positive"
      ? QUESTION_SETS.positive
      : QUESTION_SETS.negative;

  const progressPercentage =
    ((currentIndex + 1) / currentQuestions.length) * 100;

  const handleEmojiSelect = (emoji: string, value: number) => {
    const newAnswers = { ...answers, [currentIndex]: { emoji, value } };
    setAnswers(newAnswers);

    if (currentQuestionSet === "initial") {
      setTimeout(() => {
        if (value <= 2) {
          setCurrentQuestionSet("negative");
        } else {
          setCurrentQuestionSet("positive");
        }
        setCurrentIndex(0);
      }, 300);
    } else {
      setTimeout(() => {
        if (currentIndex < currentQuestions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        }
      }, 300);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswers = {
      ...answers,
      [currentIndex]: {
        ...answers[currentIndex],
        text: e.target.value,
      },
    };
    setAnswers(newAnswers);
  };

  const submitFeedback = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          userId,
          answers,
          ratingPath: currentQuestionSet,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit");

      // Use Next.js router refresh
      router.push(`/feedback?userId=${userId}`);
      router.refresh(); // This forces a re-render with fresh data
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="h-1.5 bg-gray-200">
          <div
            className="h-full bg-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <div className="p-8">
          <div className="text-sm font-medium text-blue-600 mb-2">
            Question {currentIndex + 1} of {currentQuestions.length}
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-tight">
            {currentQuestions[currentIndex]}
          </h2>

          {currentQuestionSet === "initial" ? (
            <div className="grid grid-cols-5 gap-3 mb-10">
              {EMOJI_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleEmojiSelect(option.emoji, option.value)}
                  className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${
                    answers[currentIndex]?.value === option.value
                      ? "bg-blue-100 scale-105"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span className="text-3xl mb-1">{option.emoji}</span>
                  <span className="text-xs font-medium text-gray-600">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="mb-6">
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black text-lg"
                rows={4}
                placeholder="Type your feedback here..."
                value={answers[currentIndex]?.text || ""}
                onChange={handleTextChange}
              />
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-lg text-gray-600 font-medium disabled:opacity-40"
            >
              Back
            </button>

            {currentIndex === currentQuestions.length - 1 ? (
              <button
                onClick={submitFeedback}
                disabled={
                  (currentQuestionSet === "initial" &&
                    !answers[currentIndex]) ||
                  (currentQuestionSet !== "initial" &&
                    !answers[currentIndex]?.text) ||
                  isSubmitting
                }
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Feedback"
                )}
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                disabled={
                  (currentQuestionSet === "initial" &&
                    !answers[currentIndex]) ||
                  (currentQuestionSet !== "initial" &&
                    !answers[currentIndex]?.text)
                }
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// app/api/feedback/route.ts
import { users } from "@/lib/database";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { sessionId, userId, answers, ratingPath } = await request.json();

    // Find the user and update their session
    const user = users.find((u) => u.id === userId);
    if (user) {
      const session = user.sessions.find((s) => s.id === sessionId);
      if (session) {
        session.feedbackSubmitted = true;
      }
    }

    // In a real app, you would save this to a database
    // For now, we're just updating the mock data

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
