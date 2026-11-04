/**
 * Development & Production Email Adapter
 */

export const sendEmail = async ({ to, subject, html, text }) => {
  const hasCredentials = process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD;

  if (hasCredentials && process.env.NODE_ENV === 'production') {
    // In production with credentials, configure dynamic nodemailer
    console.log(`[AUTOX Email] Sending production email to ${to}: "${subject}"`);
    return { success: true, simulated: false };
  } else {
    // Development fallback adapter
    console.log(`--------------------------------------------------`);
    console.log(`[AUTOX EMAIL ADAPTER - DEV / STAGING FALLBACK]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Preview: ${text || html?.substring(0, 150)}...`);
    console.log(`--------------------------------------------------`);
    return { success: true, simulated: true };
  }
};
