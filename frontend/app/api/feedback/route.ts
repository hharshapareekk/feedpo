// app/api/feedback/route.ts
import { users } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { sessionId, userId, answers, ratingPath } = await request.json();

    // Find the user and update their session
    const user = users.find(u => u.id === userId);
    if (user) {
      const session = user.sessions.find(s => s.id === sessionId);
      if (session) {
        session.feedbackSubmitted = true;
      }
    }

    // In a real app, you would save this to a database
    // For now, we're just updating the mock data

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}