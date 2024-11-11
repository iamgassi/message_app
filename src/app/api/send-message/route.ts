import dbConnect from "@/lib/dbConnection";
import UserModel, { Message } from "@/model/User";

export async function POST(request: Request){
    await dbConnect()
    try {
        const { content , username } = await request.json()
        const user = await UserModel.findOne({username})
        // is User Accepting Messages
        if(!user?.isAcceptingMessage){
            return Response.json({
                success: false,
                message: "User not accepting message"
            },
            {
                status: 403
            }
            )
        }
        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save()
        return Response.json({
            success: true,
            message: "Message sent successfully"
        },
        {
            status: 200
        }
        )
    } catch (error) {
        return Response.json({
            success: false,
            message: "Failed to send message"
        },
        {
            status: 500
        }
        )
    }
}