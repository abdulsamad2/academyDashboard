'use server';

import { createTransport } from 'nodemailer';

export interface ContactFormState {}
interface sendMailProps {
  mail_from: string;
  mail_to: string;
  html: string;
  subject: string;
}
export async function sendEmail({
  mail_from,
  mail_to,
  subject,
  html
}: sendMailProps) {
  if (!mail_from || !mail_to) {
    return {
      message: 'Ooops something went wrong on our side, please try again later',
      error: true,
      success: false
    };
  }
  //   const rawFormData = {
  //     sender_name: formData.get('sender_name'),
  //     sender_contact: formData.get('sender_contact'),
  //     sender_message: formData.get('sender_message')
  //   };

  const transporter = createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'ff69dad8fbe035',
      pass: '3f66835f963ce1'
    }
  });

  const mailOptions = {
    from: mail_from,
    to: mail_to,
    subject: subject,
    text: html
  };

  async function asyncsendMail() {
    return new Promise<ContactFormState>((resolve, reject) => {
      transporter.sendMail(mailOptions, function (error: any, info: any) {
        if (error) {
          resolve({
            message: 'Something went wrong',
            error: true,
            success: false
          });
        } else {
          resolve({
            message: 'Successfully sent, Thank you!',
            error: false,
            success: true,
            fieldValues: {
              sender_name: '',
              sender_email: '',
              sender_message: ''
            }
          });
        }
      });
    });
  }

  return await asyncsendMail();
}
