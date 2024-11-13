import { ApiResponse } from "@/types/apiResponse";
import axios from "axios";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
) : Promise<ApiResponse> {
    try {
        // resend api
        // const { data, error } = await resend.emails.send({
        //     from: 'Acme <onboarding@resend.dev>',
        //     to: [email],
        //     subject: 'Secret Message | Verification code',
        //     react: EmailTemplate({ username, verifyCode }),
        // });
        // if(error){
        //     return {
        //         success: false,
        //         message: error?.message
        //     } 
        // }

        // Brevo api 
        const apiKey = process.env.BREVO_API_KEY
        const url = 'https://api.brevo.com/v3/smtp/email';
      
        const emailData = {
          sender: { email: 'gauravgassi123@gmail.com', name: 'Secret Message' },
          to: [{ email: email, name: username }],
          subject: 'Verification Code',
          htmlContent: `<div><h1>Hello , ${username}</h1><p>Your verification code is : ${verifyCode}</p></div>`,
        };

        await axios.post(url, emailData, {
            headers: {
              'api-key': apiKey,
              'Content-Type': 'application/json',
            },
        });

        return {
            success: true,
            message: 'Verification email send successfully'
        }
    } catch (error) {
        return {
            success: false,
            message: 'Failed to send verification email'
        }
    }
}