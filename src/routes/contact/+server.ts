import nodemailer from 'nodemailer'
import settings from '$settings'
import { json } from 'stream/consumers'

export const prerender = false
export const POST = async ({ request }) => {
  const payload = await request.json()

  const auth = {
    user: settings.fastmail.senderEmail,
    pass: settings.fastmail.password
  }

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: "smtp.fastmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth
  });
  try {
    await transporter.sendMail({
      from: payload.from,
      to: 'jamie@jweatherby.dev',
      subject: `${payload.topic.toUpperCase()} - ${payload.subject}`,
      text: payload.message,
      html: payload.message
    })
    return json({ ok: true })
  } catch (e: any) {
    console.error(e.message)
    return json({
      ok: false,
      errors: [
        { message: 'Could not send email', code: 'INTERNAL_ERROR' }
      ]
    })
  }
}
