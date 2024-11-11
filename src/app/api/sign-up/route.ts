import { sendVerificationEmail } from '@/helpers/sendVerificationMail';
import dbConnect from '@/lib/dbConnection';
import UserModel from '@/model/User';
import bcryptjs from 'bcryptjs'



export async function POST(req: Request) {
  await dbConnect()
  try {
    const { username, email, password } = await req.json()
    const existingUserVerificationByUsername = await UserModel.findOne({
      username,
      isVerified: true
    })
    if(existingUserVerificationByUsername){
      return Response.json({
        success: false,
        message: 'Username already taken'
      })
    }
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
    const existingUserByEmail = await UserModel.findOne({ email })
    if(existingUserByEmail){
      if(existingUserByEmail?.isVerified){
        return Response.json({
          success: false,
          message: "User already exist with this email"
        }, {status : 400})
      } else {
        const hashedPassword = await bcryptjs.hash(password,10)
        existingUserByEmail.password = hashedPassword
        existingUserByEmail.verifyCode = verifyCode
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
        await existingUserByEmail.save()
      }
    } else {
      const hashPassword = await bcryptjs.hash(password,10)
      const expiryDate = new Date()
      expiryDate.setHours(expiryDate.getHours() + 1)

      const newUser = new UserModel({
        username,
        email,
        password : hashPassword,
        isVerified: false,
        verifyCode : verifyCode,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        messages: []
      })

      await newUser.save()
    }

    // send verification mail
    const emailResponse = await sendVerificationEmail(email, username, verifyCode)
    if(!emailResponse.success){
      return Response.json({
        success: false,
        message: emailResponse?.message
      }, {status : 500})
    }
    return Response.json({
      success: false,
      message: "User registered successfully , Please verify email"
    }, {status : 201})

  } catch (error) {
    console.error("Error registering user", error)
    return Response.json({ 
      success: false,
      message: 'Error registering user' 
    }, { status: 500 });
  }
}
