'use client'

import {useState} from 'react'
import {signIn} from 'next-auth/react'
import {useRouter} from 'next/navigation'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import { loginSchema } from '@/lib/validations/auth'
import { Button } from '../ui/button'
import {Input} from '../ui/input'
// add label card use-toast
import {Label} from '../ui/label'
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle} from '../ui/card'
import { toast } from "sonner"



type LoginFormValues={
    email:string
    password:string
}

export function LoginForm(){
    const [isLoading,setIsLoading]=useState(false)
    const router=useRouter()

    const {register,handleSubmit,formState:{errors}}=useForm<LoginFormValues>({
        resolver:zodResolver(loginSchema)
    })

    const onSubmit=async(data:LoginFormValues)=>{
        setIsLoading(true)

        try{
            const result=await signIn('credentials',{
                email:data.email,
                password:data.password,
                redirect:false,
            })

            if(result?.error){
                toast.error('Authentication failed',{
                    description:'Invalid email or password'
                })
            }else{
                toast.success(
                    'Login successful',{
                        description:'You have been logged in successfully'
                    }
                )
                router.push('/dashboard')
            }
        }catch(error){
            toast.error(
                'Something went wrong',{
                    description:'Please try again later'
                }
            )
        }finally{
            setIsLoading(false)
        }
    }
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                Enter your email and password to access your account
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    {...register('email')}
                    />
                    {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                    />
                    {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                </div>
                </CardContent>
                <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </Button>
                </CardFooter>
            </form>
            </Card>
        )
}