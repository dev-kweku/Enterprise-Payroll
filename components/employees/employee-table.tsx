    'use client'

    import { useState, useEffect } from 'react'
    import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    } from '@/components/ui/table'
    import { Button } from '@/components/ui/button'
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
    import { Badge } from '@/components/ui/badge'
    import { MoreHorizontal, Edit, Trash2, UserPlus } from 'lucide-react'
    import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    } from '@/components/ui/dropdown-menu'
    import { Employee, User, Role } from '@prisma/client'

    interface EmployeeWithUser extends Employee {
    user: User
    }

    interface EmployeeTableProps {
    onAddEmployee?: () => void
    onEditEmployee?: (employee: EmployeeWithUser) => void
    }

    export function EmployeeTable({ onAddEmployee, onEditEmployee }: EmployeeTableProps) {
    const [employees, setEmployees] = useState<EmployeeWithUser[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchEmployees()
    }, [])

    const fetchEmployees = async () => {
        setIsLoading(true)
        try {
        const response = await fetch('/api/employees')
        if (response.ok) {
            const data = await response.json()
            setEmployees(data)
        } else {
            console.error('Failed to fetch employees')
        }
        } catch (error) {
        console.error('Error fetching employees:', error)
        } finally {
        setIsLoading(false)
        }
    }

    const getRoleBadgeColor = (role: Role) => {
        switch (role) {
        case Role.ADMIN:
            return 'bg-red-100 text-red-800'
        case Role.HR:
            return 'bg-blue-100 text-blue-800'
        case Role.MANAGER:
            return 'bg-green-100 text-green-800'
        case Role.EMPLOYEE:
            return 'bg-gray-100 text-gray-800'
        default:
            return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
            <CardTitle>Employees</CardTitle>
            <CardDescription>
                Manage your organization&apos;s employees
            </CardDescription>
            </div>
            <Button onClick={onAddEmployee}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Employee
            </Button>
        </CardHeader>
        <CardContent>
            {isLoading ? (
            <div className="flex justify-center py-8">Loading employees...</div>
            ) : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {employees.length === 0 ? (
                    <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                        No employees found
                    </TableCell>
                    </TableRow>
                ) : (
                    employees.map((employee) => (
                    <TableRow key={employee.id}>
                        <TableCell className="font-medium">
                        {employee.firstName} {employee.lastName}
                        </TableCell>
                        <TableCell>{employee.user.email}</TableCell>
                        <TableCell>{employee.department || '-'}</TableCell>
                        <TableCell>{employee.position || '-'}</TableCell>
                        <TableCell>
                        <Badge className={getRoleBadgeColor(employee.user.role)}>
                            {employee.user.role}
                        </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => onEditEmployee && onEditEmployee(employee)}
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))
                )}
                </TableBody>
            </Table>
            )}
        </CardContent>
        </Card>
    )
    }