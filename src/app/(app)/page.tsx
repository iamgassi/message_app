'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
// import { Button, Card, CardContent, CardHeader, CardTitle } from 'shadcn-ui';
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import { userExistSchema } from '@/schemas/signUpSchema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/apiResponse';
import { Loader2 } from 'lucide-react';
import { useDebounceCallback } from 'usehooks-ts';
import DashBoard from './dashboard/page';

export default function HomePage() {
  const [username, setUsername] = useState('');
  const [usernameMessage, SetUsernameMessage] = useState('')
  const [isCheckingUsername, SetIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debounced = useDebounceCallback(setUsername,300)
  const { data: session } = useSession();
  const { toast } = useToast() 
  const router = useRouter();


  // zod implementation
  const form = useForm<z.infer<typeof userExistSchema>>({
    resolver: zodResolver(userExistSchema),
    defaultValues:{
        username:'',
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
       if(username){
           SetIsCheckingUsername(true)
           SetUsernameMessage('')
           try {
               const { data } = await axios.get(`/api/is-user-exist?username=${username}`)
               SetUsernameMessage(data?.message)
           } catch (error) {
               const axiosError = error as AxiosError<ApiResponse>
               SetUsernameMessage(axiosError.response?.data.message ?? 'Error checking username')
           }
           finally {
               SetIsCheckingUsername(false)
           }
       }
    }
    checkUsernameUnique()
   },[username])

  const handleUsernameSubmit = (formData: z.infer<typeof userExistSchema>) => {
    setIsSubmitting(true)
    try {
      if(usernameMessage !== 'Username exist') {
        toast({
          title:'Error',
          description: 'Please enter a valid username',
          variant:"destructive"
        })
        return
      }
      if(!session?.user) {
        toast({
          title: 'Alert',
          description: 'Please sign in first.'
        })
        setTimeout(() => {
          router.replace(`/sign-in?redirect=/u/${username}`);
        }, 1000);
        return
      }
      if (username.trim()) {
        router.push(`/u/${username}`);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message ??  "Error in username checking"
      toast({
          title:'username checking failed',
          description: errorMessage,
          variant:"destructive"
      })
    }
    finally{
      setIsSubmitting(false)
    }
  };

  if(session && session?.user){
    router.replace('/dashboard')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">Welcome to Secret Messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 py-5">
          <p className="text-center text-gray-700">
            Send anonymous messages to your friends, and they’ll be able to read them on their personal page. Keep it fun, keep it secret!
          </p>

          <div className="flex flex-col space-y-4">
            <Link href="/sign-up">
              <Button className={cn('w-full')}>Get Started - Sign Up</Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" className={cn('w-full')}>Sign In</Button>
            </Link>
          </div>

          <div className="mt-8">
            <p className="text-center text-gray-700">Or, send a message to someone:</p>
            <div className="">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleUsernameSubmit)} className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Username"
                            {...field}
                            className=""
                            onChange={(e: any) => {
                              field.onChange(e);
                              debounced(e.target.value);
                              if (form.formState.errors?.username?.message) {
                                SetUsernameMessage(form.formState.errors?.username?.message);
                              }
                            }}
                          />
                        </FormControl>
                        {isCheckingUsername && <Loader2 className="animate-spin" />}
                        {form.formState.errors?.username?.message ? (
                          <FormMessage />
                        ) : (
                          <p
                            className={`text-sm ${
                              usernameMessage === 'Username exist' ? 'text-green-600' : 'text-red-500 text-sm font-medium text-destructive'
                            }`}
                          >
                            {usernameMessage}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isSubmitting} className="ml-2 mt-6">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Go'}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
