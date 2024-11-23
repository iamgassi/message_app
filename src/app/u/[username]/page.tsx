'use client'
import { Textarea } from '@/components/ui/textarea'
import { useParams } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { messageSchema } from '@/schemas/messageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/components/ui/use-toast'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/apiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import { Separator } from "@/components/ui/separator"

const Page = () =>{
    const params = useParams()
    const { toast } = useToast() 
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema)
    })

    const onSubmit = async(data: z.infer<typeof messageSchema>) => 
    {
        try {
            const response = await axios.post(`/api/send-message`,{
                username: params.username,
                content: data.content
            })

            toast({
                title: 'Success',
                description: response.data.message
            })
             // Reset the content field after successful submission
             form.setValue('content', '')
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message ??  "Error in sending message"
            toast({
                title:'Sending message failed',
                description: errorMessage,
                variant:"destructive"
            })
        }
    }

    const suggestMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    try {
        const { data }:any = await axios.get<ApiResponse>('/api/suggest-messages')
        let messages = data?.messages?.message?.split('||')?.map((item:any) => item?.trim());
        setMessages(messages || [])
        if(refresh){
            toast({
                title: 'Suggested Messages',
                description: 'Suggested messages fetched',
                variant: 'default'
            })
        }
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast({
            title: 'Error',
            description: axiosError.response?.data.message || 'Failed to refresh messages',
            variant: 'destructive'
        })
    } finally {
        setIsLoading(false)
    }
    },[setIsLoading, setMessages, toast])

    return (<>
        <div className='container my-6'>
            <h2 className='text-2xl font-bold'>Public Profile URL</h2>
            <p className='my-4'>
               Please write your message secretly here.
            </p>
            <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} 
                    className="space-y-6"
                    >
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                        <FormItem>
                        <FormLabel>Message for <span className='capitalize font-bold'>{params?.username} </span></FormLabel>
                        <FormControl>
                            <Textarea {...field} placeholder="Type your message here." />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit"> Submit </Button>
                    </form>
            </Form>
        </div>
        <div className='py-2'>
           <Separator />
        </div>
        <div className='container'>
            <Button
                className="mt-4 block"
                onClick={(e) => {
                    e.preventDefault()
                    suggestMessages(true)
                }}>
                {isLoading? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ): (
                    <>Suggest Message</>
                )}
            </Button>
            <div className='p-5 mt-5 flex flex-col justify-between'>
                { messages && 
                    <>
                        {messages?.map((message:any,idx:any)=>(
                            <li key={idx}>{message}</li>
                        ))}
                    </>
                }
            </div>
        </div>
    </>)
}

export default Page