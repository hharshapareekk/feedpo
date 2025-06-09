"use client";
import WebcamCapture from "@/components/WebcamCapture";
import { verifyUserFromImage } from "@/lib/face-verification";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FaceVerificationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const router = useRouter();

  const handleCapture = (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setError(null);
  };

  const handleVerification = async () => {
    if (!capturedImage) {
      setError("Please capture your photo first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { user, error: verificationError } = await verifyUserFromImage(
        capturedImage
      );

      if (user) {
        router.push(`/feedback?userId=${user.id}`);
      } else {
        setError(verificationError || "Face not recognized. Please try again.");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center mb-4">
            <div className="w-12 h-12 bg-[#19486a] rounded-full flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-[#19486a]">
              Seva Sahayog Foundation
            </h1>
          </div>
          <p className="text-xl text-[#19486a] max-w-3xl mx-auto">
            Building bridges between communities through verified feedback and
            meaningful engagement
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          {/* Left Content */}
          <div className="lg:w-1/2 space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold text-[#19486a] mb-4">
                Why Your Feedback Matters
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-[#19486a]/10 p-2 rounded-full mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#19486a]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    Helps us improve our programs and outreach
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-[#19486a]/10 p-2 rounded-full mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#19486a]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    Ensures we serve community needs effectively
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-[#19486a]/10 p-2 rounded-full mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#19486a]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    Creates accountability for our initiatives
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-[#19486a] p-6 rounded-xl text-white">
              <h3 className="text-xl font-semibold mb-3">
                Our Verification Process
              </h3>
              <p className="mb-4">
                We use face verification to ensure feedback comes from actual
                participants of our programs. This helps maintain the integrity
                of our data collection.
              </p>
              <div className="text-sm bg-[#123456] p-3 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 inline mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                    clipRule="evenodd"
                  />
                </svg>
                Your photo will be stored securely only for verification
                purposes.
              </div>
            </div>
          </div>

          {/* Verification Box */}
          <div className="lg:w-1/2">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
              <h1 className="text-2xl font-bold mb-6 text-center text-[#19486a]">
                Verify Your Identity
              </h1>

              <div className="space-y-6">
                <WebcamCapture onCapture={handleCapture} />

                {capturedImage && (
                  <button
                    onClick={handleVerification}
                    disabled={isLoading}
                    className="w-full py-2 px-4 bg-[#19486a] text-white rounded-md hover:bg-[#123456] disabled:opacity-50"
                  >
                    {isLoading ? "Verifying..." : "Verify Identity"}
                  </button>
                )}

                {error && (
                  <div className="text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}

                <div className="text-center text-sm text-gray-500">
                  <p>
                    We'll compare your photo with our event attendance records
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
