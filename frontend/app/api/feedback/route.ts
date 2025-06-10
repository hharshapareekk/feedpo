// app/api/feedback/route.ts
import { users } from "@/lib/database";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, userId, answers, ratingPath } = body;

    // Basic validation
    if (!sessionId || !userId || !answers || !ratingPath) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update mock user data
    const user = users.find((u) => u.id === userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const session = user.sessions.find((s) => s.id === sessionId);
    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    session.feedbackSubmitted = true;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in POST /api/feedback:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
