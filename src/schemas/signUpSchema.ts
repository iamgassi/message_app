import { z } from 'zod'

export const usernameValidation = z
    .string()
    .min(2,"Username must be atleast 2 characters")
    .max(20,"Username not more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)?$/,"Username must not contain special characters and can only have one space.")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6,{message:"Password must be 6 characters"})
})

export const verifyCodeValidation = z
    .string()
    .min(6,"VerifyCode is must be 6 characters")

export const userExistSchema = z.object({
    username: usernameValidation,
})