import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'quanedann@gmail.com',
		pass: 'qvbk yhgp qkbm syxe',
	},
});

export class EmailService {
	private static instance: EmailService;

	public static getInstance(): EmailService {
		if (!EmailService.instance) {
			EmailService.instance = new EmailService();
		}
		return EmailService.instance;
	}

	async sendApplicationNotification(
		to: string,
		from: string,
		applicationData: any
	) {
		const mailOptions = {
			from: from,
			to: to,
			subject: `New Job Application: ${applicationData.jobTitle}`,
			html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>New Job Application</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb; padding: 40px 20px;">
                        <tr>
                            <td>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                    <!-- Header -->
                                    <tr>
                                    // Update the img src in the email template
                                    <td style="background: linear-gradient(to right, #00ff5e, #00e676); padding: 40px 40px; text-align: center;">
                                        <img src="https://firebasestorage.googleapis.com/v0/b/ourlime-web.appspot.com/o/logo.png" 
                                             alt="Ourlime Logo" 
                                             width="150" 
                                             style="margin-bottom: 20px;">
                                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Job Application Received</h1>
                                    </td>
                                    
                                    </tr>

                                    <!-- Content -->
                                    <tr>
                                        <td style="padding: 40px;">
                                            <h2 style="color: #111827; margin: 0 0 20px; font-size: 20px;">Position: ${applicationData.jobTitle}</h2>
                                            
                                            <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                                                <h3 style="color: #111827; margin: 0 0 15px; font-size: 16px;">Applicant Details</h3>
                                                <p style="margin: 0 0 10px; color: #374151;">
                                                    <strong>Name:</strong> ${applicationData.applicantName}
                                                </p>
                                                <p style="margin: 0 0 10px; color: #374151;">
                                                    <strong>Email:</strong> ${applicationData.applicantEmail}
                                                </p>
                                                ${
																									applicationData.portfolioLink
																										? `
                                                <p style="margin: 0 0 10px; color: #374151;">
                                                    <strong>Portfolio:</strong> <a href="${applicationData.portfolioLink}" style="color: #00ff5e;">${applicationData.portfolioLink}</a>
                                                </p>
                                                `
																										: ''
																								}
                                            </div>

                                            <div style="margin-bottom: 30px;">
                                                <h3 style="color: #111827; margin: 0 0 15px; font-size: 16px;">Cover Letter</h3>
                                                <p style="margin: 0; color: #374151; line-height: 1.6;">
                                                    ${applicationData.coverLetter}
                                                </p>
                                            </div>

                                            ${
																							applicationData.answers?.length >
																							0
																								? `
                                            <div style="margin-bottom: 30px;">
                                                <h3 style="color: #111827; margin: 0 0 15px; font-size: 16px;">Screening Questions</h3>
                                                ${applicationData.answers
																									.map(
																										(answer: any) => `
                                                    <div style="margin-bottom: 15px;">
                                                        <p style="margin: 0 0 5px; color: #4b5563; font-weight: 600;">${answer.question}</p>
                                                        <p style="margin: 0; color: #374151;">${answer.response}</p>
                                                    </div>
                                                `
																									)
																									.join('')}
                                            </div>
                                            `
																								: ''
																						}

                                            <div style="text-align: center;">
                                                <a href="${applicationData.applicationUrl}" style="display: inline-block; background-color: #00ff5e; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600;">
                                                    View Full Application
                                                </a>
                                            </div>
                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color: #f3f4f6; padding: 20px 40px; text-align: center;">
                                            <p style="margin: 0; color: #6b7280; font-size: 14px;">
                                                This is an automated message from Ourlime Platform
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `,
		};

		return transporter.sendMail(mailOptions);
	}
}
