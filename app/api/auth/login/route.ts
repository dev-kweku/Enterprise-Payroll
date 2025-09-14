    import { NextRequest, NextResponse } from 'next/server'
    import bcrypt from 'bcryptjs'
    import { prisma } from '@/lib/db'
    import { loginSchema } from '@/lib/validations/auth'

    export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password } = loginSchema.parse(body)

        const user = await prisma.user.findUnique({
        where: { email },
        include: { employee: true },
        })

        if (!user) {
        return NextResponse.json(
            { error: 'Invalid email or password' },
            { status: 401 }
        )
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

        if (!isPasswordValid) {
        return NextResponse.json(
            { error: 'Invalid email or password' },
            { status: 401 }
        )
        }

        return NextResponse.json({
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            employeeId: user.employee?.id,
        },
        })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
        )
    }
    }