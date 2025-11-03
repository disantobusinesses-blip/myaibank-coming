/**
 * Config for MyAiBank newsletter integration using Resend API.
 * Frontend-safe version for Vite builds.
 */

export const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || "";

/**
 * Helper function for sending a newsletter signup request.
 * Replace the endpoint URL if your API route differs.
 */
export async function subscribeToNewsletter(email) {
  if (!RESEND_API_KEY) {
    throw new Error("Resend API key not configured");
  }

  const response = await fetch("https://api.resend.com/v1/contacts", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      audience_id: "your_audience_id_here" // optional: replace with your Resend audience ID
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Resend error: ${error.message || response.statusText}`);
  }

  return await response.json();
}