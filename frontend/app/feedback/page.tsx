import { Suspense } from "react";
import FeedbackClient from "./FeedbackClient"; // move your component code into this file

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FeedbackClient />
    </Suspense>
  );
}
