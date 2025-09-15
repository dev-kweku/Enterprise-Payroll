    'use client'

    import { useState } from 'react'
    import { useRouter } from 'next/navigation'
    import { useForm } from 'react-hook-form'
    import { zodResolver } from '@hookform/resolvers/zod'
    import { registerSchema } from '@/lib/validations/auth'
    import { Button } from '@/components/ui/button'
    import { Input } from '@/components/ui/input'
    import { Label } from '@/components/ui/label'
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
    import { toast } from 'sonner'

    type RegisterFormValues = {
    email: string
    password: string
    confirmPassword: string
    firstName: string
    lastName: string
    }

    export function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        } = useForm<RegisterFormValues>({
            resolver: zodResolver(registerSchema),
            defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            },
        });

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    confirmPassword: data.confirmPassword, // Include this field
                    firstName: data.firstName,
                    lastName: data.lastName,
                }),
            });

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Registration failed')
        }

        toast.success('Registration Successfully',{
            description:'Your account has been created successfully'
        })
        router.push('/login')
        } catch (error) {
        toast.error('Registration failed',{
            description:'Something went wrong'
        })
        } finally {
        setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
        <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
            Enter your information to create your account
            </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                    id="firstName"
                    placeholder="First name"
                    {...register('firstName')}
                />
                {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
                </div>
                <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                    id="lastName"
                    placeholder="Last name"
                    {...register('lastName')}
                />
                {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName.message}</p>
                )}
                </div>
            </div>
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
            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
            </div>
            </CardContent>
            <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
            </CardFooter>
        </form>
        </Card>
    )
    }