    'use client'

    import { useState } from 'react'
    import { EmployeeForm } from '@/components/employees/employees-form'
    import { EmployeeTable } from '@/components/employees/employee-table'
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
    import { Employee, User } from '@prisma/client'

    interface EmployeeWithUser extends Employee {
    user: User
    }

    export default function EmployeesPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingEmployee, setEditingEmployee] = useState<EmployeeWithUser | null>(null)

    const handleAddEmployee = () => {
        setEditingEmployee(null)
        setIsDialogOpen(true)
    }

    const handleEditEmployee = (employee: EmployeeWithUser) => {
        setEditingEmployee(employee)
        setIsDialogOpen(true)
    }

    const handleFormSuccess = () => {
        setIsDialogOpen(false)
        // Refresh the employee list
        window.location.reload()
    }

    return (
        <div>
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
            <p className="mt-2 text-sm text-gray-600">
            Add, edit, and manage employee information
            </p>
        </div>

        <EmployeeTable
            onAddEmployee={handleAddEmployee}
            onEditEmployee={handleEditEmployee}
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>
                {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                </DialogTitle>
            </DialogHeader>
            <EmployeeForm
                employee={editingEmployee || undefined}
                onSuccess={handleFormSuccess}
            />
            </DialogContent>
        </Dialog>
        </div>
    )
    }