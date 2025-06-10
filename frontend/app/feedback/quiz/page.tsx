import { Suspense } from "react";
import FeedbackQuiz from "./FeedbackQuiz";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading quiz...</div>}>
      <FeedbackQuiz />
    </Suspense>
  );
}
