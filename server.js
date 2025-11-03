import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const resendApiKey = process.env.RESEND_API_KEY;
const audienceId = process.env.RESEND_AUDIENCE_ID;

let resendClient = null;
if (resendApiKey) {
  resendClient = new Resend(resendApiKey);
} else {
  console.warn('RESEND_API_KEY is not set; newsletter signup will be disabled.');
}

app.post('/api/subscribe', async (req, res) => {
  if (!resendClient) {
    return res.status(503).json({ message: 'Newsletter service unavailable. Please try again later.' });
  }

  const { email, firstName = '', lastName = '' } = req.body ?? {};

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: 'A valid email address is required.' });
  }

  if (!audienceId) {
    return res.status(500).json({ message: 'Audience ID is not configured.' });
  }

  try {
    const result = await resendClient.contacts.create({
      email,
      firstName,
      lastName,
      unsubscribed: false,
      audienceId,
    });

    return res.status(201).json({ message: 'Thanks for subscribing!', contact: result?.data ?? null });
  } catch (error) {
    console.error('Failed to add contact to Resend audience', error);
    const message = error?.message || 'Failed to subscribe. Please try again later.';
    return res.status(500).json({ message });
  }
});

app.get('/api/contact', async (req, res) => {
  if (!resendClient) {
    return res.status(503).json({ message: 'Newsletter service unavailable. Please try again later.' });
  }

  if (!audienceId) {
    return res.status(500).json({ message: 'Audience ID is not configured.' });
  }

  const { id, email } = req.query ?? {};

  if (!id && !email) {
    return res.status(400).json({ message: 'Provide either a contact id or email query parameter.' });
  }

  try {
    const result = await resendClient.contacts.get({
      id: id ?? undefined,
      email: email ?? undefined,
      audienceId,
    });

    return res.status(200).json({ contact: result?.data ?? null });
  } catch (error) {
    console.error('Failed to retrieve contact from Resend audience', error);
    const message = error?.message || 'Failed to retrieve contact.';
    return res.status(500).json({ message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
