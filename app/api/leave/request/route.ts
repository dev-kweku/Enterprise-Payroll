    import { NextRequest, NextResponse } from 'next/server'
    import { getServerSession } from 'next-auth'
    import { authOptions } from '@/lib/auth'
    import { prisma } from '@/lib/db'
    import { leaveSchema } from '@/lib/validations/leave'
    import { Role } from '@prisma/client'

    export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // All authenticated users can request leave
        if (!session.user.employeeId) {
        return NextResponse.json(
            { error: 'Employee profile not found' },
            { status: 404 }
        )
        }

        const body = await request.json()
        const validatedData = leaveSchema.parse(body)

        // Create leave request
        const leave = await prisma.leave.create({
        data: {
            employeeId: session.user.employeeId,
            type: validatedData.type,
            startDate: validatedData.startDate,
            endDate: validatedData.endDate,
            reason: validatedData.reason,
            status: 'PENDING',
        },
        })

        return NextResponse.json({
        leave: {
            id: leave.id,
            type: leave.type,
            startDate: leave.startDate,
            endDate: leave.endDate,
            status: leave.status,
            createdAt: leave.createdAt,
        },
        })
    } catch (error) {
        console.error('Request leave error:', error)
        return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
        )
    }
    }