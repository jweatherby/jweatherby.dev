import nodemailer from "nodemailer";

export const POST = async (request) => {
  const payload = await request.json();

  const auth = {
    user: "jamie@jweatherby.dev",
    pass: process.env.FASTMAIL_PASSWORD,
  };

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: "smtp.fastmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth,
  });
  try {
    const resp = await transporter.sendMail({
      from: payload.from,
      to: "jamie@jweatherby.dev",
      subject: `${payload.topic.toUpperCase()} - ${payload.subject}`,
      text: payload.message,
      html: payload.message,
    });
    console.log("sendMail resp", resp);
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({
      ok: false,
      errors: [{ message: e.message, code: "INTERNAL_ERROR" }],
    });
  }
};
