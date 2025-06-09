import { Session } from 'inspector/promises';
import { User, users } from './database'; // Add this import at the top

export interface VerificationResult {
  user: User | null;
  session?: Session; // Add this if using sessions
  error?: string;
}

export async function verifyUserFromImage(imageSrc: string): Promise<VerificationResult> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageSrc
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.verified) {
      // Find user in your frontend database
      const user = users.find(u => u.id === data.userId);
      
      if (!user) {
        return {
          user: null,
          error: 'User not found in local database'
        };
      }

      return { 
        user,
        session: data.session
      };
    }
    
    return { 
      user: null, 
      error: data.error || 'Face not recognized in our records' 
    };
  } catch (error) {
    console.error('Verification error:', error);
    return { 
      user: null,
      error: error instanceof Error ? error.message : 'Verification service unavailable'
    };
  }
}