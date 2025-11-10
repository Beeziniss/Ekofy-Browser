"use server";

import { cookies } from "next/headers";

// Cookie configuration
const CHECKOUT_SESSION_COOKIE_NAME = "stripe_checkout_session";
const COOKIE_MAX_AGE = 60 * 20; // 20 minutes in seconds

export interface CheckoutSessionData {
  url: string;
  sessionId: string;
  userId: string;
  transactionId?: string;
  createdAt: number;
}

/**
 * Save checkout session data to cookies
 */
export async function saveCheckoutSession(data: Omit<CheckoutSessionData, "createdAt">) {
  const cookieStore = await cookies();

  const sessionData: CheckoutSessionData = {
    ...data,
    createdAt: Date.now(),
  };

  try {
    cookieStore.set(CHECKOUT_SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to save checkout session:", error);
    return { success: false, error: "Failed to save checkout session" };
  }
}

/**
 * Get checkout session data from cookies
 */
export async function getCheckoutSession(userId: string): Promise<CheckoutSessionData | null> {
  const cookieStore = await cookies();

  try {
    const sessionCookie = cookieStore.get(CHECKOUT_SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return null;
    }

    const sessionData: CheckoutSessionData = JSON.parse(sessionCookie.value);

    // Verify the session belongs to the current user
    if (sessionData.userId !== userId) {
      return null;
    }

    // Check if session is expired (20 minutes)
    const isExpired = Date.now() - sessionData.createdAt > COOKIE_MAX_AGE * 1000;
    if (isExpired) {
      await clearCheckoutSession();
      return null;
    }

    return sessionData;
  } catch (error) {
    console.error("Failed to get checkout session:", error);
    return null;
  }
}

/**
 * Clear checkout session from cookies
 */
export async function clearCheckoutSession() {
  const cookieStore = await cookies();

  try {
    cookieStore.delete(CHECKOUT_SESSION_COOKIE_NAME);
    return { success: true };
  } catch (error) {
    console.error("Failed to clear checkout session:", error);
    return { success: false, error: "Failed to clear checkout session" };
  }
}

/**
 * Update checkout session with transaction ID
 */
export async function updateCheckoutSessionWithTransaction(userId: string, transactionId: string) {
  const existingSession = await getCheckoutSession(userId);

  if (!existingSession) {
    return { success: false, error: "No checkout session found" };
  }

  const updatedSession: CheckoutSessionData = {
    ...existingSession,
    transactionId,
  };

  return await saveCheckoutSession(updatedSession);
}

/**
 * Check if checkout session matches transaction ID
 */
export async function checkCheckoutSessionForTransaction(userId: string, transactionId: string): Promise<boolean> {
  const session = await getCheckoutSession(userId);
  return session?.transactionId === transactionId;
}
