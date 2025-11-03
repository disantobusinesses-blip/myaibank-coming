import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export async function handleNewsletterSignup(email) {
  if (!email || !email.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }

  try {
    const response = await resend.contacts.create({
      email,
      firstName: '',
      lastName: '',
      unsubscribed: false,
      audienceId: import.meta.env.VITE_RESEND_AUDIENCE_ID,
    });

    if (response && response.id) {
      console.log('✅ Contact added successfully:', response.id);
      return { success: true, message: 'You’re on the list!' };
    }

    console.error('Unexpected response from Resend:', response);
    throw new Error('Signup failed. Please try again.');
  } catch (error) {
    console.error('❌ Resend API error:', error);
    throw new Error('Could not subscribe. Please try again later.');
  }
}
