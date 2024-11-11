import { resend } from "@/lib/resend";
import EmailTemplate from "@/components/EmailTemplate";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
) : Promise<ApiResponse> {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [email],
            subject: 'Secret Message | Verification code',
            react: EmailTemplate({ username, verifyCode }),
          });

        if(error){
            return {
                success: false,
                message: error?.message
            } 
        }
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