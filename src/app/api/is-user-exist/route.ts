import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";

import { z } from "zod";

const usernameQuerySchema = z.object({
    username : usernameValidation
})

export async function GET(request:Request){
   await dbConnect()
   try {
     const { searchParams } = new URL(request.url)
     const queryParam = {
        username : searchParams.get('username')
     } 
     // validate with zod 
     const result = usernameQuerySchema.safeParse(queryParam)
     if(!result?.success){
        const usernameErrors = result?.error?.format().username?._errors || []
        return Response.json({
            success: false ,
            message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters'
            }, 
            { status : 400 }
        )
     }

     const { username } = result?.data
     const existingVerifiedUsername = await UserModel.findOne({
        username: { $regex: new RegExp(`^${username}$`, 'i') }, // Case-insensitive
        isVerified: true
     })

     if(existingVerifiedUsername){
        return Response.json({
            success: true ,
            message: 'Username exist'
            }, 
            { status : 400 }
         )
     }
     return Response.json({
        success: false ,
        message: 'Username not exist'
        }, 
        { status : 200 }
     )
   } catch (error) {
     return Response.json({
        success: false,
        message: "Error checking username"
     },
     {
        status : 500
     }
    )
   }
}