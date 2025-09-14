    'use client'

    import { useState } from 'react'
    import { useForm } from 'react-hook-form'
    import { zodResolver } from '@hookform/resolvers/zod'
    import { employeeSchema } from '@/lib/validations/employees'
    import { Button } from '@/components/ui/button'
    import { Input } from '@/components/ui/input'
    import { Label } from '@/components/ui/label'
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
    import { toast } from 'sonner'
    import { Employee } from '@prisma/client'

    type EmployeeFormValues = {
    firstName: string
    lastName: string
    email: string
    ssnitNumber: string
    taxId: string
    bankName: string
    bankAccount: string
    department?: string
    position?: string
    hireDate?: Date
    managerId?: string
    salary?: {
        baseSalary: number
        allowances: number
        deductions: number
        tier2: number
        tier3: number
    }
    }

    interface EmployeeFormProps {
    employee?: Employee
    onSuccess?: () => void
    }

    export function EmployeeForm({ employee, onSuccess }: EmployeeFormProps) {
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<EmployeeFormValues>({
        resolver: zodResolver(employeeSchema),
        defaultValues: employee
        ? {
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: '', // Will be fetched separately
            ssnitNumber: employee.ssnitNumber,
            taxId: employee.taxId,
            bankName: employee.bankName,
            bankAccount: employee.bankAccount,
            department: employee.department || '',
            position: employee.position || '',
            hireDate: employee.hireDate ? new Date(employee.hireDate) : undefined,
            managerId: employee.managerId || '',
            }
        : {},
    })

    const onSubmit = async (data: EmployeeFormValues) => {
        setIsLoading(true)

        try {
        const url = employee ? `/api/employees/${employee.id}` : '/api/employees'
        const method = employee ? 'PUT' : 'POST'

        const response = await fetch(url, {
            method,
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Operation failed')
        }
        
        toast.success(employee ? 'Employee updated' : 'Employee created', {
            description: employee
                ? 'Employee information has been updated successfully'
                : 'New employee has been created successfully',
            })

        if (onSuccess) {
            onSuccess()
        }

        if (!employee) {
            reset()
        }
        } catch (error) {
            toast.error('Operation failed', {
                description: error instanceof Error ? error.message : 'Something went wrong',
                })
        } finally {
        setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>{employee ? 'Edit Employee' : 'Add New Employee'}</CardTitle>
            <CardDescription>
            {employee
                ? 'Update employee information below'
                : 'Fill in the details to add a new employee'}
            </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
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

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="ssnitNumber">SSNIT Number</Label>
                <Input
                    id="ssnitNumber"
                    placeholder="SSNIT number"
                    {...register('ssnitNumber')}
                />
                {errors.ssnitNumber && (
                    <p className="text-sm text-red-500">{errors.ssnitNumber.message}</p>
                )}
                </div>
                <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID</Label>
                <Input
                    id="taxId"
                    placeholder="Tax ID"
                    {...register('taxId')}
                />
                {errors.taxId && (
                    <p className="text-sm text-red-500">{errors.taxId.message}</p>
                )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                    id="bankName"
                    placeholder="Bank name"
                    {...register('bankName')}
                />
                {errors.bankName && (
                    <p className="text-sm text-red-500">{errors.bankName.message}</p>
                )}
                </div>
                <div className="space-y-2">
                <Label htmlFor="bankAccount">Bank Account</Label>
                <Input
                    id="bankAccount"
                    placeholder="Bank account number"
                    {...register('bankAccount')}
                />
                {errors.bankAccount && (
                    <p className="text-sm text-red-500">{errors.bankAccount.message}</p>
                )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                    id="department"
                    placeholder="Department"
                    {...register('department')}
                />
                {errors.department && (
                    <p className="text-sm text-red-500">{errors.department.message}</p>
                )}
                </div>
                <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                    id="position"
                    placeholder="Position"
                    {...register('position')}
                />
                {errors.position && (
                    <p className="text-sm text-red-500">{errors.position.message}</p>
                )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="hireDate">Hire Date</Label>
                <Input
                    id="hireDate"
                    type="date"
                    {...register('hireDate', { valueAsDate: true })}
                />
                {errors.hireDate && (
                    <p className="text-sm text-red-500">{errors.hireDate.message}</p>
                )}
                </div>
                <div className="space-y-2">
                <Label htmlFor="managerId">Manager</Label>
                <Input
                    id="managerId"
                    placeholder="Manager ID"
                    {...register('managerId')}
                />
                {errors.managerId && (
                    <p className="text-sm text-red-500">{errors.managerId.message}</p>
                )}
                </div>
            </div>

            {!employee && (
                <div className="space-y-4">
                <h3 className="text-lg font-medium">Salary Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label htmlFor="baseSalary">Base Salary</Label>
                    <Input
                        id="baseSalary"
                        type="number"
                        placeholder="0.00"
                        {...register('salary.baseSalary', { valueAsNumber: true })}
                    />
                    {errors.salary?.baseSalary && (
                        <p className="text-sm text-red-500">
                        {errors.salary.baseSalary.message}
                        </p>
                    )}
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="allowances">Allowances</Label>
                    <Input
                        id="allowances"
                        type="number"
                        placeholder="0.00"
                        {...register('salary.allowances', { valueAsNumber: true })}
                    />
                    {errors.salary?.allowances && (
                        <p className="text-sm text-red-500">
                        {errors.salary.allowances.message}
                        </p>
                    )}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label htmlFor="deductions">Deductions</Label>
                    <Input
                        id="deductions"
                        type="number"
                        placeholder="0.00"
                        {...register('salary.deductions', { valueAsNumber: true })}
                    />
                    {errors.salary?.deductions && (
                        <p className="text-sm text-red-500">
                        {errors.salary.deductions.message}
                        </p>
                    )}
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="tier2">Tier 2</Label>
                    <Input
                        id="tier2"
                        type="number"
                        placeholder="0.00"
                        {...register('salary.tier2', { valueAsNumber: true })}
                    />
                    {errors.salary?.tier2 && (
                        <p className="text-sm text-red-500">
                        {errors.salary.tier2.message}
                        </p>
                    )}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label htmlFor="tier3">Tier 3</Label>
                    <Input
                        id="tier3"
                        type="number"
                        placeholder="0.00"
                        {...register('salary.tier3', { valueAsNumber: true })}
                    />
                    {errors.salary?.tier3 && (
                        <p className="text-sm text-red-500">
                        {errors.salary.tier3.message}
                        </p>
                    )}
                    </div>
                </div>
                </div>
            )}
            </CardContent>
            <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                ? employee
                    ? 'Updating employee...'
                    : 'Creating employee...'
                : employee
                ? 'Update Employee'
                : 'Create Employee'}
            </Button>
            </CardFooter>
        </form>
        </Card>
    )
    }