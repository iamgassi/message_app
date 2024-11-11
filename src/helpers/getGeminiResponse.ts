import { genAIModel } from "@/lib/gemini";
import { ApiResponse } from "@/types/apiResponse";


export async function getGeminiMessages() : Promise<ApiResponse> {
    try {
        const prompt = `Create a list of four open-ended and engaging questions formatted as a single string. Each question should be seperated by '||'. These question are anonymous social messaging platform. Avoid personal and sensitive topics, focusing instead on universal themes that encourage friendly interaction. Example like : What's the most underrated hobby you've ever tried? || If you could have any fictional character as a roommate, who would it be and why? || What's the most beautiful natural sight you've ever seen? || If you could instantly become an expert at any skill, what would it be and why? Make sure these message are welcoming messages to engage with this platform. Please make some random welcoming message don't repeat same messages.`
        const { response } = await genAIModel.generateContent(prompt);
        const text = response.text();

        // if(error){
        //     return {
        //         success: false,
        //         message: error?.message
        //     } 
        // }
        return {
            success: true,
            message: text
        }
    } catch (error) {
        return {
            success: false,
            message: `Gemini failed to response ${error}`
        }
    }
}