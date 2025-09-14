    import { NextRequest, NextResponse } from 'next/server'
    import bcrypt from 'bcryptjs'
    import { prisma } from '@/lib/db'
    import { registerSchema } from '@/lib/validations/auth'
    import { Role } from '@prisma/client'

    export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password, firstName, lastName } = registerSchema.parse(body)

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
        where: { email },
        })

        if (existingUser) {
        return NextResponse.json(
            { error: 'User with this email already exists' },
            { status: 400 }
        )
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10)

        // Create user
        const user = await prisma.user.create({
        data: {
            email,
            passwordHash,
            role: Role.EMPLOYEE, // Default role
        },
        })

        // Create employee record
        const employee = await prisma.employee.create({
        data: {
            userId: user.id,
            firstName,
            lastName,
            ssnitNumber: '',
            taxId: '',
            bankName: '',
            bankAccount: '',
        },
        })

        return NextResponse.json({
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        employee: {
            id: employee.id,
            firstName: employee.firstName,
            lastName: employee.lastName,
        },
        })
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
        )
    }
    }