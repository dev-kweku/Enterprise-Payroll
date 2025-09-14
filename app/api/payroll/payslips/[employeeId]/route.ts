    import { NextRequest, NextResponse } from 'next/server'
    import { getServerSession } from 'next-auth'
    import { authOptions } from '@/lib/auth'
    import { prisma } from '@/lib/db'
    import { Role } from '@prisma/client'

    export async function GET(
    request: NextRequest,
    { params }: { params: { employeeId: string } }
    ) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Admin and HR can view any employee's payslips
        // Employees can only view their own payslips
        if (
        session.user.role !== Role.ADMIN &&
        session.user.role !== Role.HR &&
        session.user.employeeId !== params.employeeId
        ) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const payslips = await prisma.payslip.findMany({
        where: { employeeId: params.employeeId },
        include: {
            payrollRun: {
            select: {
                id: true,
                period: true,
                processed: true,
            },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        })

        return NextResponse.json(payslips)
    } catch (error) {
        console.error('Get payslips error:', error)
        return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
        )
    }
    }