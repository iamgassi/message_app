'use client'
import { Textarea } from '@/components/ui/textarea'
import { useParams } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { messageSchema } from '@/schemas/messageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/components/ui/use-toast'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/apiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"

const Page = () =>{
    const params = useParams()
    const { toast } = useToast() 

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
            // router.replace('/sign-in')
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
    return (
    <div className='container m-16'>
        <p className='my-4'>
            Hi, <span className='capitalize font-bold'>{params?.username} </span> Here , Please write your Message for me secretly.
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
                    <FormLabel>Message for me</FormLabel>
                    <FormControl>
                        {/* <Input placeholder="code" {...field} /> */}
                        <Textarea {...field} placeholder="Type your message here." />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                   )}
                />
                <Button type="submit">
                   Submit
                </Button>
                </form>
            </Form>

    </div>)
}

export default Page