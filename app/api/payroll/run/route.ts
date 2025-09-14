    import { NextRequest, NextResponse } from 'next/server'
    import { getServerSession } from 'next-auth'
    import { authOptions } from '@/lib/auth'
    import { runPayroll } from '@/lib/payroll'
    import { Role } from '@prisma/client'

    export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Only Admin and HR can run payroll
        if (session.user.role !== Role.ADMIN && session.user.role !== Role.HR) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()
        const { period } = body

        if (!period) {
        return NextResponse.json(
            { error: 'Period is required' },
            { status: 400 }
        )
        }

        const payrollDate = new Date(period)
        const payrollRun = await runPayroll(payrollDate)

        return NextResponse.json({
        payrollRun: {
            id: payrollRun.id,
            period: payrollRun.period,
            processed: payrollRun.processed,
            createdAt: payrollRun.createdAt,
        },
        })
    } catch (error) {
        console.error('Run payroll error:', error)
        return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
        )
    }
    }