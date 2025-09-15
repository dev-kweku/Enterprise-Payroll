/* eslint-disable @typescript-eslint/no-explicit-any */
    'use client'

    import { useState } from 'react'
    import { useForm } from 'react-hook-form'
    import { zodResolver } from '@hookform/resolvers/zod'
    import { leaveSchema } from '@/lib/validations/leave'
    import { Button } from '@/components/ui/button'
    import { Input } from '@/components/ui/input'
    import { Label } from '@/components/ui/label'
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
    import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    } from '@/components/ui/select'
    import { Textarea } from '@/components/ui/textarea'
    import { toast } from 'sonner'

    type LeaveFormValues = {
    type: 'ANNUAL' | 'SICK' | 'UNPAID' | 'MATERNITY' | 'PATERNITY'
    startDate: Date
    endDate: Date
    reason?: string
    }

    interface LeaveFormProps {
    onSuccess?: () => void
    }

    export function LeaveForm({ onSuccess }: LeaveFormProps) {
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<LeaveFormValues>({
        resolver: zodResolver(leaveSchema),
    })

    const leaveType = watch('type')

    const onSubmit = async (data: LeaveFormValues) => {
        setIsLoading(true)

        try {
        const response = await fetch('/api/leave/request', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Leave request failed')
        }

        toast.success('Leave request submitted',{
            description:'Your leave request has been submitted successfully'
        })

        if (onSuccess) {
            onSuccess()
        }

        reset()
        } catch (error) {
            toast.error('Leave request failed', {
                description: error instanceof Error ? error.message : 'Something went wrong',
            });
        } finally {
        setIsLoading(false)
        }
    }

    const getLeaveTypeDescription = (type: string) => {
        switch (type) {
        case 'ANNUAL':
            return 'Paid time off for vacation or personal reasons'
        case 'SICK':
            return 'Time off due to illness or medical reasons'
        case 'UNPAID':
            return 'Time off without pay'
        case 'MATERNITY':
            return 'Paid time off for childbirth and care'
        case 'PATERNITY':
            return 'Paid time off for new fathers'
        default:
            return ''
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
        <CardHeader>
            <CardTitle>Request Leave</CardTitle>
            <CardDescription>
            Submit a request for time off
            </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="type">Leave Type</Label>
                <Select onValueChange={(value) => setValue('type', value as any)}>
                <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ANNUAL">Annual Leave</SelectItem>
                    <SelectItem value="SICK">Sick Leave</SelectItem>
                    <SelectItem value="UNPAID">Unpaid Leave</SelectItem>
                    <SelectItem value="MATERNITY">Maternity Leave</SelectItem>
                    <SelectItem value="PATERNITY">Paternity Leave</SelectItem>
                </SelectContent>
                </Select>
                {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
                {leaveType && (
                <p className="text-sm text-gray-500">
                    {getLeaveTypeDescription(leaveType)}
                </p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                    id="startDate"
                    type="date"
                    {...register('startDate', { valueAsDate: true })}
                />
                {errors.startDate && (
                    <p className="text-sm text-red-500">{errors.startDate.message}</p>
                )}
                </div>
                <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                    id="endDate"
                    type="date"
                    {...register('endDate', { valueAsDate: true })}
                />
                {errors.endDate && (
                    <p className="text-sm text-red-500">{errors.endDate.message}</p>
                )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="reason">Reason (Optional)</Label>
                <Textarea
                id="reason"
                placeholder="Provide a reason for your leave request"
                {...register('reason')}
                />
                {errors.reason && (
                <p className="text-sm text-red-500">{errors.reason.message}</p>
                )}
            </div>
            </CardContent>
            <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Submitting request...' : 'Submit Request'}
            </Button>
            </CardFooter>
        </form>
        </Card>
    )
    }