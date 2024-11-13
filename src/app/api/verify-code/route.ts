import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { usernameValidation, verifyCodeValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const verifyCodeSchema = z.object({
    username : usernameValidation,
    code : verifyCodeValidation
})

export async function POST(request: Request){
    dbConnect()
    try {
        const { username, code } = await request.json()
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUsername })
        const result = verifyCodeSchema.safeParse({username:decodedUsername, code})
        if(!result?.success){
            const usernameErrors = result?.error?.format().username?._errors || []
            const codeErrors = result?.error?.format().code?._errors || []
            return Response.json({
                success: false ,
                message: (usernameErrors?.length > 0 || codeErrors?.length > 0) ? usernameErrors.join(', ').concat(codeErrors.join(', ')) : 'Invalid payload'
                }, 
                { status : 400 }
            )
         }

        if(!user){
            return Response.json({
                success: false ,
                message: `No account found with Username : ${username}`
                }, 
                { status : 400 }
            )
        }   
        const isCodeValid = user.verifyCode === code
        const isCodeExpiryValid = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeExpiryValid && isCodeValid){
            user.isVerified = true
            await user.save()
            return Response.json({
                success: true ,
                message: 'Account verified successfully'
                }, 
                { status : 200 }
            )
        } else if(!isCodeValid){
            return Response.json({
                success: false ,
                message: 'Verification Code is not valid, please try again'
                }, 
                { status : 400 }
            )
        } else if(!isCodeExpiryValid){
            return Response.json({
                success: false ,
                message: 'Verification Code expired, please generate new code'
                }, 
                { status : 400 }
            )
        }

    } catch (error) {
        return Response.json({
            success: false ,
            message: 'Error while verify user code'
            }, 
            { status : 400 }
        )
    }
}