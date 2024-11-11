import { EMAIL_VALIDATION_REGEX } from "@/utils/constant";
import mongoose, { Schema, Document} from "mongoose";

export interface Message extends Document{
    content: string
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: new Date
    }
})

export interface User extends Document{
    username: string
    email: string
    password: string
    isVerified: boolean
    verifyCode : string
    verifyCodeExpiry: Date
    isAcceptingMessage: Boolean
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [EMAIL_VALIDATION_REGEX, 'Please enter a valid email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyCode: {
        type: String,
        required: [true, 'VerifyCode is required'],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'VerifyCode Expiry is required'],
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)

export default UserModel;