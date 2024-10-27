import { Resend } from 'resend';
const apikey = process.env.RESEND_API_KEY;

interface RequestBody {
  emailTo: string;
  html: any;
  subject: string;
}

export async function POST(req: Request) {
  const resend = new Resend(apikey);
  try {
    const { emailTo, html, subject }: RequestBody = await req.json();


    const { data, error } = await resend.emails.send({
      from: 'UhilAcademy <noreply@mail.uhilacademy.com>',
      to: [emailTo],
      subject: subject,
      html: html,
    });

    if (error) {
      return new Response(JSON.stringify({ error }), { status: 500 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error:unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
