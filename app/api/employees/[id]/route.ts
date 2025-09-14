    import { NextRequest, NextResponse } from 'next/server'
    import { getServerSession } from 'next-auth'
    import { authOptions } from '@/lib/auth'
    import { prisma } from '@/lib/db'
    import { employeeSchema } from '@/lib/validations/employees'
    import { Role } from '@prisma/client'

    export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
    ) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Admin and HR can view any employee
        // Managers can view their subordinates
        // Employees can view their own profile
        if (
        session.user.role !== Role.ADMIN &&
        session.user.role !== Role.HR &&
        session.user.employeeId !== params.id
        ) {
        // Check if the employee is a manager of the requested employee
        const isManager = await prisma.employee.findFirst({
            where: {
            id: params.id,
            managerId: session.user.employeeId,
            },
        })

        if (!isManager) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
        }

        const employee = await prisma.employee.findUnique({
        where: { id: params.id },
        include: {
            user: {
            select: {
                id: true,
                email: true,
                role: true,
            },
            },
            salary: true,
            manager: {
            select: {
                id: true,
                firstName: true,
                lastName: true,
            },
            },
            subordinates: {
            select: {
                id: true,
                firstName: true,
                lastName: true,
            },
            },
        },
        })

        if (!employee) {
        return NextResponse.json(
            { error: 'Employee not found' },
            { status: 404 }
        )
        }

        return NextResponse.json(employee)
    } catch (error) {
        console.error('Get employee error:', error)
        return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
        )
    }
    }

    export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
    ) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Only Admin and HR can update employees
        if (session.user.role !== Role.ADMIN && session.user.role !== Role.HR) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()
        const validatedData = employeeSchema.parse(body)

        // Check if employee exists
        const existingEmployee = await prisma.employee.findUnique({
        where: { id: params.id },
        include: { user: true },
        })

        if (!existingEmployee) {
        return NextResponse.json(
            { error: 'Employee not found' },
            { status: 404 }
        )
        }

        // Update employee
        const updatedEmployee = await prisma.employee.update({
        where: { id: params.id },
        data: {
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            ssnitNumber: validatedData.ssnitNumber,
            taxId: validatedData.taxId,
            bankName: validatedData.bankName,
            bankAccount: validatedData.bankAccount,
            department: validatedData.department,
            position: validatedData.position,
            hireDate: validatedData.hireDate,
            managerId: validatedData.managerId,
        },
        })

        // Update user email if changed
        if (validatedData.email !== existingEmployee.user.email) {
        // Check if new email is already in use
        const emailExists = await prisma.user.findUnique({
            where: { email: validatedData.email },
        })

        if (emailExists) {
            return NextResponse.json(
            { error: 'Email already in use' },
            { status: 400 }
            )
        }

        await prisma.user.update({
            where: { id: existingEmployee.userId },
            data: { email: validatedData.email },
        })
        }

        // Update salary if provided
        if (validatedData.salary) {
        if (existingEmployee.salary) {
            await prisma.salary.update({
            where: { employeeId: params.id },
            data: {
                baseSalary: validatedData.salary.baseSalary,
                allowances: validatedData.salary.allowances,
                deductions: validatedData.salary.deductions,
                tier2: validatedData.salary.tier2,
                tier3: validatedData.salary.tier3,
            },
            })
        } else {
            await prisma.salary.create({
            data: {
                employeeId: params.id,
                baseSalary: validatedData.salary.baseSalary,
                allowances: validatedData.salary.allowances,
                deductions: validatedData.salary.deductions,
                tier2: validatedData.salary.tier2,
                tier3: validatedData.salary.tier3,
            },
            })
        }
        }

        return NextResponse.json({
        employee: {
            id: updatedEmployee.id,
            firstName: updatedEmployee.firstName,
            lastName: updatedEmployee.lastName,
        },
        })
    } catch (error) {
        console.error('Update employee error:', error)
        return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
        )
    }
    }