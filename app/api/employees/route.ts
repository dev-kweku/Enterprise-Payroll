    import { NextRequest, NextResponse } from 'next/server'
    import { getServerSession } from 'next-auth'
    import { authOptions } from '@/lib/auth'
    import { prisma } from '@/lib/db'
    import { employeeSchema } from '@/lib/validations/employees'
    import { Role } from '@prisma/client'

    export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Only Admin and HR can view all employees
        if (session.user.role !== Role.ADMIN && session.user.role !== Role.HR) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const employees = await prisma.employee.findMany({
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
        },
        orderBy: {
            createdAt: 'desc',
        },
        })

        return NextResponse.json(employees)
    } catch (error) {
        console.error('Get employees error:', error)
        return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
        )
    }
    }

    export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Only Admin and HR can create employees
        if (session.user.role !== Role.ADMIN && session.user.role !== Role.HR) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()
        const validatedData = employeeSchema.parse(body)

        // Check if user with this email already exists
        const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
        })

        if (existingUser) {
        return NextResponse.json(
            { error: 'User with this email already exists' },
            { status: 400 }
        )
        }

        // Create user
        const user = await prisma.user.create({
        data: {
            email: validatedData.email,
            passwordHash: '', // Empty password, will be set during onboarding
            role: Role.EMPLOYEE,
        },
        })

        // Create employee
        const employee = await prisma.employee.create({
        data: {
            userId: user.id,
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

        // Create salary record if provided
        if (validatedData.salary) {
        await prisma.salary.create({
            data: {
            employeeId: employee.id,
            baseSalary: validatedData.salary.baseSalary,
            allowances: validatedData.salary.allowances,
            deductions: validatedData.salary.deductions,
            tier2: validatedData.salary.tier2,
            tier3: validatedData.salary.tier3,
            },
        })
        }

        return NextResponse.json({
        employee: {
            id: employee.id,
            userId: employee.userId,
            firstName: employee.firstName,
            lastName: employee.lastName,
        },
        })
    } catch (error) {
        console.error('Create employee error:', error)
        return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
        )
    }
    }