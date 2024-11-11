'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useState, Suspense } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { AxiosError } from 'axios'
import { ApiResponse } from "@/types/apiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"

const SignInPage = () => {
    const [isSubmitting, SetIsSubmitting] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    // Wrap the useSearchParams() hook with Suspense to avoid error
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/dashboard';

    // zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues:{
            identifier:'',
            password:''
        }
    })

    const onSubmit = async (formData: z.infer<typeof signInSchema>) => {
        SetIsSubmitting(true)
        try {
           const result = await signIn('credentials',{
            redirect: false,
            identifier: formData.identifier,
            password: formData.password
           })
           if(result?.error){
            toast({
                title:'Sign in failed',
                description: result?.error,
                variant:"destructive"
            })
           } else {
            router.replace(redirectUrl)
            toast({
                title:'Success',
                description: "Sign in Success",
                variant:"default"
            })
           }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message ??  "Error in sign-up user"
            toast({
                title:'Sign-up failed',
                description: errorMessage,
                variant:"destructive"
            })
        } finally {
            SetIsSubmitting(false)
        }
    }

    return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5l mb-6">
                    Join Mystery Message
                </h1>
                <p className="mb-4">Sign In to start your anonymous adventure</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username/Email</FormLabel>
                    <FormControl>
                        <Input placeholder="username/email" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input type='password' placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {
                        isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        ) : ( 'Sign In')
                    }
                </Button>
                </form>
            </Form>
            <div className="text-center mt-4">
                <p>
                    Not a member?{' '}
                    <Link href='/sign-up' className="text-blue-600 hover:text-blue-800">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    </div>)
}

const SignIn = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <SignInPage />
    </Suspense>
)

export default SignIn