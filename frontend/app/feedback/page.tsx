"use client";
import { Session, User, users } from "@/lib/database";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FeedbackPage() {
  const [user, setUser] = useState<User | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const userId = searchParams.get("userId");
    if (userId) {
      const foundUser = users.find((u) => u.id === userId);
      if (foundUser) setUser(foundUser);
    }
  }, [searchParams.toString()]);

  if (!user)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 text-lg font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );

  const cardColors = [
    "bg-blue-100 border-blue-200",
    "bg-emerald-100 border-emerald-200",
    "bg-amber-100 border-amber-200",
    "bg-purple-100 border-purple-200",
    "bg-rose-100 border-rose-200",
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-2xl shadow-lg mb-10 text-white">
          <div className="flex items-center space-x-5">
            <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white text-3xl font-bold">
                {user.name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
              <p className="text-blue-100 mt-2 text-lg">
                Your recent learning sessions
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.sessions.length === 0 ? (
            <div className="col-span-full bg-gray-50 p-10 rounded-2xl shadow-sm border border-gray-200 text-center">
              <div className="inline-flex bg-blue-100 p-4 rounded-full mb-5">
                <svg
                  className="w-10 h-10 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                No sessions yet
              </h3>
              <p className="text-gray-500">
                When you attend sessions, they'll appear here
              </p>
            </div>
          ) : (
            user.sessions.map((session, index) => (
              <SessionCard
                key={session.id}
                session={session}
                colorVariant={cardColors[index % cardColors.length]}
                onFeedbackClick={() =>
                  router.push(
                    `/feedback/quiz?sessionId=${session.id}&userId=${user.id}`
                  )
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SessionCard({
  session,
  colorVariant,
  onFeedbackClick,
}: {
  session: Session;
  colorVariant: string;
  onFeedbackClick: () => void;
}) {
  return (
    <div
      className={`group border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col ${colorVariant}`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 5v2m0 4v2m0 4v2m5-5a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          {session.feedbackSubmitted ? (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              COMPLETED
            </span>
          ) : null}
        </div>
        <h3 className="text-gray-800 font-bold text-xl mt-4 line-clamp-2">
          {session.name}
        </h3>
        <p className="text-gray-600 text-sm mt-1">
          {new Date(session.date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="px-5 pb-5 flex-grow">
        <p className="text-gray-700 line-clamp-4">{session.description}</p>
      </div>

      <div className="p-5 pt-0">
        {session.feedbackSubmitted ? (
          <div className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center">
            <svg
              className="w-5 h-5 mr-2 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            Feedback Submitted
          </div>
        ) : (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 shadow-sm hover:shadow-md w-full flex items-center justify-center"
            onClick={onFeedbackClick}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            Give Feedback
          </button>
        )}
      </div>
    </div>
  );
}
