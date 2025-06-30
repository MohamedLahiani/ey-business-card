import nodemailer from 'nodemailer';

export const sendBusinessCardEmail = async (toEmail: string, qrBuffer: Buffer, vcfBuffer: Buffer) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mohamedlahiani11@gmail.com',      
      pass: 'mohamed123'          
    }
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: toEmail,
    subject: 'Your Business Card',
    text: 'Please find your business card and QR code attached.',
    attachments: [
      { filename: 'business_card.vcf', content: vcfBuffer },
      { filename: 'qr_code.png', content: qrBuffer }
    ]
  };

  await transporter.sendMail(mailOptions);
};
